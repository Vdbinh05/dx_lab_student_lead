import { db } from "@/lib/db";
import {
  getAllMissions,
  getIncidents,
  getMissionById,
  getWeek,
  getWeeklyQuiz,
  weeks,
} from "@/lib/curriculum";
import {
  calculateMissionGate,
  calculateReadiness,
  buildDailyMissionPlan,
  parseCompletedSteps,
  selectNextActionableMission,
} from "@/lib/progress-engine";
import { calculateWeekGateState, isWeekUnlockedForPass } from "@/lib/training-state";

export async function ensureLocalProfile() {
  await Promise.all([
    db.learnerProfile.upsert({
      where: { id: "local-learner" },
      update: {},
      create: { id: "local-learner" },
    }),
    db.appSettings.upsert({
      where: { id: "local-settings" },
      update: {},
      create: { id: "local-settings" },
    }),
  ]);
}

export async function getProgressMap() {
  const rows = await db.missionProgress.findMany();
  return new Map(rows.map((row) => [row.missionId, row]));
}

export async function getMissionState(missionId: string) {
  const mission = getMissionById(missionId);
  if (!mission) return null;
  const [
    progress,
    evidence,
    quizAttempts,
    note,
    bookmark,
    labBookmarks,
    passUnlocked,
  ] =
    await Promise.all([
      db.missionProgress.findUnique({ where: { missionId } }),
      db.evidence.findMany({
        where: { missionId },
        orderBy: { createdAt: "desc" },
      }),
      db.quizAttempt.findMany({
        where: { missionId },
        orderBy: { createdAt: "desc" },
      }),
      db.missionNote.findUnique({ where: { missionId } }),
      db.bookmark.findUnique({
        where: {
          targetType_targetId: { targetType: "mission", targetId: missionId },
        },
      }),
      db.bookmark.findMany({
        where: {
          targetType: "lab",
          targetId: { startsWith: `${missionId}:` },
        },
      }),
      isWeekUnlockedForPass(mission.week),
    ]);
  const completedSteps = parseCompletedSteps(progress?.completedSteps);
  const bestQuizScore = quizAttempts.reduce<number | null>(
    (best, attempt) =>
      best === null || attempt.score > best ? attempt.score : best,
    null,
  );
  const gate = calculateMissionGate({
    completedSteps,
    requiredEvidence: mission.requiredEvidence,
    evidenceTypes: evidence.map((item) => item.type),
    quizScore: bestQuizScore,
    quizPassScore: mission.quizPassScore,
    hardGateRequired: mission.hardGate,
    hardGateSatisfied: progress?.hardGatePassed === true || !mission.hardGate,
  });
  return {
    mission,
    progress,
    evidence,
    quizAttempts,
    completedSteps,
    gate,
    note,
    bookmarked: Boolean(bookmark),
    labBookmarks: labBookmarks.map((item) => item.targetId),
    passUnlocked,
    readOnlyReason: passUnlocked
      ? null
      : `AVAILABLE TO READ · Week ${mission.week - 1} gate phải PASS trước khi lưu progress`,
  };
}

export async function getNextMission() {
  const missions = getAllMissions();
  const [progress, weeklyProgress] = await Promise.all([
    getProgressMap(),
    db.weeklyProgress.findMany({ where: { hardGatePassed: true } }),
  ]);
  const unlockedWeek = Math.min(8, weeklyProgress.length + 1);
  const actionable = missions.filter((mission) => mission.week <= unlockedWeek);
  const statuses = Object.fromEntries(
    [...progress.entries()].map(([id, row]) => [id, row.status]),
  );
  return selectNextActionableMission(actionable, statuses);
}

