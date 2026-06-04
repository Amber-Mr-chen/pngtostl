"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const examples = [
  {
    title: "Bold icon set",
    body: "Best for logos and line-heavy graphics.",
  },
  {
    title: "Soft illustration",
    body: "Best for portraits or art with gentle tonal transitions.",
  },
  {
    title: "High-detail art",
    body: "Best for checking whether the source image is too noisy for relief conversion.",
  },
] as const;

export default function ImageContrastGuidePage() {
  const [active, setActive] = useState(0);
  const activeExample = useMemo(() => examples[active], [active]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Utility guide</p>
        <h1 className="display-font mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Image contrast guide</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          This page helps users compare image styles before converting them into reliefs. Better contrast usually means a cleaner STL result.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Examples</p>
            <div className="mt-4 grid gap-2">
              {examples.map((example, index) => (
                <button
                  key={example.title}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${active === index ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
                  type="button"
                  onClick={() => setActive(index)}
                >
                  <span className="block font-medium">{example.title}</span>
                  <span className="mt-1 block text-xs leading-5 opacity-80">{example.body}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Recommendation</p>
            <h2 className="display-font mt-2 text-2xl font-semibold text-slate-950">{activeExample.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{activeExample.body}</p>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">What to check</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li>• Does the subject pop against the background?</li>
                <li>• Are edges strong enough to survive relief conversion?</li>
                <li>• Is there too much texture or noise?</li>
                <li>• Will the shape still read when scaled down?</li>
              </ul>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/#converter" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white">
                Open converter
              </Link>
              <Link href="/image-checker" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700">
                Check a PNG
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
