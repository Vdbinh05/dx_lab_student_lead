"use client";
import { useActionState, useState } from "react";
import { Check, Clipboard } from "lucide-react";
import { useFormStatus } from "react-dom";
import type { FormActionState } from "@/app/actions";

const initialFormState: FormActionState = { ok: false, message: "" };

export function ValidatedForm({
  formAction,
  children,
  className,
}: {
  formAction: (
    state: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, action] = useActionState(formAction, initialFormState);
  return (
    <form action={action} className={className}>
      {children}
      {state.message ? (
        <p
          className={`mt-3 rounded-lg border p-3 text-sm ${state.ok ? "border-[#42653c] bg-[#162416] text-[#b8e576]" : "border-[#663b3f] bg-[#281618] text-[#e99191]"}`}
          role={state.ok ? "status" : "alert"}
          aria-live="polite"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="absolute right-2 top-2 rounded border border-[#354253] bg-[#121923] p-1.5 text-[#8d9aaa] hover:text-white"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      aria-label="Sao chép lệnh"
    >
      {copied ? <Check size={14} /> : <Clipboard size={14} />}
    </button>
  );
}
export function SubmitButton({
  children,
  className = "btn-primary",
  pendingText = "Đang lưu...",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending || disabled}>
      {pending ? pendingText : children}
    </button>
  );
}
