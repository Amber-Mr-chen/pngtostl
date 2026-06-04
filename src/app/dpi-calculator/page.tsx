"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const dpiPresets = [
  { name: "Draft", dpi: 150, note: "Fast preview and rough sizing." },
  { name: "Balanced", dpi: 300, note: "A safe default for most print checks." },
  { name: "High detail", dpi: 450, note: "Better for compact text and sharp edges." },
  { name: "Poster", dpi: 600, note: "Useful when the source art is rich in detail." },
] as const;

export default function DpiCalculatorPage() {
  const [dpi, setDpi] = useState(300);
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(3);

  const pixels = useMemo(() => {
    return {
      width: Math.round(width * dpi),
      height: Math.round(height * dpi),
    };
  }, [dpi, height, width]);

  const advice = useMemo(() => {
    if (dpi < 200) return "Low resolution. Good for fast previews, not fine print.";
    if (dpi < 400) return "Balanced. Good for most relief previews and prototype prints.";
    return "High resolution. Best when you need sharper detail and have clean source art.";
  }, [dpi]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Utility calculator</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">DPI calculator</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Estimate image resolution needs before you send a PNG into the conversion workflow.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Presets</p>
            <div className="mt-4 grid gap-2">
              {dpiPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm transition hover:border-slate-300 hover:bg-slate-50"
                  onClick={() => setDpi(preset.dpi)}
                >
                  <span className="block font-medium text-slate-950">{preset.name}</span>
                  <span className="mt-1 block text-xs text-slate-500">{preset.dpi} DPI · {preset.note}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm font-medium text-slate-700">
                DPI
                <input className="mt-2 w-full accent-sky-600" max={1200} min={72} step={12} type="range" value={dpi} onChange={(e) => setDpi(Number(e.target.value))} />
                <span className="mt-2 block text-2xl font-semibold text-slate-950">{dpi}</span>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Width (in)
                <input className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" max={20} min={0.5} step={0.1} type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Height (in)
                <input className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" max={20} min={0.5} step={0.1} type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
              </label>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Pixel width</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{pixels.width}px</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Pixel height</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{pixels.height}px</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">Advice</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{advice}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white" type="button" onClick={() => {
                setDpi(300);
                setWidth(4);
                setHeight(3);
              }}>
                Reset calculator
              </button>
              <Link className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700" href="/image-checker">
                Check source image
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
