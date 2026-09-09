import { esc, formatTime, demoBlob, baseTracks, visibleTracks } from './library.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const paths = {
  play: '<path d="m8 5 11 7-11 7z"/>', pause: '<path d="M7 5h3v14H7zM14 5h3v14h-3z"/>',
  next: '<path d="m5 5 10 7-10 7zM19 5v14"/>', previous: '<path d="m19 5-10 7 10 7zM5 5v14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', close: '<path d="m6 6 12 12M6 18 18 6"/>',
  library: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>',
  heart: '<path d="M20.5 4.6a5.5 5.5 0 0 0-7.8 0L12 5.3l-.7-.7a5.5 5.5 0 0 0-7.8 7.8L12 21l8.5-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  history: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6M12 7v5l3 2"/>',
  music: '<path d="M9 18V5l11-2v13M9 9l11-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="17" cy="16" rx="3" ry="3"/>',
  folder: '<path d="M3 7V5a2 2 0 0 1 2-2h4l3 3h7a2 2 0 0 1 2 2v11H3Z"/>',
  'folder-plus': '<path d="M3 7V5a2 2 0 0 1 2-2h4l3 3h7a2 2 0 0 1 2 2v11H3ZM12 10v6M9 13h6"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6Z"/><path d="m8 12 3 3 5-6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  sort: '<path d="M4 6h12M4 12h8M4 18h4M18 10v10m-3-3 3 3 3-3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  upload: '<path d="M4 15v5h16v-5M12 16V3m-5 5 5-5 5 5"/>',
  sliders: '<path d="M5 3v5m0 4v9M12 3v10m0 4v4M19 3v2m0 4v12M2 8h6v4H2zM9 13h6v4H9zM16 5h6v4h-6z"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  shuffle: '<path d="M3 5h3c5 0 7 14 12 14h3M3 19h3c2 0 4-4 5-7m2-4c2-3 3-3 5-3h3m-3-3 3 3-3 3m0 8 3 3-3 3"/>',
  repeat: '<path d="M4 10V7a2 2 0 0 1 2-2h14m-3-3 3 3-3 3M20 14v3a2 2 0 0 1-2 2H4m3-3-3 3 3 3"/>',
  volume: '<path d="m11 4-6 5H2v6h3l6 5ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/>',
  muted: '<path d="m11 4-6 5H2v6h3l6 5ZM16 9l6 6m0-6-6 6"/>',
  queue: '<path d="M3 5h15M3 10h15M3 15h8M16 14l6 4-6 4z"/>',
  minimize: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 13h7v5h-7z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 8a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 16h.01"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'
};
function icon(name) { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.music}</svg>`; }
$$('[data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon));
let toastTimer;
function toast(message) { $('#toast').textContent = message; $('#toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').hidden = true, 4500); }
function notifyTrack(track) {
  if (!state.notifications || !track || !('Notification' in window) || Notification.permission !== 'granted' || document.visibilityState === 'visible') return;
  new Notification(track.title, { body: `${track.artist} · ${track.album}`, icon: '/icon.svg', tag: 'atiga-now-playing' });
}
function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.classList.toggle('no-glow', !state.glow);
  $$('.theme-skin').forEach(button => {
    const active = button.dataset.theme === state.theme;
    button.classList.toggle('active', active);
    button.setAttribute('aria-checked', String(active));
  });
}
function applyPanelOrder() {
  const app = $('#app'); const panels = { sidebar: $('.sidebar'), library: $('.library'), now: $('.now-panel') };
  state.panelOrder.forEach((name, index) => { if (panels[name]) panels[name].style.gridArea = `slot${index + 1}`; });
  app.style.gridTemplateAreas = `'header header header' 'slot1 slot2 slot3' 'player player player' 'status status status'`;
  app.dataset.panelOrder = state.panelOrder.join('-');
}
function addAdvancedUI() {
  const actions = $('.title-actions');
  const settingsButton = document.createElement('button'); settingsButton.className = 'icon-button'; settingsButton.id = 'settings'; settingsButton.title = 'Pengaturan audio dan tampilan'; settingsButton.ariaLabel = settingsButton.title; settingsButton.textContent = '⚙'; actions.insertBefore(settingsButton, $('#help'));
  const group = document.createElement('select'); group.id = 'group-by'; group.title = 'Kelompokkan koleksi'; group.ariaLabel = 'Kelompokkan koleksi'; group.innerHTML = '<option value="">Semua lagu</option><option value="artist">Artis</option><option value="album">Album</option><option value="genre">Genre</option>'; $('.table-actions').insertBefore(group, $('#sort'));
  const waveform = document.createElement('canvas'); waveform.id = 'waveform'; waveform.setAttribute('aria-label', 'Gelombang audio'); $('.spectrum-box').append(waveform);
  const dialog = document.createElement('dialog'); dialog.id = 'settings-dialog'; dialog.innerHTML = `<form method="dialog" class="dialog-heading"><div><div class="eyebrow">ATIGA AMP / RUANG KENDALI</div><h2>Pengaturan<span>.</span></h2></div><button class="icon-button" aria-label="Tutup">×</button></form><section class="theme-section" aria-labelledby="theme-heading"><div class="settings-section-heading"><span id="theme-heading">Pilih tampilan</span><small>Perubahan langsung diterapkan</small></div><div class="theme-picker" role="radiogroup" aria-label="Pilih tema"><button type="button" class="theme-skin skin-ember" data-theme="ember" role="radio" aria-label="Bara"><span class="skin-preview"><i></i><i></i><i></i></span><strong>Bara</strong><small>Studio hangat</small></button><button type="button" class="theme-skin skin-neon" data-theme="neon" role="radio" aria-label="Neon"><span class="skin-preview"><i></i><i></i><i></i></span><strong>Neon</strong><small>Klub malam</small></button><button type="button" class="theme-skin skin-ocean" data-theme="ocean" role="radio" aria-label="Samudra"><span class="skin-preview"><i></i><i></i><i></i></span><strong>Samudra</strong><small>Biru dalam</small></button><button type="button" class="theme-skin skin-violet" data-theme="violet" role="radio" aria-label="Violet"><span class="skin-preview"><i></i><i></i><i></i></span><strong>Violet</strong><small>Nuansa tengah malam</small></button><button type="button" class="theme-skin skin-mono" data-theme="mono" role="radio" aria-label="Monokrom"><span class="skin-preview"><i></i><i></i><i></i></span><strong>Monokrom</strong><small>Kontras murni</small></button></div></section><div class="settings-grid"><label>Pudar silang <output id="crossfade-value"></output><input id="crossfade" type="range" min="0" max="12" step="1"></label><label>Penguat awal <output id="preamp-value"></output><input id="preamp" type="range" min="-12" max="12" step="1"></label><label>Keseimbangan <output id="balance-value"></output><input id="balance" type="range" min="-1" max="1" step=".01"></label><label>Keluaran<select id="output-device"><option value="default">Keluaran bawaan peramban</option></select></label></div><label class="setting-check"><input id="gapless" type="checkbox"> Tanpa jeda / siapkan lagu berikutnya</label><label class="setting-check"><input id="replay-gain" type="checkbox"> ReplayGain jika tag tersedia</label><label class="setting-check"><input id="glow" type="checkbox"> Efek CRT / cahaya</label><label class="setting-check"><input id="notifications" type="checkbox"> Beri tahu lagu berikutnya</label><div class="settings-actions"><button type="button" class="text-button" id="scan-folder">Pindai ulang folder</button><button type="button" class="text-button" id="request-notifications">Izinkan notifikasi</button><span class="dialog-note">Panel dapat dipindahkan dengan seret dan lepas.</span></div><div class="format-support" id="format-support"></div>`; document.body.append(dialog);
  $('#settings').onclick = () => { syncSettings(); dialog.showModal(); refreshOutputDevices(); };
  group.onchange = event => { const value = event.target.value; state.groupBy = value ? value.split(':')[0] : ''; if (value) state.view = value; else state.view = 'all'; render(); persist(); };
  dialog.querySelectorAll('.theme-skin').forEach(button => { button.onclick = () => { state.theme = button.dataset.theme; applyTheme(); persist(); }; });
  dialog.querySelector('#crossfade').oninput = event => { state.crossfade = Number(event.target.value); syncSettings(); persist(); };
  dialog.querySelector('#preamp').oninput = event => { state.preamp = Number(event.target.value); applyAudioSettings(); syncSettings(); persist(); };
  dialog.querySelector('#balance').oninput = event => { state.balance = Number(event.target.value); applyAudioSettings(); syncSettings(); persist(); };
  dialog.querySelector('#gapless').onchange = event => { state.gapless = event.target.checked; audio.preload = state.gapless ? 'auto' : 'metadata'; persist(); };
  dialog.querySelector('#replay-gain').onchange = event => { state.replayGain = event.target.checked; applyAudioSettings(); persist(); };
  dialog.querySelector('#glow').onchange = event => { state.glow = event.target.checked; applyTheme(); persist(); };
  dialog.querySelector('#notifications').onchange = event => { state.notifications = event.target.checked; persist(); };
  dialog.querySelector('#request-notifications').onclick = async () => { if ('Notification' in window) { const permission = await Notification.requestPermission(); state.notifications = permission === 'granted'; syncSettings(); persist(); } };
  dialog.querySelector('#scan-folder').onclick = chooseFolder;
  [$('.sidebar'), $('.library'), $('.now-panel')].forEach(panel => { panel.draggable = true; panel.dataset.panel = panel.classList.contains('sidebar') ? 'sidebar' : panel.classList.contains('library') ? 'library' : 'now'; panel.addEventListener('dragstart', event => { event.dataTransfer.setData('text/panel', panel.dataset.panel); }); panel.addEventListener('dragover', event => event.preventDefault()); panel.addEventListener('drop', event => { event.preventDefault(); const from = event.dataTransfer.getData('text/panel'); const to = panel.dataset.panel; if (!from || from === to) return; const a = state.panelOrder.indexOf(from), b = state.panelOrder.indexOf(to); [state.panelOrder[a], state.panelOrder[b]] = [state.panelOrder[b], state.panelOrder[a]]; applyPanelOrder(); persist(); }); });
  $('#format-support').innerHTML = ['mp3','wav','ogg','flac','m4a','aac','opus','aiff','webm'].map(ext => `<span>${ext.toUpperCase()} ${audio.canPlayType(`audio/${ext}`) ? '✓' : '?'}</span>`).join('');
}
function syncSettings() { const set = (id, value) => { const el = $(`#${id}`); if (!el) return; if (el.type === 'checkbox') el.checked = value; else el.value = value; }; set('crossfade', state.crossfade); set('preamp', state.preamp); set('balance', state.balance); set('gapless', state.gapless); set('replay-gain', state.replayGain); set('glow', state.glow); set('notifications', state.notifications); set('output-device', state.outputDevice); applyTheme(); $('#crossfade-value').textContent = `${state.crossfade}s`; $('#preamp-value').textContent = `${state.preamp > 0 ? '+' : ''}${state.preamp} dB`; $('#balance-value').textContent = state.balance === 0 ? 'Tengah' : state.balance < 0 ? `${Math.round(-state.balance * 100)}% K` : `${Math.round(state.balance * 100)}% N`; }
function groupOptions(type) { return [...new Set(state.tracks.map(track => String(track[type] || 'Tidak diketahui')))].sort(); }
function renderGrouping() { const select = $('#group-by'); if (!select) return; const labels = { artist: 'Artis', album: 'Album', genre: 'Genre' }; const values = [['', 'Semua lagu'], ...['artist','album','genre'].flatMap(type => groupOptions(type).map(value => [`${type}:${value}`, `${labels[type]} · ${value}`]))]; select.innerHTML = values.map(([value, label]) => `<option value="${esc(value)}">${esc(label)}</option>`).join(''); select.value = state.view.includes(':') ? state.view : ''; }
async function refreshOutputDevices() { const select = $('#output-device'); if (!select || !navigator.mediaDevices?.enumerateDevices) return; const devices = await navigator.mediaDevices.enumerateDevices(); const outputs = devices.filter(device => device.kind === 'audiooutput'); select.innerHTML = '<option value="default">Keluaran bawaan peramban</option>' + outputs.map(device => `<option value="${esc(device.deviceId)}">${esc(device.label || `Keluaran ${device.deviceId.slice(0, 5)}`)}</option>`).join(''); select.value = state.outputDevice; select.onchange = async event => { state.outputDevice = event.target.value; if (typeof audio.setSinkId === 'function') { try { await audio.setSinkId(state.outputDevice); } catch { toast('Perangkat keluaran tidak dapat dipilih oleh peramban.'); } } persist(); }; }
async function filesFromDirectory(handle) { const files = []; async function walk(directory) { for await (const entry of directory.values()) { if (entry.kind === 'file') files.push(await entry.getFile()); else if (entry.kind === 'directory') await walk(entry); } } await walk(handle); return files; }
async function chooseFolder() { if (!('showDirectoryPicker' in window)) { $('#folder-input').click(); return; } try { const handle = await window.showDirectoryPicker({ mode: 'read' }); if (db) await directoryAction('readwrite', store => store.put({ id: 'music-root', handle })); const files = await filesFromDirectory(handle); await importFiles(files); toast(`${files.length} file dipindai dari folder.`); } catch (error) { if (error.name !== 'AbortError') toast('Folder tidak dapat dipindai.'); } }
let saved = {};
try { saved = JSON.parse(localStorage.getItem('atiga-state') || '{}') || {}; } catch { /* Start fresh if browser data is invalid. */ }
const state = {
  tracks: [], favorites: new Set(Array.isArray(saved.favorites) ? saved.favorites : []),
  playlists: Array.isArray(saved.playlists) ? saved.playlists.filter(p => p && typeof p.name === 'string' && Array.isArray(p.ids)) : [],
  recent: Array.isArray(saved.recent) ? saved.recent : [], currentId: saved.currentId || null, queue: Array.isArray(saved.queue) ? saved.queue : [],
  view: 'all', queueView: false, search: '', sortAsc: false, shuffle: Boolean(saved.shuffle), repeat: [0,1,2].includes(saved.repeat) ? saved.repeat : 0,
  volume: Number.isFinite(saved.volume) ? Math.min(1, Math.max(0, saved.volume)) : .7,
  eq: Array.isArray(saved.eq) && saved.eq.length === 10 ? saved.eq.map(n => Number.isFinite(n) ? Math.max(-12,Math.min(12,n)) : 0) : Array(10).fill(0),
  preset: saved.preset || 'Flat',
  theme: saved.theme || 'ember', glow: saved.glow !== false, gapless: saved.gapless !== false,
  crossfade: Number.isFinite(saved.crossfade) ? Math.max(0, Math.min(12, saved.crossfade)) : 0,
  preamp: Number.isFinite(saved.preamp) ? Math.max(-12, Math.min(12, saved.preamp)) : 0,
  balance: Number.isFinite(saved.balance) ? Math.max(-1, Math.min(1, saved.balance)) : 0,
  replayGain: saved.replayGain !== false, notifications: saved.notifications === true,
  outputDevice: saved.outputDevice || 'default',
  groupBy: saved.groupBy || '', panelOrder: Array.isArray(saved.panelOrder) ? saved.panelOrder : ['sidebar','library','now'],
  playCounts: saved.playCounts && typeof saved.playCounts === 'object' ? saved.playCounts : {}
};
const audio = $('#audio');
state.playlists = state.playlists.filter(playlist => !['after-hours', 'slow-living'].includes(playlist.id));
let context, analyser, filters = [], compressor, masterGain, panner, db, loadedId, playbackToken = 0, lastSavedSecond = -1;
let crossfadeTimer, crossfadeStarted = false;
const urls = new Map();
const artUrls = new Map();
const findTrack = id => state.tracks.find(t => t.id === id);
const current = () => findTrack(state.currentId) || state.tracks[0];
function persist() {
  try { localStorage.setItem('atiga-state', JSON.stringify({ ...state, tracks: undefined, favorites: [...state.favorites], position: audio.currentTime, currentId: state.currentId })); }
  catch { toast('Pengaturan belum tersimpan. Periksa ruang penyimpanan browser.'); }
}
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('atiga-library', 2);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains('tracks')) request.result.createObjectStore('tracks', { keyPath: 'id' }); if (!request.result.objectStoreNames.contains('directories')) request.result.createObjectStore('directories', { keyPath: 'id' }); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Penyimpanan sedang digunakan tab lain.'));
  });
}
function directoryAction(mode, action) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('directories', mode); const request = action(transaction.objectStore('directories'));
    transaction.oncomplete = () => resolve(request?.result); transaction.onerror = () => reject(transaction.error); transaction.onabort = () => reject(transaction.error || new Error('Penyimpanan folder dibatalkan.'));
  });
}
function dbAction(mode, action) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('tracks', mode);
    const request = action(transaction.objectStore('tracks'));
    transaction.oncomplete = () => resolve(request?.result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error('Penyimpanan dibatalkan.'));
  });
}
const frequencies = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
function setupAudio() {
  if (context) return;
  context = new AudioContext();
  const source = context.createMediaElementSource(audio);
  filters = frequencies.map((frequency, i) => { const filter = context.createBiquadFilter(); filter.type = 'peaking'; filter.frequency.value = frequency; filter.Q.value = 1.2; filter.gain.value = state.eq[i]; return filter; });
  analyser = context.createAnalyser(); analyser.fftSize = 2048; analyser.smoothingTimeConstant = .8;
  compressor = context.createDynamicsCompressor(); compressor.threshold.value = -3; compressor.knee.value = 3; compressor.ratio.value = 12;
  masterGain = context.createGain(); panner = context.createStereoPanner();
  let previous = source;
  for (const filter of filters) { previous.connect(filter); previous = filter; }
  previous.connect(compressor); compressor.connect(masterGain); masterGain.connect(panner); panner.connect(analyser); analyser.connect(context.destination);
  applyAudioSettings();
}
function applyAudioSettings() {
  if (panner) panner.pan.setTargetAtTime(state.balance, context.currentTime, .03);
  if (masterGain) {
    const replay = state.replayGain ? (current()?.replayGain || 0) : 0;
    masterGain.gain.setTargetAtTime(10 ** ((state.preamp + replay) / 20), context.currentTime, .03);
  }
}
async function sourceURL(track) {
  if (urls.has(track.id)) return urls.get(track.id);
  const blob = track.demo ? demoBlob(track) : track.file;
  if (!blob) throw new Error('File tidak tersedia. Silakan impor ulang.');
  const url = URL.createObjectURL(blob); urls.set(track.id, url); return url;
}
async function artURL(track) {
  if (!track.cover) return '';
  if (!artUrls.has(track.id)) artUrls.set(track.id, URL.createObjectURL(track.cover));
  return artUrls.get(track.id);
}
function applyArt(element, track) {
  if (!element || !track) return;
  const fallback = track.art ?? 0;
  element.dataset.art = fallback;
  if (track.cover) {
    const url = artURL(track);
    Promise.resolve(url).then(value => { if (value) { element.style.backgroundImage = `url("${value}")`; element.classList.add('has-cover'); } });
  } else { element.style.backgroundImage = ''; element.classList.remove('has-cover'); }
}
function row(track, index) {
  const playing = track.id === state.currentId;
  return `<tr class="track-row${playing ? ' current' : ''}" data-id="${esc(track.id)}" data-index="${index}" draggable="true" tabindex="0" aria-label="Putar ${esc(track.title)}"><td>${playing ? '<span class="equal-bars"><i></i><i></i><i></i></span>' : String(index+1).padStart(2,'0')}</td><td><div class="track-cell"><div class="mini-art" data-art="${track.art}" data-cover="${track.cover ? 'true' : 'false'}"><span>AA</span></div><div class="track-info"><span class="track-name">${esc(track.title)}</span><span class="track-artist">${esc(track.artist)}${track.genre ? ` · ${esc(track.genre)}` : ''}${track.demo ? ' · Demo' : ''}</span></div></div></td><td class="track-album">${esc(track.album)}</td><td class="track-format"><span class="format-tag">${esc(track.format)}</span></td><td class="track-duration">${formatTime(track.duration)}</td><td><div class="row-actions"><button class="icon-button favorite${state.favorites.has(track.id) ? ' active' : ''}" data-action="favorite" aria-label="${state.favorites.has(track.id) ? 'Hapus favorit' : 'Favoritkan'} ${esc(track.title)}" aria-pressed="${state.favorites.has(track.id)}">${icon('heart')}</button><button class="icon-button" data-action="more" aria-label="Opsi ${esc(track.title)}">${icon('more')}</button></div></td></tr>`;
}
function renderTracks() {
  const tracks = visibleTracks(state);
  $('#tracks').innerHTML = tracks.map(row).join(''); $('#empty').hidden = tracks.length > 0;
  $('#track-count').textContent = baseTracks(state).length; $('#queue-count').textContent = state.queue.length;
  $('#track-tab').classList.toggle('active', !state.queueView); $('#queue-tab').classList.toggle('active', state.queueView);
  $('#library-total').textContent = `${tracks.length} lagu · ${Math.ceil(tracks.reduce((total,t) => total + (t.duration || 0),0)/60)} menit${tracks.length && tracks.every(t => t.demo) ? ' · Audio demo' : ''}`;
  tracks.forEach(track => $(`#tracks [data-id="${CSS.escape(track.id)}"] .mini-art`) && applyArt($(`#tracks [data-id="${CSS.escape(track.id)}"] .mini-art`), track));
}
function renderNav() {
  const smart = `<button class="nav-item${state.view === 'smart:frequent' ? ' active' : ''}" data-view="smart:frequent"><span class="playlist-icon">${icon('history')}</span><span class="playlist-name">Sering diputar</span></button><button class="nav-item${state.view === 'smart:unplayed' ? ' active' : ''}" data-view="smart:unplayed"><span class="playlist-icon">${icon('music')}</span><span class="playlist-name">Belum diputar</span></button>`;
  $('#playlist-nav').innerHTML = state.playlists.map(p => `<button class="nav-item${state.view === p.id ? ' active' : ''}" data-view="${esc(p.id)}"><span class="playlist-icon">${icon('music')}</span><span class="playlist-name">${esc(p.name)}</span><span class="nav-count">${p.ids.length}</span></button>`).join('') + smart;
  $$('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === state.view));
  $('#all-count').textContent = state.tracks.length; $('#favorite-count').textContent = state.tracks.filter(t => state.favorites.has(t.id)).length;
  const grouped = state.view.match(/^(artist|album|genre):(.*)$/);
  const title = ({ all: 'Semua musik', favorites: 'Favorit', recent: 'Terakhir diputar', 'smart:frequent': 'Sering diputar', 'smart:unplayed': 'Belum diputar' })[state.view] || (grouped ? `${grouped[1][0].toUpperCase() + grouped[1].slice(1)} · ${grouped[2]}` : state.playlists.find(p => p.id === state.view)?.name || 'Semua musik');
  $('#view-title').innerHTML = `${esc(title)}<span>.</span>`;
  $('#collection-summary').textContent = state.view === 'all' ? 'Koleksi pribadi, dengan sentuhan klasik.' : `${baseTracks(state).length} lagu untuk menemani harimu.`;
}
function nextTrack() {
  if (state.queue.length) return findTrack(state.queue[0]);
  const list = baseTracks(state); const index = list.findIndex(t => t.id === state.currentId);
  return list[(index + 1) % list.length];
}
function renderCurrent() {
  const track = current();
  if (!track) {
    $('#now-title').textContent = $('#player-title').textContent = 'Belum ada lagu';
    $('#now-artist').textContent = $('#player-artist').textContent = 'Tambahkan musik untuk mulai mendengarkan';
    $('#now-quality').textContent = 'BELUM ADA AUDIO';
    $('#now-art .art-title').innerHTML = 'BELUM ADA LAGU<span>Tambahkan musik</span>';
    $('#duration').textContent = '00:00';
    $('#next-track').innerHTML = '<p class="dialog-note">Tambahkan lagu untuk mengisi antrean.</p>';
    return;
  }
  $('#now-title').textContent = $('#player-title').textContent = track.title;
  $('#now-artist').textContent = track.artist;
  $('#player-artist').textContent = `${track.artist}${track.demo ? ' · Demo' : ''}`;
  $('#now-format').textContent = track.format; $('#now-quality').textContent = track.demo ? 'AUDIO DEMO' : 'FILE LOKAL';
  $('#now-art').dataset.art = $('#player-art').dataset.art = track.art;
  applyArt($('#now-art'), track); applyArt($('#player-art'), track);
  $('#now-art .art-title').innerHTML = `${esc(track.title)}<span>${esc(track.artist)}</span>`;
  $$('#now-favorite, #player-favorite').forEach(el => { el.classList.toggle('active',state.favorites.has(track.id)); el.setAttribute('aria-pressed', state.favorites.has(track.id)); el.setAttribute('aria-label', state.favorites.has(track.id) ? 'Hapus dari favorit' : 'Tambahkan ke favorit'); });
  $('#duration').textContent = formatTime(track.duration);
  const upcoming = nextTrack();
  $('#next-track').innerHTML = upcoming ? `<div class="mini-art" data-art="${upcoming.art}"><span>AA</span></div><div><strong>${esc(upcoming.title)}</strong><p>${esc(upcoming.artist)}</p></div><span>${formatTime(upcoming.duration)}</span>` : '<p class="dialog-note">Belum ada lagu berikutnya.</p>';
  if (upcoming) applyArt($('#next-track .mini-art'), upcoming);
  if ('mediaSession' in navigator && 'MediaMetadata' in window) navigator.mediaSession.metadata = new MediaMetadata({ title: track.title, artist: track.artist, album: track.album });
}
function renderModes() {
  $('#shuffle').classList.toggle('active',state.shuffle); $('#shuffle').setAttribute('aria-pressed',state.shuffle);
  $('#repeat').classList.toggle('active',state.repeat > 0); $('#repeat').setAttribute('aria-label',`Ulangi: ${['mati','semua','satu lagu'][state.repeat]}`); $('#repeat').title = $('#repeat').getAttribute('aria-label');
  $('#repeat').innerHTML = icon('repeat') + (state.repeat === 2 ? '<small>1</small>' : '');
  $('#volume').value = state.volume; audio.volume = state.volume; $('#volume').style.setProperty('--fill',`${state.volume * 100}%`);
  $('#mute').innerHTML = icon(audio.muted || !state.volume ? 'muted' : 'volume');
}
function translateMenuLabels() {
  const replacements = {
    'TAMBAHKAN KE PLAYLIST': 'TAMBAHKAN KE DAFTAR PUTAR',
    'Playlist dibuat. Gunakan menu ⋯ pada lagu untuk menambahkannya.': 'Daftar putar dibuat. Gunakan menu ⋯ pada lagu untuk menambahkannya.'
  };
  $$('*').forEach(element => {
    if (element.children.length === 0 && replacements[element.textContent]) element.textContent = replacements[element.textContent];
  });
}
function render() { renderNav(); renderGrouping(); renderTracks(); renderCurrent(); renderModes(); translateMenuLabels(); }
async function selectTrack(id, autoplay = true, position = 0) {
  const track = findTrack(id); if (!track) return;
  const token = ++playbackToken; audio.pause(); clearTimeout(crossfadeTimer); crossfadeStarted = false; state.currentId = id; loadedId = id;
  state.playCounts[id] = (state.playCounts[id] || 0) + (autoplay ? 1 : 0);
  try {
    const url = await sourceURL(track);
    if (token !== playbackToken) return;
    audio.src = url; audio.preload = state.gapless ? 'auto' : 'metadata';
    audio.currentTime = Math.max(0, Math.min(position, track.duration || 0));
    renderCurrent(); renderTracks(); updateProgress();
    if (autoplay) { setupAudio(); applyAudioSettings(); await context.resume(); if (token !== playbackToken) return; await audio.play(); }
  } catch (error) { if (token === playbackToken && error.name !== 'AbortError') toast('Audio belum dapat diputar. Coba file MP3, WAV, atau OGG yang valid.'); }
}
function maybeCrossfade() {
  if (!state.crossfade || crossfadeStarted || !loadedId || !Number.isFinite(audio.duration) || audio.duration - audio.currentTime > state.crossfade) return;
  const upcoming = nextTrack(); if (!upcoming || state.repeat === 2) return;
  crossfadeStarted = true;
  const start = context?.currentTime || 0;
  if (masterGain) masterGain.gain.setTargetAtTime(.001, start, Math.max(.05, state.crossfade / 3));
  clearTimeout(crossfadeTimer);
  crossfadeTimer = setTimeout(() => { advance(1, true); setTimeout(() => { if (masterGain) { masterGain.gain.cancelScheduledValues(context.currentTime); applyAudioSettings(); } }, 80); }, Math.max(50, state.crossfade * 700));
}
async function togglePlay() {
  if (!loadedId) return selectTrack(state.currentId);
  if (!audio.paused) { audio.pause(); return; }
  try { setupAudio(); await context.resume(); await audio.play(); }
  catch { toast('Audio belum dapat diputar. Coba pilih lagu atau impor file lain.'); }
}
function advance(direction = 1, automatic = false) {
  if (automatic && state.repeat === 2) { audio.currentTime = 0; togglePlay(); return; }
  if (direction === -1 && audio.currentTime > 3) { audio.currentTime = 0; return; }
  if (direction === 1 && state.queue.length) { const id = state.queue.shift(); persist(); selectTrack(id); return; }
  let list = baseTracks(state); if (!list.length) list = state.tracks;
  if (!list.length) return;
  let index = list.findIndex(t => t.id === state.currentId);
  if (state.shuffle && list.length > 1) { const alternatives = list.filter(t => t.id !== state.currentId); selectTrack(alternatives[Math.floor(Math.random() * alternatives.length)].id); return; }
  if (automatic && index === list.length - 1 && state.repeat === 0) { audio.pause(); return; }
  index = (index + direction + list.length) % list.length; selectTrack(list[index].id);
}
function favorite(id) { state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id); persist(); render(); }
function updateProgress() {
  const duration = Number.isFinite(audio.duration) ? audio.duration : current()?.duration || 0;
  $('#elapsed').textContent = formatTime(audio.currentTime); $('#duration').textContent = formatTime(duration);
  const percent = duration ? audio.currentTime / duration * 100 : 0; $('#seek').value = percent; $('#seek').style.setProperty('--fill',`${percent}%`);
}
audio.addEventListener('timeupdate', () => { updateProgress(); maybeCrossfade(); const second = Math.floor(audio.currentTime); if (second % 5 === 0 && second !== lastSavedSecond) { lastSavedSecond = second; persist(); } });
audio.addEventListener('loadedmetadata', () => { if (Number.isFinite(audio.duration)) current().duration = audio.duration; updateProgress(); renderTracks(); });
audio.addEventListener('play', () => {
  $('#app').classList.add('is-playing'); $('#play').innerHTML = icon('pause'); $('#play').setAttribute('aria-label','Jeda'); $('#spectrum-status').textContent = 'LIVE';
  state.recent = [state.currentId, ...state.recent.filter(id => id !== state.currentId)].slice(0,100); persist();
  notifyTrack(current());
  if (state.view === 'recent') renderTracks(); if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
});
audio.addEventListener('pause', () => { $('#app').classList.remove('is-playing'); $('#play').innerHTML = icon('play'); $('#play').setAttribute('aria-label','Putar'); $('#spectrum-status').textContent = 'STANDBY'; persist(); if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused'; });
audio.addEventListener('ended', () => advance(1,true));
audio.addEventListener('error', () => { if (audio.src) toast('Format audio tidak didukung atau file rusak. Silakan coba file lain.'); });
$('#play').onclick = togglePlay; $('#previous').onclick = () => advance(-1); $('#next').onclick = () => advance();
$('#play-session').textContent = 'Tambah musik';
$('#play-session').onclick = () => $('#file-input').click();
$('#seek').oninput = event => { if (loadedId && Number.isFinite(audio.duration)) { audio.currentTime = Number(event.target.value) / 100 * audio.duration; updateProgress(); } };
$('#volume').oninput = event => { state.volume = Number(event.target.value); audio.muted = false; renderModes(); persist(); };
$('#mute').onclick = () => { audio.muted = !audio.muted; $('#mute').setAttribute('aria-label',audio.muted ? 'Aktifkan suara' : 'Bisukan'); renderModes(); };
$('#shuffle').onclick = () => { state.shuffle = !state.shuffle; renderModes(); persist(); toast(state.shuffle ? 'Pemutaran acak aktif.' : 'Pemutaran acak dimatikan.'); };
$('#repeat').onclick = () => { state.repeat = (state.repeat + 1) % 3; renderModes(); persist(); toast(`Ulangi: ${['mati','semua lagu','satu lagu'][state.repeat]}.`); };
$$('#now-favorite, #player-favorite').forEach(el => el.onclick = () => favorite(state.currentId));
$('.sidebar').addEventListener('click', event => { const button = event.target.closest('[data-view]'); if (!button) return; state.view = button.dataset.view; state.queueView = false; state.search = ''; $('#search').value = ''; render(); });
$('#search').oninput = event => { state.search = event.target.value.toLowerCase().trim(); renderTracks(); };
$('#sort').onclick = () => { if (state.queueView) { toast('Tarik lagu untuk mengurutkan antrean.'); return; } state.sortAsc = !state.sortAsc; $('#sort').classList.toggle('active',state.sortAsc); renderTracks(); };
function showQueue() { state.queueView = true; renderTracks(); if ($('#app').classList.contains('compact')) $('#app').classList.remove('compact'); $('.library-toolbar').scrollIntoView({block:'nearest'}); }
$$('#queue-tab, #show-queue, #player-queue').forEach(el => el.onclick = showQueue);
$('#track-tab').onclick = () => { state.queueView = false; renderTracks(); };
$('#tracks').addEventListener('click', event => { const tr = event.target.closest('[data-id]'); if (!tr) return; const action = event.target.closest('[data-action]')?.dataset.action; if (action === 'favorite') favorite(tr.dataset.id); else if (action === 'more') showTrackOptions(tr.dataset.id, Number(tr.dataset.index)); else selectTrack(tr.dataset.id); });
$('#tracks').addEventListener('keydown', event => { if (event.target.matches('tr') && event.key === 'Enter') { event.preventDefault(); selectTrack(event.target.dataset.id); } });
function showTrackOptions(id, index) {
  const track = findTrack(id); $('#track-dialog-title').textContent = track.title;
  const target = $('#track-options'); target.replaceChildren();
  const addOption = (label, action, danger = false) => { const button = document.createElement('button'); button.textContent = label; if (danger) button.dataset.danger = 'true'; button.onclick = async () => { await action(); $('#track-dialog').close(); render(); persist(); }; target.append(button); };
  addOption('Putar berikutnya', () => { state.queue.unshift(id); toast('Ditambahkan sebagai lagu berikutnya.'); });
  addOption('Tambahkan ke antrean', () => { state.queue.push(id); toast('Lagu ditambahkan ke antrean.'); });
  if (state.queueView) addOption('Hapus dari antrean', () => state.queue.splice(index,1));
  const playlist = state.playlists.find(p => p.id === state.view);
  if (playlist && !state.queueView) addOption('Hapus dari playlist ini', () => playlist.ids = playlist.ids.filter(item => item !== id));
  addOption('Hapus lagu dari koleksi', () => removeTrack(id), true);
  const label = document.createElement('span'); label.className = 'option-label'; label.textContent = 'TAMBAHKAN KE PLAYLIST'; target.append(label);
  state.playlists.forEach(p => addOption(p.name, () => { if (!p.ids.includes(id)) { p.ids.push(id); toast(`Ditambahkan ke ${p.name}.`); } else toast('Lagu sudah ada di playlist ini.'); }));
  $('#track-dialog').showModal();
}
async function removeTrack(id) {
  const track = findTrack(id);
  if (!track || !window.confirm(`Hapus “${track.title}” dari koleksi?`)) return;
  if (state.currentId === id) {
    playbackToken++;
    audio.pause(); audio.removeAttribute('src'); audio.load();
    loadedId = null; state.currentId = null;
  }
  const url = urls.get(id); if (url) { URL.revokeObjectURL(url); urls.delete(id); }
  const artUrl = artUrls.get(id); if (artUrl) { URL.revokeObjectURL(artUrl); artUrls.delete(id); }
  state.tracks = state.tracks.filter(item => item.id !== id);
  state.playlists.forEach(playlist => { playlist.ids = playlist.ids.filter(item => item !== id); });
  state.queue = state.queue.filter(item => item !== id);
  state.favorites.delete(id);
  state.recent = state.recent.filter(item => item !== id);
  delete state.playCounts[id];
  if (db && !track.demo) {
    try { await dbAction('readwrite', store => store.delete(id)); }
    catch { toast('Lagu dihapus dari tampilan, tetapi file tersimpan gagal dihapus.'); return; }
  }
  toast(`“${track.title}” dihapus dari koleksi.`);
}
let draggedId, draggedIndex;
$('#tracks').addEventListener('dragstart', event => { const tr = event.target.closest('[data-id]'); if (!tr) return; draggedId = tr.dataset.id; draggedIndex = Number(tr.dataset.index); event.dataTransfer.setData('text/plain', draggedId); event.dataTransfer.effectAllowed = 'move'; tr.classList.add('dragging'); });
$('#tracks').addEventListener('dragend', () => { $$('.dragging').forEach(el => el.classList.remove('dragging')); draggedId = null; });
$('#tracks').addEventListener('dragover', event => { if (draggedId) event.preventDefault(); });
$('#tracks').addEventListener('drop', event => {
  const target = event.target.closest('[data-id]'); if (!draggedId || !target) return; event.preventDefault();
  if (state.search || state.sortAsc) { toast('Kosongkan pencarian dan matikan urutan judul untuk memindahkan lagu.'); return; }
  const playlist = state.playlists.find(p => p.id === state.view);
  const ids = state.queueView ? state.queue : playlist?.ids;
  if (!ids) { toast('Urutan manual tersedia di playlist dan antrean.'); return; }
  const targetIndex = Number(target.dataset.index); const [id] = ids.splice(draggedIndex,1); ids.splice(targetIndex,0,id); render(); persist();
});
$('#new-playlist').onclick = () => { $('#playlist-dialog').showModal(); $('#playlist-name').focus(); };
$('#close-playlist').onclick = () => $('#playlist-dialog').close();
$('#playlist-form').onsubmit = event => { event.preventDefault(); const name = $('#playlist-name').value.trim(); if (!name) return; const playlist = { id: crypto.randomUUID(), name, ids: [] }; state.playlists.push(playlist); state.view = playlist.id; state.queueView = false; state.search = ''; $('#search').value = ''; $('#playlist-name').value = ''; $('#playlist-dialog').close(); persist(); render(); toast('Playlist dibuat. Gunakan menu ⋯ pada lagu untuk menambahkannya.'); };
$('#compact').onclick = () => { const compact = $('#app').classList.toggle('compact'); $('#compact').setAttribute('aria-pressed',compact); $('#compact').title = compact ? 'Kembali ke tampilan penuh' : 'Mode compact'; };
$('#help').onclick = () => $('#help-dialog').showModal();
const presets = { Flat: Array(10).fill(0), Warm: [3,3,2,1,0,-1,-1,-2,-2,-3], 'Bass Boost': [6,5,4,2,0,0,0,0,0,0], Vocal: [-2,-2,-1,1,3,4,3,1,0,-1], Bright: [-2,-1,0,0,1,2,3,4,4,3] };
const presetLabels = { Flat: 'Datar', Warm: 'Hangat', 'Bass Boost': 'Penguat bas', Vocal: 'Vokal', Bright: 'Cerah', Custom: 'Kustom' };
$('#eq-bands').innerHTML = frequencies.map((frequency,i) => `<label class="eq-band"><output id="gain-${i}">${state.eq[i]>0?'+':''}${state.eq[i]}</output><input type="range" min="-12" max="12" step="1" value="${state.eq[i]}" data-band="${i}" aria-label="Gain ${frequency} Hz" /><span>${frequency>=1000 ? frequency/1000+'K' : frequency}</span></label>`).join('');
function syncEQ() { $$('#eq-bands input').forEach((input,i) => { input.value = state.eq[i]; $(`#gain-${i}`).textContent = `${state.eq[i]>0?'+':''}${state.eq[i]}`; if (filters[i]) filters[i].gain.setTargetAtTime(state.eq[i], context.currentTime,.03); }); $('#eq-preset').value = state.preset; $('#preset-label').textContent = presetLabels[state.preset] || state.preset; persist(); }
$('#eq-bands').oninput = event => { const i = Number(event.target.dataset.band); if (!Number.isInteger(i)) return; state.eq[i] = Number(event.target.value); state.preset = 'Custom'; syncEQ(); };
$('#eq-preset').onchange = event => { const preset = event.target.value; if (presets[preset]) state.eq = [...presets[preset]]; state.preset = preset; syncEQ(); };
$('#eq-reset').onclick = () => { state.eq = Array(10).fill(0); state.preset = 'Flat'; syncEQ(); };
$$('#eq-toggle, #player-eq').forEach(el => el.onclick = () => { $('#eq-dialog').showModal(); $('#eq-toggle').setAttribute('aria-expanded','true'); });
$('#eq-dialog').addEventListener('close', () => $('#eq-toggle').setAttribute('aria-expanded','false'));
$('#import').onclick = () => $('#file-input').click(); $('#import-folder').onclick = chooseFolder;
function decodeText(bytes, encoding = 3) {
  try { return new TextDecoder(encoding === 1 ? 'utf-16' : encoding === 2 ? 'utf-16be' : 'utf-8').decode(bytes).replace(/^\uFEFF/, '').replace(/\0+$/, '').trim(); }
  catch { return new TextDecoder().decode(bytes).replace(/\0+$/, '').trim(); }
}
function synchsafe(bytes) { return ((bytes[0] & 0x7f) << 21) | ((bytes[1] & 0x7f) << 14) | ((bytes[2] & 0x7f) << 7) | (bytes[3] & 0x7f); }
async function readEmbeddedMetadata(file) {
  const result = {};
  const buffer = await file.arrayBuffer(); const bytes = new Uint8Array(buffer);
  if (bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) return result;
  const version = bytes[3]; const flags = bytes[5]; const tagSize = synchsafe(bytes.slice(6, 10));
  let offset = 10; const end = Math.min(bytes.length, offset + tagSize);
  if (flags & 0x40) { const ext = version >= 4 ? synchsafe(bytes.slice(offset, offset + 4)) : 4; offset += ext; }
  while (offset + 10 <= end) {
    const id = new TextDecoder().decode(bytes.slice(offset, offset + 4)); if (!/^[A-Z0-9]{4}$/.test(id)) break;
    const size = version >= 4 ? synchsafe(bytes.slice(offset + 4, offset + 8)) : new DataView(buffer).getUint32(offset + 4);
    if (!size || offset + 10 + size > end) break;
    const body = bytes.slice(offset + 10, offset + 10 + size); const encoding = body[0];
    if (['TIT2','TT2'].includes(id)) result.title = decodeText(body.slice(1), encoding);
    if (['TPE1','TP1'].includes(id)) result.artist = decodeText(body.slice(1), encoding);
    if (['TALB','TAL'].includes(id)) result.album = decodeText(body.slice(1), encoding);
    if (['TCON','TCO'].includes(id)) result.genre = decodeText(body.slice(1), encoding).replace(/^\(\d+\)/, '');
    if (id === 'TXXX') { const text = decodeText(body.slice(1), encoding); if (/replaygain_track_gain/i.test(text)) { const match = text.match(/([+-]?\d+(?:\.\d+)?)\s*dB/i); if (match) result.replayGain = Number(match[1]); } }
    if (id === 'APIC' || id === 'PIC') {
      let cursor = id === 'PIC' ? 5 : 1; const mimeStart = cursor; while (cursor < body.length && body[cursor]) cursor++; const mime = id === 'PIC' ? `image/${new TextDecoder().decode(body.slice(mimeStart, mimeStart + 3)).toLowerCase()}` : new TextDecoder().decode(body.slice(mimeStart, cursor)); cursor += 1; cursor += 1; while (cursor < body.length && body[cursor]) cursor++; cursor += encoding === 0 || encoding === 3 ? 1 : 2;
      if (cursor < body.length) result.cover = new Blob([body.slice(cursor)], { type: mime || 'image/jpeg' });
    }
    offset += 10 + size;
  }
  return result;
}
async function readDuration(file) {
  return new Promise(resolve => { const probe = new Audio(), url = URL.createObjectURL(file); let finished = false; const finish = value => { if (finished) return; finished = true; clearTimeout(timer); probe.removeAttribute('src'); probe.load(); URL.revokeObjectURL(url); resolve(value); }; const timer = setTimeout(() => finish(0), 5000); probe.onloadedmetadata = () => finish(Number.isFinite(probe.duration) ? probe.duration : 0); probe.onerror = () => finish(0); probe.src = url; });
}
let importing = false;
async function importFiles(files) {
  if (importing) { toast('Tunggu impor yang sedang berjalan selesai.'); return; }
  const accepted = [...files].filter(f => f.type.startsWith('audio/') || /\.(mp3|wav|ogg|flac|m4a|aac|opus|aiff|webm)$/i.test(f.name));
  if (!accepted.length) { toast('Tidak ada file audio yang ditemukan.'); return; }
  importing = true; let added = 0, duplicates = 0, unsupported = 0, unsaved = 0;
  toast(`Mengimpor ${accepted.length} file musik…`);
  try {
    for (const file of accepted) {
      const fingerprint = `${file.name}:${file.size}:${file.lastModified}`;
      if (state.tracks.some(t => t.fingerprint === fingerprint)) { duplicates++; continue; }
      const duration = await readDuration(file); if (!duration) { unsupported++; continue; }
      const name = file.name.replace(/\.[^.]+$/, ''), parts = name.split(' - '), metadata = await readEmbeddedMetadata(file);
      const track = { id: crypto.randomUUID(), fingerprint, title: metadata.title || (parts.length>1 ? parts.slice(1).join(' - ') : name), artist: metadata.artist || (parts.length>1 ? parts[0] : 'Artis tidak diketahui'), album: metadata.album || file.webkitRelativePath?.split('/').slice(-2,-1)[0] || 'Koleksi lokal', genre: metadata.genre || 'Tidak diketahui', replayGain: metadata.replayGain || 0, cover: metadata.cover, art: added % 6, duration, format: file.name.split('.').pop().toUpperCase(), file };
      if (db) { try { await dbAction('readwrite', store => store.put(track)); } catch { unsaved++; } } else unsaved++;
      state.tracks.push(track); added++;
      const playlist = state.playlists.find(p => p.id === state.view); if (playlist) playlist.ids.push(track.id);
    }
    state.search = ''; $('#search').value = ''; state.queueView = false; if (['favorites','recent'].includes(state.view)) state.view = 'all';
    render(); persist(); toast(`${added} lagu ditambahkan.${duplicates ? ` ${duplicates} duplikat dilewati.` : ''}${unsupported ? ` ${unsupported} file tidak didukung.` : ''}${unsaved ? ` ${unsaved} lagu hanya tersedia selama sesi ini; penyimpanan penuh/tidak tersedia.` : ''}`);
  } finally { importing = false; $('#file-input').value = ''; $('#folder-input').value = ''; }
}
$$('#file-input, #folder-input').forEach(input => input.onchange = event => importFiles(event.target.files));
let dragDepth = 0;
window.addEventListener('dragenter', event => { if (event.dataTransfer.types.includes('Files')) { event.preventDefault(); dragDepth++; $('#drop-overlay').hidden = false; } });
window.addEventListener('dragover', event => { if (event.dataTransfer.types.includes('Files')) event.preventDefault(); });
window.addEventListener('dragleave', () => { if (--dragDepth <= 0) { dragDepth = 0; $('#drop-overlay').hidden = true; } });
window.addEventListener('drop', event => { $('#drop-overlay').hidden = true; dragDepth = 0; if (event.dataTransfer.files.length) { event.preventDefault(); importFiles(event.dataTransfer.files); } });
window.addEventListener('keydown', event => {
  if (event.target.closest('input,select,textarea,button') || $('dialog[open]')) return;
  if (event.code === 'Space') { event.preventDefault(); togglePlay(); }
  if (event.key === '/') { event.preventDefault(); $('#search').focus(); }
  if (event.altKey && event.key === 'ArrowRight') { event.preventDefault(); advance(); }
  if (event.altKey && event.key === 'ArrowLeft') { event.preventDefault(); advance(-1); }
});
if ('mediaSession' in navigator) {
  for (const [name,handler] of Object.entries({ play: () => { if (audio.paused) togglePlay(); }, pause: () => audio.pause(), previoustrack: () => advance(-1), nexttrack: () => advance(), seekto: details => { if (Number.isFinite(audio.duration)) audio.currentTime = Math.min(audio.duration, Math.max(0, details.seekTime)); } })) {
    try { navigator.mediaSession.setActionHandler(name,handler); } catch { /* Some browsers only expose a subset of media actions. */ }
  }
}
const canvas = $('#spectrum'), painter = canvas.getContext('2d');
let lastFrame = 0;
function paintSpectrum(timestamp) {
  requestAnimationFrame(paintSpectrum);
  if (document.hidden || !canvas.clientWidth || timestamp-lastFrame < 45) return;
  lastFrame = timestamp; const width = canvas.clientWidth, height = canvas.clientHeight, dpr = window.devicePixelRatio || 1;
  if (canvas.width !== Math.round(width*dpr) || canvas.height !== Math.round(height*dpr)) { canvas.width = Math.round(width*dpr); canvas.height = Math.round(height*dpr); }
  painter.setTransform(dpr,0,0,dpr,0,0); painter.clearRect(0,0,width,height);
  const bins = new Uint8Array(analyser?.frequencyBinCount || 1024); if (analyser && !audio.paused) analyser.getByteFrequencyData(bins);
  const count = 36, gap = 2, barWidth = (width-(count-1)*gap)/count;
  for (let i=0;i<count;i++) {
    const hz = 35 * Math.pow(16000/35,i/(count-1));
    const bin = Math.min(bins.length-1, Math.floor(hz/(context?.sampleRate || 44100)*(analyser?.fftSize || 2048)));
    const value = audio.paused ? 0 : bins[bin]/255;
    const segments = Math.max(1,Math.round(value * (height/4)));
    for(let segment=0;segment<Math.floor(height/4);segment++) { painter.fillStyle = segment<segments ? (segment>height/6 ? '#efc184' : '#bc945b') : '#a68c5810'; painter.fillRect(i*(barWidth+gap),height-(segment+1)*4,barWidth,2); }
  }
  const waveform = $('#waveform'); const wavePainter = waveform?.getContext('2d');
  if (waveform && wavePainter) {
    const waveWidth = waveform.clientWidth, waveHeight = waveform.clientHeight, waveDpr = window.devicePixelRatio || 1;
    if (waveform.width !== Math.round(waveWidth * waveDpr) || waveform.height !== Math.round(waveHeight * waveDpr)) { waveform.width = Math.round(waveWidth * waveDpr); waveform.height = Math.round(waveHeight * waveDpr); }
    wavePainter.setTransform(waveDpr, 0, 0, waveDpr, 0, 0); wavePainter.clearRect(0, 0, waveWidth, waveHeight); wavePainter.strokeStyle = '#d9a261'; wavePainter.lineWidth = 1; wavePainter.beginPath();
    const samples = new Uint8Array(analyser?.fftSize || 2048); if (analyser && !audio.paused) analyser.getByteTimeDomainData(samples);
    for (let i = 0; i < waveWidth; i++) { const sample = samples[Math.floor(i / waveWidth * samples.length)] || 128; const y = sample / 255 * waveHeight; i ? wavePainter.lineTo(i, y) : wavePainter.moveTo(i, y); } wavePainter.stroke();
  }
}
requestAnimationFrame(paintSpectrum);
window.addEventListener('pagehide', persist);
async function init() {
  addAdvancedUI(); applyTheme(); applyPanelOrder();
  render();
  try { db = await openDB(); const stored = await dbAction('readonly', store => store.getAll()); state.tracks.push(...stored.filter(t => t?.id && t.file instanceof Blob)); const directory = await directoryAction('readonly', store => store.get('music-root')); if (directory?.handle && (await directory.handle.queryPermission({ mode: 'read' })) === 'granted') { const files = await filesFromDirectory(directory.handle); await importFiles(files); } }
  catch { toast('Penyimpanan lokal tidak tersedia. Musik impor hanya tersimpan untuk sesi ini.'); }
  state.playlists.forEach(playlist => { playlist.ids = playlist.ids.filter(findTrack); });
  if (!findTrack(state.currentId)) state.currentId = null;
  state.queue = state.queue.filter(findTrack); state.recent = state.recent.filter(findTrack);
  const position = Number.isFinite(saved.position) ? saved.position : 0;
  render(); $('#eq-preset').value = state.preset; $('#preset-label').textContent = presetLabels[state.preset] || state.preset;
  if (state.currentId) await selectTrack(state.currentId,false,position);
}
init();
