import "dotenv/config";
import { createLearnerBackup } from "../src/lib/backup";
import { createDatabaseClient } from "../src/lib/database-client";
import { getAllMissions } from "../src/lib/curriculum";

const prisma = createDatabaseClient();
const probeId = `deployment-probe-${Date.now()}`;

async function main() {
  const learner = await prisma.learnerProfile.findUnique({
    where: { id: "local-learner" },
  });
  if (!learner)
    throw new Error("Database seed missing LearnerProfile bootstrap row.");

  const skillCount = await prisma.skillProgress.count();
  if (skillCount === 0)
    throw new Error("Database seed missing SkillProgress rows.");
  await prisma.missionProgress.findMany({ take: 1 });

  const availableMission = (
    await Promise.all(
      getAllMissions().map(async (mission) => ({
        mission,
        note: await prisma.missionNote.findUnique({
          where: { missionId: mission.id },
        }),
        bookmark: await prisma.bookmark.findUnique({
          where: {
            targetType_targetId: {
              targetType: "mission",
              targetId: mission.id,
            },
          },
        }),
      })),
    )
  ).find(({ note, bookmark }) => !note && !bookmark)?.mission;
  if (!availableMission) {
    throw new Error(
      "No unused mission is available for an isolated verification probe.",
    );
  }

  try {
    const recallId = `${availableMission.id}:${availableMission.quiz[0].id}`;
    const existingRecall = await prisma.recallReview.findUnique({
      where: { id: recallId },
    });
    // Existing learner schedules are never modified by this probe.
    if (!existingRecall) {
      const now = new Date();
      try {
        await prisma.recallReview.create({
          data: {
            id: recallId,
            lastReviewedAt: now,
            nextReviewAt: new Date(now.getTime() + 86400000),
            reviewCount: 1,
            streak: 0,
            rating: "wrong",
          },
        });
        if (
          !(await prisma.recallReview.findUnique({ where: { id: recallId } }))
        )
          throw new Error("Recall verification write was not readable.");
      } finally {
        await prisma.recallReview.deleteMany({
          where: { id: recallId, reviewCount: 1, lastReviewedAt: now },
        });
      }
    }
    await prisma.evidence.create({
      data: {
        id: `${probeId}-evidence`,
        missionId: availableMission.id,
        skillId: availableMission.skillId,
        type: "explanation",
        title: "Deployment verification probe",
        content:
          "Isolated record; safe to delete after persistence verification.",
      },
    });
    await prisma.quizAttempt.create({
      data: {
        id: `${probeId}-quiz`,
        quizId: probeId,
        missionId: availableMission.id,
        score: 0,
        passed: false,
        answers: "{}",
      },
    });
    await prisma.missionNote.create({
      data: {
        id: `${probeId}-note`,
        missionId: availableMission.id,
        content: "Deployment verification probe",
      },
    });
    await prisma.bookmark.create({
      data: {
        id: `${probeId}-bookmark`,
        targetType: "mission",
        targetId: availableMission.id,
        label: "Deployment verification probe",
      },
    });

    for (const [label, count] of [
      [
        "evidence",
        await prisma.evidence.count({ where: { id: `${probeId}-evidence` } }),
      ],
      [
        "quiz",
        await prisma.quizAttempt.count({ where: { id: `${probeId}-quiz` } }),
      ],
      [
        "note",
        await prisma.missionNote.count({ where: { id: `${probeId}-note` } }),
      ],
      [
        "bookmark",
        await prisma.bookmark.count({ where: { id: `${probeId}-bookmark` } }),
      ],
    ] as const) {
      if (count !== 1)
        throw new Error(`${label} verification write was not readable.`);
    }

    const backup = await createLearnerBackup(prisma);
    if (backup.format !== "dx-lab-sv1-learner-backup") {
      throw new Error("Backup verification returned an unexpected format.");
    }

    console.log(
      JSON.stringify({
        status: "ok",
        learner: true,
        skills: skillCount,
        missionState: true,
        evidence: true,
        quiz: true,
        note: true,
        bookmark: true,
        recall: true,
        backup: true,
      }),
    );
  } finally {
    await prisma.bookmark.deleteMany({ where: { id: `${probeId}-bookmark` } });
    await prisma.missionNote.deleteMany({ where: { id: `${probeId}-note` } });
    await prisma.quizAttempt.deleteMany({ where: { id: `${probeId}-quiz` } });
    await prisma.evidence.deleteMany({ where: { id: `${probeId}-evidence` } });
  }
}

main()
  .catch((error) => {
    console.error(
      error instanceof Error ? error.message : "Database verification failed.",
    );
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
