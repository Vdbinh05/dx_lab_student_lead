import Link from "next/link";
import { ArrowRight, Clock, Target } from "lucide-react";
import { getDashboardData } from "@/lib/app-data";
import {
  BlockerCard,
  EmptyState,
  PageHeader,
  ProgressBar,
  SourceBadge,
  StatusBadge,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const data = await getDashboardData();
  const mission = data.nextMission;
  if (!mission)
    return (
      <div className="mx-auto max-w-5xl">
        <PageHeader
          eyebrow="Today"
          title={"Week " + data.currentWeek + " mission gates complete"}
          description="The weekly quiz, Boss Fight, and Week Gate remain independent requirements."
        />
        <EmptyState
          title="Open Weekly Review"
          description="Review evidence, take the weekly quiz, earn a clean Boss Fight PASS, then commit the Week Gate."
          href={"/weeks/" + data.currentWeek + "/review"}
          action="Open review"
        />
      </div>
    );
  const progress = data.progress.get(mission.id);
  const overall = Math.round((data.passed.length / data.missions.length) * 100);
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Today's mission"
        title={"Week " + mission.week + " · Mission " + String(mission.order).padStart(2, "0")}
        description="The system selects the next unpassed mission in the unlocked week. Accelerated Mode changes scheduling only."
      />
      {data.nextSelection.blocked && data.nextSelection.reason && (
        <div className="mb-5">
          <BlockerCard>{progress?.notes ?? data.nextSelection.reason}</BlockerCard>
        </div>
      )}
      <section className="card overflow-hidden">
        <div className="grid min-h-[440px] md:grid-cols-[.42fr_.58fr]">
          <div className="border-b border-[#26313e] bg-[#0d141c] p-7 md:border-b-0 md:border-r">
            <Target className="text-[#59dad4]" size={28} />
            <div className="mt-7 eyebrow">Current focus</div>
            <h2 className="mt-2 text-3xl font-black text-white">{mission.title}</h2>
            <p className="mt-4 text-sm leading-6 text-[#93a0af]">{mission.whyItMatters}</p>
            <div className="mt-6 flex items-center gap-2 text-sm text-[#8895a4]">
              <Clock size={15} />
              {mission.estimatedMinutes} phút · Target {mission.targetLevel}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <SourceBadge source={mission.sourceType} />
              <StatusBadge
                status={
                  (progress?.status ?? "NOT_STARTED") as
                    | "NOT_STARTED"
                    | "IN_PROGRESS"
                    | "BLOCKED"
                    | "READY_FOR_GATE"
                    | "PASSED"
                }
              />
            </div>
          </div>
          <div className="p-7">
            <div className="eyebrow">Mission objectives</div>
            <ul className="mt-4 space-y-3">
              {mission.objectives.map((item) => (
                <li key={item} className="flex gap-3 border border-[#293542] bg-[#10171f] p-3 text-sm text-[#c1cbd5]">
                  <span className="font-mono text-[#5ddbd5]">→</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <ProgressBar value={overall} label="Overall mission gates" />
            </div>
            <Link
              href={
                "/learn/week-" +
                String(mission.week).padStart(2, "0") +
                "/" +
                mission.slug
              }
              className="btn-primary mt-7 w-full"
            >
              {data.nextSelection.blocked ? "Inspect blocker" : "Open Mission " + mission.order}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="mt-6 border-t border-[#27313d] pt-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="eyebrow">Daily plan</div>
            <h2 className="mt-2 text-xl font-black text-white">
              {data.settings?.acceleratedMode ? "Accelerated schedule" : "Standard schedule"}
            </h2>
          </div>
          <p className="text-xs text-[#7f8c9a]">
            {data.settings?.dailyStudyMinutes ?? 240} phút/day · gates unchanged
          </p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.dailyPlan.map((item, index) => (
            <div key={item.id} className="border border-[#293542] bg-[#10171f] p-4">
              <div className="font-mono text-[10px] text-[#59dad4]">
                SLOT {String(index + 1).padStart(2, "0")} · WEEK {item.week}
              </div>
              <div className="mt-2 text-sm font-bold text-white">
                Mission {item.order} · {item.title}
              </div>
              <div className="mt-1 text-xs text-[#7f8c9a]">{item.estimatedMinutes} phút</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
