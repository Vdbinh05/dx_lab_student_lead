import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  getAllMissions,
  getIncidents,
  getOralDefenseQuestions,
  getWeeklyQuiz,
  searchCurriculum,
  validateCurriculum,
  weeks,
} from "@/lib/curriculum";
import { skillTargets } from "@/lib/database-maintenance";

describe("Week 1 curriculum structure and roadmap coverage", () => {
  const missions = getAllMissions().filter((mission) => mission.week === 1);
  it("contains exactly seven ordered Week 1 missions", () => {
    expect(missions.map((mission) => mission.order)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
    expect(new Set(missions.map((mission) => mission.id)).size).toBe(7);
    expect(
      missions.every((mission) => mission.week === 1 && mission.hardGate),
    ).toBe(true);
  });
  it("keeps V1 sections, V2 learning scaffolding and the nine-step incident protocol", () => {
    for (const mission of missions) {
      if (mission.order <= 3) {
        for (const section of [
          "TRƯỚC KHI HỌC BÀI NÀY",
          "LAB 1",
          "LAB 2",
          "LAB 3",
          "TÔI CHƯA HIỂU",
          "SHOW KEY POINTS",
          "Evidence Required",
          "PASS Gate",
          "GIẢI THÍCH CHO MỘT NGƯỜI CHƯA HỌC IT",
        ])
          expect(mission.content).toContain(section);
      } else {
        for (let section = 1; section <= 16; section += 1)
          expect(mission.content).toMatch(new RegExp(`## ${section}\\.`));
      }
      for (const token of [
        "SYMPTOM",
        "EVIDENCE",
        "HYPOTHESIS",
        "TEST",
        "RESULT",
        "ROOT CAUSE",
        "FIX",
        "VERIFICATION",
        "REGRESSION",
      ])
        expect(mission.content).toContain(token);
    }
  });
  it("covers the roadmap Week 1 command and deliverable baseline", () => {
    const all = missions.map((mission) => mission.content).join("\n");
    for (const token of [
      "pwd",
      "chmod",
      "top -b",
      "ip route",
      "ss -lntp",
      "curl --connect-timeout",
      "git fetch",
      "git push",
      "docker compose config",
      "docker compose logs",
      "postgres:17.5-alpine",
      "CODEOWNERS",
      "CI baseline",
    ])
      expect(all).toContain(token);
  });
  it("keeps quiz data aligned one-to-one with all missions", () => {
    const quiz = JSON.parse(
      readFileSync("content/quizzes/week-01.json", "utf8"),
    ) as Record<string, unknown[]>;
    expect(Object.keys(quiz).sort()).toEqual(
      missions.map((mission) => mission.id).sort(),
    );
    expect(
      Object.values(quiz).every((questions) => questions.length >= 5),
    ).toBe(true);
  });
});

describe("complete 8-week curriculum", () => {
  const allMissions = getAllMissions();

  it("matches the intended mission distribution and validates every mission", () => {
    expect(
      weeks.map(
        (week) =>
          allMissions.filter((mission) => mission.week === week.number).length,
      ),
    ).toEqual([7, 9, 7, 7, 7, 6, 7, 7]);
    expect(validateCurriculum({ requireComplete: true })).toEqual({
      valid: true,
      errors: [],
    });
    expect(allMissions.every((mission) => mission.quiz.length >= 5)).toBe(true);
    expect(skillTargets).toHaveLength(50);
    expect(
      allMissions.every(
        (mission) =>
          mission.keywords.length >= 3 &&
          mission.requiredEvidence.length >= 1 &&
          mission.roadmapCompetency.length > 0,
      ),
    ).toBe(true);
  });

  it("has 20-question weekly quizzes and one Boss Fight per week", () => {
    expect(weeks.map((week) => getWeeklyQuiz(week.number).length)).toEqual(
      Array(8).fill(20),
    );
    expect(getIncidents().map((incident) => incident.week)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);
  });

  it("covers all ten oral-defense groups", () => {
    expect(
      [...new Set(getOralDefenseQuestions().map((item) => item.group))].sort(),
    ).toEqual(
      [
        "AI Infra",
        "Architecture",
        "Change Request",
        "Docker",
        "H-P-D-I",
        "Identity",
        "Integration",
        "Release",
        "Security",
        "Troubleshooting",
      ].sort(),
    );
  });

  it("searches title, keywords, and body locally", () => {
    expect(
      searchCurriculum("configuration freeze").some(
        (item) =>
          item.mission.week === 8 &&
          item.mission.id === "w8-m2-configuration-freeze-change-impact",
      ),
    ).toBe(true);
    expect(searchCurriculum("QDRANT_URL").some((item) => item.mission.week === 6)).toBe(true);
    expect(searchCurriculum("x")).toEqual([]);
  });
});
