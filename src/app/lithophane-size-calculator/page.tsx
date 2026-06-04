"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const presets = [
  { title: "Pocket lithophane", width: 60, height: 40, thickness: 1.6 },
  { title: "Desk lithophane", width: 100, height: 70, thickness: 2.4 },
  { title: "Frame lithophane", width: 150, height: 100, thickness: 3.2 },
  { title: "Night lamp panel", width: 180, height: 120, thickness: 3.6 },
] as const;

export default function LithophaneSizeCalculatorPage() {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(70);
  const [thickness, setThickness] = useState(2.4);

  const area = useMemo(() => (width * height) / 100, [width, height]);
  const ratio = useMemo(() => (height / Math.max(width, 1)).toFixed(2), [height, width]);
  const guidance = useMemo(() => {
    if (thickness < 2) return "Very thin. Good for small badges and bright backlights, but fragile.";
    if (thickness < 3) return "Balanced for desktop display pieces and moderate detail.";
    if (thickness < 4) return "Thicker panel. Better for larger prints and stronger light blocking.";
    return "Heavy panel. Useful when you want maximum relief depth and more durable edges.";
  }, [thickness]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Utility tool</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Lithophane size calculator</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Estimate a practical lithophane panel size and thickness before you export or print.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Presets</p>
            <div className="mt-4 grid gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition hover:border-slate-300 hover:bg-sky-50"
                  onClick={() => {
                    setWidth(preset.width);
                    setHeight(preset.height);
                    setThickness(preset.thickness);
                  }}
                >
                  <span className="block font-medium text-slate-950">{preset.title}</span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {preset.width} × {preset.height} mm · {preset.thickness} mm
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm font-medium text-slate-700">
                Width (mm)
                <input className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3" min={10} max={400} type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Height (mm)
                <input className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3" min={10} max={400} type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Thickness (mm)
                <input className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3" min={0.8} max={8} step={0.1} type="number" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} />
              </label>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Output</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Approx area</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{area.toFixed(1)} cm²</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Aspect ratio</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{ratio}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{guidance}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
                type="button"
                onClick={() => {
                  setWidth(100);
                  setHeight(70);
                  setThickness(2.4);
                }}
              >
                Reset estimator
              </button>
              <Link className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700" href="/image-checker">
                Check a PNG
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
