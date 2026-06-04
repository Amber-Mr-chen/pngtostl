import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for pngtostl.net and the PNG to STL tool.",
  alternates: {
    canonical: "/privacy",
  },
};

const sections = [
  {
    title: "What this policy covers",
    body: "This Privacy Policy explains how pngtostl.net handles information when you use the PNG to STL tool, supporting pages, and contact route. The current version generates a simple STL file in memory from your PNG upload and returns it directly to the browser.",
  },
  {
    title: "Files you choose",
    body: "When you choose a PNG in the browser, the preview is created locally by your browser. If you submit the file to /api/convert, the current endpoint validates the request, parses the PNG, creates a simple in-memory STL relief, and returns the STL response directly. It does not intentionally store the uploaded PNG or generated STL in application storage.",
  },
  {
    title: "Storage and retention",
    body: "The current v0 implementation does not intentionally persist uploaded PNG files or generated STL files in application storage. If we add server-side conversion, object storage, job queues, or downloadable STL files later, this page must be updated with the storage location, retention window, deletion process, and download-link policy before public launch.",
  },
  {
    title: "Server logs",
    body: "Hosting and security providers may process standard request logs such as IP address, user agent, request path, timestamp, and error information. These logs are used for security, debugging, abuse prevention, and service reliability.",
  },
  {
    title: "Analytics and cookies",
    body: "No app-level analytics script or non-essential cookie is configured in the current project files. If analytics, advertising, or other tracking tools are added later, the site must disclose the provider, purpose, and opt-out or control method before launch.",
  },
  {
    title: "Third-party services",
    body: "The site is designed to run on standard web hosting and may use infrastructure providers such as Cloudflare for DNS, CDN, deployment, security, and logs. No payment processor, account system, or email marketing provider is active in v0.",
  },
  {
    title: "Contact",
    body: "For privacy questions, file-handling questions, or deletion requests after a storage feature is added, use the contact route on this site. A production support email should be added before public launch.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12 text-slate-900">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">pngtostl.net</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Privacy Policy</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
        Last updated: June 4, 2026. This policy is written for the current v0 implementation and must be reviewed again before persistent storage, analytics, accounts, payments, or queued conversion are launched.
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
