# v0.3.0 persistence smoke diagnosis — 2026-09-16

Historical diagnosis record. The subsequently authorized final production smoke passed; see [release verification](release-v0.3.0.md). The harness now has an explicit production-origin opt-in; its default is still loopback-only.

Scope: local harness diagnosis on `refactor/learning-architecture-v3`. No production request, migration, learner-data mutation, Vercel operation, deployment, main merge/push or release tag during this diagnosis.

## Original failure: evidence boundary

**ORIGINAL FAILURE: unavailable in the retained production output.** There is no captured original stack, trace, screenshot, intermediate export or error journal from that run. The retained output records the three responsive route checks and then the cleanup exception. `production-smoke.ts` originally had no catch before finally: an exception from restore equality replaced any pending exception before the outer catch logged it. The exact historical exception cannot be recovered from that output or the pre-smoke backup. Root cause category for that historical exception remains **unknown**. Do not label a new local exception as the recovered production stack.

Inspected the original smoke, `verify-cleanup.cjs`, release report, artifact inventory and retained task output. Exact original scripts were preserved privately as `artifacts/release-v0.3.0/production-smoke.failed-original.ts` and `verify-cleanup.failed-original.cjs`. The active historical smoke entrypoint now delegates to the corrected, loopback-only runner. The production-specific cleanup script is retired to prevent accidental use.

## Independently reproduced failure

The old separate-context selector was run verbatim against the same v0.3.0 application code with a synthetic M1 IN_PROGRESS fixture in isolated SQLite. It fails with:

```text
expect(locator).toHaveValue(expected) failed
Locator: locator('textarea[name="content"]').first()
Expected: "release-smoke-v0.3.0-1789500657306-bfa0a2c3-0372-4385-89fa-25bfc4cfbf17"
Received: ""
Timeout: 5000ms
```

The locator resolves to the Evidence form textarea with `minlength="12"` and placeholder `Lệnh, output, giải thích, verification...`. That form precedes Mission note. The actual note persists; reading the textarea scoped to the Mission note section passes in a separate browser context.

The first reproduction's exact stack is retained in ignored `artifacts/persistence-diagnosis/release-smoke-v0.3.0-1789500657306-bfa0a2c3-0372-4385-89fa-25bfc4cfbf17/errors.log`, pointing to `scripts/persistence-smoke.ts:122:27` as that file existed during the run. Subsequent runs retain their own logs. This is direct evidence of a **smoke-test bug**, not proof of the overwritten production exception.

## Cleanup side effect and comparison contract

The original cleanup exception was `ExpectError: restored learnerProfile`, at the historical smoke's line 93:278. Its equality comparison expected `LearnerProfile.updatedAt` from the export but received the timestamp of validated restore.

`importLearnerBackup` updates the existing profile name through Prisma upsert. `LearnerProfile.updatedAt` has `@updatedAt`, so this audit timestamp legitimately advances. Existing identity, name and creation time are preserved. There is no application persistence fix required for this behavior.

Exactly two comparison exclusions:

| Field | Reason |
| --- | --- |
| `learnerProfile.updatedAt` | The only ignored learner-row field: existing-profile restore is a profile update through Prisma. |
| Top-level `exportedAt` | Export-envelope creation time changes on every download; it is not learner data. |

Everything else stays strict, including profile ID/name/createdAt; every note/progress/skill/incident/quiz/evidence/recall/weekly/oral timestamp; assistance levels; settings; application version and schema version. Only top-level database row ordering is normalized; nested arrays retain order. Unexpected fields are rejected by the backup parser. No broad timestamp filtering is used.

Progress, quiz attempts, skills, evidence, notes, bookmarks, incident attempts and assistance, weekly gates, oral reflections and recall schedules are compared after restore. Boss Fight state is represented by incident attempts/assistance and weekly gates. Readiness is derived, so the full readiness `main` text is also compared before/after. Every temporary marker must be absent after restore.

## Corrected harness

