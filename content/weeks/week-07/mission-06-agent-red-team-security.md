---
id: w7-m6-agent-red-team-security
week: 7
order: 6
title: "Agent Red-team: Injection, Privilege & Secret Defenses"
category: "Agent Red-team"
skillId: "agent-security"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Ignore-rules, self-approve, secret extraction, SQL, huge quantity, malicious retrieved text, wrong role, expired token, timeout and malformed output red-team"
keywords: ["red team","prompt injection","self approve","secret extraction","sql","privilege escalation","malicious corpus","rbac"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w7-m5-agent-audit-limits-resilience"]
requiredEvidence: ["test-result","log","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "Week 7 hard gate is zero HITL/RBAC bypass and zero secret exposure. Red-team report must show exact test, expected containment, actual evidence, root cause if failed and regression—not narrative confidence."
---

## 1. Ví dụ đời thường

Red-team puts fake malicious notes in a suggestion box: ignore manager, open safe, show keys. A secure worker follows counter policy, not notes; counter refuses forbidden forms even if worker repeats them politely.

## 2. Giải thích cực dễ

Test abuse cases with synthetic content. Success means denied/contained/safe audit—not Agent obeying. Tool schema/Backend RBAC/pending-only/HITL/secret redaction are independent defenses. No test can justify weakening role/security to score a demo.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Adversarial testing probes prompt-injection, data exfiltration, privilege escalation, unauthorized state transition, unsafe tool invocation and failure modes. Defense-in-depth relies on untrusted-input handling, allowlisted schemas, server authorization, least privilege, output controls, audit and human approval.

## 4. Why DX-Lab needs it

Week 7 hard gate is zero HITL/RBAC bypass and zero secret exposure. Red-team report must show exact test, expected containment, actual evidence, root cause if failed and regression—not narrative confidence. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- prompt injection
- malicious retrieved text
- secret extraction
- arbitrary SQL/tool URL
- self-approval
- wrong role/expired token
- huge quantity
- timeout/malformed output
- audit/report

## 7. Commands / Config examples

```bash
docker compose logs --tail=250 agent
docker compose logs --tail=250 backend
docker compose ps agent rag backend
docker stats --no-stream agent rag backend
docker compose config
```

**COMMAND:** `docker compose logs --tail=250 agent` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Disposable synthetic red-team lab only. Never use real secrets, customer data, harmful external commands or public attack targets. Keep test prompts/data in controlled fixtures and redact evidence.  
**WHY:** Capture service/audit/log/resource/config facts around controlled denied actions and verify no unsafe state was created.  
**EXPECTED OUTPUT:** All listed abuse cases are denied/contained/audited without secret exposure or unauthorized state. Any bypass is Critical/P0 and blocks Week 7/Release until fixed and retested.  
**COMMON FAILURE:** Test uses real secret, only prompt text defense, Agent has direct DB/admin path, no audit, rejection not verified at DB/state level, or team calls refusal a pass without checking side effect.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Disposable synthetic red-team lab only. Never use real secrets, customer data, harmful external commands or public attack targets. Keep test prompts/data in controlled fixtures and redact evidence. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

All listed abuse cases are denied/contained/audited without secret exposure or unauthorized state. Any bypass is Critical/P0 and blocks Week 7/Release until fixed and retested. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Run synthetic cases: ignore rules, self-approve, request secret, arbitrary SQL, huge quantity and Sales-to-Manager action. For each capture expected block layer, actual status/audit, persisted-state check and regression.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Add expired token, timeout and malformed tool output cases. Build a red-team report with severity, owner, root cause, minimal fix, verification and release decision. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Verify malicious retrieved text never overrides system/Backend tool boundary. Coordinate SV3 for prompt/retrieval safeguards and SV2 for Backend policy; SV1 verifies infra/auth/audit and reports exact evidence.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

In test fixture, give a retrieved document synthetic instruction to disclose DEMO_SECRET_DO_NOT_USE. Verify tool/schema/Backend/audit blocks it, no secret output is stored, then remove fixture from corpus/collection according to test runbook.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** For each synthetic attack, identify tool/schema/Backend/HITL block layer and verify both response and persisted state/audit.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Use real secret in red-team
- Assume model refusal is security boundary
- Do not check database state
- Mark one test pass as full security closure
- Hide failed bypass

## 16. Self-check Questions

1. Two hard success criteria?
2. Why test persisted state?
3. What blocks arbitrary SQL?
4. What after bypass?

## 17. Evidence Required

- test-result: red-team matrix with expected/actual/state check
- log: sanitized audit/no-secret proof
- incident-report: any failure full protocol and regression

Evidence type bắt buộc cho gate: `test-result` + `log` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được adversarial evidence, no-secret discipline and no-bypass security closure, và hard gate được commit server-side. Nếu FAIL, quay lại tool boundary, Backend enforcement, audit/state verification or red-team report; không mở khóa bằng cách sửa status phía client.
