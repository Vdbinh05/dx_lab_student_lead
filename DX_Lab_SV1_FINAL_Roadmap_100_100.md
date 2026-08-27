# DX-LAB CORE — SV1 FINAL ROADMAP 100/100

**Version:** FINAL-AUDIT-2026-08-27  
**Purpose:** Roadmap huấn luyện SV1 cho DX-Lab Core / OLP Phần mềm nguồn mở 2026  
**Status:** FINAL SPECIFICATION — evidence-based graduation required

## Cấu trúc tài liệu

1. **PHẦN 1 — FINAL AUDIT**
2. **PHẦN 2 — FINAL ROADMAP**
3. **PHẦN 3 — FINAL 100/100 MATRIX**
4. **PHẦN 4 — 8-WEEK FINAL PLAN**
5. **PHẦN 5 — FINAL GRADUATION CHECKLIST**
6. **PHẦN 6 — REMAINING TBD REGISTER**

> “100/100” trong tên file nghĩa là **roadmap specification đã khóa đủ scope/gate/evidence**, không phải người học tự động đạt 100 điểm.

---

# PHẦN 1 — FINAL AUDIT

## 1.1. Audit đã thực hiện

Bản roadmap hiện tại đã được đọc toàn bộ từ đầu đến cuối trước khi sửa. Audit lần này không nhằm viết lại văn phong; mục tiêu là khóa các **operational gaps** khiến một roadmap kỹ thuật tốt vẫn có thể thất bại khi team thực thi.

Roadmap cũ đã rất mạnh ở các trục: role SV1, Linux/networking, Git/Open Source, Docker/Compose, Identity, System Integration, troubleshooting, failure injection, backup/restore, AI infra, Agent security, fresh-machine, release và handoff. Phần hiện tại cũng đã nhận diện đúng một số TBD như CI, security closure, service contracts và configuration details.

## 1.2. Những gì đã đủ và được giữ

- Role SV1 = Team Lead/DevOps/H/Integration/Release/Troubleshooting.
- SV1 không làm thay module owner.
- L0–L4 rõ.
- Docker/Compose/Network/Volume/Env/Healthcheck đủ sâu.
- OIDC/JWT/RBAC/401/403 đủ rõ.
- n8n/retry/idempotency/HITL đủ để integration.
- Backup/restore có recovery drill.
- Qdrant/Ollama/RAG infra boundary rõ.
- Agent pending-only/HITL/red-team rõ.
- Troubleshooting dùng evidence thay random fix.
- Fresh-machine/release rõ.
- Open Source workflow xuyên 8 tuần.
- Change impact/blast radius đã có.
- Documentation governance đã có.
- Scope-control “không overlearn” đã đúng.

## 1.3. Năm khoảng trống thật sự

### A. Team Lead Operating System
Roadmap có khái niệm lead nhưng chưa có **issue contract + state model + priority + blocker/escalation + acceptance/evidence closure** đủ để dùng hằng ngày.

### B. CI Gate
Roadmap có “CI lint/quality gate” nhưng chưa khóa **trigger, blocking checks, merge policy, failure evidence và ownership**.

### C. Observability Baseline
Roadmap có logs/health/resource nhưng chưa gom thành **Service Health Matrix + resource baseline + evidence protocol**.

### D. Security Closure
Roadmap có RBAC/Agent red-team nhưng chưa khóa **threat model ngắn, public/internal boundary, secret rotation, backup protection, demo credentials và corpus safety** thành một gate.

### E. Configuration Freeze
Roadmap biết nhiều thông tin còn TBD nhưng chưa có **deadline/source-of-truth/freeze rule** để đảm bảo các TBD không sống tới release.

## 1.4. Những gì đã sửa trong FINAL

1. Thêm **Team Lead Operating System**.
2. Thêm **CI Quality Gate**.
3. Thêm **Observability Baseline**.
4. Thêm **Security Closure**.
5. Thêm **Configuration Freeze** tại đầu Week 8.
6. Chuẩn hóa **Weekly Quality Loop: Learn → Practice → Build → Break → Debug → Evidence → Gate**.
7. Thêm **Team Readiness Gate**.
8. Thêm **Remaining TBD register có owner/deadline/source of truth**.
9. Thêm **Final 100/100 matrix 24 category**.
10. Thêm **Scope Control Audit** để chứng minh không overengineer.

## 1.5. Role-boundary conflict đã phát hiện và xử lý

Trong yêu cầu audit mới có một dòng ghi:

```text
SV2 = Backend/API/Data owner
SV3 = Process/AI/RAG owner
```

Trong khi roadmap hiện tại và kế hoạch V3 chính thức xác định:

```text
SV1 = Team Lead / DevOps / H
SV2 = Backend / P / D — PostgreSQL, REST API, n8n, BI
SV3 = AI / UX / I — Portal, RAG, Qdrant, Agent, demo
```

Cùng yêu cầu audit mới cũng nói **không phá role boundary hiện tại**. Vì vậy FINAL dùng decision:

> **DR-ROLE-001:** giữ boundary của roadmap hiện tại/kế hoạch giảng viên. SV2 vẫn owner Backend/P/D và business workflow/n8n; SV3 vẫn owner Portal/AI/RAG/Agent/UX. SV1 coordinate Integration/Security/Release. Dòng “SV3 = Process/AI/RAG” được coi là wording conflict, không phải role-change được áp dụng âm thầm.

Nếu sau này team thật sự muốn đổi owner Process sang SV3, phải làm như một Change Request có GVHD chấp thuận.

## 1.6. Những gì cố tình KHÔNG thêm

Không thêm:

- Kubernetes;
- Terraform;
- Ansible;
- Service Mesh;
- Prometheus/Grafana stack;
- ELK;
- Jenkins chuyên sâu;
- Vault;
- HA/cluster;
- cloud architecture chuyên sâu;
- enterprise DevSecOps.

Lý do: không cần để SV1 đạt mục tiêu DX-Lab/OLP hiện tại và làm tăng scope/debug surface.

## 1.7. Scope Control Audit

| Bổ sung | Phục vụ SV1? | Phục vụ DX-Lab? | Evidence được? | Quyết định |
|---|---:|---:|---:|---|
| Team Lead OS | Có | Có | Có | GIỮ |
| CI Gate | Có | Có | Có | GIỮ |
| Observability baseline | Có | Có | Có | GIỮ |
| Security Closure | Có | Có | Có | GIỮ |
| Configuration Freeze | Có | Có | Có | GIỮ |
| Prometheus/Grafana | Không cần | Không bắt buộc | Có nhưng thừa | LOẠI |
| Kubernetes | Không cần | Không bắt buộc | Có nhưng thừa | LOẠI |
| Terraform/Ansible | Không cần | Không bắt buộc | Có nhưng thừa | LOẠI |

## 1.8. Kết quả audit

**Roadmap specification trước vòng này:** 61/72 điểm category-depth = **84.7/100**.

Điểm thấp không phải vì thiếu core technical content, mà vì 5 operational gates trên chưa đủ khóa.

**Roadmap specification sau vòng FINAL:** đủ 24/24 category ở mức thiết kế mạnh = **100/100**.

> Đây là **điểm hoàn thiện của tài liệu roadmap**, không phải tuyên bố SV1 đã có năng lực 100/100. Năng lực thật chỉ được PASS khi có evidence ở PHẦN 5.

---

# PHẦN 2 — FINAL ROADMAP 100/100

## 2.0. Final mission

Roadmap FINAL huấn luyện SV1 đạt chuỗi năng lực:

```text
UNDERSTAND
→ DEPLOY
→ INTEGRATE
→ OBSERVE
→ DEBUG
→ COORDINATE
→ REVIEW
→ SECURE
→ RELEASE
→ EXPLAIN
```

## 2.0.1. Final role boundary

```text
SV1
= Lead + Infrastructure/DevOps + Identity + Integration
+ Troubleshooting + Fresh-machine + Release + Security coordination

SV2
= Backend/API/Data + business Process/n8n owner

SV3
= Portal/UX + AI/RAG/Agent owner
```

SV1 support hai owner nhưng không trở thành owner thay họ.

## 2.0.2. Source hierarchy

```text
1. Kế hoạch/Hướng dẫn giảng viên
2. Kế hoạch DX-Lab Core
3. Quick Guide DX-OS
4. Thể lệ OLP PMNM
5. Final SV1 roadmap
6. Kiến thức mở rộng
```

## 2.0.3. Release philosophy

```text
CODE RUNS
≠
SYSTEM READY

SYSTEM READY
=
build + health + integration + security + evidence
+ docs + reproducibility + team readiness
```

Dưới đây là toàn bộ roadmap đã được tích hợp lại, bao gồm 28 hạng mục cũ và các gate mới.

> **Mục đích:** Gom toàn bộ những gì đã thiết kế, audit, sửa, bổ sung và khóa trong roadmap SV1 vào một tài liệu Markdown duy nhất để rà soát thiếu sót.
>
> **Phạm vi:** 28 hạng mục công việc đã hoàn thành, tương ứng với toàn bộ PHẦN 1 → PHẦN 18 và các trục xuyên suốt: role boundary, troubleshooting, failure injection, Open Source, fresh-machine, release, documentation, handoff SV2/SV3, security, H-P-D-I và kiểm tra consistency.
>
> **Đối tượng:** SV1 — Team Lead / DevOps Owner / H-Identity Owner / Integration Owner / Release-Fresh-Machine Owner / Troubleshooting Owner.
>
> **Nguyên tắc:** Đây là roadmap huấn luyện theo vai trò SV1. Các mức L0–L4 là rubric học tập được thiết kế để phục vụ luyện tập và đánh giá nội bộ, **không phải thang điểm chính thức của giảng viên hoặc OLP**.

---

## 0. NGUỒN VÀ NGUYÊN TẮC ƯU TIÊN

### 0.1. Nguồn được dùng

1. **Hướng dẫn từng bước xây dựng DX-Lab Core**  
   Tệp: `Huong_dan_tung_buoc_xay_dung_DX_Lab_Core.docx`

2. **Kế hoạch 02 tháng xây dựng DX-Lab Core OLP 2026 V3**  
   Tệp: `Ke_hoach_2_thang_xay_dung_DX_Lab_Core_OLP_2026_V3_...docx`

3. **Linux Day 1 DX-Lab Cheat Sheet**  
   Tệp: `Linux_Day1_DXLab_CheatSheet.docx`

4. **Quick Guide to DX-OS**  
   Tệp: `Quick-guide-to-DXOS.pdf`

5. **Thể lệ OLP Phần mềm nguồn mở 2026**  
   Tệp: `Thể lệ cuộc thi phần mềm nguồn mở - OLP 2026.pdf`

6. **Thông báo số 1 OLP-ICPC 2026**  
   Tệp: `Thông báo số 1 OLP-ICPC 2026.pdf`

### 0.2. Thứ tự ưu tiên khi có khác biệt

```text
1. Kế hoạch/Hướng dẫn chính thức của giảng viên
2. Kế hoạch 8 tuần DX-Lab Core
3. Quick Guide DX-OS
4. Thể lệ OLP PMNM 2026
5. Roadmap SV1 hiện tại
6. Kiến thức mở rộng phục vụ học/debug
```

### 0.3. Quy ước nhãn

- **[THEO KẾ HOẠCH CÔ]**: có cơ sở trực tiếp trong kế hoạch/cẩm nang.
- **[KIẾN THỨC MỞ RỘNG ĐỂ SV1 HỌC/DEBUG TỐT HƠN]**: bổ sung để đạt năng lực triển khai, tích hợp, debug, review và lead tốt hơn.
- **[PROJECT-DEFINED / TBD]**: chưa được tài liệu chính thức khóa; phải lấy từ repository/Compose/config thực tế.

---

## 1. EXECUTIVE SUMMARY — ĐÍCH CUỐI CÙNG CỦA SV1

### 1.1. Vai trò cuối cùng

