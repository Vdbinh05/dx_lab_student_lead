---
id: w8-m4-release-package-integrity-rollback
week: 8
order: 4
title: "Release Package, Integrity & Rollback"
category: "Release Engineering"
skillId: "release-management"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Release tag, CHANGELOG, notes, checksums, versioned exports, known issues, acceptance evidence and tested rollback decision"
keywords: ["release","tag","changelog","release notes","checksum","export","rollback","acceptance"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w8-m3-fresh-machine-installation"]
requiredEvidence: ["config","test-result","explanation"]
quizPassScore: 80
hardGate: true
whyItMatters: "SV1 coordinates release integrity and rollback without taking ownership of SV2 business behavior or SV3 Portal/AI implementation. The release package makes deployment, audit and handoff reproducible."
---

## 1. Ví dụ đời thường

A release package is a sealed delivery crate: version label says what it is, inventory says what is inside, checksum detects tampering, and the return route is known before the truck leaves.

## 2. Giải thích cực dễ

A green build alone is not a release. Package the exact version with v0.9 tag, CHANGELOG, release notes, checksum and required safe exports. Name known issues and rollback threshold. Do not tag a moving working tree or invent a passing acceptance score.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Release engineering creates an immutable, traceable deployment candidate. Version tags connect source to artifacts; checksums establish artifact integrity; release notes and exports capture operational state; an explicit rollback plan bounds impact when quality/security gates fail.

## 4. Why DX-Lab needs it

SV1 coordinates release integrity and rollback without taking ownership of SV2 business behavior or SV3 Portal/AI implementation. The release package makes deployment, audit and handoff reproducible. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- immutable tag/version
- CHANGELOG and release notes
- artifact checksum
- realm/workflow/dashboard exports
- known issues and acceptance score
- zero-Critical requirement
- rollback trigger and target
- release approval evidence

## 7. Commands / Config examples

```bash
git status --short
npm run typecheck
npm test
npm run build
git tag --list "v0.9"
Get-FileHash -Algorithm SHA256 <release-artifact>
```

**COMMAND:** `git status --short` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Repository root after regression passes. Calculate checksums only for the final release artifact and keep exports in the approved release package, never include real secrets or mutable production data.  
**WHY:** Confirm a clean, validated source revision and calculate a verifiable SHA-256 checksum for the artifact that reviewers actually download or deploy.  
**EXPECTED OUTPUT:** The package ties one immutable v0.9 source tag to release notes, CHANGELOG, checksum, safe exports, known issues, acceptance evidence and a tested rollback target. Critical defects or missing evidence stop release.  
**COMMON FAILURE:** Tag dirty/unreviewed source, checksum a different artifact, export credentials, omit known issue, treat a manual restart as rollback, release with Critical defect or confuse a Git tag with deployment verification.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Repository root after regression passes. Calculate checksums only for the final release artifact and keep exports in the approved release package, never include real secrets or mutable production data. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

The package ties one immutable v0.9 source tag to release notes, CHANGELOG, checksum, safe exports, known issues, acceptance evidence and a tested rollback target. Critical defects or missing evidence stop release. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Create a release dry-run checklist: commit/tag candidate, command results, artifact name/hash, exports manifest, known issues, acceptance score, approver and rollback trigger. Run it against a safe local candidate without publishing anything externally.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Given a failed post-release smoke caused by configuration drift, decide whether rollback or hotfix is safer. State evidence, blast radius, exact target revision, owner communications and required regression before re-release. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Collect SV2 API/OpenAPI and workflow export evidence plus SV3 Portal/AI/demo export evidence. Verify their manifest/version is referenced, but escalate functional defects to the appropriate owner rather than patching their module silently.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Use a disposable artifact copy with a changed byte or missing manifest entry. Detect the mismatch from checksum/inventory, stop promotion, restore the known-good candidate and rerun the relevant regression.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Verify the exact candidate revision, package manifest and checksum before promotion; stop if any item does not match.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Tag a dirty tree
- Checksum the wrong file
- Ship real secrets in export
- Hide a Critical defect
- Use untested rollback

## 16. Self-check Questions

1. What binds source to release?
2. What does a checksum prove?
3. Which exports belong in the package?
4. When must release stop?

## 17. Evidence Required

- config: release manifest/tag/checksum/exports list
- test-result: release dry-run and rollback decision report
- explanation: immutable release and zero-Critical rule

Evidence type bắt buộc cho gate: `config` + `test-result` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 80%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được release traceability, artifact integrity and rollback threshold, và hard gate được commit server-side. Nếu FAIL, quay lại release manifest, Critical defect classification or rollback evidence; không mở khóa bằng cách sửa status phía client.
