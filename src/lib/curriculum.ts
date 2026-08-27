import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  evidenceTypes,
  type IncidentDefinition,
  type Mission,
  type OralDefenseQuestion,
  type QuizQuestion,
  type Week,
} from "@/lib/types";
import { skillTargets } from "@/lib/database-maintenance";

const sourceTypeSchema = z.enum([
  "THEO_KE_HOACH_CO",
  "KIEN_THUC_MO_RONG",
  "PROJECT_DEFINED_TBD",
]);

const frontmatterSchema = z.object({
  id: z.string().min(1),
  week: z.coerce.number().int().min(1).max(8),
  order: z.coerce.number().int().positive(),
  title: z.string().min(1),
  category: z.string().min(1),
  skillId: z.string().min(1),
  estimatedMinutes: z.coerce.number().int().positive(),
  targetLevel: z.string().regex(/^L[0-4]$/),
  sourceType: sourceTypeSchema,
  roadmapCompetency: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(3),
  objectives: z.array(z.string()).min(1),
  prerequisites: z.array(z.string()).default([]),
  requiredEvidence: z.array(z.enum(evidenceTypes)).min(1),
  quizPassScore: z.coerce.number().min(0).max(100),
  hardGate: z.boolean(),
  whyItMatters: z.string().min(1),
}).strict();

const quizQuestionSchema = z
  .object({
    id: z.string().min(1),
    type: z.enum(["multiple-choice", "short-answer", "self-explanation"]),
    prompt: z.string().min(8),
    options: z.array(z.string().min(1)).min(2).optional(),
    answer: z.string().min(1),
    explanation: z.string().min(8),
  })
  .strict()
  .superRefine((question, context) => {
    if (question.type === "multiple-choice" && !question.options)
      context.addIssue({
        code: "custom",
        path: ["options"],
        message: "Multiple-choice question cần options",
      });
    if (
      question.type === "multiple-choice" &&
      question.options &&
      !question.options.includes(question.answer)
    )
      context.addIssue({
        code: "custom",
        path: ["answer"],
        message: "Multiple-choice answer phải nằm trong options",
      });
  });

const weekSchema = z.object({
  number: z.number().int().min(1).max(8),
  slug: z.string().regex(/^week-0[1-8]$/),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  goal: z.string().min(1),
  knowledge: z.array(z.string()).min(1),
  practice: z.array(z.string()).min(1),
  build: z.array(z.string()).min(1),
  failureDrill: z.array(z.string()).min(1),
  evidence: z.array(z.string()).min(1),
  definitionOfDone: z.array(z.string()).min(1),
  competencies: z.array(z.string()).min(1),
  hardGates: z.array(z.string()).min(1),
  deliverables: z.array(z.string()).min(1),
  bossFightId: z.string().min(1),
  weeklyQuizPassScore: z.number().min(0).max(100),
}).strict();

const incidentSchema = z.object({
  id: z.string().min(1),
  week: z.number().int().min(1).max(8),
  title: z.string().min(1),
  bossFight: z.boolean(),
  scenario: z.string().min(20),
  knownFacts: z.array(z.string()).min(2),
  hints: z.tuple([z.string(), z.string(), z.string()]),
  solution: z.string().min(20),
  diagnosisKeywords: z.array(z.array(z.string().min(1)).min(1)).min(2),
  evidenceKeywords: z.array(z.string().min(1)).min(1),
  testKeywords: z.array(z.string().min(1)).min(1),
}).strict();

const oralQuestionSchema = z.object({
  id: z.string().min(1),
  group: z.string().min(1),
  prompt: z.string().min(10),
  keyPoints: z.array(z.string().min(1)).min(2),
  sourceType: sourceTypeSchema,
}).strict();

const contentRoot = path.join(process.cwd(), "content");

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, "utf8")) as unknown;
}

function loadMissionQuiz(week: number): Record<string, QuizQuestion[]> {
  const file = path.join(
    contentRoot,
    "quizzes",
    `week-${String(week).padStart(2, "0")}.json`,
  );
  if (!fs.existsSync(file)) return {};
  return z.record(z.string(), z.array(quizQuestionSchema)).parse(readJson(file));
}

