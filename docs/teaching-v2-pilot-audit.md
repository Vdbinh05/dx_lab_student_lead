# Teaching V2 Pilot

Audit date: 2026-09-08. Standard: [Teaching Specification V2](teaching-specification-v2.md). Status: editorial review for a learner pilot, **not Gold Standard** and not a measured learning-outcome claim.

## Scope

W1-M1 Linux Orientation; W1-M2 Files, Permissions & Environment; W1-M3 Processes, Logs & Resources. Mission IDs, frontmatter, source types, prerequisites, L2 targets, evidence types and 70% quiz thresholds retained. Only these three mission bodies and quiz mappings are rewritten. M4–57 and weekly quizzes remain unchanged.

Supporting changes: 23-entry Week 1 glossary, safe Markdown reveals, numbered chunk links, table/command mobile readability, focused rendering/browser tests, release inventory 285 → 300 mission questions and README inventory correction. No engine, database, adapter or deployment changes. The earlier full-curriculum audit describes the pre-pilot release inventory; this document records the pilot delta.

Recovery: main was clean, at `a3ed4a0cc0f08d5dcb8d539e65c4bfc99eba54af`, matching freshly fetched origin/main. Branch created from that state: `content/teaching-v2-pilot`. Tag refs recorded before work: v0.2.0 `4a42d0c03abf7a7bf0064f6ed074e9849bb557b2`, v0.1.0 `6710735b4f6e2f98535288c6353d721185951121`. Complete roadmap and required authoring/architecture/curriculum/rendering files reviewed before changes. Next.js bundled page/component guides read before UI code.

## Teaching Problem Diagnosis

The original lessons were not empty or wholly ineffective. They already had useful analogies, accurate basic definitions, safe personal lab intentions, guided/independent goals, evidence types, nine-step debug protocol and real gates. These are retained and strengthened.

M1 compressed terminal/shell/tree/path into a few paragraphs, followed by a command bundle. It assumed redirection, mkdir flags and output interpretation, and called a target-only exercise “guided.” M2 introduced an inherited key/value environment without first explaining running programs; script creation and Git ignore proof were required without teaching either. Owner/group/mode lacked a visible worked selection example. M3 listed ps/top/kill/grep/tail/resource commands but did not explain ps columns, pipelines, background jobs or the assumption behind `kill %1`. Its failure did not clearly connect process state to a user-visible service symptom.

The rewrite replaces these particular teaching gaps rather than adding features or relaxing PASS criteria. Generic source badges are qualified by explicit in-body labels so newly written teaching is not attributed to the lecturer.

## Concept Dependency Map

Arrows mean “explain before using”; bridges are small on-site introductions, not new missions.

```text
Windows / WSL / Ubuntu setup
  → terminal → shell → command / argument / option
  → file / directory → filesystem tree → root / home
  → working directory → path → absolute / relative → . / ..
  → mkdir / touch → echo / quotes → redirection > / >> → cat

file + path → copy / move / remove + safe verification
file + identity → owner / group / others → r / w / x
  → select applicable permission class → chmod / numeric mode
program (stored instructions) → script / interpreter → direct execution
  → read vs execute failure → minimum permission fix
program → process (short M2 bridge) → parent / child
  → shell variable → export → child environment
file → hidden name → .env as data → loader needed
file history (short Git bridge) → repository / tracked / commit
  → .gitignore limits → check-ignore → secret revoke/rotate

program + environment → process instance → PID / USER / COMMAND
  → ps snapshot / foreground → signal / TERM / verification
process → service → client/server / HTTP / loopback / port bridge
  → running vs healthy vs functional → curl response vs no connection
service event → log / timestamp → stdout / stderr / redirection
  → grep (content) + tail (position) → pipe → incident evidence
process resources → CPU / RAM / disk → top / free / df
  → baseline → symptom / evidence / hypothesis → regression
```

