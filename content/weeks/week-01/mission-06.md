---
id: w1-m6-git-open-source
week: 1
order: 6
title: "Git, GitHub & Open Source"
category: "Git/Open Source"
skillId: "git"
estimatedMinutes: 210
targetLevel: "L2"
sourceType: "THEO_KE_HOACH_CO"
roadmapCompetency: "Git/Open Source workflow and CI/repository safety baseline"
keywords: ["git", "github", "issue", "branch", "pull request", "ci", "secret"]
objectives:
  [
    "Đi qua working tree → staging → commit",
    "Làm task qua branch và PR",
    "Giữ repository không có secret",
  ]
prerequisites: ["w1-m5-http-curl-local-server"]
requiredEvidence: ["github-url", "explanation"]
quizPassScore: 70
hardGate: true
whyItMatters: "Roadmap yêu cầu Open Source workflow xuyên 8 tuần; DONE phải có Issue, PR, review và evidence chứ không chỉ code xong."
---

## 1. Ví dụ đời thường

Working tree là bàn làm việc, staging là khay chuẩn bị đóng gói, commit là gói có nhãn. Branch là đường làm việc riêng; PR là yêu cầu đưa gói vào tuyến chính sau review.

## 2. Giải thích cực dễ

Git lưu lịch sử thay đổi có chủ đích. `git status` là bảng điều khiển quan trọng nhất. GitHub bổ sung Issue, PR, review và branch protection cho collaboration.

## 3. Technical Definition

Commit là snapshot có parent và metadata. Branch là ref trỏ tới commit. Remote là repository khác; fetch cập nhật remote refs, pull kết hợp fetch + integrate, push gửi commit.

## 4. DX-Lab dùng nó ở đâu

Mọi task thật: Issue → Branch → Change → Test → Evidence → Commit → Push → PR → Review → Merge.

## 5. SV1 cần đạt Level nào

Git/Open Source cuối roadmap L4; Week 1 đạt L2–3 operational baseline.

## 6. Thành phần cần biết

working tree, staging, commit, branch, merge/conflict, remote, fetch/pull/push, Issue, PR, review, README, LICENSE, CHANGELOG, CONTRIBUTING, `.gitignore`, no secret.

## 7. Commands / Config

```bash
git status
git switch -c feat/week1-git-lab
printf "# Git Lab\n" > git-lab.md
git add git-lab.md
git diff --cached
git commit -m "docs: add Week 1 git lab"
git log --oneline -5
git check-ignore .env
git remote -v
git fetch --prune
git branch -vv
git push -u origin feat/week1-git-lab
```

**COMMAND:** chạy block status → feature branch → staged diff → commit → ignore/remote checks → fetch/push khi remote hợp lệ.  
**WHERE TO RUN:** repository test/project root; xác nhận remote và quyền trước thao tác network.  
**WHY:** tạo audit trail Issue/branch/PR/CI và chặn secret hoặc file rác trước review/merge.  
**EXPECTED OUTPUT:** commit nằm trên feature branch; `.env` được ignore.  
**COMMON FAILURE:** `git add .` không review làm stage secret/file rác. Chỉ chạy `fetch`/`push` khi đã cấu hình remote lab và có quyền; nếu chưa có remote, ghi BLOCKED thật thay vì fake URL.

## 8. Expected Output

Một Issue URL và PR URL thật trên remote lab; nếu chưa kết nối remote thì ghi mission là BLOCKED, không tạo fake completion.

## 9. Guided Lab

Tạo Issue contract gồm problem, owner, priority, dependencies, acceptance, evidence và DoD. Audit repository có `README`, `LICENSE`, `CHANGELOG`, `CONTRIBUTING`, Issue/PR templates, `CODEOWNERS` và CI baseline; thiếu mục nào thì ghi blocker. Làm thay đổi nhỏ trên branch và mở PR.

## 10. Independent Lab

Nhờ reviewer kiểm tra một command trong docs; cập nhật theo review rồi merge theo policy.

## 11. Failure Injection

Tạo `.env` giả trong repo test và chứng minh `.gitignore` ngăn stage. Không dùng secret thật.

## 12. Troubleshooting

1. **SYMPTOM:** push/review/merge/ignore thất bại thế nào.
2. **EVIDENCE:** `git status`, diff, staged diff, branch và `remote -v`.
3. **HYPOTHESIS:** upstream, conflict, ignore rule hay permission.
4. **TEST:** `check-ignore -v`, `fetch` hoặc diff phù hợp; chưa reset destructive.
5. **RESULT:** ghi output xác nhận/bác bỏ.
6. **ROOT CAUSE:** ref/rule/file sai cụ thể.
7. **FIX:** thay đổi nhỏ nhất trên feature branch.
8. **VERIFICATION:** status sạch đúng phạm vi, PR/CI/review evidence thật.
9. **REGRESSION:** kiểm `.env` không tracked/staged/history và docs contract còn đủ.

## 13. Self-check Questions

1. Staging khác commit thế nào?
2. Fetch khác pull thế nào?
3. Vì sao xóa secret ở commit sau chưa xử lý xong leak?

## 14. Evidence Required

GitHub Issue/PR URL thật và giải thích workflow/secret boundary. Chưa có remote thì lưu blocker note, nhưng chưa đủ loại evidence `github-url` để PASS.

## 15. Quiz

Quiz đạt tối thiểu 70%.

## 16. PASS Gate

Không PASS nếu push thẳng main, commit `.env`, thiếu Issue/PR/review thật (hoặc blocker remote được ghi rõ), thiếu repo-doc audit, quiz <70%, hoặc chưa chốt hard gate.
