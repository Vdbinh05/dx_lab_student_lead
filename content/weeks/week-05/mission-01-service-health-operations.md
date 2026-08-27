---
id: w5-m1-service-health-operations
week: 5
order: 1
title: "Operations: Service Health Matrix, Logs & Resources"
category: "Operations"
skillId: "observability"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Service health matrix, running/healthy/functional, logs, CPU/RAM/disk/ports/dependencies and baseline snapshots"
keywords: ["operations","health matrix","logs","cpu","ram","disk","ports","dependencies"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w4-m7-workflow-integration-evidence"]
requiredEvidence: ["log","terminal-output","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "Roadmap expressly requires observability baseline but excludes unnecessary Prometheus/Grafana/ELK scope. SV1 needs fast, reliable first checks for every integrated service."
---

## 1. Ví dụ đời thường

Một phòng điều hành giống bảng tình trạng chuyến bay: máy bay cất cánh, tín hiệu an toàn và hành khách tới đích là khác nhau. CPU/RAM/disk/port/log cho biết tiếp theo phải nhìn đâu, không phải dashboard để trang trí.

## 2. Giải thích cực dễ

SV1 maintains a lightweight Service Health Matrix before demo, during incident and fresh-machine. Running is process exists; healthy is healthcheck pass; functional is real use case pass. Record baseline at startup, normal transaction and AI load later; do not invent thresholds before measuring.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Operational observability combines service lifecycle state, healthcheck status, structured/relevant logs, resource utilization, listening ports and dependency topology. Baselines contextualize anomalies and support evidence-first incident response without requiring enterprise monitoring tooling.

## 4. Why DX-Lab needs it

Roadmap expressly requires observability baseline but excludes unnecessary Prometheus/Grafana/ELK scope. SV1 needs fast, reliable first checks for every integrated service. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- running/healthy/functional
- service matrix fields
- docker compose ps
- logs first relevant error
- docker stats
- ss
- free/df
- dependency/blast radius

## 7. Commands / Config examples

```bash
docker compose ps
docker compose logs --tail=100 backend
docker stats --no-stream
ss -lntp
free -h
df -h
```

**COMMAND:** `docker compose ps` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal on the deployment/lab host. `ss`, `free`, `df` may run in Linux/WSL; use documented equivalents on Windows and record environment.  
**WHY:** Collect a compact state/resource/port/log snapshot before restarting a service.  
**EXPECTED OUTPUT:** Matrix identifies each service status, health, port, dependency, owner, last relevant error and resource note. Data is time-bounded and evidence-backed rather than stale green dots.  
**COMMON FAILURE:** Read only container running state, log after restart loses root cause, port list from wrong namespace, stats with no baseline, disk volume omitted or arbitrary threshold asserted.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal on the deployment/lab host. `ss`, `free`, `df` may run in Linux/WSL; use documented equivalents on Windows and record environment. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Matrix identifies each service status, health, port, dependency, owner, last relevant error and resource note. Data is time-bounded and evidence-backed rather than stale green dots. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Build matrix for Portal, Backend, Postgres, Keycloak and n8n. Capture startup baseline and one normal workflow transaction snapshot. Label any unavailable metric honestly.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Given browser symptom, use matrix to choose first three checks and explain why another service should not be restarted yet. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Run a known E2E flow then update matrix across dependencies. If DB usage spikes, check volume/storage/queries evidence and hand off domain query optimization to SV2 only after infra triage.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Stop one noncritical disposable service or misconfigure its health endpoint. Capture ps/inspect/log/port/resource before start/restart, localize blast radius and verify recovery.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Capture compose ps, the first relevant service log, port/listener and resource snapshot before changing state.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Call running healthy
- Restart before log capture
- Use monitoring stack just to meet matrix
- Ignore disk/volume
- Claim performance without baseline

## 16. Self-check Questions

1. Three status levels differ?
2. Why baseline at 3 moments?
3. What is first evidence for container exited?
4. Why no fixed CPU threshold first?

## 17. Evidence Required

- log: service health matrix snapshot
- terminal-output: ps/logs/stats/ports/resources
- explanation: status distinction and first-check choice

Evidence type bắt buộc cho gate: `log` + `terminal-output` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được operational state, resource baseline and evidence-first triage, và hard gate được commit server-side. Nếu FAIL, quay lại health/log/resource evidence or running/healthy/functional distinction; không mở khóa bằng cách sửa status phía client.
