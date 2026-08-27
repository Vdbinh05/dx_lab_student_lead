import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { EmptyState, PageHeader, SourceBadge } from "@/components/ui";
import { searchCurriculum } from "@/lib/curriculum";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const raw = (await searchParams).q;
  const query = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
  const results = searchCurriculum(query);
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Local curriculum index"
        title="Search"
        description="Search mission titles, roadmap keywords, and lesson content. No external service or learner data leaves this app."
      />
      <form action="/search" className="mb-7 flex gap-2">
        <label className="relative min-w-0 flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#778493]"
          />
          <input
            name="q"
            defaultValue={query}
            className="field pl-10"
            minLength={2}
            placeholder="Docker DNS, 403, restore, Qdrant..."
            aria-label="Search curriculum"
          />
        </label>
        <button className="btn-primary" type="submit">Search</button>
      </form>
      {query.trim().length < 2 ? (
        <EmptyState
          title="Enter at least two characters"
          description="Results are ranked by title, keywords, then lesson body."
        />
      ) : results.length === 0 ? (
        <EmptyState
          title="No curriculum result"
          description={"No mission matched “" + query + "”."}
        />
      ) : (
        <div className="divide-y divide-[#27313d] border-y border-[#27313d]">
          {results.map(({ mission, score }) => (
            <article key={mission.id} className="py-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-black text-[#67ddd7]">
                      WEEK {mission.week} · MISSION {mission.order} · SCORE {score}
                    </span>
                    <SourceBadge source={mission.sourceType} />
                  </div>
                  <h2 className="mt-2 text-lg font-black text-white">{mission.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#8d9aaa]">
                    {mission.whyItMatters}
                  </p>
                  <p className="mt-2 text-xs text-[#708090]">
                    {mission.keywords.join(" · ")}
                  </p>
                </div>
                <Link
                  href={
                    "/learn/week-" +
                    String(mission.week).padStart(2, "0") +
                    "/" +
                    mission.slug
                  }
                  className="btn-secondary shrink-0"
                >
                  Open mission <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
