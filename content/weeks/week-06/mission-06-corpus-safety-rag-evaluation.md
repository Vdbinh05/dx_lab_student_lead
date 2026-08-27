---
id: w6-m6-corpus-safety-rag-evaluation
week: 6
order: 6
title: "Corpus Safety, RAG Evaluation & Infrastructure Release Evidence"
category: "AI Operations"
skillId: "security-review"
estimatedMinutes: 210
targetLevel: "L3"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Corpus manifest/checksum/access role, secret/PII exclusion, 10–20 RAG test questions, source awareness and AI infra report"
keywords: ["corpus","manifest","checksum","pii","secret","evaluation","rag","sources","access role"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w6-m5-rag-infra-incident-handoff"]
requiredEvidence: ["config","test-result","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "AI infra becomes release surface in Week 6. Safety/evaluation evidence avoids hidden corpus risk and makes later Agent red-team viable without giving SV1 algorithm ownership."
---

## 1. Ví dụ đời thường

Before putting books in a public reading room, check that none contain private letters, keys or misleading signs that tell staff what to do. A manifest is the library inventory and checksum is a seal for each book version.

## 2. Giải thích cực dễ

Before ingest, exclude secrets, unnecessary PII, temporary files and unapproved sources. Record source/version/access role/checksum. SV3 evaluates retrieval/answer quality; SV1 makes corpus storage/access/ingestion reproducible and safe, and supports 10–20 test questions as infrastructure evidence.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Corpus governance maintains provenance, version, integrity and access constraints for ingested source material. Evaluation sets measure expected behavior against controlled questions/sources. Retrieved text is data, not trusted executable instruction, which constrains prompt-injection and secret-exfiltration risks.

## 4. Why DX-Lab needs it

AI infra becomes release surface in Week 6. Safety/evaluation evidence avoids hidden corpus risk and makes later Agent red-team viable without giving SV1 algorithm ownership. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L3**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- source provenance/version
- checksum/manifest
- access roles
- secret/PII/temp exclusion
- ingestion report
- 10–20 evaluation questions
- source attribution
- retrieved text untrusted

## 7. Commands / Config examples

```bash
sha256sum corpus-manifest.json
docker compose logs --tail=150 rag
curl -fsS http://localhost:6333/collections
docker stats --no-stream rag qdrant ollama
docker compose config
```

**COMMAND:** `sha256sum corpus-manifest.json` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Run checks in versioned corpus/operations directory and Compose root. Do not print private source documents or secrets in terminal/Evidence Vault.  
**WHY:** Verify manifest integrity, ingest/dependency logs, collection state, resource snapshot and frozen service config.  
**EXPECTED OUTPUT:** Manifest lists approved source/version/checksum/access role; no prohibited files; evaluation set has 10–20 questions with expected source behavior; report distinguishes infra from answer-quality result.  
**COMMON FAILURE:** Unreviewed corpus, checksum recorded after change, PII/secret copied, source access missing, test questions too vague, RAG source not shown or model output treated as instruction.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Run checks in versioned corpus/operations directory and Compose root. Do not print private source documents or secrets in terminal/Evidence Vault. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Manifest lists approved source/version/checksum/access role; no prohibited files; evaluation set has 10–20 questions with expected source behavior; report distinguishes infra from answer-quality result. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Create a small approved corpus manifest and 10-question evaluation set. Run ingestion in lab, record collection/model/env/resource facts, and identify which evaluation conclusion belongs to SV3.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Audit a candidate document list for secret/PII/temp/version/access risks. Make accept/reject decisions with reasons and define safe escalation for unclear ownership. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Coordinate corpus source/roles with SV3 and security owner. Test source metadata through RAG service if supported; do not expose Qdrant collection to Browser just for traceability.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Place a synthetic secret marker in a proposed corpus list—not real secret—and demonstrate manifest review rejects it before ingest. If injected in disposable test, remove/rebuild only documented test collection and record prevention.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Review approved manifest and exclusion rules before ingestion, then confirm collection/model/resource state after a controlled run.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Treat retrieved text as trusted instruction
- Ingest .env/log dumps
- Use corpus with no manifest
- Claim answer quality test belongs SV1
- Expose collection for source proof

## 16. Self-check Questions

1. What must corpus manifest have?
2. Why checksum?
3. Who owns retrieval quality?
4. How handle injected secret marker?

## 17. Evidence Required

- config: corpus manifest/eval set reference
- test-result: 10–20 question infra/eval report
- explanation: corpus safety and SV1/SV3 evaluation boundary

Evidence type bắt buộc cho gate: `config` + `test-result` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được safe reproducible corpus and RAG infrastructure evidence, và hard gate được commit server-side. Nếu FAIL, quay lại corpus governance, collection/model validation or role boundary; không mở khóa bằng cách sửa status phía client.
