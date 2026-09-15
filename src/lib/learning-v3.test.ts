import { describe, expect, it } from "vitest";
import { dueRecall, scheduleReview } from "./recall";
import { parseVerification, verificationMissions } from "./verification";

describe("recall scheduling", () => {
  const now = new Date("2026-09-15T08:00:00.000Z");
  it("schedules 1/3/7/14/30 days and resets the correct streak", () => {
    let previous = null;
    for (const [rating, days] of [
      ["wrong", 1],
      ["hard", 3],
      ["correct", 7],
      ["correct", 14],
      ["correct", 30],
      ["wrong", 1],
      ["correct", 7],
    ] as const) {
      const next = scheduleReview(previous, rating, now);
      expect(next.nextReviewAt.getTime() - now.getTime()).toBe(days * 86400000);
      previous = next;
    }
    expect(previous?.reviewCount).toBe(7);
  });
  it("has stable ordering and excludes future dates, including the due boundary", () => {
    const items = [{ id: "b" }, { id: "a" }, { id: "c" }];
    expect(
      dueRecall(
        items,
        [
          { id: "b", nextReviewAt: now },
          { id: "c", nextReviewAt: new Date(now.getTime() + 1) },
        ],
        now,
      ).map((i) => i.id),
    ).toEqual(["a", "b"]);
  });
});

describe("verification trust boundary", () => {
  const valid = {
    schemaVersion: 1,
    missionId: "week-01-mission-01",
    generatedAt: "2026-09-15T08:00:00.000Z",
    checks: verificationMissions["week-01-mission-01"].checks.map((id) => ({
      id,
      status: "pass",
      evidence: "observed",
    })),
    overall: "pass",
  };
  it("accepts complete fixed reports and consistently failed reports", () => {
    expect(parseVerification(JSON.stringify(valid)).overall).toBe("pass");
    const failed = structuredClone(valid);
    failed.overall = "fail";
    failed.checks[0].status = "fail";
    failed.checks[0].evidence = "missing-or-unexpected";
    expect(parseVerification(JSON.stringify(failed)).overall).toBe("fail");
  });
  it("rejects invented, duplicate, missing, contradictory and executable fields", () => {
    for (const value of [
      { ...valid, schemaVersion: 2 },
      { ...valid, command: "rm" },
      { ...valid, checks: [] },
      { ...valid, overall: "fail" },
      { ...valid, missionId: "week-02-mission-01" },
      { ...valid, checks: Array(4).fill(valid.checks[0]) },
      {
        ...valid,
        checks: valid.checks.map((c) => ({
          ...c,
          evidence: "private machine path",
        })),
      },
    ]) {
      expect(() => parseVerification(JSON.stringify(value))).toThrow();
    }
    expect(() => parseVerification("{")).toThrow();
    expect(() => parseVerification(" ".repeat(10001))).toThrow();
  });
});
