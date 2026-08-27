---
id: w8-m6-timed-demo-oral-defense
week: 8
order: 6
title: "Timed Demo, Oral Defense & Operations Q&A"
category: "Demo & Oral Defense"
skillId: "oral-defense"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "8–12 minute evidence-led demo and oral explanation of H-P-D-I architecture, Compose health, SSO, audit/correlation, operations, security and troubleshooting"
keywords: ["demo","oral defense","architecture","health","sso","audit","correlation","troubleshooting"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w8-m5-documentation-handoff-peer-verification"]
requiredEvidence: ["test-result","terminal-output","explanation"]
quizPassScore: 80
hardGate: true
whyItMatters: "SV1 must credibly coordinate release and explain infrastructure, identity and integration posture. The exercise explicitly keeps Portal/AI feature implementation and business workflow logic with their owners."
---

## 1. Ví dụ đời thường

A technical demo is a guided building inspection, not a slideshow. The guide points to the actual electrical panel, exit routes and maintenance logs, then answers what happens when a light fails.

## 2. Giải thích cực dễ

Show real system behavior in a timed story: architecture, service health, SSO, key workflow, audit/correlation and operations response. Practice questions without slides. If a feature owner is asked about their module, explain the boundary and handoff rather than guessing.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Oral defense evaluates operational understanding under questioning: causal explanation, runtime evidence, security boundaries, incident method and release decisions. A timed demo verifies a reproducible user flow rather than a prepared static presentation.

## 4. Why DX-Lab needs it

SV1 must credibly coordinate release and explain infrastructure, identity and integration posture. The exercise explicitly keeps Portal/AI feature implementation and business workflow logic with their owners. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- 8–12 minute demo narrative
- H-P-D-I architecture map
- Compose health and dependency state
- SSO and authorization boundary
- audit/correlation evidence
- incident causal chain
- operations and release Q&A
- backup presenter and fallback plan

## 7. Commands / Config examples

```bash
docker compose ps
curl -fsS http://localhost:3000/api/health
npm run typecheck
npm test
Get-Date
```

**COMMAND:** `docker compose ps` và các lệnh liên quan trong block.  
**WHERE TO RUN:** In the rehearsal environment using safe demo accounts and redacted outputs. Record timing and command proof, but do not reveal real credentials, personal data or internal-only endpoints in public material.  
**WHY:** Establish current health and a reproducible time marker before the demo so claims are anchored to live evidence rather than a cached screenshot.  
**EXPECTED OUTPUT:** The rehearsal completes core flow within 8–12 minutes, names fallback/backup presenter, answers architecture/security/troubleshooting questions with evidence and records gaps as owned actions.  
**COMMON FAILURE:** Demo only slides, depend on one person/machine, use production secret, claim healthy because container is running, answer module-owner question by inventing detail or skip Q&A evidence.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

In the rehearsal environment using safe demo accounts and redacted outputs. Record timing and command proof, but do not reveal real credentials, personal data or internal-only endpoints in public material. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

The rehearsal completes core flow within 8–12 minutes, names fallback/backup presenter, answers architecture/security/troubleshooting questions with evidence and records gaps as owned actions. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Write and rehearse a demo script: opening architecture, Compose health, SSO, user flow, audit/correlation, failure/response, release status and close. Time the run, mark every dependency and prepare an evidence-backed fallback.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Answer aloud: why can a healthy container still fail a user flow; how do 401 and 403 differ; what evidence precedes restart; when does an unknown incident freeze release? Score yourself against clarity, boundary and verification. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Coordinate a real end-to-end story with SV2 API/workflow and SV3 Portal/AI presenters. Record exact ownership transitions and make one person responsible for demo orchestration, not every feature implementation.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Simulate a safe non-destructive demo dependency delay or stale UI/API contract in a lab. Pause, present symptom/evidence/hypothesis/test, choose fallback or stop, restore the controlled state and update the runbook.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Check live health/dependencies and use a time-boxed rehearsal before relying on a demo narrative.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Demo from screenshots
- No backup presenter
- Leak demo credential
- Claim container health equals user success
- Guess outside role boundary

## 16. Self-check Questions

1. What must demo show live?
2. How long is the target run?
3. What proves an oral answer?
4. When should demo stop/fallback?

## 17. Evidence Required

- test-result: timed demo run and oral-defense score sheet
- terminal-output: health/verification commands used in rehearsal
- explanation: H-P-D-I, security and troubleshooting Q&A answers

Evidence type bắt buộc cho gate: `test-result` + `terminal-output` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 80%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được live evidence-led demo and defensible operational explanation, và hard gate được commit server-side. Nếu FAIL, quay lại timed demo, oral Q&A, fallback ownership or evidence chain; không mở khóa bằng cách sửa status phía client.
