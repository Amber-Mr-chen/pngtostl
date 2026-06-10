import { expect, test } from '@playwright/test';
import { encode } from 'fast-png';

const BASE_URL = process.env.PNGTOSTL_BASE_URL || 'https://pngtostl.net';
const TARGET_URL = process.env.PNGTOSTL_URL || `${BASE_URL}/?regression=converter-flow`;

// 64x64 high-contrast PNG generated once for stable upload/conversion tests.
const TEST_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAgklEQVR4nO3XMQqAMAwFQfP+V7dOBQcXpUCCoVkwZrGvoXgvECPvnDP+7wvgVAAFAEABAFD0whJjfLcPMzo1K7Ta/Gx0y8Itwc2aF7RbVcwggLyaMABQAAAUAAAF2DZhAKAAACh6im0ad9XFbd934AGAAAChAAAooOgjxgAAoAABKBr94AEYAACAAgCgR80MByE/Q+K4lwAAAABJRU5ErkJggg==';

function transparentRingLogoPng() {
  const width = 96;
  const height = 96;
  const data = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const outer = x >= 18 && x <= 78 && y >= 18 && y <= 78;
      const inner = x >= 38 && x <= 58 && y >= 38 && y <= 58;
      const active = outer && !inner;
      data[offset] = 0;
      data[offset + 1] = 0;
      data[offset + 2] = 0;
      data[offset + 3] = active ? 255 : 0;
    }
  }

  return Buffer.from(encode({ width, height, data, channels: 4 }));
}

function texturedPortraitPng() {
  const width = 128;
  const height = 96;
  const data = new Uint8Array(width * height * 4);
  const centerX = width / 2;
  const centerY = height / 2;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const normalizedX = (x - centerX) / 30;
      const normalizedY = (y - centerY) / 24;
      const inSubject = normalizedX * normalizedX + normalizedY * normalizedY < 1;
      const texture = ((x * 7 + y * 5) % 31) / 31;
      const backgroundLuma = 0.54 + texture * 0.24;
      const subjectLuma = 0.44 + texture * 0.04;
      const luma = inSubject ? subjectLuma : backgroundLuma;
      const value = Math.round(luma * 255);
      data[offset] = value;
      data[offset + 1] = value;
      data[offset + 2] = value;
      data[offset + 3] = 255;
    }
  }

  return Buffer.from(encode({ width, height, data, channels: 4 }));
}

function wideSparsePortraitPng() {
  const width = 220;
  const height = 110;
  const data = new Uint8Array(width * height * 4);
  const centerX = width / 2;
  const centerY = height / 2;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const normalizedX = (x - centerX) / 22;
      const normalizedY = (y - centerY) / 28;
      const inSubject = normalizedX * normalizedX + normalizedY * normalizedY < 1;
      const value = Math.round((inSubject ? 0.35 : 0.82) * 255);
      data[offset] = value;
      data[offset + 1] = value;
      data[offset + 2] = value;
      data[offset + 3] = 255;
    }
  }

  return Buffer.from(encode({ width, height, data, channels: 4 }));
}

function busyScenePhotoPng() {
  const width = 128;
  const height = 96;
  const data = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const stripe = ((x * 17 + y * 19) % 53) / 53;
      const checker = ((Math.floor(x / 4) + Math.floor(y / 5)) % 2) * 0.18;
      const portrait = ((x - 64) / 28) ** 2 + ((y - 50) / 32) ** 2 < 1;
      const luma = portrait ? 0.38 + stripe * 0.12 : 0.42 + stripe * 0.38 + checker;
      const value = Math.round(Math.max(0, Math.min(1, luma)) * 255);
      data[offset] = value;
      data[offset + 1] = value;
      data[offset + 2] = value;
      data[offset + 3] = 255;
    }
  }

  return Buffer.from(encode({ width, height, data, channels: 4 }));
}

