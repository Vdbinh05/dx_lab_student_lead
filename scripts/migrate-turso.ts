import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createClient, type InStatement } from "@libsql/client";
import { resolveDatabaseConfig } from "../src/lib/database-config";

const migrations = [
  "20260827193000_init",
  "20260827203000_harden_progress",
  "20260827221500_full_roadmap_state",
] as const;

const expectedTables = [
  "AppSettings",
  "Bookmark",
  "Evidence",
  "IncidentAssistance",
  "IncidentAttempt",
  "LearnerProfile",
  "MissionNote",
  "MissionProgress",
  "OralReflection",
  "QuizAttempt",
  "SkillProgress",
  "WeeklyProgress",
] as const;

function statementsFrom(sql: string) {
  return sql
    .replace(/^--.*$/gm, "")
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function main() {
  const config = resolveDatabaseConfig();
  if (config.mode !== "turso") {
    throw new Error(
      "Turso migrations require TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.",
    );
  }

  const client = createClient({ url: config.url, authToken: config.authToken });
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "_dxlab_migrations" (
        "name" TEXT NOT NULL PRIMARY KEY,
        "checksum" TEXT NOT NULL,
        "appliedAt" TEXT NOT NULL
      )
    `);

    const appliedResult = await client.execute(
      'SELECT "name", "checksum" FROM "_dxlab_migrations" ORDER BY "name"',
    );
    const applied = new Map(
      appliedResult.rows.map((row) => [String(row.name), String(row.checksum)]),
    );
    const existingResult = await client.execute(
      `SELECT name FROM sqlite_master
       WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name != '_dxlab_migrations'`,
    );
    if (applied.size === 0 && existingResult.rows.length > 0) {
      throw new Error(
        "Remote schema already contains application tables without DX-Lab migration history.",
      );
    }

    const newlyApplied: string[] = [];
    for (const migration of migrations) {
      const sql = readFileSync(
        `prisma/migrations/${migration}/migration.sql`,
        "utf8",
      );
      const checksum = createHash("sha256").update(sql).digest("hex");
      const recordedChecksum = applied.get(migration);
      if (recordedChecksum) {
        if (recordedChecksum !== checksum) {
          throw new Error(`Migration checksum mismatch: ${migration}`);
        }
        continue;
      }

      const statements: InStatement[] = [
        ...statementsFrom(sql),
        {
          sql: 'INSERT INTO "_dxlab_migrations" ("name", "checksum", "appliedAt") VALUES (?, ?, ?)',
          args: [migration, checksum, new Date().toISOString()],
        },
      ];
      await client.batch(statements, "write");
      newlyApplied.push(migration);
    }

    const tableResult = await client.execute(
      `SELECT name FROM sqlite_master
       WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name`,
    );
    const tableNames = new Set(tableResult.rows.map((row) => String(row.name)));
    const missingTables = expectedTables.filter(
      (table) => !tableNames.has(table),
    );
    if (missingTables.length > 0) {
      throw new Error(
        `Remote schema is missing tables: ${missingTables.join(", ")}`,
      );
    }

    const indexResult = await client.execute(
      `SELECT COUNT(*) AS count FROM sqlite_master
       WHERE type = 'index' AND name NOT LIKE 'sqlite_%'`,
    );
    console.log(
      JSON.stringify({
        status: "ok",
        migrationsApplied: newlyApplied,
        migrationsTotal: migrations.length,
        applicationTables: expectedTables.length,
        applicationIndexes: Number(indexResult.rows[0]?.count ?? 0),
      }),
    );
  } finally {
    client.close();
  }
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Turso migration failed.",
  );
  process.exitCode = 1;
});
