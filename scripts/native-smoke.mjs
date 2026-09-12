// Linux integration test against the real Tauri binary and WebKitGTK.
// Requires WebKitWebDriver and Xvfb, never uses the user's application data.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, readdir, readFile, rename } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { demoBlob, demoTracks } from '../src/library.js';

const binaryArgument = process.argv[2] || 'src-tauri/target/release/atiga-amp';
let binary;
if (binaryArgument === '--appimage') {
  const appImageDirectory = path.resolve('src-tauri/target/release/bundle/appimage');
  const appImage = (await readdir(appImageDirectory)).find(file => file.endsWith('.AppImage'));
  assert.ok(appImage, `AppImage tidak ditemukan di ${appImageDirectory}`);
  binary = path.join(appImageDirectory, appImage);
} else {
  binary = path.resolve(binaryArgument);
}
const directory = await mkdtemp(path.join(tmpdir(), 'atiga-smoke-'));
const data = path.join(directory, 'data');
const appData = path.join(data, 'com.atiga.amp');
const music = path.join(directory, 'Album 日本');
await mkdir(appData, { recursive: true });
await mkdir(music);
await writeFile(path.join(music, 'Atiga - Desktop smoke.wav'), new Uint8Array(await demoBlob(demoTracks[0]).arrayBuffer()));
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
  await click('#welcome-demo');
  await click('#play');
  await until(() => evaluate('return document.querySelector("#audio").currentTime > 0.5'), 'demo playback');
  await click('#play');
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
  await click(`#tracks [data-id="${track.id}"] .track-name`);
  await until(() => evaluate('return document.querySelector("#audio").currentTime > 0.5'), 'imported copy playback');
  await click(`#tracks [data-id="${track.id}"] [data-action="favorite"]`);
  await click('#play');
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
