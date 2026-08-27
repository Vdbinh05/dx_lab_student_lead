"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className="mx-auto max-w-xl card p-7"
      role="alert"
      aria-live="assertive"
    >
      <div className="eyebrow !text-[#ef878d]">Không thể lưu thay đổi</div>
      <h1 className="mt-2 text-2xl font-black text-white">
        Dữ liệu không hợp lệ hoặc gate đang khóa
      </h1>
      <p className="mt-3 text-sm leading-6 text-[#a4afbb]">
        Kiểm tra các trường bắt buộc, prerequisite và trạng thái mission rồi thử
        lại. Không có progress nào được tự động đánh dấu PASS khi thao tác lỗi.
      </p>
      <button type="button" className="btn-secondary mt-5" onClick={reset}>
        Thử lại
      </button>
    </main>
  );
}
