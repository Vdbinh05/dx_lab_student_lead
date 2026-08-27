---
id: w4-m5-retry-idempotency
week: 4
order: 5
title: "Retry, Timeout, Idempotency & Duplicate Safety"
category: "Reliability"
skillId: "system-integration"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Timeout, retry/backoff, retry-safe API design, idempotency key, duplicate event and recovery behavior"
keywords: ["retry","timeout","backoff","idempotency","duplicate","webhook","network","reliability"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w4-m4-correlation-audit-trace"]
requiredEvidence: ["test-result","log","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 owns integration/reliability evidence and must expose duplicate risk to SV2/n8n owners. A workflow that 'usually works' fails roadmap gate if retried event produces duplicate state."
---

## 1. Ví dụ đời thường

Nếu gọi điện đặt hàng bị ngắt sau khi cửa hàng đã ghi đơn, gọi lại không được tạo đơn mới. Idempotency key là số biên nhận để cửa hàng trả kết quả cũ thay vì xử lý lại.

## 2. Giải thích cực dễ

Timeout means caller lacks timely response, not necessarily that server did nothing. Retrying a non-idempotent write can duplicate orders. Caller uses stable key; Backend stores/enforces it and returns original result for repeat. Retry policy must be bounded and observable.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Retries trade transient-failure recovery against duplicate side effects. Idempotency keys bind multiple delivery attempts to one logical operation, typically through server-side uniqueness/state. Timeouts are ambiguous outcomes; exponential backoff/jitter and explicit retry classification reduce load and synchronize recovery behavior.

## 4. Why DX-Lab needs it

SV1 owns integration/reliability evidence and must expose duplicate risk to SV2/n8n owners. A workflow that 'usually works' fails roadmap gate if retried event produces duplicate state. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- timeout ambiguity
- transient/permanent classification
- bounded retry/backoff
- stable key source
- Backend uniqueness/enforcement
- original response replay
- duplicate detection/audit
- manual recovery

## 7. Commands / Config examples

```bash
curl -i -H 'Idempotency-Key: lab-w4-op-001' -H 'X-Correlation-ID: lab-w4-dup-001' -X POST http://localhost:8000/api/test-write
curl -i -H 'Idempotency-Key: lab-w4-op-001' -H 'X-Correlation-ID: lab-w4-dup-002' -X POST http://localhost:8000/api/test-write
docker compose logs --tail=200 backend
docker compose logs --tail=200 n8n
```

**COMMAND:** `curl -i -H 'Idempotency-Key: lab-w4-op-001' -H 'X-Correlation-ID: lab-w4-dup-001' -X POST http://localhost:8000/api/test-write` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal against a disposable safe test-write endpoint only. Do not repeat a real finance/stock/production operation as a learning experiment.  
**WHY:** Deliver the same operation key twice with different correlation IDs and compare result, persistence count and audit behavior.  
**EXPECTED OUTPUT:** First request creates one effect; replay returns existing/consistent result without a second effect; logs/audit reveal same key and both delivery attempts.  
**COMMON FAILURE:** No key propagation, key changes per retry, Backend accepts duplicate, timeout hidden by random retry, retry storm, or database uniqueness error leaked without recovery contract.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal against a disposable safe test-write endpoint only. Do not repeat a real finance/stock/production operation as a learning experiment. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

First request creates one effect; replay returns existing/consistent result without a second effect; logs/audit reveal same key and both delivery attempts. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Build a disposable create-request workflow with stable idempotency_key. Trigger twice and verify one resulting domain record/audit operation. Document timeout/retry limits and manual recovery owner.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Simulate response delay after server-side success. Explain why caller must not infer failure solely from timeout and how it safely recovers with same key. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Trace n8n retry to Backend with same key but unique correlation per attempt. Ask SV2 to own server persistence/policy if missing; SV1 verifies transport/config/evidence.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Remove idempotency header mapping or make key random per attempt in disposable flow. Produce duplicate evidence, identify contract gap, restore stable key and regression-test concurrent/retry paths.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Compare the idempotency key, persisted effect count and audit across first delivery and a controlled replay.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Retry every error forever
- Use correlation ID as idempotency key
- Assume timeout equals no write
- Make n8n dedupe only
- Delete duplicate records without audit

## 16. Self-check Questions

1. Why timeout ambiguous?
2. Stable key comes from what logical unit?
3. Which layer enforces duplicate safety?
4. Why different correlation IDs on repeats?

## 17. Evidence Required

- test-result: two-delivery one-effect proof
- log: key/correlation audit trace
- incident-report: duplicate/timeout protocol

Evidence type bắt buộc cho gate: `test-result` + `log` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được retry and duplicate-safe cross-service operation, và hard gate được commit server-side. Nếu FAIL, quay lại timeout/retry semantics or idempotency propagation/enforcement; không mở khóa bằng cách sửa status phía client.
