import type { ToolConfig } from "@/lib/tools";

const defaultModeBySlug: Record<string, NonNullable<ToolConfig["converter"]>["mode"]> = {
  "png-to-stl": "icon",
  "image-to-stl": "relief",
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
    mode: "relief",
    accept: "image/png,image/jpeg,image/webp,image/gif,image/bmp",
    widthMm: 110,
    depth: 2.4,
    baseMm: 1.2,
    threshold: 42,
    smoothing: 35,
    detail: 128,
    helper: "Universal image entry: upload PNG, JPG, WebP, GIF, or BMP, then choose relief, logo, lithophane, or heightmap mode.",
    preview: "Upload one image and choose the STL workflow that fits your print.",
    filename: "image-relief.stl",
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
    smoothing: 15,
    detail: 160,
    hiddenControls: ["mode"],
    helper: "Logo preset locks to crisp transparent-logo relief with sharper edges.",
    preview: "Upload a high-contrast PNG logo to generate a raised badge or sign STL.",
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

export function ConverterPanel({ tool }: { tool: ToolConfig }) {
  const fallback = fallbackConverter(tool);
  const converter = fallback ? { ...fallback, ...toolPresets[tool.slug], ...tool.converter } : null;
  const canConvert = Boolean(converter);
  const mode = converter?.mode ?? "icon";
  const accept = converter?.accept ?? "image/png";
  const widthMm = converter?.widthMm ?? 90;
  const depth = converter?.depth ?? 1.8;
  const baseMm = converter?.baseMm ?? 1;
  const threshold = converter?.threshold ?? 55;
  const smoothing = converter?.smoothing ?? 25;
  const detail = converter?.detail ?? 96;

  return (
    <div data-converter-root="true">
      <form
        data-converter-form="true"
        data-mode={mode}
        data-filename={converter?.filename ?? "pngtostl-output.stl"}
        data-min-thickness-mm={converter?.minThicknessMm ?? 0.8}
        data-max-thickness-mm={converter?.maxThicknessMm ?? 3.2}
        action="javascript:void(0)"
        style={{ display: "grid", gap: 18 }}
      >
        <div style={{ border: "1px dashed #b9c6d6", background: "#f8fbff", borderRadius: 14, padding: 20 }}>
          <strong>{tool.uploadLabel}</strong>
          <p className="smallMuted" style={{ margin: "0.4rem 0 0.8rem" }}>Supported: {tool.supported}</p>
          <input type="file" name="file" accept={accept} disabled={!canConvert} />
          <p className="smallMuted" style={{ margin: "0.8rem 0 0" }}>{converter?.helper ?? tool.promise}</p>
        </div>

        {canConvert && !hasHidden(converter!, "mode") ? (
          <label style={{ display: "grid", gap: 7 }}>
            <span style={{ fontWeight: 700 }}>Output mode</span>
            <select name="mode" defaultValue={mode} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "0.75rem", font: "inherit", background: "#fff" }}>
              {Object.entries(modeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <span className="smallMuted">Default: {modeLabels[mode]} for this tool.</span>
          </label>
        ) : null}

        <div style={{ display: "grid", gap: 14 }}>
          <label style={{ display: "grid", gap: 7 }}>
            <span style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              Output width <span data-value="widthMm" style={{ color: "var(--accent-strong)" }}>{widthMm} mm</span>
            </span>
            <input className="inputRange" name="widthMm" type="range" min="30" max="180" defaultValue={String(widthMm)} />
            <span className="smallMuted">Set the printable width for this output.</span>
          </label>

          {!converter || !hasHidden(converter, "depth") ? (
            <label style={{ display: "grid", gap: 7 }}>
              <span style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                {mode === "lithophane" ? "Max thickness" : mode === "heightmap" ? "Max height" : "Relief height"} <span data-value="depth" style={{ color: "var(--accent-strong)" }}>{depth.toFixed(1)} mm</span>
              </span>
              <input className="inputRange" name="depth" type="range" min="0.3" max="8" step="0.1" defaultValue={String(depth)} />
              <span className="smallMuted">{mode === "lithophane" ? "Controls the darkest/thickest areas of the lithophane." : mode === "heightmap" ? "Controls the tallest terrain or surface peaks." : "Controls raised surface height."}</span>
            </label>
          ) : null}

          {!converter || !hasHidden(converter, "base") ? (
            <label style={{ display: "grid", gap: 7 }}>
              <span style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                Base thickness <span data-value="baseMm" style={{ color: "var(--accent-strong)" }}>{baseMm.toFixed(1)} mm</span>
              </span>
              <input className="inputRange" name="baseMm" type="range" min="0.4" max="4" step="0.2" defaultValue={String(baseMm)} />
              <span className="smallMuted">Adds printable support under the generated geometry when this mode needs it.</span>
            </label>
          ) : null}

          {!converter || !hasHidden(converter, "threshold") ? (
            <label style={{ display: "grid", gap: 7 }}>
              <span style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                Edge threshold <span data-value="threshold" style={{ color: "var(--accent-strong)" }}>{threshold}%</span>
              </span>
              <input className="inputRange" name="threshold" type="range" min="5" max="95" step="1" defaultValue={String(threshold)} />
              <span className="smallMuted">Higher values keep only darker, clearer lines.</span>
            </label>
          ) : null}

          <label style={{ display: "grid", gap: 7 }}>
            <span style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              Smoothing <span data-value="smoothing" style={{ color: "var(--accent-strong)" }}>{smoothing}%</span>
            </span>
            <input className="inputRange" name="smoothing" type="range" min="0" max="100" step="5" defaultValue={String(smoothing)} />
            <span className="smallMuted">Softens jagged pixel edges before STL export.</span>
          </label>

          <label style={{ display: "grid", gap: 7 }}>
            <span style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              Detail level <span data-value="detail" style={{ color: "var(--accent-strong)" }}>{detail}</span>
            </span>
            <input className="inputRange" name="detail" type="range" min="48" max="320" step="4" defaultValue={String(detail)} />
            <span className="smallMuted">Higher detail keeps more image shape. Large files take longer.</span>
          </label>

          {!converter || !hasHidden(converter, "invert") ? (
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
              <input type="checkbox" name="invert" defaultChecked={Boolean(converter?.invert)} />
              {mode === "lithophane" ? "Invert for lithophane" : "Invert height"}
            </label>
          ) : null}
        </div>

        <button data-generate-stl="true" className="btnPrimary" type="button" style={{ width: "100%" }}>
          {canConvert ? "Generate STL" : tool.primaryCta}
        </button>
        <a data-download-stl="true" className="btnSecondary" href="#" download={converter?.filename ?? "pngtostl-output.stl"} style={{ width: "100%", textAlign: "center", display: "none" }}>
          Download STL
        </a>
        <div data-result-metrics="true" style={{ display: "none", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 className="sectionTitle">Output Preview</h2>
          <span data-converter-status className="pill" style={{ color: "var(--success)", borderColor: "rgba(15,157,88,.25)" }}>
            {canConvert ? "Waiting for image" : "Helper tool"}
          </span>
        </div>
        <div
          style={{ minHeight: 260, borderRadius: 14, border: "1px solid var(--line)", background: "#f8fbff", display: "grid", gridTemplateRows: "minmax(180px, 1fr) auto", overflow: "hidden" }}
        >
          <canvas data-stl-preview="true" aria-label="Generated STL preview" style={{ width: "100%", height: 210, display: "block" }} />
          <div
            data-converter-message
            style={{ minHeight: 74, borderTop: "1px solid var(--line)", display: "grid", placeItems: "center", color: "var(--muted)", textAlign: "center", padding: 16, whiteSpace: "pre-line", background: "rgba(255,255,255,.72)" }}
          >
            {converter?.preview ?? "Upload an image to generate STL geometry. STL files do not preserve color."}
          </div>
        </div>
      </form>
    </div>
  );
}
