---
id: w4-m7-workflow-integration-evidence
week: 4
order: 7
title: "Workflow E2E, Export & Integration Incident"
category: "Integration QA"
skillId: "troubleshooting"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Two workflow E2E, export/version, correlation/idempotency evidence and cross-service failure injection"
keywords: ["workflow","e2e","export","correlation","idempotency","webhook","incident","handoff"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w4-m6-hitl-approval-workflow"]
requiredEvidence: ["test-result","config","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "This mission turns component learning into product capability. SV1's job is proof and coordination across owners, not a single success screenshot."
---

## 1. Ví dụ đời thường

Một quy trình hoàn chỉnh giống chuyển thư bảo đảm: có người gửi, số theo dõi, các chặng, người ký nhận và bản sao quy trình. Nếu chỉ nhìn một chặng xanh không chứng minh thư đến đúng người.

## 2. Giải thích cực dễ

Week 4 is PASS only when two workflows are traceable from trigger through Backend/data to final state, retry-safe, role-safe and exportable. Boss Fight may hide one failure layer; hints teach but never turn into clean pass.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

End-to-end workflow verification exercises a complete integration path and its negative/recovery conditions. Versioned exports, contract tests, correlation logs and idempotency evidence make the flow reproducible and establish regression inputs for later release work.

## 4. Why DX-Lab needs it

This mission turns component learning into product capability. SV1's job is proof and coordination across owners, not a single success screenshot. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- workflow #1 and #2 scope
- E2E acceptance
- export/version/source of truth
- correlation/idempotency
- allowed/denied roles
- failure injection
- incident protocol
- regression matrix

## 7. Commands / Config examples

```bash
docker compose ps
docker compose logs --tail=200 n8n
docker compose logs --tail=200 backend
curl -fsS http://localhost:8000/health
docker compose config
```

**COMMAND:** `docker compose ps` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at Compose root. Use documentation/export names as source of truth, and run only against disposable demo records where workflow mutates data.  
**WHY:** Capture stack state and target logs/config immediately around an E2E run or controlled failure.  
**EXPECTED OUTPUT:** Two flows have declared trigger/input/owner/API/role/state/audit/failure/retry acceptance. Exported workflow is versioned and the source system can run independent clean execution.  
**COMMON FAILURE:** Flow works only via admin, hidden direct DB action, webhook inactive, duplicated event, credentials in export, missing correlation or owner handoff absent.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at Compose root. Use documentation/export names as source of truth, and run only against disposable demo records where workflow mutates data. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Two flows have declared trigger/input/owner/API/role/state/audit/failure/retry acceptance. Exported workflow is versioned and the source system can run independent clean execution. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Run one Sales Order-like and one Purchase Request-like workflow through happy path and one negative path. Capture ID timeline, API status, role decision, data outcome, export reference and cleanup.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Complete Boss Fight #workflow-04 unassisted. Afterward, produce an integration report identifying likely layer/owner/fix/verification/regression regardless of score. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Coordinate acceptance review with SV2 (business/API/data) and SV3 (Portal awareness). SV1 signs only infrastructure/identity/integration evidence; recorded owner accepts functional rule behavior.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Inject inactive webhook, wrong API URL or duplicate retry one at a time. Do not repair by bypassing Backend; follow all nine protocol fields and add regression test.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Start from the declared trigger and trace IDs across n8n, Backend and final state before asserting success.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Call a flow E2E after only webhook 200
- Store credentials in export
- No negative/duplicate test
- Run as admin only
- Close incident without regression

## 16. Self-check Questions

1. What proves a workflow end to end?
2. Which evidence makes it reproducible?
3. What makes clean Boss Fight?
4. What goes to SV2/SV3 handoff?

## 17. Evidence Required

- test-result: two-flow E2E matrix
- config: versioned export/source-of-truth reference
- incident-report: cross-service failure with all protocol fields

Evidence type bắt buộc cho gate: `test-result` + `config` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được cross-service E2E acceptance and incident regression, và hard gate được commit server-side. Nếu FAIL, quay lại workflow contract, traceability, idempotency or role gate; không mở khóa bằng cách sửa status phía client.