The M2 process bridge precedes environment inheritance. The full PID lifecycle stays in M3. Git vocabulary and local `git init` precede the preserved ignore proof; no GitHub account, commit or push is required. M3 explains only enough networking to observe a local server; M4/M5 remain untouched. No circular requirement sends a beginner to a later mission to complete the pilot.

## Rubric method

Scores are the author's editorial assessment against 12 criteria, supported by the locations below, not automated learner grades. Scale 0 absent / 1 weak / 2 usable with limitation / 3 explicit and supported. Pass ≥32/36 plus technical correctness=3, clarity≥2, self-containedness≥2. A candidate score ≥34 is still only READY FOR LEARNER REVIEW.

## Mission 1 Audit

| Criterion | Before | Pilot | Evidence / limitation |
| --- | ---: | ---: | --- |
| Beginner clarity | 2 | 3 | §2 separates window, interpreter and instruction; §5 explains each file operation |
| Why/problem | 1 | 3 | Need to distinguish same-named files and organize many files |
| Mental model | 2 | 3 | Tree, location marker, address/directions and analogy limits |
| Technical correctness | 3 | 3 | cd failure retains location, tilde expansion, overwrite/append; Linux verified |
| Prerequisites | 1 | 3 | §1 explicitly no Linux prerequisite; Ubuntu setup and platform labels |
| Visual explanation | 1 | 3 | Readable tree and terminal flow, reading directions |
| Mini experiments | 1 | 3 | echo/pwd, navigation, mkdir/path, empty/overwrite/append observations |
| DX-Lab connection | 2 | 3 | §6 repo/project root vs Linux root and WSL paths |
| Lab progression | 1 | 3 | §7 detailed guided → goal/hints → new independent target |
| Debug teaching | 2 | 3 | §8 reproduces wrong starting directory with filled causal protocol |
| Self-explanation | 1 | 2 | Concept prompts/reveals/Feynman present; depth of honest explanation still human assessed |
| Self-containedness | 1 | 2 | All required lab concepts inline; first-time machine setup may need local admin |
| **Total** | **18** | **34/36** | **PASS; READY FOR LEARNER REVIEW** |

Hard rules: technical=3, clarity=3, self-containedness=2: pass. Core concepts: terminal/shell/command, tree/root/home/current location, paths, file writing/reading. Meaningful failure: repeated `docs` component after changing directory. Preserved useful independent README traversal and evidence/gate intent.

## Mission 2 Audit

| Criterion | Before | Pilot | Evidence / limitation |
| --- | ---: | ---: | --- |
| Beginner clarity | 1 | 2 | Smaller steps and definitions; breadth of file+permission+env still demands pauses |
| Why/problem | 1 | 3 | Preserve originals, separate who/action, configure without code edits |
| Mental model | 2 | 3 | Copy/rename, permission matrix, configuration handoff with limitations |
| Technical correctness | 2 | 3 | Permission class selection, directory caveat, script mode, export/ignore behavior verified |
| Prerequisites | 1 | 3 | §1 links M1; program/process, Git and installation bridges |
| Visual explanation | 1 | 3 | rwx grouping and env/file handoff diagrams with reading instructions |
| Mini experiments | 1 | 3 | Copy/move/delete, chmod/stat, read vs run, unset/export, ignore proof |
| DX-Lab connection | 2 | 3 | §7 scripts, config examples, backups, secret access |
| Lab progression | 1 | 3 | §8 three levels with explicit outputs and hidden hint |
| Debug teaching | 2 | 3 | §9 read-denied reproduction, 200→600, nine-step reasoning and regression |
| Self-explanation | 1 | 3 | Repeated contrasts/reveals and bounded Feynman explanation |
| Self-containedness | 1 | 2 | Core explanations supplied; fresh-machine apt/admin dependency remains operational |
| **Total** | **16** | **34/36** | **PASS; READY FOR LEARNER REVIEW** |

Hard rules: technical=3, clarity=2, self-containedness=2: pass. Prior correctness score reflects missing conditions for read denial under root/Windows mounts and hidden/secret simplification, not a claim that every prior command was wrong. Script can be read without execute; direct invocation failure is separately reproduced; Bash interpreter caveat is explicit.

