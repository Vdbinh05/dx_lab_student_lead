import fs from "node:fs";
import path from "node:path";
import { weekCatalog } from "./full-curriculum-data.mjs";

const root = process.cwd();
const selectedWeeks = process.argv.slice(2).map(Number);
const weeksToGenerate = selectedWeeks.length
  ? weekCatalog.filter((week) => selectedWeeks.includes(week.week))
  : weekCatalog;
const fence = "```";

function inline(value) {
  return `\`${value}\``;
}

const sourceLabels = {
  THEO_KE_HOACH_CO: "[THEO KẾ HOẠCH CÔ]",
  KIEN_THUC_MO_RONG: "[KIẾN THỨC MỞ RỘNG ĐỂ SV1 HỌC/DEBUG TỐT HƠN]",
  PROJECT_DEFINED_TBD: "[PROJECT-DEFINED / TBD]",
};

function yaml(value) {
  return JSON.stringify(value);
}

function missionQuiz(mission) {
  return [
    {
      id: "q1",
      type: "multiple-choice",
      prompt: `Phát biểu nào mô tả đúng nhất ${mission.title}?`,
      options: [
        mission.quizConcept,
        "Chỉ cần process tồn tại là toàn bộ use case đã PASS",
        "Có thể bỏ qua evidence nếu lệnh không báo lỗi",
        "SV1 phải giành implementation ownership từ SV2/SV3",
      ],
      answer: mission.quizConcept,
      explanation: mission.technical,
    },
    {
      id: "q2",
      type: "multiple-choice",
      prompt: "Evidence nào phù hợp nhất cho mission này?",
      options: [
        mission.evidence[0],
        "Một câu nói 'em đã hiểu' không kèm output",
        "Restart ngẫu nhiên cho tới khi hết lỗi",
        "Ảnh chứa secret/token thật",
      ],
      answer: mission.evidence[0],
      explanation: "Gate yêu cầu evidence gắn với capability thật và không làm lộ secret.",
    },
    {
      id: "q3",
      type: "multiple-choice",
      prompt: "Khi failure xuất hiện, hành động đầu tiên đúng là gì?",
      options: [
        mission.firstTest,
        "Xóa volume để thử lại",
        "Tắt validation/security",
        "Đổi nhiều biến cùng lúc",
      ],
      answer: mission.firstTest,
      explanation: "Một test có chủ đích giữ được causal chain và evidence.",
    },
    {
      id: "q4",
      type: "short-answer",
      prompt: mission.shortPrompt,
      answer: mission.shortAnswer,
      explanation: mission.shortExplanation,
    },
    {
      id: "q5",
      type: "self-explanation",
      prompt: mission.explainPrompt,
      answer: "__EXPLANATION__",
      explanation: "Câu trả lời phải tự diễn đạt causal chain, boundary và verification.",
    },
  ];
}

