---
id: w5-m6-operations-failure-recovery
week: 5
order: 6
title: "Operations Failure Drills: DB, Keycloak & n8n"
category: "Incident Response"
skillId: "troubleshooting"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "DB down, Keycloak down, n8n timeout, evidence before restart, recovery and handoff protocol"
keywords: ["incident","database down","keycloak down","n8n timeout","recovery","logs","health","handoff"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w5-m5-restore-separate-target"]
requiredEvidence: ["incident-report","terminal-output","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "Week 5 requires recovery drills. SV1 must demonstrate calm, ordered action and correct ownership under demo pressure—not memorize a generic restart command."
---

## 1. Ví dụ đời thường

When a building loses water, security or mail service, the reception should identify which utility failed and who is affected—not switch every breaker off. Each drill needs symptom, proof, recovery and regression.

## 2. Giải thích cực dễ

Run one failure at a time in a safe lab. DB down impacts Backend/workflow; Keycloak down impacts login/token refresh; n8n timeout may still mean Backend later processed work. Capture ps/health/log/port/dependency evidence before restart, restore exact service then verify dependent flows.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Operational incident response models dependency failure propagation. Controlled fault injection validates detection, evidence collection, service recovery, timeout/retry behavior and post-recovery regression. Root cause is the smallest causal contract/layer demonstrated by tests, not a symptom label.

## 4. Why DX-Lab needs it

Week 5 requires recovery drills. SV1 must demonstrate calm, ordered action and correct ownership under demo pressure—not memorize a generic restart command. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- fault scope
- DB dependency chain
- IdP outage behavior
- workflow timeout ambiguity
- health/log/resource evidence
- recovery order
- correlation
- post-recovery regression

## 7. Commands / Config examples

```bash
docker compose stop postgres
docker compose ps
docker compose logs --tail=150 backend
docker compose start postgres
docker compose exec postgres pg_isready -U dxlab -d dxlab
curl -fsS http://localhost:8000/health
```

**COMMAND:** `docker compose stop postgres` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Disposable lab stack only, launched from Compose root. Announce impacted services and do not inject an outage into shared learner/production data during active work.  
**WHY:** Create isolated dependency stop, collect dependent evidence before recovery, then restore and verify readiness plus use case.  
**EXPECTED OUTPUT:** Symptom and dependent logs identify DB/IdP/workflow layer; recovery returns service readiness; caller functional smoke/retry behavior is verified rather than assumed.  
**COMMON FAILURE:** Restart all services, lose first log, delete data volume, misclassify 401 from Keycloak outage, retry writes without idempotency or declare recovery after container merely runs.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Disposable lab stack only, launched from Compose root. Announce impacted services and do not inject an outage into shared learner/production data during active work. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Symptom and dependent logs identify DB/IdP/workflow layer; recovery returns service readiness; caller functional smoke/retry behavior is verified rather than assumed. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Run DB-down drill. Capture baseline, stop DB, observe Backend/workflow, restore DB, wait readiness, run health and one controlled function. Fill all nine incident fields.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Plan and execute either Keycloak-down or n8n-timeout drill with exact expected blast radius, no-secret evidence and recovery/owner handoff. Then compare to DB-down differences. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Use matrix to choose which owner receives issue after SV1 validates runtime/network/auth layer. If Backend business recovery logic fails after DB is healthy, hand off SV2 with correlation/log evidence.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Inject exactly one: stop Keycloak or delay/invalidate n8n upstream in disposable lab. Do not combine faults. Separate timeout from actual side effect via idempotency/audit trace.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Capture dependent service state/logs and exact symptom before starting the failed dependency again.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Stop all services together
- Restart before logs
- Use down -v
- Assume running equals recovered
- Retry unknown write with new key

## 16. Self-check Questions

1. DB-down first checks?
2. Keycloak-down differs how?
3. Why timeout ambiguous?
4. What verifies recovery?

## 17. Evidence Required

- incident-report: all nine fields for one drill
- terminal-output: before/during/after status/health/log
- explanation: blast radius and owner handoff

Evidence type bắt buộc cho gate: `incident-report` + `terminal-output` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được dependency recovery protocol and evidence-driven coordination, và hard gate được commit server-side. Nếu FAIL, quay lại incident evidence/recovery order or dependency blast-radius map; không mở khóa bằng cách sửa status phía client.
