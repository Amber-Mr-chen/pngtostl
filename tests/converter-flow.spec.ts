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
