import { decode } from "fast-png";

export type PngToStlOptions = {
  maxDimension?: number;
  baseThickness?: number;
  reliefHeight?: number;
  widthMm?: number;
};

export type PngToStlResult = {
  stl: string;
  sourceWidth: number;
  sourceHeight: number;
  meshWidth: number;
  meshHeight: number;
  triangleCount: number;
};

type Vec3 = [number, number, number];
type DecodedPng = {
  width: number;
  height: number;
  data: Uint8Array | Uint8ClampedArray | number[];
  channels?: number;
};

const DEFAULT_OPTIONS: Required<PngToStlOptions> = {
  maxDimension: 96,
  baseThickness: 0.6,
  reliefHeight: 2.4,
  widthMm: 60,
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function subtract(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normal(a: Vec3, b: Vec3, c: Vec3): Vec3 {
  const n = cross(subtract(b, a), subtract(c, a));
  const length = Math.hypot(n[0], n[1], n[2]);
  if (!length) return [0, 0, 1];
  return [n[0] / length, n[1] / length, n[2] / length];
}

function facet(a: Vec3, b: Vec3, c: Vec3) {
  const n = normal(a, b, c);
  return [
    `  facet normal ${n[0].toFixed(6)} ${n[1].toFixed(6)} ${n[2].toFixed(6)}`,
    "    outer loop",
    `      vertex ${a[0].toFixed(6)} ${a[1].toFixed(6)} ${a[2].toFixed(6)}`,
    `      vertex ${b[0].toFixed(6)} ${b[1].toFixed(6)} ${b[2].toFixed(6)}`,
    `      vertex ${c[0].toFixed(6)} ${c[1].toFixed(6)} ${c[2].toFixed(6)}`,
    "    endloop",
    "  endfacet",
  ].join("\n");
}

function sampleHeight(png: DecodedPng, x: number, y: number) {
  const sampleX = clamp(Math.round(x), 0, png.width - 1);
  const sampleY = clamp(Math.round(y), 0, png.height - 1);
  const channels = png.channels ?? Math.max(1, png.data.length / (png.width * png.height));
  const index = (sampleY * png.width + sampleX) * channels;
  const red = png.data[index] ?? 0;
  const green = channels > 1 ? png.data[index + 1] : red;
  const blue = channels > 2 ? png.data[index + 2] : red;
  const alpha = channels > 3 ? (png.data[index + 3] ?? 255) / 255 : 1;
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  return luminance * alpha;
}

export function convertPngBufferToStl(input: Uint8Array | ArrayBuffer, options: PngToStlOptions = {}): PngToStlResult {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  const png = decode(bytes) as DecodedPng;
  const settings = { ...DEFAULT_OPTIONS, ...options };
  const scale = Math.min(1, settings.maxDimension / Math.max(png.width, png.height));
  const meshWidth = Math.max(2, Math.round(png.width * scale));
  const meshHeight = Math.max(2, Math.round(png.height * scale));
  const modelWidth = settings.widthMm;
  const modelHeight = modelWidth * (meshHeight / meshWidth);
  const stepX = modelWidth / meshWidth;
  const stepY = modelHeight / meshHeight;

  const top = Array.from({ length: meshHeight + 1 }, (_, y) =>
    Array.from({ length: meshWidth + 1 }, (_, x): Vec3 => {
      const sourceX = (x / meshWidth) * (png.width - 1);
      const sourceY = (y / meshHeight) * (png.height - 1);
      const height = settings.baseThickness + sampleHeight(png, sourceX, sourceY) * settings.reliefHeight;
      return [x * stepX, (meshHeight - y) * stepY, height];
    }),
  );

  const bottom = (x: number, y: number): Vec3 => [x * stepX, (meshHeight - y) * stepY, 0];
  const facets: string[] = [];

  for (let y = 0; y < meshHeight; y += 1) {
    for (let x = 0; x < meshWidth; x += 1) {
      const a = top[y][x];
      const b = top[y][x + 1];
      const c = top[y + 1][x + 1];
      const d = top[y + 1][x];
      facets.push(facet(a, d, b));
      facets.push(facet(b, d, c));

      const ba = bottom(x, y);
      const bb = bottom(x + 1, y);
      const bc = bottom(x + 1, y + 1);
      const bd = bottom(x, y + 1);
      facets.push(facet(ba, bb, bd));
      facets.push(facet(bb, bc, bd));
    }
  }

  for (let x = 0; x < meshWidth; x += 1) {
    facets.push(facet(bottom(x, 0), top[0][x], bottom(x + 1, 0)));
    facets.push(facet(bottom(x + 1, 0), top[0][x], top[0][x + 1]));
    facets.push(facet(bottom(x, meshHeight), bottom(x + 1, meshHeight), top[meshHeight][x]));
    facets.push(facet(bottom(x + 1, meshHeight), top[meshHeight][x + 1], top[meshHeight][x]));
  }

  for (let y = 0; y < meshHeight; y += 1) {
    facets.push(facet(bottom(0, y), bottom(0, y + 1), top[y][0]));
    facets.push(facet(bottom(0, y + 1), top[y + 1][0], top[y][0]));
    facets.push(facet(bottom(meshWidth, y), top[y][meshWidth], bottom(meshWidth, y + 1)));
    facets.push(facet(bottom(meshWidth, y + 1), top[y][meshWidth], top[y + 1][meshWidth]));
  }

  const stl = ["solid pngtostl_relief", ...facets, "endsolid pngtostl_relief", ""].join("\n");

  return {
    stl,
    sourceWidth: png.width,
    sourceHeight: png.height,
    meshWidth,
    meshHeight,
    triangleCount: facets.length,
  };
}
