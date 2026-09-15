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

## 1. TRƯỚC KHI HỌC BÀI NÀY

- [ ] Từ [Mission 1 — cây và đường dẫn](/learn/week-01/mission-01#section-3), biết `pwd`, `cd`, `~`, absolute/relative path.
- [ ] Từ [workshop tạo file](/learn/week-01/mission-01#section-5), dùng được `mkdir -p`, `touch`, `echo`, `cat`, `>` và `>>`.
- [ ] Mở Ubuntu bằng tài khoản thường, không dùng tài khoản quản trị Linux `root`. Root user có quyền đặc biệt, khác dấu `/` là root directory.

**WHERE TO RUN cho mọi bash:** WSL / Ubuntu, trong home Linux `~/dx-lab-practice/week1/m2`, không phải PowerShell hay `/mnt/c`. Quyền file trên ổ Windows có thể phụ thuộc cách WSL gắn ổ, nên ta thực hành trong home Linux. Bài không cần Docker Desktop.

**Mục tiêu:** giữ đúng file, giới hạn đúng quyền và hiểu cấu hình đi vào chương trình thế nào. Các chặng 5–12 phút gồm dự đoán, chạy, giải thích; không cần đọc liên tục cả bài.

[THEO KẾ HOẠCH CÔ] File/permission/environment thuộc nền Linux. [KIẾN THỨC MỞ RỘNG ĐỂ SV1 HỌC/DEBUG TỐT HƠN] Các ví dụ và lab sau là scaffolding bổ sung. [PROJECT-DEFINED / TBD] Tên cấu hình thật và chính sách secret của DX-Lab phải theo repo thực tế; bài chỉ dùng dữ liệu giả.

[File](#section-2) · [Quyền](#section-3) · [Script](#section-4) · [Environment](#section-5) · [Secret/Git](#section-6) · [Labs](#section-8) · [Debug](#section-9) · [Từ điển](/glossary).

## 2. Giữ bản gốc, đổi tên và xóa có kiểm soát · 8 phút

Bạn muốn sửa một ghi chú nhưng giữ bản cũ để đối chiếu. Cần **sao chép**, không chỉ đổi tên. **Giải thích cực dễ:** `cp` tạo bản sao, `mv` đổi nơi/tên, `rm` bỏ tên file. Technical Definition: đây là các thao tác trên file và tên trong filesystem; `rm` thông thường không chuyển file vào Recycle Bin.

**Ví dụ đời thường:** photo một tờ giấy khác với đổi nhãn tờ giấy. Giới hạn: sao chép file không phải hệ thống backup hoàn chỉnh; bản sao vẫn có thể nằm trên cùng ổ hỏng.

**Mini experiment — dự đoán:** sau `mv`, tên cũ còn không? Sau `cp`, sửa bản sao có đổi chữ bản gốc không?

```bash
mkdir -p ~/dx-lab-practice/week1/m2
cd ~/dx-lab-practice/week1/m2
echo "ban goc" > original.txt
cp -i original.txt copy.txt
mv -i copy.txt renamed.txt
echo "them vao ban sao" >> renamed.txt
cat original.txt
cat renamed.txt
ls
```

**WHY / các phần:** `cp SOURCE DEST` đọc từ nguồn ghi sang đích; `mv SOURCE DEST` chuyển/đổi tên; `-i` hỏi trước khi ghi đè file đích đã tồn tại. Nếu hỏi và không chắc, trả lời `n` rồi chọn tên đích khác. Với đích là thư mục có sẵn, file đi vào thư mục đó.

**EXPECTED OUTPUT:** `original.txt` có một câu, `renamed.txt` có thêm câu thứ hai; `copy.txt` không còn. `cp`/`mv` thành công thường im lặng. **COMMON FAILURE:** nguồn sai path → `pwd`, `ls`; đừng tạo file nguồn trống để che lỗi. **Verify:** so sánh hai lần `cat`. Trong DX-Lab, phân biệt sao chép cấu hình mẫu và di chuyển cấu hình đang dùng tránh mất bản gốc.

**Xóa thử chỉ file bản sao:** trước hết `pwd` phải kết thúc `/week1/m2`; `ls -l renamed.txt` phải là file lab vừa tạo.

```bash
pwd
ls -l renamed.txt
rm -i renamed.txt
ls -l renamed.txt
cat original.txt
```

`rm -i` hỏi xác nhận; chỉ trả lời `y` khi đúng tên lab. **EXPECTED:** lần `ls` sau báo không tìm thấy; bản gốc còn đọc được. Nếu trả lời `n`, file vẫn còn — không phải lỗi.

**Cảnh báo cụ thể:** `rm` thường không có Undo; `rm -r` xóa cả cây thư mục; `rm -rf` xóa đệ quy và bỏ nhiều lời hỏi/lỗi. Không dùng hai dạng sau trong pilot, không dùng wildcard `*` khi xóa, không chạy lệnh xóa với quyền quản trị. Giữ thư mục lab là được.

```teaching
TÔI CHƯA HIỂU — copy và move
Hãy viết ra tên file trước/sau: `original.txt → original.txt + copy.txt` là copy; `copy.txt → renamed.txt` là đổi tên. Đọc lại bản gốc sau khi thêm chữ vào bản sao là thí nghiệm nhỏ chứng minh hai nội dung độc lập trong lab này. Nếu `mv` trỏ tới một thư mục đã có, tên file giữ nguyên nhưng vị trí thay đổi.
```

**Không nhìn lại:** khi muốn giữ bản gốc cấu hình, dùng thao tác nào? Chứng minh bằng output nào?

```teaching
SHOW KEY POINTS — file
Copy giữ nguồn; move đổi tên/vị trí; remove bỏ file được chỉ định. Kiểm `pwd` và tên trước khi thay đổi; dùng `cat`/`ls` để kiểm kết quả, không suy từ việc lệnh im lặng.
```

## 3. Ai được làm gì? — permission, owner, group · 10 phút

Một máy có thể có nhiều tài khoản. Bạn muốn người khác đọc tài liệu chung nhưng không sửa cấu hình riêng. Cần hai câu hỏi tách biệt: **ai đang truy cập?** và **họ được làm gì?**

[Owner](/glossary#owner) là tài khoản sở hữu file; [group](/glossary#group) là nhóm tài khoản được gắn với file. **Mental model:** hàng ngang là nhóm người, cột là hành động. Giới hạn: ví dụ này chỉ xét quyền Linux cơ bản, không xét các cơ chế quyền bổ sung; user quản trị có thể vượt nhiều hạn chế.

**Technical Definition:** [permission](/glossary#permission) là các bit quyền `r` (read/đọc), `w` (write/ghi), `x` (execute/thực thi) cho owner, group, others (những người còn lại). Với quyền cơ bản: nếu bạn là owner thì dùng bộ owner; nếu không nhưng thuộc group của file thì dùng bộ group; nếu không thì dùng others. Không cộng cả ba bộ để lấy quyền rộng nhất.

```text
-rw-r-----
│└─┬┘└┬┘└┬┘
│ owner group others
file  rw-   r--   ---
```

Đọc ký tự đầu để biết loại (`-` file thường, `d` directory), sau đó chia chín ký tự thành ba nhóm. `-` trong nhóm nghĩa là không có quyền tương ứng.

| Cặp | Ý nghĩa |
| --- | --- |
| owner / group | Một tài khoản sở hữu / một nhóm; tên này không phải hành động |
| `r` / `w` / `x` trên file | Đọc nội dung / sửa nội dung / yêu cầu chạy file như chương trình |
| `r` / `w` / `x` trên directory | Liệt kê tên / thay đổi entries (thường cần thêm `x`) / đi qua và truy cập tên đã biết |

Xóa file thường phụ thuộc quyền trên **thư mục chứa nó**, không đơn giản là bit `w` của file. Không thử thay quyền thư mục hệ thống.

**Commands / Config — mini experiment:**

```bash
cd ~/dx-lab-practice/week1/m2
id
chmod 640 original.txt
ls -l original.txt
stat -c '%U %G %A %a %n' original.txt
```

| COMMAND | WHY / thành phần | EXPECTED OUTPUT → diễn giải | COMMON FAILURE / verify |
| --- | --- | --- | --- |
| `id` | Hỏi tài khoản đang chạy và các nhóm | `uid` là mã user, `gid` là mã nhóm chính, `groups` là danh sách nhóm; tên trong ngoặc giúp đối chiếu | Nếu user là root, mở Ubuntu bằng tài khoản thường trước lab quyền |
| `chmod 640 original.txt` | [chmod](/glossary#chmod) đổi mode/quyền; mỗi chữ số dành cho owner/group/others | `r=4`, `w=2`, `x=1`: 6=4+2 đọc ghi, 4 chỉ đọc, 0 không quyền | `Operation not permitted` → kiểm owner bằng `ls -l`, chỉ sửa file do mình tạo |
| `ls -l original.txt` | Xem mode và owner/group trước tên | Mode thường là `-rw-r-----`; tên owner/group tùy máy | Path sai → `pwd`, `ls`; verify bằng `stat` |
| `stat -c '%U %G %A %a %n' original.txt` | `-c` chọn định dạng: user, group, mode chữ, mode số, tên | Tìm `640` và `-rw-r-----`; không cần nhớ cả dòng | Đây là GNU stat trên Ubuntu; không chép sang PowerShell |

**Dự đoán:** với owner `rw-`, `cat original.txt` có đọc được không? Chạy và giải thích chọn bộ quyền nào. Trong DX-Lab, đọc owner/mode giúp giải thích permission error trước khi tăng quyền bừa.

```teaching
TÔI CHƯA HIỂU — ba bộ quyền
Hãy che group và others khi bạn chính là owner. Chỉ nhìn ba ký tự owner: `rw-` cho đọc/ghi, thiếu chạy. Bảng quyền giống danh sách “người nào được làm việc nào”, không phải ba chìa khóa bạn gom chung. Chạy `id` rồi so tên với `ls -l original.txt`; đó là bước chọn đúng hàng trước khi đọc quyền.
```

**Không nhìn lại:** 640 cho ai ghi? Vì sao thêm quyền cho others không phải cách sửa mặc định?

```teaching
SHOW KEY POINTS — quyền
Owner được đọc/ghi; group đọc; others không có quyền trên file. Quyền tối thiểu nghĩa là chỉ cấp thao tác thật sự cần. `chmod` không đổi owner hay mã hóa dữ liệu.
```

## 4. Vì sao đọc được script mà chưa chạy được? · 8 phút

Một file có thể chứa chỉ dẫn nhưng hệ điều hành chưa cho phép chạy trực tiếp. [Program](/glossary#program) là tập chỉ dẫn; script là file chữ chứa chỉ dẫn được chương trình khác đọc và thực hiện. Bash vừa là shell vừa có thể đọc script. “Chạy” khác “đọc chữ lên màn hình”.

**LAB mini có lỗi an toàn:** tạo file mới `hello.sh` trong `m2`. Dùng đúng các dấu nháy dưới đây; không lấy script lạ về chạy.

```bash
echo '#!/bin/bash' > hello.sh
echo 'echo "Xin chao SV1"' >> hello.sh
chmod 600 hello.sh
cat hello.sh
./hello.sh
ls -l hello.sh
chmod u+x hello.sh
./hello.sh
ls -l hello.sh
```

**WHY / giải nghĩa:** nháy đơn giữ nguyên chữ để ghi vào file; dòng đầu `#!/bin/bash` chỉ chương trình đọc script khi chạy trực tiếp. `./hello.sh` chỉ file ở hiện tại (shell không tự tìm mọi lệnh trong thư mục hiện tại). `chmod 600` cho owner đọc/ghi; `u+x` thêm execute cho owner, giữ các bit khác.

**EXPECTED OUTPUT:** `cat` đọc được hai dòng, lần chạy đầu báo `Permission denied`, sau `u+x` in `Xin chao SV1`; mode sau là `-rwx------` (700). **Dự đoán trước lần chạy đầu:** việc nhìn thấy nội dung có chứng minh chạy được không?

**COMMON FAILURE:** nếu vẫn lỗi sau `u+x`, kiểm vị trí, mode và dòng đầu bằng `cat`. File soạn trong Windows có thể có kiểu xuống dòng CRLF khác Linux LF, gây lỗi interpreter; tạo lại **file lab** bằng hai lệnh `echo` trong Ubuntu để thử giả thuyết đó. Không dùng `chmod 777` để che lỗi.

**Giới hạn mô hình:** `bash hello.sh` yêu cầu Bash đọc file và có thể chạy khi không có bit `x`; bỏ `x` không phải hàng rào chống ai đọc rồi thực hiện code. Trong DX-Lab, script khởi động cần đúng cách gọi và quyền; không phải mọi `Permission denied` đều chỉ thiếu `x`.

```teaching
TÔI CHƯA HIỂU — đọc và chạy
`cat hello.sh` giống đọc to tờ hướng dẫn; `./hello.sh` yêu cầu làm theo nó. Chữ `echo` chỉ hiện thành chữ khi dùng `cat`, nhưng tạo lời chào khi script thực thi. Thử hai lệnh lần lượt rồi mô tả khác biệt mà không dùng từ “execute”.
```

## 5. Cấu hình đi vào chương trình thế nào? · 10 phút

Bạn muốn cùng một chương trình chạy ở chế độ học hoặc demo mà không sửa mã nguồn. Ta đưa một giá trị có tên từ bên ngoài. [Environment variable](/glossary#environment-variable) là cặp tên/giá trị trong môi trường mà chương trình nhận khi bắt đầu.

**Giải thích cực dễ / mental model:** trước khi giao việc, đưa người làm một phiếu “STAGE=practice”. Giới hạn: đó là bản cấu hình được truyền lúc khởi chạy, không phải bảng thông báo tự cập nhật mọi chương trình đang chạy.

Để hiểu “nhận”, cần một cầu nối ngắn: program là chỉ dẫn được lưu; **process** là một lần program đang chạy. Shell hiện tại cũng là process; khi nó khởi động chương trình khác, ta gọi chương trình mới là process con. [Mission 3](/learn/week-01/mission-03) sẽ cho bạn nhìn PID của chúng. Chưa cần biết PID để làm thử nghiệm này.

```text
shell: DXLAB_STAGE=practice
          │ export, rồi bắt đầu chương trình
          ▼
printenv (process con): nhận DXLAB_STAGE=practice

.env (file chữ) ── cần công cụ đọc/nạp ──► môi trường của app
```

Đọc mũi tên: giá trị phải được đưa qua ranh giới khởi động; chỉ có file trên disk chưa tạo ra mũi tên đó.

**Dự đoán:** tạo `.env` có làm `printenv` đọc được ngay không?

```bash
cd ~/dx-lab-practice/week1/m2
unset DXLAB_STAGE
echo 'DXLAB_STAGE=from-file' > .env
ls
ls -la
cat .env
printenv DXLAB_STAGE
DXLAB_STAGE=practice
printenv DXLAB_STAGE
export DXLAB_STAGE
printenv DXLAB_STAGE
export DXLAB_STAGE=demo
printenv DXLAB_STAGE
unset DXLAB_STAGE
printenv DXLAB_STAGE
```

**COMMAND / WHERE TO RUN:** cùng tab Ubuntu, thư mục `m2`. `unset` bỏ biến khỏi shell này, dùng tên lab riêng để không chạm cấu hình thật. `NAME=value` gán biến shell, không có khoảng trắng quanh `=`; chưa `export` thì process con không nhận biến mới. `export NAME` đánh dấu truyền biến cho con; `export NAME=value` gán và export cùng lúc. `printenv NAME` chỉ in biến đó trong môi trường chương trình con, không in toàn bộ cấu hình máy.

**EXPECTED OUTPUT:** các lần đầu sau tạo file và gán chưa export không in gì (biến chưa có trong môi trường con); sau export in `practice`, rồi `demo`; sau unset lại không có dòng. `cat .env` vẫn cho `from-file`. `ls` thường ẩn `.env`, `ls -la` hiện nó.

**Technical Definition:** file có tên bắt đầu dấu chấm là [hidden file](/glossary#hidden-file) theo quy ước liệt kê; đây không phải quyền truy cập. `.env` là quy ước file cấu hình; app/công cụ phải đọc nó. Compose dùng `.env` cho thay thế giá trị trong cấu hình; muốn vào môi trường container còn cần khai báo phù hợp. Không tự chạy `source .env` với file không tin cậy: shell có thể thực hiện lệnh bên trong.

**COMMON FAILURE / verify:** biến không thấy trong tab Ubuntu khác là bình thường vì tab đó không phải con vừa được shell này khởi động. Nếu bước “chưa export” đã in giá trị, chạy lại từ `unset`; variable có thể được export trong lần thử cũ. Đọc lại `.env` để chứng minh sửa environment không sửa file.

```teaching
TÔI CHƯA HIỂU — biến và file .env
Tờ giấy ghi “đèn xanh” không tự bật đèn. `.env` cũng chỉ có chữ. `cat .env` chứng minh tờ giấy tồn tại; `printenv DXLAB_STAGE` hỏi chương trình vừa chạy được trao giá trị gì. Trong thử nghiệm, hai câu trả lời khác nhau vì bạn chưa dùng công cụ đọc file để nạp biến. Đừng đồng nhất việc lưu chữ và việc truyền cấu hình.
```

**Không nhìn lại:** vì sao cần environment? So sánh file `.env` và giá trị `demo` vừa export; dùng ở DX-Lab để làm gì?

```teaching
SHOW KEY POINTS — environment
Cấu hình có thể thay đổi mà không sửa code. File phải được đọc có chủ đích; export áp dụng cho chương trình con bắt đầu sau đó. Đổi shell không cập nhật ngược app đang chạy, và không tự sửa `.env` trên disk.
```

## 6. Hidden không có nghĩa secret — Git bridge · 10 phút

**Secret** là giá trị cho phép truy cập, như mật khẩu/token (chuỗi thay cho thông tin đăng nhập). Tên `.env` không tự giữ bí mật. `chmod 600` giới hạn truy cập Linux thông thường nhưng không mã hóa, không thu hồi bản đã sao chép, không ngăn bạn tải nó lên mạng.

Để làm được bài mà chưa học Git đầy đủ: **Git** ghi lịch sử thay đổi trong một repository. **Commit** lưu một mốc lịch sử; **tracked** nghĩa file đã được Git quản lý. `.gitignore` chứa các mẫu tên Git nên bỏ qua khi xét file chưa tracked. Nó không tự loại file đã tracked và không phải hàng rào bảo mật.

**Guided mini experiment:** chỉ khởi tạo repo test mới trong `m2/secret-demo`; không cần tài khoản GitHub, không commit/push. Nếu thư mục này đã có repo thật, chọn thư mục lab mới.

```bash
mkdir -p ~/dx-lab-practice/week1/m2/secret-demo
cd ~/dx-lab-practice/week1/m2/secret-demo
git init
echo 'DXLAB_STAGE=' > .env.example
echo 'DXLAB_STAGE=practice' > .env
echo '.env' > .gitignore
git check-ignore .env
git status --short
```

**WHY:** `git init` tạo vùng lịch sử `.git` ở đây. `.env.example` chỉ ghi tên cấu hình, không giá trị nhạy cảm. `git check-ignore .env` hỏi quy tắc có bỏ qua file không. `git status --short` liệt kê thay đổi dạng ngắn; `??` là chưa tracked.

**EXPECTED OUTPUT:** `check-ignore` in `.env`; `status` có `.env.example` và `.gitignore`, không liệt kê `.env`. Thông báo tên nhánh mặc định từ `git init` có thể khác máy. **COMMON FAILURE:** `not a git repository` → kiểm `pwd`, đã `git init` đúng nơi chưa. Nếu `command not found`, xem phần chuẩn bị công cụ dưới. **Verify:** `cat .gitignore` và chạy lại `check-ignore`; không coi file ẩn là bằng chứng ignore.

Nếu Git chưa có, trong **Ubuntu** chạy `sudo apt update` rồi `sudo apt install git`: `sudo` yêu cầu quyền quản trị cho riêng lệnh cài; `apt update` cập nhật danh sách gói, `apt install git` cài chương trình. Nhập mật khẩu Linux nếu hỏi; không hiện ký tự là bình thường. Sau đó `git --version` xác nhận có Git. Đây là bước chuẩn bị công cụ, không dùng sudo cho lab file/quyền.

Nếu secret thật đã công khai: **revoke** (thu hồi hiệu lực) hoặc **rotate** (thay secret mới và vô hiệu hóa cũ) với dịch vụ phát hành, cập nhật app dùng secret, kiểm secret cũ không còn dùng được. Xóa một dòng ở commit mới không xóa bản sao người khác đã lấy. Pilot chỉ mô phỏng bằng chữ `practice`; không đưa secret thật vào evidence.

## 7. TRONG DX-LAB, TÔI DÙNG THỨ NÀY Ở ĐÂU?

Sao chép `.env.example` thành cấu hình local, đọc owner/mode khi script báo lỗi, hạn chế người đọc backup, kiểm file trước khi đưa vào lịch sử Git. SV1 phối hợp với người viết app để biết app nạp biến bằng cách nào; không đoán rằng tên `.env` tự làm tất cả.

**SV1 CẦN BIẾT ĐẾN MỨC NÀO? — SV1 Level L2:** quản lý file lab, đọc owner/group/rwx, cấp đúng quyền cần, giải thích export/file và tránh công khai secret. Chưa cần các hệ thống quyền nâng cao, mã hóa chuyên sâu hay quản trị user toàn máy.

## 8. Lab ladder

### LAB 1 — GUIDED / Guided Lab

Làm lần lượt phần 2–6. Ghi bảng ba cột “dự đoán / output thật / vì sao”. Bắt buộc có: copy khác move; 600 → chạy lỗi → 700 chạy được; file `.env` khác environment; `git check-ignore .env` thành công trong repo test.

### LAB 2 — PARTIALLY GUIDED

Trong `m2/rehearsal`, tạo file chữ, giữ bản gốc và bản sao đổi tên. Cho owner đọc/ghi, group đọc, others không quyền. Tạo một biến `DXLAB_REHEARSAL` và chứng minh process con nhận nó, sau đó bỏ biến. Gợi ý: workshop file/quyền và export đủ; tự chọn lệnh kiểm mỗi kết quả. Chỉ xóa bản sao sau khi kiểm vị trí; giữ bản gốc.

### LAB 3 — INDEPENDENT / Independent Lab

Trong `m2/independent`, tự tạo script in một câu bạn chọn. Chứng minh đọc được nhưng ban đầu không chạy trực tiếp được; cấp đúng quyền để chạy, giữ group/others không có quyền. Tạo repo test ở thư mục này, file mẫu không secret và file local bị ignore. Viết giải thích vì sao “ẩn” và “đã ignore” vẫn không bảo vệ một secret từng công khai. **Đạt:** mode trước/sau, lời chào, ignore proof và lý do đều có evidence. Không cần commit.

```teaching
Gợi ý khi cần — independent
Script chỉ cần hai dòng như phần 4; dùng chính câu chào của bạn. Đối chiếu `id` với mode, chọn quyền owner; không cấp rộng cho mọi người. Repo test cần được khởi tạo trước khi kiểm ignore. Nếu thiếu nền tảng, làm lại lab 2 thay vì tìm một lệnh sửa tất cả.
```

Giữ file lab để đối chiếu; các biến lab có thể bỏ bằng `unset` như phần 5. Không xóa thư mục thật để cleanup.

## 9. BREAK IT — Failure Injection / Troubleshooting

Thêm một lỗi đọc file, tách khỏi lỗi chạy script. **WHERE TO RUN:** Ubuntu, tài khoản thường tại `m2`.

```bash
cd ~/dx-lab-practice/week1/m2
echo 'du lieu tap doc' > read-demo.txt
chmod 600 read-demo.txt
chmod u-r read-demo.txt
cat read-demo.txt
id
stat -c '%U %G %A %a %n' read-demo.txt
chmod u+r read-demo.txt
cat read-demo.txt
stat -c '%U %G %A %a %n' read-demo.txt
```

**Dự đoán trước `cat`:** bạn là owner nhưng chỉ còn `w`, có đọc được không? **EXPECTED OUTPUT:** lỗi `Permission denied`; mode trước sửa 200, sau sửa 600; cuối cùng đọc được câu. `u-r` bỏ read của owner; `u+r` khôi phục đúng bit đó. **COMMON FAILURE:** nếu vẫn đọc được khi mode 200, kiểm có chạy root hoặc file nằm trên ổ Windows không; không kết luận Linux bỏ qua permission.

| Protocol | Báo cáo mẫu cần thay bằng evidence thật |
| --- | --- |
| SYMPTOM | `cat read-demo.txt` báo Permission denied |
| EVIDENCE | `id`, owner và mode 200; lấy trước giả thuyết để biết ai/quyền nào |
| HYPOTHESIS | Owner thiếu read, không phải thiếu execute |
| TEST | Đối chiếu user với owner và ký tự read; chỉ đổi `u+r` trên file lab |
| RESULT | `cat` đọc được sau thay đổi một bit |
| ROOT CAUSE | Chính thao tác bỏ read đã chặn chủ file đọc nội dung |
| FIX | Giữ `u+r`, không mở quyền cho others |
| VERIFICATION | Đọc lại file; một lệnh chmod thành công chưa chứng minh app đọc được |
| REGRESSION | `stat` vẫn 600, script phần 4 vẫn chạy, repo test vẫn ignore `.env`; fix không được mở quyền ngoài dự kiến |

## 10. NGƯỜI MỚI THƯỜNG NHẦM — Common Beginner Errors

| Nhầm | Sửa cách hiểu |
| --- | --- |
| Permission là thuộc tính Hidden/Read-only của Windows | Linux kiểm tài khoản và các quyền thao tác; thí nghiệm trên home Linux |
| Owner/group là read/write | Hai trục: ai và làm gì |
| Execute luôn cần để đọc file | `cat` cần read; chạy trực tiếp script cần điều kiện thực thi phù hợp |
| `.env` tự thành biến | Phải có công cụ đọc/nạp; export không sửa file |
| Hidden = secure | `ls -a` thấy được; secret cần giới hạn truy cập và tránh công khai |
| Ignore xóa lịch sử secret | Ignore chủ yếu tác động file chưa tracked; bản công khai cần thu hồi hiệu lực |

## 11. Self-check Questions / Evidence Required / Quiz / PASS Gate

Không nhìn lại: vì sao cần quyền? So sánh owner/group với rwx, export với file, hidden với secure. Tại sao `chmod 777` không sửa được việc secret đã lộ?

```teaching
SHOW KEY POINTS — tự giải thích
Quyền kiểm ai được làm gì với file; 777 mở đọc/ghi/chạy cho cả ba nhóm. File cấu hình không tự biến thành environment. Dấu chấm và Git ignore không thu hồi bản sao secret; revoke/rotate mới làm giá trị cũ mất tác dụng.
```

Nộp `terminal-output`: file lifecycle, mode/script trước và sau lỗi, export/printenv, ignore proof. Nộp `explanation`: chọn bộ quyền bằng `id`, giải thích secret và một báo cáo chín bước có regression. Quiz 10 câu ở bảng Gate ≥70%; chỉ đánh dấu Learn/Practice/Build/Break/Debug sau khi làm thật. **PASS Gate** cần Mission 1 PASS, đủ hai loại evidence, quiz đạt và chốt hard gate. Engine không đổi.

**SAU BÀI NÀY BẠN CÓ THỂ:** copy/move/delete file lab an toàn; đọc/sửa quyền tối thiểu; tạo script nhỏ; quan sát cấu hình được truyền; phân biệt hidden/ignore/secret. Tiếp theo [Mission 3 — xem chương trình đang chạy](/learn/week-01/mission-03).

### GIẢI THÍCH CHO MỘT NGƯỜI CHƯA HỌC IT

Dùng 3–5 câu giải thích “quyền Linux bảo vệ điều gì”. Nêu một ví dụ ai được đọc, ai được sửa, và một giới hạn: quyền file không thu hồi được bản đã công khai.


### Kiểm tra hành động bằng DX-Verify — pilot V3

Sau lab, tạo chỗ giữ bằng chứng trong **WSL / Ubuntu**:

```bash
mkdir -p ~/dx-lab-practice/week1/m2/evidence
```

`-p` tạo thư mục nếu thiếu; thường không in gì. Kiểm bằng `ls -ld ~/dx-lab-practice/week1/m2/evidence`: `-d` xem chính thư mục, không liệt kê bên trong. Dòng bắt đầu `d` cho biết đó là directory. Nếu lỗi, kiểm từng cấp path bằng `pwd` và `ls` trước khi thử lại.

Giữ file đã làm ở lab: `m2/original.txt` có nội dung và script `m2/hello.sh` ở mode 700 sau phần 4. Không dùng file .env hay secret làm đầu vào verifier.

**Chạy ở đâu:** Ubuntu, từ thư mục repository Training OS (thư mục chứa `scripts/dx-verify.py`), không phải từ thư mục bài tập. Nếu repo nằm ở ổ D như bản cài này, dùng `cd "/mnt/d/DX OS/my_web_dx_lab_student_lead"`; dấu nháy giữ đường dẫn có khoảng trắng. `ls scripts/dx-verify.py` kiểm đúng file trước khi chạy. Nếu repo ở nơi khác, dùng đường dẫn thật của repo; không đoán.

```bash
python3 scripts/dx-verify.py week-01 mission-02
```

`python3` chạy script verifier của repo; hai đối số chọn đúng tuần/bài. Script chỉ xem metadata (loại file, kích thước, quyền) tại các đường dẫn lab cố định; không đọc nội dung file, không chạy script bạn viết và không gửi dữ liệu qua mạng. Không dùng sudo. Nếu `python3` chưa có, xem bước chuẩn bị công cụ trong [Mission 3](/learn/week-01/mission-03#section-1).

**Đọc kết quả:** `checks` là từng phép kiểm; `status: pass` là thấy dấu vết mong đợi; `fail` là thiếu hoặc khác trạng thái yêu cầu. `overall` chỉ pass khi mọi check pass. Lệnh trả mã 1 nếu có fail — đó là kết quả kiểm, không phải yêu cầu cài lại máy. Kiểm file tương ứng bằng `ls` / `stat`, sửa đúng bài tập rồi chạy lại. Không sửa JSON để đổi fail thành pass.

Copy toàn bộ JSON từ dấu `{` đến `}` vào **DX-Verify · Action evidence** ở cuối trang, chọn **Lưu verification report**. Report không chứa tên tài khoản, path tuyệt đối, PID hay nội dung file. Đây là báo cáo tự nộp từ máy bạn, có thể bị sửa; nó không thay thế output thật, tự giải thích, quiz hay gate. Verifier không chứng minh nguyên nhân lỗi hoặc bạn đã tự làm.

**Nhớ lại ngày mai:** vào [Today](/today), trả lời warm-up trước khi mở đáp án. Nếu chưa nhớ, chọn 1 ngày; nếu khó, 3 ngày; nhớ đúng liên tiếp được hẹn 7 → 14 → 30 ngày. Không cần ôn nội dung chưa học.
