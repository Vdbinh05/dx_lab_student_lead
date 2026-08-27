"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  getIncidentById,
  getMissionById,
  getOralDefenseQuestions,
  getWeeklyQuiz,
  getWeek,
} from "@/lib/curriculum";
import {
  assistanceInputSchema,
  bookmarkInputSchema,
  evidenceInputSchema,
  formDataObject,
  incidentInputSchema,
  missionBlockerInputSchema,
  missionIdSchema,
  missionNoteInputSchema,
  missionStepInputSchema,
  oralReflectionInputSchema,
  settingsInputSchema,
  weekNumberSchema,
} from "@/lib/action-validation";
import { importLearnerBackup, parseLearnerBackup } from "@/lib/backup";
import {
  calculateQuizScore,
  evaluateBossFight,
  parseCompletedSteps,
} from "@/lib/progress-engine";
import {
  recomputeIncidentSkills,
  recomputeMission,
  requireMission,
  commitWeekGate,
  isWeekUnlockedForPass,
} from "@/lib/training-state";

export type FormActionState = {
  ok: boolean;
  message: string;
};

function expectedActionError(error: unknown): FormActionState {
  if (error instanceof z.ZodError)
    return {
      ok: false,
      message: `Dữ liệu không hợp lệ: ${error.issues[0]?.message ?? "hãy kiểm tra form"}`,
    };
  if (
    error instanceof Error &&
    /^(Mission|Cần PASS prerequisite|Quiz payload|Week|Incident|Backup|Bookmark|Oral)/.test(
      error.message,
    )
  )
    return { ok: false, message: error.message };
  console.error(error);
  return {
    ok: false,
    message: "Không thể lưu dữ liệu. Hãy kiểm tra form và thử lại.",
  };
}

function refreshMission(missionId: string) {
  const mission = getMissionById(missionId);
  if (mission)
    revalidatePath(
      `/learn/week-${String(mission.week).padStart(2, "0")}/${mission.slug}`,
    );
  for (const path of [
    "/",
    "/today",
    "/roadmap",
    "/skills",
    "/evidence",
    "/exams",
    "/readiness",
  ])
    revalidatePath(path);
}

async function assertMissionMutable(missionId: string) {
  const mission = requireMission(missionId);
  if (!(await isWeekUnlockedForPass(mission.week)))
    throw new Error(
      `Week ${mission.week} chỉ AVAILABLE TO READ; cần PASS Week ${mission.week - 1} gate trước khi lưu progress`,
    );
  const [progress, prerequisites] = await Promise.all([
    db.missionProgress.findUnique({ where: { missionId } }),
    db.missionProgress.findMany({
      where: { missionId: { in: mission.prerequisites } },
    }),
  ]);
  const passedPrerequisites = new Set(
    prerequisites
      .filter((item) => item.status === "PASSED")
      .map((item) => item.missionId),
  );
  const unmetPrerequisite = mission.prerequisites.find(
    (id) => !passedPrerequisites.has(id),
  );
  if (unmetPrerequisite)
    throw new Error(`Cần PASS prerequisite ${unmetPrerequisite} trước`);
  if (progress?.status === "PASSED" || progress?.hardGatePassed)
    throw new Error("Mission đã PASS và không thể sửa progress trực tiếp");
  return { mission, progress };
}

export async function startMission(rawMissionId: string) {
  const missionId = missionIdSchema.parse(rawMissionId);
  const { progress } = await assertMissionMutable(missionId);
  if (progress && progress.status !== "NOT_STARTED")
    throw new Error(
      "Mission đã được bắt đầu; không thể dùng start để xóa trạng thái hiện tại",
    );
  await db.missionProgress.upsert({
    where: { missionId },
    update: { status: "IN_PROGRESS", startedAt: new Date() },
    create: { missionId, status: "IN_PROGRESS", startedAt: new Date() },
  });
  await recomputeMission(missionId);
  refreshMission(missionId);
}

export async function toggleMissionStep(rawMissionId: string, rawStep: string) {
  const { missionId, step } = missionStepInputSchema.parse({
    missionId: rawMissionId,
    step: rawStep,
  });
  const { progress } = await assertMissionMutable(missionId);
  const steps = new Set(parseCompletedSteps(progress?.completedSteps));
  if (steps.has(step)) steps.delete(step);
  else steps.add(step);
  await db.missionProgress.upsert({
    where: { missionId },
    update: {
      completedSteps: JSON.stringify([...steps]),
      startedAt: progress?.startedAt ?? new Date(),
      status: progress?.status === "BLOCKED" ? "BLOCKED" : "IN_PROGRESS",
    },
    create: {
      missionId,
      completedSteps: JSON.stringify([...steps]),
      startedAt: new Date(),
      status: "IN_PROGRESS",
    },
  });
  await recomputeMission(missionId);
  refreshMission(missionId);
}