```text
SV1
=
TEAM LEAD
+ DEVOPS OWNER
+ H / IDENTITY OWNER
+ SYSTEM INTEGRATION OWNER
+ RELEASE / FRESH-MACHINE OWNER
+ TROUBLESHOOTING OWNER
```

SV1 **không** phải:

- Backend owner;
- Database/domain owner;
- n8n business-process owner;
- Frontend developer;
- RAG algorithm owner;
- Agent reasoning/prompt owner.

SV1 phải:

- hiểu toàn hệ thống;
- triển khai được;
- debug được;
- biết service nào gọi service nào;
- biết lỗi thuộc layer nào;
- support SV2/SV3 đúng ranh giới;
- đánh giá blast radius khi thay đổi;
- review config/security/release;
- chứng minh hệ thống chạy trên máy sạch.

### 1.2. Chuẩn đầu ra sau 8 tuần

SV1 phải có khả năng:

```text
Đưa SOURCE
→ dựng được.

Đưa SYSTEM
→ hiểu dependency.

Đưa FAILURE
→ khoanh vùng được.

Đưa CHANGE
→ biết blast radius.

SV2 bị integration blocker
→ hỗ trợ được.

SV3 bị AI infra/security blocker
→ hỗ trợ được.

Đưa MÁY SẠCH
→ deploy được.

Đưa GIẢNG VIÊN
→ giải thích được H-P-D-I end-to-end.
```

---

## 2. HẠNG MỤC 01 — AUDIT ROADMAP CŨ

### 2.1. Kết luận audit

Roadmap nền ban đầu đúng hướng nhưng có các điểm cần sửa:

1. Week 1 chính thức đã có Docker/Compose baseline, không được dời toàn bộ Docker sang Week 2.
2. Week 4 chính thức là Process I / n8n, không được biến thành tuần Integration thuần.
3. Week 5 chính thức là Process/Data II + BI + backup/restore + operations.
4. Week 6 SV1 chính thức hỗ trợ service/container Qdrant/Ollama.
5. Week 7 SV1 chính thức phụ trách security/tool auth và red-team AI.
6. Frontend coding của SV1 phải khóa ở L0.
7. Integration phải trở thành một năng lực riêng của SV1.
8. Troubleshooting phải chạy xuyên 8 tuần.
9. Open Source workflow phải chạy xuyên 8 tuần.
10. Fresh-machine/release phải được chuẩn bị từ sớm, không chỉ làm cuối kỳ.

### 2.2. Sáu trụ ownership đã khóa

```text
1. Team Lead / Engineering Coordination
2. DevOps
3. H / Identity
4. System Integration
5. Release / Fresh-Machine
6. Troubleshooting
```

---

## 3. HẠNG MỤC 02 — ROLE SV1 FINAL

### 3.1. Team Lead không đồng nghĩa “làm hết”

Lead làm:

```text
identify blocker
→ collect evidence
→ locate layer
→ identify owner
→ coordinate fix
→ integration retest
→ regression
```

Lead không làm:

```text
SV2 domain bug → giành code SV2
SV3 prompt bug → giành AI logic
```

### 3.2. Core ownership SV1

- Linux
- Networking
- Git
- GitHub/Open Source workflow
- Docker
- Docker Compose
- Docker Network
- Volumes
- Environment Variables
- Secrets handling
- Healthcheck
- Logs
- Keycloak
- Authentication
- Authorization
- OIDC
- JWT
- SSO
- RBAC
- Reverse Proxy
- Build
- Deployment
- System Integration
- Troubleshooting
- Fresh-machine
- Release
- Integration Testing orchestration
- Operations docs review
- Architecture awareness
- Repository hygiene

### 3.3. Support SV2

SV1 biết đủ để support:

- HTTP/REST/JSON;
- route/endpoint;
- validation/error contract;
- OpenAPI/Swagger;
- PostgreSQL connection;
- migration/seed;
- `pg_isready`, `psql`;
- n8n/webhook/retry/idempotency/correlation;
- Metabase connectivity;
- backup/restore operations.

SV1 **không owner business logic/schema domain**.

### 3.4. Support SV3

SV1 biết:

- Portal integration awareness;
- browser/API auth debug;
- Qdrant deploy/debug;
- Ollama deploy/debug;
- RAG architecture + dependency debug;
- Agent tool/API integration;
- Agent auth/RBAC;
- permission boundary;
- HITL;
- AI red-team.

SV1 **không code frontend** và **không owner RAG/Agent reasoning logic**.

---

## 3A. TEAM LEAD OPERATING SYSTEM — BỔ SUNG FINAL

### 3A.1. Mục tiêu

SV1 không cần học project-management theory dài dòng. SV1 cần một operating system kỹ thuật đủ để biến requirement thành việc có owner, dependency, evidence và Definition of Done.

Luồng chuẩn:

```text
Requirement
↓
Issue
↓
Priority
↓
Owner
↓
Acceptance Criteria
↓
Implementation
↓
Review
↓
Integration Test
↓
Evidence
↓
DONE
```

### 3A.2. Issue contract bắt buộc

Mỗi Issue quan trọng phải có tối thiểu:

```text
Problem:
Why / Context:
Owner:
Priority:
Dependencies:
Acceptance Criteria:
Evidence Required:
Definition of Done:
Integration Impact:
```

Nếu Issue thay đổi architecture/config contract, thêm:

```text
Decision / ADR required?
Affected services?
Rollback?
```

### 3A.3. Trạng thái board

```text
TODO
→ IN PROGRESS
→ BLOCKED
→ REVIEW
→ DONE
```

Quy tắc:

- `TODO`: đã hiểu problem nhưng chưa bắt đầu.
- `IN PROGRESS`: có owner và đang thực hiện.
- `BLOCKED`: không thể tiến tiếp vì dependency/decision/failure cụ thể; phải ghi blocker evidence.
- `REVIEW`: implementation xong nhưng chưa đủ review/integration evidence.
- `DONE`: acceptance criteria + test + evidence + docs/config + review đều đạt.

Không dùng `DONE` cho task chỉ vì “code xong”.

### 3A.4. Priority tối giản

```text
P0 — chặn build/demo/security/release hoặc làm hỏng must-flow.
P1 — quan trọng nhưng có workaround hoặc không chặn toàn sprint.
P2 — polish/cleanup/non-critical improvement.
```

SV1 không được biến priority thành danh sách cảm tính. P0 phải có lý do rõ.

### 3A.5. Blocker handling

```text
Blocker detected
↓
Collect evidence
↓
Identify dependency/layer
↓
Assign owner
↓
Define next test
↓
Escalate if architectural/security/release impact
↓
Verify fix
↓
Integration regression
```

SV1 phải phân biệt:

- Infrastructure/Identity/Integration/Release → SV1 owner.
- Backend/API/Data/business state → SV2 owner.
- Portal/AI/RAG/Agent reasoning/UI → SV3 owner.
- Cross-service → SV1 điều phối, owner module sửa root cause.

### 3A.6. Escalation rule

Escalate tới GVHD/decision record khi:

- requirement mâu thuẫn;
- đổi stack/architecture;
- security boundary thay đổi;
- P0 blocker không có owner hoặc không có hướng giải quyết;
- change có thể phá release/fresh-machine;
- team muốn thêm công nghệ mới.

### 3A.7. Team Lead Definition of Done

Một task chỉ DONE khi:

```text
Acceptance Criteria pass
+
tests/evidence tồn tại
+
owner đã self-check
+
PR review pass
+
integration impact đã kiểm
+
docs/config liên quan cập nhật
+
không secret
```

### 3A.8. Evidence mẫu

```text
Issue link
PR link
Command / Test:
Expected:
Actual:
Screenshot/log snippet nếu hữu ích:
Correlation ID / business ID nếu có:
Reviewer:
Regression result:
```

### 3A.9. PASS condition

SV1 PASS Team Lead Operating System khi có thể nhận một requirement mới, tự tách thành Issues có owner/dependency/acceptance/evidence, phát hiện blocker, handoff đúng và chứng minh task thật sự DONE mà không giành việc của SV2/SV3.

---

## 4. HẠNG MỤC 03 — LEVEL MATRIX L0–L4

### 4.1. Định nghĩa

#### L0 — Out of Scope
Không cần thực hiện công việc này.

#### L1 — Biết nó là gì
Giải thích được:
- nó là gì;
- dùng làm gì;
- nằm đâu trong DX-Lab.

#### L2 — Làm theo hướng dẫn
Có runbook/config mẫu thì thực hiện được.

#### L3 — Tự làm
Tự setup/config/test/verify.

#### L4 — Làm + Debug + Giải thích + Review
Có thể:

```text
implement/configure
+
troubleshoot
+
explain causal chain
+
assess blast radius
+
review
+
write runbook/evidence
```

### 4.2. Core SV1 target

| Domain | Target |
|---|---:|
| Linux | L4 |
| Networking | L4 |
| Git | L4 |
| GitHub/Open Source | L4 |
| Docker | L4 |
| Docker Compose | L4 |
| Docker Network | L4 |
| Volume/Persistence | L4 |
| Environment | L4 |
| Secrets | L4 practical |
| Healthcheck | L4 |
| Logs | L4 |
| Keycloak | L4 |
| Authentication | L4 |
| Authorization | L4 |
| OAuth2 | L2–3 |
| OIDC | L4 trong DX-Lab |
| JWT | L4 |
| SSO | L4 trong DX-Lab |
| RBAC | L4 |
| Reverse Proxy | L3–4 |
| Build | L4 |
| Deployment | L4 |
| Fresh-machine | L4 |
| Release | L4 |
| Troubleshooting | L4 |
| System Integration | L4 |
| Integration Testing | L4 orchestration |
| Architecture awareness | L4 DX-Lab |

### 4.3. Support SV2 target

| Domain | Target |
|---|---:|
| HTTP/REST/JSON | L3 |
| Backend architecture | L2–3 |
| OpenAPI/Swagger | L3 |
| PostgreSQL domain | L2–3 |
| Migration/Seed | L2–3 |
| Backup/Restore | L4 operations |
| n8n | L2–3 |
| Metabase | L2 |

### 4.4. Support SV3 target

| Domain | Target |
|---|---:|
| React/Next.js/CSS | L0 |
| Frontend integration awareness | L1–2 |
| Browser auth debugging | L2 |
| LLM concept | L1–2 |
| Embedding | L1–2 |
| Vector DB | L2 |
| Qdrant infra | L3 |
| Ollama infra | L3 |
| RAG architecture | L2 |
| RAG algorithm | L1–2 |
| RAG infra/debug | L3 |
| Agent architecture | L2 |
| Tool calling | L2–3 |
| Agent/API integration | L3 |
| Agent security | L3–4 |

---

## 5. HẠNG MỤC 04 — DEPENDENCY MAPS

Ba bản đồ đã được tách riêng.

### 5.1. Learning Dependency

```text
DX-Lab / H-P-D-I
↓
Linux
↓
Networking
↓
HTTP + Git
↓
Docker
↓
Docker Network / Volume / Env
↓
Compose
↓
API / PostgreSQL / Health / Logs
↓
Keycloak / OIDC / JWT / RBAC
↓
System Integration
↓
n8n / Workflow / HITL
↓
Operations / BI / Backup
↓
Qdrant + Ollama
↓
RAG
↓
Agent
↓
Agent Security
↓
Full Integration
↓
Fresh-Machine
↓
Release
```

### 5.2. Runtime Dependency

```text
Browser
→ Portal
→ Keycloak
→ Backend
→ PostgreSQL
→ n8n

Metabase → PostgreSQL

RAG
├→ Qdrant
└→ Ollama

Agent
├→ RAG
└→ Backend tools
```

### 5.3. Execution Dependency 8 tuần

```text
W1 Foundation
↓
W2 Data/API
↓
W3 Identity
↓
W4 Process
↓
W5 Operations/BI
↓
W6 RAG
↓
W7 Agent/HITL
↓
W8 Integration/Release
```

### 5.4. Cross-cutting

Chạy xuyên 8 tuần:

