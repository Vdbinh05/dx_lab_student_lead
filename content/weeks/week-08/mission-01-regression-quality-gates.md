---
id: w8-m1-regression-quality-gates
week: 8
order: 1
title: "Regression Strategy & Quality Gates"
category: "Release QA"
skillId: "ci"
estimatedMinutes: 210
targetLevel: "L3"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Reset/seed→static→unit→API→workflow→E2E regression order, CI blocking checks and evidence-led failure ownership"
keywords: ["regression","lint","typecheck","unit","api","workflow","e2e","ci"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w7-m7-agent-e2e-security-closure"]
requiredEvidence: ["test-result","terminal-output","explanation"]
quizPassScore: 80
hardGate: true
whyItMatters: "SV1 protects pipeline/Compose/release quality gates and coordinates owners. The roadmap does not require a large CI platform, only a clear blocking baseline with reproducible evidence."
---

## 1. Ví dụ đời thường

Regression is a pre-flight checklist: check aircraft parts, instruments, engines, then fly a short route. Do not start a passenger demo before discovering a missing bolt that static checks would have found.

## 2. Giải thích cực dễ

Run small/fast deterministic checks first, then dependencies and browser E2E. Regression is a measured chain: reset/seed only safe test state, lint/typecheck, unit, API, workflow, E2E. A failed check is evidence with an owner, not a reason to bypass merge.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Regression testing re-executes validated checks after change to detect unintended behavior. Layered test ordering reduces diagnosis cost and aligns failure ownership: static/source, unit, API contract, workflow integration and user-facing E2E verify progressively wider surfaces.

## 4. Why DX-Lab needs it

SV1 protects pipeline/Compose/release quality gates and coordinates owners. The roadmap does not require a large CI platform, only a clear blocking baseline with reproducible evidence. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L3**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- test pyramid/order
- safe reset/seed
- lint/typecheck/unit
- API contract tests
- workflow tests
- browser E2E
- CI blocking policy
- failure owner/evidence

## 7. Commands / Config examples

```bash
npm run lint
npm run typecheck
npm test
npm run build
docker compose config
```

**COMMAND:** `npm run lint` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Repository root for application checks; Compose root for docker compose config. Use a disposable test database/state for any reset/seed test and never reset learner progress automatically.  
**WHY:** Run defined local blocking baseline in the same sequence before wider deployment/browser checks.  
**EXPECTED OUTPUT:** Every check produces pass/fail output; failures identify exact layer and owner. Build/Compose config are not skipped because unit tests pass.  
**COMMON FAILURE:** Run unsafe reset on learner state, hide failed check, merge red pipeline, test only one layer, call build a functional test, or omit secret/repository safety check.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Repository root for application checks; Compose root for docker compose config. Use a disposable test database/state for any reset/seed test and never reset learner progress automatically. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Every check produces pass/fail output; failures identify exact layer and owner. Build/Compose config are not skipped because unit tests pass. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Write a release regression table: command, environment, expected output, failure owner, evidence artifact and re-run criteria. Execute static/unit/build/Compose checks and record timing/result.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Given Backend port change, choose regression sequence and explain which check catches Compose/proxy/Portal/n8n/docs breakage. Do not make a code change as part of the planning exercise. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Run a controlled API/workflow smoke after static checks. Send business-rule failure to SV2 and Portal UI failure to SV3 only with prior infra/config evidence.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Introduce a harmless test fixture or deliberate invalid Compose copy. Observe which early check fails, capture output, revert test artifact and prove later checks were not falsely used as a fix.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Run the narrowest relevant static/config test before altering runtime or launching browser flows.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Start with E2E only
- Reset learner database
- Merge red check
- Treat lint as security scan
- Forget Compose config

## 16. Self-check Questions

1. Why test order?
2. Which check blocks merge?
3. Who owns Compose failure?
4. Why not reset learner state?

## 17. Evidence Required

- test-result: regression matrix with timing/owner
- terminal-output: static/test/build/Compose results
- explanation: layered quality-gate rationale

Evidence type bắt buộc cho gate: `test-result` + `terminal-output` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 80%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được layered regression, gate ownership and learner-data safety, và hard gate được commit server-side. Nếu FAIL, quay lại regression order, failure ownership or safe test-state boundary; không mở khóa bằng cách sửa status phía client.
