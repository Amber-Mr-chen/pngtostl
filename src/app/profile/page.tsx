import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile dashboard placeholder for pngtostl.net.",
  alternates: { canonical: "/profile" },
};

const stats = [
  ["Recent files", "12"],
  ["Saved presets", "4"],
  ["Conversions this week", "8"],
];

export default function ProfilePage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <section className="rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">Profile</p>
        <h1 className="display-font mt-3 text-4xl font-semibold tracking-tight text-slate-950">Your workspace for saved settings and workflow history.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          The site is now framed like a real product, with explicit profile, login, and pricing entry points rather than a lone tool page.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-3 display-font text-3xl font-semibold text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] md:p-8">
          <h2 className="display-font text-2xl font-semibold text-slate-950">Saved presets</h2>
          <div className="mt-4 space-y-3">
            {[
              "High contrast logo workflow",
              "Small badge relief preset",
              "Low detail image check",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_12px_40px_rgba(15,23,42,0.2)] md:p-8">
          <h2 className="display-font text-2xl font-semibold">Next step</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            If you want the site to behave more like a mature SaaS, this is the place to connect auth and save user settings later.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/pricing" className="rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300">
              View pricing
            </Link>
            <Link href="/" className="rounded-full border border-white/15 px-5 py-3 font-medium text-white transition hover:bg-white/10">
              Back home
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
