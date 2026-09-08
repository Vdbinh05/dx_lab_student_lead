# Teaching Specification V2

> "The lesson is not complete when the information exists.
> The lesson is complete when a beginner can build the correct mental model, observe the concept, use it, break it, debug it, and explain why it works without needing an external search for core understanding."

This is the authoritative teaching-quality standard for the **Week 1 Missions 1–3 pilot**. It supplements the roadmap and existing content-authoring contract. It does not redefine lecturer requirements, competency levels or application gates. The target is 90–95% of mission-required understanding available on-site; this is a design target, not a measured learner result.

## Teaching flow and concept dependencies

For each important concept, use:

```text
PROBLEM → WHY THIS EXISTS → INTUITION → MENTAL MODEL
→ TECHNICAL DEFINITION → MINI EXPERIMENT → OBSERVATION
→ DX-LAB CONNECTION → PRACTICE → BREAK → DEBUG → EXPLAIN → PROVE
```

Read → memorize → quiz must not dominate. Start with a concrete obstacle, explain why a solution is needed and what is difficult without it, then introduce the name. Preserve useful existing material when it already serves this flow.

Every core concept must satisfy six layers: (1) problem, (2) plain-language intuition, (3) concrete mental model with analogy limits, (4) correct technical definition, (5) observable experiment, (6) specific DX-Lab application. These may be woven together rather than six repetitive headings. Minor terms need a short explanation, not six long sections.

A term can appear only if taught earlier with a reference, explained immediately, or linked to an on-site glossary entry. Do not stack service/bind/socket/interface/listen/port in one unexplained sentence. Maintain a dependency map in the pilot audit and teach foundations before dependent tasks. A small explicit bridge is allowed when a later subject is needed early (program/process for environment; Git ignore before the Git mission; HTTP/port before the networking mission).

## Mission learning experience

Each mission begins with **TRƯỚC KHI HỌC BÀI NÀY**, visible checkboxes and prerequisite mission/concept links. State explicitly when no prior Linux knowledge is needed. Distinguish operational setup from conceptual prerequisites; missing tools must have a recovery path. Later content remains readable under the existing progression rules.

Use 5–12 minute learning chunks, with a prediction, command, comparison, drawing or explanation after roughly 5–10 minutes of reading. Avoid long prose runs (about 120–180 words without a useful break), but do not mechanically pad or split for counts. Give a short route through chunks and room to pause. Estimates include practice, evidence and retries.

Use text diagrams for trees, relationships and lifecycles. Explain direction, indentation and symbols. Every diagram must clarify a concept; no decorative diagrams. Teach confusing pairs side by side:

| Mission | Required contrasts |
| --- | --- |
| M1 | terminal/shell, root/home/current directory, absolute/relative, ./.. |
| M2 | owner/group vs actions, read/write/execute, environment/.env, hidden/secure |
| M3 | program/process, process/service, PID/port, CPU/RAM/disk, running/healthy/functional, grep/tail |

Each mission includes **NGƯỜI MỚI THƯỜNG NHẦM**, correcting concrete mistakes, and **SV1 CẦN BIẾT ĐẾN MỨC NÀO?**, naming useful skills and the stopping boundary. **TRONG DX-LAB, TÔI DÙNG THỨ NÀY Ở ĐÂU?** must connect to project paths/configuration, scripts/secrets, or service/log/resource work without claiming SV1 owns SV2/SV3 implementation.

## Observe, predict, practice

Each major concept needs a 1–5 minute experiment before a large lab. Ask **Bạn nghĩ điều gì sẽ xảy ra?** before selected navigation, permission, termination and resource observations. Require the learner to compare prediction with actual results and explain the change, not merely paste matching output.

Every important command must teach COMMAND, WHERE TO RUN, WHY, important name/options/arguments, EXPECTED OUTPUT, output interpretation, COMMON FAILURE and verification. Related commands may share a workshop when each command's role and failure is still clear. Explain stable output fields, not fabricated exact PIDs, usernames, timestamps, versions or resource values. Define shell syntax such as quotes, redirection, pipes and variable assignment before relying on it. Label placeholders as non-executable templates and explain substitution.

For each mission provide:

1. **LAB 1 — GUIDED:** detailed steps with expected result and verification.
2. **LAB 2 — PARTIALLY GUIDED:** goal plus hints, fewer exact commands.
3. **LAB 3 — INDEPENDENT:** a new target and acceptance criteria, no immediate command solution; hints are hidden until requested.

Core concepts must support **TÔI CHƯA HIỂU** with another explanation/analogy, a smaller example, a likely misconception and a tiny experiment, rather than repeating the original paragraph. Self-explanation asks, without looking back, what problem the concept solves, how it differs from its confusing neighbor and why it appears in DX-Lab. **SHOW KEY POINTS** stays collapsed until selected. No AI grading is added.

## Break and debug

For each major concept connect an incorrect condition to its observable symptom and next diagnostic test. Each mission includes meaningful safe **BREAK IT / Failure Injection**, followed by:

```text
SYMPTOM → EVIDENCE → HYPOTHESIS → TEST → RESULT
→ ROOT CAUSE → FIX → VERIFICATION → REGRESSION
```

Do not just list the protocol. Work through a real example. Evidence precedes hypothesis because otherwise the learner guesses; tests discriminate one hypothesis at a time and can reject it. Verification follows fix because changing a command/configuration does not prove the problem is gone. Regression comes last because a local fix can break or hide another behavior. Preserve evidence before restarting or overwriting logs.

## Platform and safe practice

