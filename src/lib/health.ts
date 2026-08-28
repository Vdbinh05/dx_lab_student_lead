import { applicationVersion } from "@/lib/app-version";

export type HealthDatabase = {
  $queryRawUnsafe(query: string): Promise<unknown>;
};

export async function createHealthResponse(database: HealthDatabase) {
  try {
    await database.$queryRawUnsafe("SELECT 1");
    return Response.json(
      { status: "ok", version: applicationVersion },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "error", version: applicationVersion, database: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
