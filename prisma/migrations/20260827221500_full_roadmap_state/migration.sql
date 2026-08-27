-- Additive learner-state migration for the full roadmap product.
-- Existing Week 1 progress/evidence/attempt rows are preserved.

CREATE TABLE "MissionNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "missionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "MissionNote_missionId_key" ON "MissionNote"("missionId");

CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "Bookmark_targetType_targetId_key" ON "Bookmark"("targetType", "targetId");
CREATE INDEX "Bookmark_targetType_createdAt_idx" ON "Bookmark"("targetType", "createdAt");

CREATE TABLE "WeeklyProgress" (
    "week" INTEGER NOT NULL PRIMARY KEY,
    "hardGatePassed" BOOLEAN NOT NULL DEFAULT false,
    "passedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "OralReflection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "confident" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "OralReflection_questionId_createdAt_idx" ON "OralReflection"("questionId", "createdAt");
CREATE INDEX "OralReflection_group_createdAt_idx" ON "OralReflection"("group", "createdAt");
