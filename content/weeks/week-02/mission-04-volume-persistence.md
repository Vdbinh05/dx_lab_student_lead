---
id: w2-m4-volume-persistence
week: 2
order: 4
title: "Volumes, Bind Mounts & Persistence"
category: "Persistence"
skillId: "volumes"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Named volumes, bind mounts, persistence, recreation, Compose down and destructive down -v warning"
keywords: ["named volume","bind mount","persistence","recreate","down","down -v","data lifecycle"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w2-m3-docker-network-dns"]
requiredEvidence: ["terminal-output","config","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 phải chứng minh database/Qdrant/model/progress sống qua restart/recreate và ngăn thao tác down -v phá dữ liệu."
---

## 1. Ví dụ đời thường

Container là phòng khách sạn; named volume là kho giữ đồ độc lập với phòng; bind mount là mở cửa nối thẳng tới một thư mục của chủ nhà. Trả phòng không mất đồ trong kho, nhưng ra lệnh phá kho thì mất.

## 2. Giải thích cực dễ

Writable layer của container đi theo vòng đời container. Dữ liệu cần sống lâu phải ở named volume hoặc storage được thiết kế. Bind mount tiện cho source/config dev nhưng phụ thuộc path/quyền host. docker compose down không xóa named volume; down -v có thể xóa dữ liệu.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Docker mounts replace a container path with storage managed by a named volume or a host bind source. Container recreation preserves named-volume data when the same volume is reattached. Removing a volume destroys its stored filesystem and is a separate lifecycle operation.

## 4. Why DX-Lab needs it

SV1 phải chứng minh database/Qdrant/model/progress sống qua restart/recreate và ngăn thao tác down -v phá dữ liệu. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- container writable layer
- named volume
- bind mount path/permission
- volume inspect
- restart vs recreate
- docker compose down
- destructive down -v

## 7. Commands / Config examples

```bash
docker compose exec postgres psql -U dxlab -d dxlab -c "select 1;"
docker volume ls
docker volume inspect dxlab_pgdata
docker compose up -d --force-recreate postgres
```

**COMMAND:** `docker compose exec postgres psql -U dxlab -d dxlab -c "select 1;"` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal tại Compose project và psql bên trong postgres service; dùng tên volume thực từ docker compose config.  
**WHY:** Tạo/đọc marker data, inspect storage, recreate container rồi đọc lại marker để chứng minh persistence.  
**EXPECTED OUTPUT:** Container ID thay đổi sau recreate nhưng marker row/file trong named volume vẫn tồn tại.  
**COMMON FAILURE:** Mount sai target, anonymous volume mới, bind path không tồn tại/quyền sai hoặc vô tình dùng down -v. Không chạy down -v trong lab có dữ liệu thật.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal tại Compose project và psql bên trong postgres service; dùng tên volume thực từ docker compose config. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Container ID thay đổi sau recreate nhưng marker row/file trong named volume vẫn tồn tại. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Tạo marker record trong database lab, ghi container ID, force-recreate chỉ Postgres, rồi verify record và volume name. Chụp config trước/sau.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục đúng file/config đã sao lưu trong lab và xác nhận use case cũ vẫn pass; không xóa volume

## 11. Independent Lab

Tự thiết kế persistence test cho một service stateful khác và viết rollback không xóa dữ liệu. Nêu vì sao restart chưa đủ chứng minh recreation persistence. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Trace volume→Postgres→Backend API; verify sau recreate bằng cả row-level query và API smoke, không chỉ volume inspect.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Trong một stack disposable riêng, gắn sai volume target để data biến mất sau recreate. Chẩn đoán mount contract. Chỉ đọc và giải thích down -v warning; không chạy trên learner database.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** So docker compose config/inspect mount source-target và đọc marker data từ service stateful.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại caller, healthcheck và một use case lân cận bị ảnh hưởng bởi change

## 15. Common Beginner Errors

- Tin container filesystem là backup
- Nhầm restart với recreate
- Dùng bind path cá nhân tuyệt đối
- Chạy down -v theo phản xạ
- Inspect volume nhưng không test business data

## 16. Self-check Questions

1. Container lifecycle khác data lifecycle thế nào?
2. Named volume khác bind mount?
3. down có xóa volume không?
4. Vì sao phải smoke qua app sau recreate?

## 17. Evidence Required

- terminal-output: container ID trước/sau + marker còn tồn tại
- config: named-volume mount contract
- explanation: destructive down -v warning

Evidence type bắt buộc cho gate: `terminal-output` + `config` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được persistence qua recreate và blast radius của volume deletion, và hard gate được commit server-side. Nếu FAIL, quay lại mount source/target hoặc data-lifecycle mental model; không mở khóa bằng cách sửa status phía client.
