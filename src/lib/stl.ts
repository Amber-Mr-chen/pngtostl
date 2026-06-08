import { decode, encode } from "fast-png";

export type StlMode = "icon" | "relief" | "sketch" | "heightmap" | "logo" | "lithophane";

export type ConvertOptions = {
  mode: StlMode;
  depth: number;
  widthMm: number;
  baseMm: number;
  invert: boolean;
  minThicknessMm: number;
  maxThicknessMm: number;
  threshold: number;
  smoothing: number;
  detail: number;
};

const DEFAULT_DETAIL = 96;
const MAX_DETAIL = 320;

type Vec3 = [number, number, number];

type ImageSample = {
  luma: number;
  alpha: number;
  darkness: number;
};

type MeshStats = {
  sourceWidth: number;
  sourceHeight: number;
  columns: number;
  rows: number;
  triangleCount: number;
  occupiedRatio: number;
  outputKind: string;
  binarySize: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function parseNumber(value: FormDataEntryValue | null, fallback: number, min: number, max: number) {
  if (typeof value !== "string") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return clamp(parsed, min, max);
}

export function parseConvertOptions(formData: FormData): ConvertOptions {
  const modeRaw = formData.get("mode");
  const mode: StlMode =
    modeRaw === "lithophane" || modeRaw === "heightmap" || modeRaw === "logo" || modeRaw === "sketch" || modeRaw === "relief" || modeRaw === "icon"
      ? modeRaw
      : "icon";

  return {
    mode,
    depth: parseNumber(formData.get("depth"), mode === "icon" || mode === "logo" || mode === "sketch" ? 1.8 : 2.5, 0.3, 8),
    widthMm: parseNumber(formData.get("widthMm"), 90, 20, 220),
    baseMm: parseNumber(formData.get("baseMm"), 1, 0.2, 5),
    invert: formData.get("invert") === "true",
    minThicknessMm: parseNumber(formData.get("minThicknessMm"), 0.8, 0.3, 3),
    maxThicknessMm: parseNumber(formData.get("maxThicknessMm"), 3.2, 1, 8),
    threshold: parseNumber(formData.get("threshold"), 0.55, 0.05, 0.95),
    smoothing: parseNumber(formData.get("smoothing"), 0.25, 0, 1),
    detail: Math.round(parseNumber(formData.get("detail"), DEFAULT_DETAIL, 48, MAX_DETAIL)),
  };
}

function samplePixel(data: Uint8Array | Uint8ClampedArray | Uint16Array, width: number, channels: number, x: number, y: number): ImageSample {
  const index = (y * width + x) * channels;
  const max = data instanceof Uint16Array ? 65535 : 255;
  const alpha = channels >= 4 ? Number(data[index + 3] ?? max) / max : 1;
  const r = Number(data[index] ?? 0) / max;
  const g = Number(data[index + 1] ?? r * max) / max;
  const b = Number(data[index + 2] ?? r * max) / max;
  const compositeR = r * alpha + (1 - alpha);
  const compositeG = g * alpha + (1 - alpha);
  const compositeB = b * alpha + (1 - alpha);
  const luma = clamp(0.2126 * compositeR + 0.7152 * compositeG + 0.0722 * compositeB, 0, 1);
  return { luma, alpha, darkness: 1 - luma };
}

function smoothGrid(grid: number[][], amount: number) {
  if (amount <= 0) return grid;
  const rows = grid.length;
  const columns = grid[0]?.length ?? 0;
  return grid.map((row, y) =>
    row.map((value, x) => {
      let sum = 0;
      let count = 0;
      for (let yy = Math.max(0, y - 1); yy <= Math.min(rows - 1, y + 1); yy += 1) {
        for (let xx = Math.max(0, x - 1); xx <= Math.min(columns - 1, x + 1); xx += 1) {
          sum += grid[yy][xx];
          count += 1;
        }
      }
      return value * (1 - amount) + (sum / count) * amount;
    }),
  );
}

function percentile(values: number[], ratio: number) {
  if (!values.length) return 1;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.round((sorted.length - 1) * ratio)));
  return sorted[index];
}

