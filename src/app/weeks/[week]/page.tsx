import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  LockKeyhole,
  ShieldAlert,
} from "lucide-react";
import { getWeekSummary } from "@/lib/app-data";
import { PageHeader, ProgressBar, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-xs font-black uppercase text-[#67ddd7]">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#aab5c2]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-[#607080]">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function WeekPage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const weekNumber = Number.parseInt((await params).week, 10);
  const summary = await getWeekSummary(weekNumber);
  if (!summary) notFound();
  const { definition, missions, progress, gate, weeklyProgress, passUnlocked } =
    summary;
  const progressMap = new Map(progress.map((item) => [item.missionId, item]));
  const percent = Math.round((summary.missionPassed / missions.length) * 100);
  const gatePassed = weeklyProgress?.hardGatePassed === true;

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow={"Week " + weekNumber + " operating page"}
        title={definition.title}
        description={definition.goal}
        action={
          <Link href={"/weeks/" + weekNumber + "/review"} className="btn-primary">
            Weekly review
            <ArrowRight size={15} />
          </Link>
        }
      />
      <section
        className={
          "mb-6 border p-4 " +
          (passUnlocked
            ? "border-[#35655e] bg-[#102420] text-[#8de0d5]"
            : "border-[#6a542f] bg-[#231c10] text-[#e7bf72]")
        }
      >
        <div className="flex items-start gap-3">
          {passUnlocked ? <CheckCircle2 size={18} /> : <LockKeyhole size={18} />}
          <div>
            <div className="font-mono text-xs font-black">
              {gatePassed
                ? "WEEK GATE PASSED"
                : passUnlocked
                  ? "UNLOCKED FOR PASS"
                  : "AVAILABLE TO READ · LOCKED FOR PASS"}
            </div>
            <p className="mt-1 text-sm leading-6">
              {gatePassed
                ? "Week này đã qua hard gate; learner state được giữ nguyên."
                : passUnlocked
                  ? "Bạn có thể lưu progress, evidence, quiz và Boss Fight cho week này."
                  : "Đọc và bookmark được phép; mọi mutation vẫn bị khóa server-side cho đến khi week trước PASS."}
            </p>
          </div>
        </div>
      </section>
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card p-4">
          <div className="eyebrow">Missions</div>
          <div className="metric-number mt-2 text-3xl font-black text-white">
            {summary.missionPassed}/{missions.length}
          </div>
          <ProgressBar value={percent} />
        </div>
        <div className="card p-4">
          <div className="eyebrow">Weekly quiz</div>
          <div className="metric-number mt-2 text-3xl font-black text-white">
            {gate.quizScore ?? 0}%
          </div>
          <p className="mt-2 text-xs text-[#82909f]">
            PASS ≥ {definition.weeklyQuizPassScore}%
          </p>
        </div>
        <div className="card p-4">
          <div className="eyebrow">Evidence</div>
          <div className="metric-number mt-2 text-3xl font-black text-white">
            {summary.evidenceCount}
          </div>
          <p className="mt-2 text-xs text-[#82909f]">learner artifacts</p>
        </div>
        <div className="card p-4">
          <div className="eyebrow">Boss Fight</div>
          <div className="mt-3 font-mono text-sm font-black text-white">
            {gate.bossFightPassed ? "CLEAN PASS" : "OPEN"}
          </div>
          <Link
            href={"/incidents/" + definition.bossFightId}
            className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#67ddd7]"
          >
            Open incident <ArrowRight size={13} />
          </Link>
        </div>
      </section>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section>
          <div className="mb-3 flex items-center gap-2">
            <BookOpen size={17} className="text-[#67ddd7]" />
            <h2 className="text-lg font-black text-white">Missions</h2>
          </div>
          <div className="space-y-3">
            {missions.map((mission) => {
              const status = (progressMap.get(mission.id)?.status ??
                "NOT_STARTED") as
                | "NOT_STARTED"
                | "IN_PROGRESS"
                | "BLOCKED"
                | "READY_FOR_GATE"
                | "PASSED";
              return (
                <article
                  key={mission.id}
                  className="border-b border-[#27313d] py-4 first:border-t"
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div>
                      <div className="font-mono text-[10px] text-[#6fded8]">
                        MISSION {String(mission.order).padStart(2, "0")} · {mission.category}
                      </div>
                      <h3 className="mt-1 font-bold text-white">{mission.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-[#8491a0]">
                        {mission.roadmapCompetency}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <StatusBadge status={status} />
                      <Link
                        href={
                          "/learn/week-" +
                          String(mission.week).padStart(2, "0") +
                          "/" +
                          mission.slug
                        }
                        className="btn-secondary"
                      >
                        Open <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        <aside className="space-y-6">
          <section className="border-t border-[#27313d] pt-5">
            <ListBlock title="Knowledge" items={definition.knowledge} />
          </section>
          <section className="border-t border-[#27313d] pt-5">
            <ListBlock title="Practice" items={definition.practice} />
          </section>
          <section className="border-t border-[#27313d] pt-5">
            <ListBlock title="Build" items={definition.build} />
          </section>
          <section className="border-t border-[#27313d] pt-5">
            <ListBlock title="Failure drill" items={definition.failureDrill} />
          </section>
          <section className="border-t border-[#27313d] pt-5">
            <ListBlock title="Evidence checklist" items={definition.evidence} />
          </section>
          <section className="border-t border-[#27313d] pt-5">
            <ListBlock title="Definition of Done" items={definition.definitionOfDone} />
          </section>
          <section className="border border-[#5b3e2b] bg-[#24190f] p-4">
            <div className="flex items-center gap-2 text-[#e7bd80]">
              <ShieldAlert size={16} />
              <h2 className="text-xs font-black uppercase">Hard gates</h2>
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-[#d3b483]">
              {definition.hardGates.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