export async function reportMissionBlocker(formData: FormData) {
  const parsed = missionBlockerInputSchema.parse(formDataObject(formData));
  await assertMissionMutable(parsed.missionId);
  await db.missionProgress.upsert({
    where: { missionId: parsed.missionId },
    update: { status: "BLOCKED", notes: parsed.notes },
    create: {
      missionId: parsed.missionId,
      status: "BLOCKED",
      notes: parsed.notes,
      startedAt: new Date(),
    },
  });
  refreshMission(parsed.missionId);
}

export async function reportMissionBlockerFormAction(
  _previous: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  try {
    await reportMissionBlocker(formData);
    return { ok: true, message: "Blocker đã được ghi nhận." };
  } catch (error) {
    return expectedActionError(error);
  }
}

export async function clearMissionBlocker(rawMissionId: string) {
  const missionId = missionIdSchema.parse(rawMissionId);
  requireMission(missionId);
  const progress = await db.missionProgress.findUnique({
    where: { missionId },
  });
  if (!progress || progress.status !== "BLOCKED")
    throw new Error("Mission không có blocker đang hoạt động");
  await db.missionProgress.update({
    where: { missionId },
    data: { status: "IN_PROGRESS", notes: null },
  });
  await recomputeMission(missionId);
  refreshMission(missionId);
}

export async function saveEvidence(formData: FormData) {
  const raw = formDataObject(formData);
  delete raw.skillId;
  const parsed = evidenceInputSchema.parse(raw);
  const { mission, progress } = await assertMissionMutable(parsed.missionId);
  const steps = new Set(parseCompletedSteps(progress?.completedSteps));
  steps.add("evidence");
  await db.$transaction([
    db.evidence.create({
      data: {
        ...parsed,
        skillId: mission.skillId,
        url: parsed.url || null,
      },
    }),
    db.missionProgress.upsert({
      where: { missionId: parsed.missionId },
      update: { completedSteps: JSON.stringify([...steps]) },
      create: {
        missionId: parsed.missionId,
        status: "IN_PROGRESS",
        startedAt: new Date(),
        completedSteps: JSON.stringify([...steps]),
      },
    }),
  ]);
  await recomputeMission(parsed.missionId);
  refreshMission(parsed.missionId);
}

export async function saveEvidenceFormAction(
  _previous: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  try {
    await saveEvidence(formData);
    return { ok: true, message: "Evidence đã được lưu và gate đã tính lại." };
  } catch (error) {
    return expectedActionError(error);
  }
}

export async function submitQuiz(rawMissionId: string, formData: FormData) {
  const missionId = missionIdSchema.parse(rawMissionId);
  const { mission, progress } = await assertMissionMutable(missionId);
  const allowedQuestionIds = new Set(
    mission.quiz.map((question) => question.id),
  );
  const rawAnswers = formDataObject(formData);
  for (const key of Object.keys(rawAnswers))
    if (!allowedQuestionIds.has(key))
      throw new Error("Quiz payload không hợp lệ");
  const answers: Record<string, string> = {};
  for (const question of mission.quiz)
    answers[question.id] = z
      .string()
      .trim()
      .max(5000)
      .catch("")
      .parse(rawAnswers[question.id]);
  const score = calculateQuizScore(mission.quiz, answers);
  const passed = score >= mission.quizPassScore;
  const steps = new Set(parseCompletedSteps(progress?.completedSteps));
  if (passed) steps.add("quiz");
  await db.$transaction([
    db.quizAttempt.create({
      data: {
        quizId: `${missionId}-quiz`,
        missionId,
        score,
        passed,
        answers: JSON.stringify(answers),
      },
    }),
    db.missionProgress.upsert({
      where: { missionId },
      update: { completedSteps: JSON.stringify([...steps]), score },
      create: {
        missionId,
        status: "IN_PROGRESS",
        startedAt: new Date(),
        completedSteps: JSON.stringify([...steps]),
        score,
      },
    }),
  ]);
  await recomputeMission(missionId);
  refreshMission(missionId);
  return { score, passed };
}

export async function submitQuizFormAction(
  missionId: string,
  _previous: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  try {
    const result = await submitQuiz(missionId, formData);
    return {
      ok: result.passed,
      message: `Quiz ${result.score}% · ${result.passed ? "PASS" : "chưa đạt ngưỡng"}.`,
    };
  } catch (error) {
    return expectedActionError(error);
  }
}

