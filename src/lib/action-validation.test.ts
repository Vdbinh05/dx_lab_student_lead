import { describe, expect, it } from "vitest";
import {
  evidenceInputSchema,
  missionBlockerInputSchema,
  missionStepInputSchema,
} from "@/lib/action-validation";

describe("server action validation", () => {
  it("rejects client-supplied status/progress mutations", () => {
    expect(
      missionStepInputSchema.safeParse({
        missionId: "w1-m1-linux-orientation",
        step: "learn",
        status: "PASSED",
      }).success,
    ).toBe(false);
    expect(
      missionStepInputSchema.safeParse({
        missionId: "w1-m1-linux-orientation",
        step: "quiz",
      }).success,
    ).toBe(false);
  });
  it("rejects invalid evidence URLs and unexpected skill ownership", () => {
    expect(
      evidenceInputSchema.safeParse({
        missionId: "w1-m1-linux-orientation",
        type: "terminal-output",
        title: "Valid evidence",
        content: "A sufficiently long evidence body.",
        url: "javascript:alert(1)",
        skillId: "release",
      }).success,
    ).toBe(false);
    expect(
      evidenceInputSchema.safeParse({
        missionId: "w1-m6-git-open-source",
        type: "github-url",
        title: "Pull request evidence",
        content: "Issue and reviewed pull request evidence.",
        url: "",
      }).success,
    ).toBe(false);
    expect(
      evidenceInputSchema.safeParse({
        missionId: "w1-m1-linux-orientation",
        type: "terminal-output",
        title: "Unsafe link",
        content: "A sufficiently long evidence body.",
        url: "javascript:alert(1)",
      }).success,
    ).toBe(false);
  });
  it("requires a concrete blocker note and rejects injected status", () => {
    expect(
      missionBlockerInputSchema.safeParse({
        missionId: "w1-m1-linux-orientation",
        notes: "too short",
      }).success,
    ).toBe(false);
    expect(
      missionBlockerInputSchema.safeParse({
        missionId: "w1-m1-linux-orientation",
        notes:
          "Docker daemon is unavailable; evidence recorded in terminal output.",
        status: "PASSED",
      }).success,
    ).toBe(false);
  });
});
