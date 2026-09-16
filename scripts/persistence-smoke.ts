import {
  chromium,
  expect,
  type BrowserContext,
  type Page,
} from "@playwright/test";
import { writeFileSync, mkdirSync, appendFileSync } from "node:fs";
import { parseLearnerBackup } from "../src/lib/backup";
import { verificationMissions } from "../src/lib/verification";
import { randomUUID } from "node:crypto";
import { getAllMissions } from "../src/lib/curriculum";
import {
  assertRestored,
  changedLearnerFields,
  localSmokeUrl,
  productionSmokeUrl,
  runWithCleanup,
} from "./persistence-smoke-support";
export async function runPersistenceSmoke(options: {
  baseUrl: string;
  production?: boolean;
  reproduceOldSelector?: boolean;
  failSmoke?: boolean;
  failCleanup?: boolean;
}) {
  if (
    options.production &&
    (options.reproduceOldSelector || options.failSmoke || options.failCleanup)
  )
    throw new Error("Fault injection is restricted to local diagnosis");
  const base = options.production
    ? productionSmokeUrl(options.baseUrl)
    : localSmokeUrl(options.baseUrl);
  const marker = `release-smoke-v0.3.0-${Date.now()}-${randomUUID()}`;
  const directory = `artifacts/persistence-diagnosis/${marker}`;
  mkdirSync(directory, { recursive: true });
  const log = (stage: string) => {
    appendFileSync(
      `${directory}/stages.log`,
      `${new Date().toISOString()} ${stage}\n`,
    );
    console.log(stage);
  };

  async function backup() {
    const r = await fetch(`${base}/api/backup?t=${Date.now()}`);
    expect(r.status).toBe(200);
    const raw = await r.text();
    return { raw, data: parseLearnerBackup(raw) };
  }
  const canon = (v: unknown): string =>
    JSON.stringify(v, (_, x) =>
      Array.isArray(x)
        ? [...x].sort((a, b) =>
            JSON.stringify(a).localeCompare(JSON.stringify(b)),
          )
        : x,
    );

  const browser = await chromium.launch();
  let mutated = false;
  let context: BrowserContext | undefined;
  let page: Page;
  let before: Awaited<ReturnType<typeof backup>>;
  let readinessBefore: string;
  const failures = await runWithCleanup(
    async () => {
      context = await browser.newContext();
      page = await context.newPage();
      await context.tracing.start({ screenshots: true, snapshots: true });
      // Warm the existing bootstrap path before taking the baseline.
      await page.goto(`${base}/readiness`);
      readinessBefore = await page.locator("main").innerText();
      before = await backup();
      const backupPath = `${directory}/before.json`;
      writeFileSync(backupPath, before.raw, { flag: "wx" });
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const noteMission = getAllMissions().find(
        (m) =>
          !before.data.notes.some((n) => n.missionId === m.id) &&
          !before.data.bookmarks.some(
            (b) => b.targetType === "mission" && b.targetId === m.id,
          ),
      );

      if (!noteMission)
        throw new Error(
          "No unused note/bookmark target; refusing to overwrite learner content",
        );
      if (!before.data.incidentAssistance)
        throw new Error(
          "Full assistance export required before reversible testing",
        );
      if (
        before.data.incidentAssistance.some(
          (row) => row.incidentId === "net-01",
        )
      )
        throw new Error(
          "Existing net-01 assistance would be consumed; refusing to change learner hint state",
        );
      if (
        before.data.missionProgress.some(
          (row) =>
            row.missionId === "w1-m1-linux-orientation" &&
            row.status === "PASSED",
        )
      )
        throw new Error(
          "M1 already passed; report probe requires a mutable pilot mission",
        );
      expect(await (await fetch(`${base}/api/health`)).json()).toEqual({
        status: "ok",
        version: "0.3.0",
      });
      const noteUrl = `${base}/learn/week-${String(noteMission.week).padStart(2, "0")}/${noteMission.slug}`;
      // Read-only preflight; never open gates or mark learning complete to enable a probe.
      await page.goto(`${base}/learn/week-01/mission-01`);
      await expect(page.locator("#verification-pilot textarea")).toBeEditable();
      await page.goto(`${base}/incidents/net-01`);
      await expect(
        page.getByRole("button", { name: "Nộp attempt" }),
      ).toBeEnabled();
      log("write-note");
      await page.goto(noteUrl);
      const note = page
        .locator("section")
        .filter({ has: page.getByRole("heading", { name: "Mission note" }) });
      expect(changedLearnerFields(before.data, (await backup()).data)).toEqual(
        [],
      );
      mutated = true;
      await note.locator('textarea[name="content"]').fill(marker);
      await note.getByRole("button", { name: "Lưu note" }).click();
      await expect(page.getByText("Mission note đã lưu.")).toBeVisible();
      await page
        .getByRole("button", { name: "Bookmark mission", exact: true })
        .click();
      await expect(
        page.getByRole("button", { name: "Đã bookmark", exact: true }),
      ).toBeVisible();
      log("separate-context-read");
      if (options.failSmoke)
        throw new Error("INJECTED original smoke failure after writes");
      const readContext = await browser.newContext();
      const read = await readContext.newPage();
      await read.goto(noteUrl);
      const readNote = read.locator("section").filter({
        has: read.getByRole("heading", { name: "Mission note", exact: true }),
      });
      // Local-only diagnostic switch reproduces the historical harness selector verbatim.
      const field = options.reproduceOldSelector
        ? read.locator('textarea[name="content"]').first()
        : readNote.locator('textarea[name="content"]');
      await expect(field).toHaveValue(marker, { timeout: 5000 });
      await expect(
        read.getByRole("button", { name: "Đã bookmark", exact: true }),
      ).toBeVisible();
      await readContext.close();
      log("recall");
      await page.goto(`${base}/today`);
      const warmup = page.locator('section[aria-labelledby="warmup-title"]');
      const candidates = await warmup
        .locator('input[name="id"]')
        .evaluateAll((inputs) =>
          inputs.map((i) => (i as HTMLInputElement).value),
        );
      const index = candidates.findIndex(
        (id) => !before.data.recallReviews.some((r) => r.id === id),
      );
      if (index < 0)
        throw new Error(
          "No unscheduled eligible recall question; refusing to overwrite existing schedule",
        );
      await warmup.locator("summary").nth(index).click();
      const recallId = candidates[index];
      writeFileSync(`${directory}/recall-id.txt`, recallId);
      await warmup
        .locator('select[name="rating"]')
        .nth(index)
        .selectOption("wrong");
      await warmup
        .getByRole("button", { name: "Lưu lịch ôn" })
        .nth(index)
        .click();
      await expect
        .poll(
          async () =>
            (await backup()).data.recallReviews.find((r) => r.id === recallId)
              ?.rating,
        )
        .toBe("wrong");
      await page.reload();
      const afterRecall = (await backup()).data;
      const recall = afterRecall.recallReviews.find((r) => r.id === recallId)!;
      expect(
        new Date(recall.nextReviewAt).getTime() -
          new Date(recall.lastReviewedAt).getTime(),
      ).toBe(86400000);
      for (const key of [
        "missionProgress",
        "quizAttempts",
        "skillProgress",
      ] as const)
        expect(canon(afterRecall[key])).toBe(canon(before.data[key]));
      log("verification-report");
      await page.goto(`${base}/learn/week-01/mission-01`);
      const form = page.locator("#verification-pilot");
      await form.locator("textarea").fill('{"command":"unexpected"}');
      await form.getByRole("button").click();
      await expect(form.getByRole("alert")).toBeVisible();
      expect((await backup()).data.evidence).toEqual(before.data.evidence);
      const report = {
        schemaVersion: 1,
        missionId: "week-01-mission-01",
        generatedAt: new Date().toISOString(),
        checks: verificationMissions["week-01-mission-01"].checks.map((id) => ({
          id,
          status: "pass",
          evidence: "observed",
        })),
        overall: "pass",
      };
      writeFileSync(`${directory}/report.json`, JSON.stringify(report));
      await form.locator("textarea").fill(JSON.stringify(report));
      await form.getByRole("button").click();
      await expect(form.getByRole("status")).toContainText("Đã lưu report");
      const afterReport = (await backup()).data;
      for (const key of [
        "missionProgress",
        "quizAttempts",
        "skillProgress",
      ] as const)
        expect(canon(afterReport[key])).toBe(canon(before.data[key]));
      expect(afterReport.evidence.length).toBe(before.data.evidence.length + 1);
      const reportRow = afterReport.evidence.find(
        (row) => !before.data.evidence.some((old) => old.id === row.id),
      );
      expect(JSON.parse(reportRow!.content)).toEqual(report);
      writeFileSync(`${directory}/report-evidence-id.txt`, reportRow!.id);
      await page.goto(`${base}/evidence`);
      await expect(
        page.getByRole("heading", { name: /DX-Verify v1/ }).first(),
      ).toBeVisible();
      log("incident");
      await page.goto(`${base}/incidents/net-01`);
      for (const name of [
        "symptom",
        "evidence",
        "hypothesis",
        "test",
        "result",
        "rootCause",
        "fix",
        "verification",
        "regression",
      ])
        await page
          .locator(`textarea[name="${name}"]`)
          .fill(marker + " incomplete diagnosis");
      await page.getByRole("button", { name: "Nộp attempt" }).click();
      await expect
        .poll(async () => (await backup()).data.incidentAttempts.length)
        .toBe(before.data.incidentAttempts.length + 1);
      await page.reload();
      await page
        .locator("details")
        .filter({ hasText: marker })
        .locator("summary")
        .click();
      await expect(
        page
          .getByText(marker + " incomplete diagnosis", { exact: false })
          .first(),
      ).toBeVisible();
      const after = (await backup()).data;
      expect(
        after.incidentAttempts.find((a) => a.symptom.includes(marker))?.passed,
      ).toBe(false);
      expect(after.notes.some((n) => n.content === marker)).toBe(true);
      expect(after.bookmarks.length).toBe(before.data.bookmarks.length + 1);
      expect(errors).toEqual([]);
      console.log(
        "Notes/bookmarks across contexts, recall/no competence credit, strict report/evidence/no credit, failed incident/history, export PASS",
      );
    },
    async () => {
      log("cleanup-start");
      if (mutated) {
        const restoreContext = await browser.newContext();
        const restore = await restoreContext.newPage();
        await restore.goto(`${base}/settings`);
        await restore.locator('textarea[name="backup"]').fill(before.raw);
        await restore
          .locator('input[name="confirmation"]')
          .fill("IMPORT LEARNER BACKUP");
        await restore
          .getByRole("button", { name: "Validate and import" })
          .click();
        await expect(
          restore.getByText("Backup đã được validate và import thành công."),
        ).toBeVisible({ timeout: 30000 });
        const restored = (await backup()).data;
        assertRestored(before.data, restored, marker);
        await restore.goto(`${base}/readiness`);
        expect(await restore.locator("main").innerText()).toBe(readinessBefore);
        writeFileSync(
          `${directory}/after.json`,
          JSON.stringify(restored, null, 2),
        );
        console.log(
          "Validated UI import: all exported learner state restored PASS",
        );
        await restoreContext.close();
      }
      log("cleanup-pass");
      if (options.failCleanup)
        throw new Error("INJECTED cleanup failure after successful restore");
    },
    async () => {
      const closingErrors: unknown[] = [];
      try {
        await context?.tracing.stop({ path: `${directory}/trace.zip` });
      } catch (error) {
        closingErrors.push(error);
      }
      try {
        await browser.close();
      } catch (error) {
        closingErrors.push(error);
      }
      if (closingErrors.length)
        throw new AggregateError(closingErrors, "Trace/browser close failed");
    },
    (failure) => {
      const error = failure.error;
      console.error(
        `${failure.phase.toUpperCase()} FAILURE`,
        error instanceof Error ? error.stack : String(error),
      );
      appendFileSync(
        `${directory}/errors.log`,
        `${failure.phase.toUpperCase()} FAILURE\n${error instanceof Error ? error.stack : String(error)}\n`,
      );
    },
  );
  try {
    log(failures.length ? "PERSISTENCE SMOKE FAIL" : "PERSISTENCE SMOKE PASS");
  } catch (error) {
    failures.push({ phase: "diagnostics", error });
  }
  return { failures, directory, marker };
}
