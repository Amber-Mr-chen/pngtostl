"use client";

import { useMemo, useState } from "react";

type Analysis = {
  width: number;
  height: number;
  aspect: string;
  contrast: number;
  transparentRatio: number;
  darkRatio: number;
  recommendation: string;
  bullets: string[];
};

const panelStyle = {
  border: "1px solid var(--line)",
  borderRadius: 14,
  background: "#fff",
  padding: 16,
} as const;

function readImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image."));
    };
    image.src = url;
  });
}

async function analyze(file: File): Promise<Analysis> {
  const image = await readImage(file);
  const max = 180;
  const scale = Math.min(1, max / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available.");
  ctx.drawImage(image, 0, 0, width, height);
  const data = ctx.getImageData(0, 0, width, height).data;
  let min = 255;
  let maxL = 0;
  let transparent = 0;
  let dark = 0;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 32) transparent += 1;
    const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    min = Math.min(min, l);
    maxL = Math.max(maxL, l);
    if (l < 96 && a > 32) dark += 1;
  }
  const pixels = data.length / 4;
  const contrast = Math.round(((maxL - min) / 255) * 100);
  const transparentRatio = Math.round((transparent / pixels) * 100);
  const darkRatio = Math.round((dark / pixels) * 100);
  const photoLike = transparentRatio < 5 && contrast < 65;
  const logoLike = transparentRatio > 10 || darkRatio < 45;
  const recommendation = photoLike ? "Use lithophane or photo relief" : logoLike ? "Use logo/icon relief" : "Use balanced image relief";
  return {
    width: image.naturalWidth,
    height: image.naturalHeight,
    aspect: `${image.naturalWidth}:${image.naturalHeight}`,
    contrast,
    transparentRatio,
    darkRatio,
    recommendation,
    bullets: [
      contrast >= 65 ? "Strong contrast for raised relief." : "Low contrast; lithophane or contrast cleanup may work better.",
      transparentRatio > 10 ? "Transparency detected; good for logo/icon workflows." : "No major transparency; use threshold carefully.",
      darkRatio > 70 ? "Large dark coverage may create a broad raised surface." : "Dark coverage is moderate enough for a relief test.",
    ],
  };
}

export function ImageAnalyzer({ title = "Image suitability analyzer" }: { title?: string }) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [status, setStatus] = useState("Upload an image to inspect contrast, transparency, and print path.");

  const score = useMemo(() => {
    if (!analysis) return 0;
    return Math.min(100, analysis.contrast + Math.min(20, analysis.transparentRatio) + (analysis.darkRatio > 85 ? -15 : 10));
  }, [analysis]);

  async function onFile(file?: File) {
    if (!file) return;
    setStatus("Analyzing image...");
    try {
      const next = await analyze(file);
      setAnalysis(next);
      setStatus("Analysis ready");
    } catch (error) {
      setAnalysis(null);
      setStatus(error instanceof Error ? error.message : "Could not analyze this image.");
    }
  }

  return (
    <div className="shell" style={{ padding: 22, display: "grid", gap: 16 }}>
      <div>
        <h2 className="sectionTitle">{title}</h2>
        <p className="smallMuted" style={{ margin: 0 }}>{status}</p>
      </div>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        aria-label="Upload an image to analyze"
        onChange={(event) => onFile(event.currentTarget.files?.[0])}
      />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(250px, 0.85fr)", gap: 14 }}>
        <div style={panelStyle}>
          <span className="smallMuted">Recommendation</span>
          <h3 style={{ margin: "0.25rem 0 0" }}>{analysis ? analysis.recommendation : "Waiting for image"}</h3>
          <div style={{ height: 10, borderRadius: 999, background: "#edf2f7", overflow: "hidden", marginTop: 12 }}>
            <div style={{ width: `${score}%`, height: "100%", background: score >= 70 ? "var(--success)" : score >= 45 ? "var(--warning)" : "#b3261e" }} />
          </div>
          {analysis ? <p className="smallMuted">Suitability score: {score}/100</p> : null}
        </div>
        <div style={panelStyle}>
          {analysis ? (
            <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)", lineHeight: 1.65 }}>
              <li>Size: {analysis.width} x {analysis.height}</li>
              <li>Contrast: {analysis.contrast}%</li>
              <li>Transparency: {analysis.transparentRatio}%</li>
              <li>Dark coverage: {analysis.darkRatio}%</li>
            </ul>
          ) : (
            <p className="smallMuted" style={{ margin: 0 }}>PNG, JPG, and WebP can be analyzed here before choosing a generator.</p>
          )}
        </div>
      </div>
      {analysis ? (
        <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)", lineHeight: 1.65 }}>
          {analysis.bullets.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : null}
    </div>
  );
}
