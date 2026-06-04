import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple pricing and plan clarity for pngtostl.net.",
  alternates: { canonical: "/pricing" },
};

const plans = [
  {
    name: "Free",
    price: "$0",
    summary: "For trying the PNG to STL workflow and helper pages.",
    features: ["Single-session use", "PNG upload", "Helper tools"],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$9",
    summary: "For frequent makers who want a stronger workflow surface.",
    features: ["Priority access", "Advanced helpers", "Saved profile settings"],
    cta: "Upgrade later",
  },
  {
    name: "Studio",
    price: "$19",
    summary: "For teams or power users comparing more outputs and parameters.",
    features: ["Best for batch work", "Comparison tools", "Dedicated support path"],
    cta: "Talk to us",
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <section className="rounded-[2.4rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">Pricing</p>
        <h1 className="display-font mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Simple pricing, clear entry point.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Start free, then move up only if you need the stronger tool surface. The site is still focused on practical PNG to STL workflows, not inflated tier noise.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <article
              key={plan.name}
              className={`rounded-[1.8rem] border p-6 ${index === 1 ? "border-sky-300 bg-sky-50 shadow-[0_12px_45px_rgba(56,189,248,0.14)]" : "border-slate-200 bg-slate-50"}`}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">{plan.name}</p>
              <div className="mt-4 flex items-end gap-2">
                <span className="display-font text-4xl font-semibold text-slate-950">{plan.price}</span>
                <span className="pb-1 text-sm text-slate-500">/ month</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{plan.summary}</p>
              <ul className="mt-5 space-y-2 text-sm text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-sky-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-slate-800" type="button">
                {plan.cta}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] md:p-8">
          <h2 className="display-font text-2xl font-semibold text-slate-950">What is included</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Main PNG to STL converter",
              "Image checker",
              "Workflow pages",
              "Chinese pages",
              "No storage for uploads",
              "Simple support route",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_12px_40px_rgba(15,23,42,0.2)] md:p-8">
          <h2 className="display-font text-2xl font-semibold">Need a direct path?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            If you only want to test the workflow, stay on Free. If you want account-level features later, the product can grow into them without changing the core conversion surface.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300">
              Back to home
            </Link>
            <Link href="/login" className="rounded-full border border-white/15 px-5 py-3 font-medium text-white transition hover:bg-white/10">
              Sign in
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
