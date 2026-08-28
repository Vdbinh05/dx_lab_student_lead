export type DatabaseConfig =
  | { mode: "local"; url: string }
  | { mode: "turso"; url: string; authToken: string };

type DatabaseEnvironment = Record<string, string | undefined>;

function nonEmpty(value: string | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function resolveDatabaseConfig(
  environment: DatabaseEnvironment = process.env,
): DatabaseConfig {
  const tursoUrl = nonEmpty(environment.TURSO_DATABASE_URL);
  const tursoAuthToken = nonEmpty(environment.TURSO_AUTH_TOKEN);

  if (tursoUrl || tursoAuthToken) {
    if (!tursoUrl) {
      throw new Error(
        "TURSO_DATABASE_URL is required when TURSO_AUTH_TOKEN is configured.",
      );
    }
    if (!tursoAuthToken) {
      throw new Error(
        "TURSO_AUTH_TOKEN is required when TURSO_DATABASE_URL is configured.",
      );
    }
    if (!tursoUrl.startsWith("libsql://")) {
      throw new Error("TURSO_DATABASE_URL must use the libsql:// protocol.");
    }
    return { mode: "turso", url: tursoUrl, authToken: tursoAuthToken };
  }

  const isVercel =
    environment.VERCEL === "1" || Boolean(nonEmpty(environment.VERCEL_ENV));
  if (isVercel) {
    throw new Error(
      "Vercel requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN; refusing an ephemeral SQLite fallback.",
    );
  }

  const localUrl =
    nonEmpty(environment.LOCAL_DATABASE_URL) ??
    nonEmpty(environment.DATABASE_URL) ??
    "file:./dev.db";
  if (!localUrl.startsWith("file:")) {
    throw new Error(
      "Local database configuration must use a file: SQLite URL. Use TURSO_DATABASE_URL for Turso.",
    );
  }
  return { mode: "local", url: localUrl };
}
