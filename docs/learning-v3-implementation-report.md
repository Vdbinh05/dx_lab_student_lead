# 1. Initial Audit

Clean worktree confirmed at `2d479ad` on `refactor/learning-architecture-v3`; main/v0.2.0 at `a3ed4a0`. No branch created or switched.

Already present: Teaching V2 M1–M3, three lab levels, predictions, diagrams, alternate explanations, 23 glossary entries, quizzes/evidence, nine-field incidents, clean Boss Fight rules, skill/readiness engines, SQLite/Turso and transactional backup/import. External assumptions about localStorage-only persistence and missing backup were incorrect. The old curriculum audit's 285 mission questions predates V2; runtime inventory is 300. Real gaps: flat navigation, no scheduler, overall rather than mission progress on Today, incident presentation and bounded verification.

# 2. Learning Architecture V3

Canonical document: [learning-architecture-v3.md](learning-architecture-v3.md). Teaching V2 remains authoritative. Today → recall → understand/observe/experiment → practice → break/debug/explain → verify → evidence → gate → skills → review. Five presentation pillars link into the complete Markdown lessons, retaining every V2 teaching requirement.

# 3. Navigation

Fourteen equally weighted links become Today plus Core execution, Capabilities, Assessment and Utility. Today stays visible; Glossary becomes discoverable; Dashboard, Bookmarks and Weeks routes remain accessible. Active groups open on navigation and links use aria-current. Desktop/mobile breakpoints align at 1024px, fixing tablet overlap.

# 4. Today + Warm-up

Recall comes before the current mission, with a continue anchor. Today gives a concrete next action and current mission's five-step progress, preserves blockers/daily planning, and retains weekly review when missions finish.

Existing quiz prompts become eligible after Learn or historical PASS. At most three due questions per batch; hidden answer/explanation; wrong/hard/correct self-rating. Intervals: 1/3/7 days, repeated correct 14 then 30; wrong/hard reset the correct streak. UTC instants and Bangkok date display. RecallReview stores last/next review, count, streak and rating. Duplicate submissions for no-longer-due items do not advance the schedule. Draft answers are not saved. No quiz, evidence or competency credit.

# 5. Teaching V2 Pilot

M1 retains terminal/shell/command, filesystem/tree/root/home/current directory, path distinctions and file commands. Clarifies command silence and tilde; adds artifact verification/recall handoff. Navigation/file experiments, guided/partial/independent labs and repeated-path failure remain.

M2 retains safe copy/move/delete, owner/group/rwx, chmod, scripts, environment versus .env and hidden versus secure. Three labs, controlled read/run failures and recovery remain. Verifier checks original/script artifacts and mode 700, never secrets.

M3 retains program/process/PID/signals/service, logs and CPU/RAM/disk. Clarifies Ctrl+C delivery and variable response. Experiments and three labs demonstrate start → request → stop → unavailable → recover → regression. Verification uses saved observations, no permanent process or exact PID.

Editorial scores retain V2 limitations rather than awarding extra points for features:

| Criterion (0–3) | M1 | M2 | M3 |
| --- | ---: | ---: | ---: |
| Beginner clarity | 3 | 2 | 2 |
| Why/problem | 3 | 3 | 3 |
| Mental model | 3 | 3 | 3 |
| Technical correctness | 3 | 3 | 3 |
| Prerequisites | 3 | 3 | 3 |
| Visual explanation | 3 | 3 | 3 |
| Mini experiment | 3 | 3 | 3 |
| DX-Lab connection | 3 | 3 | 3 |
| Lab progression | 3 | 3 | 3 |
| Debug teaching | 3 | 3 | 3 |
| Self-explanation | 2 | 3 | 2 |
| Self-containedness | 2 | 2 | 2 |
| **Total** | **34/36** | **34/36** | **33/36** |

All pass ≥32 and hard requirements. M2/M3 breadth/fatigue, setup needs and honest explanation remain learner-review limitations. M1/M2 qualify only as Gold Standard candidates. Google-dependency editorial check finds core terms, why, flags, output interpretation, labs, safe failures, causal recovery and Feynman prompts on-site. This is not measured 90–95% beginner success.

# 6. Incidents

Four fieldsets: SYMPTOM; DIAGNOSTICS (evidence/hypothesis/test/result); ROOT CAUSE; RESOLUTION (fix/verification/regression). Helper text explains evidence before guessing and verification after fixing. History expands all nine recorded fields. Existing schema, limits, assistance and clean-pass rules remain.

# 7. Glossary / Beginner UX

