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

## 1. TRƯỚC KHI HỌC BÀI NÀY

- [ ] Biết vị trí/path và tạo file từ [Mission 1](/learn/week-01/mission-01#section-5).
- [ ] Hiểu program/script, quyền đọc/chạy và cấu hình truyền cho process con từ [Mission 2](/learn/week-01/mission-02#section-4).
- [ ] Mở được **hai tab Ubuntu cùng bản WSL**, gọi là A và B. Không dùng tab PowerShell làm B.

Mọi bash dưới đây chạy trong **WSL / Ubuntu**, tài khoản thường. Không tác động server dự án thật. Chỉ phục vụ file giả ở `~/dx-lab-practice/week1/m3`; không đặt secret trong đó. Docker Desktop không cần chạy.

Kiểm công cụ trong Ubuntu, bất kỳ thư mục nào:

```bash
python3 --version
curl --version
```

`--version` in phiên bản để xác nhận chương trình có sẵn, không yêu cầu trùng số trong sách. Python chạy chỉ dẫn; curl gửi yêu cầu lấy dữ liệu từ một địa chỉ. Nếu `command not found`, trong Ubuntu chạy `sudo apt update` rồi `sudo apt install python3 curl procps`. `sudo` cấp quyền quản trị cho bước cài, `apt update` làm mới danh sách gói, `apt install` cài; `procps` cung cấp `ps`, `top`, `free`. Nhập mật khẩu Linux khi hỏi, kiểm lại hai lệnh version. Không dùng sudo cho server/kill lab.

**Mục tiêu:** tìm đúng lần chạy, kiểm hành vi/log/tài nguyên, dừng an toàn và chứng minh dịch vụ hồi phục. Học từng chặng 5–12 phút, nghỉ sau mỗi thí nghiệm.

[THEO KẾ HOẠCH CÔ] Process/log/resource thuộc nền Linux và troubleshooting. [KIẾN THỨC MỞ RỘNG ĐỂ SV1 HỌC/DEBUG TỐT HƠN] Server cục bộ là mô hình bổ sung để nhìn thấy vòng đời. [PROJECT-DEFINED / TBD] Cổng 8765 chỉ là lựa chọn lab, không phải cổng backend chính thức.

[Process/PID](#section-2) · [Service/HTTP](#section-3) · [Logs](#section-4) · [Tài nguyên](#section-5) · [Ba lab](#section-7) · [Break/debug](#section-8) · [Từ điển](/glossary).

## 2. File chương trình chưa làm việc — Giải thích cực dễ · 8 phút

Một file Python nằm trên ổ đĩa chưa trả lời ai. Khi bắt đầu chạy, hệ điều hành phải dành bộ nhớ, theo dõi công việc và biết đang quản lý lần chạy nào. Nếu bạn chạy cùng chương trình hai lần, phải phân biệt được chúng để dừng đúng một lần.

**Ví dụ đời thường / mental model:** program là công thức, process là một đầu bếp đang làm theo công thức. Hai đầu bếp có cùng công thức nhưng bàn làm việc khác nhau. Giới hạn: process có thể đang đợi thay vì liên tục tính toán; không phải cứ tồn tại là chiếm đầy CPU.

**Technical Definition:** [program](/glossary#program) là tập chỉ dẫn; [process](/glossary#process) là một instance (một lần đang hoạt động) của program, có tài nguyên và trạng thái riêng. [PID](/glossary#pid), Process ID, là số hệ điều hành dùng nhận diện process trong phạm vi môi trường process đang quan sát. PID có thể được tái sử dụng sau khi process kết thúc.

```text
PROGRAM trên disk
      │ bắt đầu chạy
      ▼
PROCESS
  ├── PID: số nhận diện lần chạy
  ├── memory: vùng nhớ làm việc
  ├── open files: file đang mở
  └── trạng thái: đang chạy / đang đợi / đã kết thúc
```

Đọc từ trên xuống: file không biến mất khi tạo process. Nhánh là những thứ hệ điều hành theo dõi, không phải file con của chương trình.

**Mini experiment · hai tab, không cần server ngay:** trong tab A chạy:

```bash
sleep 300
```

`sleep 300` đợi 300 giây rồi kết thúc. **WHERE TO RUN:** A, bất kỳ thư mục. **WHY:** tạo process ít hoạt động để dễ nhìn. **EXPECTED OUTPUT:** không in chữ, dấu nhắc chưa quay lại vì shell đang đợi lệnh hoàn thành. Đây là **foreground** (chạy gắn với lượt lệnh hiện tại). Dự đoán: không in chữ có nghĩa không tồn tại không?

Trong B chạy:

```bash
ps aux
```

`ps` chụp danh sách process tại thời điểm chạy. `a`, `u`, `x` là kiểu tùy chọn của procps để xem rộng hơn và hiển thị theo user. **EXPECTED OUTPUT:** tìm dòng COMMAND có `sleep 300`; nếu hết 300 giây, nó đã kết thúc, chạy lại từ A nếu cần.

| Cột | Đọc để làm gì |
| --- | --- |
| USER | Tài khoản nào sở hữu process; tránh tác động người khác |
| PID | Số chọn process, không phải cổng mạng |
| %CPU | CPU là bộ xử lý thực hiện chỉ dẫn. Đây là tỷ lệ thời gian CPU trung bình trong đời process ở `ps`; không phải ảnh tức thời hoàn hảo |
| %MEM | Tỷ lệ bộ nhớ vật lý process đang chiếm theo cách công cụ đo; không phải dung lượng disk |
| COMMAND | Lệnh/đối số giúp nhận diện đúng công việc |

Quay lại A, nhấn **Ctrl+C**: shell gửi yêu cầu ngắt SIGINT cho nhóm foreground. Chạy `ps aux` ở B lần nữa để kiểm dòng biến mất. **COMMON FAILURE:** nhiều `sleep 300` giống nhau → không đoán PID rồi kill; Ctrl+C tại A chỉ kết thúc công việc foreground mình vừa tạo. Trong DX-Lab, PID/command/user giúp phân biệt backend thử nghiệm với chương trình khác.

```teaching
TÔI CHƯA HIỂU — program và process
Một bản nhạc trên giấy vẫn còn khi người chơi ngừng đàn. Tương tự, Ctrl+C dừng `sleep`, không xóa chương trình sleep. Gõ lại `sleep 300` ở A: một lần chạy mới xuất hiện, thường có PID mới. Kiểm ở B rồi Ctrl+C ở A để kết thúc. Không hoạt động mạnh vẫn có thể là process đang đợi.
```

**Không nhìn lại:** vì sao cần PID? Vì sao dừng process không xóa program?

```teaching
SHOW KEY POINTS — process
Program là chỉ dẫn được lưu; process là lần chạy có trạng thái/tài nguyên riêng. PID nhận diện lần chạy, có thể tái sử dụng; luôn kiểm command/user trước khi gửi signal. Một snapshot không chứng minh app khỏe.
```

## 3. Process làm việc cho người khác — service và health · 10 phút

Bạn muốn một chương trình luôn sẵn sàng trả file khi có yêu cầu, không phải mở lại cho mỗi người hỏi. Đó là cách nghĩ về [service](/glossary#service): chức năng phục vụ yêu cầu, thường do một hay nhiều process chạy lâu đảm nhiệm. Service manager là chương trình quản lý start/stop/restart, ví dụ systemd; không phải mọi process đều là service và không phải mọi service đều dùng systemd.

**Networking bridge chỉ đủ cho lab:** server là bên trả lời; client là bên hỏi. HTTP là cách hai bên trao đổi yêu cầu/phản hồi web. Địa chỉ `127.0.0.1` quay lại chính môi trường mạng hiện tại (loopback). **Port** là số điểm nhận yêu cầu; `8765` chọn điểm nhận của server lab, không phải PID. `--bind 127.0.0.1` giới hạn server vào loopback. “Listen” nghĩa đang chờ kết nối tại địa chỉ/cổng đó. Không cần học mạng sâu trước khi quan sát.

```text
Tab B: curl (client)
      │ HTTP tới 127.0.0.1:8765
      ▼
Tab A: Python process (server)
      │ đọc file ở thư mục lab
      ▼
Phản hồi: mã trạng thái + nội dung
```

Mũi tên là yêu cầu/trả lời; số cổng chỉ nơi gửi đến, PID chỉ ai đang chạy. Trong WSL/Windows/container, loopback có phạm vi khác nhau; dùng cả hai tab trong cùng Ubuntu để loại biến số này.

**COMMAND / WHERE TO RUN:** tab A trong Ubuntu. Nếu đã có dữ liệu cá nhân tại file lab này, dùng một thư mục lab mới trước khi ghi.

```bash
mkdir -p ~/dx-lab-practice/week1/m3
cd ~/dx-lab-practice/week1/m3
echo 'SV1 local server works' > index.html
python3 -m http.server 8765 --bind 127.0.0.1
```

**WHY:** `python3 -m http.server` chạy module server file có sẵn của Python; `8765` là cổng lab; `--bind` chỉ địa chỉ nhận. `index.html` là file server trả khi hỏi đường dẫn `/`; nội dung chữ đơn giản cũng đủ cho thí nghiệm. Server này chỉ dùng luyện tập, không dùng cho production.

**EXPECTED OUTPUT:** dòng báo đang phục vụ HTTP; dấu nhắc A chưa quay lại. Trong **tab B**:

```bash
curl -i --max-time 3 http://127.0.0.1:8765/
```

`-i` hiện cả header (thông tin phản hồi trước dòng trống); `--max-time 3` giới hạn chờ 3 giây; URL gồm `http://`, địa chỉ, dấu `:` trước cổng, `/` là tài nguyên đang hỏi. **EXPECTED OUTPUT:** dòng trạng thái có `200` và sau header là câu `SV1 local server works`. Phiên bản HTTP/header/thời gian tùy máy. 200 nghĩa yêu cầu này thành công, không chứng minh mọi tính năng dự án.

**COMMON FAILURE:** `Address already in use` ở A nghĩa cổng đã được dùng. Không kill chủ cổng chưa biết; chọn cổng lab khác như 8766 và thay **mọi** lệnh server/curl/nhận diện tương ứng. `curl: (7)` không kết nối được → kiểm A có còn chạy và hai bên dùng đúng cổng. **Verify:** dùng cùng URL; đọc phản hồi chứ không chỉ nhìn PID.

**Dự đoán:** server còn sống nhưng hỏi file không có sẽ thế nào? Trong B:

```bash
curl -i --max-time 3 http://127.0.0.1:8765/missing-demo.txt
```

Nếu chưa tạo file này, nhận **404**: đã tới server nhưng tài nguyên không có. So sánh 200 ở `/` và 404 ở tên sai. Curl ở đây không dùng `-f`, nên HTTP 404 vẫn có thể là một lần truyền thành công của curl. **Running** chỉ nói process tồn tại; **healthy** nói kiểm tra sức khỏe đã chọn đang đạt; **functional** nói hành vi người dùng cần thực sự đạt. Một 200 ở `/` chỉ chứng minh test nhỏ của lab.

```teaching
TÔI CHƯA HIỂU — running và healthy
Cửa hàng mở cửa chưa bảo đảm món bạn muốn còn bán. PID hiện diện giống cửa đang mở; curl hỏi đúng món. Thử `/`, rồi `/missing-demo.txt`, thấy cùng process có thể trả hai kết quả khác nhau. 404 không phải bằng chứng server chết; không có kết nối mới là một triệu chứng khác cần kiểm.
```

**Không nhìn lại:** service khác process thế nào? PID khác port ở đâu? Vì sao cần hỏi đúng URL trong DX-Lab?

```teaching
SHOW KEY POINTS — service
Process là lần chạy; service là chức năng phục vụ có thể gồm nhiều process. Port giúp client chọn điểm nhận; PID giúp hệ điều hành chọn process. Đang tồn tại, vượt healthcheck và làm đúng nghiệp vụ là các bằng chứng khác nhau.
```

## 4. Commands / Config — log, grep và tail · 10 phút

Lỗi vừa xảy ra đã biến mất khỏi màn hình; bạn cần dấu vết để biết yêu cầu nào và thời điểm nào liên quan. [Log](/glossary#log) là bản ghi sự kiện do chương trình tạo. **Mental model:** nhật ký ca làm. Giới hạn: nhật ký có thể thiếu, chậm hoặc ghi thông tin chưa đủ; dòng ERROR không tự chứng minh nguyên nhân gốc.

Ở A, quan sát dòng có `GET /` và mã 200 hoặc 404 sau các lần curl. `GET` là phương thức HTTP xin đọc dữ liệu; dấu thời gian giúp nối với lúc bạn thử. Không cần thuộc mọi header.

Để lưu log vào file, nhấn Ctrl+C trong **A**, rồi khởi động lại ở cùng thư mục `m3`:

```bash
python3 -u -m http.server 8765 --bind 127.0.0.1 > server.log 2>&1
```

**WHY / Thành phần mới:** `-u` yêu cầu Python xuất chữ không giữ trong bộ đệm chờ (unbuffered). `>` chuyển đầu ra thông thường vào `server.log`, **ghi đè log cũ**; hãy lưu đoạn evidence cũ trước khi chạy lại nếu cần. `2>` nói về luồng lỗi (stderr); `2>&1` đưa nó vào cùng nơi với luồng đầu ra thường (stdout). Log HTTP của Python có thể nằm ở stderr nên chỉ `>` chưa đủ. A không hiện dòng phục vụ vì chữ vào file; kiểm bằng curl và log, không đoán treo.

Trong **B**:

```bash
cd ~/dx-lab-practice/week1/m3
curl -i --max-time 3 http://127.0.0.1:8765/
curl -i --max-time 3 http://127.0.0.1:8765/missing-demo.txt
tail -n 5 server.log
grep '404' server.log
```

| COMMAND | WHY / EXPECTED OUTPUT | COMMON FAILURE → verify |
| --- | --- | --- |
| `tail -n 5 server.log` | Xem tối đa 5 dòng cuối, `-n` chọn số dòng; thấy sự kiện mới gần cuối | File ít hơn 5 dòng thì in ít hơn; sai path → `pwd`, `ls` |
| `grep '404' server.log` | Lọc các dòng chứa mẫu 404, không mặc định chỉ đọc cuối file | Không in gì có thể không có mẫu, không phải file rỗng; so với `tail` và curl |
| `grep '404' server.log \| tail -n 2` | Dấu pipe `\|` chuyển chữ đầu ra grep làm đầu vào tail; lấy hai dòng khớp cuối | Lọc số 404 có thể khớp chỗ khác; đối chiếu dòng request và thời điểm |

Khi thực hiện dòng kết hợp, gõ đúng lệnh dưới đây (dấu `|` không có dấu gạch chéo):

```bash
grep '404' server.log | tail -n 2
```

**Dự đoán:** `tail -n 2 server.log` có luôn là hai lỗi gần nhất không? Không nếu cuối file có các dòng thành công. **Verify:** đối chiếu thứ tự và nội dung dòng; log nói tài nguyên không tồn tại, chưa nói lý do người dùng nhập sai tên.

```teaching
TÔI CHƯA HIỂU — grep khác tail
Tạo mẫu nhỏ trong B tại `m3` bằng `echo 'ERROR first' > filter-demo.log`, rồi `echo 'INFO last' >> filter-demo.log`. `tail -n 1 filter-demo.log` chọn vị trí cuối nên hiện INFO; `grep ERROR filter-demo.log` chọn nội dung nên hiện ERROR. Bạn đã đổi tiêu chí lựa chọn, không đổi file. Các từ INFO/WARN/ERROR thường chỉ mức thông tin/cảnh báo/lỗi, nhưng định dạng do ứng dụng quyết định.
```

**Không nhìn lại:** vì sao lấy log trước restart, grep khác tail thế nào, đâu là giới hạn của dòng lỗi?

```teaching
SHOW KEY POINTS — log
Log giữ dấu vết giúp nối thời điểm, request và kết quả. Grep chọn nội dung, tail chọn phần cuối; pipe nối hai thao tác. Restart hoặc ghi đè log có thể mất bằng chứng, nên lưu đoạn liên quan trước; không paste token/secret.
```

## 5. Chậm vì đang tính, thiếu chỗ làm hay hết chỗ cất? · 10 phút

Bạn thấy app chậm; “máy yếu” quá mơ hồ để chọn bước kiểm. Ta chia ba tài nguyên:

| Tài nguyên | Vấn đề giải quyết / mental model | Technical Definition / giới hạn |
| --- | --- | --- |
| [CPU](/glossary#cpu) | Ai thực hiện phép tính? Giống người thao tác | Bộ xử lý thực hiện chỉ dẫn; phần trăm cao không tự là lỗi |
| [RAM](/glossary#ram) | Để dữ liệu đang làm ở đâu? Giống bàn làm việc | Bộ nhớ làm việc nhanh; dữ liệu thường không còn sau tắt máy. Không phải mọi RAM “used” đều không thu hồi được |
| [Disk](/glossary#disk) | Giữ file sau khi dừng app ở đâu? Giống kho | Vùng lưu trữ bền hơn RAM; WSL có thể nhìn vùng đĩa ảo, không bằng trực tiếp toàn bộ ổ Windows |

**Mini experiment — dự đoán trước:** server nhỏ đang đợi yêu cầu có cần CPU cao không? Dừng server sau này có xóa `index.html` không?

Trong **B**, từ `m3`:

```bash
ps aux
top
free -h
df -h .
```

`top` là màn hình cập nhật process; nhấn **q** để thoát trước khi chạy `free`. **COMMAND / WHY:** `ps` là snapshot, `top` quan sát thay đổi; `free -h` xem bộ nhớ với đơn vị dễ đọc; `df -h .` xem dung lượng filesystem chứa thư mục hiện tại, `.` là nơi đang đứng.

Nếu muốn lưu một lần quan sát của top làm evidence: trong B chạy `top -b -n 1`. `-b` xuất chữ thường thay cho giao diện tương tác, `-n 1` chỉ lấy một lần rồi thoát. Output có thể dài; chỉ lưu phần tổng quan và dòng process liên quan. Kiểm PID/COMMAND khớp server; đây vẫn chỉ là một snapshot.

**EXPECTED OUTPUT và cách đọc:**

- Trong `top`, nhìn `%CPU`, `%MEM`, PID, COMMAND. Số có thể thay đổi và CPU có thể vượt 100% tùy số lõi/cách hiển thị. Không đặt ngưỡng “chuẩn” từ một lần nhìn.
- Trong `free`, dòng **Mem**: `total` tổng RAM môi trường thấy; `available` ước tính còn có thể cấp cho app mới mà chưa cần swap. `free` thấp riêng lẻ không đủ kết luận thiếu RAM vì Linux dùng RAM làm cache (giữ bản sao dữ liệu để đọc nhanh). Swap là vùng hỗ trợ chuyển bớt dữ liệu khỏi RAM; chưa cần cấu hình nó.
- Trong `df`, `Size` tổng, `Used` đã dùng, `Avail` còn, `Use%` tỷ lệ, `Mounted on` vị trí gắn vùng lưu trữ vào cây. `df` không đo RAM, cũng không chỉ tính dung lượng riêng thư mục `m3`.

**COMMON FAILURE / verify:** nếu `top` có vẻ “giữ terminal”, nhấn q. Ghi thời điểm và số thật rồi đo lại sau một curl; biến động nhỏ có thể do chương trình khác. Không cố làm đầy RAM/disk để thử. Nếu disk gần đầy, triệu chứng có thể là không ghi được log; nếu RAM cạn, app có thể bị hệ thống dừng (OOM = out of memory). Đây là giả thuyết cần log/số đo, không phải kết luận chỉ từ app chậm.

```teaching
TÔI CHƯA HIỂU — RAM và disk
Bạn đóng người đang viết nhưng trang giấy đã cất vẫn còn. Sau khi dừng server ở phần 8, `cat index.html` vẫn đọc được: file trên disk không biến mất theo process. `free -h` hỏi còn chỗ làm việc; `df -h .` hỏi còn chỗ lưu. Hai câu hỏi khác nhau nên phải có hai phép đo. Với CPU, quan sát một process đang đợi bằng `top`: tồn tại không có nghĩa luôn tính toán.
```

**Không nhìn lại:** log không ghi thêm được thì kiểm tài nguyên nào trước? CPU cao có đủ chứng minh root cause không?

```teaching
SHOW KEY POINTS — tài nguyên
CPU thực hiện, RAM chứa dữ liệu đang làm, disk giữ file. So baseline (mốc đo khi hoạt động bình thường) với khi có triệu chứng, kết hợp log. Không suy từ một snapshot rằng phải nâng máy hay kill process.
```

## 6. TRONG DX-LAB, TÔI DÙNG THỨ NÀY Ở ĐÂU?

Backend là chương trình xử lý yêu cầu phía máy chủ; process của nó có thể tồn tại nhưng truy cập dữ liệu lỗi. SV1 kiểm process, gọi hành vi/health đã định, đọc log đúng lúc và đo tài nguyên trước khi chuyển bằng chứng cho người phụ trách backend.

Docker container là môi trường chạy được cô lập; bên trong vẫn có process. PID nhìn trong container có thể khác PID nhìn từ bên ngoài. Không lấy PID trong bài WSL rồi áp vào Docker Desktop. systemd là một service manager phổ biến trên Ubuntu; WSL có thể dùng hoặc không dùng nó. Pilot không cần `systemctl`, không yêu cầu bật systemd để vượt gate. Vòng đời start/observe/stop/verify vẫn hữu ích khi học Compose sau.

**SV1 CẦN BIẾT ĐẾN MỨC NÀO? — SV1 Level L2:** nhận diện PID/user/command; xem CPU/RAM/disk; stop/start process của mình; đọc log; phân biệt process chết với HTTP lỗi. Chưa cần kernel scheduler (cách hệ điều hành chia lượt CPU), nội bộ hệ điều hành hay performance engineering nâng cao.

## 7. Lab ladder

### LAB 1 — GUIDED / Guided Lab

Làm phần 2–5 theo thứ tự. Lưu: một PID, phản hồi 200/404, log tương ứng, `free -h`, `df -h .`. Giữ server phần 4 chạy ở A để thực hiện phần 8. Ghi dự đoán ở từng bước trước output.

### LAB 2 — PARTIALLY GUIDED

Trong `m3`, tạo log tổng hợp `practice.log` có 6 dòng bằng các lệnh `echo` đã học, gồm INFO/WARN/ERROR, hai dòng cuối là INFO. Chỉ lấy **hai dòng ERROR gần nhất** mà không đọc toàn file lên màn hình. Gợi ý: lọc nội dung trước, chọn cuối sau. Ghi vì sao chỉ `tail` chưa đủ; kiểm lại với nội dung do chính bạn tạo. Đây là log giả để học lọc, không phải evidence sự cố thật.

### LAB 3 — INDEPENDENT / Independent Lab

Sau khi hoàn tất phần 8 và dừng server cũ, tạo `m3/independent` với file trang chủ có câu mới. Start server loopback ở cổng lab còn trống, tự tìm đúng PID, chứng minh trả nội dung đúng, lưu log. Dừng đúng process, chứng minh URL mất kết nối nhưng file vẫn còn. Khởi động lại, kiểm chức năng và tài nguyên, rồi dừng bằng Ctrl+C ở tab server. **Đạt:** có timeline trước/sau, output thật, giải thích PID khác port và một regression check; không cần lệnh chưa học.

```teaching
Gợi ý khi cần — independent
Hai tab cùng Ubuntu; thư mục server quyết định file phục vụ. Dùng workshop phần 3–5 và phần 8, thay đường dẫn/cổng nhất quán. Không gửi kill theo số cổng hoặc một PID cũ. Nếu cần đọc lại hướng dẫn, luyện lab 2 rồi thử độc lập lần nữa.
```

## 8. BREAK IT — Failure Injection / Troubleshooting · 12 phút

Bạn sẽ cố tình dừng **chỉ server lab** và xem triệu chứng từ phía client. [Signal](/glossary#signal) là thông báo hệ điều hành chuyển đến process; `kill` là lệnh gửi signal, không xóa file chương trình. **SIGTERM** yêu cầu kết thúc, cho chương trình cơ hội xử lý dọn dẹp nhưng không bảo đảm nó sẽ nghe. **SIGKILL** cưỡng chế, không cho xử lý dọn dẹp; không dùng trong lab. Ctrl+C trước đó gửi SIGINT, một loại ngắt khác.

**WHERE TO RUN:** B trong Ubuntu, A đang chạy server phần 4. **Dự đoán:** kill xong, curl nhận 404 hay không kết nối được?

```bash
ps aux | grep '[p]ython3 -u -m http.server 8765'
```

**WHY / Thành phần mới:** pipe đưa output ps cho grep; `[p]` là mẫu khớp đúng chữ p, nên tìm `python3` mà tránh khớp chính dòng grep có chữ `[p]ython3`. **EXPECTED:** một dòng có USER của bạn, PID và đúng các đối số `8765 --bind 127.0.0.1`. Nếu nhiều dòng hoặc không khớp, không kill; đối chiếu tab A, cổng và lệnh. Nếu A không còn chạy thì không dùng PID cũ.

Hai dòng sau là **mẫu**, không sao chép nguyên chữ PID. Thay `PID` bằng số vừa kiểm, ví dụ số trong cột PID của **chính server lab**; không dùng 8765 chỉ vì đó là port.

```bash
ps -p PID -o user,pid,args
kill -TERM PID
```

`ps -p` chọn PID, `-o` chọn cột user/pid/đầy đủ đối số để kiểm lần cuối. `kill -TERM` gửi SIGTERM cho số đó. **COMMON FAILURE:** `No such process` nghĩa PID không còn; kiểm A và tìm lại, không đoán số khác. `Operation not permitted` thường cho thấy không có quyền tác động; không thêm sudo. Chỉ tiếp tục khi đúng server do mình tạo.

Sau đó B chạy (vẫn thay PID cho `ps`):

```bash
ps -p PID -o user,pid,args
curl -i --max-time 3 http://127.0.0.1:8765/
cat index.html
tail -n 5 server.log
```

**EXPECTED:** không còn dòng process đó, A trả dấu nhắc, curl thường báo `(7)` failed to connect, file vẫn đọc được. Log cũ có thể **không** ghi “SIGTERM”; không bịa một dòng shutdown. Nếu curl vẫn thành công, có thể process chưa kết thúc hoặc server khác đã nhận cổng; thu evidence lại, không tăng signal mù.

```teaching
TÔI CHƯA HIỂU — kill không xóa chương trình
Đóng quầy phục vụ khiến khách không được trả lời, nhưng sổ hướng dẫn và file vẫn trên disk. Hãy đối chiếu `ps`, curl và `cat index.html`: mỗi lệnh kiểm một thứ khác nhau. SIGTERM là yêu cầu đóng quầy; ứng dụng có thể xử lý hoặc bỏ qua, nên phải kiểm kết quả sau lệnh.
```

**Khôi phục:** trong A tại `m3`, chạy lại lệnh server phần 4 nhưng dùng `>> server.log 2>&1` để **nối** log, giữ evidence cũ. Ở B gọi lại `/`, đọc log và kiểm PID mới bằng lệnh grep; không mặc định PID phải khác vì số có thể tái sử dụng.

| Protocol | Viết báo cáo có quan hệ nhân quả |
| --- | --- |
| SYMPTOM | Sau khi gửi TERM, URL lab không kết nối được; ghi thời điểm |
| EVIDENCE | PID/user/args trước và sau, curl, phần log liên quan; lấy trước giả thuyết để tránh đoán lỗi mạng |
| HYPOTHESIS | Không còn process nhận yêu cầu ở cổng lab |
| TEST | Đối chiếu A đã trả dấu nhắc, `ps` không còn server; start lại cùng cấu hình rồi gọi cùng URL |
| RESULT | Ghi curl trước/sau; nếu chưa 200 thì giả thuyết chưa đủ, kiểm log khởi động |
| ROOT CAUSE | Process lab kết thúc do signal mình gửi, không phải file chương trình bị xóa |
| FIX | Start lại đúng thư mục/cổng, giữ log cũ bằng append |
| VERIFICATION | Curl phải có 200 và đúng câu của file; start thành công chưa chứng minh chức năng |
| REGRESSION | Hỏi tên file thiếu vẫn 404, file còn nguyên, log ghi yêu cầu mới, chụp RAM/disk; fix một lỗi không che hành vi sai khác |

**Cleanup:** sau khi đủ evidence, Ctrl+C tại tab A để dừng server lab, kiểm URL không kết nối được. Giữ file/log; không cần xóa cây thư mục.

## 9. NGƯỜI MỚI THƯỜNG NHẦM — Common Beginner Errors

| Cặp | Sửa cách hiểu |
| --- | --- |
| Program / process | Chỉ dẫn lưu trên disk / lần đang hoạt động |
| Process / service | Lần chạy / chức năng phục vụ có thể cần nhiều process |
| PID / port | Số nhận diện process / điểm nhận yêu cầu mạng |
| Running / healthy | Tồn tại / vượt phép kiểm sức khỏe đã định |
| RAM / disk | Chỗ dữ liệu đang làm / chỗ cất file |
| kill / delete | Gửi signal / xóa file; dừng không xóa code |
| grep / tail | Chọn theo nội dung / chọn phần cuối; cuối file chưa chắc là lỗi |

## 10. Self-check Questions / Evidence Required / Quiz / PASS Gate

Không nhìn lại: process giải quyết nhu cầu gì? Vì sao 404 khác không kết nối? Tại sao cần PID, log và hành vi chứ không chỉ restart? Dừng process có giải phóng mọi nguyên nhân chậm không?

```teaching
SHOW KEY POINTS — tự giải thích
PID/command giúp chọn lần chạy; curl kiểm hành vi; log giữ dấu vết; tài nguyên cho biết áp lực CPU/RAM/disk. TERM cần verification; file vẫn còn. 404 cho thấy server trả lời nhưng thiếu tài nguyên; mất kết nối cần kiểm process/cổng/môi trường trước.
```

Nộp `terminal-output`: PID/user/command, dự đoán và output 200/404/mất kết nối/khôi phục, lọc log, snapshot RAM/disk. Nộp `incident-report`: đủ chín bước phần 8 với output thật, root cause và regression. Ghi rõ cổng/thư mục lab, không paste secret.

Quiz 10 câu ở bảng Gate ≥70%. **PASS Gate** giữ Mission 2 prerequisite, Learn/Practice/Build/Break/Debug, hai loại evidence, quiz đạt và xác nhận hard gate. Đọc bài không tự PASS.

**SAU BÀI NÀY BẠN CÓ THỂ:** tìm đúng process, đọc PID/user/CPU/RAM, stop/start an toàn, lọc log, phân biệt 404 với process chết, kiểm chức năng sau fix và lưu báo cáo có evidence. Tiếp theo Mission 4 giải thích mạng sâu hơn; pilot Teaching V2 dừng ở đây để bạn phản hồi.

### GIẢI THÍCH CHO MỘT NGƯỜI CHƯA HỌC IT

Trong 3–5 câu, giải thích “process là gì”, dùng ví dụ một chỉ dẫn và một lần thực hiện. Nói điều gì mất khi dừng, điều gì còn, và vì sao nhìn thấy process chưa chứng minh người dùng được phục vụ đúng.
