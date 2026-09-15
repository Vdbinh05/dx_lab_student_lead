# Learning Architecture V3

Status: pilot on `refactor/learning-architecture-v3`, based on Teaching V2 commit `2d479ad`. Production remains v0.2.0. This document defines system composition; [Teaching Specification V2](teaching-specification-v2.md) remains the canonical pedagogical standard. Its old branch/scope instructions describe the earlier pilot; the V3 task explicitly authorizes navigation and additive recall persistence here.

> The lesson is not complete when the information exists.
> The lesson is complete when a beginner can build the correct mental model, observe the concept, use it, break it, debug it, and explain why it works without needing an external search for core understanding.

## Canonical learner flow

```text
TODAY → 5-MINUTE RECALL → CURRENT MISSION
  → UNDERSTAND → OBSERVE → MINI EXPERIMENT → PRACTICE
  → BREAK IT → DEBUG → EXPLAIN → VERIFY → EVIDENCE
  → GATE → SKILL PROGRESSION → SPACED REVIEW → TODAY
```

Read arrows as actions to perform, not automatic state transitions. Predict before running; compare actual output; explain causes before claiming competence. The goal is 90–95% of required understanding on-site, pending measurement with the learner. External reading is optional reinforcement only.

Five visible presentation pillars link into the complete Markdown lesson: WHY / REAL-LIFE METAPHOR, VISUAL MODEL, COMMAND WALKTHROUGH, GOTCHAS / TROUBLESHOOTING, ACTION GATE. They do not replace V2's problem, why, prerequisites, mental model, definition, experiment, prediction, observation, DX-Lab connection, command anatomy, guided/partially guided/independent labs, break/debug, self-explanation, Feynman check, evidence, gate and resulting abilities.

## Live-code audit and boundaries

The starting app already had 57 missions, 300 mission quiz questions, 160 weekly questions, eight Boss Fights, 50 skill targets, 24 oral prompts, a glossary with 23 entries, Markdown reveals, three-stage pilot labs and deterministic gates. `docs/curriculum-audit.md`'s 285-question count predates V2; runtime loaders and release validation establish 300. The external assumption of localStorage-only persistence was incorrect: Prisma already supports local SQLite and remote Turso. Export and validated transactional restore already exist.

All nine incident fields already existed in the database and grading engine. The actual gaps were flat navigation, no deliberate recall scheduler, Today emphasizing overall progress, a visually unstructured incident form, and no bounded local verification/import path. V2 already supplied most of the requested teaching; retaining it is preferable to a rewrite.

## Navigation and Today

Today is always outside collapsible groups. Desktop and mobile share these groups:

| Group | Destinations |
| --- | --- |
| Core execution | Labs, Incidents |
| Capabilities | Skill Matrix, Evidence Vault, Roadmap / Weeks |
| Assessment | Exams & Boss Fights, Oral Defense, Final Readiness |
| Utility | Glossary, Search, Bookmarks, Settings, Dashboard |

Weeks and mission routes map to Roadmap's active state; all existing routes remain available. Active groups open on navigation; links have `aria-current`. Mobile keeps Today, Labs, Incidents visible with remaining groups under More. Breakpoints align at 1024px to avoid overlapping navigation on tablets.

Today shows recall, a concrete next action, current mission, its five execution-step progress, blockers and Continue. The existing daily plan remains subordinate. When mission gates finish, recall still appears above the weekly-review entry. Blockers and mission selection still come from existing engines.

## Recall: small, due-based and independent

Question content comes from existing mission quizzes. A question becomes eligible only after its mission's Learn step or a historical mission PASS. Unseen eligible questions are due immediately. Order is deterministic: earliest due first, then stable question ID; unseen items sort first. Show at most three per batch, invite stopping after five minutes, and display the total due count. No random bank, duplicate question prose or Anki algorithm.

Learner writes a disposable answer, opens the explanation, then self-rates:

| Rating | Next interval | Correct streak |
| --- | ---: | --- |
| Wrong | 1 day | Reset |
| Hard | 3 days | Reset |
| Correct once | 7 days | 1 |
| Correct twice | 14 days | 2 |
| Correct three or more | 30 days | 3+ |

Server UTC timestamps use exact 24-hour intervals; upcoming dates display in Asia/Bangkok. Ratings are self-report, not grading. Transactional writes re-read current state and ignore a duplicate submission for an item no longer due. The UI does not save answer drafts. Recall never writes quiz attempts, mission status, evidence or skills.

`RecallReview` stores stable mission/question ID, lastReviewedAt, nextReviewAt, reviewCount, streak and rating. A separate small table avoids polluting evidence, quiz scores, notes or competency signals. No new persistence provider.

## Incidents and debugging

Four fieldsets retain the exact nine fields:

1. SYMPTOM: observable error, no premature diagnosis.
2. DIAGNOSTICS: evidence → hypothesis → test → result.
3. ROOT CAUSE: cause supported by the result.
4. RESOLUTION: fix → verification → regression/prevention.