- Git/Open Source
- Documentation
- Security
- Testing
- Troubleshooting
- Health
- Evidence
- Integration

---

## 6. HẠNG MỤC 05 — MASTER KNOWLEDGE CHECKLIST

### 6.1. Trạng thái

Mỗi skill theo dõi bằng:

```text
□ Chưa học
□ Đang học
□ Hiểu
□ Làm được
□ Debug được
```

### 6.2. Linux checklist

Phải có:

- terminal/shell;
- filesystem;
- `/`, `~`, `.`, `..`;
- absolute/relative path;
- hidden files;
- `pwd`, `ls`, `cd`, `mkdir`, `touch`, `cat`, `cp`, `mv`, `rm`;
- redirection;
- permission;
- ownership;
- `chmod`;
- process/PID;
- `ps`, `top`, `kill`;
- services/systemd;
- logs;
- `grep`, `tail`;
- disk/RAM.

### 6.3. Networking checklist

- client/server;
- IP;
- hostname;
- DNS;
- port;
- TCP;
- bind/listen;
- localhost;
- 127.0.0.1;
- 0.0.0.0;
- `ss`;
- `curl`;
- refused;
- timeout;
- DNS failure;
- port conflict.

### 6.4. Git/Open Source checklist

- working tree/staging/commit;
- branch/merge/conflict;
- remote/fetch/pull/push;
- Issue;
- PR;
- Review;
- branch protection;
- CODEOWNERS;
- README;
- LICENSE;
- CHANGELOG;
- CONTRIBUTING;
- `.gitignore`;
- `.env.example`;
- tag/release;
- dependency/license awareness;
- no secret.

### 6.5. Docker checklist

- image/container;
- Dockerfile;
- layer;
- build context;
- registry;
- build/run/exec/logs/inspect;
- ports;
- volumes;
- networks;
- Compose;
- env;
- healthcheck;
- dependency;
- persistence.

### 6.6. Identity checklist

- realm;
- client;
- users;
- roles;
- OIDC;
- OAuth2 enough-to-use;
- Authorization Code + PKCE;
- JWT;
- JWKS;
- claims;
- SSO;
- RBAC;
- 401;
- 403;
- export/import realm.

### 6.7. Support SV2 checklist

- HTTP methods/status;
- request/header/body;
- REST;
- OpenAPI;
- backend request flow;
- PostgreSQL schema/table/row/column;
- PK/FK/constraint/index;
- SQL basic;
- connection string;
- migration;
- seed;
- n8n/workflow;
- webhook;
- retry;
- idempotency;
- correlation;
- audit;
- Metabase;
- read-only reporting;
- backup/restore.

### 6.8. Support SV3 checklist

- Browser integration;
- CORS/proxy awareness;
- Qdrant;
- Ollama;
- RAG architecture;
- RAG dependency debug;
- Agent tools;
- Agent auth;
- permission boundary;
- DRAFT/PENDING;
- HITL;
- AI red-team.

---

## 6A. CI QUALITY GATE — BỔ SUNG FINAL

### 6A.1. Mục tiêu

CI baseline không phải CI/CD enterprise. Mục tiêu duy nhất:

> SV1 có thể thiết lập, đọc, debug và bảo vệ pipeline cơ bản để code lỗi/config lỗi/secret lỗi không được merge dễ dàng.

Cẩm nang hiện tại đã có CI quality gate, Ruff/mypy/pytest, ESLint/tsc/build và yêu cầu PR lỗi lint bị CI chặn. Bản FINAL khóa chúng thành contract rõ.

### 6A.2. Pipeline baseline

```text
Pull Request
↓
Lint / Type Check
↓
Unit + API tests phù hợp stage
↓
Secret / repository safety scan
↓
docker compose config
↓
Build
↓
PASS
↓
Review
↓
Merge
```

### 6A.3. Trigger

Bắt buộc chạy khi:

- mở/cập nhật Pull Request vào `main`;
- thay đổi source/config ảnh hưởng build/test;
- trước release candidate phải chạy lại full blocking checks.

Push thẳng `main` bị branch protection chặn.

### 6A.4. Blocking checks baseline

#### Backend

```bash
ruff check .
mypy app
pytest -q
```

Tên path/module phải theo repository thật.

#### Portal

```bash
npm run lint
npm run typecheck
npm run build
```

#### Compose

```bash
docker compose config
```

#### API tests

Từ Week 2, API test collection/core API tests trở thành blocking nếu pipeline environment hỗ trợ ổn định.

#### Secret/repository safety

Phải có check không để `.env`, token/password/key nhạy cảm xuất hiện trong commit/PR. Không bắt buộc một sản phẩm secret-scanner enterprise cụ thể; tool lựa chọn phải được ghi trong CI docs.

### 6A.5. Merge policy

Không merge khi một blocking check đỏ.

Ngoại lệ chỉ được chấp nhận nếu:

- check được chứng minh false-positive;
- có Issue/decision record;
- reviewer/GVHD phù hợp chấp thuận;
- không làm giảm security/release gate.

Không dùng “merge trước sửa sau” cho P0.

### 6A.6. Failure ownership

```text
Lint/type/unit failure trong module
→ module owner sửa.

Compose/network/env/CI workflow failure
→ SV1 owner.

API business test failure
→ SV2 owner.

Portal build/source failure
→ SV3 owner.

AI service build/config failure
→ SV3 functional + SV1 infra triage.
```

SV1 chịu trách nhiệm pipeline hoạt động và phân loại failure, không mặc định sửa source của module khác.

### 6A.7. Failure evidence

Mỗi CI failure đáng chú ý phải lưu:

```text
Failed check:
Commit/PR:
First relevant error:
Layer:
Owner:
Fix:
Re-run result:
```

### 6A.8. PASS condition

CI Gate PASS khi:

- PR lỗi lint bị chặn;
- Compose invalid bị chặn;
- build fail bị chặn;
- secret/config safety check hoạt động;
- branch protection ngăn direct main;
- SV1 có thể đọc log CI, xác định owner và sửa pipeline/config nếu lỗi thuộc SV1.

---

## 7. HẠNG MỤC 06 — MASTER SYSTEM MAP

### 7.1. Service table

| Service | Owner chính | Port tham chiếu | SV1 level |
|---|---|---:|---:|
| Portal | SV3 | 3000 | integration L1–2 |
| Backend | SV2 | 8000 | integration/auth L3–4 |
| PostgreSQL | SV2 | 5432 internal | connectivity L3–4 / backup L4 |
| Keycloak | SV1 | 8080 | L4 |
| n8n | SV2 | 5678 | infra/integration L2–3 |
| Metabase | SV2 | 3001 host reference | L2–3 |
| Qdrant | SV3 functional / SV1 infra | 6333 | L3 infra |
| Ollama | SV3 functional / SV1 infra | 11434 | L3 infra |
| RAG Service | SV3 | project-defined | L3 infra |
| Agent Service | SV3 | project-defined | L3 integration / L3–4 security |
| Reverse Proxy | SV1 | project-defined / 80/443 nếu dùng | L3–4 |

### 7.2. SV1 phải biết với mỗi service

```text
purpose
owner
hostname
internal port
host port
network
depends_on
callers
callees
env
auth
health
logs
volume
blast radius
```

### 7.3. Internal vs external URL

Container:

```text
postgres:5432
backend:8000
qdrant:6333
ollama:11434
```

Browser:

```text
localhost:<published-port>
hoặc domain/proxy URL
```

Rule:

```text
localhost inside container
=
container itself
```

---

## 7A. OBSERVABILITY BASELINE — BỔ SUNG FINAL

### 7A.1. Phạm vi

Không thêm Prometheus/Grafana/ELK chỉ để “trông chuyên nghiệp”.

Observability baseline của SV1 chỉ cần trả lời được:

```text
Service
├── status
├── health
├── logs
├── CPU/RAM
├── disk
├── ports
└── dependencies
```

### 7A.2. Service Health Matrix

SV1 duy trì bảng tối thiểu:

| Service | Running | Health | Port | Dependency | Last relevant error | CPU/RAM note | Owner |
|---|---|---|---|---|---|---|---|
| Portal |  |  |  | Backend/Keycloak |  |  | SV3 |
| Backend |  |  |  | PostgreSQL/Identity |  |  | SV2 |
| PostgreSQL |  |  |  | volume/storage |  |  | SV2 |
| Keycloak |  |  |  | config/storage |  |  | SV1 |
| n8n |  |  |  | Backend/contracts |  |  | SV2 |
| Metabase |  |  |  | PostgreSQL |  |  | SV2 |
| Qdrant |  |  |  | volume |  |  | SV3/SV1 infra |
| Ollama |  |  |  | model/resources |  |  | SV3/SV1 infra |
| RAG |  |  |  | Qdrant/Ollama |  |  | SV3 |
| Agent |  |  |  | RAG/Backend |  |  | SV3 |

Không cần cập nhật bảng theo giây. Dùng trước demo, khi incident và khi fresh-machine.

### 7A.3. Evidence commands

```bash
docker compose ps
docker compose logs --tail=100 SERVICE
docker stats --no-stream
ss -lntp
free -h
df -h
```

Nếu image có health details:

```bash
docker inspect CONTAINER
```

### 7A.4. Resource baseline

SV1 ghi resource snapshot ở ba thời điểm:

1. stack vừa khởi động;
2. demo transaction/workflow bình thường;
3. AI inference/RAG/Agent.

Không tự đặt ngưỡng CPU/RAM “chuẩn” nếu chưa đo. Mục tiêu là biết baseline của chính project và nhận ra bất thường/OOM/disk pressure.

### 7A.5. Running vs Healthy vs Functional

```text
RUNNING
= process chính chưa exit.

HEALTHY
= healthcheck đang pass.

FUNCTIONAL
= use case/smoke/E2E thật sự pass.
```

Ba trạng thái không đồng nghĩa.

### 7A.6. Log inspection rule

SV1 phải biết:

- xem log service đúng;
- tìm first relevant error;
- dùng timestamp/correlation ID;
- không paste raw secret/token vào Issue;
- thu evidence trước khi restart nếu có thể.

### 7A.7. PASS condition

Observability PASS khi SV1 có thể nhìn Service Health Matrix và trong vài phút xác định service nào bất thường, health/log/resource/port/dependency evidence nào cần lấy tiếp, mà không cần monitoring enterprise.

---

## 8A. WEEKLY QUALITY LOOP — BỔ SUNG FINAL

Mỗi tuần dùng cùng một vòng:

```text
LEARN
→ PRACTICE
→ BUILD
→ BREAK
→ DEBUG
→ EVIDENCE
→ GATE
```

Mỗi sprint phải trả lời đủ:

1. SV1 học gì?
2. SV1 phải tự làm được gì?
3. Build/capability nào được thêm?
4. Failure nào bị cố tình tạo?
5. Debug theo protocol nào?
6. Evidence nào chứng minh?
7. Definition of Done?
8. Nếu FAIL thì quay lại block nào?

Không qua tuần chỉ vì “đã học đủ số ngày”.

---

## 8. HẠNG MỤC 07 — BẢN ĐỒ 8 TUẦN

| Tuần | Sprint | SV1 trọng tâm |
|---|---|---|
| 1 | Bootstrapping | Linux, Network, Git/Open Source, Compose baseline |
| 2 | Data/API Core | Docker/Compose L4, HTTP/API/Postgres support, reverse proxy/network/env |
| 3 | Human Space | Keycloak/OIDC/JWT/RBAC |
| 4 | Process I | System Integration + n8n/HITL |
| 5 | Process/Data II | Operations, BI, backup/restore |
| 6 | RAG Assistant | Qdrant/Ollama/RAG infra |
| 7 | Agent + HITL | Agent/tool auth/security |
| 8 | Integration & Mock | Regression, fresh-machine, docs, release |

Version progression:

```text
W1 v0.1
W2 v0.2
W3 v0.3
W4 v0.4
W5 v0.5
W6 v0.6
W7 v0.7
W8 v0.9
```

---

