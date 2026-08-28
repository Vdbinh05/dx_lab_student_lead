import { PrismaClient } from "@/generated/prisma/client";
import { createDatabaseClient } from "@/lib/database-client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createDatabaseClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
