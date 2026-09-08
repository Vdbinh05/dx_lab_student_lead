# DX-Lab SV1 Training OS

Local-first training product for one DX-Lab SV1 learner. It turns the complete eight-week roadmap into an operational loop:

```text
UNDERSTAND → DEPLOY → INTEGRATE → OBSERVE → DEBUG
→ COORDINATE → REVIEW → SECURE → RELEASE → EXPLAIN
```

Reading does not award competency. A mission passes only after its operational steps, required evidence, quiz threshold, prerequisites, and explicit hard gate are all satisfied.

## Product coverage

| Week | Focus                                                                 | Missions |
| ---- | --------------------------------------------------------------------- | -------: |
| 1    | Linux, network, Git/Open Source, Docker/Compose baseline              |        7 |
| 2    | Docker L4, Compose, API, PostgreSQL, reverse proxy                    |        9 |
| 3    | Keycloak, OIDC, JWT/JWKS, SSO, RBAC                                   |        7 |
| 4    | n8n, workflow state, retry, idempotency, HITL                         |        7 |
| 5    | Operations, observability, Metabase, backup/restore                   |        7 |
| 6    | Qdrant, Ollama, RAG infrastructure and handoff                        |        6 |
| 7    | Agent tools, service auth, HITL, audit and red-team                   |        7 |
| 8    | Regression, configuration freeze, fresh machine, release and Mock OLP |        7 |

The product contains 57 missions, 300 mission questions (including the three Teaching V2 pilot quizzes), 160 weekly questions, eight scenario Boss Fights, 50 tracked skills, and 24 oral-defense prompts. Every future week can be read, but mutations and PASS remain locked until the previous weekly gate passes.

## Architecture

- Next.js 16.3 App Router, React 19, strict TypeScript, and Tailwind CSS.
- Prisma 7 with local SQLite through `@prisma/adapter-better-sqlite3` or remote Turso through `@prisma/adapter-libsql`.
- File-based Markdown curriculum under `content/`, validated with Zod.
- Server-side deterministic mission, weekly-gate, skill, incident, and readiness engines.
- SQLite stores only learner state: progress, evidence, attempts, settings, notes, bookmarks, weekly gates, and oral reflections.
- No authentication, cloud dependency, external search service, AI chat, or background worker.

See [docs/architecture.md](docs/architecture.md), [docs/security.md](docs/security.md), and [docs/curriculum-audit.md](docs/curriculum-audit.md).

## Local setup

Required: Node.js 24.15.x and npm. The pinned version is in `.nvmrc`.

```powershell
npm install
Copy-Item -LiteralPath .env.example -Destination .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). On macOS/Linux, use `cp .env.example .env`.

Seed is idempotent: it adds missing bootstrap records without deleting or overwriting learner attempts, evidence, notes, bookmarks, or PASS state. `npm run db:reset -- --yes` is the only CLI reset; it deliberately deletes progress and refuses to run without the explicit flag.

## Supported deployment modes

Local development and Docker keep SQLite file persistence. Vercel uses Turso and fails fast if its remote settings are missing; it never falls back to an ephemeral function-local database.

### Local and Docker

For a production Node process, set `DATABASE_URL` to a writable persistent path, run migrations and seed, then build and start:

```powershell
npm install
npm run db:generate
npx prisma migrate deploy
npm run db:seed
npm run build
npm run start
```

For Docker:

```powershell
Copy-Item -LiteralPath .env.example -Destination .env
docker compose build
docker compose up -d
docker compose ps
Invoke-RestMethod http://localhost:3000/api/health
```

The container uses pinned Node 24.15.0. SQLite lives at `/data/training.db` on the named volume `dx_lab_sv1_training_data`. Container rebuilds and restarts preserve it. Do not run `docker compose down -v` unless intentionally deleting the volume after a verified backup. Full backup, restore, upgrade, rollback, and smoke-test instructions are in [docs/deployment.md](docs/deployment.md).

### Vercel and Turso

Production requires `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in both Preview and Production environments. Prisma migration generation remains local; committed SQLite migration SQL is applied to Turso with the Turso CLI before the idempotent seed runs. See [docs/vercel-deployment.md](docs/vercel-deployment.md) for setup, migration, deployment, persistence verification, custom-domain, and troubleshooting procedures.

