import { Bookmark, BookmarkCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  recordIncidentAssistance,
  submitIncidentFormAction,
  toggleBookmark,
} from "@/app/actions";
import { SubmitButton, ValidatedForm } from "@/components/interactive";
import { PageHeader } from "@/components/ui";
import { getIncidentById } from "@/lib/curriculum";
import { isWeekUnlockedForPass } from "@/lib/training-state";

export const dynamic = "force-dynamic";

const fields = [
  ["symptom", "SYMPTOM", "Mô tả quan sát, không chèn phỏng đoán."],
  ["evidence", "EVIDENCE", "Lệnh/output/log/port/status đã thu."],
  ["hypothesis", "HYPOTHESIS", "Một giả thuyết có thể kiểm chứng."],
  ["test", "TEST", "Một test phân biệt giả thuyết đúng/sai."],
  ["result", "RESULT", "Kết quả thật của test."],
  ["rootCause", "ROOT CAUSE", "Nguyên nhân gốc cụ thể."],
  ["fix", "FIX", "Thay đổi tối thiểu xử lý root cause."],
  ["verification", "VERIFICATION", "Bằng chứng use case đã hoạt động."],
  ["regression", "REGRESSION", "Kiểm tra để chắc không phá phần khác."],
] as const;

export default async function IncidentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const definition = getIncidentById(id);
  if (!definition) notFound();
  const [attempts, assistance, bookmark, passUnlocked] = await Promise.all([
    db.incidentAttempt.findMany({
      where: { incidentId: id },
      orderBy: { createdAt: "desc" },
    }),
    db.incidentAssistance.findUnique({ where: { incidentId: id } }),
    db.bookmark.findUnique({
      where: {
        targetType_targetId: { targetType: "incident", targetId: id },
      },
    }),
    isWeekUnlockedForPass(definition.week),
  ]);
  const assistanceLevel = assistance?.level ?? "NONE";
  const assistanceRank = ["NONE", "HINT_1", "HINT_2", "SOLUTION"].indexOf(
    assistanceLevel,
  );

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow={
          "Week " +
          definition.week +
          " Boss Fight · Incident #" +
          definition.id.toUpperCase()
        }
        title={definition.title}
        description={definition.scenario}
        action={
          <form action={toggleBookmark}>
            <input type="hidden" name="targetType" value="incident" />
            <input type="hidden" name="targetId" value={definition.id} />
            <input
              type="hidden"
              name="label"
              value={"W" + definition.week + " · " + definition.title}
            />
            <button type="submit" className="btn-secondary">
              {bookmark ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
              {bookmark ? "Bookmarked" : "Bookmark"}
            </button>
          </form>
        }
      />
      {!passUnlocked && (
        <section className="mb-6 border border-[#6a542f] bg-[#231c10] p-4 text-sm leading-6 text-[#e7bf72]">
          <div className="font-mono text-xs font-black">
            AVAILABLE TO READ · LOCKED FOR PASS
          </div>
          <p className="mt-1">
            Scenario and known facts are readable. Assistance and attempts unlock after the previous Week Gate passes.
          </p>
        </section>
      )}
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="card p-6">
          <div className="mb-6 border border-[#51412f] bg-[#201910] p-4">
            <div className="text-xs font-bold text-[#e4b969]">KNOWN FACTS</div>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-[#c5b18d]">
              {definition.knownFacts.map((fact) => (
                <li key={fact}>• {fact}</li>
              ))}
            </ul>
          </div>
          {passUnlocked ? (
            <ValidatedForm formAction={submitIncidentFormAction}>
              <input type="hidden" name="incidentId" value={id} />
              <div className="grid gap-4 md:grid-cols-2">
                {fields.map(([name, label, placeholder]) => (
                  <label
                    key={name}
                    className={
                      "block text-xs font-bold text-[#96a4b2] " +
                      (name === "evidence" || name === "regression"
                        ? "md:col-span-2"
                        : "")
                    }
                  >
                    {label}
                    <textarea
                      name={name}
                      className="field mt-2 min-h-28 resize-y font-normal"
                      minLength={12}
                      required
                      placeholder={placeholder}
                    />
                  </label>
                ))}
              </div>
              {assistanceRank >= 3 && (
                <div className="mt-6 border border-[#654938] bg-[#261c14] p-4 text-sm leading-6 text-[#dfa46e]">
                  <strong>Solution key:</strong> {definition.solution}
                </div>
              )}
              <div className="mt-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <p className="max-w-lg text-xs leading-5 text-[#798694]">
                  CLEAN PASS requires all nine protocol fields, incident-specific diagnosis and command evidence, verification, regression, and no assistance.
                </p>
                <SubmitButton>Nộp attempt</SubmitButton>
              </div>
            </ValidatedForm>
          ) : (
            <div className="border-t border-[#303b48] pt-5 text-sm text-[#82909f]">
              Attempt form is locked for progression integrity.
            </div>
          )}
        </section>
        <aside className="space-y-4">
          <section className="card p-5">
            <div className="eyebrow">Hints</div>
            <p className="mt-2 text-xs leading-5 text-[#7f8c9a]">
              Assistance is persisted server-side. Opening any hint makes the current attempt assisted and ineligible for CLEAN PASS.
            </p>
            {(["HINT_1", "HINT_2", "SOLUTION"] as const).map((level, index) => (
              <div key={level}>
                <form
                  action={recordIncidentAssistance.bind(null, id, level)}
                  className="mt-3"
                >
                  <button
                    className="btn-secondary w-full"
                    type="submit"
                    disabled={!passUnlocked}
                  >
                    {level === "SOLUTION" ? "Reveal solution" : "Open Hint " + (index + 1)}
                  </button>
                </form>
                {assistanceRank >= index + 1 && level !== "SOLUTION" && (
                  <div className="mt-2 border border-[#303b48] p-3 text-sm leading-6 text-[#a3afbc]">
                    {definition.hints[index]}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-3 font-mono text-[10px] text-[#dfa46e]">
              ASSISTANCE: {assistanceLevel}
            </div>
          </section>
          <section className="card p-5">
            <div className="eyebrow">Attempt history</div>
            <div className="mt-3 space-y-2">
              {attempts.length === 0 ? (
                <p className="text-sm text-[#7f8c9a]">No attempts. No synthetic PASS.</p>
              ) : (
                attempts.map((item) => (
                  <div
                    key={item.id}
                    className={
                      "border p-3 text-xs " +
                      (item.passed
                        ? "border-[#42653c] bg-[#162416] text-[#b8e576]"
                        : item.assisted
                          ? "border-[#654938] bg-[#261c14] text-[#dfa46e]"
                          : "border-[#663b3f] bg-[#281618] text-[#e99191]")
                    }
                  >
                    {item.passed
                      ? "CLEAN PASS"
                      : item.assisted
                        ? "ASSISTED / FAIL"
                        : "FAIL"}
                    <div className="mt-1 opacity-70">
                      Assistance: {item.assistanceLevel}
                    </div>
                    <div className="mt-1 opacity-70">
                      {item.createdAt.toLocaleString("vi-VN")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
