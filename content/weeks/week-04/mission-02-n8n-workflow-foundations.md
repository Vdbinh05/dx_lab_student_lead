---
id: w4-m2-n8n-workflow-foundations
week: 4
order: 2
title: "n8n Workflow Foundations & Backend Boundary"
category: "n8n"
skillId: "n8n"
estimatedMinutes: 210
targetLevel: "L3"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Workflow trigger, state, transition, condition, action, webhook, audit and n8n→Backend API→PostgreSQL boundary"
keywords: ["n8n","workflow","trigger","state","transition","webhook","backend api","audit"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w4-m1-system-integration-contracts"]
requiredEvidence: ["config","terminal-output","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 needs enough workflow fluency to deploy, observe, debug and evidence n8n integration without owning business process implementation."
---

## 1. Ví dụ đời thường

n8n là người điều phối checklist, không phải kho hồ sơ. Nó nhận sự kiện, quyết định bước tiếp theo, gọi quầy Backend theo hợp đồng và lưu audit. Nó không nên tự mở tủ Postgres và sửa nhiều hồ sơ tùy ý.

## 2. Giải thích cực dễ

Workflow needs trigger, input, condition, action, expected output and failure path. n8n calls Backend API; Backend applies business rules and persists through SV2's design. SV1 supports connectivity/auth/observability/export, not direct multi-table business writes from workflow.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

A workflow automates stateful transitions through triggered nodes, conditions and actions. A webhook is an HTTP-triggered event endpoint. Integration should use a stable Backend API contract, with explicit idempotency/audit/authorization, rather than bypassing domain invariants through arbitrary database access.

## 4. Why DX-Lab needs it

SV1 needs enough workflow fluency to deploy, observe, debug and evidence n8n integration without owning business process implementation. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L3**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- trigger/action/condition
- state and transition
- webhook activation
- n8n credential boundary
- Backend API contract
- audit trail
- workflow export/version
- no arbitrary DB writes

## 7. Commands / Config examples

```bash
docker compose ps n8n backend postgres
docker compose logs --tail=100 n8n
curl -i http://localhost:5678/healthz
curl -i http://localhost:8000/openapi.json
```

**COMMAND:** `docker compose ps n8n backend postgres` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at Compose root. n8n health endpoint/path depends on pinned version; use project source of truth and do not expose n8n admin UI publicly by default.  
**WHY:** Prove orchestration service state, inspect its first relevant log and compare workflow target with documented Backend API.  
**EXPECTED OUTPUT:** n8n is reachable at its intended admin/internal boundary; a versioned workflow export identifies trigger, API target, credentials by name only and audit behavior.  
**COMMON FAILURE:** Webhook inactive, n8n calls localhost, credential is embedded in export, direct DB node bypasses Backend, or source workflow differs from deployed version.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at Compose root. n8n health endpoint/path depends on pinned version; use project source of truth and do not expose n8n admin UI publicly by default. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

n8n is reachable at its intended admin/internal boundary; a versioned workflow export identifies trigger, API target, credentials by name only and audit behavior. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Create a disposable webhook workflow that validates input then calls a safe Backend test endpoint. Record trigger, request headers/body schema, success/failure branches and exported workflow version without credentials.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Review an existing workflow: identify its business owner, transport contract, persistence boundary, auth, audit, retry and idempotency gaps. Produce only findings/evidence where SV2 owns implementation. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Send one test event through n8n→Backend and trace resulting HTTP status, correlation ID and API audit. Do not issue arbitrary SQL from n8n to 'make it work'.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Deactivate webhook or replace Backend service name with localhost. Capture trigger state, execution record, network/config/log evidence and restore correct endpoint.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Verify workflow activation and its exact API target from the n8n execution/config, then test the target in the n8n network scope.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Let n8n write arbitrary tables
- Treat active workflow as proven E2E
- Put password in exported JSON
- Use UI URL as webhook API URL
- No failure branch/audit

## 16. Self-check Questions

1. Why n8n→Backend API instead of direct DB?
2. What makes webhook active?
3. What belongs in versioned export?
4. Which team owns business state design?

## 17. Evidence Required

- config: redacted workflow contract/export reference
- terminal-output: n8n/Backend health/log evidence
- explanation: orchestration versus business boundary

Evidence type bắt buộc cho gate: `config` + `terminal-output` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được workflow orchestration and Backend ownership boundary, và hard gate được commit server-side. Nếu FAIL, quay lại workflow contract or n8n/Backend role separation; không mở khóa bằng cách sửa status phía client.
