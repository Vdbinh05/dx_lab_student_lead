import Link from "next/link";
import { ArrowRight, ClipboardCheck, ShieldAlert } from "lucide-react";
import { db } from "@/lib/db";
import { getAllMissions, getIncidents, weeks } from "@/lib/curriculum";
import { PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

const finalBlueprint = [
  ["Theory", "50"],
  ["Troubleshooting", "20"],
  ["Architecture", "10"],
  ["Docker incidents", "5"],
  ["Keycloak incidents", "5"],
  ["SV1–SV2 integration", "5"],
  ["AI infrastructure", "5"],
] as const;

export default async function ExamsPage() {
  const missions = getAllMissions();
  const incidents = getIncidents();
  const [quizAttempts, incidentAttempts] = await Promise.all([
    db.quizAttempt.findMany({ orderBy: { createdAt: "desc" } }),
    db.incidentAttempt.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Knowledge, scenarios, and defense"
        title="Exams"
        description="Mission quizzes test local understanding; weekly quizzes and Boss Fights gate progression; final practice is split into manageable exam sections."
      />
      <section className="mb-7 border-y border-[#27313d] py-5">
        <div className="eyebrow">Final mock exam blueprint</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {finalBlueprint.map(([label, count]) => (
            <div key={label} className="border border-[#303b48] bg-[#10161e] p-4">
              <div className="font-mono text-2xl font-black text-[#67ddd7]">{count}</div>
              <div className="mt-1 text-xs font-bold text-white">{label}</div>
            </div>
          ))}
          <div className="border border-[#303b48] bg-[#10161e] p-4">
            <div className="font-mono text-sm font-black text-[#e7bd80]">PRACTICAL</div>
            <div className="mt-1 text-xs text-white">Fresh-machine · change request · oral defense</div>
          </div>
        </div>
        <Link href="/oral-defense" className="btn-secondary mt-4">Open oral-defense practice</Link>
      </section>
      <div className="space-y-6">
        {weeks.map((week) => {
          const weekMissions = missions.filter((mission) => mission.week === week.number);
          const incident = incidents.find((item) => item.week === week.number);
          const weeklyLatest = quizAttempts.find(
            (item) => item.quizId === week.slug + "-weekly",
          );
          const cleanIncident = incidentAttempts.some(
            (item) =>
              item.incidentId === incident?.id &&
              item.passed &&
              !item.assisted,
          );
          return (
            <section key={week.number} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27313d] pb-4">
                <div>
                  <div className="eyebrow">Week {week.number}</div>
                  <h2 className="mt-1 text-lg font-black text-white">{week.title}</h2>
                </div>
                <Link href={"/weeks/" + week.number + "/review"} className="btn-primary">
                  Weekly quiz <ArrowRight size={14} />
                </Link>
              </div>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {weekMissions.map((mission) => {
                  const latest = quizAttempts.find((item) => item.missionId === mission.id);
                  return (
                    <Link
                      key={mission.id}
                      href={
                        "/learn/week-" +
                        String(mission.week).padStart(2, "0") +
                        "/" +
                        mission.slug
                      }
                      className="flex items-center justify-between border border-[#303b48] bg-[#10161e] p-3 text-sm hover:border-[#4b606f]"
                    >
                      <span className="flex items-center gap-2 text-[#c3ccd5]">
                        <ClipboardCheck size={14} className="text-[#62dad4]" />
                        M{mission.order} · {mission.title}
                      </span>
                      <span className="font-mono text-[10px] text-[#8d9aaa]">
                        {latest ? latest.score + "%" : mission.quiz.length + " Q"}
                      </span>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="border border-[#303b48] p-3 text-sm text-[#aab5c2]">
                  Weekly quiz: {weeklyLatest ? weeklyLatest.score + "%" : "not attempted"} · PASS ≥ {week.weeklyQuizPassScore}%
                </div>
                {incident && (
                  <Link href={"/incidents/" + incident.id} className="flex items-center gap-2 border border-[#56373a] p-3 text-sm font-bold text-[#ef9a9a]">
                    <ShieldAlert size={15} />
                    Boss Fight · {cleanIncident ? "CLEAN PASS" : "OPEN"}
                  </Link>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
