CREATE TABLE "RecallReview" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "lastReviewedAt" DATETIME NOT NULL,
  "nextReviewAt" DATETIME NOT NULL,
  "reviewCount" INTEGER NOT NULL,
  "streak" INTEGER NOT NULL,
  "rating" TEXT NOT NULL
);
