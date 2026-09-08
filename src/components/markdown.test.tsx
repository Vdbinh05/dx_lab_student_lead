import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MarkdownContent } from "@/components/markdown";

describe("Markdown rendering safety", () => {
  it("renders closed teaching reveals with safe nested Markdown and copyable commands", () => {
    const output = renderToStaticMarkup(
      <MarkdownContent
        content={
          '```teaching\nSHOW KEY POINTS\n**Think first**\n\n~~~bash\npwd\n~~~\n\n<script>alert("xss")</script>\n```'
        }
      />,
    );
    expect(output).toContain('<details class="teaching-reveal">');
    expect(output).toContain("<summary>SHOW KEY POINTS</summary>");
    expect(output).toContain("<strong>Think first</strong>");
    expect(output).toContain("<code>pwd</code>");
    expect(output).not.toContain("<script>");
    expect(output).not.toContain(" open=");
  });

  it("supports numbered chunk anchors while keeping regular code blocks", () => {
    const output = renderToStaticMarkup(
      <MarkdownContent content={"## 2. Paths\n\n```bash\npwd\n```"} />,
    );
    expect(output).toContain('id="section-2"');
    expect(output).toContain("<code>pwd</code>");
    expect(output).not.toContain("<details");
  });
  it("escapes raw HTML and does not execute embedded script markup", () => {
    const output = renderToStaticMarkup(
      <MarkdownContent content={'# Safe\n<script>alert("xss")</script>'} />,
    );
    expect(output).not.toContain("<script>");
    expect(output).toContain("&lt;script&gt;");
  });
});