## Mission 3 Audit

| Criterion | Before | Pilot | Evidence / limitation |
| --- | ---: | ---: | --- |
| Beginner clarity | 1 | 2 | Two-tab instructions are explicit but require learner testing for fatigue |
| Why/problem | 1 | 3 | Need distinguish running instances, serve requests, preserve event history, localize resource pressure |
| Mental model | 2 | 3 | Recipe/instance, service availability, journal, workbench/store; limits stated |
| Technical correctness | 2 | 3 | PID checked before TERM, loopback only, status vs reachability, ps/free/df nuances verified |
| Prerequisites | 1 | 3 | §1 M1/M2 links and tool setup; HTTP/client/port bridge before curl |
| Visual explanation | 1 | 3 | Program lifecycle, request/response flow and resource comparison |
| Mini experiments | 1 | 3 | Foreground sleep, ps, server 200/404, log filtering, resource snapshots |
| DX-Lab connection | 2 | 3 | §6 backend health, container PID caveat, systemd awareness without configuration |
| Lab progression | 1 | 3 | §7 observation → filter task → independent lifecycle |
| Debug teaching | 2 | 3 | §8 controlled TERM → unavailable → same-config recovery → regression |
| Self-explanation | 1 | 2 | Concept prompts/key points/Feynman; process/service breadth still needs human oral review |
| Self-containedness | 1 | 2 | Core bridge explanations included; two tabs and tools remain practical setup friction |
| **Total** | **16** | **33/36** | **PASS; READY FOR LEARNER REVIEW** |

Hard rules: technical=3, clarity=2, self-containedness=2: pass. Removed ambiguous job-number targeting (`kill %1`) in favor of actual PID/user/args verification. TERM may be ignored, PID reused, and shutdown need not produce a log line. Real HTTP response, not existence alone, verifies recovery.

## Google Dependency Review

Previously assumed concepts and their on-site replacements:

| Previously assumed knowledge | Now taught / proof |
| --- | --- |
| Windows terminal vs Linux command environment | M1 §1 WSL/Ubuntu setup; all missions label Ubuntu and home practice paths |
| Terminal/shell/Bash/command/option/argument | M1 §2 problem and tiny echo/pwd experiment; glossary links |
| Tree, directory, root/home/current location | M1 §3 diagram, cd/pwd prediction and alternate explanation |
| Absolute/relative, dot/parent, tilde, case sensitivity | M1 §4 worked traversal, alternate point of departure, controlled path failure |
| mkdir -p, touch, empty file, quotes, redirection | M1 §4–5 per-command table; > vs >> demonstrated |
| ls long output, hidden names | M1 §5 stable name/type fields; M2 §3 full mode and §5 ls vs ls -la |
| Copy/move/delete and overwrite safety | M2 §2 source/destination, -i prompts, original/copy comparison and scoped deletion |
| User/root, owner/group/others, permission selection | M2 §1/§3 id→owner→permission class, root/mount caveats, mode diagram |
| Numeric and symbolic chmod, directory permissions | M2 §3–4 4/2/1 arithmetic, u+x, directory traversal/deletion caveat |
| Script/interpreter/direct execution | M2 §4 creates actual script, explains shebang and ./, read vs run, CRLF caveat |
| Program/process/child for environment inheritance | M2 §5 explicit bridge and export experiment; M3 §2 full lifecycle |
| Shell assignment/export/printenv/unset and .env loader | M2 §5 from-file vs practice/demo experiment with stable observed differences |
| Git repository, tracked/commit, ignore and secret handling | M2 §6 mini local repo, check-ignore/status output, ignore limits and revoke/rotate |
| Foreground waiting/Ctrl+C | M3 §2 sleep in A, ps in B, signal explanation and finish verification |
| PID/user/command and ps CPU/memory columns | M3 §2 output interpretation; §8 immediate PID/args check before TERM |
| Client/server, HTTP, loopback, port, bind/listen | M3 §3 minimal bridge, two-tab request diagram and local server |
| Running/healthy/functional, 200/404/connection failure | M3 §3 and §8 same server yields distinct results, recovery verified through curl |
| Log/timestamp, stdout/stderr, buffering, append | M3 §4 Python -u, > and 2>&1; §8 preserves history using >> |
| Grep/tail/pipe/pattern and no-match meaning | M3 §4 contrasting two-line log plus filter-then-tail experiment |
| CPU/RAM/disk/cache/available/swap/mounted filesystem | M3 §5 comparison, top exit, free/df output interpretation and baseline caveats |
| TERM/KILL, signal vs deleting program | M3 §8 request/verification distinction and surviving index.html |
| Systemd/container context | M3 §6 definitions and limitations; no systemd enabling task required |
| Evidence/hypothesis/verification/regression | Filled causal nine-step table in every mission with reasons for ordering |

