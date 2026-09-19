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
const mainSource = await readFile(path.join(root, 'src/main.tsx'), 'utf8');
const desktopSource = await readFile(path.join(root, 'src/desktop.js'), 'utf8');
const nativeSource = await readFile(path.join(root, 'src-tauri/src/lib.rs'), 'utf8');
const capabilitiesSource = await readFile(path.join(root, 'src/capabilities.js'), 'utf8');
const styleSource = await readFile(path.join(root, 'src/style.css'), 'utf8');

test('primary UI contract keeps onboarding, compact controls, and backup entry points', () => {
  for (const id of ['welcome-dialog', 'welcome-import', 'welcome-demo', 'compact-previous', 'compact-play', 'compact-next', 'library-import']) {
    assert.match(markup, new RegExp(`id="${id}"`));
  }
  assert.match(markup, /id="dbx-badge"[^>]*>\s*<span>dbx<\/span>/s);
  for (const id of ['btn-dsp', 'btn-amp-eq', 'btn-amp-dsp', 'knob-bass', 'knob-treble', 'knob-preamp', 'knob-balance', 'knob-true-bass', 'knob-enhancer', 'knob-reverb', 'amp-mute-switch']) {
    assert.match(markup, new RegExp(`id="${id}"`));
  }
  assert.doesNotMatch(markup, /role="button"/);
  assert.match(mainSource, /initDebugLogging/);
  assert.doesNotMatch(appSource, /toggle-debug-logging|export-debug-log|clear-debug-log|Diagnostik/);
  assert.match(nativeSource, /append_debug_log/);
  assert.match(nativeSource, /read_debug_log/);
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
  assert.match(appSource, /function resetNativePlaybackElement\(\)/);
  assert.match(appSource, /function setPlaybackIndicator\(playing\)/);
  assert.match(appSource, /setPlaybackIndicator\(false\)/);
  assert.match(appSource, /classList\.toggle\('is-playing', playing\)/);
  assert.match(appSource, /let audio = \$\('#audio'\)/);
  assert.match(appSource, /function unbindAudioEvents\(element\)/);
  assert.match(appSource, /const replacement = previous\.cloneNode\(false\)/);
  assert.match(appSource, /previous\.replaceWith\(replacement\)/);
  assert.match(appSource, /audio = replacement/);
  assert.match(appSource, /audio\.removeAttribute\('src'\)/);
  assert.match(appSource, /sourceURL\(track, nativePlaybackMode\(\) && Boolean\(track\.nativePath\)\)/);
  assert.match(appSource, /const requiresSeek = startPosition > 0\.25/);
  assert.match(appSource, /if \(requiresSeek\) \{\s*try \{ audio\.currentTime = startPosition/s);
  assert.match(appSource, /if \(nativePlaybackMode\(\) && state\.currentId\) selectTrack\(state\.currentId, false, 0\)/);
  assert.match(appSource, /if \(automatic && state\.repeat === 2\) \{ selectTrack\(state\.currentId, true, 0\)/);
  assert.match(appSource, /audio\.addEventListener\('canplay', resetStart\)/);
  assert.match(appSource, /if \(requiresSeek\) audio\.addEventListener\('seeked', verifyStart\)/);
  assert.match(appSource, /const watchStartPosition = \(\) =>/);
  assert.match(appSource, /setInterval\(watchStartPosition, 180\)/);
  assert.match(appSource, /readyTrackId === state\.currentId/);
  assert.match(appSource, /selectTrack\(state\.currentId, false, Number\.isFinite\(savedPosition\) \? savedPosition : 0\)/);
  assert.match(appSource, /const blob = await nativeAudioBlob\(track\.nativePath\)/);
  assert.match(appSource, /if \(nativePlaybackMode\(\) \|\| !state\.dspEnabled\) \{\s*audio\.playbackRate = 1/s);
  assert.match(appSource, /nativePlaybackMode\(\) \|\| !state\.crossfade/);
});

test('rack EQ and DSP controls apply state, effect routing, and native opt-in', () => {
  assert.match(appSource, /function syncRackAudioControls\(\)/);
  assert.match(appSource, /function enableWebAudioProcessing\(\)/);
  assert.match(appSource, /state\.eqEnabled = true/);
  assert.match(appSource, /state\.dspEnabled = true/);
  assert.match(appSource, /dspStereoSplitter = context\.createChannelSplitter\(2\)/);
  assert.match(appSource, /dspStereoLCross\.gain\.setTargetAtTime/);
  assert.match(appSource, /btnAmpDsp\.title = 'Aktifkan \/ bypass DSP'/);
  assert.doesNotMatch(appSource, /btnAmpDsp\.disabled = true/);
  assert.doesNotMatch(appSource, /EQ dan DSP tidak tersedia pada mode playback stabil Linux/);
  assert.match(appSource, /function bindAimpVerticalSlider\(track, input\)/);
  assert.match(appSource, /track\.addEventListener\('mousedown', startDragging\)/);
  assert.match(appSource, /track\.addEventListener\('touchstart', startDragging/);
  assert.match(appSource, /window\.addEventListener\('mousemove', onMouseMove\)/);
  assert.match(appSource, /track\.classList\.add\('is-dragging'\)/);
});

test('mode, onboarding, and collection lifecycle contracts are visible', () => {
  for (const id of ['mode-rack', 'mode-collection', 'welcome-resume', 'welcome-finish', 'new-playlist-visible', 'rename-playlist', 'delete-playlist', 'clear-all-tracks', 'import-summary']) {
    assert.match(markup, new RegExp(`id="${id}"`));
  }
  assert.match(markup, /name="welcome-mode"/);
  assert.doesNotMatch(markup, /<dialog id="eq-dialog"/);
  assert.match(markup, /id="dsp-dialog"[\s\S]*Pengaturan Audio/);
  assert.match(appSource, /removeDemoTracks\(\)/);
  assert.match(appSource, /async function clearAllTracks\(\)/);
  assert.match(nativeSource, /clear_audio_library/);
  assert.match(appSource, /resumePlayback: saved\.resumePlayback === true/);
  assert.match(appSource, /legacy-audio-setting/);
  assert.match(appSource, /aimp-slider-speed/);
  assert.match(appSource, /#output-device/);
});

test('playback capability boundary keeps Linux direct playback explicit', () => {
  assert.match(capabilitiesSource, /nativeDirectPlayback/);
  assert.match(capabilitiesSource, /webAudioDsp/);
  assert.match(capabilitiesSource, /webAudioDspOptIn/);
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

test('mute contract ensures reliable audio silencing on Linux and Web Audio', () => {
  assert.match(appSource, /muted:\s*Boolean\(saved\.muted\)/);
  assert.match(appSource, /audio\.volume = state\.muted \? 0 : state\.volume/);
  assert.match(appSource, /const isMuted = Boolean\(state\.muted \|\| !state\.volume\)/);
  assert.match(appSource, /function toggleMute\(\)/);
  assert.match(appSource, /applyAudioSettings\(\)/);
});

test('playlist deck menu toolbar stays on a single line without wrapping', () => {
  assert.match(styleSource, /\.playlist-deck-header\s*\{[^}]*flex-wrap:\s*nowrap/);
  assert.match(styleSource, /\.playlist-deck-tools\s*\{[^}]*flex-wrap:\s*nowrap/);
  assert.doesNotMatch(styleSource, /\.playlist-deck-tools\s*\{[^}]*flex-wrap:\s*wrap/);
});

test('audio fidelity contract avoids GStreamer time-stretching and aggressive compression', () => {
  assert.match(appSource, /audio\.playbackRate = 1;\s*if \('preservesPitch' in audio\) audio\.preservesPitch = false;/);
  assert.match(appSource, /audio\.preservesPitch = \(pitchSemitones === 0 && Math\.abs\(effectiveRate - 1\) > 0\.001\);/);
  assert.match(appSource, /compressor\.threshold\.value = dspOn \? -0\.5 : 0;/);
  assert.match(appSource, /compressor\.ratio\.value = dspOn \? 3 : 1;/);
  assert.match(appSource, /Math\.min\(20000, Math\.floor\(\(context\.sampleRate \|\| 44100\) \* 0\.45\)\)/);
});

