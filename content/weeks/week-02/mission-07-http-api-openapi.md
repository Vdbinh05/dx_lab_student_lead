---
id: w2-m7-http-api-openapi
week: 2
order: 7
title: "HTTP, REST, JSON & OpenAPI Support"
category: "HTTP/API"
skillId: "http-rest"
estimatedMinutes: 210
targetLevel: "L3"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Request/response, methods, headers, JSON, status codes, curl and OpenAPI/Swagger"
keywords: ["http","rest","json","get","post","put","patch","delete","status","curl","openapi"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w2-m6-health-logs-readiness"]
requiredEvidence: ["test-result","command","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 không owner business API nhưng phải test connectivity/contract/auth, đọc Swagger và handoff đúng cho SV2."
---

## 1. Ví dụ đời thường

HTTP request giống phiếu yêu cầu có động từ, địa chỉ, headers và body; response là biên nhận có status, headers và nội dung. OpenAPI là mẫu phiếu chính thức để các team không truyền miệng.

## 2. Giải thích cực dễ

GET đọc, POST tạo, PUT thay toàn bộ theo contract, PATCH sửa một phần, DELETE yêu cầu xóa. Status 2xx là accepted/success theo nghĩa endpoint; 4xx thường là request/auth/client contract; 5xx là server-side failure. Luôn đọc response body và correlation ID.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

HTTP is a request-response application protocol. REST-style APIs expose resource-oriented representations and semantics through methods, URLs, headers, status codes and JSON bodies. OpenAPI is a machine-readable contract for operations, schemas, parameters, responses and security requirements.

## 4. Why DX-Lab needs it

SV1 không owner business API nhưng phải test connectivity/contract/auth, đọc Swagger và handoff đúng cho SV2. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L3**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- request method/path/query/header/body
- JSON content type
- GET/POST/PUT/PATCH/DELETE
- 2xx/4xx/5xx
- curl -i/-f/-sS
- OpenAPI operations/schemas/security
- idempotency awareness

## 7. Commands / Config examples

```bash
curl -i http://localhost:8000/health
curl -i -H 'Content-Type: application/json' -d '{"name":"demo"}' http://localhost:8000/api/items
curl -fsS http://localhost:8000/openapi.json
```

**COMMAND:** `curl -i http://localhost:8000/health` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal có curl, gọi published Backend URL; internal callers phải dùng backend:8000 trên Compose network.  
**WHY:** Observe status/headers/body and compare actual operation with OpenAPI contract.  
**EXPECTED OUTPUT:** Health returns 2xx; create returns documented success/error; OpenAPI JSON lists path/method/schema/security. Exact IDs/timestamps may vary.  
**COMMON FAILURE:** Wrong method/path, invalid JSON/Content-Type, 401/403, 404, validation 422/400, proxy route mismatch or app 500.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal có curl, gọi published Backend URL; internal callers phải dùng backend:8000 trên Compose network. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Health returns 2xx; create returns documented success/error; OpenAPI JSON lists path/method/schema/security. Exact IDs/timestamps may vary. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Chọn một resource trong OpenAPI; test GET, valid POST and invalid POST. Ghi expected status/schema, actual, correlation ID and owner if mismatch.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục đúng file/config đã sao lưu trong lab và xác nhận use case cũ vẫn pass; không xóa volume

## 11. Independent Lab

Không dùng Swagger UI button, tự viết curl cho PATCH/DELETE negative-safe trên disposable record và cleanup record theo API contract. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

So Browser request with equivalent curl; if curl passes but browser fails, investigate proxy/CORS/auth context before changing Backend business logic.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Cố tình gửi wrong Content-Type và unknown field. Phân biệt network success với API validation failure; không sửa server để accept arbitrary payload.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Capture method, URL, status, relevant headers/body and compare the operation with OpenAPI.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại caller, healthcheck và một use case lân cận bị ảnh hưởng bởi change

## 15. Common Beginner Errors

- Chỉ nhìn body bỏ status
- Gọi GET để mutate
- Tin 200 nghĩa business data đúng
- Dùng curl host URL bên trong container
- Thay contract miệng không cập nhật OpenAPI

## 16. Self-check Questions

1. 401 khác 403?
2. PUT khác PATCH?
3. HTTP 500 chứng minh transport gì?
4. OpenAPI giúp handoff ra sao?

## 17. Evidence Required

- test-result: method/status/schema matrix
- command: reproducible curl commands redacted
- explanation: transport vs API vs business correctness

Evidence type bắt buộc cho gate: `test-result` + `command` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được request/response contract và layer classification, và hard gate được commit server-side. Nếu FAIL, quay lại HTTP semantics, curl evidence hoặc OpenAPI contract; không mở khóa bằng cách sửa status phía client.
