import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const markup = await readFile(path.join(root, 'src/react/playerMarkup.ts'), 'utf8');
const index = await readFile(path.join(root, 'index.html'), 'utf8');
const manifest = await readFile(path.join(root, 'public/manifest.webmanifest'), 'utf8');
const appSource = await readFile(path.join(root, 'src/app.js'), 'utf8');
const desktopSource = await readFile(path.join(root, 'src/desktop.js'), 'utf8');
const nativeSource = await readFile(path.join(root, 'src-tauri/src/lib.rs'), 'utf8');

test('primary UI contract keeps onboarding, compact controls, and backup entry points', () => {
  for (const id of ['welcome-dialog', 'welcome-import', 'welcome-demo', 'compact-previous', 'compact-play', 'compact-next', 'library-import']) {
    assert.match(markup, new RegExp(`id="${id}"`));
  }
  assert.match(markup, /id="dbx-badge"[^>]*>\s*<span>dbx<\/span>/s);
  assert.doesNotMatch(markup, /role="button"/);
});

test('offline app contract includes a manifest and service worker registration', () => {
  assert.match(index, /rel="manifest" href="\/manifest\.webmanifest"/);
  assert.match(manifest, /"display": "standalone"/);
  assert.match(manifest, /"start_url": "\/"/);
});

test('critical CSS is owned by the module entry and startup needs no remote fonts', () => {
  assert.doesNotMatch(index, /rel="stylesheet" href="\/src\/style\.css"/);
  assert.doesNotMatch(index, /fonts\.(googleapis|gstatic)\.com/);
});

test('Linux playback avoids the fragile Web Audio path and starts from zero', () => {
  assert.match(appSource, /const nativeDirectPlayback = desktop && \/linux\/i/);
  assert.match(appSource, /directAudio = nativeDirectPlayback/);
  assert.match(appSource, /readyTrackId = null/);
  assert.match(appSource, /audio\.currentTime = 0/);
  assert.match(appSource, /audio\.addEventListener\('canplay', resetStart\)/);
  assert.match(appSource, /readyTrackId === state\.currentId/);
  assert.match(appSource, /selectTrack\(state\.currentId, false, 0\)/);
  assert.match(appSource, /const blob = await nativeAudioBlob\(track\.nativePath\)/);
});

test('Play selects the first track on a fresh install', () => {
  assert.match(appSource, /const track = current\(\) \|\| baseTracks\(state\)\[0\] \|\| state\.tracks\[0\]/);
  assert.match(appSource, /return selectTrack\(track\?\.id, true, pendingStartupPosition\)/);
});

test('native window close is not intercepted by the WebView', () => {
  assert.doesNotMatch(desktopSource, /onCloseRequested/);
});

test('native file drops authorize paths before scanning', () => {
  assert.match(nativeSource, /WindowEvent::DragDrop\(DragDropEvent::Drop/);
  assert.match(nativeSource, /asset_protocol_scope\(\)/);
  assert.match(nativeSource, /scope\.allow_file\(path\)/);
});
