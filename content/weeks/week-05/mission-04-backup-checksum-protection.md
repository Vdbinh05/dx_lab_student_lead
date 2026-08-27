---
id: w5-m4-backup-checksum-protection
week: 5
order: 4
title: "Database Backup, Checksum & Protection"
category: "Backup"
skillId: "deployment"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "PostgreSQL pg_dump, backup artifact/checksum, safe location, retention/access and no Git policy"
keywords: ["backup","pg_dump","checksum","sha256","retention","access","restore","postgres"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w5-m3-kpi-data-validation"]
requiredEvidence: ["terminal-output","config","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 owns operations/recovery coordination. Roadmap requires evidence that data can be protected and later restored, not a command copied into docs."
---

## 1. Ví dụ đời thường

Backup is a sealed copy of the ledger stored in another safe, with a checksum seal proving it has not changed. A file named backup on the same burning desk—or committed to Git—is not recovery protection.

## 2. Giải thích cực dễ

Backup is not restore proof, but must be a real artifact with timestamp, scope, checksum, secure location and access policy. Use pg_dump from database service; do not dump secrets into issue/chat. Keep backup outside Git and never overwrite current production data during practice.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Logical PostgreSQL backup serializes database schema/data through pg_dump. A cryptographic checksum detects accidental artifact corruption/change but does not establish recoverability by itself. Backup policy defines location, permissions, retention, restore target and verification drill.

## 4. Why DX-Lab needs it

SV1 owns operations/recovery coordination. Roadmap requires evidence that data can be protected and later restored, not a command copied into docs. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- logical backup scope
- pg_dump custom format
- timestamped naming
- checksum
- safe storage/access
- not Git
- retention
- backup manifest
- backup versus restore

## 7. Commands / Config examples

```bash
docker compose exec -T postgres pg_dump -U dxlab -Fc dxlab > backup-w5.dump
sha256sum backup-w5.dump
Get-Item backup-w5.dump
```

**COMMAND:** `docker compose exec -T postgres pg_dump -U dxlab -Fc dxlab > backup-w5.dump` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Run from a protected backup directory on the host, not repository root. On PowerShell use `Get-FileHash -Algorithm SHA256 backup-w5.dump`; never redirect a backup into tracked project files.  
**WHY:** Create a logical backup stream from Postgres, then record checksum/size as one artifact integrity evidence point.  
**EXPECTED OUTPUT:** Non-zero backup file, SHA-256 checksum and manifest with source/time/version/access/retention. The command does not modify database data.  
**COMMON FAILURE:** Shell creates empty file because container/credential fails, backup saved in Git tree, wrong DB, no free disk, checksum omitted, or backup contains sensitive data shared publicly.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Run from a protected backup directory on the host, not repository root. On PowerShell use `Get-FileHash -Algorithm SHA256 backup-w5.dump`; never redirect a backup into tracked project files. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Non-zero backup file, SHA-256 checksum and manifest with source/time/version/access/retention. The command does not modify database data. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Create a disposable lab backup outside repository, calculate hash, inspect non-zero size and write manifest. Immediately plan restore to a separate target—not active DB.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Review a proposed backup location against access/retention/no-Git/restore target rules and identify why a checksum alone is insufficient. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Correlate backup time with service/version/migration state. Tell SV2 what logical data/schema coverage exists; do not ask them to accept restore proof before separate target test.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Intentionally use invalid DB name or unwritable disposable directory. Capture command exit/stderr/size, identify whether no artifact or incomplete artifact exists, and fix destination/connection safely.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Check pg_dump exit status, non-zero artifact size and checksum before treating a backup as usable.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Call backup a restore test
- Redirect dump into repo
- Ignore zero-byte output
- Use same active DB as restore target
- Send dump in public chat

## 16. Self-check Questions

1. Checksum proves what and not what?
2. Why backup outside Git?
3. Where restore?
4. Why record migration/version?

## 17. Evidence Required

- terminal-output: sanitized pg_dump/hash/size
- config: backup manifest/access/retention policy
- explanation: backup versus restore proof

Evidence type bắt buộc cho gate: `terminal-output` + `config` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được backup artifact integrity and data-safety policy, và hard gate được commit server-side. Nếu FAIL, quay lại backup command/artifact validation or protection policy; không mở khóa bằng cách sửa status phía client.