export async function attemptMissionGate(rawMissionId: string) {
  const missionId = missionIdSchema.parse(rawMissionId);
  await assertMissionMutable(missionId);
  const gate = await recomputeMission(missionId, { commitHardGate: true });
  refreshMission(missionId);
  if (gate.passed) redirect("/today");
}

const assistanceRank = { NONE: 0, HINT_1: 1, HINT_2: 2, SOLUTION: 3 } as const;

export async function recordIncidentAssistance(
  rawIncidentId: string,
  rawLevel: string,
) {
  const { incidentId, level } = assistanceInputSchema.parse({
    incidentId: rawIncidentId,
    level: rawLevel,
  });
  const definition = getIncidentById(incidentId);
  if (!definition) throw new Error("Incident không tồn tại");
  if (!(await isWeekUnlockedForPass(definition.week)))
    throw new Error(
      "Week " +
        definition.week +
        " chỉ AVAILABLE TO READ; previous week gate chưa PASS",
    );
  const current = await db.incidentAssistance.findUnique({
    where: { incidentId },
  });
  const currentLevel =
    (current?.level as keyof typeof assistanceRank | undefined) ?? "NONE";
  const nextLevel =
    assistanceRank[level] > assistanceRank[currentLevel] ? level : currentLevel;
  await db.incidentAssistance.upsert({
    where: { incidentId },
    update: { level: nextLevel },
    create: { incidentId, level: nextLevel },
  });
  revalidatePath(`/incidents/${incidentId}`);
}

export async function submitIncident(formData: FormData) {
  const value = incidentInputSchema.parse(formDataObject(formData));
  const definition = getIncidentById(value.incidentId);
  if (!definition) throw new Error("Incident không tồn tại");
  if (!(await isWeekUnlockedForPass(definition.week)))
    throw new Error(
      `Week ${definition.week} chỉ AVAILABLE TO READ; previous week gate chưa PASS`,
    );
  const assistance = await db.incidentAssistance.findUnique({
    where: { incidentId: value.incidentId },
  });
  const assistanceLevel =
    (assistance?.level as "NONE" | "HINT_1" | "HINT_2" | "SOLUTION") ?? "NONE";
  const result = evaluateBossFight({ ...value, assistanceLevel }, definition);
  await db.$transaction([
    db.incidentAttempt.create({
      data: {
        ...value,
        assisted: result.assisted,
        assistanceLevel,
        passed: result.passed,
      },
    }),
    db.incidentAssistance.deleteMany({
      where: { incidentId: value.incidentId },
    }),
  ]);
  await recomputeIncidentSkills(value.incidentId);
  for (const path of [
    "/incidents",
    `/incidents/${value.incidentId}`,
    "/readiness",
    "/skills",
    "/exams",
    "/",
  ])
    revalidatePath(path);
  return result;
}

export async function submitIncidentFormAction(
  _previous: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  try {
    const result = await submitIncident(formData);
    return {
      ok: result.passed,
      message: result.passed
        ? "Boss Fight CLEAN PASS."
        : result.assisted
          ? "Attempt đã lưu là ASSISTED / FAIL; không được tính clean PASS."
          : "Attempt đã lưu nhưng chưa đủ điều kiện CLEAN PASS.",
    };
  } catch (error) {
    return expectedActionError(error);
  }
}

export async function updateSettings(formData: FormData) {
  const raw = formDataObject(formData);
  const parsed = settingsInputSchema.parse({
    dailyStudyMinutes: raw.dailyStudyMinutes,
    acceleratedMode: raw.acceleratedMode === "on",
  });
  await db.appSettings.upsert({
    where: { id: "local-settings" },
    update: parsed,
    create: { id: "local-settings", ...parsed },
  });
  revalidatePath("/settings");
  revalidatePath("/");
  revalidatePath("/today");
}

export async function updateSettingsFormAction(
  _previous: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  try {
    await updateSettings(formData);
    return { ok: true, message: "Lịch học đã lưu; mọi gate vẫn giữ nguyên." };
  } catch (error) {
    return expectedActionError(error);
  }
}

export async function saveMissionNoteFormAction(
  _previous: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  try {
    const parsed = missionNoteInputSchema.parse(formDataObject(formData));
    requireMission(parsed.missionId);
    await db.missionNote.upsert({
      where: { missionId: parsed.missionId },
      update: { content: parsed.content },
      create: parsed,
    });
    refreshMission(parsed.missionId);
    return { ok: true, message: "Mission note đã lưu." };
  } catch (error) {
    return expectedActionError(error);
  }
}

