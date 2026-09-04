#!/usr/bin/env node

import {appendFile, mkdir, readFile, access} from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const LEVELS = new Set(['硬禁令', '强偏好', '情境规则']);
const EVENT_TYPES = new Set(['correction', 'preference', 'approval', 'defect', 'validation']);
const DECISIONS = new Set(['accepted', 'rejected', 'published', 'retired', 'rolled-back']);

function fail(message) {
  console.error(`qiaomu-design-evolution: ${message}`);
  process.exitCode = 1;
}

function arg(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] ?? fallback : fallback;
}

function has(name) {
  return process.argv.includes(`--${name}`);
}

function rootDir() {
  return path.resolve(arg('root', path.resolve(new URL('.', import.meta.url).pathname, '..')));
}

function evolutionDir(root = rootDir()) {
  return path.join(root, 'references', 'evolution');
}

function file(name, root = rootDir()) {
  return path.join(evolutionDir(root), name);
}

function id(prefix, payload) {
  return `${prefix}-${crypto.createHash('sha256').update(`${Date.now()}\n${payload}`).digest('hex').slice(0, 10)}`;
}

async function ensureStore(root = rootDir()) {
  await mkdir(evolutionDir(root), {recursive: true});
  for (const name of ['events.jsonl', 'candidates.jsonl', 'decisions.jsonl']) {
    try { await access(file(name, root)); } catch { await appendFile(file(name, root), ''); }
  }
}

async function append(name, record, root = rootDir()) {
  await ensureStore(root);
  await appendFile(file(name, root), `${JSON.stringify(record)}\n`, 'utf8');
}

async function readJsonl(name, root = rootDir()) {
  await ensureStore(root);
  const raw = await readFile(file(name, root), 'utf8');
  return raw.split('\n').filter(Boolean).map((line, index) => {
    try { return JSON.parse(line); } catch (error) {
      throw new Error(`${name}:${index + 1} 不是有效 JSON：${error.message}`);
    }
  });
}

function required(name, value) {
  if (!value) throw new Error(`缺少 --${name}`);
  return value;
}

function usage() {
  console.log(`用法：qiaomu-design-evolution <init|record|propose|approve|publish|transition|verify|report> [选项]

命令：
  init       创建 references/evolution/ 追加日志
  record     记录反馈或带证据的自发现问题，不改变 Skill 行为
  propose    从事件生成候选规则，不改变 Skill 行为
  approve    接受或拒绝候选规则（接受必须 --confirm）
  publish    将已接受候选追加到 user-preferences.md（必须 --confirm）
  transition 记录 retired / rolled-back 状态（必须 --confirm）
  verify     检查 JSONL、引用、冲突和发布链路
  report     输出事件、候选和规则状态摘要

常用选项：--root PATH --type TYPE --source user|self --quote TEXT --scope TEXT
           --evidence PATH --event ID --rule TEXT --level 硬禁令|强偏好|情境规则
           --candidate ID --confirm --reason TEXT --preflight TEXT`);
}

