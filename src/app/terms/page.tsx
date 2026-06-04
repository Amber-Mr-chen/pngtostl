import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for pngtostl.net and the PNG to STL tool.",
  alternates: {
    canonical: "/terms",
  },
};

const sections = [
  {
    title: "Use of the tool",
    body: "pngtostl.net is a focused PNG to STL utility site. The current v0 implementation provides browser preview and simple in-memory STL relief generation. The output is useful for workflow testing, but it must not be treated as a completed manufacturing, CAD, or engineering tool.",
  },
  {
    title: "Your files and rights",
    body: "You are responsible for the files you choose or upload. Only use images that you own, created, licensed, or have permission to process. Do not upload copyrighted, private, illegal, or harmful content that you are not allowed to use.",
  },
  {
    title: "Output limitations",
    body: "Image-to-3D conversion can produce rough or simplified geometry. The current simple STL relief output may require inspection, cleanup, scaling, slicing, printer settings, or manual adjustment before 3D printing. We do not guarantee printable, accurate, watertight, or production-ready results.",
  },
  {
    title: "Service limits",
    body: "The tool may limit file type, file size, request frequency, conversion options, storage duration, and download availability. The first release focuses on PNG input only. Broader image formats may be added later after the PNG workflow is verified.",
  },
  {
    title: "No professional advice",
    body: "The site is not a substitute for professional CAD, engineering, manufacturing, medical, legal, or safety review. You are responsible for checking whether any output is suitable for your intended use.",
  },
  {
    title: "Free v0 and future plans",
    body: "The current v0 is free and has no account, payment, subscription, or refund flow. If paid plans are introduced later, pricing, limits, billing terms, cancellation, and refund rules must be published before payments are accepted.",
  },
  {
    title: "Availability and changes",
    body: "We may change, pause, or remove features while the product is being built. Pages, copy, conversion behavior, and infrastructure may change before public launch.",
  },
  {
    title: "Contact",
    body: "Use the contact route for support, feedback, privacy questions, or questions about file handling. A production support email should be added before public launch.",
  },
];

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12 text-slate-900">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">pngtostl.net</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Terms of Use</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
        Last updated: June 4, 2026. These terms are written for the current v0 implementation and must be reviewed again before paid plans, accounts, persistent file storage, queues, or production-grade conversion guarantees are launched.
      </p>

      <div className="mt-10 grid gap-4">
        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
