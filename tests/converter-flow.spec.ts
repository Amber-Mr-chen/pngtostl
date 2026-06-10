import { expect, test } from '@playwright/test';

const TARGET_URL = process.env.PNGTOSTL_URL || 'https://pngtostl.net/?regression=converter-flow';

// 64x64 high-contrast PNG generated once for stable upload/conversion tests.
const TEST_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAgklEQVR4nO3XMQqAMAwFQfP+V7dOBQcXpUCCoVkwZrGvoXgvECPvnDP+7wvgVAAFAEABAFD0whJjfLcPMzo1K7Ta/Gx0y8Itwc2aF7RbVcwggLyaMABQAAAUAAAF2DZhAKAAACh6im0ad9XFbd934AGAAAChAAAooOgjxgAAoAABKBr94AEYAACAAgCgR80MByE/Q+K4lwAAAABJRU5ErkJggg==';

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
  await page.goto('https://pngtostl.net/logo-to-stl?regression=logo-flow', { waitUntil: 'networkidle' });

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
