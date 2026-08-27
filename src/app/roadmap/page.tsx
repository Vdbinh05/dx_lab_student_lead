import Link from "next/link";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import { weeks } from "@/lib/curriculum";
import { getDashboardData } from "@/lib/app-data";
import { PageHeader, ProgressBar, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function RoadmapPage() {
  const data = await getDashboardData();
  const gateWeeks = new Set(data.weeklyProgress.map((item) => item.week));
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="8-week progression"
        title="Roadmap"
        description="All curriculum is available to read. Weekly gates control progression and server-side PASS mutations."
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {weeks.map((week) => {
          const weekMissions = data.missions.filter((item) => item.week === week.number);
          const passed = weekMissions.filter(
            (item) => data.progress.get(item.id)?.status === "PASSED",
          ).length;
          const percent = Math.round((passed / week.missionCount) * 100);
          const gatePassed = gateWeeks.has(week.number);
          const passUnlocked = week.number <= data.currentWeek || gatePassed;
          return (
            <article key={week.number} className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#26313d] bg-[#0d131a] px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-black text-[#5fd9d3]">
                    W{String(week.number).padStart(2, "0")}
                  </span>
                  <span className="text-xs font-bold uppercase text-[#8b98a7]">{week.title}</span>
                </div>
                <StatusBadge status={gatePassed ? "PASSED" : percent > 0 ? "IN_PROGRESS" : "NOT_STARTED"} />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 font-mono text-[10px] font-black">
                  {!passUnlocked && <LockKeyhole size={12} />}
                  <span className={passUnlocked ? "text-[#72ddd7]" : "text-[#e7bf72]"}>
                    {gatePassed
                      ? "WEEK GATE PASS"
                      : passUnlocked
                        ? "UNLOCKED FOR PASS"
                        : "AVAILABLE TO READ · LOCKED FOR PASS"}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-black text-white">{week.subtitle}</h2>
                <p className="mt-2 text-sm leading-6 text-[#8f9baa]">{week.goal}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {week.competencies.map((item) => (
                    <span key={item} className="border border-[#2d3845] bg-[#111821] px-2 py-1 text-xs text-[#9fabb8]">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-5">
                  <ProgressBar
                    value={percent}
                    label={passed + "/" + week.missionCount + " missions · " + week.incidentCount + " Boss Fight"}
                  />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-[#707d8b]">Hard gates</div>
                    <ul className="mt-2 space-y-1 text-xs text-[#c4a873]">
                      {week.hardGates.map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-[#707d8b]">Deliverables</div>
                    <ul className="mt-2 space-y-1 text-xs text-[#96a4b2]">
                      {week.deliverables.map((item) => (
                        <li key={item} className="flex gap-1">
                          <Check size={12} className="mt-0.5 text-[#5f8c83]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-5 border-t border-[#26303b] pt-4">
                  <Link href={"/weeks/" + week.number} className="inline-flex items-center gap-2 text-sm font-bold text-[#63dcd6]">
                    Open Week {week.number} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
