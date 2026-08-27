---
id: w1-m4-networking-fundamentals
week: 1
order: 4
title: "Networking Fundamentals"
category: "Networking"
skillId: "networking"
estimatedMinutes: 180
targetLevel: "L2"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Networking fundamentals, listen sockets, and address boundaries"
keywords: ["network", "ip", "dns", "port", "localhost", "listen", "ss"]
objectives:
  [
    "Giải thích client/server và TCP port",
    "Phân biệt localhost và 0.0.0.0",
    "Kiểm tra listen socket",
  ]
prerequisites: ["w1-m3-processes-logs-resources"]
requiredEvidence: ["terminal-output", "explanation"]
quizPassScore: 70
hardGate: true
whyItMatters: "Phần lớn lỗi tích hợp DX-Lab biểu hiện qua DNS, hostname, bind hoặc port trước khi chạm business logic."
---

## 1. Ví dụ đời thường

IP là địa chỉ tòa nhà, port là số phòng, server là người trực phòng, client là người gọi. DNS là danh bạ đổi hostname thành IP.

## 2. Giải thích cực dễ

Một port chỉ hữu ích khi có process bind/listen. `127.0.0.1` chỉ quay lại chính máy/container hiện tại. `0.0.0.0` thường nghĩa process lắng nghe trên mọi interface cục bộ, không phải địa chỉ client nên gọi.

## 3. Technical Definition

TCP tạo kết nối có trạng thái giữa socket client và socket server. Hostname được resolver ánh xạ thành IP. Bind gắn socket với local address/port; listen nhận connection.

## 4. DX-Lab dùng nó ở đâu

Backend container gọi `postgres:5432`, không gọi `localhost:5432`. Browser lại dùng published host port hoặc proxy URL.

## 5. SV1 cần đạt Level nào

Mission target L2; Networking cuối roadmap L4.

## 6. Thành phần cần biết

client/server, IP, hostname, DNS, localhost, `127.0.0.1`, `0.0.0.0`, TCP, port, bind/listen, `ss`.

## 7. Commands / Config

```bash
hostname
ip -brief address
ip route
getent hosts localhost
getent hosts example.com
ss -lntp
python3 -m http.server 8765 --bind 127.0.0.1 &
ss -lntp | grep 8765
curl -I http://127.0.0.1:8765
kill %1
```

**COMMAND:** chạy block hostname/IP/route/DNS/listener, sau đó dựng HTTP server tạm và kiểm bằng `ss` + `curl`.  
**WHERE TO RUN:** thư mục lab trong Linux/WSL, trên máy không dùng port 8765 cho service khác.  
**WHY:** nối được chuỗi hostname/IP/route/DNS → bind/listen → client request bằng quan sát thật.  
**EXPECTED OUTPUT:** thấy LISTEN trên `127.0.0.1:8765` và HTTP response.  
**COMMON FAILURE:** Python không có trong distro; có thể dùng runtime HTTP server tương đương và ghi rõ.

## 8. Expected Output

Bạn phải chỉ được process nào listen, address nào, port nào và client URL nào hoạt động.

## 9. Guided Lab

So sánh output khi bind server vào `127.0.0.1` và `0.0.0.0`. Không mở firewall hay expose Internet.

## 10. Independent Lab

Chọn một port trống, chạy server, chứng minh bằng `ss` và `curl`, sau đó dừng và chứng minh port không còn listen.

## 11. Failure Injection

Gọi vào port chưa có process listen. Ghi symptom chính xác, không gọi chung là “mạng hỏng”.

## 12. Troubleshooting

1. **SYMPTOM:** URL và lỗi chính xác (refused, timeout hay DNS).
2. **EVIDENCE:** hostname, DNS result, IP/route, `ss` listener.
3. **HYPOTHESIS:** chọn đúng một layer: DNS, route, process, bind hoặc port.
4. **TEST:** một lệnh phân biệt giả thuyết.
5. **RESULT:** ghi output và điều nó chứng minh.
6. **ROOT CAUSE:** layer và contract sai cụ thể.
7. **FIX:** khởi động listener/sửa bind hoặc port tối thiểu.
8. **VERIFICATION:** `ss` + `curl` từ client context thật.
9. **REGRESSION:** dừng server và chứng minh port được giải phóng; không mở firewall Internet.

## 13. Self-check Questions

1. `localhost` trong container trỏ tới đâu?
2. Connection refused khác timeout về giả thuyết đầu tiên thế nào?
3. `0.0.0.0` dùng ở phía bind hay phía client URL?

## 14. Evidence Required

Terminal output của listen/curl và giải thích host-vs-container localhost.

## 15. Quiz

Quiz đạt tối thiểu 70%.

## 16. PASS Gate

Phải tái hiện refused, chứng minh DNS/IP/route/listener, giải thích host-vs-container localhost, nộp đủ evidence, quiz ≥70% và chốt hard gate.
