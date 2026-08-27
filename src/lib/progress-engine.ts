import {
  missionSteps,
  type GateInput,
  type GateResult,
  type IncidentDefinition,
  type Mission,
} from "@/lib/types";

export function calculateMissionGate(input: GateInput): GateResult {
  const blockers: string[] = [];
  const operationalSteps = missionSteps.filter(
    (step) => step !== "evidence" && step !== "quiz",
  );
  const missingSteps = operationalSteps.filter(
    (step) => !input.completedSteps.includes(step),
  );
  const missingEvidence = input.requiredEvidence.filter(
    (type) => !input.evidenceTypes.includes(type),
  );

  if (missingSteps.length)
    blockers.push(`Chưa hoàn thành: ${missingSteps.join(", ")}`);
  if (missingEvidence.length)
    blockers.push(`Thiếu evidence: ${missingEvidence.join(", ")}`);
  const quizPassed =
    input.quizScore !== null && input.quizScore >= input.quizPassScore;
  if (!quizPassed)
    blockers.push(
      `Quiz chưa đạt ngưỡng PASS (${input.quizScore ?? 0}/${input.quizPassScore})`,
    );
  const operationalBlockers = blockers.length;
  if (input.hardGateRequired && !input.hardGateSatisfied)
    blockers.push("Hard gate chưa được chốt");

  if (blockers.length === 0)
    return {
      passed: true,
      status: "PASSED",
      blockers: [],
      eligibleForHardGate: true,
    };
  const touched =
    input.completedSteps.length > 0 || input.evidenceTypes.length > 0;
  const ready = operationalBlockers === 0;
  return {
    passed: false,
    status: ready ? "READY_FOR_GATE" : touched ? "IN_PROGRESS" : "NOT_STARTED",
    blockers,
    eligibleForHardGate: ready,
  };
}

export type SkillSignal = {
  theoryComplete: boolean;
  guidedLabComplete: boolean;
  quizPassed: boolean;
  independentLabComplete: boolean;
  evidenceCount: number;
  incidentPassed: boolean;
  bossFightPassed: boolean;
  explanationEvidence: boolean;
  fixEvidence: boolean;
  verificationEvidence: boolean;
  regressionEvidence: boolean;
};

export function calculateSkillLevel(signal: SkillSignal): number {
  if (!signal.theoryComplete) return 0;
  if (!signal.guidedLabComplete || !signal.quizPassed) return 1;
  if (
    !signal.independentLabComplete ||
    signal.evidenceCount === 0 ||
    !signal.incidentPassed
  )
    return 2;
  if (
    !signal.bossFightPassed ||
    !signal.explanationEvidence ||
    !signal.fixEvidence ||
    !signal.verificationEvidence ||
    !signal.regressionEvidence
  )
    return 3;
  return 4;
}

export const readinessDimensions = [
  "UNDERSTAND",
  "DEPLOY",
  "INTEGRATE",
  "OBSERVE",
  "DEBUG",
  "COORDINATE",
  "REVIEW",
  "SECURE",
  "RELEASE",
  "EXPLAIN",
] as const;

export type ReadinessSignals = {
  passedMissionIds: string[];
  requiredWeekOneMissionIds: string[];
  requiredMissionIds?: string[];
  skillLevels: Record<string, number>;
  bossFightPassed: boolean;
  cleanBossFightWeeks?: number[];
  evidenceCount: number;
  completedWeekNumbers: number[];
  weeklyGateWeeks?: number[];
  oralDefenseGroups?: string[];
  p0Blockers?: string[];
  futureGates: Partial<
    Record<
      "INTEGRATE" | "COORDINATE" | "REVIEW" | "SECURE" | "RELEASE" | "EXPLAIN",
      boolean
    >
  >;
};

