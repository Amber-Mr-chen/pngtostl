"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const paletteSets = [
  {
    title: "High contrast",
    description: "Best for crisp logos, badges, and bold silhouettes.",
    colors: ["#0f172a", "#38bdf8", "#f8fafc"],
  },
  {
    title: "Warm relief",
    description: "Useful for softer shadows and artisan-looking prints.",
    colors: ["#7c2d12", "#fb923c", "#fff7ed"],
  },
  {
    title: "Soft monochrome",
    description: "Good for clean lines and subtle tonal transitions.",
    colors: ["#111827", "#9ca3af", "#f3f4f6"],
  },
  {
    title: "Bold poster",
    description: "A good match for poster graphics and punchy illustration shapes.",
    colors: ["#1d4ed8", "#f59e0b", "#eff6ff"],
  },
] as const;

export default function PaletteToReliefPage() {
  const [selected, setSelected] = useState(0);
  const palette = paletteSets[selected];

  const note = useMemo(() => {
    switch (selected) {
      case 0:
        return "Use this when the subject needs sharp edges and strong separation.";
      case 1:
        return "Use this when the print should feel warmer and less mechanical.";
      case 2:
        return "Use this for calm, graphic forms with minimal noise.";
      default:
        return "Use this when the artwork already behaves like a poster or emblem.";
    }
  }, [selected]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Experiment helper</p>
        <h1 className="display-font mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Palette to relief</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Explore how contrast and color families may translate into relief-friendly shapes before you convert an actual PNG.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Palettes</p>
            <div className="mt-4 grid gap-2">
              {paletteSets.map((item, index) => (
                <button
                  key={item.title}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${selected === index ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
                  type="button"
                  onClick={() => setSelected(index)}
                >
                  <span className="block font-medium">{item.title}</span>
                  <span className="mt-1 block text-xs leading-5 opacity-80">{item.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Preview</p>
            <h2 className="display-font mt-2 text-2xl font-semibold text-slate-950">{palette.title}</h2>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {palette.colors.map((color) => (
                <div key={color} className="h-32 rounded-2xl border border-slate-200 shadow-sm" style={{ background: color }} />
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600">{note}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/#converter" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white">Open converter</Link>
              <Link href="/image-checker" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700">Check a PNG</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
