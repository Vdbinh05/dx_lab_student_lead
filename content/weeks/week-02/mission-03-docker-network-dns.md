---
id: w2-m3-docker-network-dns
week: 2
order: 3
title: "Docker Network, Service DNS & localhost Trap"
category: "Docker Network"
skillId: "docker-network"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Bridge networks, service DNS, service name/hostname, localhost, internal and published ports"
keywords: ["bridge","dns","service name","hostname","localhost","internal port","published port"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w2-m2-compose-contracts"]
requiredEvidence: ["terminal-output","config","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "Hostname/port boundary là root cause phổ biến nhất khi SV1 support Backend, n8n, Keycloak, Qdrant và Ollama."
---

## 1. Ví dụ đời thường

Mỗi container giống một căn hộ có số nội bộ. localhost là gọi điện cho chính căn hộ đó; service name là danh bạ chung trong tòa nhà; published port là quầy lễ tân chuyển cuộc gọi từ bên ngoài.

## 2. Giải thích cực dễ

Containers cùng Compose network thường resolve nhau bằng service name. Backend phải gọi postgres:5432, không phải localhost:5432. Browser trên host không dùng service name; nó gọi localhost hoặc domain qua published port/proxy.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

A user-defined bridge network provides isolated L2/L3 connectivity and embedded DNS for service aliases. Network namespaces make loopback local to each container. Published ports install host-to-container forwarding; container-to-container traffic normally uses the destination service's internal port.

## 4. Why DX-Lab needs it

Hostname/port boundary là root cause phổ biến nhất khi SV1 support Backend, n8n, Keycloak, Qdrant và Ollama. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- network namespace
- user-defined bridge
- embedded service DNS
- service name vs hostname
- localhost trap
- internal vs host published port

## 7. Commands / Config examples

```bash
docker compose config
docker compose exec backend getent hosts postgres
docker compose exec backend sh -lc 'nc -vz postgres 5432'
docker network inspect dxlab_default
```

**COMMAND:** `docker compose config` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal tại Compose project; getent/nc chỉ chạy nếu Backend image có tool đó, nếu không dùng image debug tạm trên cùng network.  
**WHY:** Tách DNS resolution, TCP reachability và host publishing thành ba phép đo riêng.  
**EXPECTED OUTPUT:** postgres resolve thành container IP; TCP tới postgres:5432 thành công; inspect cho thấy cả service trên cùng network.  
**COMMON FAILURE:** Tool không có trong image, service khác network, gọi localhost, dùng host port cho internal call hoặc service chưa listen.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal tại Compose project; getent/nc chỉ chạy nếu Backend image có tool đó, nếu không dùng image debug tạm trên cùng network. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

postgres resolve thành container IP; TCP tới postgres:5432 thành công; inspect cho thấy cả service trên cùng network. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Từ Backend container, resolve và kết nối postgres bằng service name. Từ host, chứng minh postgres service name không phải public DNS và chỉ gọi được khi có host mapping phù hợp.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục đúng file/config đã sao lưu trong lab và xác nhận use case cũ vẫn pass; không xóa volume

## 11. Independent Lab

Vẽ hai đường gọi: Browser→Backend và Backend→Postgres, ghi source namespace, destination hostname, internal/host port cho từng mũi tên. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Đổi DATABASE_URL từ localhost sang postgres và verify bằng DNS, TCP, app health và một API query; nếu query business sai, handoff SV2.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Cố tình đặt Backend và Postgres vào hai network không giao nhau hoặc dùng localhost. Không đổi port ngẫu nhiên; chứng minh DNS/TCP failure trước fix.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Từ đúng source container, test service-name resolution rồi TCP tới internal port.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại caller, healthcheck và một use case lân cận bị ảnh hưởng bởi change

## 15. Common Beginner Errors

- Dùng localhost để gọi container khác
- Dùng host published port giữa containers
- Nghĩ service name dùng được từ browser
- Chỉ ping rồi kết luận app works
- Thay network mà không kiểm callers

## 16. Self-check Questions

1. localhost trong container trỏ đâu?
2. Service DNS hoạt động trong scope nào?
3. Host port khác internal port ra sao?
4. DNS pass có chứng minh DB auth pass không?

## 17. Evidence Required

- terminal-output: DNS + TCP + network membership
- config: URL/hostname matrix redacted
- incident-report: localhost/network failure protocol

Evidence type bắt buộc cho gate: `terminal-output` + `config` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được namespace, DNS và port forwarding trên mọi mũi tên, và hard gate được commit server-side. Nếu FAIL, quay lại Docker DNS/network membership hoặc internal/external port; không mở khóa bằng cách sửa status phía client.
