import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium, expect } from "@playwright/test";
import { learnerBackupSchema } from "../src/lib/backup";
import { getAllMissions } from "../src/lib/curriculum";

const baseUrl = process.env.DXLAB_LIVE_URL?.replace(/\/$/, "");
if (!baseUrl?.startsWith("https://")) {
  throw new Error("DXLAB_LIVE_URL must be an https:// deployment URL.");
}

async function fetchBackup() {
  const response = await fetch(`${baseUrl}/api/backup?probe=${Date.now()}`, {
    cache: "no-store",
  });
  if (!response.ok)
    throw new Error(`Backup export failed with HTTP ${response.status}.`);
  const raw = await response.text();
  return { raw, parsed: learnerBackupSchema.parse(JSON.parse(raw)) };
}

async function main() {
  const before = await fetchBackup();
  const occupiedNotes = new Set(
    before.parsed.notes.map((note) => note.missionId),
  );
  const occupiedBookmarks = new Set(
    before.parsed.bookmarks
      .filter((bookmark) => bookmark.targetType === "mission")
      .map((bookmark) => bookmark.targetId),
  );
  const mission = getAllMissions().find(
    (item) => !occupiedNotes.has(item.id) && !occupiedBookmarks.has(item.id),
  );
  if (!mission)
    throw new Error("No unused mission is available for the live probe.");

  const backupDirectory = path.resolve("artifacts", "live");
  mkdirSync(backupDirectory, { recursive: true });
  const backupPath = path.join(
    backupDirectory,
    `production-before-persistence-${Date.now()}.json`,
  );
  writeFileSync(backupPath, before.raw, { encoding: "utf8", flag: "wx" });

  const marker = `Vercel Turso persistence probe ${Date.now()}`;
  const missionUrl = `${baseUrl}/learn/week-${String(mission.week).padStart(2, "0")}/${mission.slug}`;
  const browser = await chromium.launch({ headless: true });

  try {
    const writeContext = await browser.newContext();
    const writePage = await writeContext.newPage();
    await writePage.goto(missionUrl);
    const writeNote = writePage
      .locator("section")
      .filter({
        has: writePage.getByRole("heading", { name: "Mission note" }),
      });
    await writeNote.locator('textarea[name="content"]').fill(marker);
    await writeNote.getByRole("button", { name: "Lưu note" }).click();
    await expect(writePage.getByText("Mission note đã lưu.")).toBeVisible();
    await writePage.getByRole("button", { name: "Bookmark mission" }).click();
    await expect(
      writePage.getByRole("button", { name: "Đã bookmark" }),
    ).toBeVisible();
    await writeContext.close();

    const readContext = await browser.newContext();
    const readPage = await readContext.newPage();
    await readPage.goto(`${missionUrl}?probe=${Date.now()}`);
    const readNote = readPage
      .locator("section")
      .filter({ has: readPage.getByRole("heading", { name: "Mission note" }) });
    await expect(readNote.locator('textarea[name="content"]')).toHaveValue(
      marker,
    );
    await expect(
      readPage.getByRole("button", { name: "Đã bookmark" }),
    ).toBeVisible();
    await readContext.close();

    const afterWrite = await fetchBackup();
    if (
      afterWrite.parsed.notes.find((note) => note.missionId === mission.id)
        ?.content !== marker
    ) {
      throw new Error("Live backup did not contain the persisted note probe.");
    }
    if (
      !afterWrite.parsed.bookmarks.some(
        (bookmark) =>
          bookmark.targetType === "mission" && bookmark.targetId === mission.id,
      )
    ) {
      throw new Error(
        "Live backup did not contain the persisted bookmark probe.",
      );
    }

    const restoreContext = await browser.newContext();
    const restorePage = await restoreContext.newPage();
    await restorePage.goto(`${baseUrl}/settings`);
    await restorePage.locator('textarea[name="backup"]').fill(before.raw);
    await restorePage
      .locator('input[name="confirmation"]')
      .fill("IMPORT LEARNER BACKUP");
    await restorePage
      .getByRole("button", { name: "Validate and import" })
      .click();
    await expect(
      restorePage.getByText("Backup đã được validate và import thành công."),
    ).toBeVisible();
    await restoreContext.close();

    const restored = await fetchBackup();
    const originalNote = before.parsed.notes.find(
      (note) => note.missionId === mission.id,
    );
    const restoredNote = restored.parsed.notes.find(
      (note) => note.missionId === mission.id,
    );
    if (restoredNote?.content !== originalNote?.content) {
      throw new Error(
        "Validated import did not restore the original note state.",
      );
    }
    const originalBookmark = before.parsed.bookmarks.some(
      (bookmark) =>
        bookmark.targetType === "mission" && bookmark.targetId === mission.id,
    );
    const restoredBookmark = restored.parsed.bookmarks.some(
      (bookmark) =>
        bookmark.targetType === "mission" && bookmark.targetId === mission.id,
    );
    if (restoredBookmark !== originalBookmark) {
      throw new Error(
        "Validated import did not restore the original bookmark state.",
      );
    }

    console.log(
      JSON.stringify({
        status: "ok",
        https: true,
        separateBrowserContextRead: true,
        notePersistence: true,
        bookmarkPersistence: true,
        backupExport: true,
        validatedImportRestore: true,
        backupPath,
      }),
    );
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Live verification failed.",
  );
  process.exitCode = 1;
});
