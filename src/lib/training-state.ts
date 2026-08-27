import { db } from "@/lib/db";
import {
  getAllMissions,
  getIncidentById,
  getMissionById,
  getWeek,
} from "@/lib/curriculum";
import {
  calculateMissionGate,
  calculateSkillLevel,
  parseCompletedSteps,
} from "@/lib/progress-engine";
import type { WeekGateResult } from "@/lib/types";

export function requireMission(missionId: string) {
  const mission = getMissionById(missionId);
  if (!mission) throw new Error("Mission không tồn tại trong curriculum");
  return mission;
}

export function affectedSkillsForMission(missionId: string) {
  const mission = requireMission(missionId);
  const skills = new Set([mission.skillId]);
  if (/troubleshoot|failure|incident|debug/i.test(mission.roadmapCompetency))
    skills.add("troubleshooting");
  if (mission.week >= 4) skills.add("system-integration");
  return [...skills];
}

export function isWeekProgressionUnlocked(
  week: number,
  previousWeekGatePassed: boolean,
) {
  return week <= 1 || previousWeekGatePassed;
}

export async function isWeekUnlockedForPass(week: number) {
  if (week <= 1) return true;
  const previous = await db.weeklyProgress.findUnique({ where: { week: week - 1 } });
  return isWeekProgressionUnlocked(week, previous?.hardGatePassed === true);
}

export type WeekGateSignals = {
  week: number;
  missionPassed: number;
  missionTotal: number;
  quizScore: number | null;
  quizPassScore: number;
  bossFightPassed: boolean;
  previousWeekGatePassed: boolean;
  evidenceCount: number;
};

export function evaluateWeekGateState(
  signals: WeekGateSignals,
): WeekGateResult {
  const blockers: string[] = [];
  if (signals.missionPassed !== signals.missionTotal)
    blockers.push(
      `Missions: ${signals.missionPassed}/${signals.missionTotal} PASS`,
    );
  if (
    signals.quizScore === null ||
    signals.quizScore < signals.quizPassScore
  )
    blockers.push(
      `Weekly quiz: ${signals.quizScore ?? 0}/${signals.quizPassScore}`,
    );
  if (!signals.bossFightPassed)
    blockers.push("Boss Fight chưa có CLEAN PASS");
  if (signals.week > 1 && !signals.previousWeekGatePassed)
    blockers.push(`Week ${signals.week - 1} gate chưa PASS`);
  return {
    passed: blockers.length === 0,
    eligible: blockers.length === 0,
    blockers,
    missionPassed: signals.missionPassed,
    missionTotal: signals.missionTotal,
    quizScore: signals.quizScore,
    bossFightPassed: signals.bossFightPassed,
    evidenceCount: signals.evidenceCount,
  };
}

export async function recomputeMission(
  missionId: string,
  options: { commitHardGate?: boolean } = {},
) {
  const mission = requireMission(missionId);
  const [progress, evidence, quizzes] = await Promise.all([
    db.missionProgress.findUnique({ where: { missionId } }),
    db.evidence.findMany({ where: { missionId } }),
    db.quizAttempt.findMany({
      where: { missionId },
      orderBy: { score: "desc" },
    }),
  ]);
  const completedSteps = parseCompletedSteps(progress?.completedSteps);
  const bestQuizScore = quizzes[0]?.score ?? null;
  const hardGateSatisfied = mission.hardGate
    ? options.commitHardGate === true || progress?.hardGatePassed === true
    : true;
  const gate = calculateMissionGate({
    completedSteps,
    requiredEvidence: mission.requiredEvidence,
    evidenceTypes: evidence.map((item) => item.type),
    quizScore: bestQuizScore,
    quizPassScore: mission.quizPassScore,
    hardGateRequired: mission.hardGate,
    hardGateSatisfied,
  });
  const commitSucceeded = options.commitHardGate === true && gate.passed;
  const nextHardGatePassed =
    progress?.hardGatePassed === true || commitSucceeded || !mission.hardGate;
  const status =
    progress?.status === "BLOCKED"
      ? "BLOCKED"
      : gate.status === "NOT_STARTED" && progress?.startedAt
        ? "IN_PROGRESS"
        : gate.status;
  await db.missionProgress.upsert({
    where: { missionId },
    update: {
      status,
      hardGatePassed: nextHardGatePassed,
      completedAt: status === "PASSED" ? (progress?.completedAt ?? new Date()) : null,
      score: bestQuizScore,
    },
    create: {
      missionId,
      status,
      hardGatePassed: nextHardGatePassed,
      completedSteps: JSON.stringify(completedSteps),
      startedAt: new Date(),
      completedAt: status === "PASSED" ? new Date() : null,
      score: bestQuizScore,
    },
  });
  for (const skillId of affectedSkillsForMission(missionId))
    await recomputeSkill(skillId);
  return gate;
}

