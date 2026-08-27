---
id: w3-m1-identity-authentication-authorization
week: 3
order: 1
title: "Identity: Authentication, Authorization & OIDC Map"
category: "Identity"
skillId: "authentication"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Authentication versus authorization, OAuth2 enough-to-use, OIDC, browser-to-Backend identity flow"
keywords: ["identity","authentication","authorization","oauth2","oidc","browser","backend"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w2-m9-reverse-proxy-integration"]
requiredEvidence: ["terminal-output","explanation","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 thiết kế/điều phối identity boundary, URL, client config, token validation and failure triage; SV2 owns business authorization rules and SV3 owns Portal implementation."
---

## 1. Ví dụ đời thường

Authentication giống kiểm tra bạn là ai ở cổng; authorization giống kiểm thẻ đó được vào phòng nào. Có thẻ nhân viên không có nghĩa được vào két sắt. OAuth2/OIDC là quy trình cấp và mang thẻ giữa các hệ thống.

## 2. Giải thích cực dễ

Login trả lời 'ai đang dùng hệ thống'. Role/permission trả lời 'người đó được làm gì'. OIDC bổ sung identity information trên nền OAuth2 để application biết user; Backend phải tự verify token và enforce permission, không tin UI ẩn nút.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Authentication establishes a subject identity. Authorization evaluates whether that subject may perform an action on a resource. OAuth 2.0 delegates authorization; OpenID Connect layers identity tokens and standardized claims over OAuth 2.0. A resource server validates access tokens and makes its own policy decision.

## 4. Why DX-Lab needs it

SV1 thiết kế/điều phối identity boundary, URL, client config, token validation and failure triage; SV2 owns business authorization rules and SV3 owns Portal implementation. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- identity provider/client/resource server
- authentication vs authorization
- OAuth2 roles at a useful level
- OIDC identity claims
- browser/portal/Keycloak/backend flow
- UI visibility vs Backend enforcement

## 7. Commands / Config examples

```bash
curl -fsS http://localhost:8080/realms/dx-lab/.well-known/openid-configuration
curl -i http://localhost:8000/api/protected
docker compose ps keycloak backend
docker compose logs --tail=100 keycloak
```

**COMMAND:** `curl -fsS http://localhost:8080/realms/dx-lab/.well-known/openid-configuration` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at the Compose project. URLs/realm/ports are lab examples; use the frozen project contract instead of inventing production values.  
**WHY:** Observe discovery metadata, an unauthenticated resource response, service state and identity logs without printing user tokens.  
**EXPECTED OUTPUT:** Discovery returns issuer/endpoints/JWKS URI; protected API returns documented 401 without a token; Keycloak and Backend have observable state/logs.  
**COMMON FAILURE:** Wrong realm/port, IdP not ready, browser URL confused with internal hostname, API has no guard, or a raw token is accidentally copied into output.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at the Compose project. URLs/realm/ports are lab examples; use the frozen project contract instead of inventing production values. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Discovery returns issuer/endpoints/JWKS URI; protected API returns documented 401 without a token; Keycloak and Backend have observable state/logs. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Draw User → Portal → Keycloak → Authorization Code → token → Backend. Mark which component authenticates, validates, authorizes and stores no token. Verify discovery and a no-token 401.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact config/export đã sao lưu trong lab, xác nhận use case cũ vẫn pass và không xóa persistent storage

## 11. Independent Lab

Given 'the button is hidden but curl still succeeds', explain why it is an authorization defect and write a safe Backend-focused handoff to SV2. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Compare browser-facing issuer URL with Backend issuer/JWKS reachability. Test an unauthenticated API request and keep any real bearer token out of screenshots/evidence.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Point the Backend issuer setting to a wrong realm in a disposable config. Capture discovery/Backend evidence, classify issuer versus network failure, then restore it.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Fetch OIDC discovery and make an unauthenticated protected-resource request before changing any policy.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại health, negative test và một caller/use case lân cận sau khi sửa

## 15. Common Beginner Errors

- Call a hidden UI element security
- Confuse OAuth2 and OIDC as identical
- Log raw access tokens
- Make Keycloak the only enforcement point
- Use internal Keycloak hostname in browser

## 16. Self-check Questions

1. Authentication khác authorization?
2. OIDC thêm gì vào OAuth2 use case?
3. Ai enforces protected API?
4. 401 không token nói layer nào đang hoạt động?

## 17. Evidence Required

- terminal-output: discovery + no-token 401 without secrets
- explanation: identity flow and Backend boundary
- incident-report: wrong issuer/realm diagnosis

Evidence type bắt buộc cho gate: `terminal-output` + `explanation` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được identity versus permission boundary and token-validation ownership, và hard gate được commit server-side. Nếu FAIL, quay lại identity-flow mental model hoặc authentication/authorization distinction; không mở khóa bằng cách sửa status phía client.
