import "dotenv/config";
import { createDatabaseClient } from "../src/lib/database-client";
import { seedDatabase } from "../src/lib/database-maintenance";

const prisma = createDatabaseClient();

async function main() {
  await seedDatabase(prisma);
}

main().finally(() => prisma.$disconnect());
