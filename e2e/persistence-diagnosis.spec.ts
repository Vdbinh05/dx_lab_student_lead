import { expect, test } from "@playwright/test";
import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import path from "node:path";
import { runPersistenceSmoke } from "../scripts/persistence-smoke";
import { getAllMissions } from "../src/lib/curriculum";
import { recallItems } from "../src/lib/recall";

test.describe.configure({ mode: "serial" });
test.use({ trace: "off" });
let recallFixtureCreated = false;
let assistanceFixtureCreated = false;

test.afterAll(() => {
  const expected = `file:${path.join(process.cwd(), "artifacts", "e2e", "training.db").replaceAll("\\", "/")}`;
  expect(process.env.DATABASE_URL).toBe(expected);
  const db = new Database(expected.slice(5));
  try {
    db.prepare("DELETE FROM MissionProgress WHERE id=?").run(
      "diagnosis-fixture",
    );
    for (const id of ["retained-note", "retained-m1-note"])
      db.prepare("DELETE FROM MissionNote WHERE id=?").run(id);
    if (recallFixtureCreated)
      db.prepare("DELETE FROM RecallReview WHERE id=?").run(
        recallItems(getAllMissions())[0].id,
      );
    if (assistanceFixtureCreated)
      db.prepare("DELETE FROM IncidentAssistance WHERE incidentId=?").run(
        "net-01",
      );
  } finally {
    db.close();
  }
});
test.beforeAll(() => {
  const expected = `file:${path.join(process.cwd(), "artifacts", "e2e", "training.db").replaceAll("\\", "/")}`;
  expect(process.env.DATABASE_URL).toBe(expected);
  expect(process.env.TURSO_DATABASE_URL || "").toBe("");
  const db = new Database(expected.slice(5));
  try {
    db.prepare(
      "INSERT INTO MissionProgress (id,missionId,status,completedSteps,updatedAt) VALUES (?,?,?,?,?)",
    ).run(
      "diagnosis-fixture",
      "w1-m1-linux-orientation",
      "IN_PROGRESS",
      '["learn","quiz","practice"]',
      new Date().toISOString(),
    );
    db.prepare(
      "INSERT INTO MissionNote (id,missionId,content,createdAt,updatedAt) VALUES (?,?,?,?,?)",
    ).run(
      "retained-note",
      "w1-m2-files-permissions-env",
      "Existing learner content must survive",
      new Date().toISOString(),
      new Date().toISOString(),
    );
  } finally {
    db.close();
  }
});

test("reproduce old unscoped selector locally, preserving its exception and restoring data", async ({
  baseURL,
}) => {
  test.setTimeout(120000);
  const result = await runPersistenceSmoke({
    baseUrl: baseURL!,
    reproduceOldSelector: true,
  });
  expect(result.failures.map((f) => f.phase)).toEqual(["smoke"]);
  expect(String(result.failures[0].error)).toContain("toHaveValue");
  const log = readFileSync(`${result.directory}/errors.log`, "utf8");
  expect(log).toContain('textarea[name="content"]');
  expect(log).toContain("Received");
  expect(readFileSync(`${result.directory}/stages.log`, "utf8")).toContain(
    "cleanup-pass",
  );
});

test("corrected persistence smoke passes and restores complete learner state", async ({
  baseURL,
}) => {
  test.setTimeout(180000);
  const result = await runPersistenceSmoke({ baseUrl: baseURL! });
  expect(
    result.failures.map((f) => ({ phase: f.phase, error: String(f.error) })),
  ).toEqual([]);
});

test("original and cleanup errors both survive after real writes and validated restore", async ({
  baseURL,
}) => {
  test.setTimeout(120000);
  const result = await runPersistenceSmoke({
    baseUrl: baseURL!,
    failSmoke: true,
    failCleanup: true,
  });
  expect(result.failures.map((f) => f.phase)).toEqual(["smoke", "cleanup"]);
  const log = readFileSync(`${result.directory}/errors.log`, "utf8");
  expect(log).toContain("INJECTED original smoke failure after writes");
  expect(log).toContain("INJECTED cleanup failure after successful restore");
  expect(readFileSync(`${result.directory}/after.json`, "utf8")).not.toContain(
    result.marker,
  );
});

test("existing M1 note and recall survive; probes select unused records", async ({
  baseURL,
}) => {
  test.setTimeout(180000);
  const db = new Database(process.env.DATABASE_URL!.slice(5));
  try {
    const now = new Date().toISOString();
    db.prepare(
      "INSERT INTO MissionNote (id,missionId,content,createdAt,updatedAt) VALUES (?,?,?,?,?)",
    ).run(
      "retained-m1-note",
      "w1-m1-linux-orientation",
      "Keep the original M1 note",
      now,
      now,
    );
    db.prepare(
      "INSERT INTO RecallReview (id,lastReviewedAt,nextReviewAt,reviewCount,streak,rating) VALUES (?,?,?,?,?,?)",
    ).run(
      recallItems(getAllMissions())[0].id,
      now,
      new Date(Date.now() + 7 * 86400000).toISOString(),
      1,
      1,
      "correct",
    );
    recallFixtureCreated = true;
  } finally {
    db.close();
  }
  const result = await runPersistenceSmoke({ baseUrl: baseURL! });
  expect(
    result.failures.map((f) => ({ phase: f.phase, error: String(f.error) })),
  ).toEqual([]);
  const after = JSON.parse(
    readFileSync(`${result.directory}/after.json`, "utf8"),
  );
  expect(
    after.notes.find((n: { id: string }) => n.id === "retained-m1-note")
      .content,
  ).toBe("Keep the original M1 note");
});

test("existing incident assistance aborts before any test mutation", async ({
  baseURL,
}) => {
  test.setTimeout(60000);
  const db = new Database(process.env.DATABASE_URL!.slice(5));
  try {
    db.prepare(
      "INSERT INTO IncidentAssistance (incidentId,level,updatedAt) VALUES (?,?,?)",
    ).run("net-01", "HINT_1", new Date().toISOString());
    assistanceFixtureCreated = true;
  } finally {
    db.close();
  }
  const result = await runPersistenceSmoke({ baseUrl: baseURL! });
  expect(result.failures.map((f) => f.phase)).toEqual(["smoke"]);
  expect(String(result.failures[0].error)).toContain(
    "refusing to change learner hint state",
  );
  expect(readFileSync(`${result.directory}/stages.log`, "utf8")).not.toContain(
    "write-note",
  );
  const check = new Database(process.env.DATABASE_URL!.slice(5));
  try {
    expect(
      check
        .prepare("SELECT level FROM IncidentAssistance WHERE incidentId=?")
        .get("net-01"),
    ).toEqual({ level: "HINT_1" });
  } finally {
    check.close();
  }
});
