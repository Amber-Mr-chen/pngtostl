"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ToolConfig } from "@/lib/tools";

type AdvisorKind = "photo-path" | "jpg-gate" | "contrast" | "print-settings" | "logo" | "heightmap";

const fieldStyle = {
  border: "1px solid var(--line)",
  borderRadius: 10,
  padding: "0.75rem",
  font: "inherit",
  background: "#fff",
} as const;

function scoreLabel(score: number) {
  if (score >= 75) return "Strong fit";
  if (score >= 50) return "Usable with cleanup";
  return "Needs preparation";
}

function scoreColor(score: number) {
  if (score >= 75) return "var(--success)";
  if (score >= 50) return "var(--warning)";
  return "#b3261e";
}

export function UtilityAdvisor({ kind, tool }: { kind: AdvisorKind; tool?: ToolConfig }) {
  const [goal, setGoal] = useState("backlit-photo");
  const [contrast, setContrast] = useState(65);
  const [background, setBackground] = useState("simple");
  const [detail, setDetail] = useState("medium");
  const [printer, setPrinter] = useState("fdm");
  const [layerHeight, setLayerHeight] = useState("0.16");
  const [fileType, setFileType] = useState("jpg");

  const result = useMemo(() => {
    if (kind === "logo") {
      const contrastScore = Math.round(contrast * 0.48);
      const bgScore = background === "simple" ? 30 : background === "mixed" ? 14 : 4;
      const detailScore = detail === "high" ? 18 : detail === "medium" ? 15 : 9;
      const score = Math.min(100, contrastScore + bgScore + detailScore);
      return {
        score,
        title: scoreLabel(score),
        recommendation: score >= 75 ? "Start with Logo to STL and keep the base plate on for a badge or sign." : score >= 50 ? "Use Logo to STL, but simplify tiny text or clean the background first." : "Prepare the logo before converting: remove background noise and increase edge contrast.",
        nextHref: "/logo-to-stl",
        nextLabel: "Open Logo to STL",
        bullets: [
          `Logo edges: ${contrast >= 70 ? "strong" : contrast >= 45 ? "usable" : "too soft"}`,
          `Background: ${background === "simple" ? "transparent/simple" : "cleanup recommended"}`,
          `Detail target: ${detail === "high" ? "check tiny text carefully" : "good for first badge test"}`,
        ],
      };
    }

    if (kind === "heightmap") {
      const contrastScore = Math.round(contrast * 0.42);
      const bgScore = background === "simple" ? 26 : background === "mixed" ? 12 : 4;
      const detailScore = detail === "high" ? 22 : detail === "medium" ? 17 : 10;
      const score = Math.min(100, contrastScore + bgScore + detailScore);
      return {
        score,
        title: score >= 75 ? "Good terrain heightmap" : score >= 50 ? "Usable height data" : "Needs heightmap cleanup",
        recommendation: score >= 75 ? "Open Heightmap to STL with the terrain preset and keep max height conservative for a first tile." : score >= 50 ? "Use Heightmap to STL, but crop labels or noisy areas before printing." : "Do not use a normal landscape photo as a heightmap; prepare a grayscale depth map first.",
        nextHref: "/heightmap-to-stl",
        nextLabel: "Open Heightmap to STL",
        bullets: [
          `Brightness separation: ${contrast >= 70 ? "clear" : contrast >= 45 ? "moderate" : "weak"}`,
          `Map content: ${background === "simple" ? "height-focused" : "may contain non-height artifacts"}`,
          `Detail target: ${detail}`,
        ],
      };
    }

    if (kind === "print-settings") {
      const layer = Number(layerHeight);
      const lithophane = goal === "backlit-photo";
      const layerScore = layer <= 0.16 ? 30 : layer <= 0.22 ? 22 : 10;
      const materialScore = printer === "fdm" ? 24 : 18;
      const detailScore = detail === "high" ? 26 : detail === "medium" ? 21 : 14;
      const score = Math.min(100, layerScore + materialScore + detailScore + (lithophane ? 16 : 10));
      return {
        score,
        title: scoreLabel(score),
        recommendation: lithophane ? "Use a vertical lithophane panel with thin light areas and a slow first layer." : "Use a raised relief with conservative height and enough base thickness.",
        nextHref: lithophane ? "/lithophane-generator" : "/image-to-stl",
        nextLabel: lithophane ? "Open Lithophane Generator" : "Open Image to STL",
        bullets: [
          `Layer height: ${layer <= 0.16 ? "good for detail" : layer <= 0.22 ? "acceptable" : "too coarse for fine relief"}`,
          `Printer path: ${printer === "fdm" ? "FDM-friendly starting point" : "use resin only for small fine-detail pieces"}`,
          `Detail: ${detail === "high" ? "expect longer generation and slicing" : "balanced for first test prints"}`,
        ],
      };
    }

    if (kind === "jpg-gate") {
      const supported = fileType === "png" || fileType === "jpg";
      const typeScore = fileType === "png" ? 28 : fileType === "jpg" ? 24 : 6;
      const contrastScore = Math.round(contrast * 0.42);
      const bgScore = background === "simple" ? 24 : background === "mixed" ? 12 : 4;
      const score = Math.min(100, typeScore + contrastScore + bgScore);
      return {
        score,
        title: supported ? scoreLabel(score) : "Format gated",
        recommendation: supported ? "Use the live STL converter now. JPG will be normalized in the browser before STL generation." : "Convert this file to PNG or JPG first, then use the relief converter.",
        nextHref: supported ? "/jpg-to-stl" : "/image-contrast-guide",
        nextLabel: supported ? "Open JPG to STL" : "Check contrast first",
        bullets: [
          `Format: ${fileType.toUpperCase()} ${supported ? "is supported" : "is not directly converted yet"}`,
          `Contrast: ${contrast >= 70 ? "clear enough" : "may need boosting"}`,
          `Background: ${background === "simple" ? "good" : "cleanup recommended"}`,
        ],
      };
    }

    if (kind === "contrast") {
      const contrastScore = Math.round(contrast * 0.55);
      const bgScore = background === "simple" ? 28 : background === "mixed" ? 14 : 5;
      const detailScore = detail === "high" ? 14 : detail === "medium" ? 18 : 10;
      const score = Math.min(100, contrastScore + bgScore + detailScore);
      return {
        score,
        title: scoreLabel(score),
        recommendation: score >= 75 ? "This image should convert cleanly as a relief." : score >= 50 ? "Try threshold and smoothing before exporting the final STL." : "Clean the background or increase edge contrast before conversion.",
        nextHref: "/image-to-stl",
        nextLabel: "Try Image to STL",
        bullets: [
          `Edges: ${contrast >= 70 ? "strong" : "soft"}`,
          `Background: ${background === "simple" ? "simple" : "may create artifacts"}`,
          `Detail target: ${detail}`,
        ],
      };
    }

    const lithophane = goal === "backlit-photo";
    const relief = goal === "raised-surface" || goal === "logo-badge";
    const score = Math.min(100, (lithophane ? 32 : 22) + Math.round(contrast * 0.34) + (background === "simple" ? 20 : 10) + (detail === "high" ? 12 : 16));
    return {
      score,
      title: lithophane ? "Use lithophane" : relief ? "Use relief STL" : "Use planning first",
      recommendation: lithophane ? "A backlit photo should start in the Lithophane Generator." : relief ? "A raised surface or badge should start in Image to STL or Logo to STL." : "Start with contrast cleanup, then choose lithophane or relief.",
      nextHref: lithophane ? "/lithophane-generator" : goal === "logo-badge" ? "/logo-to-stl" : "/image-to-stl",
      nextLabel: lithophane ? "Open Lithophane Generator" : goal === "logo-badge" ? "Open Logo to STL" : "Open Image to STL",
      bullets: [
        `Goal: ${goal.replace(/-/g, " ")}`,
        `Contrast: ${contrast >= 70 ? "strong" : contrast >= 45 ? "moderate" : "weak"}`,
        `Recommended output: ${lithophane ? "backlit lithophane STL" : "raised relief STL"}`,
      ],
    };
  }, [background, contrast, detail, fileType, goal, kind, layerHeight, printer]);

  return (
    <div className="shell" style={{ padding: 22, display: "grid", gap: 18 }}>
      <div>
        <h2 className="sectionTitle">Interactive recommendation</h2>
        <p className="smallMuted" style={{ margin: 0 }}>
          {tool ? tool.promise : "Adjust the fields and get a practical next step for STL printing."}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 0.85fr)", gap: 16 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {kind === "jpg-gate" ? (
            <label style={{ display: "grid", gap: 7 }}>
              <span style={{ fontWeight: 700 }}>Current file type</span>
              <select value={fileType} onChange={(event) => setFileType(event.target.value)} style={fieldStyle}>
                <option value="jpg">JPG</option>
                <option value="webp">WebP</option>
                <option value="png">PNG</option>
              </select>
            </label>
          ) : null}

          {kind === "photo-path" || kind === "print-settings" ? (
            <label style={{ display: "grid", gap: 7 }}>
              <span style={{ fontWeight: 700 }}>Print goal</span>
              <select value={goal} onChange={(event) => setGoal(event.target.value)} style={fieldStyle}>
                <option value="backlit-photo">Backlit photo / lithophane</option>
                <option value="raised-surface">Raised surface relief</option>
                <option value="logo-badge">Logo badge or sign</option>
              </select>
            </label>
          ) : null}

          <label style={{ display: "grid", gap: 7 }}>
            <span style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              Image contrast <span style={{ color: "var(--accent-strong)" }}>{contrast}%</span>
            </span>
            <input className="inputRange" type="range" min="0" max="100" value={contrast} onChange={(event) => setContrast(Number(event.target.value))} />
          </label>

          <label style={{ display: "grid", gap: 7 }}>
            <span style={{ fontWeight: 700 }}>Background</span>
            <select value={background} onChange={(event) => setBackground(event.target.value)} style={fieldStyle}>
              <option value="simple">Simple / transparent</option>
              <option value="mixed">Mixed background</option>
              <option value="noisy">Noisy photo background</option>
            </select>
          </label>

          <label style={{ display: "grid", gap: 7 }}>
            <span style={{ fontWeight: 700 }}>Target detail</span>
            <select value={detail} onChange={(event) => setDetail(event.target.value)} style={fieldStyle}>
              <option value="low">Fast preview</option>
              <option value="medium">Balanced</option>
              <option value="high">Final detail</option>
            </select>
          </label>

          {kind === "print-settings" ? (
            <>
              <label style={{ display: "grid", gap: 7 }}>
                <span style={{ fontWeight: 700 }}>Printer type</span>
                <select value={printer} onChange={(event) => setPrinter(event.target.value)} style={fieldStyle}>
                  <option value="fdm">FDM / PLA</option>
                  <option value="resin">Resin</option>
                </select>
              </label>
              <label style={{ display: "grid", gap: 7 }}>
                <span style={{ fontWeight: 700 }}>Layer height</span>
                <select value={layerHeight} onChange={(event) => setLayerHeight(event.target.value)} style={fieldStyle}>
                  <option value="0.12">0.12 mm</option>
                  <option value="0.16">0.16 mm</option>
                  <option value="0.24">0.24 mm</option>
                </select>
              </label>
            </>
          ) : null}
        </div>

        <div style={{ border: "1px solid var(--line)", borderRadius: 14, background: "#fff", padding: 16, display: "grid", gap: 12, alignContent: "start" }}>
          <div>
            <span className="smallMuted">Recommendation</span>
            <h3 style={{ margin: "0.2rem 0 0", color: scoreColor(result.score) }}>{result.title}</h3>
          </div>
          <div style={{ height: 10, borderRadius: 999, background: "#edf2f7", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${result.score}%`, background: scoreColor(result.score) }} />
          </div>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55 }}>{result.recommendation}</p>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)", lineHeight: 1.65 }}>
            {result.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link className="btnPrimary" href={result.nextHref} style={{ width: "100%" }}>
            {result.nextLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
