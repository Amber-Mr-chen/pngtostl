const { spawn } = require('child_process');

const BASE = process.env.QA_BASE || 'http://100.78.151.18:3030';
const PORT = Number(process.env.CDP_PORT || 9224);

const pages = ['/', '/png-to-stl', '/image-to-stl', '/convert-image-to-stl', '/jpg-to-stl', '/logo-to-stl', '/heightmap-to-stl', '/lithophane-generator', '/photo-to-lithophane', '/2d-image-to-3d-model', '/3d-print-photo', '/image-contrast-guide', '/print-settings-checker', '/faq', '/sitemap.xml', '/robots.txt'];
const converters = ['/png-to-stl', '/image-to-stl', '/convert-image-to-stl', '/jpg-to-stl', '/logo-to-stl', '/heightmap-to-stl', '/lithophane-generator', '/photo-to-lithophane', '/2d-image-to-3d-model'];
const helpers = ['/3d-print-photo', '/image-contrast-guide'];

function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
async function fetchJson(url, tries = 20) {
  let last;
  for (let i = 0; i < tries; i += 1) {
    try { return await fetch(url).then((r) => r.json()); } catch (error) { last = error; await wait(250); }
  }
  throw last;
}

async function main() {
  const chrome = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${PORT}`,
    '--window-size=1366,1000',
    `${BASE}/?cdp-fullqa=1`,
  ], { stdio: ['ignore', 'ignore', 'ignore'] });

  const issues = [];
  const results = [];
  let ws;
  try {
    const tabs = await fetchJson(`http://127.0.0.1:${PORT}/json`);
    const target = tabs.find((tab) => tab.type === 'page');
    if (!target) throw new Error('No page target');
    ws = new WebSocket(target.webSocketDebuggerUrl);
    let id = 0;
    const pending = new Map();
    const consoleErrors = [];
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      }
      if (msg.method === 'Runtime.exceptionThrown') consoleErrors.push(msg.params.exceptionDetails.text || 'exception');
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') consoleErrors.push(msg.params.args.map((arg) => arg.value || arg.description || '').join(' '));
    };
    await new Promise((resolve) => { ws.onopen = resolve; });
    function send(method, params = {}) {
      const msgId = ++id;
      ws.send(JSON.stringify({ id: msgId, method, params }));
      return new Promise((resolve, reject) => pending.set(msgId, { resolve, reject }));
    }
    async function evalExpr(expression) {
      const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Runtime exception');
      return result.result.value;
    }
    async function goto(path) {
      consoleErrors.length = 0;
      await send('Page.navigate', { url: `${BASE}${path}${path.includes('?') ? '&' : '?'}cdpqa=1` });
      await wait(1300);
    }

    await send('Runtime.enable');
    await send('Page.enable');

    for (const path of pages) {
      await goto(path);
      const check = await evalExpr(`(() => ({
        path: ${JSON.stringify(path)},
        title: document.title,
        textLen: (document.body?.innerText || document.documentElement?.innerText || '').length,
        stale: /pending implementation|Format gated|undefined|null selected/i.test(document.body?.innerText || document.documentElement?.innerText || ''),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        consoleErrors: ${JSON.stringify(consoleErrors)}
      }))()`);
      results.push(check);
      if (check.stale) issues.push({ path, type: 'content', message: 'stale implementation text found' });
      if (check.overflow) issues.push({ path, type: 'layout', message: 'document horizontal overflow' });
      if (check.consoleErrors.length) issues.push({ path, type: 'console', message: check.consoleErrors.join('; ') });
    }

    const converterExpr = (path) => `new Promise(async (resolve) => {
      function makeFile() {
        if (${JSON.stringify(path)} === '/logo-to-stl') {
          return new File(['<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="white"/><circle cx="32" cy="32" r="22" fill="black"/><circle cx="32" cy="32" r="8" fill="white"/></svg>'], 'qa-logo.svg', {type:'image/svg+xml'});
        }
        const c = document.createElement('canvas'); c.width = 64; c.height = 64;
        const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0,0,64,64); ctx.fillStyle = '#111'; ctx.fillRect(10,10,44,44); ctx.fillStyle = '#fff'; ctx.fillRect(24,24,16,16);
        return new Promise((r) => c.toBlob((blob) => r(new File([blob], 'qa-image.png', {type:'image/png'})), 'image/png'));
      }
      const file = await makeFile();
      const input = document.querySelector('input[name="file"]');
      const button = document.querySelector('[data-generate-stl="true"]');
      if (!input || !button) return resolve({ error: 'missing input/button' });
      const dt = new DataTransfer(); dt.items.add(file); input.files = dt.files; input.dispatchEvent(new Event('change', {bubbles:true}));
      button.click();
      const started = Date.now();
      const poll = () => {
        const status = document.querySelector('[data-converter-status]')?.textContent || '';
        if (status.includes('STL ready') || Date.now() - started > 30000) {
          const dl = document.querySelector('[data-download-stl="true"]');
          const metrics = document.querySelector('[data-result-metrics="true"]');
          const canvas = document.querySelector('[data-stl-preview="true"]');
          resolve({
            status,
            downloadDisplay: dl ? getComputedStyle(dl).display : 'missing',
            href: dl?.getAttribute('href') || '',
            metricsDisplay: metrics ? getComputedStyle(metrics).display : 'missing',
            previewTriangles: canvas?.dataset.previewTriangles || '',
            message: document.querySelector('[data-converter-message]')?.textContent || ''
          });
        } else setTimeout(poll, 500);
      };
      poll();
    })`;

    for (const path of converters) {
      await goto(path);
      const state = await evalExpr(converterExpr(path));
      results.push({ path, converter: true, ...state });
      if (state.error) issues.push({ path, type: 'functional', message: state.error });
      if (!String(state.status || '').includes('STL ready')) issues.push({ path, type: 'functional', message: 'not STL ready' });
      if (state.downloadDisplay === 'none' || !String(state.href || '').startsWith('blob:')) issues.push({ path, type: 'functional', message: 'download link missing after generation' });
      if (state.metricsDisplay === 'none') issues.push({ path, type: 'functional', message: 'metrics hidden after generation' });
      if (!Number(state.previewTriangles)) issues.push({ path, type: 'functional', message: 'preview triangle count missing' });
    }

    const helperExpr = `new Promise(async (resolve) => {
      const input = document.querySelector('input[type="file"]');
      if (!input) return resolve({ ok:false, error:'missing file input' });
      const c = document.createElement('canvas'); c.width = 64; c.height = 64;
      const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0,0,64,64); ctx.fillStyle = '#111'; ctx.fillRect(10,10,44,44);
      c.toBlob((blob) => {
        const file = new File([blob], 'qa-helper.png', {type:'image/png'});
        const dt = new DataTransfer(); dt.items.add(file); input.files = dt.files; input.dispatchEvent(new Event('change', {bubbles:true}));
        setTimeout(() => {
          const text = document.body.innerText || '';
          resolve({ ok: /Analysis ready|Suitability score|Recommendation/i.test(text), text: text.slice(0, 500) });
        }, 1200);
      }, 'image/png');
    })`;
    for (const path of helpers) {
      await goto(path);
      const state = await evalExpr(helperExpr);
      results.push({ path, helper: true, ...state });
      if (!state.ok) issues.push({ path, type: 'functional', message: state.error || 'analysis did not show result' });
    }

    await goto('/print-settings-checker');
    const printState = await evalExpr(`(() => ({ ok: /Strong fit|Try this next|Recommended/i.test(document.body.innerText || ''), text: (document.body.innerText || '').slice(0, 500) }))()`);
    results.push({ path: '/print-settings-checker', helper: true, ...printState });
    if (!printState.ok) issues.push({ path: '/print-settings-checker', type: 'functional', message: 'print checker recommendation missing' });
  } finally {
    if (ws) ws.close();
    chrome.kill('SIGTERM');
  }

  const summary = { base: BASE, checkedPages: pages.length, checkedConverters: converters.length, issueCount: issues.length, issues, results };
  console.log(JSON.stringify(summary, null, 2));
  if (issues.length) process.exit(1);
}

main().catch((error) => { console.error(error); process.exit(1); });
