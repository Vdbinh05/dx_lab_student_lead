---
id: w6-m5-rag-infra-incident-handoff
week: 6
order: 5
title: "RAG Infrastructure Incident & SV3 Handoff"
category: "Troubleshooting"
skillId: "troubleshooting"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Qdrant down/collection missing/Ollama down/model missing/RAG env/RAM failure injection and correct handoff"
keywords: ["rag incident","qdrant down","collection missing","ollama down","model missing","ram","handoff","debug"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w6-m4-rag-service-env-health"]
requiredEvidence: ["incident-report","terminal-output","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "This is the Week 6 practical competency and Boss Fight preparation. It protects role boundary and ensures AI problems get solved at the correct layer."
---

## 1. Ví dụ đời thường

When an answer desk fails, first find which shelf, phone line or kitchen is absent. If all physical dependencies are working but librarian picks poor books, send a precise case to the librarian—not dismantle the building.

## 2. Giải thích cực dễ

Use nine-step protocol. Consider one layer at a time: RAG service, Qdrant reachability/collection, Ollama reachability/model, resource. Fix only demonstrated infra root cause. If all pass and answer quality/retrieval fails, owner is SV3 with your evidence.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Dependency-chain incident analysis isolates liveness, network, configuration, persistent state and resource faults with discriminating tests. Escalation quality is determined by reproducible symptom, collected evidence, eliminated infrastructure hypotheses and clear expected/actual behavior.

## 4. Why DX-Lab needs it

This is the Week 6 practical competency and Boss Fight preparation. It protects role boundary and ensures AI problems get solved at the correct layer. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- dependency tree
- service/health/log
- DNS/TCP/env
- collection/model state
- CPU/RAM
- safe fault injection
- incident protocol
- SV3 handoff template

## 7. Commands / Config examples

```bash
docker compose ps rag qdrant ollama
docker compose logs --tail=200 rag
docker compose logs --tail=100 qdrant
docker compose logs --tail=100 ollama
docker stats --no-stream
curl -fsS http://localhost:6333/collections
curl -fsS http://localhost:11434/api/tags
```

**COMMAND:** `docker compose ps rag qdrant ollama` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host at Compose root; run only controlled single-fault drill in a disposable lab. Do not delete collections/models/volumes as a generic debugging tactic.  
**WHY:** Collect state/log/resource plus separate Qdrant/Ollama evidence before changing configuration or restarting.  
**EXPECTED OUTPUT:** Incident report names one evidence-supported layer, a minimal fix, verification and regression. It identifies SV3 handoff only after infrastructural chain passes.  
**COMMON FAILURE:** Inject multiple faults, use output without timestamp/ID, delete vector volume, confuse missing model with prompt quality, fail to measure resource or hand off without reproduction.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host at Compose root; run only controlled single-fault drill in a disposable lab. Do not delete collections/models/volumes as a generic debugging tactic. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Incident report names one evidence-supported layer, a minimal fix, verification and regression. It identifies SV3 handoff only after infrastructural chain passes. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Inject a missing-model or wrong-QDRANT_URL fault. Follow full protocol, then write a contrasting handoff for a hypothetical relevance issue after all infra checks are green.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Attempt Boss Fight #rag-06 cleanly. If not clean, retain assistance label and still write a correct post-incident regression plan. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Capture RAG request correlation, dependent service health/log and expected source behavior. Route prompt/retrieval/chunk/eval defect to SV3; route service/network/env/collection/model/resource to SV1.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Stop Qdrant, remove test collection or set absent model one at a time in lab. Restore from documented setup, not destructive re-ingestion guesswork, then rerun health and safe query.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Collect RAG/Qdrant/Ollama state, logs, URLs/collections/tags and resources in one ordered evidence snapshot.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Change prompt first
- Delete collection/volume reflex
- Call AI issue no owner
- Skip logs/resource
- Mark assisted answer clean PASS

## 16. Self-check Questions

1. Which root causes SV1 owns?
2. Which go SV3?
3. First command set?
4. Why one fault?

## 17. Evidence Required

- incident-report: full nine-step RAG fault
- terminal-output: dependency/log/resource evidence
- explanation: SV1/SV3 handoff boundary

Evidence type bắt buộc cho gate: `incident-report` + `terminal-output` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được single-layer evidence triage and correct AI ownership handoff, và hard gate được commit server-side. Nếu FAIL, quay lại dependency evidence, root-cause isolation or SV1/SV3 boundary; không mở khóa bằng cách sửa status phía client.