Target Windows + WSL/Ubuntu + Docker Desktop. Explicitly label Windows PowerShell setup commands separately; normal Linux learning commands run in WSL/Ubuntu. File/permission labs use Linux home under `~/dx-lab-practice/`, not arbitrary Windows-mounted paths. Explain user root versus root directory, root permission exceptions and WSL filesystem caveats.

Only mutate practice files/processes. Explain rm, rm -r and rm -rf risks; exercise deletion only on an individually verified disposable file. Never teach destructive system examples or encourage privileged recursive deletion. Check PID/user/command immediately before TERM; never kill a process based on its port or a stale ID. Bind practice HTTP servers to loopback, serve only dummy files, explain port conflicts and stop the created server afterward. No secret data in labs/evidence.

Command verification covers pwd, ls/ls -la, cd, mkdir, touch, cat, echo, cp, mv, rm, chmod, id, stat, printenv, export, ps, top awareness, kill, grep, tail, free, df and python3 -m http.server on Linux where available. Report what was executed versus reviewed; do not claim tests unavailable in the actual environment.

## Glossary and minimal Markdown support

Reusable source: `content/glossary-week-01.json`, rendered at `/glossary`. Each entry has stable id, term, one-line explanation, detailed beginner explanation, example and related concept ids. Cover terminal, shell, command, working directory, filesystem, path, root, home directory, hidden file, environment variable, permission, owner, group, chmod, program, process, PID, signal, service, log, CPU, RAM and disk. Link to `/glossary#id`; glossary has mission return links and browser Back returns to reading position.

Teaching reveals use a fenced code block whose language is `teaching`. First line is the summary, subsequent lines are Markdown rendered in a native closed `details` element. Inner command examples may use tilde fences. No raw HTML execution or new dependency. Ordinary code blocks retain copy controls. Numbered level-two headings create `#section-N` anchors; top-of-lesson links navigate chunks. Tables scroll within the lesson on narrow screens.

Reveals are learning aids, not Boss Fight hints: opening them does not alter incident assistance, mission progress or gates. Do not enable raw HTML or redesign navigation. No database metadata is added; all strict frontmatter remains compatible with Teaching V1.

## Quiz, evidence and mission ending

Use 10 questions per pilot mission to represent the requested ratio exactly: 2 definition, 3 conceptual, 3 application, 2 troubleshooting. Include multiple choice, tightly scoped short answers and a self-explanation. Vary answer positions and write explanations that give reasons. Prefer prediction, comparison, applying an existing command and selecting the next evidence check; no irrelevant trivia. The existing deterministic self-explanation check is limited and is not a human competence assessment.

Retain evidence types, prerequisite IDs, threshold and hard gate. Require actual observations, explanation and appropriate incident records. End with concrete **SAU BÀI NÀY BẠN CÓ THỂ** abilities and a next step, then **GIẢI THÍCH CHO MỘT NGƯỜI CHƯA HỌC IT**: a 3–5 sentence explanation using ordinary language. Reading or revealing key points never awards PASS.

Suggested structure combines mission goal/why/prerequisites/story, concepts/models/diagrams/experiments, observation/deepening/DX-Lab/workshop, three labs, confusions/break/debug/self-explanation, quiz/evidence/gate/abilities/next/Feynman. Merge sections when helpful; no empty headings to satisfy a checklist. Preserve legacy validated section vocabulary meaningfully until content contracts evolve separately.

## Source traceability and optional reading

Preserve [THEO KẾ HOẠCH CÔ], [KIẾN THỨC MỞ RỘNG ĐỂ SV1 HỌC/DEBUG TỐT HƠN], [PROJECT-DEFINED / TBD]. Metadata retains roadmap alignment; newly authored examples are explicitly extensions, not new lecturer mandates. Project paths/ports/configuration remain project-defined. External primary documentation may appear only as **ĐỌC THÊM — OPTIONAL** and must not carry required explanations missing from the lesson.

## Google Dependency Test and quality rubric

Without Google, can a beginner understand every required term and why it exists, complete guided and independent labs, interpret output, reproduce and reason about a failure, and explain it in their own words? For every NO caused by missing teaching, fix the lesson. Log each previously assumed concept and its replacement explanation in the audit. Do not equate an editorial self-containedness review with a measured 90–95% learner result.

Score each category 0–3: 0 absent, 1 present but weak/assumed, 2 usable with a documented limitation, 3 explicit and supported by teaching/evidence. Categories: beginner clarity, why/problem, mental model, technical correctness, prerequisites, visuals, mini experiments, DX-Lab connection, lab progression, debug teaching, self-explanation, self-containedness. Maximum 36. Pass ≥32; ≥34 is only a Gold Standard candidate. Hard rules: technical correctness =3, beginner clarity ≥2, self-containedness ≥2, regardless of total.

Automated checks and author scores cannot establish **GOLD STANDARD**. Successful pilot status is **READY FOR LEARNER REVIEW**. Learner chooses A very easy, B understandable but slightly tiring, C needed Google for core concepts, D did not understand. Only A/B without core Google dependency can later become Gold Standard after learner testing. Record confusing phrase, first external-search need, lab reached, time/fatigue and suggested repair.

## Scope, QA and release boundary

Only W1-M1/M2/M3 and their quizzes, glossary and minimal teaching UI. Do not rewrite M4–57, change engine invariants, database, adapters, deployment configuration or production. Validate lint, typecheck, tests, build, repo safety and curriculum/release checks. Add focused tests for reusable reveals/links/safety only. Review all three missions in a real desktop/mobile browser: readability, diagrams/code, overflow, reveal controls, glossary/anchors and existing gate workflow. Keep findings and actual command evidence in the pilot audit.

Commit/push only `content/teaching-v2-pilot` after QA, no merge, no release/tag or production deployment. Stop after these three missions; learner review decides whether Teaching V2 scales.
