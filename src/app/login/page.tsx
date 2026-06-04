import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login",
  description: "Login placeholder and account access for pngtostl.net.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <section className="grid gap-6 rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">Login</p>
          <h1 className="display-font mt-3 text-4xl font-semibold tracking-tight text-slate-950">Access your profile and saved workflow settings.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            The current build is still a public tool suite. This page exists as a proper top-level entry, so the site no longer feels like a one-page demo.
          </p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            If you later connect auth, this page can become the real sign-in surface without redesigning the whole site.
          </div>
        </div>

        <form className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none ring-0 focus:border-sky-400" placeholder="you@example.com" type="email" />
          </label>
          <label className="mt-4 block text-sm font-medium text-slate-700">
            Password
            <input className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none ring-0 focus:border-sky-400" placeholder="••••••••" type="password" />
          </label>
          <button className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-slate-800" type="button">
            Continue
          </button>
          <p className="mt-4 text-center text-sm text-slate-500">
            Need a profile first? <Link className="text-sky-700 underline decoration-sky-300 underline-offset-4" href="/profile">View profile</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
