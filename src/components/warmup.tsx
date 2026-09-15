import Link from "next/link";
import { getRecallData } from "@/lib/recall-data";
import { reviewRecallFormAction } from "@/app/actions";
import { SubmitButton, ValidatedForm } from "./interactive";

export async function Warmup() {
  const { items, due, next } = await getRecallData();
  return (
    <section className="card mb-6 p-5" aria-labelledby="warmup-title">
      <h2 id="warmup-title" className="text-xl font-black text-[#72e4de]">
        5-MINUTE WARM-UP
      </h2>
      <p className="mt-2 text-sm text-[#a7b2bf]">
        Nhớ lại trước khi mở đáp án. Tự đánh giá để hẹn ngày ôn; phần này không
        cấp PASS.
      </p>
      {items.length === 0 ? (
        <p className="mt-4 text-sm">
          Chưa có nội dung đã học để ôn. Bắt đầu mission bên dưới; sau bước
          Learn, câu hỏi của bài sẽ xuất hiện ở đây.
        </p>
      ) : due.length === 0 ? (
        <p className="mt-4 text-sm">
          Hôm nay không còn câu đến hạn.{" "}
          {next && (
            <>
              Lần ôn tới:{" "}
              {next.nextReviewAt.toLocaleDateString("vi-VN", {
                timeZone: "Asia/Bangkok",
              })}
              .
            </>
          )}{" "}
          Tiếp tục mission.
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm">
            {due.length} câu đến hạn · Hiển thị tối đa 3 câu mỗi lượt. Bạn có
            thể dừng sau 5 phút.
          </p>
          <div className="mt-4 space-y-4">
            {due.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-[#344151] p-4"
              >
                <p className="text-xs text-[#a7b2bf]">{item.missionTitle}</p>
                <h3 className="mt-2 font-semibold">{item.prompt}</h3>
                <label className="mt-3 block text-sm">
                  Câu trả lời của bạn (nháp, không lưu)
                  <textarea className="field mt-2" rows={2} />
                </label>
                <details className="mt-3">
                  <summary className="min-h-11 cursor-pointer py-3 text-[#72e4de]">
                    Đối chiếu và tự đánh giá
                  </summary>
                  <p className="mt-3 text-sm font-semibold">
                    Gợi ý đáp án: {item.answer}
                  </p>
                  <p className="my-3 text-sm leading-6">{item.explanation}</p>
                  <Link
                    className="text-sm text-[#72e4de] underline"
                    href={item.href}
                  >
                    Đọc lại bài nếu chưa rõ
                  </Link>
                  <ValidatedForm
                    formAction={reviewRecallFormAction}
                    className="mt-4"
                  >
                    <input type="hidden" name="id" value={item.id} />
                    <label className="block text-sm">
                      Mức nhớ
                      <select
                        name="rating"
                        className="field my-2"
                        defaultValue="wrong"
                      >
                        <option value="wrong">Chưa nhớ · 1 ngày</option>
                        <option value="hard">Còn khó · 3 ngày</option>
                        <option value="correct">
                          Nhớ đúng · 7 / 14 / 30 ngày
                        </option>
                      </select>
                    </label>
                    <SubmitButton>Lưu lịch ôn</SubmitButton>
                  </ValidatedForm>
                </details>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