All 23 entries retained; path/signal explanations clarify tilde and Ctrl+C. Existing native reveals, alternative analogies, prediction prompts, ASCII diagrams, scrollable tables and command-copy controls remain. Five visible pillar links and explicit verifier instructions connect learning to evidence. No AI tutor or new design system.

# 8. DX-Verify

Run from the repo in WSL/Ubuntu as the normal learner:

```bash
python3 scripts/dx-verify.py week-01 mission-01
python3 scripts/dx-verify.py week-01 mission-02
python3 scripts/dx-verify.py week-01 mission-03
```

M1: practice/evidence directories, nonempty guided/independent notes. M2: practice/evidence directories, nonempty original and mode-700 script. M3: practice directory and nonempty process/log/incident observations. Exact paths are documented in lessons and architecture.

Schema v1: fixed missionId, ISO generatedAt, four expected unique checks (id/status/evidence) and consistent overall. Server rejects malformed, oversized, duplicate, inconsistent, wrong-mission and unexpected fields. Manual paste records existing test-result evidence labeled local self-report, respecting mission locks. No automatic skill/gate recomputation.

Local-only; no network, sudo, remote execution, secrets or arbitrary commands. Fixed paths opened without following symlinks; metadata only, no content read; FIFOs cannot block. Reports omit machine paths, usernames, PIDs and contents. Exit 0=pass, 1=check failed, 2=usage unsupported. Artifacts/reports can be forged: presence does not prove correctness, authorship, understanding or debugging.

# 9. Persistence

Turso preserved; no Supabase, PostgreSQL or service added. Additive RecallReview migration tested on temporary SQLite and local libSQL; production database unchanged. No personal learner database reset/migration. Existing backup engine accepts optional recallReviews, validates references/uniqueness and restores transactionally; old backups yield an empty schedule. Keep a pre-V3 backup for rollback because old v0.2.0 rejects the new field. Remote migration runner deliberately unchanged; future deployment requires explicit migration review.

# 10. QA

| Check | Result |
| --- | --- |
| Lint | PASS |
| Typecheck | PASS |
| Unit/integration | PASS, 50 tests across 10 files |
| Production build | PASS; no migration/seed during build |
| Repo safety | PASS |
| Curriculum/release | PASS: 57 missions, 300 mission questions, 160 weekly questions, 8 Boss Fights, 50 skills, 24 oral prompts, 20 required routes |
| Browser | PASS, 16 Chromium tests: recall/report import, mission PASS, locks, assisted Boss Fight, weekly gate, backup/restore |
| Desktop/tablet/mobile | Routes at 1440/950/390px; M1–M3 at 1440/390px; no page overflow; reveals, anchors, glossary and command copy space checked |
| Verifier | Ubuntu: all three contracts; missing/empty artifacts, wrong modes, symlinks, FIFO and fail exit codes |
| Lesson commands | Ubuntu harness PASS: files/paths, permissions, env, process/log/resources, HTTP 200/404/unavailable/recovery |
| Persistence | Recall round-trip, old backup, duplicate rejection, SQLite/libSQL adapters |

Screenshots/output stay in ignored artifacts/learning-v3 and artifacts/teaching-v2. Linux fixture path is recorded in artifacts/learning-v3/linux-output.txt; no learner lab overwritten. Harness uses controlled subprocess handles; interactive Ctrl+C and fresh Ubuntu installation were not repeated in V3. Chromium viewports do not cover every phone/browser. Docker architecture/entrypoint inspected; Docker runtime smoke not rerun.

# 11. Git

Branch remains refactor/learning-architecture-v3, based on 2d479ad. Commits: bf80461 (architecture), 0c2df37 (navigation/incidents), 5aac5d7 (recall/verifier/QA), d686072 (pilot content/report). Worktree clean after commits. Push to origin/refactor/learning-architecture-v3 was attempted but blocked by missing GitHub credentials: “could not read Username for https://github.com”; noninteractive retry confirmed no usable login. GitHub CLI is unavailable. User authentication is required, then retry the normal push. No force push, merge, release or tag.

# 12. Production

**NOT DEPLOYED.** main unchanged; v0.2.0 unchanged; production Vercel unchanged; production Turso unchanged. No production environment, query, migration, seed or release commands.

# 13. Remaining Learner Validation

M1–M3 require real learner A/B/C/D feedback, first confusing phrase, any core Google dependency, independent lab completion and fatigue. They are not final Gold Standard until A/B usability and no core Google dependency are confirmed. Do not expand to M4–57 before this review.

# 14. FINAL STATUS

Implementation and local QA are complete. Outstanding task blocker: authenticate Git with GitHub and complete the required branch push. No software/teaching QA blocker identified.

LEARNING ARCHITECTURE V3 READY FOR LEARNER REVIEW: NO
