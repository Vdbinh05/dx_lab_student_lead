---
id: w7-m3-write-tool-pending-hitl
week: 7
order: 3
title: "Write Tools: Pending-only State & HITL"
category: "Agent Write Security"
skillId: "agent-integration"
estimatedMinutes: 210
targetLevel: "L3"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "create_purchase_request tool, source=AI, DRAFT/PENDING, no approve tool, Manager approval and workflow continuation"
keywords: ["write tool","purchase request","pending","draft","source ai","manager","approval","hitl"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w7-m2-read-tool-schema-validation"]
requiredEvidence: ["test-result","log","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "This combines Agent integration with Week 4 HITL. It is the critical security boundary that prevents self-approval/privilege escalation in demos and production-like training."
---

## 1. Ví dụ đời thường

Agent may fill a purchase-request draft and mark prepared by AI; it cannot stamp approved. The manager reads, approves or rejects, then workflow moves. Draft creation is not a blank check.

## 2. Giải thích cực dễ

Write tool must use narrow args, validate amount/product/actor, force source=AI and final initial state=DRAFT/PENDING on Backend. Ignore/reject caller-provided APPROVED. Approval endpoint/tool is not available to Agent; Manager role/human flow controls it.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Controlled write tools create proposed domain state under server-enforced invariants. Backend derives immutable metadata and allowed state independent of client/Agent request, authorizes actor, validates arguments, persists audit and requires a separate human-authorized transition for approval.

## 4. Why DX-Lab needs it

This combines Agent integration with Week 4 HITL. It is the critical security boundary that prevents self-approval/privilege escalation in demos and production-like training. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L3**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- write schema
- source=AI server-side
- DRAFT/PENDING forced state
- argument limits
- Manager-only approval
- no direct approve tool
- audit/correlation
- duplicate/idempotency

## 7. Commands / Config examples

```bash
curl -i -X POST http://localhost:8000/api/tools/purchase-requests
curl -i -X POST http://localhost:8000/api/purchase-requests/DEMO/approve
docker compose logs --tail=200 backend
docker compose logs --tail=150 agent
```

**COMMAND:** `curl -i -X POST http://localhost:8000/api/tools/purchase-requests` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Use only disposable demo request and secure test auth. Record status/role/audit summaries, not token, customer/supplier or financial values.  
**WHY:** Compare Agent-proposed create state with separate approval policy and correlate audit/log behavior.  
**EXPECTED OUTPUT:** Create yields source=AI plus DRAFT/PENDING; unauthorized/Agent approval is denied; Manager path requires human actor; audit shows proposal and later decision separately.  
**COMMON FAILURE:** Client can submit APPROVED, Agent has approve tool, Backend trusts source/status input, missing role guard, no idempotency or audit, workflow proceeds before approval.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Use only disposable demo request and secure test auth. Record status/role/audit summaries, not token, customer/supplier or financial values. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Create yields source=AI plus DRAFT/PENDING; unauthorized/Agent approval is denied; Manager path requires human actor; audit shows proposal and later decision separately. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Create a disposable request with mock Agent input including attempted status=APPROVED. Verify Backend forces/rejects as pending, then run one denied and one Manager approval test.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Design a red-team test for huge quantity, malformed product ID, duplicate key and self-approve. State safe expected response and which layer blocks each. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Trace tool schema→Agent service auth→Backend validation/RBAC→pending record→Manager HITL→n8n. Handoff business validation semantics to SV2 only after all security chain checks pass.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Temporarily configure test client to send status=APPROVED. Demonstrate server rejection/override, no workflow continuation, audit denial and regression both Sales/Manager routes.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Attempt to submit final approved state through create path and verify Backend ignores/rejects it before testing workflow continuation.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Let Agent choose approved
- Use one endpoint for create and approve
- Assume prompt forbids abuse
- Skip role matrix
- No duplicate test

## 16. Self-check Questions

1. What state must write tool create?
2. Who can approve?
3. Where force source/status?
4. Why separate audit events?

## 17. Evidence Required

- test-result: pending/denied/manager matrix
- log: sanitized proposal/approval audit
- incident-report: self-approve/status injection protocol

Evidence type bắt buộc cho gate: `test-result` + `log` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được pending-only write and human approval enforcement, và hard gate được commit server-side. Nếu FAIL, quay lại write schema/state enforcement, role guard or HITL flow; không mở khóa bằng cách sửa status phía client.
