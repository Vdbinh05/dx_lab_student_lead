import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { saveOralReflectionFormAction } from "@/app/actions";
import { SubmitButton, ValidatedForm } from "@/components/interactive";
import { PageHeader, SourceBadge } from "@/components/ui";
import { getOralDefenseQuestions } from "@/lib/curriculum";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function OralDefensePage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string | string[]; shuffle?: string }>;
}) {
  const params = await searchParams;
  const questions = getOralDefenseQuestions();
  const groups = [...new Set(questions.map((item) => item.group))].sort();
  const rawGroup = Array.isArray(params.group) ? params.group[0] : params.group;
  const selectedGroup = rawGroup && groups.includes(rawGroup) ? rawGroup : groups[0];
  const candidates = questions.filter((item) => item.group === selectedGroup);
  const requestedIndex = Number.parseInt(params.shuffle ?? "0", 10);
  const questionIndex = Number.isFinite(requestedIndex)
    ? Math.abs(requestedIndex) % Math.max(1, candidates.length)
    : 0;
  const question = candidates[questionIndex];
  const reflections = await db.oralReflection.findMany({
    orderBy: { createdAt: "desc" },
  });
  const confidentGroups = new Set(
    reflections.filter((item) => item.confident).map((item) => item.group),
  );

  if (!question) return null;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Mock OLP practice"
        title="Oral Defense"
        description="Answer aloud first. Key points stay collapsed until you deliberately reveal them; confidence is supported by a saved reflection, not a click alone."
        action={
          <Link
            href={
              "/oral-defense?group=" +
              encodeURIComponent(selectedGroup ?? "") +
              "&shuffle=" +
              String(questionIndex + 1)
            }
            className="btn-secondary"
          >
            <RefreshCw size={14} /> Random question
          </Link>
        }
      />
      <nav className="mb-6 flex flex-wrap gap-2" aria-label="Oral defense groups">
        {groups.map((group) => (
          <Link
            key={group}
            href={"/oral-defense?group=" + encodeURIComponent(group) + "&shuffle=0"}
            className={
              "border px-3 py-2 text-xs font-bold " +
              (group === selectedGroup
                ? "border-[#39747a] bg-[#123035] text-[#73e3dc]"
                : "border-[#303b48] bg-[#121923] text-[#9aa7b5]")
            }
          >
            {group}
            {confidentGroups.has(group) ? " · CONFIDENT" : ""}
          </Link>
        ))}
      </nav>
      <section className="card p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="eyebrow">{question.group}</div>
          <SourceBadge source={question.sourceType} />
        </div>
        <h2 className="mt-5 text-2xl font-black leading-9 text-white">
          {question.prompt}
        </h2>
        <details className="mt-7 border-y border-[#344151] py-4">
          <summary className="cursor-pointer font-bold text-[#e7bd80]">
            Reveal key points after answering
          </summary>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-[#b6c0cb]">
            {question.keyPoints.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </details>
        <ValidatedForm
          formAction={saveOralReflectionFormAction}
          className="mt-7"
        >
          <input type="hidden" name="questionId" value={question.id} />
          <input type="hidden" name="group" value={question.group} />
          <label className="block text-xs font-bold text-[#96a4b2]">
            Reflection and evidence gaps
            <textarea
              name="response"
              className="field mt-2 min-h-36 resize-y font-normal"
              minLength={20}
              maxLength={10000}
              required
              placeholder="What did you explain clearly? Which claim still needs command, log, architecture, or regression evidence?"
            />
          </label>
          <label className="mt-4 flex items-center gap-3 border border-[#344151] bg-[#10161e] p-3 text-sm text-[#b8c2cc]">
            <input type="checkbox" name="confident" />
            I can defend this answer and its evidence without prompts.
          </label>
          <SubmitButton className="btn-primary mt-4">Save reflection</SubmitButton>
        </ValidatedForm>
      </section>
      <section className="mt-6 border-t border-[#27313d] pt-5">
        <div className="eyebrow">Practice history</div>
        <p className="mt-2 text-sm text-[#82909f]">
          {reflections.length} reflections · {confidentGroups.size}/{groups.length} groups with confident evidence.
        </p>
      </section>
    </div>
  );
}
