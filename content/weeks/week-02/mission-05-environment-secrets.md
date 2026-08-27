---
id: w2-m5-environment-secrets
week: 2
order: 5
title: "Environment Contracts, Secrets & Validation"
category: "Configuration"
skillId: "environment"
estimatedMinutes: 210
targetLevel: "L4"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: ".env, .env.example, Compose interpolation, app env, secrets, config validation"
keywords: [".env",".env.example","interpolation","environment","secret","validation","DATABASE_URL"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w2-m4-volume-persistence"]
requiredEvidence: ["config","terminal-output","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "Sai hostname/port/issuer/model thường là config drift; SV1 owner env contract và security review, không owner business defaults."
---

## 1. Ví dụ đời thường

.env.example là danh sách ổ khóa cần loại chìa nào; .env là chùm chìa thật. Compose là người chuyển chìa vào đúng phòng, còn app phải kiểm ngay chìa nào thiếu thay vì chạy nửa vời.

## 2. Giải thích cực dễ

Host .env có thể được Compose dùng để interpolate YAML; environment/env_file chuyển giá trị vào container; app đọc process env. Ba bước này khác nhau. Secret thật không commit, không log, không paste vào evidence. App nên fail fast khi required config thiếu/sai.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Configuration is a versioned contract of required names and semantics. Compose interpolation resolves host-side values before container creation; container environment is runtime process input. Secret material follows the same transport but requires restricted storage, redaction and rotation procedures.

## 4. Why DX-Lab needs it

Sai hostname/port/issuer/model thường là config drift; SV1 owner env contract và security review, không owner business defaults. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L4**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- .env vs .env.example
- Compose ${VAR} interpolation
- environment vs env_file
- runtime process env
- required/default validation
- secret redaction/rotation
- DATABASE_URL service hostname

## 7. Commands / Config examples

```bash
docker compose config
docker compose run --rm backend sh -lc 'test -n "$DATABASE_URL" && echo DATABASE_URL=set'
git status --short
git check-ignore .env
```

**COMMAND:** `docker compose config` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal tại repository root; runtime env check chạy trong disposable Backend container và chỉ in presence, không in secret value.  
**WHY:** Verify host interpolation, runtime presence và repository ignore boundary mà không lộ secret.  
**EXPECTED OUTPUT:** Compose config resolve required names; container báo set; git ignore xác nhận .env không tracked; secret value không xuất hiện trong output.  
**COMMON FAILURE:** Biến thiếu/typo, empty default, wrong service hostname, shell expansion khác nhau, .env bị stage hoặc debug command in toàn bộ env.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal tại repository root; runtime env check chạy trong disposable Backend container và chỉ in presence, không in secret value. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

Compose config resolve required names; container báo set; git ignore xác nhận .env không tracked; secret value không xuất hiện trong output. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Tạo .env.example chỉ có names/safe placeholders, local .env có lab values, validate compose config và app startup. Thử bỏ một required variable và quan sát fail-fast message không chứa secret.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục đúng file/config đã sao lưu trong lab và xác nhận use case cũ vẫn pass; không xóa volume

## 11. Independent Lab

Viết env matrix name/consumer/required/sensitive/example/validation cho Backend-Postgres; reviewer phải dựng được không hỏi miệng. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Trace DATABASE_URL từ .env→Compose→Backend→postgres DNS. Handoff SV2 nếu connection pass nhưng domain query sai.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Cố tình typo POSTGRES_HOST hoặc để required var rỗng. Thu config/runtime/log evidence, rotate ngay nếu secret vô tình xuất hiện.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Inspect resolved Compose config and validate required variable presence without printing its value.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại caller, healthcheck và một use case lân cận bị ảnh hưởng bởi change

## 15. Common Beginner Errors

- Nghĩ .env.example chứa secret thật
- Nhầm interpolation với runtime env
- In env để debug rồi lộ secret
- Dùng localhost trong DATABASE_URL container
- Dùng silent default che missing config

## 16. Self-check Questions

1. Compose lấy ${VAR} từ đâu?
2. env_file khác .env interpolation?
3. Làm sao chứng minh var tồn tại mà không in value?
4. Secret đã lộ xử lý gì trước?

## 17. Evidence Required

- config: env contract redacted
- terminal-output: config validation + presence + git ignore
- incident-report: missing/typo variable

Evidence type bắt buộc cho gate: `config` + `terminal-output` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được config chain, redaction và rotation priority, và hard gate được commit server-side. Nếu FAIL, quay lại environment contract/interpolation hoặc secret handling; không mở khóa bằng cách sửa status phía client.
