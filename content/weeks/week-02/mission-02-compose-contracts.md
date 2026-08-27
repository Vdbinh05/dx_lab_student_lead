---
id: w2-m2-compose-contracts
week: 2
order: 2
title: "Compose Service Contracts"
category: "Docker Compose"
skillId: "compose"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Compose services, build/image, ports, environment, env_file, networks, volumes, depends_on, healthcheck, restart"
keywords: ["compose","services","ports","environment","depends_on","restart","config"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w2-m1-docker-image-container"]
requiredEvidence: ["config","terminal-output","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 owner Compose contract và phải review mọi hostname/port/env/health/dependency ảnh hưởng integration."
---

## 1. Ví dụ đời thường

Compose giống sơ đồ sân khấu: mỗi diễn viên là service, cửa ra vào là port, phòng hậu trường là network, kho đạo cụ là volume và cue bắt đầu là dependency. Sơ đồ đúng cú pháp chưa chứng minh vở diễn chạy đúng.

## 2. Giải thích cực dễ

Compose gom cách build/run nhiều container thành một contract. docker compose config cho biết contract sau khi biến môi trường được thay thế. depends_on điều khiển thứ tự/điều kiện khởi động, nhưng app vẫn cần retry vì dependency có thể mất sau startup.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

A Compose model declares services and their image/build source, process environment, network attachments, published ports, persistent mounts, healthchecks, restart policy and dependency conditions. The resolved model is the source for runtime orchestration, not a substitute for functional tests.

## 4. Why DX-Lab needs it

SV1 owner Compose contract và phải review mọi hostname/port/env/health/dependency ảnh hưởng integration. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- services và project name
- build vs image
- HOST:CONTAINER port mapping
- environment vs env_file
- networks/volumes
- depends_on service_healthy
- restart policy

## 7. Commands / Config examples

```bash
docker compose config
docker compose build
docker compose up -d
docker compose ps
docker compose logs --tail=100 backend
```

**COMMAND:** `docker compose config` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal tại directory chứa docker-compose.yml/compose.yaml và .env của lab.  
**WHY:** Validate resolved model trước, rồi build/start và quan sát đúng service.  
**EXPECTED OUTPUT:** config hiển thị service contract đã resolve; ps cho biết state/health/ports; logs cho startup hoặc first relevant error.  
**COMMON FAILURE:** Chạy sai directory, biến interpolation thiếu, port host bị dùng, service name typo hoặc healthcheck gọi tool không có trong image.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal tại directory chứa docker-compose.yml/compose.yaml và .env của lab. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

config hiển thị service contract đã resolve; ps cho biết state/health/ports; logs cho startup hoặc first relevant error. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Đọc một Compose ba service; lập bảng service/build-or-image/port/env/network/volume/health/dependency rồi so với docker compose config. Start và chứng minh từng cột bằng ps/inspect/log.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục đúng file/config đã sao lưu trong lab và xác nhận use case cũ vẫn pass; không xóa volume

## 11. Independent Lab

Tự thêm restart: unless-stopped và health-based dependency cho Backend mà không đổi business code; giải thích giới hạn của restart loop. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Trace Browser → published port → Backend internal port → postgres service; ghi rõ URL bên ngoài và hostname bên trong.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Cố tình đổi container target port nhưng giữ host port. Quan sát config, ps, listen evidence và caller symptom; fix contract tối thiểu.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Chạy docker compose config và so resolved service/port/env/network với expected contract.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại caller, healthcheck và một use case lân cận bị ảnh hưởng bởi change

## 15. Common Beginner Errors

- Đọc YAML gốc nhưng không xem config đã resolve
- Nhầm host/container port
- Tin depends_on bảo đảm app luôn sẵn sàng
- Đặt secret thật trong Compose
- Restart che crash loop

## 16. Self-check Questions

1. build khác image thế nào?
2. ports 8000:8001 nghĩa gì?
3. env_file có tự che secret khỏi inspect không?
4. Vì sao app vẫn cần retry?

## 17. Evidence Required

- config: resolved Compose excerpt không chứa secret
- terminal-output: ps/log/inspect evidence
- explanation: service contract và dependency limits

Evidence type bắt buộc cho gate: `config` + `terminal-output` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được resolved Compose contract và running/healthy/functional, và hard gate được commit server-side. Nếu FAIL, quay lại Compose config, port mapping hoặc dependency contract; không mở khóa bằng cách sửa status phía client.
