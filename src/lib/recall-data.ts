import { db } from "./db";
import { getAllMissions } from "./curriculum";
import { parseCompletedSteps } from "./progress-engine";
import { recallItems, dueRecall } from "./recall";

export async function getRecallData() {
  const [progress, reviews] = await Promise.all([
    db.missionProgress.findMany(),
    db.recallReview.findMany(),
  ]);
  const learned = new Set(
    progress
      .filter(
        (row) =>
          row.status === "PASSED" ||
          parseCompletedSteps(row.completedSteps).includes("learn"),
      )
      .map((row) => row.missionId),
  );
  const items = recallItems(
    getAllMissions().filter((mission) => learned.has(mission.id)),
  );
  const now = new Date();
  const due = dueRecall(items, reviews, now);
  const ids = new Set(items.map((item) => item.id));
  const next = reviews
    .filter((row) => ids.has(row.id) && row.nextReviewAt > now)
    .sort((a, b) => a.nextReviewAt.getTime() - b.nextReviewAt.getTime())[0];
  return { items, reviews, due, next };
}
