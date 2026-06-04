import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to STL",
  description: "A broader image to STL entry page for future JPG, WEBP, and mixed image workflows.",
  alternates: {
    canonical: "/image-to-stl",
  },
};

export default function ImageToStlPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12 text-slate-900">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Expanded workflow</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Image to STL</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
        This page keeps the brand flexible. PNG stays the main first release, while image to STL becomes the broader umbrella for future formats.
      </p>
      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Why this page exists</h2>
        <ul className="mt-4 space-y-3 text-slate-700">
          <li>• It keeps the domain useful beyond a single file type.</li>
          <li>• It supports future JPG, WEBP, and photo workflows.</li>
          <li>• It gives search engines a clean topical expansion path.</li>
        </ul>
      </div>
    </main>
  );
}