## 9. HẠNG MỤC 08 — WEEK 1 FINAL CORRECTION

### 9.1. Giữ nguyên

- Linux;
- Networking;
- Git;
- GitHub/Open Source;
- troubleshooting fundamentals.

### 9.2. Sửa

Week 1 phải có Docker/Compose operational baseline.

### 9.3. Week 1 target

```text
Linux/Network/Git → L2–3
Docker concept → L1–2
Compose operation → L2
Troubleshooting → L2
```

### 9.4. Commands baseline

```bash
docker --version
docker compose version
docker run --rm hello-world
docker compose config
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 backend
curl -fsS http://localhost:8000/health
```

### 9.5. Failure injection

- port conflict;
- `.env` staged;
- Backend unhealthy;
- PostgreSQL not ready;
- permission/process/network basics.

### 9.6. Hard gate

Không qua W2 nếu:

- chưa hiểu path;
- chưa hiểu process/port;
- vẫn push main;
- chưa hiểu `.env` secret;
- chưa biết `compose ps/logs`.

---

## 10. HẠNG MỤC 09 — WEEK 2 FULL DETAIL

### 10.1. Mục tiêu

```text
Docker / Compose / Network / Volume / Env / Health
→ L4

HTTP / REST / OpenAPI
→ L3

PostgreSQL
→ L2–3

Reverse Proxy
→ L2–3
```

### 10.2. Docker mental model

```text
Dockerfile
↓ build
Image
↓ run
Container
```

Phải biết:

- image;
- container;
- registry;
- Dockerfile;
- base image;
- layer;
- build context;
- `.dockerignore`;
- CMD/ENTRYPOINT concept.

### 10.3. Docker Network

```text
Backend container
→ Docker DNS
→ postgres
→ PostgreSQL:5432
```

Không dùng:

```text
localhost:5432
```

từ Backend container.

### 10.4. Volume

```text
Container lifecycle
≠
Data lifecycle
```

Phải chứng minh PostgreSQL data tồn tại qua container recreate.

### 10.5. Environment

```text
.env.example
→ .env
→ Compose
→ Container env
→ App
```

Phải debug:

- missing variable;
- typo;
- wrong hostname;
- wrong port;
- wrong secret.

### 10.6. Healthcheck

Phải hiểu:

```text
running
≠
healthy
≠
business works
```

Các field:

- `test`
- `interval`
- `timeout`
- `retries`
- `start_period`

### 10.7. HTTP/API/Postgres support

- methods/status;
- headers/body;
- JSON;
- OpenAPI/Swagger;
- `curl`;
- DB connection string;
- migration;
- seed;
- `pg_isready`;
- `psql`.

### 10.8. Failure injection

- wrong DB hostname;
- wrong port;
- wrong password;
- network mismatch;
- missing env;
- volume error;
- healthcheck fail;
- missing migration.

---

## 11. HẠNG MỤC 10 — WEEK 3 IDENTITY

### 11.1. Core

```text
Authentication
Authorization
OAuth2 enough-to-use
OIDC
Authorization Code + PKCE
JWT
JWKS
SSO
RBAC
```

### 11.2. Keycloak model

```text
Realm: dx-lab
├── Client: dx-portal
├── Roles
│   ├── admin
│   ├── manager
│   ├── sales
│   └── warehouse
└── Demo users
```

### 11.3. JWT

Phải hiểu:

```text
header
payload
signature

sub
iss
aud
azp
exp
roles
```

Rule:

```text
decode
≠
validate
```

### 11.4. Debug 401

```text
Authorization header
→ token
→ exp
→ iss
→ aud/azp
→ signature/JWKS
→ clock
```

### 11.5. Debug 403

```text
valid token
→ role claim
→ mapper
→ role assignment
→ Backend guard
```

### 11.6. Security

- no wildcard redirect rộng;
- no raw token log;
- no frontend role as security authority;
- Backend is real enforcement boundary.

---

## 12. HẠNG MỤC 11 — WEEK 4 PROCESS / SYSTEM INTEGRATION

### 12.1. Workflow concepts

- trigger;
- state;
- transition;
- condition;
- action;
- webhook;
- approval;
- retry;
- idempotency;
- audit.

### 12.2. n8n integration

Rule:

```text
n8n
→ Backend API
→ Business Rules
→ PostgreSQL
```

Hạn chế:

```text
n8n → arbitrary multi-table writes
```

### 12.3. Required trace IDs

```text
correlation_id
business_id
idempotency_key
```

### 12.4. HITL

```text
DRAFT/PENDING
↓
Manager
↓
APPROVED/REJECTED
↓
workflow continues
```

### 12.5. Integration extensions

SV1 học thêm:

- reverse proxy;
- upstream;
- 502;
- 504;
- CORS;
- browser vs curl;
- internal/external URLs.

### 12.6. Failure injection

- webhook inactive;
- wrong API URL;
- DNS error;
- expired credential;
- 401/403;
- timeout;
- duplicate event;
- missing correlation ID.

---

## 13. HẠNG MỤC 12 — WEEK 5 OPERATIONS / BI / BACKUP

### 13.1. Metabase

```text
PostgreSQL
↓
read-only reporting user
↓
Metabase
↓
KPI
```

Six baseline KPIs:

- revenue;
- order count;
- customer count;
- top products;
- low-stock;
- pending approvals.

### 13.2. Backup

Example official pattern:

```bash
docker compose exec -T postgres \
  pg_dump -U dxlab -Fc dxlab > backup.dump

sha256sum backup.dump
```

### 13.3. Restore

```text
backup
→ new test DB/volume
→ restore
→ migration if required
→ smoke
→ row-count compare
```

Không restore test đè DB đang dùng.

### 13.4. Operations

Phải có:

- start/stop;
- health;
- logs;
- backup;
- restore;
- common failures;
- recovery;
- rollback/cleanup guidance.

### 13.5. Official drills

- DB down;
- Keycloak down;
- n8n webhook timeout.

---

## 14. HẠNG MỤC 13 — WEEK 6 RAG INFRA

### 14.1. RAG architecture

```text
Document
→ Chunk
→ Embedding
→ Qdrant
→ Retrieval
→ Context
→ Ollama/LLM
→ Answer + Sources
```

### 14.2. Qdrant

SV1 L3 infra:

- container;
- port 6333;
- Docker network;
- QDRANT_URL;
- collection;
- vector/payload concept;
- volume;
- persistence;
- logs;
- health/reachability.

### 14.3. Ollama

SV1 L3 infra:

- port 11434;
- model;
- model pull;
- model storage;
- API;
- CPU/RAM/GPU awareness;
- logs.

Important:

```text
Ollama service healthy
≠
required model exists
```

### 14.4. RAG debug boundary

SV1 handles:

- service down;
- wrong URL;
- DNS;
- collection missing;
- model missing;
- resource issue.

SV3 handles:

- chunk quality;
- retrieval strategy;
- prompt;
- AI answer quality.

---

## 15. HẠNG MỤC 14 — WEEK 7 AGENT / SECURITY

### 15.1. Tool calling

```text
Agent
→ Tool Selection
→ Tool Schema
→ Args Validation
→ Backend API
```

No arbitrary SQL tool.

### 15.2. Read tool

Baseline:

```text
get_low_stock_products(...)
```

Must:

- auth;
- role;
- arg validation;
- row limit;
- audit.

### 15.3. Write tool

Baseline:

```text
create_purchase_request(...)
```

Must force:

```text
source=AI
status=DRAFT/PENDING
```

No approve tool.

### 15.4. HITL

```text
Agent proposal
→ user confirm
→ PENDING
→ Manager approve
→ workflow
```

### 15.5. Red-team cases

- ignore rules;
- self approve;
- secret extraction;
- SQL;
- huge quantity;
- malicious retrieved text;
- Sales calling Manager capability;
- expired token;
- timeout;
- malformed tool output.

Success criteria:

```text
0 HITL/RBAC bypass
0 secret exposure
Critical/High fixed + regression
```

---

## 15A. SECURITY CLOSURE — BỔ SUNG FINAL

### 15A.1. Mục tiêu

Không biến roadmap thành khóa cybersecurity. Mục tiêu là SV1 bảo vệ architecture và release khỏi các lỗi security thực dụng có khả năng xảy ra trong DX-Lab.

### 15A.2. Threat model ngắn

SV1 phải lập bảng:

| Asset / Boundary | Threat thực dụng | Control | Evidence |
|---|---|---|---|
| Git repository | secret commit | `.gitignore`, CI/secret check, review | CI/PR |
| Keycloak | redirect/role/token config sai | narrow redirect, JWT validation, RBAC tests | auth tests |
| Backend | bypass authorization | server-side RBAC | 401/403/200 matrix |
| PostgreSQL | public exposure/credential leak | internal network, strong env secret | Compose/env review |
| n8n | exported credential / unauthorized webhook | env credentials, restricted access | workflow export review |
| Backup | sensitive dump copied/public | out of Git, restrictive file/storage access | backup runbook |
| Qdrant | public collection | internal network | port/network review |
| Ollama | unauthenticated Internet exposure | internal/localhost unless explicitly designed | Compose review |
| AI corpus | secret/PII ingestion | corpus review/manifest | ingestion report |
| Agent tools | privilege escalation/self-approve | Backend auth/RBAC, pending-only, HITL | red-team report |

### 15A.3. Public/Internal Service Boundary

Baseline theo cẩm nang:

- PostgreSQL `5432`: Docker network; host mapping chỉ khi dev cần.
- Qdrant `6333`: Docker network/admin; không để collection public.
- Ollama `11434`: Docker network/localhost; không mở Internet không xác thực.
- n8n: admin/team; không public giao diện/quản trị không cần thiết.
- Metabase: Manager/team, reporting user read-only.
- Portal/Keycloak/Backend exposure phải theo demo/proxy design đã freeze.

### 15A.4. Secret handling

Rules:

```text
real secret
→ .env / CI secret / protected runtime config
→ never commit
→ never paste in Issue/docs/screenshots
```

Browser chỉ nhận những biến được chủ đích công khai.

### 15A.5. Secret exposure/rotation runbook

Nếu secret lộ:

```text
1. Xác định secret + consumers.
2. Revoke/rotate trước.
3. Cập nhật runtime/config hợp lệ.
4. Restart/redeploy service phụ thuộc nếu cần.
5. Verify old secret không còn dùng được.
6. Scan repo/log/docs cho bản sao.
7. Nếu đã commit public: lên kế hoạch cleanup history được review; rotation vẫn là bước ưu tiên.
8. Ghi incident + prevention.
```

Không coi “xóa dòng ở commit mới” là đã xử lý secret leak.

### 15A.6. Demo credentials

- demo users/password phải được nhận diện rõ là demo;
- không dùng chung credential thật của cá nhân;
- không dùng admin/root credential cho workflow/reporting khi không cần;
- demo credentials có thể document theo policy team nếu cố ý public và không dùng ngoài demo.

### 15A.7. Backup protection

Backup có thể chứa dữ liệu nhạy cảm.

Minimum:

- không commit Git;
- lưu nơi chỉ team được phép truy cập;
- permission file hạn chế phù hợp;
- không gửi backup vào Issue/chat công khai;
- verify delete/retention theo policy lab.

Encryption có thể bổ sung nếu requirement/threat model cần, nhưng không bắt buộc thêm tool mới chỉ để hoàn thiện roadmap.

### 15A.8. AI corpus safety

Trước ingest:

- loại secret;
- loại PII không cần thiết;
- loại file tạm;
- xác nhận source/version/access_roles;
- manifest/checksum;
- review retrieved text như dữ liệu, không phải instruction đáng tin.

### 15A.9. Agent security

```text
Agent
→ controlled tool
→ Backend Authentication
→ Backend Authorization
→ validation
→ DRAFT/PENDING
→ Human Approval
```

Agent không là superuser và không có đường approve trực tiếp.

### 15A.10. PASS condition

Security Closure PASS khi:

