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
const shouldExitOnSelect = args.includes('--exit-on-select');

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
  let pendingSelection = null;

  const style = document.createElement('style');
  style.textContent = \`
    :root { --qmdp-topbar-h: 58px; --qmdp-dials-h: 78px; --qmdp-shell-h: calc(var(--qmdp-topbar-h) + var(--qmdp-dials-h)); }
    body.qmdp-preview-active { padding-top: var(--qmdp-shell-h) !important; }
    body.qmdp-preview-compact { --qmdp-shell-h: var(--qmdp-topbar-h); }
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
    .qmdp-key { border: 1px solid #d8dbe1; border-radius: 7px; background: #fff; padding: 5px 8px; color: #4e5665; font-weight: 650; }
    .qmdp-dials {
      position: fixed;
      inset: var(--qmdp-topbar-h) 0 auto 0;
      z-index: 2147482999;
      height: var(--qmdp-dials-h);
      display: grid;
      grid-template-columns: repeat(3, minmax(160px, 1fr));
      gap: 14px;
      align-items: center;
      padding: 10px 18px 12px;
      background: color-mix(in srgb, #fbfbfa 95%, transparent);
      border-bottom: 1px solid #d8dbe1;
      box-shadow: 0 12px 26px rgb(15 23 42 / 6%);
      backdrop-filter: blur(16px) saturate(1.12);
      font: 500 12px/1.25 -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Microsoft YaHei", sans-serif;
    }
    .qmdp-dial { display: grid; gap: 7px; color: #4e5665; min-width: 0; }
    .qmdp-dial-head { display: flex; justify-content: space-between; gap: 10px; color: #191b21; font-weight: 700; }
    .qmdp-dial output { font-variant-numeric: tabular-nums; color: #168a5f; }
    .qmdp-dial input { width: 100%; accent-color: #191b21; }
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
    .qmdp-confirm {
      position: fixed;
      inset: 0;
      z-index: 2147483002;
      display: grid;
      place-items: center;
      padding: 20px;
      background: rgb(15 18 26 / 38%);
      opacity: 0;
      pointer-events: none;
      transition: opacity 140ms cubic-bezier(.23,1,.32,1);
    }
    .qmdp-confirm.open { opacity: 1; pointer-events: auto; }
    .qmdp-dialog {
      width: min(520px, calc(100vw - 32px));
      border: 1px solid rgb(25 27 33 / 12%);
      border-radius: 12px;
      background: #fff;
      color: #191b21;
      padding: 20px;
      box-shadow: 0 28px 80px rgb(15 23 42 / 28%);
      font: 500 14px/1.5 -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Microsoft YaHei", sans-serif;
      transform: translateY(8px) scale(.98);
      transition: transform 140ms cubic-bezier(.23,1,.32,1);
    }
    .qmdp-confirm.open .qmdp-dialog { transform: translateY(0) scale(1); }
    .qmdp-dialog h2 { margin: 0 0 8px; font-size: 18px; line-height: 1.25; letter-spacing: 0; }
    .qmdp-dialog p { margin: 0 0 14px; color: #596171; }
    .qmdp-adjustments {
      box-sizing: border-box;
      width: 100%;
      min-height: 88px;
      resize: vertical;
      border: 1px solid #d8dbe1;
      border-radius: 10px;
      padding: 11px 12px;
      color: #191b21;
      font: inherit;
      outline: none;
    }
    .qmdp-adjustments:focus { border-color: #191b21; box-shadow: 0 0 0 3px rgb(25 27 33 / 10%); }
    .qmdp-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px; }
    .qmdp-action {
      border: 1px solid #d8dbe1;
      border-radius: 8px;
      background: #fff;
      color: #191b21;
      min-height: 38px;
      padding: 0 14px;
      font: 750 13px/1 -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Microsoft YaHei", sans-serif;
      cursor: pointer;
    }
    .qmdp-action.primary { border-color: #191b21; background: #191b21; color: #fff; }
    .qmdp-action:focus-visible { outline: 3px solid rgb(94 106 210 / 28%); outline-offset: 2px; }
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
      :root { --qmdp-topbar-h: 88px; --qmdp-dials-h: 156px; }
      .qmdp-frame { align-items: flex-start; flex-direction: column; justify-content: center; gap: 8px; padding: 10px 14px; }
      .qmdp-frame-right { flex-wrap: wrap; }
      .qmdp-dials { grid-template-columns: 1fr; gap: 8px; padding: 10px 14px; }
      .qmdp-dial { gap: 4px; }
    }
  \`;
  document.head.appendChild(style);

  function ensureShell() {
    if (document.querySelector('.qmdp-frame')) return;
    document.body.classList.add('qmdp-preview-active');
    const hasNativeDials = Boolean(document.querySelector('[data-qmdp-dials], .qmdp-dials'));
    if (hasNativeDials) document.body.classList.add('qmdp-preview-compact');
    const frame = document.createElement('div');
    frame.className = 'qmdp-frame';
    frame.innerHTML = \`
      <div class="qmdp-frame-left">
        <span class="qmdp-dot" aria-hidden="true"></span>
        <span class="qmdp-frame-title"><strong>设计方向预览</strong></span>
      </div>
      <div class="qmdp-frame-right" aria-label="选择快捷键">
        <span class="qmdp-key">1 A</span><span class="qmdp-key">2 B</span><span class="qmdp-key">3 C</span><span class="qmdp-key">4 D</span>
      </div>\`;
    const dials = document.createElement('div');
    dials.className = 'qmdp-dials';
    dials.dataset.qmdpInjected = 'true';
    dials.setAttribute('aria-label', '设计拨盘');
    dials.innerHTML = \`
      <label class="qmdp-dial">
        <span class="qmdp-dial-head"><span>视觉冒险度</span><output data-qmdp-output="variance">7</output></span>
        <input data-qmdp-dial="variance" type="range" min="1" max="10" value="7">
      </label>
      <label class="qmdp-dial">
        <span class="qmdp-dial-head"><span>动效强度</span><output data-qmdp-output="motion">6</output></span>
        <input data-qmdp-dial="motion" type="range" min="1" max="10" value="6">
      </label>
      <label class="qmdp-dial">
        <span class="qmdp-dial-head"><span>信息密度</span><output data-qmdp-output="density">5</output></span>
        <input data-qmdp-dial="density" type="range" min="1" max="10" value="5">
      </label>\`;
    const confirm = document.createElement('div');
    confirm.className = 'qmdp-confirm';
    confirm.setAttribute('role', 'dialog');
    confirm.setAttribute('aria-modal', 'true');
    confirm.setAttribute('aria-labelledby', 'qmdp-confirm-title');
    confirm.innerHTML = \`
      <div class="qmdp-dialog">
        <h2 id="qmdp-confirm-title">确认设计方向</h2>
        <p data-qmdp-confirm-meta></p>
        <textarea class="qmdp-adjustments" placeholder="可选：写下调整建议，比如更稳一点、要 B 的字体 + C 的配色"></textarea>
        <div class="qmdp-actions">
          <button class="qmdp-action" type="button" data-qmdp-cancel>取消</button>
          <button class="qmdp-action primary" type="button" data-qmdp-confirm>确认并回传</button>
        </div>
      </div>\`;
    const toast = document.createElement('div');
    toast.className = 'qmdp-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    const nodes = [frame];
    if (!hasNativeDials) nodes.push(dials);
    nodes.push(confirm, toast);
    document.body.append(...nodes);
    bindDialOutputs();
    confirm.querySelector('[data-qmdp-cancel]').addEventListener('click', closeConfirm);
    confirm.querySelector('[data-qmdp-confirm]').addEventListener('click', confirmPending);
    confirm.addEventListener('click', event => {
      if (event.target === confirm) closeConfirm();
    });
  }

  function showToast(message) {
    const toast = document.querySelector('.qmdp-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
  }

  function bindDialOutputs() {
    document.querySelectorAll('[data-qmdp-dial]').forEach(input => {
      const output = document.querySelector('[data-qmdp-output="' + input.dataset.qmdpDial + '"]');
      const sync = () => { if (output) output.value = input.value; };
      input.addEventListener('input', sync);
      sync();
    });
  }

  function dialInput(key) {
    return document.querySelector('[data-qmdp-dial="' + key + '"], #' + key + ', [name="' + key + '"], [data-dial="' + key + '"]');
  }

  function readDials() {
    const value = (key, fallback) => {
      const input = dialInput(key);
      const number = Number(input?.value);
      return Number.isFinite(number) ? number : fallback;
    };
    return {variance: value('variance', 7), motion: value('motion', 6), density: value('density', 5)};
  }

  function formatDials(values) {
    return '视觉冒险度 ' + values.variance + ' / 动效强度 ' + values.motion + ' / 信息密度 ' + values.density;
  }

  function normalizePayload(payload = {}) {
    const id = payload.id || payload.key || payload.label || '';
    const name = payload.name || payload.title || '';
    const label = payload.label || (id && name ? '选 ' + id + '：' + name : id || name || '当前方向');
    return {...payload, id, name, label};
  }

  function selectionText(payload) {
    const values = payload.dials || readDials();
    const advice = payload.adjustments ? '；建议：' + payload.adjustments : '';
    return payload.label + '；拨盘：' + formatDials(values) + advice;
  }

  async function postSelection(payload) {
    const base = normalizePayload(payload);
    const record = {
      ...base,
      dials: base.dials || readDials(),
      adjustments: typeof base.adjustments === 'string' ? base.adjustments : '',
      pageTitle: document.title,
      at: new Date().toISOString()
    };
    try {
      const res = await fetch('/api/select', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(record)
      });
      const data = await res.json();
      window.dispatchEvent(new CustomEvent('qiaomu-design-selection-saved', {detail: data}));
      showToast(data.ok ? '已选择 ' + record.label + '，已回传。' : '选择已触发，但回传状态异常。');
      return data;
    } catch (error) {
      const text = selectionText(record);
      if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
      window.dispatchEvent(new CustomEvent('qiaomu-design-selection-failed', {detail: {error: String(error), record}}));
      showToast('已选择 ' + record.label + '，但当前未能回传，已尝试复制选择文本。');
      return {ok: false, error: String(error), record};
    }
  }

  function closeConfirm() {
    const confirm = document.querySelector('.qmdp-confirm');
    if (confirm) confirm.classList.remove('open');
  }

  function openConfirm(payload, el) {
    ensureShell();
    if (el) markSelected(el);
    pendingSelection = normalizePayload({...payload, dials: readDials()});
    const confirm = document.querySelector('.qmdp-confirm');
    const meta = confirm?.querySelector('[data-qmdp-confirm-meta]');
    const textarea = confirm?.querySelector('.qmdp-adjustments');
    if (!confirm || !meta || !textarea) return;
    meta.textContent = pendingSelection.label + ' · ' + formatDials(pendingSelection.dials);
    textarea.value = pendingSelection.adjustments || '';
    confirm.classList.add('open');
    requestAnimationFrame(() => textarea.focus({preventScroll: true}));
  }

  async function confirmPending() {
    if (!pendingSelection) return;
    const textarea = document.querySelector('.qmdp-adjustments');
    const payload = {
      ...pendingSelection,
      dials: readDials(),
      adjustments: textarea ? textarea.value.trim() : ''
    };
    closeConfirm();
    showToast('正在回传 ' + payload.label + '...');
    await postSelection(payload);
  }

  function openConfirmFromPayload(payload) {
    const normalized = normalizePayload(payload || {});
    const cards = Array.from(document.querySelectorAll(optionSelector));
    const el = cards.find(item => {
      const data = optionPayload(item, 'external', cards.indexOf(item));
      return (normalized.id && data.id === normalized.id) || (normalized.name && data.name === normalized.name);
    });
    openConfirm(normalized, el);
    return {ok: false, pending: true};
  }

  window.qiaomuDesignSelect = openConfirmFromPayload;
  window.addEventListener('qiaomu-design-select', event => openConfirmFromPayload(event.detail || {}));

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
      button.dataset.qmdpInjected = 'true';
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
    if (event.target.closest('.qmdp-confirm')) return;
    const pickButton = event.target.closest('.qmdp-pick-button');
    if (
      pickButton
      && !pickButton.dataset.qmdpInjected
      && (pickButton.dataset.qmdpNativeHandler === 'true' || pickButton.dataset.qmdpManaged === 'page')
    ) return;
    const interactive = event.target.closest('a,input,select,textarea,button,[contenteditable="true"]');
    if (interactive && !pickButton) return;
    const el = event.target.closest(optionSelector);
    if (!el) return;
    if (pickButton) {
      event.preventDefault();
      event.stopPropagation();
    }
    const cards = Array.from(document.querySelectorAll(optionSelector));
    openConfirm(optionPayload(el, 'click', cards.indexOf(el)), el);
  }, true);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.querySelector('.qmdp-confirm.open')) {
      closeConfirm();
      return;
    }
    if (event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    if (document.querySelector('.qmdp-confirm.open')) return;
    const index = ['1', '2', '3', '4'].indexOf(event.key);
    if (index < 0) return;
    const cards = document.querySelectorAll(optionSelector);
    const el = cards[index];
    if (!el) return;
    event.preventDefault();
    openConfirm(optionPayload(el, 'keyboard', index), el);
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
        dials: body.dials || null,
        adjustments: body.adjustments || '',
        source: body.source || 'preview',
        receivedAt: new Date().toISOString()
      };
      await fs.mkdir(path.dirname(selectionFile), {recursive: true});
      await fs.writeFile(selectionFile, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
      console.log(`QIAOMU_DESIGN_SELECTION::${JSON.stringify(record)}`);
      sendJson(res, 200, {ok: true, selection: record});
      if (shouldExitOnSelect) {
        setTimeout(() => server.close(() => process.exit(0)), 20);
      }
      return;
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
