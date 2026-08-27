import { describe, expect, it } from "vitest";
import {
  buildDailyMissionPlan,
  calculateMissionGate,
  calculateQuizScore,
  calculateReadiness,
  calculateSkillLevel,
  evaluateBossFight,
  selectNextActionableMission,
} from "@/lib/progress-engine";
import { getAllMissions } from "@/lib/curriculum";

describe("mission gate invariants", () => {
  const base = {
    completedSteps: ["learn", "practice", "build", "break", "debug"],
    requiredEvidence: ["terminal-output", "self-explanation"],
    evidenceTypes: ["terminal-output", "self-explanation"],
    quizScore: 80,
    quizPassScore: 70,
    hardGateRequired: true,
    hardGateSatisfied: true,
  };
  it("blocks missing evidence", () => {
    const result = calculateMissionGate({
      ...base,
      evidenceTypes: ["terminal-output"],
    });
    expect(result.passed).toBe(false);
    expect(result.blockers.join(" ")).toContain("self-explanation");
  });
  it("blocks quiz below threshold", () => {
    const result = calculateMissionGate({ ...base, quizScore: 69 });
    expect(result.passed).toBe(false);
    expect(result.blockers.join(" ")).toContain("69/70");
  });
  it("requires an explicit hard-gate commit", () => {
    const result = calculateMissionGate({ ...base, hardGateSatisfied: false });
    expect(result.passed).toBe(false);
    expect(result.status).toBe("READY_FOR_GATE");
    expect(result.eligibleForHardGate).toBe(true);
  });
  it("passes only with steps, evidence, quiz and hard gate", () => {
    expect(calculateMissionGate(base)).toMatchObject({
      passed: true,
      status: "PASSED",
      blockers: [],
    });
  });
});

describe("skill levels are cumulative and scoped", () => {
  const empty = {
    theoryComplete: false,
    guidedLabComplete: false,
    quizPassed: false,
    independentLabComplete: false,
    evidenceCount: 0,
    incidentPassed: false,
    bossFightPassed: false,
    explanationEvidence: false,
    fixEvidence: false,
    verificationEvidence: false,
    regressionEvidence: false,
  };
  it("keeps reading-only work at L1, never L3/L4", () =>
    expect(calculateSkillLevel({ ...empty, theoryComplete: true })).toBe(1));
  it("requires the complete lower-level chain for L3", () => {
    expect(
      calculateSkillLevel({
        ...empty,
        theoryComplete: true,
        independentLabComplete: true,
        evidenceCount: 4,
        incidentPassed: true,
      }),
    ).toBe(1);
  });
  it("requires clean boss evidence including fix and verification for L4", () => {
    expect(
      calculateSkillLevel({
        ...empty,
        theoryComplete: true,
        guidedLabComplete: true,
        quizPassed: true,
        independentLabComplete: true,
        evidenceCount: 4,
        incidentPassed: true,
        bossFightPassed: true,
        explanationEvidence: true,
        regressionEvidence: true,
      }),
    ).toBe(3);
  });
});

describe("Boss Fight assistance", () => {
  const clean = {
    symptom: "Browser cannot connect to localhost port 8000.",
    evidence: "Compose maps 8000:8000 but ss shows listener on 8001.",
    hypothesis: "The container target port does not match the listener.",
    test: "Compare compose config with ss output inside the container.",
    result: "The config targets 8000 while the process listens on 8001.",
    rootCause: "Backend listens on 8001 while Compose targets port 8000.",
    fix: "Change the Compose target from 8000 to 8001 and restart.",
    verification: "curl localhost:8000 now returns the expected healthy body.",
    regression:
      "The portal caller and documented health command both pass again.",
    assistanceLevel: "NONE" as const,
  };
  it("accepts a complete unassisted diagnosis", () =>
    expect(evaluateBossFight(clean).passed).toBe(true));
  for (const level of ["HINT_1", "HINT_2", "SOLUTION"] as const) {
    it(`${level} cannot count as a clean pass`, () => {
      const result = evaluateBossFight({ ...clean, assistanceLevel: level });
      expect(result.assisted).toBe(true);
      expect(result.passed).toBe(false);
    });
  }
});

describe("Today and Accelerated Mode", () => {
  const missions = getAllMissions().filter((mission) => mission.week === 1);
  it("selects Mission 1 at 0% and follows prerequisites", () => {
    expect(selectNextActionableMission(missions, {}).mission?.order).toBe(1);
    const value = selectNextActionableMission(missions, {
      [missions[0].id]: "PASSED",
      [missions[1].id]: "BLOCKED",
    });
    expect(value.mission?.order).toBe(2);
    expect(value.blocked).toBe(true);
    expect(value.reason).toContain("BLOCKED");
    const prerequisiteWins = selectNextActionableMission(missions, {
      [missions[0].id]: "PASSED",
      [missions[2].id]: "BLOCKED",
    });
    expect(prerequisiteWins.mission?.order).toBe(2);
    expect(prerequisiteWins.blocked).toBe(false);
  });
  it("changes scheduling but never changes gate criteria", () => {
    const statuses = { [missions[0].id]: "PASSED" };
    expect(buildDailyMissionPlan(missions, statuses, 480, false)).toHaveLength(
      1,
    );
    expect(
      buildDailyMissionPlan(missions, statuses, 480, true).length,
    ).toBeGreaterThan(1);
    expect(
      calculateMissionGate({
        completedSteps: ["learn", "practice", "build", "break", "debug"],
        requiredEvidence: ["terminal-output"],
        evidenceTypes: [],
        quizScore: 100,
        quizPassScore: 70,
        hardGateRequired: true,
        hardGateSatisfied: true,
      }).passed,
    ).toBe(false);
  });
});

describe("readiness", () => {
  it("cannot be spoofed by future skill levels", () => {
    const missionIds = getAllMissions().map((mission) => mission.id);
    const value = calculateReadiness({
      passedMissionIds: missionIds,
      requiredWeekOneMissionIds: missionIds,
      skillLevels: Object.fromEntries(
        ["linux", "networking", "docker", "compose", "troubleshooting"].map(
          (id) => [id, 4],
        ),
      ),
      bossFightPassed: true,
      evidenceCount: 100,
      completedWeekNumbers: [1],
      futureGates: {},
    });
    expect(value.ready).toBe(false);
    expect(value.dimensions.RELEASE).toBe(false);
    expect(value.allWeeksComplete).toBe(false);
  });
});

describe("quiz scoring", () => {
  it("scores deterministic answers and meaningful explanations", () => {
    const questions = [
      { id: "a", type: "multiple-choice", answer: "pwd" },
      { id: "b", type: "short-answer", answer: ".." },
      { id: "c", type: "self-explanation", answer: "__EXPLANATION__" },
      { id: "d", type: "multiple-choice", answer: "ls" },
    ];
    expect(
      calculateQuizScore(questions, {
        a: "PWD",
        b: "..",
        c: "Giải thích đủ dài để chứng minh người học tự diễn đạt khái niệm.",
        d: "wrong",
      }),
    ).toBe(75);
  });
});
