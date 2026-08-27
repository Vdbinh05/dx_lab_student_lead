---
id: w4-m6-hitl-approval-workflow
week: 4
order: 6
title: "Human-in-the-Loop Approval & State Boundaries"
category: "HITL"
skillId: "authorization"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "DRAFT/PENDING, manager approval/rejection, workflow continuation, audit and role boundary"
keywords: ["hitl","approval","draft","pending","manager","rejected","workflow","audit"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w4-m5-retry-idempotency"]
requiredEvidence: ["test-result","log","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "This is a core integration/security boundary for Week 4 and later Agent work. SV1 coordinates identity/workflow behavior but must not implement SV2 domain state machine logic."
---

## 1. Ví dụ đời thường

A purchase request is a form put in an inbox. Creating it puts it in DRAFT/PENDING; only the manager desk can stamp APPROVED or REJECTED. A workflow cannot stamp its own request just because it made the form.

## 2. Giải thích cực dễ

HITL separates proposal from approval. A user/Agent/workflow can create DRAFT/PENDING, then a Manager role makes approval decision through Backend policy. n8n continues only after authoritative state transition. Audit must capture actor, time, old/new state and correlation.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Human-in-the-loop control gates an automated proposal through an authorized human decision. A state machine defines allowed transitions and actors. Backend authorization enforces transition rules; workflow orchestration observes/continues from trusted state rather than granting itself approval capability.

## 4. Why DX-Lab needs it

This is a core integration/security boundary for Week 4 and later Agent work. SV1 coordinates identity/workflow behavior but must not implement SV2 domain state machine logic. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- state machine
- DRAFT/PENDING
- APPROVED/REJECTED
- actor role matrix
- Backend transition guard
- workflow wait/resume
- audit/correlation
- negative approval tests

## 7. Commands / Config examples

```bash
curl -i -X POST http://localhost:8000/api/purchase-requests
curl -i -X POST http://localhost:8000/api/purchase-requests/DEMO/approve
docker compose logs --tail=200 backend
docker compose logs --tail=200 n8n
```

**COMMAND:** `curl -i -X POST http://localhost:8000/api/purchase-requests` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Use only disposable demo request IDs and secure local token tooling. Written evidence must record statuses/roles but never bearer token values.  
**WHY:** Observe creation/transition outcomes, then correlate Backend policy and workflow continuation logs.  
**EXPECTED OUTPUT:** Create returns DRAFT/PENDING; unprivileged approve is 403/denied; Manager approval yields authoritative state and workflow continuation; audit describes actor/result.  
**COMMON FAILURE:** Workflow writes APPROVED directly, UI role controls only, missing transition validation, stale role token, duplicate approval race, no audit or incorrectly resumes after rejection.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Use only disposable demo request IDs and secure local token tooling. Written evidence must record statuses/roles but never bearer token values. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Create returns DRAFT/PENDING; unprivileged approve is 403/denied; Manager approval yields authoritative state and workflow continuation; audit describes actor/result. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Diagram request lifecycle. Run positive Manager approve and negative Sales approve on disposable request. Record status before/after, actor role, correlation and n8n continuation result.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Add a rejection path to the test plan. Explain why creating a request must not give same actor approval right and how duplicate approval is handled. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Verify Keycloak role claim→Backend guard→workflow wait/resume. Hand off if domain transition rule semantics are wrong after auth/transport/audit contract passes.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

In a disposable workflow mapping, attempt to set status=APPROVED on create. Demonstrate Backend rejects/overrides it to pending, fix service contract and regression-test both roles.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Check persisted/requested state and Backend role decision before observing workflow continuation.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Approve in n8n direct DB step
- Let client choose final status
- Treat UI hidden button as HITL
- Test only Manager happy path
- Forget rejection/audit

## 16. Self-check Questions

1. Who may approve?
2. Where enforced?
3. Why pending-only write?
4. What continues workflow?

## 17. Evidence Required

- test-result: create/pending/allowed/denied/reject matrix
- log: sanitized actor/state/correlation audit
- explanation: HITL enforcement chain

Evidence type bắt buộc cho gate: `test-result` + `log` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được HITL state/actor enforcement and audit, và hard gate được commit server-side. Nếu FAIL, quay lại state transition authorization, workflow wait or audit evidence; không mở khóa bằng cách sửa status phía client.