function preprocessLineArtSamples(samples: ImageSample[][], options: ConvertOptions) {
  if (options.mode !== "sketch" && options.mode !== "logo" && options.mode !== "icon") return samples;

  const flat = samples.flat().filter((sample) => sample.alpha > 0.05);
  if (!flat.length || flat.some((sample) => sample.alpha < 0.95)) return samples;

  const background = percentile(flat.map((sample) => sample.luma), 0.86);
  const foreground = percentile(flat.map((sample) => sample.luma), 0.16);
  const average = flat.reduce((sum, sample) => sum + sample.luma, 0) / flat.length;
  const darkRatio = flat.filter((sample) => background - sample.luma > 0.22).length / flat.length;
  const looksLikeSketchOrLogo = background > 0.68 && average > 0.56 && foreground < background - 0.18 && darkRatio < 0.48;

  if (!looksLikeSketchOrLogo) return samples;

  const rows = samples.length;
  const columns = samples[0]?.length ?? 0;
  const denoised = samples.map((row, y) =>
    row.map((sample, x) => {
      let localSum = 0;
      let count = 0;
      for (let yy = Math.max(0, y - 1); yy <= Math.min(rows - 1, y + 1); yy += 1) {
        for (let xx = Math.max(0, x - 1); xx <= Math.min(columns - 1, x + 1); xx += 1) {
          localSum += samples[yy][xx].luma;
          count += 1;
        }
      }
      const localAverage = count ? localSum / count : sample.luma;
      const globalStroke = clamp((background - sample.luma - 0.055) / Math.max(0.22, background - foreground), 0, 1);
      const localStroke = clamp((localAverage - sample.luma - 0.018) / 0.2, 0, 1);
      const gridSuppressed = globalStroke < 0.12 ? 0 : globalStroke;
      const signal = clamp(Math.pow(Math.max(gridSuppressed, localStroke * 0.75), 0.72), 0, 1);
      const darkness = signal < 0.08 ? 0 : signal;
      return { ...sample, luma: 1 - darkness, darkness };
    }),
  );

  return denoised.map((row, y) =>
    row.map((sample, x) => {
      let maxNeighbor = sample.darkness;
      for (let yy = Math.max(0, y - 1); yy <= Math.min(rows - 1, y + 1); yy += 1) {
        for (let xx = Math.max(0, x - 1); xx <= Math.min(columns - 1, x + 1); xx += 1) {
          maxNeighbor = Math.max(maxNeighbor, denoised[yy][xx].darkness);
        }
      }
      const reinforced = sample.darkness > 0 ? Math.max(sample.darkness, maxNeighbor * 0.38) : maxNeighbor > 0.72 ? 0.18 : 0;
      return { ...sample, luma: 1 - reinforced, darkness: reinforced };
    }),
  );
}

