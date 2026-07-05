#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};

const file = path.resolve(getArg('--file', 'index.html'));
const host = getArg('--host', '127.0.0.1');
const port = Number(getArg('--port', '0'));
const explicitSelection = getArg('--selection', null);
const selectionFile = path.resolve(explicitSelection ?? path.join(path.dirname(file), 'selection.json'));
const shouldOpen = !args.includes('--no-open');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

const bridgeScript = `
<!-- QIAOMU_DESIGN_PREVIEW_BRIDGE -->
<script>
(() => {
  const optionSelector = '[data-design-option],[data-option],[data-choice],[data-direction],.card[data-name],article.option,.option[data-name],.option';
  const optionLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const style = document.createElement('style');
  style.textContent = \`
    :root { --qmdp-topbar-h: 58px; }
    body.qmdp-preview-active { padding-top: var(--qmdp-topbar-h) !important; }
    .qmdp-frame {
      position: fixed;
      inset: 0 0 auto 0;
      z-index: 2147483000;
      height: var(--qmdp-topbar-h);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 0 18px;
      color: #191b21;
      background: color-mix(in srgb, #fbfbfa 94%, transparent);
      border-bottom: 1px solid #d8dbe1;
      box-shadow: 0 10px 30px rgb(15 23 42 / 8%);
      backdrop-filter: blur(16px) saturate(1.15);
      font: 500 13px/1.3 -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Microsoft YaHei", sans-serif;
    }
    .qmdp-frame strong { font-size: 14px; font-weight: 750; }
    .qmdp-frame-left, .qmdp-frame-right { display: inline-flex; align-items: center; gap: 10px; min-width: 0; }
    .qmdp-frame-title { display: inline-flex; align-items: center; gap: 9px; min-width: 0; }
    .qmdp-dot { width: 9px; height: 9px; border-radius: 999px; background: #168a5f; box-shadow: 0 0 0 4px rgb(22 138 95 / 12%); }
    .qmdp-frame small { color: #69707d; white-space: nowrap; }
    .qmdp-key { border: 1px solid #d8dbe1; border-radius: 7px; background: #fff; padding: 5px 8px; color: #4e5665; font-weight: 650; }
    .qmdp-pick-button {
      position: relative;
      z-index: 2;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 38px;
      width: 100%;
      margin-top: 14px;
      border: 1px solid #191b21;
      border-radius: 8px;
      background: #191b21;
      color: #fff;
      font: 750 14px/1 -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Microsoft YaHei", sans-serif;
      cursor: pointer;
      transition: transform 140ms cubic-bezier(.23,1,.32,1), background 140ms cubic-bezier(.23,1,.32,1), box-shadow 140ms cubic-bezier(.23,1,.32,1);
    }
    .qmdp-pick-button:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgb(15 23 42 / 16%); }
    .qmdp-pick-button:active { transform: translateY(0) scale(.99); }
    .qmdp-pick-button:focus-visible { outline: 3px solid rgb(94 106 210 / 28%); outline-offset: 2px; }
    .qmdp-selected { outline: 3px solid rgb(25 27 33 / 78%) !important; outline-offset: 3px !important; }
    .qmdp-selected .qmdp-pick-button { background: #168a5f; border-color: #168a5f; }
    .qmdp-toast {
      position: fixed;
      left: 50%;
      bottom: 18px;
      z-index: 2147483001;
      max-width: min(620px, calc(100vw - 28px));
      transform: translate(-50%, 18px);
      opacity: 0;
      border: 1px solid rgb(25 27 33 / 12%);
      border-radius: 10px;
      background: #191b21;
      color: #fff;
      padding: 12px 14px;
      box-shadow: 0 18px 48px rgb(15 23 42 / 24%);
      font: 650 14px/1.45 -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Microsoft YaHei", sans-serif;
      transition: transform 180ms cubic-bezier(.23,1,.32,1), opacity 180ms cubic-bezier(.23,1,.32,1);
      pointer-events: none;
    }
    .qmdp-toast.show { transform: translate(-50%, 0); opacity: 1; }
    @media (max-width: 720px) {
      :root { --qmdp-topbar-h: 88px; }
      .qmdp-frame { align-items: flex-start; flex-direction: column; justify-content: center; gap: 8px; padding: 10px 14px; }
      .qmdp-frame-right { flex-wrap: wrap; }
    }
  \`;
  document.head.appendChild(style);

  function ensureShell() {
    if (document.querySelector('.qmdp-frame')) return;
    document.body.classList.add('qmdp-preview-active');
    const frame = document.createElement('div');
    frame.className = 'qmdp-frame';
    frame.innerHTML = \`
      <div class="qmdp-frame-left">
        <span class="qmdp-dot" aria-hidden="true"></span>
        <span class="qmdp-frame-title"><strong>设计方向预览</strong><small>点按钮或按 1-4，选择会回传到 Codex</small></span>
      </div>
      <div class="qmdp-frame-right" aria-label="选择快捷键">
        <span class="qmdp-key">1 A</span><span class="qmdp-key">2 B</span><span class="qmdp-key">3 C</span><span class="qmdp-key">4 D</span>
      </div>\`;
    const toast = document.createElement('div');
    toast.className = 'qmdp-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.append(frame, toast);
  }

  function showToast(message) {
    const toast = document.querySelector('.qmdp-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
  }

  async function postSelection(payload) {
    const id = payload.id || payload.label || '';
    const name = payload.name || payload.title || '';
    const label = payload.label || (id && name ? id + ': ' + name : id || name);
    const record = {...payload, id, name, label, pageTitle: document.title, at: new Date().toISOString()};
    try {
      const res = await fetch('/api/select', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(record)
      });
      const data = await res.json();
      window.dispatchEvent(new CustomEvent('qiaomu-design-selection-saved', {detail: data}));
      showToast(data.ok ? '已选择 ' + label + '，并回传到 Codex。' : '选择已触发，但回传状态异常。');
      return data;
    } catch (error) {
      const text = label ? '选 ' + label : JSON.stringify(record);
      if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
      window.dispatchEvent(new CustomEvent('qiaomu-design-selection-failed', {detail: {error: String(error), record}}));
      showToast('已选择 ' + label + '，但当前未能回传，已尝试复制选择文本。');
      return {ok: false, error: String(error), record};
    }
  }

  window.qiaomuDesignSelect = postSelection;
  window.addEventListener('qiaomu-design-select', event => postSelection(event.detail || {}));

  function optionPayload(el, source, fallbackIndex = -1) {
    const fallbackId = fallbackIndex >= 0 ? 'ABCD'[fallbackIndex] : '';
    const id = el.dataset.designOption || el.dataset.option || el.dataset.choice || el.dataset.direction || el.dataset.id || el.dataset.key || fallbackId || '';
    const name = el.dataset.name || el.querySelector('[data-direction-name]')?.textContent?.trim() || el.querySelector('h2,h3,strong')?.textContent?.trim() || '';
    return {id, name, label: id && name ? id + ': ' + name : id || name, source};
  }

  function ensureOptionButtons() {
    ensureShell();
    const cards = Array.from(document.querySelectorAll(optionSelector)).filter(el => !el.closest('.qmdp-frame'));
    cards.slice(0, 8).forEach((el, index) => {
      if (el.querySelector('.qmdp-pick-button')) return;
      const payload = optionPayload(el, 'button', index);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'qmdp-pick-button';
      button.textContent = '选择 ' + (payload.id || optionLetters[index] || '') + (payload.name ? ' · ' + payload.name.replace(/^\\d+\\.\\s*/, '') : '');
      button.setAttribute('aria-label', button.textContent);
      el.appendChild(button);
    });
  }

  function markSelected(el) {
    document.querySelectorAll('.qmdp-selected').forEach(item => item.classList.remove('qmdp-selected'));
    if (el) el.classList.add('qmdp-selected');
  }

  document.addEventListener('click', event => {
    const el = event.target.closest(optionSelector);
    if (!el) return;
    const cards = Array.from(document.querySelectorAll(optionSelector));
    markSelected(el);
    postSelection(optionPayload(el, 'click', cards.indexOf(el)));
  }, true);

  document.addEventListener('keydown', event => {
    const index = ['1', '2', '3', '4'].indexOf(event.key);
    if (index < 0) return;
    const cards = document.querySelectorAll(optionSelector);
    const el = cards[index];
    if (!el) return;
    markSelected(el);
    postSelection(optionPayload(el, 'keyboard', index));
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureOptionButtons, {once: true});
  } else {
    ensureOptionButtons();
  }
})();
</script>`;

