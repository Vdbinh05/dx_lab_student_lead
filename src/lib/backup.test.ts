import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";
import {
  createLearnerBackup,
  importLearnerBackup,
  parseLearnerBackup,
} from "@/lib/backup";
import { seedDatabase } from "@/lib/database-maintenance";

const temporaryDirectory = mkdtempSync(join(tmpdir(), "dx-lab-backup-test-"));
const databasePath = join(temporaryDirectory, "backup.db");
const databaseUrl = "file:" + databasePath.replaceAll("\\", "/");
const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: databaseUrl }),
});

beforeAll(async () => {
  const sqlite = new Database(databasePath);
  for (const migration of [
    "prisma/migrations/20260827193000_init/migration.sql",
    "prisma/migrations/20260827203000_harden_progress/migration.sql",
    "prisma/migrations/20260827221500_full_roadmap_state/migration.sql",
  ])
    sqlite.exec(readFileSync(migration, "utf8"));
  sqlite.close();
  await seedDatabase(prisma);
});

afterAll(async () => {
  await prisma.$disconnect();
  if (temporaryDirectory.startsWith(tmpdir()))
    rmSync(temporaryDirectory, { recursive: true, force: true });
});

describe("versioned learner backup", () => {
  it("exports bootstrap state through the libSQL adapter used by Turso", async () => {
    const libsql = new PrismaClient({
      adapter: new PrismaLibSql({ url: "file::memory:?cache=shared" }),
    });
    for (const migration of [
      "prisma/migrations/20260827193000_init/migration.sql",
      "prisma/migrations/20260827203000_harden_progress/migration.sql",
      "prisma/migrations/20260827221500_full_roadmap_state/migration.sql",
    ]) {
      const statements = readFileSync(migration, "utf8")
        .replace(/^--.*$/gm, "")
        .split(";")
        .map((statement) => statement.trim())
        .filter(Boolean);
      for (const statement of statements)
        await libsql.$executeRawUnsafe(statement);
    }
    try {
      await seedDatabase(libsql);
      const exported = await createLearnerBackup(libsql);
      expect(exported.learnerProfile.id).toBe("local-learner");
      expect(exported.skillProgress.length).toBeGreaterThan(0);
      expect(exported.missionProgress).toHaveLength(0);
    } finally {
      await libsql.$disconnect();
    }
  });

  it("round-trips progress, notes, bookmarks, settings, and weekly state", async () => {
    await prisma.missionProgress.create({
      data: {
        missionId: "w1-m1-linux-orientation",
        status: "IN_PROGRESS",
        completedSteps: '["learn","practice"]',
      },
    });
    await prisma.missionNote.create({
      data: {
        missionId: "w1-m1-linux-orientation",
        content: "Persistent note before export.",
      },
    });
    await prisma.bookmark.create({
      data: {
        targetType: "mission",
        targetId: "w1-m1-linux-orientation",
        label: "Week 1 Linux",
      },
    });
    await prisma.weeklyProgress.create({
      data: { week: 1, hardGatePassed: true, passedAt: new Date() },
    });
    const exported = await createLearnerBackup(prisma);
    const parsed = parseLearnerBackup(JSON.stringify(exported));

    await prisma.missionNote.update({
      where: { missionId: "w1-m1-linux-orientation" },
      data: { content: "Changed after export." },
    });
    await prisma.bookmark.deleteMany();
    await importLearnerBackup(prisma, parsed);

    expect(
      (
        await prisma.missionNote.findUnique({
          where: { missionId: "w1-m1-linux-orientation" },
        })
      )?.content,
    ).toBe("Persistent note before export.");
    expect(await prisma.bookmark.count()).toBe(1);
    expect(
      (await prisma.weeklyProgress.findUnique({ where: { week: 1 } }))
        ?.hardGatePassed,
    ).toBe(true);
    expect(await prisma.missionProgress.count()).toBe(1);
  });

  it("rejects malformed JSON and unknown curriculum references before import", async () => {
    expect(() => parseLearnerBackup("{not-json")).toThrow(
      "Backup không phải JSON hợp lệ",
    );
    const exported = await createLearnerBackup(prisma);
    exported.missionProgress[0].missionId = "unknown-mission";
    expect(() => parseLearnerBackup(JSON.stringify(exported))).toThrow(
      "Backup chứa mission không tồn tại",
    );
  });

  it("accepts known legacy skill rows so Week 1 backups remain restorable", async () => {
    const exported = await createLearnerBackup(prisma);
    exported.skillProgress.push({
      id: "identity",
      currentLevel: 0,
      targetLevel: 4,
      evidenceCount: 0,
      updatedAt: new Date().toISOString(),
    });
    expect(parseLearnerBackup(JSON.stringify(exported)).skillProgress).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "identity" })]),
    );
  });

  it("rejects invalid bookmark, oral-defense, and duplicate state references", async () => {
    const exported = await createLearnerBackup(prisma);
    exported.bookmarks = [
      {
        id: "invalid-bookmark",
        targetType: "lab",
        targetId: "w1-m1-linux-orientation:unknown",
        label: "Invalid lab",
        createdAt: new Date().toISOString(),
      },
    ];
    expect(() => parseLearnerBackup(JSON.stringify(exported))).toThrow(
      "Bookmark trỏ tới lab không tồn tại",
    );

    exported.bookmarks = [];
    exported.oralReflections = [
      {
        id: "invalid-reflection",
        questionId: "unknown-question",
        group: "Architecture",
        response: "A deliberately invalid curriculum reference.",
        confident: false,
        createdAt: new Date().toISOString(),
      },
    ];
    expect(() => parseLearnerBackup(JSON.stringify(exported))).toThrow(
      "Oral reflection không khớp curriculum",
    );

    exported.oralReflections = [];
    exported.weeklyProgress = [
      {
        week: 1,
        hardGatePassed: false,
        passedAt: null,
        updatedAt: new Date().toISOString(),
      },
      {
        week: 1,
        hardGatePassed: true,
        passedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    expect(() => parseLearnerBackup(JSON.stringify(exported))).toThrow(
      "Backup chứa weekly progress trùng lặp",
    );
  });
});