function buildHeightGrid(samples: ImageSample[][], options: ConvertOptions) {
  const rows = samples.length;
  const columns = samples[0]?.length ?? 0;
  const hasTransparentPixels = samples.some((row) => row.some((sample) => sample.alpha < 0.95));
  const raw: number[][] = [];
  let occupied = 0;

  for (let y = 0; y < rows; y += 1) {
    const row: number[] = [];
    for (let x = 0; x < columns; x += 1) {
      const sample = samples[y][x];
      let signal: number;

      if (options.mode === "lithophane") {
        signal = options.invert ? sample.darkness : sample.luma;
        row.push(options.minThicknessMm + signal * (options.maxThicknessMm - options.minThicknessMm));
        if (signal > 0.2) occupied += 1;
        continue;
      }

      if (options.mode === "heightmap") {
        signal = options.invert ? sample.luma : sample.darkness;
      } else if (options.mode === "sketch") {
        signal = options.invert ? sample.luma : sample.darkness;
        signal = signal >= options.threshold ? Math.max(0.38, signal) : 0;
      } else if (options.mode === "icon" || options.mode === "logo") {
        const transparentBackground = sample.alpha <= 0.05;
        if (hasTransparentPixels) {
          signal = transparentBackground ? 0 : Math.max(0.35, sample.darkness);
          if (options.invert) signal = transparentBackground ? 0 : Math.max(0.35, sample.luma);
        } else {
          const darkEnough = sample.darkness >= options.threshold;
          signal = !darkEnough ? 0 : sample.darkness;
          if (options.invert) signal = sample.luma >= options.threshold ? sample.luma : 0;
        }
      } else {
        signal = options.invert ? sample.luma : sample.darkness;
      }

      if (signal > 0.08) occupied += 1;
      row.push(options.baseMm + clamp(signal, 0, 1) * options.depth);
    }
    raw.push(row);
  }

  return {
    heights: smoothGrid(raw, options.mode === "icon" || options.mode === "logo" ? options.smoothing : options.mode === "sketch" ? Math.min(0.72, options.smoothing + 0.18) : options.smoothing * 0.5),
    occupiedRatio: rows * columns ? occupied / (rows * columns) : 0,
  };
}

function buildGeometryMask(samples: ImageSample[][], heights: number[][], options: ConvertOptions) {
  if (options.mode !== "icon" && options.mode !== "logo") return undefined;
  const rows = samples.length;
  const columns = samples[0]?.length ?? 0;
  const mask = Array.from({ length: rows }, () => Array.from({ length: columns }, () => false));

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const sample = samples[y][x];
      const raisedAboveBase = heights[y][x] > options.baseMm + 0.03;
      mask[y][x] = sample.alpha > 0.05 && raisedAboveBase;
    }
  }

  return mask;
}

type CroppedGrid = {
  heights: number[][];
  mask?: boolean[][];
};

function cropToMaskBounds(heights: number[][], mask?: boolean[][]): CroppedGrid {
  if (!mask) return { heights, mask };

  const bounds = contentBounds(mask);
  if (!bounds) return { heights, mask };
  const { minX, maxX, minY, maxY } = bounds;

  const croppedHeights = heights.slice(minY, maxY + 1).map((row) => row.slice(minX, maxX + 1));
  const croppedMask = mask.slice(minY, maxY + 1).map((row) => row.slice(minX, maxX + 1));
  return { heights: croppedHeights, mask: croppedMask };
}

function contentBounds(mask: boolean[][], padding = 0) {
  const rows = mask.length;
  const columns = mask[0]?.length ?? 0;
  let minX = columns;
  let maxX = -1;
  let minY = rows;
  let maxY = -1;

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      if (!mask[y][x]) continue;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) return undefined;
  const padX = Math.max(1, Math.round((maxX - minX + 1) * padding));
  const padY = Math.max(1, Math.round((maxY - minY + 1) * padding));
  minX = Math.max(0, minX - padX);
  maxX = Math.min(columns - 1, maxX + padX);
  minY = Math.max(0, minY - padY);
  maxY = Math.min(rows - 1, maxY + padY);

  if (maxX === minX) {
    minX = Math.max(0, minX - 1);
    maxX = Math.min(columns - 1, maxX + 1);
  }
  if (maxY === minY) {
    minY = Math.max(0, minY - 1);
    maxY = Math.min(rows - 1, maxY + 1);
  }
  return { minX, maxX, minY, maxY };
}