Editorial checklist for each mission: required terms explained **yes**; why explained **yes**; guided lab doable from on-site steps **yes**; output interpreted **yes**; independent target uses previously taught operations **yes**; failure reproducible **yes**; reasoning and explain prompts present **yes**. These are editorial findings and command checks, **not** measured “95% of beginners succeed.” Final learner testing may still find a missed explanation.

## Quiz Audit

Each pilot has ten questions: q1–q2 definition (20%), q3–q5 conceptual (30%, q5 self-explanation), q6–q8 application (30%), q9–q10 troubleshooting (20%). q2 is a tightly scoped short answer to avoid synonym grading traps. Multiple-choice answer positions vary. Explanations include reasoning. Only first three mappings change; remaining four Week 1 quizzes and all weekly quizzes are unchanged.

Total mission questions: 300 (54 unchanged × 5 + 3 pilot × 10). Release inventory assertion updated to this exact count, not relaxed. Existing stored quiz attempts are not deleted or regraded: a prior PASS remains prior learner state; use fresh local review data or honest reattempts for the pilot. No claim that old attempt answers match newly written questions. The engine's short-answer/self-explanation limitations remain.

## Technical Review

Executed 2026-09-08 using existing WSL Ubuntu, normal user (uid 1001), GNU/Linux home filesystem, Python 3.14.4. Unique disposable QA directory: `/home/vdbinh/dx-lab-teaching-v2-qa.ruxTq5`; retained for inspection. No existing learner lab was overwritten. Harness is in ignored `artifacts/teaching-v2/linux-check.sh`; output in `artifacts/teaching-v2/linux-output.txt`. Harness replaces manual foreground coordination with controlled subprocess handles for repeatability; it does not introduce new required learner syntax.

Checked pwd, ls/ls -la, cd/parent/previous, mkdir -p, touch, echo, cat, > / >>, cp -i, mv -i, rm -i (single generated file), chmod numeric/u+x/u-r/u+r, id, GNU stat fields, printenv/export/unset, git init/check-ignore/status, sleep, ps aux and selected columns, TERM/absence, grep/tail/pipe, free -h, df -h ., Python module server with loopback/log redirection, curl 200/404/unavailable/recovery. Top batch snapshot executed; actual interactive top opened and exited with q. No RAM/disk exhaustion or privileged lab mutation.

Observed: denied direct script at 600 then greeting at 700; denied read at 200 then readable at 600; file .env did not populate child environment, export did; .env ignored while template remained untracked; Python serving 200 and 404, absent after TERM with curl (7), successful after restart, stored file preserved. Values are recorded as actual local evidence, never promised as universal output.

Platform assumptions: Bash/GNU tools in Ubuntu; filesystem permission labs in Linux home and non-root user. WSL networking tests use the same distribution for both tabs. Loopback-only port 8765, alternate port requires consistent substitution. Systemd service control and Docker runtime are awareness only here. Windows/Ubuntu installation paths are documented but installing a fresh WSL distribution or packages was not repeated on this already prepared machine. No installation success on arbitrary school-managed Windows is claimed.