- `scripts/persistence-smoke.ts`: local persistence-only runner; scopes Mission note reads correctly; writes a private baseline before probes.
- `scripts/persistence-smoke-support.ts`: catches the original exception before cleanup, preserving its object and stack. Cleanup, diagnostic-output and browser-close failures are independently recorded. Cleanup cannot overwrite the smoke failure.
- Each run gets a `release-smoke-v0.3.0-<timestamp>-<UUID>` marker, stage journal, error stacks, browser trace and before/after exports under ignored `artifacts/persistence-diagnosis/`.
- Notes/bookmarks use an unoccupied mission. Existing notes/bookmarks are never overwritten or toggled off. Existing recall schedules are not overwritten; the probe selects an eligible unscheduled question and records its ID privately.
- The strict verifier report cannot accept an arbitrary marker field. Its unique generatedAt, exact validated payload and newly created evidence ID are recorded in that run's private directory. Export verifies the exact report payload.
- The incident probe is a marked, deliberately incomplete FAIL. Existing net-01 assistance causes an abort before writes, because submission consumes hint state. Passed/locked M1 prevents the report probe; the harness never changes gates to enable testing.
- Validated Settings import restores the baseline even after test failure, then compares semantic state/readiness and checks marker removal. Local fixtures are also removed by the E2E suite's teardown.
- Both the library and CLI reject remote URLs before any browser/request. This diagnosis version cannot target production.

## Local verification

Commands:

```powershell
npm.cmd run test:persistence
npx.cmd vitest run scripts/persistence-smoke-support.test.ts src/lib/backup.test.ts
npm.cmd run typecheck
npx.cmd eslint scripts/persistence-smoke.ts scripts/persistence-smoke-support.ts scripts/persistence-smoke-support.test.ts scripts/verify-persistence.ts e2e/persistence-diagnosis.spec.ts
```

The existing Playwright setup creates `artifacts/e2e/training.db`, applies migrations only to that isolated file, and starts loopback port 3100 with Turso/Vercel variables explicitly blank. Tests use synthetic local fixtures; production backups are never imported.

Five browser cases cover the original selector reproduction, complete corrected smoke, simultaneous injected smoke/cleanup errors after actual writes and restore, preservation of pre-existing M1 note/recall, and refusal to consume existing incident assistance. Twenty-four focused unit/backup tests cover exception identity/stack retention, cleanup/diagnostic/close failures, strict comparison, remote URL refusal and the existing backup restore behavior.

The corrected full local smoke passes note/bookmark reads in a separate context; recall scheduling and no competence credit; invalid-report rejection and valid report/evidence persistence without credit; failed incident history; validated export/import; unchanged semantic learner state/readiness; and complete marker removal. This tests the local application/SQLite path, not current production Turso behavior.

Final verification: **5/5 browser tests PASS**, **24/24 focused unit/backup tests PASS**, TypeScript check PASS, changed-file ESLint PASS. Direct read-only inspection after local fixture teardown found zero MissionProgress, MissionNote, Bookmark, Evidence, IncidentAttempt, IncidentAssistance and RecallReview rows in the isolated test database. All temporary test data and fixtures were removed. The historical production stack recovery requirement remains unresolved; this does not indicate a failed corrected local smoke.

## Decision and next action

**A. PERSISTENCE ISSUE = SMOKE HARNESS ONLY — for the reproduced failure.** No application code change is indicated by these tests. The overwritten historical production exception remains unknown; an unconditional claim about that exact failure would exceed the evidence.

The harness defects are fixed and locally verified. Production remains intentionally rolled back to v0.2.0, as last verified before this task; it was not queried or modified during diagnosis. Main remains unchanged and no v0.3.0 tag exists.

A later, explicitly authorized production re-verification can use the corrected selectors, separate failure capture, unused-record preconditions, private fresh baseline and semantic restore checks. Before allowing a remote origin, arrange an exclusive test window: full snapshot import must not overwrite concurrent learner edits. Do not run this local diagnosis command against production or redeploy as part of this task. Exact recovery of the historical original exception is still unresolved because it was never recorded.
