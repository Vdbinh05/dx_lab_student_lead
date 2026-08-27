export const missionStatuses = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "BLOCKED",
  "READY_FOR_GATE",
  "PASSED",
] as const;
export type MissionStatus = (typeof missionStatuses)[number];

export const missionSteps = [
  "learn",
  "practice",
  "build",
  "break",
  "debug",
  "evidence",
  "quiz",
] as const;
export type MissionStep = (typeof missionSteps)[number];

export type SourceType =
  "THEO_KE_HOACH_CO" | "KIEN_THUC_MO_RONG" | "PROJECT_DEFINED_TBD";

export const evidenceTypes = [
  "command",
  "terminal-output",
  "log",
  "explanation",
  "incident-report",
  "github-url",
  "config",
  "test-result",
  "reflection",
] as const;
export type EvidenceType = (typeof evidenceTypes)[number];

export const bookmarkTargetTypes = ["mission", "lab", "incident"] as const;
export type BookmarkTargetType = (typeof bookmarkTargetTypes)[number];

export type QuizQuestion = {
  id: string;
  type: "multiple-choice" | "short-answer" | "self-explanation";
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
};

export type Mission = {
  id: string;
  week: number;
  order: number;
  slug: string;
  title: string;
  category: string;
  skillId: string;
  estimatedMinutes: number;
  targetLevel: string;
  sourceType: SourceType;
  roadmapCompetency: string;
  keywords: string[];
  objectives: string[];
  prerequisites: string[];
  requiredEvidence: string[];
  quizPassScore: number;
  hardGate: boolean;
  whyItMatters: string;
  content: string;
  quiz: QuizQuestion[];
};

export type Week = {
  number: number;
  slug: string;
  title: string;
  subtitle: string;
  competencies: string[];
  hardGates: string[];
  deliverables: string[];
  missionCount: number;
  incidentCount: number;
  available: boolean;
  goal: string;
  knowledge: string[];
  practice: string[];
  build: string[];
  failureDrill: string[];
  evidence: string[];
  definitionOfDone: string[];
  bossFightId: string;
  weeklyQuizPassScore: number;
};

export type IncidentDefinition = {
  id: string;
  week: number;
  title: string;
  bossFight: boolean;
  scenario: string;
  knownFacts: string[];
  hints: [string, string, string];
  solution: string;
  diagnosisKeywords: string[][];
  evidenceKeywords: string[];
  testKeywords: string[];
};

export type WeekGateResult = {
  passed: boolean;
  eligible: boolean;
  blockers: string[];
  missionPassed: number;
  missionTotal: number;
  quizScore: number | null;
  bossFightPassed: boolean;
  evidenceCount: number;
};

export type OralDefenseQuestion = {
  id: string;
  group: string;
  prompt: string;
  keyPoints: string[];
  sourceType: SourceType;
};

export type GateInput = {
  completedSteps: string[];
  requiredEvidence: string[];
  evidenceTypes: string[];
  quizScore: number | null;
  quizPassScore: number;
  hardGateRequired: boolean;
  hardGateSatisfied: boolean;
};

export type GateResult = {
  passed: boolean;
  status: MissionStatus;
  blockers: string[];
  eligibleForHardGate: boolean;
};
