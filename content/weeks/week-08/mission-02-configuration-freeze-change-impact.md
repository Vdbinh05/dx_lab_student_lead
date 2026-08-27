---
id: w8-m2-configuration-freeze-change-impact
week: 8
order: 2
title: "Configuration Freeze & Change Impact Analysis"
category: "Release Configuration"
skillId: "change-management"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Service inventory/image/version/port/hostname/network/volume/health/env/auth/public boundary freeze and Change→impact→PR→regression→docs"
keywords: ["configuration freeze","change impact","service inventory","port","hostname","health","environment","auth"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w8-m1-regression-quality-gates"]
requiredEvidence: ["config","test-result","explanation"]
quizPassScore: 80
hardGate: true
whyItMatters: "SV1 owns configuration freeze. The same map supports fresh-machine, release, incident triage and team handoff without adding infrastructure beyond roadmap scope."
---

## 1. Ví dụ đời thường

Configuration freeze is labeling every cable in a demo rack before travel. You may still replace a cable, but first trace what it powers, record the change, test the circuit and update the label.

## 2. Giải thích cực dễ

Freeze does not mean never change. It means every release-critical service contract is known and any later change gets an issue/impact analysis/PR/regression/docs. No unknown host/port/health/env/auth/owner hides behind a comment. Unresolved P0 item blocks release.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Configuration management establishes versioned, auditable runtime contracts. Change impact analysis identifies direct service changes, upstream callers, downstream dependencies, environment/auth/test/documentation/release consequences before modification, enabling controlled regression and rollback planning.

## 4. Why DX-Lab needs it

SV1 owns configuration freeze. The same map supports fresh-machine, release, incident triage and team handoff without adding infrastructure beyond roadmap scope. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- service inventory
- image/version
- internal/public host and port
- network/volume
- health/dependencies
- environment/auth contract
- source of truth
- impact/PR/regression/docs rule

## 7. Commands / Config examples

```bash
docker compose config
docker compose ps
git status --short
rg -n "TBD" README.md docs .env.example docker-compose.yml
curl -fsS http://localhost:3000/api/health
```

**COMMAND:** `docker compose config` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Repository/Compose root. Search only release-relevant configuration/docs; do not scan or print untracked .env secrets. The displayed health endpoint is this training product's deployment check.  
**WHY:** Compare resolved runtime contract with versioned docs/config and make unresolved release facts explicit before freezing.  
**EXPECTED OUTPUT:** Inventory answers owner/image/version/hostname/ports/network/volume/health/env/auth/dependencies/public boundary for every released service. Any remaining TBD names owner/deadline/source and is classified.  
**COMMON FAILURE:** Use latest image, port appears only in code, docs diverge Compose, unknown health endpoint, secret value in inventory, configuration change merged without impact/regression or P0 TBD hidden.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Repository/Compose root. Search only release-relevant configuration/docs; do not scan or print untracked .env secrets. The displayed health endpoint is this training product's deployment check. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Inventory answers owner/image/version/hostname/ports/network/volume/health/env/auth/dependencies/public boundary for every released service. Any remaining TBD names owner/deadline/source and is classified. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Build a Configuration Freeze record from Compose/.env.example/docs. For each service prove one field from source. Run Backend port-change impact analysis across application/Compose/health/proxy/Portal/n8n/Agent/tests/docs.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Analyze adding an Accountant role or changing OLLAMA_MODEL. List direct/upstream/downstream/env/auth/tests/docs/release impact and ownership; do not implement the change. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Review contract rows with SV2 and SV3 owners and identify source-of-truth files. After one controlled config drift test, verify caller and document regression rather than relying on service restart.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

In a disposable config copy, change one service host or health port. Detect mismatch using inventory/config/ps/logs, restore exact contract and record every downstream check.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Compare the proposed change against service inventory, resolved Compose and every listed caller/dependency before editing.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Freeze guessed values
- Use latest image
- List secret values
- Leave P0 TBD hidden
- Change config without docs

## 16. Self-check Questions

1. What freezes?
2. What begins every post-freeze change?
3. What makes TBD P0?
4. Why no secret in inventory?

## 17. Evidence Required

- config: configuration-freeze inventory/TBD register
- test-result: one completed impact-analysis regression
- explanation: controlled-change and release-blocker rule

Evidence type bắt buộc cho gate: `config` + `test-result` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 80%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được frozen runtime contract and explicit change-control evidence, và hard gate được commit server-side. Nếu FAIL, quay lại service inventory, P0 TBD classification or impact analysis; không mở khóa bằng cách sửa status phía client.
