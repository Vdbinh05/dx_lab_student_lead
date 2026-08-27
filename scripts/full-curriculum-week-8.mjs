const official = "THEO_KE_HOACH_CO";

const base = {
  estimatedMinutes: 210,
  quizPassScore: 80,
  objectives: [
    "Giải thích concept bằng analogy và technical language",
    "Tự chạy lab và phân biệt expected/actual",
    "Debug failure bằng evidence protocol",
  ],
  cleanup:
    "khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data",
  regression:
    "rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix",
};

function mission(value) {
  return { ...base, ...value };
}

export const finalWeek = [
  {
    week: 8,
    previousMissionId: "w7-m7-agent-e2e-security-closure",
    missions: [
      mission({
        id: "w8-m1-regression-quality-gates",
        slug: "regression-quality-gates",
        title: "Regression Strategy & Quality Gates",
        category: "Release QA",
        skillId: "ci",
        targetLevel: "L3",
        sourceType: official,
        competency:
          "Reset/seed→static→unit→API→workflow→E2E regression order, CI blocking checks and evidence-led failure ownership",
        keywords: [
          "regression",
          "lint",
          "typecheck",
          "unit",
          "api",
          "workflow",
          "e2e",
          "ci",
        ],
        analogy:
          "Regression is a pre-flight checklist: check aircraft parts, instruments, engines, then fly a short route. Do not start a passenger demo before discovering a missing bolt that static checks would have found.",
        easy:
          "Run small/fast deterministic checks first, then dependencies and browser E2E. Regression is a measured chain: reset/seed only safe test state, lint/typecheck, unit, API, workflow, E2E. A failed check is evidence with an owner, not a reason to bypass merge.",
        technical:
          "Regression testing re-executes validated checks after change to detect unintended behavior. Layered test ordering reduces diagnosis cost and aligns failure ownership: static/source, unit, API contract, workflow integration and user-facing E2E verify progressively wider surfaces.",
        why:
          "SV1 protects pipeline/Compose/release quality gates and coordinates owners. The roadmap does not require a large CI platform, only a clear blocking baseline with reproducible evidence.",
        subtopics: [
          "test pyramid/order",
          "safe reset/seed",
          "lint/typecheck/unit",
          "API contract tests",
          "workflow tests",
          "browser E2E",
          "CI blocking policy",
          "failure owner/evidence",
        ],
        command:
          "npm run lint\nnpm run typecheck\nnpm test\nnpm run build\ndocker compose config",
        where:
          "Repository root for application checks; Compose root for docker compose config. Use a disposable test database/state for any reset/seed test and never reset learner progress automatically.",
        commandWhy:
          "Run defined local blocking baseline in the same sequence before wider deployment/browser checks.",
        expected:
          "Every check produces pass/fail output; failures identify exact layer and owner. Build/Compose config are not skipped because unit tests pass.",
        commandFailure:
          "Run unsafe reset on learner state, hide failed check, merge red pipeline, test only one layer, call build a functional test, or omit secret/repository safety check.",
        guided:
          "Write a release regression table: command, environment, expected output, failure owner, evidence artifact and re-run criteria. Execute static/unit/build/Compose checks and record timing/result.",
        independent:
          "Given Backend port change, choose regression sequence and explain which check catches Compose/proxy/Portal/n8n/docs breakage. Do not make a code change as part of the planning exercise.",
        integration:
          "Run a controlled API/workflow smoke after static checks. Send business-rule failure to SV2 and Portal UI failure to SV3 only with prior infra/config evidence.",
        failure:
          "Introduce a harmless test fixture or deliberate invalid Compose copy. Observe which early check fails, capture output, revert test artifact and prove later checks were not falsely used as a fix.",
        errors: [
          "Start with E2E only",
          "Reset learner database",
          "Merge red check",
          "Treat lint as security scan",
          "Forget Compose config",
        ],
        selfChecks: [
          "Why test order?",
          "Which check blocks merge?",
          "Who owns Compose failure?",
          "Why not reset learner state?",
        ],
        evidence: [
          "test-result: regression matrix with timing/owner",
          "terminal-output: static/test/build/Compose results",
          "explanation: layered quality-gate rationale",
        ],
        requiredEvidence: ["test-result", "terminal-output", "explanation"],
        quizConcept:
          "Regression runs deterministic low-level checks before API/workflow/E2E, and every blocking failure retains an owner and evidence.",
        firstTest:
          "Run the narrowest relevant static/config test before altering runtime or launching browser flows.",
        shortPrompt:
          "Which command validates a resolved Docker Compose model without starting it?",
        shortAnswer: "docker compose config",
        shortExplanation:
          "docker compose config parses and renders the resolved Compose model without running services.",
        explainPrompt:
          "Explain reset/seed→static→unit→API→workflow→E2E and assign common failure ownership to SV1/SV2/SV3.",
        passExplanation:
          "layered regression, gate ownership and learner-data safety",
        returnBlock: "regression order, failure ownership or safe test-state boundary",
      }),
      mission({
        id: "w8-m2-configuration-freeze-change-impact",
        slug: "configuration-freeze-change-impact",
        title: "Configuration Freeze & Change Impact Analysis",
        category: "Release Configuration",
        skillId: "change-management",
        targetLevel: "L4",
        sourceType: official,
        competency:
          "Service inventory/image/version/port/hostname/network/volume/health/env/auth/public boundary freeze and Change→impact→PR→regression→docs",
        keywords: [
          "configuration freeze",
          "change impact",
          "service inventory",
          "port",
          "hostname",
          "health",
          "environment",
          "auth",
        ],
        analogy:
          "Configuration freeze is labeling every cable in a demo rack before travel. You may still replace a cable, but first trace what it powers, record the change, test the circuit and update the label.",
        easy:
          "Freeze does not mean never change. It means every release-critical service contract is known and any later change gets an issue/impact analysis/PR/regression/docs. No unknown host/port/health/env/auth/owner hides behind a comment. Unresolved P0 item blocks release.",
        technical:
          "Configuration management establishes versioned, auditable runtime contracts. Change impact analysis identifies direct service changes, upstream callers, downstream dependencies, environment/auth/test/documentation/release consequences before modification, enabling controlled regression and rollback planning.",
        why:
          "SV1 owns configuration freeze. The same map supports fresh-machine, release, incident triage and team handoff without adding infrastructure beyond roadmap scope.",
        subtopics: [
          "service inventory",
          "image/version",
          "internal/public host and port",
          "network/volume",
          "health/dependencies",
          "environment/auth contract",
          "source of truth",
          "impact/PR/regression/docs rule",
        ],
        command:
          "docker compose config\ndocker compose ps\ngit status --short\nrg -n \"TBD\" README.md docs .env.example docker-compose.yml\ncurl -fsS http://localhost:3000/api/health",
        where:
          "Repository/Compose root. Search only release-relevant configuration/docs; do not scan or print untracked .env secrets. The displayed health endpoint is this training product's deployment check.",
        commandWhy:
          "Compare resolved runtime contract with versioned docs/config and make unresolved release facts explicit before freezing.",
        expected:
          "Inventory answers owner/image/version/hostname/ports/network/volume/health/env/auth/dependencies/public boundary for every released service. Any remaining TBD names owner/deadline/source and is classified.",
        commandFailure:
          "Use latest image, port appears only in code, docs diverge Compose, unknown health endpoint, secret value in inventory, configuration change merged without impact/regression or P0 TBD hidden.",
        guided:
          "Build a Configuration Freeze record from Compose/.env.example/docs. For each service prove one field from source. Run Backend port-change impact analysis across application/Compose/health/proxy/Portal/n8n/Agent/tests/docs.",
        independent:
          "Analyze adding an Accountant role or changing OLLAMA_MODEL. List direct/upstream/downstream/env/auth/tests/docs/release impact and ownership; do not implement the change.",
        integration:
          "Review contract rows with SV2 and SV3 owners and identify source-of-truth files. After one controlled config drift test, verify caller and document regression rather than relying on service restart.",
        failure:
          "In a disposable config copy, change one service host or health port. Detect mismatch using inventory/config/ps/logs, restore exact contract and record every downstream check.",
        errors: [
          "Freeze guessed values",
          "Use latest image",
          "List secret values",
          "Leave P0 TBD hidden",
          "Change config without docs",
        ],
        selfChecks: [
          "What freezes?",
          "What begins every post-freeze change?",
          "What makes TBD P0?",
          "Why no secret in inventory?",
        ],
        evidence: [
          "config: configuration-freeze inventory/TBD register",
          "test-result: one completed impact-analysis regression",
          "explanation: controlled-change and release-blocker rule",
        ],
        requiredEvidence: ["config", "test-result", "explanation"],
        quizConcept:
          "Configuration freeze converts runtime assumptions into versioned contracts; later changes require impact analysis, regression and docs updates.",
        firstTest:
          "Compare the proposed change against service inventory, resolved Compose and every listed caller/dependency before editing.",
        shortPrompt:
          "After configuration freeze, which artifact must precede a port/role/model change?",
        shortAnswer: "impact analysis",
        shortExplanation:
          "Impact analysis identifies affected services, callers, tests and documentation before a release configuration change.",
        explainPrompt:
          "Explain service inventory fields and run a Backend-port or OLLAMA_MODEL impact analysis from change through regression/docs.",
        passExplanation:
          "frozen runtime contract and explicit change-control evidence",
        returnBlock: "service inventory, P0 TBD classification or impact analysis",
      }),
      mission({
        id: "w8-m3-fresh-machine-installation",
        slug: "fresh-machine-installation",
        title: "Fresh-machine Installation & Reproducible Bootstrap",
        category: "Fresh-machine",
        skillId: "fresh-machine",
        targetLevel: "L4",
        sourceType: official,
        competency:
          "Clean machine→clone→env→Compose→imports/migration/seed→AI bootstrap→smoke flow without source/path edits",
        keywords: [
          "fresh machine",
          "clone",
          "environment",
          "compose",
          "migration",
          "seed",
          "bootstrap",
          "smoke",
        ],
        analogy:
          "Fresh-machine is asking another person to assemble a kit using only the printed instructions. If it needs the original maker's private path, hidden file or oral clue, the kit is not reproducible.",
        easy:
          "Start from a clean machine/user profile, clone release, copy safe .env.example, set documented values, run migrations/seeds/imports/bootstrap in order, then smoke/E2E. Do not edit source or hard-code personal path to pass. First model pull time may be excluded but must be recorded.",
        technical:
          "Reproducibility verifies that versioned source, configuration contracts and documented bootstrap commands create a functional runtime from an independent environment. It exposes hidden state, environment drift, unpinned dependencies and undocumented imports through objective readiness timing and smoke results.",
        why:
          "Fresh-machine is a final hard gate for SV1 deployment/release competency. It validates real documentation, configuration freeze, migration/seed and service integration simultaneously.",
        subtopics: [
          "clean environment definition",
          "clone/release version",
          ".env.example and secret handling",
          "Compose build/start",
          "migration/seed/import",
          "AI bootstrap/model pull",
          "health/smoke",
          "timing/no source edit",
        ],
        command:
          "git clone <release-repository-url>\nCopy-Item -LiteralPath .env.example -Destination .env\ndocker compose config\ndocker compose up -d --build\ndocker compose ps\nInvoke-RestMethod http://localhost:3000/api/health",
        where:
          "A clean separate machine or disposable clean user environment. Replace repository URL only with the actual release source; do not put real secret values in docs/screenshots.",
        commandWhy:
          "Follow the documented bootstrap path from clone to resolved configuration, stack startup and health without local source modification.",
        expected:
          "A clean environment reaches documented ready state within target time excluding first model pull, produces service health/smoke evidence and requires no hidden paths/manual source edits.",
        commandFailure:
          "Missing prerequisite/version, undocumented .env variable, personal absolute path, missing realm/workflow/corpus import, wrong volume permission, unpinned image or stale docs.",
        guided:
          "Make a fresh-machine checklist with start timestamp, OS/tool versions, exact commands, expected outputs, first-model-pull note, failures, fixes and finish time. Execute it in a disposable clean environment.",
        independent:
          "Ask a peer or emulate a second clean account to follow only release docs. Record every ambiguity as documentation/config defect; do not quietly fix source path on the target.",
        integration:
          "Verify Portal, Keycloak, Backend, Postgres, n8n and required AI services in source-of-truth startup order. Split identity/workflow/AI bootstrap evidence to corresponding owners for review.",
        failure:
          "Use a deliberately missing required safe environment variable in a clean lab copy. Capture validation error, repair .env.example/docs contract, restart and rerun smoke from beginning.",
        errors: [
          "Use developer machine state",
          "Edit source on target",
          "Copy private .env",
          "Ignore first model/bootstrap note",
          "Call containers up a fresh-machine pass",
        ],
        selfChecks: [
          "What proves clean environment?",
          "What cannot be manually changed?",
          "Why record timing?",
          "Which imports/bootstrap must docs name?",
        ],
        evidence: [
          "test-result: fresh-machine checklist/timing/smoke report",
          "terminal-output: clone/config/ps/health sequence",
          "explanation: reproducibility defects found and corrected",
        ],
        requiredEvidence: ["test-result", "terminal-output", "explanation"],
        quizConcept:
          "Fresh-machine readiness proves documented source/config/bootstrap can create the runtime on an independent environment without hidden state or source edits.",
        firstTest:
          "Follow .env.example and Compose config exactly from a clean clone, recording the first missing/ambiguous prerequisite rather than improvising.",
        shortPrompt:
          "What kind of path must not be required for a fresh-machine setup?",
        shortAnswer: "personal absolute path",
        shortExplanation:
          "A setup depending on an individual's absolute path is not portable or reproducible.",
        explainPrompt:
          "Explain clean-machine clone→env→Compose→migration/seed/import→AI bootstrap→smoke and the evidence proving no hidden state.",
        passExplanation:
          "independent reproducible bootstrap and documentation correctness",
        returnBlock:
          "fresh-machine checklist, env/docs contract or hidden-state defect",
      }),
      mission({
        id: "w8-m4-release-package-integrity-rollback",
        slug: "release-package-integrity-rollback",
        title: "Release Package, Integrity & Rollback",
        category: "Release Engineering",
        skillId: "release-management",
        targetLevel: "L4",
        sourceType: official,
        competency:
          "Release tag, CHANGELOG, notes, checksums, versioned exports, known issues, acceptance evidence and tested rollback decision",
        keywords: [
          "release",
          "tag",
          "changelog",
          "release notes",
          "checksum",
          "export",
          "rollback",
          "acceptance",
        ],
        analogy:
          "A release package is a sealed delivery crate: version label says what it is, inventory says what is inside, checksum detects tampering, and the return route is known before the truck leaves.",
        easy:
          "A green build alone is not a release. Package the exact version with v0.9 tag, CHANGELOG, release notes, checksum and required safe exports. Name known issues and rollback threshold. Do not tag a moving working tree or invent a passing acceptance score.",
        technical:
          "Release engineering creates an immutable, traceable deployment candidate. Version tags connect source to artifacts; checksums establish artifact integrity; release notes and exports capture operational state; an explicit rollback plan bounds impact when quality/security gates fail.",
        why:
          "SV1 coordinates release integrity and rollback without taking ownership of SV2 business behavior or SV3 Portal/AI implementation. The release package makes deployment, audit and handoff reproducible.",
        subtopics: [
          "immutable tag/version",
          "CHANGELOG and release notes",
          "artifact checksum",
          "realm/workflow/dashboard exports",
          "known issues and acceptance score",
          "zero-Critical requirement",
          "rollback trigger and target",
          "release approval evidence",
        ],
        command:
          "git status --short\nnpm run typecheck\nnpm test\nnpm run build\ngit tag --list \"v0.9\"\nGet-FileHash -Algorithm SHA256 <release-artifact>",
        where:
          "Repository root after regression passes. Calculate checksums only for the final release artifact and keep exports in the approved release package, never include real secrets or mutable production data.",
        commandWhy:
          "Confirm a clean, validated source revision and calculate a verifiable SHA-256 checksum for the artifact that reviewers actually download or deploy.",
        expected:
          "The package ties one immutable v0.9 source tag to release notes, CHANGELOG, checksum, safe exports, known issues, acceptance evidence and a tested rollback target. Critical defects or missing evidence stop release.",
        commandFailure:
          "Tag dirty/unreviewed source, checksum a different artifact, export credentials, omit known issue, treat a manual restart as rollback, release with Critical defect or confuse a Git tag with deployment verification.",
        guided:
          "Create a release dry-run checklist: commit/tag candidate, command results, artifact name/hash, exports manifest, known issues, acceptance score, approver and rollback trigger. Run it against a safe local candidate without publishing anything externally.",
        independent:
          "Given a failed post-release smoke caused by configuration drift, decide whether rollback or hotfix is safer. State evidence, blast radius, exact target revision, owner communications and required regression before re-release.",
        integration:
          "Collect SV2 API/OpenAPI and workflow export evidence plus SV3 Portal/AI/demo export evidence. Verify their manifest/version is referenced, but escalate functional defects to the appropriate owner rather than patching their module silently.",
        failure:
          "Use a disposable artifact copy with a changed byte or missing manifest entry. Detect the mismatch from checksum/inventory, stop promotion, restore the known-good candidate and rerun the relevant regression.",
        errors: [
          "Tag a dirty tree",
          "Checksum the wrong file",
          "Ship real secrets in export",
          "Hide a Critical defect",
          "Use untested rollback",
        ],
        selfChecks: [
          "What binds source to release?",
          "What does a checksum prove?",
          "Which exports belong in the package?",
          "When must release stop?",
        ],
        evidence: [
          "config: release manifest/tag/checksum/exports list",
          "test-result: release dry-run and rollback decision report",
          "explanation: immutable release and zero-Critical rule",
        ],
        requiredEvidence: ["config", "test-result", "explanation"],
        quizConcept:
          "A release is an immutable validated package with traceable source, integrity evidence, documented exports and an explicit rollback decision—not merely a green build.",
        firstTest:
          "Verify the exact candidate revision, package manifest and checksum before promotion; stop if any item does not match.",
        shortPrompt:
          "Which artifact-integrity value should accompany a release file?",
        shortAnswer: "SHA-256 checksum",
        shortExplanation:
          "A SHA-256 checksum lets a recipient verify that the artifact matches the released file.",
        explainPrompt:
          "Explain how tag, CHANGELOG, notes, checksum, exports, acceptance and rollback combine into a safe v0.9 release decision.",
        passExplanation:
          "release traceability, artifact integrity and rollback threshold",
        returnBlock:
          "release manifest, Critical defect classification or rollback evidence",
      }),
      mission({
        id: "w8-m5-documentation-handoff-peer-verification",
        slug: "documentation-handoff-peer-verification",
        title: "Documentation Governance, Handoff & Peer Verification",
        category: "Documentation & Handoff",
        skillId: "documentation",
        targetLevel: "L4",
        sourceType: official,
        competency:
          "Versioned architecture/installation/operations/identity/integration/backup/security/demo docs, tested commands and evidence-rich SV2/SV3 handoff",
        keywords: [
          "documentation",
          "peer review",
          "handoff",
          "architecture",
          "operation",
          "backup",
          "security",
          "demo",
        ],
        analogy:
          "Documentation is the cockpit checklist passed to the next crew. A checklist is useful only if another crew can fly it, report a missing step and trace who owns the next decision.",
        easy:
          "Docs must make a non-author able to install, operate, restore, troubleshoot and demo the release. A handoff is not 'please fix it': it carries symptom, evidence, reproduction, likely layer, owner, expected and actual. Update docs/config/tests together.",
        technical:
          "Operational documentation is a versioned system contract. Peer verification tests whether instructions reproduce their claimed outcome independently. Structured handoff preserves observability and ownership boundaries, reducing duplicated diagnosis and undocumented knowledge.",
        why:
          "SV1 is accountable for the operating system around the product: architecture, deployment, identity, incident, backup, release and coordination documentation. This does not authorize SV1 to absorb business or AI feature ownership.",
        subtopics: [
          "architecture and service inventory",
          "installation and environment contract",
          "operations/health/log runbook",
          "identity/integration contracts",
          "backup/restore and security guidance",
          "demo script and known issues",
          "peer-tested commands",
          "handoff evidence template",
        ],
        command:
          "rg -n \"TODO|TBD\" README.md docs .env.example\nnpm run typecheck\nnpm test\nGet-Content docs\\deployment.md\nGet-Content docs\\implementation-plan.md",
        where:
          "Repository root and versioned documentation folders. Search publication-safe sources only; never copy a real .env, access token or personal endpoint into review evidence.",
        commandWhy:
          "Surface unresolved documentation obligations, then verify commands and ownership statements against the same release candidate.",
        expected:
          "A peer can follow docs to run safe setup/health/backup restore/demo checks. Every handoff names evidence and owner. Remaining TBDs have owner/deadline/source of truth and P0 items block release.",
        commandFailure:
          "Docs say 'ask author', commands untested, API contract only verbal, stale port/model, screenshots containing secrets, generic owner-less handoff or a TODO silently shipped.",
        guided:
          "Create a docs review matrix for README, architecture, deployment, operation, backup, security, content authoring and demo. Ask a reviewer to execute a small command path and record expected/actual plus exact correction.",
        independent:
          "Prepare a handoff for a Portal dashboard showing stale data. Include symptom, correlation/time, health/log/network/auth checks already run, reproduction, likely owner, expected/actual and the regression required after their fix.",
        integration:
          "Cross-check source-of-truth links with SV2 and SV3. Request their module-specific docs/exports through a structured handoff, then update the system map without rewriting their business/AI logic.",
        failure:
          "Temporarily test a stale command in a disposable documentation branch or identify an intentionally outdated internal link. Capture failure, correct one source-of-truth document, have a second reader re-run it and retain both results.",
        errors: [
          "Write docs after release only",
          "Use verbal API contract",
          "Copy secret into example",
          "Handoff without evidence",
          "Leave P0 TBD without owner",
        ],
        selfChecks: [
          "What proves a command works?",
          "What belongs in handoff?",
          "Which docs are release-critical?",
          "Why must P0 TBD block release?",
        ],
        evidence: [
          "test-result: peer documentation verification matrix",
          "explanation: evidence-rich handoff and ownership boundaries",
          "config: versioned docs/TBD register/source-of-truth links",
        ],
        requiredEvidence: ["test-result", "explanation", "config"],
        quizConcept:
          "Release documentation is verified by an independent reader, and every handoff preserves symptom, evidence, reproduction, likely layer, owner, expected and actual.",
        firstTest:
          "Ask a non-author to follow the exact versioned command path and record the first mismatch before changing instructions.",
        shortPrompt:
          "Which field is essential in a useful cross-team handoff besides the symptom?",
        shortAnswer: "reproduction steps",
        shortExplanation:
          "Reproduction steps let the receiving owner independently observe and verify the reported behavior.",
        explainPrompt:
          "Explain how peer-tested docs and structured handoff protect release quality while preserving SV1/SV2/SV3 ownership boundaries.",
        passExplanation:
          "documentation as a tested operational contract and evidence-rich handoff",
        returnBlock:
          "peer verification, source of truth, owner/deadline or handoff evidence",
      }),
      mission({
        id: "w8-m6-timed-demo-oral-defense",
        slug: "timed-demo-oral-defense",
        title: "Timed Demo, Oral Defense & Operations Q&A",
        category: "Demo & Oral Defense",
        skillId: "oral-defense",
        targetLevel: "L4",
        sourceType: official,
        competency:
          "8–12 minute evidence-led demo and oral explanation of H-P-D-I architecture, Compose health, SSO, audit/correlation, operations, security and troubleshooting",
        keywords: [
          "demo",
          "oral defense",
          "architecture",
          "health",
          "sso",
          "audit",
          "correlation",
          "troubleshooting",
        ],
        analogy:
          "A technical demo is a guided building inspection, not a slideshow. The guide points to the actual electrical panel, exit routes and maintenance logs, then answers what happens when a light fails.",
        easy:
          "Show real system behavior in a timed story: architecture, service health, SSO, key workflow, audit/correlation and operations response. Practice questions without slides. If a feature owner is asked about their module, explain the boundary and handoff rather than guessing.",
        technical:
          "Oral defense evaluates operational understanding under questioning: causal explanation, runtime evidence, security boundaries, incident method and release decisions. A timed demo verifies a reproducible user flow rather than a prepared static presentation.",
        why:
          "SV1 must credibly coordinate release and explain infrastructure, identity and integration posture. The exercise explicitly keeps Portal/AI feature implementation and business workflow logic with their owners.",
        subtopics: [
          "8–12 minute demo narrative",
          "H-P-D-I architecture map",
          "Compose health and dependency state",
          "SSO and authorization boundary",
          "audit/correlation evidence",
          "incident causal chain",
          "operations and release Q&A",
          "backup presenter and fallback plan",
        ],
        command:
          "docker compose ps\ncurl -fsS http://localhost:3000/api/health\nnpm run typecheck\nnpm test\nGet-Date",
        where:
          "In the rehearsal environment using safe demo accounts and redacted outputs. Record timing and command proof, but do not reveal real credentials, personal data or internal-only endpoints in public material.",
        commandWhy:
          "Establish current health and a reproducible time marker before the demo so claims are anchored to live evidence rather than a cached screenshot.",
        expected:
          "The rehearsal completes core flow within 8–12 minutes, names fallback/backup presenter, answers architecture/security/troubleshooting questions with evidence and records gaps as owned actions.",
        commandFailure:
          "Demo only slides, depend on one person/machine, use production secret, claim healthy because container is running, answer module-owner question by inventing detail or skip Q&A evidence.",
        guided:
          "Write and rehearse a demo script: opening architecture, Compose health, SSO, user flow, audit/correlation, failure/response, release status and close. Time the run, mark every dependency and prepare an evidence-backed fallback.",
        independent:
          "Answer aloud: why can a healthy container still fail a user flow; how do 401 and 403 differ; what evidence precedes restart; when does an unknown incident freeze release? Score yourself against clarity, boundary and verification.",
        integration:
          "Coordinate a real end-to-end story with SV2 API/workflow and SV3 Portal/AI presenters. Record exact ownership transitions and make one person responsible for demo orchestration, not every feature implementation.",
        failure:
          "Simulate a safe non-destructive demo dependency delay or stale UI/API contract in a lab. Pause, present symptom/evidence/hypothesis/test, choose fallback or stop, restore the controlled state and update the runbook.",
        errors: [
          "Demo from screenshots",
          "No backup presenter",
          "Leak demo credential",
          "Claim container health equals user success",
          "Guess outside role boundary",
        ],
        selfChecks: [
          "What must demo show live?",
          "How long is the target run?",
          "What proves an oral answer?",
          "When should demo stop/fallback?",
        ],
        evidence: [
          "test-result: timed demo run and oral-defense score sheet",
          "terminal-output: health/verification commands used in rehearsal",
          "explanation: H-P-D-I, security and troubleshooting Q&A answers",
        ],
        requiredEvidence: ["test-result", "terminal-output", "explanation"],
        quizConcept:
          "A release demo proves real flow and operational reasoning under time; it is not a slide deck, and oral answers must state evidence, boundary and verification.",
        firstTest:
          "Check live health/dependencies and use a time-boxed rehearsal before relying on a demo narrative.",
        shortPrompt:
          "What is the roadmap target duration for the final demo?",
        shortAnswer: "8–12 minutes",
        shortExplanation:
          "The final readiness checklist requires a timed 8–12 minute demo.",
        explainPrompt:
          "Explain a timed SV1 demo of H-P-D-I, health, SSO, audit/correlation and an incident response without crossing module-owner boundaries.",
        passExplanation:
          "live evidence-led demo and defensible operational explanation",
        returnBlock:
          "timed demo, oral Q&A, fallback ownership or evidence chain",
      }),
      mission({
        id: "w8-m7-final-go-no-go-unknown-incident",
        slug: "final-go-no-go-unknown-incident",
        title: "Final Go/No-Go, Team Readiness & Unknown Incident",
        category: "Final Integration",
        skillId: "team-readiness",
        targetLevel: "L4",
        sourceType: official,
        competency:
          "Evidence-based final readiness decision through unknown incident triage, project acceptance, zero-Critical rule, freeze/escalation and regression rerun",
        keywords: [
          "go no-go",
          "team readiness",
          "unknown incident",
          "critical",
          "acceptance",
          "triage",
          "escalation",
          "regression",
        ],
        analogy:
          "Go/no-go is a launch-room decision. No one presses launch because the clock is loud; the room checks each red indicator, knows who owns it and either proves it safe or delays with a recovery plan.",
        easy:
          "Final readiness combines evidence, not confidence. Run the unknown incident protocol, classify severity and owner, prove must flows, confirm config freeze/docs/fresh-machine/release artifacts and decide go or freeze. Any Critical, failed hard gate or unsupported claim is no-go.",
        technical:
          "A release readiness gate aggregates acceptance criteria, security and operational evidence, recovery capability and unresolved risk. Unknown-incident handling tests diagnostic method independently of a pre-labeled subsystem. Go/no-go is a documented decision with inputs, rationale, owner actions and regression exit criteria.",
        why:
          "This is SV1's final coordination capability: preserve system safety and ownership while turning an ambiguous signal into an evidence-backed release decision. It does not authorize bypassing validation or implementing another role's module.",
        subtopics: [
          "unknown-layer triage",
          "symptom-to-regression protocol",
          "severity/Critical classification",
          "must-flow acceptance",
          "team readiness inputs",
          "config/docs/fresh-machine checks",
          "go/no-go decision log",
          "freeze/escalation/rerun criteria",
        ],
        command:
          "docker compose ps\ndocker compose logs --tail 100\ncurl -fsS http://localhost:3000/api/health\nnpm run typecheck\nnpm test\nnpm run build",
        where:
          "Release-candidate environment and repository root. Collect minimally sufficient redacted evidence; do not use destructive cleanup or change several configurations while diagnosing an unknown incident.",
        commandWhy:
          "Establish status, recent evidence and deterministic quality-gate results before claiming a root cause or opening/closing release.",
        expected:
          "A decision record names candidate, must-flow results, acceptance score, incident severity/owner, config/fresh-machine/docs/release evidence, open risks and explicit GO or NO-GO. NO-GO freezes promotion until owner evidence and regression pass.",
        commandFailure:
          "Guess layer from one symptom, restart before evidence, call unknown incident resolved without verification, release with Critical, hide failed gate, cross role boundary or accept verbal readiness.",
        guided:
          "Run the data-driven W8 unknown incident. Record SYMPTOM→EVIDENCE→HYPOTHESIS→TEST→RESULT→ROOT CAUSE→FIX→VERIFICATION→REGRESSION. Then complete a readiness table and write GO/NO-GO with owner/date/exit condition.",
        independent:
          "Given 'SSO works but dashboard action intermittently fails after release', design a minimal triage sequence across Portal/Identity/API/workflow/network without naming the root cause early. State when release freezes and how you hand off.",
        integration:
          "Bring SV2/SV3 status into the readiness review as evidence, not assumptions. Each owner confirms their acceptance evidence; SV1 consolidates dependencies, escalates blockers and reruns the full regression only after minimal fixes.",
        failure:
          "Use the provided unknown incident without looking at its hidden solution. Submit evidence/hypothesis/test before reveal, compare diagnosis, make only the minimum corrective plan and demonstrate regression criteria.",
        errors: [
          "Release on confidence",
          "Restart before evidence",
          "Hide Critical defect",
          "Name root cause immediately",
          "Accept owner verbal status",
        ],
        selfChecks: [
          "What triggers NO-GO?",
          "How do you triage unknown layer?",
          "What evidence proves team readiness?",
          "When is regression rerun?",
        ],
        evidence: [
          "incident-report: W8 unknown-incident causal chain",
          "test-result: final readiness/acceptance and regression report",
          "explanation: go/no-go rationale, ownership and exit criteria",
        ],
        requiredEvidence: ["incident-report", "test-result", "explanation"],
        quizConcept:
          "A final GO decision requires evidence for must flows, hard gates and zero Critical risk; an unknown incident is handled through a falsifiable diagnostic protocol and may freeze release.",
        firstTest:
          "Capture current service/health/log evidence and state one falsifiable hypothesis before changing configuration or restarting.",
        shortPrompt:
          "What must happen to release when a Critical defect is open?",
        shortAnswer: "freeze release",
        shortExplanation:
          "The roadmap requires zero Critical defects; an open Critical issue is a no-go and freezes promotion.",
        explainPrompt:
          "Explain an evidence-based GO/NO-GO decision after an unknown incident, including team ownership, hard gates and regression exit criteria.",
        passExplanation:
          "unknown-incident reasoning, zero-Critical discipline and traceable final readiness decision",
        returnBlock:
          "unknown incident protocol, Critical classification, owner evidence or regression exit criteria",
      }),
    ],
  },
];
