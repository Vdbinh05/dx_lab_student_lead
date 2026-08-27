---
id: w1-m2-files-permissions-env
week: 1
order: 2
title: "Files, Permissions & Environment"
category: "Linux"
skillId: "linux"
estimatedMinutes: 150
targetLevel: "L2"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Linux file safety, permissions, environment, and secret handling"
keywords: ["permission", "chmod", "environment", "secret", ".env", "file"]
objectives:
  - "Quản lý file an toàn bằng cp, mv, rm"
  - "Đọc và sửa permission cơ bản"
  - "Phân biệt .env mẫu và secret thật"
prerequisites: ["w1-m1-linux-orientation"]
requiredEvidence: ["terminal-output", "explanation"]
quizPassScore: 70
hardGate: true
whyItMatters: "Permission sai và secret bị commit là hai lỗi vận hành có blast radius lớn đối với SV1."
---

## 1. Ví dụ đời thường

File permission giống ba vòng chìa khóa: owner, group và others. Mỗi vòng có quyền đọc, ghi, thực thi. `.env` giống chìa khóa thật; `.env.example` chỉ là nhãn chỉ dẫn loại chìa khóa cần có.

## 2. Giải thích cực dễ

`cp` sao chép, `mv` di chuyển/đổi tên, `rm` xóa. Dấu chấm đầu tên file làm file “ẩn” theo quy ước. Environment variable đưa cấu hình vào tiến trình mà không đóng cứng trong source.

## 3. Technical Definition

Linux permission dùng `r/w/x` cho user, group, others. `chmod` thay mode; owner/group quyết định bộ quyền nào áp dụng. Environment là map key/value mà tiến trình kế thừa.

## 4. DX-Lab dùng nó ở đâu

Compose đọc `.env`; repository chỉ giữ `.env.example`. Script cần executable bit; backup cần quyền truy cập hạn chế.

## 5. SV1 cần đạt Level nào

Mission target L2; Linux và secrets handling cuối roadmap đạt L4 practical.

## 6. Thành phần cần biết

`cp`, `mv`, `rm`, hidden files, `ls -la`, `chmod`, owner/group, `printenv`, `export`, `.env`, `.env.example`, `.gitignore`.

## 7. Commands / Config

```bash
mkdir -p ~/dx-lab-training/w1-m2
cd ~/dx-lab-training/w1-m2
touch original.txt .env .env.example
cp original.txt copy.txt
mv copy.txt renamed.txt
chmod 640 renamed.txt
ls -la
id
stat -c '%U %G %A %a %n' renamed.txt
umask
export DXLAB_STAGE=foundation
printenv DXLAB_STAGE
rm renamed.txt
```

**COMMAND:** chạy block quản lý file, permission và environment theo từng dòng; kiểm `pwd` trước `rm`.  
**WHERE TO RUN:** `~/dx-lab-training/w1-m2` trong Linux/WSL lab.  
**WHY:** chứng minh file lifecycle, least permission và environment hoạt động thay vì dùng `chmod 777` hay đưa secret vào Git.  
**EXPECTED OUTPUT:** mode của file từng là `rw-r-----`; biến in ra `foundation`.  
**COMMON FAILURE:** xóa nhầm do không kiểm tra `pwd`/`ls` trước `rm`.

## 8. Expected Output

Giải thích được vì sao `.env` không xuất hiện với `ls` thường và tại sao `chmod 777` không phải cách sửa mặc định.

## 9. Guided Lab

Tạo `.env.example` chỉ chứa `DATABASE_URL=` không có mật khẩu thật. Tạo `.gitignore` có dòng `.env` và kiểm tra bằng `git check-ignore .env` nếu đang trong repo test.

## 10. Independent Lab

Tạo script `health-check.sh`, chứng kiến lỗi permission khi chạy, chỉ thêm đúng executable bit rồi chạy lại.

## 11. Failure Injection

Bỏ read permission của một file test, ghi lại symptom, permission evidence, giả thuyết, fix và verification. Không thao tác trên file hệ thống.

## 12. Troubleshooting

1. **SYMPTOM:** ghi lệnh và nguyên văn `Permission denied`.
2. **EVIDENCE:** lưu `id`, `stat`/`ls -l`, owner, group và mode hiện tại.
3. **HYPOTHESIS:** chỉ ra permission bit hoặc ownership nào đang chặn.
4. **TEST:** kiểm quyền cần cho thao tác, chưa `chmod 777`.
5. **RESULT:** ghi test xác nhận/bác bỏ giả thuyết.
6. **ROOT CAUSE:** nêu đúng user/group/mode sai.
7. **FIX:** thay đổi tối thiểu, chỉ trên file lab.
8. **VERIFICATION:** chạy lại thao tác từng lỗi.
9. **REGRESSION:** xác nhận không vô tình cấp write/execute cho others và `.env` vẫn ignored.

## 13. Self-check Questions

1. Tại sao `.env.example` được commit nhưng `.env` không?
2. `chmod 640` cấp quyền gì?
3. Khi nào `mv` là đổi tên và khi nào là di chuyển?

## 14. Evidence Required

Dán terminal output của permission lab và tự giải thích secret boundary.

## 15. Quiz

Đạt tối thiểu 70%; không lưu đáp án thành công giả.

## 16. PASS Gate

Phải có output trước/sau của permission lab, giải thích owner/group/mode, `git check-ignore .env` thành công, đủ hai evidence, quiz ≥70%, rồi mới chốt hard gate. Không commit secret.
