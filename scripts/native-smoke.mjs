// Linux integration test against the real Tauri binary and WebKitGTK.
// Requires WebKitWebDriver and Xvfb, never uses the user's application data.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { copyFile, mkdtemp, mkdir, writeFile, readdir, readFile, rename } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { demoBlob, demoTracks } from '../src/library.js';
const binaryArgument = process.argv[2] || 'src-tauri/target/release/atiga-amp';
const packageVersion = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')).version;
let binary;
async function generateMp3(target) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.env.GST_LAUNCH || 'gst-launch-1.0', [
      '-q', 'audiotestsrc', 'wave=sine', 'freq=440', 'num-buffers=1200', 'samplesperbuffer=441',
      '!', 'audio/x-raw,rate=44100,channels=2', '!', 'audioconvert', '!',
      'lamemp3enc', 'target=quality', 'quality=2', '!', 'xingmux', '!', 'id3v2mux', '!',
      'filesink', `location=${target}`
    ], { stdio: ['ignore', 'ignore', 'pipe'] });
    let errorOutput = '';
    child.stderr.on('data', chunk => { errorOutput += chunk; });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`MP3 fixture generation failed (${code}): ${errorOutput}`)));
  });
}
async function extractDebPackage(packagePath, target) {
  await new Promise((resolve, reject) => {
    const child = spawn('dpkg-deb', ['--extract', packagePath, target], { stdio: ['ignore', 'ignore', 'pipe'] });
    let errorOutput = '';
    child.stderr.on('data', chunk => { errorOutput += chunk; });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`DEB extraction failed (${code}): ${errorOutput}`)));
  });
}
const directory = await mkdtemp(path.join(tmpdir(), 'atiga-smoke-'));
const data = path.join(directory, 'data');
const appData = path.join(data, 'com.atiga.amp');
const music = path.join(directory, 'Album 日本');
await mkdir(appData, { recursive: true });
await mkdir(music);
if (binaryArgument === '--appimage') {
  const appImageDirectory = path.resolve('src-tauri/target/release/bundle/appimage');
  const appImage = (await readdir(appImageDirectory)).find(file => file.endsWith('.AppImage') && file.includes(`_${packageVersion}_`));
  assert.ok(appImage, `AppImage tidak ditemukan di ${appImageDirectory}`);
  binary = path.join(appImageDirectory, appImage);
} else if (binaryArgument === '--deb') {
  const debDirectory = path.resolve('src-tauri/target/release/bundle/deb');
  const deb = (await readdir(debDirectory)).find(file => file.endsWith('.deb') && file.includes(`_${packageVersion}_`));
  assert.ok(deb, `Paket DEB tidak ditemukan di ${debDirectory}`);
  const extracted = path.join(directory, 'deb-extract');
  await mkdir(extracted, { recursive: true });
  await extractDebPackage(path.join(debDirectory, deb), extracted);
  binary = path.join(extracted, 'usr', 'bin', 'atiga-amp');
} else {
  binary = path.resolve(binaryArgument);
}
const fixtureFormat = (process.env.NATIVE_SMOKE_FORMAT || 'mp3').toLowerCase();
const fixtureLabel = fixtureFormat.toUpperCase();
if (fixtureFormat === 'wav') {
  await writeFile(path.join(music, 'Atiga - Desktop smoke.wav'), new Uint8Array(await demoBlob(demoTracks[0]).arrayBuffer()));
} else {
  const mp3Fixture = path.join(music, 'Atiga - Desktop smoke.mp3');
  if (process.env.NATIVE_SMOKE_MP3) await copyFile(process.env.NATIVE_SMOKE_MP3, mp3Fixture);
  else await generateMp3(mp3Fixture);
}
await writeFile(path.join(music, 'ignore.txt'), 'Not audio');
// Simulate the folder remembered after the user chose it in the system dialog.
await writeFile(path.join(appData, 'music-folder.json'), JSON.stringify(music));

