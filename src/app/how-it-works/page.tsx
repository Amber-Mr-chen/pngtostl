import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it works",
  description: "Learn how PNG to STL conversion is planned to work and what kind of PNG images perform best.",
  alternates: {
    canonical: "/how-it-works",
  },
};

const steps = [
  ["Upload", "Choose a PNG image and review the browser preview before sending it to a conversion endpoint."],
  ["Process", "A real conversion engine will need to turn image contours, contrast, or relief settings into a 3D mesh."],
  ["Review", "Generated geometry should be inspected before printing because image-based conversion can produce rough or simplified shapes."],
  ["Export", "After the production engine is connected, the target output is a downloadable STL file for your 3D printing workflow."],
];

const tips = [
  "Use high-contrast images with clear edges.",
  "Avoid tiny details that may become fragile in a printed model.",
  "Check scale, thickness, and slicer settings before printing.",
  "The current v0 generates a simple in-memory relief STL. It is useful for testing the workflow, but you should inspect the model before printing.",
];

export default function HowItWorksPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12 text-slate-900">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">PNG to STL workflow</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">How it works</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
        PNG to STL is designed around a simple workflow: choose a PNG, process the image into a 3D relief, review the downloaded STL, and inspect it before printing. The current v0 generates a simple in-memory STL and does not store uploads or output files.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {steps.map(([title, body]) => (
          <section key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-2 leading-7 text-slate-600">{body}</p>
          </section>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">What works best?</h2>
        <ul className="mt-3 space-y-2 leading-7 text-slate-600">
          {tips.map((tip) => (
            <li key={tip}>- {tip}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
