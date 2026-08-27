# Architecture — DX-Lab SV1 Training OS

## System boundary

The product is a local-first, single-learner Next.js application. It deliberately has no authentication, cloud sync, AI chat, realtime collaboration, external search, or admin CMS. SV1 owns infrastructure, identity, integration, troubleshooting, coordination, release, and security coordination; SV2 and SV3 implementation boundaries remain explicit in the curriculum.

```text
Browser
  → Next.js App Router / Server Actions
    → deterministic domain engines
      → SQLite learner state

Markdown + JSON curriculum
  → filesystem loader
    → Zod validation
      → pages and domain engines
```

## Curriculum layer

`DX_Lab_SV1_FINAL_Roadmap_100_100.md` is the primary specification. Runtime curriculum is in:

```text
content/
├─ weeks.json
├─ weeks/week-01 ... week-08/*.md
├─ quizzes/week-01 ... week-08.json
├─ weekly-quizzes/week-01 ... week-08.json
├─ incidents.json
└─ oral-defense.json
```

`src/lib/curriculum.ts` loads Markdown with `gray-matter`, validates all metadata and linked records with Zod, then returns typed domain objects. Curriculum prose is not duplicated in database rows or page components. Mission traceability records week, source type, roadmap competency, skill, and target level.

## Learner-state layer

SQLite stores only mutable learner state:

- `LearnerProfile` and `AppSettings`;
- `MissionProgress`, `Evidence`, and `QuizAttempt`;
- `IncidentAttempt` and active `IncidentAssistance`;
- `SkillProgress` and `WeeklyProgress`;
- `MissionNote`, `Bookmark`, and `OralReflection`.

Curriculum IDs are validated application-side because their source is the filesystem rather than a curriculum table. Database uniqueness still protects one progress/note per mission, one weekly record per week, bookmark targets, and primary IDs. Additive Prisma migrations preserve existing state; seed only upserts missing bootstrap rows.

## Deterministic learning engines

Mission PASS is an AND condition:

```text
prerequisites passed
+ learn/practice/build/break/debug completed
+ every required evidence type stored
+ best quiz attempt reaches threshold
+ explicit hard-gate commit
= PASSED
```

Evidence and quiz completion are derived from database records. A client cannot submit authoritative status, skill level, or readiness. `BLOCKED` requires a recorded reason and remains sticky until explicitly cleared.

Weekly progression separately requires every mission, its weekly quiz, a clean unassisted Boss Fight, required deliverable signals, and explicit gate confirmation. Future content is renderable as `AVAILABLE TO READ`, while all state-changing actions remain `LOCKED FOR PASS` until the previous gate passes.

Skills progress from deterministic capability evidence across L0–L4. Final readiness evaluates ten dimensions and refuses READY when any P0 blocker exists. Accelerated Mode changes scheduling only, never gates.

## Request and trust boundaries

Pages are Server Components by default. Client Components are limited to browser interaction such as navigation state, copy controls, pending feedback, and oral prompt selection. Server Actions parse strict bounded schemas, resolve curriculum records server-side, enforce week/prerequisite locks, and calculate derived state.

Markdown is rendered without raw HTML. Evidence and notes are escaped by React. Incident hints call the server so assistance cannot be hidden by a client-only flag. Backup import parses a versioned strict document, rejects unknown curriculum references and duplicate unique records, and only executes inside a transaction after explicit confirmation.

## Route families

- Navigation: `/`, `/today`, `/roadmap`, `/weeks/[week]`, `/weeks/[week]/review`.
- Work: `/learn/[week]/[mission]`, `/labs`, `/incidents`, `/incidents/[id]`.
- Proof: `/evidence`, `/skills`, `/readiness`, `/exams`, `/oral-defense`.
- Utilities: `/search`, `/bookmarks`, `/settings`.
- Operations: `/api/health`, `/api/backup`.

## Deployment boundary

Self-hosted Node uses a persistent `DATABASE_URL`. Docker maps a named volume to `/data/training.db`; the container entrypoint runs additive migrations and idempotent seed before starting Next.js. The health endpoint exposes only application status and version. See `docs/deployment.md` for operational procedures.