function buildSketchContentMask(samples: ImageSample[][], options: ConvertOptions) {
  if (options.mode !== "sketch") return undefined;
  const rows = samples.length;
  const columns = samples[0]?.length ?? 0;
  const seed = samples.map((row) => row.map((sample) => sample.darkness >= options.threshold));
  const visited = Array.from({ length: rows }, () => Array.from({ length: columns }, () => false));
  const kept = Array.from({ length: rows }, () => Array.from({ length: columns }, () => false));
  const minComponentArea = Math.max(10, Math.round(rows * columns * 0.00035));

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      if (!seed[y][x] || visited[y][x]) continue;
      const stack: Array<[number, number]> = [[x, y]];
      const component: Array<[number, number]> = [];
      visited[y][x] = true;

      while (stack.length) {
        const [cx, cy] = stack.pop()!;
        component.push([cx, cy]);
        for (let yy = Math.max(0, cy - 1); yy <= Math.min(rows - 1, cy + 1); yy += 1) {
          for (let xx = Math.max(0, cx - 1); xx <= Math.min(columns - 1, cx + 1); xx += 1) {
            if (!seed[yy][xx] || visited[yy][xx]) continue;
            visited[yy][xx] = true;
            stack.push([xx, yy]);
          }
        }
      }

      if (component.length >= minComponentArea) {
        for (const [cx, cy] of component) kept[cy][cx] = true;
      }
    }
  }

  return kept.map((row, y) =>
    row.map((active, x) => {
      if (active) return true;
      for (let yy = Math.max(0, y - 1); yy <= Math.min(rows - 1, y + 1); yy += 1) {
        for (let xx = Math.max(0, x - 1); xx <= Math.min(columns - 1, x + 1); xx += 1) {
          if (kept[yy][xx]) return true;
        }
      }
      return false;
    }),
  );
}

function applySketchContentMask(samples: ImageSample[][], contentMask: boolean[][] | undefined, options: ConvertOptions) {
  if (options.mode !== "sketch" || !contentMask) return samples;
  return samples.map((row, y) =>
    row.map((sample, x) => {
      if (!contentMask[y]?.[x]) return { ...sample, luma: 1, darkness: 0 };
      const darkness = Math.max(sample.darkness, 0.42);
      return { ...sample, luma: 1 - darkness, darkness };
    }),
  );
}

function cropSketchPlateToContent(heights: number[][], contentMask?: boolean[][]): CroppedGrid {
  if (!contentMask) return { heights };
  const bounds = contentBounds(contentMask, 0.1);
  if (!bounds) return { heights };
  const rows = heights.length;
  const columns = heights[0]?.length ?? 0;
  const contentWidth = bounds.maxX - bounds.minX + 1;
  const contentHeight = bounds.maxY - bounds.minY + 1;
  if (contentWidth > columns * 0.92 && contentHeight > rows * 0.92) return { heights };

  return {
    heights: heights.slice(bounds.minY, bounds.maxY + 1).map((row) => row.slice(bounds.minX, bounds.maxX + 1)),
  };
}