Primary technical references checked: [Python http.server](https://docs.python.org/3/library/http.server.html) for local server options/log behavior and [Git ignore](https://git-scm.com/docs/gitignore) for tracked-file limitations. Bash/coreutils web pages timed out; local Ubuntu command behavior was tested instead. These references support author review, not missing learner explanations.

## Automated QA and Browser Review

Final automated results, 2026-09-08:

| Check | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run test` | PASS, 45 tests across 9 files |
| `npm run build` | PASS, Next.js production build includes `/glossary` |
| `npm run check:repo-safety` | PASS |
| `npm run check:release` | PASS, 57 missions, 300 mission questions, 160 weekly questions, 20 required routes |
| `npm run test:e2e` | PASS, final run 12/12 after mobile correction |
| Linux command verification | PASS; intentional failures observed and recovered |
| Scope/link/frontmatter audit | PASS; 23 glossary IDs/references valid, M4–57 and pilot frontmatter unchanged |
| `git diff --check` | PASS |

Browser state uses only `artifacts/e2e/training.db`, with remote database environment variables disabled. Production learner state is not involved. In addition to the command harness, an actual foreground Python server was queried from a second command session, stopped with Ctrl+C, and confirmed unavailable afterward. Interactive top was exited with q.

Initial browser run: 12/12 passed in Chromium, including all three pilot pages at 1440×900 and 390×900, closed/open and keyboard reveal behavior, key-point reveal, chunk anchors, glossary anchor and related links, browser return, no page horizontal overflow, plus the existing mission evidence/quiz/hard-gate PASS, future-week lock, assisted Boss Fight, weekly gate, backup/import and readiness flows. Screenshots in ignored `artifacts/teaching-v2/` were visually inspected for all six page/viewport combinations.

Visual correction: mobile copy control overlapped the beginning of long command lines. Added reserved space above command text and made the M1 communication diagram vertical for mobile. Final browser run verifies the correction. Code/diagrams may scroll locally; the page does not overflow horizontally. Tables wrap/scroll within the article, and reveal controls retain native keyboard operation.

Legacy test adjustment: the old test required exactly 16 numbered headings for every Week 1 lesson. V2 explicitly allows combined sections. V1 missions keep their 16-heading test; pilot checks now verify actual prerequisite/lab/reveal/evidence/gate/Feynman sections. Runtime parser/validation and core engines remain untouched. Preserved the existing top batch awareness coverage with an explained one-snapshot alternative.

## Remaining Risks

- Only learner testing can decide whether the extra explanation is clear enough or tiring. M2/M3 contain more prerequisite bridges; the visible chunks and optional reveals need pacing feedback.
- Setup on a Windows machine without Ubuntu/tools can require local administrator help. This is operational preparation, not a reason to outsource core Linux concepts to Google.
- Different WSL mounts, users, shells, process namespaces and ports can produce different behavior; the lab explicitly scopes the supported environment.
- Historical quiz PASS state remains valid under the unchanged engine; author/browser tests do not assess a real learner's understanding. Evidence is still self-reported.
- Local diagrams/long commands scroll on mobile to preserve command correctness. Browser review covers Chromium desktop/mobile viewports, not every physical phone or browser.

## Learner Review Status

**READY FOR LEARNER REVIEW** after final QA; no Gold Standard claim. No learner A/B/C/D response has yet been collected.

| Mission | Learner choice | First confusing phrase/core Google need | Lab reached / time / fatigue |
| --- | --- | --- | --- |
| W1-M1 | Pending | Pending | Pending |
| W1-M2 | Pending | Pending | Pending |
| W1-M3 | Pending | Pending | Pending |

Ask the learner to choose A very easy, B understandable but slightly tiring, C needed Google for core concepts, or D did not understand. Record concrete missing concepts before any expansion. Only A/B without core Google dependency can later be considered Gold Standard. Stop here; do not scale to Mission 4 or later weeks.
