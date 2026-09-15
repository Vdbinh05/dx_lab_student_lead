"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const groups = [
  {
    label: "Core execution",
    links: [
      ["Labs", "/labs"],
      ["Incidents", "/incidents"],
    ],
  },
  {
    label: "Capabilities",
    links: [
      ["Skill Matrix", "/skills"],
      ["Evidence Vault", "/evidence"],
      ["Roadmap / Weeks", "/roadmap"],
    ],
  },
  {
    label: "Assessment",
    links: [
      ["Exams & Boss Fights", "/exams"],
      ["Oral Defense", "/oral-defense"],
      ["Final Readiness", "/readiness"],
    ],
  },
  {
    label: "Utility",
    links: [
      ["Glossary", "/glossary"],
      ["Search", "/search"],
      ["Bookmarks", "/bookmarks"],
      ["Settings", "/settings"],
      ["Dashboard", "/"],
    ],
  },
];
function active(path: string, href: string) {
  if (href === "/") return path === "/";
  if (href === "/roadmap")
    return (
      path === href || path.startsWith("/weeks/") || path.startsWith("/learn/")
    );
  return path === href || path.startsWith(href + "/");
}
function NavLink({
  label,
  href,
  path,
}: {
  label: string;
  href: string;
  path: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active(path, href) ? "page" : undefined}
      className={
        "flex min-h-11 items-center rounded-lg border px-3 py-2 text-sm font-semibold " +
        (active(path, href)
          ? "border-[#28565b] bg-[#10262a] text-[#72e4de]"
          : "border-transparent text-[#a7b2bf] hover:bg-[#111821] hover:text-white")
      }
    >
      {label}
    </Link>
  );
}
function Groups({ path }: { path: string }) {
  return groups.map((group) => (
    <details
      key={group.label + path}
      open={
        group.label === "Core execution" ||
        group.links.some(([, href]) => active(path, href))
      }
      className="mb-2"
    >
      <summary className="min-h-11 cursor-pointer px-3 py-3 text-xs font-bold uppercase text-[#a7b2bf]">
        {group.label}
      </summary>
      {group.links.map(([label, href]) => (
        <NavLink key={href} label={label} href={href} path={path} />
      ))}
    </details>
  ));
}
export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="desktop-sidebar fixed inset-y-0 left-0 z-20 w-[248px] border-r border-[#222b37] bg-[#0b0f15] p-5">
      <Link
        href="/today"
        className="mb-5 block border-b border-[#222b37] pb-5 font-black text-[#72e4de]"
      >
        DX · SV1 TRAINING OS
      </Link>
      <nav
        aria-label="Learning navigation"
        className="max-h-[calc(100vh-100px)] overflow-y-auto"
      >
        <NavLink label="Today" href="/today" path={path} />
        <Groups path={path} />
      </nav>
    </aside>
  );
}
export function MobileNav() {
  const path = usePathname();
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-[#28313d] bg-[#0b0f15] p-2 lg:hidden"
    >
      <NavLink label="Today" href="/today" path={path} />
      <NavLink label="Labs" href="/labs" path={path} />
      <NavLink label="Incidents" href="/incidents" path={path} />
      <details key={path} className="relative">
        <summary className="min-h-11 cursor-pointer px-3 py-3 text-sm text-[#a7b2bf]">
          More
        </summary>
        <div className="absolute bottom-14 right-0 max-h-[70vh] w-64 overflow-y-auto rounded-xl border border-[#344151] bg-[#0d141c] p-2 shadow-2xl">
          <Groups path={path} />
        </div>
      </details>
    </nav>
  );
}
