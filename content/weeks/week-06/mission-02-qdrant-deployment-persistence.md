---
id: w6-m2-qdrant-deployment-persistence
week: 6
order: 2
title: "Qdrant Deployment, Collections & Persistence"
category: "Qdrant"
skillId: "qdrant"
estimatedMinutes: 210
targetLevel: "L3"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Qdrant container, port 6333, Docker network, QDRANT_URL, collection/vector/payload concept, volume, persistence, logs and health"
keywords: ["qdrant","collection","vector","payload","volume","persistence","health","qdrant_url"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w6-m1-rag-architecture-boundary"]
requiredEvidence: ["terminal-output","config","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "A reachable Qdrant service with missing collection/volume is a common RAG outage. SV1 must prove stateful AI service durability without overreaching into retrieval algorithms."
---

## 1. Ví dụ đời thường

Qdrant is a specialized card catalogue: collection is one catalogue, vector is a similarity address for a card, payload is readable card metadata and volume is the locked archive that survives when the desk is replaced.

## 2. Giải thích cực dễ

SV1 deploys Qdrant on private Docker network, checks health/URL/logs, verifies collection exists and data persists through recreate. SV1 does not tune embedding dimension/retrieval score without SV3 decision; but dimension mismatch shows as contract error to hand off with evidence.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Qdrant stores vector points organized in collections with vectors and payload metadata. It exposes HTTP APIs and persists data through configured storage. Client configuration uses a QDRANT_URL endpoint reachable within the service network; collection configuration must match embedding producer contract.

## 4. Why DX-Lab needs it

A reachable Qdrant service with missing collection/volume is a common RAG outage. SV1 must prove stateful AI service durability without overreaching into retrieval algorithms. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L3**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- Qdrant image/version pin
- internal port/network
- QDRANT_URL
- collection/point/vector/payload concepts
- health/API
- named volume
- recreate persistence
- dimension mismatch handoff

## 7. Commands / Config examples

```bash
docker compose ps qdrant
curl -fsS http://localhost:6333/healthz
curl -fsS http://localhost:6333/collections
docker compose logs --tail=100 qdrant
docker volume inspect dxlab_qdrant_data
```

**COMMAND:** `docker compose ps qdrant` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at Compose root. If 6333 is internal-only, run curl from an approved debug container on same network rather than publishing it just for testing.  
**WHY:** Observe runtime state, health, collection list, logs and persistence mount without assuming the Browser should access the service.  
**EXPECTED OUTPUT:** Qdrant returns health and collection metadata; volume mapping is explicit; a documented test collection/point remains after controlled container recreation.  
**COMMON FAILURE:** Wrong QDRANT_URL host/port, no shared network, collection absent, volume wrong/anonymous, incompatible vector size or Qdrant admin port exposed unnecessarily.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at Compose root. If 6333 is internal-only, run curl from an approved debug container on same network rather than publishing it just for testing. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Qdrant returns health and collection metadata; volume mapping is explicit; a documented test collection/point remains after controlled container recreation. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Deploy a pinned Qdrant service with named volume. Create/inspect one disposable collection through agreed tool/API, recreate only Qdrant container and prove collection persists. Record endpoint scope.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Review QDRANT_URL from RAG container context and explain evidence that distinguishes DNS failure, healthy-but-missing collection and dimension contract mismatch. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Check RAG service resolves qdrant by service name/internal port; use collection health/state to hand SV3 exactly what is missing if ingest/retrieval fails.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Change QDRANT_URL to localhost or detach RAG from network in a disposable config. Collect DNS/TCP/health/log evidence, restore correct network and run collection persistence regression.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** From RAG network context resolve qdrant, reach its internal health API and inspect required collection before changing retrieval code.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Use localhost from RAG container
- Expose Qdrant public by default
- Delete volume to fix collection
- Treat empty collection as healthy functional RAG
- Tune retrieval settings as SV1

## 16. Self-check Questions

1. Collection versus vector/payload?
2. Why named volume?
3. When publish port?
4. How classify dimension mismatch?

## 17. Evidence Required

- terminal-output: health/collections/log/volume evidence
- config: QDRANT_URL/network/volume contract
- incident-report: URL/network/missing-collection triage

Evidence type bắt buộc cho gate: `terminal-output` + `config` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được Qdrant network/state/persistence evidence, và hard gate được commit server-side. Nếu FAIL, quay lại QDRANT_URL/network, collection state or persistence mount; không mở khóa bằng cách sửa status phía client.
