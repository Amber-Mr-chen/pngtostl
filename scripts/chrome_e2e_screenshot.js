const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const out = '/root/projects/pngtostl/dogfood-output/screenshots/final-stl-ready.png';
fs.mkdirSync(path.dirname(out), { recursive: true });

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const chrome = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--remote-debugging-port=9223',
    '--window-size=1366,1200',
    'http://100.78.151.18:3030/?v=chrome-final-shot'
  ], { stdio: ['ignore', 'ignore', 'ignore'] });

  try {
    await wait(1800);
    const tabs = await fetch('http://127.0.0.1:9223/json').then(r => r.json());
    const page = tabs.find(t => t.type === 'page');
    if (!page) throw new Error('No Chrome page target');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 0;
    const pending = new Map();
    ws.onmessage = event => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      }
    };
    await new Promise(resolve => ws.onopen = resolve);
    function send(method, params = {}) {
      const msgId = ++id;
      ws.send(JSON.stringify({ id: msgId, method, params }));
      return new Promise((resolve, reject) => pending.set(msgId, { resolve, reject }));
    }
    await send('Runtime.enable');
    await send('Page.enable');
    await wait(1000);
    const expr = `new Promise(resolve => {
      const canvas=document.createElement('canvas');
      canvas.width=64; canvas.height=64;
      const ctx=canvas.getContext('2d');
      ctx.clearRect(0,0,64,64);
      ctx.fillStyle='black';
      ctx.fillRect(16,16,32,4); ctx.fillRect(16,44,32,4); ctx.fillRect(16,16,4,32); ctx.fillRect(44,16,4,32);
      ctx.fillRect(24,28,6,6); ctx.fillRect(36,28,6,6); ctx.fillRect(26,40,14,4);
      canvas.toBlob(blob => {
        const file=new File([blob], 'canvas-test-icon.png', {type:'image/png'});
        const input=document.querySelector('input[name="file"]');
        const dt=new DataTransfer(); dt.items.add(file); input.files=dt.files;
        input.dispatchEvent(new Event('change', {bubbles:true}));
        document.querySelector('[data-generate-stl="true"]').click();
        setTimeout(()=>resolve({
          status: document.querySelector('[data-converter-status]')?.textContent,
          downloadDisplay: getComputedStyle(document.querySelector('[data-download-stl="true"]')).display,
          message: document.querySelector('[data-converter-message]')?.textContent
        }), 5000);
      }, 'image/png');
    })`;
    const result = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    console.log(JSON.stringify(result.result.value, null, 2));
    const shot = await send('Page.captureScreenshot', { format: 'png', fullPage: true });
    fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
    console.log(out);
    ws.close();
  } finally {
    chrome.kill('SIGTERM');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