let display;
let driver;
let session;
let driverLog = '';
const port = Number(process.env.NATIVE_SMOKE_PORT || 4445);
const base = `http://127.0.0.1:${port}`;
const endpoint = suffix => `/session/${session}${suffix}`;
async function request(method, route, body) {
  const response = await fetch(base + route, {
    method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(45000)
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(payload));
  return payload.value;
}
async function until(check, label, timeout = 30000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const value = await check();
    if (value) return value;
    await delay(250);
  }
  throw new Error(`Timed out: ${label}`);
}
const evaluate = script => request('POST', endpoint('/execute/sync'), { script, args: [] });
async function click(selector) {
  const element = await request('POST', endpoint('/element'), { using: 'css selector', value: selector });
  await request('POST', endpoint(`/element/${element['element-6066-11e4-a52e-4f735466cecf']}/click`), {});
}
async function domClick(selector) {
  const encoded = JSON.stringify(selector);
  await evaluate(`const element=document.querySelector(${encoded}); if(!element) throw new Error('Missing element: '+${encoded}); element.click(); return true;`);
}
async function armPlaybackProbe() {
  await evaluate(`
    if (window.__atigaPlayProbeHandler) document.removeEventListener('play', window.__atigaPlayProbeHandler, true);
    window.__atigaPlayTime = null;
    window.__atigaPlayProbeHandler = event => {
      if (event.target?.id === 'audio') window.__atigaPlayTime = event.target.currentTime;
    };
    document.addEventListener('play', window.__atigaPlayProbeHandler, true);
    return true;
  `);
}
async function playbackStartTime(label) {
  await until(() => evaluate('return Number.isFinite(window.__atigaPlayTime)'), `${label} play event`);
  return evaluate('return window.__atigaPlayTime');
}
async function launch() {
  const result = await request('POST', '/session', { capabilities: { alwaysMatch: { 'webkitgtk:browserOptions': { binary } } } });
  session = result.sessionId;
  await until(() => evaluate('return !!document.querySelector("#file-input")?.onchange'), 'runtime initialization');
}
async function ipc(command, args = {}) {
  return request('POST', endpoint('/execute/async'), {
    script: 'const done=arguments[arguments.length-1]; window.__TAURI_INTERNALS__.invoke(arguments[0],arguments[1]).then(value=>done({value}),error=>done({error:String(error)}));',
    args: [command, args]
  });
}