function uniqueStlYLevels(stl: Buffer) {
  const view = new DataView(stl.buffer, stl.byteOffset, stl.byteLength);
  const triangles = view.getUint32(80, true);
  const levels = new Set<number>();

  for (let triangle = 0; triangle < triangles; triangle += 1) {
    const triangleOffset = 84 + triangle * 50;
    for (let vertex = 0; vertex < 3; vertex += 1) {
      const yOffset = triangleOffset + 12 + vertex * 12 + 4;
      levels.add(Number(view.getFloat32(yOffset, true).toFixed(3)));
    }
  }

  return [...levels].sort((a, b) => a - b);
}

function stlHasFaceConnectingYLevels(stl: Buffer, lowerLevel: number, upperLevel: number) {
  const view = new DataView(stl.buffer, stl.byteOffset, stl.byteLength);
  const triangles = view.getUint32(80, true);

  for (let triangle = 0; triangle < triangles; triangle += 1) {
    const triangleOffset = 84 + triangle * 50;
    const levels = new Set<number>();
    for (let vertex = 0; vertex < 3; vertex += 1) {
      const yOffset = triangleOffset + 12 + vertex * 12 + 4;
      levels.add(Number(view.getFloat32(yOffset, true).toFixed(3)));
    }
    if (levels.has(lowerLevel) && levels.has(upperLevel)) return true;
  }

  return false;
}

function averageStlTopHeightInRegion(stl: Buffer, region: { minX: number; maxX: number; minZ: number; maxZ: number }) {
  const view = new DataView(stl.buffer, stl.byteOffset, stl.byteLength);
  const triangles = view.getUint32(80, true);
  let sum = 0;
  let count = 0;

  for (let triangle = 0; triangle < triangles; triangle += 1) {
    const triangleOffset = 84 + triangle * 50;
    for (let vertex = 0; vertex < 3; vertex += 1) {
      const vertexOffset = triangleOffset + 12 + vertex * 12;
      const x = view.getFloat32(vertexOffset, true);
      const y = view.getFloat32(vertexOffset + 4, true);
      const z = view.getFloat32(vertexOffset + 8, true);
      if (y <= 0.01) continue;
      if (x >= region.minX && x <= region.maxX && z >= region.minZ && z <= region.maxZ) {
        sum += y;
        count += 1;
      }
    }
  }

  return count ? sum / count : 0;
}

function highReliefWidthRatio(stl: Buffer, thresholdY: number) {
  const view = new DataView(stl.buffer, stl.byteOffset, stl.byteLength);
  const triangles = view.getUint32(80, true);
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let highMinX = Number.POSITIVE_INFINITY;
  let highMaxX = Number.NEGATIVE_INFINITY;

  for (let triangle = 0; triangle < triangles; triangle += 1) {
    const triangleOffset = 84 + triangle * 50;
    for (let vertex = 0; vertex < 3; vertex += 1) {
      const vertexOffset = triangleOffset + 12 + vertex * 12;
      const x = view.getFloat32(vertexOffset, true);
      const y = view.getFloat32(vertexOffset + 4, true);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      if (y >= thresholdY) {
        highMinX = Math.min(highMinX, x);
        highMaxX = Math.max(highMaxX, x);
      }
    }
  }

  if (!Number.isFinite(highMinX)) return 0;
  return (highMaxX - highMinX) / Math.max(maxX - minX, 0.001);
}

test('homepage upload generates visible STL result', async ({ page }) => {
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

  await expect(page.locator('.uploadDropzone')).not.toContainText(/[\u4e00-\u9fff]/);

  await page.setInputFiles('input[name="file"]', {
    name: 'regression-logo.png',
    mimeType: 'image/png',
    buffer: Buffer.from(TEST_PNG_BASE64, 'base64'),
  });

  await expect(page.locator('[data-file-name="true"]')).toHaveText('regression-logo.png');
  const generate = page.locator('[data-generate-stl="true"]');
  await expect(generate).toBeEnabled();

  await generate.click();

  await expect(page.locator('[data-converter-status]')).toHaveText('STL ready', { timeout: 30_000 });
  await expect(page.locator('[data-download-stl="true"]')).toBeVisible();
  await expect(page.locator('[data-result-metrics="true"]')).toBeVisible();
  await expect(page.locator('[data-stl-preview]')).toHaveAttribute('data-preview-ready', '1', { timeout: 30_000 });
});

