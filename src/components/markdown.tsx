import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "@/components/interactive";
export function CommandBlock({ code }: { code: string }) {
  return (
    <div className="relative">
      <CopyButton value={code} />
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
export function Analogy({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[#324455] bg-[#101a24] p-4">
      {children}
    </section>
  );
}
export function EasyExplanation({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[#315858] bg-[#102222] p-4">
      {children}
    </section>
  );
}
export function TechnicalDefinition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#3b414d] bg-[#15191f] p-4">
      {children}
    </section>
  );
}
export function WhyDXLab({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[#5a4b2c] bg-[#211c10] p-4">
      {children}
    </section>
  );
}
export function Lab({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[#325548] bg-[#11221c] p-4">
      {children}
    </section>
  );
}
export function FailureInjection({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[#713a3f] bg-[#291518] p-4">
      {children}
    </section>
  );
}
export function TroubleshootingFlow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#4c456c] bg-[#1b1829] p-4">
      {children}
    </section>
  );
}
export function SelfCheck({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[#394657] bg-[#131a23] p-4">
      {children}
    </section>
  );
}
export function EvidenceRequirement({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#4c5f36] bg-[#1a2211] p-4">
      {children}
    </section>
  );
}
export function Gate({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[#79612f] bg-[#28200f] p-4">
      {children}
    </section>
  );
}
export function MarkdownContent({ content }: { content: string }) {
  return (
    <article className="prose-training">
      {/* Raw HTML stays disabled intentionally; curriculum Markdown is escaped. */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            const child = children as React.ReactElement<{ children?: string }>;
            const code =
              typeof child?.props?.children === "string"
                ? child.props.children.replace(/\n$/, "")
                : String(child?.props?.children ?? "");
            return <CommandBlock code={code} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
