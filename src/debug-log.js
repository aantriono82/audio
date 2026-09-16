import { invoke, isTauri } from '@tauri-apps/api/core';

const STORAGE_KEY = 'atiga-debug-log';
const VERBOSE_KEY = 'atiga-debug-verbose';
const MAX_ENTRIES = 1200;
const MAX_VALUE_LENGTH = 1400;

let entries = loadStoredEntries();
let verbose = readVerboseFlag();
let initialized = false;
let nativeLogging = false;
let nativeWriteQueue = Promise.resolve();
const sessionId = Math.random().toString(36).slice(2, 8);

function storage() {
  try { return typeof localStorage === 'undefined' ? null : localStorage; } catch { return null; }
}

function loadStoredEntries() {
  const store = storage();
  if (!store) return [];
  try {
    const parsed = JSON.parse(store.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed)
      ? parsed.filter(entry => entry && typeof entry.timestamp === 'string' && typeof entry.level === 'string' && typeof entry.message === 'string').slice(-MAX_ENTRIES)
      : [];
  } catch { return []; }
}

function readVerboseFlag() {
  const query = typeof location === 'undefined' ? null : new URLSearchParams(location.search);
  if (query?.has('debug') || query?.has('verbose')) return query.get('debug') !== '0' && query.get('verbose') !== '0';
  const store = storage();
  try { return store?.getItem(VERBOSE_KEY) === '1'; } catch { return false; }
}

function truncate(value) {
  const text = String(value);
  return text.length > MAX_VALUE_LENGTH ? `${text.slice(0, MAX_VALUE_LENGTH)}…` : text;
}

function safeValue(value, seen = new WeakSet(), depth = 0) {
  if (value === undefined || value === null || typeof value === 'boolean' || typeof value === 'number') return value;
  if (typeof value === 'string') return truncate(value);
  if (value instanceof Error) return { name: value.name, message: truncate(value.message), stack: truncate(value.stack || '') };
  if (typeof Blob !== 'undefined' && value instanceof Blob) {
    return { type: value.type, size: value.size };
  }
  if (typeof File !== 'undefined' && value instanceof File) {
    return { name: value.name, type: value.type, size: value.size, lastModified: value.lastModified };
  }
  if (depth >= 3) return `[${Object.prototype.toString.call(value)}]`;
  if (typeof value !== 'object') return truncate(value);
  if (seen.has(value)) return '[Circular]';
  seen.add(value);
  if (Array.isArray(value)) return value.slice(0, 30).map(item => safeValue(item, seen, depth + 1));
  const result = {};
  Object.keys(value).slice(0, 40).forEach(key => {
    try { result[key] = safeValue(value[key], seen, depth + 1); } catch { result[key] = '[Unreadable]'; }
  });
  return result;
}

function serializeDetails(details) {
  if (details === undefined) return '';
  try { return ` ${truncate(JSON.stringify(safeValue(details)))}`; } catch { return ' [Unserializable details]'; }
}

function formatEntry(entry) {
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.session}] ${entry.message}${entry.details ? ` ${entry.details}` : ''}`;
}

function persistEntries() {
  const store = storage();
  if (!store) return;
  try { store.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES))); } catch { /* Logging must never break the app. */ }
}

function enqueueNativeLine(line) {
  if (!nativeLogging) return;
  nativeWriteQueue = nativeWriteQueue
    .then(() => invoke('append_debug_log', { line }))
    .catch(() => { /* Native logging is best effort and must not recurse. */ });
}

export function isVerboseLoggingEnabled() { return verbose; }

export function setVerboseLogging(enabled) {
  verbose = Boolean(enabled);
  const store = storage();
  try {
    if (verbose) store?.setItem(VERBOSE_KEY, '1');
    else store?.removeItem(VERBOSE_KEY);
  } catch { /* The in-memory flag remains usable. */ }
  log('info', `debug.verbose.${verbose ? 'enabled' : 'disabled'}`);
  return verbose;
}

export function log(level, message, details) {
  const normalizedLevel = ['debug', 'info', 'warn', 'error'].includes(level) ? level : 'info';
  if (normalizedLevel === 'debug' && !verbose) return;
  const entry = {
    timestamp: new Date().toISOString(),
    level: normalizedLevel,
    session: sessionId,
    message: String(message),
    details: serializeDetails(details).trim()
  };
  entries.push(entry);
  if (entries.length > MAX_ENTRIES) entries = entries.slice(-MAX_ENTRIES);
  persistEntries();
  const line = formatEntry(entry);
  if (normalizedLevel === 'error') console.error(line);
  else if (normalizedLevel === 'warn') console.warn(line);
  else if (verbose) console.info(line);
  enqueueNativeLine(line);
}

export function captureError(message, error, details) {
  log('error', message, { error, ...details });
}

export function getDebugLogText() {
  return entries.map(formatEntry).join('\n') + (entries.length ? '\n' : '');
}

export async function exportDebugLog() {
  let content = getDebugLogText();
  if (nativeLogging) {
    try {
      await nativeWriteQueue;
      const nativeContent = await invoke('read_debug_log');
      if (typeof nativeContent === 'string' && nativeContent.trim()) content = nativeContent;
    } catch { /* The current in-memory log is still exportable. */ }
  }
  const blob = new Blob([content || 'Atiga Amp debug log kosong.\n'], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `atiga-amp-debug-${new Date().toISOString().slice(0, 10)}.log`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  return link.download;
}

export async function clearDebugLog() {
  entries = [];
  persistEntries();
  if (nativeLogging) {
    await nativeWriteQueue;
    await invoke('clear_debug_log');
  }
}

export function initDebugLogging({ desktop = isTauri() } = {}) {
  if (initialized) return;
  initialized = true;
  nativeLogging = Boolean(desktop);
  if (typeof window !== 'undefined') {
    window.addEventListener('error', event => {
      captureError('window.error', event.error || new Error(event.message || 'Unknown window error'), {
        source: event.filename,
        line: event.lineno,
        column: event.colno
      });
    });
    window.addEventListener('unhandledrejection', event => {
      captureError('window.unhandledrejection', event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
    });
  }
  log('info', 'runtime.started', {
    desktop: nativeLogging,
    verbose,
    userAgent: typeof navigator === 'undefined' ? undefined : navigator.userAgent,
    platform: typeof navigator === 'undefined' ? undefined : navigator.platform,
    url: typeof location === 'undefined' ? undefined : location.pathname
  });
}
