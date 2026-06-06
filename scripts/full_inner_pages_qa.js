const BASE = process.env.QA_BASE || 'http://100.78.151.18:3030';

const pages = [
  '/',
  '/png-to-stl',
  '/image-to-stl',
  '/convert-image-to-stl',
  '/jpg-to-stl',
  '/logo-to-stl',
  '/heightmap-to-stl',
  '/lithophane-generator',
  '/photo-to-lithophane',
  '/2d-image-to-3d-model',
  '/3d-print-photo',
  '/image-contrast-guide',
  '/print-settings-checker',
  '/faq',
  '/sitemap.xml',
  '/robots.txt',
];

const converters = [
  '/png-to-stl',
  '/image-to-stl',
  '/convert-image-to-stl',
  '/jpg-to-stl',
  '/logo-to-stl',
  '/heightmap-to-stl',
  '/lithophane-generator',
  '/photo-to-lithophane',
  '/2d-image-to-3d-model',
];

const helperPages = ['/3d-print-photo', '/image-contrast-guide'];

function fixtureFor(path) {
  if (path === '/logo-to-stl') {
    return {
      name: 'qa-logo.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="white"/><circle cx="32" cy="32" r="22" fill="black"/><circle cx="32" cy="32" r="8" fill="white"/></svg>'),
    };
  }
  return {
    name: 'qa-image.png',
    mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAApElEQVR4nO3QMQrAMAwEwX7/R9clk1KpE4IrnAaytJmHB9bWnXiJyvf7c5hdkGmYHHhYPxzAH0YAAgwABBgACDAAEGAAIMAAQIOAAiM92C+9J/aXztZ9RnUTiRggAAgwABBgACDAAECA8ZgAuvhX9ykAwABAgAGAAAOMAQQYAHC7fFk4O3e7eq8NY14GEGAAAIAAAwABBgACDAAEGAAIMAAQYOAWBcAJZGnpqvoAAAAASUVORK5CYII=', 'base64'),
  };
}

async function bodyText(page) {
  return page.evaluate(() => document.body?.innerText || document.documentElement?.innerText || '');
}

async function run() {
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const results = [];
  const issues = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') issues.push({ type: 'console', url: page.url(), message: msg.text() });
  });
  page.on('pageerror', (err) => issues.push({ type: 'pageerror', url: page.url(), message: err.message }));

  for (const path of pages) {
    const response = await page.goto(`${BASE}${path}${path.includes('?') ? '&' : '?'}fullqa=1`, { waitUntil: 'networkidle', timeout: 30000 });
    const status = response ? response.status() : 0;
    const text = await bodyText(page);
    const check = {
      path,
      status,
      title: await page.title(),
      overflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
      staleText: /pending implementation|Format gated|undefined|null selected/i.test(text),
      bodyLen: text.length,
    };
    results.push(check);
    if (status >= 400) issues.push({ type: 'http', url: path, message: `HTTP ${status}` });
    if (check.overflow) issues.push({ type: 'layout', url: path, message: 'Document has horizontal overflow' });
    if (check.staleText) issues.push({ type: 'content', url: path, message: 'Stale implementation text found' });
  }

  for (const path of converters) {
    await page.goto(`${BASE}${path}?fullqa=converter`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.locator('input[name="file"]').setInputFiles(fixtureFor(path));
    await page.locator('[data-generate-stl="true"]').click();
    await page.waitForFunction(() => document.querySelector('[data-converter-status]')?.textContent?.includes('STL ready'), null, { timeout: 30000 });
    const state = await page.evaluate(() => ({
      status: document.querySelector('[data-converter-status]')?.textContent || '',
      message: document.querySelector('[data-converter-message]')?.textContent || '',
      downloadDisplay: getComputedStyle(document.querySelector('[data-download-stl="true"]')).display,
      metricsDisplay: getComputedStyle(document.querySelector('[data-result-metrics="true"]')).display,
      previewTriangles: document.querySelector('[data-stl-preview="true"]')?.dataset.previewTriangles || '',
      href: document.querySelector('[data-download-stl="true"]')?.getAttribute('href') || '',
    }));
    results.push({ path, converter: true, ...state });
    if (state.downloadDisplay === 'none' || !state.href.startsWith('blob:')) issues.push({ type: 'functional', url: path, message: 'Download STL did not become visible with blob href' });
    if (state.metricsDisplay === 'none') issues.push({ type: 'functional', url: path, message: 'Metrics panel did not appear after generation' });
    if (!Number(state.previewTriangles)) issues.push({ type: 'functional', url: path, message: 'STL preview did not parse triangle count' });
  }

  for (const path of helperPages) {
    await page.goto(`${BASE}${path}?fullqa=helper`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.locator('input[type="file"]').first().setInputFiles(fixtureFor('/png-to-stl'));
    await page.waitForTimeout(1200);
    const text = await bodyText(page);
    const ok = /Analysis ready|Suitability score|Recommendation/i.test(text);
    results.push({ path, helper: true, analysisReady: ok });
    if (!ok) issues.push({ type: 'functional', url: path, message: 'Image analysis did not produce visible result' });
  }

  await page.goto(`${BASE}/print-settings-checker?fullqa=print`, { waitUntil: 'networkidle', timeout: 30000 });
  const printText = await bodyText(page);
  const printOk = /Strong fit|Try this next|Recommended/i.test(printText);
  results.push({ path: '/print-settings-checker', helper: true, hasRecommendation: printOk });
  if (!printOk) issues.push({ type: 'functional', url: '/print-settings-checker', message: 'Print settings checker lacks visible recommendation result' });

  await browser.close();
  const summary = { base: BASE, checkedPages: pages.length, checkedConverters: converters.length, issueCount: issues.length, issues, results };
  console.log(JSON.stringify(summary, null, 2));
  if (issues.length) process.exit(1);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
