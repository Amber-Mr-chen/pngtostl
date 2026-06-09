import { decode, encode } from "fast-png";

export type StlMode = "icon" | "relief" | "sketch" | "extrude" | "heightmap" | "logo" | "lithophane";

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
const MAX_DETAIL = 352;

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
    modeRaw === "lithophane" || modeRaw === "heightmap" || modeRaw === "logo" || modeRaw === "extrude" || modeRaw === "sketch" || modeRaw === "relief" || modeRaw === "icon"
      ? modeRaw
      : "icon";

  return {
    mode,
    depth: parseNumber(formData.get("depth"), mode === "icon" || mode === "logo" || mode === "sketch" || mode === "extrude" ? 1.8 : 2.5, 0.3, 8),
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

function mixSample(a: ImageSample, b: ImageSample, amount: number): ImageSample {
  const luma = a.luma * (1 - amount) + b.luma * amount;
  const alpha = a.alpha * (1 - amount) + b.alpha * amount;
  return { luma, alpha, darkness: 1 - luma };
}

function samplePixelBilinear(data: Uint8Array | Uint8ClampedArray | Uint16Array, width: number, height: number, channels: number, x: number, y: number): ImageSample {
  const x0 = Math.max(0, Math.min(width - 1, Math.floor(x)));
  const y0 = Math.max(0, Math.min(height - 1, Math.floor(y)));
  const x1 = Math.max(0, Math.min(width - 1, x0 + 1));
  const y1 = Math.max(0, Math.min(height - 1, y0 + 1));
  const tx = x - x0;
  const ty = y - y0;
  const top = mixSample(samplePixel(data, width, channels, x0, y0), samplePixel(data, width, channels, x1, y0), tx);
  const bottom = mixSample(samplePixel(data, width, channels, x0, y1), samplePixel(data, width, channels, x1, y1), tx);
  return mixSample(top, bottom, ty);
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

function localGridMean(grid: number[][], x: number, y: number, radius: number) {
  const rows = grid.length;
  const columns = grid[0]?.length ?? 0;
  let sum = 0;
  let count = 0;
  for (let yy = Math.max(0, y - radius); yy <= Math.min(rows - 1, y + radius); yy += 1) {
    for (let xx = Math.max(0, x - radius); xx <= Math.min(columns - 1, x + radius); xx += 1) {
      sum += grid[yy][xx];
      count += 1;
    }
  }
  return count ? sum / count : grid[y]?.[x] ?? 0;
}

function localGridRange(grid: number[][], x: number, y: number, radius: number) {
  const rows = grid.length;
  const columns = grid[0]?.length ?? 0;
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (let yy = Math.max(0, y - radius); yy <= Math.min(rows - 1, y + radius); yy += 1) {
    for (let xx = Math.max(0, x - radius); xx <= Math.min(columns - 1, x + radius); xx += 1) {
      const value = grid[yy][xx];
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  }
  return max - min;
}

function smoothReliefGrid(grid: number[][], amount: number) {
  const strength = clamp(amount, 0, 1);
  if (strength <= 0.01) return grid;

  let result = grid;
  const iterations = 1 + Math.round(strength * 2);
  for (let index = 0; index < iterations; index += 1) {
    result = smoothGrid(result, 0.22 + strength * 0.22);
  }

  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const row of result) {
    for (const value of row) {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  }
  const heightRange = Math.max(max - min, 0.001);
  const noiseLimit = heightRange * (0.03 + strength * 0.07);
  const noiseBlend = 0.42 + strength * 0.42;
  const edgeBlend = strength * 0.16;

  const denoised = result.map((row, y) =>
    row.map((value, x) => {
      const mean = localGridMean(result, x, y, 2);
      const delta = value - mean;
      const blend = Math.abs(delta) < noiseLimit ? noiseBlend : edgeBlend;
      return value * (1 - blend) + mean * blend;
    }),
  );

  let surfaceBase = denoised;
  const surfaceIterations = 2 + Math.round(strength * 2);
  for (let index = 0; index < surfaceIterations; index += 1) {
    surfaceBase = smoothGrid(surfaceBase, 0.34 + strength * 0.2);
  }

  const textureLimit = heightRange * (0.2 + strength * 0.14);
  const preserveEdgeRange = heightRange * (0.06 + strength * 0.04);
  const surfaceBlend = 0.86 + strength * 0.12;
  const textureSuppressed = denoised.map((row, y) =>
    row.map((value, x) => {
      const baseValue = surfaceBase[y][x];
      const detail = value - baseValue;
      const coarseRange = localGridRange(surfaceBase, x, y, 2);
      if (Math.abs(detail) < textureLimit || coarseRange < preserveEdgeRange) {
        return value * (1 - surfaceBlend) + baseValue * surfaceBlend;
      }
      return value * (1 - edgeBlend) + baseValue * edgeBlend;
    }),
  );

  const floorCutoff = min + heightRange * (0.06 + strength * 0.1);
  const floorBlend = 0.62 + strength * 0.28;
  const flattened = textureSuppressed.map((row) =>
    row.map((value) => {
      if (value <= floorCutoff) return value * (1 - floorBlend) + min * floorBlend;
      return value;
    }),
  );

  return smoothGrid(flattened, strength > 0.7 ? 0.28 + strength * 0.12 : strength * 0.18);
}

function percentile(values: number[], ratio: number) {
  if (!values.length) return 1;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.round((sorted.length - 1) * ratio)));
  return sorted[index];
}

function preprocessLineArtSamples(samples: ImageSample[][], options: ConvertOptions) {
  if (options.mode !== "sketch" && options.mode !== "logo" && options.mode !== "icon" && options.mode !== "extrude") return samples;

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
      } else if (options.mode === "extrude") {
        const transparentBackground = sample.alpha <= 0.05;
        if (hasTransparentPixels) {
          signal = transparentBackground ? 0 : 1;
        } else {
          const foreground = options.invert ? sample.luma >= options.threshold : sample.darkness >= options.threshold;
          signal = foreground ? 1 : 0;
        }
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

  const smoothingAmount =
    options.mode === "extrude"
      ? 0
      : options.mode === "icon" || options.mode === "logo"
        ? options.smoothing
        : options.mode === "sketch"
          ? Math.min(0.72, options.smoothing + 0.18)
          : options.mode === "relief"
            ? Math.max(0.42, options.smoothing)
            : options.smoothing * 0.5;

  return {
    heights: options.mode === "relief" ? smoothReliefGrid(raw, smoothingAmount) : smoothGrid(raw, smoothingAmount),
    occupiedRatio: rows * columns ? occupied / (rows * columns) : 0,
  };
}

function buildGeometryMask(samples: ImageSample[][], heights: number[][], options: ConvertOptions) {
  if (options.mode !== "icon" && options.mode !== "logo" && options.mode !== "extrude") return undefined;
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

  return options.mode === "extrude" ? cleanExtrudeMask(mask) : mask;
}

function cleanExtrudeMask(mask: boolean[][]) {
  const rows = mask.length;
  const columns = mask[0]?.length ?? 0;
  const total = rows * columns;
  const visited = Array.from({ length: rows }, () => Array.from({ length: columns }, () => false));
  const kept = Array.from({ length: rows }, () => Array.from({ length: columns }, () => false));
  const minComponentArea = Math.max(18, Math.round(total * 0.0005));

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      if (!mask[y][x] || visited[y][x]) continue;
      const stack: Array<[number, number]> = [[x, y]];
      const component: Array<[number, number]> = [];
      visited[y][x] = true;

      while (stack.length) {
        const [cx, cy] = stack.pop()!;
        component.push([cx, cy]);
        for (let yy = Math.max(0, cy - 1); yy <= Math.min(rows - 1, cy + 1); yy += 1) {
          for (let xx = Math.max(0, cx - 1); xx <= Math.min(columns - 1, cx + 1); xx += 1) {
            if (!mask[yy][xx] || visited[yy][xx]) continue;
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

  const filled = kept.map((row, y) =>
    row.map((active, x) => {
      if (active) return true;
      let neighbors = 0;
      for (let yy = Math.max(0, y - 1); yy <= Math.min(rows - 1, y + 1); yy += 1) {
        for (let xx = Math.max(0, x - 1); xx <= Math.min(columns - 1, x + 1); xx += 1) {
          if (kept[yy][xx]) neighbors += 1;
        }
      }
      return neighbors >= 6;
    }),
  );

  return filled.map((row, y) =>
    row.map((active, x) => {
      if (!active) return false;
      let neighbors = 0;
      for (let yy = Math.max(0, y - 1); yy <= Math.min(rows - 1, y + 1); yy += 1) {
        for (let xx = Math.max(0, x - 1); xx <= Math.min(columns - 1, x + 1); xx += 1) {
          if (filled[yy][xx]) neighbors += 1;
        }
      }
      return neighbors >= 2;
    }),
  );
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
  const horizontalRuns = Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0));
  const verticalRuns = Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0));

  for (let y = 0; y < rows; y += 1) {
    let x = 0;
    while (x < columns) {
      if (!seed[y][x]) {
        x += 1;
        continue;
      }
      const start = x;
      while (x < columns && seed[y][x]) x += 1;
      const length = x - start;
      for (let xx = start; xx < x; xx += 1) horizontalRuns[y][xx] = length;
    }
  }

  for (let x = 0; x < columns; x += 1) {
    let y = 0;
    while (y < rows) {
      if (!seed[y][x]) {
        y += 1;
        continue;
      }
      const start = y;
      while (y < rows && seed[y][x]) y += 1;
      const length = y - start;
      for (let yy = start; yy < y; yy += 1) verticalRuns[yy][x] = length;
    }
  }

  const gridSuppressed = seed.map((row, y) =>
    row.map((active, x) => {
      if (!active) return false;
      const sample = samples[y][x];
      const longHorizontal = horizontalRuns[y][x] > Math.max(20, columns * 0.16);
      const longVertical = verticalRuns[y][x] > Math.max(18, rows * 0.16);
      const weakStraightLine = (longHorizontal || longVertical) && sample.darkness < 0.78;
      return !weakStraightLine;
    }),
  );
  const visited = Array.from({ length: rows }, () => Array.from({ length: columns }, () => false));
  const kept = Array.from({ length: rows }, () => Array.from({ length: columns }, () => false));
  const minComponentArea = Math.max(10, Math.round(rows * columns * 0.00035));

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      if (!gridSuppressed[y][x] || visited[y][x]) continue;
      const stack: Array<[number, number]> = [[x, y]];
      const component: Array<[number, number]> = [];
      visited[y][x] = true;

      while (stack.length) {
        const [cx, cy] = stack.pop()!;
        component.push([cx, cy]);
        for (let yy = Math.max(0, cy - 1); yy <= Math.min(rows - 1, cy + 1); yy += 1) {
          for (let xx = Math.max(0, cx - 1); xx <= Math.min(columns - 1, cx + 1); xx += 1) {
            if (!gridSuppressed[yy][xx] || visited[yy][xx]) continue;
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

function smoothSketchMask(mask: boolean[][]) {
  const rows = mask.length;
  const columns = mask[0]?.length ?? 0;
  const dilated = mask.map((row, y) =>
    row.map((active, x) => {
      if (active) return true;
      let neighbors = 0;
      for (let yy = Math.max(0, y - 1); yy <= Math.min(rows - 1, y + 1); yy += 1) {
        for (let xx = Math.max(0, x - 1); xx <= Math.min(columns - 1, x + 1); xx += 1) {
          if (mask[yy][xx]) neighbors += 1;
        }
      }
      return neighbors >= 2;
    }),
  );

  return dilated.map((row, y) =>
    row.map((active, x) => {
      if (!active) return false;
      let neighbors = 0;
      for (let yy = Math.max(0, y - 1); yy <= Math.min(rows - 1, y + 1); yy += 1) {
        for (let xx = Math.max(0, x - 1); xx <= Math.min(columns - 1, x + 1); xx += 1) {
          if (dilated[yy][xx]) neighbors += 1;
        }
      }
      return neighbors >= 2;
    }),
  );
}

function applySketchContentMask(samples: ImageSample[][], contentMask: boolean[][] | undefined, options: ConvertOptions) {
  if (options.mode !== "sketch" || !contentMask) return samples;
  const minProtectedStroke = Math.min(0.9, Math.max(options.threshold + 0.04, 0.58));
  return samples.map((row, y) =>
    row.map((sample, x) => {
      if (!contentMask[y]?.[x]) return { ...sample, luma: 1, darkness: 0 };
      const isOriginalStroke = sample.darkness >= options.threshold;
      const darkness = isOriginalStroke ? Math.max(sample.darkness, minProtectedStroke) : Math.max(sample.darkness, 0.42);
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
      const sx = Math.min(sourceWidth - 1, (x / Math.max(1, columns - 1)) * (sourceWidth - 1));
      const sy = Math.min(sourceHeight - 1, (y / Math.max(1, rows - 1)) * (sourceHeight - 1));
      row.push(samplePixelBilinear(decoded.data, sourceWidth, sourceHeight, channels, sx, sy));
    }
    samples.push(row);
  }

  return { sourceWidth, sourceHeight, columns, rows, samples };
}

export async function cleanSketchPreviewPng(file: File, options: ConvertOptions) {
  const grid = await sampleImageGrid(file, { ...options, mode: "sketch" });
  const lineArtSamples = preprocessLineArtSamples(grid.samples, { ...options, mode: "sketch" });
  const rawSketchContentMask = buildSketchContentMask(lineArtSamples, { ...options, mode: "sketch" });
  const sketchContentMask = rawSketchContentMask ? smoothSketchMask(rawSketchContentMask) : undefined;
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
      const sx = Math.min(sourceWidth - 1, (x / Math.max(1, columns - 1)) * (sourceWidth - 1));
      const sy = Math.min(sourceHeight - 1, (y / Math.max(1, rows - 1)) * (sourceHeight - 1));
      row.push(samplePixelBilinear(decoded.data, sourceWidth, sourceHeight, channels, sx, sy));
    }
    samples.push(row);
  }

  const lineArtSamples = preprocessLineArtSamples(samples, options);
  const rawSketchContentMask = buildSketchContentMask(lineArtSamples, options);
  const sketchContentMask = rawSketchContentMask ? smoothSketchMask(rawSketchContentMask) : undefined;
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