function injectBridge(html) {
  if (html.includes('QIAOMU_DESIGN_PREVIEW_BRIDGE')) return html;
  if (html.includes('</body>')) return html.replace('</body>', `${bridgeScript}\n</body>`);
  return `${html}\n${bridgeScript}`;
}

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1024 * 1024) throw new Error('Request body too large');
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8') || '{}';
  return JSON.parse(raw);
}

function sendJson(res, status, data) {
  res.writeHead(status, {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'});
  res.end(JSON.stringify(data));
}

function openUrl(url) {
  const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'cmd' : 'xdg-open';
  const openerArgs = process.platform === 'win32' ? ['/c', 'start', '', url] : [url];
  const child = spawn(opener, openerArgs, {stdio: 'ignore', detached: true});
  child.unref();
}

const root = path.dirname(file);
const isInsideRoot = candidate => candidate === root || candidate.startsWith(`${root}${path.sep}`);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${host}`);

    if (req.method === 'GET' && url.pathname === '/api/health') {
      return sendJson(res, 200, {ok: true, file, selectionFile});
    }

    if (req.method === 'GET' && url.pathname === '/api/selection') {
      try {
        const selection = JSON.parse(await fs.readFile(selectionFile, 'utf8'));
        return sendJson(res, 200, {ok: true, selection});
      } catch {
        return sendJson(res, 200, {ok: true, selection: null});
      }
    }

    if (req.method === 'POST' && url.pathname === '/api/select') {
      const body = await readJsonBody(req);
      const record = {
        id: body.id || '',
        label: body.label || '',
        name: body.name || '',
        notes: body.notes || '',
        source: body.source || 'preview',
        receivedAt: new Date().toISOString()
      };
      await fs.mkdir(path.dirname(selectionFile), {recursive: true});
      await fs.writeFile(selectionFile, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
      console.log(`QIAOMU_DESIGN_SELECTION::${JSON.stringify(record)}`);
      return sendJson(res, 200, {ok: true, selection: record});
    }

    if (req.method !== 'GET') return sendJson(res, 405, {ok: false, error: 'Method not allowed'});

    const requestPath = url.pathname === '/' ? file : path.resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (!isInsideRoot(requestPath)) return sendJson(res, 403, {ok: false, error: 'Forbidden'});

    let body = await fs.readFile(requestPath);
    const ext = path.extname(requestPath).toLowerCase();
    res.writeHead(200, {'Content-Type': mime[ext] || 'application/octet-stream', 'Cache-Control': 'no-store'});
    if (ext === '.html') body = Buffer.from(injectBridge(body.toString('utf8')), 'utf8');
    res.end(body);
  } catch (error) {
    sendJson(res, 500, {ok: false, error: String(error.message || error)});
  }
});

server.listen(port, host, () => {
  const address = server.address();
  const url = `http://${host}:${address.port}/`;
  console.log(`QIAOMU_DESIGN_PREVIEW_URL::${url}`);
  console.log(`QIAOMU_DESIGN_SELECTION_FILE::${selectionFile}`);
  if (shouldOpen) openUrl(url);
});