- trust/public/internal boundaries document;
- no secret exposure;
- rotation runbook tồn tại;
- 401/403/RBAC matrix pass;
- DB/Qdrant/Ollama không expose dư thừa;
- backup handling được kiểm;
- AI corpus safety được kiểm;
- Agent red-team có 0 HITL/RBAC bypass và 0 secret exposure.

---

## 15B. CONFIGURATION FREEZE — BỔ SUNG FINAL

### 15B.1. Freeze point

**Configuration Freeze bắt đầu: 05/10/2026 — đầu Week 8.**

Mọi configuration contract bắt buộc phải được khóa chậm nhất **04/10/2026 — hết Week 7**.

Freeze không có nghĩa “không bao giờ được sửa”. Nó nghĩa:

> Sau freeze, mọi thay đổi config/interface đi qua Issue → impact analysis → PR → regression → docs update.

### 15B.2. Những gì phải freeze

```text
service inventory
owner
image/version
internal port
host port
hostname/service name
Docker network
volume
healthcheck
environment contract
auth contract
dependencies
public/internal URL
reverse proxy routes nếu dùng
exact API contract source
Keycloak realm/client/roles
workflow export versions
Qdrant collection/config
Ollama + embedding model
RAG/Agent ports
backup retention/location
CI pipeline
```

### 15B.3. Source of Truth

| Contract | Source of truth |
|---|---|
| Services/images/networks/volumes/ports | `docker-compose.yml` |
| Environment contract | `.env.example` |
| Real local secrets | `.env` / protected runtime secret — không commit |
| Backend API | generated OpenAPI `/docs`/OpenAPI artifact |
| Identity | Keycloak realm export + identity docs |
| Workflow | versioned n8n JSON exports + workflow docs |
| DB schema | migrations + ERD/database docs |
| AI models/URLs | `.env.example` + AI docs + Compose |
| CI | repository CI workflow |
| Release | Git tag + CHANGELOG + release notes |
| Demo | versioned demo script |

### 15B.4. Freeze checklist

- [ ] no service owner unknown;
- [ ] no port TBD;
- [ ] no hostname TBD;
- [ ] no health endpoint TBD;
- [ ] no required env unnamed;
- [ ] no API contract “theo miệng”;
- [ ] no AI model unspecified;
- [ ] no backup retention unspecified;
- [ ] CI blocking checks known;
- [ ] docs/config/tests agree.

### 15B.5. Unresolved item rule

Nếu trước deadline còn chưa quyết định:

```text
Issue
Owner
Decision deadline
Options
Impact
Source of truth after decision
```

P0 item không được bước vào release candidate khi còn TBD.

### 15B.6. PASS condition

Configuration Freeze PASS khi một thành viên có thể dùng service inventory + Compose + `.env.example` + docs để trả lời chính xác hostname/port/network/env/auth/health/dependency của mọi service cần cho release.

---

## 16. HẠNG MỤC 15 — WEEK 8 INTEGRATION / RELEASE

### 16.1. Regression

Order:

```text
reset/seed
→ static
→ unit
→ API
→ workflow
→ E2E
```

Main E2E:

```text
SSO
→ create order
→ approval
→ dashboard
→ Copilot
→ create PR
→ approval
```

Phải pass 3 lần liên tiếp.

### 16.2. Fresh-machine

```text
clean machine
→ clone
→ .env
→ Compose
→ imports
→ migration
→ seed
→ AI bootstrap
→ smoke
→ E2E
→ restart
→ restore
```

Requirements:

- không sửa source/path thủ công;
- ready ≤15 phút (không tính tải model đầu);
- pass ≥2 máy.

### 16.3. Release

- tag `v0.9`;
- CHANGELOG;
- release notes;
- checksum;
- realm export;
- workflow exports;
- dashboard exports;
- zero Critical;
- ≥80/100 internal acceptance.

### 16.4. Demo

SV1 chịu các phần:

- architecture;
- Compose health;
- SSO overview;
- audit/correlation;
- ops/Q&A.

---

## 17. HẠNG MỤC 16 — MASTER TROUBLESHOOTING GUIDE

### 17.1. Protocol

```text
SYMPTOM
↓
EVIDENCE
↓
HYPOTHESIS
↓
TEST
↓
RESULT
↓
ROOT CAUSE
↓
FIX
↓
VERIFICATION
↓
REGRESSION
```

### 17.2. Layer tree

```text
User Symptom
↓
Browser/URL
↓
Proxy
↓
Container
↓
Process
↓
Port
↓
Healthcheck
↓
DNS
↓
Docker Network
↓
Environment
↓
Authentication
↓
Authorization
↓
API
↓
DB
↓
Workflow
↓
AI dependencies
↓
Logs
↓
Resources
```

### 17.3. Symptom → first checks

| Symptom | First checks |
|---|---|
| URL unavailable | curl / ss / compose ps |
| Container exited | logs |
| unhealthy | inspect health/logs |
| refused | process/listen/port |
| timeout | route/upstream/resource |
| API→DB fail | DATABASE_URL/DNS/pg_isready |
| 401 | iss/aud/exp/JWKS/clock |
| 403 | role/matrix/guard |
| n8n duplicate | idempotency/retry |
| KPI wrong | SQL/filter/timezone |
| RAG fail | Qdrant/Ollama/env |
| Agent 403 | token/role/tool permission |

### 17.4. Golden rules

- evidence before fix;
- one hypothesis at a time;
- no random restart;
- no delete volume reflex;
- no disabling JWT/RBAC;
- no random port changes;
- verify after fix;
- regression;
- update docs/runbook.

---

## 18. HẠNG MỤC 17 — MOCK EXAM

### 18.1. Blueprint

| Section | Content |
|---|---|
| A | 50 theory |
| B | 20 troubleshooting scenarios |
| C | 10 architecture |
| D | 5 Docker incidents |
| E | 5 Keycloak/OIDC/JWT/RBAC incidents |
| F | 5 SV1–SV2 integration |
| G | 5 AI infra incidents |
| H | Fresh-machine challenge |
| I | Change requests |
| J | Oral defense |

### 18.2. Pass philosophy

Không chấm chỉ “biết đáp án”.

Mỗi incident cần:

```text
Evidence
Hypotheses
Test order
Layer
Owner
Fix
Verification
```

### 18.3. Representative challenge

#### Backend port change

Phải audit:

```text
backend listen
Compose
healthcheck
proxy
Portal API config
n8n
Agent tools
tests
docs
```

#### Add Accountant

Phải audit:

```text
Keycloak
token role
Backend RBAC
workflow
Portal integration awareness
tests
demo users
docs
```

---

## 19. HẠNG MỤC 18 — FINAL GRADUATION / PASS

### 19.1. Core

SV1 phải pass:

- Linux L4;
- Networking L4;
- Git/Open Source L4;
- Docker/Compose L4;
- Environment/Secrets L4;
- Health/Logs L4;
- Keycloak/OIDC/JWT/RBAC L4;
- Integration L4;
- Troubleshooting L4;
- Deployment/Fresh-machine/Release L4.

### 19.2. Support SV2

Phải có thể:

```text
Backend issue
→ xác định runtime/network/auth/DB
→ nếu business/domain logic
→ handoff SV2 có evidence
```

### 19.3. Support SV3

Phải có thể:

```text
RAG/Agent issue
→ kiểm service/network/env/Qdrant/Ollama/auth
→ nếu prompt/retrieval/reasoning
→ handoff SV3 có evidence
```

### 19.4. Graduation statement

SV1 pass khi:

```text
clean machine + repo
→ deploy được

broken service
→ biết bắt đầu đâu

SV2 blocker
→ support đúng

SV3 AI infra/security blocker
→ support đúng

change role/port/network/service/auth
→ impact analysis được
```

---

## 19A. TEAM READINESS GATE — BỔ SUNG FINAL

SV1 không chỉ pass khi bản thân biết. Team phải đủ khả năng chịu lỗi trong demo/thực chiến.

### 19A.1. Cross-operation

- [ ] SV2 có thể start/health Backend và biết cách báo evidence khi infra lỗi.
- [ ] SV3 có thể start/health các service cần cho Portal/AI và đọc Compose status/log cơ bản.
- [ ] Cả 3 có thể start toàn stack theo runbook.
- [ ] Cả 3 hiểu master end-to-end flow.

### 19A.2. Handoff readiness

- [ ] SV2 biết lúc nào lỗi thuộc SV1.
- [ ] SV3 biết lúc nào lỗi thuộc SV1.
- [ ] SV1 biết lúc nào phải trả root cause cho SV2/SV3.
- [ ] Handoff luôn kèm evidence/reproduction.

### 19A.3. Backup presenter

Cho mỗi phần demo phải có ít nhất một người khác có thể trình bày nếu owner bị kẹt.

Minimum:

```text
Architecture/ops → SV1 primary, 1 backup
Backend/process/data → SV2 primary, 1 backup
Portal/AI/demo → SV3 primary, 1 backup
```

### 19A.4. Time-pressure drills

Team phải luyện:

1. một service chết 10 phút trước demo;
2. một thành viên không biết debug;
3. một change request nhỏ xuất hiện;
4. demo flow fail giữa chừng;
5. Q&A yêu cầu giải thích module không phải owner.

SV1 phải điều phối, không tự lao vào sửa tất cả.

### 19A.5. PASS condition

Team Readiness PASS khi:

- demo không phụ thuộc duy nhất một người;
- owner/handoff rõ;
- incident drill có người lead;
- mock Q&A/time-pressure demo pass;
- cả 3 giải thích được H-P-D-I end-to-end ở mức tổng quan.

---

## 20. HẠNG MỤC 19 — FAILURE-INJECTION PROGRESSION

Failure injection đã được thiết kế tăng dần:

### W1 — Single-layer

- permission;
- process;
- port;
- Git secret/staging;
- Compose unhealthy baseline.

### W2 — Multi-container

- wrong service name;
- DB hostname;
- wrong port;
- wrong password;
- missing env;
- volume;
- healthcheck;
- migration.

### W3 — Identity

- redirect URI;
- token expiry;
- issuer;
- audience;
- role mapper;
- 401/403.

### W4 — Cross-service

- webhook;
- API auth;
- CORS;
- proxy;
- retry/duplicate;
- correlation.

### W5 — Operations/Recovery

- DB down;
- Keycloak down;
- n8n timeout;
- backup/restore;
- reporting permission.

### W6 — AI dependency chain

- Qdrant down;
- collection missing;
- Ollama down;
- model missing;
- RAG env;
- RAM.

### W7 — Security

- Agent 401/403;
- privilege escalation;
- self approve;
- secret;
- SQL;
- duplicate write.

### W8 — Unknown incident

Không báo trước layer.

---

## 21. HẠNG MỤC 20 — OPEN SOURCE WORKFLOW XUYÊN 8 TUẦN

Mọi task thật:

```text
Issue
→ Branch
→ Change
→ Test
→ Evidence
→ Commit
→ Push
→ PR
→ Review
→ Merge
```

### Repository requirements

- public repo;
- LICENSE;
- README;
- CHANGELOG;
- CONTRIBUTING;
- `.gitignore`;
- `.env.example`;
- Issue/PR history;
- release/tag;
- build-from-source instructions.

### Không được

- push thẳng main;
- commit `.env`;
- commit token/password;
- chỉ upload code vào cuối kỳ;
- release không version;
- docs lệch source.

---

## 22. HẠNG MỤC 21 — SV1 ↔ SV2 HANDOFF BOUNDARY

### 22.1. SV1 support

Backend/DB/n8n blocker:

```text
process?
health?
network?
DNS?
port?
env?
auth?
DB?
migration?
logs?
```

### 22.2. SV2 owner

Nếu evidence chỉ ra:

- business rule;
- domain validation;
- service-layer logic;
- schema/domain design;
- API business correctness;
- workflow business state machine.

SV1 handoff.

### 22.3. Handoff format

```text
Symptom:
Evidence:
Infra checks:
Auth checks:
DB checks:
Reproduction:
Likely layer:
Owner:
Correlation ID:
Expected:
Actual:
```

