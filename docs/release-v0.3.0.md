# v0.3.0 release preparation — 2026-09-16

Status: **NO — production verification incomplete; application rolled back**. Production is healthy v0.2.0 on 2026-09-16. The additive RecallReview migration remains applied.

## Starting state

Feature branch `refactor/learning-architecture-v3` and its remote matched `637e799`. Worktree was clean. `main` and origin/main matched `a3ed4a0`; existing tags were preserved. Git remote access succeeded.

## Private backup

Existing production `/api/backup` export was downloaded and validated before any production change:

- Local file: `artifacts/release-v0.3.0/production-before-v3-1789466866901.json` (ignored by Git).
- SHA-256: `005e0190276347602de974eb65ae1a88196b8d537b04e594dcc65f41be9b4b95`.
- Exported version: 0.2.0. Counts: 1 mission-progress row, 2 quiz attempts, 50 skills; no evidence, incident attempts, notes, bookmarks, weekly gates or oral reflections.
- The fresh pre-migration export and supplemental schema/table snapshot are recorded below. The stopped-file SQLite backup workflow applies to local/Docker databases, not hosted Turso.

## Reviewed changes

RecallReview migration is CREATE TABLE only: no DROP, rename, reset or seed. Existing tables and v0.2.0 queries are unaffected. Runtime compatibility with the migrated production database passed before merging main.

Preparation updates package/application and Docker image versions to 0.3.0, registers the recall migration in the existing Turso runner, and adds `--only-pending=20260915090000_recall_review` to refuse unexpected pending migrations. Existing checksums/history remain authoritative.

Production review found that backup restore previously deleted incident assistance without exporting it. The optional `incidentAssistance` backup field now round-trips current hint state; importing old backups preserves current assistance rather than clearing it. No schema change is needed for that fix. Existing grading, gate and Boss Fight code is unchanged. Keep the pre-V3 export for old-app rollback because v0.2.0 rejects new backup fields.

Database verification now probes recall without overwriting existing schedules and cleans its temporary records. Docker smoke now uses a unique Compose project as well as a unique volume, avoiding interference with a learner container.

## Completed local QA

- Lint PASS.
- Typecheck PASS.
- Unit/integration tests PASS: 51 tests across 10 files, including new/legacy assistance restore behavior.
- Build PASS.
- Repository safety PASS.
- Release/curriculum audit PASS: 57 missions, 300 mission questions, 160 weekly questions, 8 Boss Fights, 50 skills, 24 oral prompts and 20 required routes.
- Browser QA PASS: 16 Chromium tests, including current gates, backup/restore and V3 desktop/mobile behavior.
- Local `db:verify` PASS on the isolated E2E database, including recall and cleanup.
- Local production-build `/api/health`: HTTP 200, `{"status":"ok","version":"0.3.0"}`.
- Live production `/api/health`: HTTP 200, `{"status":"ok","version":"0.2.0"}`.

## Production preparation verified — 2026-09-16

- Docker smoke PASS, supplied by the operator after Linux engine recovery: `DOCKER DEPLOYMENT SMOKE PASS`; health 0.3.0; persistent-volume restart and validated UI import/restore PASS. Completed local QA was not repeated.
- Normal Vercel CLI authentication verified. Existing project `dx-lab-student-lead`, ID `prj_fK0YdAXmOZi8YyOi2mqboSKAK0vM`, team `binhs-projects-438b34e8` confirmed. No new project created.
- Original backup checksum rechecked. Fresh validated v0.2.0 backup: `artifacts/release-v0.3.0/production-before-v3-1789499805680.json`, SHA-256 `31a432ab57579ffb4c2765bb7e90a018801e513935d9a54f9e4b904979bfa5a3`.
- Private schema/history/all-existing-table snapshot: `artifacts/release-v0.3.0/turso-before-v3-1789499811720.json`, SHA-256 `43ed3e85a6b7657f7761fd875fb619ccd5de2d92b51ffbabd9d4ee4fb1c0132a`.
- Guarded documented Turso runner applied ONLY `20260915090000_recall_review`: four migration-history records, 13 application tables, 10 indexes.
- Production `db:verify` PASS: learner, 50 skills, mission state, evidence, quiz, note, bookmark, recall and backup. Probe records cleaned. Comparison confirmed every pre-existing table unchanged.
- Still-deployed v0.2.0 health PASS after migration.
- Known-good rollback deployment: `dpl_3mn5xJU2mxLdvcSvLXwh9kCXkX4G`, `https://dx-lab-student-lead-8mnqfof1q-binhs-projects-438b34e8.vercel.app`. Application rollback retains the additive table; no reverse SQL or data reset.

## Git-triggered release and live verification

- Feature preparation `da01b82` and migration evidence `5c7c6ef` pushed normally to `refactor/learning-architecture-v3`.
- Fetched current main and merged with a normal merge commit: `488c52b26be0abd15f996f9d0170946b08e70737`. Main pushed without force.
- Existing Vercel project built deployment `dpl_64L1cLZuef5JC6aXFq8CZ1N2ikHm`, URL `https://dx-lab-student-lead-27ra8ahyg-binhs-projects-438b34e8.vercel.app`. Vercel API confirmed READY, source `git`, ref `main`, exact SHA above.
- Both `https://dx-lab-student-lead.vercel.app/api/health` and existing custom domain `https://learndxlab.bynh.id.vn/api/health` returned healthy 0.3.0 before rollback.
- Live browser route/navigation/M1–M3 checks PASS at 1440, 950 and 390 pixels. Routes: home, Today, roadmap, Week 1, labs, incidents, net-01, skills, evidence, exams, oral defense, readiness, glossary, search, bookmarks and settings; M1–M3 mission pages separately checked. Today/Warm-up visible, incident form has four groups, active navigation correct, lesson reveals/keyboard controls/code/anchors checked, no horizontal overflow.
- Vercel error-log query for that deployment returned no error logs during this window.
- The persistence smoke did NOT complete. Its cleanup comparison failed because validated import updates `LearnerProfile.updatedAt`. That cleanup exception obscured the initial smoke exception; the original cause was not captured. This is incomplete verification, not a confirmed application regression. Do not claim recall/report/incident production UI checks passed.
- Validated Settings import completed. A subsequent direct comparison with the pre-migration snapshot confirmed every other existing table unchanged, profile identity/name/creation unchanged, only profile `updatedAt` changed, and RecallReview empty. Probe learner state is absent. Private live backup and smoke script remain in ignored `artifacts/release-v0.3.0/`.

## Rollback and final state

Per the release stop condition, ran `vercel rollback dpl_3mn5xJU2mxLdvcSvLXwh9kCXkX4G --yes`. Vercel confirmed success. Both public hostnames now return `{"status":"ok","version":"0.2.0"}`. No reverse SQL, reset, reseed or destructive data correction was used. Profile import audit timestamp was left intact.

Boss Fight definitions (`content/incidents.json`) and progression/gate engine (`src/lib/progress-engine.ts`) have no diff from pre-release main; existing local gate QA passed. No release tag was created or pushed.

Main still contains the v0.3.0 merge; active production is the rolled-back v0.2.0 deployment. This status update is committed on the existing feature branch to avoid another main-triggered release. Before a future deployment, fix smoke error reporting so cleanup cannot obscure the primary failure, compare import audit metadata appropriately, diagnose the original unfinished persistence check, then repeat the required live persistence/report/incident/restore verification. Tag only after all checks pass.

M1–M3 still require learner review before Teaching V2/V3 can be called Gold Standard.

LEARNING ARCHITECTURE V3 PRODUCTION READY: NO
