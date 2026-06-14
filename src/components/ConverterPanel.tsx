"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { sampleWorkflowSlug, type SampleWorkflow, type ToolConfig } from "@/lib/tools";

const defaultModeBySlug: Record<string, NonNullable<ToolConfig["converter"]>["mode"]> = {
  "png-to-stl": "logo",
  "image-to-stl": "extrude",
  "convert-image-to-stl": "relief",
  "logo-to-stl": "logo",
  "heightmap-to-stl": "heightmap",
  "lithophane-generator": "lithophane",
  "photo-to-lithophane": "lithophane",
  "jpg-to-stl": "relief",
  "jpeg-to-stl": "relief",
  "photo-to-stl": "relief",
  "photo-relief-generator": "relief",
  "stl-relief-generator": "relief",
  "svg-to-stl": "logo",
  "icon-to-stl": "logo",
  "silhouette-to-stl": "logo",
  "black-and-white-image-to-stl": "logo",
  "text-to-3d": "logo",
  "pic-to-stl": "extrude",
  "ai-image-to-3d": "structured",
  "2d-image-to-3d-model": "relief",
};

const modeLabels = {
  icon: "Icon / emoji raised surface",
  logo: "Transparent logo badge",
  extrude: "Clean solid extrude",
  structured: "Structured artwork details",
  sketch: "Experimental sketch raised surface",
  relief: "Photo raised surface",
  heightmap: "Depth-map terrain",
  lithophane: "Backlit photo panel",
};

