import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const port = Number.parseInt(process.env.DXLAB_SMOKE_PORT ?? "3200", 10);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error("DXLAB_SMOKE_PORT must be an integer from 1024 to 65535");

const volumeName = `dx_lab_sv1_training_smoke_${Date.now()}`;
if (volumeName === "dx_lab_sv1_training_data")
  throw new Error("Refusing to use the default learner volume");

const baseUrl = `http://127.0.0.1:${port}`;
const environment = {
  ...process.env,
  COMPOSE_PROJECT_NAME: volumeName,
  APP_PORT: String(port),
  TRAINING_VOLUME_NAME: volumeName,
};
const artifactDirectory = path.join(process.cwd(), "artifacts", "docker-smoke");
const backupPath = path.join(artifactDirectory, `${volumeName}.json`);

function compose(args: string[], capture = false) {
  return execFileSync("docker", ["compose", ...args], {
    cwd: process.cwd(),
    env: environment,
    encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });
}

async function waitForHealth() {
  const deadline = Date.now() + 120_000;
  let lastError = "not attempted";
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`, { cache: "no-store" });
      const body = (await response.json()) as { status?: string; version?: string };
      if (response.ok && body.status === "ok" && body.version) return body;
      lastError = `HTTP ${response.status}: ${JSON.stringify(body)}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error(`Docker health timeout: ${lastError}`);
}

type Backup = {
  format: string;
  notes: Array<{ missionId: string; content: string }>;
  missionProgress: unknown[];
  evidence: unknown[];
  quizAttempts: unknown[];
  incidentAttempts: unknown[];
  bookmarks: unknown[];
  weeklyProgress: unknown[];
  oralReflections: unknown[];
};

async function exportBackup() {
  const response = await fetch(`${baseUrl}/api/backup`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Backup export failed: HTTP ${response.status}`);
  const text = await response.text();
  const backup = JSON.parse(text) as Backup;
  if (backup.format !== "dx-lab-sv1-learner-backup")
    throw new Error("Backup export returned the wrong format");
  return { text, backup };
}

function hasSmokeNote(backup: Backup) {
  return backup.notes.some(
    (note) =>
      note.missionId === "w1-m1-linux-orientation" &&
      note.content === "Docker persistence smoke evidence.",
  );
}

function assertClean(backup: Backup) {
  for (const key of [
    "missionProgress",
    "evidence",
    "quizAttempts",
    "incidentAttempts",
    "notes",
    "bookmarks",
    "weeklyProgress",
    "oralReflections",
  ] as const)
    if (backup[key].length !== 0)
      throw new Error(`Isolated reset left ${key} records behind`);
}

async function importThroughSettings(backupText: string) {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(`${baseUrl}/settings`);
    await page.locator('textarea[name="backup"]').fill(backupText);
    await page
      .locator('input[name="confirmation"]')
      .fill("IMPORT LEARNER BACKUP");
    await page.getByRole("button", { name: "Validate and import" }).click();
    await page
      .getByText("Backup đã được validate và import thành công.")
      .waitFor({ state: "visible" });
  } finally {
    await browser.close();
  }
}

async function main() {
  mkdirSync(artifactDirectory, { recursive: true });
  console.log(`Docker smoke volume: ${volumeName}`);
  console.log(`Docker smoke URL: ${baseUrl}`);
  try {
    compose(["build"]);
    compose(["up", "-d"]);
    const health = await waitForHealth();
    console.log(`Health PASS: ${JSON.stringify(health)}`);
    const dashboard = await fetch(baseUrl);
    if (!dashboard.ok || !(await dashboard.text()).includes("DX-Lab SV1 Training OS"))
      throw new Error("Application-open smoke check failed");

    const insertNote = [
      "const Database=require('better-sqlite3')",
      "const db=new Database('/data/training.db')",
      "const now=new Date().toISOString()",
      "db.prepare('INSERT INTO MissionNote (id,missionId,content,createdAt,updatedAt) VALUES (?,?,?,?,?)').run('docker-smoke-note','w1-m1-linux-orientation','Docker persistence smoke evidence.',now,now)",
      "db.close()",
    ].join(";");
    compose(["exec", "-T", "app", "node", "-e", insertNote]);
    const exported = await exportBackup();
    if (!hasSmokeNote(exported.backup))
      throw new Error("Created smoke note is missing from export");
    writeFileSync(backupPath, exported.text, "utf8");
    console.log(`Backup export PASS: ${backupPath}`);

    compose(["restart", "app"]);
    await waitForHealth();
    const afterRestart = await exportBackup();
    if (!hasSmokeNote(afterRestart.backup))
      throw new Error("Learner state did not survive container restart");
    console.log("Persistent-volume restart PASS");

    compose(["exec", "-T", "app", "npm", "run", "db:reset", "--", "--yes"]);
    assertClean((await exportBackup()).backup);
    console.log("Isolated explicit reset PASS");

    await importThroughSettings(exported.text);
    if (!hasSmokeNote((await exportBackup()).backup))
      throw new Error("Imported backup did not restore smoke progress");
    console.log("Validated UI import/restore PASS");

    compose(["exec", "-T", "app", "npm", "run", "db:reset", "--", "--yes"]);
    assertClean((await exportBackup()).backup);
    console.log("Final isolated learner state is clean");
    console.log("DOCKER DEPLOYMENT SMOKE PASS");
  } catch (error) {
    try {
      console.error(compose(["logs", "--tail=150", "app"], true));
    } catch {
      // Preserve the original failure when the engine itself is unavailable.
    }
    throw error;
  } finally {
    try {
      compose(["down"]);
    } catch {
      // The uniquely named volume is intentionally never deleted automatically.
    }
    console.log(`Smoke volume retained clean for inspection: ${volumeName}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