export function calculateReadiness(signals: ReadinessSignals) {
  const passed = new Set(signals.passedMissionIds);
  const weekOnePassed = signals.requiredWeekOneMissionIds.every((id) =>
    passed.has(id),
  );
  const requiredMissionIds = signals.requiredMissionIds ?? signals.requiredWeekOneMissionIds;
  const allMissionsPassed = requiredMissionIds.every((id) => passed.has(id));
  const weeklyGateWeeks = new Set(
    signals.weeklyGateWeeks ?? signals.completedWeekNumbers,
  );
  const cleanBossFightWeeks = new Set(
    signals.cleanBossFightWeeks ?? (signals.bossFightPassed ? [1] : []),
  );
  const allWeeksComplete = [1, 2, 3, 4, 5, 6, 7, 8].every((week) =>
    weeklyGateWeeks.has(week),
  );
  const allBossFightsPassed = [1, 2, 3, 4, 5, 6, 7, 8].every((week) =>
    cleanBossFightWeeks.has(week),
  );
  const level = (id: string) => signals.skillLevels[id] ?? 0;
  const values: Record<(typeof readinessDimensions)[number], boolean> = {
    UNDERSTAND:
      weekOnePassed && level("linux") >= 1 && level("networking") >= 1,
    DEPLOY:
      weeklyGateWeeks.has(2) && level("docker") >= 2 && level("compose") >= 2,
    INTEGRATE:
      weeklyGateWeeks.has(4) || signals.futureGates.INTEGRATE === true,
    OBSERVE:
      weeklyGateWeeks.has(5) && level("troubleshooting") >= 2,
    DEBUG: allBossFightsPassed,
    COORDINATE:
      weeklyGateWeeks.has(8) || signals.futureGates.COORDINATE === true,
    REVIEW:
      (weeklyGateWeeks.has(8) || signals.futureGates.REVIEW === true) &&
      signals.evidenceCount >= requiredMissionIds.length,
    SECURE:
      (weeklyGateWeeks.has(3) && weeklyGateWeeks.has(7)) ||
      signals.futureGates.SECURE === true,
    RELEASE:
      weeklyGateWeeks.has(8) || signals.futureGates.RELEASE === true,
    EXPLAIN:
      ((signals.oralDefenseGroups?.length ?? 0) >= 10 && weeklyGateWeeks.has(8)) ||
      signals.futureGates.EXPLAIN === true,
  };
  const p0Blockers = signals.p0Blockers ?? [];
  const readyForMock =
    [1, 2, 3, 4, 5, 6, 7].every((week) => weeklyGateWeeks.has(week)) &&
    [1, 2, 3, 4, 5, 6, 7].every((week) => cleanBossFightWeeks.has(week)) &&
    p0Blockers.length === 0;
  const ready =
    allWeeksComplete &&
    allMissionsPassed &&
    allBossFightsPassed &&
    p0Blockers.length === 0 &&
    readinessDimensions.every((key) => values[key]);
  return {
    dimensions: values,
    ready,
    readyForMock,
    status: ready
      ? ("READY FOR FINAL" as const)
      : readyForMock
        ? ("READY FOR MOCK OLP" as const)
        : ("NOT READY" as const),
    passedCount: readinessDimensions.filter((key) => values[key]).length,
    allWeeksComplete,
    allMissionsPassed,
    allBossFightsPassed,
    p0Blockers,
  };
}

export type MissionSelection = {
  mission: Mission | null;
  blocked: boolean;
  reason: string | null;
};

export function selectNextActionableMission(
  missions: Mission[],
  statuses: Record<string, string | undefined>,
): MissionSelection {
  const sorted = [...missions].sort(
    (a, b) => a.week - b.week || a.order - b.order,
  );
  for (const mission of sorted) {
    if (statuses[mission.id] === "PASSED") continue;
    const unmet = mission.prerequisites
      .map((id) => sorted.find((candidate) => candidate.id === id))
      .find((candidate) => candidate && statuses[candidate.id] !== "PASSED");
    if (unmet)
      return {
        mission: unmet,
        blocked: statuses[unmet.id] === "BLOCKED",
        reason: `Cần PASS prerequisite ${unmet.title} trước ${mission.title}`,
      };
    const blocked = statuses[mission.id] === "BLOCKED";
    return {
      mission,
      blocked,
      reason: blocked
        ? `Mission ${mission.title} đang BLOCKED; xem blocker evidence trước khi tiếp tục.`
        : null,
    };
  }
  return { mission: null, blocked: false, reason: null };
}

export function parseCompletedSteps(
  value: string | null | undefined,
): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "string")
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export function selectNextMission(
  missions: Mission[],
  statuses: Record<string, string | undefined>,
) {
  return selectNextActionableMission(missions, statuses).mission;
}

