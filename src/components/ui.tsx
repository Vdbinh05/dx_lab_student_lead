import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Lock,
  Minus,
  ShieldCheck,
} from "lucide-react";
import type { MissionStatus, SourceType } from "@/lib/types";
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-col justify-between gap-4 border-b border-[#202a35] pb-6 md:flex-row md:items-end">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="mt-2 text-3xl font-black tracking-[-.035em] text-white md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8e9baa]">
          {description}
        </p>
      </div>
      {action}
    </header>
  );
}
export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label && (
        <div className="mb-2 flex justify-between text-xs text-[#8d99a8]">
          <span>{label}</span>
          <span className="font-mono text-white">{safe}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-[#222b36]">
        <div
          className="h-full rounded-full bg-[#55d8d2] transition-all"
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}
const styles: Record<MissionStatus, string> = {
  NOT_STARTED: "border-[#34404d] bg-[#171d25] text-[#8f9baa]",
  IN_PROGRESS: "border-[#315d63] bg-[#11272b] text-[#68ddd7]",
  BLOCKED: "border-[#71393d] bg-[#2a1518] text-[#ff9292]",
  READY_FOR_GATE: "border-[#6b5830] bg-[#29220f] text-[#f1c568]",
  PASSED: "border-[#3e6534] bg-[#172514] text-[#b7e968]",
};
export function StatusBadge({ status }: { status: MissionStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold ${styles[status]}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
const source: Record<SourceType, string> = {
  THEO_KE_HOACH_CO: "THEO KẾ HOẠCH CÔ",
  KIEN_THUC_MO_RONG: "KIẾN THỨC MỞ RỘNG ĐỂ SV1 HỌC/DEBUG TỐT HƠN",
  PROJECT_DEFINED_TBD: "PROJECT-DEFINED / TBD",
};
export function SourceBadge({ source: kind }: { source: SourceType }) {
  return (
    <span className="inline-flex rounded border border-[#394656] bg-[#131a23] px-2 py-1 text-[10px] font-extrabold tracking-wide text-[#aeb9c6]">
      {source[kind]}
    </span>
  );
}
export function MetricCard({
  label,
  value,
  detail,
  tone = "cyan",
}: {
  label: string;
  value: string | number;
  detail: string;
  tone?: "cyan" | "lime" | "amber";
}) {
  const color =
    tone === "lime"
      ? "text-[#b8e86a]"
      : tone === "amber"
        ? "text-[#f4bf63]"
        : "text-[#65dfd9]";
  return (
    <div className="card p-4">
      <div className="text-[10px] font-bold uppercase tracking-[.13em] text-[#7e8b9a]">
        {label}
      </div>
      <div className={`metric-number mt-3 text-3xl font-black ${color}`}>
        {value}
      </div>
      <div className="mt-2 text-xs text-[#82909f]">{detail}</div>
    </div>
  );
}
export function BlockerCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border border-[#5b3e2b] bg-[#24190f] p-3 text-sm text-[#e7bd80]">
      <AlertTriangle className="mt-0.5 shrink-0" size={16} />
      <div>{children}</div>
    </div>
  );
}
export function GateBadge({ passed }: { passed: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${passed ? "border-[#456f3a] bg-[#172714] text-[#bce973]" : "border-[#5b4830] bg-[#231c10] text-[#e9ba62]"}`}
    >
      {passed ? <ShieldCheck size={12} /> : <Lock size={12} />}{" "}
      {passed ? "GATE PASS" : "GATE LOCKED"}
    </span>
  );
}
export function SkillLevelBadge({
  current,
  target,
}: {
  current: number;
  target: number;
}) {
  return (
    <div aria-label={`Current level L${current}; target L${target}`}>
      <div className="flex items-center gap-1.5 font-mono text-xs">
        {[0, 1, 2, 3, 4].map((level) => (
          <span
            key={level}
            className={`grid h-7 w-7 place-items-center rounded border ${level <= current ? "border-[#37757a] bg-[#133034] text-[#6be1da]" : level <= target ? "border-[#303b48] bg-[#141a22] text-[#647181]" : "border-[#252d37] text-[#3f4955]"}`}
          >
            {level === 0 ? (
              "0"
            ) : level <= current ? (
              <Check size={12} aria-hidden="true" />
            ) : level === target ? (
              target
            ) : (
              <Minus size={10} aria-hidden="true" />
            )}
          </span>
        ))}
      </div>
      <div className="mt-1 font-mono text-[10px] text-[#7f8c99]">
        CURRENT L{current} · TARGET L{target}
      </div>
    </div>
  );
}
export function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="card p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-[#344252] bg-[#141c26] text-[#7b8a9b]">
        <Lock size={20} />
      </div>
      <h2 className="mt-4 font-bold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#8391a1]">
        {description}
      </p>
      {href && action && (
        <Link href={href} className="btn-secondary mt-5">
          {action}
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
