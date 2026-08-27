---
id: w7-m4-agent-service-auth-rbac
week: 7
order: 4
title: "Agent Service Authentication, RBAC & Permission Boundary"
category: "Agent Security"
skillId: "authorization"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Agent service auth, user actor context, Backend RBAC, tool permission, expired token and 401/403 tests"
keywords: ["agent auth","rbac","service auth","user context","401","403","permission","backend"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w7-m3-write-tool-pending-hitl"]
requiredEvidence: ["test-result","config","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "Agent service is high-risk integration. SV1 validates auth boundary and incident evidence; SV2 owns endpoint policy semantics while SV3 owns Agent behavior."
---

## 1. Ví dụ đời thường

Agent service may have a staff badge to reach the counter, but each request still carries which customer/user asks. A staff badge cannot turn every user into manager; counter checks both service and actor context.

## 2. Giải thích cực dễ

Define exact service-auth strategy as frozen project contract: trusted internal identity is not wildcard authority. Backend validates agent/service and relevant user actor/role. Test missing, expired and wrong-role context. Never place long-lived secret in client or logs.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Service-to-service authentication establishes workload identity, while end-user authorization context determines delegated permissions. Backend policy validates issuer/audience/credentials and enforces role/resource actions. 401 reflects invalid authentication; 403 reflects authenticated but unauthorized action.

## 4. Why DX-Lab needs it

Agent service is high-risk integration. SV1 validates auth boundary and incident evidence; SV2 owns endpoint policy semantics while SV3 owns Agent behavior. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- service identity contract
- user/delegated actor
- issuer/audience/expiry
- Backend RBAC
- tool permission matrix
- 401 versus 403
- secret rotation
- internal network not enough

## 7. Commands / Config examples

```bash
curl -i http://localhost:8000/api/tools/low-stock
curl -i -H 'Authorization: Bearer REDACTED_EXPIRED' http://localhost:8000/api/tools/low-stock
docker compose logs --tail=200 backend
docker compose logs --tail=150 agent
docker compose config
```

**COMMAND:** `curl -i http://localhost:8000/api/tools/low-stock` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host Compose root with secure local test auth. Commands intentionally use placeholders; do not persist real service/user tokens in source, shell history or Evidence Vault.  
**WHY:** Observe no-auth/invalid-auth response and Backend/Agent auth log classification while auditing config names rather than secret values.  
**EXPECTED OUTPUT:** Valid allowed identity succeeds only for allowed tool; missing/expired invalid identity gets 401; valid wrong role gets 403; logs/audit are sanitized; service credential is not exposed to browser.  
**COMMON FAILURE:** Agent calls Backend with admin token, Backend ignores user actor, internal network treated as auth, 401/403 confused, service secret in Compose/export/log or long-lived secret rotation absent.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host Compose root with secure local test auth. Commands intentionally use placeholders; do not persist real service/user tokens in source, shell history or Evidence Vault. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Valid allowed identity succeeds only for allowed tool; missing/expired invalid identity gets 401; valid wrong role gets 403; logs/audit are sanitized; service credential is not exposed to browser. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Create tool permission matrix for Sales/Manager/Admin and service identity. Test missing auth, expired/invalid auth, valid wrong role and valid allowed role; record statuses without tokens.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Write a service-secret exposure response: revoke/rotate, update protected runtime config, restart/redeploy consumer if needed, verify old secret fails, scan copies, incident/prevention. Do not merely delete a line. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Compare Agent's configured Backend audience/issuer and user context with Backend guard. If infrastructure/token validation passes but domain policy incorrect, hand off SV2 with status/matrix/audit evidence.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Use wrong audience/expired lab token or wrong role in disposable test. Prove 401/403 distinction and restore valid configuration without disabling auth.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Classify request as no/invalid auth 401 versus valid wrong-role 403 before altering any role or secret configuration.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Use network as auth
- Give Agent superuser token
- Write service secret in docs
- Call wrong role 401
- Skip rotation after leak

## 16. Self-check Questions

1. Service identity differs user role how?
2. 401 vs 403?
3. Why Backend verifies both?
4. First response to secret exposure?

## 17. Evidence Required

- test-result: 401/403/allowed tool matrix
- config: redacted service-auth contract
- incident-report: expired/wrong-role/secret rotation protocol

Evidence type bắt buộc cho gate: `test-result` + `config` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được Agent service auth and delegated permission enforcement, và hard gate được commit server-side. Nếu FAIL, quay lại auth context, RBAC matrix or secret rotation procedure; không mở khóa bằng cách sửa status phía client.
