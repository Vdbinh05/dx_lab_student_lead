# Content Authoring Guide

## Source and role boundary

Start with `DX_Lab_SV1_FINAL_Roadmap_100_100.md`. Do not add a mission that moves Backend/API/Data/business-process ownership from SV2 or Portal/UX/AI-reasoning ownership from SV3 into SV1. Every mission must retain `week`, `roadmapCompetency`, `skillId`, `targetLevel`, and one source type:

- `THEO_KE_HOACH_CO` → THEO KẾ HOẠCH CÔ;
- `KIEN_THUC_MO_RONG` → KIẾN THỨC MỞ RỘNG ĐỂ SV1 HỌC/DEBUG TỐT HƠN;
- `PROJECT_DEFINED_TBD` → PROJECT-DEFINED / TBD.

## Mission files

Create `content/weeks/week-NN/mission-NN-slug.md`. Required frontmatter includes unique `id`, week/order/title/category, skill, time, target, source, roadmap competency, keywords, objectives, prerequisites, evidence types, quiz threshold, hard gate, and why it matters. Use an existing mission as the canonical schema example; the loader rejects unknown fields and invalid values.

Every mission must include the validated sections for analogy, beginner explanation, technical definition, DX-Lab use, SV1 target, subtopics, commands/configuration, where to run, expected output, guided lab, independent lab, integration lab where relevant, failure injection, nine-step troubleshooting, beginner errors, self-check, evidence, quiz, and PASS gate.

Command-heavy sections must state `COMMAND`, `WHERE TO RUN`, `WHY`, `EXPECTED OUTPUT`, and `COMMON FAILURE`. Describe stable signals rather than brittle version-specific full output. Never place a real token, password, personal absolute path, or broad destructive command in curriculum.

## Labs and incidents

Guided labs provide scaffolding; independent labs remove it; integration labs cross a meaningful service contract. Each must identify expected results and a safe rollback or cleanup when it mutates state.

All failure work uses:

```text
SYMPTOM → EVIDENCE → HYPOTHESIS → TEST → RESULT
→ ROOT CAUSE → FIX → VERIFICATION → REGRESSION
```

Boss Fights live in `content/incidents.json`. Public symptom and known facts must not reveal the root layer. Hints escalate server-side. Opening Hint 1, Hint 2, or solution makes the current attempt assisted; weekly gates require a later clean attempt.

## Quizzes and evidence

Mission quizzes are keyed by mission ID in `content/quizzes/week-NN.json` and require at least five mixed multiple-choice, short-answer, and self-explanation questions. Weekly quiz files under `content/weekly-quizzes/` require at least 20 questions. Short answers use normalized deterministic matching; self-explanations require substantive text but are reinforced by evidence and hard gates.

Supported evidence types are:

```text
command, terminal-output, log, explanation, incident-report,
github-url, config, test-result, reflection
```

Choose evidence that demonstrates the target capability. L3/L4 missions must not rely only on passive explanation.

## Validation workflow

After each curriculum change run:

```powershell
npm run typecheck
npm test
npm run build
```

Validation covers eight-week metadata, all mission sections, unique IDs/order, quiz mapping/counts, source traceability, evidence enums, hard gates, prerequisites, incidents, weekly quizzes, oral-defense groups, and skill references. Update `docs/curriculum-audit.md` when roadmap coverage or a known project-defined assumption changes.
