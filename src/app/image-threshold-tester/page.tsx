"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const presets = [
  { name: "Portrait art", threshold: 52, edge: 64 },
  { name: "Logo mask", threshold: 70, edge: 82 },
  { name: "Soft image", threshold: 42, edge: 55 },
  { name: "Bold stencil", threshold: 76, edge: 88 },
] as const;

export default function ImageThresholdTesterPage() {
  const [threshold, setThreshold] = useState(62);
  const [edge, setEdge] = useState(70);

  const verdict = useMemo(() => {
    if (threshold < 45) return "Very light. Likely to preserve more background detail.";
    if (threshold < 65) return "Balanced. Good for mixed shapes and moderate contrast.";
    if (threshold < 80) return "Aggressive. Best for logos, masks, and clean-cut forms.";
    return "Very aggressive. Expect thin highlights and strong separation.";
  }, [threshold]);

  const band = useMemo(() => {
    if (edge < 60) return "Soft edges";
    if (edge < 75) return "Moderate edges";
    return "Hard edges";
  }, [edge]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Utility tool</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Image threshold tester</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Tune a threshold and edge cutoff to see what kind of PNG input will produce a cleaner binary-style relief.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Presets</p>
            <div className="mt-4 grid gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition hover:border-slate-300 hover:bg-sky-50"
                  onClick={() => {
                    setThreshold(preset.threshold);
                    setEdge(preset.edge);
                  }}
                >
                  <span className="block font-medium text-slate-950">{preset.name}</span>
                  <span className="mt-1 block text-xs text-slate-500">Threshold {preset.threshold} · Edge {preset.edge}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Threshold
                <input className="mt-2 w-full accent-sky-600" max={100} min={0} type="range" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
                <span className="mt-2 block text-2xl font-semibold text-slate-950">{threshold}</span>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Edge cutoff
                <input className="mt-2 w-full accent-sky-600" max={100} min={0} type="range" value={edge} onChange={(e) => setEdge(Number(e.target.value))} />
                <span className="mt-2 block text-2xl font-semibold text-slate-950">{edge}</span>
              </label>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Output</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Threshold verdict</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{verdict}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Edge band</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{band}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white" href="/image-checker">Check PNG</Link>
              <Link className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700" href="/palette-to-relief">Compare palettes</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