function renderMission(week, mission, index, previousId) {
  const sourceLabel = sourceLabels[mission.sourceType];
  const prerequisites = previousId ? [previousId] : [];
  const commandLines = mission.command.trim().split("\n");
  return `---
id: ${mission.id}
week: ${week.week}
order: ${index + 1}
title: ${yaml(mission.title)}
category: ${yaml(mission.category)}
skillId: ${yaml(mission.skillId)}
estimatedMinutes: ${mission.estimatedMinutes}
targetLevel: ${yaml(mission.targetLevel)}
sourceType: ${yaml(mission.sourceType)}
roadmapCompetency: ${yaml(mission.competency)}
keywords: ${yaml(mission.keywords)}
objectives: ${yaml(mission.objectives)}
prerequisites: ${yaml(prerequisites)}
requiredEvidence: ${yaml(mission.requiredEvidence)}
quizPassScore: ${mission.quizPassScore ?? 75}
hardGate: true
whyItMatters: ${yaml(mission.why)}
---

## 1. Ví dụ đời thường

${mission.analogy}

## 2. Giải thích cực dễ

${mission.easy}

## 3. Technical Definition

**Nguồn:** ${sourceLabel}

${mission.technical}

## 4. Why DX-Lab needs it

${mission.why} SV1 giữ ranh giới: cấu hình, vận hành, integration và troubleshooting thuộc SV1; business logic thuộc SV2; Portal/AI reasoning thuộc SV3.

## 5. SV1 target level

Target của mission là **${mission.targetLevel}**. PASS không dựa vào đọc xong: learner phải tự chạy lab, tạo failure, thu evidence, giải thích causal chain và qua gate.

## 6. Required subtopics

${mission.subtopics.map((item) => `- ${item}`).join("\n")}

## 7. Commands / Config examples

${fence}bash
${commandLines.join("\n")}
${fence}

**COMMAND:** ${inline(commandLines[0])} và các lệnh liên quan trong block.  
**WHERE TO RUN:** ${mission.where}  
**WHY:** ${mission.commandWhy}  
**EXPECTED OUTPUT:** ${mission.expected}  
**COMMON FAILURE:** ${mission.commandFailure}

Output exact có thể khác theo OS/version; evidence cần giữ các field/status/hostname/port liên quan, không hard-code toàn bộ màn hình.

## 8. WHERE TO RUN

${mission.where} Trước khi chạy, xác nhận project/directory bằng ${inline("pwd")} và không dán secret vào evidence. Nếu dùng PowerShell thay vì Linux/WSL, chỉ dùng lệnh tương đương đã được giải thích, không copy mù cú pháp Bash.

## 9. Expected Output

${mission.expected} Learner phải mô tả phần nào của output chứng minh giả thuyết, phần nào chỉ là noise, và trạng thái đó mới là running, healthy hay functional.

## 10. Guided Lab

${mission.guided}

1. Ghi expected result trước khi chạy.
2. Chạy từng bước và lưu command + relevant output.
3. So sánh actual với expected; không đánh dấu hoàn tất nếu chỉ "không thấy lỗi".
4. Cleanup/rollback: ${mission.cleanup}

## 11. Independent Lab

${mission.independent} Không nhìn lại block Guided trong lần đầu. Tự chọn test order, ghi lý do và chỉ mở lại hướng dẫn sau khi đã lưu attempt.

## 12. Integration Lab

${mission.integration}

Handoff phải ghi: Symptom, Evidence, Infra/Auth/DB checks phù hợp, Reproduction, Likely layer, Owner, Expected và Actual. SV1 điều phối cross-service nhưng không giành module implementation.

## 13. Failure Injection

${mission.failure}

Không dùng destructive shortcut. Thu evidence trước khi restart; không xóa volume, tắt auth hoặc đổi nhiều biến cùng lúc để che root cause.

## 14. Troubleshooting protocol

Đi đủ protocol cho failure trên:

1. **SYMPTOM:** ghi quan sát, không trộn phỏng đoán.
2. **EVIDENCE:** lưu command/output/log/status có timestamp hoặc correlation ID khi phù hợp.
3. **HYPOTHESIS:** nêu một causal claim có thể bác bỏ.
4. **TEST:** ${mission.firstTest}
5. **RESULT:** ghi actual result và quyết định giả thuyết được giữ hay loại.
6. **ROOT CAUSE:** nêu config/layer/contract cụ thể, không viết "Docker lỗi" chung chung.
7. **FIX:** thay đổi tối thiểu xử lý root cause.
8. **VERIFICATION:** chạy lại health/use case thật.
9. **REGRESSION:** ${mission.regression}

## 15. Common Beginner Errors

${mission.errors.map((item) => `- ${item}`).join("\n")}

## 16. Self-check Questions

${mission.selfChecks.map((item, i) => `${i + 1}. ${item}`).join("\n")}

## 17. Evidence Required

${mission.evidence.map((item) => `- ${item}`).join("\n")}

Evidence type bắt buộc cho gate: ${mission.requiredEvidence.map(inline).join(" + ")}. Evidence phải redacted, reproducible và đủ để reviewer hiểu expected/actual.

## 18. Quiz

Làm tối thiểu 5 câu ở Gate panel. Multiple choice/short answer kiểm tra khái niệm; self-explanation kiểm tra khả năng giải thích. Ngưỡng PASS: ${mission.quizPassScore ?? 75}%.

## 19. PASS Gate

PASS khi Learn → Practice → Build → Break → Debug hoàn tất, đủ evidence, quiz đạt ngưỡng, learner giải thích được ${mission.passExplanation}, và hard gate được commit server-side. Nếu FAIL, quay lại ${mission.returnBlock}; không mở khóa bằng cách sửa status phía client.
`;
}

for (const week of weeksToGenerate) {
  const weekFolder = path.join(
    root,
    "content",
    "weeks",
    `week-${String(week.week).padStart(2, "0")}`,
  );
  fs.mkdirSync(weekFolder, { recursive: true });
  const quiz = {};
  let previousId = week.previousMissionId;
  week.missions.forEach((mission, index) => {
    const filename = `mission-${String(index + 1).padStart(2, "0")}-${mission.slug}.md`;
    fs.writeFileSync(
      path.join(weekFolder, filename),
      renderMission(week, mission, index, previousId),
      "utf8",
    );
    quiz[mission.id] = missionQuiz(mission);
    previousId = mission.id;
  });
  const quizFolder = path.join(root, "content", "quizzes");
  fs.mkdirSync(quizFolder, { recursive: true });
  fs.writeFileSync(
    path.join(quizFolder, `week-${String(week.week).padStart(2, "0")}.json`),
    `${JSON.stringify(quiz, null, 2)}\n`,
    "utf8",
  );
}

const weeklyFolder = path.join(root, "content", "weekly-quizzes");
fs.mkdirSync(weeklyFolder, { recursive: true });
for (let weekNumber = 1; weekNumber <= 8; weekNumber += 1) {
  const missionQuizFile = path.join(
    root,
    "content",
    "quizzes",
    `week-${String(weekNumber).padStart(2, "0")}.json`,
  );
  if (!fs.existsSync(missionQuizFile)) continue;
  const quizMap = JSON.parse(fs.readFileSync(missionQuizFile, "utf8"));
  const questions = Object.entries(quizMap)
    .flatMap(([missionId, values]) =>
      values.map((question) => ({
        ...question,
        id: `${missionId}-${question.id}`,
      })),
    )
    .slice(0, 20);
  if (questions.length >= 20)
    fs.writeFileSync(
      path.join(
        weeklyFolder,
        `week-${String(weekNumber).padStart(2, "0")}.json`,
      ),
      `${JSON.stringify(questions, null, 2)}\n`,
      "utf8",
    );
}

console.log(
  `Generated weeks: ${weeksToGenerate.map((week) => week.week).join(", ") || "none"}`,
);