function subtract(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function normalize(v: Vec3): Vec3 {
  const length = Math.hypot(v[0], v[1], v[2]);
  if (!length) return [0, 0, 0];
  return [v[0] / length, v[1] / length, v[2] / length];
}

function triangleNormal(a: Vec3, b: Vec3, c: Vec3): Vec3 {
  return normalize(cross(subtract(b, a), subtract(c, a)));
}

function addQuad(triangles: Vec3[][], a: Vec3, b: Vec3, c: Vec3, d: Vec3) {
  triangles.push([a, b, c], [a, c, d]);
}

function buildReliefTriangles(heights: number[][], widthMm: number, heightMm: number, mask?: boolean[][]) {
  const rows = heights.length;
  const columns = heights[0]?.length ?? 0;
  const cellX = widthMm / (columns - 1);
  const cellZ = heightMm / (rows - 1);
  const backY = 0;
  const isActive = (x: number, y: number) => !mask || Boolean(mask[y]?.[x]);
  const cellActive = (x: number, y: number) => isActive(x, y) || isActive(x + 1, y) || isActive(x, y + 1) || isActive(x + 1, y + 1);
  const point = (gridX: number, gridY: number, reliefY: number): Vec3 => [gridX, reliefY, heightMm - gridY];
  const triangles: Vec3[][] = [];

  for (let y = 0; y < rows - 1; y += 1) {
    for (let x = 0; x < columns - 1; x += 1) {
      if (!cellActive(x, y)) continue;
      const x0 = x * cellX;
      const x1 = (x + 1) * cellX;
      const z0 = y * cellZ;
      const z1 = (y + 1) * cellZ;
      addQuad(triangles, point(x0, z0, heights[y][x]), point(x1, z0, heights[y][x + 1]), point(x1, z1, heights[y + 1][x + 1]), point(x0, z1, heights[y + 1][x]));
      addQuad(triangles, point(x0, z0, backY), point(x0, z1, backY), point(x1, z1, backY), point(x1, z0, backY));

      if (x === 0 || !cellActive(x - 1, y)) {
        addQuad(triangles, point(x0, z1, backY), point(x0, z0, backY), point(x0, z0, heights[y][x]), point(x0, z1, heights[y + 1][x]));
      }
      if (x === columns - 2 || !cellActive(x + 1, y)) {
        addQuad(triangles, point(x1, z0, backY), point(x1, z1, backY), point(x1, z1, heights[y + 1][x + 1]), point(x1, z0, heights[y][x + 1]));
      }
      if (y === 0 || !cellActive(x, y - 1)) {
        addQuad(triangles, point(x0, z0, backY), point(x1, z0, backY), point(x1, z0, heights[y][x + 1]), point(x0, z0, heights[y][x]));
      }
      if (y === rows - 2 || !cellActive(x, y + 1)) {
        addQuad(triangles, point(x1, z1, backY), point(x0, z1, backY), point(x0, z1, heights[y + 1][x]), point(x1, z1, heights[y + 1][x + 1]));
      }
    }
  }

  return triangles;
}

function encodeBinaryStl(triangles: Vec3[][], title: string) {
  const bytes = new Uint8Array(84 + triangles.length * 50);
  const view = new DataView(bytes.buffer);
  const header = new TextEncoder().encode(title.slice(0, 80));
  bytes.set(header, 0);
  view.setUint32(80, triangles.length, true);
  let offset = 84;

  for (const triangle of triangles) {
    const [a, b, c] = triangle;
    const normal = triangleNormal(a, b, c);
    for (const n of normal) {
      view.setFloat32(offset, n, true);
      offset += 4;
    }
    for (const vertex of triangle) {
      for (const coordinate of vertex) {
        view.setFloat32(offset, coordinate, true);
        offset += 4;
      }
    }
    view.setUint16(offset, 0, true);
    offset += 2;
  }

  return bytes;
}

async function sampleImageGrid(file: File, options: ConvertOptions) {
  const buffer = new Uint8Array(await file.arrayBuffer());
  const decoded = decode(buffer);
  const sourceWidth = decoded.width;
  const sourceHeight = decoded.height;
  const channels = decoded.channels || 4;
  const longestSide = Math.max(sourceWidth, sourceHeight);
  const targetLongestSide = Math.min(longestSide, options.detail, MAX_DETAIL);
  const scale = targetLongestSide / longestSide;
  const columns = Math.max(2, Math.round(sourceWidth * scale));
  const rows = Math.max(2, Math.round(sourceHeight * scale));

  const samples: ImageSample[][] = [];
  for (let y = 0; y < rows; y += 1) {
    const row: ImageSample[] = [];
    for (let x = 0; x < columns; x += 1) {
      const sx = Math.min(sourceWidth - 1, Math.round((x / Math.max(1, columns - 1)) * (sourceWidth - 1)));
      const sy = Math.min(sourceHeight - 1, Math.round((y / Math.max(1, rows - 1)) * (sourceHeight - 1)));
      row.push(samplePixel(decoded.data, sourceWidth, channels, sx, sy));
    }
    samples.push(row);
  }

  return { sourceWidth, sourceHeight, columns, rows, samples };
}

export async function cleanSketchPreviewPng(file: File, options: ConvertOptions) {
  const grid = await sampleImageGrid(file, { ...options, mode: "sketch" });
  const lineArtSamples = preprocessLineArtSamples(grid.samples, { ...options, mode: "sketch" });
  const sketchContentMask = buildSketchContentMask(lineArtSamples, { ...options, mode: "sketch" });
  const preparedSamples = applySketchContentMask(lineArtSamples, sketchContentMask, { ...options, mode: "sketch" });
  const imageData = new Uint8Array(grid.columns * grid.rows * 4);

  for (let y = 0; y < grid.rows; y += 1) {
    for (let x = 0; x < grid.columns; x += 1) {
      const offset = (y * grid.columns + x) * 4;
      const darkness = preparedSamples[y][x].darkness;
      const shade = Math.round(255 - clamp(darkness, 0, 1) * 255);
      imageData[offset] = shade;
      imageData[offset + 1] = shade;
      imageData[offset + 2] = shade;
      imageData[offset + 3] = 255;
    }
  }

  return {
    png: encode({ width: grid.columns, height: grid.rows, data: imageData, channels: 4 }),
    width: grid.columns,
    height: grid.rows,
  };
}

export async function pngToStl(file: File, options: ConvertOptions): Promise<{ stl: Uint8Array } & MeshStats> {
  const buffer = new Uint8Array(await file.arrayBuffer());
  const decoded = decode(buffer);
  const sourceWidth = decoded.width;
  const sourceHeight = decoded.height;
  const channels = decoded.channels || 4;
  const longestSide = Math.max(sourceWidth, sourceHeight);
  const targetLongestSide = Math.min(longestSide, options.detail, MAX_DETAIL);
  const scale = targetLongestSide / longestSide;
  const columns = Math.max(2, Math.round(sourceWidth * scale));
  const rows = Math.max(2, Math.round(sourceHeight * scale));
  const widthMm = options.widthMm;
  const heightMm = widthMm * (sourceHeight / sourceWidth);

  const samples: ImageSample[][] = [];
  for (let y = 0; y < rows; y += 1) {
    const row: ImageSample[] = [];
    for (let x = 0; x < columns; x += 1) {
      const sx = Math.min(sourceWidth - 1, Math.round((x / Math.max(1, columns - 1)) * (sourceWidth - 1)));
      const sy = Math.min(sourceHeight - 1, Math.round((y / Math.max(1, rows - 1)) * (sourceHeight - 1)));
      row.push(samplePixel(decoded.data, sourceWidth, channels, sx, sy));
    }
    samples.push(row);
  }

  const lineArtSamples = preprocessLineArtSamples(samples, options);
  const sketchContentMask = buildSketchContentMask(lineArtSamples, options);
  const preparedSamples = applySketchContentMask(lineArtSamples, sketchContentMask, options);
  const { heights, occupiedRatio } = buildHeightGrid(preparedSamples, options);
  const geometryMask = buildGeometryMask(preparedSamples, heights, options);
  const mesh = options.mode === "sketch" ? cropSketchPlateToContent(heights, sketchContentMask) : cropToMaskBounds(heights, geometryMask);
  const meshRows = mesh.heights.length;
  const meshColumns = mesh.heights[0]?.length ?? 0;
  const outputHeightMm = (mesh.mask || options.mode === "sketch") && meshRows > 1 && meshColumns > 1 ? widthMm * ((meshRows - 1) / (meshColumns - 1)) : heightMm;
  const triangles = buildReliefTriangles(mesh.heights, widthMm, outputHeightMm, mesh.mask);
  const stl = encodeBinaryStl(triangles, `pngtostl ${options.mode} ${sourceWidth}x${sourceHeight}`);

  return {
    stl,
    sourceWidth,
    sourceHeight,
    columns,
    rows,
    triangleCount: triangles.length,
    occupiedRatio,
    outputKind: options.mode,
    binarySize: stl.byteLength,
  };
}