test('P1 expansion pages are real differentiated tools, not empty SEO shells', async ({ page }) => {
  const pages = [
    { path: '/photo-relief-generator', h1: /Photo Relief Generator/i, text: /photo relief|portrait|background/i },
    { path: '/stl-relief-generator', h1: /STL Relief Generator/i, text: /relief STL|raised surface|printable/i },
    { path: '/svg-to-stl', h1: /SVG to STL/i, text: /vector|SVG|logo/i },
    { path: '/icon-to-stl', h1: /Icon to STL/i, text: /icon|transparent|badge/i },
    { path: '/silhouette-to-stl', h1: /Silhouette to STL/i, text: /silhouette|single-height|outline/i },
    { path: '/black-and-white-image-to-stl', h1: /Black and White Image to STL/i, text: /black and white|threshold|monochrome/i },
    { path: '/text-to-3d', h1: /Text to 3D/i, text: /text|planned|relief/i },
  ];

  for (const item of pages) {
    await page.goto(`${BASE_URL}${item.path}?regression=p1-matrix`, { waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toContainText(item.h1);
    await expect(page.locator('main')).toContainText(item.text);
    await expect(page.locator('form[data-converter-form="true"], [data-utility-advisor="true"]')).toHaveCount(1);
  }
});

test('photo page uses a dedicated relief preset while image page stays general-purpose', async ({ page }) => {
  await page.goto(`${BASE_URL}/photo-to-stl?regression=photo-preset`, { waitUntil: 'networkidle' });
  await expect(page.locator('form[data-converter-form="true"]')).toHaveAttribute('data-mode', 'relief');
  await expect(page.locator('input[name="widthMm"]')).toHaveValue('120');
  await expect(page.locator('input[name="depth"]')).toHaveValue('2.8');
  await expect(page.locator('input[name="smoothing"]')).toHaveValue('65');
  await expect(page.locator('input[name="detail"]')).toHaveValue('192');
  await expect(page.locator('.uploadDropzone small')).toContainText('Subject-focused photo relief');

  await page.goto(`${BASE_URL}/image-to-stl?regression=image-preset`, { waitUntil: 'networkidle' });
  await expect(page.locator('form[data-converter-form="true"]')).toHaveAttribute('data-mode', 'extrude');
  await expect(page.locator('input[name="smoothing"]')).toHaveValue('0');
  await expect(page.locator('input[name="detail"]')).toHaveValue('256');
});

test('photo page shows a compact image check without blocking generation', async ({ page }) => {
  await page.goto(`${BASE_URL}/photo-to-stl?regression=photo-diagnosis`, { waitUntil: 'networkidle' });

  await page.setInputFiles('input[name="file"]', {
    name: 'busy-scene.png',
    mimeType: 'image/png',
    buffer: busyScenePhotoPng(),
  });

  const diagnosis = page.locator('[data-image-diagnosis="true"]');
  await expect(diagnosis).toBeVisible();
  await expect(diagnosis).toContainText(/Image check: (Photo relief|Try smoother relief|Try lithophane)/, { timeout: 10_000 });
  await expect(diagnosis).toContainText(/Subject|Background|Lithophane/);
  await expect(diagnosis.locator('p')).toBeHidden();
  await expect(page.locator('[data-lithophane-suggestion="true"]')).toHaveAttribute('href', '/lithophane-generator');
  await expect(page.locator('[data-lithophane-suggestion="true"]')).toContainText('Try lithophane');
  await expect(page.locator('[data-smoother-suggestion="true"]')).toContainText('Apply smoother');
  await expect(page.locator('input[name="smoothing"]')).toHaveValue('65');
  await page.locator('[data-smoother-suggestion="true"]').click();
  await expect(page.locator('input[name="smoothing"]')).toHaveValue('80');
  await expect(page.locator('[data-generate-stl="true"]')).toBeEnabled();
});

test('logo page generates a clean STL result for PNG input', async ({ page }) => {
  await page.goto(`${BASE_URL}/logo-to-stl?regression=logo-flow`, { waitUntil: 'networkidle' });

  await expect(page.locator('h1')).toContainText('Logo to STL');
  await page.setInputFiles('input[name="file"]', {
    name: 'transparent-logo.png',
    mimeType: 'image/png',
    buffer: Buffer.from(TEST_PNG_BASE64, 'base64'),
  });

  const generate = page.locator('[data-generate-stl="true"]');
  await expect(generate).toBeEnabled();
  await generate.click();

  await expect(page.locator('[data-converter-status]')).toHaveText('STL ready', { timeout: 30_000 });
  await expect(page.locator('[data-download-stl="true"]')).toBeVisible();
  await expect(page.locator('[data-result-metrics="true"]')).toBeVisible();
  await expect(page.locator('[data-stl-preview]')).toHaveAttribute('data-preview-ready', '1', { timeout: 30_000 });
});

test('logo conversion uses compact contour-style geometry for transparent PNG masks', async ({ page }) => {
  const convertResponses: Record<string, string>[] = [];
  page.on('response', (response) => {
    if (response.url().includes('/api/stl/convert')) convertResponses.push(response.headers());
  });

  await page.goto(`${BASE_URL}/logo-to-stl?regression=logo-contour-geometry`, { waitUntil: 'networkidle' });
  await page.setInputFiles('input[name="file"]', {
    name: 'ring-logo.png',
    mimeType: 'image/png',
    buffer: transparentRingLogoPng(),
  });

  await page.locator('[data-generate-stl="true"]').click();

  await expect(page.locator('[data-converter-status]')).toHaveText('STL ready', { timeout: 30_000 });
  const triangleCount = Number(convertResponses.at(-1)?.['x-tool-triangle-count']);
  expect(triangleCount).toBeGreaterThan(0);
  expect(triangleCount).toBeLessThan(4000);
});

test('logo STL includes an intermediate bevel height layer', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/api/stl/convert`, {
    multipart: {
      file: {
        name: 'ring-logo.png',
        mimeType: 'image/png',
        buffer: transparentRingLogoPng(),
      },
      mode: 'logo',
      widthMm: '95',
      depth: '2.4',
      baseMm: '1.2',
      threshold: '0.66',
      smoothing: '0',
      detail: '320',
    },
  });

  expect(response.ok()).toBeTruthy();
  const body = Buffer.from(await response.body());
  const levels = uniqueStlYLevels(body);
  expect(levels.length).toBeGreaterThanOrEqual(3);
  const bevelLevel = levels.find((level) => level > levels[0] && level < levels.at(-1)!);
  expect(bevelLevel).toBeDefined();
  expect(stlHasFaceConnectingYLevels(body, bevelLevel!, levels.at(-1)!)).toBeTruthy();
});

test('photo relief suppresses textured background behind a centered subject', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/api/stl/convert`, {
    multipart: {
      file: {
        name: 'textured-portrait.png',
        mimeType: 'image/png',
        buffer: texturedPortraitPng(),
      },
      mode: 'relief',
      widthMm: '120',
      depth: '2.4',
      baseMm: '1.2',
      threshold: '0.38',
      smoothing: '0.46',
      detail: '192',
    },
  });

  expect(response.ok()).toBeTruthy();
  const body = Buffer.from(await response.body());
  const centerHeight = averageStlTopHeightInRegion(body, { minX: 48, maxX: 72, minZ: 35, maxZ: 55 });
  const backgroundHeight = averageStlTopHeightInRegion(body, { minX: 4, maxX: 28, minZ: 4, maxZ: 24 });
  expect(centerHeight).toBeGreaterThan(backgroundHeight + 0.7);
});

test('photo relief auto-crops sparse side margins around the main subject', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/api/stl/convert`, {
    multipart: {
      file: {
        name: 'wide-sparse-portrait.png',
        mimeType: 'image/png',
        buffer: wideSparsePortraitPng(),
      },
      mode: 'relief',
      widthMm: '120',
      depth: '2.4',
      baseMm: '1.2',
      threshold: '0.38',
      smoothing: '0.46',
      detail: '192',
    },
  });

  expect(response.ok()).toBeTruthy();
  const body = Buffer.from(await response.body());
  expect(highReliefWidthRatio(body, 2.45)).toBeGreaterThan(0.4);
});
