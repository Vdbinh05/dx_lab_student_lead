import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
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

  const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL ?? "file:./dev.db",
    }),
  });

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