export async function getDashboardData() {
  await ensureLocalProfile();
  const missions = getAllMissions();
  const incidentsCatalog = getIncidents();
  const [
    progressRows,
    evidenceCount,
    quizAgg,
    incidents,
    skills,
    settings,
    weeklyProgress,
    oralReflections,
  ] = await Promise.all([
    db.missionProgress.findMany(),
    db.evidence.count(),
    db.quizAttempt.findMany(),
    db.incidentAttempt.findMany(),
    db.skillProgress.findMany(),
    db.appSettings.findUnique({ where: { id: "local-settings" } }),
    db.weeklyProgress.findMany({ where: { hardGatePassed: true } }),
    db.oralReflection.findMany({ where: { confident: true } }),
  ]);
  const progress = new Map(progressRows.map((row) => [row.missionId, row]));
  const passed = missions.filter(
    (mission) => progress.get(mission.id)?.status === "PASSED",
  );
  const completedWeekNumbers = weeklyProgress.map((row) => row.week);
  const currentWeek =
    weeks.find((week) => !completedWeekNumbers.includes(week.number))?.number ?? 8;
  const statuses = Object.fromEntries(
    progressRows.map((row) => [row.missionId, row.status]),
  );
  const actionableMissions = missions.filter((mission) => mission.week <= currentWeek);
  const nextSelection = selectNextActionableMission(actionableMissions, statuses);
  const nextMission = nextSelection.mission;
  const quizAverage = quizAgg.length
    ? Math.round(
        quizAgg.reduce((sum, row) => sum + row.score, 0) / quizAgg.length,
      )
    : 0;
  const cleanIncidentIds = new Set(
    incidents
      .filter((attempt) => attempt.passed && !attempt.assisted)
      .map((attempt) => attempt.incidentId),
  );
  const cleanBossFightWeeks = incidentsCatalog
    .filter((incident) => cleanIncidentIds.has(incident.id))
    .map((incident) => incident.week);
  const bossFightPassed = cleanBossFightWeeks.includes(currentWeek);
  const skillLevels = Object.fromEntries(
    skills.map((skill) => [skill.id, skill.currentLevel]),
  );
  const oralDefenseGroups = [
    ...new Set(oralReflections.map((reflection) => reflection.group)),
  ];
  const p0Blockers = progressRows
    .filter((row) => row.status === "BLOCKED")
    .map((row) => {
      const mission = getMissionById(row.missionId);
      return mission
        ? `P0 · Week ${mission.week} · ${mission.title} đang BLOCKED`
        : `P0 · Mission ${row.missionId} đang BLOCKED`;
    });
  const readiness = calculateReadiness({
    passedMissionIds: passed.map((item) => item.id),
    requiredWeekOneMissionIds: missions
      .filter((mission) => mission.week === 1)
      .map((mission) => mission.id),
    requiredMissionIds: missions.map((mission) => mission.id),
    skillLevels,
    bossFightPassed: cleanBossFightWeeks.includes(1),
    cleanBossFightWeeks,
    evidenceCount,
    completedWeekNumbers,
    weeklyGateWeeks: completedWeekNumbers,
    oralDefenseGroups,
    p0Blockers,
    futureGates: {},
  });
  const dailyPlan = buildDailyMissionPlan(
    actionableMissions,
    statuses,
    settings?.dailyStudyMinutes ?? 240,
    settings?.acceleratedMode ?? false,
  );
  return {
    missions,
    progress,
    passed,
    currentWeek,
    currentWeekDefinition: getWeek(currentWeek),
    nextMission,
    nextSelection,
    dailyPlan,
    evidenceCount,
    quizAverage,
    incidentsSolved: cleanIncidentIds.size,
    bossFightPassed,
    cleanBossFightWeeks,
    skills,
    settings,
    weeklyProgress,
    readiness,
  };
}

export async function getWeekSummary(weekNumber: number) {
  const definition = getWeek(weekNumber);
  if (!definition) return null;
  const missions = getAllMissions().filter((mission) => mission.week === weekNumber);
  const missionIds = missions.map((mission) => mission.id);
  const [
    gate,
    progress,
    quizAttempts,
    incidents,
    evidence,
    skills,
    weeklyProgress,
    passUnlocked,
  ] = await Promise.all([
    calculateWeekGateState(weekNumber),
    db.missionProgress.findMany({ where: { missionId: { in: missionIds } } }),
    db.quizAttempt.findMany({ where: { missionId: definition.slug } }),
    db.incidentAttempt.findMany({ where: { incidentId: definition.bossFightId } }),
    db.evidence.findMany({ where: { missionId: { in: missionIds } } }),
    db.skillProgress.findMany({
      where: { id: { in: [...new Set(missions.map((mission) => mission.skillId))] } },
    }),
    db.weeklyProgress.findUnique({ where: { week: weekNumber } }),
    isWeekUnlockedForPass(weekNumber),
  ]);
  const labsCompleted = progress.filter((row) => {
    const steps = new Set(parseCompletedSteps(row.completedSteps));
    return steps.has("practice") && steps.has("build");
  }).length;
  const missionPassed = progress.filter((row) => row.status === "PASSED").length;
  const quizAverage = quizAttempts.length
    ? Math.round(
        quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
          quizAttempts.length,
      )
    : 0;
  return {
    definition,
    missions,
    progress,
    gate,
    weeklyProgress,
    passUnlocked,
    missionPassed,
    labsCompleted,
    quizAverage,
    quizQuestions: getWeeklyQuiz(weekNumber),
    incidentsSolved: incidents.filter((attempt) => attempt.passed && !attempt.assisted)
      .length,
    evidenceCount: evidence.length,
    skills,
  };
}
