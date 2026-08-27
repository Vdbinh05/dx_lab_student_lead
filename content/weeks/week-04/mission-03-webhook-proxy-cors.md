---
id: w4-m3-webhook-proxy-cors
week: 4
order: 3
title: "Webhooks, Reverse Proxy, CORS & Browser-vs-curl"
category: "Integration Network"
skillId: "reverse-proxy"
estimatedMinutes: 210
targetLevel: "L3"
sourceType: "KIEN_THUC_MO_RONG"
roadmapCompetency: "Webhook URL routing, reverse proxy/upstream, CORS awareness, browser versus curl behavior and public/internal URL separation"
keywords: ["webhook","reverse proxy","cors","browser","curl","origin","preflight","upstream"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w4-m2-n8n-workflow-foundations"]
requiredEvidence: ["terminal-output","config","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 must separate proxy/DNS/route/CORS/auth symptoms so SV3 receives precise browser integration evidence and SV2 receives only actual API defects."
---

## 1. Ví dụ đời thường

curl is a courier who follows a direct address. A browser is a courier with an Origin badge and preflight questions; the same destination can accept curl but reject browser if its cross-origin policy is missing or unsafe.

## 2. Giải thích cực dễ

CORS is a browser policy, not a firewall or Backend authorization. A proxy may route /webhook or /api to internal services. Test external browser/proxy route and internal upstream separately. Avoid opening wildcard origins or credentials just to remove an error.

## 3. Technical Definition

**Nguồn:** [KIẾN THỨC MỞ RỘNG ĐỂ SV1 HỌC/DEBUG TỐT HƠN]

Cross-Origin Resource Sharing controls whether browser JavaScript may read a cross-origin response through response headers and preflight behavior. Reverse proxies route external paths to internal upstreams. Curl bypasses browser CORS enforcement, so curl success can help isolate—not disprove—a browser-origin issue.

## 4. Why DX-Lab needs it

SV1 must separate proxy/DNS/route/CORS/auth symptoms so SV3 receives precise browser integration evidence and SV2 receives only actual API defects. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L3**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- webhook public/internal URL
- proxy path/upstream
- Origin header
- OPTIONS/preflight
- Access-Control headers
- curl vs browser
- credentials and wildcard risk
- CORS not authorization

## 7. Commands / Config examples

```bash
curl -i -H 'Origin: http://localhost:3000' http://localhost:8000/api/health
curl -i -X OPTIONS -H 'Origin: http://localhost:3000' -H 'Access-Control-Request-Method: POST' http://localhost:8000/api/items
docker compose logs --tail=100 proxy
docker compose logs --tail=100 backend
```

**COMMAND:** `curl -i -H 'Origin: http://localhost:3000' http://localhost:8000/api/health` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal for external proxy/API tests. Browser developer tools may inspect network headers but must not expose cookies/tokens in evidence.  
**WHY:** Compare normal request and preflight response, then correlate proxy/Backend paths instead of guessing from browser console alone.  
**EXPECTED OUTPUT:** A required allowed origin/method gets intentional CORS headers; untrusted origin is not broadly allowed; proxy and Backend logs agree about routed request.  
**COMMON FAILURE:** Wrong public URL, upstream route typo, missing OPTIONS, origin not allowed, wildcard plus credentials, confused CORS with 401/403, or curl targets different path than browser.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal for external proxy/API tests. Browser developer tools may inspect network headers but must not expose cookies/tokens in evidence. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

A required allowed origin/method gets intentional CORS headers; untrusted origin is not broadly allowed; proxy and Backend logs agree about routed request. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Choose one browser API call and compare: browser URL, proxy route, Backend internal URL, Origin, expected preflight and auth boundary. Execute a safe OPTIONS test and record headers/status.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Given curl 200 but browser fails, make a hypothesis tree for URL/proxy/CORS/cookie/auth/Portal state. Specify first discriminating test for each—not a blanket wildcard header. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Run Portal flow against public route, equivalent curl against public route, then proxy-to-Backend upstream test. Hand off SV3 only once CORS/proxy/auth evidence isolates a UI/state problem.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Remove one allowed Origin or misroute a webhook path in a disposable config. Preserve status/header/log evidence, fix exact contract and check no unintended origin gained access.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Compare browser's exact URL/Origin/method with curl and the proxy upstream route, then inspect preflight response when applicable.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Use CORS as authentication
- Set * with credentials
- Test only curl
- Use internal Docker URL in browser
- Route endpoint but forget preflight

## 16. Self-check Questions

1. Why can curl pass while browser fails?
2. CORS guards what?
3. Which layer enforces permission?
4. What is first test for 502 versus CORS?

## 17. Evidence Required

- terminal-output: request/preflight headers/status
- config: public/internal route and allowed-origin policy
- incident-report: browser-vs-curl protocol

Evidence type bắt buộc cho gate: `terminal-output` + `config` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được browser/proxy/upstream/CORS boundaries, và hard gate được commit server-side. Nếu FAIL, quay lại URL scope, CORS headers or proxy route; không mở khóa bằng cách sửa status phía client.
