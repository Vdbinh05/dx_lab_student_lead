---
id: w4-m4-correlation-audit-trace
week: 4
order: 4
title: "Correlation IDs, Business IDs & Audit Trace"
category: "Observability"
skillId: "observability"
estimatedMinutes: 210
targetLevel: "L3"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "correlation_id, business_id, idempotency_key, sanitized audit and cross-service traceability"
keywords: ["correlation id","business id","idempotency key","audit","trace","logs","workflow"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w4-m3-webhook-proxy-cors"]
requiredEvidence: ["log","config","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 must gather evidence before restart, coordinate handoff and prove duplicate-safe integration. These identifiers are the shared debugging vocabulary, not an optional logging decoration."
---

## 1. Ví dụ đời thường

Correlation ID là số kiện hàng đi xuyên chuyến; business ID là số đơn; idempotency key là tem chống nhận trùng. Không có chúng, nhìn log giống tìm đúng hộp trong kho không nhãn.

## 2. Giải thích cực dễ

One request can touch Portal, Backend, n8n and database. Carry correlation_id to group technical journey; business_id names domain object; idempotency_key makes a retried write recognizable. Audit records actor/action/time/result but must redact tokens/secrets and sensitive body fields.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Distributed request correlation propagates a unique request identifier across service boundaries. Business identifiers identify domain entities, while idempotency keys identify an operation instance. Structured audit logs record security/operational events with a data-minimization policy and enable causality reconstruction.

## 4. Why DX-Lab needs it

SV1 must gather evidence before restart, coordinate handoff and prove duplicate-safe integration. These identifiers are the shared debugging vocabulary, not an optional logging decoration. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L3**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- correlation versus business ID
- idempotency key purpose
- header/body propagation convention
- structured log fields
- audit actor/action/result/time
- redaction
- cross-service search
- retention awareness

## 7. Commands / Config examples

```bash
curl -i -H 'X-Correlation-ID: lab-w4-001' -H 'Idempotency-Key: lab-op-001' http://localhost:8000/api/health
docker compose logs --tail=200 backend
docker compose logs --tail=200 n8n
docker compose logs --tail=200 proxy
```

**COMMAND:** `curl -i -H 'X-Correlation-ID: lab-w4-001' -H 'Idempotency-Key: lab-op-001' http://localhost:8000/api/health` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at Compose root. For real workflow calls, use a non-secret lab correlation ID and never include bearer token or private business content in evidence.  
**WHY:** Inject one traceable safe identifier, then locate it across service logs in chronological order.  
**EXPECTED OUTPUT:** Relevant services log/refer to same correlation ID; audit fields identify actor/action/result safely; missing identifier becomes a contract defect rather than guessed timeline.  
**COMMON FAILURE:** Different header names, regenerated ID at each hop, logs contain full payload/token, business ID used as secret, or no linkage from workflow to Backend.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at Compose root. For real workflow calls, use a non-secret lab correlation ID and never include bearer token or private business content in evidence. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Relevant services log/refer to same correlation ID; audit fields identify actor/action/result safely; missing identifier becomes a contract defect rather than guessed timeline. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Define a convention with correlation_id/business_id/idempotency_key. Send a safe test event through proxy→Backend→workflow; create a timeline of timestamps/statuses and redact all sensitive fields.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Inspect a failure log set with two similar requests. Use only IDs/timestamps to reconstruct which call failed and produce a handoff with expected/actual and owner. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Ensure n8n passes correlation and idempotency headers to Backend. If Backend's domain audit semantics are wrong after propagation works, hand off SV2 with the trace.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Remove propagation on one workflow node. Show that logs split into unrelated traces, add minimal header mapping, then demonstrate same ID returns across edge and regression log search.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Search one safe correlation ID across proxy, Backend and workflow logs before any restart or broad query.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Use correlation ID as auth
- Log raw token with trace
- Generate new ID at every hop
- Assume business ID prevents duplicate
- Record only success audit

## 16. Self-check Questions

1. Three IDs differ how?
2. What cannot go in audit/log?
3. How trace retries?
4. Why is ID propagation integration contract?

## 17. Evidence Required

- log: sanitized cross-service trace timeline
- config: ID/header convention
- explanation: correlation/business/idempotency distinction

Evidence type bắt buộc cho gate: `log` + `config` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được safe traceability across service boundaries, và hard gate được commit server-side. Nếu FAIL, quay lại identifier contract, propagation or redacted audit evidence; không mở khóa bằng cách sửa status phía client.
