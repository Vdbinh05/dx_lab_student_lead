---
id: w5-m3-kpi-data-validation
week: 5
order: 3
title: "KPI Data Validation & Reporting Incident Triage"
category: "Data Operations"
skillId: "postgresql"
estimatedMinutes: 210
targetLevel: "L3"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Revenue/order/customer/top-products/low-stock/pending-approval KPI validation, SQL/filter/timezone/source-row trace"
keywords: ["kpi","sql","revenue","orders","customers","stock","approvals","filter","timezone"]
objectives: ["Giải thích concept bằng analogy và technical language","Tự chạy lab và phân biệt expected/actual","Debug failure bằng evidence protocol"]
prerequisites: ["w5-m2-metabase-readonly-bi"]
requiredEvidence: ["test-result","terminal-output","incident-report"]
quizPassScore: 75
hardGate: true
whyItMatters: "Week 5 Boss Fight requires data correctness rather than service running. It teaches SV1 to hand off a factual lineage defect rather than vague 'Metabase wrong'."
---

## 1. Ví dụ đời thường

Dashboard is a calculator display. If it shows wrong total, check the receipt rows and calculator formula; do not tap the display until it changes. A healthy service can faithfully display a wrong filter.

## 2. Giải thích cực dễ

Validate one known business ID from API/database to dashboard. Check table/query/filter/status/timezone/null handling and compare counts/totals. SV1 does not rewrite metric meaning but ensures query route, reporting access and evidence are sound.

## 3. Technical Definition

**Nguồn:** [THEO KẾ HOẠCH CÔ]

KPI correctness is a lineage problem: operational events are persisted in source tables, transformed by explicit query/filter/aggregation rules, and rendered in a BI layer. Validation compares controlled source records and independent aggregate queries against dashboard results across time/status boundaries.

## 4. Why DX-Lab needs it

Week 5 Boss Fight requires data correctness rather than service running. It teaches SV1 to hand off a factual lineage defect rather than vague 'Metabase wrong'. SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **L3**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

- six baseline KPIs
- source table and business ID
- SELECT/COUNT/SUM/GROUP BY basic
- status/filter
- timezone/date range
- null/duplicate awareness
- dashboard query comparison
- SV2 metric handoff

## 7. Commands / Config examples

```bash
docker compose exec postgres psql -U reporting -d dxlab -c 'select count(*) from orders;'
docker compose exec postgres psql -U reporting -d dxlab -c 'select status, count(*) from orders group by status;'
docker compose logs --tail=100 metabase
docker compose ps metabase postgres
```

**COMMAND:** `docker compose exec postgres psql -U reporting -d dxlab -c 'select count(*) from orders;'` và các lệnh liên quan trong block.  
**WHERE TO RUN:** Run read-only SQL inside postgres using the reporting user. Exact table/column names belong to the project schema; replace examples only with documented real schema.  
**WHY:** Measure source rows/filters directly before editing dashboard questions.  
**EXPECTED OUTPUT:** A controlled business record can be found in source data; aggregate/filter result has a documented relationship to dashboard card; discrepancies name exact query/filter/timezone/state gap.  
**COMMON FAILURE:** Query wrong environment/schema, dashboard cache stale, old status filter, timezone mismatch, reporting lag, duplicate record or business definition undocumented.

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

Run read-only SQL inside postgres using the reporting user. Exact table/column names belong to the project schema; replace examples only with documented real schema. Trước khi chạy, xác nhận project/directory bằng `pwd` và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

A controlled business record can be found in source data; aggregate/filter result has a documented relationship to dashboard card; discrepancies name exact query/filter/timezone/state gap. Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

For one KPI, choose a known record and trace API result→source row→read-only SQL aggregate→dashboard. Record expected/actual and source query/filter version.

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: khôi phục exact lab configuration/export đã sao lưu, verify caller cũ and do not delete persistent data

## 11. Independent Lab

Build an acceptance table for six KPIs with example business IDs, source tables, query validation, dashboard filter and owner. Do not fabricate business results. Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

If API creates row but dashboard misses it, verify DB/connection/filter/timezone first; then send SV2 a precise query/result evidence package for domain metric decision.

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

In a disposable dashboard question, use a stale status filter or wrong date boundary. Demonstrate source row exists, card misses it, correct only filter and regression check adjacent KPI cards.

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** Find a known business ID in source data and compare its status/time/filter inclusion before editing a KPI query.
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** rerun health, one positive flow, one negative flow and an adjacent caller after the minimum fix

## 15. Common Beginner Errors

- Use write account to inspect KPI
- Trust chart with no source query
- Ignore timezone/status
- Claim dashboard bug before row check
- Fix business definition without SV2

## 16. Self-check Questions

1. What chain validates a KPI?
2. Why use known business ID?
3. What can healthy Metabase still get wrong?
4. When escalate to SV2?

## 17. Evidence Required

- test-result: source-row/query/dashboard comparison
- terminal-output: read-only aggregate evidence
- incident-report: incorrect KPI protocol

Evidence type bắt buộc cho gate: `test-result` + `terminal-output` + `incident-report`. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: 75%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được data lineage and evidence-based KPI handoff, và hard gate được commit server-side. Nếu FAIL, quay lại source/query/filter/timezone validation; không mở khóa bằng cách sửa status phía client.
