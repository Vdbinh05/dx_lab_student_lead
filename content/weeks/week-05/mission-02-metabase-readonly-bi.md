---
id: w5-m2-metabase-readonly-bi
week: 5
order: 2
title: "Metabase, Read-only Reporting & KPI Boundary"
category: "BI"
skillId: "metabase"
estimatedMinutes: 210
targetLevel: "L2"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "PostgreSQL→read-only reporting user→Metabase, dashboard access boundary and six KPI baseline"
keywords: ["metabase","bi","read only","reporting","kpi","postgresql","dashboard","permissions"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w5-m1-service-health-operations"]
requiredEvidence: ["test-result","log","explanation"]
quizPassScore: 75
hardGate: true
whyItMatters: "SV1 needs to provision/verify secure reporting integration, distinguish access/connection defects from KPI logic, and prevent BI credential from writing operational data."
---

## 1. Ví dụ đời thường

Metabase is a glass-walled reporting room: it reads warehouse records to show counts and trends but must not rearrange stock. Reporting credential is a visitor badge, not a warehouse manager key.

## 2. Giải thích cực dễ

Metabase connects with a read-only DB account. Dashboards show KPI but do not become source of truth. Verify data through selected SQL/source rows and document filters/timezone. SV1 supports connection/health/access; SV2 owns metric/business semantics.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

Business-intelligence tooling queries a source database through a least-privilege reporting principal. A dashboard visualization derives values from saved queries/filters; correctness requires validating query semantics, access permissions and source data rather than trusting chart rendering.

## 4. Why DX-Lab needs it

SV1 needs to provision/verify secure reporting integration, distinguish access/connection defects from KPI logic, and prevent BI credential from writing operational data. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L2**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- reporting user least privilege
- connection host/port/SSL awareness
- Metabase service health
- dashboard question/filter
- six KPI baseline
- source-of-truth row validation
- dashboard access roles
- read-only test

## 7. Commands / Config examples

```bash
docker compose ps metabase postgres
docker compose logs --tail=100 metabase
docker compose exec postgres psql -U reporting -d dxlab -c 'select current_user;'
docker compose exec postgres psql -U reporting -d dxlab -c 'create table should_fail(id int);'
```

**COMMAND:** `docker compose ps metabase postgres` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Host terminal at Compose root. The failed write test runs only against a disposable verified reporting account and should fail; do not alter production reporting grants during a learner test.  
**WHY:** Prove service state, authenticated reporting identity and absence of write privilege.  
**EXPECTED OUTPUT:** reporting user connects and SELECT works; CREATE/INSERT is denied; Metabase connects only through intended network/credential and dashboard access follows team policy.  
**COMMON FAILURE:** Reporting account has owner/write rights, Metabase uses app superuser, wrong DB host, public admin UI, KPI query has stale filter/timezone or dashboard chart hides null data.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Host terminal at Compose root. The failed write test runs only against a disposable verified reporting account and should fail; do not alter production reporting grants during a learner test. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

reporting user connects and SELECT works; CREATE/INSERT is denied; Metabase connects only through intended network/credential and dashboard access follows team policy. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

Create/verify read-only reporting account in lab, connect Metabase, build one safe KPI and compare chart result with a direct read-only SQL query/row count.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Create validation checklist for revenue/order/customer/top-product/low-stock/pending-approval KPI, separating connection/security checks (SV1) from metric definition (SV2). Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

Trace Metabase→Postgres reporting URL/network/user. When dashboard total differs, collect query/filter/source evidence then hand metric business rule to SV2 instead of granting write access.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

Use app write credential in a disposable Metabase config or deny reporting SELECT. Detect using current_user/grants/logs, restore least privilege and verify read-only write rejection.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Verify reporting identity and a simple SELECT/denied-write boundary before debugging dashboard formulas.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Use DB owner for dashboard
- Treat chart as source of truth
- Test only login not query permission
- Open Metabase admin publicly
- Give SV1 ownership of KPI business formula

## 16. Self-check Questions

1. Why reporting user read-only?
2. How validate chart?
3. Who owns KPI formula?
4. What does a denied CREATE prove?

## 17. Evidence Required

- test-result: read-only SELECT/denied-write proof
- log: Metabase/Postgres connection evidence
- explanation: BI/security versus business KPI boundary

Evidence type bắt buộc cho gate: `test-result` + `log` + `explanation`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được least-privilege BI connection and source validation, và hard gate được commit server-side. Nếu FAIL, quay lại reporting permission/connection or KPI source/filter proof; không mở khóa bằng cách sửa status phía client.
