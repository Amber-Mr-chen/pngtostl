import type { Metadata } from "next";
import { ConverterDemo } from "@/components/converter-demo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PNG 转 STL 工具 | 在线图片转 STL",
  description: "上传 PNG，预览面向 3D 打印的 PNG 转 STL 流程，适合 maker 和小型项目用户。",
  alternates: {
    canonical: "/zh",
    languages: {
      en: "/",
      zh: "/zh",
    },
  },
};

export default function ZhHomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12 text-slate-900">
      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:p-12">
        <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
          <span className="font-semibold tracking-[0.2em] uppercase">pngtostl.net</span>
          <Link href="/" className="rounded-full border border-slate-200 px-4 py-2 transition hover:bg-slate-100">
            English
          </Link>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">PNG 转 STL 工具</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          上传 PNG 图片，预览面向 3D 打印的 PNG 转 STL 流程。首版聚焦 PNG {'->'} STL，同时保留后续扩展到 image {'->'} STL 的空间。
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="#converter" className="rounded-full bg-slate-900 px-6 py-3 font-medium text-white">
            开始转换
          </a>
          <a href="#faq" className="rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-700">
            常见问题
          </a>
        </div>
      </section>

      <ConverterDemo />

      <section id="faq" className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight">常见问题</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-medium">支持什么图片？</h3>
            <p className="mt-2 text-slate-600">首版以 PNG 为主，后续可以扩展到 JPG、WEBP 和更广的 image to STL 入口。</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-medium">会保存我的文件吗？</h3>
            <p className="mt-2 text-slate-600">当前 v0 不会在应用存储中有意保存上传的 PNG 或生成的 STL；如果后续加入存储，会先更新隐私页。</p>
          </div>
        </div>
      </section>
    </main>
  );
}
