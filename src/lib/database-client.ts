import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";
import {
  resolveDatabaseConfig,
  type DatabaseConfig,
} from "@/lib/database-config";

export function createDatabaseClient(
  config: DatabaseConfig = resolveDatabaseConfig(),
) {
  const adapter =
    config.mode === "turso"
      ? new PrismaLibSql({ url: config.url, authToken: config.authToken })
      : new PrismaBetterSqlite3({ url: config.url });

  return new PrismaClient({ adapter });
}
