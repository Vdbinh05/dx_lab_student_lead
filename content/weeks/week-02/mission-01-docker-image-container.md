---
id: w2-m1-docker-image-container
week: 2
order: 1
title: "Docker Image, Container & Dockerfile"
category: "Docker"
skillId: "docker"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Dockerfile, image, container, layers, build context, build/run/exec/inspect/logs"
keywords: ["dockerfile","image","container","layers","build context","inspect","logs"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w1-m7-docker-compose-baseline"]
requiredEvidence: ["terminal-output","config","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 phải build artifact tái lập được, xem layer/cache, vào container để thu evidence và phân biệt lỗi build với lỗi runtime."
---

## 1. Ví dụ đời thường

Image giống khuôn bánh đã đóng gói; container là chiếc bánh đang được nướng từ khuôn đó. Dockerfile là công thức, còn build context là túi nguyên liệu được gửi cho thợ nướng. Gửi cả kho vào túi làm build chậm và dễ lộ file không cần thiết.

## 2. Giải thích cực dễ

Docker đọc Dockerfile theo từng bước để tạo image bất biến. Mỗi lần run tạo một container có process và filesystem riêng. Sửa file bên trong container không tự sửa Dockerfile hay image, nên fix đúng phải quay về source/config rồi rebuild.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

An image is a content-addressed, layered filesystem plus runtime metadata. A container is an isolated runtime instance of an image. Docker sends the selected build context to the builder, executes Dockerfile instructions, reuses cacheable layers, then starts the configured process through CMD/ENTRYPOINT.

## 4. Why DX-Lab needs it

SV1 phải build artifact tái lập được, xem layer/cache, vào container để thu evidence và phân biệt lỗi build với lỗi runtime. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- base image và pinned tag
- Dockerfile FROM/WORKDIR/COPY/RUN/CMD
- layer cache
- .dockerignore và build context
- docker build/run/exec/inspect/logs

## 7. Commands / Config examples

```bash
docker build -t dxlab-api:0.2 ./backend
docker run --rm --name dxlab-api-test -p 8000:8000 dxlab-api:0.2
docker exec dxlab-api-test sh -lc 'pwd && ps'
docker inspect dxlab-api-test
docker logs --tail=100 dxlab-api-test
```

**COMMAND:** `docker build -t dxlab-api:0.2 ./backend` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal tại repository root; đường dẫn ./backend phải tồn tại trong project lab thật.  
**WHY:** Build image có tag, chạy instance tạm, rồi kiểm process/metadata/log thay vì đoán.  
**EXPECTED OUTPUT:** Build kết thúc với image tag dxlab-api:0.2; container có process chính; inspect cho thấy image/port; logs có startup line liên quan.  
**COMMON FAILURE:** Build context sai, COPY không tìm thấy file, base tag không tồn tại, process exit hoặc app chỉ bind localhost trong container.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal tại repository root; đường dẫn ./backend phải tồn tại trong project lab thật. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Build kết thúc với image tag dxlab-api:0.2; container có process chính; inspect cho thấy image/port; logs có startup line liên quan. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Tạo Dockerfile nhỏ cho HTTP service mẫu, thêm .dockerignore loại .git/.env/node_modules, build hai lần và so sánh layer nào dùng cache. Run service, gọi health, xem inspect/log rồi dừng container tạm.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục đúng file/config đã sao lưu trong lab và xác nhận use case cũ vẫn pass; không xóa volume

## 11. Independent Lab

Từ một service khác, tự viết Dockerfile không copy secret, pin base tag, build và giải thích thứ tự COPY nào tối ưu cache mà vẫn đúng. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Build Backend image rồi chứng minh Portal/proxy gọi được published port; nếu source thuộc SV2, handoff Dockerfile/runtime evidence thay vì sửa business code.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Cố tình đặt COPY tới file ngoài build context hoặc đổi CMD sang port khác. Thu build/runtime evidence và xác định failure xảy ra trước hay sau khi container được tạo.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Đọc first relevant build/runtime error rồi đối chiếu Dockerfile, build context và process command.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại caller, healthcheck và một use case lân cận bị ảnh hưởng bởi change

## 15. Common Beginner Errors

- Nghĩ image và container là một
- Dùng latest không kiểm soát
- Copy .env vào image
- Sửa trực tiếp container rồi coi là fix
- Gửi toàn repository làm context

## 16. Self-check Questions

1. Vì sao rebuild mới thay đổi image?
2. Layer cache bị invalid từ instruction nào?
3. exec khác run thế nào?
4. Build context có liên quan gì tới secret?

## 17. Evidence Required

- terminal-output: build/run/inspect/log relevant lines
- config: Dockerfile + .dockerignore đã redacted
- explanation: image/layer/container causal chain

Evidence type bắt buộc cho gate: `terminal-output` + `config` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được build context, layer cache và runtime process, và hard gate được commit server-side. Nếu FAIL, quay lại Dockerfile/build-context hoặc image/container mental model; không mở khóa bằng cách sửa status phía client.
