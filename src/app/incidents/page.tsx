import Link from "next/link";
import { ArrowRight, LockKeyhole, ShieldAlert } from "lucide-react";
import { db } from "@/lib/db";
import { getIncidents } from "@/lib/curriculum";
import { isWeekUnlockedForPass } from "@/lib/training-state";
import { PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function IncidentsPage() {
  const incidents = getIncidents();
  const [attempts, unlocks] = await Promise.all([
    db.incidentAttempt.findMany({ orderBy: { createdAt: "desc" } }),
    Promise.all(incidents.map((item) => isWeekUnlockedForPass(item.week))),
  ]);
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Failure injection mode"
        title="Incident Catalog"
        description="Every week ends in a scenario-based Boss Fight. Root cause stays hidden; hints make the current attempt assisted and therefore ineligible for CLEAN PASS."
      />
      <div className="space-y-4">
        {incidents.map((incident, index) => {
          const incidentAttempts = attempts.filter(
            (item) => item.incidentId === incident.id,
          );
          const clean = incidentAttempts.some(
            (item) => item.passed && !item.assisted,
          );
          const passUnlocked = unlocks[index] ?? false;
          return (
            <article key={incident.id} className="border-y border-[#30313d] bg-[#10151d]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3d2f31] bg-[#1c1113] px-5 py-3">
                <div className="font-mono text-xs font-bold text-[#f08d8d]">
                  INCIDENT #{incident.id.toUpperCase()} · WEEK {incident.week} BOSS FIGHT
                </div>
                <span
                  className={
                    "rounded-full border px-2.5 py-1 text-[10px] font-bold " +
                    (clean
                      ? "border-[#41683a] bg-[#172515] text-[#bae875]"
                      : passUnlocked
                        ? "border-[#67403d] bg-[#281718] text-[#ee9999]"
                        : "border-[#6a542f] bg-[#231c10] text-[#e7bf72]")
                  }
                >
                  {clean ? "CLEAN PASS" : passUnlocked ? "OPEN" : "READ ONLY"}
                </span>
              </div>
              <div className="grid gap-5 p-6 md:grid-cols-[auto_1fr_auto] md:items-center">
                <div className="grid h-14 w-14 place-items-center border border-[#674044] bg-[#281719] text-[#f18181]">
                  {passUnlocked ? <ShieldAlert size={25} /> : <LockKeyhole size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{incident.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#919eac]">
                    {incident.scenario}
                  </p>
                  <div className="mt-3 text-xs text-[#7f8c99]">
                    {incidentAttempts.length} attempts ·{" "}
                    {incidentAttempts.filter((item) => item.passed && !item.assisted).length} clean pass
                  </div>
                </div>
                <Link href={"/incidents/" + incident.id} className="btn-primary">
                  {passUnlocked ? "Solve incident" : "Read scenario"}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
