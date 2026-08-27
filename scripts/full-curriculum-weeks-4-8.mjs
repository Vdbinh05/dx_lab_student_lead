import { finalWeek } from "./full-curriculum-week-8.mjs";

const official = "THEO_KE_HOACH_CO";
const extended = "KIEN_THUC_MO_RONG";

const base = {
  estimatedMinutes: 210,
  quizPassScore: 75,
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

export const weeksFourToEight = [
  {
    week: 4,
    previousMissionId: "w3-m7-realm-export-security",
    missions: [
      mission({
        id: "w4-m1-system-integration-contracts",
        slug: "system-integration-contracts",
        title: "System Integration Contracts & Ownership Map",
        category: "System Integration",
        skillId: "system-integration",
        targetLevel: "L4",
        sourceType: official,
        competency: "H-P-D-I system map, service contracts, owners, hostnames, ports, auth, health, callers/callees and blast radius",
        keywords: ["integration", "contract", "owner", "hostname", "port", "auth", "health", "blast radius"],
        analogy: "Một hệ thống giống dây chuyền giao hàng: mỗi trạm biết nhận gì, trả gì, ai chịu trách nhiệm, số cửa và cách kiểm hàng. Không có contract, người ta đoán địa chỉ và đổ lỗi vòng quanh.",
        easy: "SV1 không viết business flow thay SV2 hay Portal/AI thay SV3. SV1 phải nối được các mũi tên: Browser→Portal→Keycloak→Backend→Postgres→n8n and later AI services. Với mỗi mũi tên: hostname, port, network, auth, env, health, logs, owner, blast radius.",
        technical: "An integration contract specifies producer/consumer responsibilities, transport endpoints, authentication/authorization, schemas/semantics, health/failure behavior, correlation and version/change impact. A system map makes runtime dependencies observable and creates deterministic handoff boundaries.",
        why: "Week 4 begins cross-service work. Without an agreed contract, n8n and Backend integration fails as undocumented URLs, credentials, headers, payloads or ownership gaps.",
        subtopics: ["H/P/D/I map", "service owner", "caller/callee", "internal/public hostname and port", "auth and env contract", "health/log source", "timeout/retry expectation", "blast-radius/change impact"],
        command: "docker compose config\ndocker compose ps\ndocker compose logs --tail=100 backend\ndocker compose logs --tail=100 n8n\ncurl -fsS http://localhost:8000/health",
        where: "Host terminal at the project Compose root. Use source-of-truth Compose/env/docs names, not assumed platform defaults.",
        commandWhy: "Build the inventory from resolved runtime config and evidence, not a diagram made from memory.",
        expected: "Each required service has an owner, purpose, internal/public endpoint, dependency, health/log check and one caller/callee. Unknown values become a tracked TBD, never fake default.",
        commandFailure: "Diagram uses localhost inside containers, service/port name is guessed, owner boundary is vague, health is conflated with functional flow or a new change ignores downstream callers.",
        guided: "Fill a Service Health + Integration Matrix for Portal, Keycloak, Backend, Postgres and n8n. For each row prove one runtime fact from config/ps/log/curl and label SV1/SV2/SV3 ownership.",
        independent: "Run a port-change impact analysis for Backend: application listen, Compose, health, proxy, Portal API URL, n8n, Agent, tests and docs. State what SV1 changes versus who receives handoff.",
        integration: "Trace a single protected business request across the H/P/D chain using sanitized correlation/business IDs. Stop at business decision boundary and file a structured handoff for SV2 if behavior—not transport/config—is wrong.",
        failure: "Deliberately write one wrong internal URL in a disposable workflow config. Use the matrix to derive which service/log/test comes first, then restore it and update contract evidence.",
        errors: ["Draw architecture but omit owner/health/auth", "Use port without hostname", "Turn SV1 into business API owner", "Treat documentation as optional after config change", "Hide unresolved contract under TBD"],
        selfChecks: ["What 10 facts must SV1 know for each service?", "Who owns business process logic?", "Why include blast radius?", "What is a valid integration handoff?"],
        evidence: ["config: service/integration matrix", "terminal-output: resolved config/health/log evidence", "explanation: change impact and ownership boundary"],
        requiredEvidence: ["config", "terminal-output", "explanation"],
        quizConcept: "An integration contract gives each service endpoint, dependency, auth, health, owner and change impact—not only an API URL.",
        firstTest: "Compare the written contract with docker compose config, then test the first caller→callee edge in the actual network scope.",
        shortPrompt: "SV1 must record what for every service besides hostname and port?",
        shortAnswer: "owner",
        shortExplanation: "Ownership is essential for safe routing, acceptance and escalation of cross-service defects.",
        explainPrompt: "Explain the H-P-D-I map and name hostname/port/auth/health/log/owner for each arrow in a protected request.",
        passExplanation: "runtime contract, ownership and impact analysis",
        returnBlock: "service map/contract or role-boundary understanding",
      }),
      mission({
        id: "w4-m2-n8n-workflow-foundations",
        slug: "n8n-workflow-foundations",
        title: "n8n Workflow Foundations & Backend Boundary",
        category: "n8n",
        skillId: "n8n",
        targetLevel: "L3",
        sourceType: official,
        competency: "Workflow trigger, state, transition, condition, action, webhook, audit and n8n→Backend API→PostgreSQL boundary",
        keywords: ["n8n", "workflow", "trigger", "state", "transition", "webhook", "backend api", "audit"],
        analogy: "n8n là người điều phối checklist, không phải kho hồ sơ. Nó nhận sự kiện, quyết định bước tiếp theo, gọi quầy Backend theo hợp đồng và lưu audit. Nó không nên tự mở tủ Postgres và sửa nhiều hồ sơ tùy ý.",
        easy: "Workflow needs trigger, input, condition, action, expected output and failure path. n8n calls Backend API; Backend applies business rules and persists through SV2's design. SV1 supports connectivity/auth/observability/export, not direct multi-table business writes from workflow.",
        technical: "A workflow automates stateful transitions through triggered nodes, conditions and actions. A webhook is an HTTP-triggered event endpoint. Integration should use a stable Backend API contract, with explicit idempotency/audit/authorization, rather than bypassing domain invariants through arbitrary database access.",
        why: "SV1 needs enough workflow fluency to deploy, observe, debug and evidence n8n integration without owning business process implementation.",
        subtopics: ["trigger/action/condition", "state and transition", "webhook activation", "n8n credential boundary", "Backend API contract", "audit trail", "workflow export/version", "no arbitrary DB writes"],
        command: "docker compose ps n8n backend postgres\ndocker compose logs --tail=100 n8n\ncurl -i http://localhost:5678/healthz\ncurl -i http://localhost:8000/openapi.json",
        where: "Host terminal at Compose root. n8n health endpoint/path depends on pinned version; use project source of truth and do not expose n8n admin UI publicly by default.",
        commandWhy: "Prove orchestration service state, inspect its first relevant log and compare workflow target with documented Backend API.",
        expected: "n8n is reachable at its intended admin/internal boundary; a versioned workflow export identifies trigger, API target, credentials by name only and audit behavior.",
        commandFailure: "Webhook inactive, n8n calls localhost, credential is embedded in export, direct DB node bypasses Backend, or source workflow differs from deployed version.",
        guided: "Create a disposable webhook workflow that validates input then calls a safe Backend test endpoint. Record trigger, request headers/body schema, success/failure branches and exported workflow version without credentials.",
        independent: "Review an existing workflow: identify its business owner, transport contract, persistence boundary, auth, audit, retry and idempotency gaps. Produce only findings/evidence where SV2 owns implementation.",
        integration: "Send one test event through n8n→Backend and trace resulting HTTP status, correlation ID and API audit. Do not issue arbitrary SQL from n8n to 'make it work'.",
        failure: "Deactivate webhook or replace Backend service name with localhost. Capture trigger state, execution record, network/config/log evidence and restore correct endpoint.",
        errors: ["Let n8n write arbitrary tables", "Treat active workflow as proven E2E", "Put password in exported JSON", "Use UI URL as webhook API URL", "No failure branch/audit"],
        selfChecks: ["Why n8n→Backend API instead of direct DB?", "What makes webhook active?", "What belongs in versioned export?", "Which team owns business state design?"],
        evidence: ["config: redacted workflow contract/export reference", "terminal-output: n8n/Backend health/log evidence", "explanation: orchestration versus business boundary"],
        requiredEvidence: ["config", "terminal-output", "explanation"],
        quizConcept: "n8n coordinates workflow but calls Backend APIs for domain logic and persistence, preserving business rules and audit boundaries.",
        firstTest: "Verify workflow activation and its exact API target from the n8n execution/config, then test the target in the n8n network scope.",
        shortPrompt: "Workflow should call which layer to apply business rules and persist domain data?",
        shortAnswer: "Backend API",
        shortExplanation: "The Backend API preserves service-layer validation, authorization and database invariants.",
        explainPrompt: "Explain trigger→condition→action→Backend API→Postgres and why direct DB workflow writes are unsafe.",
        passExplanation: "workflow orchestration and Backend ownership boundary",
        returnBlock: "workflow contract or n8n/Backend role separation",
      }),
      mission({
        id: "w4-m3-webhook-proxy-cors",
        slug: "webhook-proxy-cors",
        title: "Webhooks, Reverse Proxy, CORS & Browser-vs-curl",
        category: "Integration Network",
        skillId: "reverse-proxy",
        targetLevel: "L3",
        sourceType: extended,
        competency: "Webhook URL routing, reverse proxy/upstream, CORS awareness, browser versus curl behavior and public/internal URL separation",
        keywords: ["webhook", "reverse proxy", "cors", "browser", "curl", "origin", "preflight", "upstream"],
        analogy: "curl is a courier who follows a direct address. A browser is a courier with an Origin badge and preflight questions; the same destination can accept curl but reject browser if its cross-origin policy is missing or unsafe.",
        easy: "CORS is a browser policy, not a firewall or Backend authorization. A proxy may route /webhook or /api to internal services. Test external browser/proxy route and internal upstream separately. Avoid opening wildcard origins or credentials just to remove an error.",
        technical: "Cross-Origin Resource Sharing controls whether browser JavaScript may read a cross-origin response through response headers and preflight behavior. Reverse proxies route external paths to internal upstreams. Curl bypasses browser CORS enforcement, so curl success can help isolate—not disprove—a browser-origin issue.",
        why: "SV1 must separate proxy/DNS/route/CORS/auth symptoms so SV3 receives precise browser integration evidence and SV2 receives only actual API defects.",
        subtopics: ["webhook public/internal URL", "proxy path/upstream", "Origin header", "OPTIONS/preflight", "Access-Control headers", "curl vs browser", "credentials and wildcard risk", "CORS not authorization"],
        command: "curl -i -H 'Origin: http://localhost:3000' http://localhost:8000/api/health\ncurl -i -X OPTIONS -H 'Origin: http://localhost:3000' -H 'Access-Control-Request-Method: POST' http://localhost:8000/api/items\ndocker compose logs --tail=100 proxy\ndocker compose logs --tail=100 backend",
        where: "Host terminal for external proxy/API tests. Browser developer tools may inspect network headers but must not expose cookies/tokens in evidence.",
        commandWhy: "Compare normal request and preflight response, then correlate proxy/Backend paths instead of guessing from browser console alone.",
        expected: "A required allowed origin/method gets intentional CORS headers; untrusted origin is not broadly allowed; proxy and Backend logs agree about routed request.",
        commandFailure: "Wrong public URL, upstream route typo, missing OPTIONS, origin not allowed, wildcard plus credentials, confused CORS with 401/403, or curl targets different path than browser.",
        guided: "Choose one browser API call and compare: browser URL, proxy route, Backend internal URL, Origin, expected preflight and auth boundary. Execute a safe OPTIONS test and record headers/status.",
        independent: "Given curl 200 but browser fails, make a hypothesis tree for URL/proxy/CORS/cookie/auth/Portal state. Specify first discriminating test for each—not a blanket wildcard header.",
        integration: "Run Portal flow against public route, equivalent curl against public route, then proxy-to-Backend upstream test. Hand off SV3 only once CORS/proxy/auth evidence isolates a UI/state problem.",
        failure: "Remove one allowed Origin or misroute a webhook path in a disposable config. Preserve status/header/log evidence, fix exact contract and check no unintended origin gained access.",
        errors: ["Use CORS as authentication", "Set * with credentials", "Test only curl", "Use internal Docker URL in browser", "Route endpoint but forget preflight"],
        selfChecks: ["Why can curl pass while browser fails?", "CORS guards what?", "Which layer enforces permission?", "What is first test for 502 versus CORS?"],
        evidence: ["terminal-output: request/preflight headers/status", "config: public/internal route and allowed-origin policy", "incident-report: browser-vs-curl protocol"],
        requiredEvidence: ["terminal-output", "config", "incident-report"],
        quizConcept: "CORS is browser response-sharing policy; curl does not enforce it, and Backend authorization remains separate.",
        firstTest: "Compare browser's exact URL/Origin/method with curl and the proxy upstream route, then inspect preflight response when applicable.",
        shortPrompt: "HTTP method browsers commonly use for CORS preflight is what?",
        shortAnswer: "OPTIONS",
        shortExplanation: "Browsers send OPTIONS requests to determine whether a cross-origin operation is permitted.",
        explainPrompt: "Explain why a curl 200 cannot alone prove Portal browser flow works and draw public→proxy→internal request scope.",
        passExplanation: "browser/proxy/upstream/CORS boundaries",
        returnBlock: "URL scope, CORS headers or proxy route",
      }),
      mission({
        id: "w4-m4-correlation-audit-trace",
        slug: "correlation-audit-trace",
        title: "Correlation IDs, Business IDs & Audit Trace",
        category: "Observability",
        skillId: "observability",
        targetLevel: "L3",
        sourceType: official,
        competency: "correlation_id, business_id, idempotency_key, sanitized audit and cross-service traceability",
        keywords: ["correlation id", "business id", "idempotency key", "audit", "trace", "logs", "workflow"],
        analogy: "Correlation ID là số kiện hàng đi xuyên chuyến; business ID là số đơn; idempotency key là tem chống nhận trùng. Không có chúng, nhìn log giống tìm đúng hộp trong kho không nhãn.",
        easy: "One request can touch Portal, Backend, n8n and database. Carry correlation_id to group technical journey; business_id names domain object; idempotency_key makes a retried write recognizable. Audit records actor/action/time/result but must redact tokens/secrets and sensitive body fields.",
        technical: "Distributed request correlation propagates a unique request identifier across service boundaries. Business identifiers identify domain entities, while idempotency keys identify an operation instance. Structured audit logs record security/operational events with a data-minimization policy and enable causality reconstruction.",
        why: "SV1 must gather evidence before restart, coordinate handoff and prove duplicate-safe integration. These identifiers are the shared debugging vocabulary, not an optional logging decoration.",
        subtopics: ["correlation versus business ID", "idempotency key purpose", "header/body propagation convention", "structured log fields", "audit actor/action/result/time", "redaction", "cross-service search", "retention awareness"],
        command: "curl -i -H 'X-Correlation-ID: lab-w4-001' -H 'Idempotency-Key: lab-op-001' http://localhost:8000/api/health\ndocker compose logs --tail=200 backend\ndocker compose logs --tail=200 n8n\ndocker compose logs --tail=200 proxy",
        where: "Host terminal at Compose root. For real workflow calls, use a non-secret lab correlation ID and never include bearer token or private business content in evidence.",
        commandWhy: "Inject one traceable safe identifier, then locate it across service logs in chronological order.",
        expected: "Relevant services log/refer to same correlation ID; audit fields identify actor/action/result safely; missing identifier becomes a contract defect rather than guessed timeline.",
        commandFailure: "Different header names, regenerated ID at each hop, logs contain full payload/token, business ID used as secret, or no linkage from workflow to Backend.",
        guided: "Define a convention with correlation_id/business_id/idempotency_key. Send a safe test event through proxy→Backend→workflow; create a timeline of timestamps/statuses and redact all sensitive fields.",
        independent: "Inspect a failure log set with two similar requests. Use only IDs/timestamps to reconstruct which call failed and produce a handoff with expected/actual and owner.",
        integration: "Ensure n8n passes correlation and idempotency headers to Backend. If Backend's domain audit semantics are wrong after propagation works, hand off SV2 with the trace.",
        failure: "Remove propagation on one workflow node. Show that logs split into unrelated traces, add minimal header mapping, then demonstrate same ID returns across edge and regression log search.",
        errors: ["Use correlation ID as auth", "Log raw token with trace", "Generate new ID at every hop", "Assume business ID prevents duplicate", "Record only success audit"],
        selfChecks: ["Three IDs differ how?", "What cannot go in audit/log?", "How trace retries?", "Why is ID propagation integration contract?"],
        evidence: ["log: sanitized cross-service trace timeline", "config: ID/header convention", "explanation: correlation/business/idempotency distinction"],
        requiredEvidence: ["log", "config", "explanation"],
        quizConcept: "Correlation IDs trace a request, business IDs identify domain entities, and idempotency keys identify a write operation for retry safety.",
        firstTest: "Search one safe correlation ID across proxy, Backend and workflow logs before any restart or broad query.",
        shortPrompt: "Identifier used to recognize a retried write as the same operation is what?",
        shortAnswer: "idempotency key",
        shortExplanation: "An idempotency key allows a server to recognize a repeated request as the same operation.",
        explainPrompt: "Explain correlation_id, business_id and idempotency_key with one multi-service order workflow trace.",
        passExplanation: "safe traceability across service boundaries",
        returnBlock: "identifier contract, propagation or redacted audit evidence",
      }),
      mission({
        id: "w4-m5-retry-idempotency",
        slug: "retry-idempotency",
        title: "Retry, Timeout, Idempotency & Duplicate Safety",
        category: "Reliability",
        skillId: "system-integration",
        targetLevel: "L4",
        sourceType: official,
        competency: "Timeout, retry/backoff, retry-safe API design, idempotency key, duplicate event and recovery behavior",
        keywords: ["retry", "timeout", "backoff", "idempotency", "duplicate", "webhook", "network", "reliability"],
        analogy: "Nếu gọi điện đặt hàng bị ngắt sau khi cửa hàng đã ghi đơn, gọi lại không được tạo đơn mới. Idempotency key là số biên nhận để cửa hàng trả kết quả cũ thay vì xử lý lại.",
        easy: "Timeout means caller lacks timely response, not necessarily that server did nothing. Retrying a non-idempotent write can duplicate orders. Caller uses stable key; Backend stores/enforces it and returns original result for repeat. Retry policy must be bounded and observable.",
        technical: "Retries trade transient-failure recovery against duplicate side effects. Idempotency keys bind multiple delivery attempts to one logical operation, typically through server-side uniqueness/state. Timeouts are ambiguous outcomes; exponential backoff/jitter and explicit retry classification reduce load and synchronize recovery behavior.",
        why: "SV1 owns integration/reliability evidence and must expose duplicate risk to SV2/n8n owners. A workflow that 'usually works' fails roadmap gate if retried event produces duplicate state.",
        subtopics: ["timeout ambiguity", "transient/permanent classification", "bounded retry/backoff", "stable key source", "Backend uniqueness/enforcement", "original response replay", "duplicate detection/audit", "manual recovery"],
        command: "curl -i -H 'Idempotency-Key: lab-w4-op-001' -H 'X-Correlation-ID: lab-w4-dup-001' -X POST http://localhost:8000/api/test-write\ncurl -i -H 'Idempotency-Key: lab-w4-op-001' -H 'X-Correlation-ID: lab-w4-dup-002' -X POST http://localhost:8000/api/test-write\ndocker compose logs --tail=200 backend\ndocker compose logs --tail=200 n8n",
        where: "Host terminal against a disposable safe test-write endpoint only. Do not repeat a real finance/stock/production operation as a learning experiment.",
        commandWhy: "Deliver the same operation key twice with different correlation IDs and compare result, persistence count and audit behavior.",
        expected: "First request creates one effect; replay returns existing/consistent result without a second effect; logs/audit reveal same key and both delivery attempts.",
        commandFailure: "No key propagation, key changes per retry, Backend accepts duplicate, timeout hidden by random retry, retry storm, or database uniqueness error leaked without recovery contract.",
        guided: "Build a disposable create-request workflow with stable idempotency_key. Trigger twice and verify one resulting domain record/audit operation. Document timeout/retry limits and manual recovery owner.",
        independent: "Simulate response delay after server-side success. Explain why caller must not infer failure solely from timeout and how it safely recovers with same key.",
        integration: "Trace n8n retry to Backend with same key but unique correlation per attempt. Ask SV2 to own server persistence/policy if missing; SV1 verifies transport/config/evidence.",
        failure: "Remove idempotency header mapping or make key random per attempt in disposable flow. Produce duplicate evidence, identify contract gap, restore stable key and regression-test concurrent/retry paths.",
        errors: ["Retry every error forever", "Use correlation ID as idempotency key", "Assume timeout equals no write", "Make n8n dedupe only", "Delete duplicate records without audit"],
        selfChecks: ["Why timeout ambiguous?", "Stable key comes from what logical unit?", "Which layer enforces duplicate safety?", "Why different correlation IDs on repeats?"],
        evidence: ["test-result: two-delivery one-effect proof", "log: key/correlation audit trace", "incident-report: duplicate/timeout protocol"],
        requiredEvidence: ["test-result", "log", "incident-report"],
        quizConcept: "A timeout does not prove no side effect; retry-safe writes reuse a stable idempotency key that Backend enforces.",
        firstTest: "Compare the idempotency key, persisted effect count and audit across first delivery and a controlled replay.",
        shortPrompt: "A retry should reuse which identifier for the same logical write?",
        shortAnswer: "idempotency key",
        shortExplanation: "The same logical operation must retain its idempotency key across delivery attempts.",
        explainPrompt: "Explain timeout ambiguity, backoff and how a stable idempotency key creates exactly-one logical effect.",
        passExplanation: "retry and duplicate-safe cross-service operation",
        returnBlock: "timeout/retry semantics or idempotency propagation/enforcement",
      }),
      mission({
        id: "w4-m6-hitl-approval-workflow",
        slug: "hitl-approval-workflow",
        title: "Human-in-the-Loop Approval & State Boundaries",
        category: "HITL",
        skillId: "authorization",
        targetLevel: "L4",
        sourceType: official,
        competency: "DRAFT/PENDING, manager approval/rejection, workflow continuation, audit and role boundary",
        keywords: ["hitl", "approval", "draft", "pending", "manager", "rejected", "workflow", "audit"],
        analogy: "A purchase request is a form put in an inbox. Creating it puts it in DRAFT/PENDING; only the manager desk can stamp APPROVED or REJECTED. A workflow cannot stamp its own request just because it made the form.",
        easy: "HITL separates proposal from approval. A user/Agent/workflow can create DRAFT/PENDING, then a Manager role makes approval decision through Backend policy. n8n continues only after authoritative state transition. Audit must capture actor, time, old/new state and correlation.",
        technical: "Human-in-the-loop control gates an automated proposal through an authorized human decision. A state machine defines allowed transitions and actors. Backend authorization enforces transition rules; workflow orchestration observes/continues from trusted state rather than granting itself approval capability.",
        why: "This is a core integration/security boundary for Week 4 and later Agent work. SV1 coordinates identity/workflow behavior but must not implement SV2 domain state machine logic.",
        subtopics: ["state machine", "DRAFT/PENDING", "APPROVED/REJECTED", "actor role matrix", "Backend transition guard", "workflow wait/resume", "audit/correlation", "negative approval tests"],
        command: "curl -i -X POST http://localhost:8000/api/purchase-requests\ncurl -i -X POST http://localhost:8000/api/purchase-requests/DEMO/approve\ndocker compose logs --tail=200 backend\ndocker compose logs --tail=200 n8n",
        where: "Use only disposable demo request IDs and secure local token tooling. Written evidence must record statuses/roles but never bearer token values.",
        commandWhy: "Observe creation/transition outcomes, then correlate Backend policy and workflow continuation logs.",
        expected: "Create returns DRAFT/PENDING; unprivileged approve is 403/denied; Manager approval yields authoritative state and workflow continuation; audit describes actor/result.",
        commandFailure: "Workflow writes APPROVED directly, UI role controls only, missing transition validation, stale role token, duplicate approval race, no audit or incorrectly resumes after rejection.",
        guided: "Diagram request lifecycle. Run positive Manager approve and negative Sales approve on disposable request. Record status before/after, actor role, correlation and n8n continuation result.",
        independent: "Add a rejection path to the test plan. Explain why creating a request must not give same actor approval right and how duplicate approval is handled.",
        integration: "Verify Keycloak role claim→Backend guard→workflow wait/resume. Hand off if domain transition rule semantics are wrong after auth/transport/audit contract passes.",
        failure: "In a disposable workflow mapping, attempt to set status=APPROVED on create. Demonstrate Backend rejects/overrides it to pending, fix service contract and regression-test both roles.",
        errors: ["Approve in n8n direct DB step", "Let client choose final status", "Treat UI hidden button as HITL", "Test only Manager happy path", "Forget rejection/audit"],
        selfChecks: ["Who may approve?", "Where enforced?", "Why pending-only write?", "What continues workflow?"],
        evidence: ["test-result: create/pending/allowed/denied/reject matrix", "log: sanitized actor/state/correlation audit", "explanation: HITL enforcement chain"],
        requiredEvidence: ["test-result", "log", "explanation"],
        quizConcept: "HITL requires Backend-enforced state transitions: automation creates DRAFT/PENDING; an authorized human makes the approval decision.",
        firstTest: "Check persisted/requested state and Backend role decision before observing workflow continuation.",
        shortPrompt: "State nào write automation must create before human approval?",
        shortAnswer: "PENDING",
        shortExplanation: "The roadmap permits automation proposal only as DRAFT/PENDING, awaiting authorized human action.",
        explainPrompt: "Explain DRAFT/PENDING→Manager→APPROVED/REJECTED→workflow chain and why no direct workflow approve path exists.",
        passExplanation: "HITL state/actor enforcement and audit",
        returnBlock: "state transition authorization, workflow wait or audit evidence",
      }),
      mission({
        id: "w4-m7-workflow-integration-evidence",
        slug: "workflow-integration-evidence",
        title: "Workflow E2E, Export & Integration Incident",
        category: "Integration QA",
        skillId: "troubleshooting",
        targetLevel: "L4",
        sourceType: official,
        competency: "Two workflow E2E, export/version, correlation/idempotency evidence and cross-service failure injection",
        keywords: ["workflow", "e2e", "export", "correlation", "idempotency", "webhook", "incident", "handoff"],
        analogy: "Một quy trình hoàn chỉnh giống chuyển thư bảo đảm: có người gửi, số theo dõi, các chặng, người ký nhận và bản sao quy trình. Nếu chỉ nhìn một chặng xanh không chứng minh thư đến đúng người.",
        easy: "Week 4 is PASS only when two workflows are traceable from trigger through Backend/data to final state, retry-safe, role-safe and exportable. Boss Fight may hide one failure layer; hints teach but never turn into clean pass.",
        technical: "End-to-end workflow verification exercises a complete integration path and its negative/recovery conditions. Versioned exports, contract tests, correlation logs and idempotency evidence make the flow reproducible and establish regression inputs for later release work.",
        why: "This mission turns component learning into product capability. SV1's job is proof and coordination across owners, not a single success screenshot.",
        subtopics: ["workflow #1 and #2 scope", "E2E acceptance", "export/version/source of truth", "correlation/idempotency", "allowed/denied roles", "failure injection", "incident protocol", "regression matrix"],
        command: "docker compose ps\ndocker compose logs --tail=200 n8n\ndocker compose logs --tail=200 backend\ncurl -fsS http://localhost:8000/health\ndocker compose config",
        where: "Host terminal at Compose root. Use documentation/export names as source of truth, and run only against disposable demo records where workflow mutates data.",
        commandWhy: "Capture stack state and target logs/config immediately around an E2E run or controlled failure.",
        expected: "Two flows have declared trigger/input/owner/API/role/state/audit/failure/retry acceptance. Exported workflow is versioned and the source system can run independent clean execution.",
        commandFailure: "Flow works only via admin, hidden direct DB action, webhook inactive, duplicated event, credentials in export, missing correlation or owner handoff absent.",
        guided: "Run one Sales Order-like and one Purchase Request-like workflow through happy path and one negative path. Capture ID timeline, API status, role decision, data outcome, export reference and cleanup.",
        independent: "Complete Boss Fight #workflow-04 unassisted. Afterward, produce an integration report identifying likely layer/owner/fix/verification/regression regardless of score.",
        integration: "Coordinate acceptance review with SV2 (business/API/data) and SV3 (Portal awareness). SV1 signs only infrastructure/identity/integration evidence; recorded owner accepts functional rule behavior.",
        failure: "Inject inactive webhook, wrong API URL or duplicate retry one at a time. Do not repair by bypassing Backend; follow all nine protocol fields and add regression test.",
        errors: ["Call a flow E2E after only webhook 200", "Store credentials in export", "No negative/duplicate test", "Run as admin only", "Close incident without regression"],
        selfChecks: ["What proves a workflow end to end?", "Which evidence makes it reproducible?", "What makes clean Boss Fight?", "What goes to SV2/SV3 handoff?"],
        evidence: ["test-result: two-flow E2E matrix", "config: versioned export/source-of-truth reference", "incident-report: cross-service failure with all protocol fields"],
        requiredEvidence: ["test-result", "config", "incident-report"],
        quizConcept: "A workflow is E2E only when trigger, authorization, API/data result, audit, retry/negative behavior and reproducible export all meet acceptance.",
        firstTest: "Start from the declared trigger and trace IDs across n8n, Backend and final state before asserting success.",
        shortPrompt: "Which property prevents a retry from creating a duplicate logical operation?",
        shortAnswer: "idempotency",
        shortExplanation: "Idempotency makes repeat delivery produce the same logical effect rather than additional state changes.",
        explainPrompt: "Explain the evidence chain that proves two workflows are E2E, secure, duplicate-safe and reproducible.",
        passExplanation: "cross-service E2E acceptance and incident regression",
        returnBlock: "workflow contract, traceability, idempotency or role gate",
      }),
    ],
  },
  {
    week: 5,
    previousMissionId: "w4-m7-workflow-integration-evidence",
    missions: [
      mission({
        id: "w5-m1-service-health-operations",
        slug: "service-health-operations",
        title: "Operations: Service Health Matrix, Logs & Resources",
        category: "Operations",
        skillId: "observability",
        targetLevel: "L4",
        sourceType: official,
        competency: "Service health matrix, running/healthy/functional, logs, CPU/RAM/disk/ports/dependencies and baseline snapshots",
        keywords: ["operations", "health matrix", "logs", "cpu", "ram", "disk", "ports", "dependencies"],
        analogy: "Một phòng điều hành giống bảng tình trạng chuyến bay: máy bay cất cánh, tín hiệu an toàn và hành khách tới đích là khác nhau. CPU/RAM/disk/port/log cho biết tiếp theo phải nhìn đâu, không phải dashboard để trang trí.",
        easy: "SV1 maintains a lightweight Service Health Matrix before demo, during incident and fresh-machine. Running is process exists; healthy is healthcheck pass; functional is real use case pass. Record baseline at startup, normal transaction and AI load later; do not invent thresholds before measuring.",
        technical: "Operational observability combines service lifecycle state, healthcheck status, structured/relevant logs, resource utilization, listening ports and dependency topology. Baselines contextualize anomalies and support evidence-first incident response without requiring enterprise monitoring tooling.",
        why: "Roadmap expressly requires observability baseline but excludes unnecessary Prometheus/Grafana/ELK scope. SV1 needs fast, reliable first checks for every integrated service.",
        subtopics: ["running/healthy/functional", "service matrix fields", "docker compose ps", "logs first relevant error", "docker stats", "ss", "free/df", "dependency/blast radius"],
        command: "docker compose ps\ndocker compose logs --tail=100 backend\ndocker stats --no-stream\nss -lntp\nfree -h\ndf -h",
        where: "Host terminal on the deployment/lab host. `ss`, `free`, `df` may run in Linux/WSL; use documented equivalents on Windows and record environment.",
        commandWhy: "Collect a compact state/resource/port/log snapshot before restarting a service.",
        expected: "Matrix identifies each service status, health, port, dependency, owner, last relevant error and resource note. Data is time-bounded and evidence-backed rather than stale green dots.",
        commandFailure: "Read only container running state, log after restart loses root cause, port list from wrong namespace, stats with no baseline, disk volume omitted or arbitrary threshold asserted.",
        guided: "Build matrix for Portal, Backend, Postgres, Keycloak and n8n. Capture startup baseline and one normal workflow transaction snapshot. Label any unavailable metric honestly.",
        independent: "Given browser symptom, use matrix to choose first three checks and explain why another service should not be restarted yet.",
        integration: "Run a known E2E flow then update matrix across dependencies. If DB usage spikes, check volume/storage/queries evidence and hand off domain query optimization to SV2 only after infra triage.",
        failure: "Stop one noncritical disposable service or misconfigure its health endpoint. Capture ps/inspect/log/port/resource before start/restart, localize blast radius and verify recovery.",
        errors: ["Call running healthy", "Restart before log capture", "Use monitoring stack just to meet matrix", "Ignore disk/volume", "Claim performance without baseline"],
        selfChecks: ["Three status levels differ?", "Why baseline at 3 moments?", "What is first evidence for container exited?", "Why no fixed CPU threshold first?"],
        evidence: ["log: service health matrix snapshot", "terminal-output: ps/logs/stats/ports/resources", "explanation: status distinction and first-check choice"],
        requiredEvidence: ["log", "terminal-output", "explanation"],
        quizConcept: "Running, healthy and functional are distinct operational observations; a service matrix guides evidence collection before restart.",
        firstTest: "Capture compose ps, the first relevant service log, port/listener and resource snapshot before changing state.",
        shortPrompt: "Which command gives one-time Docker CPU/RAM usage snapshot?",
        shortAnswer: "docker stats --no-stream",
        shortExplanation: "docker stats --no-stream reports a single non-continuous resource usage snapshot.",
        explainPrompt: "Explain how a Service Health Matrix turns a browser symptom into ordered evidence rather than random restarts.",
        passExplanation: "operational state, resource baseline and evidence-first triage",
        returnBlock: "health/log/resource evidence or running/healthy/functional distinction",
      }),
      mission({
        id: "w5-m2-metabase-readonly-bi",
        slug: "metabase-readonly-bi",
        title: "Metabase, Read-only Reporting & KPI Boundary",
        category: "BI",
        skillId: "metabase",
        targetLevel: "L2",
        sourceType: official,
        competency: "PostgreSQL→read-only reporting user→Metabase, dashboard access boundary and six KPI baseline",
        keywords: ["metabase", "bi", "read only", "reporting", "kpi", "postgresql", "dashboard", "permissions"],
        analogy: "Metabase is a glass-walled reporting room: it reads warehouse records to show counts and trends but must not rearrange stock. Reporting credential is a visitor badge, not a warehouse manager key.",
        easy: "Metabase connects with a read-only DB account. Dashboards show KPI but do not become source of truth. Verify data through selected SQL/source rows and document filters/timezone. SV1 supports connection/health/access; SV2 owns metric/business semantics.",
        technical: "Business-intelligence tooling queries a source database through a least-privilege reporting principal. A dashboard visualization derives values from saved queries/filters; correctness requires validating query semantics, access permissions and source data rather than trusting chart rendering.",
        why: "SV1 needs to provision/verify secure reporting integration, distinguish access/connection defects from KPI logic, and prevent BI credential from writing operational data.",
        subtopics: ["reporting user least privilege", "connection host/port/SSL awareness", "Metabase service health", "dashboard question/filter", "six KPI baseline", "source-of-truth row validation", "dashboard access roles", "read-only test"],
        command: "docker compose ps metabase postgres\ndocker compose logs --tail=100 metabase\ndocker compose exec postgres psql -U reporting -d dxlab -c 'select current_user;'\ndocker compose exec postgres psql -U reporting -d dxlab -c 'create table should_fail(id int);'",
        where: "Host terminal at Compose root. The failed write test runs only against a disposable verified reporting account and should fail; do not alter production reporting grants during a learner test.",
        commandWhy: "Prove service state, authenticated reporting identity and absence of write privilege.",
        expected: "reporting user connects and SELECT works; CREATE/INSERT is denied; Metabase connects only through intended network/credential and dashboard access follows team policy.",
        commandFailure: "Reporting account has owner/write rights, Metabase uses app superuser, wrong DB host, public admin UI, KPI query has stale filter/timezone or dashboard chart hides null data.",
        guided: "Create/verify read-only reporting account in lab, connect Metabase, build one safe KPI and compare chart result with a direct read-only SQL query/row count.",
        independent: "Create validation checklist for revenue/order/customer/top-product/low-stock/pending-approval KPI, separating connection/security checks (SV1) from metric definition (SV2).",
        integration: "Trace Metabase→Postgres reporting URL/network/user. When dashboard total differs, collect query/filter/source evidence then hand metric business rule to SV2 instead of granting write access.",
        failure: "Use app write credential in a disposable Metabase config or deny reporting SELECT. Detect using current_user/grants/logs, restore least privilege and verify read-only write rejection.",
        errors: ["Use DB owner for dashboard", "Treat chart as source of truth", "Test only login not query permission", "Open Metabase admin publicly", "Give SV1 ownership of KPI business formula"],
        selfChecks: ["Why reporting user read-only?", "How validate chart?", "Who owns KPI formula?", "What does a denied CREATE prove?"],
        evidence: ["test-result: read-only SELECT/denied-write proof", "log: Metabase/Postgres connection evidence", "explanation: BI/security versus business KPI boundary"],
        requiredEvidence: ["test-result", "log", "explanation"],
        quizConcept: "Metabase should use a least-privilege read-only reporting account; dashboard numbers require source/query validation.",
        firstTest: "Verify reporting identity and a simple SELECT/denied-write boundary before debugging dashboard formulas.",
        shortPrompt: "Database privilege required by a reporting-only dashboard is what?",
        shortAnswer: "SELECT",
        shortExplanation: "Read-only reporting needs SELECT privileges, not write/owner privileges.",
        explainPrompt: "Explain Postgres→reporting user→Metabase→KPI and distinguish dashboard access safety from KPI correctness.",
        passExplanation: "least-privilege BI connection and source validation",
        returnBlock: "reporting permission/connection or KPI source/filter proof",
      }),
      mission({
        id: "w5-m3-kpi-data-validation",
        slug: "kpi-data-validation",
        title: "KPI Data Validation & Reporting Incident Triage",
        category: "Data Operations",
        skillId: "postgresql",
        targetLevel: "L3",
        sourceType: official,
        competency: "Revenue/order/customer/top-products/low-stock/pending-approval KPI validation, SQL/filter/timezone/source-row trace",
        keywords: ["kpi", "sql", "revenue", "orders", "customers", "stock", "approvals", "filter", "timezone"],
        analogy: "Dashboard is a calculator display. If it shows wrong total, check the receipt rows and calculator formula; do not tap the display until it changes. A healthy service can faithfully display a wrong filter.",
        easy: "Validate one known business ID from API/database to dashboard. Check table/query/filter/status/timezone/null handling and compare counts/totals. SV1 does not rewrite metric meaning but ensures query route, reporting access and evidence are sound.",
        technical: "KPI correctness is a lineage problem: operational events are persisted in source tables, transformed by explicit query/filter/aggregation rules, and rendered in a BI layer. Validation compares controlled source records and independent aggregate queries against dashboard results across time/status boundaries.",
        why: "Week 5 Boss Fight requires data correctness rather than service running. It teaches SV1 to hand off a factual lineage defect rather than vague 'Metabase wrong'.",
        subtopics: ["six baseline KPIs", "source table and business ID", "SELECT/COUNT/SUM/GROUP BY basic", "status/filter", "timezone/date range", "null/duplicate awareness", "dashboard query comparison", "SV2 metric handoff"],
        command: "docker compose exec postgres psql -U reporting -d dxlab -c 'select count(*) from orders;'\ndocker compose exec postgres psql -U reporting -d dxlab -c 'select status, count(*) from orders group by status;'\ndocker compose logs --tail=100 metabase\ndocker compose ps metabase postgres",
        where: "Run read-only SQL inside postgres using the reporting user. Exact table/column names belong to the project schema; replace examples only with documented real schema.",
        commandWhy: "Measure source rows/filters directly before editing dashboard questions.",
        expected: "A controlled business record can be found in source data; aggregate/filter result has a documented relationship to dashboard card; discrepancies name exact query/filter/timezone/state gap.",
        commandFailure: "Query wrong environment/schema, dashboard cache stale, old status filter, timezone mismatch, reporting lag, duplicate record or business definition undocumented.",
        guided: "For one KPI, choose a known record and trace API result→source row→read-only SQL aggregate→dashboard. Record expected/actual and source query/filter version.",
        independent: "Build an acceptance table for six KPIs with example business IDs, source tables, query validation, dashboard filter and owner. Do not fabricate business results.",
        integration: "If API creates row but dashboard misses it, verify DB/connection/filter/timezone first; then send SV2 a precise query/result evidence package for domain metric decision.",
        failure: "In a disposable dashboard question, use a stale status filter or wrong date boundary. Demonstrate source row exists, card misses it, correct only filter and regression check adjacent KPI cards.",
        errors: ["Use write account to inspect KPI", "Trust chart with no source query", "Ignore timezone/status", "Claim dashboard bug before row check", "Fix business definition without SV2"],
        selfChecks: ["What chain validates a KPI?", "Why use known business ID?", "What can healthy Metabase still get wrong?", "When escalate to SV2?"],
        evidence: ["test-result: source-row/query/dashboard comparison", "terminal-output: read-only aggregate evidence", "incident-report: incorrect KPI protocol"],
        requiredEvidence: ["test-result", "terminal-output", "incident-report"],
        quizConcept: "Dashboard correctness must be traced from a known source record through query/filter/aggregation to displayed value.",
        firstTest: "Find a known business ID in source data and compare its status/time/filter inclusion before editing a KPI query.",
        shortPrompt: "SQL operation that groups records by status is called what?",
        shortAnswer: "GROUP BY",
        shortExplanation: "GROUP BY partitions result rows into groups for aggregate calculation.",
        explainPrompt: "Explain source row→SQL filter/aggregate→dashboard lineage and why a healthy chart can still be wrong.",
        passExplanation: "data lineage and evidence-based KPI handoff",
        returnBlock: "source/query/filter/timezone validation",
      }),
      mission({
        id: "w5-m4-backup-checksum-protection",
        slug: "backup-checksum-protection",
        title: "Database Backup, Checksum & Protection",
        category: "Backup",
        skillId: "deployment",
        targetLevel: "L4",
        sourceType: official,
        competency: "PostgreSQL pg_dump, backup artifact/checksum, safe location, retention/access and no Git policy",
        keywords: ["backup", "pg_dump", "checksum", "sha256", "retention", "access", "restore", "postgres"],
        analogy: "Backup is a sealed copy of the ledger stored in another safe, with a checksum seal proving it has not changed. A file named backup on the same burning desk—or committed to Git—is not recovery protection.",
        easy: "Backup is not restore proof, but must be a real artifact with timestamp, scope, checksum, secure location and access policy. Use pg_dump from database service; do not dump secrets into issue/chat. Keep backup outside Git and never overwrite current production data during practice.",
        technical: "Logical PostgreSQL backup serializes database schema/data through pg_dump. A cryptographic checksum detects accidental artifact corruption/change but does not establish recoverability by itself. Backup policy defines location, permissions, retention, restore target and verification drill.",
        why: "SV1 owns operations/recovery coordination. Roadmap requires evidence that data can be protected and later restored, not a command copied into docs.",
        subtopics: ["logical backup scope", "pg_dump custom format", "timestamped naming", "checksum", "safe storage/access", "not Git", "retention", "backup manifest", "backup versus restore"],
        command: "docker compose exec -T postgres pg_dump -U dxlab -Fc dxlab > backup-w5.dump\nsha256sum backup-w5.dump\nGet-Item backup-w5.dump",
        where: "Run from a protected backup directory on the host, not repository root. On PowerShell use `Get-FileHash -Algorithm SHA256 backup-w5.dump`; never redirect a backup into tracked project files.",
        commandWhy: "Create a logical backup stream from Postgres, then record checksum/size as one artifact integrity evidence point.",
        expected: "Non-zero backup file, SHA-256 checksum and manifest with source/time/version/access/retention. The command does not modify database data.",
        commandFailure: "Shell creates empty file because container/credential fails, backup saved in Git tree, wrong DB, no free disk, checksum omitted, or backup contains sensitive data shared publicly.",
        guided: "Create a disposable lab backup outside repository, calculate hash, inspect non-zero size and write manifest. Immediately plan restore to a separate target—not active DB.",
        independent: "Review a proposed backup location against access/retention/no-Git/restore target rules and identify why a checksum alone is insufficient.",
        integration: "Correlate backup time with service/version/migration state. Tell SV2 what logical data/schema coverage exists; do not ask them to accept restore proof before separate target test.",
        failure: "Intentionally use invalid DB name or unwritable disposable directory. Capture command exit/stderr/size, identify whether no artifact or incomplete artifact exists, and fix destination/connection safely.",
        errors: ["Call backup a restore test", "Redirect dump into repo", "Ignore zero-byte output", "Use same active DB as restore target", "Send dump in public chat"],
        selfChecks: ["Checksum proves what and not what?", "Why backup outside Git?", "Where restore?", "Why record migration/version?"],
        evidence: ["terminal-output: sanitized pg_dump/hash/size", "config: backup manifest/access/retention policy", "explanation: backup versus restore proof"],
        requiredEvidence: ["terminal-output", "config", "explanation"],
        quizConcept: "A backup artifact needs checksum and protection, but recoverability is proven only by a separate-target restore plus smoke/data verification.",
        firstTest: "Check pg_dump exit status, non-zero artifact size and checksum before treating a backup as usable.",
        shortPrompt: "PostgreSQL logical backup command is what?",
        shortAnswer: "pg_dump",
        shortExplanation: "pg_dump exports PostgreSQL database contents in selectable logical formats.",
        explainPrompt: "Explain safe backup flow including location, checksum, access/retention and why no active DB overwrite occurs.",
        passExplanation: "backup artifact integrity and data-safety policy",
        returnBlock: "backup command/artifact validation or protection policy",
      }),
      mission({
        id: "w5-m5-restore-separate-target",
        slug: "restore-separate-target",
        title: "Restore Drill on a Separate Target",
        category: "Recovery",
        skillId: "fresh-machine",
        targetLevel: "L4",
        sourceType: official,
        competency: "Restore backup into new test DB/volume, migration if required, smoke, row-count comparison and no active DB overwrite",
        keywords: ["restore", "pg_restore", "separate target", "test database", "row count", "smoke", "recovery", "backup"],
        analogy: "Restore drill is rehearsing evacuation in a separate building. You do not bulldoze the building people are working in to see if the spare keys fit.",
        easy: "Restore into a named test database/volume, not source. Confirm target identity, create/clean only explicit disposable target, restore, apply necessary compatible migrations, run health/API smoke and compare meaningful counts/records. Keep source untouched.",
        technical: "Recovery verification restores a logical backup into an isolated database/storage target, then validates schema compatibility and representative data/application behavior. Row-count/known-record comparisons detect obvious restoration gaps; functional smoke verifies callers can use recovered state.",
        why: "This is Week 5 hard gate. A backup without a successful independent restore is unverified. SV1 must make target and destructive scope explicit before command execution.",
        subtopics: ["source versus restore target", "test DB/volume naming", "pg_restore custom format", "migration compatibility", "row count/known record comparison", "application smoke", "cleanup", "recovery report"],
        command: "docker compose exec -T postgres createdb -U dxlab dxlab_restore_test\ndocker compose exec -T postgres pg_restore -U dxlab -d dxlab_restore_test --clean --if-exists < backup-w5.dump\ndocker compose exec postgres psql -U dxlab -d dxlab_restore_test -c 'select count(*) from orders;'\ndocker compose exec postgres dropdb -U dxlab dxlab_restore_test",
        where: "Run from protected backup directory. Replace target only with a confirmed disposable `*_restore_test` database. Do not run --clean against active dxlab database.",
        commandWhy: "Explicitly create/restore/query/drop an isolated target and prevent ambiguous destructive scope.",
        expected: "Restore command completes against test DB; schema and representative counts match documented expectation; API/smoke can point to isolated target if designed; source database remains unchanged.",
        commandFailure: "Wrong target DB, incompatible dump/version, active connections, permissions, missing migration, row mismatch, or mistakenly testing only database connection rather than usable flow.",
        guided: "Use a backup from W5-M4. Write source/target names before commands, restore into separate test DB, compare two tables/one known business record, run read-only smoke, record report and cleanup only test target.",
        independent: "Design cross-machine restore checklist: artifact transfer/hash, target isolation, config changes, import, migrations, smoke, counts and permissions. State what needs owner approval.",
        integration: "If app supports DATABASE_URL override, run an isolated read-only Backend smoke against restore DB. Never send workflow writes at restored data unless test target is intentionally disposable.",
        failure: "Use a dump from before a known migration in test target. Diagnose schema mismatch, decide migration order with SV2 evidence, apply only to target and re-run smoke.",
        errors: ["Restore over source", "Use --clean with unverified DB name", "Skip hash", "Compare only one count", "Call restore success without app smoke"],
        selfChecks: ["Why separate target?", "What must be named before --clean?", "Why compare data and app smoke?", "When involve SV2?"],
        evidence: ["test-result: source/target restore report, count and smoke", "terminal-output: target-specific restore commands/output", "explanation: destructive-scope safety"],
        requiredEvidence: ["test-result", "terminal-output", "explanation"],
        quizConcept: "A restore drill is valid only when it targets isolated storage and verifies schema, representative data and functional smoke without changing the source database.",
        firstTest: "Confirm and print source/target identifiers before restore; refuse any --clean command whose target is not disposable.",
        shortPrompt: "PostgreSQL tool commonly used to restore custom pg_dump format is what?",
        shortAnswer: "pg_restore",
        shortExplanation: "pg_restore restores archives created in non-plain formats such as pg_dump custom format.",
        explainPrompt: "Describe an isolated restore drill from checksum to row comparison, app smoke and safe cleanup.",
        passExplanation: "recovery isolation, verification and destructive-scope control",
        returnBlock: "target isolation, restore/migration compatibility or verification report",
      }),
      mission({
        id: "w5-m6-operations-failure-recovery",
        slug: "operations-failure-recovery",
        title: "Operations Failure Drills: DB, Keycloak & n8n",
        category: "Incident Response",
        skillId: "troubleshooting",
        targetLevel: "L4",
        sourceType: official,
        competency: "DB down, Keycloak down, n8n timeout, evidence before restart, recovery and handoff protocol",
        keywords: ["incident", "database down", "keycloak down", "n8n timeout", "recovery", "logs", "health", "handoff"],
        analogy: "When a building loses water, security or mail service, the reception should identify which utility failed and who is affected—not switch every breaker off. Each drill needs symptom, proof, recovery and regression.",
        easy: "Run one failure at a time in a safe lab. DB down impacts Backend/workflow; Keycloak down impacts login/token refresh; n8n timeout may still mean Backend later processed work. Capture ps/health/log/port/dependency evidence before restart, restore exact service then verify dependent flows.",
        technical: "Operational incident response models dependency failure propagation. Controlled fault injection validates detection, evidence collection, service recovery, timeout/retry behavior and post-recovery regression. Root cause is the smallest causal contract/layer demonstrated by tests, not a symptom label.",
        why: "Week 5 requires recovery drills. SV1 must demonstrate calm, ordered action and correct ownership under demo pressure—not memorize a generic restart command.",
        subtopics: ["fault scope", "DB dependency chain", "IdP outage behavior", "workflow timeout ambiguity", "health/log/resource evidence", "recovery order", "correlation", "post-recovery regression"],
        command: "docker compose stop postgres\ndocker compose ps\ndocker compose logs --tail=150 backend\ndocker compose start postgres\ndocker compose exec postgres pg_isready -U dxlab -d dxlab\ncurl -fsS http://localhost:8000/health",
        where: "Disposable lab stack only, launched from Compose root. Announce impacted services and do not inject an outage into shared learner/production data during active work.",
        commandWhy: "Create isolated dependency stop, collect dependent evidence before recovery, then restore and verify readiness plus use case.",
        expected: "Symptom and dependent logs identify DB/IdP/workflow layer; recovery returns service readiness; caller functional smoke/retry behavior is verified rather than assumed.",
        commandFailure: "Restart all services, lose first log, delete data volume, misclassify 401 from Keycloak outage, retry writes without idempotency or declare recovery after container merely runs.",
        guided: "Run DB-down drill. Capture baseline, stop DB, observe Backend/workflow, restore DB, wait readiness, run health and one controlled function. Fill all nine incident fields.",
        independent: "Plan and execute either Keycloak-down or n8n-timeout drill with exact expected blast radius, no-secret evidence and recovery/owner handoff. Then compare to DB-down differences.",
        integration: "Use matrix to choose which owner receives issue after SV1 validates runtime/network/auth layer. If Backend business recovery logic fails after DB is healthy, hand off SV2 with correlation/log evidence.",
        failure: "Inject exactly one: stop Keycloak or delay/invalidate n8n upstream in disposable lab. Do not combine faults. Separate timeout from actual side effect via idempotency/audit trace.",
        errors: ["Stop all services together", "Restart before logs", "Use down -v", "Assume running equals recovered", "Retry unknown write with new key"],
        selfChecks: ["DB-down first checks?", "Keycloak-down differs how?", "Why timeout ambiguous?", "What verifies recovery?"],
        evidence: ["incident-report: all nine fields for one drill", "terminal-output: before/during/after status/health/log", "explanation: blast radius and owner handoff"],
        requiredEvidence: ["incident-report", "terminal-output", "explanation"],
        quizConcept: "Recovery requires evidence of dependency restoration and caller functional regression, not merely restarting a container.",
        firstTest: "Capture dependent service state/logs and exact symptom before starting the failed dependency again.",
        shortPrompt: "What should be collected before a restart when practical?",
        shortAnswer: "evidence",
        shortExplanation: "Evidence before a restart preserves the causal state needed for root-cause analysis.",
        explainPrompt: "Walk through DB-down and Keycloak-down blast radius, test order, recovery and regression differences.",
        passExplanation: "dependency recovery protocol and evidence-driven coordination",
        returnBlock: "incident evidence/recovery order or dependency blast-radius map",
      }),
      mission({
        id: "w5-m7-operations-runbook-release-readiness",
        slug: "operations-runbook-release-readiness",
        title: "Operations Runbook, Recovery Review & Weekly Gate",
        category: "Operations QA",
        skillId: "release",
        targetLevel: "L4",
        sourceType: official,
        competency: "Start/stop/health/log/backup/restore/common-failure runbook, recovery evidence, review and weekly operations gate",
        keywords: ["runbook", "operations", "backup", "restore", "health", "logs", "recovery", "release readiness"],
        analogy: "Runbook is the cockpit checklist. It tells a different capable person where to stand, which command to use, what normal output looks like, what can break data and what to do next. A command list without context is not a checklist.",
        easy: "Write operations docs based on commands actually tested: directory, expected output, data impact, env/port assumptions, cleanup and owner. Weekly review checks Service Matrix, six KPI validation, backup/restore report and failure drills before gate—not reading completion.",
        technical: "An operational runbook is a tested procedure that defines prerequisites, commands, expected observations, failure branches, data-safety constraints, recovery and verification. Review converts scattered evidence into auditable readiness criteria and regression inputs for release.",
        why: "W5 deliverable makes later fresh-machine/release possible. SV1 owns operative documentation, but modules retain their owners and all release-critical TBDs must be explicit.",
        subtopics: ["start/stop", "health/log commands", "service health matrix", "BI access/KPI validation", "backup/checksum", "separate restore", "common failure/recovery", "data safety and ownership"],
        command: "docker compose config\ndocker compose ps\ndocker compose logs --tail=100 backend\ncurl -fsS http://localhost:8000/health\ndocker compose exec -T postgres pg_dump -U dxlab -Fc dxlab > /safe/backup/demo.dump",
        where: "Commands belong in docs with an explicit repository/backup directory. `/safe/backup` is illustrative; use actual protected backup location and never create an arbitrary root path.",
        commandWhy: "A runbook must show exact scope and expected output for operating stack and backup—not only copy generic commands.",
        expected: "A peer can follow docs to start/health/log/backup/restore-test safely, identify data impact and escalate with evidence. Documents do not contain secret, personal path or untested command.",
        commandFailure: "Docs use a wrong directory/port/service, omit destructive warning, backup into Git, restoration overwrites source, command is never tested or owner boundary absent.",
        guided: "Write or update docs/operation.md and docs/backup-restore.md based on prior labs. Ask a peer/self-review pass to compare every command with actual Compose config and output.",
        independent: "Perform a 10-minute rehearsal: given service unhealthy, locate the runbook, collect evidence, select owner, recover in lab and record docs gap. Do not improve docs by hiding uncertainty.",
        integration: "Review runbook with SV2/SV3 interface owners: Backend/DB, Portal/AI service checks. Record exact TBD owner/deadline/source of truth if not yet frozen.",
        failure: "Plant one stale port/command in a copy of the runbook. Detect through `docker compose config`, correct it, and update regression checklist—not production config blindly.",
        errors: ["Copy docs commands never run", "No data impact warning", "Mix install/deploy/recovery scopes", "Store secret in examples", "Mark gate PASS without restore drill"],
        selfChecks: ["What every runbook command must state?", "What proves restore?", "Who owns a TBD?", "Why docs are release surface?"],
        evidence: ["config: tested runbook/backup references", "test-result: restore plus recovery rehearsal", "explanation: weekly operations gate and remaining blockers"],
        requiredEvidence: ["config", "test-result", "explanation"],
        quizConcept: "A runbook is only operational when its commands, scope, expected output, data impact, recovery and owner boundaries are tested and documented.",
        firstTest: "Cross-check each runbook command against resolved Compose/config and execute it safely in the stated directory/target.",
        shortPrompt: "What must a restore runbook name before destructive commands?",
        shortAnswer: "target",
        shortExplanation: "Naming and verifying the restore target prevents accidental overwrite of active data.",
        explainPrompt: "Explain why operations documentation, backup/restore drill and recovery incident evidence are all hard release inputs.",
        passExplanation: "tested operations runbook and recovery readiness",
        returnBlock: "runbook scope/data safety or missing recovery evidence",
      }),
    ],
  },
  {
    week: 6,
    previousMissionId: "w5-m7-operations-runbook-release-readiness",
    missions: [
      mission({
        id: "w6-m1-rag-architecture-boundary",
        slug: "rag-architecture-boundary",
        title: "RAG Architecture & SV1/SV3 Boundary",
        category: "RAG Architecture",
        skillId: "rag-architecture",
        targetLevel: "L2",
        sourceType: official,
        competency:
          "Document→chunk→embedding→Qdrant→retrieval→context→Ollama/LLM→answer/sources architecture and owner boundary",
        keywords: [
          "rag",
          "document",
          "chunk",
          "embedding",
          "qdrant",
          "retrieval",
          "ollama",
          "sources",
        ],
        analogy:
          "RAG is a librarian workflow: documents are divided into cards, catalogued by similarity, relevant cards are retrieved, then a writer reads them before answering. SV1 keeps the library building, network and electricity working; SV3 decides card-cutting, search strategy and writing quality.",
        easy:
          "RAG is not just a chat model. It depends on corpus, chunks, embedding, vector store, retrieval, prompt/context and model. SV1 checks containers, URL/DNS, collection, model, storage/resource and health. SV3 owns chunk quality, retrieval choice, prompt and answer quality.",
        technical:
          "Retrieval-augmented generation indexes embedded document chunks in a vector database, retrieves candidate context for a query, and supplies it to an LLM for response generation. Infrastructure availability/configuration is distinct from retrieval relevance and model reasoning behavior.",
        why:
          "A clear boundary prevents SV1 wasting time editing prompts when Qdrant/Ollama is down and prevents SV3 receiving vague AI broken reports without dependency evidence.",
        subtopics: [
          "corpus/chunk/embedding/vector concept",
          "Qdrant collection/payload",
          "retrieval/context/answer/sources",
          "service dependency graph",
          "SV1 infra duties",
          "SV3 functional/algorithm duties",
          "handoff evidence",
        ],
        command:
          "docker compose config\ndocker compose ps qdrant ollama rag\ndocker compose logs --tail=100 rag\ncurl -fsS http://localhost:6333/healthz\ncurl -fsS http://localhost:11434/api/tags",
        where:
          "Host terminal at Compose root. Ports are examples from the roadmap; rely on frozen project URL map and do not expose Qdrant/Ollama publicly without explicit design.",
        commandWhy:
          "Check each infrastructure dependency independently before judging retrieval or answer behavior.",
        expected:
          "The map identifies RAG→Qdrant/Ollama dependencies; each service has hostname/port/network/env/health/log/owner; collection/model readiness remain distinct from process state.",
        commandFailure:
          "Treat a generated answer as proof all infrastructure is healthy, confuse collection with model, call internal service from browser, or assign prompt/retrieval implementation to SV1.",
        guided:
          "Draw the full RAG chain and label which component creates/holds each artifact. For each arrow state SV1 first check and exact handoff condition to SV3.",
        independent:
          "Given answer has poor relevance but all dependency checks pass, build an SV3 handoff using health/log/URL/collection/model evidence and explicitly exclude algorithm ownership.",
        integration:
          "Trace Browser/Portal→RAG service→Qdrant/Ollama and associated auth. Test service reachability separately from an evaluation question; preserve source/corpus access boundary.",
        failure:
          "Stop Qdrant in a disposable stack, observe RAG error, collect dependency evidence, restore it and explain why this is SV1 infra rather than retrieval-quality work.",
        errors: [
          "Call RAG one black box",
          "Change prompt before checking dependency",
          "Expose Qdrant collection publicly",
          "Claim embedding math ownership",
          "Skip corpus safety",
        ],
        selfChecks: [
          "RAG stages?",
          "Where does SV1 stop?",
          "Qdrant versus Ollama role?",
          "What proves quality differs from availability?",
        ],
        evidence: [
          "explanation: RAG dependency/ownership map",
          "terminal-output: service health endpoints/status",
          "incident-report: dependency failure and SV3 handoff",
        ],
        requiredEvidence: ["explanation", "terminal-output", "incident-report"],
        quizConcept:
          "SV1 owns RAG infrastructure readiness and dependency triage, while SV3 owns retrieval strategy, prompt and answer-quality reasoning.",
        firstTest:
          "Check RAG process/health, Qdrant reachability/collection and Ollama reachability/model before examining retrieval quality.",
        shortPrompt: "Vector database service in this roadmap is what?",
        shortAnswer: "Qdrant",
        shortExplanation:
          "Qdrant stores/querys vector collections and associated payloads for RAG retrieval.",
        explainPrompt:
          "Explain document→chunk→embedding→Qdrant→retrieval→context→Ollama and mark SV1 versus SV3 boundaries.",
        passExplanation: "RAG dependency graph and role boundary",
        returnBlock: "RAG architecture or SV1/SV3 ownership map",
      }),
      mission({
        id: "w6-m2-qdrant-deployment-persistence",
        slug: "qdrant-deployment-persistence",
        title: "Qdrant Deployment, Collections & Persistence",
        category: "Qdrant",
        skillId: "qdrant",
        targetLevel: "L3",
        sourceType: official,
        competency:
          "Qdrant container, port 6333, Docker network, QDRANT_URL, collection/vector/payload concept, volume, persistence, logs and health",
        keywords: [
          "qdrant",
          "collection",
          "vector",
          "payload",
          "volume",
          "persistence",
          "health",
          "qdrant_url",
        ],
        analogy:
          "Qdrant is a specialized card catalogue: collection is one catalogue, vector is a similarity address for a card, payload is readable card metadata and volume is the locked archive that survives when the desk is replaced.",
        easy:
          "SV1 deploys Qdrant on private Docker network, checks health/URL/logs, verifies collection exists and data persists through recreate. SV1 does not tune embedding dimension/retrieval score without SV3 decision; but dimension mismatch shows as contract error to hand off with evidence.",
        technical:
          "Qdrant stores vector points organized in collections with vectors and payload metadata. It exposes HTTP APIs and persists data through configured storage. Client configuration uses a QDRANT_URL endpoint reachable within the service network; collection configuration must match embedding producer contract.",
        why:
          "A reachable Qdrant service with missing collection/volume is a common RAG outage. SV1 must prove stateful AI service durability without overreaching into retrieval algorithms.",
        subtopics: [
          "Qdrant image/version pin",
          "internal port/network",
          "QDRANT_URL",
          "collection/point/vector/payload concepts",
          "health/API",
          "named volume",
          "recreate persistence",
          "dimension mismatch handoff",
        ],
        command:
          "docker compose ps qdrant\ncurl -fsS http://localhost:6333/healthz\ncurl -fsS http://localhost:6333/collections\ndocker compose logs --tail=100 qdrant\ndocker volume inspect dxlab_qdrant_data",
        where:
          "Host terminal at Compose root. If 6333 is internal-only, run curl from an approved debug container on same network rather than publishing it just for testing.",
        commandWhy:
          "Observe runtime state, health, collection list, logs and persistence mount without assuming the Browser should access the service.",
        expected:
          "Qdrant returns health and collection metadata; volume mapping is explicit; a documented test collection/point remains after controlled container recreation.",
        commandFailure:
          "Wrong QDRANT_URL host/port, no shared network, collection absent, volume wrong/anonymous, incompatible vector size or Qdrant admin port exposed unnecessarily.",
        guided:
          "Deploy a pinned Qdrant service with named volume. Create/inspect one disposable collection through agreed tool/API, recreate only Qdrant container and prove collection persists. Record endpoint scope.",
        independent:
          "Review QDRANT_URL from RAG container context and explain evidence that distinguishes DNS failure, healthy-but-missing collection and dimension contract mismatch.",
        integration:
          "Check RAG service resolves qdrant by service name/internal port; use collection health/state to hand SV3 exactly what is missing if ingest/retrieval fails.",
        failure:
          "Change QDRANT_URL to localhost or detach RAG from network in a disposable config. Collect DNS/TCP/health/log evidence, restore correct network and run collection persistence regression.",
        errors: [
          "Use localhost from RAG container",
          "Expose Qdrant public by default",
          "Delete volume to fix collection",
          "Treat empty collection as healthy functional RAG",
          "Tune retrieval settings as SV1",
        ],
        selfChecks: [
          "Collection versus vector/payload?",
          "Why named volume?",
          "When publish port?",
          "How classify dimension mismatch?",
        ],
        evidence: [
          "terminal-output: health/collections/log/volume evidence",
          "config: QDRANT_URL/network/volume contract",
          "incident-report: URL/network/missing-collection triage",
        ],
        requiredEvidence: ["terminal-output", "config", "incident-report"],
        quizConcept:
          "Qdrant is a stateful vector service whose reachable URL, collection state and persistent volume must all be verified independently.",
        firstTest:
          "From RAG network context resolve qdrant, reach its internal health API and inspect required collection before changing retrieval code.",
        shortPrompt:
          "Qdrant logical container for vectors and payloads is called what?",
        shortAnswer: "collection",
        shortExplanation:
          "A Qdrant collection groups points/vectors/payloads under one configuration.",
        explainPrompt:
          "Explain QDRANT_URL, service DNS, collection/payload and named-volume persistence in one RAG dependency chain.",
        passExplanation: "Qdrant network/state/persistence evidence",
        returnBlock: "QDRANT_URL/network, collection state or persistence mount",
      }),
      mission({
        id: "w6-m3-ollama-model-resources",
        slug: "ollama-model-resources",
        title: "Ollama Service, Models & Resource Awareness",
        category: "Ollama",
        skillId: "ollama",
        targetLevel: "L3",
        sourceType: official,
        competency:
          "Ollama port 11434, model pull/list, model storage, API, CPU/RAM/GPU awareness, logs and healthy versus model exists",
        keywords: [
          "ollama",
          "model",
          "pull",
          "api",
          "11434",
          "cpu",
          "ram",
          "gpu",
          "storage",
        ],
        analogy:
          "Ollama service is a kitchen with power on; a model is an ingredient box. Kitchen being open does not mean the required ingredient is stocked. Running a large recipe can exhaust counter space/RAM even though the kitchen health check is green.",
        easy:
          "Check service reachability and separately list required pinned model. Model first pull/storage may take time and resource. SV1 observes container/URL/network/logs/resources/model availability; SV3 chooses model/quality unless frozen contract says exact model.",
        technical:
          "Ollama exposes a local model-serving API and maintains model artifacts in storage. Service process health, HTTP reachability and model inventory are separate conditions. Inference resource demand depends on model/runtime/hardware and must be measured against local baseline rather than assumed.",
        why:
          "RAG/Agent can return service errors despite Ollama running when model absent or resources exhausted. SV1 needs actionable infrastructure evidence before handoff.",
        subtopics: [
          "pinned image/model",
          "internal URL/11434",
          "api/tags model inventory",
          "model pull/storage volume",
          "CPU/RAM/GPU awareness",
          "logs",
          "healthy vs model exists",
          "resource baseline",
        ],
        command:
          "docker compose ps ollama\ncurl -fsS http://localhost:11434/api/tags\ndocker compose logs --tail=100 ollama\ndocker stats --no-stream ollama\ndocker volume inspect dxlab_ollama_data",
        where:
          "Host terminal at Compose root or debug container on internal network. Do not publish Ollama to public Internet without designed auth boundary.",
        commandWhy:
          "Check process, API, exact model inventory, logs, resources and persistence—not only a container green state.",
        expected:
          "Tags endpoint shows expected pinned model after controlled pull; storage volume is documented; resource snapshot distinguishes idle versus inference behavior.",
        commandFailure:
          "Wrong OLLAMA_BASE_URL, model not pulled, model name/tag typo, no storage volume, OOM, unavailable GPU assumption, public unauthenticated exposure or huge model selected without capacity evidence.",
        guided:
          "Start a pinned Ollama service, list tags, pull one project-selected demo model only if environment supports it, record storage/resource baseline then restart/recreate and verify inventory persistence.",
        independent:
          "Prepare an infrastructure handoff for Ollama responds but answer quality poor: prove URL/model/resource/log basics and state explicitly why prompt/model choice is SV3 functional ownership.",
        integration:
          "From RAG container test OLLAMA_BASE_URL reachability and required model name. Monitor resource during one safe generation; do not commit downloaded model artifacts or fake a GPU requirement.",
        failure:
          "Set OLLAMA_MODEL to absent model in disposable RAG env. Capture tags/error/logs, pull/restore only approved model and regression-test restart plus RAG health.",
        errors: [
          "Equate API health with model availability",
          "Use latest model name silently",
          "Expose 11434 publicly",
          "Assume GPU exists",
          "Blame prompt before checking model absent",
        ],
        selfChecks: [
          "Service healthy vs model exists?",
          "Where models persist?",
          "Why measure resource?",
          "Who owns model quality selection?",
        ],
        evidence: [
          "terminal-output: tags/logs/stats/volume",
          "config: OLLAMA_BASE_URL/model contract without secret",
          "incident-report: missing model/resource triage",
        ],
        requiredEvidence: ["terminal-output", "config", "incident-report"],
        quizConcept:
          "An Ollama process can be reachable while the required model is absent; model inventory and resource evidence are independent readiness checks.",
        firstTest:
          "Call the model-list endpoint and compare exact required model name to frozen environment/manifest before modifying RAG code.",
        shortPrompt:
          "Ollama endpoint commonly used to list locally available models is what path?",
        shortAnswer: "/api/tags",
        shortExplanation:
          "The /api/tags endpoint returns model inventory metadata for an Ollama service.",
        explainPrompt:
          "Explain Ollama URL/model/storage/resource chain and why health does not prove required model is usable.",
        passExplanation:
          "model inventory/persistence/resource infrastructure evidence",
        returnBlock:
          "Ollama service URL, model availability, storage or resource baseline",
      }),
      mission({
        id: "w6-m4-rag-service-env-health",
        slug: "rag-service-env-health",
        title: "RAG Service Configuration, Health & Dependency Contract",
        category: "RAG Service",
        skillId: "rag-infra",
        targetLevel: "L3",
        sourceType: official,
        competency:
          "RAG service container, QDRANT_URL/OLLAMA_BASE_URL/env contract, health/readiness, logs, internal network and error classification",
        keywords: [
          "rag service",
          "qdrant_url",
          "ollama_base_url",
          "health",
          "environment",
          "network",
          "logs",
          "dependencies",
        ],
        analogy:
          "RAG service is a dispatcher who needs two phone numbers: catalogue room Qdrant and kitchen Ollama. If either number is wrong, dispatcher may stand ready but cannot complete an answer.",
        easy:
          "RAG health should reveal no secret but clearly distinguish basic process from dependency readiness when project defines it. Config validates required URLs/model/collection at startup or controlled request. Inside container, localhost is self, not Qdrant/Ollama.",
        technical:
          "A RAG service composes dependent endpoints and application configuration. Its health/readiness semantics should be explicit: process liveness, configuration validity and dependency connectivity may be separate. Structured errors/logs enable routing issues to infrastructure versus functional RAG logic.",
        why:
          "SV1 needs to tell whether failure is wrong URL, DNS/network, collection, model or resource before escalating. This mission makes dependency configs visible and testable.",
        subtopics: [
          "RAG service host/port",
          "QDRANT_URL",
          "OLLAMA_BASE_URL",
          "collection/model names",
          "startup validation",
          "health/readiness",
          "dependency logs",
          "public/internal route boundary",
        ],
        command:
          "docker compose config\ndocker compose ps rag qdrant ollama\ndocker compose exec rag sh -lc 'getent hosts qdrant && getent hosts ollama'\ndocker compose logs --tail=150 rag\ncurl -i http://localhost:8090/health",
        where:
          "Compose root. rag/port 8090 are examples; use actual frozen service name and external health route. DNS checks run inside RAG container or approved debug image.",
        commandWhy:
          "Validate resolved config, running dependencies, RAG-network DNS, RAG log and external health individually.",
        expected:
          "Required config names resolve to internal services; health reports documented safe state; log identifies which dependency fails if readiness incomplete.",
        commandFailure:
          "Missing env, localhost URLs, service network mismatch, collection/model typo, health endpoint masks dependency failure, external proxy target wrong or secrets printed in config/log.",
        guided:
          "Build env matrix for RAG: variable, consumer, secret/no, expected host/port, validation and owner. Start stack, verify DNS/health/log and document running versus dependency-ready state.",
        independent:
          "Create test order for 500 on answer: RAG process→RAG health→Qdrant URL/DNS/collection→Ollama URL/model/resource→only then SV3 retrieval/prompt handoff.",
        integration:
          "Make one safe RAG smoke query with an expected source behavior. If infra checks pass but answer relevance fails, hand off SV3 with exact dependency evidence and evaluation input.",
        failure:
          "Misspell QDRANT_URL service name or unset OLLAMA_BASE_URL in disposable env. Capture validation/log/DNS output, fix single variable and run dependency plus answer smoke regression.",
        errors: [
          "Use localhost dependencies",
          "Hide config error behind generic 500",
          "Make health leak URL/token",
          "Call model endpoint from browser",
          "Diagnose prompt before config",
        ],
        selfChecks: [
          "What vars drive dependencies?",
          "Why separate liveness/readiness?",
          "Where run DNS?",
          "When SV3 handoff?",
        ],
        evidence: [
          "config: redacted RAG dependency env matrix",
          "terminal-output: config/DNS/health/log checks",
          "incident-report: missing/miswired dependency protocol",
        ],
        requiredEvidence: ["config", "terminal-output", "incident-report"],
        quizConcept:
          "RAG configuration must make Qdrant/Ollama URLs, collection/model and readiness observable; container localhost never reaches peer services.",
        firstTest:
          "From RAG context resolve dependencies and compare its resolved env contract before changing health/prompt code.",
        shortPrompt:
          "Container hostname for a peer service should normally be what in Compose?",
        shortAnswer: "service name",
        shortExplanation:
          "Compose embedded DNS resolves a peer service by its declared service name on the shared network.",
        explainPrompt:
          "Explain a RAG 500 test order from RAG process through Qdrant/Ollama to SV3 algorithm handoff.",
        passExplanation:
          "RAG dependency env/network/readiness contract",
        returnBlock: "RAG env/DNS/health or dependency test order",
      }),
      mission({
        id: "w6-m5-rag-infra-incident-handoff",
        slug: "rag-infra-incident-handoff",
        title: "RAG Infrastructure Incident & SV3 Handoff",
        category: "Troubleshooting",
        skillId: "troubleshooting",
        targetLevel: "L4",
        sourceType: official,
        competency:
          "Qdrant down/collection missing/Ollama down/model missing/RAG env/RAM failure injection and correct handoff",
        keywords: [
          "rag incident",
          "qdrant down",
          "collection missing",
          "ollama down",
          "model missing",
          "ram",
          "handoff",
          "debug",
        ],
        analogy:
          "When an answer desk fails, first find which shelf, phone line or kitchen is absent. If all physical dependencies are working but librarian picks poor books, send a precise case to the librarian—not dismantle the building.",
        easy:
          "Use nine-step protocol. Consider one layer at a time: RAG service, Qdrant reachability/collection, Ollama reachability/model, resource. Fix only demonstrated infra root cause. If all pass and answer quality/retrieval fails, owner is SV3 with your evidence.",
        technical:
          "Dependency-chain incident analysis isolates liveness, network, configuration, persistent state and resource faults with discriminating tests. Escalation quality is determined by reproducible symptom, collected evidence, eliminated infrastructure hypotheses and clear expected/actual behavior.",
        why:
          "This is the Week 6 practical competency and Boss Fight preparation. It protects role boundary and ensures AI problems get solved at the correct layer.",
        subtopics: [
          "dependency tree",
          "service/health/log",
          "DNS/TCP/env",
          "collection/model state",
          "CPU/RAM",
          "safe fault injection",
          "incident protocol",
          "SV3 handoff template",
        ],
        command:
          "docker compose ps rag qdrant ollama\ndocker compose logs --tail=200 rag\ndocker compose logs --tail=100 qdrant\ndocker compose logs --tail=100 ollama\ndocker stats --no-stream\ncurl -fsS http://localhost:6333/collections\ncurl -fsS http://localhost:11434/api/tags",
        where:
          "Host at Compose root; run only controlled single-fault drill in a disposable lab. Do not delete collections/models/volumes as a generic debugging tactic.",
        commandWhy:
          "Collect state/log/resource plus separate Qdrant/Ollama evidence before changing configuration or restarting.",
        expected:
          "Incident report names one evidence-supported layer, a minimal fix, verification and regression. It identifies SV3 handoff only after infrastructural chain passes.",
        commandFailure:
          "Inject multiple faults, use output without timestamp/ID, delete vector volume, confuse missing model with prompt quality, fail to measure resource or hand off without reproduction.",
        guided:
          "Inject a missing-model or wrong-QDRANT_URL fault. Follow full protocol, then write a contrasting handoff for a hypothetical relevance issue after all infra checks are green.",
        independent:
          "Attempt Boss Fight #rag-06 cleanly. If not clean, retain assistance label and still write a correct post-incident regression plan.",
        integration:
          "Capture RAG request correlation, dependent service health/log and expected source behavior. Route prompt/retrieval/chunk/eval defect to SV3; route service/network/env/collection/model/resource to SV1.",
        failure:
          "Stop Qdrant, remove test collection or set absent model one at a time in lab. Restore from documented setup, not destructive re-ingestion guesswork, then rerun health and safe query.",
        errors: [
          "Change prompt first",
          "Delete collection/volume reflex",
          "Call AI issue no owner",
          "Skip logs/resource",
          "Mark assisted answer clean PASS",
        ],
        selfChecks: [
          "Which root causes SV1 owns?",
          "Which go SV3?",
          "First command set?",
          "Why one fault?",
        ],
        evidence: [
          "incident-report: full nine-step RAG fault",
          "terminal-output: dependency/log/resource evidence",
          "explanation: SV1/SV3 handoff boundary",
        ],
        requiredEvidence: ["incident-report", "terminal-output", "explanation"],
        quizConcept:
          "RAG infra triage proves service/network/env/collection/model/resource first, then hands prompt/retrieval/reasoning quality to SV3 with evidence.",
        firstTest:
          "Collect RAG/Qdrant/Ollama state, logs, URLs/collections/tags and resources in one ordered evidence snapshot.",
        shortPrompt:
          "If all infrastructure checks pass but retrieved chunks are irrelevant, primary owner is who?",
        shortAnswer: "SV3",
        shortExplanation:
          "Retrieval/chunk/prompt/answer-quality logic is SV3 ownership after SV1 validates infrastructure.",
        explainPrompt:
          "Explain the RAG incident decision tree and write the boundary between SV1 infra fix and SV3 functional handoff.",
        passExplanation:
          "single-layer evidence triage and correct AI ownership handoff",
        returnBlock:
          "dependency evidence, root-cause isolation or SV1/SV3 boundary",
      }),
      mission({
        id: "w6-m6-corpus-safety-rag-evaluation",
        slug: "corpus-safety-rag-evaluation",
        title: "Corpus Safety, RAG Evaluation & Infrastructure Release Evidence",
        category: "AI Operations",
        skillId: "security-review",
        targetLevel: "L3",
        sourceType: official,
        competency:
          "Corpus manifest/checksum/access role, secret/PII exclusion, 10–20 RAG test questions, source awareness and AI infra report",
        keywords: [
          "corpus",
          "manifest",
          "checksum",
          "pii",
          "secret",
          "evaluation",
          "rag",
          "sources",
          "access role",
        ],
        analogy:
          "Before putting books in a public reading room, check that none contain private letters, keys or misleading signs that tell staff what to do. A manifest is the library inventory and checksum is a seal for each book version.",
        easy:
          "Before ingest, exclude secrets, unnecessary PII, temporary files and unapproved sources. Record source/version/access role/checksum. SV3 evaluates retrieval/answer quality; SV1 makes corpus storage/access/ingestion reproducible and safe, and supports 10–20 test questions as infrastructure evidence.",
        technical:
          "Corpus governance maintains provenance, version, integrity and access constraints for ingested source material. Evaluation sets measure expected behavior against controlled questions/sources. Retrieved text is data, not trusted executable instruction, which constrains prompt-injection and secret-exfiltration risks.",
        why:
          "AI infra becomes release surface in Week 6. Safety/evaluation evidence avoids hidden corpus risk and makes later Agent red-team viable without giving SV1 algorithm ownership.",
        subtopics: [
          "source provenance/version",
          "checksum/manifest",
          "access roles",
          "secret/PII/temp exclusion",
          "ingestion report",
          "10–20 evaluation questions",
          "source attribution",
          "retrieved text untrusted",
        ],
        command:
          "sha256sum corpus-manifest.json\ndocker compose logs --tail=150 rag\ncurl -fsS http://localhost:6333/collections\ndocker stats --no-stream rag qdrant ollama\ndocker compose config",
        where:
          "Run checks in versioned corpus/operations directory and Compose root. Do not print private source documents or secrets in terminal/Evidence Vault.",
        commandWhy:
          "Verify manifest integrity, ingest/dependency logs, collection state, resource snapshot and frozen service config.",
        expected:
          "Manifest lists approved source/version/checksum/access role; no prohibited files; evaluation set has 10–20 questions with expected source behavior; report distinguishes infra from answer-quality result.",
        commandFailure:
          "Unreviewed corpus, checksum recorded after change, PII/secret copied, source access missing, test questions too vague, RAG source not shown or model output treated as instruction.",
        guided:
          "Create a small approved corpus manifest and 10-question evaluation set. Run ingestion in lab, record collection/model/env/resource facts, and identify which evaluation conclusion belongs to SV3.",
        independent:
          "Audit a candidate document list for secret/PII/temp/version/access risks. Make accept/reject decisions with reasons and define safe escalation for unclear ownership.",
        integration:
          "Coordinate corpus source/roles with SV3 and security owner. Test source metadata through RAG service if supported; do not expose Qdrant collection to Browser just for traceability.",
        failure:
          "Place a synthetic secret marker in a proposed corpus list—not real secret—and demonstrate manifest review rejects it before ingest. If injected in disposable test, remove/rebuild only documented test collection and record prevention.",
        errors: [
          "Treat retrieved text as trusted instruction",
          "Ingest .env/log dumps",
          "Use corpus with no manifest",
          "Claim answer quality test belongs SV1",
          "Expose collection for source proof",
        ],
        selfChecks: [
          "What must corpus manifest have?",
          "Why checksum?",
          "Who owns retrieval quality?",
          "How handle injected secret marker?",
        ],
        evidence: [
          "config: corpus manifest/eval set reference",
          "test-result: 10–20 question infra/eval report",
          "explanation: corpus safety and SV1/SV3 evaluation boundary",
        ],
        requiredEvidence: ["config", "test-result", "explanation"],
        quizConcept:
          "RAG corpus safety requires provenance, version/checksum, access policy and exclusion of secrets/PII; evaluation distinguishes infrastructure evidence from retrieval-quality ownership.",
        firstTest:
          "Review approved manifest and exclusion rules before ingestion, then confirm collection/model/resource state after a controlled run.",
        shortPrompt:
          "Data retrieved from a corpus should be treated as what, not an instruction?",
        shortAnswer: "untrusted data",
        shortExplanation:
          "Retrieved content can contain malicious or irrelevant text and must not override system/tool security rules.",
        explainPrompt:
          "Explain corpus manifest, safety review, evaluation set and the handoff boundary between SV1 infrastructure and SV3 answer quality.",
        passExplanation:
          "safe reproducible corpus and RAG infrastructure evidence",
        returnBlock:
          "corpus governance, collection/model validation or role boundary",
      }),
    ],
  },
  {
    week: 7,
    previousMissionId: "w6-m6-corpus-safety-rag-evaluation",
    missions: [
      mission({
        id: "w7-m1-agent-tool-architecture",
        slug: "agent-tool-architecture",
        title: "Agent, Tool Calling & Security Architecture",
        category: "Agent Architecture",
        skillId: "agent-architecture",
        targetLevel: "L2",
        sourceType: official,
        competency:
          "Agent→tool selection→schema→args validation→Backend API architecture and AI is not superuser",
        keywords: [
          "agent",
          "tool calling",
          "schema",
          "validation",
          "backend api",
          "security",
          "ai",
          "superuser",
        ],
        analogy:
          "An Agent is a clerk who proposes a form to a controlled counter. The counter checks form shape, identity, permission and allowed result. Clerk is never given the warehouse master key or unrestricted SQL terminal.",
        easy:
          "Agent selects a named tool with structured args. Tool schema validates shape/limits. Backend authenticates/authorizes and applies business rules. Agent cannot direct write database, choose arbitrary endpoint, self-approve or bypass HITL. SV1 owns integration/security checks; SV3 owns Agent reasoning/UX.",
        technical:
          "Tool-mediated agent architecture constrains model output to declared schemas and server-side operations. Defense in depth combines tool allowlists, argument validation, service/user authentication, Backend authorization, least privilege, audited outcomes and human approval for sensitive state transitions.",
        why:
          "Week 7 hard gate requires zero HITL/RBAC bypass and no secret exposure. Architecture clarity prevents a demo implementation from turning AI into a privileged integration backdoor.",
        subtopics: [
          "agent versus tool/service",
          "allowlisted tool schema",
          "argument validation",
          "Backend API boundary",
          "auth/RBAC",
          "no arbitrary SQL",
          "no self approve",
          "audit/HITL chain",
        ],
        command:
          "docker compose config\ndocker compose ps agent rag backend\ndocker compose logs --tail=100 agent\ncurl -fsS http://localhost:8000/openapi.json\ncurl -i http://localhost:8100/health",
        where:
          "Host terminal at Compose root. Agent service port/path are illustrative; use frozen contract and do not expose admin/tool endpoints beyond intended boundary.",
        commandWhy:
          "Verify service inventory/config/log/health and compare controlled tool destination with Backend API contract.",
        expected:
          "Architecture diagram shows Agent→controlled tool→Backend API→policy/audit/HITL; no direct DB path or approval tool. Agent service has owner/network/auth/health/log contract.",
        commandFailure:
          "Tool can call arbitrary URL/SQL, schema missing limits, Agent uses admin credential, Backend trusts Agent claim blindly, audit omitted or direct approve capability exists.",
        guided:
          "Draw tool call chain for one read and one write proposal. Mark where each validation/authorization/audit state occurs and who owns reasoning versus infrastructure/security.",
        independent:
          "Review a proposed execute SQL tool against roadmap. Reject it with security/ownership evidence and propose a narrow read API contract instead.",
        integration:
          "Trace Agent service network/auth to RAG and Backend. Test only health/controlled safe endpoint; route model tool-selection/prompt logic to SV3 after infra boundary passes.",
        failure:
          "In a mock config, attempt tool URL set from user input or direct database path. Identify missing allowlist/schema/Backend enforcement and restore controlled contract.",
        errors: [
          "Call Agent trusted because prompt says so",
          "Use arbitrary SQL tool",
          "Give agent admin token",
          "Put approval in Agent",
          "Ignore audit",
        ],
        selfChecks: [
          "Why AI not superuser?",
          "Where validate args?",
          "Who enforces RBAC?",
          "What ownership remains SV3?",
        ],
        evidence: [
          "explanation: Agent security chain diagram",
          "config: tool/endpoint/auth contract",
          "incident-report: attempted boundary bypass",
        ],
        requiredEvidence: ["explanation", "config", "incident-report"],
        quizConcept:
          "Agent output must flow through allowlisted schema validation and Backend authorization; the model is never a security principal with unrestricted power.",
        firstTest:
          "Inspect tool allowlist/schema and Backend endpoint authorization before testing any model-generated action.",
        shortPrompt:
          "Which layer is the real policy enforcement point for an Agent tool action?",
        shortAnswer: "Backend",
        shortExplanation:
          "Backend authentication/authorization and business policy must enforce the action independently of Agent output.",
        explainPrompt:
          "Explain Agent→tool schema→args validation→Backend auth/RBAC→DRAFT/PENDING→HITL chain.",
        passExplanation:
          "controlled Agent architecture and security ownership boundary",
        returnBlock: "tool/Backend security chain or AI role boundary",
      }),
      mission({
        id: "w7-m2-read-tool-schema-validation",
        slug: "read-tool-schema-validation",
        title: "Read Tools: Schema, Limits, Auth & Audit",
        category: "Agent Tools",
        skillId: "tool-calling",
        targetLevel: "L3",
        sourceType: official,
        competency:
          "Read tool such as get_low_stock_products, argument schema/limits, authorization, row limit and audit",
        keywords: [
          "read tool",
          "schema",
          "validation",
          "row limit",
          "authorization",
          "audit",
          "low stock",
          "agent",
        ],
        analogy:
          "A read tool is a librarian request form: it asks for a narrow catalogue search with page limit. It does not let the clerk walk into every archive room or photocopy the entire ledger.",
        easy:
          "Define tool name, purpose, typed arguments, allowed range, max rows, actor role, safe error and audit summary. Backend validates even if Agent schema validates. Return only necessary fields; do not send secret/PII/log dumps to model by default.",
        technical:
          "A secure read tool exposes a constrained API operation with an explicit input schema, server-side revalidation, authorization policy, pagination/row limits and data-minimized response. Audit logs actor, tool, sanitized args, result summary, correlation and latency where useful.",
        why:
          "Read tools are safest starting point for Agent integration, but can still leak data or overload systems without limits/auth/audit. SV1 checks gateway/security, not business query semantics.",
        subtopics: [
          "tool purpose/name",
          "typed args/defaults",
          "range/row limit",
          "server revalidation",
          "role/tenant scope",
          "safe response fields",
          "audit fields",
          "error/timeout behavior",
        ],
        command:
          "curl -i http://localhost:8000/api/tools/low-stock\ndocker compose logs --tail=150 backend\ndocker compose logs --tail=150 agent\ndocker compose config\ncurl -i http://localhost:8100/health",
        where:
          "Host terminal at Compose root; use secure authorized test setup. Evidence may show status/count/field names but never production data, bearer token or full tool payload.",
        commandWhy:
          "Observe no-auth/allowed/denied behavior and correlate Agent/Backend audit around a constrained tool endpoint.",
        expected:
          "No auth/invalid args are rejected safely; allowed caller receives bounded fields/count; row-limit and audit are visible; Agent cannot expand tool beyond schema.",
        commandFailure:
          "Tool accepts arbitrary filter/SQL, no max rows, backend trusts client model input, wrong role passes, audit logs raw sensitive arguments or endpoint leaks stack trace.",
        guided:
          "Specify get_low_stock_products with fields, threshold range, maxRows, required role and audit summary. Test invalid threshold, too-large limit, missing token and allowed safe call.",
        independent:
          "Review one read-tool schema for abuse cases: huge result, negative/NaN range, cross-role data, injection-like string, timeout. Design test and expected safe response.",
        integration:
          "Validate Agent→Backend service auth and user-role propagation. If query business meaning is disputed, hand SV2 the sanitized endpoint/input/result expectation after security path passes.",
        failure:
          "Remove row limit or make threshold accept arbitrary string in mock schema. Prove server revalidation rejects it, restore bounded input and regression-test agent invocation.",
        errors: [
          "Trust schema only in Agent",
          "Return whole table",
          "No role check for read",
          "Audit raw sensitive payload",
          "Treat read as harmless always",
        ],
        selfChecks: [
          "Why server revalidate?",
          "Why max rows?",
          "What audit fields?",
          "What response data minimized?",
        ],
        evidence: [
          "test-result: invalid/missing/allowed/bounded matrix",
          "log: sanitized audit/correlation output",
          "config: read-tool schema/policy",
        ],
        requiredEvidence: ["test-result", "log", "config"],
        quizConcept:
          "A read tool is safe only when Backend revalidates constrained arguments, enforces role/scope, bounds output and records sanitized audit.",
        firstTest:
          "Send missing/invalid/out-of-range arguments to Backend and confirm it denies/bounds them before a model call is considered successful.",
        shortPrompt:
          "What control prevents an Agent read tool from returning an unbounded table?",
        shortAnswer: "row limit",
        shortExplanation:
          "A server-enforced row limit constrains response size and data exposure.",
        explainPrompt:
          "Explain secure read-tool schema, Backend validation, role/scope, row limit and audit chain.",
        passExplanation:
          "bounded read-tool security and audit evidence",
        returnBlock:
          "schema validation, server enforcement, role scope or row limit",
      }),
      mission({
        id: "w7-m3-write-tool-pending-hitl",
        slug: "write-tool-pending-hitl",
        title: "Write Tools: Pending-only State & HITL",
        category: "Agent Write Security",
        skillId: "agent-integration",
        targetLevel: "L3",
        sourceType: official,
        competency:
          "create_purchase_request tool, source=AI, DRAFT/PENDING, no approve tool, Manager approval and workflow continuation",
        keywords: [
          "write tool",
          "purchase request",
          "pending",
          "draft",
          "source ai",
          "manager",
          "approval",
          "hitl",
        ],
        analogy:
          "Agent may fill a purchase-request draft and mark prepared by AI; it cannot stamp approved. The manager reads, approves or rejects, then workflow moves. Draft creation is not a blank check.",
        easy:
          "Write tool must use narrow args, validate amount/product/actor, force source=AI and final initial state=DRAFT/PENDING on Backend. Ignore/reject caller-provided APPROVED. Approval endpoint/tool is not available to Agent; Manager role/human flow controls it.",
        technical:
          "Controlled write tools create proposed domain state under server-enforced invariants. Backend derives immutable metadata and allowed state independent of client/Agent request, authorizes actor, validates arguments, persists audit and requires a separate human-authorized transition for approval.",
        why:
          "This combines Agent integration with Week 4 HITL. It is the critical security boundary that prevents self-approval/privilege escalation in demos and production-like training.",
        subtopics: [
          "write schema",
          "source=AI server-side",
          "DRAFT/PENDING forced state",
          "argument limits",
          "Manager-only approval",
          "no direct approve tool",
          "audit/correlation",
          "duplicate/idempotency",
        ],
        command:
          "curl -i -X POST http://localhost:8000/api/tools/purchase-requests\ncurl -i -X POST http://localhost:8000/api/purchase-requests/DEMO/approve\ndocker compose logs --tail=200 backend\ndocker compose logs --tail=150 agent",
        where:
          "Use only disposable demo request and secure test auth. Record status/role/audit summaries, not token, customer/supplier or financial values.",
        commandWhy:
          "Compare Agent-proposed create state with separate approval policy and correlate audit/log behavior.",
        expected:
          "Create yields source=AI plus DRAFT/PENDING; unauthorized/Agent approval is denied; Manager path requires human actor; audit shows proposal and later decision separately.",
        commandFailure:
          "Client can submit APPROVED, Agent has approve tool, Backend trusts source/status input, missing role guard, no idempotency or audit, workflow proceeds before approval.",
        guided:
          "Create a disposable request with mock Agent input including attempted status=APPROVED. Verify Backend forces/rejects as pending, then run one denied and one Manager approval test.",
        independent:
          "Design a red-team test for huge quantity, malformed product ID, duplicate key and self-approve. State safe expected response and which layer blocks each.",
        integration:
          "Trace tool schema→Agent service auth→Backend validation/RBAC→pending record→Manager HITL→n8n. Handoff business validation semantics to SV2 only after all security chain checks pass.",
        failure:
          "Temporarily configure test client to send status=APPROVED. Demonstrate server rejection/override, no workflow continuation, audit denial and regression both Sales/Manager routes.",
        errors: [
          "Let Agent choose approved",
          "Use one endpoint for create and approve",
          "Assume prompt forbids abuse",
          "Skip role matrix",
          "No duplicate test",
        ],
        selfChecks: [
          "What state must write tool create?",
          "Who can approve?",
          "Where force source/status?",
          "Why separate audit events?",
        ],
        evidence: [
          "test-result: pending/denied/manager matrix",
          "log: sanitized proposal/approval audit",
          "incident-report: self-approve/status injection protocol",
        ],
        requiredEvidence: ["test-result", "log", "incident-report"],
        quizConcept:
          "Agent write tools may create only server-forced AI-sourced DRAFT/PENDING proposals; a separate Manager-governed HITL transition handles approval.",
        firstTest:
          "Attempt to submit final approved state through create path and verify Backend ignores/rejects it before testing workflow continuation.",
        shortPrompt: "Initial state a secure Agent write must enforce is what?",
        shortAnswer: "PENDING",
        shortExplanation:
          "Pending state preserves the human approval boundary for an Agent-created proposal.",
        explainPrompt:
          "Explain Agent write schema through server-forced pending state to Manager HITL and workflow continuation.",
        passExplanation:
          "pending-only write and human approval enforcement",
        returnBlock:
          "write schema/state enforcement, role guard or HITL flow",
      }),
      mission({
        id: "w7-m4-agent-service-auth-rbac",
        slug: "agent-service-auth-rbac",
        title: "Agent Service Authentication, RBAC & Permission Boundary",
        category: "Agent Security",
        skillId: "authorization",
        targetLevel: "L4",
        sourceType: official,
        competency:
          "Agent service auth, user actor context, Backend RBAC, tool permission, expired token and 401/403 tests",
        keywords: [
          "agent auth",
          "rbac",
          "service auth",
          "user context",
          "401",
          "403",
          "permission",
          "backend",
        ],
        analogy:
          "Agent service may have a staff badge to reach the counter, but each request still carries which customer/user asks. A staff badge cannot turn every user into manager; counter checks both service and actor context.",
        easy:
          "Define exact service-auth strategy as frozen project contract: trusted internal identity is not wildcard authority. Backend validates agent/service and relevant user actor/role. Test missing, expired and wrong-role context. Never place long-lived secret in client or logs.",
        technical:
          "Service-to-service authentication establishes workload identity, while end-user authorization context determines delegated permissions. Backend policy validates issuer/audience/credentials and enforces role/resource actions. 401 reflects invalid authentication; 403 reflects authenticated but unauthorized action.",
        why:
          "Agent service is high-risk integration. SV1 validates auth boundary and incident evidence; SV2 owns endpoint policy semantics while SV3 owns Agent behavior.",
        subtopics: [
          "service identity contract",
          "user/delegated actor",
          "issuer/audience/expiry",
          "Backend RBAC",
          "tool permission matrix",
          "401 versus 403",
          "secret rotation",
          "internal network not enough",
        ],
        command:
          "curl -i http://localhost:8000/api/tools/low-stock\ncurl -i -H 'Authorization: Bearer REDACTED_EXPIRED' http://localhost:8000/api/tools/low-stock\ndocker compose logs --tail=200 backend\ndocker compose logs --tail=150 agent\ndocker compose config",
        where:
          "Host Compose root with secure local test auth. Commands intentionally use placeholders; do not persist real service/user tokens in source, shell history or Evidence Vault.",
        commandWhy:
          "Observe no-auth/invalid-auth response and Backend/Agent auth log classification while auditing config names rather than secret values.",
        expected:
          "Valid allowed identity succeeds only for allowed tool; missing/expired invalid identity gets 401; valid wrong role gets 403; logs/audit are sanitized; service credential is not exposed to browser.",
        commandFailure:
          "Agent calls Backend with admin token, Backend ignores user actor, internal network treated as auth, 401/403 confused, service secret in Compose/export/log or long-lived secret rotation absent.",
        guided:
          "Create tool permission matrix for Sales/Manager/Admin and service identity. Test missing auth, expired/invalid auth, valid wrong role and valid allowed role; record statuses without tokens.",
        independent:
          "Write a service-secret exposure response: revoke/rotate, update protected runtime config, restart/redeploy consumer if needed, verify old secret fails, scan copies, incident/prevention. Do not merely delete a line.",
        integration:
          "Compare Agent's configured Backend audience/issuer and user context with Backend guard. If infrastructure/token validation passes but domain policy incorrect, hand off SV2 with status/matrix/audit evidence.",
        failure:
          "Use wrong audience/expired lab token or wrong role in disposable test. Prove 401/403 distinction and restore valid configuration without disabling auth.",
        errors: [
          "Use network as auth",
          "Give Agent superuser token",
          "Write service secret in docs",
          "Call wrong role 401",
          "Skip rotation after leak",
        ],
        selfChecks: [
          "Service identity differs user role how?",
          "401 vs 403?",
          "Why Backend verifies both?",
          "First response to secret exposure?",
        ],
        evidence: [
          "test-result: 401/403/allowed tool matrix",
          "config: redacted service-auth contract",
          "incident-report: expired/wrong-role/secret rotation protocol",
        ],
        requiredEvidence: ["test-result", "config", "incident-report"],
        quizConcept:
          "Internal Agent service connectivity is not authorization: Backend validates service/auth context and applies user-role tool permission separately.",
        firstTest:
          "Classify request as no/invalid auth 401 versus valid wrong-role 403 before altering any role or secret configuration.",
        shortPrompt:
          "Status for a valid but unauthorized user/tool action is what?",
        shortAnswer: "403",
        shortExplanation:
          "403 is the expected response for authentication that succeeds but lacks required authorization.",
        explainPrompt:
          "Explain service identity, user actor context and Backend RBAC for an Agent tool, including 401/403 test matrix.",
        passExplanation:
          "Agent service auth and delegated permission enforcement",
        returnBlock:
          "auth context, RBAC matrix or secret rotation procedure",
      }),
      mission({
        id: "w7-m5-agent-audit-limits-resilience",
        slug: "agent-audit-limits-resilience",
        title: "Agent Audit, Limits, Timeout & Resilience",
        category: "Agent Operations",
        skillId: "agent-security",
        targetLevel: "L3",
        sourceType: extended,
        competency:
          "Agent audit actor/tool/sanitized args/result/timestamp/correlation/latency, rate/row/quantity limits, timeout/malformed output and retry safety",
        keywords: [
          "agent audit",
          "limits",
          "timeout",
          "latency",
          "correlation",
          "malformed output",
          "rate limit",
          "resilience",
        ],
        analogy:
          "A controlled assistant desk records who asked, which approved form it used, a safe summary, when and how long it took. It limits how many sheets can be requested and refuses garbled forms instead of guessing.",
        easy:
          "Audit must help debug/secure without storing secrets or full sensitive arguments. Enforce row/quantity/rate/timeouts at Backend/tool boundaries. Treat malformed tool output, upstream timeout and retry as controlled failure; do not let Agent invent success or repeat unsafe write with new key.",
        technical:
          "Auditable tool execution records minimal necessary security/operational metadata. Resource controls constrain abuse and blast radius. Robust integrations validate structured tool input/output, apply timeout/retry policies and preserve idempotency/correlation for ambiguous outcomes.",
        why:
          "Red-team success depends on observable controls. SV1 can verify audit and infrastructure limits without owning Agent algorithm or business pricing/approval logic.",
        subtopics: [
          "audit field minimum",
          "sanitized args/result summary",
          "correlation/latency",
          "row/quantity/rate limit",
          "timeout",
          "malformed output",
          "retry/idempotency",
          "safe errors",
        ],
        command:
          "docker compose logs --tail=200 agent\ndocker compose logs --tail=200 backend\ndocker stats --no-stream agent rag backend\ncurl -i http://localhost:8100/health\ndocker compose config",
        where:
          "Host terminal at Compose root. Use synthetic demo inputs only; evidence records labels/count/status/latency, not secrets, full prompts or sensitive objects.",
        commandWhy:
          "Inspect end-to-end audit/log/resource state and service config around controlled tool execution/failure.",
        expected:
          "Each tool execution has actor/tool/sanitized args/result/timestamp/correlation and useful latency/status; oversized/malformed/timed-out inputs reject safely; write retries retain key.",
        commandFailure:
          "Audit contains token/prompt secrets, no correlation, no limits, Agent accepts arbitrary output, timeout creates duplicate write, error stack leaks internal config or resources exhaust unnoticed.",
        guided:
          "Run one safe read tool and one denied/invalid request. Build audit review table with required fields and verify argument/row/quantity bound plus safe failure output.",
        independent:
          "Plan a malformed tool-output and timeout drill. Identify expected Agent behavior, Backend evidence, retry/idempotency rule and what cannot be claimed from a timeout.",
        integration:
          "Trace Agent→RAG→Backend tool latency/resource impact. If generated plan quality poor while tool boundary/log/audit pass, hand off SV3; if backend limit/auth missing, route correct owner with proof.",
        failure:
          "Send out-of-range quantity or synthetic malformed JSON to test adapter. Capture validation/audit result, verify no state change, add regression test and never broaden parser permissiveness.",
        errors: [
          "Log full prompt/token",
          "No output schema",
          "Retry write with new ID",
          "No row/quantity bound",
          "Call timeout no-op",
        ],
        selfChecks: [
          "Minimum audit fields?",
          "Why sanitize?",
          "What handles malformed output?",
          "How timeout ties to idempotency?",
        ],
        evidence: [
          "log: sanitized tool audit review",
          "test-result: limit/malformed/timeout-safe matrix",
          "explanation: resilience and no-secret policy",
        ],
        requiredEvidence: ["log", "test-result", "explanation"],
        quizConcept:
          "Secure Agent operations combine data-minimized audit, enforced bounds, structured output validation and retry/idempotency handling for ambiguous failures.",
        firstTest:
          "Inspect audit record and Backend validation outcome for a deliberately invalid/oversized tool input before measuring model success.",
        shortPrompt:
          "Audit should store arguments in what form when they may be sensitive?",
        shortAnswer: "sanitized",
        shortExplanation:
          "Sanitization preserves useful operational context without exposing secrets or unnecessary sensitive content.",
        explainPrompt:
          "Explain secure audit record, enforced limits, malformed output handling and timeout/idempotency relation.",
        passExplanation:
          "auditable bounded resilient Agent tool operation",
        returnBlock:
          "audit data minimization, limit enforcement or timeout/retry safety",
      }),
      mission({
        id: "w7-m6-agent-red-team-security",
        slug: "agent-red-team-security",
        title: "Agent Red-team: Injection, Privilege & Secret Defenses",
        category: "Agent Red-team",
        skillId: "agent-security",
        targetLevel: "L4",
        sourceType: official,
        competency:
          "Ignore-rules, self-approve, secret extraction, SQL, huge quantity, malicious retrieved text, wrong role, expired token, timeout and malformed output red-team",
        keywords: [
          "red team",
          "prompt injection",
          "self approve",
          "secret extraction",
          "sql",
          "privilege escalation",
          "malicious corpus",
          "rbac",
        ],
        analogy:
          "Red-team puts fake malicious notes in a suggestion box: ignore manager, open safe, show keys. A secure worker follows counter policy, not notes; counter refuses forbidden forms even if worker repeats them politely.",
        easy:
          "Test abuse cases with synthetic content. Success means denied/contained/safe audit—not Agent obeying. Tool schema/Backend RBAC/pending-only/HITL/secret redaction are independent defenses. No test can justify weakening role/security to score a demo.",
        technical:
          "Adversarial testing probes prompt-injection, data exfiltration, privilege escalation, unauthorized state transition, unsafe tool invocation and failure modes. Defense-in-depth relies on untrusted-input handling, allowlisted schemas, server authorization, least privilege, output controls, audit and human approval.",
        why:
          "Week 7 hard gate is zero HITL/RBAC bypass and zero secret exposure. Red-team report must show exact test, expected containment, actual evidence, root cause if failed and regression—not narrative confidence.",
        subtopics: [
          "prompt injection",
          "malicious retrieved text",
          "secret extraction",
          "arbitrary SQL/tool URL",
          "self-approval",
          "wrong role/expired token",
          "huge quantity",
          "timeout/malformed output",
          "audit/report",
        ],
        command:
          "docker compose logs --tail=250 agent\ndocker compose logs --tail=250 backend\ndocker compose ps agent rag backend\ndocker stats --no-stream agent rag backend\ndocker compose config",
        where:
          "Disposable synthetic red-team lab only. Never use real secrets, customer data, harmful external commands or public attack targets. Keep test prompts/data in controlled fixtures and redact evidence.",
        commandWhy:
          "Capture service/audit/log/resource/config facts around controlled denied actions and verify no unsafe state was created.",
        expected:
          "All listed abuse cases are denied/contained/audited without secret exposure or unauthorized state. Any bypass is Critical/P0 and blocks Week 7/Release until fixed and retested.",
        commandFailure:
          "Test uses real secret, only prompt text defense, Agent has direct DB/admin path, no audit, rejection not verified at DB/state level, or team calls refusal a pass without checking side effect.",
        guided:
          "Run synthetic cases: ignore rules, self-approve, request secret, arbitrary SQL, huge quantity and Sales-to-Manager action. For each capture expected block layer, actual status/audit, persisted-state check and regression.",
        independent:
          "Add expired token, timeout and malformed tool output cases. Build a red-team report with severity, owner, root cause, minimal fix, verification and release decision.",
        integration:
          "Verify malicious retrieved text never overrides system/Backend tool boundary. Coordinate SV3 for prompt/retrieval safeguards and SV2 for Backend policy; SV1 verifies infra/auth/audit and reports exact evidence.",
        failure:
          "In test fixture, give a retrieved document synthetic instruction to disclose DEMO_SECRET_DO_NOT_USE. Verify tool/schema/Backend/audit blocks it, no secret output is stored, then remove fixture from corpus/collection according to test runbook.",
        errors: [
          "Use real secret in red-team",
          "Assume model refusal is security boundary",
          "Do not check database state",
          "Mark one test pass as full security closure",
          "Hide failed bypass",
        ],
        selfChecks: [
          "Two hard success criteria?",
          "Why test persisted state?",
          "What blocks arbitrary SQL?",
          "What after bypass?",
        ],
        evidence: [
          "test-result: red-team matrix with expected/actual/state check",
          "log: sanitized audit/no-secret proof",
          "incident-report: any failure full protocol and regression",
        ],
        requiredEvidence: ["test-result", "log", "incident-report"],
        quizConcept:
          "Agent red-team success requires zero RBAC/HITL bypass and zero secret exposure, verified through Backend state/audit—not merely a model refusal message.",
        firstTest:
          "For each synthetic attack, identify tool/schema/Backend/HITL block layer and verify both response and persisted state/audit.",
        shortPrompt:
          "Can an Agent be granted arbitrary SQL to fix a red-team failure?",
        shortAnswer: "no",
        shortExplanation:
          "Arbitrary SQL violates the controlled-tool and Backend authorization boundary regardless of model behavior.",
        explainPrompt:
          "Explain defense chain for prompt injection/self-approve/secret extraction and how red-team verifies zero bypass.",
        passExplanation:
          "adversarial evidence, no-secret discipline and no-bypass security closure",
        returnBlock:
          "tool boundary, Backend enforcement, audit/state verification or red-team report",
      }),
      mission({
        id: "w7-m7-agent-e2e-security-closure",
        slug: "agent-e2e-security-closure",
        title: "Agent E2E, Security Closure & Configuration Freeze Prep",
        category: "Agent QA",
        skillId: "security-review",
        targetLevel: "L4",
        sourceType: official,
        competency:
          "Two controlled tools, E2E Agent workflow, DRAFT/PENDING/Manager approval, AI audit, red-team report and final config inventory prep",
        keywords: [
          "agent e2e",
          "security closure",
          "configuration freeze",
          "tool",
          "audit",
          "red team",
          "pending",
          "release",
        ],
        analogy:
          "Before sealing an appliance for release, test each button, safety lock and alarm with the wiring diagram. Then freeze labeled cables/ports/settings; later change must go through impact review, not a quiet swap.",
        easy:
          "Week 7 proves at least read/write controlled tools, auth/RBAC/HITL/audit and red-team. It also prepares Week 8 configuration freeze: every release service needs owner/image/hostname/ports/network/volume/health/env/auth/dependencies/public boundary source of truth. Unknown release item is P0, not hidden.",
        technical:
          "Security closure aggregates verified trust boundaries, authentication/authorization matrices, tool constraints, audit evidence, red-team results and remediation. Configuration freeze establishes controlled change management for release-critical service contracts, with impact analysis, regression and documentation updates for any later change.",
        why:
          "This mission closes the security gate and stops future release configuration from becoming undocumented drift. SV1 coordinates proof across team modules while preserving ownership.",
        subtopics: [
          "two-tool inventory",
          "read/write acceptance",
          "service/user auth",
          "RBAC/HITL",
          "audit/red-team results",
          "public/internal boundary",
          "config inventory",
          "TBD owner/deadline/source of truth",
        ],
        command:
          "docker compose config\ndocker compose ps\ndocker compose logs --tail=150 agent\ndocker compose logs --tail=150 backend\ncurl -fsS http://localhost:8100/health\ncurl -fsS http://localhost:8000/health",
        where:
          "Host terminal at Compose root. Build inventory from versioned Compose/.env.example/docs/test evidence; do not invent unimplemented services or publish internal endpoints to satisfy a checklist.",
        commandWhy:
          "Capture current deployment contract and health/log evidence to compare with freeze inventory.",
        expected:
          "Two tool contracts and security matrix have positive/negative evidence; red-team has no Critical bypass; config inventory contains no anonymous release service/port/health/env/auth boundary, and unresolved item has owner/deadline/source.",
        commandFailure:
          "Claim closure with only happy path, leave Agent credentials/TBD vague, expose Qdrant/Ollama, document latest image tag, hide failed red-team case or freeze without tests/docs alignment.",
        guided:
          "Run one controlled read and write proposal E2E, then Manager approval. Add statuses/correlation/audit to report. Build configuration-freeze inventory table for all current services and mark unknowns explicitly.",
        independent:
          "Attempt Boss Fight #agent-07 unassisted, then create a release-risk list containing any unproven RBAC/HITL/secret/public boundary. Do not convert assumptions into PASS.",
        integration:
          "Review inventory with SV2/SV3: API contracts/workflow, Portal/AI models. After freeze, require Change→impact→PR→regression→docs update. No user-facing source code ownership transfer occurs.",
        failure:
          "Introduce one configuration drift in a disposable tool service (wrong host/port/role). Detect against inventory/config, impact callers/auth/tests/docs, fix minimal change and perform regression.",
        errors: [
          "Freeze untested assumptions",
          "Use latest image",
          "Leave secret name undocumented",
          "Call red-team optional",
          "Change after freeze without impact review",
        ],
        selfChecks: [
          "What constitutes security closure?",
          "What config fields freeze?",
          "What makes a P0 TBD?",
          "What follows post-freeze change?",
        ],
        evidence: [
          "test-result: two-tool E2E plus security/red-team matrix",
          "config: configuration-freeze inventory/TBD register",
          "explanation: release security closure and controlled-change rule",
        ],
        requiredEvidence: ["test-result", "config", "explanation"],
        quizConcept:
          "Security closure and configuration freeze require verified tool/RBAC/HITL/audit/red-team evidence plus explicit release service contracts and controlled later changes.",
        firstTest:
          "Compare every service in inventory with resolved Compose/.env/docs/health evidence; flag mismatch or unknown before declaring freeze.",
        shortPrompt:
          "After configuration freeze, a change must begin with what analysis?",
        shortAnswer: "impact analysis",
        shortExplanation:
          "A release configuration change must assess direct/upstream/downstream/config/auth/tests/docs impact before implementation.",
        explainPrompt:
          "Explain how Agent security closure feeds configuration freeze and release readiness without hiding P0 TBDs.",
        passExplanation:
          "end-to-end Agent security and frozen release-contract discipline",
        returnBlock:
          "tool/RBAC/HITL proof, red-team closure or configuration inventory",
      }),
    ],
  },
  ...finalWeek,
];
