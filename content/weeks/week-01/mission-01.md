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

## 1. TRƯỚC KHI HỌC BÀI NÀY

Không cần biết lệnh Linux từ trước. Bạn cần:

- [ ] Mở được ứng dụng **Ubuntu** từ Start của Windows. WSL là tính năng cho chạy môi trường Linux trong Windows; Ubuntu là bản Linux chúng ta dùng.
- [ ] Gõ một dòng rồi nhấn Enter. Chỉ sao chép lệnh, không chép dấu nhắc như `$` hay output.
- [ ] Có thư mục cá nhân để luyện. Bài sẽ tự tạo `~/dx-lab-practice/`; không dùng thư mục dự án thật.

Nếu chưa có Ubuntu: trong **Windows PowerShell chạy với quyền Administrator**, dùng `wsl --install -d Ubuntu` để cài, khởi động lại nếu được yêu cầu, rồi mở Ubuntu và tạo tên người dùng/mật khẩu Linux. Khi gõ mật khẩu, màn hình không hiện ký tự là bình thường. Nếu máy trường chặn cài đặt, nhờ người quản lý máy chuẩn bị Ubuntu; bạn vẫn có thể đọc bài.

**Từ đây mọi khối bash chạy trong WSL / Ubuntu terminal, không phải PowerShell.** Trong Ubuntu, `pwd` thường in `/home/ten-ban`; nếu thấy `/mnt/c/...` thì bạn đang ở vùng ổ Windows, hãy chạy `cd ~` để về home Linux. Bài không yêu cầu Docker Desktop chạy.

[THEO KẾ HOẠCH CÔ] Nền Linux/path phục vụ Week 1. [KIẾN THỨC MỞ RỘNG ĐỂ SV1 HỌC/DEBUG TỐT HƠN] Câu chuyện, thí nghiệm và lab Teaching V2 dưới đây. [PROJECT-DEFINED / TBD] Đường dẫn dự án thật phải lấy từ máy bạn, không chép đường dẫn minh họa.

**Mục tiêu:** biết mình ở đâu, tìm đúng file, tạo/đọc cây thư mục và giải thích được một lỗi đường dẫn. Chia bài thành chặng 5–12 phút; nghỉ sau mỗi thí nghiệm. Tổng thời gian gồm tự thực hành và evidence.

