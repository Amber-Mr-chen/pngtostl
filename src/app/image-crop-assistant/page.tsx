"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const cropPresets = [
  { label: "Square crop", width: 1, height: 1, note: "Good for logos and icons." },
  { label: "Portrait crop", width: 3, height: 4, note: "Good for poster-style reliefs." },
  { label: "Landscape crop", width: 4, height: 3, note: "Good for wide signs and panels." },
  { label: "Tall crop", width: 2, height: 3, note: "Good for narrow artwork and badges." },
] as const;

export default function ImageCropAssistantPage() {
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [padding, setPadding] = useState(0.1);

  const ratio = useMemo(() => (width / height).toFixed(2), [height, width]);
  const guidance = useMemo(() => {
    if (padding < 0.08) return "Very tight. Nice for artwork that already has breathing room.";
    if (padding < 0.18) return "Balanced padding. A safe default for most PNGs.";
    return "Generous padding. Good for noisy images or awkward framing.";
  }, [padding]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Utility helper</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Image crop assistant</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Adjust crop shape and padding before using a PNG in the STL workflow.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Presets</p>
            <div className="mt-4 grid gap-2">
              {cropPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm transition hover:border-slate-300 hover:bg-slate-50"
                  onClick={() => {
                    setWidth(preset.width);
                    setHeight(preset.height);
                    setPadding(0.12);
                  }}
                >
                  <span className="block font-medium text-slate-950">{preset.label}</span>
                  <span className="mt-1 block text-xs text-slate-500">{preset.note}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-3">
              <label className="block text-sm font-medium text-slate-700">
                Width
                <input className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" min={0.5} max={6} step={0.1} type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Height
                <input className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" min={0.5} max={6} step={0.1} type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Padding
                <input className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" min={0} max={0.5} step={0.01} type="number" value={padding} onChange={(e) => setPadding(Number(e.target.value))} />
              </label>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Crop ratio</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{ratio}:1</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Guidance</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{guidance}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white" href="/image-checker">
                Check file
              </Link>
              <Link className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700" href="/image-threshold-tester">
                Test threshold
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
