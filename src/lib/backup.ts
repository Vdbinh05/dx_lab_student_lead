import { z } from "zod";
import type { PrismaClient } from "@/generated/prisma/client";
import { applicationVersion } from "@/lib/app-version";
import {
  getAllMissions,
  getIncidents,
  getOralDefenseQuestions,
} from "@/lib/curriculum";
import { legacySkillIds, skillTargets } from "@/lib/database-maintenance";
import {
  bookmarkTargetTypes,
  evidenceTypes,
  missionStatuses,
  missionSteps,
} from "@/lib/types";

const id = z.string().min(1).max(200);
const date = z.string().datetime();
const nullableDate = date.nullable();

export const learnerBackupSchema = z
  .object({
    format: z.literal("dx-lab-sv1-learner-backup"),
    schemaVersion: z.literal(1),
    applicationVersion: z.string().min(1).max(40),
    exportedAt: date,
    learnerProfile: z
      .object({
        id: z.literal("local-learner"),
        name: z.string().min(1).max(120),
        createdAt: date,
        updatedAt: date,
      })
      .strict(),
    missionProgress: z.array(
      z
        .object({
          id,
          missionId: id,
          status: z.enum(missionStatuses),
          completedSteps: z.string().max(2000),
          startedAt: nullableDate,
          completedAt: nullableDate,
          score: z.number().int().min(0).max(100).nullable(),
          notes: z.string().max(2000).nullable(),
          hardGatePassed: z.boolean(),
          updatedAt: date,
        })
        .strict(),
    ),
    evidence: z.array(
      z
        .object({
          id,
          missionId: id,
          skillId: id.nullable(),
          type: z.enum(evidenceTypes),
          title: z.string().min(1).max(120),
          content: z.string().min(1).max(10000),
          url: z.string().url().max(2048).nullable(),
          createdAt: date,
        })
        .strict(),
    ),
    quizAttempts: z.array(
      z
        .object({
          id,
          quizId: id,
          missionId: id,
          score: z.number().int().min(0).max(100),
          passed: z.boolean(),
          answers: z.string().max(100000),
          createdAt: date,
        })
        .strict(),
    ),
    incidentAttempts: z.array(
      z
        .object({
          id,
          incidentId: id,
          symptom: z.string().max(3000),
          evidence: z.string().max(5000),
          hypothesis: z.string().max(3000),
          test: z.string().max(3000),
          result: z.string().max(3000),
          rootCause: z.string().max(3000),
          fix: z.string().max(3000),
          verification: z.string().max(5000),
          regression: z.string().max(5000),
          assisted: z.boolean(),
          assistanceLevel: z.enum(["NONE", "HINT_1", "HINT_2", "SOLUTION"]),
          passed: z.boolean(),
          createdAt: date,
        })
        .strict(),
    ),
    skillProgress: z.array(
      z
        .object({
          id,
          currentLevel: z.number().int().min(0).max(4),
          targetLevel: z.number().int().min(0).max(4),
          evidenceCount: z.number().int().min(0),
          updatedAt: date,
        })
        .strict(),
    ),
    settings: z
      .object({
        id: z.literal("local-settings"),
        acceleratedMode: z.boolean(),
        dailyStudyMinutes: z.number().int().refine((value) =>
          [120, 240, 360, 480].includes(value),
        ),
        currentWeek: z.number().int().min(1).max(8),
        currentMission: id,
      })
      .strict(),
    notes: z.array(
      z
        .object({
          id,
          missionId: id,
          content: z.string().min(1).max(20000),
          createdAt: date,
          updatedAt: date,
        })
        .strict(),
    ),
    bookmarks: z.array(
      z
        .object({
          id,
          targetType: z.enum(bookmarkTargetTypes),
          targetId: id,
          label: z.string().min(1).max(160),
          createdAt: date,
        })
        .strict(),
    ),
    weeklyProgress: z.array(
      z
        .object({
          week: z.number().int().min(1).max(8),
          hardGatePassed: z.boolean(),
          passedAt: nullableDate,
          updatedAt: date,
        })
        .strict(),
    ),
    oralReflections: z.array(
      z
        .object({
          id,
          questionId: id,
          group: z.string().min(1).max(80),
          response: z.string().min(1).max(10000),
          confident: z.boolean(),
          createdAt: date,
        })
        .strict(),
    ),
  })
  .strict();

export type LearnerBackup = z.infer<typeof learnerBackupSchema>;

function toIso(value: Date | null) {
  return value?.toISOString() ?? null;
}

