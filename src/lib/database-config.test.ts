import { describe, expect, it } from "vitest";
import { resolveDatabaseConfig } from "@/lib/database-config";

describe("database runtime configuration", () => {
  it("uses local SQLite by default", () => {
    expect(resolveDatabaseConfig({})).toEqual({
      mode: "local",
      url: "file:./dev.db",
    });
  });

  it("prefers LOCAL_DATABASE_URL while retaining DATABASE_URL compatibility", () => {
    expect(
      resolveDatabaseConfig({
        LOCAL_DATABASE_URL: "file:./preferred.db",
        DATABASE_URL: "file:./legacy.db",
      }),
    ).toEqual({ mode: "local", url: "file:./preferred.db" });
    expect(resolveDatabaseConfig({ DATABASE_URL: "file:./legacy.db" })).toEqual(
      {
        mode: "local",
        url: "file:./legacy.db",
      },
    );
  });

  it("selects Turso only when both remote settings are present", () => {
    expect(
      resolveDatabaseConfig({
        TURSO_DATABASE_URL: "libsql://example.turso.io",
        TURSO_AUTH_TOKEN: "test-token",
      }),
    ).toEqual({
      mode: "turso",
      url: "libsql://example.turso.io",
      authToken: "test-token",
    });
  });

  it("fails clearly when either Turso setting is missing", () => {
    expect(() =>
      resolveDatabaseConfig({
        TURSO_DATABASE_URL: "libsql://example.turso.io",
      }),
    ).toThrow("TURSO_AUTH_TOKEN is required");
    expect(() =>
      resolveDatabaseConfig({ TURSO_AUTH_TOKEN: "test-token" }),
    ).toThrow("TURSO_DATABASE_URL is required");
  });

  it("refuses local fallback in every Vercel environment", () => {
    expect(() => resolveDatabaseConfig({ VERCEL: "1" })).toThrow(
      "refusing an ephemeral SQLite fallback",
    );
    expect(() => resolveDatabaseConfig({ VERCEL_ENV: "preview" })).toThrow(
      "refusing an ephemeral SQLite fallback",
    );
  });

  it("rejects invalid local and remote protocols", () => {
    expect(() =>
      resolveDatabaseConfig({
        TURSO_DATABASE_URL: "https://example.turso.io",
        TURSO_AUTH_TOKEN: "test-token",
      }),
    ).toThrow("libsql://");
    expect(() =>
      resolveDatabaseConfig({ DATABASE_URL: "sqlite://wrong" }),
    ).toThrow("file: SQLite URL");
  });
});
