import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { getAllMissions } from "@/lib/curriculum";
import { getProgressMap } from "@/lib/app-data";
import { PageHeader, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function LabsPage() {
  const missions = getAllMissions();
  const progress = await getProgressMap();
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Practice, build, break, debug"
        title="Lab Catalog"
        description="Every mission includes guided and independent work; integration labs appear where the roadmap contract crosses services."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {missions.map((mission) => (
          <article key={mission.id} className="card p-5">
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center border border-[#35515a] bg-[#10252a] text-[#61d9d3]">
                <FlaskConical size={18} />
              </div>
              <StatusBadge
                status={
                  (progress.get(mission.id)?.status ?? "NOT_STARTED") as
                    | "NOT_STARTED"
                    | "IN_PROGRESS"
                    | "BLOCKED"
                    | "READY_FOR_GATE"
                    | "PASSED"
                }
              />
            </div>
            <div className="mt-4 text-[10px] font-bold uppercase text-[#748290]">
              Week {mission.week} · {mission.category}
            </div>
            <h2 className="mt-1 text-lg font-bold text-white">{mission.title}</h2>
            <p className="mt-2 text-sm text-[#8996a5]">
              Guided · Independent · Integration where relevant · Failure Injection
            </p>
            <Link
              href={
                "/learn/week-" +
                String(mission.week).padStart(2, "0") +
                "/" +
                mission.slug
              }
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#62d9d3]"
            >
              Open mission labs <ArrowRight size={14} />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
