"use client";

import { useMemo, useState } from "react";

const presets = [
  { name: "Shallow relief", depth: 0.8, detail: 40 },
  { name: "Balanced relief", depth: 1.6, detail: 55 },
  { name: "Deep relief", depth: 2.4, detail: 68 },
  { name: "High contrast", depth: 3.2, detail: 78 },
] as const;

export default function ReliefDepthEstimatorPage() {
  const [depth, setDepth] = useState(1.6);
  const [detail, setDetail] = useState(55);

  const summary = useMemo(() => {
    if (depth < 1) return "Very shallow. Safer for thin prints, but subtle texture may disappear.";
    if (depth < 2) return "Balanced depth. Good for mixed logos, icons, and moderate texture.";
    if (depth < 3) return "Deep relief. Stronger shadows and more tactile output.";
    return "Very deep relief. Best when you want bold surface movement and high contrast.";
  }, [depth]);

  const quality = useMemo(() => {
    if (detail < 45) return "Low detail";
    if (detail < 65) return "Medium detail";
    return "High detail";
  }, [detail]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Utility calculator</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Relief depth estimator</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Estimate how deep a relief should feel before you convert a PNG into a printable surface.
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
                    setDepth(preset.depth);
                    setDetail(preset.detail);
                  }}
                >
                  <span className="block font-medium text-slate-950">{preset.name}</span>
                  <span className="mt-1 block text-xs text-slate-500">Depth {preset.depth} mm · Detail {preset.detail}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Relief depth (mm)
                <input className="mt-2 w-full accent-sky-600" max={5} min={0.4} step={0.1} type="range" value={depth} onChange={(e) => setDepth(Number(e.target.value))} />
                <span className="mt-2 block text-2xl font-semibold text-slate-950">{depth.toFixed(1)}</span>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Detail level
                <input className="mt-2 w-full accent-sky-600" max={100} min={0} step={1} type="range" value={detail} onChange={(e) => setDetail(Number(e.target.value))} />
                <span className="mt-2 block text-2xl font-semibold text-slate-950">{detail}</span>
              </label>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Depth summary</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{summary}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Detail class</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{quality}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <a className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white" href="/image-checker">Check PNG first</a>
              <a className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700" href="/stl-size-estimator">Estimate size</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
