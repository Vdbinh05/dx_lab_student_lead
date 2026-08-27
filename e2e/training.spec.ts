import { expect, test } from "@playwright/test";
import Database from "better-sqlite3";
import { getAllMissions } from "../src/lib/curriculum";

function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required for E2E");
  return new Database(url.replace(/^file:/, ""));
}

test.describe.serial("critical learner flows", () => {
  test("fresh learner opens Today and the first mission", async ({ page }) => {
    await page.goto("/today");
    await expect(page.getByRole("heading", { name: /Week 1 · Mission 01/ })).toBeVisible();
    await page.getByRole("link", { name: "Open Mission 1" }).click();
    await expect(page).toHaveURL(/\/learn\/week-01\/mission-01$/);
    await expect(page.getByRole("heading", { name: "Linux Orientation" })).toBeVisible();
  });

  test("mission execution, evidence, quiz, and hard gate produce PASS", async ({ page }) => {
    await page.goto("/learn/week-01/mission-01");
    await page.getByRole("button", { name: "Bắt đầu mission" }).click();
    for (const step of ["Learn", "Practice", "Build", "Break", "Debug"])
      await page.getByRole("button", { name: new RegExp("^" + step) }).click();

    const evidence = page.locator("section").filter({ hasText: "Evidence vault" });
    for (const [type, title, content] of [
      [
        "terminal-output",
        "Linux orientation commands",
        "pwd and ls -la show the expected absolute training path and files.",
      ],
      [
        "explanation",
        "Absolute path explanation",
        "An absolute path starts from root and stays unambiguous across working directories.",
      ],
    ]) {
      await evidence.locator('select[name="type"]').selectOption(type);
      await evidence.locator('input[name="title"]').fill(title);
      await evidence.locator('textarea[name="content"]').fill(content);
      await evidence.getByRole("button", { name: "Lưu evidence" }).click();
      await expect(evidence.getByText("Evidence đã được lưu")).toBeVisible();
    }

    await page.getByLabel("pwd", { exact: true }).check();
    await page.getByLabel("/home/sv1/runbook.md", { exact: true }).check();
    await page.locator('textarea[name="q3"]').fill("..");
    await page.locator('textarea[name="q4"]').fill(
      "I verify the current directory before running commands so evidence and paths stay reproducible.",
    );
    await page.getByLabel("pwd và ls -la", { exact: true }).check();
    await page.getByRole("button", { name: "Nộp quiz" }).click();
    await expect(page.getByText(/Quiz 100% · PASS/)).toBeVisible();
    await page.reload();
    await page.getByRole("button", { name: "Chốt PASS Mission" }).click();
    await expect(page).toHaveURL(/\/today$/);

    await page.goto("/learn/week-01/mission-01");
    await expect(page.getByText("PASSED", { exact: true }).first()).toBeVisible();
  });

  test("future content remains readable but locked for PASS", async ({ page }) => {
    await page.goto("/learn/week-02/mission-01-docker-image-container");
    await expect(page.getByText("AVAILABLE TO READ · LOCKED FOR PASS").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Docker Image/ })).toBeVisible();
  });

  test("assisted Boss Fight is persisted and cannot clean-pass", async ({ page }) => {
    await page.goto("/incidents/net-01");
    await page.getByRole("button", { name: "Open Hint 1" }).click();
    await expect(page.getByText("ASSISTANCE: HINT_1")).toBeVisible();
    const values: Record<string, string> = {
      symptom: "Browser cannot connect to localhost port 8000 after Compose starts.",
      evidence: "docker compose config and ss show the service listens on 8001.",
      hypothesis: "The Compose target port differs from the process listener.",
      test: "Run docker compose config and ss, then curl the mapped host port.",
      result: "Compose targets 8000 while the process listener is on 8001.",
      rootCause: "Backend listens on 8001 but the Compose mapping targets 8000.",
      fix: "Change the Compose mapping target to 8001 and restart the service.",
      verification: "curl localhost:8000 returns 200 and the health response passes.",
      regression: "Portal caller, health command, logs, and documented smoke flow pass again.",
    };
    for (const [name, value] of Object.entries(values))
      await page.locator('textarea[name="' + name + '"]').fill(value);
    await page.getByRole("button", { name: "Nộp attempt" }).click();
    await expect(page.getByText(/ASSISTED \/ FAIL/).first()).toBeVisible();
  });

  test("weekly gate commits only after all required signals exist", async ({ page }) => {
    const sqlite = connect();
    const weekOne = getAllMissions().filter((mission) => mission.week === 1);
    const now = new Date().toISOString();
    const upsertMission = sqlite.prepare(
      "INSERT INTO MissionProgress (id, missionId, status, completedSteps, completedAt, hardGatePassed, updatedAt) " +
        "VALUES (?, ?, 'PASSED', '[]', ?, 1, ?) " +
        "ON CONFLICT(missionId) DO UPDATE SET status = 'PASSED', hardGatePassed = 1, completedAt = excluded.completedAt, updatedAt = excluded.updatedAt",
    );
    for (const mission of weekOne)
      upsertMission.run("e2e-progress-" + mission.order, mission.id, now, now);
    sqlite
      .prepare(
        "INSERT INTO QuizAttempt (id, quizId, missionId, score, passed, answers) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .run("e2e-weekly-quiz", "week-01-weekly", "week-01", 100, 1, "{}");
    sqlite
      .prepare(
        "INSERT INTO IncidentAttempt (id, incidentId, symptom, evidence, hypothesis, test, result, rootCause, fix, verification, regression, assisted, assistanceLevel, passed) " +
          "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .run(
        "e2e-clean-incident",
        "net-01",
        "Complete isolated incident symptom.",
        "compose config and ss listener evidence.",
        "Port mapping mismatch hypothesis.",
        "compose config and ss comparison test.",
        "The target and listener differ.",
        "Compose target is 8000 while listener is 8001.",
        "Align target port with the process listener.",
        "curl returns 200 and health passes.",
        "Portal and documented smoke checks pass.",
        0,
        "NONE",
        1,
      );
    sqlite.close();

    await page.goto("/weeks/1/review");
    await expect(page.getByText("YES · READY TO COMMIT")).toBeVisible();
    await page.getByRole("button", { name: "Commit Week Gate" }).click();
    await expect(page).toHaveURL(/\/weeks\/2$/);
    await expect(page.getByText("UNLOCKED FOR PASS").first()).toBeVisible();
  });

  test("backup export, confirmed import, and final readiness are available", async ({ page }) => {
    const sqlite = connect();
    const now = new Date().toISOString();
    sqlite
      .prepare(
        "INSERT INTO MissionNote (id, missionId, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?) " +
          "ON CONFLICT(missionId) DO UPDATE SET content = excluded.content, updatedAt = excluded.updatedAt",
      )
      .run(
        "e2e-backup-note",
        "w1-m1-linux-orientation",
        "Note captured in the exported learner backup.",
        now,
        now,
      );
    sqlite.close();

    await page.goto("/settings");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("link", { name: "Export learner backup JSON" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^dx-lab-sv1-backup-.*\.json$/);
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    const backupText = Buffer.concat(chunks).toString("utf8");
    const backup = JSON.parse(backupText) as {
      format: string;
      weeklyProgress: Array<{ week: number }>;
    };
    expect(backup.format).toBe("dx-lab-sv1-learner-backup");
    expect(backup.weeklyProgress.some((item) => item.week === 1)).toBe(true);

    const changedSqlite = connect();
    changedSqlite
      .prepare("UPDATE MissionNote SET content = ? WHERE missionId = ?")
      .run("State changed after export.", "w1-m1-linux-orientation");
    changedSqlite.close();
    await page.locator('textarea[name="backup"]').fill(backupText);
    await page
      .locator('input[name="confirmation"]')
      .fill("IMPORT LEARNER BACKUP");
    await page.getByRole("button", { name: "Validate and import" }).click();
    await expect(
      page.getByText("Backup đã được validate và import thành công."),
    ).toBeVisible();
    const restoredSqlite = connect();
    const restoredNote = restoredSqlite
      .prepare("SELECT content FROM MissionNote WHERE missionId = ?")
      .get("w1-m1-linux-orientation") as { content: string };
    restoredSqlite.close();
    expect(restoredNote.content).toBe(
      "Note captured in the exported learner backup.",
    );

    await page.goto("/readiness");
    await expect(page.getByText("NOT READY", { exact: true })).toBeVisible();
    await expect(page.getByText("1/8", { exact: true }).first()).toBeVisible();
  });
});
