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
