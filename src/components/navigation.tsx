"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Boxes,
  BrainCircuit,
  ClipboardCheck,
  Database,
  Gauge,
  Home,
  Map,
  Menu,
  Mic2,
  Search,
  Settings,
  ShieldAlert,
  Target,
} from "lucide-react";

const items = [
  ["Dashboard", "/", Home],
  ["Today", "/today", Target],
  ["Roadmap", "/roadmap", Map],
  ["Weeks", "/weeks/1", ClipboardCheck],
  ["Labs", "/labs", Boxes],
  ["Incidents", "/incidents", ShieldAlert],
  ["Search", "/search", Search],
  ["Bookmarks", "/bookmarks", Bookmark],
  ["Skills", "/skills", BrainCircuit],
  ["Evidence", "/evidence", Database],
  ["Exams", "/exams", ClipboardCheck],
  ["Oral Defense", "/oral-defense", Mic2],
  ["Final Readiness", "/readiness", Gauge],
  ["Settings", "/settings", Settings],
] as const;

const active = (path: string, href: string) => {
  if (href === "/") return path === "/";
  if (href === "/weeks/1")
    return path.startsWith("/weeks") || path.startsWith("/learn");
  return path.startsWith(href);
};

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="desktop-sidebar fixed inset-y-0 left-0 z-20 w-[248px] border-r border-[#222b37] bg-[#0b0f15] p-5">
      <Link href="/" className="mb-5 block border-b border-[#222b37] pb-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg border border-[#3e5960] bg-[#10262a] font-mono text-sm font-black text-[#69e2dc]">
            DX
          </div>
          <div>
            <div className="text-sm font-black tracking-wide">SV1 TRAINING OS</div>
            <div className="mt-1 text-[10px] font-bold uppercase text-[#6f7d8d]">
              8-week control center
            </div>
          </div>
        </div>
      </Link>
      <nav className="max-h-[calc(100vh-105px)] space-y-1 overflow-y-auto pb-4">
        {items.map(([label, href, Icon]) => (
          <Link
            key={href}
            href={href}
            className={
              "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-semibold transition " +
              (active(path, href)
                ? "border-[#28565b] bg-[#10262a] text-[#72e4de]"
                : "border-transparent text-[#99a5b5] hover:bg-[#111821] hover:text-white")
            }
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export function MobileNav() {
  const path = usePathname();
  const primary = items.filter(([label]) =>
    ["Dashboard", "Today", "Weeks", "Incidents"].includes(label),
  );
  const secondary = items.filter(
    ([label]) => !["Dashboard", "Today", "Weeks", "Incidents"].includes(label),
  );
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-[#28313d] bg-[#0b0f15]/95 px-2 py-2 backdrop-blur lg:hidden">
      {primary.map(([label, href, Icon]) => (
        <Link
          key={href}
          href={href}
          className={
            "flex min-w-14 flex-col items-center gap-1 rounded-md px-2 py-1 text-[10px] " +
            (active(path, href) ? "text-[#67ddd7]" : "text-[#798696]")
          }
        >
          <Icon size={18} />
          {label}
        </Link>
      ))}
      <details className="group relative min-w-14">
        <summary className="flex cursor-pointer list-none flex-col items-center gap-1 rounded-md px-2 py-1 text-[10px] text-[#798696] [&::-webkit-details-marker]:hidden">
          <Menu size={18} />
          More
        </summary>
        <div className="absolute bottom-14 right-0 max-h-[70vh] w-56 overflow-y-auto rounded-xl border border-[#344151] bg-[#0d141c] p-2 shadow-2xl">
          {secondary.map(([label, href, Icon]) => (
            <Link
              key={href}
              href={href}
              className={
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm " +
                (active(path, href)
                  ? "bg-[#10262a] text-[#72e4de]"
                  : "text-[#a7b2bf]")
              }
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>
      </details>
    </nav>
  );
}
