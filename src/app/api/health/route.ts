import { db } from "@/lib/db";
import { createHealthResponse } from "@/lib/health";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return createHealthResponse(db);
}