const toolPresets: Record<string, Partial<NonNullable<ToolConfig["converter"]>>> = {
  "png-to-stl": {
    mode: "logo",
    accept: "image/png",
    widthMm: 90,
    depth: 2.2,
    baseMm: 1,
    threshold: 58,
    smoothing: 0,
    detail: 256,
    helper: "Best for transparent PNG logos, icons, stickers, and silhouettes that should become clean solid raised geometry.",
    preview: "Upload a PNG logo or icon to create a cropped, single-height STL badge without a full square back plate.",
    filename: "png-to-stl-logo-badge.stl",
  },
  "image-to-stl": {
    mode: "extrude",
    accept: "image/png,image/jpeg,image/webp,image/gif,image/bmp",
    widthMm: 110,
    depth: 3.2,
    baseMm: 1.2,
    threshold: 54,
    smoothing: 0,
    detail: 256,
    helper: "Best for transparent logos, icons, stickers, and simple silhouettes. The image check will warn when a photo, sketch, or noisy background is a poor fit for clean extrude.",
    preview: "Upload an image to diagnose whether clean extrude, raised-surface panel, backlit photo panel, or grayscale depth map is the safer path.",
    filename: "clean-image-extrude.stl",
  },
  "convert-image-to-stl": {
    mode: "relief",
    accept: "image/png,image/jpeg,image/webp,image/gif,image/bmp",
    widthMm: 100,
    depth: 2,
    baseMm: 1,
    threshold: 48,
    smoothing: 45,
    detail: 112,
    helper: "Beginner preset: smoother relief, moderate size, and safer defaults.",
    preview: "Upload an image and use the guided preset for a first printable STL.",
    filename: "guided-image-to-stl.stl",
  },
  "jpg-to-stl": {
    mode: "relief",
    accept: "image/jpeg,image/png,image/webp,image/gif,image/bmp",
    widthMm: 110,
    depth: 2.2,
    baseMm: 1,
    threshold: 40,
    smoothing: 40,
    detail: 128,
    helper: "Common image formats are normalized in the browser, then converted as photo-style relief.",
    preview: "Upload a JPG, PNG, WebP, GIF, or BMP image to create a printable relief STL.",
    filename: "jpg-to-stl-relief.stl",
  },
  "photo-to-stl": {
    mode: "relief",
    accept: "image/png,image/jpeg,image/webp,image/gif,image/bmp",
    widthMm: 120,
    depth: 2.8,
    baseMm: 1.2,
    threshold: 38,
    smoothing: 65,
    detail: 192,
    helper: "Subject-focused photo relief preset suppresses textured backgrounds, auto-crops sparse margins, and keeps portraits large enough for a first print.",
    preview: "Upload a photo with a clear subject to generate a raised relief STL panel with background flattening and subject-focused framing.",
    filename: "photo-to-stl-relief.stl",
  },
  "photo-relief-generator": {
    mode: "relief",
    accept: "image/png,image/jpeg,image/webp,image/gif,image/bmp",
    widthMm: 120,
    depth: 2.8,
    baseMm: 1.2,
    threshold: 38,
    smoothing: 70,
    detail: 192,
    helper: "Portrait relief preset uses strong smoothing, background flattening, and subject-focused crop for plaques and memorial panels.",
    preview: "Upload a portrait, pet photo, or clear subject image to make a raised photo relief STL.",
    filename: "photo-relief-panel.stl",
  },
  "stl-relief-generator": {
    mode: "relief",
    accept: "image/png,image/jpeg,image/webp,image/gif,image/bmp",
    widthMm: 110,
    depth: 2.4,
    baseMm: 1.1,
    threshold: 45,
    smoothing: 45,
    detail: 160,
    helper: "General raised-surface preset for artwork, photos, and grayscale images that should become relief STL panels.",
    preview: "Upload artwork or a high-contrast image to generate a printable relief STL.",
    filename: "raised-relief-generator.stl",
  },
  "svg-to-stl": {
    mode: "logo",
    accept: "image/svg+xml,image/png",
    widthMm: 95,
    depth: 2.4,
    baseMm: 1.2,
    threshold: 66,
    smoothing: 0,
    detail: 320,
    hiddenControls: ["mode"],
    helper: "Vector-style logo preset preserves crisp edges; export complex SVGs as transparent PNG if needed.",
    preview: "Upload simple SVG-style art or a transparent PNG logo to create a clean raised badge STL.",
    filename: "svg-to-stl-badge.stl",
  },
  "icon-to-stl": {
    mode: "logo",
    accept: "image/png,image/svg+xml,image/webp",
    widthMm: 70,
    depth: 2,
    baseMm: 0.9,
    threshold: 62,
    smoothing: 0,
    detail: 256,
    hiddenControls: ["mode"],
    helper: "Small icon preset creates compact single-height badge geometry without color-based surface noise.",
    preview: "Upload a transparent icon or sticker image to preview a compact raised STL badge.",
    filename: "icon-to-stl-badge.stl",
  },
  "silhouette-to-stl": {
    mode: "logo",
    accept: "image/png,image/jpeg,image/webp,image/gif,image/bmp",
    widthMm: 100,
    depth: 2.4,
    baseMm: 1,
    threshold: 58,
    smoothing: 0,
    detail: 256,
    hiddenControls: ["mode"],
    helper: "Silhouette preset uses thresholded single-height extrusion for cutouts, outlines, decals, and bold shapes.",
    preview: "Upload a black silhouette or transparent cutout to generate a clean raised shape STL.",
    filename: "silhouette-to-stl-shape.stl",
  },
  "black-and-white-image-to-stl": {
    mode: "logo",
    accept: "image/png,image/jpeg,image/webp,image/bmp",
    widthMm: 95,
    depth: 2.2,
    baseMm: 1,
    threshold: 58,
    smoothing: 0,
    detail: 256,
    hiddenControls: ["mode"],
    helper: "Monochrome preset treats black-and-white artwork as a threshold mask for stamps, stencils, and signs.",
    preview: "Upload binary art and adjust threshold if the raised shape needs cleaner separation.",
    filename: "black-white-threshold-stl.stl",
  },
  "text-to-3d": {
    mode: "logo",
    accept: "image/png,image/svg+xml,image/jpeg,image/webp",
    widthMm: 100,
    depth: 2.4,
    baseMm: 1.2,
    threshold: 64,
    smoothing: 0,
    detail: 256,
    hiddenControls: ["mode"],
    helper: "Current text workflow needs rendered text artwork; prompt-based AI text-to-3D is planned for the Pro layer.",
    preview: "Upload clean text artwork or a wordmark to make a raised lettering STL today.",
    filename: "text-artwork-relief.stl",
  },
  "ai-image-to-3d": {
    mode: "structured",
    accept: "image/png,image/jpeg,image/webp,image/gif,image/bmp",
    widthMm: 100,
    depth: 2.4,
    baseMm: 1.2,
    threshold: 30,
    smoothing: 15,
    detail: 320,
    helper: "Complex artwork uses a structured STL workflow: broad support geometry plus raised interior detail. Photo relief, lithophane, and future full-3D AI paths remain separate choices.",
    preview: "Upload an image to check whether it can become a readable layered artwork STL before trying relief or future AI 3D generation.",
    filename: "ai-image-to-3d-structured-artwork.stl",
  },
  "logo-to-stl": {
    mode: "logo",
    accept: "image/png,image/svg+xml",
    widthMm: 95,
    depth: 2.4,
    baseMm: 1.2,
    threshold: 66,
    smoothing: 0,
    detail: 320,
    hiddenControls: ["mode"],
    helper: "Logo preset crops empty margins, removes small mask islands, and uses single-height solid extrusion for cleaner badges and signs.",
    preview: "Upload a high-contrast PNG or SVG logo to generate a clean raised badge or sign STL.",
    filename: "logo-to-stl-badge.stl",
  },
  "heightmap-to-stl": {
    mode: "heightmap",
    accept: "image/png",
    widthMm: 120,
    depth: 6,
    baseMm: 0.8,
    smoothing: 10,
    detail: 180,
    hiddenControls: ["mode", "threshold"],
    helper: "Depth Map preset maps grayscale brightness into terrain or surface height.",
    preview: "Upload a grayscale PNG heightmap to generate a terrain-style STL surface.",
    filename: "heightmap-surface.stl",
  },
  "lithophane-generator": {
    mode: "lithophane",
    accept: "image/png,image/jpeg,image/webp,image/gif,image/bmp",
    widthMm: 100,
    depth: 3.2,
    baseMm: 0.8,
    smoothing: 20,
    detail: 160,
    invert: true,
    minThicknessMm: 0.8,
    maxThicknessMm: 3.2,
    hiddenControls: ["threshold", "base"],
    helper: "Backlit photo panel preset maps brightness to thickness for light-box prints.",
    preview: "Upload a photo to generate an STL panel with thin light areas and thick dark areas.",
    filename: "lithophane-panel.stl",
  },
  "photo-to-lithophane": {
    mode: "lithophane",
    accept: "image/png,image/jpeg,image/webp,image/gif,image/bmp",
    widthMm: 120,
    depth: 3.4,
    baseMm: 0.8,
    smoothing: 25,
    detail: 180,
    invert: true,
    minThicknessMm: 0.8,
    maxThicknessMm: 3.4,
    hiddenControls: ["threshold", "base"],
    helper: "Photo panel preset favors portraits and backlit displays.",
    preview: "Upload a portrait or photo to generate a backlit STL panel.",
    filename: "photo-lithophane.stl",
  },
  "2d-image-to-3d-model": {
    mode: "relief",
    accept: "image/png,image/jpeg,image/webp,image/gif,image/bmp",
    widthMm: 105,
    depth: 2.8,
    baseMm: 1.4,
    threshold: 45,
    smoothing: 30,
    detail: 144,
    helper: "2D-to-3D preset creates a printable relief, not a full reconstructed object.",
    preview: "Upload a 2D image to generate a front-facing relief model.",
    filename: "2d-image-relief.stl",
  },
};

