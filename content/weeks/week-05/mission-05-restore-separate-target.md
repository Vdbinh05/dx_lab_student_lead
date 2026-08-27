---
id: w5-m5-restore-separate-target
week: 5
order: 5
title: "Restore Drill on a Separate Target"
category: "Recovery"
skillId: "fresh-machine"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Restore backup into new test DB/volume, migration if required, smoke, row-count comparison and no active DB overwrite"
keywords: ["restore","pg_restore","separate target","test database","row count","smoke","recovery","backup"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w5-m4-backup-checksum-protection"]
requiredEvidence: ["test-result","terminal-output","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "This is Week 5 hard gate. A backup without a successful independent restore is unverified. SV1 must make target and destructive scope explicit before command execution."
---

## 1. Ví dụ đời thường

Restore drill is rehearsing evacuation in a separate building. You do not bulldoze the building people are working in to see if the spare keys fit.

## 2. Giải thích cực dễ

Restore into a named test database/volume, not source. Confirm target identity, create/clean only explicit disposable target, restore, apply necessary compatible migrations, run health/API smoke and compare meaningful counts/records. Keep source untouched.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Recovery verification restores a logical backup into an isolated database/storage target, then validates schema compatibility and representative data/application behavior. Row-count/known-record comparisons detect obvious restoration gaps; functional smoke verifies callers can use recovered state.

## 4. Why DX-Lab needs it

This is Week 5 hard gate. A backup without a successful independent restore is unverified. SV1 must make target and destructive scope explicit before command execution. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- source versus restore target
- test DB/volume naming
- pg_restore custom format
- migration compatibility
- row count/known record comparison
- application smoke
- cleanup
- recovery report

## 7. Commands / Config examples

```bash
docker compose exec -T postgres createdb -U dxlab dxlab_restore_test
docker compose exec -T postgres pg_restore -U dxlab -d dxlab_restore_test --clean --if-exists < backup-w5.dump
docker compose exec postgres psql -U dxlab -d dxlab_restore_test -c 'select count(*) from orders;'
docker compose exec postgres dropdb -U dxlab dxlab_restore_test
```

**COMMAND:** `docker compose exec -T postgres createdb -U dxlab dxlab_restore_test` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Run from protected backup directory. Replace target only with a confirmed disposable `*_restore_test` database. Do not run --clean against active dxlab database.  
**WHY:** Explicitly create/restore/query/drop an isolated target and prevent ambiguous destructive scope.  
**EXPECTED OUTPUT:** Restore command completes against test DB; schema and representative counts match documented expectation; API/smoke can point to isolated target if designed; source database remains unchanged.  
**COMMON FAILURE:** Wrong target DB, incompatible dump/version, active connections, permissions, missing migration, row mismatch, or mistakenly testing only database connection rather than usable flow.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Run from protected backup directory. Replace target only with a confirmed disposable `*_restore_test` database. Do not run --clean against active dxlab database. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Restore command completes against test DB; schema and representative counts match documented expectation; API/smoke can point to isolated target if designed; source database remains unchanged. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Use a backup from W5-M4. Write source/target names before commands, restore into separate test DB, compare two tables/one known business record, run read-only smoke, record report and cleanup only test target.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Design cross-machine restore checklist: artifact transfer/hash, target isolation, config changes, import, migrations, smoke, counts and permissions. State what needs owner approval. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

If app supports DATABASE_URL override, run an isolated read-only Backend smoke against restore DB. Never send workflow writes at restored data unless test target is intentionally disposable.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Use a dump from before a known migration in test target. Diagnose schema mismatch, decide migration order with SV2 evidence, apply only to target and re-run smoke.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Confirm and print source/target identifiers before restore; refuse any --clean command whose target is not disposable.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Restore over source
- Use --clean with unverified DB name
- Skip hash
- Compare only one count
- Call restore success without app smoke

## 16. Self-check Questions

1. Why separate target?
2. What must be named before --clean?
3. Why compare data and app smoke?
4. When involve SV2?

## 17. Evidence Required

- test-result: source/target restore report, count and smoke
- terminal-output: target-specific restore commands/output
- explanation: destructive-scope safety

Evidence type bắt buộc cho gate: `test-result` + `terminal-output` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được recovery isolation, verification and destructive-scope control, và hard gate được commit server-side. Nếu FAIL, quay lại target isolation, restore/migration compatibility or verification report; không mở khóa bằng cách sửa status phía client.
