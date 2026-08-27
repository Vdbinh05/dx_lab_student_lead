---
id: w2-m8-postgresql-migration-seed
week: 2
order: 8
title: "PostgreSQL, SQL, Migration & Seed Support"
category: "PostgreSQL"
skillId: "postgresql"
estimatedMinutes: 210
targetLevel: "L3"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Server/database/schema/table, rows/columns, PK/FK, constraints/indexes, CRUD/JOIN, DATABASE_URL, psql, migration and seed"
keywords: ["postgresql","database","schema","table","pk","fk","sql","psql","migration","seed","database_url"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w2-m7-http-api-openapi"]
requiredEvidence: ["terminal-output","test-result","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 triage DNS/auth/readiness/migration/seed and operate backup/restore; domain model/business correctness remains SV2 ownership."
---

## 1. Ví dụ đời thường

PostgreSQL server là tòa nhà, database là khu riêng, schema là tầng, table là tủ hồ sơ, row là một phiếu và column là trường. PK là số hồ sơ duy nhất; FK là dây liên kết sang tủ khác.

## 2. Giải thích cực dễ

SV1 cần đủ SQL để chứng minh kết nối/data, không thiết kế business schema thay SV2. Migration version hóa thay đổi schema; seed tạo dữ liệu demo deterministic và phải chạy lại an toàn theo contract.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

PostgreSQL organizes databases into schemas and relational tables constrained by keys and rules. SQL SELECT/INSERT/UPDATE/DELETE and JOIN manipulate/query rows. A connection URL carries protocol, credentials, host, port and database. Migrations apply ordered schema changes; seeds establish known reference/demo state.

## 4. Why DX-Lab needs it

SV1 triage DNS/auth/readiness/migration/seed and operate backup/restore; domain model/business correctness remains SV2 ownership. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L3**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- server/database/schema/table
- row/column
- PK/FK/constraint/index concept
- SELECT/INSERT/UPDATE/DELETE/JOIN basic
- DATABASE_URL
- pg_isready/psql
- migration status/apply
- idempotent deterministic seed

## 7. Commands / Config examples

```bash
docker compose exec postgres pg_isready -U dxlab -d dxlab
docker compose exec postgres psql -U dxlab -d dxlab -c '\dt'
docker compose exec postgres psql -U dxlab -d dxlab -c 'select count(*) from products;'
docker compose exec backend npm run migrate
docker compose exec backend npm run seed
```

**COMMAND:** `docker compose exec postgres pg_isready -U dxlab -d dxlab` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal tại Compose project; PostgreSQL commands execute inside postgres; migration/seed commands execute in Backend using repository-defined scripts.  
**WHY:** Separate server readiness, authenticated SQL session, schema presence, row evidence and application migration/seed.  
**EXPECTED OUTPUT:** pg_isready accepts; psql lists expected tables; count is deterministic after seed; migration reports applied/up-to-date rather than destructive reset.  
**COMMON FAILURE:** Wrong DATABASE_URL host/port/password/db, service not ready, missing table/migration, seed duplicates or command names differ from repository.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal tại Compose project; PostgreSQL commands execute inside postgres; migration/seed commands execute in Backend using repository-defined scripts. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

pg_isready accepts; psql lists expected tables; count is deterministic after seed; migration reports applied/up-to-date rather than destructive reset. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Connect with psql, identify database/schema/table, run SELECT and one disposable INSERT/UPDATE/DELETE transaction, then rerun deterministic seed and compare counts.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục đúng file/config đã sao lưu trong lab và xác nhận use case cũ vẫn pass; không xóa volume

## 11. Independent Lab

Trace one API request to table rows and a simple JOIN; identify where infra evidence ends and SV2 domain ownership begins. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

From Backend container test DNS→TCP→auth→schema→seed→API. Handoff business rule/ERD decisions to SV2 with exact SQL/API evidence.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Use wrong database name then restore it; separately start Backend before migration and diagnose missing relation without resetting the database.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Test pg_isready, authenticated psql and migration status in that order before touching domain data.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** chạy lại caller, healthcheck và một use case lân cận bị ảnh hưởng bởi change

## 15. Common Beginner Errors

- Dùng localhost in DATABASE_URL
- Nhầm pg_isready với schema ready
- Chạy destructive reset để fix migration
- Seed tạo duplicates
- Sửa domain schema thay SV2

## 16. Self-check Questions

1. PK/FK khác gì?
2. pg_isready chứng minh gì?
3. Migration khác seed?
4. Khi nào handoff SV2?

## 17. Evidence Required

- terminal-output: readiness/psql/table/count
- test-result: migration + idempotent seed rerun
- explanation: infra vs domain boundary

Evidence type bắt buộc cho gate: `terminal-output` + `test-result` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được PostgreSQL connection chain và migration/seed safety, và hard gate được commit server-side. Nếu FAIL, quay lại DB connection, schema migration hoặc deterministic seed; không mở khóa bằng cách sửa status phía client.
