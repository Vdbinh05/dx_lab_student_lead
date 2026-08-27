---
id: w6-m4-rag-service-env-health
week: 6
order: 4
title: "RAG Service Configuration, Health & Dependency Contract"
category: "RAG Service"
skillId: "rag-infra"
estimatedMinutes: 210
targetLevel: "L3"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "RAG service container, QDRANT_URL/OLLAMA_BASE_URL/env contract, health/readiness, logs, internal network and error classification"
keywords: ["rag service","qdrant_url","ollama_base_url","health","environment","network","logs","dependencies"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w6-m3-ollama-model-resources"]
requiredEvidence: ["config","terminal-output","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 needs to tell whether failure is wrong URL, DNS/network, collection, model or resource before escalating. This mission makes dependency configs visible and testable."
---

## 1. Ví dụ đời thường

RAG service is a dispatcher who needs two phone numbers: catalogue room Qdrant and kitchen Ollama. If either number is wrong, dispatcher may stand ready but cannot complete an answer.

## 2. Giải thích cực dễ

RAG health should reveal no secret but clearly distinguish basic process from dependency readiness when project defines it. Config validates required URLs/model/collection at startup or controlled request. Inside container, localhost is self, not Qdrant/Ollama.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

A RAG service composes dependent endpoints and application configuration. Its health/readiness semantics should be explicit: process liveness, configuration validity and dependency connectivity may be separate. Structured errors/logs enable routing issues to infrastructure versus functional RAG logic.

## 4. Why DX-Lab needs it

SV1 needs to tell whether failure is wrong URL, DNS/network, collection, model or resource before escalating. This mission makes dependency configs visible and testable. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L3**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- RAG service host/port
- QDRANT_URL
- OLLAMA_BASE_URL
- collection/model names
- startup validation
- health/readiness
- dependency logs
- public/internal route boundary

## 7. Commands / Config examples

```bash
docker compose config
docker compose ps rag qdrant ollama
docker compose exec rag sh -lc 'getent hosts qdrant && getent hosts ollama'
docker compose logs --tail=150 rag
curl -i http://localhost:8090/health
```

**COMMAND:** `docker compose config` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Compose root. rag/port 8090 are examples; use actual frozen service name and external health route. DNS checks run inside RAG container or approved debug image.  
**WHY:** Validate resolved config, running dependencies, RAG-network DNS, RAG log and external health individually.  
**EXPECTED OUTPUT:** Required config names resolve to internal services; health reports documented safe state; log identifies which dependency fails if readiness incomplete.  
**COMMON FAILURE:** Missing env, localhost URLs, service network mismatch, collection/model typo, health endpoint masks dependency failure, external proxy target wrong or secrets printed in config/log.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Compose root. rag/port 8090 are examples; use actual frozen service name and external health route. DNS checks run inside RAG container or approved debug image. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Required config names resolve to internal services; health reports documented safe state; log identifies which dependency fails if readiness incomplete. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Build env matrix for RAG: variable, consumer, secret/no, expected host/port, validation and owner. Start stack, verify DNS/health/log and document running versus dependency-ready state.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Create test order for 500 on answer: RAG process→RAG health→Qdrant URL/DNS/collection→Ollama URL/model/resource→only then SV3 retrieval/prompt handoff. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Make one safe RAG smoke query with an expected source behavior. If infra checks pass but answer relevance fails, hand off SV3 with exact dependency evidence and evaluation input.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Misspell QDRANT_URL service name or unset OLLAMA_BASE_URL in disposable env. Capture validation/log/DNS output, fix single variable and run dependency plus answer smoke regression.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** From RAG context resolve dependencies and compare its resolved env contract before changing health/prompt code.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Use localhost dependencies
- Hide config error behind generic 500
- Make health leak URL/token
- Call model endpoint from browser
- Diagnose prompt before config

## 16. Self-check Questions

1. What vars drive dependencies?
2. Why separate liveness/readiness?
3. Where run DNS?
4. When SV3 handoff?

## 17. Evidence Required

- config: redacted RAG dependency env matrix
- terminal-output: config/DNS/health/log checks
- incident-report: missing/miswired dependency protocol

Evidence type bắt buộc cho gate: `config` + `terminal-output` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được RAG dependency env/network/readiness contract, và hard gate được commit server-side. Nếu FAIL, quay lại RAG env/DNS/health or dependency test order; không mở khóa bằng cách sửa status phía client.
