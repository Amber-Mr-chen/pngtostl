"use client";

import { useMemo, useState } from "react";

const steps = [
  {
    title: "Upload",
    body: "Choose a PNG image and review the browser preview before sending it to conversion.",
  },
  {
    title: "Process",
    body: "The current engine generates a simple in-memory STL relief from PNG luminance and alpha.",
  },
  {
    title: "Review",
    body: "Inspect the STL before printing, because image-based geometry can be rough or simplified.",
  },
  {
    title: "Export",
    body: "Download the STL file directly from the conversion flow and inspect it in a slicer.",
  },
] as const;

const tips = [
  "Use high-contrast images with clean edges.",
  "Avoid tiny details that may disappear in print.",
  "Keep the subject centered so the relief reads clearly.",
  "Check thickness and scale before printing.",
] as const;

export default function HowItWorksPage() {
  const [activeTip, setActiveTip] = useState(0);
  const currentTip = useMemo(() => tips[activeTip], [activeTip]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Workflow helper</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">How it works</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          This page explains the current PNG to STL flow and gives users a few quick choices instead of a static wall of text.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Quick tips</p>
            <div className="mt-4 grid gap-2">
              {tips.map((tip, index) => (
                <button
                  key={tip}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${activeTip === index ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
                  type="button"
                  onClick={() => setActiveTip(index)}
                >
                  {tip}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-950">
              {currentTip}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Step {index + 1}</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">{step.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
