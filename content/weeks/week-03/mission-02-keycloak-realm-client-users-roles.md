---
id: w3-m2-keycloak-realm-client-users-roles
week: 3
order: 2
title: "Keycloak Realm, Client, Users & Roles"
category: "Keycloak"
skillId: "keycloak"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Keycloak realm/client/users/roles model and four-role DX-Lab demo setup"
keywords: ["keycloak","realm","client","user","role","admin","manager","sales","warehouse"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w3-m1-identity-authentication-authorization"]
requiredEvidence: ["config","terminal-output","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 owns identity configuration/reproducibility and security coordination. The team requires a stable role matrix for Backend, workflow and demo, not manually assigned ad hoc access."
---

## 1. Ví dụ đời thường

Realm là khuôn viên trường; client là một tòa nhà đăng ký; users là người có thẻ; roles là quyền chức năng được cấp. Gắn role vào user không tự khiến mọi tòa nhà hiểu role nếu mapper/client contract chưa đúng.

## 2. Giải thích cực dễ

Tạo realm riêng dx-lab, client cho Portal, demo users and roles admin/manager/sales/warehouse. Credentials demo là dữ liệu lab, khác secret cá nhân. Chỉ redirect URI thật sự cần thiết; wildcard rộng làm tăng risk.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

A Keycloak realm isolates users, credentials, clients, roles and protocol configuration. A client defines an application integration and allowed redirect URIs. Realm/client roles are assigned to users or groups and emitted only according to protocol mappers/scopes.

## 4. Why DX-Lab needs it

SV1 owns identity configuration/reproducibility and security coordination. The team requires a stable role matrix for Backend, workflow and demo, not manually assigned ad hoc access. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- realm isolation
- confidential/public client awareness
- client ID
- valid redirect URI
- web origins awareness
- realm/client roles
- demo users/password policy
- role assignment

## 7. Commands / Config examples

```bash
docker compose exec keycloak /opt/keycloak/bin/kc.sh show-config
curl -fsS http://localhost:8080/realms/dx-lab/.well-known/openid-configuration
docker compose logs --tail=100 keycloak
docker compose config
```

**COMMAND:** `docker compose exec keycloak /opt/keycloak/bin/kc.sh show-config` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at Compose root; `kc.sh show-config` runs inside the Keycloak container. Manage realms in the admin UI or versioned import file, never by pasting admin credentials into evidence.  
**WHY:** Confirm runtime configuration and realm discovery while preserving credential boundaries.  
**EXPECTED OUTPUT:** Keycloak process and realm discovery are available; versioned realm configuration defines Portal client, four demo roles/users and constrained redirect URL.  
**COMMON FAILURE:** Wrong admin bootstrap env, client uses wrong redirect URL, duplicate role spelling, realm config not persisted/exported, or wildcard redirect set too wide.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at Compose root; `kc.sh show-config` runs inside the Keycloak container. Manage realms in the admin UI or versioned import file, never by pasting admin credentials into evidence. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Keycloak process and realm discovery are available; versioned realm configuration defines Portal client, four demo roles/users and constrained redirect URL. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

In a disposable dx-lab realm, create the Portal client, four roles and four demo users. Build a matrix user→role→allowed scenario. Verify discovery and logout/login with one demo account without recording passwords.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact config/export đã sao lưu trong lab, xác nhận use case cũ vẫn pass và không xóa persistent storage

## 11. Independent Lab

Add a hypothetical Accountant role only as an impact analysis: list Keycloak, claim mapper, Backend RBAC, workflow, Portal awareness, tests, demo docs. Do not silently implement other owners' modules. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Map role owner expectations across Backend and workflow. Ask SV2 for accepted authorization policy; then verify Keycloak emits intended role inputs, not business permissions.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Configure a redirect URI that differs by port/path from Portal callback. Capture client config/browser symptom/IdP log and fix only the exact URI; do not use wildcard as a shortcut.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Verify realm discovery and compare exact Portal callback URL to the configured valid redirect URI.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại health, negative test và một caller/use case lân cận sau khi sửa

## 15. Common Beginner Errors

- Use Keycloak master realm for app users
- Share real password as demo password
- Wide wildcard redirect
- Assume role assignment alone proves token claim
- Mix admin client and Portal client

## 16. Self-check Questions

1. Realm isolates which objects?
2. Client config controls what browser redirect risk?
3. Why keep demo credentials distinct?
4. New role change hits which owners?

## 17. Evidence Required

- config: redacted realm/client/role matrix
- terminal-output: discovery/runtime health
- explanation: role impact analysis

Evidence type bắt buộc cho gate: `config` + `terminal-output` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được realm/client contract, role matrix and redirect security, và hard gate được commit server-side. Nếu FAIL, quay lại realm/client/role model or exact redirect configuration; không mở khóa bằng cách sửa status phía client.
