import Link from "next/link";
import { Check, Lock, ShieldCheck, ShieldX } from "lucide-react";
import { getDashboardData } from "@/lib/app-data";
import { readinessDimensions } from "@/lib/progress-engine";
import { BlockerCard, PageHeader, ProgressBar } from "@/components/ui";

export const dynamic = "force-dynamic";

const descriptions: Record<string, string> = {
  UNDERSTAND: "Core theory and mission knowledge gates",
  DEPLOY: "Docker and Compose operational execution",
  INTEGRATE: "Cross-service contracts and integration triage",
  OBSERVE: "Status, health, logs, and resource evidence",
  DEBUG: "Eight unassisted Boss Fight CLEAN PASS results",
  COORDINATE: "Owner, handoff, issue, review, and escalation",
  REVIEW: "Evidence-backed weekly and release review",
  SECURE: "Identity, secrets, public boundary, and Agent controls",
  RELEASE: "Configuration freeze, fresh-machine, and release gates",
  EXPLAIN: "Ten oral-defense groups with saved confident reflections",
};

export default async function ReadinessPage() {
  const data = await getDashboardData();
  const blockers = [
    ...(data.missions.length > data.passed.length
      ? [data.missions.length - data.passed.length + " mission gates chưa PASS"]
      : []),
    ...(data.weeklyProgress.length < 8
      ? [8 - data.weeklyProgress.length + " weekly gates chưa PASS"]
      : []),
    ...(data.cleanBossFightWeeks.length < 8
      ? [8 - data.cleanBossFightWeeks.length + " Boss Fights chưa CLEAN PASS"]
      : []),
    ...data.readiness.p0Blockers,
  ];
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Evidence-based graduation"
        title="SV1 Final Readiness"
        description="Reading percentage never grants readiness. The result combines mission gates, weekly gates, independent incidents, skill evidence, regression, and oral defense."
        action={<Link href="/oral-defense" className="btn-secondary">Practice Oral Defense</Link>}
      />
      <section
        className={
          "card mb-6 border-2 p-6 " +
          (data.readiness.ready ? "border-[#4e7e40]" : "border-[#713d40]")
        }
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            {data.readiness.ready ? (
              <ShieldCheck size={36} className="text-[#b6e86d]" />
            ) : (
              <ShieldX size={36} className="text-[#ef7f86]" />
            )}
            <div>
              <div className="text-[10px] font-bold uppercase text-[#7d8998]">Final status</div>
              <div className="mt-1 text-3xl font-black text-white">{data.readiness.status}</div>
              {data.readiness.p0Blockers.length > 0 && (
                <div className="mt-2 font-mono text-xs font-black text-[#f0888e]">
                  P0 BLOCKERS: {data.readiness.p0Blockers.length}
                </div>
              )}
            </div>
          </div>
          <div className="min-w-64">
            <ProgressBar value={data.readiness.passedCount * 10} label={data.readiness.passedCount + "/10 readiness dimensions"} />
          </div>
        </div>
      </section>
      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Mission gates", data.passed.length + "/" + data.missions.length],
          ["Week gates", data.weeklyProgress.length + "/8"],
          ["Boss Fights", data.cleanBossFightWeeks.length + "/8"],
        ].map(([label, value]) => (
          <div key={label} className="card p-4">
            <div className="eyebrow">{label}</div>
            <div className="metric-number mt-2 text-2xl font-black text-white">{value}</div>
          </div>
        ))}
      </section>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <section className="card p-6">
          <div className="eyebrow">Competency chain</div>
          <div className="mt-4 divide-y divide-[#27313c]">
            {readinessDimensions.map((key) => {
              const pass = data.readiness.dimensions[key];
              return (
                <div key={key} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <div className="font-mono text-sm font-bold text-white">{key}</div>
                    <div className="mt-1 text-xs text-[#7e8b99]">{descriptions[key]}</div>
                  </div>
                  <span className={
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold " +
                    (pass
                      ? "border-[#436b3b] bg-[#172616] text-[#b8e875]"
                      : "border-[#3a444f] bg-[#151b22] text-[#7f8b98]")
                  }>
                    {pass ? <Check size={12} /> : <Lock size={12} />}
                    {pass ? "PASS" : "LOCKED"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
        <section className="card p-6">
          <div className="eyebrow !text-[#e8ad62]">Blocking requirements</div>
          <div className="mt-4 space-y-2">
            {blockers.length ? (
              [...new Set(blockers)].map((item) => <BlockerCard key={item}>{item}</BlockerCard>)
            ) : (
              <div className="border border-[#3f6938] bg-[#152515] p-4 text-sm text-[#b8e774]">
                No blocking requirement remains.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
