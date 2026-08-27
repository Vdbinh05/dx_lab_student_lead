---
id: w3-m4-jwt-jwks-validation
week: 3
order: 4
title: "JWT Claims, JWKS & Backend Validation"
category: "JWT"
skillId: "jwt"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "JWT header/payload/signature, sub/iss/aud/azp/exp/roles, JWKS and decode versus validate"
keywords: ["jwt","jwks","signature","issuer","audience","azp","exp","claims","validation"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w3-m3-authorization-code-pkce-sso"]
requiredEvidence: ["terminal-output","explanation","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 must localize 401 to token/header/issuer/audience/JWKS/clock/config layers and coordinate safe evidence without becoming cryptography implementer."
---

## 1. Ví dụ đời thường

JWT payload là phần chữ nhìn thấy trên thẻ; signature là con dấu chống sửa. Đọc chữ trên thẻ không chứng minh con dấu thật, thẻ do đúng trường cấp, dành đúng cửa hoặc còn hạn.

## 2. Giải thích cực dễ

JWT thường có header.payload.signature. Decode chỉ xem payload base64url; validation must verify signature with trusted JWKS key, issuer, audience/client expectations, expiry and policy. Backend never accepts a token just because a browser decoded it.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

A JSON Web Token is a compact signed claims set. Secure resource-server validation resolves trusted issuer metadata/JWKS, verifies the cryptographic signature and validates claims such as issuer, audience/authorized party, expiration/not-before and authorization claims before use.

## 4. Why DX-Lab needs it

SV1 must localize 401 to token/header/issuer/audience/JWKS/clock/config layers and coordinate safe evidence without becoming cryptography implementer. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- JWS structure
- sub/iss/aud/azp/exp roles
- JWKS key discovery and rotation
- decode vs cryptographic validation
- Bearer header
- clock skew
- sanitized claim evidence

## 7. Commands / Config examples

```bash
curl -fsS http://localhost:8080/realms/dx-lab/.well-known/openid-configuration
curl -fsS http://localhost:8080/realms/dx-lab/protocol/openid-connect/certs
curl -i -H 'Authorization: Bearer REDACTED_TOKEN' http://localhost:8000/api/protected
docker compose logs --tail=100 backend
```

**COMMAND:** `curl -fsS http://localhost:8080/realms/dx-lab/.well-known/openid-configuration` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Run discovery/JWKS from host. For protected endpoint, use a deliberately redacted placeholder in documentation; in a real lab, do not store/copy the full bearer token into terminal history or evidence.  
**WHY:** Check issuer-discovery/JWKS reachability and observe documented 401 behavior plus Backend validation logs.  
**EXPECTED OUTPUT:** Discovery declares issuer/JWKS URI; JWKS returns public keys; missing/invalid/redacted bearer yields 401 without token echo in logs.  
**COMMON FAILURE:** Wrong issuer URL, stale JWKS/cache, invalid signature, expired token, audience mismatch, missing Authorization prefix, server clock skew or raw token logging.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Run discovery/JWKS from host. For protected endpoint, use a deliberately redacted placeholder in documentation; in a real lab, do not store/copy the full bearer token into terminal history or evidence. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Discovery declares issuer/JWKS URI; JWKS returns public keys; missing/invalid/redacted bearer yields 401 without token echo in logs. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Create a sanitized claim worksheet with labels sub/iss/aud/azp/exp/roles from a demo token viewed locally, then validate which checks Backend—not frontend—must enforce. Do not submit token string.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact config/export đã sao lưu trong lab, xác nhận use case cũ vẫn pass và không xóa persistent storage

## 11. Independent Lab

Write a 401 triage order: Authorization header → token existence → exp → iss → aud/azp → signature/JWKS → clock → Backend logs. Explain why decode does not replace it. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Verify Keycloak discovery reachable from Backend network and public browser URL use correct route. Handoff to SV2 only after cryptographic/config checks pass and endpoint policy behavior remains wrong.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Set expected issuer with a trailing realm mismatch or use an expired test token. Gather 401, issuer/JWKS/config/log evidence; fix issuer/refresh token pathway without bypassing validation.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Classify the response as missing/invalid token 401, then trace header→exp→issuer→audience→JWKS→clock.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại health, negative test và một caller/use case lân cận sau khi sửa

## 15. Common Beginner Errors

- Decode and call it validate
- Trust alg/header from attacker
- Disable issuer check
- Log tokens
- Treat all 401 as role issue

## 16. Self-check Questions

1. Decode proves what?
2. JWKS holds what?
3. iss/aud/azp differences?
4. Which checks precede role debugging?

## 17. Evidence Required

- terminal-output: discovery/JWKS/401 status without secret
- explanation: claim validation checklist
- incident-report: issuer/audience/expiry 401

Evidence type bắt buộc cho gate: `terminal-output` + `explanation` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được JWT trust chain and safe 401 triage, và hard gate được commit server-side. Nếu FAIL, quay lại token validation claim/JWKS/clock chain; không mở khóa bằng cách sửa status phía client.
