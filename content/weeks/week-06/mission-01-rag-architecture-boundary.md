---
id: w6-m1-rag-architecture-boundary
week: 6
order: 1
title: "RAG Architecture & SV1/SV3 Boundary"
category: "RAG Architecture"
skillId: "rag-architecture"
estimatedMinutes: 210
targetLevel: "L2"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Document→chunk→embedding→Qdrant→retrieval→context→Ollama/LLM→answer/sources architecture and owner boundary"
keywords: ["rag","document","chunk","embedding","qdrant","retrieval","ollama","sources"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w5-m7-operations-runbook-release-readiness"]
requiredEvidence: ["explanation","terminal-output","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "A clear boundary prevents SV1 wasting time editing prompts when Qdrant/Ollama is down and prevents SV3 receiving vague AI broken reports without dependency evidence."
---

## 1. Ví dụ đời thường

RAG is a librarian workflow: documents are divided into cards, catalogued by similarity, relevant cards are retrieved, then a writer reads them before answering. SV1 keeps the library building, network and electricity working; SV3 decides card-cutting, search strategy and writing quality.

## 2. Giải thích cực dễ

RAG is not just a chat model. It depends on corpus, chunks, embedding, vector store, retrieval, prompt/context and model. SV1 checks containers, URL/DNS, collection, model, storage/resource and health. SV3 owns chunk quality, retrieval choice, prompt and answer quality.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Retrieval-augmented generation indexes embedded document chunks in a vector database, retrieves candidate context for a query, and supplies it to an LLM for response generation. Infrastructure availability/configuration is distinct from retrieval relevance and model reasoning behavior.

## 4. Why DX-Lab needs it

A clear boundary prevents SV1 wasting time editing prompts when Qdrant/Ollama is down and prevents SV3 receiving vague AI broken reports without dependency evidence. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L2**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- corpus/chunk/embedding/vector concept
- Qdrant collection/payload
- retrieval/context/answer/sources
- service dependency graph
- SV1 infra duties
- SV3 functional/algorithm duties
- handoff evidence

## 7. Commands / Config examples

```bash
docker compose config
docker compose ps qdrant ollama rag
docker compose logs --tail=100 rag
curl -fsS http://localhost:6333/healthz
curl -fsS http://localhost:11434/api/tags
```

**COMMAND:** `docker compose config` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at Compose root. Ports are examples from the roadmap; rely on frozen project URL map and do not expose Qdrant/Ollama publicly without explicit design.  
**WHY:** Check each infrastructure dependency independently before judging retrieval or answer behavior.  
**EXPECTED OUTPUT:** The map identifies RAG→Qdrant/Ollama dependencies; each service has hostname/port/network/env/health/log/owner; collection/model readiness remain distinct from process state.  
**COMMON FAILURE:** Treat a generated answer as proof all infrastructure is healthy, confuse collection with model, call internal service from browser, or assign prompt/retrieval implementation to SV1.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at Compose root. Ports are examples from the roadmap; rely on frozen project URL map and do not expose Qdrant/Ollama publicly without explicit design. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

The map identifies RAG→Qdrant/Ollama dependencies; each service has hostname/port/network/env/health/log/owner; collection/model readiness remain distinct from process state. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Draw the full RAG chain and label which component creates/holds each artifact. For each arrow state SV1 first check and exact handoff condition to SV3.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Given answer has poor relevance but all dependency checks pass, build an SV3 handoff using health/log/URL/collection/model evidence and explicitly exclude algorithm ownership. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Trace Browser/Portal→RAG service→Qdrant/Ollama and associated auth. Test service reachability separately from an evaluation question; preserve source/corpus access boundary.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Stop Qdrant in a disposable stack, observe RAG error, collect dependency evidence, restore it and explain why this is SV1 infra rather than retrieval-quality work.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Check RAG process/health, Qdrant reachability/collection and Ollama reachability/model before examining retrieval quality.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Call RAG one black box
- Change prompt before checking dependency
- Expose Qdrant collection publicly
- Claim embedding math ownership
- Skip corpus safety

## 16. Self-check Questions

1. RAG stages?
2. Where does SV1 stop?
3. Qdrant versus Ollama role?
4. What proves quality differs from availability?

## 17. Evidence Required

- explanation: RAG dependency/ownership map
- terminal-output: service health endpoints/status
- incident-report: dependency failure and SV3 handoff

Evidence type bắt buộc cho gate: `explanation` + `terminal-output` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được RAG dependency graph and role boundary, và hard gate được commit server-side. Nếu FAIL, quay lại RAG architecture or SV1/SV3 ownership map; không mở khóa bằng cách sửa status phía client.
