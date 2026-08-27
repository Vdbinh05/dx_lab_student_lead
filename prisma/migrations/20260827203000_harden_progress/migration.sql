ALTER TABLE "MissionProgress" ADD COLUMN "hardGatePassed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "IncidentAttempt" ADD COLUMN "assistanceLevel" TEXT NOT NULL DEFAULT 'NONE';

CREATE TABLE "IncidentAssistance" (
    "incidentId" TEXT NOT NULL PRIMARY KEY,
    "level" TEXT NOT NULL DEFAULT 'NONE',
    "updatedAt" DATETIME NOT NULL
);

CREATE INDEX "Evidence_missionId_createdAt_idx" ON "Evidence"("missionId", "createdAt");
CREATE INDEX "Evidence_skillId_createdAt_idx" ON "Evidence"("skillId", "createdAt");
CREATE INDEX "QuizAttempt_missionId_createdAt_idx" ON "QuizAttempt"("missionId", "createdAt");
CREATE INDEX "IncidentAttempt_incidentId_createdAt_idx" ON "IncidentAttempt"("incidentId", "createdAt");
