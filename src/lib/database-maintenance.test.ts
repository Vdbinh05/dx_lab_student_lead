import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";
import { resetLearnerState, seedDatabase } from "@/lib/database-maintenance";

const temporaryDirectory = mkdtempSync(join(tmpdir(), "dx-lab-seed-test-"));
const databasePath = join(temporaryDirectory, "test.db");
const sqlite = new Database(databasePath);
for (const migration of [
  "prisma/migrations/20260827193000_init/migration.sql",
  "prisma/migrations/20260827203000_harden_progress/migration.sql",
  "prisma/migrations/20260827221500_full_roadmap_state/migration.sql",
    "prisma/migrations/20260915090000_recall_review/migration.sql",
])
  sqlite.exec(readFileSync(migration, "utf8"));
sqlite.close();

const databaseUrl = `file:${databasePath.replaceAll("\\", "/")}`;
const connect = () =>
  new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: databaseUrl }) });

afterAll(() => {
  if (temporaryDirectory.startsWith(tmpdir()))
    rmSync(temporaryDirectory, { recursive: true, force: true });
});

describe("database bootstrap, persistence and explicit reset", () => {
  it("preserves progress on repeated seed and only reset clears it", async () => {
    let prisma = connect();
    await seedDatabase(prisma);
    await prisma.missionProgress.create({
      data: {
        missionId: "w1-m1-linux-orientation",
        status: "IN_PROGRESS",
        completedSteps: '["learn"]',
      },
    });
    await prisma.evidence.create({
      data: {
        missionId: "w1-m1-linux-orientation",
        skillId: "linux",
        type: "terminal-output",
        title: "Persistent output",
        content: "pwd returned the expected training directory.",
      },
    });
    await prisma.missionNote.create({
      data: {
        missionId: "w1-m1-linux-orientation",
        content: "Persistent learner note.",
      },
    });
    await prisma.bookmark.create({
      data: {
        targetType: "lab",
        targetId: "w1-m1-linux-orientation:guided",
        label: "Linux guided lab",
      },
    });
    await seedDatabase(prisma);
    expect(await prisma.missionProgress.count()).toBe(1);
    expect(await prisma.evidence.count()).toBe(1);
    expect(await prisma.missionNote.count()).toBe(1);
    expect(await prisma.bookmark.count()).toBe(1);

    await prisma.$disconnect();
    prisma = connect();
    expect((await prisma.evidence.findFirst())?.title).toBe(
      "Persistent output",
    );
    expect((await prisma.missionNote.findFirst())?.content).toBe(
      "Persistent learner note.",
    );

    await resetLearnerState(prisma);
    expect(await prisma.missionProgress.count()).toBe(0);
    expect(await prisma.evidence.count()).toBe(0);
    expect(await prisma.missionNote.count()).toBe(0);
    expect(await prisma.bookmark.count()).toBe(0);
    expect(await prisma.skillProgress.count()).toBeGreaterThan(0);
    await prisma.$disconnect();
  });
});
