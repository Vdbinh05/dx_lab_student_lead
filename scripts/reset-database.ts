import "dotenv/config";
import { createDatabaseClient } from "../src/lib/database-client";
import {
  resetLearnerState,
  seedDatabase,
} from "../src/lib/database-maintenance";

async function main() {
  console.error("THIS DELETES LEARNER PROGRESS.");
  if (!process.argv.includes("--yes")) {
    console.error("Run again with: npm run db:reset -- --yes");
    process.exitCode = 1;
    return;
  }

  const prisma = createDatabaseClient();

  try {
    await resetLearnerState(prisma);
    await seedDatabase(prisma);
    console.log("Learner progress reset. Bootstrap records restored.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
