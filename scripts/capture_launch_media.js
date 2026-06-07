const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve('/root/projects/pngtostl/ops/launch-media');
fs.mkdirSync(OUT_DIR, { recursive: true });

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectToChrome(port) {
  const started = Date.now();
  while (Date.now() - started < 10000) {
    try {
      const tabs = await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json());
      const page = tabs.find((t) => t.type === 'page');
      if (page) {
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((resolve, reject) => {
          ws.onopen = resolve;
          ws.onerror = reject;
        });
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
        const send = (method, params = {}) => {
          const msgId = ++id;
          ws.send(JSON.stringify({ id: msgId, method, params }));
          return new Promise((resolve, reject) => pending.set(msgId, { resolve, reject }));
        };
        await send('Page.enable');
        await send('Runtime.enable');
        return { ws, send };
      }
    } catch (_) {}
    await wait(250);
  }
  throw new Error('Could not connect to Chrome');
}

async function capture({ name, url, fullPage = false, scrollSelector = null, viewport = { width: 1366, height: 900 } }) {
  const port = 9322 + Math.floor(Math.random() * 300);
  const chrome = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    `--window-size=${viewport.width},${viewport.height}`,
    url,
  ], { stdio: ['ignore', 'ignore', 'ignore'] });

  try {
    const { ws, send } = await connectToChrome(port);
    await send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await wait(2200);
    if (scrollSelector) {
      await send('Runtime.evaluate', {
        expression: `document.querySelector(${JSON.stringify(scrollSelector)})?.scrollIntoView({block:'center'});`,
        awaitPromise: false,
      });
      await wait(900);
    }
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: fullPage,
      fromSurface: true,
    });
    const out = path.join(OUT_DIR, name);
    fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
    ws.close();
    console.log(out);
  } finally {
    chrome.kill('SIGTERM');
  }
}

async function main() {
  const base = 'https://pngtostl.net';
  await capture({ name: 'homepage-hero-1366x900.png', url: `${base}/?launch-media=home` });
  await capture({ name: 'image-to-stl-workspace-1366x900.png', url: `${base}/image-to-stl?launch-media=tool` });
  await capture({ name: 'samples-gallery-1366x900.png', url: `${base}/samples?launch-media=samples` });
  await capture({ name: 'tool-proof-section-1366x900.png', url: `${base}/png-to-stl?launch-media=proof`, scrollSelector: '.toolProofBlock' });
  await capture({ name: 'samples-gallery-fullpage.png', url: `${base}/samples?launch-media=samples-full`, fullPage: true, viewport: { width: 1366, height: 1100 } });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
