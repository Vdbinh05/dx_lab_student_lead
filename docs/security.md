# Security boundary

## Local-first scope

Ứng dụng là sản phẩm single-learner chạy local/self-hosted, không có authentication hoặc multi-tenant authorization. Người có quyền đọc host/volume cũng có thể đọc SQLite và `.env`; không public trực tiếp ra Internet nếu chưa đặt sau một access boundary phù hợp.

## Secrets và Git

- `.env` khớp `.gitignore`, không tracked/staged/history trong repository hiện tại.
- `.env.example` được tracked và chỉ chứa SQLite path, host port, và Docker volume name không nhạy cảm.
- `npm run check:repo-safety` fail nếu các invariant trên đổi hoặc example chứa credential field có giá trị.

## Input và content

- Server Actions dùng Zod strict cho mission/evidence/quiz/incident/settings, giới hạn enum, URL và độ dài.
- Mission status, skill ownership, quiz score, assistance và PASS được tính lại từ curriculum + SQLite; client không được gửi giá trị authoritative.
- Markdown không bật raw HTML; test regression xác nhận `<script>` bị escape.
- Evidence text được React escape khi render. URL phải parse được bằng URL schema trước khi lưu.

## Dependency decision

Prisma 7.10.0 kéo `deepmerge-ts@7.1.5` qua config loader. Repository override lên `deepmerge-ts@8.0.2`, bản đã vá advisory stack-exhaustion; `prisma generate`, migration, seed, tests và production build là compatibility gates. `npm audit` hiện báo 0 vulnerability.

## Database model

SQLite có unique mission progress, indexed evidence/quiz/incident lookups và timestamps. Mission/skill IDs tham chiếu curriculum file-based nên không tạo foreign key tới bảng curriculum không tồn tại. Normal seed chỉ upsert bootstrap records; destructive reset tách riêng, yêu cầu `npm run db:reset -- --yes` và in cảnh báo `THIS DELETES LEARNER PROGRESS.` nếu thiếu xác nhận.

JSON import uses a strict versioned schema, bounded fields, known curriculum/skill/bookmark/oral references, duplicate-record rejection, an exact confirmation phrase, and a database transaction. It is intentionally destructive only after that confirmation. Export files and stopped SQLite snapshots may contain private evidence/notes and must be protected outside Git.
