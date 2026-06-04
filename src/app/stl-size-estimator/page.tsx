"use client";

import { useMemo, useState } from "react";

const presets = [
  { name: "Small badge", widthMm: 25, heightMm: 25, thicknessMm: 1.6 },
  { name: "Desk sign", widthMm: 80, heightMm: 40, thicknessMm: 2.4 },
  { name: "Wall relief", widthMm: 120, heightMm: 120, thicknessMm: 3.2 },
  { name: "Coaster", widthMm: 95, heightMm: 95, thicknessMm: 2.0 },
] as const;

export default function StlSizeEstimatorPage() {
  const [widthMm, setWidthMm] = useState(80);
  const [heightMm, setHeightMm] = useState(40);
  const [thicknessMm, setThicknessMm] = useState(2.4);
  const [scale, setScale] = useState(1);

  const estimate = useMemo(() => {
    const area = (widthMm * heightMm) / 100;
    const footprint = Math.round(area * scale);
    const roughWeight = ((widthMm * heightMm * thicknessMm) / 1000) * 1.24 * scale;
    return {
      footprint,
      roughWeight: roughWeight.toFixed(1),
      volume: ((widthMm * heightMm * thicknessMm) / 1000).toFixed(1),
    };
  }, [heightMm, scale, thicknessMm, widthMm]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Utility calculator</p>
        <h1 className="display-font mt-3 text-4xl font-semibold tracking-tight md:text-6xl">STL size estimator</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Estimate rough print size and material footprint before you convert or slice a relief. This helps users decide whether a PNG is worth sending through the workflow.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Presets</p>
            <div className="mt-4 grid gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm transition hover:border-slate-300 hover:bg-slate-50"
                  onClick={() => {
                    setWidthMm(preset.widthMm);
                    setHeightMm(preset.heightMm);
                    setThicknessMm(preset.thicknessMm);
                    setScale(1);
                  }}
                >
                  <span className="block font-medium text-slate-900">{preset.name}</span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {preset.widthMm} × {preset.heightMm} mm, thickness {preset.thicknessMm} mm
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Controls</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Width (mm)
                <input className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" max={400} min={10} step={1} type="number" value={widthMm} onChange={(e) => setWidthMm(Number(e.target.value))} />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Height (mm)
                <input className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" max={400} min={10} step={1} type="number" value={heightMm} onChange={(e) => setHeightMm(Number(e.target.value))} />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Thickness (mm)
                <input className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" max={20} min={0.5} step={0.1} type="number" value={thicknessMm} onChange={(e) => setThicknessMm(Number(e.target.value))} />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Scale multiplier
                <input className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" max={5} min={0.25} step={0.25} type="number" value={scale} onChange={(e) => setScale(Number(e.target.value))} />
              </label>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Footprint</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{estimate.footprint} cm²</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Volume</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{estimate.volume} cm³</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Rough weight</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{estimate.roughWeight} g</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
