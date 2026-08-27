---
id: w2-m6-health-logs-readiness
week: 2
order: 6
title: "Healthchecks, Logs & Dependency Readiness"
category: "Operations"
skillId: "healthcheck"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "KIEN_THUC_MO_RONG"
roadmapCompetency: "Running vs healthy, readiness/liveness, healthcheck timing, pg_isready, /health, service_healthy and retry"
keywords: ["healthcheck","readiness","liveness","pg_isready","/health","service_healthy","retry","logs"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w2-m5-environment-secrets"]
requiredEvidence: ["terminal-output","config","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 phải thiết kế health có ý nghĩa, đọc health logs và phân biệt dependency readiness với business correctness."
---

## 1. Ví dụ đời thường

Đèn phòng sáng chỉ nói điện có; bác sĩ đo mạch nói người còn sống; tự đi cầu thang mới chứng minh chức năng. Running, healthy và functional cũng là ba mức khác nhau.

## 2. Giải thích cực dễ

Healthcheck chạy một test lặp lại. interval là khoảng chờ, timeout là thời gian một test, retries là số lần fail, start_period là thời gian khởi động được ưu tiên. DB ready không có nghĩa migration xong; Backend /health pass không có nghĩa mọi business flow pass.

## 3. Technical Definition

**Nguồn:** [KIẾN THỨC MỞ RỘNG ĐỂ SV1 HỌC/DEBUG TỐT HƠN]

A container healthcheck produces a runtime health state from repeated command exit codes. Readiness asks whether a service can receive dependent traffic; liveness asks whether it should be restarted. Compose service_healthy can delay dependent startup but does not replace application retry/recovery after startup.

## 4. Why DX-Lab needs it

SV1 phải thiết kế health có ý nghĩa, đọc health logs và phân biệt dependency readiness với business correctness. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- running/healthy/functional
- test/interval/timeout/retries/start_period
- CMD vs CMD-SHELL
- pg_isready
- Backend /health
- depends_on condition: service_healthy
- application retry

## 7. Commands / Config examples

```bash
docker compose ps
docker inspect --format '{{json .State.Health}}' dxlab-postgres
docker compose exec postgres pg_isready -U dxlab -d dxlab
curl -fsS http://localhost:8000/health
docker compose logs --tail=100 backend
```

**COMMAND:** `docker compose ps` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal tại Compose project; pg_isready chạy trong Postgres service; curl gọi URL host đã publish.  
**WHY:** Compare orchestrator state, health history, dependency readiness, app endpoint and logs.  
**EXPECTED OUTPUT:** ps/inspect show healthy after start period; pg_isready accepts connection; /health returns success without sensitive details; logs explain transitions.  
**COMMON FAILURE:** Health command/tool missing, wrong internal port, too-short start period, endpoint checks only process, DB accepts but schema missing, app lacks retry.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal tại Compose project; pg_isready chạy trong Postgres service; curl gọi URL host đã publish. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

ps/inspect show healthy after start period; pg_isready accepts connection; /health returns success without sensitive details; logs explain transitions. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Thêm Postgres pg_isready and Backend /health checks with explicit timing. Measure startup transitions, stop Postgres, observe Backend behavior and recovery after DB returns.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục đúng file/config đã sao lưu trong lab và xác nhận use case cũ vẫn pass; không xóa volume

## 11. Independent Lab

Review one healthcheck: state what it proves, what it cannot prove, false-positive/negative risks, and a functional smoke test that complements it. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Use service_healthy for initial order, then restart Postgres after stack is up to prove Backend retry/recovery rather than startup-only dependency.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Set Backend health target to wrong port or remove start_period. Observe health history and first relevant log; fix timing/target without raising retries blindly.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Inspect health history and run the health command manually in the same container context.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại caller, healthcheck và một use case lân cận bị ảnh hưởng bởi change

## 15. Common Beginner Errors

- Equate running with ready
- Health endpoint exposes config/secret
- Increase retries to hide root cause
- Use host port inside container health
- Assume depends_on handles later outages

## 16. Self-check Questions

1. start_period làm gì?
2. pg_isready chứng minh gì và không chứng minh gì?
3. Readiness khác liveness?
4. Vì sao app vẫn cần retry?

## 17. Evidence Required

- terminal-output: ps/health history/pg_isready/curl
- config: healthcheck fields
- incident-report: wrong target or timing

Evidence type bắt buộc cho gate: `terminal-output` + `config` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được health semantics, timing và runtime recovery, và hard gate được commit server-side. Nếu FAIL, quay lại health command/context/timing hoặc dependency retry; không mở khóa bằng cách sửa status phía client.