export async function toggleBookmark(formData: FormData) {
  const parsed = bookmarkInputSchema.parse(formDataObject(formData));
  if (parsed.targetType === "mission") requireMission(parsed.targetId);
  if (parsed.targetType === "incident" && !getIncidentById(parsed.targetId))
    throw new Error("Bookmark incident không tồn tại");
  if (parsed.targetType === "lab") {
    const [missionId, kind] = parsed.targetId.split(":");
    requireMission(missionId);
    if (!['guided', 'independent', 'integration'].includes(kind ?? ""))
      throw new Error("Bookmark lab không hợp lệ");
  }
  const existing = await db.bookmark.findUnique({
    where: {
      targetType_targetId: {
        targetType: parsed.targetType,
        targetId: parsed.targetId,
      },
    },
  });
  if (existing) await db.bookmark.delete({ where: { id: existing.id } });
  else await db.bookmark.create({ data: parsed });
  revalidatePath("/bookmarks");
  revalidatePath("/roadmap");
  if (parsed.targetType === "mission") refreshMission(parsed.targetId);
  if (parsed.targetType === "lab") {
    const missionId = parsed.targetId.split(":")[0];
    if (missionId) refreshMission(missionId);
  }
  if (parsed.targetType === "incident")
    revalidatePath(`/incidents/${parsed.targetId}`);
}

export async function submitWeeklyQuiz(
  rawWeek: number,
  formData: FormData,
) {
  const week = weekNumberSchema.parse(rawWeek);
  const definition = getWeek(week);
  if (!definition) throw new Error("Week không tồn tại");
  if (!(await isWeekUnlockedForPass(week)))
    throw new Error(`Week ${week} chưa unlock để PASS`);
  const questions = getWeeklyQuiz(week);
  if (questions.length < 20) throw new Error("Week quiz chưa hoàn chỉnh");
  const allowedQuestionIds = new Set(questions.map((question) => question.id));
  const rawAnswers = formDataObject(formData);
  for (const key of Object.keys(rawAnswers))
    if (!allowedQuestionIds.has(key))
      throw new Error("Quiz payload không hợp lệ");
  const answers: Record<string, string> = {};
  for (const question of questions)
    answers[question.id] = z
      .string()
      .trim()
      .max(5000)
      .catch("")
      .parse(rawAnswers[question.id]);
  const score = calculateQuizScore(questions, answers);
  const passed = score >= definition.weeklyQuizPassScore;
  await db.quizAttempt.create({
    data: {
      quizId: `${definition.slug}-weekly`,
      missionId: definition.slug,
      score,
      passed,
      answers: JSON.stringify(answers),
    },
  });
  revalidatePath(`/weeks/${week}/review`);
  revalidatePath("/roadmap");
  return { score, passed };
}

export async function submitWeeklyQuizFormAction(
  week: number,
  _previous: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  try {
    const result = await submitWeeklyQuiz(week, formData);
    return {
      ok: result.passed,
      message: `Weekly quiz ${result.score}% · ${result.passed ? "PASS" : "chưa đạt ngưỡng"}.`,
    };
  } catch (error) {
    return expectedActionError(error);
  }
}

export async function attemptWeekGate(rawWeek: number) {
  const week = weekNumberSchema.parse(rawWeek);
  const result = await commitWeekGate(week);
  for (const path of ["/", "/today", "/roadmap", `/weeks/${week}/review`, "/readiness"])
    revalidatePath(path);
  if (result.passed) redirect(week < 8 ? `/weeks/${week + 1}` : "/readiness");
}

export async function importBackupFormAction(
  _previous: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  try {
    const raw = z
      .object({
        confirmation: z.literal("IMPORT LEARNER BACKUP"),
        backup: z.string().min(10).max(4_000_000),
      })
      .strict()
      .parse(formDataObject(formData));
    const backup = parseLearnerBackup(raw.backup);
    await importLearnerBackup(db, backup);
    for (const path of [
      "/",
      "/today",
      "/roadmap",
      "/skills",
      "/evidence",
      "/incidents",
      "/readiness",
      "/settings",
    ])
      revalidatePath(path);
    return { ok: true, message: "Backup đã được validate và import thành công." };
  } catch (error) {
    return expectedActionError(error);
  }
}

export async function saveOralReflectionFormAction(
  _previous: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  try {
    const raw = formDataObject(formData);
    const parsed = oralReflectionInputSchema.parse({
      ...raw,
      confident: raw.confident === "on",
    });
    const question = getOralDefenseQuestions().find(
      (item) => item.id === parsed.questionId,
    );
    if (!question || question.group !== parsed.group)
      throw new Error("Oral question không tồn tại");
    await db.oralReflection.create({ data: parsed });
    revalidatePath("/oral-defense");
    return { ok: true, message: "Oral-defense reflection đã lưu." };
  } catch (error) {
    return expectedActionError(error);
  }
}