export async function recomputeSkill(skillId: string) {
  const missions = getAllMissions().filter((mission) => mission.skillId === skillId);
  const missionIds = missions.map((mission) => mission.id);
  const weeks = [...new Set(missions.map((mission) => mission.week))];
  const incidentIds = weeks
    .map((week) => getWeek(week)?.bossFightId)
    .filter((id): id is string => Boolean(id));
  const [progress, evidence, quizzes, incidents, existing] = await Promise.all([
    db.missionProgress.findMany({ where: { missionId: { in: missionIds } } }),
    db.evidence.findMany({
      where: { OR: [{ skillId }, { missionId: { in: missionIds } }] },
    }),
    db.quizAttempt.findMany({ where: { missionId: { in: missionIds } } }),
    db.incidentAttempt.findMany({
      where: { incidentId: { in: incidentIds }, passed: true, assisted: false },
    }),
    db.skillProgress.findUnique({ where: { id: skillId } }),
  ]);
  const progressByMission = new Map(
    progress.map((item) => [
      item.missionId,
      new Set(parseCompletedSteps(item.completedSteps)),
    ]),
  );
  const quizPassedFor = (missionId: string, passScore: number) =>
    quizzes.some(
      (attempt) => attempt.missionId === missionId && attempt.score >= passScore,
    );
  const theoryComplete = missions.some((mission) =>
    progressByMission.get(mission.id)?.has("learn"),
  );
  const levelTwoMission = missions.find((mission) => {
    const steps = progressByMission.get(mission.id);
    return (
      steps?.has("learn") &&
      steps.has("practice") &&
      quizPassedFor(mission.id, mission.quizPassScore)
    );
  });
  const levelThreeMission = missions.find((mission) => {
    const steps = progressByMission.get(mission.id);
    return (
      steps?.has("learn") &&
      steps.has("practice") &&
      steps.has("build") &&
      quizPassedFor(mission.id, mission.quizPassScore) &&
      evidence.some((item) => item.missionId === mission.id)
    );
  });
  const relevantIncident = incidents[0];
  const level = calculateSkillLevel({
    theoryComplete,
    guidedLabComplete: Boolean(levelTwoMission),
    quizPassed: Boolean(levelTwoMission),
    independentLabComplete: Boolean(levelThreeMission),
    evidenceCount: evidence.length,
    incidentPassed: incidents.length > 0,
    bossFightPassed: incidents.length > 0,
    explanationEvidence: evidence.some((item) => item.type === "explanation"),
    fixEvidence: Boolean(relevantIncident?.fix.trim()),
    verificationEvidence: Boolean(relevantIncident?.verification.trim()),
    regressionEvidence: Boolean(relevantIncident?.regression.trim()),
  });
  await db.skillProgress.upsert({
    where: { id: skillId },
    update: { currentLevel: level, evidenceCount: evidence.length },
    create: {
      id: skillId,
      currentLevel: level,
      targetLevel: existing?.targetLevel ?? 3,
      evidenceCount: evidence.length,
    },
  });
}

export async function recomputeIncidentSkills(incidentId: string) {
  const incident = getIncidentById(incidentId);
  if (!incident) throw new Error("Incident không tồn tại trong curriculum");
  const skills = new Set(
    getAllMissions()
      .filter((mission) => mission.week === incident.week)
      .map((mission) => mission.skillId),
  );
  skills.add("troubleshooting");
  for (const skillId of skills) await recomputeSkill(skillId);
}

export async function calculateWeekGateState(week: number): Promise<WeekGateResult> {
  const definition = getWeek(week);
  if (!definition) throw new Error("Week không tồn tại");
  const missions = getAllMissions().filter((mission) => mission.week === week);
  const missionIds = missions.map((mission) => mission.id);
  const [progress, weeklyAttempts, incidents, evidenceCount] = await Promise.all([
    db.missionProgress.findMany({ where: { missionId: { in: missionIds } } }),
    db.quizAttempt.findMany({
      where: { quizId: `${definition.slug}-weekly` },
      orderBy: { score: "desc" },
    }),
    db.incidentAttempt.findMany({
      where: {
        incidentId: definition.bossFightId,
        passed: true,
        assisted: false,
      },
    }),
    db.evidence.count({ where: { missionId: { in: missionIds } } }),
  ]);
  const missionPassed = missions.filter((mission) =>
    progress.some(
      (row) => row.missionId === mission.id && row.status === "PASSED",
    ),
  ).length;
  const quizScore = weeklyAttempts[0]?.score ?? null;
  const bossFightPassed = incidents.length > 0;
  return evaluateWeekGateState({
    week,
    missionPassed,
    missionTotal: missions.length,
    quizScore,
    quizPassScore: definition.weeklyQuizPassScore,
    bossFightPassed,
    previousWeekGatePassed:
      week <= 1 || (await isWeekUnlockedForPass(week)),
    evidenceCount,
  });
}

export async function commitWeekGate(week: number) {
  const state = await calculateWeekGateState(week);
  if (!state.eligible) return state;
  await db.weeklyProgress.upsert({
    where: { week },
    update: { hardGatePassed: true, passedAt: new Date() },
    create: { week, hardGatePassed: true, passedAt: new Date() },
  });
  await db.appSettings.upsert({
    where: { id: "local-settings" },
    update: { currentWeek: Math.min(8, week + 1) },
    create: { id: "local-settings", currentWeek: Math.min(8, week + 1) },
  });
  return { ...state, passed: true };
}
