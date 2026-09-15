import Link from "next/link";
import glossary from "../../../content/glossary-week-01.json";

export default function GlossaryPage() {
  return (
    <div className="card mx-auto max-w-4xl p-6 md:p-8">
      <h1 className="text-3xl font-bold text-white">Từ điển Week 1</h1>
      <p className="mt-3 text-slate-300">
        Đọc lại một từ khi cần. Dùng nút Back của trình duyệt để trở về chỗ đang
        học.
      </p>
      <nav
        aria-label="Trở về bài học"
        className="my-5 flex flex-wrap gap-4 text-cyan-200"
      >
        {[1, 2, 3].map((number) => (
          <Link key={number} href={`/learn/week-01/mission-0${number}`}>
            Mission {number}
          </Link>
        ))}
      </nav>
      <nav aria-label="Thuật ngữ" className="prose-training">
        <p>
          {glossary.map((entry) => (
            <a
              className="mr-4 inline-block"
              key={entry.id}
              href={`#${entry.id}`}
            >
              {entry.term}
            </a>
          ))}
        </p>
      </nav>
      <div className="prose-training">
        {glossary.map((entry) => (
          <section
            key={entry.id}
            id={entry.id}
            className="scroll-mt-6 border-t border-slate-700 py-4"
          >
            <h2>{entry.term}</h2>
            <p>
              <strong>{entry.short}</strong>
            </p>
            <p>{entry.detail}</p>
            <p>
              Ví dụ: <code>{entry.example}</code>
            </p>
            <p>
              Liên quan:{" "}
              {entry.related.map((id) => (
                <a key={id} className="mr-3" href={`#${id}`}>
                  {glossary.find((item) => item.id === id)?.term}
                </a>
              ))}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
