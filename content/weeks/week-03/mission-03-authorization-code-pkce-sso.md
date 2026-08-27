---
id: w3-m3-authorization-code-pkce-sso
week: 3
order: 3
title: "Authorization Code + PKCE & SSO"
category: "OIDC Flow"
skillId: "oidc"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Authorization Code flow, PKCE, state/nonce concepts, callback, SSO and browser integration awareness"
keywords: ["authorization code","pkce","code verifier","code challenge","state","nonce","callback","sso"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w3-m2-keycloak-realm-client-users-roles"]
requiredEvidence: ["explanation","config","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 must debug redirect/callback/session behavior and audit URL/config risk while leaving Portal code at L0 boundary."
---

## 1. Ví dụ đời thường

Authorization code giống phiếu gửi xe chỉ dùng được một lần. PKCE thêm dấu niêm phong do Portal tạo: chỉ Portal giữ verifier mới đổi được phiếu lấy token. SSO là dùng một lần xác minh ở cổng chung để vào nhiều tòa nhà đã tin cậy.

## 2. Giải thích cực dễ

Browser được redirect đến Keycloak, login, rồi quay về exact callback với code/state. Portal đổi code cùng verifier lấy token. Code không phải token và không được log. state giúp liên kết request/callback; nonce liên quan protection for ID token replay. PKCE is standard for browser/public clients.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Authorization Code with PKCE binds an authorization request's code_challenge to a token-exchange code_verifier, reducing authorization-code interception risk for public clients. The client validates state correlation and OIDC nonce semantics; an IdP session can supply SSO across participating clients.

## 4. Why DX-Lab needs it

SV1 must debug redirect/callback/session behavior and audit URL/config risk while leaving Portal code at L0 boundary. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- authorization endpoint/token endpoint
- redirect URI callback
- authorization code single use
- PKCE verifier/challenge
- state
- nonce
- IdP session and SSO
- logout/session boundary

## 7. Commands / Config examples

```bash
curl -fsS http://localhost:8080/realms/dx-lab/.well-known/openid-configuration
docker compose logs --tail=100 keycloak
docker compose logs --tail=100 portal
docker compose config
```

**COMMAND:** `curl -fsS http://localhost:8080/realms/dx-lab/.well-known/openid-configuration` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Use browser devtools only to observe redirect URLs safely; run curl/log/config from host. Never copy authorization codes, ID tokens or access tokens into Evidence Vault.  
**WHY:** Discovery exposes protocol endpoints; logs/config localize callback and session failures without leaking bearer material.  
**EXPECTED OUTPUT:** Browser redirects to configured authorization endpoint and returns only to exact callback; SSO may skip repeated login when IdP session is valid.  
**COMMON FAILURE:** Callback mismatch, HTTP versus HTTPS mismatch, stale state/cookie, bad client ID, PKCE disabled/misconfigured, or cookies blocked by browser policy.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Use browser devtools only to observe redirect URLs safely; run curl/log/config from host. Never copy authorization codes, ID tokens or access tokens into Evidence Vault. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Browser redirects to configured authorization endpoint and returns only to exact callback; SSO may skip repeated login when IdP session is valid. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Map one login trace with names only: initial URL, authorization endpoint, callback, token exchange owner and protected API call. Test login then a second client or renewed navigation to recognize SSO session behavior.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact config/export đã sao lưu trong lab, xác nhận use case cũ vẫn pass và không xóa persistent storage

## 11. Independent Lab

Explain why a public Portal should not embed a client secret and why a code in browser URL must not become an evidence artifact. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Coordinate Portal callback config with Keycloak client exact URI. Verify Backend receives access token only after Portal's code exchange; if UI state is faulty but identity flow is valid, handoff SV3.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Change callback port/path in a disposable client setting. Capture redirect error, discovery and client config; restore exact URI rather than broadening allowed patterns.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Compare the browser callback URL exactly with Keycloak client redirect configuration and inspect the first redirect error.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại health, negative test và một caller/use case lân cận sau khi sửa

## 15. Common Beginner Errors

- Treat code as bearer token
- Put client secret in browser
- Disable PKCE to make test pass
- Ignore state mismatch
- Assume SSO means API authorization passes

## 16. Self-check Questions

1. Why PKCE?
2. Code khác token?
3. state and nonce protect what broadly?
4. SSO affects which layer?

## 17. Evidence Required

- explanation: redacted flow diagram
- config: exact callback/PKCE policy
- incident-report: callback/state failure

Evidence type bắt buộc cho gate: `explanation` + `config` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được code/callback/PKCE lifecycle and SSO scope, và hard gate được commit server-side. Nếu FAIL, quay lại OIDC redirect/PKCE flow or browser session boundary; không mở khóa bằng cách sửa status phía client.
