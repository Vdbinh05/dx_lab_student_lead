import { describe, expect, it } from "vitest";
import {
  evaluateWeekGateState,
  isWeekProgressionUnlocked,
} from "@/lib/training-state";

describe("weekly progression and gate calculation", () => {
  it("keeps future weeks readable but locked for PASS until the previous gate", () => {
    expect(isWeekProgressionUnlocked(1, false)).toBe(true);
    expect(isWeekProgressionUnlocked(2, false)).toBe(false);
    expect(isWeekProgressionUnlocked(2, true)).toBe(true);
    expect(isWeekProgressionUnlocked(8, false)).toBe(false);
  });

  it("requires missions, weekly quiz, clean Boss Fight, and previous gate", () => {
    const blocked = evaluateWeekGateState({
      week: 3,
      missionPassed: 6,
      missionTotal: 7,
      quizScore: 79,
      quizPassScore: 80,
      bossFightPassed: false,
      previousWeekGatePassed: false,
      evidenceCount: 12,
    });
    expect(blocked.eligible).toBe(false);
    expect(blocked.blockers).toEqual([
      "Missions: 6/7 PASS",
      "Weekly quiz: 79/80",
      "Boss Fight chưa có CLEAN PASS",
      "Week 2 gate chưa PASS",
    ]);

    const ready = evaluateWeekGateState({
      week: 3,
      missionPassed: 7,
      missionTotal: 7,
      quizScore: 80,
      quizPassScore: 80,
      bossFightPassed: true,
      previousWeekGatePassed: true,
      evidenceCount: 20,
    });
    expect(ready).toMatchObject({
      passed: true,
      eligible: true,
      blockers: [],
    });
  });
});
