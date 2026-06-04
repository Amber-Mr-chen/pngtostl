import Link from "next/link";

const navLinks = [
  { href: "/image-to-stl", label: "Image to STL" },
  { href: "/pricing", label: "Pricing" },
  { href: "/profile", label: "Profile" },
  { href: "/login", label: "Login" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400 text-sm font-black text-slate-950 shadow-[0_16px_40px_rgba(56,189,248,0.28)]">
            PT
          </span>
          <span className="leading-tight">
            <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-sky-200">pngtostl.net</span>
            <span className="block text-sm text-slate-300">PNG to STL tools</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-100">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-sky-300/30 hover:bg-white/10">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
