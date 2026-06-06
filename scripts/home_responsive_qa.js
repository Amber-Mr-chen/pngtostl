const { spawn } = require('child_process');

const BASE = process.env.QA_BASE || 'http://100.78.151.18:3030';
const PORT = Number(process.env.CDP_PORT || 9225);
const viewports = [
  { name: 'desktop', width: 1366, height: 900 },
  { name: 'tablet', width: 820, height: 1000 },
  { name: 'mobile', width: 390, height: 900 },
];

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
    '--headless=new', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${PORT}`,
    '--window-size=1366,900', `${BASE}/?responsive-qa=1`,
  ], { stdio: ['ignore', 'ignore', 'ignore'] });
  let ws;
  const issues = [];
  const results = [];
  try {
    const tabs = await fetchJson(`http://127.0.0.1:${PORT}/json`);
    const target = tabs.find((tab) => tab.type === 'page');
    ws = new WebSocket(target.webSocketDebuggerUrl);
    let id = 0;
    const pending = new Map();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      }
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
    await send('Runtime.enable');
    await send('Page.enable');
    for (const viewport of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.width < 700,
      });
      await send('Page.navigate', { url: `${BASE}/?responsive-qa=${viewport.name}` });
      await wait(1200);
      await evalExpr(`(async () => {
        const cards = Array.from(document.querySelectorAll('.naturalWorkflowCard'));
        for (const card of cards) {
          card.scrollIntoView({ block: 'center' });
          await new Promise((resolve) => setTimeout(resolve, 350));
          await Promise.all(Array.from(card.querySelectorAll('img')).map((img) => {
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();
            return new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
              setTimeout(resolve, 1200);
            });
          }));
        }
        window.scrollTo(0, 0);
        await new Promise((resolve) => setTimeout(resolve, 150));
      })()`);
      const state = await evalExpr(`(() => {
        const h1 = document.querySelector('h1')?.getBoundingClientRect();
        const hero = document.querySelector('.homeHero')?.getBoundingClientRect();
        const panel = document.querySelector('.heroToolPanel')?.getBoundingClientRect();
        const toolLinks = document.querySelectorAll('.heroToolLink').length;
        const showcase = document.querySelector('.showcaseBlock')?.getBoundingClientRect();
        const workflowCards = Array.from(document.querySelectorAll('.naturalWorkflowCard')).map((card) => {
          const rect = card.getBoundingClientRect();
          const images = Array.from(card.querySelectorAll('img')).map((img) => {
            const r = img.getBoundingClientRect();
            return { w: Math.round(r.width), h: Math.round(r.height), src: img.getAttribute('src') || '' };
          });
          const cta = card.querySelector('a[href]')?.getAttribute('href') || '';
          return { w: Math.round(rect.width), h: Math.round(rect.height), images, cta };
        });
        return {
          name: ${JSON.stringify(viewport.name)},
          width: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          h1Height: Math.round(h1?.height || 0),
          heroHeight: Math.round(hero?.height || 0),
          panelTop: Math.round(panel?.top || 0),
          toolLinks,
          showcaseTop: Math.round(showcase?.top || 0),
          workflowCardCount: workflowCards.length,
          workflowCards,
          text: document.body.innerText.slice(0, 300),
        };
      })()`);
      results.push(state);
      if (state.overflow) issues.push({ viewport: viewport.name, type: 'overflow' });
      if (state.toolLinks < 4) issues.push({ viewport: viewport.name, type: 'hero-tools-missing', toolLinks: state.toolLinks });
      if (state.workflowCardCount !== 3) issues.push({ viewport: viewport.name, type: 'showcase-workflow-count', workflowCardCount: state.workflowCardCount });
      state.workflowCards.forEach((card, index) => {
        if (card.images.length < 2) issues.push({ viewport: viewport.name, type: 'workflow-images-missing', index, images: card.images.length });
        if (!card.cta) issues.push({ viewport: viewport.name, type: 'workflow-cta-missing', index });
        card.images.forEach((image, imageIndex) => {
          if (image.w < 40 || image.h < 40) issues.push({ viewport: viewport.name, type: 'workflow-image-too-small', index, imageIndex, image });
        });
      });
      if (viewport.name === 'mobile' && state.h1Height > 260) issues.push({ viewport: viewport.name, type: 'h1-too-tall', h1Height: state.h1Height });
    }
  } finally {
    if (ws) ws.close();
    chrome.kill('SIGTERM');
  }
  console.log(JSON.stringify({ issueCount: issues.length, issues, results }, null, 2));
  if (issues.length) process.exit(1);
}

main().catch((error) => { console.error(error); process.exit(1); });