export function getAllMissions(): Mission[] {
  const weeksRoot = path.join(contentRoot, "weeks");
  const missions: Mission[] = [];
  const quizByWeek = new Map<number, Record<string, QuizQuestion[]>>();
  for (const folderName of fs
    .readdirSync(weeksRoot)
    .filter((name) => /^week-0[1-8]$/.test(name))
    .sort()) {
    const week = Number(folderName.slice(-2));
    const quiz = loadMissionQuiz(week);
    quizByWeek.set(week, quiz);
    const folder = path.join(weeksRoot, folderName);
    for (const file of fs
      .readdirSync(folder)
      .filter((name) => name.endsWith(".md"))
      .sort()) {
      const parsed = matter(fs.readFileSync(path.join(folder, file), "utf8"));
      const data = frontmatterSchema.parse(parsed.data);
      if (data.week !== week)
        throw new Error(`${file}: week frontmatter không khớp folder`);
      missions.push({
        ...data,
        slug: path.basename(file, ".md"),
        content: parsed.content,
        quiz: quiz[data.id] ?? [],
      });
    }
  }
  const ids = new Set<string>();
  const positions = new Set<string>();
  const skillTargetById = new Map<string, number>(skillTargets);
  for (const mission of missions) {
    if (ids.has(mission.id)) throw new Error(`Duplicate mission id: ${mission.id}`);
    ids.add(mission.id);
    const position = `${mission.week}:${mission.order}`;
    if (positions.has(position)) throw new Error(`Duplicate mission order: ${position}`);
    positions.add(position);
    if (mission.quiz.length < 5)
      throw new Error(`${mission.id}: mission quiz phải có ít nhất 5 câu`);
    if (!mission.hardGate)
      throw new Error(`${mission.id}: mission phải có hard gate`);
    const skillTarget = skillTargetById.get(mission.skillId);
    if (skillTarget === undefined)
      throw new Error(`${mission.id}: skill không tồn tại ${mission.skillId}`);
    if (Number(mission.targetLevel.slice(1)) > skillTarget)
      throw new Error(
        `${mission.id}: target ${mission.targetLevel} vượt skill target L${skillTarget}`,
      );
    const questionIds = mission.quiz.map((question) => question.id);
    if (new Set(questionIds).size !== questionIds.length)
      throw new Error(`${mission.id}: duplicate quiz question id`);
  }
  const byId = new Map(missions.map((mission) => [mission.id, mission]));
  for (const mission of missions)
    for (const prerequisite of mission.prerequisites) {
      const required = byId.get(prerequisite);
      if (!required) throw new Error(`${mission.id}: broken prerequisite ${prerequisite}`);
      if (
        required.week > mission.week ||
        (required.week === mission.week && required.order >= mission.order)
      )
        throw new Error(`${mission.id}: impossible prerequisite ${prerequisite}`);
    }
  for (const [week, quiz] of quizByWeek) {
    const missionIds = new Set(
      missions.filter((mission) => mission.week === week).map((mission) => mission.id),
    );
    for (const quizMissionId of Object.keys(quiz))
      if (!missionIds.has(quizMissionId))
        throw new Error(`Week ${week}: orphan quiz mapping ${quizMissionId}`);
  }
  return missions.sort((a, b) => a.week - b.week || a.order - b.order);
}

export function getIncidents(): IncidentDefinition[] {
  const file = path.join(contentRoot, "incidents.json");
  if (!fs.existsSync(file)) return [];
  const incidents = z.array(incidentSchema).parse(readJson(file));
  if (new Set(incidents.map((item) => item.id)).size !== incidents.length)
    throw new Error("Duplicate incident id");
  return incidents.sort((a, b) => a.week - b.week);
}

export function getIncidentById(id: string) {
  return getIncidents().find((incident) => incident.id === id);
}

export function getWeeklyQuiz(week: number): QuizQuestion[] {
  const file = path.join(
    contentRoot,
    "weekly-quizzes",
    `week-${String(week).padStart(2, "0")}.json`,
  );
  if (!fs.existsSync(file)) return [];
  const questions = z.array(quizQuestionSchema).min(20).parse(readJson(file));
  if (new Set(questions.map((question) => question.id)).size !== questions.length)
    throw new Error(`Week ${week}: duplicate weekly quiz question id`);
  return questions;
}

export function getOralDefenseQuestions(): OralDefenseQuestion[] {
  const file = path.join(contentRoot, "oral-defense.json");
  if (!fs.existsSync(file)) return [];
  const questions = z.array(oralQuestionSchema).parse(readJson(file));
  if (new Set(questions.map((question) => question.id)).size !== questions.length)
    throw new Error("Duplicate oral-defense question id");
  return questions;
}

