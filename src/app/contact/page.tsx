import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact pngtostl.net about support, feedback, privacy, and file-handling questions.",
  alternates: {
    canonical: "/contact",
  },
};

const contactItems = [
  ["Support", "Use this route for questions about the PNG to STL workflow, upload behavior, or conversion status."],
  ["Privacy", "Use this route for questions about file handling, retention, logs, or deletion requests after storage features are added."],
  ["Feedback", "Share confusing steps, missing format needs, or examples of PNG files that should be supported in a future conversion engine."],
];

export default function ContactPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12 text-slate-900">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">pngtostl.net</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Contact</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
        This page is the support and feedback route for the PNG to STL project. A production support email should be added before public launch.
      </p>

      <div className="mt-10 grid gap-4">
        {contactItems.map(([title, body]) => (
          <section key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{body}</p>
          </section>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
        <h2 className="text-xl font-semibold">Launch note</h2>
        <p className="mt-3 leading-7">
          Before this site is publicly launched, replace this note with a real support email or feedback form and confirm that the inbox is monitored.
        </p>
      </section>
    </main>
  );
}
