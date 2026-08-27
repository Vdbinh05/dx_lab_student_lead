-- CreateTable
CREATE TABLE "LearnerProfile" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'local-learner',
    "name" TEXT NOT NULL DEFAULT 'SV1 Learner',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "MissionProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "missionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "completedSteps" TEXT NOT NULL DEFAULT '[]',
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "score" INTEGER,
    "notes" TEXT,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "missionId" TEXT NOT NULL,
    "skillId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "answers" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "IncidentAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "incidentId" TEXT NOT NULL,
    "symptom" TEXT NOT NULL,
    "evidence" TEXT NOT NULL,
    "hypothesis" TEXT NOT NULL,
    "test" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "rootCause" TEXT NOT NULL,
    "fix" TEXT NOT NULL,
    "verification" TEXT NOT NULL,
    "regression" TEXT NOT NULL,
    "assisted" BOOLEAN NOT NULL DEFAULT false,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SkillProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "currentLevel" INTEGER NOT NULL DEFAULT 0,
    "targetLevel" INTEGER NOT NULL,
    "evidenceCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'local-settings',
    "acceleratedMode" BOOLEAN NOT NULL DEFAULT false,
    "dailyStudyMinutes" INTEGER NOT NULL DEFAULT 240,
    "currentWeek" INTEGER NOT NULL DEFAULT 1,
    "currentMission" TEXT NOT NULL DEFAULT 'w1-m1-linux-orientation'
);

CREATE UNIQUE INDEX "MissionProgress_missionId_key" ON "MissionProgress"("missionId");
