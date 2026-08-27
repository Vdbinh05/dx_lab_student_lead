# Curriculum Audit — Full Eight-Week Roadmap

Audit date: 2026-08-28. Primary source: `DX_Lab_SV1_FINAL_Roadmap_100_100.md`. Result: **PASS**.

## Inventory and coverage

| Week | Missions | Coverage verified | Boss Fight |
| --- | ---: | --- | --- |
| 1 — Foundation | 7 | Linux filesystem/permissions/process/logs; networking/HTTP; Git/Open Source/PR/CI; Docker/Compose operations | Backend unhealthy across network/config layers |
| 2 — Data/API Core | 9 | Dockerfile/images/layers; Compose contracts; DNS/localhost; volumes; env/secrets; health/logs; REST/OpenAPI; PostgreSQL/migration/seed; reverse proxy | Portal/API request failure with undisclosed layer |
| 3 — Identity | 7 | Authentication/authorization; Keycloak; Authorization Code + PKCE/SSO; JWT/JWKS; RBAC/mappers; 401/403/expiry; realm export/security | Login succeeds but protected API returns 403 |
| 4 — Process/Integration | 7 | Integration ownership; n8n/webhooks; proxy/CORS; correlation/audit; retry/idempotency; HITL; workflow E2E/export | Duplicate workflow action |
| 5 — Operations/BI/Recovery | 7 | Health/log/resource matrix; read-only Metabase; KPI validation; backup/checksum/protection; separate-target restore; recovery drills/runbook | Running system reports wrong dashboard data |
| 6 — RAG/AI Infra | 6 | RAG pipeline and boundary; Qdrant/persistence; Ollama/models/resources; dependency configuration; incident handoff; corpus safety/evaluation | RAG 500 with undisclosed infrastructure cause |
| 7 — Agent/Security/HITL | 7 | Tool architecture/schema; read/write boundaries; pending-only HITL; service auth/RBAC; audit/limits; prompt-injection/privilege/secret red-team; E2E closure | Unauthorized sensitive agent action |
| 8 — Integration/Release | 7 | Regression/smoke/integration/E2E; service inventory/config freeze; fresh machine; release/checksum/rollback; documentation/handoff; oral defense; go/no-go/change | Unknown incident with undisclosed layer |

Totals validated from runtime loaders: eight weeks, 57 missions, 285 mission questions, 160 weekly questions, eight incidents/Boss Fights, 50 skill targets, and 24 oral-defense questions across the required ten groups.

## Pass 1 — Roadmap coverage

All roadmap weeks and named competency clusters map to one or more usable missions, labs, evidence requirements, quizzes, and a weekly Boss Fight. Mission counts follow meaningful grouping rather than forced symmetry. Week metadata contains Goal, Knowledge, Practice, Build, Failure Drill, Evidence, Definition of Done, gate requirements, and deliverables. The final-exam page preserves the roadmap blueprint as sections rather than pretending the application already conducts a proctored final exam.

Source traceability is present on every mission. Core SV1 work targets the appropriate L3/L4 depth; support areas for SV2/SV3 stay at support depth and retain explicit ownership boundaries. The Week 8 configuration-freeze mission provides a service-inventory evidence template with all requested fields rather than introducing a CMDB.

## Pass 2 — Technical correctness, commands, and boundaries

Validated mission structure requires command location, purpose, expected signal, and common failure. Docker networking teaches service-name DNS and the localhost trap; persistence warns about destructive `down -v`; identity distinguishes decode from signature/issuer/audience validation and Backend enforcement; workflow content covers retry, idempotency, correlation and audit; restore uses a separate target; agent writes remain DRAFT/PENDING with no approve tool.

Every failure exercise uses the complete SYMPTOM → EVIDENCE → HYPOTHESIS → TEST → RESULT → ROOT CAUSE → FIX → VERIFICATION → REGRESSION protocol. Boss Fight root causes remain hidden until assistance is requested. Security coverage includes public/internal boundaries, secret rotation and demo credentials, backup protection, AI corpus secret/PII handling, prompt injection, privilege escalation, and sensitive-write restrictions.

Automated validation confirms frontmatter, week/order, source type, roadmap competency, target level, skill/evidence references, minimum five mission questions, minimum 20 weekly questions, hard gates, unique IDs, prerequisites, incident mapping, and impossible references. CI/type/build and real-browser flows are separate release checks.

## Pass 3 — Beginner pedagogy, duplication, and gate quality

Missions follow analogy → simple explanation → technical definition → DX-Lab relevance → guided practice → independent execution. Complex commands describe observable signals without promising unstable byte-for-byte output. Later missions reuse earlier foundations through prerequisites and integration tasks instead of repeating introductory prose.

Competency cannot be awarded by reading. Operational steps, stored evidence, quiz thresholds, clean incident work, explanation, and explicit mission/weekly gates are independent signals. Future content is readable without allowing progression mutations. Final readiness draws from ten capability dimensions and is blocked by any P0 condition.

## Known assumptions and project-defined inputs

- Actual DX-Lab repositories, container image tags, host ports, DNS names, credentials, realm/client IDs, API routes, database schema, workflow IDs, Qdrant collections, Ollama models, and release tags vary by the learner’s project. Missions teach how to discover, freeze, validate, and record them; they do not fabricate universal values.
- SV2 owns Backend/API/Data/business logic and n8n business-process implementation. SV3 owns Portal/UX and AI/RAG/agent reasoning. SV1 owns deployment, contracts, identity integration, observability, troubleshooting, security coordination, release, and handoff evidence.
- Evidence is text/URL only. Deployment-safe file upload is intentionally out of scope and documented; this does not block any gate because terminal output, logs, config snippets, URLs, test results, and reflections are supported.
- Oral-defense confidence is self-reported practice state, not a substitute for final human assessment.

No release-critical TBD is hidden. Project-specific values are explicit learner inputs and must be captured in evidence/service inventory before the relevant gate.

## Audit result

**PASS** — roadmap coverage, technical boundary/correctness, and beginner pedagogy/gate quality all meet the curriculum acceptance criteria. Re-run validation and update this audit whenever mission metadata, gate logic, or roadmap scope changes.
