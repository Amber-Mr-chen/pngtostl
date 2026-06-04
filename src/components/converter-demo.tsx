"use client";

import { useEffect, useMemo, useState } from "react";

export type ConverterCopy = {
  title: string;
  subtitle: string;
  uploadLabel: string;
  previewLabel: string;
  previewHint: string;
  primaryAction: string;
  outputTitle: string;
  outputHint: string;
  outputStatus: string;
  outputReady: string;
  outputErrorTitle: string;
  outputErrorHint: string;
  stats: {
    file: string;
    format: string;
    size: string;
  };
};

const DEFAULT_COPY: ConverterCopy = {
  title: "PNG to STL converter",
  subtitle: "Upload a PNG, preview it, and check the STL output path.",
  uploadLabel: "Choose PNG",
  previewLabel: "Preview",
  previewHint: "Your selected PNG will show here.",
  primaryAction: "Check conversion path",
  outputTitle: "Output",
  outputHint: "The actual conversion engine can be connected next.",
  outputStatus: "Ready for upload",
  outputReady: "Ready to connect to /api/convert",
  outputErrorTitle: "Upload requirements",
  outputErrorHint: "PNG only, under the size limit, with a valid image MIME type.",
  stats: {
    file: "No file selected",
    format: "PNG only for first release",
    size: "Max size depends on deployment limits",
  },
};

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${kilobytes.toFixed(1)} KB`;
  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

function isPng(file: File) {
  return file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
}

export function ConverterDemo({ copy = DEFAULT_COPY }: { copy?: ConverterCopy }) {
  const [fileName, setFileName] = useState<string>(DEFAULT_COPY.stats.file);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>(copy.stats.size);
  const [status, setStatus] = useState<string>(copy.outputStatus);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const previewState = useMemo(() => {
    if (!previewUrl) {
      return copy.previewHint;
    }
    return fileName;
  }, [copy.previewHint, fileName, previewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isPng(file)) {
      setErrorMessage("Only PNG files are accepted in the first release.");
      setStatus("Upload blocked");
      setSelectedFile(null);
      setFileName(DEFAULT_COPY.stats.file);
      setFileSize(copy.stats.size);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setErrorMessage(`File is too large. Limit is ${formatSize(MAX_UPLOAD_BYTES)}.`);
      setStatus("Upload blocked");
      setSelectedFile(null);
      setFileName(DEFAULT_COPY.stats.file);
      setFileSize(copy.stats.size);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setErrorMessage(null);
    setStatus(copy.outputReady);
    setSelectedFile(file);
    setFileName(file.name);
    setFileSize(formatSize(file.size));

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  async function onGenerate() {
    if (!selectedFile || errorMessage) {
      setErrorMessage("Upload a valid PNG before checking the conversion path.");
      setStatus("Waiting for valid upload");
      return;
    }

    setIsConverting(true);
    setStatus("Generating STL in this session");
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await fetch("/api/convert", { method: "POST", body: formData });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: "Conversion failed." }));
        throw new Error(payload.error ?? "Conversion failed.");
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${selectedFile.name.replace(/\.[^.]+$/, "") || "png-model"}.stl`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
      setStatus("STL downloaded from in-memory conversion");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Conversion failed.");
      setStatus("Conversion failed");
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <section id="converter" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">{copy.title}</p>
          <p className="mt-2 text-sm text-slate-600">{copy.subtitle}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">PNG input</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6">
          <label className="block cursor-pointer text-center">
            <input
              accept="image/png"
              className="sr-only"
              type="file"
              onChange={onFileChange}
            />
            <span className="inline-flex rounded-full bg-slate-900 px-5 py-3 font-medium text-white">
              {copy.uploadLabel}
            </span>
            <p className="mt-4 text-sm text-slate-500">{fileName}</p>
            <p className="mt-2 text-xs text-slate-400">{fileSize}</p>
          </label>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">{copy.previewLabel}</p>
            <div className="mt-3 flex min-h-52 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="Selected PNG preview" className="max-h-52 max-w-full object-contain" src={previewUrl} />
              ) : (
                <p className="max-w-xs text-center text-sm text-slate-400">{previewState}</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">{copy.outputTitle}</p>
          <p className="mt-2 text-sm text-slate-600">{copy.outputHint}</p>

          <div className="mt-5 space-y-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">File</span>
              <span className="font-medium text-slate-800">{fileName}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">Format</span>
              <span className="font-medium text-slate-800">PNG to STL</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">Size</span>
              <span className="font-medium text-slate-800">{fileSize}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">Status</span>
              <span className={`font-medium ${errorMessage ? "text-rose-600" : "text-emerald-600"}`}>{status}</span>
            </div>
          </div>

          <button
            className="mt-5 w-full rounded-full bg-sky-500 px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!previewUrl || Boolean(errorMessage) || isConverting}
            onClick={onGenerate}
            type="button"
          >
            {isConverting ? "Converting..." : copy.primaryAction}
          </button>

          <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-700">{copy.outputErrorTitle}</p>
            <p className="mt-2 text-sm text-slate-600">{copy.outputErrorHint}</p>
            {errorMessage ? <p className="mt-3 text-sm font-medium text-rose-600">{errorMessage}</p> : <p className="mt-3 text-sm font-medium text-emerald-600">{copy.outputReady}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