function loadWeeks(): Week[] {
  const metadata = z.array(weekSchema).length(8).parse(
    readJson(path.join(contentRoot, "weeks.json")),
  );
  if (metadata.some((week, index) => week.number !== index + 1))
    throw new Error("Week metadata phải có đúng thứ tự 1–8");
  for (const week of metadata)
    if (week.slug !== `week-${String(week.number).padStart(2, "0")}`)
      throw new Error(`Week ${week.number}: slug không khớp number`);
  const missions = getAllMissions();
  const incidents = getIncidents();
  for (const week of metadata) {
    const bossFight = incidents.find((incident) => incident.id === week.bossFightId);
    if (!bossFight || bossFight.week !== week.number || !bossFight.bossFight)
      throw new Error(`Week ${week.number}: bossFightId không hợp lệ`);
  }
  return metadata.map((week) => ({
    ...week,
    missionCount: missions.filter((mission) => mission.week === week.number).length,
    incidentCount: incidents.filter((incident) => incident.week === week.number).length,
    available: missions.some((mission) => mission.week === week.number),
  }));
}

export const weeks: Week[] = loadWeeks();

export function getWeek(number: number) {
  return weeks.find((week) => week.number === number);
}

export function getMission(week: string, mission: string) {
  return getAllMissions().find(
    (item) =>
      `week-${String(item.week).padStart(2, "0")}` === week && item.slug === mission,
  );
}

export function getMissionById(id: string) {
  return getAllMissions().find((mission) => mission.id === id);
}

export type CurriculumValidation = { valid: boolean; errors: string[] };

export function validateCurriculum(
  options: { requireComplete?: boolean } = {},
): CurriculumValidation {
  const errors: string[] = [];
  let missions: Mission[] = [];
  try {
    missions = getAllMissions();
  } catch (error) {
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : "Curriculum parse failed"],
    };
  }
  const sectionPatterns = [
    /Ví dụ đời thường/i,
    /Giải thích cực dễ/i,
    /Technical Definition/i,
    /DX-Lab/i,
    /SV1.*Level/i,
    /Thành phần|Required subtopics/i,
    /Commands?\s*\/\s*Config/i,
    /RUN FROM|WHERE TO RUN/i,
    /EXPECTED/i,
    /Guided Lab/i,
    /Independent Lab/i,
    /Failure Injection/i,
    /Troubleshooting/i,
    /COMMON FAILURE|Common Beginner Errors/i,
    /Self-check Questions/i,
    /Evidence Required/i,
    /Quiz/i,
    /PASS Gate/i,
  ];
  const protocol = [
    "SYMPTOM",
    "EVIDENCE",
    "HYPOTHESIS",
    "TEST",
    "RESULT",
    "ROOT CAUSE",
    "FIX",
    "VERIFICATION",
    "REGRESSION",
  ];
  for (const mission of missions) {
    for (const pattern of sectionPatterns)
      if (!pattern.test(mission.content))
        errors.push(`${mission.id}: missing section ${pattern.source}`);
    for (const token of protocol)
      if (!mission.content.includes(token))
        errors.push(`${mission.id}: missing troubleshooting token ${token}`);
  }
  if (options.requireComplete) {
    const incidents = getIncidents();
    for (let week = 1; week <= 8; week += 1) {
      if (!missions.some((mission) => mission.week === week))
        errors.push(`Week ${week}: no missions`);
      try {
        if (getWeeklyQuiz(week).length < 20)
          errors.push(`Week ${week}: weekly quiz below 20 questions`);
      } catch (error) {
        errors.push(
          `Week ${week}: ${error instanceof Error ? error.message : "invalid weekly quiz"}`,
        );
      }
      if (!incidents.some((incident) => incident.week === week && incident.bossFight))
        errors.push(`Week ${week}: missing Boss Fight`);
    }
  }
  return { valid: errors.length === 0, errors };
}

export function searchCurriculum(query: string) {
  const normalized = query.trim().toLocaleLowerCase("vi");
  if (normalized.length < 2) return [];
  return getAllMissions()
    .map((mission) => {
      const title = mission.title.toLocaleLowerCase("vi");
      const keywords = mission.keywords.join(" ").toLocaleLowerCase("vi");
      const body = mission.content.toLocaleLowerCase("vi");
      const score =
        (title.includes(normalized) ? 6 : 0) +
        (keywords.includes(normalized) ? 4 : 0) +
        (body.includes(normalized) ? 1 : 0);
      return { mission, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.mission.week - b.mission.week)
    .slice(0, 30);
}
