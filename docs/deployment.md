# Deployment and Data Safety

DX-Lab SV1 Training OS is a single-user Next.js Node application backed by SQLite. The supported personal deployment stores the database on durable local disk or a Docker named volume. Do not deploy the database on ephemeral container storage.

Required runtime: Node.js 24.15.x (pinned in `.nvmrc` and the Docker base image).

## Local development

```powershell
Copy-Item -LiteralPath .env.example -Destination .env
npm install
npm run db:generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Run from the repository root. Open `http://localhost:3000`. The default development database is `dev.db` because `.env` sets `DATABASE_URL="file:./dev.db"`. Seed is idempotent: it adds missing profile/skill records and never deletes progress.

## Production Node build

```powershell
npm install
npm run db:generate
npx prisma migrate deploy
npm run db:seed
npm run build
npm run start
```

Set `DATABASE_URL` to an absolute, persistent location before migration/start. Example on Linux:

```bash
export DATABASE_URL='file:/srv/dx-lab-sv1/training.db'
```

The directory must exist and be writable by the application user. `npm run start` serves on port 3000 unless `PORT` is set.

## Docker deployment

```powershell
Copy-Item -LiteralPath .env.example -Destination .env
docker compose build
docker compose up -d
docker compose ps
```

Open `http://localhost:3000` or the host port configured by `APP_PORT`. The container database is `/data/training.db`. Compose mounts `/data` from the named volume `dx_lab_sv1_training_data`, so rebuilding or recreating the app container does not remove learner progress.

Set `TRAINING_VOLUME_NAME` only when deliberately choosing a different volume, for example an isolated deployment-smoke volume. Record the selected name with the backup procedure; changing it later makes Compose attach a different database rather than migrating the old one.

Never use `docker compose down -v` unless you intentionally want to delete the learner database volume after making and verifying a backup. Ordinary `docker compose down` preserves the named volume.

## Health and logs

```powershell
Invoke-RestMethod http://localhost:3000/api/health
docker compose ps
docker compose logs --tail=100 app
```

The health endpoint returns only `status` and the application `version`. It does not expose paths, environment variables, learner state, or database details.

## Preferred learner-state backup

Open Settings → Data Safety and download the JSON export, or request:

```powershell
Invoke-WebRequest http://localhost:3000/api/backup -OutFile learner-backup.json
```

The export contains progress, evidence, quiz/incident attempts, skill state, settings, notes, bookmarks, weekly gates, and oral-defense reflections. Treat it as private because evidence and notes may contain sensitive text. Import validates the entire versioned document and requires the exact confirmation phrase `IMPORT LEARNER BACKUP` before replacing current learner state.

## Direct SQLite backup

Use this second option for a complete database snapshot. Stop the app first so no write can occur while the file is copied:

```powershell
docker compose stop app
docker run --rm -v dx_lab_sv1_training_data:/data -v "${PWD}:/backup" alpine:3.21.3 cp /data/training.db /backup/training-backup.db
docker compose start app
```

Verify that `training-backup.db` exists and has a non-zero size before relying on it. Keep it outside Git and restrict access appropriately.

For a non-Docker deployment, stop the Node process cleanly, copy the exact SQLite file configured in `DATABASE_URL`, then restart. Do not copy a live database file with an arbitrary file-copy command while writes may be active. A SQLite-native online backup tool is acceptable when operated and verified by someone familiar with it.

## Restore

JSON restore is preferred because it validates curriculum references and schema version. Paste the backup in Settings → Data Safety, type the confirmation phrase, import, then verify Today, Evidence, weekly gates, and Final Readiness.

For a full SQLite restore, stop the app and first preserve the current database:

```powershell
docker compose stop app
docker run --rm -v dx_lab_sv1_training_data:/data -v "${PWD}:/backup" alpine:3.21.3 cp /data/training.db /backup/pre-restore-training.db
docker run --rm -v dx_lab_sv1_training_data:/data -v "${PWD}:/backup" alpine:3.21.3 cp /backup/training-backup.db /data/training.db
docker compose start app
Invoke-RestMethod http://localhost:3000/api/health
```

This replaces current learner state. Confirm the backup filename and keep the pre-restore copy until the application, evidence counts, and progress are verified.

## Upgrade

1. Export learner JSON and take a stopped SQLite backup.
2. Record the current application image/tag.
3. Pull changes or select the new release.
4. Run `docker compose build` and `docker compose up -d`.
5. Startup runs `prisma migrate deploy`; migrations are additive and seed remains idempotent.
6. Verify `/api/health`, logs, Today, Evidence, and one existing progress record.

Never use `prisma migrate reset` for an upgrade. It destroys data.

## Rollback basics

Application rollback and database rollback are separate decisions. If the new application can use the migrated database, redeploy the previous tested image. If the migration is incompatible, stop the app and restore the pre-upgrade SQLite snapshot together with the matching application version. Do not improvise reverse SQL against the only copy of learner data.

## Persistent-volume smoke test

Run the guarded automated smoke test from the repository root:

```powershell
npm run test:docker-smoke
```

It builds the image, creates a uniquely named volume (never the default learner volume), starts on port 3200, waits for health, opens the application, creates a small note, exports JSON, restarts the container, confirms persistence, explicitly resets only the isolated state, imports through Settings with the required confirmation phrase, confirms restoration, and finishes with that isolated learner state clean. Compose is stopped without `-v`; the clean smoke volume name is printed and retained for inspection.

Set `DXLAB_SMOKE_PORT` only if port 3200 is unavailable. The script refuses invalid ports and never targets `dx_lab_sv1_training_data`.

The application never resets learner state automatically. The CLI reset command and JSON import both require explicit confirmation paths.
