---
id: w7-m5-agent-audit-limits-resilience
week: 7
order: 5
title: "Agent Audit, Limits, Timeout & Resilience"
category: "Agent Operations"
skillId: "agent-security"
estimatedMinutes: 210
targetLevel: "L3"
sourceType: "KIEN_THUC_MO_RONG"
roadmapCompetency: "Agent audit actor/tool/sanitized args/result/timestamp/correlation/latency, rate/row/quantity limits, timeout/malformed output and retry safety"
keywords: ["agent audit","limits","timeout","latency","correlation","malformed output","rate limit","resilience"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w7-m4-agent-service-auth-rbac"]
requiredEvidence: ["log","test-result","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "Red-team success depends on observable controls. SV1 can verify audit and infrastructure limits without owning Agent algorithm or business pricing/approval logic."
---

## 1. Ví dụ đời thường

A controlled assistant desk records who asked, which approved form it used, a safe summary, when and how long it took. It limits how many sheets can be requested and refuses garbled forms instead of guessing.

## 2. Giải thích cực dễ

Audit must help debug/secure without storing secrets or full sensitive arguments. Enforce row/quantity/rate/timeouts at Backend/tool boundaries. Treat malformed tool output, upstream timeout and retry as controlled failure; do not let Agent invent success or repeat unsafe write with new key.

## 3. Technical Definition

**Nguồn:** [KIẾN THỨC MỞ RỘNG ĐỂ SV1 HỌC/DEBUG TỐT HƠN]

Auditable tool execution records minimal necessary security/operational metadata. Resource controls constrain abuse and blast radius. Robust integrations validate structured tool input/output, apply timeout/retry policies and preserve idempotency/correlation for ambiguous outcomes.

## 4. Why DX-Lab needs it

Red-team success depends on observable controls. SV1 can verify audit and infrastructure limits without owning Agent algorithm or business pricing/approval logic. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L3**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- audit field minimum
- sanitized args/result summary
- correlation/latency
- row/quantity/rate limit
- timeout
- malformed output
- retry/idempotency
- safe errors

## 7. Commands / Config examples

```bash
docker compose logs --tail=200 agent
docker compose logs --tail=200 backend
docker stats --no-stream agent rag backend
curl -i http://localhost:8100/health
docker compose config
```

**COMMAND:** `docker compose logs --tail=200 agent` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at Compose root. Use synthetic demo inputs only; evidence records labels/count/status/latency, not secrets, full prompts or sensitive objects.  
**WHY:** Inspect end-to-end audit/log/resource state and service config around controlled tool execution/failure.  
**EXPECTED OUTPUT:** Each tool execution has actor/tool/sanitized args/result/timestamp/correlation and useful latency/status; oversized/malformed/timed-out inputs reject safely; write retries retain key.  
**COMMON FAILURE:** Audit contains token/prompt secrets, no correlation, no limits, Agent accepts arbitrary output, timeout creates duplicate write, error stack leaks internal config or resources exhaust unnoticed.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at Compose root. Use synthetic demo inputs only; evidence records labels/count/status/latency, not secrets, full prompts or sensitive objects. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Each tool execution has actor/tool/sanitized args/result/timestamp/correlation and useful latency/status; oversized/malformed/timed-out inputs reject safely; write retries retain key. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Run one safe read tool and one denied/invalid request. Build audit review table with required fields and verify argument/row/quantity bound plus safe failure output.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Plan a malformed tool-output and timeout drill. Identify expected Agent behavior, Backend evidence, retry/idempotency rule and what cannot be claimed from a timeout. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Trace Agent→RAG→Backend tool latency/resource impact. If generated plan quality poor while tool boundary/log/audit pass, hand off SV3; if backend limit/auth missing, route correct owner with proof.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Send out-of-range quantity or synthetic malformed JSON to test adapter. Capture validation/audit result, verify no state change, add regression test and never broaden parser permissiveness.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Inspect audit record and Backend validation outcome for a deliberately invalid/oversized tool input before measuring model success.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Log full prompt/token
- No output schema
- Retry write with new ID
- No row/quantity bound
- Call timeout no-op

## 16. Self-check Questions

1. Minimum audit fields?
2. Why sanitize?
3. What handles malformed output?
4. How timeout ties to idempotency?

## 17. Evidence Required

- log: sanitized tool audit review
- test-result: limit/malformed/timeout-safe matrix
- explanation: resilience and no-secret policy

Evidence type bắt buộc cho gate: `log` + `test-result` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được auditable bounded resilient Agent tool operation, và hard gate được commit server-side. Nếu FAIL, quay lại audit data minimization, limit enforcement or timeout/retry safety; không mở khóa bằng cách sửa status phía client.
