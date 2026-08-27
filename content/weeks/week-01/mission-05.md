---
id: w1-m5-http-curl-local-server
week: 1
order: 5
title: "HTTP, curl & Local Server"
category: "Networking"
skillId: "networking"
estimatedMinutes: 180
targetLevel: "L2"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "HTTP request/response observation and connectivity triage"
keywords: ["http", "curl", "status", "headers", "refused", "timeout"]
objectives:
  [
    "Đọc request/response HTTP",
    "Dùng curl lấy status và headers",
    "Phân loại refused, timeout và port conflict",
  ]
prerequisites: ["w1-m4-networking-fundamentals"]
requiredEvidence: ["terminal-output", "incident-report"]
quizPassScore: 70
hardGate: true
whyItMatters: "Healthcheck, API, Keycloak, webhook, RAG và Agent đều gặp nhau ở HTTP."
---

## 1. Ví dụ đời thường

HTTP request là phiếu yêu cầu; response gồm kết quả và mã trạng thái. `curl` giống khách hàng tối giản, bỏ qua UI để kiểm tra thẳng dịch vụ.

## 2. Giải thích cực dễ

URL chọn scheme, host, port và path. Status 2xx thường thành công, 4xx là request/auth phía client, 5xx là server/upstream. Network fail có thể xảy ra trước khi có status HTTP.

## 3. Technical Definition

HTTP là application protocol theo request/response. Headers mang metadata; body mang payload. Connection refused và timeout là transport symptoms, không phải HTTP status.

## 4. DX-Lab dùng nó ở đâu

SV1 dùng `curl` kiểm tra `/health`, OpenAPI, Keycloak discovery, webhook và AI dependency endpoint.

## 5. SV1 cần đạt Level nào

HTTP/REST target hỗ trợ L3; mission này xây L2.

## 6. Thành phần cần biết

method, URL, headers, body, status, `curl -i`, `curl -fsS`, local server, refused, timeout, port conflict.

## 7. Commands / Config

```bash
mkdir -p ~/dx-lab-training/w1-m5 && cd ~/dx-lab-training/w1-m5
printf "dx-lab-ok" > index.html
python3 -m http.server 8000 --bind 127.0.0.1 &
curl -i http://127.0.0.1:8000/
curl -fsS http://127.0.0.1:8000/ > /dev/null
curl --connect-timeout 2 --max-time 3 http://192.0.2.1:81/
python3 -m http.server 8000 --bind 127.0.0.1
```

**COMMAND:** tạo trang tạm, chạy HTTP server, gọi `curl` thành công/timeout và cố tình tạo port conflict.  
**WHERE TO RUN:** thư mục lab Linux/WSL; địa chỉ `192.0.2.1` chỉ dùng cho test có timeout ngắn.  
**WHY:** phân biệt network success, HTTP status, timeout/refused và bind conflict bằng từng tín hiệu riêng.  
**EXPECTED OUTPUT:** response 200; lệnh server thứ hai báo address/port already in use.  
**COMMON FAILURE:** quên dừng process cũ sau lab.

## 8. Expected Output

Evidence phải chỉ ra status line, headers cơ bản, body và lỗi bind port conflict.

## 9. Guided Lab

Gọi path tồn tại và path không tồn tại. So sánh network success với HTTP 404.

## 10. Independent Lab

Chạy server trên một port tự chọn, dùng `curl` chỉ in status code và viết smoke command fail khi không phải 2xx.

## 11. Failure Injection

Tạo lần lượt: connection refused và port conflict. Timeout có thể mô phỏng an toàn bằng địa chỉ TEST-NET `192.0.2.1`, luôn đặt `--connect-timeout 2 --max-time 3`; môi trường có thể trả refused sớm, khi đó ghi đúng result thay vì giả vờ timeout.

## 12. Troubleshooting

1. **SYMPTOM:** chép nguyên status hoặc transport error.
2. **EVIDENCE:** `curl -i/-v`, URL, listener và server log.
3. **HYPOTHESIS:** transport, method, path, header hay server.
4. **TEST:** một request thay đổi đúng một biến.
5. **RESULT:** status/error mới và điều nó chứng minh.
6. **ROOT CAUSE:** contract sai cụ thể.
7. **FIX:** sửa URL/listener/path nhỏ nhất.
8. **VERIFICATION:** smoke `curl -fsS` trả 0 và response đúng.
9. **REGRESSION:** kiểm cả path hợp lệ, 404 dự kiến và port không xung đột.

## 13. Self-check Questions

1. 404 chứng minh điều gì về network?
2. Vì sao `curl -f` hữu ích trong smoke test?
3. Port conflict xảy ra ở bước nào?

## 14. Evidence Required

Terminal output và incident report phân biệt 404, refused, timeout/port conflict.

## 15. Quiz

Quiz đạt tối thiểu 70%.

## 16. PASS Gate

Phải có evidence phân biệt 200, 404, refused và port conflict/timeout-safe-test, incident report đủ protocol, quiz ≥70% và chốt hard gate; không random restart.
