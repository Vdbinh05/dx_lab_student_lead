---
id: w1-m1-linux-orientation
week: 1
order: 1
title: "Linux Orientation"
category: "Linux"
skillId: "linux"
estimatedMinutes: 120
targetLevel: "L2"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Linux filesystem, shell orientation, and path safety"
keywords: ["linux", "shell", "filesystem", "path", "pwd", "ls", "cd"]
objectives:
  - "Biết mình đang ở directory nào"
  - "Phân biệt absolute và relative path"
  - "Tạo và đọc cấu trúc file bằng terminal"
prerequisites: []
requiredEvidence:
  - "terminal-output"
  - "explanation"
quizPassScore: 70
hardGate: true
whyItMatters: "Mọi lệnh Docker, Git và vận hành DX-Lab đều phụ thuộc vào việc bạn biết chính xác mình đang đứng ở đâu và đang tác động lên file nào."
---

## 1. Ví dụ đời thường

Filesystem giống một tòa nhà. `/` là sảnh gốc, mỗi directory là một phòng, còn path là địa chỉ đầy đủ để đi tới một đồ vật. `pwd` trả lời “tôi đang đứng ở đâu?”, `ls` cho biết “phòng này có gì?”.

## 2. Giải thích cực dễ

Terminal là cửa sổ để ra lệnh bằng chữ. Shell đọc lệnh, tìm chương trình phù hợp rồi trả kết quả. Bạn không cần thuộc mọi lệnh; cần biết quan sát vị trí, thay đổi vị trí và kiểm chứng sau mỗi thao tác.

## 3. Technical Definition

- **Shell:** chương trình diễn giải lệnh.
- **Current working directory:** thư mục hiện tại của tiến trình shell.
- **Absolute path:** bắt đầu từ `/`, không phụ thuộc vị trí hiện tại.
- **Relative path:** tính từ directory hiện tại.
- `.` là hiện tại, `..` là cha, `~` là home của user.

## 4. DX-Lab dùng nó ở đâu

SV1 chạy `docker compose` tại project root, đọc log, sửa `.env`, kiểm tra volume và viết runbook. Chạy đúng lệnh ở sai directory vẫn có thể tạo ra lỗi thật.

## 5. SV1 cần đạt Level nào

Mission này đưa bạn tới **L2**. Đích cuối roadmap là Linux **L4**: tự làm, debug, giải thích và review.

## 6. Thành phần cần biết

`pwd`, `ls`, `cd`, `mkdir`, `touch`, `cat`, `/`, `~`, `.`, `..`, absolute path, relative path.

## 7. Commands / Config

```bash
pwd
ls -la
mkdir -p ~/dx-lab-training/w1-m1/notes
cd ~/dx-lab-training/w1-m1
touch README.txt
printf "SV1 foundation\n" > README.txt
cat README.txt
cd notes
pwd
cd ..
ls -la
```

**COMMAND:** chạy block `pwd`/`ls`/`mkdir`/`cd`/`touch`/`printf`/`cat` theo thứ tự.  
**WHERE TO RUN:** một Linux shell hoặc WSL, trong workspace lab cá nhân.  
**WHY:** tạo rồi điều hướng cây thư mục giúp phân biệt working directory, absolute path và relative path bằng evidence thật.  
**EXPECTED OUTPUT:** path thay đổi đúng theo `cd`; `README.txt` chứa `SV1 foundation`.  
**COMMON FAILURE:** dùng path Linux trong PowerShell thuần hoặc gõ sai tên directory.

## 8. Expected Output

Bạn phải chỉ ra được absolute path của `README.txt` và mô tả vì sao `notes/../README.txt` vẫn trỏ tới cùng file.

## 9. Guided Lab

Tạo cây `~/dx-lab-training/w1-m1/{notes,evidence,tmp}`. Tạo một file trong mỗi thư mục, dùng cả absolute và relative path để đọc chúng.

## 10. Independent Lab

Không nhìn phần lệnh phía trên, tự tạo cây `project/docs/runbooks`, tạo `project/README.md`, rồi từ `runbooks` đọc README bằng relative path.

## 11. Failure Injection

Cố tình chạy `cat` với một path sai. Không sửa ngay: đọc thông báo lỗi, chạy `pwd`, `ls -la`, hình thành giả thuyết rồi mới thử lại.

## 12. Troubleshooting

Mọi failure note phải đi đủ protocol, không nhảy thẳng tới FIX:

1. **SYMPTOM:** chép nguyên lỗi `No such file or directory` và path đã dùng.
2. **EVIDENCE:** lưu `pwd`, `ls -la` và `ls -la` ở từng cấp liên quan.
3. **HYPOTHESIS:** ví dụ “relative path đang được tính từ sai directory”.
4. **TEST:** dùng `realpath`/`ls` để kiểm đúng một giả thuyết.
5. **RESULT:** ghi output xác nhận hoặc bác bỏ.
6. **ROOT CAUSE:** nêu directory hoặc segment sai cụ thể.
7. **FIX:** sửa đúng path hoặc `cd`, không tạo file giả để che lỗi.
8. **VERIFICATION:** đọc lại file bằng path dự kiến.
9. **REGRESSION:** chạy lại cả absolute và relative path của lab.

## 13. Self-check Questions

1. Vì sao `pwd` nên là lệnh đầu khi nghi ngờ path?
2. `/home/sv1/project` khác `project` như thế nào?
3. `.` và `..` thay đổi ý nghĩa theo điều gì?

## 14. Evidence Required

- `terminal-output`: dán lệnh và output chứng minh cây thư mục đã tạo.
- `explanation`: giải thích absolute/relative path bằng lời của bạn.

## 15. Quiz

Làm quiz ở bảng Gate bên phải. Điểm tối thiểu 70%.

## 16. PASS Gate

PASS chỉ khi đủ Learn → Practice → Build → Break → Debug, nộp đủ `terminal-output` + `explanation`, quiz ≥70%, và tự chỉ đúng absolute/relative path trong hard gate. Đọc xong chưa phải PASS.