---

## 23. HẠNG MỤC 22 — SV1 ↔ SV3 HANDOFF BOUNDARY

### 23.1. SV1 support AI infra

```text
service running?
health?
network?
DNS?
env?
Qdrant?
collection?
Ollama?
model?
Backend tool reachable?
auth/RBAC?
```

### 23.2. SV3 owner

Nếu infra pass nhưng:

- chunking kém;
- retrieval quality;
- prompt;
- model response quality;
- Agent reasoning;
- UI/UX/frontend state.

Handoff SV3.

### 23.3. Frontend boundary

```text
React/Next.js/CSS coding = L0 SV1
Browser integration awareness = L1–2
```

---

## 24. HẠNG MỤC 23 — FRESH-MACHINE + RELEASE

### 24.1. Fresh-machine must prove

```text
README/install docs
+
Compose
+
.env.example
+
imports/migration/seed
+
smoke tests
=
reproducible system
```

### 24.2. Required checks

- clone from public repo;
- no source edit;
- no absolute personal path;
- no missing secret/config instructions;
- all required services;
- realm import;
- workflows import;
- dashboard import/config;
- Qdrant/Ollama/RAG/Agent bootstrap;
- restart;
- persistence;
- restore.

### 24.3. Release package

- tag;
- CHANGELOG;
- release notes;
- checksum;
- exports;
- docs version;
- known issues;
- acceptance report.

---

## 25. HẠNG MỤC 24 — DOCUMENTATION GOVERNANCE

### 25.1. Official/core docs

```text
README.md
LICENSE
CHANGELOG.md
CONTRIBUTING.md
.env.example

docs/architecture.md
docs/installation.md
docs/operation.md
docs/database.md
docs/api.md
docs/workflow.md
docs/ai.md
docs/troubleshooting.md
docs/demo-script.md
```

### 25.2. Suggested SV1 extensions

Tên file có thể thay đổi:

```text
docs/environment.md
docs/identity.md
docs/security.md
docs/deployment.md
docs/backup-restore.md
docs/ai-infrastructure.md
```

### 25.3. Review rules

Mỗi command phải nói:

- chạy ở directory nào;
- expected output;
- cleanup/rollback;
- ảnh hưởng data;
- env/port assumptions.

Một người **không viết phần đó** phải thử theo docs.

---

## 26. HẠNG MỤC 25 — CHANGE REQUEST / IMPACT ANALYSIS

### 26.1. Model

```text
CHANGE
↓
DIRECT SERVICE
↓
UPSTREAM CALLERS
↓
DOWNSTREAM DEPENDENCIES
↓
ENV/CONFIG
↓
AUTH
↓
TESTS
↓
DOCS
↓
RELEASE
```

### 26.2. Backend port example

```text
Backend port
├── application listen
├── Dockerfile/runtime
├── Compose
├── healthcheck
├── proxy
├── Portal API URL
├── n8n URLs
├── Agent tools
├── tests
└── docs
```

### 26.3. Role example

```text
New Accountant Role
├── Keycloak
├── token mapper
├── Backend RBAC
├── workflow
├── Portal visibility/integration
├── test matrix
└── docs/demo users
```

### 26.4. AI model example

```text
OLLAMA_MODEL
├── env
├── pull/bootstrap
├── storage
├── RAM
├── RAG
├── Agent
├── smoke test
└── docs
```

---

## 27. HẠNG MỤC 26 — AGENT SECURITY BOUNDARY

### 27.1. Core principle

```text
AI
≠
SUPERUSER
```

### 27.2. Security chain

```text
User Identity
↓
Agent
↓
Tool Schema
↓
Args Validation
↓
Backend Authentication
↓
Backend Authorization
↓
Permission Boundary
↓
DRAFT/PENDING
↓
Human Approval
↓
Workflow
```

### 27.3. Forbidden shortcuts

```text
Agent → direct unrestricted DB write
Agent → arbitrary SQL
Agent → self approve
Agent → bypass Backend RBAC
Agent → expose secrets
```

### 27.4. Audit

Must record:

- actor;
- tool;
- sanitized args;
- result summary;
- timestamp;
- correlation ID;
- latency where useful.

---

## 28. HẠNG MỤC 27 — MASTER H-P-D-I END-TO-END TRACE

### 28.1. H — Human

```text
User
→ Keycloak
→ Identity
→ Role
→ JWT
```

### 28.2. P — Process

```text
Business event
→ n8n
→ condition/state
→ approval
→ workflow continuation
```

### 28.3. D — Data

```text
Backend
→ PostgreSQL
→ source of truth
→ Metabase/reporting
```

### 28.4. I — Intelligence

```text
Qdrant + Ollama
→ RAG
→ Agent
→ controlled tools
```

### 28.5. Closed loop

```text
User
→ Browser
→ Portal
→ Keycloak
→ OIDC
→ JWT
→ Backend API
→ PostgreSQL
→ n8n
→ Metabase / RAG / Agent
→ Agent Tool
→ Backend API
→ DRAFT/PENDING
→ Human Approval
→ Workflow
→ PostgreSQL
→ Dashboard
```

SV1 phải biết trên **mỗi mũi tên**:

```text
hostname?
port?
network?
auth?
env?
health?
logs?
```

---

## 29. HẠNG MỤC 28 — KIỂM TRA 3 VÒNG CONSISTENCY / COMPLETENESS

### 29.1. Vòng 1 — Source alignment

Đã kiểm:

- W2 đúng Data/API;
- W3 đúng Identity;
- W4 đúng n8n/HITL;
- W5 đúng BI/backup/ops;
- W6 đúng RAG;
- W7 đúng Agent/security;
- W8 đúng integration/release.

Các output chính thức được giữ:

- ≥10 API endpoints;
- 4 roles/users;
- 3 workflows;
- 6 KPI;
- 10–20 RAG test questions;
- ≥2 tools;
- v0.9;
- fresh-machine ≥2 máy;
- ≤15 phút không tính first model pull;
- 0 Critical.

### 29.2. Vòng 2 — Structural completeness

Đã có đầy đủ:

- role;
- levels;
- dependencies;
- knowledge checklist;
- system map;
- 8-week map;
- W1–W8;
- troubleshooting;
- failure injection;
- mock exam;
- final pass;
- Open Source;
- fresh-machine/release;
- docs;
- team lead;
- handoffs.

### 29.3. Vòng 3 — Role-boundary consistency

Đã kiểm:

```text
SV1 Core L4
→ không bị giảm

SV2 Backend/P/D ownership
→ không bị chiếm

SV3 AI/UX ownership
→ không bị chiếm

Frontend coding
→ vẫn L0

AI algorithm
→ L1–2

AI infra
→ L3

Agent security
→ L3–4
```

---

## 30. MASTER TROUBLESHOOTING QUICK REFERENCE

### 30.1. Backend cannot connect DB

```text
Backend running?
↓
Backend health?
↓
Postgres running?
↓
Postgres healthy?
↓
same network?
↓
DNS postgres?
↓
port 5432?
↓
DATABASE_URL?
↓
credentials?
↓
DB name?
↓
migration?
↓
logs?
```

### 30.2. Login works but API 401

```text
Bearer token?
↓
exp?
↓
iss?
↓
aud/azp?
↓
signature/JWKS?
↓
clock?
```

### 30.3. Login works but API 403

```text
token valid
↓
role claim
↓
mapper
↓
user assignment
↓
Backend guard
```

### 30.4. RAG fails

```text
RAG process
↓
RAG health
↓
QDRANT_URL
↓
Qdrant
↓
collection
↓
OLLAMA_BASE_URL
↓
Ollama
↓
model
↓
resource
↓
RAG logic
```

### 30.5. Agent tool 403

```text
Agent service
↓
Backend reachable
↓
Authorization header
↓
token
↓
role
↓
endpoint permission
↓
tool boundary
↓
Backend logs
↓
audit
```

---

## 31. MASTER WEEKLY DELIVERABLES

### Week 1

- repository public;
- LICENSE/README/CHANGELOG/CONTRIBUTING;
- `.env.example`;
- Issue/PR templates;
- CODEOWNERS;
- Compose baseline;
- Portal/API/Postgres skeleton;
- environment/container diagram;
- Git evidence.

### Week 2

- ERD;
- ≥10 APIs;
- OpenAPI;
- seed;
- Docker/Compose hardened;
- network/env/health matrix;
- reverse proxy baseline;
- failure report.

### Week 3

- realm export;
- roles/users;
- SSO;
- JWT/RBAC;
- matrix;
- 401/403/expiry evidence.

### Week 4

- two workflows;
- workflow exports;
- sequence diagram;
- test cases;
- correlation/idempotency convention;
- integration report.

### Week 5

- workflow #3;
- Metabase dashboard;
- reporting user;
- backup/restore scripts;
- restore report;
- operations docs.

### Week 6

- corpus/manifest;
- Qdrant collection;
- Qdrant/Ollama deployment;
- RAG endpoint;
- evaluation set/report;
- AI infra docs.

### Week 7

- ≥2 tools;
- Agent workflow;
- DRAFT/PENDING write;
- Manager approval;
- AI audit;
- security/red-team report.

### Week 8

- regression report;
- defect log;
- fresh-machine reports;
- full docs;
- demo script;
- v0.9 release;
- mock OLP report.

---

## 32. HARD “DO NOT OVERLEARN” LIST

SV1 không cần biến roadmap thành khóa học các chủ đề sau nếu không có requirement mới:

```text
Kubernetes
Service Mesh
BGP/OSPF
Kernel internals
Deep cryptography
Full OAuth RFC
HA PostgreSQL
Deep distributed systems
Kafka
Terraform advanced
LLM training
Transformer math
Embedding math
Frontend coding
React course
CSS course
```

---

---

# PHẦN 3 — FINAL 100/100 MATRIX

## 3.1. Cách chấm

Mỗi category:

```text
0 = thiếu
1 = có nhưng yếu
2 = đủ nhưng chưa khóa operational gate
3 = mạnh, có contract/evidence/PASS condition
```

Bản trước audit: **61/72 = 84.7/100**.

Bản FINAL specification: **72/72 = 100/100** vì mọi category dưới đây đã có requirement, evidence và PASS condition.

> 100/100 này chỉ áp dụng cho **độ hoàn thiện của roadmap specification**. Graduation của SV1 vẫn cần evidence thật.

