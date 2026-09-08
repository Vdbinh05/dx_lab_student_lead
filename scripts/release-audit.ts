import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  getAllMissions,
  getIncidents,
  getOralDefenseQuestions,
  getWeeklyQuiz,
  validateCurriculum,
  weeks,
} from "../src/lib/curriculum";
import { skillDefinitions } from "../src/lib/database-maintenance";

const root = process.cwd();
const errors: string[] = [];
const requireAudit = (condition: boolean, message: string) => {
  if (!condition) errors.push(message);
};
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

const missions = getAllMissions();
const incidents = getIncidents();
const oralQuestions = getOralDefenseQuestions();
const validation = validateCurriculum({ requireComplete: true });
const missionDistribution = weeks.map(
  (week) => missions.filter((mission) => mission.week === week.number).length,
);
const missionQuestionCount = missions.reduce(
  (count, mission) => count + mission.quiz.length,
  0,
);
const weeklyQuestionCount = weeks.reduce(
  (count, week) => count + getWeeklyQuiz(week.number).length,
  0,
);

requireAudit(validation.valid, validation.errors.join("; "));
requireAudit(weeks.length === 8, "Expected eight week records");
requireAudit(
  JSON.stringify(missionDistribution) === JSON.stringify([7, 9, 7, 7, 7, 6, 7, 7]),
  `Unexpected mission distribution: ${missionDistribution.join(",")}`,
);
requireAudit(missions.length === 57, `Expected 57 missions, found ${missions.length}`);
requireAudit(
  missionQuestionCount === 300,
  `Expected 300 mission questions, found ${missionQuestionCount}`,
);
requireAudit(
  weeklyQuestionCount === 160,
  `Expected 160 weekly questions, found ${weeklyQuestionCount}`,
);
requireAudit(
  incidents.length === 8 && incidents.every((incident) => incident.bossFight),
  "Expected eight Boss Fight incidents",
);
requireAudit(skillDefinitions.length === 50, "Expected 50 active roadmap skills");

const activeSkillTargets = new Map<string, number>(
  skillDefinitions.map(([id, , target]) => [id, target]),
);
for (const mission of missions) {
  requireAudit(mission.hardGate, `${mission.id}: hard gate is not required`);
  requireAudit(mission.quiz.length >= 5, `${mission.id}: fewer than five questions`);
  requireAudit(
    mission.requiredEvidence.length > 0,
    `${mission.id}: missing evidence requirements`,
  );
  requireAudit(
    activeSkillTargets.has(mission.skillId),
    `${mission.id}: unknown skill ${mission.skillId}`,
  );
  const target = activeSkillTargets.get(mission.skillId) ?? -1;
  requireAudit(
    Number(mission.targetLevel.slice(1)) <= target,
    `${mission.id}: target exceeds skill target`,
  );
  for (const token of [
    "COMMAND",
    "WHY",
    "EXPECTED OUTPUT",
    "COMMON FAILURE",
  ])
    requireAudit(mission.content.includes(token), `${mission.id}: missing ${token}`);
  requireAudit(
    mission.content.includes("WHERE TO RUN") || mission.content.includes("RUN FROM"),
    `${mission.id}: missing command location`,
  );
  if (mission.week >= 2)
    requireAudit(
      mission.content.includes("Integration Lab"),
      `${mission.id}: missing integration lab`,
    );
}

const requiredOralGroups = [
  "Architecture",
  "Docker",
  "Identity",
  "Troubleshooting",
  "H-P-D-I",
  "Integration",
  "AI Infra",
  "Security",
  "Release",
  "Change Request",
].sort();
requireAudit(
  JSON.stringify([...new Set(oralQuestions.map((question) => question.group))].sort()) ===
    JSON.stringify(requiredOralGroups),
  "Oral-defense groups do not match the required ten groups",
);

