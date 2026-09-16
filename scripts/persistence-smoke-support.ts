import type { LearnerBackup } from "../src/lib/backup";

export type SmokeFailure = {
  phase: "smoke" | "cleanup" | "close" | "diagnostics";
  error: unknown;
};

/** Keep each exception object/stack, even if restore, logging or browser close fails. */
export async function runWithCleanup(
  smoke: () => Promise<void>,
  cleanup: () => Promise<void>,
  close: () => Promise<void>,
  record: (failure: SmokeFailure) => void = () => {},
) {
  const failures: SmokeFailure[] = [];
  function capture(phase: SmokeFailure["phase"], error: unknown) {
    const failure = { phase, error };
    failures.push(failure);
    try {
      record(failure);
    } catch (error) {
      failures.push({ phase: "diagnostics", error });
    }
  }
  try {
    await smoke();
  } catch (error) {
    capture("smoke", error);
  } finally {
    try {
      await cleanup();
    } catch (error) {
      capture("cleanup", error);
    } finally {
      try {
        await close();
      } catch (error) {
        capture("close", error);
      }
    }
  }
  return failures;
}

function canonical(value: unknown): string {
  // Sort object keys and database row sets, but retain the order of nested arrays.
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`)
      .join(",")}}`;
  return JSON.stringify(value);
}

export function semanticBackup(backup: LearnerBackup) {
  const result = structuredClone(backup) as Partial<LearnerBackup>;
  // Envelope creation time changes on every export; not a learner row.
  delete result.exportedAt;
  // Existing-profile restore updates name via Prisma @updatedAt. No other row field is ignored.
  const profile = result.learnerProfile as Partial<
    LearnerBackup["learnerProfile"]
  >;
  delete profile.updatedAt;
  return result;
}

export function changedLearnerFields(
  before: LearnerBackup,
  after: LearnerBackup,
) {
  const left = semanticBackup(before),
    right = semanticBackup(after);
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  const rows = (value: unknown) =>
    Array.isArray(value)
      ? [...value].sort((a, b) => canonical(a).localeCompare(canonical(b)))
      : value;
  return [...keys].filter(
    (key) =>
      canonical(rows(left[key as keyof LearnerBackup])) !==
      canonical(rows(right[key as keyof LearnerBackup])),
  );
}

export function assertRestored(
  before: LearnerBackup,
  after: LearnerBackup,
  marker: string,
) {
  const changed = changedLearnerFields(before, after);
  if (changed.length)
    throw new Error(`Substantive learner state differs: ${changed.join(", ")}`);
  if (JSON.stringify(after).includes(marker))
    throw new Error("Temporary smoke marker remains after restore");
}

export function localSmokeUrl(value: string) {
  const url = new URL(value);
  if (
    url.protocol !== "http:" ||
    !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error(
      "Diagnosis harness accepts only a loopback HTTP origin; remote execution is disabled",
    );
  return url.origin;
}
