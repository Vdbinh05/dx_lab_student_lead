import Link from "next/link";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { getDashboardData } from "@/lib/app-data";
import {
  BlockerCard,
  MetricCard,
  PageHeader,
  ProgressBar,
  SkillLevelBadge,
} from "@/components/ui";

export const dynamic = "force-dynamic";

const coreSkills = [
  ["linux", "Linux"],
  ["networking", "Networking"],
  ["git", "Git / Open Source"],
  ["docker", "Docker / Compose"],
  ["keycloak", "Identity / Keycloak"],
  ["system-integration", "System Integration"],
] as const;

export default async function Dashboard() {
  const data = await getDashboardData();
  const overall = Math.round((data.passed.length / data.missions.length) * 100);
  const levelMap = new Map(data.skills.map((item) => [item.id, item]));
  const currentDefinition = data.currentWeekDefinition;
  const blockers = [
    ...(data.nextMission ? [data.nextMission.title + " chưa PASS"] : []),
    ...(!data.bossFightPassed && currentDefinition
      ? ["Week " + data.currentWeek + " Boss Fight chưa CLEAN PASS"]
      : []),
    ...(data.evidenceCount === 0 ? ["Chưa có evidence thực tế"] : []),
    ...data.readiness.p0Blockers,
  ];

  return (
    <div className="mx-auto max-w-[1450px]">
      <PageHeader
        eyebrow="Personal technical training operating system"
        title="DX-Lab SV1 Training OS"
        description="Current position, hard blockers, and the next technical action across the complete 8-week roadmap."
        action={
          <Link href="/today" className="btn-primary">
            Continue <ArrowRight size={16} />
          </Link>
        }
      />
      <section className="card mb-6 grid gap-5 p-6 lg:grid-cols-[1.3fr_.7fr]">
        <div>
          <div className="eyebrow">Current position</div>
          <h2 className="mt-2 text-2xl font-black text-white">
            Week {data.currentWeek} · {currentDefinition?.title ?? "Roadmap complete"}
          </h2>
          <p className="mt-2 text-sm text-[#8f9dac]">
            {data.nextMission
              ? "Mission " +
                String(data.nextMission.order).padStart(2, "0") +
                " / " +
                currentDefinition?.missionCount +
                " · " +
                data.nextMission.title
              : "Mission gates complete for this week · open Weekly Review"}
          </p>
          <div className="mt-5">
            <ProgressBar value={overall} label="Overall roadmap mission progress" />
          </div>
        </div>
        <div className="border-l border-[#273340] bg-[#0d131b] p-5">
          <div className="text-[10px] font-bold uppercase text-[#758291]">Final readiness</div>
          <div className="mt-3 font-mono text-2xl font-black text-[#65ddd7]">
            {data.readiness.passedCount}/10
          </div>
          <div className="mt-2 text-sm font-bold text-white">{data.readiness.status}</div>
          <Link href="/readiness" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#65ddd7]">
            Inspect dimensions <ArrowRight size={13} />
          </Link>
        </div>
      </section>
      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Missions" value={data.passed.length + "/" + data.missions.length} detail="deterministic PASS" />
        <MetricCard label="Evidence" value={data.evidenceCount} detail="saved artifacts" tone="lime" />
        <MetricCard label="Quiz avg" value={data.quizAverage + "%"} detail="all attempts" />
        <MetricCard label="Week gates" value={data.weeklyProgress.length + "/8"} detail="committed" />
        <MetricCard label="Boss Fights" value={data.cleanBossFightWeeks.length + "/8"} detail="clean PASS" tone="amber" />
        <MetricCard label="Current week" value={data.currentWeek + "/8"} detail="unlocked progression" />
      </section>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow">Core readiness</div>
              <h2 className="mt-1 text-lg font-bold text-white">SV1 competency baseline</h2>
            </div>
            <Link href="/skills" className="text-xs font-bold text-[#62d9d3]">Open skill matrix</Link>
          </div>
          <div className="mt-5 divide-y divide-[#252f3a]">
            {coreSkills.map(([id, label]) => {
              const skill = levelMap.get(id);
              return (
                <div key={id} className="flex flex-col justify-between gap-3 py-3 sm:flex-row sm:items-center">
                  <div>
                    <div className="text-sm font-semibold text-[#dbe2e9]">{label}</div>
                    <div className="mt-1 text-xs text-[#758291]">
                      L{skill?.currentLevel ?? 0} → Target L{skill?.targetLevel ?? 4}
                    </div>
                  </div>
                  <SkillLevelBadge current={skill?.currentLevel ?? 0} target={skill?.targetLevel ?? 4} />
                </div>
              );
            })}
          </div>
        </section>
        <section className="card p-6">
          <div className="flex items-center gap-2">
            <ShieldAlert size={17} className="text-[#efb660]" />
            <div>
              <div className="eyebrow !text-[#eeb760]">Current hard blockers</div>
              <h2 className="mt-1 text-lg font-bold text-white">Cannot be skipped</h2>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {blockers.length ? (
              [...new Set(blockers)].map((item) => <BlockerCard key={item}>{item}</BlockerCard>)
            ) : (
              <div className="border border-[#3f6938] bg-[#152515] p-4 text-sm text-[#b8e774]">
                No active blocker. Continue with the current weekly review.
              </div>
            )}
          </div>
          <Link
            href={data.nextMission ? "/today" : "/weeks/" + data.currentWeek + "/review"}
            className="btn-primary mt-5 w-full"
          >
            {data.nextMission ? "Continue Today" : "Open Weekly Review"} <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
