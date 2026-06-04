import type { Metadata } from "next";
import Link from "next/link";
import { ConverterDemo } from "@/components/converter-demo";

export const metadata: Metadata = {
  title: "PNG to STL Converter | Image to STL Online",
  description: "A focused PNG to STL tool with a real product surface: validation helpers, workflow pages, support routes, and a broader Image to STL path.",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      zh: "/zh",
    },
  },
};

const toolSuiteRoutes = [
  {
    href: "/image-checker",
    label: "Preflight",
    title: "Image checker",
    body: "Validate PNG type, preview readiness, and size before upload.",
  },
  {
    href: "/palette-to-relief",
    label: "Exploration",
    title: "Palette to relief",
    body: "Test contrast and shape ideas before committing to a conversion.",
  },
  {
    href: "/image-to-stl",
    label: "Expansion",
    title: "Image to STL",
    body: "A broader umbrella for future image formats and routes.",
  },
  {
    href: "/how-it-works",
    label: "Guide",
    title: "How it works",
    body: "Step through upload, processing, review, and export with actionable tips.",
  },
  {
    href: "/faq",
    label: "Support",
    title: "FAQ",
    body: "Answer the common conversion, printing, and file-handling questions.",
  },
  {
    href: "/contact",
    label: "Help",
    title: "Contact",
    body: "Self-serve support paths and a clear route for feedback.",
  },
];

const useCases = [
  {
    title: "Maker badges and logos",
    body: "Turn flat brand marks into printable reliefs or prototype graphics.",
  },
  {
    title: "Preflight file hygiene",
    body: "Confirm the file is worth converting before sending it to the engine.",
  },
  {
    title: "Workflow education",
    body: "Show users how to get a cleaner printable result without dumping them into help docs.",
  },
];

const proofPoints = [
  ["Free v0", "No storage", "Inspectable output"],
  ["PNG first", "Tool suite routes", "Chinese support"],
  ["Real API", "No account needed", "Live deployment"],
] as const;

export default function HomePage() {
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PNG to STL Converter",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: "https://pngtostl.net/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Preview a PNG to STL workflow online. The current v0 generates a simple in-memory relief STL and does not store uploads or output files.",
  };

  return (
    <main className="relative mx-auto min-h-screen max-w-6xl overflow-hidden px-4 py-6 text-slate-900 sm:px-6 lg:px-8 lg:py-10">
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} type="application/ld+json" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.07),_transparent_24%),linear-gradient(180deg,rgba(248,250,252,0.98),rgba(255,255,255,0))]" />

      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-full border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur md:px-5">
        <span className="text-sm font-semibold tracking-[0.24em] uppercase text-slate-800">pngtostl.net</span>
        <nav className="flex flex-wrap gap-2 text-sm text-slate-600">
          {[
            ["Image to STL", "/image-to-stl"],
            ["How it works", "/how-it-works"],
            ["FAQ", "/faq"],
            ["中文", "/zh"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:bg-white">
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start xl:gap-10">
        <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white/88 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.10)] ring-1 ring-white/70 backdrop-blur md:p-10 lg:p-12">
          <div className="absolute right-0 top-0 h-36 w-36 -translate-y-1/3 translate-x-1/3 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
            PNG to STL converter
          </div>
          <h1 className="display-font mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-[4.15rem] lg:leading-[0.95]">
            A focused PNG to STL tool, with a real product surface around it.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            The homepage now behaves like a tool-suite hub. The conversion flow stays primary, but it sits next to preflight checks, workflow help, support routes, and an expansion path.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#converter" className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800">
              Start converting
            </a>
            <a href="#suite" className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              Explore tools
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {proofPoints.map((row) => (
              <div key={row[0]} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">{row[0]}</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{row[1]}</p>
                <p className="mt-1 text-sm text-slate-600">{row[2]}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {useCases.map((card) => (
              <article key={card.title} className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                <h2 className="text-sm font-semibold text-slate-900">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <ConverterDemo />
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Why this is different</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Real tool pages", "Each helper page does an actual task."],
                ["Clear expansion path", "Image to STL stays visible without stealing focus."],
                ["No account trap", "Users can inspect and learn before committing."],
                ["English + Chinese", "The site is not locked to one audience."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="suite" className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Tool suite</p>
            <h2 className="display-font mt-2 text-3xl font-semibold tracking-tight text-slate-950">Useful routes, not filler pages</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            The site now has a stronger product surface: utility helpers, workflow guides, support paths, and expansion pages that each serve a distinct user task.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {toolSuiteRoutes.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">{card.label}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "3D printing reliefs",
            body: "Turn simple logos, badges, and graphics into printable reliefs for maker projects.",
          },
          {
            title: "File readiness",
            body: "Use the preflight checker before conversion so the main tool sees cleaner inputs.",
          },
          {
            title: "Workflow education",
            body: "Users can learn how to get a cleaner printable result without leaving the site.",
          },
        ].map((card) => (
          <article key={card.title} className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Use case</p>
            <h2 className="display-font mt-2 text-2xl font-semibold tracking-tight text-slate-950">{card.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
          </article>
        ))}
      </section>

      <section id="faq" className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">FAQ</p>
            <h2 className="display-font mt-2 text-3xl font-semibold tracking-tight text-slate-950">Common questions</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            The FAQ now reads like a product help center rather than a placeholder list.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ["What PNG works best?", "High-contrast images with clean edges usually convert better."],
            ["Does the current v0 generate real STL files?", "Yes. The current v0 generates a simple in-memory relief STL. Inspect it before printing."],
            ["Will you support other image formats?", "The planned expansion path is Image to STL, with JPG, WEBP, and other formats later."],
            ["Can I print the STL directly?", "Inspect the output in a slicer or 3D tool before printing. Image-based geometry may need adjustments."],
          ].map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