| Category | Current before audit | Required | Final Status | Evidence | PASS condition |
|---|---:|---:|---|---|---|
| Role clarity | 3/3 | 3/3 | ✅ STRONG — retained | Role statement + ownership/RACI + handoff drills | SV1/SV2/SV3 boundary giải thích được; không owner collision |
| Linux | 3/3 | 3/3 | ✅ STRONG — retained | Linux labs + process/permission/port incidents | Tự chẩn đoán local Linux incident bằng evidence |
| Networking | 3/3 | 3/3 | ✅ STRONG — retained | DNS/port/listen/container-network drills | Debug refused/timeout/DNS/hostname đúng layer |
| Git/Open Source | 3/3 | 3/3 | ✅ STRONG — retained | Issue/PR history + branch protection + release | ≥90% task qua PR; no direct main; repo hygiene pass |
| Docker/Compose | 3/3 | 3/3 | ✅ STRONG — retained | Compose stack + failure reports | Tự build/deploy/debug multi-service |
| Environment/Secrets | 2/3 | 3/3 | ✅ LOCKED in FINAL | .env contract + secret incident drill | No secret commit; rotation runbook pass |
| Identity/Security | 2/3 | 3/3 | ✅ LOCKED in FINAL | Keycloak export + 401/403/RBAC + threat model | RBAC matrix 100%; no bypass |
| Backend/API integration awareness | 3/3 | 3/3 | ✅ STRONG — retained | curl/OpenAPI/DB trace/handoff | Triage được infra/auth/DB vs domain |
| Workflow integration | 3/3 | 3/3 | ✅ STRONG — retained | n8n exports + idempotency/correlation evidence | Duplicate-safe; trace by business ID |
| Operations | 2/3 | 3/3 | ✅ LOCKED in FINAL | operation runbook + service health matrix | Start/stop/health/log/resource drill pass |
| Backup/Restore | 3/3 | 3/3 | ✅ STRONG — retained | backup checksum + cross-machine restore | Restore separate target + smoke pass |
| AI infrastructure | 3/3 | 3/3 | ✅ STRONG — retained | Qdrant/Ollama/RAG infra evidence | Deploy/debug dependencies; handoff AI logic đúng |
| Agent security | 3/3 | 3/3 | ✅ STRONG — retained | tool auth matrix + red-team report | 0 HITL/RBAC bypass; no direct approve |
| Troubleshooting | 3/3 | 3/3 | ✅ STRONG — retained | unknown incident reports | Evidence→root cause→verification→regression |
| Observability | 1/3 | 3/3 | ✅ LOCKED in FINAL | Service Health Matrix + resource baseline | Status/health/log/resource/port/dependency evidence đủ |
| Team Lead operation | 2/3 | 3/3 | ✅ LOCKED in FINAL | Issue contract + blocker board + sprint evidence | Lead requirement→DONE không giành module |
| CI/CD baseline | 1/3 | 3/3 | ✅ LOCKED in FINAL | CI workflow + blocked bad PR evidence | Blocking checks chặn merge và SV1 debug được |
| Documentation | 3/3 | 3/3 | ✅ STRONG — retained | peer-reviewed docs + tested commands | Người khác dựng/run theo docs |
| Change management | 2/3 | 3/3 | ✅ LOCKED in FINAL | impact matrix + rollback/test plan | Backend port/role/model change request pass |
| Fresh-machine | 3/3 | 3/3 | ✅ STRONG — retained | ≥2 signed checklists | ≤15 phút excl first model pull; no source edit |
| Release | 3/3 | 3/3 | ✅ STRONG — retained | v0.9 tag + notes + checksum + exports | Release download/deploy pass |
| Competition readiness | 3/3 | 3/3 | ✅ STRONG — retained | Mock OLP + timed demo | 8–12 min demo + must flows pass |
| Oral defense | 2/3 | 3/3 | ✅ LOCKED in FINAL | mock Q&A recordings/score sheet | SV1 explain architecture/security/troubleshooting không nhìn slide |
| Evidence/DoD | 2/3 | 3/3 | ✅ LOCKED in FINAL | Issue/PR/test/evidence trail | No critical task marked DONE without evidence |

## 3.2. Năm category được nâng mạnh nhất

1. **CI/CD baseline:** 1 → 3.
2. **Observability:** 1 → 3.
3. **Team Lead operation:** 2 → 3.
4. **Environment/Secrets + Security Closure:** 2 → 3.
5. **Evidence/DoD + Change management:** 2 → 3.

## 3.3. Rule chống “gian lận 100/100”

Không được mark `PASS` nếu:

- chỉ có section trong docs nhưng chưa có evidence;
- CI tồn tại nhưng không chặn PR lỗi;
- backup tồn tại nhưng chưa restore;
- Keycloak login được nhưng chưa có negative auth tests;
- Agent demo đẹp nhưng bypass HITL;
- fresh-machine chỉ chạy trên máy tác giả;
- service matrix còn TBD;
- demo chỉ chạy khi chỉnh source/path thủ công.

---

# PHẦN 4 — 8-WEEK FINAL PLAN

## 4.0. Universal weekly protocol

```text
LEARN
→ PRACTICE
→ BUILD
→ BREAK
→ DEBUG
→ EVIDENCE
→ GATE
```

Không có evidence = chưa PASS.

## WEEK 1 — FOUNDATION

| Item | FINAL requirement |
|---|---|
| **Goal** | Xây nền Linux/Network/Git/Open Source và vận hành Compose baseline. |
| **Knowledge** | Linux file/permission/process/log; IP/port/DNS/HTTP; Git workflow; image/container/Compose baseline. |
| **Practice** | Linux labs, curl/ss, branch/PR, đọc Compose, hello-world. |
| **Build** | Repo public + Portal/Backend/Postgres skeleton + CI baseline. |
| **Failure drill** | permission/process/port conflict; `.env` staged; Backend unhealthy. |
| **Evidence** | `docker compose ps`, `/health`, PR evidence, CI blocked lint/config failure. |
| **Definition of Done** | Repo hygiene pass; Compose ≥3 services; no secret; mỗi member PR; CI baseline chạy. |
| **Gate / If FAIL** | Nếu FAIL → quay lại Linux/Networking/Git/Compose baseline trước W2. |

## WEEK 2 — DATA/API + DOCKER L4

| Item | FINAL requirement |
|---|---|
| **Goal** | Làm chủ Docker/Compose/network/volume/env/health và support API/Postgres. |
| **Knowledge** | Dockerfile, build, DNS, internal/external port, volumes, healthcheck, HTTP/REST/OpenAPI, migration/seed. |
| **Practice** | Build image; network resolution; persistence lab; curl API; pg_isready/psql. |
| **Build** | v0.2 + ERD + ≥10 API + OpenAPI + deterministic seed + reverse-proxy/network/env baseline. |
| **Failure drill** | wrong DB hostname/port/password; missing env; network mismatch; volume/health/migration fail. |
| **Evidence** | Docker failure report, network/env/health matrix, API collection, DB connectivity proof. |
| **Definition of Done** | Docker/Compose/Network/Env/Health đạt operational L4; API/DB integration pass. |
| **Gate / If FAIL** | Nếu FAIL → quay lại Docker Network/Env/Health/DB connection blocks. |

## WEEK 3 — HUMAN / IDENTITY

| Item | FINAL requirement |
|---|---|
| **Goal** | Khóa Keycloak/OIDC/JWT/SSO/RBAC và security boundary. |
| **Knowledge** | AuthN/AuthZ, OAuth2 enough-to-use, OIDC Code+PKCE, JWT/JWKS, roles, 401/403. |
| **Practice** | Realm/client/users/roles; token inspect; negative auth tests; import/export. |
| **Build** | v0.3 + realm export + 4 roles/users + Portal SSO + Backend token/role guard. |
| **Failure drill** | redirect URI; expired token; issuer/audience; missing role mapper; 401/403. |
| **Evidence** | RBAC matrix, decoded claims, 401/403/200/expiry tests, realm import proof. |
| **Definition of Done** | RBAC matrix 100%; no wildcard redirect rộng; Backend remains real auth boundary. |
| **Gate / If FAIL** | Nếu FAIL → quay lại OIDC/JWT validation hoặc role mapping block. |

## WEEK 4 — PROCESS / SYSTEM INTEGRATION

| Item | FINAL requirement |
|---|---|
| **Goal** | Khóa API↔n8n contract, workflow state, retry/idempotency/HITL và trace cross-service. |
| **Knowledge** | Webhook, state machine, correlation/business/idempotency IDs, retry/backoff, audit, proxy/CORS awareness. |
| **Practice** | Webhook curl; duplicate event; approval role tests; trace one business ID. |
| **Build** | v0.4 + Sales Order workflow + Purchase Request workflow + exports + sequence/test cases. |
| **Failure drill** | webhook inactive; wrong Backend URL; 401/403; timeout; duplicate event; proxy/CORS. |
| **Evidence** | workflow exports, correlation trace, duplicate-safe evidence, approval audit. |
| **Definition of Done** | 2 workflows E2E; retry không duplicate; Sales không approve; export import lại được. |
| **Gate / If FAIL** | Nếu FAIL → quay lại contract/auth/network/idempotency layer. |

## WEEK 5 — OPERATIONS / BI / RECOVERY

| Item | FINAL requirement |
|---|---|
| **Goal** | Biến hệ thống từ 'chạy' thành 'vận hành và phục hồi được'. |
| **Knowledge** | Metabase/reporting, structured logs, Service Health Matrix, backup/restore, resource baseline. |
| **Practice** | Create reporting user; 6 KPI; pg_dump/checksum/restore; DB/Keycloak/n8n incidents. |
| **Build** | v0.5 + workflow #3 + dashboard + backup/restore scripts + operation runbook. |
| **Failure drill** | DB down; Keycloak down; n8n timeout; reporting permission; invalid restore target; disk/resource. |
| **Evidence** | backup hash, restore report, health matrix, resource snapshots, KPI SQL validation. |
| **Definition of Done** | Restore pass trên máy khác; reporting read-only; 3 incidents diagnosed bằng log/health. |
| **Gate / If FAIL** | Nếu FAIL → quay lại DB operations/observability/recovery block. |

## WEEK 6 — RAG / AI INFRA

| Item | FINAL requirement |
|---|---|
| **Goal** | Deploy/debug Qdrant + Ollama + RAG dependencies mà không biến SV1 thành AI algorithm owner. |
| **Knowledge** | RAG pipeline, embedding/vector concepts, Qdrant collection/volume, Ollama model/resources. |
| **Practice** | Qdrant persistence; model list; stop dependency; wrong URL/model/collection drills. |
| **Build** | v0.6 + knowledge base + Qdrant collection + RAG API + 10–20 eval questions. |
| **Failure drill** | Qdrant down/missing collection; Ollama down/model missing; wrong URLs; RAM issue. |
| **Evidence** | AI service health/log evidence, persistence, model bootstrap, RAG dependency report. |
| **Definition of Done** | Services start with Compose; RAG dependency path stable; infra bug vs AI logic handoff đúng. |
| **Gate / If FAIL** | Nếu FAIL → quay lại Qdrant/Ollama/env/resource block. |

## WEEK 7 — AGENT / SECURITY / HITL

| Item | FINAL requirement |
|---|---|
| **Goal** | Khóa tool auth, permission boundary, pending-only writes, HITL, audit và red-team. |
| **Knowledge** | Tool schema, arg validation, service auth, RBAC, idempotency, prompt injection awareness. |
| **Practice** | Read/write tool tests; Sales vs Manager; self-approve attempt; secret/SQL/huge quantity/timeout. |
| **Build** | v0.7 + ≥2 tools + Agent workflow + audit + Manager approval + security report. |
| **Failure drill** | Agent 401/403; wrong role; direct DB attempt; self-approve; duplicate write; malicious retrieved text. |
| **Evidence** | tool/auth matrix, audit trace, red-team severity/fix/regression evidence. |
| **Definition of Done** | 0 HITL/RBAC bypass; 0 secret exposure; Critical/High fixed; write stays DRAFT/PENDING. |
| **Gate / If FAIL** | Nếu FAIL → quay lại Backend security boundary/tool auth/HITL block. |

## WEEK 8 — INTEGRATION / RELEASE

| Item | FINAL requirement |
|---|---|
| **Goal** | Chứng minh reproducibility, security, documentation, release và team readiness. |
| **Knowledge** | Regression, config freeze, fresh-machine, release, docs peer review, change request, oral defense. |
| **Practice** | 3 E2E runs; 2 clean machines; restore; release dry-run; timed demo; unknown incidents. |
| **Build** | DX-Lab Core v0.9 + full docs + release package + mock report + acceptance checklist. |
| **Failure drill** | Unknown incident; configuration drift; import fail; model missing; change request under time pressure. |
| **Evidence** | regression report, 2 fresh-machine reports, config-freeze record, v0.9, mock score, demo timing. |
| **Definition of Done** | Must flows 100%; zero Critical; config freeze complete; ≥2 machines; docs verified; team readiness pass. |
| **Gate / If FAIL** | Nếu FAIL → freeze release, classify defect, return to responsible weekly block and rerun regression. |

## 4.9. Cross-cutting mỗi tuần

Mọi tuần đều phải có:

- Issue/Branch/PR/Review/Merge;
- CI xanh cho blocking checks;
- docs/config update;
- service health evidence;
- failure injection;
- troubleshooting report nếu có incident;
- retrospective blocker/action;
- demo hệ thống thật, không thay bằng slide.

## 4.10. Failure progression locked

