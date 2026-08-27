import { applicationVersion } from "@/lib/app-version";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    { status: "ok", version: applicationVersion },
    { headers: { "Cache-Control": "no-store" } },
  );
}

