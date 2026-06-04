"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const contactItems = [
  {
    title: "Support",
    body: "Questions about the PNG to STL workflow, upload behavior, or conversion status.",
  },
  {
    title: "Privacy",
    body: "Questions about file handling, retention, logs, or deletion after storage features are added.",
  },
  {
    title: "Feedback",
    body: "Share confusing steps, missing format needs, or examples of PNG files that should be supported later.",
  },
] as const;

export default function ContactPage() {
  const [active, setActive] = useState(0);

  const suggestions = useMemo(
    () => [
      "Open the converter and test a real PNG upload.",
      "Read How it works for print-quality guidance.",
      "Check the FAQ for storage and output details.",
    ],
    [],
  );

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Support hub</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Contact</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          This page gives users a route to support, plus self-serve shortcuts so it feels like a working hub instead of a dead-end note.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Choose a route</p>
            <div className="mt-4 grid gap-2">
              {contactItems.map((item, index) => (
                <button
                  key={item.title}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${active === index ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
                  type="button"
                  onClick={() => setActive(index)}
                >
                  <span className="block font-medium">{item.title}</span>
                  <span className="mt-1 block text-xs leading-5 opacity-80">{item.body}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Selected route</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{contactItems[active].title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{contactItems[active].body}</p>

            <div className="mt-5 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">Self-serve shortcuts</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {suggestions.map((item) => (
                  <Link key={item} href="/" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
