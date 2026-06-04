import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Print preview calculator",
  description: "Estimate practical print preview settings for image-based STL relief workflows.",
  alternates: { canonical: "/print-preview-calculator" },
};

const presets = [
  ["Small badge", "75 mm preview, 0.8 scaling"],
  ["Desk sign", "120 mm preview, 1.0 scaling"],
  ["Wall art", "180 mm preview, 1.2 scaling"],
  ["Lamp panel", "220 mm preview, 1.4 scaling"],
] as const;

export default function PrintPreviewCalculatorPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Utility tool</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Print preview calculator</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Pick a preview size that matches the kind of relief output you want to evaluate before committing to a print.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Quick presets</p>
            <div className="mt-4 grid gap-2">
              {presets.map(([name, detail]) => (
                <div key={name} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span className="block font-medium text-slate-950">{name}</span>
                  <span className="mt-1 block text-xs text-slate-500">{detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Preview width", "140 mm"],
                ["Preview height", "98 mm"],
                ["Recommended scale", "1.0x"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">What this helps with</p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                <li>• Compare a small badge against a larger relief print</li>
                <li>• Keep a preview size that matches your intended print scale</li>
                <li>• Decide whether to test with a compact or full-size panel</li>
              </ul>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white" href="/stl-size-estimator">Open STL size estimator</Link>
              <Link className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700" href="/image-checker">Check input first</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
