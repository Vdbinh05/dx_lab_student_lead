# v0.3.0 release preparation — 2026-09-16

Status: **BLOCKED before production mutation**. Production remains healthy v0.2.0. No deployment date exists yet.

## Starting state

Feature branch `refactor/learning-architecture-v3` and its remote matched `637e799`. Worktree was clean. `main` and origin/main matched `a3ed4a0`; existing tags were preserved. Git remote access succeeded.

## Private backup

Existing production `/api/backup` export was downloaded and validated before any production change:

- Local file: `artifacts/release-v0.3.0/production-before-v3-1789466866901.json` (ignored by Git).
- SHA-256: `005e0190276347602de974eb65ae1a88196b8d537b04e594dcc65f41be9b4b95`.
- Exported version: 0.2.0. Counts: 1 mission-progress row, 2 quiz attempts, 50 skills; no evidence, incident attempts, notes, bookmarks, weekly gates or oral reflections.
- A fresh export and private schema/table snapshot are required immediately before migration after authentication is restored. The documented stopped-file SQLite backup applies to local/Docker databases, not hosted Turso. No production schema snapshot has been taken yet.

## Reviewed changes

RecallReview migration is CREATE TABLE only: no DROP, rename, reset or seed. Existing tables and v0.2.0 queries are unaffected. Runtime compatibility with the migrated production database must still be verified before main is merged.

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

## Exact blockers

1. Vercel CLI is logged out. Its default configuration path also encountered an EXDEV rename error. An ignored local config directory was prepared at `artifacts/release-v0.3.0/vercel-cli`; authenticate there using `npx vercel --global-config "D:\DX OS\my_web_dx_lab_student_lead\artifacts\release-v0.3.0\vercel-cli" login`. Do not paste credentials into the task.
2. Docker smoke was attempted and failed before building because Docker Desktop's Linux engine pipe was absent. Startup log reports failure renaming `sailor-ingest.sock` to `.stale` with “The file cannot be accessed by the system.” No factory reset, volume deletion or data reset was performed. Docker Desktop must recover before the required smoke can pass.

## Remaining release sequence

After access/runtime recovery: rerun Docker smoke; refresh production export and snapshot; apply only pending recall migration using the documented production environment injection; verify unchanged old learner rows, isolated read/write/recall probes and healthy v0.2.0. Only then push the prepared feature branch, fetch/merge current main and push main. Verify the Git-triggered Vercel deployment is Ready for the exact new main commit. Check all routes, recall, M1–M3 reveals, incidents, evidence, report validation, backup/restore and reversible persistence, removing test data. Preserve all original learner state. Only after those checks create/push annotated v0.3.0.

No production migration, seed, test-state mutation, merge, deployment, tag or tag push has occurred in this release attempt. No rollback was required. Production readiness is not Teaching Gold Standard: M1–M3 still require real learner review.
