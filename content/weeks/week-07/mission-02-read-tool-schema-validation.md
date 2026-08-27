---
id: w7-m2-read-tool-schema-validation
week: 7
order: 2
title: "Read Tools: Schema, Limits, Auth & Audit"
category: "Agent Tools"
skillId: "tool-calling"
estimatedMinutes: 210
targetLevel: "L3"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Read tool such as get_low_stock_products, argument schema/limits, authorization, row limit and audit"
keywords: ["read tool","schema","validation","row limit","authorization","audit","low stock","agent"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w7-m1-agent-tool-architecture"]
requiredEvidence: ["test-result","log","config"]
quizPassScore: 75
hardGate: true
whyItMatters: "Read tools are safest starting point for Agent integration, but can still leak data or overload systems without limits/auth/audit. SV1 checks gateway/security, not business query semantics."
---

## 1. Ví dụ đời thường

A read tool is a librarian request form: it asks for a narrow catalogue search with page limit. It does not let the clerk walk into every archive room or photocopy the entire ledger.

## 2. Giải thích cực dễ

Define tool name, purpose, typed arguments, allowed range, max rows, actor role, safe error and audit summary. Backend validates even if Agent schema validates. Return only necessary fields; do not send secret/PII/log dumps to model by default.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

A secure read tool exposes a constrained API operation with an explicit input schema, server-side revalidation, authorization policy, pagination/row limits and data-minimized response. Audit logs actor, tool, sanitized args, result summary, correlation and latency where useful.

## 4. Why DX-Lab needs it

Read tools are safest starting point for Agent integration, but can still leak data or overload systems without limits/auth/audit. SV1 checks gateway/security, not business query semantics. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L3**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- tool purpose/name
- typed args/defaults
- range/row limit
- server revalidation
- role/tenant scope
- safe response fields
- audit fields
- error/timeout behavior

## 7. Commands / Config examples

```bash
curl -i http://localhost:8000/api/tools/low-stock
docker compose logs --tail=150 backend
docker compose logs --tail=150 agent
docker compose config
curl -i http://localhost:8100/health
```

**COMMAND:** `curl -i http://localhost:8000/api/tools/low-stock` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at Compose root; use secure authorized test setup. Evidence may show status/count/field names but never production data, bearer token or full tool payload.  
**WHY:** Observe no-auth/allowed/denied behavior and correlate Agent/Backend audit around a constrained tool endpoint.  
**EXPECTED OUTPUT:** No auth/invalid args are rejected safely; allowed caller receives bounded fields/count; row-limit and audit are visible; Agent cannot expand tool beyond schema.  
**COMMON FAILURE:** Tool accepts arbitrary filter/SQL, no max rows, backend trusts client model input, wrong role passes, audit logs raw sensitive arguments or endpoint leaks stack trace.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at Compose root; use secure authorized test setup. Evidence may show status/count/field names but never production data, bearer token or full tool payload. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

No auth/invalid args are rejected safely; allowed caller receives bounded fields/count; row-limit and audit are visible; Agent cannot expand tool beyond schema. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Specify get_low_stock_products with fields, threshold range, maxRows, required role and audit summary. Test invalid threshold, too-large limit, missing token and allowed safe call.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Review one read-tool schema for abuse cases: huge result, negative/NaN range, cross-role data, injection-like string, timeout. Design test and expected safe response. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Validate Agent→Backend service auth and user-role propagation. If query business meaning is disputed, hand SV2 the sanitized endpoint/input/result expectation after security path passes.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Remove row limit or make threshold accept arbitrary string in mock schema. Prove server revalidation rejects it, restore bounded input and regression-test agent invocation.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Send missing/invalid/out-of-range arguments to Backend and confirm it denies/bounds them before a model call is considered successful.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Trust schema only in Agent
- Return whole table
- No role check for read
- Audit raw sensitive payload
- Treat read as harmless always

## 16. Self-check Questions

1. Why server revalidate?
2. Why max rows?
3. What audit fields?
4. What response data minimized?

## 17. Evidence Required

- test-result: invalid/missing/allowed/bounded matrix
- log: sanitized audit/correlation output
- config: read-tool schema/policy

Evidence type bắt buộc cho gate: `test-result` + `log` + `config`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được bounded read-tool security and audit evidence, và hard gate được commit server-side. Nếu FAIL, quay lại schema validation, server enforcement, role scope or row limit; không mở khóa bằng cách sửa status phía client.
