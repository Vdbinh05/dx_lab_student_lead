---
id: w7-m1-agent-tool-architecture
week: 7
order: 1
title: "Agent, Tool Calling & Security Architecture"
category: "Agent Architecture"
skillId: "agent-architecture"
estimatedMinutes: 210
targetLevel: "L2"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Agent→tool selection→schema→args validation→Backend API architecture and AI is not superuser"
keywords: ["agent","tool calling","schema","validation","backend api","security","ai","superuser"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w6-m6-corpus-safety-rag-evaluation"]
requiredEvidence: ["explanation","config","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "Week 7 hard gate requires zero HITL/RBAC bypass and no secret exposure. Architecture clarity prevents a demo implementation from turning AI into a privileged integration backdoor."
---

## 1. Ví dụ đời thường

An Agent is a clerk who proposes a form to a controlled counter. The counter checks form shape, identity, permission and allowed result. Clerk is never given the warehouse master key or unrestricted SQL terminal.

## 2. Giải thích cực dễ

Agent selects a named tool with structured args. Tool schema validates shape/limits. Backend authenticates/authorizes and applies business rules. Agent cannot direct write database, choose arbitrary endpoint, self-approve or bypass HITL. SV1 owns integration/security checks; SV3 owns Agent reasoning/UX.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Tool-mediated agent architecture constrains model output to declared schemas and server-side operations. Defense in depth combines tool allowlists, argument validation, service/user authentication, Backend authorization, least privilege, audited outcomes and human approval for sensitive state transitions.

## 4. Why DX-Lab needs it

Week 7 hard gate requires zero HITL/RBAC bypass and no secret exposure. Architecture clarity prevents a demo implementation from turning AI into a privileged integration backdoor. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L2**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- agent versus tool/service
- allowlisted tool schema
- argument validation
- Backend API boundary
- auth/RBAC
- no arbitrary SQL
- no self approve
- audit/HITL chain

## 7. Commands / Config examples

```bash
docker compose config
docker compose ps agent rag backend
docker compose logs --tail=100 agent
curl -fsS http://localhost:8000/openapi.json
curl -i http://localhost:8100/health
```

**COMMAND:** `docker compose config` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at Compose root. Agent service port/path are illustrative; use frozen contract and do not expose admin/tool endpoints beyond intended boundary.  
**WHY:** Verify service inventory/config/log/health and compare controlled tool destination with Backend API contract.  
**EXPECTED OUTPUT:** Architecture diagram shows Agent→controlled tool→Backend API→policy/audit/HITL; no direct DB path or approval tool. Agent service has owner/network/auth/health/log contract.  
**COMMON FAILURE:** Tool can call arbitrary URL/SQL, schema missing limits, Agent uses admin credential, Backend trusts Agent claim blindly, audit omitted or direct approve capability exists.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at Compose root. Agent service port/path are illustrative; use frozen contract and do not expose admin/tool endpoints beyond intended boundary. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Architecture diagram shows Agent→controlled tool→Backend API→policy/audit/HITL; no direct DB path or approval tool. Agent service has owner/network/auth/health/log contract. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Draw tool call chain for one read and one write proposal. Mark where each validation/authorization/audit state occurs and who owns reasoning versus infrastructure/security.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Review a proposed execute SQL tool against roadmap. Reject it with security/ownership evidence and propose a narrow read API contract instead. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Trace Agent service network/auth to RAG and Backend. Test only health/controlled safe endpoint; route model tool-selection/prompt logic to SV3 after infra boundary passes.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

In a mock config, attempt tool URL set from user input or direct database path. Identify missing allowlist/schema/Backend enforcement and restore controlled contract.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Inspect tool allowlist/schema and Backend endpoint authorization before testing any model-generated action.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Call Agent trusted because prompt says so
- Use arbitrary SQL tool
- Give agent admin token
- Put approval in Agent
- Ignore audit

## 16. Self-check Questions

1. Why AI not superuser?
2. Where validate args?
3. Who enforces RBAC?
4. What ownership remains SV3?

## 17. Evidence Required

- explanation: Agent security chain diagram
- config: tool/endpoint/auth contract
- incident-report: attempted boundary bypass

Evidence type bắt buộc cho gate: `explanation` + `config` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được controlled Agent architecture and security ownership boundary, và hard gate được commit server-side. Nếu FAIL, quay lại tool/Backend security chain or AI role boundary; không mở khóa bằng cách sửa status phía client.
