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
const capabilitiesSource = await readFile(path.join(root, 'src/capabilities.js'), 'utf8');

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
  assert.match(appSource, /playbackCapabilities\(\{ desktop, platform: navigator\.platform \|\| navigator\.userAgent \}\)/);
  assert.match(appSource, /const nativeDirectPlayback = capabilities\.nativeDirectPlayback/);
  assert.match(appSource, /directAudio = nativeDirectPlayback/);
  assert.match(appSource, /readyTrackId = null/);
  assert.match(appSource, /audio\.currentTime = 0/);
  assert.match(appSource, /audio\.addEventListener\('canplay', resetStart\)/);
  assert.match(appSource, /audio\.addEventListener\('seeked', verifyStart\)/);
  assert.match(appSource, /const watchStartPosition = \(\) =>/);
  assert.match(appSource, /setInterval\(watchStartPosition, 180\)/);
  assert.match(appSource, /readyTrackId === state\.currentId/);
  assert.match(appSource, /selectTrack\(state\.currentId, false, Number\.isFinite\(savedPosition\) \? savedPosition : 0\)/);
  assert.match(appSource, /const blob = await nativeAudioBlob\(track\.nativePath\)/);
  assert.match(appSource, /if \(nativeDirectPlayback\) \{\s*audio\.playbackRate = 1/s);
  assert.match(appSource, /nativeDirectPlayback \|\| !state\.crossfade/);
});

test('mode, onboarding, and collection lifecycle contracts are visible', () => {
  for (const id of ['mode-rack', 'mode-collection', 'welcome-resume', 'welcome-finish', 'new-playlist-visible', 'rename-playlist', 'delete-playlist', 'import-summary']) {
    assert.match(markup, new RegExp(`id="${id}"`));
  }
  assert.match(markup, /name="welcome-mode"/);
  assert.doesNotMatch(markup, /<dialog id="eq-dialog"/);
  assert.match(markup, /id="dsp-dialog"[\s\S]*Pengaturan Audio/);
  assert.match(appSource, /removeDemoTracks\(\)/);
  assert.match(appSource, /resumePlayback: saved\.resumePlayback === true/);
  assert.match(appSource, /legacy-audio-setting/);
  assert.match(appSource, /#aimp-slider-speed/);
  assert.match(appSource, /#output-device/);
});

test('playback capability boundary keeps Linux direct playback explicit', () => {
  assert.match(capabilitiesSource, /nativeDirectPlayback/);
  assert.match(capabilitiesSource, /webAudioDsp/);
  assert.match(capabilitiesSource, /outputRouting/);
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
