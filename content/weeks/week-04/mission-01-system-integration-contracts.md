---
id: w4-m1-system-integration-contracts
week: 4
order: 1
title: "System Integration Contracts & Ownership Map"
category: "System Integration"
skillId: "system-integration"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "H-P-D-I system map, service contracts, owners, hostnames, ports, auth, health, callers/callees and blast radius"
keywords: ["integration","contract","owner","hostname","port","auth","health","blast radius"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w3-m7-realm-export-security"]
requiredEvidence: ["config","terminal-output","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "Week 4 begins cross-service work. Without an agreed contract, n8n and Backend integration fails as undocumented URLs, credentials, headers, payloads or ownership gaps."
---

## 1. Ví dụ đời thường

Một hệ thống giống dây chuyền giao hàng: mỗi trạm biết nhận gì, trả gì, ai chịu trách nhiệm, số cửa và cách kiểm hàng. Không có contract, người ta đoán địa chỉ và đổ lỗi vòng quanh.

## 2. Giải thích cực dễ

SV1 không viết business flow thay SV2 hay Portal/AI thay SV3. SV1 phải nối được các mũi tên: Browser→Portal→Keycloak→Backend→Postgres→n8n and later AI services. Với mỗi mũi tên: hostname, port, network, auth, env, health, logs, owner, blast radius.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

An integration contract specifies producer/consumer responsibilities, transport endpoints, authentication/authorization, schemas/semantics, health/failure behavior, correlation and version/change impact. A system map makes runtime dependencies observable and creates deterministic handoff boundaries.

## 4. Why DX-Lab needs it

Week 4 begins cross-service work. Without an agreed contract, n8n and Backend integration fails as undocumented URLs, credentials, headers, payloads or ownership gaps. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- H/P/D/I map
- service owner
- caller/callee
- internal/public hostname and port
- auth and env contract
- health/log source
- timeout/retry expectation
- blast-radius/change impact

## 7. Commands / Config examples

```bash
docker compose config
docker compose ps
docker compose logs --tail=100 backend
docker compose logs --tail=100 n8n
curl -fsS http://localhost:8000/health
```

**COMMAND:** `docker compose config` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at the project Compose root. Use source-of-truth Compose/env/docs names, not assumed platform defaults.  
**WHY:** Build the inventory from resolved runtime config and evidence, not a diagram made from memory.  
**EXPECTED OUTPUT:** Each required service has an owner, purpose, internal/public endpoint, dependency, health/log check and one caller/callee. Unknown values become a tracked TBD, never fake default.  
**COMMON FAILURE:** Diagram uses localhost inside containers, service/port name is guessed, owner boundary is vague, health is conflated with functional flow or a new change ignores downstream callers.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at the project Compose root. Use source-of-truth Compose/env/docs names, not assumed platform defaults. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Each required service has an owner, purpose, internal/public endpoint, dependency, health/log check and one caller/callee. Unknown values become a tracked TBD, never fake default. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Fill a Service Health + Integration Matrix for Portal, Keycloak, Backend, Postgres and n8n. For each row prove one runtime fact from config/ps/log/curl and label SV1/SV2/SV3 ownership.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Run a port-change impact analysis for Backend: application listen, Compose, health, proxy, Portal API URL, n8n, Agent, tests and docs. State what SV1 changes versus who receives handoff. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Trace a single protected business request across the H/P/D chain using sanitized correlation/business IDs. Stop at business decision boundary and file a structured handoff for SV2 if behavior—not transport/config—is wrong.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Deliberately write one wrong internal URL in a disposable workflow config. Use the matrix to derive which service/log/test comes first, then restore it and update contract evidence.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Compare the written contract with docker compose config, then test the first caller→callee edge in the actual network scope.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Draw architecture but omit owner/health/auth
- Use port without hostname
- Turn SV1 into business API owner
- Treat documentation as optional after config change
- Hide unresolved contract under TBD

## 16. Self-check Questions

1. What 10 facts must SV1 know for each service?
2. Who owns business process logic?
3. Why include blast radius?
4. What is a valid integration handoff?

## 17. Evidence Required

- config: service/integration matrix
- terminal-output: resolved config/health/log evidence
- explanation: change impact and ownership boundary

Evidence type bắt buộc cho gate: `config` + `terminal-output` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được runtime contract, ownership and impact analysis, và hard gate được commit server-side. Nếu FAIL, quay lại service map/contract or role-boundary understanding; không mở khóa bằng cách sửa status phía client.