const requiredPages = [
  "src/app/page.tsx",
  "src/app/today/page.tsx",
  "src/app/roadmap/page.tsx",
  "src/app/weeks/[week]/page.tsx",
  "src/app/weeks/[week]/review/page.tsx",
  "src/app/learn/[week]/[mission]/page.tsx",
  "src/app/labs/page.tsx",
  "src/app/incidents/page.tsx",
  "src/app/incidents/[id]/page.tsx",
  "src/app/evidence/page.tsx",
  "src/app/skills/page.tsx",
  "src/app/exams/page.tsx",
  "src/app/oral-defense/page.tsx",
  "src/app/readiness/page.tsx",
  "src/app/search/page.tsx",
  "src/app/glossary/page.tsx",
  "src/app/bookmarks/page.tsx",
  "src/app/settings/page.tsx",
  "src/app/api/health/route.ts",
  "src/app/api/backup/route.ts",
];
for (const file of requiredPages)
  requireAudit(existsSync(path.join(root, file)), `Missing required route: ${file}`);

for (const file of [
  "Dockerfile",
  "docker-compose.yml",
  ".dockerignore",
  ".env.example",
  ".nvmrc",
  "docs/deployment.md",
  "docs/curriculum-audit.md",
  "README.md",
  "playwright.config.ts",
  "e2e/training.spec.ts",
  "scripts/docker-smoke.ts",
])
  requireAudit(existsSync(path.join(root, file)), `Missing release artifact: ${file}`);

const dockerfile = read("Dockerfile");
const compose = read("docker-compose.yml");
const deployment = read("docs/deployment.md");
const packageJson = JSON.parse(read("package.json")) as {
  version: string;
  engines?: { node?: string };
  scripts?: Record<string, string>;
};
requireAudit(
  dockerfile.includes("FROM node:24.15.0-bookworm-slim"),
  "Docker base image is not pinned to Node 24.15.0",
);
requireAudit(dockerfile.includes("USER node"), "Docker runtime is not non-root");
requireAudit(
  dockerfile.includes("DATABASE_URL=file:/data/training.db"),
  "Docker runtime database is not /data/training.db",
);
requireAudit(
  compose.includes("training_data:/data") && compose.includes("/api/health"),
  "Compose is missing persistent volume or healthcheck",
);
requireAudit(
  read(".nvmrc").trim() === "24.15.0" &&
    packageJson.engines?.node === "24.x",
  "Node versions are not aligned",
);
for (const heading of [
  "## Local development",
  "## Production Node build",
  "## Docker deployment",
  "## Direct SQLite backup",
  "## Restore",
  "## Upgrade",
  "## Rollback basics",
])
  requireAudit(deployment.includes(heading), `Deployment docs missing ${heading}`);

const workspace = read("src/components/mission-workspace.tsx");
for (const field of [
  "Service",
  "Owner",
  "Image/version",
  "Internal port",
  "Host port",
  "Hostname",
  "Network",
  "Volume",
  "Health",
  "Env",
  "Auth",
  "Dependencies",
  "Public/Internal URL",
])
  requireAudit(workspace.includes(field), `Service inventory missing ${field}`);

requireAudit(
  !existsSync(path.join(root, "src", "app", "chat")),
  "AI chat route is outside product scope",
);
requireAudit(
  packageJson.version.length > 0 && packageJson.scripts?.["test:e2e"] === "playwright test",
  "Application version or E2E script is missing",
);
requireAudit(
  packageJson.scripts?.["test:docker-smoke"] === "tsx scripts/docker-smoke.ts",
  "Guarded Docker smoke script is missing",
);

if (errors.length) {
  console.error("Release audit FAILED");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    JSON.stringify(
      {
        weeks: weeks.length,
        missions: missions.length,
        missionQuestions: missionQuestionCount,
        weeklyQuestions: weeklyQuestionCount,
        incidents: incidents.length,
        bossFights: incidents.filter((incident) => incident.bossFight).length,
        skills: skillDefinitions.length,
        oralQuestions: oralQuestions.length,
        routes: requiredPages.length,
      },
      null,
      2,
    ),
  );
  console.log("Release audit PASS (code/content/static deployment artifacts)");
  console.log("Docker runtime persistence remains a separate smoke-test gate.");
}
