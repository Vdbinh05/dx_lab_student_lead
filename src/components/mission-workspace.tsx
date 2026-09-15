import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  Circle,
  Clock,
  LockKeyhole,
  Play,
  ShieldCheck,
} from "lucide-react";
import type { Mission } from "@/lib/types";
import type {
  Evidence,
  MissionNote,
  MissionProgress,
  QuizAttempt,
} from "@/generated/prisma/client";
import {
  importVerificationFormAction,
  attemptMissionGate,
  clearMissionBlocker,
  reportMissionBlockerFormAction,
  saveEvidenceFormAction,
  saveMissionNoteFormAction,
  startMission,
  submitQuizFormAction,
  toggleBookmark,
  toggleMissionStep,
} from "@/app/actions";
import { MarkdownContent } from "@/components/markdown";
import { SubmitButton, ValidatedForm } from "@/components/interactive";
import { GateBadge, SourceBadge, StatusBadge } from "@/components/ui";
import type { GateResult } from "@/lib/types";
import { evidenceTypes } from "@/lib/types";
import { getWeek } from "@/lib/curriculum";

type Props = {
  mission: Mission;
  progress: MissionProgress | null;
  evidence: Evidence[];
  quizAttempts: QuizAttempt[];
  completedSteps: string[];
  gate: GateResult;
  note: MissionNote | null;
  bookmarked: boolean;
  labBookmarks: string[];
  passUnlocked: boolean;
  readOnlyReason: string | null;
  previous?: Mission;
  next?: Mission;
};
const stageLabels: Record<string, string> = {
  learn: "Learn",
  practice: "Practice",
  build: "Build",
  break: "Break",
  debug: "Debug",
  evidence: "Evidence",
  quiz: "Quiz",
};