function presetFromSample(sample?: SampleWorkflow | null): Partial<NonNullable<ToolConfig["converter"]>> {
  if (!sample) return {};
  const settings = sample.settings.join(" | ").toLowerCase();
  const width = settings.match(/width:\s*([0-9.]+)\s*mm/);
  const relief = settings.match(/(?:relief height|max height|max thickness):\s*([0-9.]+)\s*mm/);
  const detail = settings.match(/detail:\s*([0-9.]+)/);
  const smoothing = settings.match(/smoothing:\s*(low|medium|high|[0-9.]+%?)/);
  const mode = sample.category === "lithophane" ? "lithophane" : sample.category === "heightmap" ? "heightmap" : sample.category === "logo" ? "logo" : "relief";
  const preset: Partial<NonNullable<ToolConfig["converter"]>> = {
    mode,
    helper: `Loaded from sample: ${sample.title}. Upload your own image, then fine-tune if needed.`,
    preview: `Sample preset loaded: ${sample.title}. Use the settings as a starting point, then generate your own STL.`,
  };
  if (width) preset.widthMm = Number(width[1]);
  if (relief) preset.depth = Number(relief[1]);
  if (detail) preset.detail = Number(detail[1]);
  if (smoothing) {
    const raw = smoothing[1];
    preset.smoothing = raw === "low" ? 10 : raw === "medium" ? 35 : raw === "high" ? 60 : Number(raw.replace("%", ""));
  }
  if (sample.category === "lithophane") {
    const thickness = sample.recommendedPreset.match(/([0-9.]+)-([0-9.]+)\s*mm thickness/);
    preset.invert = true;
    if (thickness) {
      preset.minThicknessMm = Number(thickness[1]);
      preset.maxThicknessMm = Number(thickness[2]);
      preset.depth = Number(thickness[2]);
    }
  }
  return preset;
}

