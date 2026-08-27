---
id: w1-m7-docker-compose-baseline
week: 1
order: 7
title: "Docker & Compose Operational Baseline"
category: "Docker/Compose"
skillId: "docker"
estimatedMinutes: 240
targetLevel: "L2"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Docker and Compose operational baseline"
keywords: ["docker", "compose", "image", "container", "health", "logs"]
objectives:
  [
    "Phân biệt image và container",
    "Vận hành Compose baseline",
    "Phân biệt running, healthy và functional",
  ]
prerequisites: ["w1-m6-git-open-source"]
requiredEvidence: ["terminal-output", "incident-report"]
quizPassScore: 70
hardGate: true
whyItMatters: "Week 1 chính thức phải có Compose operational baseline; đây là nền cho mọi service DX-Lab."
---

## 1. Ví dụ đời thường

Image là bản thiết kế đóng gói; container là một instance đang chạy. Compose là bản điều phối nhiều container, network, volume và environment trong một contract.

## 2. Giải thích cực dễ

`docker compose config` kiểm tra cấu hình đã resolve. `up -d --build` dựng và chạy. `ps` cho trạng thái, `logs` cho evidence. Process chạy chưa chắc healthcheck pass, healthcheck pass chưa chắc use case thật hoạt động.

## 3. Technical Definition

Image là immutable filesystem + metadata layers. Container thêm writable layer và runtime isolation. Compose mô tả services, networks, volumes, ports, environment, dependencies và healthchecks.

## 4. DX-Lab dùng nó ở đâu

Portal, Backend, PostgreSQL, Keycloak, n8n, Metabase, Qdrant, Ollama, RAG và Agent được vận hành như một service graph.

## 5. SV1 cần đạt Level nào

Week 1 target Compose L2; Week 2 đưa Docker/Compose/Network/Env/Health tới L4 operational.

## 6. Thành phần cần biết

image, container, Compose, port mapping, network, volume, env, healthcheck, status, logs.

## 7. Commands / Config

Tạo `compose.yaml` lab tối thiểu dưới đây. Tag image được pin để lần chạy sau không âm thầm đổi major/minor:

```yaml
services:
  portal:
    image: nginx:1.27.5-alpine
    ports: ["8080:80"]
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1/"]
      interval: 5s
      timeout: 2s
      retries: 10
  backend:
    image: python:3.12.11-alpine
    command: ["sh", "-c", "printf ok > /tmp/health && cd /tmp && python -m http.server 8000 --bind 0.0.0.0"]
    ports: ["8000:8000"]
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:8000/health"]
      interval: 5s
      timeout: 2s
      retries: 10
  postgres:
    image: postgres:17.5-alpine
    environment:
      POSTGRES_PASSWORD: "${POSTGRES_PASSWORD:?set POSTGRES_PASSWORD in .env}"
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 10
volumes:
  pgdata:
```

Tạo `.env.example` chỉ với `POSTGRES_PASSWORD=replace-me` và `.env` lab với một giá trị không dùng ở hệ thống thật; `.env` phải được ignore. Sau đó chạy:

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

**COMMAND:** validate Compose, start services, inspect status/logs và gọi health endpoint theo block trên.  
**WHERE TO RUN:** project root chứa `compose.yaml` lab phía trên, với Docker daemon hoạt động.  
**WHY:** chứng minh cấu hình render được và stack functional qua config → up → ps/logs → health, không chỉ thấy container running.  
**EXPECTED OUTPUT:** config hợp lệ, services chạy, backend health trả thành công.  
**COMMON FAILURE:** Docker daemon chưa chạy, sai directory, thiếu `.env`, port conflict hoặc PostgreSQL chưa ready.

## 8. Expected Output

Evidence gồm `compose ps`, log liên quan đầu tiên và smoke `/health`. Nếu workspace chưa có DX-Lab Compose thật, dùng một Compose lab tối thiểu và ghi rõ phạm vi.

## 9. Guided Lab

Chạy hello-world. Đọc một Compose file và chỉ ra service, image/build, port, env, network, volume, healthcheck.

## 10. Independent Lab

Tự vận hành stack lab: config → up → ps → logs → smoke → restart → smoke. Không sửa source/path thủ công để làm nó chạy.

## 11. Failure Injection

Tạo một port conflict hoặc missing env trong stack lab. Lưu evidence trước fix; không xóa volume theo phản xạ.

## 12. Troubleshooting

1. **SYMPTOM:** container nào exited/unhealthy hoặc smoke nào fail.
2. **EVIDENCE:** `compose config`, `ps`, health, log liên quan đầu tiên, port/listen.
3. **HYPOTHESIS:** image, env, port, process, DNS/network hay dependency.
4. **TEST:** một command kiểm đúng một layer.
5. **RESULT:** output thật, không suy từ “running”.
6. **ROOT CAUSE:** contract sai cụ thể.
7. **FIX:** thay đổi tối thiểu trong Compose/env lab.
8. **VERIFICATION:** `ps`, health và functional `curl /health` đều pass.
9. **REGRESSION:** restart rồi smoke portal/backend; xác nhận volume Postgres còn và `.env` không staged.

## 13. Self-check Questions

1. Image khác container thế nào?
2. Running, healthy, functional khác nhau ra sao?
3. Vì sao `localhost` trong Backend container không phải PostgreSQL container?

## 14. Evidence Required

Terminal output và incident report theo protocol đầy đủ.

## 15. Quiz

Quiz đạt tối thiểu 70%.

## 16. PASS Gate

Phải vận hành Compose 3 service, chứng minh config/status/health/log/functional smoke, xử lý một failure theo đủ protocol, nộp đủ evidence, quiz ≥70% và chốt hard gate. Đây chưa phải Docker L4.
