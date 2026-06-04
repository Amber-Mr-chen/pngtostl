"use client";

import { useMemo, useState } from "react";

const palettes = [
  { name: "High contrast", colors: ["#0f172a", "#38bdf8", "#f8fafc"] },
  { name: "Warm relief", colors: ["#7c2d12", "#fb923c", "#fff7ed"] },
  { name: "Soft monochrome", colors: ["#111827", "#9ca3af", "#f3f4f6"] },
  { name: "Bold poster", colors: ["#1d4ed8", "#f59e0b", "#eff6ff"] },
] as const;

export default function PaletteToReliefPage() {
  const [selected, setSelected] = useState(0);
  const palette = palettes[selected];

  const contrastNotes = useMemo(() => {
    switch (selected) {
      case 0:
        return "Best for crisp logo edges and strong silhouette reliefs.";
      case 1:
        return "Useful for warmer art styles and softer printable shadows.";
      case 2:
        return "Best for simple shapes where subtle gradients matter.";
      default:
        return "Good for poster-like compositions that need a stronger focal point.";
    }
  }, [selected]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Experiment helper</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Palette to relief</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Explore how contrast and color families may translate into relief-friendly shapes before you convert an actual PNG.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Palettes</p>
            <div className="mt-4 grid gap-2">
              {palettes.map((item, index) => (
                <button
                  key={item.name}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${selected === index ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
                  type="button"
                  onClick={() => setSelected(index)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Preview</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{palette.name}</h2>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {palette.colors.map((color) => (
                <div key={color} className="h-32 rounded-2xl border border-slate-200" style={{ background: color }} />
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600">{contrastNotes}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
