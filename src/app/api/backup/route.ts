import { createLearnerBackup } from "@/lib/backup";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const backup = await createLearnerBackup(db);
  const stamp = backup.exportedAt.replaceAll(":", "-").replace(".000Z", "Z");
  return new Response(`${JSON.stringify(backup, null, 2)}\n`, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="dx-lab-sv1-backup-${stamp}.json"`,
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
