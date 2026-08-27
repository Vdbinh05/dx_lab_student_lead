# Full Roadmap Implementation Plan

## Baseline audit — 2026-08-27

- Architecture: Next.js 16.3.3 App Router, strict TypeScript, Tailwind CSS, Prisma 7 with SQLite, file-based Markdown curriculum, Zod validation, deterministic server-side gates.
- Existing scope: seven Week 1 missions, one Week 1 Boss Fight, Evidence Vault, skill/readiness views, settings, 24 passing tests.
- Baseline verification: `npm run lint` PASS, `npm run typecheck` PASS when run after type generation, `npm test` PASS (24 tests), `npm run build` PASS.
- Learner data at audit: one MissionProgress row, zero Evidence/QuizAttempt/IncidentAttempt rows, twelve SkillProgress rows. No learner data was reset.
- Recoverable backups:
  - `artifacts/backups/dev-before-full-roadmap-20260827-215822.db`
  - `artifacts/backups/worktree-before-full-roadmap-20260827-215822.zip`
- Source of truth read completely: `DX_Lab_SV1_FINAL_Roadmap_100_100.md`.
- Next.js 16 guides reviewed before implementation: mutations, Server Actions, Route Handlers, environment variables, self-hosting, deployment, data security, and Playwright.

## Architectural decisions

1. Keep the existing local-first, single-learner architecture and Server Action mutation model.
2. Discover curriculum across `content/weeks/week-01` through `week-08`; validate the complete graph at load time.
3. Keep learner browsing separate from progression: future content may be read, but mutations and PASS remain locked until prior weekly gates pass.
4. Add only durable state required by the roadmap: mission notes, bookmarks, weekly gate commits, and oral-defense reflections.
5. Derive weekly summaries/readiness from mission, quiz, incident, evidence, skill, and weekly-gate records. Do not equate reading with readiness.
6. Export/import learner state as a versioned, Zod-validated JSON document. Import is transactional, destructive only to learner-state tables, and requires an exact confirmation phrase.
7. Deploy one Next.js Node container with SQLite at `/data/training.db` on a named Docker volume. Apply additive Prisma migrations at startup and never reset automatically.
8. Keep search local by indexing validated Markdown content in memory; no external search infrastructure.

## Delivery phases

1. Audit, plan, and backup — complete.
2. Additive data model and engine: notes, bookmarks, weekly gates, oral-defense reflection, generic incidents, backup/import, skill/readiness expansion.
3. Deployment: Dockerfile, Compose persistent volume, health endpoint, version display, production/backup/upgrade documentation.
4. Week 2 curriculum, validation, and tests.
5. Week 3 curriculum, validation, and tests.
6. Weeks 4–5 curriculum, validation, and tests.
7. Weeks 6–7 curriculum, validation, and tests.
8. Week 8 curriculum, validation, and tests.
9. Product interfaces: global search, week overview/review, oral defense, backup UI, filters, navigation, lock/read-only states.
10. Full audit and QA: curriculum coverage/correctness/pedagogy passes; lint, typecheck, unit/integration tests, build, Playwright, Docker build/start/health/persistence/export/import smoke.

## Non-negotiable invariants

- Existing Week 1 mission IDs and progress remain valid.
- No future week can PASS before its prerequisite weekly gate.
- Hints/solutions never count as a clean Boss Fight PASS.
- Server-side validation owns progress, evidence, quiz, incident, gate, and import decisions.
- No automatic learner-state deletion, destructive migration, or ephemeral production database.
- SV1/SV2/SV3 ownership boundaries and Frontend L0 remain unchanged.