function fallbackConverter(tool: ToolConfig): NonNullable<ToolConfig["converter"]> | null {
  const mode = defaultModeBySlug[tool.slug];
  if (!mode) return null;
  return {
    mode,
    accept: ["jpg-to-stl", "jpeg-to-stl", "pic-to-stl"].includes(tool.slug) ? "image/jpeg,image/png,image/webp,image/gif,image/bmp" : tool.slug.includes("photo") || tool.slug === "image-to-stl" ? "image/png,image/jpeg,image/webp,image/gif,image/bmp" : "image/png",
    widthMm: mode === "lithophane" ? 100 : mode === "heightmap" ? 120 : 90,
    depth: mode === "lithophane" ? 3.2 : mode === "logo" ? 2.2 : mode === "heightmap" ? 5 : 1.8,
    baseMm: mode === "lithophane" ? 0.8 : 1,
    threshold: mode === "logo" ? 62 : mode === "icon" ? 55 : 45,
    smoothing: mode === "heightmap" ? 15 : mode === "relief" ? 35 : 25,
    detail: mode === "heightmap" ? 160 : mode === "logo" ? 128 : 96,
    invert: mode === "lithophane",
    minThicknessMm: 0.8,
    maxThicknessMm: 3.2,
    hiddenControls: mode === "lithophane" ? ["threshold", "base"] : mode === "heightmap" ? ["threshold"] : [],
    helper: mode === "lithophane" ? "Backlit photo panel mode maps brightness to material thickness." : "Tune the output for a printable raised surface.",
    preview: "Upload an image to generate STL geometry. STL files do not preserve color.",
    filename: `pngtostl-${mode}.stl`,
  };
}

function hasHidden(converter: NonNullable<ToolConfig["converter"]>, key: "mode" | "threshold" | "base" | "invert" | "depth") {
  return converter.hiddenControls?.includes(key);
}

function RangeField({ name, label, value, min, max, step, help }: { name: string; label: string; value: string | number; min: string; max: string; step?: string; help: string }) {
  return (
    <label className="converterField">
      <span>
        {label} <b data-value={name}>{value}</b>
      </span>
      <input className="inputRange" name={name} type="range" min={min} max={max} step={step} defaultValue={String(value).replace(/[^0-9.]/g, "")} />
      <small>{help}</small>
      <em>{min}–{max}{name === "widthMm" || name === "depth" || name === "baseMm" ? " mm" : name === "threshold" || name === "smoothing" ? "%" : ""}</em>
    </label>
  );
}

