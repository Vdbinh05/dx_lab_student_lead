import { describe, expect, it } from "vitest";
import { applicationVersion } from "@/lib/app-version";
import { GET } from "@/app/api/health/route";

describe("deployment health endpoint", () => {
  it("returns only status and application version without caching", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({
      status: "ok",
      version: applicationVersion,
    });
  });
});
