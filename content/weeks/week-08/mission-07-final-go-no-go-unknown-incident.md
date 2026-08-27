---
id: w8-m7-final-go-no-go-unknown-incident
week: 8
order: 7
title: "Final Go/No-Go, Team Readiness & Unknown Incident"
category: "Final Integration"
skillId: "team-readiness"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Evidence-based final readiness decision through unknown incident triage, project acceptance, zero-Critical rule, freeze/escalation and regression rerun"
keywords: ["go no-go","team readiness","unknown incident","critical","acceptance","triage","escalation","regression"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w8-m6-timed-demo-oral-defense"]
requiredEvidence: ["incident-report","test-result","explanation"]
quizPassScore: 80
hardGate: true
whyItMatters: "This is SV1's final coordination capability: preserve system safety and ownership while turning an ambiguous signal into an evidence-backed release decision. It does not authorize bypassing validation or implementing another role's module."
---

## 1. Ví dụ đời thường

Go/no-go is a launch-room decision. No one presses launch because the clock is loud; the room checks each red indicator, knows who owns it and either proves it safe or delays with a recovery plan.

## 2. Giải thích cực dễ

Final readiness combines evidence, not confidence. Run the unknown incident protocol, classify severity and owner, prove must flows, confirm config freeze/docs/fresh-machine/release artifacts and decide go or freeze. Any Critical, failed hard gate or unsupported claim is no-go.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

A release readiness gate aggregates acceptance criteria, security and operational evidence, recovery capability and unresolved risk. Unknown-incident handling tests diagnostic method independently of a pre-labeled subsystem. Go/no-go is a documented decision with inputs, rationale, owner actions and regression exit criteria.

## 4. Why DX-Lab needs it

This is SV1's final coordination capability: preserve system safety and ownership while turning an ambiguous signal into an evidence-backed release decision. It does not authorize bypassing validation or implementing another role's module. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- unknown-layer triage
- symptom-to-regression protocol
- severity/Critical classification
- must-flow acceptance
- team readiness inputs
- config/docs/fresh-machine checks
- go/no-go decision log
- freeze/escalation/rerun criteria

## 7. Commands / Config examples

```bash
docker compose ps
docker compose logs --tail 100
curl -fsS http://localhost:3000/api/health
npm run typecheck
npm test
npm run build
```

**COMMAND:** `docker compose ps` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Release-candidate environment and repository root. Collect minimally sufficient redacted evidence; do not use destructive cleanup or change several configurations while diagnosing an unknown incident.  
**WHY:** Establish status, recent evidence and deterministic quality-gate results before claiming a root cause or opening/closing release.  
**EXPECTED OUTPUT:** A decision record names candidate, must-flow results, acceptance score, incident severity/owner, config/fresh-machine/docs/release evidence, open risks and explicit GO or NO-GO. NO-GO freezes promotion until owner evidence and regression pass.  
**COMMON FAILURE:** Guess layer from one symptom, restart before evidence, call unknown incident resolved without verification, release with Critical, hide failed gate, cross role boundary or accept verbal readiness.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Release-candidate environment and repository root. Collect minimally sufficient redacted evidence; do not use destructive cleanup or change several configurations while diagnosing an unknown incident. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

A decision record names candidate, must-flow results, acceptance score, incident severity/owner, config/fresh-machine/docs/release evidence, open risks and explicit GO or NO-GO. NO-GO freezes promotion until owner evidence and regression pass. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Run the data-driven W8 unknown incident. Record SYMPTOM→EVIDENCE→HYPOTHESIS→TEST→RESULT→ROOT CAUSE→FIX→VERIFICATION→REGRESSION. Then complete a readiness table and write GO/NO-GO with owner/date/exit condition.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Given 'SSO works but dashboard action intermittently fails after release', design a minimal triage sequence across Portal/Identity/API/workflow/network without naming the root cause early. State when release freezes and how you hand off. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Bring SV2/SV3 status into the readiness review as evidence, not assumptions. Each owner confirms their acceptance evidence; SV1 consolidates dependencies, escalates blockers and reruns the full regression only after minimal fixes.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Use the provided unknown incident without looking at its hidden solution. Submit evidence/hypothesis/test before reveal, compare diagnosis, make only the minimum corrective plan and demonstrate regression criteria.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Capture current service/health/log evidence and state one falsifiable hypothesis before changing configuration or restarting.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Release on confidence
- Restart before evidence
- Hide Critical defect
- Name root cause immediately
- Accept owner verbal status

## 16. Self-check Questions

1. What triggers NO-GO?
2. How do you triage unknown layer?
3. What evidence proves team readiness?
4. When is regression rerun?

## 17. Evidence Required

- incident-report: W8 unknown-incident causal chain
- test-result: final readiness/acceptance and regression report
- explanation: go/no-go rationale, ownership and exit criteria

Evidence type bắt buộc cho gate: `incident-report` + `test-result` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 80%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được unknown-incident reasoning, zero-Critical discipline and traceable final readiness decision, và hard gate được commit server-side. Nếu FAIL, quay lại unknown incident protocol, Critical classification, owner evidence or regression exit criteria; không mở khóa bằng cách sửa status phía client.
