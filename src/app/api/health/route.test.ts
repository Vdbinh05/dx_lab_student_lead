import { describe, expect, it } from "vitest";
import { applicationVersion } from "@/lib/app-version";
import { createHealthResponse } from "@/lib/health";

describe("deployment health endpoint", () => {
  it("returns only status and application version without caching", async () => {
    const response = await createHealthResponse({
      $queryRawUnsafe: async () => [{ ok: 1 }],
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({
      status: "ok",
      version: applicationVersion,
    });
  });

  it("returns a non-sensitive failure when the database is unavailable", async () => {
    const response = await createHealthResponse({
      $queryRawUnsafe: async () => {
        throw new Error("secret connection detail");
      },
    });
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      status: "error",
      version: applicationVersion,
      database: "unavailable",
    });
  });
});