export type BossFightInput = {
  symptom: string;
  evidence: string;
  hypothesis: string;
  test: string;
  result: string;
  rootCause: string;
  fix: string;
  verification: string;
  regression: string;
  assistanceLevel: "NONE" | "HINT_1" | "HINT_2" | "SOLUTION";
};

const defaultIncidentRules: Pick<
  IncidentDefinition,
  "diagnosisKeywords" | "evidenceKeywords" | "testKeywords"
> = {
  diagnosisKeywords: [
    ["8000"],
    ["8001"],
    ["listen", "bind"],
    ["compose", "mapping", "target"],
  ],
  evidenceKeywords: ["compose", "ss", "listen"],
  testKeywords: ["compose", "ss", "curl", "inspect"],
};

function keywordMatches(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword.toLowerCase()));
}

export function evaluateBossFight(
  input: BossFightInput,
  rules: Pick<
    IncidentDefinition,
    "diagnosisKeywords" | "evidenceKeywords" | "testKeywords"
  > = defaultIncidentRules,
) {
  const fields = [
    input.symptom,
    input.evidence,
    input.hypothesis,
    input.test,
    input.result,
    input.rootCause,
    input.fix,
    input.verification,
    input.regression,
  ];
  const diagnosis = `${input.rootCause} ${input.fix}`.toLowerCase();
  const evidence = input.evidence.toLowerCase();
  const test = input.test.toLowerCase();
  const complete = fields.every((value) => value.trim().length >= 12);
  const diagnosisMatches = rules.diagnosisKeywords.every((group) =>
    keywordMatches(diagnosis, group),
  );
  const minimumEvidenceSignals = Math.min(2, rules.evidenceKeywords.length);
  const minimumTestSignals = Math.min(2, rules.testKeywords.length);
  const commandEvidenceMatches =
    rules.evidenceKeywords.filter((keyword) =>
      evidence.includes(keyword.toLowerCase()),
    ).length >= minimumEvidenceSignals &&
    rules.testKeywords.filter((keyword) => test.includes(keyword.toLowerCase()))
      .length >= minimumTestSignals;
  const verificationComplete =
    input.verification.trim().length >= 20 &&
    /(curl|200|health|smoke|e2e|response|pass)/.test(
      input.verification.toLowerCase(),
    );
  const regressionComplete = input.regression.trim().length >= 20;
  const assisted = input.assistanceLevel !== "NONE";
  return {
    assisted,
    passed:
      complete &&
      diagnosisMatches &&
      commandEvidenceMatches &&
      verificationComplete &&
      regressionComplete &&
      !assisted,
  };
}

export function buildDailyMissionPlan(
  missions: Mission[],
  statuses: Record<string, string | undefined>,
  dailyStudyMinutes: number,
  acceleratedMode: boolean,
) {
  const next = selectNextActionableMission(missions, statuses);
  if (!next.mission) return [];
  if (!acceleratedMode || next.blocked) return [next.mission];
  const start = missions.findIndex(
    (mission) => mission.id === next.mission?.id,
  );
  const plan: Mission[] = [];
  let remaining = dailyStudyMinutes;
  for (const mission of missions.slice(start)) {
    if (statuses[mission.id] === "PASSED") continue;
    if (plan.length > 0 && mission.estimatedMinutes > remaining) break;
    plan.push(mission);
    remaining -= mission.estimatedMinutes;
  }
  return plan;
}

export function calculateQuizScore(
  questions: Array<{ id: string; type: string; answer: string }>,
  answers: Record<string, string>,
) {
  if (questions.length === 0) return 0;
  let correct = 0;
  for (const question of questions) {
    const answer = (answers[question.id] ?? "").trim();
    const normalized = answer.toLocaleLowerCase("vi").replace(/\s+/g, " ");
    const expected = question.answer
      .toLocaleLowerCase("vi")
      .replace(/\s+/g, " ");
    const passed =
      question.type === "self-explanation"
        ? answer.length >= 40
        : normalized === expected;
    if (passed) correct += 1;
  }
  return Math.round((correct / questions.length) * 100);
}
