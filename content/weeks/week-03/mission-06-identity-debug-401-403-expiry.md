---
id: w3-m6-identity-debug-401-403-expiry
week: 3
order: 6
title: "Identity Incident Triage: 401, 403 & Expiry"
category: "Troubleshooting"
skillId: "troubleshooting"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Evidence-first 401/403/expiry/issuer/audience/role troubleshooting protocol"
keywords: ["401","403","expiry","issuer","audience","role","debug","evidence","clock"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w3-m5-rbac-roles-claims-backend-guard"]
requiredEvidence: ["incident-report","terminal-output","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "Identity failures often block all team modules. SV1 needs a repeatable handoff artifact with safe evidence, likely layer/owner and verification/regression, not a vague screenshot."
---

## 1. Ví dụ đời thường

401 giống thẻ không hợp lệ/hết hạn tại cổng chính; 403 giống thẻ thật nhưng không mở đúng phòng. Kiểm nhầm danh sách phòng khi thẻ đã hết hạn chỉ lãng phí thời gian.

## 2. Giải thích cực dễ

Start with symptom and status. 401 path is Authorization header→token→exp→iss→aud/azp→signature/JWKS→clock. 403 path starts only after valid token then role claim→mapper→assignment→Backend guard. Do not restart every service or disable checks.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Incident triage follows protocol-driven discriminating tests. Status code, sanitized headers, issuer metadata, verification logs, token timing and role/claim observations distinguish authentication validation defects from authorization policy defects and configuration drift.

## 4. Why DX-Lab needs it

Identity failures often block all team modules. SV1 needs a repeatable handoff artifact with safe evidence, likely layer/owner and verification/regression, not a vague screenshot. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- symptom classification
- safe evidence redaction
- 401 decision tree
- 403 decision tree
- token expiry/clock
- issuer/audience/JWKS
- mapper/guard
- handoff format

## 7. Commands / Config examples

```bash
curl -i http://localhost:8000/api/protected
curl -fsS http://localhost:8080/realms/dx-lab/.well-known/openid-configuration
curl -fsS http://localhost:8080/realms/dx-lab/protocol/openid-connect/certs
docker compose logs --tail=100 backend
docker compose logs --tail=100 keycloak
```

**COMMAND:** `curl -i http://localhost:8000/api/protected` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at Compose root. Use redacted tokens only in written commands; inspect real claims locally with approved tooling and capture labels/status, not bearer material.  
**WHY:** Collect independent evidence for missing token, issuer/JWKS reachability, Backend validation and IdP event context.  
**EXPECTED OUTPUT:** Each path leads to a concrete evidence-backed hypothesis rather than a random configuration change; logs avoid raw token disclosure.  
**COMMON FAILURE:** Mixing 401/403 paths, testing token with wrong environment, log truncation hiding first error, stale token after config change, or leaking token through shell history.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at Compose root. Use redacted tokens only in written commands; inspect real claims locally with approved tooling and capture labels/status, not bearer material. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Each path leads to a concrete evidence-backed hypothesis rather than a random configuration change; logs avoid raw token disclosure. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Run three controlled cases: no token (401), valid wrong role (403), expired token (401). Fill all nine protocol fields and write one line explaining why each test distinguishes a hypothesis.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact config/export đã sao lưu trong lab, xác nhận use case cũ vẫn pass và không xóa persistent storage

## 11. Independent Lab

Take the Week 3 Boss Fight only after the guided matrix. If assisted, it remains learning evidence but cannot count as clean PASS. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Create a handoff for SV2 or SV3 containing endpoint, expected/actual status, issuer/claim checks, reproduction, likely layer and correlation/time. Do not prescribe changes outside SV1 scope without evidence.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Inject wrong issuer or expired test token, then separately remove a role mapper. Keep cases isolated; show why one is 401 and the other 403.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Record status and safe request context, then follow the matching 401 or 403 decision tree without changing config.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại health, negative test và một caller/use case lân cận sau khi sửa

## 15. Common Beginner Errors

- Use role checklist for 401
- Use JWKS checklist for pure 403
- Paste token into Issue
- Disable validation
- Forget refreshed token

## 16. Self-check Questions

1. First three 401 checks?
2. First three 403 checks?
3. Why not restart before logs?
4. What is a safe handoff payload?

## 17. Evidence Required

- incident-report: all nine protocol fields
- terminal-output: sanitized discovery/JWKS/log status
- explanation: 401/403 branch decision

Evidence type bắt buộc cho gate: `incident-report` + `terminal-output` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được status-specific evidence protocol and safe escalation, và hard gate được commit server-side. Nếu FAIL, quay lại 401/403 classification or identity test ordering; không mở khóa bằng cách sửa status phía client.
