---
id: w8-m3-fresh-machine-installation
week: 8
order: 3
title: "Fresh-machine Installation & Reproducible Bootstrap"
category: "Fresh-machine"
skillId: "fresh-machine"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Clean machine→clone→env→Compose→imports/migration/seed→AI bootstrap→smoke flow without source/path edits"
keywords: ["fresh machine","clone","environment","compose","migration","seed","bootstrap","smoke"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w8-m2-configuration-freeze-change-impact"]
requiredEvidence: ["test-result","terminal-output","explanation"]
quizPassScore: 80
hardGate: true
whyItMatters: "Fresh-machine is a final hard gate for SV1 deployment/release competency. It validates real documentation, configuration freeze, migration/seed and service integration simultaneously."
---

## 1. Ví dụ đời thường

Fresh-machine is asking another person to assemble a kit using only the printed instructions. If it needs the original maker's private path, hidden file or oral clue, the kit is not reproducible.

## 2. Giải thích cực dễ

Start from a clean machine/user profile, clone release, copy safe .env.example, set documented values, run migrations/seeds/imports/bootstrap in order, then smoke/E2E. Do not edit source or hard-code personal path to pass. First model pull time may be excluded but must be recorded.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Reproducibility verifies that versioned source, configuration contracts and documented bootstrap commands create a functional runtime from an independent environment. It exposes hidden state, environment drift, unpinned dependencies and undocumented imports through objective readiness timing and smoke results.

## 4. Why DX-Lab needs it

Fresh-machine is a final hard gate for SV1 deployment/release competency. It validates real documentation, configuration freeze, migration/seed and service integration simultaneously. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- clean environment definition
- clone/release version
- .env.example and secret handling
- Compose build/start
- migration/seed/import
- AI bootstrap/model pull
- health/smoke
- timing/no source edit

## 7. Commands / Config examples

```bash
git clone <release-repository-url>
Copy-Item -LiteralPath .env.example -Destination .env
docker compose config
docker compose up -d --build
docker compose ps
Invoke-RestMethod http://localhost:3000/api/health
```

**COMMAND:** `git clone <release-repository-url>` và các lệnh liên quan trong block.  
**WHERE TO RUN:** A clean separate machine or disposable clean user environment. Replace repository URL only with the actual release source; do not put real secret values in docs/screenshots.  
**WHY:** Follow the documented bootstrap path from clone to resolved configuration, stack startup and health without local source modification.  
**EXPECTED OUTPUT:** A clean environment reaches documented ready state within target time excluding first model pull, produces service health/smoke evidence and requires no hidden paths/manual source edits.  
**COMMON FAILURE:** Missing prerequisite/version, undocumented .env variable, personal absolute path, missing realm/workflow/corpus import, wrong volume permission, unpinned image or stale docs.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

A clean separate machine or disposable clean user environment. Replace repository URL only with the actual release source; do not put real secret values in docs/screenshots. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

A clean environment reaches documented ready state within target time excluding first model pull, produces service health/smoke evidence and requires no hidden paths/manual source edits. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Make a fresh-machine checklist with start timestamp, OS/tool versions, exact commands, expected outputs, first-model-pull note, failures, fixes and finish time. Execute it in a disposable clean environment.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Ask a peer or emulate a second clean account to follow only release docs. Record every ambiguity as documentation/config defect; do not quietly fix source path on the target. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Verify Portal, Keycloak, Backend, Postgres, n8n and required AI services in source-of-truth startup order. Split identity/workflow/AI bootstrap evidence to corresponding owners for review.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Use a deliberately missing required safe environment variable in a clean lab copy. Capture validation error, repair .env.example/docs contract, restart and rerun smoke from beginning.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Follow .env.example and Compose config exactly from a clean clone, recording the first missing/ambiguous prerequisite rather than improvising.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Use developer machine state
- Edit source on target
- Copy private .env
- Ignore first model/bootstrap note
- Call containers up a fresh-machine pass

## 16. Self-check Questions

1. What proves clean environment?
2. What cannot be manually changed?
3. Why record timing?
4. Which imports/bootstrap must docs name?

## 17. Evidence Required

- test-result: fresh-machine checklist/timing/smoke report
- terminal-output: clone/config/ps/health sequence
- explanation: reproducibility defects found and corrected

Evidence type bắt buộc cho gate: `test-result` + `terminal-output` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 80%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được independent reproducible bootstrap and documentation correctness, và hard gate được commit server-side. Nếu FAIL, quay lại fresh-machine checklist, env/docs contract or hidden-state defect; không mở khóa bằng cách sửa status phía client.