**Đi nhanh:** [Cửa sổ và lệnh](#section-2) · [Cây thư mục](#section-3) · [Đường dẫn](#section-4) · [Tạo file](#section-5) · [Ba lab](#section-7) · [Debug](#section-8) · [Từ điển](/glossary).

## 2. Bạn bảo máy làm việc bằng cách nào? — Giải thích cực dễ

Bạn muốn biết thư mục dự án có gì mà không mở từng cửa sổ. Cần một nơi nhận yêu cầu bằng chữ và một chương trình hiểu yêu cầu đó. [Terminal](/glossary#terminal) là cửa sổ nhập/hiện chữ; [shell](/glossary#shell) là chương trình bên trong đọc lời yêu cầu. Ubuntu thường dùng shell Bash. Đổi màu cửa sổ không đổi cách Bash hiểu lệnh.

**Ví dụ đời thường / mental model:** terminal giống quầy giao tiếp; shell giống người nhận yêu cầu. Giới hạn: shell không tự hiểu ý như con người; sai tên hay thiếu khoảng trắng có thể thành yêu cầu khác.

**Technical Definition:** [command](/glossary#command) là một chỉ thị cho shell. `ls -la docs` gồm tên lệnh `ls`, tùy chọn `-la` thay đổi cách hiển thị, và đối số `docs` cho biết đối tượng cần xem. Chưa cần chạy dòng này khi chưa có `docs`.

```text
Bạn gõ
  ↓
Terminal nhận chữ
  ↓
Shell hiểu và thực hiện
  ↓
Terminal hiện kết quả
```

Đọc từ trên xuống: cửa sổ chuyển chữ; shell mới quyết định làm gì. Một số lệnh như `cd` do chính shell thực hiện; không phải mỗi lệnh đều là chương trình riêng.

**Mini experiment · 2 phút. Bạn nghĩ điều gì sẽ xảy ra?** Một câu trong dấu nháy có được coi là lệnh khác không?

```bash
echo "Toi dang hoc Linux"
pwd
```

**COMMAND / WHERE TO RUN:** hai dòng trong Ubuntu, bất kỳ thư mục nào. **WHY:** thấy khác biệt giữa in chữ và hỏi vị trí. `echo` in các đối số; dấu nháy kép giữ câu có khoảng trắng thành một đối số. `pwd` = print working directory, in thư mục hiện tại. **EXPECTED OUTPUT:** dòng đầu in câu bạn viết, dòng sau là đường dẫn bắt đầu bằng `/`. Đường dẫn cụ thể tùy tài khoản.

**COMMON FAILURE:** `Pwd` có thể báo `command not found` vì chữ hoa/thường khác nhau; gõ lại `pwd`. **Verify:** chạy lại `pwd`, vị trí không đổi vì `echo` không di chuyển bạn. Trong DX-Lab, tách được lệnh, tùy chọn và đối số giúp bạn đọc hướng dẫn thay vì chép mù.

```teaching
TÔI CHƯA HIỂU — terminal và shell
Thử mở hai tab Ubuntu: đó là hai nơi giao tiếp, thường có hai shell riêng. Gõ `echo "tab A"` trong một tab; tab kia không tự thực hiện. Hãy tưởng tượng hai quầy nhận phiếu, mỗi quầy có người xử lý riêng. Bạn không phải đang lập trình giao diện cửa sổ; bạn đang gửi một chỉ thị cụ thể cho shell.
```

**Không nhìn lại:** terminal làm gì, shell làm gì, lệnh giải quyết nhu cầu nào?

```teaching
SHOW KEY POINTS — lệnh
Cửa sổ nhận/hiện chữ; shell diễn giải; command là chỉ thị. Trong DX-Lab, phải biết lệnh nào nhận đường dẫn dự án làm đối số.
```

## 3. Máy cất file ở đâu? — cây filesystem · 8 phút

Nếu hàng nghìn file nằm chung một chỗ, bạn không thể phân biệt ghi chú của hai dự án. Thư mục gom file, và thư mục có thể chứa thư mục con. [Filesystem](/glossary#filesystem) là cách hệ thống tổ chức, lưu và tìm dữ liệu; ở đây ta quan sát nó như một cây tên.

**Technical Definition:** file chứa dữ liệu; directory (thư mục) chứa các tên dẫn đến file/thư mục khác. Đỉnh cây Linux là [root `/`](/glossary#root). [Home directory](/glossary#home-directory) là nơi cá nhân của một tài khoản; Bash mở rộng `~` thành đường dẫn home của bạn.

```text
/                         ← gốc toàn cây
├── home/
│   └── student/           ← home minh họa
│       └── dx-lab-practice/
├── etc/                  ← cấu hình hệ thống
├── var/                  ← dữ liệu thay đổi, nhiều log
└── tmp/                  ← dữ liệu tạm
```

Mỗi nhánh thụt vào thuộc thư mục ngay phía trên. `student` là tên ví dụ, không phải tên bắt buộc trên máy bạn. Cây tên không có nghĩa tất cả dữ liệu ở cùng một ổ đĩa; Linux có thể gắn nhiều vùng lưu trữ vào cây.

[Working directory](/glossary#working-directory) là vị trí hiện tại của shell. Hình dung một chấm “bạn đang ở đây” trên cây, không phải file vừa mở. Home là địa chỉ cá nhân ổn định; chấm hiện tại di chuyển được.

**Mini experiment · dự đoán trước:** sau `cd ..` từ home, có phải bạn vẫn ở home không?

```bash
cd ~
pwd
ls
cd ..
pwd
cd -
pwd
```

**WHERE TO RUN:** Ubuntu, bất kỳ vị trí nào. **WHY:** quan sát chấm hiện tại di chuyển. `cd` = change directory; `cd ~` về home; `ls` liệt kê tên ở vị trí hiện tại; `cd ..` lên thư mục cha; `cd -` về thư mục vừa đứng trước đó. **EXPECTED OUTPUT:** `pwd` thứ hai thường là `/home`, cuối cùng về home bạn. `cd -` cũng tự in đường dẫn quay về. `ls` không in gì có thể chỉ là thư mục trống. Nhiều lệnh Unix/Linux im lặng khi thành công, nhưng không phải mọi lệnh. Không có output không tự có nghĩa thất bại hoặc chưa chạy; kiểm trạng thái bằng `pwd`, `ls` hay `cat` tùy việc vừa làm.

**COMMON FAILURE / verify:** `cd -` trong shell chưa có vị trí trước có thể báo `OLDPWD not set`; dùng `cd ~`, thực hiện lại chuỗi. So sánh ba dòng `pwd` để kiểm chứng. Trong DX-Lab, vị trí này quyết định lệnh tìm file cấu hình ở đâu.

```teaching
TÔI CHƯA HIỂU — home không phải vị trí hiện tại
Nhà của bạn vẫn ở một địa chỉ khi bạn đi ra cửa hàng. Tương tự, sau `cd /tmp`, home vẫn là nơi `cd ~` đưa bạn về. Thử `cd /tmp`, `pwd`, `cd ~`, `pwd` trong Ubuntu; không tạo hay xóa file ở `/tmp`. Dấu `/` đầu đường dẫn nói “bắt đầu ở gốc”, không có nghĩa “home”.
```

**Không nhìn lại:** vẽ cây ba cấp và đặt chấm hiện tại; giải thích tại sao cần thư mục.

```teaching
SHOW KEY POINTS — cây và vị trí
Thư mục tổ chức tên; `/` là gốc; `~` mở rộng thành home; working directory là vị trí hiện tại. `cd` đổi vị trí, `ls` chỉ quan sát. Cây là mô hình đường dẫn, không phải sơ đồ phần cứng.
```

## 4. Chỉ đúng file — path · 10 phút

Bạn nói “đọc notes.txt” nhưng có ba file cùng tên ở ba nơi. Máy cần một đường đi để chọn đúng file. [Path](/glossary#path) là chuỗi các thành phần tên ngăn bởi `/`.

**Technical Definition:** absolute path bắt đầu từ `/`; relative path được tính từ working directory. `.` là thư mục hiện tại; `..` là thư mục cha. Ví dụ đời thường: địa chỉ đầy đủ và lời chỉ đường từ nơi bạn đứng. Giới hạn: đường dẫn phải tồn tại và bạn phải có quyền đi qua; địa chỉ đúng chưa bảo đảm mở được file.

| Cặp dễ nhầm | Cách đọc |
| --- | --- |
| `/` và `~` | Gốc toàn cây và home của tài khoản; home nằm trong cây |
| `/home/student/project/docs` và `docs` | Đường đi từ gốc và đường đi từ vị trí hiện tại |
| `.` và `..` | Đứng yên tại cấp hiện tại và lên cấp cha |
| `~` | Bash mở rộng thành home trước khi lệnh nhận path; không phải một tên relative giống `.` hay `..` |
| `~/project` và `/project` | Thư mục trong home và thư mục ngay dưới root |

**Mini experiment:** chuẩn bị hai cấp; chưa có file nên chỉ di chuyển.

```bash
mkdir -p ~/dx-lab-practice/week1/m1/docs
cd ~/dx-lab-practice/week1/m1
pwd
cd docs
pwd
cd ..
pwd
```

**COMMAND / WHY:** `mkdir` tạo directory; `-p` tạo cả các cấp cha còn thiếu và chấp nhận thư mục đã có. Chạy trong Ubuntu từ bất kỳ nơi nào; các dòng sau dùng vị trí do `cd` thiết lập. **EXPECTED OUTPUT:** `mkdir` thành công thường im lặng; ba dòng `pwd` lần lượt kết thúc bằng `m1`, `m1/docs`, `m1`. Trước khi chạy, đoán dòng thứ ba.

**COMMON FAILURE:** `cd Docs` có thể báo không tồn tại vì Linux phân biệt `Docs` và `docs`. **Verify:** `ls` tại `m1` phải có `docs`. Nếu `cd` lỗi, shell ở nguyên chỗ cũ; kiểm `pwd` trước khi tiếp tục.

```teaching
TÔI CHƯA HIỂU — relative path
Giả sử bạn đứng ở `/home/student/project`; file ở `/home/student/project/docs/readme.md`. Bỏ phần địa chỉ trùng với chỗ đứng, còn `docs/readme.md`. Nếu đứng ở `project/docs` thì chỉ còn `readme.md`. Một file, hai lời chỉ đường vì điểm xuất phát khác nhau. Với cây vừa tạo, thử `cd docs`, rồi `cd .`, `pwd`: dấu chấm không đi lên; `cd ..` mới đi lên.
```

**Không nhìn lại:** từ `m1/docs` trở lại `m1` thế nào? Vì sao cùng `docs` có thể đúng ở chỗ này nhưng sai ở chỗ khác?

```teaching
SHOW KEY POINTS — path
Relative path cần điểm xuất phát; absolute path bắt đầu từ root. `..` lên cha, `.` vẫn hiện tại. Trong lab không dùng liên kết tượng trưng (tên trỏ tới nơi khác), nên cây quan sát khớp trực tiếp các cấp đường dẫn.
```

## 5. Từ thư mục trống đến file đọc được — Commands / Config · 8 phút

Một tên file chưa có nội dung giúp gì? Nó cho chương trình một nơi lưu dữ liệu. Ta tách **tạo tên**, **ghi chữ**, **đọc chữ** để thấy mỗi thao tác làm gì.

**WHERE TO RUN:** Ubuntu, sau khi dòng `cd` dưới đây thành công. Các file mang tên lab; nếu đã có ghi chú cá nhân trong file đó, chọn tên lab mới trước khi ghi.

```bash
cd ~/dx-lab-practice/week1/m1
touch docs/notes.txt
cat docs/notes.txt
echo "Duong dan bat dau tu noi minh dung" > docs/notes.txt
cat docs/notes.txt
echo "Kiem tra bang pwd" >> docs/notes.txt
cat docs/notes.txt
ls -la docs
```

| COMMAND | WHY / các phần | EXPECTED OUTPUT và diễn giải | COMMON FAILURE → verify |
| --- | --- | --- | --- |
| `touch docs/notes.txt` | Tạo file rỗng nếu chưa có; với file đã có chỉ cập nhật thời gian | Thường không in gì; không xóa nội dung cũ | Cha chưa tồn tại → `ls docs`, tạo đúng thư mục |
| `cat docs/notes.txt` | In nội dung file | Lần đầu trống nếu file mới; sau ghi hiện câu | Sai vị trí → `pwd`, kiểm tên rồi đọc lại |
| `echo "..." > docs/notes.txt` | Shell chuyển chữ ra file; `>` tạo hoặc **ghi đè** | Không in ra màn hình; `cat` mới cho thấy chữ | Dùng `>` lần hai sẽ mất chữ cũ; kiểm file lab trước khi ghi |
| `echo "..." >> docs/notes.txt` | `>>` nối thêm ở cuối | `cat` có cả hai câu | Không phải một dấu `>`; kiểm lại bằng `cat` |
| `ls -la docs` | `-l` dạng dài, `-a` gồm tên bắt đầu dấu chấm | Cuối dòng là tên; `d` ở đầu là directory, `-` thường là file; số kích thước là byte | File ẩn không thấy với `ls` thường → thêm `-a` |

Các chữ `rwx` của `ls -la` là quyền, sẽ được giải thích đầy đủ trong [Mission 2](/learn/week-01/mission-02). Hiện tại chỉ dùng tên và loại. **Dự đoán:** thay `>>` bằng `>` thì còn mấy câu? Chỉ thử trên `docs/overwrite-demo.txt` mới, không trên ghi chú cần giữ.

```teaching
TÔI CHƯA HIỂU — tạo file chưa phải ghi nội dung
Hình dung một quyển vở mới có tên nhưng trang còn trắng: `touch` có thể tạo file như vậy. `echo "mot" > docs/overwrite-demo.txt` ghi câu đầu; `echo "hai" >> docs/overwrite-demo.txt` nối câu thứ hai. Dùng `cat docs/overwrite-demo.txt` để thấy cả hai, rồi chỉ trên file demo này thử ghi câu `ba` với một dấu `>`: hai câu cũ bị thay thế. Nếu file đã có, `touch` không làm trắng nó; khác với redirection ghi đè.
```

## 6. TRONG DX-LAB, TÔI DÙNG THỨ NÀY Ở ĐÂU?

Repository (repo) là thư mục dự án được Git quản lý lịch sử; project root là cấp trên cùng của dự án, không phải `/`. Trước khi làm theo hướng dẫn tại project root, dùng `pwd` và `ls` để tìm đúng thư mục có các file được hướng dẫn nhắc tới.

File `.env` chứa cấu hình dạng chữ; Docker Compose là công cụ khởi động nhóm chương trình của dự án từ file cấu hình. Bạn sẽ học chúng sau. Ngay bây giờ, hiểu đường dẫn giúp phân biệt file cấu hình trong repo với file cùng tên ở thư mục khác. Trong WSL, `/mnt/c` dẫn tới ổ C của Windows; home Linux nằm ở địa chỉ khác. Không lấy đường dẫn `C:\...` dán vào lệnh Linux.

**SV1 CẦN BIẾT ĐẾN MỨC NÀO? — SV1 Level L2:** đọc cây, điều hướng, tạo/ghi/đọc file theo hướng dẫn và giải thích lỗi path. Chưa cần cấu trúc bên trong filesystem hay quản trị ổ đĩa. Sao chép/di chuyển/xóa an toàn học ở Mission 2.

## 7. Lab ladder — tự làm từng mức

### LAB 1 — GUIDED / Guided Lab

1. Chạy phần 4 tạo `m1/docs`, rồi phần 5 tạo và ghi `docs/notes.txt`.
2. Từ `m1`, chạy `cat docs/notes.txt`; giải thích vì sao không cần chép lại home.
3. Chạy `cd docs`, rồi `cat ../docs/notes.txt`. `..` lên `m1`, `docs` xuống lại.
4. Chạy `cat ~/dx-lab-practice/week1/m1/docs/notes.txt`. Bash thay `~` bằng home trước khi `cat` nhận path. So sánh nội dung với bước 3; dùng `pwd` lấy home thật để viết một absolute path bắt đầu `/` vào evidence.

### LAB 2 — PARTIALLY GUIDED

Tạo `~/dx-lab-practice/week1/m1/project/docs/runbooks` và file `project/README.md` chứa một câu bạn chọn. Từ `runbooks`, đọc README bằng relative path. Gợi ý: vẽ cây, đếm số cấp phải đi lên; `mkdir -p`, `echo`, `cat` đã đủ. Tự kiểm bằng đọc lại qua địa chỉ từ home.

### LAB 3 — INDEPENDENT / Independent Lab

Tạo `~/dx-lab-practice/week1/m1/independent/docs` và `notes.txt` bên trong, có hai câu. Từ `~/dx-lab-practice`, hiển thị nội dung bằng relative path. Từ home, đọc cùng file bằng absolute path bắt đầu `/`. Không nhìn workshop khi làm; lưu hai lệnh, output và điểm xuất phát. **Đạt:** hai cách đọc cùng nội dung; giải thích từng cấp đường đi.

```teaching
Gợi ý khi cần — independent
Vẽ các cấp từ `dx-lab-practice` xuống file; nối các tên bằng `/`. Dùng `pwd` để xác nhận điểm bắt đầu. Không thêm tên thư mục hiện tại hai lần. Nếu cần nhiều gợi ý, quay lại lab 2 rồi tự thử lại; không cần đoán lệnh mới.
```

Giữ thư mục này làm evidence; không cần xóa để hoàn thành bài.

## 8. BREAK IT — Failure Injection và Troubleshooting · 10 phút

**WHERE TO RUN:** Ubuntu. Cố tình đứng trong `docs` nhưng dùng path vốn đúng ở `m1`:

```bash
cd ~/dx-lab-practice/week1/m1/docs
cat docs/notes.txt
pwd
ls -la
```

**EXPECTED OUTPUT:** nếu lab đúng, `cat` báo `No such file or directory`. Nó đang tìm `m1/docs/docs/notes.txt`. Đừng tạo thêm `docs` để làm lỗi biến mất.

| Bước | Làm và lý do |
| --- | --- |
| SYMPTOM | Ghi nguyên lệnh và lỗi, không ghi “Linux hỏng” |
| EVIDENCE | `pwd` kết thúc `/m1/docs`, `ls -la` có `notes.txt`. Evidence trước giả thuyết để tránh đoán mò |
| HYPOTHESIS | Đã lặp tên `docs` vì đứng sâu hơn dự kiến |
| TEST | Chạy `cat ./notes.txt`: chỉ đổi cách chỉ đường, không đổi dữ liệu |
| RESULT | Đọc được chữ đã viết; ghi output thực tế |
| ROOT CAUSE | Relative path được tính từ `m1/docs`, không phải `m1` |
| FIX | Dùng `./notes.txt` tại đây hoặc về `m1` rồi dùng `docs/notes.txt` |
| VERIFICATION | Chạy lại cách đọc vừa sửa; sửa câu lệnh chưa phải bằng chứng thành công |
| REGRESSION | Đọc cùng file bằng địa chỉ từ home, kiểm hai câu còn nguyên; sửa cục bộ không được che việc đọc nhầm file |

Nếu `cat ./notes.txt` vẫn lỗi: kiểm tên, chữ hoa/thường và file có được tạo ở phần 5 không. Ghi giả thuyết bị bác bỏ rồi mới thử bước khác.

## 9. NGƯỜI MỚI THƯỜNG NHẦM — Common Beginner Errors

- Terminal là cửa sổ; shell là chương trình xử lý lệnh bên trong.
- `/` là root, `~` là home; project root là gốc của một dự án cụ thể.
- Current directory thay đổi khi `cd`; home không tự đổi theo.
- Absolute path có điểm bắt đầu `/`; relative path cần biết chỗ đứng.
- `.` giữ nguyên cấp; `..` lên cha. `cd` thất bại không đưa bạn đến nơi định tới.
- File rỗng đọc không ra chữ không đồng nghĩa lệnh bị treo; `>` có thể đã ghi đè chữ trước đó.

## 10. Self-check Questions — giải thích và chứng minh

Không nhìn lại: path giải quyết vấn đề gì? Vì sao `cat docs/notes.txt` lỗi sau `cd docs`? Trong DX-Lab, làm thế nào chứng minh đang đọc đúng file cấu hình?

```teaching
SHOW KEY POINTS — tổng hợp
Phải ghép relative path với vị trí hiện tại. `pwd` và `ls` cung cấp evidence; so sánh nội dung bằng hai đường đi giúp tránh đọc nhầm. Không tạo file mới chỉ để che một path sai.
```

### Evidence Required / Quiz / PASS Gate

Nộp `terminal-output`: lệnh/output của lab độc lập, dự đoán trước chạy và lỗi trước/sau sửa. Nộp `explanation`: cây bạn vẽ bằng chữ và giải thích absolute/relative bằng ví dụ thật. Không bịa output giống sách.

Làm 10 câu **Quiz** ở bảng Gate (trên mobile kéo xuống dưới bài), đạt ≥70%. Đánh dấu Learn → Practice → Build → Break → Debug sau khi thực sự làm, nộp đủ hai loại evidence, rồi kiểm/chốt **PASS Gate**. Gate giữ nguyên; đọc xong hoặc mở đáp án không tự PASS.

**SAU BÀI NÀY BẠN CÓ THỂ:** tìm vị trí bằng `pwd`, điều hướng không đoán, phân biệt hai loại path, tạo/ghi/đọc file luyện tập, giải thích lỗi đường dẫn và tìm đúng project root. Tiếp theo: [Mission 2 — file, quyền và cấu hình](/learn/week-01/mission-02).

### GIẢI THÍCH CHO MỘT NGƯỜI CHƯA HỌC IT

Trong 3–5 câu, giải thích “đường dẫn file là gì”, dùng ví dụ địa chỉ và lời chỉ đường. Nêu điều gì thay đổi khi bạn đứng ở thư mục khác; tránh chỉ liệt kê tên lệnh.


### Kiểm tra hành động bằng DX-Verify — pilot V3

Sau lab, tạo chỗ giữ bằng chứng trong **WSL / Ubuntu**:

```bash
mkdir -p ~/dx-lab-practice/week1/m1/evidence
```

`-p` tạo thư mục nếu thiếu; thường không in gì. Kiểm bằng `ls -ld ~/dx-lab-practice/week1/m1/evidence`: `-d` xem chính thư mục, không liệt kê bên trong. Dòng bắt đầu `d` cho biết đó là directory. Nếu lỗi, kiểm từng cấp path bằng `pwd` và `ls` trước khi thử lại.

Giữ file đã làm ở lab: `m1/docs/notes.txt` và `m1/independent/docs/notes.txt`, đều có nội dung.

**Chạy ở đâu:** Ubuntu, từ thư mục repository Training OS (thư mục chứa `scripts/dx-verify.py`), không phải từ thư mục bài tập. Nếu repo nằm ở ổ D như bản cài này, dùng `cd "/mnt/d/DX OS/my_web_dx_lab_student_lead"`; dấu nháy giữ đường dẫn có khoảng trắng. `ls scripts/dx-verify.py` kiểm đúng file trước khi chạy. Nếu repo ở nơi khác, dùng đường dẫn thật của repo; không đoán.

```bash
python3 scripts/dx-verify.py week-01 mission-01
```

`python3` chạy script verifier của repo; hai đối số chọn đúng tuần/bài. Script chỉ xem metadata (loại file, kích thước, quyền) tại các đường dẫn lab cố định; không đọc nội dung file, không chạy script bạn viết và không gửi dữ liệu qua mạng. Không dùng sudo. Nếu `python3` chưa có, xem bước chuẩn bị công cụ trong [Mission 3](/learn/week-01/mission-03#section-1).

**Đọc kết quả:** `checks` là từng phép kiểm; `status: pass` là thấy dấu vết mong đợi; `fail` là thiếu hoặc khác trạng thái yêu cầu. `overall` chỉ pass khi mọi check pass. Lệnh trả mã 1 nếu có fail — đó là kết quả kiểm, không phải yêu cầu cài lại máy. Kiểm file tương ứng bằng `ls` / `stat`, sửa đúng bài tập rồi chạy lại. Không sửa JSON để đổi fail thành pass.

Copy toàn bộ JSON từ dấu `{` đến `}` vào **DX-Verify · Action evidence** ở cuối trang, chọn **Lưu verification report**. Report không chứa tên tài khoản, path tuyệt đối, PID hay nội dung file. Đây là báo cáo tự nộp từ máy bạn, có thể bị sửa; nó không thay thế output thật, tự giải thích, quiz hay gate. Verifier không chứng minh nguyên nhân lỗi hoặc bạn đã tự làm.

**Nhớ lại ngày mai:** vào [Today](/today), trả lời warm-up trước khi mở đáp án. Nếu chưa nhớ, chọn 1 ngày; nếu khó, 3 ngày; nhớ đúng liên tiếp được hẹn 7 → 14 → 30 ngày. Không cần ôn nội dung chưa học.
