import type { Metadata } from "next";
import Link from "next/link";
import { ConverterDemo } from "@/components/converter-demo";

export const metadata: Metadata = {
  title: "PNG to STL Converter | Image to STL Online",
  description: "Preview a PNG to STL workflow online. Upload a PNG, inspect the preview, and prepare the output path for a future STL engine.",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      zh: "/zh",
    },
  },
};

const featureCards = [
  {
    title: "PNG first, not PNG only",
    body: "The homepage centers the PNG workflow, but the site now also includes a broader Image to STL path, workflow guidance, FAQ, and Chinese support.",
  },
  {
    title: "Built for inspection",
    body: "The tool path is explicit about previewing, reviewing, and downloading before printing instead of hiding the conversion state.",
  },
  {
    title: "Useful landing pages",
    body: "How it works, FAQ, contact, privacy, terms, and a broader image-to-stl page create a real product surface, not a one-card demo.",
  },
];

const routeCards = [
  {
    href: "/image-to-stl",
    label: "Image to STL",
    title: "Broader input route",
    body: "A cleaner umbrella for future JPG, WEBP, and mixed image workflows.",
  },
  {
    href: "/image-checker",
    label: "Image checker",
    title: "Preflight validation",
    body: "Check format, preview readiness, and file size before upload.",
  },
  {
    href: "/palette-to-relief",
    label: "Palette to relief",
    title: "Relief exploration",
    body: "Experiment with contrast-driven shape ideas before conversion.",
  },
  {
    href: "/how-it-works",
    label: "How it works",
    title: "Workflow explanation",
    body: "Describe upload, processing, review, and export without burying the user in jargon.",
  },
  {
    href: "/faq",
    label: "FAQ",
    title: "Common questions",
    body: "Clarify image quality, file handling, and what the current release does today.",
  },
  {
    href: "/contact",
    label: "Contact",
    title: "Support route",
    body: "A clear support entry point makes the site feel real and maintainable.",
  },
  {
    href: "/privacy",
    label: "Privacy",
    title: "Trust pages",
    body: "Legal pages and file-handling disclosure are part of the product, not an afterthought.",
  },
];

const useCases = [
  {
    title: "3D printing reliefs",
    body: "Turn simple logos, badges, and graphics into inspectable STL reliefs for small maker projects.",
  },
  {
    title: "Prototype asset checks",
    body: "Use the page to validate whether a shape, edge, or silhouette is worth turning into a 3D print workflow.",
  },
  {
    title: "Format expansion path",
    body: "Keep PNG as the first route while the broader image-to-stl umbrella absorbs future formats later.",
  },
];

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
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        type="application/ld+json"
      />
      <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.15),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_30%),linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,0))]" />

      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-full border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur md:px-5">
        <span className="text-sm font-semibold tracking-[0.24em] uppercase text-slate-800">pngtostl.net</span>
        <nav className="flex flex-wrap gap-2 text-sm text-slate-600">
          <Link href="/image-to-stl" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:bg-white">
            Image to STL
          </Link>
          <Link href="/how-it-works" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:bg-white">
            How it works
          </Link>
          <Link href="/faq" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:bg-white">
            FAQ
          </Link>
          <Link href="/zh" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:bg-white">
            中文
          </Link>
        </nav>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start xl:gap-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/88 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.10)] ring-1 ring-white/70 backdrop-blur md:p-10 lg:p-12">
          <div className="absolute right-0 top-0 h-28 w-28 -translate-y-1/3 translate-x-1/3 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
            PNG to STL converter
          </div>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-[4.1rem] lg:leading-[0.95]">
            A focused PNG to STL tool, with a real product surface around it.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            The homepage now shows the conversion workflow, the broader image-to-stl path, support pages, and language coverage instead of looking like a single-purpose demo.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#converter" className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800">
              Start converting
            </a>
            <a href="#routes" className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              Explore routes
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["0 cost", "Free v0"],
              ["No storage", "In-memory output"],
              ["Inspectable", "Download before print"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">{label}</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {featureCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-sm font-semibold text-slate-900">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <ConverterDemo />
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Scope</p>
              <p className="mt-2 text-sm font-medium text-slate-900">PNG first release</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">The current path is stable and inspectable.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Expansion</p>
              <p className="mt-2 text-sm font-medium text-slate-900">Image to STL</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">A broader umbrella for future formats.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Trust</p>
              <p className="mt-2 text-sm font-medium text-slate-900">Help and policy pages</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">Support, privacy, terms, and FAQ are live.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="routes" className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">More than one page</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Product routes that make the site feel complete</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            The main tool stays central, but the site now has supporting routes so the domain reads as a product rather than a single-purpose landing page.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {routeCards.map((card) => (
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
        {useCases.map((card) => (
          <article key={card.title} className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Use case</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{card.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
          </article>
        ))}
      </section>

      <section id="how-it-works" className="mt-10 grid gap-6 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-xl md:grid-cols-[0.9fr_1.1fr] md:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Four simple steps.</h2>
          <p className="mt-4 max-w-xl text-white/70">
            The first release focuses on PNG to STL, while the broader image-to-stl route remains visible so the site does not feel limited to a single utility card.
          </p>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2">
          {[
            "Upload your PNG image.",
            "Set the conversion options.",
            "Preview the generated shape.",
            "Download the simple STL relief and inspect it before printing.",
          ].map((step, index) => (
            <li key={step} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/85 backdrop-blur">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Step {index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section id="faq" className="py-10 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">FAQ</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Common questions</h2>
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
