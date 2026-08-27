---
id: w3-m7-realm-export-security
week: 3
order: 7
title: "Realm Export/Import, Security Review & Reproducibility"
category: "Identity Operations"
skillId: "security-review"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Keycloak realm export/import, persistence, secret protection, redirect review and reproducible identity setup"
keywords: ["realm export","realm import","persistence","redirect uri","secrets","identity","reproducibility","security"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w3-m6-identity-debug-401-403-expiry"]
requiredEvidence: ["config","test-result","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "Week 3 gate includes reproducibility and security closure. SV1 coordinates backup/export, verifies persistence and documents source of truth; no identity state should be recreated by undocumented clicks."
---

## 1. Ví dụ đời thường

Realm export giống bản vẽ có thể dựng lại trường học, không phải ảnh chụp ký túc xá đang chứa chìa khóa thật. Cần biết bản vẽ có gì, thiếu gì, ai giữ và test dựng lại trước khi tin nó.

## 2. Giải thích cực dễ

Version/export identity configuration enough to recreate realm/client/roles/users policy without storing real admin secrets. Keycloak persistence and import strategy must be tested on a clean/disposable target. Review redirect URLs, web origins, demo users and token/log exposure.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Realm export/import serializes selected identity configuration for reproducibility. Safe handling separates non-secret configuration from bootstrap/admin credentials. A recovery drill imports into a distinct target/persistent volume and verifies discovery, login, token validation and RBAC matrix.

## 4. Why DX-Lab needs it

Week 3 gate includes reproducibility and security closure. SV1 coordinates backup/export, verifies persistence and documents source of truth; no identity state should be recreated by undocumented clicks. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- realm export scope
- import target and overwrite risk
- Keycloak database/volume persistence
- bootstrap admin secret boundary
- redirect/web-origin review
- demo credential policy
- recovery drill
- identity runbook

## 7. Commands / Config examples

```bash
docker compose ps keycloak
docker compose config
docker volume inspect dxlab_keycloak_data
curl -fsS http://localhost:8080/realms/dx-lab/.well-known/openid-configuration
docker compose logs --tail=100 keycloak
```

**COMMAND:** `docker compose ps keycloak` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal in Compose project. Export/import commands depend on selected Keycloak version and project runbook; operate only against a disposable realm/volume during the drill.  
**WHY:** Verify storage/config/discovery/log evidence around a controlled export/import without exposing bootstrap secrets.  
**EXPECTED OUTPUT:** A fresh/disposable target can recreate documented realm/client/roles and pass discovery plus RBAC smoke; persistent storage remains separate from container lifecycle.  
**COMMON FAILURE:** Import into active production realm, export excludes expected objects, secret values appear in file, volume not persisted, redirect/web origin drift or version incompatibility.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal in Compose project. Export/import commands depend on selected Keycloak version and project runbook; operate only against a disposable realm/volume during the drill. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

A fresh/disposable target can recreate documented realm/client/roles and pass discovery plus RBAC smoke; persistent storage remains separate from container lifecycle. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Create an export manifest listing realm, client IDs, roles, users policy, mappers, redirect rules and excluded secrets. Import into a disposable target, then run discovery + 401/403/2xx smoke.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact config/export đã sao lưu trong lab, xác nhận use case cũ vẫn pass và không xóa persistent storage

## 11. Independent Lab

Write an identity recovery checklist that distinguishes export from backup, identifies owner/access control, and says how to prove old real secret is not in the artifact. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Verify Portal client, Backend issuer/JWKS and workflow service account conventions against imported realm. Handoff functional Portal code issues to SV3 after identity contract passes.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Attempt an import with a missing mapper or wrong redirect in a disposable target. Detect it with the role/callback matrix, correct export/source configuration and re-run full smoke.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Use a disposable target, import documented configuration, then verify discovery, callback, 401/403/2xx and persistence before calling it reproducible.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại health, negative test và một caller/use case lân cận sau khi sửa

## 15. Common Beginner Errors

- Treat export as complete DB backup
- Import over active realm
- Commit admin secret
- Assume volume exists without recreate test
- Document redirect wildcard as convenient

## 16. Self-check Questions

1. Export differs from backup?
2. What must never enter versioned realm config?
3. How do you prove import reproducibility?
4. Which tests after import?

## 17. Evidence Required

- config: export manifest/redacted source-of-truth map
- test-result: separate-target import smoke
- explanation: identity security/recovery boundary

Evidence type bắt buộc cho gate: `config` + `test-result` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được reproducible identity configuration and security closure, và hard gate được commit server-side. Nếu FAIL, quay lại export/import safety, persistence or identity smoke matrix; không mở khóa bằng cách sửa status phía client.
