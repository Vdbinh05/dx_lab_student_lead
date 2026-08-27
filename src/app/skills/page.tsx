import { db } from "@/lib/db";
import { PageHeader, SkillLevelBadge } from "@/components/ui";
import { skillDefinitions } from "@/lib/database-maintenance";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const skills = await db.skillProgress.findMany({ orderBy: { id: "asc" } });
  const definitions = new Map<
    string,
    { name: string; target: number; group: string }
  >(
    skillDefinitions.map(([id, name, target, group]) => [
      id,
      { name, target, group },
    ]),
  );
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Deterministic L0–L4"
        title="Skill Matrix"
        description="Levels are calculated from theory, labs, quiz, evidence, incidents, clean Boss Fights, explanation, verification, and regression."
      />
      <div className="card overflow-hidden">
        <div className="hidden grid-cols-[1.2fr_.8fr_.7fr_1.4fr] gap-4 border-b border-[#2a3440] bg-[#0d131a] px-5 py-3 text-[10px] font-bold uppercase text-[#778493] md:grid">
          <div>Skill</div><div>Level</div><div>Evidence</div><div>Next proof</div>
        </div>
        <div className="divide-y divide-[#26303b]">
          {skills.map((skill) => {
            const meta = definitions.get(skill.id);
            const remaining =
              skill.currentLevel >= skill.targetLevel
                ? "Target met; retain through regression and release evidence."
                : "Complete mapped mission labs, evidence, quiz, and clean weekly incident.";
            return (
              <div key={skill.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1.2fr_.8fr_.7fr_1.4fr] md:items-center">
                <div>
                  <div className="text-sm font-bold text-white">
                    {meta?.name ?? skill.id.replaceAll("-", " ")}
                  </div>
                  <div className="mt-1 text-[10px] font-bold uppercase text-[#687787]">
                    {meta?.group ?? "Roadmap skill"}
                  </div>
                </div>
                <SkillLevelBadge current={skill.currentLevel} target={skill.targetLevel} />
                <div className="font-mono text-sm text-[#93a2b0]">{skill.evidenceCount}</div>
                <div className="text-xs leading-5 text-[#82909e]">{remaining}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
