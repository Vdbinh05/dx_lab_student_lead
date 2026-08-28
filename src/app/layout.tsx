import type { Metadata } from "next";
import { Sidebar, MobileNav } from "@/components/navigation";
import "./globals.css";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "DX-Lab SV1 Training OS",
  description: "Personal technical training operating system for DX-Lab SV1.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi">
      <body>
        <Sidebar />
        <main className="app-main min-h-screen px-5 py-6 lg:ml-[248px] lg:px-9 lg:py-8">
          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
