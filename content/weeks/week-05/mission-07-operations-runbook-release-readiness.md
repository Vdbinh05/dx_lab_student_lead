---
id: w5-m7-operations-runbook-release-readiness
week: 5
order: 7
title: "Operations Runbook, Recovery Review & Weekly Gate"
category: "Operations QA"
skillId: "release"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Start/stop/health/log/backup/restore/common-failure runbook, recovery evidence, review and weekly operations gate"
keywords: ["runbook","operations","backup","restore","health","logs","recovery","release readiness"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w5-m6-operations-failure-recovery"]
requiredEvidence: ["config","test-result","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "W5 deliverable makes later fresh-machine/release possible. SV1 owns operative documentation, but modules retain their owners and all release-critical TBDs must be explicit."
---

## 1. Ví dụ đời thường

Runbook is the cockpit checklist. It tells a different capable person where to stand, which command to use, what normal output looks like, what can break data and what to do next. A command list without context is not a checklist.

## 2. Giải thích cực dễ

Write operations docs based on commands actually tested: directory, expected output, data impact, env/port assumptions, cleanup and owner. Weekly review checks Service Matrix, six KPI validation, backup/restore report and failure drills before gate—not reading completion.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

An operational runbook is a tested procedure that defines prerequisites, commands, expected observations, failure branches, data-safety constraints, recovery and verification. Review converts scattered evidence into auditable readiness criteria and regression inputs for release.

## 4. Why DX-Lab needs it

W5 deliverable makes later fresh-machine/release possible. SV1 owns operative documentation, but modules retain their owners and all release-critical TBDs must be explicit. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- start/stop
- health/log commands
- service health matrix
- BI access/KPI validation
- backup/checksum
- separate restore
- common failure/recovery
- data safety and ownership

## 7. Commands / Config examples

```bash
docker compose config
docker compose ps
docker compose logs --tail=100 backend
curl -fsS http://localhost:8000/health
docker compose exec -T postgres pg_dump -U dxlab -Fc dxlab > /safe/backup/demo.dump
```

**COMMAND:** `docker compose config` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Commands belong in docs with an explicit repository/backup directory. `/safe/backup` is illustrative; use actual protected backup location and never create an arbitrary root path.  
**WHY:** A runbook must show exact scope and expected output for operating stack and backup—not only copy generic commands.  
**EXPECTED OUTPUT:** A peer can follow docs to start/health/log/backup/restore-test safely, identify data impact and escalate with evidence. Documents do not contain secret, personal path or untested command.  
**COMMON FAILURE:** Docs use a wrong directory/port/service, omit destructive warning, backup into Git, restoration overwrites source, command is never tested or owner boundary absent.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Commands belong in docs with an explicit repository/backup directory. `/safe/backup` is illustrative; use actual protected backup location and never create an arbitrary root path. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

A peer can follow docs to start/health/log/backup/restore-test safely, identify data impact and escalate with evidence. Documents do not contain secret, personal path or untested command. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Write or update docs/operation.md and docs/backup-restore.md based on prior labs. Ask a peer/self-review pass to compare every command with actual Compose config and output.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Perform a 10-minute rehearsal: given service unhealthy, locate the runbook, collect evidence, select owner, recover in lab and record docs gap. Do not improve docs by hiding uncertainty. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Review runbook with SV2/SV3 interface owners: Backend/DB, Portal/AI service checks. Record exact TBD owner/deadline/source of truth if not yet frozen.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Plant one stale port/command in a copy of the runbook. Detect through `docker compose config`, correct it, and update regression checklist—not production config blindly.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Cross-check each runbook command against resolved Compose/config and execute it safely in the stated directory/target.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Copy docs commands never run
- No data impact warning
- Mix install/deploy/recovery scopes
- Store secret in examples
- Mark gate PASS without restore drill

## 16. Self-check Questions

1. What every runbook command must state?
2. What proves restore?
3. Who owns a TBD?
4. Why docs are release surface?

## 17. Evidence Required

- config: tested runbook/backup references
- test-result: restore plus recovery rehearsal
- explanation: weekly operations gate and remaining blockers

Evidence type bắt buộc cho gate: `config` + `test-result` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được tested operations runbook and recovery readiness, và hard gate được commit server-side. Nếu FAIL, quay lại runbook scope/data safety or missing recovery evidence; không mở khóa bằng cách sửa status phía client.