Evidence precedes hypothesis to avoid guessing. Verification follows fix because changing something does not prove recovery. Regression checks other behavior because a fix can introduce another failure. Helpers remain visible while typing. Previous attempts can be expanded with every recorded field. Existing attempt records, limits, assistance tracking and clean Boss Fight requirements remain unchanged.

## DX-Verify v1

Run in Ubuntu as the normal learner, from the Training OS repository:

```bash
python3 scripts/dx-verify.py week-01 mission-01
python3 scripts/dx-verify.py week-01 mission-02
python3 scripts/dx-verify.py week-01 mission-03
```

Default practice root: `~/dx-lab-practice`. An explicitly selected `--practice-root` must also be named `dx-lab-practice`; this supports disposable QA roots. Checks use fixed relative paths and never enumerate a directory.

| Mission | Checks under practice root |
| --- | --- |
| M1 | `week1/m1` directory; nonempty `docs/notes.txt`; nonempty `independent/docs/notes.txt`; `evidence` directory |
| M2 | `week1/m2` directory; nonempty `original.txt`; nonempty `hello.sh` with exact mode 700; `evidence` directory |
| M3 | `week1/m3` directory; nonempty `evidence/process.txt`, `evidence/log.txt`, `evidence/incident.txt` |

M3 requires no permanently running server and no exact PID. M2 never inspects `.env` or secret values. File metadata proves an observable artifact, not its correctness or authorship. The process/log/report contents still need learner/mentor review.

Boundary: local Linux → metadata checks → versioned JSON → manual paste → strict server validation → existing Evidence record (`test-result`, no automatic recomputation). No webhook, token, HMAC, remote shell, arbitrary execution, service, network connection or background agent. Each path component opens relative to an already-open directory with no symlink following; final checks require the learner's ownership, correct file kind and nonzero size. FIFOs/devices do not block the verifier. File contents are never read.

Report fields: `schemaVersion: 1`, fixed `missionId`, ISO UTC `generatedAt`, exactly four unique expected `checks` with `id`, `status` (`pass|fail`), `evidence` (`observed|missing-or-unexpected`), and consistent `overall`. CLI exits 0 for all pass, 1 for a failed check, 2 for unsupported invocation. No machine paths, usernames, PIDs or contents in reports. The web rejects unknown fields, wrong missions, inconsistent/duplicate/missing checks, invalid timestamps and payloads over 10 KB. Imported strings are data, never code. The form enforces the existing mission mutation locks.

Reports remain forgeable local self-reports. Schema validation is not attestation. DX-Verify alone cannot pass a mission, promote a skill, clean-pass a Boss Fight or establish readiness. Existing required evidence types, quiz thresholds, prerequisites and gates remain authoritative.

## Persistence, migration and recovery

Migration: `prisma/migrations/20260915090000_recall_review/migration.sql`, additive CREATE TABLE only. Tested on disposable SQLite and local libSQL databases, not production Turso. Existing adapters, environment selection and Vercel configuration are unchanged. The remote migration runner deliberately does not include this pilot migration; future deployment requires an explicit reviewed migration decision. Do not deploy this branch against an unmigrated database.

For local learner review: first export the old app's learner backup and retain a consistent SQLite backup; stop the old app, explicitly select a local `file:` database with Turso/Vercel variables empty, run `npx prisma migrate deploy`, regenerate Prisma and start the pilot. Never point this command at production. Existing personal learner databases were not migrated or reset during implementation; QA uses `artifacts/e2e/training.db` and fresh temporary databases only. Docker's existing entrypoint picks up additive migrations on local startup; Docker runtime smoke is a separate check.

The strict version-1 backup format gains optional `recallReviews`, defaulting to an empty array on old imports. Exports include schedules; import validates references, bounds, timestamps and uniqueness, then restores within the existing transaction. Importing an older backup intentionally restores an empty recall schedule. No existing state validation is weakened. The old v0.2.0 app rejects the new optional field: keep the pre-V3 backup for rollback rather than feeding a V3 export to old code. New evidence uses an already-supported type.

## Quality and stopping boundary

Only M1–M3 lesson prose and two glossary clarifications change. M4–57, quizzes, core engines, release version and deployment configuration stay intact. Testing includes schema negatives, scheduling, backup compatibility, Chromium desktop/tablet/mobile routes, existing gates/restore, and Ubuntu metadata/command checks. See [implementation report](learning-v3-implementation-report.md) for results and limits.

Editorial rubric scores are review aids, not learner outcomes. M1–M3 remain READY FOR LEARNER REVIEW, not final Gold Standard. Collect A/B/C/D feedback, the first confusing phrase, any core Google dependency, lab reached, elapsed time and fatigue. Only A/B with no core Google dependency supports later Gold Standard consideration. Stop after this pilot and branch push; no expansion, merge, release or production deployment.
