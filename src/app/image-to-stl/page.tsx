import type { Metadata } from "next";
import Link from "next/link";

const modes = [
  {
    title: "Logo reliefs",
    body: "Best for badges, marks, and bold silhouettes.",
  },
  {
    title: "Poster-style graphics",
    body: "Good for illustrations with a strong foreground and clean contrast.",
  },
  {
    title: "Photo-inspired assets",
    body: "Future-friendly direction for broader image-to-stl support after PNG stabilizes.",
  },
] as const;

export const metadata: Metadata = {
  title: "Image to STL",
  description: "A broader image to STL entry page with route shortcuts and interactive format guidance.",
  alternates: {
    canonical: "/image-to-stl",
  },
};

export default function ImageToStlPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Expanded workflow</p>
        <h1 className="display-font mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Image to STL</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          This page keeps the brand flexible while still giving users a real place to compare use cases, route back to conversion, and understand where the product can expand.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Choose a mode</p>
            <div className="mt-4 grid gap-2">
              {modes.map((mode) => (
                <article key={mode.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h2 className="text-lg font-semibold text-slate-950">{mode.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{mode.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Route shortcuts</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Start converting", "/image-to-stl"],
                ["Image checker", "/image-checker"],
                ["How it works", "/how-it-works"],
                ["FAQ", "/faq"],
              ].map(([label, href]) => (
                <a key={href} href={href} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white">
                  {label}
                </a>
              ))}
            </div>
            <div className="mt-5 rounded-[1.5rem] border border-sky-200 bg-sky-50 p-5">
              <h2 className="text-xl font-semibold text-slate-950">Why this page exists</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                It keeps the domain useful beyond a single file type, supports future JPG and WEBP workflows, and gives search engines a clean topical expansion path.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
