# Vercel + Turso deployment

Vercel runs the Next.js 16 application in the Node.js runtime. Mutable learner state is stored in Turso through Prisma 7 and `@prisma/adapter-libsql`; Vercel's function filesystem is never used as a database.

```text
Browser → Vercel Node.js functions → Prisma Client
        → @prisma/adapter-libsql → Turso
```

## Environment variables

Configure both variables for Preview and Production. Mark the token sensitive and never commit either real value.

| Variable             | Purpose                              |
| -------------------- | ------------------------------------ |
| `TURSO_DATABASE_URL` | Turso `libsql://...` database URL    |
| `TURSO_AUTH_TOKEN`   | Database-scoped authentication token |

`LOCAL_DATABASE_URL` belongs to Prisma CLI and local SQLite only. `DATABASE_URL` remains a compatibility alias for existing local and Docker installations. If Vercel is detected without both Turso variables, startup fails instead of falling back to an ephemeral file.

## Create and migrate Turso

The Vercel Marketplace provisions the empty database and injects its credentials. Apply every committed migration in chronological order without pulling or printing secrets:

```powershell
npx.cmd vercel env run --environment=preview -- npm.cmd run db:migrate:turso
```

`db:migrate:turso` records file checksums, applies each pending SQL migration transactionally, and verifies all expected tables and indexes. The equivalent standalone Turso CLI workflow is:

```bash
turso auth login
turso db create dx-lab-sv1-training --wait
turso db shell dx-lab-sv1-training < prisma/migrations/20260827193000_init/migration.sql
turso db shell dx-lab-sv1-training < prisma/migrations/20260827203000_harden_progress/migration.sql
turso db shell dx-lab-sv1-training < prisma/migrations/20260827221500_full_roadmap_state/migration.sql
turso db shell dx-lab-sv1-training ".tables"
```

Prisma's current Turso workflow intentionally keeps migration generation local. Create future migrations against local SQLite with `npm run db:migrate`, review the generated SQL, add the migration name to the guarded Turso migration runner, then apply it remotely. Never point `LOCAL_DATABASE_URL` at production and do not use `prisma migrate reset`.

Create a database token and obtain the URL without placing either in shell history. With those values present only in the process environment, run:

```powershell
npm run db:seed
npm run db:verify
```

For a Marketplace resource, use `vercel env run --environment=preview --` before each command instead of pulling credentials. `vercel.json` places the Node.js functions in `bom1`, matching this database's Mumbai region.

Seed is idempotent and creates only the learner profile, settings, and skill bootstrap. The verification command checks reads, isolated evidence/quiz/note/bookmark writes, and backup export, then removes its probe records.

## Deploy

Link the repository to `dx-lab-student-lead`, add both Turso variables to Preview and Production, then deploy and inspect logs:

```powershell
npx.cmd vercel link
npx.cmd vercel env add TURSO_DATABASE_URL preview
npx.cmd vercel env add TURSO_AUTH_TOKEN preview --sensitive
npx.cmd vercel env add TURSO_DATABASE_URL production
npx.cmd vercel env add TURSO_AUTH_TOKEN production --sensitive
npx.cmd vercel deploy --logs
npx.cmd vercel deploy --prod
```

The build runs `prisma generate` followed by `next build`. Schema migration and seed are separate release operations; no database reset, file creation, migration, or repeated seed runs inside Vercel builds or functions.

## Verification

Check `/`, `/api/health`, `/today`, `/roadmap`, `/weeks/1`, a Week 1 mission, `/skills`, `/evidence`, `/settings`, and `/readiness`. Health performs a database query and returns HTTP 503 with a non-sensitive payload when persistence is unavailable.

For persistence, export the current backup, create an isolated note/bookmark/evidence through the live UI, make a separate request, and confirm it remains. Restore the validated pre-test export through Settings to clean up without resetting the database. Keep downloaded backups private and outside Git.

## Custom domain and HTTPS

Attach a custom hostname only when the exact hostname is known. Vercel provides the required DNS record and manages HTTPS after validation and propagation. Do not add a reverse proxy for this deployment.

## Troubleshooting

- Missing one Turso variable: configuration fails with the name of the missing variable.
- Invalid token or unreachable database: `/api/health` returns 503 and database-backed routes fail; rotate/check the database-scoped token and URL.
- Schema absent: apply all migration SQL files in order, then verify `.tables` and indexes.
- Seed absent: run `npm run db:seed` once with Turso variables configured.
- Local migrations targeting the wrong database: ensure `LOCAL_DATABASE_URL` is a `file:` URL and unset Turso variables for ordinary local development.

## v0.3.0 release preparation — 2026-09-16

Release preparation is on `refactor/learning-architecture-v3`. Production has **not** been upgraded yet. The additive `20260915090000_recall_review` migration creates only RecallReview; v0.2.0 continues to use its existing tables. No seed/reset is required.

Before production changes, export and validate `/api/backup`, retain a private snapshot of existing table/schema/migration-history data, and pass QA including Docker smoke. Run the existing migration runner with production-scoped environment injection and a pending-migration guard:

```powershell
npx vercel env run --environment=production -- npm run db:migrate:turso -- --only-pending=20260915090000_recall_review
npx vercel env run --environment=production -- npm run db:verify
```

The guard refuses unexpected pending migrations. Verify pre-existing learner rows are unchanged and the still-deployed v0.2.0 health endpoint succeeds before merging main. `db:verify` tests isolated normal writes plus RecallReview, cleans its probes, and never seeds. Existing recall rows are not altered by its probe.

v0.3.0 backup export includes optional incidentAssistance as well as recallReviews. New restores preserve hint levels exactly; old exports that omit incidentAssistance leave current hints intact rather than erasing assistance. Keep the original v0.2.0 export for application rollback; old application code rejects new backup fields. No reverse schema migration should be used for an application rollback.

Docker smoke now uses a unique Compose project as well as a unique volume, preventing it from replacing an existing learner container. The smoke performs destructive reset only inside that isolated test volume.

After database verification: commit release preparation, push the feature branch, fetch, merge into current main, and push main to trigger the existing Vercel project. Verify Ready and exact Git commit, health version 0.3.0, routes, feature persistence and cleanup. Only then create/push annotated v0.3.0. Production readiness does not establish Teaching Gold Standard; M1–M3 still need learner review.

Docker smoke and Vercel authentication now PASS. The additive production migration and data-preservation probes PASS; main deployment and live verification are pending. Detailed status and backup references are in `docs/release-v0.3.0.md`.
