# DX-Lab SV1 Training OS v0.3.0 — production release

Status: **Production verification PASS — 2026-09-16**.

## Release source and deployment

- Application version: `0.3.0`.
- Fully verified application source: `633b0f81664523c3265119436a0a9559a0ef0eaa`, main, Git-triggered build.
- Existing project: `dx-lab-student-lead`, `prj_fK0YdAXmOZi8YyOi2mqboSKAK0vM`, team `binhs-projects-438b34e8`.
- Verified and promoted deployment: `dpl_Egtpy5NJgm2UqvQ3quFgamXrmd62`.
- Deployment URL: https://dx-lab-student-lead-fpscpzqx7-binhs-projects-438b34e8.vercel.app
- Created: 2026-09-16T08:23:00.212Z; Production, Ready, Git ref main and exact source SHA confirmed through Vercel metadata.
- Authenticated candidate health and backup export passed before promotion; deployment protection was not disabled.
- Promoted this exact existing deployment using Vercel promote. No unrelated deploy, new project, DNS or credential change.
- Stable URL: https://dx-lab-student-lead.vercel.app
- Existing custom domain: https://learndxlab.bynh.id.vn
- Both HTTPS health endpoints returned `{"status":"ok","version":"0.3.0"}` after promotion.

Final release source is the commit referenced by annotated tag `v0.3.0` (`git rev-parse v0.3.0^{commit}`). The final documentation/tooling follow-up contains no application, curriculum, schema, dependency or Docker-runtime changes relative to the verified source above. Its Git-triggered deployment must be Ready for that exact commit and pass health/route checks before creating the tag. This avoids embedding a self-referential commit hash in its own content.

## Turso and backups

No migration, reset or seed was run during final promotion. Read-only checks confirmed all four expected migration-history entries and the six-column RecallReview schema. Initial raw recall-checksum comparison differed only because of LF/CRLF checkout conversion; an exact line-ending variant matched the recorded checksum. SQL semantics and migration history were left unchanged. Three earlier checksums matched byte-for-byte.

Private ignored backups:

- Original pre-V3 export: `artifacts/release-v0.3.0/production-before-v3-1789466866901.json`; revalidated; SHA-256 `005e0190276347602de974eb65ae1a88196b8d537b04e594dcc65f41be9b4b95`.
- Fresh pre-promotion export: `artifacts/release-v0.3.0/production-before-v3-1789548119453.json`; SHA-256 `8a2fbec686878e630b7dd35810a9ebea270e860edaea907515c8f275c39c6e75`.
- Supplemental 13-table/schema/history snapshot: `artifacts/release-v0.3.0/pre-promotion-1789548140881.json`; SHA-256 `ab2d9bac6c8b12d274e85af68ae6a18cf1a9d9f571dca54c999f48ee733b1da6`.

Baseline learner counts: 1 profile, 1 settings row, 1 mission-progress row, 2 quiz attempts, 50 skills; remaining learner tables empty. A post-smoke direct Turso comparison confirmed all 13 tables semantically preserved, excluding only the profile update audit timestamp.

## Production persistence smoke — PASS

Marker: `release-smoke-v0.3.0-1789548239885-b3f8e447-f5a0-4378-a41c-f984825e4ac8`.

Private baseline, restored export, stage log, trace, recall ID, verifier payload and evidence ID are under `artifacts/persistence-diagnosis/` in the matching marker directory.

- Unoccupied mission note/bookmark writes and separate-browser-context reads PASS.
- Recall persisted with the expected one-day schedule; progress, quiz and skill state unchanged.
- Malformed report rejected; valid report exported with the exact payload and persisted as evidence. No automatic competence or gate credit.
- Safe, deliberately incomplete incident attempt persisted as FAIL; all nine reasoning fields and expandable history verified. No pre-existing assistance was consumed.
- Export, validated Settings import, marker removal, full semantic state comparison and readiness comparison PASS.
- Both smoke and cleanup errors remain independently captured by the corrected runner. There were no smoke or cleanup failures in this production persistence run.

Exactly two equality exclusions: `learnerProfile.updatedAt` (Prisma updates it during profile restore) and envelope `exportedAt` (new export creation time). All other learner fields and timestamps stay strict; row order alone is normalized. No learner content, schedule, skill, gate, quiz, evidence, incident, note or bookmark was lost.

The release-only `--production` opt-in accepts only the two exact HTTPS production origins. Default execution remains loopback-only, and fault injection is prohibited in production mode. Tests cover rejected alternate hosts, HTTP, credentials and paths. A production smoke must run without concurrent learner editing because validated import restores a snapshot.

## Routes, features and regression

All required routes passed at 1440, 950 and 390 pixels: home, Today, roadmap, Week 1, labs, incidents/net-01, skills, evidence, exams, oral defense, readiness, glossary, search, bookmarks and settings. M1–M3 were checked separately at each width.

Today/current mission/next action and Warm-up render. Core execution, Capabilities, Assessment and Utility groups expand; Today stays prominent. M1–M3 diagrams, commands, predictions, lesson reveals, keyboard interaction and anchors work without page overflow. Incident forms retain four groups over the original nine fields. Import accepts JSON evidence only; no remote shell execution was introduced.

Boss Fight definitions, mission/weekly gate engine and training-state implementation have no changes from v0.2.0. Existing local regression QA passed. Production probes preserve progress, quiz, skills, weekly state and readiness. Runtime error-log queries found no errors during final verification.

## QA carried forward

- Lint, typecheck, build, repository safety and release/curriculum audit PASS.
- Existing application suite: 51 tests and 16 browser tests PASS.
- Persistence diagnosis: 5 browser tests and 24 focused support/backup tests PASS.
- Production origin opt-in: 18 support tests PASS; typecheck PASS.
- Docker v0.3.0 smoke previously PASS: health 0.3.0, persistent-volume restart PASS and validated UI import/restore PASS. Not repeated because application/runtime inputs did not change.

## Tag and rollback

Release tag: annotated `v0.3.0`, message `DX-Lab SV1 Training OS v0.3.0 - Learning Architecture V3`. Create and push only after the final documentation/tooling commit is deployed and verified; never move existing tags. v0.1.0 and v0.2.0 are preserved.

No rollback was needed during this successful final promotion. Prior v0.2.0 rollback deployment remains `dpl_3mn5xJU2mxLdvcSvLXwh9kCXkX4G`. If a genuine regression requires rollback, roll back the application only and retain the additive RecallReview table. Keep old-format exports for old-app recovery.

## Limitations

M1–M3 still require real learner testing before Teaching V2/V3 can be called Gold Standard. Local verifier reports are self-reported artifact observations, not proof of competency. The overwritten exception from the earlier abandoned production smoke remains unrecoverable; the corrected production smoke now passes independently.
