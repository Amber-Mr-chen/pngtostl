"use client";

import Link from "next/link";
import { useState } from "react";

const profiles = [
  {
    title: "Profile for clean edges",
    body: "Use higher contrast, stronger foreground separation, and a thicker relief for small details.",
  },
  {
    title: "Profile for softer images",
    body: "Use moderate thickness, avoid tiny features, and keep the subject centered.",
  },
  {
    title: "Profile for poster-like art",
    body: "Keep shapes bold and reduce visual noise before conversion.",
  },
] as const;

export default function PrintSettingsCheckerPage() {
  const [active, setActive] = useState(0);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Utility checklist</p>
        <h1 className="display-font mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Print settings checker</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Check the practical settings users should think about before slicing a relief STL. This is not a slicer replacement; it is a decision helper.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Profiles</p>
            <div className="mt-4 grid gap-2">
              {profiles.map((profile, index) => (
                <button
                  key={profile.title}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${active === index ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
                  type="button"
                  onClick={() => setActive(index)}
                >
                  <span className="block font-medium">{profile.title}</span>
                  <span className="mt-1 block text-xs leading-5 opacity-80">Tap to review a fitting print strategy.</span>
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm leading-7 text-sky-950">
              {profiles[active].body}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Checklist</p>
            <div className="mt-4 grid gap-3">
              {[
                ["Scale", "Confirm the final size in millimeters before slicing."],
                ["Thickness", "Avoid ultra-thin reliefs that may disappear in print."],
                ["Contrast", "Use stronger contrast when you need a clearer shape read."],
                ["Details", "Tiny noise or texture can break the print surface."],
                ["Preview", "Use a slicer preview before any real print run."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-950">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/#converter" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white">
                Open converter
              </Link>
              <Link href="/stl-size-estimator" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700">
                Estimate STL size
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
