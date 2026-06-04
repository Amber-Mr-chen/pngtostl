import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about PNG to STL conversion, file handling, and current launch status.",
  alternates: {
    canonical: "/faq",
  },
};

const faqs = [
  ["What PNG works best?", "High-contrast images with clean edges usually work better for image-to-3D conversion than photos with many small details."],
  ["Does the current v0 generate real STL files?", "Yes. The current v0 generates a simple in-memory relief STL from PNG luminance and alpha. The output is not CAD-grade and should be inspected before printing."],
  ["Will you support other image formats?", "The planned expansion path is Image to STL. JPG, WEBP, and other formats should wait until the PNG workflow is reliable."],
  ["Can I print the STL directly?", "Even after real STL generation is connected, you should inspect the output in a slicer or 3D tool before printing. Image-based geometry may need scaling, cleanup, or thickness adjustments."],
  ["Are uploaded files stored?", "The current v0 does not intentionally persist uploaded PNG files or generated STL files in application storage. If storage is added later, the Privacy Policy must be updated before launch."],
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([title, body]) => ({
      "@type": "Question",
      name: title,
      acceptedAnswer: {
        "@type": "Answer",
        text: body,
      },
    })),
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12 text-slate-900">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        type="application/ld+json"
      />
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">PNG to STL help</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">FAQ</h1>
      <div className="mt-10 grid gap-4">
        {faqs.map(([title, body]) => (
          <section key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-2 leading-7 text-slate-600">{body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