export async function createLearnerBackup(prisma: PrismaClient): Promise<LearnerBackup> {
  const [
    learnerProfile,
    missionProgress,
    evidence,
    quizAttempts,
    incidentAttempts,
    skillProgress,
    settings,
    notes,
    bookmarks,
    weeklyProgress,
    oralReflections,
  ] = await Promise.all([
    prisma.learnerProfile.upsert({
      where: { id: "local-learner" },
      update: {},
      create: { id: "local-learner" },
    }),
    prisma.missionProgress.findMany(),
    prisma.evidence.findMany(),
    prisma.quizAttempt.findMany(),
    prisma.incidentAttempt.findMany(),
    prisma.skillProgress.findMany(),
    prisma.appSettings.upsert({
      where: { id: "local-settings" },
      update: {},
      create: { id: "local-settings" },
    }),
    prisma.missionNote.findMany(),
    prisma.bookmark.findMany(),
    prisma.weeklyProgress.findMany(),
    prisma.oralReflection.findMany(),
  ]);
  return learnerBackupSchema.parse({
    format: "dx-lab-sv1-learner-backup",
    schemaVersion: 1,
    applicationVersion,
    exportedAt: new Date().toISOString(),
    learnerProfile: {
      ...learnerProfile,
      createdAt: learnerProfile.createdAt.toISOString(),
      updatedAt: learnerProfile.updatedAt.toISOString(),
    },
    missionProgress: missionProgress.map((row) => ({
      ...row,
      startedAt: toIso(row.startedAt),
      completedAt: toIso(row.completedAt),
      updatedAt: row.updatedAt.toISOString(),
    })),
    evidence: evidence.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() })),
    quizAttempts: quizAttempts.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    })),
    incidentAttempts: incidentAttempts.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    })),
    skillProgress: skillProgress.map((row) => ({
      ...row,
      updatedAt: row.updatedAt.toISOString(),
    })),
    settings,
    notes: notes.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    })),
    bookmarks: bookmarks.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    })),
    weeklyProgress: weeklyProgress.map((row) => ({
      ...row,
      passedAt: toIso(row.passedAt),
      updatedAt: row.updatedAt.toISOString(),
    })),
    oralReflections: oralReflections.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    })),
  });
}

export function parseLearnerBackup(raw: string): LearnerBackup {
  if (raw.length > 4_000_000) throw new Error("Backup vượt giới hạn 4 MB");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    throw new Error("Backup không phải JSON hợp lệ");
  }
  const backup = learnerBackupSchema.parse(parsed);
  const missions = getAllMissions();
  const missionIds = new Set(missions.map((mission) => mission.id));
  const incidentIds = new Set(getIncidents().map((incident) => incident.id));
  const skillIds = new Set<string>([
    ...skillTargets.map(([skillId]) => skillId),
    ...legacySkillIds,
  ]);
  const oralQuestions = new Map(
    getOralDefenseQuestions().map((question) => [question.id, question.group]),
  );
  const validMissionReference = (missionId: string) =>
    missionIds.has(missionId) || /^week-0[1-8]$/.test(missionId);

  const assertUnique = <T>(
    rows: T[],
    key: (row: T) => string,
    label: string,
  ) => {
    const values = rows.map(key);
    if (new Set(values).size !== values.length)
      throw new Error(`Backup chứa ${label} trùng lặp`);
  };
  assertUnique(backup.missionProgress, (row) => row.id, "mission progress ID");
  assertUnique(backup.evidence, (row) => row.id, "evidence ID");
  assertUnique(backup.quizAttempts, (row) => row.id, "quiz attempt ID");
  assertUnique(backup.incidentAttempts, (row) => row.id, "incident attempt ID");
  assertUnique(backup.skillProgress, (row) => row.id, "skill ID");
  assertUnique(backup.notes, (row) => row.id, "note ID");
  assertUnique(backup.bookmarks, (row) => row.id, "bookmark ID");
  assertUnique(backup.oralReflections, (row) => row.id, "oral reflection ID");
  assertUnique(backup.missionProgress, (row) => row.missionId, "mission progress");
  assertUnique(backup.notes, (row) => row.missionId, "mission note");
  assertUnique(
    backup.bookmarks,
    (row) => `${row.targetType}:${row.targetId}`,
    "bookmark target",
  );
  assertUnique(backup.weeklyProgress, (row) => String(row.week), "weekly progress");

  for (const row of backup.missionProgress)
    if (!missionIds.has(row.missionId))
      throw new Error(`Backup chứa mission không tồn tại: ${row.missionId}`);
    else {
      let steps: unknown;
      try {
        steps = JSON.parse(row.completedSteps) as unknown;
      } catch {
        throw new Error(`Mission progress có completedSteps không hợp lệ: ${row.missionId}`);
      }
      if (
        !Array.isArray(steps) ||
        steps.some(
          (step) =>
            typeof step !== "string" ||
            !(missionSteps as readonly string[]).includes(step),
        )
      )
        throw new Error(`Mission progress có completedSteps không hợp lệ: ${row.missionId}`);
    }
  for (const row of backup.evidence)
    if (!missionIds.has(row.missionId))
      throw new Error(`Evidence trỏ tới mission không tồn tại: ${row.missionId}`);
    else if (row.skillId && !skillIds.has(row.skillId))
      throw new Error(`Evidence trỏ tới skill không tồn tại: ${row.skillId}`);
  for (const row of backup.notes)
    if (!missionIds.has(row.missionId))
      throw new Error(`Note trỏ tới mission không tồn tại: ${row.missionId}`);
  for (const row of backup.quizAttempts)
    if (!validMissionReference(row.missionId))
      throw new Error(`Quiz trỏ tới curriculum không tồn tại: ${row.missionId}`);
  for (const row of backup.incidentAttempts)
    if (!incidentIds.has(row.incidentId))
      throw new Error(`Incident không tồn tại: ${row.incidentId}`);
  for (const row of backup.skillProgress)
    if (!skillIds.has(row.id)) throw new Error(`Skill không tồn tại: ${row.id}`);
  for (const row of backup.bookmarks) {
    if (row.targetType === "mission" && !missionIds.has(row.targetId))
      throw new Error(`Bookmark trỏ tới mission không tồn tại: ${row.targetId}`);
    if (row.targetType === "incident" && !incidentIds.has(row.targetId))
      throw new Error(`Bookmark trỏ tới incident không tồn tại: ${row.targetId}`);
    if (row.targetType === "lab") {
      const [missionId, kind, extra] = row.targetId.split(":");
      if (
        extra ||
        !missionIds.has(missionId) ||
        !["guided", "independent", "integration"].includes(kind ?? "")
      )
        throw new Error(`Bookmark trỏ tới lab không tồn tại: ${row.targetId}`);
    }
  }
  for (const row of backup.oralReflections)
    if (oralQuestions.get(row.questionId) !== row.group)
      throw new Error(`Oral reflection không khớp curriculum: ${row.questionId}`);
  if (!missionIds.has(backup.settings.currentMission))
    throw new Error("Settings.currentMission không tồn tại");
  return backup;
}