export function MissionWorkspace({
  mission,
  progress,
  evidence,
  quizAttempts,
  completedSteps,
  gate,
  note,
  bookmarked,
  labBookmarks,
  passUnlocked,
  readOnlyReason,
  previous,
  next,
}: Props) {
  const submittedEvidenceTypes = new Set(evidence.map((item) => item.type));
  const quizPassed = quizAttempts.some((item) => item.passed);
  const currentStatus = (progress?.status ?? "NOT_STARTED") as
    "NOT_STARTED" | "IN_PROGRESS" | "BLOCKED" | "READY_FOR_GATE" | "PASSED";
  const missionPassed = currentStatus === "PASSED";
  const mutable = passUnlocked && !missionPassed;
  const bossFightId = getWeek(mission.week)?.bossFightId;
  const serviceInventoryTemplate = [
    "Service | Owner | Image/version | Internal port | Host port | Hostname",
    "Network | Volume | Health | Env | Auth | Dependencies",
    "Public/Internal URL | Source checked | Freeze decision",
    "backend | SV2 (implementation), SV1 (runtime) | <version> | <port> | <port> | backend",
    "<network> | <volume> | <health command/URL> | <env names, no secrets> | <method> | <services>",
    "<URL and boundary> | <Compose/.env.example/docs> | FROZEN / CHANGE REQUIRED",
  ].join("\n");
  return (
    <div className="mx-auto max-w-[1450px]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link
          href={"/weeks/" + mission.week}
          className="inline-flex items-center gap-2 text-[#8f9bab] hover:text-white"
        >
          <ArrowLeft size={15} /> Week {mission.week} overview
        </Link>
        <div className="flex items-center gap-2">
          <SourceBadge source={mission.sourceType} />
          <StatusBadge status={currentStatus} />
        </div>
      </div>
      {mission.week === 1 && mission.order <= 3 && (
        <section className="card mb-6 p-5">
          <h2 className="font-bold text-[#72e4de]">Năm điểm tựa của bài học</h2>
          <nav
            aria-label="Teaching pillars"
            className="mt-3 flex flex-wrap gap-3 text-sm text-[#a7b2bf]"
          >
            <a className="py-2 underline" href="#section-2">
              WHY / REAL-LIFE METAPHOR
            </a>
            <a
              className="py-2 underline"
              href={mission.order === 3 ? "#section-2" : "#section-3"}
            >
              VISUAL MODEL
            </a>
            <a
              className="py-2 underline"
              href={mission.order === 1 ? "#section-5" : "#section-4"}
            >
              COMMAND WALKTHROUGH
            </a>
            <a
              className="py-2 underline"
              href={mission.order === 2 ? "#section-9" : "#section-8"}
            >
              GOTCHAS / TROUBLESHOOTING
            </a>
            <a className="py-2 underline" href="#verification-pilot">
              ACTION GATE
            </a>
          </nav>
          <p className="mt-2 text-sm">
            Mỗi chặng: hiểu vì sao → dự đoán → chạy → quan sát → tự giải thích.
            Nghỉ sau một thí nghiệm nếu cần.
          </p>
        </section>
      )}
      <header className="card mb-6 overflow-hidden">
        <div className="border-b border-[#26313e] bg-[#0e141d] px-6 py-4">
          <div className="eyebrow">
            Week {mission.week} · Mission{" "}
            {String(mission.order).padStart(2, "0")}
          </div>
        </div>
        <div className="grid gap-5 px-6 py-6 md:grid-cols-[1fr_auto]">
          <div>
            <h1 className="text-3xl font-black tracking-[-.035em] text-white">
              {mission.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#96a3b2]">
              {mission.whyItMatters}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {mission.objectives.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-[#2d3947] bg-[#111821] px-2.5 py-1 text-xs text-[#aab5c2]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="min-w-40 border-l border-[#26303b] pl-5">
            <div className="flex items-center gap-2 text-sm text-[#8e9aa9]">
              <Clock size={15} />
              {mission.estimatedMinutes} phút
            </div>
            <div className="mt-3 text-xs text-[#778493]">Target</div>
            <div className="mt-1 font-mono text-xl font-black text-[#67ddd7]">
              {mission.targetLevel}
            </div>
            {passUnlocked && currentStatus === "NOT_STARTED" && (
              <form
                action={startMission.bind(null, mission.id)}
                className="mt-4"
              >
                <SubmitButton>
                  <Play size={14} />
                  Bắt đầu mission
                </SubmitButton>
              </form>
            )}
            <form action={toggleBookmark} className="mt-3">
              <input type="hidden" name="targetType" value="mission" />
              <input type="hidden" name="targetId" value={mission.id} />
              <input
                type="hidden"
                name="label"
                value={"W" + mission.week + " · " + mission.title}
              />
              <button type="submit" className="btn-secondary w-full">
                {bookmarked ? (
                  <BookmarkCheck size={14} />
                ) : (
                  <Bookmark size={14} />
                )}
                {bookmarked ? "Đã bookmark" : "Bookmark mission"}
              </button>
            </form>
            <div className="mt-3 border-t border-[#29333f] pt-3">
              <div className="text-[10px] font-bold uppercase text-[#778493]">
                Lab bookmarks
              </div>
              <div className="mt-2 grid gap-2">
                {[
                  ["guided", "Guided lab"],
                  ["independent", "Independent lab"],
                  ["integration", "Integration lab"],
                ].map(([kind, label]) => {
                  const targetId = `${mission.id}:${kind}`;
                  const active = labBookmarks.includes(targetId);
                  return (
                    <form action={toggleBookmark} key={kind}>
                      <input type="hidden" name="targetType" value="lab" />
                      <input type="hidden" name="targetId" value={targetId} />
                      <input
                        type="hidden"
                        name="label"
                        value={`W${mission.week} · ${mission.title} · ${label}`}
                      />
                      <button
                        type="submit"
                        className="btn-secondary w-full text-xs"
                      >
                        {active ? (
                          <BookmarkCheck size={13} />
                        ) : (
                          <Bookmark size={13} />
                        )}
                        {active ? `Đã lưu ${label}` : `Lưu ${label}`}
                      </button>
                    </form>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </header>
      {readOnlyReason && (
        <section className="mb-6 rounded-xl border border-[#6a542f] bg-[#231c10] p-4 text-sm leading-6 text-[#e7bf72]">
          <div className="font-mono text-xs font-bold">
            AVAILABLE TO READ · LOCKED FOR PASS
          </div>
          <p className="mt-1">
            {readOnlyReason}. Bạn có thể đọc nội dung và bookmark, nhưng
            progress, evidence, quiz và gate vẫn bị khóa server-side.
          </p>
        </section>
      )}
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_370px]">
        <section className="card min-w-0 p-6 md:p-8">
          <MarkdownContent content={mission.content} />
          <div className="mt-9 flex justify-between border-t border-[#27313d] pt-5">
            {previous ? (
              <Link
                href={`/learn/week-${String(previous.week).padStart(2, "0")}/${previous.slug}`}
                className="btn-secondary"
              >
                <ArrowLeft size={15} />
                {previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/learn/week-${String(next.week).padStart(2, "0")}/${next.slug}`}
                className="btn-secondary"
              >
                {next.title}
                <ArrowRight size={15} />
              </Link>
            ) : bossFightId ? (
              <Link
                href={"/incidents/" + bossFightId}
                className="btn-secondary"
              >
                Week {mission.week} Boss Fight
                <ArrowRight size={15} />
              </Link>
            ) : (
              <Link href={"/weeks/" + mission.week} className="btn-secondary">
                Week overview
              </Link>
            )}
          </div>
        </section>
        <aside className="min-w-0 space-y-5 xl:sticky xl:top-6 xl:self-start">
          <section className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="eyebrow">Mission loop</div>
                <h2 className="mt-1 font-bold text-white">
                  Execution checklist
                </h2>
              </div>
              <GateBadge passed={missionPassed} />
            </div>
            <div className="mt-5 space-y-2">
              {[
                "learn",
                "practice",
                "build",
                "break",
                "debug",
                "evidence",
                "quiz",
              ].map((step) => {
                const auto =
                  step === "evidence"
                    ? mission.requiredEvidence.every((type) =>
                        submittedEvidenceTypes.has(type),
                      )
                    : step === "quiz"
                      ? quizPassed
                      : false;
                const done = completedSteps.includes(step) || auto;
                const locked = step === "evidence" || step === "quiz";
                const blocked = currentStatus === "BLOCKED";
                const disabled = locked || blocked || !mutable;
                return (
                  <form
                    key={step}
                    action={
                      disabled
                        ? undefined
                        : toggleMissionStep.bind(null, mission.id, step)
                    }
                  >
                    <button
                      type={disabled ? "button" : "submit"}
                      disabled={disabled}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm ${done ? "border-[#355b39] bg-[#142218] text-[#b6e676]" : "border-[#2b3541] bg-[#10161e] text-[#99a5b2]"}`}
                    >
                      <span className="flex items-center gap-2">
                        {done ? (
                          <Check size={15} />
                        ) : locked || !passUnlocked ? (
                          <LockKeyhole size={14} />
                        ) : (
                          <Circle size={14} />
                        )}{" "}
                        {stageLabels[step]}
                      </span>
                      <span className="font-mono text-[10px]">
                        {done
                          ? "DONE"
                          : locked
                            ? "AUTO"
                            : !passUnlocked
                              ? "READ"
                              : "MARK"}
                      </span>
                    </button>
                  </form>
                );
              })}
              <div
                className={`flex items-center justify-between rounded-lg border px-3 py-3 text-sm font-bold ${missionPassed ? "border-[#4d753e] bg-[#192917] text-[#c0ea7c]" : "border-[#6b512e] bg-[#251d10] text-[#edbe69]"}`}
              >
                <span className="flex items-center gap-2">
                  {missionPassed ? (
                    <ShieldCheck size={16} />
                  ) : (
                    <LockKeyhole size={15} />
                  )}{" "}
                  Gate
                </span>
                {missionPassed
                  ? "PASS"
                  : gate.eligibleForHardGate
                    ? "READY"
                    : "LOCKED"}
              </div>
            </div>
            {!gate.passed && (
              <div className="mt-4 space-y-2">
                {gate.blockers.map((item) => (
                  <div key={item} className="text-xs leading-5 text-[#c39163]">
                    • {item}
                  </div>
                ))}
              </div>
            )}
            {passUnlocked && (
              <form
                action={attemptMissionGate.bind(null, mission.id)}
                className="mt-4"
              >
                <SubmitButton
                  disabled={missionPassed}
                  className="btn-primary w-full"
                  pendingText="Đang kiểm tra gate..."
                >
                  {missionPassed
                    ? "Mission đã PASS"
                    : gate.eligibleForHardGate
                      ? "Chốt PASS Mission"
                      : "Kiểm tra PASS Gate"}
                </SubmitButton>
              </form>
            )}
          </section>
          {!missionPassed && passUnlocked && (
            <section className="card p-5">
              <div className="eyebrow !text-[#ef8d92]">Blocker control</div>
              {currentStatus === "BLOCKED" ? (
                <div className="mt-3">
                  <div className="rounded-lg border border-[#71393d] bg-[#2a1518] p-3 text-sm leading-6 text-[#ffaaaa]">
                    {progress?.notes ?? "Blocker chưa có mô tả."}
                  </div>
                  <form
                    action={clearMissionBlocker.bind(null, mission.id)}
                    className="mt-3"
                  >
                    <SubmitButton className="btn-secondary w-full">
                      Đã xử lý blocker · tiếp tục mission
                    </SubmitButton>
                  </form>
                </div>
              ) : (
                <ValidatedForm
                  formAction={reportMissionBlockerFormAction}
                  className="mt-3"
                >
                  <input type="hidden" name="missionId" value={mission.id} />
                  <label className="block text-xs text-[#96a2b0]">
                    Evidence của blocker
                    <textarea
                      name="notes"
                      className="field mt-1 min-h-24 resize-y"
                      minLength={12}
                      maxLength={2000}
                      required
                      placeholder="Symptom, evidence đã có và điều kiện cần để tiếp tục..."
                    />
                  </label>
                  <SubmitButton className="btn-secondary mt-3 w-full">
                    Đánh dấu BLOCKED
                  </SubmitButton>
                </ValidatedForm>
              )}
            </section>
          )}
          {passUnlocked && !missionPassed && (
            <>
              {mission.id === "w8-m2-configuration-freeze-change-impact" && (
                <section className="card p-5">
                  <div className="eyebrow">Configuration freeze</div>
                  <h2 className="mt-1 font-bold text-white">
                    Service Inventory
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-[#82909f]">
                    Điền từ Compose, .env.example và tài liệu thực tế. Không ghi
                    giá trị secret.
                  </p>
                  <ValidatedForm
                    formAction={saveEvidenceFormAction}
                    className="mt-4"
                  >
                    <input type="hidden" name="missionId" value={mission.id} />
                    <input type="hidden" name="type" value="config" />
                    <input
                      type="hidden"
                      name="title"
                      value="Configuration Freeze Service Inventory"
                    />
                    <textarea
                      name="content"
                      className="field min-h-72 resize-y font-mono text-xs"
                      minLength={80}
                      defaultValue={serviceInventoryTemplate}
                      required
                    />
                    <SubmitButton className="btn-secondary mt-3 w-full">
                      Lưu Service Inventory evidence
                    </SubmitButton>
                  </ValidatedForm>
                </section>
              )}
              <section className="card p-5">
                <div className="eyebrow">Evidence vault</div>
                <h2 className="mt-1 font-bold text-white">Nộp bằng chứng</h2>
                <p className="mt-2 text-xs leading-5 text-[#82909f]">
                  Bắt buộc: {mission.requiredEvidence.join(" · ")}
                </p>
                <ValidatedForm
                  formAction={saveEvidenceFormAction}
                  className="mt-4 space-y-3"
                >
                  <input type="hidden" name="missionId" value={mission.id} />
                  <label className="block text-xs text-[#96a2b0]">
                    Loại evidence
                    <select name="type" className="field mt-1" required>
                      {evidenceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs text-[#96a2b0]">
                    Tiêu đề
                    <input
                      name="title"
                      className="field mt-1"
                      minLength={3}
                      required
                      placeholder="VD: Absolute path lab"
                    />
                  </label>
                  <label className="block text-xs text-[#96a2b0]">
                    Nội dung
                    <textarea
                      name="content"
                      className="field mt-1 min-h-28 resize-y"
                      minLength={12}
                      required
                      placeholder="Lệnh, output, giải thích, verification..."
                    />
                  </label>
                  <label className="block text-xs text-[#96a2b0]">
                    URL tùy chọn
                    <input
                      name="url"
                      type="url"
                      className="field mt-1"
                      placeholder="https://github.com/..."
                    />
                  </label>
                  <SubmitButton className="btn-secondary w-full">
                    Lưu evidence
                  </SubmitButton>
                </ValidatedForm>
                {evidence.length > 0 && (
                  <div className="mt-4 border-t border-[#29333f] pt-3 text-xs text-[#86a18e]">
                    Đã lưu {evidence.length} evidence ·{" "}
                    {submittedEvidenceTypes.size} loại
                  </div>
                )}
              </section>
              <section className="card p-5">
                <div className="eyebrow">Knowledge gate</div>
                <h2 className="mt-1 font-bold text-white">
                  Quiz · PASS ≥ {mission.quizPassScore}%
                </h2>
                {quizAttempts[0] && (
                  <div
                    className={`mt-3 rounded-lg border p-3 text-sm ${quizAttempts[0].passed ? "border-[#41643b] bg-[#162415] text-[#b7e679]" : "border-[#693d3d] bg-[#271617] text-[#ee9999]"}`}
                  >
                    Lần gần nhất: <strong>{quizAttempts[0].score}%</strong> ·{" "}
                    {quizAttempts[0].passed ? "PASS" : "FAIL"}
                  </div>
                )}
                <ValidatedForm
                  formAction={submitQuizFormAction.bind(null, mission.id)}
                  className="mt-4 space-y-5"
                >
                  {mission.quiz.map((question, index) => (
                    <fieldset key={question.id}>
                      <legend className="text-sm font-semibold leading-5 text-[#d9e1e8]">
                        {index + 1}. {question.prompt}
                      </legend>
                      {question.type === "multiple-choice" ? (
                        <div className="mt-2 space-y-2">
                          {question.options?.map((option) => (
                            <label
                              key={option}
                              className="flex cursor-pointer gap-2 rounded border border-[#2c3642] bg-[#10161e] p-2 text-xs text-[#a9b4c0]"
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={option}
                                required
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      ) : (
                        <textarea
                          className="field mt-2 min-h-20 text-xs"
                          name={question.id}
                          required
                          minLength={
                            question.type === "self-explanation" ? 40 : 1
                          }
                          placeholder={
                            question.type === "self-explanation"
                              ? "Giải thích ít nhất 40 ký tự..."
                              : "Câu trả lời ngắn..."
                          }
                        />
                      )}
                    </fieldset>
                  ))}
                  <SubmitButton className="btn-secondary w-full">
                    Nộp quiz
                  </SubmitButton>
                </ValidatedForm>
              </section>
            </>
          )}
          <section className="card p-5">
            <div className="eyebrow">Personal notes</div>
            <h2 className="mt-1 font-bold text-white">Mission note</h2>
            <p className="mt-2 text-xs leading-5 text-[#82909f]">
              Plain text/Markdown cá nhân. Note không thay thế evidence hoặc
              mission PASS.
            </p>
            <ValidatedForm
              formAction={saveMissionNoteFormAction}
              className="mt-4"
            >
              <input type="hidden" name="missionId" value={mission.id} />
              <textarea
                name="content"
                className="field min-h-28 resize-y text-xs"
                minLength={1}
                maxLength={20000}
                defaultValue={note?.content ?? ""}
                required
                placeholder="Mental model, lệnh, câu hỏi hoặc follow-up..."
              />
              <SubmitButton className="btn-secondary mt-3 w-full">
                Lưu note
              </SubmitButton>
            </ValidatedForm>
          </section>
        </aside>
      </div>
      {mission.week === 1 && mission.order <= 3 && (
        <section id="verification-pilot" className="card mt-6 p-5">
          <h2 className="text-xl font-bold">DX-Verify · Action evidence</h2>
          <p className="my-3 text-sm leading-6">
            Chạy verifier trong Ubuntu theo phần cuối bài. Dán JSON bên dưới; dữ
            liệu chỉ được lưu làm test-result, không tự PASS hay tăng skill.
            File tồn tại chưa chứng minh bạn hiểu bài.
          </p>
          {mutable ? (
            <ValidatedForm formAction={importVerificationFormAction}>
              <input type="hidden" name="missionId" value={mission.id} />
              <label className="block text-sm">
                Verification report JSON
                <textarea
                  name="report"
                  className="field my-3 min-h-40 font-mono text-xs"
                  required
                  maxLength={10000}
                />
              </label>
              <SubmitButton>Lưu verification report</SubmitButton>
            </ValidatedForm>
          ) : (
            <p className="text-sm">
              Chỉ nộp khi mission đang mở cho thực hành và chưa PASS.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
