---
id: w1-m3-processes-logs-resources
week: 1
order: 3
title: "Processes, Logs & Resources"
category: "Linux"
skillId: "troubleshooting"
estimatedMinutes: 150
targetLevel: "L2"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Linux processes, logs, and resource observation"
keywords: ["process", "pid", "logs", "ram", "disk", "ps", "top"]
objectives:
  ["Tìm process và PID", "Đọc log có chủ đích", "Quan sát RAM và disk"]
prerequisites: ["w1-m2-files-permissions-env"]
requiredEvidence: ["terminal-output", "incident-report"]
quizPassScore: 70
hardGate: true
whyItMatters: "Container và service cuối cùng vẫn là process tiêu thụ tài nguyên và tạo log; SV1 phải quan sát trước khi restart."
---

## 1. Ví dụ đời thường

Program là công thức; process là một đầu bếp đang thực thi công thức đó. PID là số thẻ của đầu bếp. Log là nhật ký ca làm, RAM là bàn thao tác, disk là kho.

## 2. Giải thích cực dễ

`ps` chụp danh sách process, `top` quan sát động, `kill` gửi signal. `tail` xem cuối log, `grep` lọc dòng đáng chú ý. `free` và `df` giúp phân biệt thiếu RAM với đầy disk.

## 3. Technical Definition

Process là instance đang chạy của chương trình. Signal yêu cầu process thực hiện hành động; SIGTERM cho cơ hội shutdown sạch, SIGKILL cưỡng chế và chỉ dùng khi cần.

## 4. DX-Lab dùng nó ở đâu

SV1 dùng mental model này để hiểu container exited, healthcheck fail, OOM và service không listen.

## 5. SV1 cần đạt Level nào

Mission target L2; troubleshooting cuối roadmap L4.

## 6. Thành phần cần biết

program/process/PID, `ps`, `top`, `kill`, systemd awareness, `grep`, `tail`, `free`, `df`.

## 7. Commands / Config

```bash
sleep 300 &
ps aux | grep '[s]leep 300'
top -b -n 1 | head -n 12
free -h
df -h
printf "INFO boot\nERROR db unavailable\nINFO retry\n" > app.log
tail -n 3 app.log
grep ERROR app.log
kill %1
ps aux | grep '[s]leep 300' || true
systemctl --version
```

**COMMAND:** chạy block tạo process/log, quan sát PID/resource, lọc lỗi rồi gửi SIGTERM.  
**WHERE TO RUN:** thư mục lab riêng trong Linux/WSL; không nhắm vào process hệ thống.  
**WHY:** buộc diagnosis dựa trên process, log và resource evidence trước khi restart hoặc kill mạnh.  
**EXPECTED OUTPUT:** tìm được PID, lọc đúng ERROR, process dừng sau SIGTERM.  
**COMMON FAILURE:** dùng `kill -9` ngay, mất cơ hội shutdown/evidence. WSL/container có thể không boot bằng systemd; chỉ ghi nhận awareness, không ép bật systemd trong lab này.

## 8. Expected Output

Một incident note ghi first relevant error, PID, signal đã dùng và cách xác minh process đã dừng.

## 9. Guided Lab

Khởi động process nền, tìm PID theo hai cách, dừng bằng SIGTERM, kiểm tra lại bằng `ps`.

## 10. Independent Lab

Tạo log 20 dòng có nhiều mức INFO/WARN/ERROR; chỉ lấy 2 lỗi gần nhất mà không mở toàn file.

## 11. Failure Injection

Chạy một process rồi làm mất dấu terminal tạo nó. Dùng evidence để tìm đúng process, tránh kill nhầm.

## 12. Troubleshooting

1. **SYMPTOM:** process treo, exited hoặc log có lỗi gì.
2. **EVIDENCE:** PID, `ps`, `top`, timestamp log, `free`, `df`.
3. **HYPOTHESIS:** một nguyên nhân kiểm chứng được.
4. **TEST:** một command phân biệt giả thuyết, chưa restart.
5. **RESULT:** output thật và kết luận test.
6. **ROOT CAUSE:** process/signal/resource/log condition cụ thể.
7. **FIX:** SIGTERM hoặc thay đổi nhỏ nhất phù hợp.
8. **VERIFICATION:** `ps`/log chứng minh trạng thái mong muốn.
9. **REGRESSION:** kiểm process khác và tài nguyên vẫn bình thường.

## 13. Self-check Questions

1. Program khác process thế nào?
2. Vì sao lấy evidence trước restart?
3. `free -h` và `df -h` đo hai tài nguyên nào?

## 14. Evidence Required

Terminal output và incident report theo protocol chín bước.

## 15. Quiz

Quiz kiểm tra process, signal, log và resource.

## 16. PASS Gate

Không PASS nếu chưa chứng minh tìm/dừng đúng PID bằng SIGTERM, lọc đúng lỗi, chụp RAM/disk, nộp đủ evidence, quiz ≥70% và chốt hard gate.
