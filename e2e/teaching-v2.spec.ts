import { expect, test } from "@playwright/test";
import fs from "node:fs";

for (const width of [1440, 390]) {
  for (const number of [1, 2, 3]) {
    test(`Teaching V2 mission ${number} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/learn/week-01/mission-0${number}`);
      await expect(
        page.getByRole("heading", { name: /TRƯỚC KHI HỌC/ }),
      ).toBeVisible();
      await expect(
        page.locator("article.prose-training").first(),
      ).toContainText("GIẢI THÍCH CHO MỘT NGƯỜI CHƯA HỌC IT");
      const reveal = page
        .locator("details")
        .filter({ has: page.locator("summary", { hasText: "TÔI CHƯA HIỂU" }) })
        .first();
      await expect(reveal).not.toHaveAttribute("open", "");
      await reveal.locator("summary").click();
      await expect(reveal).toHaveAttribute("open", "");
      await expect(reveal.locator("article")).toBeVisible();
      fs.mkdirSync("artifacts/teaching-v2", { recursive: true });
      await reveal.screenshot({
        path: `artifacts/teaching-v2/reveal-m${number}-${width}.png`,
      });
      await reveal.locator("summary").focus();
      await page.keyboard.press("Enter");
      await expect(reveal).not.toHaveAttribute("open", "");
      const key = page
        .locator("details")
        .filter({
          has: page.locator("summary", { hasText: "SHOW KEY POINTS" }),
        })
        .first();
      await key.locator("summary").click();
      await expect(key.locator("article")).toBeVisible();
      await expect(page.locator("pre").first()).toBeVisible();
      const brokenAnchors = await page
        .locator('article a[href^="#"]')
        .evaluateAll((links) =>
          links
            .map((link) => link.getAttribute("href")!)
            .filter((href) => !document.getElementById(href.slice(1))),
        );
      expect(brokenAnchors).toEqual([]);
      await page.locator('article a[href="#section-2"]').first().click();
      await expect(page.locator("#section-2")).toBeInViewport();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      fs.mkdirSync("artifacts/teaching-v2", { recursive: true });
      await page.screenshot({
        path: `artifacts/teaching-v2/m${number}-${width}.png`,
      });
      const table = page.locator("article table").first();
      await table.screenshot({
        path: `artifacts/teaching-v2/table-m${number}-${width}.png`,
      });
      const block = page
        .locator(".command-block")
        .filter({
          has: page.locator("pre", {
            hasText:
              number === 2 ? "mkdir -p" : number === 3 ? "sleep 300" : "echo",
          }),
        })
        .first();
      await block.screenshot({
        path: `artifacts/teaching-v2/command-m${number}-${width}.png`,
      });
      expect(
        await block.evaluate((element) => {
          const button = element
            .querySelector("button")!
            .getBoundingClientRect();
          const code = element.querySelector("code")!.getBoundingClientRect();
          return button.bottom <= code.top;
        }),
      ).toBe(true);
      const termLink = page.locator('article a[href^="/glossary#"]').first();
      const target = await termLink.getAttribute("href");
      await termLink.click();
      await expect(
        page.getByRole("heading", { name: "Từ điển Week 1" }),
      ).toBeVisible();
      await expect(
        page.locator(target!.slice(target!.indexOf("#"))),
      ).toBeInViewport();
      const brokenRelated = await page
        .locator('a[href^="#"]')
        .evaluateAll((links) =>
          links
            .map((link) => link.getAttribute("href")!)
            .filter((href) => !document.getElementById(href.slice(1))),
        );
      expect(brokenRelated).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`/mission-0${number}`));
    });
  }
}
