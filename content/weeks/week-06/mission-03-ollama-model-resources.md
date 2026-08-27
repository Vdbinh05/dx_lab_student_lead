---
id: w6-m3-ollama-model-resources
week: 6
order: 3
title: "Ollama Service, Models & Resource Awareness"
category: "Ollama"
skillId: "ollama"
estimatedMinutes: 210
targetLevel: "L3"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Ollama port 11434, model pull/list, model storage, API, CPU/RAM/GPU awareness, logs and healthy versus model exists"
keywords: ["ollama","model","pull","api","11434","cpu","ram","gpu","storage"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w6-m2-qdrant-deployment-persistence"]
requiredEvidence: ["terminal-output","config","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "RAG/Agent can return service errors despite Ollama running when model absent or resources exhausted. SV1 needs actionable infrastructure evidence before handoff."
---

## 1. Ví dụ đời thường

Ollama service is a kitchen with power on; a model is an ingredient box. Kitchen being open does not mean the required ingredient is stocked. Running a large recipe can exhaust counter space/RAM even though the kitchen health check is green.

## 2. Giải thích cực dễ

Check service reachability and separately list required pinned model. Model first pull/storage may take time and resource. SV1 observes container/URL/network/logs/resources/model availability; SV3 chooses model/quality unless frozen contract says exact model.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Ollama exposes a local model-serving API and maintains model artifacts in storage. Service process health, HTTP reachability and model inventory are separate conditions. Inference resource demand depends on model/runtime/hardware and must be measured against local baseline rather than assumed.

## 4. Why DX-Lab needs it

RAG/Agent can return service errors despite Ollama running when model absent or resources exhausted. SV1 needs actionable infrastructure evidence before handoff. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L3**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- pinned image/model
- internal URL/11434
- api/tags model inventory
- model pull/storage volume
- CPU/RAM/GPU awareness
- logs
- healthy vs model exists
- resource baseline

## 7. Commands / Config examples

```bash
docker compose ps ollama
curl -fsS http://localhost:11434/api/tags
docker compose logs --tail=100 ollama
docker stats --no-stream ollama
docker volume inspect dxlab_ollama_data
```

**COMMAND:** `docker compose ps ollama` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at Compose root or debug container on internal network. Do not publish Ollama to public Internet without designed auth boundary.  
**WHY:** Check process, API, exact model inventory, logs, resources and persistence—not only a container green state.  
**EXPECTED OUTPUT:** Tags endpoint shows expected pinned model after controlled pull; storage volume is documented; resource snapshot distinguishes idle versus inference behavior.  
**COMMON FAILURE:** Wrong OLLAMA_BASE_URL, model not pulled, model name/tag typo, no storage volume, OOM, unavailable GPU assumption, public unauthenticated exposure or huge model selected without capacity evidence.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at Compose root or debug container on internal network. Do not publish Ollama to public Internet without designed auth boundary. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Tags endpoint shows expected pinned model after controlled pull; storage volume is documented; resource snapshot distinguishes idle versus inference behavior. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Start a pinned Ollama service, list tags, pull one project-selected demo model only if environment supports it, record storage/resource baseline then restart/recreate and verify inventory persistence.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Prepare an infrastructure handoff for Ollama responds but answer quality poor: prove URL/model/resource/log basics and state explicitly why prompt/model choice is SV3 functional ownership. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

From RAG container test OLLAMA_BASE_URL reachability and required model name. Monitor resource during one safe generation; do not commit downloaded model artifacts or fake a GPU requirement.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Set OLLAMA_MODEL to absent model in disposable RAG env. Capture tags/error/logs, pull/restore only approved model and regression-test restart plus RAG health.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Call the model-list endpoint and compare exact required model name to frozen environment/manifest before modifying RAG code.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Equate API health with model availability
- Use latest model name silently
- Expose 11434 publicly
- Assume GPU exists
- Blame prompt before checking model absent

## 16. Self-check Questions

1. Service healthy vs model exists?
2. Where models persist?
3. Why measure resource?
4. Who owns model quality selection?

## 17. Evidence Required

- terminal-output: tags/logs/stats/volume
- config: OLLAMA_BASE_URL/model contract without secret
- incident-report: missing model/resource triage

Evidence type bắt buộc cho gate: `terminal-output` + `config` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được model inventory/persistence/resource infrastructure evidence, và hard gate được commit server-side. Nếu FAIL, quay lại Ollama service URL, model availability, storage or resource baseline; không mở khóa bằng cách sửa status phía client.
