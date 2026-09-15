# v0.3.0 release preparation — 2026-09-16

Status: **Production migration verified; main deployment pending**. Production remains healthy v0.2.0 on 2026-09-16.

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

## Remaining release sequence

Push feature preparation, merge into current main normally and push main. Verify Git-triggered deployment Ready for the exact commit, then complete live route/feature/persistence and validated restore checks before tagging. No release tag exists yet. M1–M3 still require learner review before Teaching V2/V3 can be called Gold Standard.