try {
  display = spawn(process.env.XVFB || 'Xvfb', ['-displayfd', '1', '-screen', '0', '1280x900x24', '-nolisten', 'tcp'], { stdio: ['ignore', 'pipe', 'pipe'] });
  let displayNumber = '';
  display.stdout.on('data', chunk => { displayNumber += chunk; });
  display.on('error', error => { driverLog += String(error); });
  await until(() => /^\d+\n/.test(displayNumber), 'virtual display');
  driver = spawn(process.env.WEBKIT_DRIVER || 'WebKitWebDriver', [`--port=${port}`], {
    env: { ...process.env, DISPLAY: `:${displayNumber.trim()}`, XDG_DATA_HOME: data, XDG_CONFIG_HOME: path.join(directory, 'config'), XDG_CACHE_HOME: path.join(directory, 'cache'), TAURI_WEBVIEW_AUTOMATION: 'true', WEBKIT_DISABLE_DMABUF_RENDERER: '1' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  driver.stdout.on('data', chunk => { driverLog += chunk; });
  driver.stderr.on('data', chunk => { driverLog += chunk; });
  driver.on('error', error => { driverLog += String(error); });
  await until(async () => { try { return (await request('GET', '/status')).ready; } catch { return false; } }, 'WebDriver');
  await launch();
  await until(() => evaluate('return document.querySelector("#welcome-dialog")?.open'), 'first launch onboarding');
  await armPlaybackProbe();
  await click('#welcome-demo');
  await until(() => evaluate('return !document.querySelector("#audio").paused'), 'demo playback started');
  assert.ok((await playbackStartTime('demo playback')) < 0.5, 'demo playback must start near zero');
  await until(() => evaluate('return document.querySelector("#audio").currentTime > 0.5'), 'demo playback');
  await evaluate('document.querySelector("#audio").pause(); return true;');
  await click('#welcome-finish');
  await domClick('#mode-collection');
  const rackControlAvailability = await evaluate(`return ${JSON.stringify(['#btn-dsp', '#btn-amp-eq', '#btn-amp-dsp', '#knob-bass', '#knob-treble', '#knob-preamp', '#knob-balance', '#knob-true-bass', '#knob-enhancer', '#knob-reverb', '#amp-mute-switch'])}.every(selector => {
    const element = document.querySelector(selector);
    return element && !element.disabled && !element.classList.contains('disabled');
  })`);
  assert.equal(rackControlAvailability, true, 'rack EQ/DSP controls must be available on Linux');
  assert.equal(await evaluate('return !!window.__TAURI_INTERNALS__'), true);
  assert.equal(await evaluate('return performance.getEntriesByType("resource").some(r=>/^https?:/.test(r.name))'), false);
  console.log('PASS: first launch, offline assets, Play selects demo');

  // These commands and UI handlers exercise the real IPC and filesystem implementation.
  const denied = await ipc('read_audio_file', { path: '/etc/passwd' });
  assert.ok(denied.error, 'arbitrary filesystem read must be rejected');
  const selection = await ipc('rescan_audio_folder');
  assert.equal(selection.value.entries.length, 1);
  await evaluate('document.querySelector("#scan-folder").click(); return true;');
  await until(() => evaluate('return document.querySelector("#tracks").textContent.includes("Desktop smoke")'), 'native import');
  const library = (await ipc('load_audio_library')).value;
  assert.equal(library.tracks.length, 1);
  const track = library.tracks[0];
  assert.equal(track.album, 'Album 日本');
  assert.ok(track.nativePath.startsWith(appData));
  await evaluate('document.querySelector("#scan-folder").click(); return true;');
  await until(() => evaluate('return document.querySelector("#toast").textContent.includes("duplikat")'), 'duplicate rescan');
  assert.equal((await ipc('load_audio_library')).value.tracks.length, 1);
  await rename(music, path.join(directory, 'original-moved'));
  await evaluate('const search=document.querySelector("#search"); search.value="Desktop smoke"; search.dispatchEvent(new Event("input",{bubbles:true})); return true;');
  await evaluate('window.__atigaAudioBeforeImport = document.querySelector("#audio"); return true;');
  await armPlaybackProbe();
  await domClick(`#tracks [data-id="${track.id}"] .track-name`);
  await until(() => evaluate('return !document.querySelector("#audio").paused'), 'imported playback started');
  assert.equal(await evaluate('return window.__atigaAudioBeforeImport !== document.querySelector("#audio")'), true, 'native playback must replace the media element');
  assert.ok((await playbackStartTime(`imported ${fixtureLabel}`)) < 0.5, `${fixtureLabel} playback must start near zero`);
  await evaluate('window.__atigaSmokeStartedAt = performance.now(); return true;');
  await delay(3500);
  const firstProgress = await evaluate('return { elapsed: (performance.now() - window.__atigaSmokeStartedAt) / 1000, media: document.querySelector("#audio").currentTime }');
  assert.ok(firstProgress.media > firstProgress.elapsed - 1 && firstProgress.media < firstProgress.elapsed + 1, `imported ${fixtureLabel} clock jumped: ${JSON.stringify(firstProgress)}`);
  await evaluate('window.__atigaAudioBeforeReselect = document.querySelector("#audio"); return true;');
  await armPlaybackProbe();
  await domClick(`#tracks [data-id="${track.id}"] .track-name`);
  await until(() => evaluate('return !document.querySelector("#audio").paused'), 'reselected MP3 playback started');
  assert.equal(await evaluate('return window.__atigaAudioBeforeReselect !== document.querySelector("#audio")'), true, 'reselecting a native track must replace the media element');
  assert.ok((await playbackStartTime(`reselected ${fixtureLabel}`)) < 0.5, `reselected ${fixtureLabel} must start near zero`);
  await evaluate('window.__atigaSmokeStartedAt = performance.now(); return true;');
  await delay(3500);
  const replayProgress = await evaluate('return { elapsed: (performance.now() - window.__atigaSmokeStartedAt) / 1000, media: document.querySelector("#audio").currentTime }');
  assert.ok(replayProgress.media > replayProgress.elapsed - 1 && replayProgress.media < replayProgress.elapsed + 1, `reselected ${fixtureLabel} clock jumped: ${JSON.stringify(replayProgress)}`);
  await domClick('#stop-btn');
  await until(() => evaluate('return document.querySelector("#audio").paused'), 'stop playback');
  assert.equal(await evaluate('return document.querySelector("#app").classList.contains("is-playing")'), false, 'stop must clear app playback state');
  assert.equal(await evaluate('return document.querySelector("#cassette-door-bay").classList.contains("is-playing")'), false, 'stop must stop cassette reels');
  await domClick(`#tracks [data-id="${track.id}"] [data-action="favorite"]`);
  await evaluate('document.querySelector("#audio").pause(); return true;');
  await until(async () => {
    try { return JSON.parse(await readFile(path.join(appData, 'settings.json'), 'utf8')).favorites.includes(track.id); }
    catch { return false; }
  }, 'settings persisted');
  console.log('PASS: native import, Unicode folder, duplicate detection, playback after moving original, favorites saved');
  await request('DELETE', endpoint(''));
  session = undefined;
  await launch();
  await until(() => evaluate('return document.querySelector("#tracks").textContent.includes("Desktop smoke")'), 'restored library');
  assert.equal(await evaluate('return document.querySelector("#welcome-dialog").open'), false);
  assert.equal(await evaluate('return document.querySelector("#audio").paused'), true);
  assert.equal(await evaluate('return document.querySelector("#audio").currentTime'), 0);
  await armPlaybackProbe();
  await domClick('#play');
  await until(() => evaluate('return !document.querySelector("#audio").paused'), 'restored MP3 playback started');
  assert.ok((await playbackStartTime(`restored ${fixtureLabel}`)) < 0.5, `restored ${fixtureLabel} must start near zero`);
  await evaluate('window.__atigaSmokeStartedAt = performance.now(); return true;');
  await delay(3500);
  const restoredProgress = await evaluate('return { elapsed: (performance.now() - window.__atigaSmokeStartedAt) / 1000, media: document.querySelector("#audio").currentTime }');
  assert.ok(restoredProgress.media > restoredProgress.elapsed - 1 && restoredProgress.media < restoredProgress.elapsed + 1, `restored ${fixtureLabel} clock jumped: ${JSON.stringify(restoredProgress)}`);
  await evaluate('document.querySelector("#audio").pause(); return true;');
  assert.equal(await evaluate(`return document.querySelector('#tracks [data-id="${track.id}"] [data-action="favorite"]').getAttribute('aria-pressed')`), 'true');
  const screenshot = await request('GET', endpoint('/screenshot'));
  await writeFile(path.join(directory, 'desktop.png'), Buffer.from(screenshot, 'base64'));
  const files = await readdir(path.join(appData, 'library'));
  assert.equal(files.length, 1);
  console.log('PASS: restart restores library and favorites without autoplay');
  console.log(`Artifacts: ${directory}`);
} catch (error) {
  if (session) {
    const screenshot = await request('GET', endpoint('/screenshot')).catch(() => null);
    if (screenshot) await writeFile(path.join(directory, 'failure.png'), Buffer.from(screenshot, 'base64'));
    const details = await evaluate('return {html:document.body.innerHTML,toast:document.querySelector("#toast")?.textContent}').catch(() => null);
    await writeFile(path.join(directory, 'failure.json'), JSON.stringify(details));
  }
  throw error;
} finally {
  if (session) await request('DELETE', endpoint('')).catch(() => {});
  driver?.kill();
  display?.kill();
  await writeFile(path.join(directory, 'driver.log'), driverLog);
  console.log(`Driver log: ${path.join(directory, 'driver.log')}`);
}