export async function importLearnerBackup(prisma: PrismaClient, backup: LearnerBackup) {
  await prisma.$transaction(async (transaction) => {
    await transaction.oralReflection.deleteMany();
    await transaction.weeklyProgress.deleteMany();
    await transaction.bookmark.deleteMany();
    await transaction.missionNote.deleteMany();
    await transaction.incidentAssistance.deleteMany();
    await transaction.incidentAttempt.deleteMany();
    await transaction.quizAttempt.deleteMany();
    await transaction.evidence.deleteMany();
    await transaction.missionProgress.deleteMany();
    await transaction.skillProgress.deleteMany();
    await transaction.learnerProfile.upsert({
      where: { id: "local-learner" },
      update: { name: backup.learnerProfile.name },
      create: { id: "local-learner", name: backup.learnerProfile.name },
    });
    await transaction.appSettings.upsert({
      where: { id: "local-settings" },
      update: backup.settings,
      create: backup.settings,
    });
    if (backup.missionProgress.length)
      await transaction.missionProgress.createMany({
        data: backup.missionProgress.map((row) => ({
          ...row,
          startedAt: row.startedAt ? new Date(row.startedAt) : null,
          completedAt: row.completedAt ? new Date(row.completedAt) : null,
          updatedAt: new Date(row.updatedAt),
        })),
      });
    if (backup.evidence.length)
      await transaction.evidence.createMany({
        data: backup.evidence.map((row) => ({
          ...row,
          createdAt: new Date(row.createdAt),
        })),
      });
    if (backup.quizAttempts.length)
      await transaction.quizAttempt.createMany({
        data: backup.quizAttempts.map((row) => ({
          ...row,
          createdAt: new Date(row.createdAt),
        })),
      });
    if (backup.incidentAttempts.length)
      await transaction.incidentAttempt.createMany({
        data: backup.incidentAttempts.map((row) => ({
          ...row,
          createdAt: new Date(row.createdAt),
        })),
      });
    if (backup.skillProgress.length)
      await transaction.skillProgress.createMany({
        data: backup.skillProgress.map((row) => ({
          ...row,
          updatedAt: new Date(row.updatedAt),
        })),
      });
    if (backup.notes.length)
      await transaction.missionNote.createMany({
        data: backup.notes.map((row) => ({
          ...row,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
        })),
      });
    if (backup.bookmarks.length)
      await transaction.bookmark.createMany({
        data: backup.bookmarks.map((row) => ({
          ...row,
          createdAt: new Date(row.createdAt),
        })),
      });
    if (backup.weeklyProgress.length)
      await transaction.weeklyProgress.createMany({
        data: backup.weeklyProgress.map((row) => ({
          ...row,
          passedAt: row.passedAt ? new Date(row.passedAt) : null,
          updatedAt: new Date(row.updatedAt),
        })),
      });
    if (backup.oralReflections.length)
      await transaction.oralReflection.createMany({
        data: backup.oralReflections.map((row) => ({
          ...row,
          createdAt: new Date(row.createdAt),
        })),
      });
  });
}
