"use client";

import { useMemo, useState } from "react";

type Status = "ready" | "invalid" | "too-large" | "empty";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function ImageCheckerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("empty");
  const [note, setNote] = useState("Choose a PNG to check readiness before upload.");

  const summary = useMemo(() => {
    if (!file) {
      return {
        fileName: "No file selected",
        size: "-",
        mime: "-",
      };
    }

    return {
      fileName: file.name,
      size: formatSize(file.size),
      mime: file.type || "unknown",
    };
  }, [file]);

  function clearPreview() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    clearPreview();

    if (!selected) {
      setFile(null);
      setStatus("empty");
      setNote("Choose a PNG to check readiness before upload.");
      return;
    }

    setFile(selected);

    if (selected.type !== "image/png" && !selected.name.toLowerCase().endsWith(".png")) {
      setStatus("invalid");
      setNote("This checker only accepts PNG files in the current release.");
      return;
    }

    if (selected.size > MAX_UPLOAD_BYTES) {
      setStatus("too-large");
      setNote(`File is too large. Keep it under ${formatSize(MAX_UPLOAD_BYTES)}.`);
      return;
    }

    setStatus("ready");
    setNote("This file is ready for the current PNG to STL upload flow.");
    setPreviewUrl(URL.createObjectURL(selected));
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Utility helper</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Image checker</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Check file type, file size, and basic preview readiness before sending a PNG into the conversion flow.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <label className="block cursor-pointer rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-sky-300 hover:bg-sky-50/40">
              <input accept="image/png" className="sr-only" type="file" onChange={onFileChange} />
              <span className="inline-flex rounded-full bg-slate-950 px-5 py-3 font-medium text-white">Choose PNG</span>
              <p className="mt-4 text-sm text-slate-600">Drop a PNG here or click to browse.</p>
            </label>

            <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Preview</p>
              <div className="mt-3 flex min-h-56 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="PNG preview" className="max-h-56 max-w-full object-contain" src={previewUrl} />
                ) : (
                  <p className="max-w-sm text-center text-sm leading-6 text-slate-400">No preview yet. Choose a file to see it here.</p>
                )}
              </div>
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Readiness</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Current file status</h2>
            <dl className="mt-5 space-y-4 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <dt className="text-slate-500">File</dt>
                <dd className="font-medium text-slate-900">{summary.fileName}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <dt className="text-slate-500">Size</dt>
                <dd className="font-medium text-slate-900">{summary.size}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <dt className="text-slate-500">MIME</dt>
                <dd className="font-medium text-slate-900">{summary.mime}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <dt className="text-slate-500">Status</dt>
                <dd className={`font-medium ${status === "ready" ? "text-emerald-600" : "text-rose-600"}`}>
                  {status === "ready" ? "Ready" : status === "too-large" ? "Too large" : status === "invalid" ? "Invalid" : "Waiting"}
                </dd>
              </div>
            </dl>

            <div className="mt-5 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-800">What this checks</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li>• PNG type</li>
                <li>• File size</li>
                <li>• Visual preview</li>
                <li>• Basic upload readiness</li>
              </ul>
              <p className="mt-4 text-sm leading-6 text-slate-600">{note}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
