"use client";

import Link from "next/link";
import { ConverterDemo } from "@/components/converter-demo";

export default function ZhHomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
          <span className="font-semibold tracking-[0.2em] uppercase">pngtostl.net</span>
          <Link href="/" className="rounded-full border border-slate-200 px-4 py-2 transition hover:bg-slate-100">
            English
          </Link>
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">中文入口</p>
        <h1 className="display-font mt-3 text-4xl font-semibold tracking-tight md:text-6xl">PNG 转 STL 工具</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          上传 PNG 图片，预览转换流程，并检查 STL 输出。这个页面不是静态说明，而是中文用户的真实操作入口。
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="#converter" className="rounded-full bg-slate-900 px-6 py-3 font-medium text-white">
            开始转换
          </a>
          <a href="#faq" className="rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-700">
            常见问题
          </a>
          <a href="/image-checker" className="rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-700">
            图片检查器
          </a>
        </div>
      </section>

      <div id="converter" className="mt-8">
        <ConverterDemo />
      </div>

      <section id="faq" className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">常见问题</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold">支持什么图片？</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">首版以 PNG 为主，后续可以扩展到 JPG、WEBP 和更广的 image to STL 入口。</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold">会保存我的文件吗？</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">当前 v0 不会在应用存储中有意保存上传的 PNG 或生成的 STL；如果后续加入存储，会先更新隐私页。</p>
          </article>
        </div>
      </section>
    </main>
  );
}
