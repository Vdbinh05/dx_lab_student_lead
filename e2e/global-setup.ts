import { mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

export default async function globalSetup() {
  const directory = path.join(process.cwd(), "artifacts", "e2e");
  const databasePath = path.resolve(directory, "training.db");
  if (!databasePath.startsWith(path.resolve(process.cwd(), "artifacts", "e2e")))
    throw new Error("Refusing to prepare E2E database outside artifacts/e2e");
  mkdirSync(directory, { recursive: true });
  rmSync(databasePath, { force: true });
  const sqlite = new Database(databasePath);
  for (const migration of [
    "prisma/migrations/20260827193000_init/migration.sql",
    "prisma/migrations/20260827203000_harden_progress/migration.sql",
    "prisma/migrations/20260827221500_full_roadmap_state/migration.sql",
  ])
    sqlite.exec(readFileSync(migration, "utf8"));
  const now = new Date().toISOString();
  sqlite
    .prepare(
      "INSERT INTO LearnerProfile (id, name, updatedAt) VALUES (?, ?, ?)",
    )
    .run("local-learner", "SV1 Learner", now);
  sqlite
    .prepare(
      "INSERT INTO AppSettings (id, acceleratedMode, dailyStudyMinutes, currentWeek, currentMission) VALUES (?, ?, ?, ?, ?)",
    )
    .run(
      "local-settings",
      0,
      240,
      1,
      "w1-m1-linux-orientation",
    );
  sqlite.close();
}
