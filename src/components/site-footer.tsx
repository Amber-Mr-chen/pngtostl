import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/80">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">pngtostl.net</p>
          <p className="mt-3 max-w-2xl leading-7">
            A focused PNG to STL utility suite with real helper tools, workflow pages, and a simple relief conversion engine.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ["Pricing", "/pricing"],
            ["Profile", "/profile"],
            ["Login", "/login"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 transition hover:border-slate-300 hover:bg-white">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
