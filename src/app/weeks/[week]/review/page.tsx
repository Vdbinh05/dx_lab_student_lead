import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import { attemptWeekGate, submitWeeklyQuizFormAction } from "@/app/actions";
import { SubmitButton, ValidatedForm } from "@/components/interactive";
import { BlockerCard, PageHeader } from "@/components/ui";
import { getWeekSummary } from "@/lib/app-data";

export const dynamic = "force-dynamic";

export default async function WeekReviewPage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const weekNumber = Number.parseInt((await params).week, 10);
  const summary = await getWeekSummary(weekNumber);
  if (!summary) notFound();
  const { definition, gate, passUnlocked, weeklyProgress } = summary;
  const gatePassed = weeklyProgress?.hardGatePassed === true;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow={"Week " + weekNumber + " review"}
        title="Can I move to the next week?"
        description={
          definition.title +
          " · Weekly gate requires every mission PASS, weekly quiz threshold, and an unassisted Boss Fight CLEAN PASS."
        }
        action={
          <Link href={"/weeks/" + weekNumber} className="btn-secondary">
            Week overview
          </Link>
        }
      />
      <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {[
          ["Missions", summary.missionPassed + "/" + summary.missions.length],
          ["Quiz avg", summary.quizAverage + "%"],
          ["Labs", String(summary.labsCompleted)],
          ["Incidents", String(summary.incidentsSolved)],
          ["Evidence", String(summary.evidenceCount)],
          ["Skills", String(summary.skills.length)],
        ].map(([label, value]) => (
          <div key={label} className="card p-4">
            <div className="text-[10px] font-bold uppercase text-[#778493]">{label}</div>
            <div className="metric-number mt-2 text-2xl font-black text-white">{value}</div>
          </div>
        ))}
      </section>
      <section
        className={
          "mb-6 border p-5 " +
          (gatePassed || gate.eligible
            ? "border-[#3f6938] bg-[#152515]"
            : "border-[#5b3e2b] bg-[#24190f]")
        }
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              {gatePassed || gate.eligible ? (
                <CheckCircle2 size={18} className="text-[#b8e774]" />
              ) : (
                <LockKeyhole size={18} className="text-[#e7bd80]" />
              )}
              <h2 className="font-black text-white">
                {gatePassed
                  ? "YES · WEEK GATE PASSED"
                  : gate.eligible
                    ? "YES · READY TO COMMIT"
                    : "NO · HARD BLOCKERS REMAIN"}
              </h2>
            </div>
            {!gatePassed && gate.blockers.length > 0 && (
              <div className="mt-3 space-y-2">
                {gate.blockers.map((item) => (
                  <BlockerCard key={item}>{item}</BlockerCard>
                ))}
              </div>
            )}
          </div>
          {passUnlocked && !gatePassed && (
            <form action={attemptWeekGate.bind(null, weekNumber)}>
              <SubmitButton disabled={!gate.eligible}>
                <ShieldCheck size={15} />
                Commit Week Gate
              </SubmitButton>
            </form>
          )}
        </div>
      </section>
      {!passUnlocked && (
        <section className="mb-6 border border-[#6a542f] bg-[#231c10] p-4 text-sm text-[#e7bf72]">
          AVAILABLE TO READ · LOCKED FOR PASS until Week {weekNumber - 1} gate is committed.
        </section>
      )}
      <section className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="border-t border-[#27313d] pt-5">
          <div className="eyebrow">Boss Fight</div>
          <h2 className="mt-2 font-black text-white">{definition.bossFightId}</h2>
          <p className="mt-2 text-sm text-[#82909f]">
            Clean PASS only. Any hint or solution makes that attempt assisted.
          </p>
          <Link
            href={"/incidents/" + definition.bossFightId}
            className="btn-secondary mt-4"
          >
            Open Boss Fight <ArrowRight size={14} />
          </Link>
        </div>
        <div className="border-t border-[#27313d] pt-5">
          <div className="eyebrow">Deliverables</div>
          <ul className="mt-3 space-y-2 text-sm text-[#aab5c2]">
            {definition.deliverables.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </section>
      {passUnlocked && !gatePassed && (
        <section className="card p-6">
          <div className="eyebrow">Weekly knowledge gate</div>
          <h2 className="mt-2 text-xl font-black text-white">
            {summary.quizQuestions.length} questions · PASS ≥ {definition.weeklyQuizPassScore}%
          </h2>
          <ValidatedForm
            formAction={submitWeeklyQuizFormAction.bind(null, weekNumber)}
            className="mt-6 space-y-6"
          >
            {summary.quizQuestions.map((question, index) => (
              <fieldset key={question.id} className="border-t border-[#283340] pt-5">
                <legend className="text-sm font-bold leading-6 text-white">
                  {index + 1}. {question.prompt}
                </legend>
                {question.type === "multiple-choice" ? (
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {question.options?.map((option) => (
                      <label
                        key={option}
                        className="flex cursor-pointer gap-2 border border-[#2c3642] bg-[#10161e] p-3 text-xs text-[#a9b4c0]"
                      >
                        <input type="radio" name={question.id} value={option} required />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    name={question.id}
                    className="field mt-3 min-h-24"
                    minLength={question.type === "self-explanation" ? 40 : 1}
                    required
                  />
                )}
              </fieldset>
            ))}
            <SubmitButton>Nộp weekly quiz</SubmitButton>
          </ValidatedForm>
        </section>
      )}
    </div>
  );
}
