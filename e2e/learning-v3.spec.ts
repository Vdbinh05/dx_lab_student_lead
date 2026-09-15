import { expect, test } from "@playwright/test";
import Database from "better-sqlite3";
import { getAllMissions } from "../src/lib/curriculum";
import { verificationMissions } from "../src/lib/verification";

test("recall persists without changing competence; verifier validates before saving", async ({
  page,
}) => {
  const sql = new Database(process.env.DATABASE_URL!.replace(/^file:/, ""));
  const mission = getAllMissions()[0];
  try {
    await page.goto("/today");
    await expect(
      page.getByText("Chưa có nội dung đã học để ôn.", { exact: false }),
    ).toBeVisible();
    sql
      .prepare(
        "INSERT INTO MissionProgress (id, missionId, status, completedSteps, updatedAt) VALUES (?, ?, 'IN_PROGRESS', '[\"learn\"]', ?)",
      )
      .run("v3-qa", mission.id, new Date().toISOString());
    await page.reload();
    const warmup = page.locator('section[aria-labelledby="warmup-title"]');
    await warmup.locator("summary").first().click();
    await warmup
      .locator('select[name="rating"]')
      .first()
      .selectOption("correct");
    await warmup.getByRole("button", { name: "Lưu lịch ôn" }).first().click();
    await expect
      .poll(() =>
        sql.prepare("SELECT COUNT(*) as count FROM RecallReview").get(),
      )
      .toEqual({ count: 1 });
    await page.reload();
    expect(
      sql.prepare("SELECT status FROM MissionProgress WHERE id='v3-qa'").get(),
    ).toEqual({ status: "IN_PROGRESS" });
    const backup = await (await page.request.get("/api/backup")).json();
    expect(backup.recallReviews).toHaveLength(1);
    await page.goto("/learn/week-01/mission-01");
    const form = page.locator("#verification-pilot");
    await form.locator("textarea").fill('{"command":"unexpected"}');
    await form.getByRole("button").click();
    await expect(form.getByRole("alert")).toBeVisible();
    const report = {
      schemaVersion: 1,
      missionId: "week-01-mission-01",
      generatedAt: new Date().toISOString(),
      checks: verificationMissions["week-01-mission-01"].checks.map((id) => ({
        id,
        status: "pass",
        evidence: "observed",
      })),
      overall: "pass",
    };
    await form.locator("textarea").fill(JSON.stringify(report));
    await form.getByRole("button").click();
    await expect(form.getByRole("status")).toContainText("Đã lưu report");
    expect(
      sql.prepare("SELECT status FROM MissionProgress WHERE id='v3-qa'").get(),
    ).toEqual({ status: "IN_PROGRESS" });
    expect(
      sql.prepare("SELECT COUNT(*) AS count FROM QuizAttempt").get(),
    ).toEqual({ count: 0 });
    await page.goto("/evidence");
    await expect(
      page.getByRole("heading", { name: /DX-Verify v1/ }),
    ).toBeVisible();
  } finally {
    sql.prepare("DELETE FROM RecallReview").run();
    sql.prepare("DELETE FROM Evidence WHERE title LIKE 'DX-Verify v1%'").run();
    sql.prepare("DELETE FROM MissionProgress WHERE id='v3-qa'").run();
    sql.close();
  }
});

for (const width of [1440, 950, 390]) {
  test(`navigation and route review at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/today",
      "/labs",
      "/incidents",
      "/incidents/net-01",
      "/skills",
      "/evidence",
      "/roadmap",
      "/weeks/1",
      "/exams",
      "/oral-defense",
      "/readiness",
      "/glossary",
      "/search",
      "/settings",
    ]) {
      await page.goto(route);
      await expect(page.locator("main h1")).toBeVisible();
      const nav = page.getByRole("navigation", {
        name: width >= 1024 ? "Learning navigation" : "Mobile navigation",
        exact: true,
      });
      await expect(
        nav.getByRole("link", { name: "Today", exact: true }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (route === "/incidents/net-01")
        await expect(page.locator("fieldset")).toHaveCount(4);
      if (route === "/today" || route === "/incidents/net-01")
        await page.screenshot({
          path: `artifacts/learning-v3/${route.replaceAll("/", "-")}-${width}.png`,
          fullPage: route !== "/today",
        });
    }
    const nav = page.getByRole("navigation", {
      name: width >= 1024 ? "Learning navigation" : "Mobile navigation",
      exact: true,
    });
    if (width < 1024)
      await nav.locator("summary").filter({ hasText: "More" }).click();
    await expect(
      nav.getByRole("link", { name: "Settings", exact: true }),
    ).toHaveAttribute("aria-current", "page");
  });
}
