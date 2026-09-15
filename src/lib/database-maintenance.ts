import type { PrismaClient } from "@/generated/prisma/client";

export const skillDefinitions = [
  ["linux", "Linux", 4, "Core SV1"],
  ["networking", "Networking", 4, "Core SV1"],
  ["git", "Git", 4, "Core SV1"],
  ["open-source", "Open Source", 4, "Core SV1"],
  ["docker", "Docker", 4, "Core SV1"],
  ["compose", "Compose", 4, "Core SV1"],
  ["docker-network", "Docker Network", 4, "Core SV1"],
  ["volumes", "Volumes", 4, "Core SV1"],
  ["environment", "Environment", 4, "Core SV1"],
  ["secrets", "Secrets", 4, "Core SV1"],
  ["healthcheck", "Healthcheck", 4, "Core SV1"],
  ["logs", "Logs", 4, "Core SV1"],
  ["keycloak", "Keycloak", 4, "Core SV1"],
  ["authentication", "Authentication", 4, "Core SV1"],
  ["authorization", "Authorization", 4, "Core SV1"],
  ["oauth2", "OAuth2", 3, "Core SV1"],
  ["oidc", "OIDC", 4, "Core SV1"],
  ["jwt", "JWT", 4, "Core SV1"],
  ["sso", "SSO", 4, "Core SV1"],
  ["rbac", "RBAC", 4, "Core SV1"],
  ["reverse-proxy", "Reverse Proxy", 3, "Core SV1"],
  ["build", "Build", 4, "Core SV1"],
  ["deployment", "Deployment", 4, "Core SV1"],
  ["system-integration", "System Integration", 4, "Core SV1"],
  ["troubleshooting", "Troubleshooting", 4, "Core SV1"],
  ["fresh-machine", "Fresh-machine", 4, "Core SV1"],
  ["release", "Release", 4, "Core SV1"],
  ["release-management", "Release Management", 4, "Core SV1"],
  ["team-lead", "Team Lead", 4, "Core SV1"],
  ["team-readiness", "Team Readiness", 4, "Core SV1"],
  ["documentation", "Documentation & Handoff", 4, "Core SV1"],
  ["oral-defense", "Oral Defense", 4, "Core SV1"],
  ["ci", "CI", 3, "Core SV1"],
  ["observability", "Observability", 4, "Core SV1"],
  ["security-review", "Security Review", 4, "Core SV1"],
  ["change-management", "Change Management", 4, "Core SV1"],
  ["http-rest", "HTTP/REST", 3, "Support SV2"],
  ["openapi", "OpenAPI", 3, "Support SV2"],
  ["postgresql", "PostgreSQL", 3, "Support SV2"],
  ["migration-seed", "Migration/Seed", 3, "Support SV2"],
  ["n8n", "n8n", 3, "Support SV2"],
  ["metabase", "Metabase", 2, "Support SV2"],
  ["qdrant", "Qdrant", 3, "Support SV3"],
  ["ollama", "Ollama", 3, "Support SV3"],
  ["rag-architecture", "RAG Architecture", 2, "Support SV3"],
  ["rag-infra", "RAG Infra", 3, "Support SV3"],
  ["agent-architecture", "Agent Architecture", 2, "Support SV3"],
  ["tool-calling", "Tool Calling", 3, "Support SV3"],
  ["agent-integration", "Agent Integration", 3, "Support SV3"],
  ["agent-security", "Agent Security", 4, "Support SV3"],
] as const;

export const skillTargets = skillDefinitions.map(
  ([id, , targetLevel]) => [id, targetLevel] as const,
);

// Accepted on import so backups from the hardened Week 1 MVP remain restorable.
// They are not re-seeded or shown as current roadmap skills.
export const legacySkillIds = [
  "identity",
  "integration",
  "backend-support",
  "ai-infra-support",
] as const;

/** Idempotent bootstrap: it never deletes or rewrites learner progress. */
export async function seedDatabase(prisma: PrismaClient) {
  await prisma.learnerProfile.upsert({
    where: { id: "local-learner" },
    update: {},
    create: { id: "local-learner" },
  });
  await prisma.appSettings.upsert({
    where: { id: "local-settings" },
    update: {},
    create: { id: "local-settings" },
  });
  for (const [id, targetLevel] of skillTargets) {
    await prisma.skillProgress.upsert({
      where: { id },
      update: { targetLevel },
      create: { id, targetLevel },
    });
  }
}

/** Destructive by design; callers must obtain explicit CLI confirmation. */
export async function resetLearnerState(prisma: PrismaClient) {
  await prisma.$transaction([
    prisma.recallReview.deleteMany(),
    prisma.oralReflection.deleteMany(),
    prisma.weeklyProgress.deleteMany(),
    prisma.bookmark.deleteMany(),
    prisma.missionNote.deleteMany(),
    prisma.incidentAssistance.deleteMany(),
    prisma.incidentAttempt.deleteMany(),
    prisma.quizAttempt.deleteMany(),
    prisma.evidence.deleteMany(),
    prisma.missionProgress.deleteMany(),
    prisma.skillProgress.updateMany({
      data: { currentLevel: 0, evidenceCount: 0 },
    }),
    prisma.appSettings.updateMany({
      data: {
        acceleratedMode: false,
        dailyStudyMinutes: 240,
        currentWeek: 1,
        currentMission: "w1-m1-linux-orientation",
      },
    }),
  ]);
}
