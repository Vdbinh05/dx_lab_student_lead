---
id: w2-m9-reverse-proxy-integration
week: 2
order: 9
title: "Reverse Proxy & Multi-layer API Integration"
category: "Reverse Proxy"
skillId: "reverse-proxy"
estimatedMinutes: 210
targetLevel: "L3"
sourceType: "KIEN_THUC_MO_RONG"
roadmapCompetency: "Reverse proxy purpose, upstream, path routing, 502/504, internal/external URLs and multi-layer incident triage"
keywords: ["reverse proxy","upstream","path routing","502","504","internal url","external url","integration"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w2-m8-postgresql-migration-seed"]
requiredEvidence: ["terminal-output","config","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 owner proxy/network integration and must localize failure without becoming deep proxy administrator or changing SV2 business code."
---

## 1. Ví dụ đời thường

Reverse proxy là lễ tân: khách chỉ biết quầy trước, lễ tân chuyển /api tới Backend đúng phòng. 502 là lễ tân không nhận được trả lời hợp lệ từ phòng; 504 là chờ phòng quá lâu.

## 2. Giải thích cực dễ

Browser calls external URL; proxy calls internal upstream like backend:8000. Path rewrite and forwarded headers must match app contract. Proxy reachability does not replace Backend health, DB readiness or migration checks.

## 3. Technical Definition

**Nguồn:** [KIẾN THỨC MỞ RỘNG ĐỂ SV1 HỌC/DEBUG TỐT HƠN]

A reverse proxy terminates a client-facing connection and creates an upstream request according to routing rules. Gateway 502 commonly signals invalid/unreachable upstream response; 504 signals upstream timeout. Internal service URLs and public browser URLs inhabit different name/port scopes.

## 4. Why DX-Lab needs it

SV1 owner proxy/network integration and must localize failure without becoming deep proxy administrator or changing SV2 business code. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L3**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- proxy purpose
- upstream host/port
- path prefix/rewrite
- forwarded host/proto awareness
- 502 vs 504
- internal vs external URL
- layer-by-layer test order

## 7. Commands / Config examples

```bash
curl -i http://localhost/api/health
docker compose exec proxy sh -lc 'wget -qO- http://backend:8000/health'
docker compose logs --tail=100 proxy
docker compose logs --tail=100 backend
docker compose config
```

**COMMAND:** `curl -i http://localhost/api/health` và các lệnh liên quan trong block.  
**WHERE TO RUN:** First curl from host to external proxy URL; upstream test from proxy network context; logs/config from Compose project.  
**WHY:** Compare outside-in request with direct internal upstream and correlated logs.  
**EXPECTED OUTPUT:** External and internal health return compatible success; proxy logs show routed path/upstream; Backend logs show matching request.  
**COMMON FAILURE:** Wrong service DNS/port, path rewrite mismatch, Backend unhealthy, timeout, proxy container lacks test tool or browser uses internal URL.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

First curl from host to external proxy URL; upstream test from proxy network context; logs/config from Compose project. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

External and internal health return compatible success; proxy logs show routed path/upstream; Backend logs show matching request. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Configure /api path to backend:8000, test direct upstream then external route. Record request path/status at proxy and Backend.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục đúng file/config đã sao lưu trong lab và xác nhận use case cũ vẫn pass; không xóa volume

## 11. Independent Lab

Given a 502, produce a test tree covering proxy process/listen, DNS, TCP, Backend health, port, path and logs; execute one hypothesis at a time. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Run Portal/API request through proxy, then equivalent curl direct upstream. Add DB/migration checks only after upstream reaches Backend and logs show DB failure.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Point upstream to backend:8001 or a wrong service name. Diagnose 502 without changing public host port; then create controlled slow upstream to recognize 504 semantics.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Call the upstream from proxy network context and compare with the external URL plus both service logs.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại caller, healthcheck và một use case lân cận bị ảnh hưởng bởi change

## 15. Common Beginner Errors

- Give Browser backend:8000 internal URL
- Treat every 502 as proxy syntax
- Increase timeout before evidence
- Rewrite path twice
- Change ports across services simultaneously

## 16. Self-check Questions

1. Proxy upstream URL dùng scope nào?
2. 502 khác 504?
3. Direct upstream pass nhưng browser fail gợi ý gì?
4. Khi nào kiểm DB?

## 17. Evidence Required

- terminal-output: external vs internal curl and relevant logs
- config: upstream/path route
- incident-report: hidden multi-layer root cause

Evidence type bắt buộc cho gate: `terminal-output` + `config` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được external/internal URL, upstream routing và multi-layer isolation, và hard gate được commit server-side. Nếu FAIL, quay lại proxy upstream/path contract hoặc downstream Backend/DB layer; không mở khóa bằng cách sửa status phía client.