```text
W1 process / permission / port
W2 multi-container / network / env
W3 Keycloak / OIDC / JWT / RBAC
W4 cross-service / workflow
W5 backup / restore / recovery
W6 Qdrant / Ollama / model / resource
W7 Agent authorization / HITL
W8 unknown incident
```

Mỗi incident dùng:

```text
SYMPTOM
→ EVIDENCE
→ HYPOTHESIS
→ TEST
→ RESULT
→ ROOT CAUSE
→ FIX
→ VERIFICATION
→ REGRESSION
```

---

# PHẦN 5 — FINAL GRADUATION CHECKLIST

SV1 **chỉ PASS khi các hard gate dưới đây có evidence thật**.

## 5.1. P0 — Role / Leadership

- [ ] Tự biến requirement thành Issue có priority/owner/dependencies/acceptance/evidence/DoD.
- [ ] Board trạng thái đúng; BLOCKED có evidence.
- [ ] Handoff đúng SV2/SV3.
- [ ] Không giành module ownership.
- [ ] Có incident escalation/decision record khi cần.
- [ ] Team Readiness Gate pass.

**Evidence:** Issues/PRs, blocker report, handoff report, mock incident.

## 5.2. P0 — Linux / Networking

- [ ] process/permission/log;
- [ ] IP/port/DNS/listen;
- [ ] refused vs timeout;
- [ ] host vs container localhost;
- [ ] Docker service discovery.

**Evidence:** failure drills + commands/output.

## 5.3. P0 — Git/Open Source / CI

- [ ] public repo;
- [ ] LICENSE/README/CHANGELOG/CONTRIBUTING;
- [ ] branch protection;
- [ ] PR review;
- [ ] CI lint/type/test/compose/build/security baseline;
- [ ] bad PR bị block;
- [ ] no secret.

**Evidence:** CI runs + PR history + release history.

## 5.4. P0 — Docker/Compose/Config

- [ ] build images;
- [ ] multi-service Compose;
- [ ] network/DNS;
- [ ] volume persistence;
- [ ] env contract;
- [ ] healthcheck;
- [ ] logs/inspect;
- [ ] configuration freeze complete.

**Evidence:** Compose config, service cards, failure reports, freeze record.

## 5.5. P0 — Identity / Authorization

- [ ] realm/client/users/roles;
- [ ] OIDC flow;
- [ ] JWT validation;
- [ ] JWKS;
- [ ] 401/403/200;
- [ ] RBAC Backend enforcement;
- [ ] realm export/import;
- [ ] secret/security boundary.

**Evidence:** RBAC matrix + tests + realm import.

## 5.6. P0 — Workflow / Integration

- [ ] Backend↔Postgres trace;
- [ ] Backend/n8n contract;
- [ ] retry/idempotency;
- [ ] correlation/business ID;
- [ ] HITL;
- [ ] duplicate-safe;
- [ ] audit.

**Evidence:** workflow exports + test/evidence + trace.

## 5.7. P0 — Observability / Operations

- [ ] Service Health Matrix;
- [ ] health vs running vs functional;
- [ ] logs;
- [ ] CPU/RAM/disk baseline;
- [ ] ports/dependencies;
- [ ] operation runbook.

**Evidence:** matrix + resource snapshots + incidents.

## 5.8. P0 — Backup / Restore

- [ ] compressed backup;
- [ ] checksum;
- [ ] backup out of Git/protected;
- [ ] restore separate target;
- [ ] cross-machine restore;
- [ ] smoke after restore;
- [ ] retention/location policy frozen.

**Evidence:** backup/restore report.

## 5.9. P0 — AI Infrastructure / Agent Security

- [ ] Qdrant deploy/persistence;
- [ ] Ollama model/runtime;
- [ ] RAG dependency debug;
- [ ] Agent tool auth/RBAC;
- [ ] pending-only write;
- [ ] no approve tool;
- [ ] red-team;
- [ ] corpus secret/PII review.

**Evidence:** AI infra report + security report + audit trace.

## 5.10. P0 — Security Closure

- [ ] threat model ngắn;
- [ ] public/internal boundary;
- [ ] secret rotation runbook;
- [ ] demo creds separated;
- [ ] DB/Qdrant/Ollama not exposed unnecessarily;
- [ ] backup protected;
- [ ] no HITL/RBAC bypass.

**Evidence:** security docs + CI/review + red-team.

## 5.11. P0 — Fresh-machine / Release

- [ ] two independent clean-machine runs;
- [ ] no source/path manual edits;
- [ ] ≤15 min excluding first model pull;
- [ ] restart/persistence;
- [ ] restore;
- [ ] v0.9 tag;
- [ ] CHANGELOG/release notes/checksum/exports;
- [ ] zero Critical.

**Evidence:** signed checklists + release package.

## 5.12. P0 — Documentation / Oral Defense

- [ ] core docs complete;
- [ ] commands tested by non-author;
- [ ] OpenAPI/ERD/exports match code;
- [ ] demo 8–12 min;
- [ ] backup presenter;
- [ ] mock Q&A;
- [ ] SV1 explain H-P-D-I, security, troubleshooting, release.

**Evidence:** peer-review checklist + mock score + demo timing.

## 5.13. Graduation rule

```text
Any unresolved P0
→ NOT GRADUATED

Any Critical security/release defect
→ NOT GRADUATED

TBD in release-critical configuration
→ NOT GRADUATED

No real evidence
→ NOT GRADUATED
```

SV1 graduation chỉ được xác nhận khi evidence đủ, không dựa vào việc “đã đọc roadmap”.

---

# PHẦN 6 — REMAINING TBD REGISTER

Các mục sau chưa thể khóa chỉ bằng roadmap vì phụ thuộc implementation/repository thực tế. Chúng **không được để mơ hồ**: mỗi mục có owner, deadline và source of truth.

| TBD / Decision | Vì sao chưa thể khóa ngay | Owner | Deadline | Source of Truth sau khi khóa | Release rule |
|---|---|---|---|---|---|
| CI baseline implementation/tooling exact | Repo workflow thật quyết định syntax/tool | SV1 | **30/08/2026** | `.github/workflows/*` hoặc CI folder + branch protection | Blocking trước merge |
| Backend exact API endpoints | SV2 đang hoàn thiện Data/API | SV2; SV1 verify | **30/08/2026** | OpenAPI generated artifact `/docs` | Không contract miệng |
| Reverse proxy choice/routes | Phụ thuộc deployment design | SV1 | **30/08/2026** | ADR + Compose + proxy config | Không đổi âm thầm sau W2 |
| Keycloak persistence/import strategy | Cần triển khai W3 thực tế | SV1 | **06/09/2026** | Compose + realm export + `docs/identity.md` | Realm phải tái tạo được |
| Demo/public/internal URL map | Cần Portal/Keycloak/Backend/n8n integration | SV1 | **13/09/2026** | architecture/identity/env docs | Browser/internal URLs không lẫn |
| Workflow service-auth credential strategy | Cần API↔n8n contract | SV1+SV2 | **13/09/2026** | workflow conventions + env contract | Không credential trong export |
| Backup location + retention | Phụ thuộc lab storage/team policy | SV1 | **20/09/2026** | `docs/operation.md` + scripts | Backup không Git, restore test |
| Metabase reporting account/connection | Cần Week5 DB/dashboard | SV2; SV1 verify infra | **20/09/2026** | DB migration/setup + Metabase docs | Read-only verified |
| Qdrant exact image tag/health endpoint | Phụ thuộc selected pinned version | SV1 infra + SV3 | **27/09/2026** | Compose + AI docs | No `latest`, health verified |
| Ollama exact image/runtime + model | Cần đo resource/model | SV3 functional + SV1 infra | **27/09/2026** | `.env.example` + AI docs + bootstrap | Model available on clean machine |
| Embedding model/dimension | RAG functional decision | SV3 | **27/09/2026** | manifest/AI config | Re-ingest reproducible |
| RAG Service port/health/auth | Service implementation Week6 | SV3; SV1 verify | **27/09/2026** | Compose + `.env.example` + OpenAPI | No port TBD after W6 |
| Agent Service port/health/service auth | Agent implementation Week7 | SV3; SV1 security verify | **04/10/2026** | Compose + Agent/API/security docs | Tool auth/RBAC tests pass |
| Third-party attribution/license inventory | Final dependency set chưa freeze | Module owners; SV1 audit | **04/10/2026** | LICENSE/NOTICE/dependency inventory | OLP audit before release |
| All exact env variable names | Services evolve until W7 | each owner; SV1 freezes | **04/10/2026** | `.env.example` | No undocumented required env |
| All service healthchecks | Một số endpoint version-dependent | each owner; SV1 verifies | **04/10/2026** | Compose + operation docs | All release services checkable |
| Full service inventory/ports/networks/volumes | Phải chờ W7 complete stack | SV1 | **04/10/2026** | `docker-compose.yml` + system map | Required for Config Freeze |
| Configuration Freeze | Chỉ được freeze sau all components | SV1 | **05/10/2026** | freeze record + repo at RC commit | P0 gate |
| Demo credentials final set | Cần identity/demo story ổn | SV1 identity + team | **04/10/2026** | demo docs + realm export | Separate from personal/real secrets |
| Demo script exact commands/URLs | Phụ thuộc frozen config | SV1 + whole team | **10/10/2026** internal target | `docs/demo-script.md` | Peer run + timed rehearsal |

## 6.1. TBD governance

Mỗi TBD phải có Issue chứa:

```text
Decision:
Owner:
Deadline:
Options:
Impact:
Evidence:
Source of Truth:
```

Nếu deadline trễ:

- release-critical → P0 blocker;
- owner phải báo blocker + next decision/test;
- không che bằng placeholder/default ngẫu nhiên.

## 6.2. Zero-TBD release rule

Trước tag `v0.9`:

```text
grep/find TBD
```

trong release-critical docs/config phải không còn TBD chưa có decision.

Có thể còn future enhancement TBD trong backlog, nhưng **không được nằm trong install/config/auth/health/API/demo contract của v0.9**.

---

# PHỤ LỤC A — FINAL SOURCE TRACEABILITY

Các điểm FINAL được khóa dựa trên source project hiện có:

- Vai trò chính thức: SV1 Team Lead/DevOps/H; SV2 Backend/P/D; SV3 AI/UX/I.
- Week 1 có repo/Compose/CI quality gate và PR lỗi lint bị chặn.
- Branch protection/CODEOWNERS/one review được cẩm nang yêu cầu.
- PostgreSQL chỉ Docker network khi không cần dev host mapping; Qdrant/Ollama không expose Internet không cần thiết.
- Real secrets chỉ ở env/secret, không Issue/docs/screenshots.
- AI corpus loại secret/PII.
- Week5 backup không nằm trong Git, restore trên máy khác.
- Week7 red-team yêu cầu 0 HITL/RBAC bypass và 0 secret exposure.
- Week8 fresh-machine ≥2 máy, ready ≤15 phút excluding first model pull, E2E 3 lần.
- Release v0.9 chỉ sau quality gates, ≥80/100 project acceptance và zero Critical.

# PHỤ LỤC B — FINAL SCOPE CONTROL

Không tự thêm:

```text
Kubernetes
Terraform
Ansible
Service Mesh
Prometheus/Grafana stack
ELK
Jenkins advanced
Vault
HA/cluster
Cloud architecture deep dive
Enterprise DevSecOps
```

Nếu đề OLP thật yêu cầu công nghệ mới, xử lý bằng Requirement Matrix + Change Request, không chèn trước vào Core.

# PHỤ LỤC C — FINAL STATEMENT

Roadmap FINAL được coi là **100/100 ở mức specification** khi:

```text
Role rõ
+ dependency rõ
+ owner rõ
+ CI gate rõ
+ observability rõ
+ security closure rõ
+ config freeze rõ
+ weekly DoD rõ
+ evidence rõ
+ fresh-machine/release rõ
+ team readiness rõ
```

SV1 thực tế chỉ được gọi là PASS khi có evidence ở PHẦN 5.
