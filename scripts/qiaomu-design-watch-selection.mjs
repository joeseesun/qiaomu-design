#!/usr/bin/env node
import fs from 'node:fs/promises';
import * as fsSync from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};

const selectionFile = path.resolve(getArg('--selection', 'selection.json'));
const timeoutMs = Number(getArg('--timeout', '300000'));
const intervalMs = Number(getArg('--interval', '75'));
const readStdin = args.includes('--stdin');

async function readSelection() {
  try {
    const raw = await fs.readFile(selectionFile, 'utf8');
    const selection = JSON.parse(raw);
    if (selection && (selection.id || selection.label || selection.name)) return selection;
  } catch {
    return null;
  }
  return null;
}

let done = false;
let watchingFile = false;

function observeSelection(selection) {
  if (done) return;
  if (selection) {
    done = true;
    console.log(`QIAOMU_DESIGN_SELECTION_OBSERVED::${JSON.stringify(selection)}`);
    process.exit(0);
  }
}

async function checkOnce() {
  if (done) return;
  observeSelection(await readSelection());
}

await checkOnce();

let watcher;
try {
  watcher = fsSync.watch(path.dirname(selectionFile), {persistent: true}, (_event, filename) => {
    if (!filename || filename === path.basename(selectionFile)) checkOnce();
  });
} catch {
  watcher = null;
}

try {
  fsSync.watchFile(selectionFile, {interval: Math.min(intervalMs, 75), persistent: true}, checkOnce);
  watchingFile = true;
} catch {
  watchingFile = false;
}

if (readStdin) {
  process.stdin.setEncoding('utf8');
  let buffer = '';
  process.stdin.on('data', chunk => {
    buffer += chunk;
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || '';
    for (const line of lines) {
      const match = line.match(/QIAOMU_DESIGN_SELECTION::(.+)$/);
      if (!match) continue;
      try {
        observeSelection(JSON.parse(match[1]));
      } catch {
        // Ignore malformed log lines and keep watching the selection file.
      }
    }
  });
}

const poll = setInterval(checkOnce, intervalMs);
const timeout = setTimeout(() => {
  done = true;
  if (watcher) watcher.close();
  if (watchingFile) fsSync.unwatchFile(selectionFile, checkOnce);
  clearInterval(poll);
  console.error(`QIAOMU_DESIGN_SELECTION_TIMEOUT::${selectionFile}`);
  process.exit(2);
}, timeoutMs);

process.on('SIGINT', () => {
  done = true;
  if (watcher) watcher.close();
  if (watchingFile) fsSync.unwatchFile(selectionFile, checkOnce);
  clearInterval(poll);
  clearTimeout(timeout);
  process.exit(130);
});
