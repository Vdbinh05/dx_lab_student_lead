import Link from "next/link";
import { ExternalLink, Filter } from "lucide-react";
import { db } from "@/lib/db";
import { getAllMissions } from "@/lib/curriculum";
import { evidenceTypes } from "@/lib/types";
import { EmptyState, PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function EvidencePage({
  searchParams,
}: {
  searchParams: Promise<{
    week?: string | string[];
    mission?: string | string[];
    skill?: string | string[];
    type?: string | string[];
  }>;
}) {
  const raw = await searchParams;
  const pick = (value: string | string[] | undefined) =>
    Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
  const week = pick(raw.week);
  const missionId = pick(raw.mission);
  const skillId = pick(raw.skill);
  const type = pick(raw.type);
  const missions = getAllMissions();
  const missionMap = new Map(missions.map((mission) => [mission.id, mission]));
  const allEvidence = await db.evidence.findMany({
    orderBy: { createdAt: "desc" },
  });
  const evidence = allEvidence.filter((item) => {
    const mission = missionMap.get(item.missionId);
    return (
      (!week || String(mission?.week) === week) &&
      (!missionId || item.missionId === missionId) &&
      (!skillId || item.skillId === skillId) &&
      (!type || item.type === type)
    );
  });
  const skills = [...new Set(missions.map((mission) => mission.skillId))].sort();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Proof over passive reading"
        title="Evidence Vault"
        description="Text and URL evidence stays deployment-safe and is indexed by week, mission, skill, and evidence type."
      />
      <form action="/evidence" className="mb-6 grid gap-3 border-y border-[#27313d] py-4 md:grid-cols-5">
        <label className="text-xs text-[#96a2b0]">
          Week
          <select name="week" className="field mt-1" defaultValue={week}>
            <option value="">All weeks</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
              <option key={value} value={value}>Week {value}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-[#96a2b0]">
          Mission
          <select name="mission" className="field mt-1" defaultValue={missionId}>
            <option value="">All missions</option>
            {missions.map((mission) => (
              <option key={mission.id} value={mission.id}>
                W{mission.week} · M{mission.order} · {mission.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-[#96a2b0]">
          Skill
          <select name="skill" className="field mt-1" defaultValue={skillId}>
            <option value="">All skills</option>
            {skills.map((skill) => <option key={skill} value={skill}>{skill}</option>)}
          </select>
        </label>
        <label className="text-xs text-[#96a2b0]">
          Type
          <select name="type" className="field mt-1" defaultValue={type}>
            <option value="">All types</option>
            {evidenceTypes.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <button className="btn-secondary self-end" type="submit">
          <Filter size={14} /> Apply filters
        </button>
      </form>
      <p className="mb-4 font-mono text-xs text-[#778493]">
        {evidence.length} of {allEvidence.length} evidence records
      </p>
      {evidence.length === 0 ? (
        <EmptyState
          title="No matching evidence"
          description="Run a mission lab and save command, output, log, explanation, incident, config, test, or reflection evidence."
          href="/today"
          action="Open Today"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {evidence.map((item) => {
            const mission = missionMap.get(item.missionId);
            return (
              <article key={item.id} className="card p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="border border-[#35515a] bg-[#102328] px-2 py-1 font-mono text-[10px] font-bold text-[#62d8d2]">
                    {item.type}
                  </span>
                  <time className="font-mono text-[10px] text-[#6f7c8a]">
                    {item.createdAt.toLocaleString("vi-VN")}
                  </time>
                </div>
                <h2 className="mt-4 font-bold text-white">{item.title}</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#9ba7b4]">
                  {item.content}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-[#28323e] pt-3 text-xs text-[#748291]">
                  {mission ? (
                    <Link
                      href={
                        "/learn/week-" +
                        String(mission.week).padStart(2, "0") +
                        "/" +
                        mission.slug
                      }
                      className="hover:text-[#61d9d3]"
                    >
                      W{mission.week} · {mission.title}
                    </Link>
                  ) : (
                    <span>{item.missionId}</span>
                  )}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#64d9d3]">
                      URL <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