## Learner interface

| Route                           | Purpose                                                                  |
| ------------------------------- | ------------------------------------------------------------------------ |
| `/`, `/today`                   | Current position, blockers, and next actionable mission                  |
| `/roadmap`, `/weeks/[week]`     | Eight-week map and weekly operational brief                              |
| `/weeks/[week]/review`          | Gate status, counts, and exact remaining blockers                        |
| `/learn/[week]/[mission]`       | Concepts, commands, labs, failure drill, evidence, notes, quiz, and gate |
| `/labs`                         | Guided, independent, and integration lab catalog                         |
| `/incidents`, `/incidents/[id]` | Eight Boss Fights using the nine-step troubleshooting protocol           |
| `/evidence`                     | Evidence Vault with week, mission, skill, and type filters               |
| `/skills`, `/readiness`         | Deterministic L0–L4 skills and ten readiness dimensions                  |
| `/exams`, `/oral-defense`       | Mission/weekly/final blueprint and oral-defense practice                 |
| `/search`, `/bookmarks`         | Local curriculum search and saved missions/labs/incidents                |
| `/settings`                     | Schedule, app version, JSON export/import, and destructive reset warning |

## Gate and readiness rules

Mission state is `NOT_STARTED → IN_PROGRESS → READY_FOR_GATE → PASSED`, with `BLOCKED` reserved for a real learner-recorded blocker. Evidence and quiz steps are derived from stored records and cannot be bypassed by a checkbox. Server Actions re-check prerequisites and read-only week locks before every mutation.

Each week requires all missions, its 20-question weekly quiz, a clean unassisted Boss Fight, required deliverables, and explicit weekly gate confirmation. Opening a hint or solution permanently marks that incident attempt assisted; a new clean attempt is required for the gate.

Final Readiness evaluates UNDERSTAND, DEPLOY, INTEGRATE, OBSERVE, DEBUG, COORDINATE, REVIEW, SECURE, RELEASE, and EXPLAIN. It reports exactly `NOT READY`, `READY FOR MOCK OLP`, or `READY FOR FINAL`; any P0 blocker prevents readiness.

## Data safety

Settings can export a versioned JSON backup and import it only after strict schema/curriculum validation plus the exact confirmation phrase `IMPORT LEARNER BACKUP`. The backup includes all learner-state tables. Treat it as private because evidence and notes may contain sensitive text.

For a complete SQLite snapshot, stop writes first and copy the configured database or the Docker volume using the documented procedure. Migrations are additive; upgrades must never use `prisma migrate reset`.

## Quality commands

```powershell
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run test:docker-smoke
npm run build
npm run check:repo-safety
```

Curriculum validation checks all eight weeks, required mission sections, traceability metadata, evidence types, quiz mapping, hard gates, unique IDs, prerequisites, incidents, weekly quizzes, and skill targets.

`test:docker-smoke` creates a uniquely named disposable volume and port 3200 deployment, then verifies health, application open, test progress, restart persistence, JSON export, explicit isolated reset, confirmed UI import, restored progress, and a final clean isolated state. It never selects the default learner volume.

## Scope and limitations

- Single trusted learner; no multi-user authentication. Vercel mode stores that learner's state remotely in Turso.
- Evidence is text/URL only; file upload is intentionally omitted for deployment safety.
- Short answers use deterministic normalized matching; self-explanations use a minimum-quality heuristic and still rely on learner honesty plus evidence and gates.
- The app teaches commands but does not execute learner infrastructure, control Docker, or provide a terminal emulator.
- Project-specific ports, credentials, image tags, and service URLs must be supplied by the learner’s actual DX-Lab project and are visibly treated as project-defined inputs.
- SV1 supports SV2 Backend/API/Data and SV3 Portal/AI work without assuming their implementation ownership.

The curriculum source of truth is `DX_Lab_SV1_FINAL_Roadmap_100_100.md`. Mission metadata preserves source type, week, roadmap competency, skill, and target level.