async function command() {
  const commandName = process.argv[2];
  if (!commandName || commandName === '--help' || commandName === '-h') return usage();
  const root = rootDir();

  if (commandName === 'init') {
    await ensureStore(root);
    console.log(`已初始化：${evolutionDir(root)}`);
    return;
  }

  if (commandName === 'record') {
    const type = required('type', arg('type'));
    const source = required('source', arg('source'));
    if (!EVENT_TYPES.has(type)) throw new Error(`--type 必须是：${[...EVENT_TYPES].join(', ')}`);
    const quote = required('quote', arg('quote'));
    const evidence = process.argv.slice(3).flatMap((value, index, values) => value === '--evidence' ? [values[index + 1]] : []).filter(Boolean);
    if (source === 'self' && evidence.length === 0) throw new Error('source=self 必须至少提供一个 --evidence');
    const record = {id: id('evt', quote), timestamp: new Date().toISOString(), type, source, quote,
      scope: arg('scope', '待提炼'), taskId: arg('task-id'), evidence, status: 'observed'};
    await append('events.jsonl', record, root);
    console.log(JSON.stringify(record, null, 2));
    return;
  }

  if (commandName === 'propose') {
    const eventId = required('event', arg('event'));
    const rule = required('rule', arg('rule'));
    const level = required('level', arg('level'));
    const events = await readJsonl('events.jsonl', root);
    const event = events.find(item => item.id === eventId);
    if (!event) throw new Error(`找不到事件：${eventId}`);
    if (!LEVELS.has(level)) throw new Error(`--level 必须是：${[...LEVELS].join('、')}`);
    const record = {id: id('cand', `${eventId}\n${rule}`), timestamp: new Date().toISOString(), type: 'candidate', source: 'cli', eventIds: [eventId],
      rule, level, scope: required('scope', arg('scope')), rationale: required('reason', arg('reason')),
      preflight: arg('preflight'), status: 'proposed'};
    await append('candidates.jsonl', record, root);
    console.log(JSON.stringify(record, null, 2));
    return;
  }

  if (commandName === 'approve') {
    const candidateId = required('candidate', arg('candidate'));
    const status = arg('status', 'accepted');
    if (!['accepted', 'rejected'].includes(status)) throw new Error('--status 只能是 accepted 或 rejected');
    if (status === 'accepted' && !has('confirm')) throw new Error('批准会让候选规则进入 accepted，必须显式提供 --confirm');
    const candidates = await readJsonl('candidates.jsonl', root);
    const candidate = candidates.find(item => item.id === candidateId);
    if (!candidate) throw new Error(`找不到候选规则：${candidateId}`);
    const decisions = await readJsonl('decisions.jsonl', root);
    const latest = [...decisions].reverse().find(item => item.candidateId === candidateId);
    if (latest && ['accepted', 'rejected', 'published', 'retired', 'rolled-back'].includes(latest.status)) {
      throw new Error(`候选规则当前状态是 ${latest.status}，不能重复审核`);
    }
    const decision = {id: id('dec', `${candidateId}\n${status}`), timestamp: new Date().toISOString(), type: 'decision', source: 'cli', candidateId,
      status, reason: arg('reason', status === 'accepted' ? '显式批准候选规则' : '拒绝候选规则')};
    await append('decisions.jsonl', decision, root);
    console.log(JSON.stringify(decision, null, 2));
    return;
  }

  if (commandName === 'transition') {
    if (!has('confirm')) throw new Error('状态迁移会改变候选规则生命周期，必须显式提供 --confirm');
    const candidateId = required('candidate', arg('candidate'));
    const status = required('status', arg('status'));
    if (!['retired', 'rolled-back'].includes(status)) throw new Error('--status 只能是 retired 或 rolled-back');
    const candidates = await readJsonl('candidates.jsonl', root);
    const decisions = await readJsonl('decisions.jsonl', root);
    if (!candidates.some(item => item.id === candidateId)) throw new Error(`找不到候选规则：${candidateId}`);
    const latest = [...decisions].reverse().find(item => item.candidateId === candidateId);
    if (!latest || !['accepted', 'published'].includes(latest.status)) throw new Error(`当前状态 ${latest?.status ?? 'proposed'} 不能迁移为 ${status}`);
    const decision = {id: id('dec', `${candidateId}\n${status}`), timestamp: new Date().toISOString(), type: 'decision', source: 'cli', candidateId,
      status, reason: required('reason', arg('reason'))};
    await append('decisions.jsonl', decision, root);
    console.log(JSON.stringify(decision, null, 2));
    return;
  }

  if (commandName === 'publish') {
    if (!has('confirm')) throw new Error('发布会改变 user-preferences.md，必须显式提供 --confirm');
    const candidateId = required('candidate', arg('candidate'));
    const ruleId = required('rule-id', arg('rule-id'));
    if (!/^P-[A-Z0-9-]+$/i.test(ruleId)) throw new Error('--rule-id 必须是可读的规则编号，例如 P-45');
    const candidates = await readJsonl('candidates.jsonl', root);
    const decisions = await readJsonl('decisions.jsonl', root);
    const candidate = candidates.find(item => item.id === candidateId);
    const latest = [...decisions].reverse().find(item => item.candidateId === candidateId);
    const accepted = latest?.status === 'accepted' ? latest : null;
    if (!candidate || !accepted) throw new Error('只能发布已找到且已 accepted 的候选规则');
    const previousPublish = decisions.find(item => item.candidateId === candidateId && item.status === 'published');
    if (previousPublish) throw new Error('候选规则已经发布过，禁止重复写入账本');
    const prefs = file('../user-preferences.md', root);
    const existingPrefs = await readFile(prefs, 'utf8');
    if (existingPrefs.includes(`### ${ruleId} ·`)) throw new Error(`规则编号已存在：${ruleId}`);
    const events = await readJsonl('events.jsonl', root);
    const event = events.find(item => candidate.eventIds.includes(item.id));
    const text = `\n### ${ruleId} · ${candidate.rule}\n- 级别：${candidate.level}\n- 何时适用：${candidate.scope}\n- 规则：${candidate.rule}\n- 原话摘录："${event?.quote ?? '见事件记录'}"\n- 收录：${new Date().toISOString().slice(0, 10)}｜状态：生效\n- 证据：${event?.evidence?.join(', ') || event?.id}\n`;
    await appendFile(prefs, text, 'utf8');
    await append('decisions.jsonl', {id: id('dec', `${candidateId}\npublished`), timestamp: new Date().toISOString(), type: 'decision', source: 'cli', candidateId,
      status: 'published', target: 'references/user-preferences.md'} , root);
    console.log(`已发布 ${candidateId} → ${prefs}`);
    return;
  }

  if (commandName === 'verify' || commandName === 'report') {
    const events = await readJsonl('events.jsonl', root);
    const candidates = await readJsonl('candidates.jsonl', root);
    const decisions = await readJsonl('decisions.jsonl', root);
    const all = [...events, ...candidates, ...decisions];
    const ids = new Set();
    const errors = [];
    for (const item of all) {
      if (!item.id || ids.has(item.id)) errors.push(`重复或缺少 id：${item.id ?? '(空)'}`);
      ids.add(item.id);
    }
    for (const event of events) {
      if (!EVENT_TYPES.has(event.type)) errors.push(`${event.id}: 未知事件类型 ${event.type}`);
      if (event.source === 'self' && (!event.evidence || event.evidence.length === 0)) errors.push(`${event.id}: 自发现事件缺少证据`);
    }
    for (const candidate of candidates) {
      if (!LEVELS.has(candidate.level)) errors.push(`${candidate.id}: 未知规则级别 ${candidate.level}`);
      for (const eventId of candidate.eventIds ?? []) if (!events.some(item => item.id === eventId)) errors.push(`${candidate.id}: 缺少事件 ${eventId}`);
    }
    for (const decision of decisions) {
      if (!DECISIONS.has(decision.status)) errors.push(`${decision.id}: 未知决策状态 ${decision.status}`);
      if (!candidates.some(item => item.id === decision.candidateId)) errors.push(`${decision.id}: 缺少候选规则 ${decision.candidateId}`);
    }
    const stateOf = candidateId => [...decisions].reverse().find(item => item.candidateId === candidateId)?.status ?? 'proposed';
    if (commandName === 'report') {
      console.log(JSON.stringify({root, events: events.length, candidates: candidates.length,
        decisions: decisions.length,
        states: Object.fromEntries([...new Set(candidates.map(x => stateOf(x.id)))].map(state => [state, candidates.filter(x => stateOf(x.id) === state).length])),
        errors}, null, 2));
      return;
    }
    if (errors.length) throw new Error(errors.join('\n'));
    console.log(`verify passed: ${events.length} events, ${candidates.length} candidates, ${decisions.length} decisions`);
    return;
  }

  throw new Error(`未知命令：${commandName}`);
}

command().catch(error => fail(error.message));