export function ConverterPanel({ tool, loadedSample, compactHome = false }: { tool: ToolConfig; loadedSample?: SampleWorkflow | null; compactHome?: boolean }) {
  const fallback = fallbackConverter(tool);
  const samplePreset = presetFromSample(loadedSample);
  const converter = fallback ? { ...fallback, ...toolPresets[tool.slug], ...tool.converter, ...samplePreset } : null;
  const canConvert = Boolean(converter);
  const mode = converter?.mode ?? "icon";
  const accept = converter?.accept ?? "image/png";
  const widthMm = converter?.widthMm ?? 90;
  const depth = converter?.depth ?? 1.8;
  const baseMm = converter?.baseMm ?? 1;
  const threshold = converter?.threshold ?? 55;
  const smoothing = converter?.smoothing ?? 25;
  const detail = converter?.detail ?? 96;
  const depthLabel = mode === "lithophane" ? "Max thickness" : mode === "heightmap" ? "Max height" : "Relief height";
  const isAi3dTask = tool.slug === "ai-image-to-3d";
  const generateButtonLabel = isAi3dTask ? "Check AI 3D availability and prepare fallback" : "Choose an image, then generate STL";
  const statusWaitingLabel = isAi3dTask ? "Provider check needed" : "Waiting for image";
  const resultSectionTitle = isAi3dTask ? "Provider state, STL fallback, result preview" : "Preview, validate, download";
  const homeMode = compactHome;

  if (homeMode) {
    return (
      <div data-converter-root="true" className="converterWorkspace converterWorkspaceHome">
        <form
          data-converter-form="true"
          data-tool={tool.slug}
          data-mode={mode}
          data-sample-preset={loadedSample ? "true" : undefined}
          data-sample-slug={loadedSample ? sampleWorkflowSlug(loadedSample.title) : undefined}
          data-sample-title={loadedSample?.title}
          data-sample-category={loadedSample?.category}
          data-filename={converter?.filename ?? "pngtostl-output.stl"}
          data-min-thickness-mm={converter?.minThicknessMm ?? 0.8}
          data-max-thickness-mm={converter?.maxThicknessMm ?? 3.2}
          data-empty-message={converter?.preview ?? "Upload an image to generate STL geometry. STL files do not preserve color."}
          data-compact-home="true"
          action="#converter"
        >
          <section className="converterControls converterControlsHome" aria-label="Upload and STL settings">
            {loadedSample ? (
              <div className="loadedSamplePreset" data-loaded-sample-preset="true">
                <span>Sample preset loaded</span>
                <strong>{loadedSample.title}</strong>
                <small>{loadedSample.recommendedPreset}</small>
              </div>
            ) : null}
            <div className="converterPanelTitle">
              <div>
                <span className="smallMuted">Upload image</span>
                <strong>Start with one file</strong>
              </div>
              <span className="creditPill">Free preview</span>
            </div>

            <div className="uploadDropzone compactDropzone">
              <div>
                <strong>{tool.uploadLabel}</strong>
                <p>{converter?.helper ?? "Drop an image to check the safest STL route."}</p>
              </div>
              <label className="customFileInput">
                <input type="file" name="file" accept={accept} disabled={!canConvert} />
                <span className="customFileButton">Choose file</span>
                <span className="customFileName" data-file-name="true">No file selected</span>
              </label>
            </div>

            <div className="qualityChooser compactQualityChooser" aria-label="Quality preset">
              <div className="qualityHeader">
                <span>Preview speed</span>
              </div>
              <div className="qualitySegments">
                <label>
                  <input type="radio" name="quality" value="fast" defaultChecked />
                  <span>Quick</span>
                </label>
                <label>
                  <input type="radio" name="quality" value="standard" />
                  <span>Balanced</span>
                </label>
                <label>
                  <input type="radio" name="quality" value="high" />
                  <span>Detailed</span>
                </label>
              </div>
            </div>

            <button data-generate-stl="true" className="btnPrimary converterGenerateButton" type="button" disabled={!canConvert}>
              {generateButtonLabel}
            </button>
          </section>

          <section className="resultWorkspace resultWorkspaceHome resultWorkspaceHomeCompact" aria-label="STL preview and download">
            <div className="resultHeader">
              <div>
                <span className="smallMuted">Output preview</span>
                <h2 className="sectionTitle">Check the STL route before you print</h2>
              </div>
              <span className="pill statusPill">Free preview</span>
            </div>
            <div className="homePreviewMock" aria-hidden="true">
              <div className="homePreviewMockImage">
                <span />
                <span />
                <span />
              </div>
              <div className="homePreviewMockFlow">
                <strong>PNG artwork</strong>
                <span>→</span>
                <strong>Relief STL</strong>
              </div>
            </div>
            <p className="homePreviewNote">Upload an image to preview the safest path: logo extrusion, photo relief, lithophane, or heightmap-style STL.</p>
            <div className="homePreviewMeta">
              <div>
                <span>Formats</span>
                <strong>PNG, JPG, WebP, GIF, BMP</strong>
              </div>
              <div>
                <span>Privacy</span>
                <strong>browser-first preview flow</strong>
              </div>
              <div>
                <span>Download</span>
                <strong>print-ready STL workflow</strong>
              </div>
            </div>
            <span data-converter-status className="pill statusPill" hidden>{statusWaitingLabel}</span>
            <div className="previewStage" hidden>
              <div data-preview-empty-state="true" hidden />
              <canvas data-stl-preview="true" aria-label="Generated STL preview" />
              <div data-converter-message>{converter?.preview ?? "Upload an image to generate STL geometry."}</div>
            </div>
            <div data-result-metrics="true" className="resultMetrics" />
            <a data-download-stl="true" className="btnPrimary downloadButton" href="#" download={converter?.filename ?? "pngtostl-output.stl"}>
              Download STL
            </a>
          </section>
        </form>
      </div>
    );
  }

  return (
    <div data-converter-root="true" className="converterWorkspace">
      <form
        data-converter-form="true"
        data-tool={tool.slug}
        data-mode={mode}
        data-sample-preset={loadedSample ? "true" : undefined}
        data-sample-slug={loadedSample ? sampleWorkflowSlug(loadedSample.title) : undefined}
        data-sample-title={loadedSample?.title}
        data-sample-category={loadedSample?.category}
        data-filename={converter?.filename ?? "pngtostl-output.stl"}
        data-min-thickness-mm={converter?.minThicknessMm ?? 0.8}
        data-max-thickness-mm={converter?.maxThicknessMm ?? 3.2}
        data-empty-message={converter?.preview ?? "Upload an image to generate STL geometry. STL files do not preserve color."}
        data-compact-home={homeMode ? "true" : undefined}
        action="#converter"
      >
        <section className="converterControls" aria-label="Upload and STL settings">
          {loadedSample ? (
            <div className="loadedSamplePreset" data-loaded-sample-preset="true">
              <span>Sample preset loaded</span>
              <strong>{loadedSample.title}</strong>
              <small>{loadedSample.recommendedPreset}</small>
            </div>
          ) : null}
          <div className="converterPanelTitle">
            <div>
              <span className="smallMuted">Upload image</span>
              <strong>Choose input</strong>
            </div>
            <span className="creditPill">Free preview</span>
          </div>

          <div className="uploadDropzone compactDropzone">
            <div>
              <strong>{tool.uploadLabel}</strong>
              <small>{converter?.helper ?? "Upload an image to check the safest STL route."}</small>
            </div>
            <label className="customFileInput">
              <input type="file" name="file" accept={accept} disabled={!canConvert} />
              <span className="customFileButton">Choose file</span>
              <span className="customFileName" data-file-name="true">No file selected</span>
            </label>
          </div>

          <div className="imageDiagnosis" data-image-diagnosis="true" hidden>
            <div>
              <span className="eyebrow">Image check</span>
              <strong data-diagnosis-title="true">Upload an image to get a recommendation</strong>
              <p data-diagnosis-message="true">Transparent logos, icons, stickers, and simple silhouettes are the safest inputs for clean STL extrusion.</p>
            </div>
            <div className="diagnosisFacts">
              <span data-diagnosis-alpha="true">Transparency: waiting</span>
              <span data-diagnosis-subject="true">Subject coverage: waiting</span>
              <span data-diagnosis-complexity="true">Complexity: waiting</span>
            </div>
            <Link data-lithophane-suggestion="true" className="diagnosisLink" href="/lithophane-generator" hidden>Try lithophane</Link>
            <button data-smoother-suggestion="true" className="diagnosisAction" type="button" hidden>Apply smoother</button>
          </div>

          <div className="qualityChooser compactQualityChooser" aria-label="Quality preset">
            <div className="qualityHeader">
              <span>Quality</span>
            </div>
            <div className="qualitySegments">
              <label>
                <input type="radio" name="quality" value="fast" defaultChecked />
                <span>Quick</span>
              </label>
              <label>
                <input type="radio" name="quality" value="standard" />
                <span>Standard</span>
              </label>
              <label>
                <input type="radio" name="quality" value="high" />
                <span>Detailed</span>
              </label>
            </div>
          </div>

          <button data-generate-stl="true" className="btnPrimary converterGenerateButton" type="button" disabled={!canConvert}>
            {generateButtonLabel}
          </button>

          <details className="advancedSettings compactAdvancedSettings">
            <summary>More settings</summary>
            <div>
              {canConvert && !hasHidden(converter!, "mode") ? (
                <label className="converterField">
                  <span>Output mode</span>
                  <select name="mode" defaultValue={mode}>
                    {Object.entries(modeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
              ) : null}
              <div className="basicSettings">
                <RangeField name="widthMm" label="Output width" value={`${widthMm} mm`} min="30" max="180" help="Printable width." />
                {!converter || !hasHidden(converter, "depth") ? (
                  <RangeField name="depth" label={depthLabel} value={`${depth.toFixed(1)} mm`} min="0.3" max="8" step="0.1" help={mode === "lithophane" ? "Thickness." : mode === "heightmap" ? "Height." : "Relief."} />
                ) : null}
              </div>
              {!converter || !hasHidden(converter, "base") ? (
                <RangeField name="baseMm" label="Base thickness" value={`${baseMm.toFixed(1)} mm`} min="0.4" max="4" step="0.2" help="Support." />
              ) : null}
              {!converter || !hasHidden(converter, "threshold") ? (
                <RangeField name="threshold" label="Edge threshold" value={`${threshold}%`} min="5" max="95" step="1" help="Keeps darker lines." />
              ) : null}
              <RangeField name="smoothing" label="Smoothing" value={`${smoothing}%`} min="0" max="100" step="5" help="Softens edges." />
              <RangeField name="detail" label="Detail level" value={detail} min="48" max="352" step="4" help="Higher detail keeps more shape." />
              {!converter || !hasHidden(converter, "invert") ? (
                <label className="checkField">
                  <input type="checkbox" name="invert" defaultChecked={Boolean(converter?.invert)} />
                  {mode === "lithophane" ? "Invert for lithophane" : "Invert height"}
                </label>
              ) : null}
            </div>
          </details>

        </section>

        <section className="resultWorkspace" aria-label="STL preview and download">
          <div className="resultHeader">
            <div>
              <span className="smallMuted">Result workspace</span>
              <h2 className="sectionTitle">{resultSectionTitle}</h2>
            </div>
            <span data-converter-status className="pill statusPill">{statusWaitingLabel}</span>
          </div>

          <div className="previewStage compactPreviewStage">
            <div className="viewportToolbar" aria-label="Preview viewport controls">
              <span className="active">Solid</span>
              <span>Wireframe</span>
              <span>Reset view</span>
            </div>
            <div className="previewEmptyState" data-preview-empty-state="true">
              <span aria-hidden="true">▧</span>
              <strong>Ready to generate</strong>
            </div>
            <canvas data-stl-preview="true" aria-label="Generated STL preview" />
            <div data-converter-message>
              {converter?.preview ?? "Upload an image to generate STL geometry. STL files do not preserve color."}
            </div>
          </div>

          <div className="cleanPreviewPanel" data-clean-preview-panel="true" hidden>
            <div>
              <span className="smallMuted">Cleaned line art</span>
              <strong>Original noise suppressed before STL</strong>
            </div>
            <img data-clean-preview-image="true" alt="Cleaned sketch preview before STL generation" />
          </div>

          <div data-result-metrics="true" className="resultMetrics" />

          <a data-download-stl="true" className="btnPrimary downloadButton" href="#" download={converter?.filename ?? "pngtostl-output.stl"}>
            Download STL
          </a>

          <div className="outputFacts">
            {tool.outputFacts.map((fact) => (
              <div key={fact.label}>
                <span>{fact.label}</span>
                <strong>{fact.value}</strong>
              </div>
            ))}
          </div>

          <p className="outputLimit">{tool.limit}</p>
        </section>
      </form>
    </div>
  );
}
