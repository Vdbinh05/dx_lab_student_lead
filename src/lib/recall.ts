import { z } from "zod";
import type { Mission } from "./types";

export const recallRating = z.enum(["wrong", "hard", "correct"]);
export const recallReviewSchema = z
  .object({
    id: z.string().min(1).max(200),
    lastReviewedAt: z.string().datetime(),
    nextReviewAt: z.string().datetime(),
    reviewCount: z.number().int().min(1).max(100000),
    streak: z.number().int().min(0).max(100000),
    rating: recallRating,
  })
  .strict()
  .refine(
    (row) =>
      row.streak <= row.reviewCount &&
      Date.parse(row.nextReviewAt) > Date.parse(row.lastReviewedAt),
  );

export function recallItems(missions: Mission[]) {
  return missions.flatMap((mission) =>
    mission.quiz.map((question) => ({
      ...question,
      id: `${mission.id}:${question.id}`,
      missionId: mission.id,
      href: `/learn/week-${String(mission.week).padStart(2, "0")}/${mission.slug}`,
      missionTitle: mission.title,
    })),
  );
}

export function scheduleReview(
  previous: { reviewCount: number; streak: number } | null,
  rating: z.infer<typeof recallRating>,
  now: Date,
) {
  const streak = rating === "correct" ? (previous?.streak ?? 0) + 1 : 0;
  const days =
    rating === "wrong"
      ? 1
      : rating === "hard"
        ? 3
        : streak === 1
          ? 7
          : streak === 2
            ? 14
            : 30;
  return {
    lastReviewedAt: now,
    nextReviewAt: new Date(now.getTime() + days * 86400000),
    reviewCount: (previous?.reviewCount ?? 0) + 1,
    streak,
    rating,
  };
}

export function dueRecall<T extends { id: string }>(
  items: T[],
  reviews: { id: string; nextReviewAt: Date }[],
  now: Date,
) {
  const dates = new Map(
    reviews.map((row) => [row.id, row.nextReviewAt.getTime()]),
  );
  return items
    .filter((item) => (dates.get(item.id) ?? 0) <= now.getTime())
    .sort(
      (a, b) =>
        (dates.get(a.id) ?? 0) - (dates.get(b.id) ?? 0) ||
        a.id.localeCompare(b.id),
    );
}
