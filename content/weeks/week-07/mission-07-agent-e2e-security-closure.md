---
id: w7-m7-agent-e2e-security-closure
week: 7
order: 7
title: "Agent E2E, Security Closure & Configuration Freeze Prep"
category: "Agent QA"
skillId: "security-review"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Two controlled tools, E2E Agent workflow, DRAFT/PENDING/Manager approval, AI audit, red-team report and final config inventory prep"
keywords: ["agent e2e","security closure","configuration freeze","tool","audit","red team","pending","release"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w7-m6-agent-red-team-security"]
requiredEvidence: ["test-result","config","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "This mission closes the security gate and stops future release configuration from becoming undocumented drift. SV1 coordinates proof across team modules while preserving ownership."
---

## 1. Ví dụ đời thường

Before sealing an appliance for release, test each button, safety lock and alarm with the wiring diagram. Then freeze labeled cables/ports/settings; later change must go through impact review, not a quiet swap.

## 2. Giải thích cực dễ

Week 7 proves at least read/write controlled tools, auth/RBAC/HITL/audit and red-team. It also prepares Week 8 configuration freeze: every release service needs owner/image/hostname/ports/network/volume/health/env/auth/dependencies/public boundary source of truth. Unknown release item is P0, not hidden.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Security closure aggregates verified trust boundaries, authentication/authorization matrices, tool constraints, audit evidence, red-team results and remediation. Configuration freeze establishes controlled change management for release-critical service contracts, with impact analysis, regression and documentation updates for any later change.

## 4. Why DX-Lab needs it

This mission closes the security gate and stops future release configuration from becoming undocumented drift. SV1 coordinates proof across team modules while preserving ownership. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- two-tool inventory
- read/write acceptance
- service/user auth
- RBAC/HITL
- audit/red-team results
- public/internal boundary
- config inventory
- TBD owner/deadline/source of truth

## 7. Commands / Config examples

```bash
docker compose config
docker compose ps
docker compose logs --tail=150 agent
docker compose logs --tail=150 backend
curl -fsS http://localhost:8100/health
curl -fsS http://localhost:8000/health
```

**COMMAND:** `docker compose config` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at Compose root. Build inventory from versioned Compose/.env.example/docs/test evidence; do not invent unimplemented services or publish internal endpoints to satisfy a checklist.  
**WHY:** Capture current deployment contract and health/log evidence to compare with freeze inventory.  
**EXPECTED OUTPUT:** Two tool contracts and security matrix have positive/negative evidence; red-team has no Critical bypass; config inventory contains no anonymous release service/port/health/env/auth boundary, and unresolved item has owner/deadline/source.  
**COMMON FAILURE:** Claim closure with only happy path, leave Agent credentials/TBD vague, expose Qdrant/Ollama, document latest image tag, hide failed red-team case or freeze without tests/docs alignment.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at Compose root. Build inventory from versioned Compose/.env.example/docs/test evidence; do not invent unimplemented services or publish internal endpoints to satisfy a checklist. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Two tool contracts and security matrix have positive/negative evidence; red-team has no Critical bypass; config inventory contains no anonymous release service/port/health/env/auth boundary, and unresolved item has owner/deadline/source. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Run one controlled read and write proposal E2E, then Manager approval. Add statuses/correlation/audit to report. Build configuration-freeze inventory table for all current services and mark unknowns explicitly.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Attempt Boss Fight #agent-07 unassisted, then create a release-risk list containing any unproven RBAC/HITL/secret/public boundary. Do not convert assumptions into PASS. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Review inventory with SV2/SV3: API contracts/workflow, Portal/AI models. After freeze, require Change→impact→PR→regression→docs update. No user-facing source code ownership transfer occurs.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Introduce one configuration drift in a disposable tool service (wrong host/port/role). Detect against inventory/config, impact callers/auth/tests/docs, fix minimal change and perform regression.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Compare every service in inventory with resolved Compose/.env/docs/health evidence; flag mismatch or unknown before declaring freeze.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Freeze untested assumptions
- Use latest image
- Leave secret name undocumented
- Call red-team optional
- Change after freeze without impact review

## 16. Self-check Questions

1. What constitutes security closure?
2. What config fields freeze?
3. What makes a P0 TBD?
4. What follows post-freeze change?

## 17. Evidence Required

- test-result: two-tool E2E plus security/red-team matrix
- config: configuration-freeze inventory/TBD register
- explanation: release security closure and controlled-change rule

Evidence type bắt buộc cho gate: `test-result` + `config` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được end-to-end Agent security and frozen release-contract discipline, và hard gate được commit server-side. Nếu FAIL, quay lại tool/RBAC/HITL proof, red-team closure or configuration inventory; không mở khóa bằng cách sửa status phía client.
