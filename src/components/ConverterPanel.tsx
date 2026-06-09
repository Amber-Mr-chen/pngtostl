import { sampleWorkflowSlug, type SampleWorkflow, type ToolConfig } from "@/lib/tools";

const defaultModeBySlug: Record<string, NonNullable<ToolConfig["converter"]>["mode"]> = {
  "png-to-stl": "icon",
  "image-to-stl": "extrude",
  "convert-image-to-stl": "relief",
  "logo-to-stl": "logo",
  "heightmap-to-stl": "heightmap",
  "lithophane-generator": "lithophane",
  "photo-to-lithophane": "lithophane",
  "jpg-to-stl": "relief",
  "2d-image-to-3d-model": "relief",
};

const modeLabels = {
  icon: "Icon / emoji relief",
  logo: "Transparent logo relief",
  extrude: "Clean solid extrude",
  sketch: "Experimental sketch relief",
  relief: "Photo-style relief",
  heightmap: "Heightmap terrain",
  lithophane: "Lithophane",
};

const toolPresets: Record<string, Partial<NonNullable<ToolConfig["converter"]>>> = {
  "png-to-stl": {
    mode: "icon",
    accept: "image/png",
    widthMm: 90,
    depth: 1.8,
    baseMm: 1,
    threshold: 58,
    smoothing: 25,
    detail: 96,
    helper: "Best for transparent PNG icons, emojis, stickers, and simple shapes.",
    preview: "Upload a PNG icon to create raised geometry without a full square back plate.",
    filename: "pngtostl-icon-relief.stl",
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
    preview: "Upload an image to diagnose whether clean extrude, relief, lithophane, or heightmap is the safer path.",
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
    helper: "Logo preset crops empty margins, scales the actual artwork width, and uses maximum detail with no smoothing to preserve text and sharp edges.",
    preview: "Upload a high-contrast PNG or SVG logo to generate a raised badge or sign STL.",
    filename: "logo-relief.stl",
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
    helper: "Heightmap preset maps grayscale brightness into terrain or surface height.",
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
    helper: "Lithophane preset maps brightness to thickness for backlit photo panels.",
    preview: "Upload a photo to generate a lithophane STL with thin light areas and thick dark areas.",
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
    helper: "Photo lithophane preset favors portraits and backlit panels.",
    preview: "Upload a portrait or photo to generate a backlit lithophane STL.",
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
    accept: tool.slug === "jpg-to-stl" ? "image/jpeg,image/png" : tool.slug.includes("photo") || tool.slug === "image-to-stl" ? "image/png,image/jpeg,image/webp,image/gif,image/bmp" : "image/png",
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
    helper: mode === "lithophane" ? "Lithophane maps brightness to material thickness for backlit prints." : "Tune the output for a printable raised relief.",
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

export function ConverterPanel({ tool, loadedSample }: { tool: ToolConfig; loadedSample?: SampleWorkflow | null }) {
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
        action="javascript:void(0)"
      >
        <section className="converterControls" aria-label="Upload and STL settings">
          {loadedSample ? (
            <div className="loadedSamplePreset" data-loaded-sample-preset="true">
              <span>Sample preset loaded</span>
              <strong>{loadedSample.title}</strong>
              <small>{loadedSample.recommendedPreset}</small>
            </div>
          ) : null}
          <div className="uploadDropzone">
            <div>
              <strong>{tool.uploadLabel}</strong>
              <p>Drop an image here or choose a file. Supported: {tool.supported}</p>
            </div>
            <input type="file" name="file" accept={accept} disabled={!canConvert} />
            <small>{converter?.helper ?? tool.promise}</small>
            <ul className="trustNotes" aria-label="Processing notes">
              <li>STL output is single-material geometry, not color.</li>
              <li>Files are processed only for this conversion request.</li>
              <li>Recommended image size: under 2048×2048 for faster previews.</li>
            </ul>
          </div>

          <div className="imageDiagnosis" data-image-diagnosis="true" hidden>
            <div>
              <span className="smallMuted">Image check</span>
              <strong data-diagnosis-title="true">Upload an image to get a recommendation</strong>
              <p data-diagnosis-message="true">Transparent logos, icons, stickers, and simple silhouettes are the safest inputs for clean STL extrusion.</p>
            </div>
            <div className="diagnosisFacts" aria-label="Image suitability facts">
              <span data-diagnosis-alpha="true">Transparency: waiting</span>
              <span data-diagnosis-subject="true">Subject coverage: waiting</span>
              <span data-diagnosis-complexity="true">Complexity: waiting</span>
            </div>
          </div>

          <button data-generate-stl="true" className="btnPrimary converterGenerateButton" type="button" disabled={!canConvert}>
            Choose an image, then generate STL
          </button>

          {canConvert && !hasHidden(converter!, "mode") ? (
            <label className="converterField">
              <span>Output mode</span>
              <select name="mode" defaultValue={mode}>
                {Object.entries(modeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <small>Choose clean extrude for logos/icons, relief for tonal images, lithophane for photos, or heightmap for grayscale depth maps.</small>
            </label>
          ) : null}

          <div className="basicSettings">
            <RangeField name="widthMm" label="Output width" value={`${widthMm} mm`} min="30" max="180" help="Set the printable width for this output." />
            {!converter || !hasHidden(converter, "depth") ? (
              <RangeField name="depth" label={depthLabel} value={`${depth.toFixed(1)} mm`} min="0.3" max="8" step="0.1" help={mode === "lithophane" ? "Controls the darkest/thickest areas of the lithophane." : mode === "heightmap" ? "Controls the tallest terrain or surface peaks." : "Controls raised surface height."} />
            ) : null}
          </div>

          <details className="advancedSettings">
            <summary>Advanced print settings</summary>
            <div>
              <label className="converterField">
                <span>Quality preset</span>
                <select name="quality" defaultValue="fast">
                  <option value="fast">Fast preview · 128</option>
                  <option value="standard">Standard · 256</option>
                  <option value="high">High detail · 320</option>
                </select>
                <small>Use Standard or High for character art, stickers, and logo cutouts with small details.</small>
              </label>
              {!converter || !hasHidden(converter, "base") ? (
                <RangeField name="baseMm" label="Base thickness" value={`${baseMm.toFixed(1)} mm`} min="0.4" max="4" step="0.2" help="Adds printable support under generated geometry when this mode needs it." />
              ) : null}
              {!converter || !hasHidden(converter, "threshold") ? (
                <RangeField name="threshold" label="Edge threshold" value={`${threshold}%`} min="5" max="95" step="1" help="Higher values keep only darker, clearer lines." />
              ) : null}
              <RangeField name="smoothing" label="Smoothing" value={`${smoothing}%`} min="0" max="100" step="5" help="Softens jagged pixel edges before STL export." />
              <RangeField name="detail" label="Detail level" value={detail} min="48" max="320" step="4" help="Higher detail keeps more image shape. Large files take longer." />
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
              <h2 className="sectionTitle">Preview, validate, download</h2>
            </div>
            <span data-converter-status className="pill statusPill">Waiting for image</span>
          </div>

          <div className="previewStage">
            <div className="viewportToolbar" aria-label="Preview viewport controls">
              <span className="active">Solid</span>
              <span>Edges</span>
              <span>Wireframe</span>
              <span>Front</span>
              <span>Iso</span>
              <span>Top</span>
              <span>Reset view</span>
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

          <ol className="generationStepper" aria-label="Generation flow">
            <li>Upload image</li>
            <li>Generate mesh</li>
            <li>Preview STL</li>
            <li>Download</li>
          </ol>

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
