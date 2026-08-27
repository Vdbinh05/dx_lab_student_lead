import Link from "next/link";
import { BookmarkX, ExternalLink } from "lucide-react";
import { toggleBookmark } from "@/app/actions";
import { EmptyState, PageHeader } from "@/components/ui";
import { getIncidentById, getMissionById } from "@/lib/curriculum";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function bookmarkHref(targetType: string, targetId: string) {
  if (targetType === "incident") return "/incidents/" + targetId;
  const missionId = targetType === "lab" ? targetId.split(":")[0] : targetId;
  if (!missionId) return "/roadmap";
  const mission = getMissionById(missionId);
  if (!mission) return "/roadmap";
  return (
    "/learn/week-" +
    String(mission.week).padStart(2, "0") +
    "/" +
    mission.slug
  );
}

export default async function BookmarksPage() {
  const bookmarks = await db.bookmark.findMany({
    orderBy: { createdAt: "desc" },
  });
  const valid = bookmarks.filter((item) => {
    if (item.targetType === "incident") return Boolean(getIncidentById(item.targetId));
    const missionId =
      item.targetType === "lab" ? item.targetId.split(":")[0] : item.targetId;
    return Boolean(missionId && getMissionById(missionId));
  });
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Personal learning index"
        title="Bookmarks"
        description="Mission, lab, and incident bookmarks are local learner state and are included in JSON backup/export."
      />
      {valid.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          description="Use the bookmark controls inside missions and incidents."
          href="/roadmap"
          action="Open roadmap"
        />
      ) : (
        <div className="divide-y divide-[#27313d] border-y border-[#27313d]">
          {valid.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
            >
              <div>
                <div className="font-mono text-[10px] font-black uppercase text-[#67ddd7]">
                  {item.targetType}
                </div>
                <h2 className="mt-1 font-bold text-white">{item.label}</h2>
                <p className="mt-1 text-xs text-[#778493]">
                  {item.createdAt.toLocaleString("vi-VN")}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={bookmarkHref(item.targetType, item.targetId)} className="btn-secondary">
                  <ExternalLink size={14} /> Open
                </Link>
                <form action={toggleBookmark}>
                  <input type="hidden" name="targetType" value={item.targetType} />
                  <input type="hidden" name="targetId" value={item.targetId} />
                  <input type="hidden" name="label" value={item.label} />
                  <button type="submit" className="btn-secondary" aria-label={"Remove " + item.label}>
                    <BookmarkX size={14} /> Remove
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
