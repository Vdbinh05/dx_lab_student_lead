import { describe, expect, it } from "vitest";
import {
  assertRestored,
  changedLearnerFields,
  localSmokeUrl,
  runWithCleanup,
} from "./persistence-smoke-support";
import type { LearnerBackup } from "../src/lib/backup";

describe("smoke failure isolation", () => {
  it("preserves original objects and stacks when cleanup, diagnostics and close also fail", async () => {
    const original = new Error("original"),
      cleanup = new Error("restore"),
      close = new Error("close");
    const stack = original.stack;
    const result = await runWithCleanup(
      async () => {
        throw original;
      },
      async () => {
        throw cleanup;
      },
      async () => {
        throw close;
      },
      () => {
        throw new Error("disk full");
      },
    );
    expect(
      result.filter((f) => f.phase !== "diagnostics").map((f) => f.error),
    ).toEqual([original, cleanup, close]);
    expect(result[0].error).toBe(original);
    expect(original.stack).toBe(stack);
  });
  it("reports cleanup alone when smoke succeeds", async () => {
    const result = await runWithCleanup(
      async () => {},
      async () => {
        throw new Error("cleanup");
      },
      async () => {},
    );
    expect(result.map((f) => f.phase)).toEqual(["cleanup"]);
  });
});

// Deliberately focused row data: comparison must not need a database or production export.
const baseline = {
  exportedAt: "2026-01-01T00:00:00.000Z",
  applicationVersion: "0.3.0",
  learnerProfile: {
    id: "local-learner",
    name: "Local fixture",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  notes: [
    { id: "a", content: "retained", updatedAt: "old" },
    { id: "b", content: "other", updatedAt: "old" },
  ],
  missionProgress: [{ completedSteps: '["learn"]', updatedAt: "old" }],
  quizAttempts: [{ score: 1, createdAt: "old" }],
  skillProgress: [{ currentLevel: 1, updatedAt: "old" }],
  evidence: [{ content: "retained", createdAt: "old" }],
  bookmarks: [{ label: "retained", createdAt: "old" }],
  incidentAttempts: [{ passed: false, createdAt: "old" }],
  incidentAssistance: [{ level: "HINT_1", updatedAt: "old" }],
  weeklyProgress: [{ hardGatePassed: false, updatedAt: "old" }],
  oralReflections: [{ confident: false, createdAt: "old" }],
  recallReviews: [{ nextReviewAt: "old", rating: "wrong" }],
  settings: { currentWeek: 1 },
} as unknown as LearnerBackup;
describe("strict semantic comparison", () => {
  it("ignores only export envelope time and profile update time; row ordering is immaterial", () => {
    const after = structuredClone(baseline);
    after.exportedAt = "new";
    after.learnerProfile.updatedAt = "new";
    after.notes.reverse();
    expect(changedLearnerFields(baseline, after)).toEqual([]);
  });
  for (const key of [
    "missionProgress",
    "quizAttempts",
    "skillProgress",
    "evidence",
    "notes",
    "bookmarks",
    "incidentAttempts",
    "incidentAssistance",
    "weeklyProgress",
    "oralReflections",
    "recallReviews",
    "settings",
  ] as const)
    it(`detects substantive or timestamp changes in ${key}`, () => {
      const after = structuredClone(baseline);
      Object.assign(after, { [key]: [] });
      expect(changedLearnerFields(baseline, after)).toEqual([key]);
    });
  it("does not ignore any other timestamp or learner identity field", () => {
    for (const mutate of [
      (x: LearnerBackup) => {
        x.learnerProfile.createdAt = "changed";
      },
      (x: LearnerBackup) => {
        x.notes[0].updatedAt = "changed";
      },
      (x: LearnerBackup) => {
        x.learnerProfile.name = "changed";
      },
    ]) {
      const after = structuredClone(baseline);
      mutate(after);
      expect(() => assertRestored(baseline, after, "probe")).toThrow(
        "Substantive",
      );
    }
    expect(() => assertRestored(baseline, baseline, "retained")).toThrow(
      "marker remains",
    );
  });
  it("rejects remote targets before any browser or request starts", () => {
    expect(localSmokeUrl("http://127.0.0.1:3100")).toBe(
      "http://127.0.0.1:3100",
    );
    for (const url of [
      "https://dx-lab-student-lead.vercel.app",
      "https://learndxlab.bynh.id.vn",
      "http://127.0.0.1.evil.test",
      "http://user@localhost:3100",
    ])
      expect(() => localSmokeUrl(url)).toThrow("loopback");
  });
});
