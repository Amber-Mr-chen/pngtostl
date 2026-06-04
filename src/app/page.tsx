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

const features = [
  "Fast PNG upload and preview",
  "Clear output contract for 3D printing workflows",
  "Clear guidance for beginners and makers",
];

const navLinks = [
  { href: "/image-to-stl", label: "Image to STL" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/zh", label: "中文" },
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
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-12 text-slate-900">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        type="application/ld+json"
      />
      <section className="rounded-3xl bg-gradient-to-br from-slate-50 via-white to-sky-50 p-8 shadow-sm ring-1 ring-slate-200 md:p-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
          <span className="font-semibold tracking-[0.2em] uppercase">pngtostl.net</span>
          <div className="flex flex-wrap gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full border border-slate-200 px-4 py-2 transition hover:bg-slate-100">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              PNG to STL converter
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">
              Preview a PNG to STL workflow for 3D printing projects.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Upload a PNG, preview the workflow, and keep the STL output path clear for makers, hobbyists, and small projects.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#converter"
                className="inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 font-semibold transition"
                style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
              >
                Start converting
              </a>
              <a href="#faq" className="rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-white">
                View FAQ
              </a>
            </div>
          </div>

          <ConverterDemo />
        </div>
      </section>

      <section className="grid gap-4 py-12 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-medium text-slate-900">{feature}</p>
          </div>
        ))}
      </section>

      <section id="how-it-works" className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Four simple steps.</h2>
          <p className="mt-4 text-slate-600">
            The first release focuses on PNG to STL, with room to expand into a broader image to STL workflow later.
          </p>
        </div>
        <ol className="space-y-4 text-slate-700">
          <li>1. Upload your PNG image.</li>
          <li>2. Set the conversion options.</li>
          <li>3. Preview the generated shape.</li>
          <li>4. Download the simple STL relief and inspect it before printing.</li>
        </ol>
      </section>

      <section id="faq" className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight">FAQ</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-medium">What PNG works best?</h3>
            <p className="mt-2 text-slate-600">High-contrast images with clear shapes usually convert better.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-medium">Does the current v0 generate real STL files?</h3>
            <p className="mt-2 text-slate-600">Yes. The current v0 generates a simple in-memory STL relief. Inspect the result before printing.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
