---
id: w3-m5-rbac-roles-claims-backend-guard
week: 3
order: 5
title: "RBAC: Roles, Claims, Mappers & Backend Guard"
category: "Authorization"
skillId: "rbac"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Role claims, mapper, user assignment, Backend guard and 401/403/200 access matrix"
keywords: ["rbac","role","claim","mapper","backend guard","401","403","200","matrix"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w3-m4-jwt-jwks-validation"]
requiredEvidence: ["test-result","explanation","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 coordinates identity and integration proof. SV2 owns policy semantics, but a reproducible 401/403/200 matrix prevents handoff ambiguity and unsafe demo shortcuts."
---

## 1. Ví dụ đời thường

Keycloak role assignment là cấp thẻ màu; mapper là máy in đưa màu lên thẻ token; Backend guard là nhân viên cửa kiểm màu cho từng phòng. Nếu máy in bỏ màu, người có quyền vẫn bị từ chối.

## 2. Giải thích cực dễ

401 means no valid identity/token; 403 means token valid but policy denies action. For 403, verify expected role assignment, token claim shape/location, mapper/scope and Backend guard. Never fix by making all users admin or trusting a frontend role flag.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Role-based access control maps authenticated subjects to role claims and evaluates endpoint/resource policy. IdP role assignment must be emitted through correct mapper/scope contract, then parsed by Backend policy. A robust matrix tests allowed and denied cases independently of UI.

## 4. Why DX-Lab needs it

SV1 coordinates identity and integration proof. SV2 owns policy semantics, but a reproducible 401/403/200 matrix prevents handoff ambiguity and unsafe demo shortcuts. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- realm/client role source
- protocol mapper/scope
- claim path
- user/group assignment
- Backend guard
- 401 versus 403
- positive/negative access matrix
- least privilege

## 7. Commands / Config examples

```bash
curl -i http://localhost:8000/api/manager-only
curl -i -H 'Authorization: Bearer REDACTED_MANAGER_TOKEN' http://localhost:8000/api/manager-only
docker compose logs --tail=100 backend
docker compose logs --tail=100 keycloak
```

**COMMAND:** `curl -i http://localhost:8000/api/manager-only` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at Compose root; use local secure test tooling for real tokens and record only status/claim labels, never bearer strings.  
**WHY:** Produce no-token/allowed/denied response evidence and correlate IdP/Backend logs.  
**EXPECTED OUTPUT:** No token returns 401; correct valid role returns documented success; valid wrong role returns 403; logs identify policy without exposing token payload.  
**COMMON FAILURE:** Role absent in token, mapper wrong scope/path, client role vs realm role confusion, user assignment stale until fresh token, Backend reads wrong claim or guard missing.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at Compose root; use local secure test tooling for real tokens and record only status/claim labels, never bearer strings. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

No token returns 401; correct valid role returns documented success; valid wrong role returns 403; logs identify policy without exposing token payload. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Create a 4×3 matrix for admin/manager/sales/warehouse against three protected actions. Run at least one 401, one allowed 200/2xx and one denied 403 per policy class.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact config/export đã sao lưu trong lab, xác nhận use case cũ vẫn pass và không xóa persistent storage

## 11. Independent Lab

Given valid token + 403, write evidence-first triage and propose a minimal mapper/guard contract change without expanding privilege. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Align Keycloak claim path with Backend parser and workflow approval actor. Handoff SV2 only with token claim labels, exact endpoint, expected/actual status and no token body.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Remove/alter the role mapper in a lab client or assign wrong role. Refresh token, show 403, trace mapper/claim/guard and restore precise mapping.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Verify valid-token status separately from role claim and Backend guard, using a fresh token after role changes.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại health, negative test và một caller/use case lân cận sau khi sửa

## 15. Common Beginner Errors

- Call 403 authentication failure
- Use old token after role change
- Make frontend decide authorization
- Grant admin to debug
- Test only happy path

## 16. Self-check Questions

1. 401 vs 403?
2. Why refresh token after role assignment?
3. Mapper failure shows where?
4. Which component actually denies endpoint?

## 17. Evidence Required

- test-result: redacted 401/403/2xx RBAC matrix
- explanation: role→claim→guard chain
- incident-report: mapper/guard 403 root cause

Evidence type bắt buộc cho gate: `test-result` + `explanation` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được least-privilege role claim to Backend enforcement chain, và hard gate được commit server-side. Nếu FAIL, quay lại role assignment/mapper claim or Backend policy contract; không mở khóa bằng cách sửa status phía client.
