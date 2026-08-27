import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MarkdownContent } from "@/components/markdown";

describe("Markdown rendering safety", () => {
  it("escapes raw HTML and does not execute embedded script markup", () => {
    const output = renderToStaticMarkup(
      <MarkdownContent content={'# Safe\n<script>alert("xss")</script>'} />,
    );
    expect(output).not.toContain("<script>");
    expect(output).toContain("&lt;script&gt;");
  });
});
