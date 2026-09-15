import { z } from "zod";

export const verificationMissions = {
  "week-01-mission-01": {
    missionId: "w1-m1-linux-orientation",
    checks: [
      "practice-directory",
      "guided-notes",
      "independent-notes",
      "evidence-directory",
    ],
  },
  "week-01-mission-02": {
    missionId: "w1-m2-files-permissions-env",
    checks: [
      "practice-directory",
      "original-file",
      "script-mode",
      "evidence-directory",
    ],
  },
  "week-01-mission-03": {
    missionId: "w1-m3-processes-logs-resources",
    checks: [
      "practice-directory",
      "process-observation",
      "log-observation",
      "incident-report",
    ],
  },
} as const;
const schema = z
  .object({
    schemaVersion: z.literal(1),
    missionId: z.enum([
      "week-01-mission-01",
      "week-01-mission-02",
      "week-01-mission-03",
    ]),
    generatedAt: z.string().datetime(),
    checks: z
      .array(
        z
          .object({
            id: z.string().max(50),
            status: z.enum(["pass", "fail"]),
            evidence: z.enum(["observed", "missing-or-unexpected"]),
          })
          .strict(),
      )
      .length(4),
    overall: z.enum(["pass", "fail"]),
  })
  .strict()
  .superRefine((report, ctx) => {
    const expected: readonly string[] =
      verificationMissions[report.missionId].checks;
    if (
      new Set(report.checks.map((check) => check.id)).size !==
        expected.length ||
      report.checks.some((check) => !expected.includes(check.id))
    )
      ctx.addIssue({ code: "custom", message: "Checks không khớp mission" });
    if (
      report.overall !==
        (report.checks.every((check) => check.status === "pass")
          ? "pass"
          : "fail") ||
      report.checks.some(
        (check) =>
          (check.status === "pass") !== (check.evidence === "observed"),
      )
    )
      ctx.addIssue({ code: "custom", message: "Kết quả không nhất quán" });
  });
export function parseVerification(raw: string) {
  if (raw.length > 10000) throw new Error("Mission report vượt 10 KB");
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("Mission report không phải JSON hợp lệ");
  }
  return schema.parse(value);
}
