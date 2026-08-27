---
id: w8-m5-documentation-handoff-peer-verification
week: 8
order: 5
title: "Documentation Governance, Handoff & Peer Verification"
category: "Documentation & Handoff"
skillId: "documentation"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Versioned architecture/installation/operations/identity/integration/backup/security/demo docs, tested commands and evidence-rich SV2/SV3 handoff"
keywords: ["documentation","peer review","handoff","architecture","operation","backup","security","demo"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w8-m4-release-package-integrity-rollback"]
requiredEvidence: ["test-result","explanation","config"]
quizPassScore: 80
hardGate: true
whyItMatters: "SV1 is accountable for the operating system around the product: architecture, deployment, identity, incident, backup, release and coordination documentation. This does not authorize SV1 to absorb business or AI feature ownership."
---

## 1. Ví dụ đời thường

Documentation is the cockpit checklist passed to the next crew. A checklist is useful only if another crew can fly it, report a missing step and trace who owns the next decision.

## 2. Giải thích cực dễ

Docs must make a non-author able to install, operate, restore, troubleshoot and demo the release. A handoff is not 'please fix it': it carries symptom, evidence, reproduction, likely layer, owner, expected and actual. Update docs/config/tests together.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Operational documentation is a versioned system contract. Peer verification tests whether instructions reproduce their claimed outcome independently. Structured handoff preserves observability and ownership boundaries, reducing duplicated diagnosis and undocumented knowledge.

## 4. Why DX-Lab needs it

SV1 is accountable for the operating system around the product: architecture, deployment, identity, incident, backup, release and coordination documentation. This does not authorize SV1 to absorb business or AI feature ownership. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- architecture and service inventory
- installation and environment contract
- operations/health/log runbook
- identity/integration contracts
- backup/restore and security guidance
- demo script and known issues
- peer-tested commands
- handoff evidence template

## 7. Commands / Config examples

```bash
rg -n "TODO|TBD" README.md docs .env.example
npm run typecheck
npm test
Get-Content docs\deployment.md
Get-Content docs\implementation-plan.md
```

**COMMAND:** `rg -n "TODO|TBD" README.md docs .env.example` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Repository root and versioned documentation folders. Search publication-safe sources only; never copy a real .env, access token or personal endpoint into review evidence.  
**WHY:** Surface unresolved documentation obligations, then verify commands and ownership statements against the same release candidate.  
**EXPECTED OUTPUT:** A peer can follow docs to run safe setup/health/backup restore/demo checks. Every handoff names evidence and owner. Remaining TBDs have owner/deadline/source of truth and P0 items block release.  
**COMMON FAILURE:** Docs say 'ask author', commands untested, API contract only verbal, stale port/model, screenshots containing secrets, generic owner-less handoff or a TODO silently shipped.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Repository root and versioned documentation folders. Search publication-safe sources only; never copy a real .env, access token or personal endpoint into review evidence. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

A peer can follow docs to run safe setup/health/backup restore/demo checks. Every handoff names evidence and owner. Remaining TBDs have owner/deadline/source of truth and P0 items block release. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Create a docs review matrix for README, architecture, deployment, operation, backup, security, content authoring and demo. Ask a reviewer to execute a small command path and record expected/actual plus exact correction.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Prepare a handoff for a Portal dashboard showing stale data. Include symptom, correlation/time, health/log/network/auth checks already run, reproduction, likely owner, expected/actual and the regression required after their fix. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Cross-check source-of-truth links with SV2 and SV3. Request their module-specific docs/exports through a structured handoff, then update the system map without rewriting their business/AI logic.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Temporarily test a stale command in a disposable documentation branch or identify an intentionally outdated internal link. Capture failure, correct one source-of-truth document, have a second reader re-run it and retain both results.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Ask a non-author to follow the exact versioned command path and record the first mismatch before changing instructions.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Write docs after release only
- Use verbal API contract
- Copy secret into example
- Handoff without evidence
- Leave P0 TBD without owner

## 16. Self-check Questions

1. What proves a command works?
2. What belongs in handoff?
3. Which docs are release-critical?
4. Why must P0 TBD block release?

## 17. Evidence Required

- test-result: peer documentation verification matrix
- explanation: evidence-rich handoff and ownership boundaries
- config: versioned docs/TBD register/source-of-truth links

Evidence type bắt buộc cho gate: `test-result` + `explanation` + `config`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 80%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được documentation as a tested operational contract and evidence-rich handoff, và hard gate được commit server-side. Nếu FAIL, quay lại peer verification, source of truth, owner/deadline or handoff evidence; không mở khóa bằng cách sửa status phía client.
