"use client";

import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    title: "What PNG works best?",
    body: "High-contrast images with clean edges usually work better than photos with many small details.",
  },
  {
    title: "Does the current v0 generate real STL files?",
    body: "Yes. The current v0 generates a simple in-memory relief STL from PNG luminance and alpha. Inspect it before printing.",
  },
  {
    title: "Will you support other image formats?",
    body: "The expansion path is Image to STL. JPG, WEBP, and related formats can follow once the PNG flow stays stable.",
  },
  {
    title: "Can I print the STL directly?",
    body: "Inspect the output in a slicer or 3D tool before printing. Image-based geometry may need scaling or cleanup.",
  },
  {
    title: "Are uploaded files stored?",
    body: "The current v0 does not intentionally persist uploaded PNG files or generated STL files in application storage.",
  },
] as const;

export default function FaqPage() {
  const [active, setActive] = useState(0);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.body,
      },
    })),
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} type="application/ld+json" />

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Help center</p>
        <h1 className="display-font mt-3 text-4xl font-semibold tracking-tight md:text-6xl">FAQ</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Quick answers, action shortcuts, and a way to jump back to the tool instead of reading a static help page.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Quick actions</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/image-to-stl" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white">
                Open converter
              </Link>
              <Link href="/how-it-works" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700">
                How it works
              </Link>
              <Link href="/contact" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700">
                Contact
              </Link>
            </div>
            <div className="mt-5 grid gap-2">
              {faqs.map((item, index) => (
                <button
                  key={item.title}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${active === index ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
                  type="button"
                  onClick={() => setActive(index)}
                >
                  <span className="block font-medium">{item.title}</span>
                  <span className="mt-1 block text-xs leading-5 opacity-80">Tap to view the answer</span>
                </button>
              ))}
            </div>
          </div>

          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Answer</p>
            <h2 className="display-font mt-2 text-2xl font-semibold text-slate-950">{faqs[active].title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{faqs[active].body}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
