import { esc, formatTime, demoBlob, demoTracks, baseTracks, visibleTracks, queueIndexAtVisibleIndex } from './library.js';
import { isAudioFile, metadataFromFilename, readEmbeddedMetadata } from './import.js';

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
  const app = $('#app');
  if (!app) return;
  const panels = { sidebar: $('.sidebar'), library: $('.library'), now: $('.now-panel') };
  if (app.classList.contains('full-deck')) {
    app.style.gridTemplateAreas = `'library now' 'player player'`;
    app.style.gridTemplateRows = '1fr 112px';
    app.dataset.panelOrder = 'full-deck';
    return;
  }
  if (app.classList.contains('teac-rack-app')) {
    return;
  }
  state.panelOrder.forEach((name, index) => { if (panels[name]) panels[name].style.gridArea = `slot${index + 1}`; });
  app.style.gridTemplateAreas = `'header header header' 'slot1 slot2 slot3' 'player player player' 'status status status'`;
  app.dataset.panelOrder = state.panelOrder.join('-');
}
function addAdvancedUI() {
  const actions = $('.title-actions');
  if (actions && !$('#settings')) {
    const settingsButton = document.createElement('button');
    settingsButton.className = 'icon-button';
    settingsButton.id = 'settings';
    settingsButton.title = 'Pengaturan audio dan tampilan';
    settingsButton.ariaLabel = settingsButton.title;
    settingsButton.textContent = '⚙';
    const helpBtn = $('#help');
    if (helpBtn && helpBtn.parentElement === actions) {
      actions.insertBefore(settingsButton, helpBtn);
    } else {
      actions.append(settingsButton);
    }
  }

  if (!$('#group-by')) {
    const group = document.createElement('select');
    group.id = 'group-by';
    group.title = 'Kelompokkan koleksi';
    group.ariaLabel = 'Kelompokkan koleksi';
    group.innerHTML = '<option value="">Semua lagu</option><option value="artist">Artis</option><option value="album">Album</option><option value="genre">Genre</option>';
    const tableActions = $('.table-actions');
    const sortBtn = $('#sort');
    if (tableActions) {
      if (sortBtn && sortBtn.parentElement === tableActions) {
        tableActions.insertBefore(group, sortBtn);
      } else {
        tableActions.append(group);
      }
    } else {
      group.style.display = 'none';
      ($('#app') || document.body).append(group);
    }
    group.onchange = event => {
      const value = event.target.value;
      state.groupBy = value ? value.split(':')[0] : '';
      if (value) state.view = value; else state.view = 'all';
      render();
      persist();
    };
  }

  if (!$('#waveform')) {
    const waveform = document.createElement('canvas');
    waveform.id = 'waveform';
    waveform.setAttribute('aria-label', 'Gelombang audio');
    const spectrumBox = $('.spectrum-box');
    if (spectrumBox) {
      spectrumBox.append(waveform);
    } else {
      waveform.style.display = 'none';
      ($('#app') || document.body).append(waveform);
    }
  }

  let dialog = $('#settings-dialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'settings-dialog';
    dialog.innerHTML = `<form method="dialog" class="dialog-heading"><div><div class="eyebrow">ATIGA AMP / RUANG KENDALI</div><h2>Pengaturan<span>.</span></h2></div><button class="icon-button" aria-label="Tutup">×</button></form><section class="theme-section" aria-labelledby="theme-heading"><div class="settings-section-heading"><span id="theme-heading">Pilih tampilan</span><small>Perubahan langsung diterapkan</small></div><div class="theme-picker" role="radiogroup" aria-label="Pilih tema"><button type="button" class="theme-skin skin-ember" data-theme="ember" role="radio" aria-label="Bara"><span class="skin-preview"><i></i><i></i><i></i></span><strong>Bara</strong><small>Studio hangat</small></button><button type="button" class="theme-skin skin-neon" data-theme="neon" role="radio" aria-label="Neon"><span class="skin-preview"><i></i><i></i><i></i></span><strong>Neon</strong><small>Klub malam</small></button><button type="button" class="theme-skin skin-ocean" data-theme="ocean" role="radio" aria-label="Samudra"><span class="skin-preview"><i></i><i></i><i></i></span><strong>Samudra</strong><small>Biru dalam</small></button><button type="button" class="theme-skin skin-violet" data-theme="violet" role="radio" aria-label="Violet"><span class="skin-preview"><i></i><i></i><i></i></span><strong>Violet</strong><small>Nuansa tengah malam</small></button><button type="button" class="theme-skin skin-mono" data-theme="mono" role="radio" aria-label="Monokrom"><span class="skin-preview"><i></i><i></i><i></i></span><strong>Monokrom</strong><small>Kontras murni</small></button></div></section><div class="settings-grid"><label>Pudar silang <output id="crossfade-value"></output><input id="crossfade" type="range" min="0" max="12" step="1"></label><label>Penguat awal <output id="preamp-value"></output><input id="preamp" type="range" min="-12" max="12" step="1"></label><label>Keseimbangan <output id="balance-value"></output><input id="balance" type="range" min="-1" max="1" step=".01"></label><label>Keluaran<select id="output-device"><option value="default">Keluaran bawaan peramban</option></select></label></div><label class="setting-check"><input id="gapless" type="checkbox"> Tanpa jeda / siapkan lagu berikutnya</label><label class="setting-check"><input id="replay-gain" type="checkbox"> ReplayGain jika tag tersedia</label><label class="setting-check"><input id="glow" type="checkbox"> Efek CRT / cahaya</label><label class="setting-check"><input id="notifications" type="checkbox"> Beri tahu lagu berikutnya</label><div class="settings-actions"><button type="button" class="text-button" id="scan-folder">Pindai ulang folder</button><button type="button" class="text-button" id="request-notifications">Izinkan notifikasi</button><span class="dialog-note">Panel dapat dipindahkan dengan seret dan lepas.</span></div><div class="format-support" id="format-support"></div>`;
    document.body.append(dialog);
  }

  const settingsBtn = $('#settings');
  if (settingsBtn) {
    settingsBtn.onclick = () => { syncSettings(); dialog.showModal(); void refreshOutputDevices(); void applyOutputDevice(); void refreshStorageUsage(); };
  }

  dialog.querySelectorAll('.theme-skin').forEach(button => {
    button.onclick = () => { state.theme = button.dataset.theme; applyTheme(); persist(); };
  });
  const crossfadeInput = dialog.querySelector('#crossfade');
  if (crossfadeInput) crossfadeInput.oninput = event => { state.crossfade = Number(event.target.value); syncSettings(); persist(); };
  const preampInput = dialog.querySelector('#preamp');
  if (preampInput) preampInput.oninput = event => { state.preamp = Number(event.target.value); applyAudioSettings(); syncSettings(); persist(); };
  const balanceInput = dialog.querySelector('#balance');
  if (balanceInput) balanceInput.oninput = event => { state.balance = Number(event.target.value); applyAudioSettings(); syncSettings(); persist(); };
  const gaplessInput = dialog.querySelector('#gapless');
  if (gaplessInput) gaplessInput.onchange = event => { state.gapless = event.target.checked; audio.preload = state.gapless ? 'auto' : 'metadata'; persist(); };
  const replayGainInput = dialog.querySelector('#replay-gain');
  if (replayGainInput) replayGainInput.onchange = event => { state.replayGain = event.target.checked; applyAudioSettings(); persist(); };
  const glowInput = dialog.querySelector('#glow');
  if (glowInput) glowInput.onchange = event => { state.glow = event.target.checked; applyTheme(); persist(); };
  const notifInput = dialog.querySelector('#notifications');
  if (notifInput) notifInput.onchange = event => { state.notifications = event.target.checked; persist(); };
  const reqNotif = dialog.querySelector('#request-notifications');
  if (reqNotif) reqNotif.onclick = async () => { if ('Notification' in window) { const permission = await Notification.requestPermission(); state.notifications = permission === 'granted'; syncSettings(); persist(); } };
  const scanBtn = dialog.querySelector('#scan-folder');
  if (scanBtn) scanBtn.onclick = chooseFolder;

  const settingsActions = dialog.querySelector('.settings-actions');
  if (settingsActions && !dialog.querySelector('#export-library')) {
    const makeSettingsButton = (id, label) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'text-button'; button.id = id; button.textContent = label;
      settingsActions.append(button);
      return button;
    };
    makeSettingsButton('export-library', 'Ekspor cadangan');
    makeSettingsButton('import-library-button', 'Impor cadangan');
    const note = settingsActions.querySelector('.dialog-note');
    if (note) note.textContent = 'Cadangan berisi metadata, playlist, dan pengaturan. File audio tetap berada di perangkat.';
  }

  [$('.sidebar'), $('.library'), $('.now-panel')].filter(Boolean).forEach(panel => {
    panel.draggable = true;
    panel.dataset.panel = panel.classList.contains('sidebar') ? 'sidebar' : panel.classList.contains('library') ? 'library' : 'now';
    panel.addEventListener('dragstart', event => { event.dataTransfer.setData('text/panel', panel.dataset.panel); });
    panel.addEventListener('dragover', event => event.preventDefault());
    panel.addEventListener('drop', event => {
      event.preventDefault();
      const from = event.dataTransfer.getData('text/panel');
      const to = panel.dataset.panel;
      if (!from || from === to) return;
      const a = state.panelOrder.indexOf(from), b = state.panelOrder.indexOf(to);
      [state.panelOrder[a], state.panelOrder[b]] = [state.panelOrder[b], state.panelOrder[a]];
      applyPanelOrder();
      persist();
    });
  });

  const formatSupport = $('#format-support');
  if (formatSupport) {
    formatSupport.innerHTML = ['mp3','wav','ogg','flac','m4a','aac','opus','aiff','webm'].map(ext => `<span>${ext.toUpperCase()} ${audio.canPlayType(`audio/${ext}`) ? '✓' : '?'}</span>`).join('');
  }

  const storageUsage = dialog.querySelector('#storage-usage') || document.createElement('div');
  storageUsage.id = 'storage-usage'; storageUsage.className = 'storage-usage';
  if (!storageUsage.parentElement) dialog.append(storageUsage);
  async function refreshStorageUsage() {
    if (!storageUsage) return;
    if (!navigator.storage?.estimate) { storageUsage.textContent = 'Kapasitas storage tidak tersedia di peramban ini.'; return; }
    const estimate = await navigator.storage.estimate();
    const used = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const formatBytes = bytes => bytes > 1024 ** 3 ? `${(bytes / 1024 ** 3).toFixed(1)} GB` : `${Math.round(bytes / 1024 ** 2)} MB`;
    storageUsage.textContent = quota ? `Storage lokal: ${formatBytes(used)} dari sekitar ${formatBytes(quota)} terpakai.` : `Storage lokal: ${formatBytes(used)} terpakai.`;
  }
  async function exportLibrary() {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      tracks: state.tracks.filter(track => !track.demo).map(({ id, fingerprint, title, artist, album, genre, format, duration }) => ({ id, fingerprint, title, artist, album, genre, format, duration })),
      favorites: [...state.favorites], playlists: state.playlists, recent: state.recent, queue: state.queue, positions: state.positions,
      settings: { theme: state.theme, glow: state.glow, gapless: state.gapless, compact: state.compact, shuffle: state.shuffle, repeat: state.repeat, volume: state.volume, eq: state.eq, preset: state.preset, crossfade: state.crossfade, preamp: state.preamp, balance: state.balance, replayGain: state.replayGain, notifications: state.notifications, outputDevice: state.outputDevice }
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const link = document.createElement('a'); const url = URL.createObjectURL(blob); link.href = url; link.download = `atiga-amp-backup-${new Date().toISOString().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 0);
    toast('Cadangan library berhasil diekspor.');
  }
  async function importLibrary(file) {
    try {
      const backup = JSON.parse(await file.text());
      if (backup?.version !== 1 || !Array.isArray(backup.tracks) || !Array.isArray(backup.playlists)) throw new Error('Format cadangan tidak dikenali.');
      const byId = new Map(state.tracks.map(track => [track.id, track]));
      const byFingerprint = new Map(state.tracks.filter(track => track.fingerprint).map(track => [track.fingerprint, track]));
      const backupTracks = new Map(backup.tracks.map(track => [track.id, track]));
      const resolveId = id => byId.get(id)?.id || (backupTracks.get(id)?.fingerprint && byFingerprint.get(backupTracks.get(id).fingerprint)?.id) || null;
      const resolveIds = ids => ids.map(resolveId).filter(Boolean);
      state.favorites = new Set(resolveIds(Array.isArray(backup.favorites) ? backup.favorites : []));
      state.playlists = backup.playlists.filter(playlist => playlist && typeof playlist.name === 'string').map(playlist => ({ id: playlist.id || crypto.randomUUID(), name: playlist.name, ids: resolveIds(Array.isArray(playlist.ids) ? playlist.ids : []) }));
      state.recent = resolveIds(Array.isArray(backup.recent) ? backup.recent : []);
      state.queue = resolveIds(Array.isArray(backup.queue) ? backup.queue : []);
      state.positions = Object.fromEntries(Object.entries(backup.positions || {}).map(([id, value]) => { const resolved = resolveId(id); return resolved ? [resolved, Number(value) || 0] : null; }).filter(Boolean));
      const settings = backup.settings || {};
      if (typeof settings.theme === 'string') state.theme = settings.theme;
      ['glow', 'gapless', 'compact', 'shuffle', 'replayGain', 'notifications'].forEach(key => { if (typeof settings[key] === 'boolean') state[key] = settings[key]; });
      ['volume', 'crossfade', 'preamp', 'balance'].forEach(key => { if (Number.isFinite(settings[key])) state[key] = settings[key]; });
      if ([0, 1, 2].includes(settings.repeat)) state.repeat = settings.repeat;
      if (Array.isArray(settings.eq) && settings.eq.length === 10 && settings.eq.every(value => Number.isFinite(value))) state.eq = settings.eq;
      if (typeof settings.preset === 'string') state.preset = settings.preset;
      if (typeof settings.outputDevice === 'string') state.outputDevice = settings.outputDevice;
      applyTheme(); applyCompactState(); render(); syncSettings(); await applyOutputDevice(); persist();
      const available = backup.tracks.filter(track => byId.has(track.id) || byFingerprint.has(track.fingerprint)).length;
      toast(`Cadangan dipulihkan. ${available} dari ${backup.tracks.length} lagu tersedia.`);
    } catch (error) { toast(`Cadangan gagal diimpor: ${error instanceof Error ? error.message : 'format tidak valid.'}`); }
  }
  dialog.querySelector('#export-library')?.addEventListener('click', () => void exportLibrary());
  dialog.querySelector('#import-library-button')?.addEventListener('click', () => $('#library-import')?.click());
  $('#library-import')?.addEventListener('change', event => { const file = event.target.files?.[0]; if (file) void importLibrary(file); event.target.value = ''; });
}
function syncSettings() {
  const set = (id, value) => { const el = $(`#${id}`); if (!el) return; if (el.type === 'checkbox') el.checked = value; else el.value = value; };
  set('crossfade', state.crossfade); set('preamp', state.preamp); set('balance', state.balance); set('gapless', state.gapless); set('replay-gain', state.replayGain); set('glow', state.glow); set('notifications', state.notifications); set('output-device', state.outputDevice);
  applyTheme();
  const crossfadeVal = $('#crossfade-value');
  if (crossfadeVal) crossfadeVal.textContent = `${state.crossfade}s`;
  const preampVal = $('#preamp-value');
  if (preampVal) preampVal.textContent = `${state.preamp > 0 ? '+' : ''}${state.preamp} dB`;
  const balanceVal = $('#balance-value');
  if (balanceVal) balanceVal.textContent = state.balance === 0 ? 'Tengah' : state.balance < 0 ? `${Math.round(-state.balance * 100)}% K` : `${Math.round(state.balance * 100)}% N`;
  preampKnob?.setVal(state.preamp, false);
  balKnob?.setVal(state.balance, false);
}
function groupOptions(type) { return [...new Set(state.tracks.map(track => String(track[type] || 'Tidak diketahui')))].sort(); }
function renderGrouping() { const select = $('#group-by'); if (!select) return; const labels = { artist: 'Artis', album: 'Album', genre: 'Genre' }; const values = [['', 'Semua lagu'], ...['artist','album','genre'].flatMap(type => groupOptions(type).map(value => [`${type}:${value}`, `${labels[type]} · ${value}`]))]; select.innerHTML = values.map(([value, label]) => `<option value="${esc(value)}">${esc(label)}</option>`).join(''); select.value = state.view.includes(':') ? state.view : ''; }
async function applyOutputDevice(deviceId = state.outputDevice, notify = false) {
  if (typeof audio.setSinkId !== 'function') return false;
  try {
    await audio.setSinkId(deviceId || 'default');
    state.outputDevice = deviceId || 'default';
    return true;
  } catch {
    state.outputDevice = 'default';
    if (notify) toast('Perangkat keluaran tidak dapat dipilih oleh peramban.');
    return false;
  }
}
async function refreshOutputDevices() {
  const select = $('#output-device');
  if (!select || !navigator.mediaDevices?.enumerateDevices) return;
  let devices;
  try {
    devices = await navigator.mediaDevices.enumerateDevices();
  } catch {
    select.innerHTML = '<option value="default">Keluaran bawaan peramban</option>';
    state.outputDevice = 'default';
    select.value = 'default';
    return;
  }
  const outputs = devices.filter(device => device.kind === 'audiooutput');
  select.innerHTML = '<option value="default">Keluaran bawaan peramban</option>' + outputs.map(device => `<option value="${esc(device.deviceId)}">${esc(device.label || `Keluaran ${device.deviceId.slice(0, 5)}`)}</option>`).join('');
  select.value = state.outputDevice;
  if (select.value !== state.outputDevice) state.outputDevice = 'default';
  select.value = state.outputDevice;
  select.onchange = async event => {
    await applyOutputDevice(event.target.value, true);
    select.value = state.outputDevice;
    persist();
  };
}
async function filesFromDirectory(handle) { const files = []; async function walk(directory) { for await (const entry of directory.values()) { if (entry.kind === 'file') files.push(await entry.getFile()); else if (entry.kind === 'directory') await walk(entry); } } await walk(handle); return files; }
async function chooseFolder() { if (!('showDirectoryPicker' in window)) { $('#folder-input').click(); return; } try { const handle = await window.showDirectoryPicker({ mode: 'read' }); if (db) await directoryAction('readwrite', store => store.put({ id: 'music-root', handle })); const files = await filesFromDirectory(handle); await importFiles(files); toast(`${files.length} file dipindai dari folder.`); } catch (error) { if (error.name !== 'AbortError') toast('Folder tidak dapat dipindai.'); } }
let saved = {};
try { saved = JSON.parse(localStorage.getItem('atiga-state') || '{}') || {}; } catch { /* Start fresh if browser data is invalid. */ }
const savedPositions = saved.positions && typeof saved.positions === 'object' ? saved.positions : {};
const state = {
  tracks: [...demoTracks], favorites: new Set(Array.isArray(saved.favorites) ? saved.favorites : []),
  playlists: Array.isArray(saved.playlists) ? saved.playlists.filter(p => p && typeof p.name === 'string' && Array.isArray(p.ids)) : [],
  recent: Array.isArray(saved.recent) ? saved.recent : [], currentId: saved.currentId || null, queue: Array.isArray(saved.queue) ? saved.queue : [], positions: savedPositions,
  view: 'all', queueView: false, search: '', sortAsc: false, shuffle: Boolean(saved.shuffle), repeat: [0,1,2].includes(saved.repeat) ? saved.repeat : 0,
  volume: Number.isFinite(saved.volume) ? Math.min(1, Math.max(0, saved.volume)) : .7,
  eq: Array.isArray(saved.eq) && saved.eq.length === 10 ? saved.eq.map(n => Number.isFinite(n) ? Math.max(-12,Math.min(12,n)) : 0) : Array(10).fill(0),
  preset: saved.preset || 'Flat',
  theme: saved.theme || 'ember', glow: saved.glow !== false, gapless: saved.gapless !== false,
  compact: saved.compact ?? (window.matchMedia?.('(max-width: 640px)').matches ?? false), onboarded: saved.onboarded === true,
  crossfade: Number.isFinite(saved.crossfade) ? Math.max(0, Math.min(12, saved.crossfade)) : 0,
  preamp: Number.isFinite(saved.preamp) ? Math.max(-12, Math.min(12, saved.preamp)) : 0,
  balance: Number.isFinite(saved.balance) ? Math.max(-1, Math.min(1, saved.balance)) : 0,
  replayGain: saved.replayGain !== false, notifications: saved.notifications === true,
  outputDevice: saved.outputDevice || 'default',
  groupBy: saved.groupBy || '', panelOrder: Array.isArray(saved.panelOrder) ? saved.panelOrder : ['sidebar','library','now'],
  playCounts: saved.playCounts && typeof saved.playCounts === 'object' ? saved.playCounts : {},
  ampHidden: Boolean(saved.ampHidden),
  dsp: {
    echo: Number.isFinite(saved.dsp?.echo) ? Math.max(0, Math.min(100, saved.dsp.echo)) : 0,
    reverb: Number.isFinite(saved.dsp?.reverb) ? Math.max(0, Math.min(100, saved.dsp.reverb)) : 0,
    flanger: Number.isFinite(saved.dsp?.flanger) ? Math.max(0, Math.min(100, saved.dsp.flanger)) : 0,
    chorus: Number.isFinite(saved.dsp?.chorus) ? Math.max(0, Math.min(100, saved.dsp.chorus)) : 0,
    bass: Number.isFinite(saved.dsp?.bass) ? Math.max(-12, Math.min(12, saved.dsp.bass)) : 0,
    stereo: Number.isFinite(saved.dsp?.stereo) ? Math.max(0, Math.min(100, saved.dsp.stereo)) : 0,
    speed: Number.isFinite(saved.dsp?.speed) ? Math.max(50, Math.min(150, saved.dsp.speed)) : 100,
    tempo: Number.isFinite(saved.dsp?.tempo) ? Math.max(50, Math.min(150, saved.dsp.tempo)) : 100,
    pitch: Number.isFinite(saved.dsp?.pitch) ? Math.max(-12, Math.min(12, saved.dsp.pitch)) : 0,
    voiceRemover: Boolean(saved.dsp?.voiceRemover),
    fadePause: saved.dsp?.fadePause !== false,
    fadeNav: saved.dsp?.fadeNav !== false
  }
};
const audio = $('#audio');
state.playlists = state.playlists.filter(playlist => !['after-hours', 'slow-living'].includes(playlist.id));
let context, analyser, analyserL, analyserR, filters = [], compressor, masterGain, panner, db, loadedId, playbackToken = 0, lastSavedSecond = -1, directAudio = false;
let dspBassFilter, dspEchoDelay, dspEchoFeedback, dspEchoGain, dspReverbConvolver, dspReverbGain, dspChorusDelay, dspChorusGain, dspChorusLfo, dspVoiceDryGain, dspVoiceWetGain, dspVoiceSplitter, dspVoiceMerger, dspVoiceInvGain, dspSumGain;
let giantVolKnob, deckVolKnob, balKnob, preampKnob, bassKnob, trebleKnob;
let crossfadeTimer, crossfadeStarted = false;
const urls = new Map();
const artUrls = new Map();
let metadataWorker;
let metadataRequestId = 0;
const metadataRequests = new Map();
try {
  metadataWorker = new Worker(new URL('./metadata-worker.js', import.meta.url), { type: 'module' });
  metadataWorker.onmessage = event => {
    const request = metadataRequests.get(event.data?.id);
    if (!request) return;
    metadataRequests.delete(event.data.id);
    if (event.data.error) request.reject(new Error(event.data.error)); else request.resolve(event.data.metadata || {});
  };
  metadataWorker.onerror = () => {
    metadataRequests.forEach(request => request.reject(new Error('Metadata worker tidak tersedia.')));
    metadataRequests.clear();
    metadataWorker?.terminate(); metadataWorker = undefined;
  };
} catch { metadataWorker = undefined; }
function readMetadataOffThread(file) {
  if (!metadataWorker) return readEmbeddedMetadata(file);
  return new Promise((resolve, reject) => {
    const id = ++metadataRequestId;
    metadataRequests.set(id, { resolve, reject });
    metadataWorker.postMessage({ id, file });
  }).catch(() => readEmbeddedMetadata(file));
}
const findTrack = id => state.tracks.find(t => t.id === id);
const current = () => findTrack(state.currentId) || state.tracks[0];
function persist() {
  try {
    if (state.currentId && Number.isFinite(audio.currentTime)) state.positions[state.currentId] = Math.max(0, audio.currentTime);
    localStorage.setItem('atiga-state', JSON.stringify({ ...state, tracks: undefined, favorites: [...state.favorites], position: audio.currentTime, currentId: state.currentId }));
  }
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

function createReverbImpulse(ctx, duration = 1.2, decay = 2.0) {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * duration);
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);
  for (let i = 0; i < length; i++) {
    const n = length - i;
    const env = Math.pow(n / length, decay);
    left[i] = (Math.random() * 2 - 1) * env;
    right[i] = (Math.random() * 2 - 1) * env;
  }
  return impulse;
}

function applyPlaybackRates() {
  if (!audio) return;
  const speed = (state.dsp?.speed || 100) / 100;
  const tempo = (state.dsp?.tempo || 100) / 100;
  const pitchSemitones = state.dsp?.pitch || 0;
  const pitchFactor = 2 ** (pitchSemitones / 12);

  const effectiveRate = Math.max(0.25, Math.min(4.0, speed * tempo * pitchFactor));
  audio.playbackRate = effectiveRate;
  if ('preservesPitch' in audio) {
    audio.preservesPitch = (pitchSemitones === 0);
  }
}

function applyDspSettings() {
  if (context) {
    if (dspBassFilter) dspBassFilter.gain.setTargetAtTime(state.dsp.bass, context.currentTime, 0.03);
    if (dspEchoGain) dspEchoGain.gain.setTargetAtTime((state.dsp.echo / 100) * 0.7, context.currentTime, 0.03);
    if (dspReverbGain) dspReverbGain.gain.setTargetAtTime((state.dsp.reverb / 100) * 0.75, context.currentTime, 0.03);
    if (dspChorusGain) dspChorusGain.gain.setTargetAtTime((state.dsp.chorus / 100) * 0.45 + (state.dsp.flanger / 100) * 0.45, context.currentTime, 0.03);
    if (dspVoiceDryGain && dspVoiceWetGain) {
      const isVoice = Boolean(state.dsp.voiceRemover);
      dspVoiceDryGain.gain.setTargetAtTime(isVoice ? 0 : 1, context.currentTime, 0.03);
      dspVoiceWetGain.gain.setTargetAtTime(isVoice ? 1 : 0, context.currentTime, 0.03);
    }
  }
  applyPlaybackRates();
}

function setupAudio() {
  if (context || directAudio) return;
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) { directAudio = true; return; }
  try {
    context = new AudioContextCtor();
    const source = context.createMediaElementSource(audio);
    filters = frequencies.map((frequency, i) => { const filter = context.createBiquadFilter(); filter.type = 'peaking'; filter.frequency.value = frequency; filter.Q.value = 1.2; filter.gain.value = state.eq[i]; return filter; });
    analyser = context.createAnalyser(); analyser.fftSize = 2048; analyser.smoothingTimeConstant = .8;
    compressor = context.createDynamicsCompressor(); compressor.threshold.value = -3; compressor.knee.value = 3; compressor.ratio.value = 12;
    masterGain = context.createGain(); panner = context.createStereoPanner();

    // DSP Bass filter
    dspBassFilter = context.createBiquadFilter();
    dspBassFilter.type = 'lowshelf';
    dspBassFilter.frequency.value = 120;
    dspBassFilter.gain.value = state.dsp.bass;

    // DSP Echo (delay + feedback)
    dspEchoDelay = context.createDelay(1.0);
    dspEchoDelay.delayTime.value = 0.28;
    dspEchoFeedback = context.createGain();
    dspEchoFeedback.gain.value = 0.35;
    dspEchoGain = context.createGain();
    dspEchoGain.gain.value = (state.dsp.echo / 100) * 0.7;
    dspEchoDelay.connect(dspEchoFeedback);
    dspEchoFeedback.connect(dspEchoDelay);
    dspEchoDelay.connect(dspEchoGain);

    // DSP Reverb
    dspReverbConvolver = context.createConvolver();
    dspReverbConvolver.buffer = createReverbImpulse(context);
    dspReverbGain = context.createGain();
    dspReverbGain.gain.value = (state.dsp.reverb / 100) * 0.75;
    dspReverbConvolver.connect(dspReverbGain);

    // DSP Chorus / Flanger
    dspChorusDelay = context.createDelay(0.05);
    dspChorusDelay.delayTime.value = 0.015;
    dspChorusGain = context.createGain();
    dspChorusGain.gain.value = (state.dsp.chorus / 100) * 0.45 + (state.dsp.flanger / 100) * 0.45;
    try {
      dspChorusLfo = context.createOscillator();
      const lfoGain = context.createGain();
      dspChorusLfo.frequency.value = 1.2;
      lfoGain.gain.value = 0.003;
      dspChorusLfo.connect(lfoGain);
      lfoGain.connect(dspChorusDelay.delayTime);
      dspChorusLfo.start();
    } catch { /* oscillator fallback */ }
    dspChorusDelay.connect(dspChorusGain);

    // DSP Voice Remover (Dry / Wet with inverted R)
    dspVoiceDryGain = context.createGain();
    dspVoiceDryGain.gain.value = state.dsp.voiceRemover ? 0 : 1;
    dspVoiceWetGain = context.createGain();
    dspVoiceWetGain.gain.value = state.dsp.voiceRemover ? 1 : 0;

    dspVoiceSplitter = context.createChannelSplitter(2);
    dspVoiceMerger = context.createChannelMerger(2);
    dspVoiceInvGain = context.createGain();
    dspVoiceInvGain.gain.value = -1;

    dspSumGain = context.createGain();

    // Route: source -> EQ filters -> dspBassFilter -> compressor
    let previous = source;
    for (const filter of filters) { previous.connect(filter); previous = filter; }
    previous.connect(dspBassFilter);
    dspBassFilter.connect(compressor);

    // Dry voice path
    compressor.connect(dspVoiceDryGain);
    dspVoiceDryGain.connect(dspSumGain);

    // Voice Remover path
    compressor.connect(dspVoiceSplitter);
    dspVoiceSplitter.connect(dspVoiceMerger, 0, 0);
    dspVoiceSplitter.connect(dspVoiceMerger, 0, 1);
    dspVoiceSplitter.connect(dspVoiceInvGain, 1);
    dspVoiceInvGain.connect(dspVoiceMerger, 0, 0);
    dspVoiceInvGain.connect(dspVoiceMerger, 0, 1);
    dspVoiceMerger.connect(dspVoiceWetGain);
    dspVoiceWetGain.connect(dspSumGain);

    // Parallel effects
    compressor.connect(dspEchoDelay);
    dspEchoGain.connect(dspSumGain);

    compressor.connect(dspReverbConvolver);
    dspReverbGain.connect(dspSumGain);

    compressor.connect(dspChorusDelay);
    dspChorusGain.connect(dspSumGain);

    dspSumGain.connect(masterGain);
    masterGain.connect(panner);
    panner.connect(analyser);
    analyser.connect(context.destination);

    // True stereo VU: tap panner output via a ChannelSplitter into separate L/R analysers
    try {
      analyserL = context.createAnalyser(); analyserL.fftSize = 2048; analyserL.smoothingTimeConstant = .75;
      analyserR = context.createAnalyser(); analyserR.fftSize = 2048; analyserR.smoothingTimeConstant = .75;
      const splitter = context.createChannelSplitter(2);
      panner.connect(splitter);
      splitter.connect(analyserL, 0); // Left channel → analyserL
      splitter.connect(analyserR, 1); // Right channel → analyserR
    } catch { analyserL = null; analyserR = null; }

    applyAudioSettings();
  } catch (error) {
    console.warn('Web Audio tidak tersedia; memakai pemutaran audio langsung.', error);
    context = null; filters = []; analyser = null; analyserL = null; analyserR = null; compressor = null; masterGain = null; panner = null; directAudio = true;
    dspBassFilter = null; dspEchoDelay = null; dspEchoGain = null; dspReverbConvolver = null; dspReverbGain = null; dspChorusDelay = null; dspChorusGain = null; dspChorusLfo = null; dspVoiceDryGain = null; dspVoiceWetGain = null; dspSumGain = null;
  }
}
function applyAudioSettings() {
  if (panner) panner.pan.setTargetAtTime(state.balance, context.currentTime, .03);
  if (masterGain) {
    const replay = state.replayGain ? (current()?.replayGain || 0) : 0;
    masterGain.gain.setTargetAtTime(10 ** ((state.preamp + replay) / 20), context.currentTime, .03);
  }
  applyDspSettings();
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
  const nav = $('#playlist-nav');
  if (nav) {
    nav.innerHTML = state.playlists.map(p => `<button class="nav-item${state.view === p.id ? ' active' : ''}" data-view="${esc(p.id)}"><span class="playlist-icon">${icon('music')}</span><span class="playlist-name">${esc(p.name)}</span><span class="nav-count">${p.ids.length}</span></button>`).join('') + smart;
  }
  $$('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === state.view));
  const allCount = $('#all-count'); if (allCount) allCount.textContent = state.tracks.length;
  const favCount = $('#favorite-count'); if (favCount) favCount.textContent = state.tracks.filter(t => state.favorites.has(t.id)).length;
  const grouped = state.view.match(/^(artist|album|genre):(.*)$/);
  const title = ({ all: 'Semua lagu', favorites: 'Favorit', recent: 'Terakhir diputar', 'smart:frequent': 'Sering diputar', 'smart:unplayed': 'Belum diputar' })[state.view] || (grouped ? `${grouped[1][0].toUpperCase() + grouped[1].slice(1)} · ${grouped[2]}` : state.playlists.find(p => p.id === state.view)?.name || 'Semua lagu');
  const viewTitle = $('#view-title'); if (viewTitle) viewTitle.innerHTML = `${esc(title)}<span>.</span>`;
  const collectionSum = $('#collection-summary'); if (collectionSum) collectionSum.textContent = state.view === 'all' ? 'Koleksi pribadi, dengan sentuhan klasik.' : `${baseTracks(state).length} lagu untuk menemani harimu.`;

  const viewSelect = $('#view-select');
  if (viewSelect) {
    const baseOptions = [
      { id: 'all', name: 'Semua lagu' },
      { id: 'favorites', name: 'Favorit' },
      { id: 'recent', name: 'Terakhir diputar' },
      { id: 'smart:frequent', name: 'Sering diputar' },
      { id: 'smart:unplayed', name: 'Belum diputar' },
    ];
    const playlistOptions = state.playlists.map(p => ({ id: p.id, name: p.name }));
    const allOptions = [...baseOptions, ...playlistOptions];
    viewSelect.innerHTML = allOptions.map(opt =>
      `<option value="${esc(opt.id)}"${state.view === opt.id ? ' selected' : ''}>${esc(opt.name)}</option>`
    ).join('');
    viewSelect.value = state.view;
  }
}
function nextTrack() {
  if (state.queue.length) return findTrack(state.queue[0]);
  const list = baseTracks(state); const index = list.findIndex(t => t.id === state.currentId);
  return list[(index + 1) % list.length];
}
function updateTapeCounter() {
  const elapsed = Math.floor(audio.currentTime || 0);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const m1 = $('#counter-m1'), m2 = $('#counter-m2'), s1 = $('#counter-s1'), s2 = $('#counter-s2');
  if (m1) m1.textContent = String(Math.floor((mins % 100) / 10));
  if (m2) m2.textContent = String(mins % 10);
  if (s1) s1.textContent = String(Math.floor(secs / 10));
  if (s2) s2.textContent = String(secs % 10);

  const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : (current()?.duration || 1);
  const ratio = Math.max(0, Math.min(1, (audio.currentTime || 0) / duration));
  const packLeft = $('#tape-pack-left');
  const packRight = $('#tape-pack-right');
  if (packLeft && packRight) {
    packLeft.style.flex = String(Math.max(0.15, 1 - ratio * 0.8));
    packRight.style.flex = String(Math.max(0.15, 0.2 + ratio * 0.8));
  }
}
function renderCurrent() {
  const track = current();
  const cassTitle = $('#cassette-current-title');
  if (cassTitle) cassTitle.textContent = track ? track.title : 'NO TAPE LOADED';
  if (!track) {
    const nowTitle = $('#now-title'), playerTitle = $('#player-title');
    if (nowTitle) nowTitle.textContent = 'Belum ada lagu';
    if (playerTitle) playerTitle.textContent = 'Belum ada lagu';
    const nowArtist = $('#now-artist'), playerArtist = $('#player-artist');
    if (nowArtist) nowArtist.textContent = 'Tambahkan musik untuk mulai mendengarkan';
    if (playerArtist) playerArtist.textContent = 'Tambahkan musik untuk mulai mendengarkan';
    const nowQuality = $('#now-quality'); if (nowQuality) nowQuality.textContent = 'BELUM ADA AUDIO';
    const nowArt = $('#now-art'); if (nowArt) { const artTitle = nowArt.querySelector('.art-title'); if (artTitle) artTitle.innerHTML = 'BELUM ADA LAGU<span>Tambahkan musik</span>'; }
    const durationEl = $('#duration'); if (durationEl) durationEl.textContent = '00:00';
    const nextTr = $('#next-track'); if (nextTr) nextTr.innerHTML = '<p class="dialog-note">Tambahkan lagu untuk mengisi antrean.</p>';
    updateTapeCounter();
    return;
  }
  const nowTitle = $('#now-title'), playerTitle = $('#player-title');
  if (nowTitle) nowTitle.textContent = track.title;
  if (playerTitle) playerTitle.textContent = track.title;
  const nowArtist = $('#now-artist'), playerArtist = $('#player-artist');
  if (nowArtist) nowArtist.textContent = track.artist;
  if (playerArtist) playerArtist.textContent = `${track.artist}${track.demo ? ' · Demo' : ''}`;
  const nowFormat = $('#now-format'); if (nowFormat) nowFormat.textContent = track.format;
  const nowQuality = $('#now-quality'); if (nowQuality) nowQuality.textContent = track.demo ? 'AUDIO DEMO' : 'FILE LOKAL';
  const nowArt = $('#now-art'), playerArt = $('#player-art');
  if (nowArt) { nowArt.dataset.art = String(track.art); applyArt(nowArt, track); const artTitle = nowArt.querySelector('.art-title'); if (artTitle) artTitle.innerHTML = `${esc(track.title)}<span>${esc(track.artist)}</span>`; }
  if (playerArt) { playerArt.dataset.art = String(track.art); applyArt(playerArt, track); }
  const compactPlay = $('#compact-play');
  if (compactPlay) compactPlay.setAttribute('aria-label', audio.paused ? 'Putar' : 'Jeda');
  $$('#now-favorite, #player-favorite').forEach(el => { el.classList.toggle('active',state.favorites.has(track.id)); el.setAttribute('aria-pressed', String(state.favorites.has(track.id))); el.setAttribute('aria-label', state.favorites.has(track.id) ? 'Hapus dari favorit' : 'Tambahkan ke favorit'); });
  const durationEl = $('#duration'); if (durationEl) durationEl.textContent = formatTime(track.duration);
  const upcoming = nextTrack();
  const nextTr = $('#next-track');
  if (nextTr) {
    nextTr.innerHTML = upcoming ? `<div class="mini-art" data-art="${upcoming.art}"><span>AA</span></div><div><strong>${esc(upcoming.title)}</strong><p>${esc(upcoming.artist)}</p></div><span>${formatTime(upcoming.duration)}</span>` : '<p class="dialog-note">Belum ada lagu berikutnya.</p>';
    if (upcoming) applyArt($('#next-track .mini-art'), upcoming);
  }
  if ('mediaSession' in navigator && 'MediaMetadata' in window) navigator.mediaSession.metadata = new MediaMetadata({ title: track.title, artist: track.artist, album: track.album });
  updateTapeCounter();
}
function renderModes() {
  $('#shuffle').classList.toggle('active',state.shuffle); $('#shuffle').setAttribute('aria-pressed',state.shuffle);
  const repeatBtn = $('#repeat');
  if (repeatBtn) {
    repeatBtn.classList.toggle('active', state.repeat > 0);
    repeatBtn.setAttribute('aria-label', `Ulangi: ${['mati', 'semua lagu', 'satu lagu'][state.repeat]}`);
    repeatBtn.title = repeatBtn.getAttribute('aria-label');
  }
  $('#volume').value = state.volume; audio.volume = state.volume; $('#volume').style.setProperty('--fill',`${state.volume * 100}%`);
  const isMuted = Boolean(audio.muted || !state.volume);
  $('#mute')?.classList.toggle('active', isMuted);
  $('#amp-mute-switch')?.classList.toggle('active', isMuted);
  $('#lamp-mute')?.classList.toggle('active', isMuted);
  giantVolKnob?.setVal(state.volume, false);
  deckVolKnob?.setVal(state.volume, false);
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
async function selectTrack(id, autoplay = true, requestedPosition = 0) {
  const track = findTrack(id); if (!track) return;
  const token = ++playbackToken; audio.pause(); clearTimeout(crossfadeTimer); crossfadeStarted = false; state.currentId = id; loadedId = id;
  state.playCounts[id] = (state.playCounts[id] || 0) + (autoplay ? 1 : 0);
  try {
    const url = await sourceURL(track);
    if (token !== playbackToken) return;
    const fallbackPosition = Number.isFinite(state.positions[id]) ? state.positions[id] : (id === saved.currentId && Number.isFinite(saved.position) ? saved.position : 0);
    const startPosition = Math.max(0, Number.isFinite(requestedPosition) && requestedPosition > 0 ? requestedPosition : fallbackPosition);
    audio.pause(); audio.removeAttribute('src'); audio.load();
    audio.src = url; audio.preload = state.gapless ? 'auto' : 'metadata';
    const resetStart = () => {
      if (token !== playbackToken) return;
      const duration = Number.isFinite(audio.duration) ? audio.duration : track.duration;
      audio.currentTime = Math.min(startPosition, Math.max(0, duration - 0.25));
    };
    audio.addEventListener('loadedmetadata', resetStart, { once: true });
    audio.addEventListener('canplay', resetStart, { once: true });
    audio.load();
    resetStart();
    renderCurrent(); renderTracks(); updateProgress();
    if (autoplay) { setupAudio(); applyAudioSettings(); if (context) await context.resume(); if (token !== playbackToken) return; await audio.play(); }
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
  if (!audio.paused) {
    if (state.dsp?.fadePause && masterGain && context) {
      masterGain.gain.setTargetAtTime(0.0001, context.currentTime, 0.08);
      setTimeout(() => {
        audio.pause();
        applyAudioSettings();
      }, 120);
    } else {
      audio.pause();
    }
    return;
  }
  try {
    setupAudio();
    if (context) await context.resume();
    if (state.dsp?.fadePause && masterGain && context) {
      masterGain.gain.setValueAtTime(0.0001, context.currentTime);
      await audio.play();
      applyAudioSettings();
    } else {
      await audio.play();
    }
  }
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
  updateTapeCounter();
}
audio.addEventListener('timeupdate', () => { updateProgress(); maybeCrossfade(); const second = Math.floor(audio.currentTime); if (second % 5 === 0 && second !== lastSavedSecond) { lastSavedSecond = second; persist(); } });
audio.addEventListener('loadedmetadata', () => { if (Number.isFinite(audio.duration)) current().duration = audio.duration; updateProgress(); renderTracks(); });
audio.addEventListener('play', () => {
  $('#app')?.classList.add('is-playing');
  $('#cassette-door-bay')?.classList.add('is-playing');
  $('#play')?.classList.add('active');
  $('#pause-btn')?.classList.remove('active');
  $('#play')?.setAttribute('aria-label','Jeda');
  const compactPlay = $('#compact-play');
  if (compactPlay) { compactPlay.innerHTML = icon('pause'); compactPlay.setAttribute('aria-label', 'Jeda'); }
  const spectrumStatus = $('#spectrum-status');
  if (spectrumStatus) spectrumStatus.textContent = 'LIVE';
  state.recent = [state.currentId, ...state.recent.filter(id => id !== state.currentId)].slice(0,100); persist();
  notifyTrack(current());
  if (state.view === 'recent') renderTracks(); if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
});
audio.addEventListener('pause', () => {
  $('#app')?.classList.remove('is-playing');
  $('#cassette-door-bay')?.classList.remove('is-playing');
  $('#play')?.classList.remove('active');
  if (audio.currentTime > 0 && !audio.ended) {
    $('#pause-btn')?.classList.add('active');
  }
  $('#play')?.setAttribute('aria-label','Putar');
  const compactPlay = $('#compact-play');
  if (compactPlay) { compactPlay.innerHTML = icon('play'); compactPlay.setAttribute('aria-label', 'Putar'); }
  const spectrumStatus = $('#spectrum-status');
  if (spectrumStatus) spectrumStatus.textContent = 'STANDBY';
  persist();
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
});
audio.addEventListener('ended', () => {
  $('#pause-btn')?.classList.remove('active');
  advance(1, true);
});
audio.addEventListener('error', () => { if (audio.src) toast('Format audio tidak didukung atau file rusak. Silakan coba file lain.'); });

function bindRotaryKnob(element, { min, max, initial, step = 1, angleMin = -135, angleMax = 135, onChange }) {
  if (!element) return { setVal: () => {}, getVal: () => initial };
  let currentVal = initial;

  function updateAngle(v) {
    const fraction = (v - min) / (max - min);
    const angle = angleMin + fraction * (angleMax - angleMin);
    element.style.transform = `rotate(${angle.toFixed(1)}deg)`;
  }

  function setVal(v, notify = true) {
    const clamped = Math.max(min, Math.min(max, v));
    currentVal = clamped;
    updateAngle(currentVal);
    element.setAttribute('aria-valuenow', String(Number(currentVal.toFixed(2))));
    if (notify && onChange) onChange(currentVal);
  }

  element.setAttribute('role', 'slider');
  element.setAttribute('tabindex', '0');
  element.setAttribute('aria-valuemin', String(min));
  element.setAttribute('aria-valuemax', String(max));
  element.setAttribute('aria-valuenow', String(initial));
  element.setAttribute('aria-label', element.title || element.dataset.param || 'Kontrol');
  setVal(initial, false);

  let startY = 0;
  let startVal = 0;

  function onPointerMove(e) {
    const dy = startY - e.clientY;
    const range = max - min;
    const delta = (dy / 140) * range;
    const stepped = Math.round((startVal + delta) / step) * step;
    setVal(stepped);
  }

  function onPointerUp() {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }

  element.addEventListener('pointerdown', e => {
    e.preventDefault();
    startY = e.clientY;
    startVal = currentVal;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  });

  element.addEventListener('wheel', e => {
    e.preventDefault();
    const dir = e.deltaY < 0 ? 1 : -1;
    const delta = dir * step * (e.shiftKey ? 3 : 1);
    setVal(Math.round((currentVal + delta) / step) * step);
  }, { passive: false });

  element.addEventListener('keydown', event => {
    const increment = event.shiftKey ? step * 3 : step;
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') { event.preventDefault(); setVal(currentVal + increment); }
    if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') { event.preventDefault(); setVal(currentVal - increment); }
    if (event.key === 'Home') { event.preventDefault(); setVal(min); }
    if (event.key === 'End') { event.preventDefault(); setVal(max); }
  });

  return { setVal, getVal: () => currentVal };
}

function setMasterVolume(v) {
  state.volume = Math.max(0, Math.min(1, v));
  audio.volume = state.volume;
  if (audio.muted && state.volume > 0) audio.muted = false;
  const volEl = $('#volume');
  if (volEl) {
    volEl.value = state.volume;
    volEl.style.setProperty('--fill', `${state.volume * 100}%`);
  }
  giantVolKnob?.setVal(state.volume, false);
  deckVolKnob?.setVal(state.volume, false);
  renderModes();
  persist();
}

function setAudioBalance(b) {
  state.balance = Math.max(-1, Math.min(1, b));
  applyAudioSettings();
  syncSettings();
  balKnob?.setVal(state.balance, false);
  persist();
}

function setAudioPreamp(p) {
  state.preamp = Math.max(-12, Math.min(12, p));
  applyAudioSettings();
  syncSettings();
  preampKnob?.setVal(state.preamp, false);
  persist();
}

function setAudioBass(db) {
  state.eq[0] = db;
  state.eq[1] = Math.round(db * 0.8);
  state.preset = 'Custom';
  syncEQ();
  bassKnob?.setVal(db, false);
}

function setAudioTreble(db) {
  state.eq[8] = Math.round(db * 0.8);
  state.eq[9] = db;
  state.preset = 'Custom';
  syncEQ();
  trebleKnob?.setVal(db, false);
}

function toggleMute() {
  audio.muted = !audio.muted;
  const isMuted = Boolean(audio.muted || !state.volume);
  $('#mute')?.setAttribute('aria-pressed', String(audio.muted));
  $('#mute')?.classList.toggle('active', isMuted);
  $('#amp-mute-switch')?.classList.toggle('active', isMuted);
  $('#lamp-mute')?.classList.toggle('active', isMuted);
  renderModes();
}

function toggleDrawer(forceState) {
  const drawer = $('#tape-drawer');
  if (!drawer) return;
  const isCurrentlyOpen = drawer.classList.contains('open');
  const shouldOpen = typeof forceState === 'boolean' ? forceState : !isCurrentlyOpen;
  drawer.classList.toggle('open', shouldOpen);
  const isOpen = drawer.classList.contains('open');

  const btnMenu = $('#btn-menu');
  if (btnMenu) {
    btnMenu.classList.toggle('active', isOpen);
    btnMenu.setAttribute('aria-pressed', String(isOpen));
  }

  const topToggle = $('#toggle-drawer-top');
  if (topToggle) {
    topToggle.classList.toggle('active', isOpen);
    topToggle.setAttribute('aria-pressed', String(isOpen));
  }

  if (isOpen) {
    renderTracks();
  }
}

function setupRackControls() {
  giantVolKnob = bindRotaryKnob($('#giant-master-volume'), { min: 0, max: 1, initial: state.volume, step: 0.01, angleMin: -140, angleMax: 140, onChange: setMasterVolume });
  deckVolKnob = bindRotaryKnob($('#deck-volume-knob'), { min: 0, max: 1, initial: state.volume, step: 0.01, onChange: setMasterVolume });
  balKnob = bindRotaryKnob($('#knob-balance'), { min: -1, max: 1, initial: state.balance, step: 0.02, angleMin: -144, angleMax: 144, onChange: setAudioBalance });
  preampKnob = bindRotaryKnob($('#knob-preamp'), { min: -12, max: 12, initial: state.preamp, step: 1, angleMin: -144, angleMax: 144, onChange: setAudioPreamp });
  bassKnob = bindRotaryKnob($('#knob-bass'), { min: -12, max: 12, initial: state.eq[0], step: 1, angleMin: -144, angleMax: 144, onChange: setAudioBass });
  trebleKnob = bindRotaryKnob($('#knob-treble'), { min: -12, max: 12, initial: state.eq[9], step: 1, angleMin: -144, angleMax: 144, onChange: setAudioTreble });

  bindRotaryKnob($('#knob-true-bass'), { min: 0, max: 10, initial: 3, step: 1, angleMin: -140, angleMax: 140, onChange: v => toast(`True Bass: ${v}`) });
  bindRotaryKnob($('#knob-enhancer'), { min: 0, max: 10, initial: 5, step: 1, angleMin: -140, angleMax: 140, onChange: v => toast(`Enhancer: ${v}`) });
  bindRotaryKnob($('#knob-reverb'), { min: 0, max: 10, initial: 2, step: 1, angleMin: -140, angleMax: 140, onChange: v => toast(`Reverb: ${v}`) });

  const tapeButtons = $$('#btn-tape-normal, #btn-tape-cro2, #btn-tape-metal');
  const sourceRotary = $('#deck-source-rotary');
  const sourceKnob = sourceRotary?.querySelector('.rotary-knob');
  const tapeModes = ['normal', 'cro2', 'metal'];
  let sourcePos = Number(sourceKnob?.dataset.pos) || 0;

  const selectTapeMode = (mode, showToast = true) => {
    const selectedMode = tapeModes.includes(mode) ? mode : 'normal';
    const selectedIndex = tapeModes.indexOf(selectedMode);
    const selectedButton = tapeButtons[selectedIndex];
    const deckUnit = $('#cassette-deck-unit');

    tapeButtons.forEach(button => {
      const active = button === selectedButton;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    if (deckUnit) {
      deckUnit.classList.remove('tape-normal', 'tape-cro2', 'tape-metal');
      deckUnit.classList.add(`tape-${selectedMode}`);
      deckUnit.dataset.tapeType = selectedMode.toUpperCase();
    }

    sourcePos = selectedIndex;
    if (sourceKnob) {
      sourceKnob.dataset.pos = String(sourcePos);
      sourceKnob.style.transform = `rotate(${(sourcePos - 1) * 45}deg)`;
    }

    if (showToast) toast(`Tape Bias/EQ: ${selectedMode.toUpperCase()}`);
  };

  tapeButtons.forEach((button, index) => {
    button.onclick = () => selectTapeMode(tapeModes[index]);
  });

  if (sourceRotary) {
    sourceRotary.onclick = () => {
      sourcePos = (sourcePos + 1) % tapeModes.length;
      selectTapeMode(tapeModes[sourcePos], false);
      toast(`Source Channel: ${['A', 'B', 'C'][sourcePos]} · Tape ${tapeModes[sourcePos].toUpperCase()}`);
    };
  }

  selectTapeMode(tapeModes[sourcePos], false);

  const playBtn = $('#play');
  if (playBtn) playBtn.onclick = togglePlay;
  const prevBtn = $('#previous');
  if (prevBtn) prevBtn.onclick = () => advance(-1);
  const nextBtn = $('#next');
  if (nextBtn) nextBtn.onclick = () => advance(1);

  const stopBtn = $('#stop-btn');
  if (stopBtn) {
    stopBtn.onclick = () => {
      audio.pause();
      audio.currentTime = 0;
      updateProgress();
      toast('Cassette playback stopped.');
    };
  }

  const pauseBtn = $('#pause-btn');
  if (pauseBtn) {
    pauseBtn.onclick = () => {
      if (!audio.paused) {
        audio.pause();
      } else if (loadedId) {
        audio.play();
      }
    };
  }

  const recBtn = $('#rec-btn');
  if (recBtn) recBtn.onclick = () => $('#file-input')?.click();

  const ejectBtn = $('#deck-eject-btn');
  if (ejectBtn) ejectBtn.onclick = () => $('#file-input')?.click();

  const resetBtn = $('#counter-reset-btn');
  if (resetBtn) {
    resetBtn.onclick = () => {
      audio.currentTime = 0;
      updateProgress();
      toast('Tape counter reset.');
    };
  }

  const isDrawerOpen = $('#tape-drawer')?.classList.contains('open') ?? false;

  const topToggle = $('#toggle-drawer-top');
  if (topToggle) {
    topToggle.classList.toggle('active', isDrawerOpen);
    topToggle.setAttribute('aria-pressed', String(isDrawerOpen));
    topToggle.onclick = (e) => {
      e?.stopPropagation?.();
      toggleDrawer();
    };
  }
  const btnMenu = $('#btn-menu');
  if (btnMenu) {
    btnMenu.classList.toggle('active', isDrawerOpen);
    btnMenu.setAttribute('aria-pressed', String(isDrawerOpen));
    btnMenu.onclick = (e) => {
      e?.stopPropagation?.();
      toggleDrawer();
    };
  }
  const btnSystem = $('#btn-system');
  if (btnSystem) {
    btnSystem.onclick = (e) => {
      e?.stopPropagation?.();
      toggleDrawer();
    };
  }

  const dbxBadge = $('#dbx-badge');
  if (dbxBadge) {
    dbxBadge.onclick = (e) => {
      e?.stopPropagation?.();
      openDspDialog('general');
    };
    dbxBadge.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDspDialog('general');
      }
    };
  }

  const deckPower = $('#deck-power-btn');
  if (deckPower) {
    deckPower.onclick = () => {
      deckPower.classList.toggle('active');
      const on = deckPower.classList.contains('active');
      deckPower.setAttribute('aria-pressed', String(on));
      $('#cassette-deck-unit')?.classList.toggle('standby', !on);
      if (!on && !audio.paused) audio.pause();
      toast(on ? 'ATIGA AMP Deck Power ON' : 'ATIGA AMP Deck Standby');
    };
  }

  const ampPower = $('#amp-power-btn');
  if (ampPower) {
    ampPower.onclick = () => {
      ampPower.classList.toggle('active');
      const on = ampPower.classList.contains('active');
      ampPower.setAttribute('aria-pressed', String(on));
      $('#amplifier-unit')?.classList.toggle('standby', !on);
      if (!on && !audio.paused) audio.pause();
      toast(on ? 'ATIGA Integrated Amp Power ON' : 'ATIGA Integrated Amp Standby');
    };
  }

  const muteBtn = $('#mute');
  if (muteBtn) muteBtn.onclick = toggleMute;
  const ampMute = $('#amp-mute-switch');
  if (ampMute) ampMute.onclick = toggleMute;

  const openEQ = () => {
    $('#eq-dialog')?.showModal();
    $('#eq-toggle')?.setAttribute('aria-expanded', 'true');
  };
  $$('#switch-eq-dsp, #eq-toggle, #player-eq').forEach(el => {
    if (el) el.onclick = openEQ;
  });

  const btnAmplifier = $('#btn-amplifier');
  const ampUnit = $('#amplifier-unit');
  const deckUnit = $('#cassette-deck-unit');
  if (btnAmplifier && ampUnit) {
    const updateAmpVisibility = (hidden, notify = true) => {
      ampUnit.classList.toggle('hidden', hidden);
      ampUnit.hidden = hidden;
      btnAmplifier.classList.toggle('active', !hidden);
      btnAmplifier.setAttribute('aria-pressed', String(!hidden));
      deckUnit?.classList.toggle('standalone', hidden);
      $('#app')?.classList.toggle('amp-hidden', hidden);
      state.ampHidden = hidden;
      if (notify) {
        persist();
      }
    };
    updateAmpVisibility(Boolean(state.ampHidden), false);
    btnAmplifier.onclick = (e) => {
      e?.stopPropagation?.();
      const isCurrentlyHidden = ampUnit.classList.contains('hidden') || ampUnit.hidden;
      updateAmpVisibility(!isCurrentlyHidden, true);
    };
  }

  const btnDsp = $('#btn-dsp');
  if (btnDsp) {
    btnDsp.onclick = (e) => {
      e?.stopPropagation?.();
      openDspDialog('general');
    };
  }

  // Plaque legend labels click-through
  [
    { id: 'matrix-lbl-menu', targetId: 'btn-menu' },
    { id: 'matrix-lbl-amplifier', targetId: 'btn-amplifier' },
    { id: 'matrix-lbl-dsp', targetId: 'btn-dsp' },
    { id: 'matrix-lbl-normal', targetId: 'btn-tape-normal' },
    { id: 'matrix-lbl-cro2', targetId: 'btn-tape-cro2' },
    { id: 'matrix-lbl-metal', targetId: 'btn-tape-metal' }
  ].forEach(({ id, targetId }) => {
    const lbl = $(`#${id}`);
    const target = $(`#${targetId}`);
    if (lbl && target) {
      lbl.onclick = (e) => {
        e.stopPropagation();
        target.click();
      };
      lbl.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          target.click();
        }
      };
    }
  });

  const btnAmpEq = $('#btn-amp-eq');
  const btnAmpDsp = $('#btn-amp-dsp');
  if (btnAmpEq) {
    btnAmpEq.setAttribute('aria-pressed', String(btnAmpEq.classList.contains('active')));
    btnAmpEq.onclick = (e) => {
      e.stopPropagation();
      btnAmpEq.classList.toggle('active');
      const on = btnAmpEq.classList.contains('active');
      btnAmpEq.setAttribute('aria-pressed', String(on));
      $('#lamp-equalizer')?.classList.toggle('active', on);
      openEQ();
      toast(on ? 'Equalizer 10-Band ON' : 'Equalizer Bypass');
    };
  }
  if (btnAmpDsp) {
    btnAmpDsp.setAttribute('aria-pressed', String(btnAmpDsp.classList.contains('active')));
    btnAmpDsp.onclick = (e) => {
      e.stopPropagation();
      btnAmpDsp.classList.toggle('active');
      const on = btnAmpDsp.classList.contains('active');
      btnAmpDsp.setAttribute('aria-pressed', String(on));
      $('#lamp-dsp')?.classList.toggle('active', on);
      openDspDialog('general');
      toast(on ? 'ATIGA AMP DSP Manager ON' : 'ATIGA AMP DSP Bypass');
    };
  }

  $$('.speaker-btn-group .bezel-push-tab').forEach(tab => {
    tab.onclick = () => {
      tab.classList.toggle('active');
      const on = tab.classList.contains('active');
      if (tab.id === 'spk-left') $('#lamp-left')?.classList.toggle('active', on);
      if (tab.id === 'spk-right') $('#lamp-right')?.classList.toggle('active', on);
      if (tab.id === 'spk-stereo') $('#lamp-stereo')?.classList.toggle('active', on);
    };
  });

  $$('.display-btn-group .bezel-push-tab').forEach(tab => {
    tab.onclick = () => {
      $$('.display-btn-group .bezel-push-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const isPeak = tab.id === 'dsp-peak';
      $('#dot-peak')?.classList.toggle('active', isPeak);
      $('#dot-vu')?.classList.toggle('active', !isPeak);
    };
  });
}

const playSessionBtn = $('#play-session');
if (playSessionBtn) {
  playSessionBtn.textContent = 'Tambah musik';
  playSessionBtn.onclick = () => $('#file-input')?.click();
}
const seekRange = $('#seek');
if (seekRange) {
  seekRange.oninput = event => { if (loadedId && Number.isFinite(audio.duration)) { audio.currentTime = Number(event.target.value) / 100 * audio.duration; updateProgress(); } };
}
const volRange = $('#volume');
if (volRange) {
  volRange.oninput = event => setMasterVolume(Number(event.target.value));
}
const shuffleBtn = $('#shuffle');
if (shuffleBtn) {
  shuffleBtn.onclick = () => { state.shuffle = !state.shuffle; renderModes(); persist(); toast(state.shuffle ? 'Pemutaran acak aktif.' : 'Pemutaran acak dimatikan.'); };
}
const repeatBtn = $('#repeat');
if (repeatBtn) {
  repeatBtn.onclick = () => { state.repeat = (state.repeat + 1) % 3; renderModes(); persist(); toast(`Ulangi: ${['mati','semua lagu','satu lagu'][state.repeat]}.`); };
}
$$('#now-favorite, #player-favorite').forEach(el => el.onclick = () => favorite(state.currentId));
$('.sidebar')?.addEventListener('click', event => { const button = event.target.closest('[data-view]'); if (!button) return; state.view = button.dataset.view; state.queueView = false; state.search = ''; if ($('#search')) $('#search').value = ''; render(); });

const viewSelect = $('#view-select');
if (viewSelect) {
  viewSelect.onchange = event => {
    state.view = event.target.value;
    state.queueView = false;
    state.search = '';
    const searchInput = $('#search');
    if (searchInput) searchInput.value = '';
    render();
  };
}

const importPrompt = $('#import-prompt');
if (importPrompt) importPrompt.onclick = () => $('#file-input')?.click();

const searchInput = $('#search');
if (searchInput) {
  searchInput.oninput = event => { state.search = event.target.value.toLowerCase().trim(); renderTracks(); };
}
const sortBtn = $('#sort');
if (sortBtn) {
  sortBtn.onclick = () => { if (state.queueView) { toast('Tarik lagu untuk mengurutkan antrean.'); return; } state.sortAsc = !state.sortAsc; sortBtn.classList.toggle('active', state.sortAsc); renderTracks(); };
}
function showQueue() { state.queueView = true; renderTracks(); if ($('#app')?.classList.contains('compact')) $('#app')?.classList.remove('compact'); toggleDrawer(true); }
$$('#queue-tab, #show-queue, #player-queue').forEach(el => el.onclick = showQueue);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const drawer = $('#tape-drawer');
    if (drawer && drawer.classList.contains('open')) {
      const dspDialog = $('#dsp-dialog');
      const eqDialog = $('#eq-dialog');
      const trackDialog = $('#track-dialog');
      const playlistDialog = $('#playlist-dialog');
      const helpDialog = $('#help-dialog');
      if (!dspDialog?.open && !eqDialog?.open && !trackDialog?.open && !playlistDialog?.open && !helpDialog?.open) {
        toggleDrawer(false);
      }
    }
  }
});
const trackTab = $('#track-tab');
if (trackTab) trackTab.onclick = () => { state.queueView = false; renderTracks(); };
$('#tracks')?.addEventListener('click', event => { const tr = event.target.closest('[data-id]'); if (!tr) return; const action = event.target.closest('[data-action]')?.dataset.action; if (action === 'favorite') favorite(tr.dataset.id); else if (action === 'more') showTrackOptions(tr.dataset.id, Number(tr.dataset.index)); else selectTrack(tr.dataset.id); });
$('#tracks')?.addEventListener('keydown', event => { if (event.target.matches('tr') && event.key === 'Enter') { event.preventDefault(); selectTrack(event.target.dataset.id); } });
function showTrackOptions(id, index) {
  const track = findTrack(id);
  const trackTitle = $('#track-dialog-title');
  if (trackTitle) trackTitle.textContent = track.title;
  const target = $('#track-options');
  if (target) {
    target.replaceChildren();
    const quickHeading = document.createElement('div'); quickHeading.className = 'option-section-label'; quickHeading.textContent = 'AKSI CEPAT'; target.append(quickHeading);
    const addOption = (label, action, danger = false, iconName = 'music') => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'track-option'; button.setAttribute('aria-label', label);
      if (danger) button.dataset.danger = 'true';
      button.innerHTML = `<span class="track-option-icon">${icon(iconName)}</span><span class="track-option-copy"><strong>${esc(label)}</strong><small>${danger ? 'Tindakan permanen' : 'Atiga Amp'}</small></span><span class="track-option-arrow">›</span>`;
      button.onclick = async () => { await action(); $('#track-dialog')?.close(); render(); persist(); };
      target.append(button);
    };
    addOption('Putar berikutnya', () => { state.queue.unshift(id); toast('Ditambahkan sebagai lagu berikutnya.'); }, false, 'next');
    addOption('Tambahkan ke antrean', () => { state.queue.push(id); toast('Lagu ditambahkan ke antrean.'); }, false, 'queue');
    if (state.queueView) addOption('Hapus dari antrean', () => {
      const queueIndex = queueIndexAtVisibleIndex(state, index);
      if (queueIndex >= 0) state.queue.splice(queueIndex, 1);
    }, true, 'close');
    const playlist = state.playlists.find(p => p.id === state.view);
    if (playlist && !state.queueView) addOption('Hapus dari daftar putar ini', () => playlist.ids = playlist.ids.filter(item => item !== id), true, 'close');
    addOption('Hapus lagu dari koleksi', () => removeTrack(id), true, 'close');
    if (state.playlists.length) {
      const playlistHeading = document.createElement('div'); playlistHeading.className = 'option-section-label playlist-option-heading'; playlistHeading.textContent = 'TAMBAHKAN KE DAFTAR PUTAR'; target.append(playlistHeading);
      state.playlists.forEach(p => addOption(p.name, () => { if (!p.ids.includes(id)) { p.ids.push(id); toast(`Ditambahkan ke ${p.name}.`); } else toast('Lagu sudah ada di daftar putar ini.'); }, false, 'music'));
    }
  }
  $('#track-dialog')?.showModal();
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
$('#tracks')?.addEventListener('dragstart', event => { const tr = event.target.closest('[data-id]'); if (!tr) return; draggedId = tr.dataset.id; draggedIndex = Number(tr.dataset.index); event.dataTransfer.setData('text/plain', draggedId); event.dataTransfer.effectAllowed = 'move'; tr.classList.add('dragging'); });
$('#tracks')?.addEventListener('dragend', () => { $$('.dragging').forEach(el => el.classList.remove('dragging')); draggedId = null; });
$('#tracks')?.addEventListener('dragover', event => { if (draggedId) event.preventDefault(); });
$('#tracks')?.addEventListener('drop', event => {
  const target = event.target.closest('[data-id]'); if (!draggedId || !target) return; event.preventDefault();
  if (state.search || state.sortAsc) { toast('Kosongkan pencarian dan matikan urutan judul untuk memindahkan lagu.'); return; }
  const playlist = state.playlists.find(p => p.id === state.view);
  const ids = state.queueView ? state.queue : playlist?.ids;
  if (!ids) { toast('Urutan manual tersedia di playlist dan antrean.'); return; }
  const targetIndex = Number(target.dataset.index); const [id] = ids.splice(draggedIndex,1); ids.splice(targetIndex,0,id); render(); persist();
});
const newPlaylistBtn = $('#new-playlist');
if (newPlaylistBtn) {
  newPlaylistBtn.onclick = () => { $('#playlist-dialog')?.showModal(); $('#playlist-name')?.focus(); };
}
const closePlaylistBtn = $('#close-playlist');
if (closePlaylistBtn) {
  closePlaylistBtn.onclick = () => $('#playlist-dialog')?.close();
}
const playlistForm = $('#playlist-form');
if (playlistForm) {
  playlistForm.onsubmit = event => {
    event.preventDefault();
    const name = $('#playlist-name')?.value?.trim();
    if (!name) return;
    const playlist = { id: crypto.randomUUID(), name, ids: [] };
    state.playlists.push(playlist);
    state.view = playlist.id;
    state.queueView = false;
    state.search = '';
    const searchInput = $('#search');
    if (searchInput) searchInput.value = '';
    const plNameInput = $('#playlist-name');
    if (plNameInput) plNameInput.value = '';
    $('#playlist-dialog')?.close();
    persist();
    render();
    toast('Playlist dibuat. Gunakan menu ⋯ pada lagu untuk menambahkannya.');
  };
}
const compactBtn = $('#compact');
function applyCompactState() {
  const app = $('#app');
  if (!app) return;
  app.classList.toggle('compact', Boolean(state.compact));
  if (compactBtn) {
    compactBtn.setAttribute('aria-pressed', String(state.compact));
    compactBtn.title = state.compact ? 'Kembali ke tampilan penuh' : 'Mode ringkas';
  }
}
if (compactBtn) {
  compactBtn.onclick = () => {
    state.compact = !state.compact;
    applyCompactState();
    persist();
  };
}
applyCompactState();

const compactPrevious = $('#compact-previous');
if (compactPrevious) compactPrevious.onclick = () => advance(-1);
const compactNext = $('#compact-next');
if (compactNext) compactNext.onclick = () => advance(1);
const compactPlay = $('#compact-play');
if (compactPlay) compactPlay.onclick = () => togglePlay();

const welcomeDialog = $('#welcome-dialog');
function finishWelcome(openImport = false) {
  state.onboarded = true;
  const compactPreference = $('#welcome-compact');
  if (compactPreference) state.compact = compactPreference.checked;
  applyCompactState();
  persist();
  welcomeDialog?.close();
  if (openImport) $('#file-input')?.click();
}
if (welcomeDialog) {
  $('#welcome-demo')?.addEventListener('click', () => finishWelcome(false));
  $('#welcome-import')?.addEventListener('click', () => finishWelcome(true));
  welcomeDialog.addEventListener('close', () => {
    if (!state.onboarded) finishWelcome(false);
  });
}
const helpBtn = $('#help');
if (helpBtn) {
  helpBtn.onclick = () => $('#help-dialog')?.showModal();
}
const presets = { Flat: Array(10).fill(0), Warm: [3,3,2,1,0,-1,-1,-2,-2,-3], 'Bass Boost': [6,5,4,2,0,0,0,0,0,0], Vocal: [-2,-2,-1,1,3,4,3,1,0,-1], Bright: [-2,-1,0,0,1,2,3,4,4,3] };
const presetLabels = { Flat: 'Datar', Warm: 'Hangat', 'Bass Boost': 'Penguat bas', Vocal: 'Vokal', Bright: 'Cerah', Custom: 'Kustom' };
const eqBandsEl = $('#eq-bands');
if (eqBandsEl) {
  eqBandsEl.innerHTML = frequencies.map((frequency,i) => `<label class="eq-band"><output id="gain-${i}">${state.eq[i]>0?'+':''}${state.eq[i]}</output><input type="range" min="-12" max="12" step="1" value="${state.eq[i]}" data-band="${i}" aria-label="Gain ${frequency} Hz" /><span>${frequency>=1000 ? frequency/1000+'K' : frequency}</span></label>`).join('');
  eqBandsEl.oninput = event => { const i = Number(event.target.dataset.band); if (!Number.isInteger(i)) return; state.eq[i] = Number(event.target.value); state.preset = 'Custom'; syncEQ(); };
}
function syncEQ() {
  $$('#eq-bands input').forEach((input,i) => {
    input.value = state.eq[i];
    const gainEl = $(`#gain-${i}`);
    if (gainEl) gainEl.textContent = `${state.eq[i]>0?'+':''}${state.eq[i]}`;
    if (filters[i]) filters[i].gain.setTargetAtTime(state.eq[i], context.currentTime,.03);
  });
  const eqPresetSelect = $('#eq-preset');
  if (eqPresetSelect) eqPresetSelect.value = state.preset;
  const presetLabelEl = $('#preset-label');
  if (presetLabelEl) presetLabelEl.textContent = presetLabels[state.preset] || state.preset;
  bassKnob?.setVal(state.eq[0], false);
  trebleKnob?.setVal(state.eq[9], false);
  const eqActive = state.eq.some(val => val !== 0);
  $('#lamp-equalizer')?.classList.toggle('active', eqActive);
  persist();
}
const eqPresetSelect = $('#eq-preset');
if (eqPresetSelect) {
  eqPresetSelect.onchange = event => { const preset = event.target.value; if (presets[preset]) state.eq = [...presets[preset]]; state.preset = preset; syncEQ(); };
}
const eqResetBtn = $('#eq-reset');
if (eqResetBtn) {
  eqResetBtn.onclick = () => { state.eq = Array(10).fill(0); state.preset = 'Flat'; syncEQ(); };
}
$$('#eq-toggle, #player-eq').forEach(el => {
  if (el) el.onclick = () => { $('#eq-dialog')?.showModal(); $('#eq-toggle')?.setAttribute('aria-expanded','true'); };
});
$('#eq-dialog')?.addEventListener('close', () => $('#eq-toggle')?.setAttribute('aria-expanded','false'));
const importBtn = $('#import');
if (importBtn) importBtn.onclick = () => $('#file-input')?.click();
const importFolderBtn = $('#import-folder');
if (importFolderBtn) importFolderBtn.onclick = chooseFolder;
async function readDuration(file) {
  return new Promise(resolve => {
    let probe, url, finished = false;
    const finish = value => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (probe) { probe.removeAttribute('src'); probe.load(); }
      if (url) URL.revokeObjectURL(url);
      resolve(value);
    };
    const timer = setTimeout(() => finish(0), 8000);
    try {
      probe = new Audio(); probe.preload = 'metadata'; url = URL.createObjectURL(file);
      probe.onloadedmetadata = () => finish(Number.isFinite(probe.duration) ? probe.duration : 0);
      probe.onerror = () => finish(0);
      probe.src = url; probe.load();
    } catch { finish(0); }
  });
}
let importing = false;
let importCancelled = false;
const importProgress = $('#import-progress');
const importProgressBar = $('#import-progress-bar');
const importProgressLabel = $('#import-progress-label');
const importProgressValue = $('#import-progress-value');
const cancelImport = $('#cancel-import');
function updateImportProgress(processed, total, label = 'Mengimpor musik…') {
  if (importProgress) importProgress.hidden = false;
  if (importProgressBar) { importProgressBar.max = Math.max(1, total); importProgressBar.value = processed; }
  if (importProgressLabel) importProgressLabel.textContent = label;
  if (importProgressValue) importProgressValue.textContent = `${processed} / ${total}`;
}
if (cancelImport) cancelImport.onclick = () => {
  if (importing) {
    importCancelled = true;
    cancelImport.disabled = true;
    updateImportProgress(0, 1, 'Menyelesaikan file yang sedang diproses…');
  }
};
async function importFiles(files) {
  if (importing) { toast('Tunggu impor yang sedang berjalan selesai.'); return; }
  const accepted = [...files].filter(isAudioFile);
  if (!accepted.length) { toast('Tidak ada file audio yang ditemukan.'); return; }
  importing = true; importCancelled = false; if (cancelImport) cancelImport.disabled = false;
  let added = 0, duplicates = 0, unsupported = 0, unsaved = 0, processed = 0;
  updateImportProgress(0, accepted.length);
  toast(`Mengimpor ${accepted.length} file musik…`);
  try {
    for (const file of accepted) {
      if (importCancelled) break;
      const fingerprint = `${file.name}:${file.size}:${file.lastModified}`;
      if (state.tracks.some(t => t.fingerprint === fingerprint)) { duplicates++; processed++; updateImportProgress(processed, accepted.length, `Melewati duplikat: ${file.name}`); continue; }
      const duration = await readDuration(file); if (!duration) { unsupported++; processed++; updateImportProgress(processed, accepted.length, `Format tidak didukung: ${file.name}`); continue; }
      const fallback = metadataFromFilename(file), metadata = await readMetadataOffThread(file);
      const track = { id: crypto.randomUUID(), fingerprint, title: metadata.title || fallback.title, artist: metadata.artist || fallback.artist, album: metadata.album || fallback.album, genre: metadata.genre || 'Tidak diketahui', replayGain: metadata.replayGain || 0, cover: metadata.cover, art: added % 6, duration, format: file.name.split('.').pop().toUpperCase(), file };
      if (db) { try { await dbAction('readwrite', store => store.put(track)); } catch { unsaved++; } } else unsaved++;
      state.tracks.push(track); added++;
      const playlist = state.playlists.find(p => p.id === state.view); if (playlist) playlist.ids.push(track.id);
      processed++;
      updateImportProgress(processed, accepted.length, `Menambahkan: ${track.title}`);
    }
    const wasCancelled = importCancelled;
    state.search = ''; $('#search').value = ''; state.queueView = false; if (['favorites','recent'].includes(state.view)) state.view = 'all';
    render(); persist();
    const summary = added ? `${added} lagu ditambahkan.` : 'Tidak ada lagu baru.';
    const duplicateNote = duplicates ? ` ${duplicates} duplikat dilewati.` : '';
    toast(`${summary}${duplicateNote}${unsupported ? ` ${unsupported} file tidak didukung.` : ''}${unsaved ? ` ${unsaved} lagu hanya tersedia selama sesi ini; penyimpanan penuh/tidak tersedia.` : ''}${wasCancelled ? ' Impor dibatalkan.' : ''}`);
  } catch (error) {
    console.error('Atiga Amp import failed', error);
    toast(`Impor gagal: ${error instanceof Error ? error.message : 'file tidak dapat diproses.'}`);
  } finally {
    importing = false;
    if (cancelImport) cancelImport.disabled = false;
    if (importProgress) importProgress.hidden = true;
    $('#file-input').value = ''; $('#folder-input').value = '';
  }
}
$$('#file-input, #folder-input').forEach(input => input.onchange = event => importFiles(event.target.files));
let dragDepth = 0;
function carriesFiles(dataTransfer) {
  if (!dataTransfer) return false;
  if (dataTransfer.files?.length) return true;
  const types = dataTransfer.types;
  if (types?.contains?.('Files')) return true;
  return [...(types || [])].some(type => type === 'Files' || type === 'application/x-moz-file');
}
function preventFileDrop(event) {
  if (!carriesFiles(event.dataTransfer)) return false;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  return true;
}
document.addEventListener('dragenter', event => { if (preventFileDrop(event)) { dragDepth++; const overlay = $('#drop-overlay'); if (overlay) overlay.hidden = false; } });
document.addEventListener('dragover', event => { preventFileDrop(event); });
document.addEventListener('dragleave', event => { if (!carriesFiles(event.dataTransfer)) return; if (--dragDepth <= 0) { dragDepth = 0; const overlay = $('#drop-overlay'); if (overlay) overlay.hidden = true; } });
document.addEventListener('drop', event => { if (!preventFileDrop(event)) return; const overlay = $('#drop-overlay'); if (overlay) overlay.hidden = true; dragDepth = 0; if (event.dataTransfer.files.length) importFiles(event.dataTransfer.files); });
async function initTauriFileDrop() {
  // The Tauri API package can also be imported by the regular Vite build, but
  // its window/webview helpers require the Tauri runtime to be present.
  if (!window.__TAURI_INTERNALS__) return;
  try {
    const [{ getCurrentWebview }, { invoke }] = await Promise.all([import('@tauri-apps/api/webview'), import('@tauri-apps/api/core')]);
    await getCurrentWebview().onDragDropEvent(async event => {
      const overlay = $('#drop-overlay');
      if (event.payload.type === 'enter' || event.payload.type === 'over') {
        if (overlay) overlay.hidden = false;
        return;
      }
      if (event.payload.type === 'leave') {
        if (overlay) overlay.hidden = true;
        return;
      }
      if (overlay) overlay.hidden = true;
      try {
        const files = await Promise.all(event.payload.paths.map(async path => {
          const bytes = await invoke('read_audio_file', { path });
          const name = path.split(/[\\/]/).pop() || 'audio';
          const extension = name.split('.').pop()?.toLowerCase();
          const mime = { mp3: 'audio/mpeg', flac: 'audio/flac', wav: 'audio/wav', ogg: 'audio/ogg', m4a: 'audio/mp4', aac: 'audio/aac', opus: 'audio/ogg', aiff: 'audio/aiff', webm: 'audio/webm' }[extension] || 'application/octet-stream';
          return new File([new Uint8Array(bytes)], name, { type: mime, lastModified: Date.now() });
        }));
        if (files.length) await importFiles(files);
      } catch { toast('File yang dilepas tidak dapat dibaca oleh aplikasi.'); }
    });
  } catch (error) {
    console.error('Tauri native file drop unavailable', error);
    // Running in a regular browser, where the DOM drop handler is used instead.
  }
}
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
const canvas = $('#spectrum'), painter = canvas?.getContext('2d');
let lastFrame = 0;
let smoothedL = 0, smoothedR = 0;
let needleAngleL = -45, needleAngleR = 45;
let lastMeterTimestamp = 0;
let peakHoldL = 0, peakHoldR = 0;
let spectrumBins = new Uint8Array(1024);
let waveformSamples = new Uint8Array(2048);
let channelBinsL = new Uint8Array(0);
let channelBinsR = new Uint8Array(0);

function paintSpectrum(timestamp) {
  requestAnimationFrame(paintSpectrum);
  if (document.hidden) return;

  const isPlayingAudio = !audio.paused && !audio.muted && state.volume > 0;
  if (analyser && spectrumBins.length !== analyser.frequencyBinCount) spectrumBins = new Uint8Array(analyser.frequencyBinCount);
  const bins = spectrumBins;
  if (analyser && isPlayingAudio) {
    analyser.getByteFrequencyData(bins);
  }

  const needsMeters = isPlayingAudio || smoothedL > 0.004 || smoothedR > 0.004 || peakHoldL > 0.5 || peakHoldR > 0.5;
  if (!needsMeters && (!canvas || canvas.clientWidth === 0)) return;

  // Render spectrum canvas in library drawer ONLY if drawer is visible
  if (canvas && canvas.clientWidth > 0 && timestamp - lastFrame >= 30) {
    lastFrame = timestamp;
    const width = canvas.clientWidth, height = canvas.clientHeight, dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    painter.setTransform(dpr, 0, 0, dpr, 0, 0);
    painter.clearRect(0, 0, width, height);
    const count = 36, gap = 2, barWidth = (width - (count - 1) * gap) / count;
    for (let i = 0; i < count; i++) {
      const hz = 35 * Math.pow(16000 / 35, i / (count - 1));
      const bin = Math.min(bins.length - 1, Math.floor(hz / (context?.sampleRate || 44100) * (analyser?.fftSize || 2048)));
      const value = audio.paused ? 0 : bins[bin] / 255;
      const segments = Math.max(1, Math.round(value * (height / 4)));
      for (let segment = 0; segment < Math.floor(height / 4); segment++) {
        painter.fillStyle = segment < segments ? (segment > height / 6 ? '#efc184' : '#bc945b') : '#a68c5810';
        painter.fillRect(i * (barWidth + gap), height - (segment + 1) * 4, barWidth, 2);
      }
    }
    const waveform = $('#waveform');
    const wavePainter = waveform?.getContext('2d');
    if (waveform && wavePainter) {
      const waveWidth = waveform.clientWidth, waveHeight = waveform.clientHeight, waveDpr = window.devicePixelRatio || 1;
      if (waveform.width !== Math.round(waveWidth * waveDpr) || waveform.height !== Math.round(waveHeight * waveDpr)) {
        waveform.width = Math.round(waveWidth * waveDpr);
        waveform.height = Math.round(waveHeight * waveDpr);
      }
      wavePainter.setTransform(waveDpr, 0, 0, waveDpr, 0, 0);
      wavePainter.clearRect(0, 0, waveWidth, waveHeight);
      wavePainter.strokeStyle = '#d9a261';
      wavePainter.lineWidth = 1;
      wavePainter.beginPath();
      if (analyser && waveformSamples.length !== analyser.fftSize) waveformSamples = new Uint8Array(analyser.fftSize);
      const samples = waveformSamples;
      if (analyser && !audio.paused) analyser.getByteTimeDomainData(samples);
      for (let i = 0; i < waveWidth; i++) {
        const sample = samples[Math.floor(i / waveWidth * samples.length)] || 128;
        const y = sample / 255 * waveHeight;
        i ? wavePainter.lineTo(i, y) : wavePainter.moveTo(i, y);
      }
      wavePainter.stroke();
    }
  }

  // Update hardware analog twin VU meters & VFD Watts bargraphs on front panel
  let rawL = 0, rawR = 0;
  if (isPlayingAudio) {
    if (analyserL && analyserR) {
      // TRUE STEREO: read each channel independently via ChannelSplitter
      if (channelBinsL.length !== analyserL.frequencyBinCount) channelBinsL = new Uint8Array(analyserL.frequencyBinCount);
      if (channelBinsR.length !== analyserR.frequencyBinCount) channelBinsR = new Uint8Array(analyserR.frequencyBinCount);
      const binsL = channelBinsL;
      const binsR = channelBinsR;
      analyserL.getByteFrequencyData(binsL);
      analyserR.getByteFrequencyData(binsR);
      // Full-spectrum average (bins 1..512 covers ~20 Hz → ~11 kHz)
      const span = Math.min(512, binsL.length - 1);
      let sumL = 0, sumR = 0;
      for (let b = 1; b <= span; b++) { sumL += binsL[b]; sumR += binsR[b]; }
      rawL = (sumL / span) / 255;
      rawR = (sumR / span) / 255;
    } else if (analyser) {
      // MONO FALLBACK: use the same full-spectrum reading for both needles
      const span = Math.min(512, bins.length - 1);
      let sum = 0;
      for (let b = 1; b <= span; b++) sum += bins[b];
      rawL = rawR = (sum / span) / 255;
    }

    // Fallback if audio graph has no data or directAudio mode
    if (rawL < 0.02 && rawR < 0.02 && !audio.paused) {
      const t = audio.currentTime;
      // Balanced harmonic base — identical for both channels
      const base = (Math.sin(t * Math.PI * 3.6) ** 2 * 0.6 + (Math.sin(t * 7.2) * 0.5 + 0.5) * 0.35 + 0.18);
      // Subtle natural stereo spread (slow sine ≈ gentle panning sway, max ±10%)
      const spread = Math.sin(t * 1.4) * 0.10;
      const volScale = Math.pow(state.volume, 0.6);
      rawL = Math.min(1, Math.max(0, (base + spread) * volScale));
      rawR = Math.min(1, Math.max(0, (base - spread) * volScale));
    } else {
      const volScale = Math.pow(state.volume, 0.5);
      rawL = Math.min(1, rawL * 1.45 * volScale);
      rawR = Math.min(1, rawR * 1.45 * volScale);
    }
  }

  // Moving-coil VU ballistics: time-based attack and long, stable decay.
  // Time-based coefficients keep the motion consistent across different frame rates.
  const meterDt = lastMeterTimestamp ? Math.min(0.05, Math.max(0.001, (timestamp - lastMeterTimestamp) / 1000)) : 1 / 60;
  lastMeterTimestamp = timestamp;
  const attackAlpha = 1 - Math.exp(-meterDt / 0.24);
  const releaseAlpha = 1 - Math.exp(-meterDt / 0.8);
  if (rawL > smoothedL) {
    smoothedL += (rawL - smoothedL) * attackAlpha;
  } else {
    smoothedL += (rawL - smoothedL) * releaseAlpha;
  }

  if (rawR > smoothedR) {
    smoothedR += (rawR - smoothedR) * attackAlpha;
  } else {
    smoothedR += (rawR - smoothedR) * releaseAlpha;
  }

  if (!isPlayingAudio) {
    // The release filter above handles the return to rest when playback stops.
    if (smoothedL < 0.004) smoothedL = 0;
    if (smoothedR < 0.004) smoothedR = 0;
  }

  // 1. Animate both analog needles from one shared stereo level.
  // This keeps the left and right indicators synchronized and mirrored.
  const needleL = $('#vu-needle-left');
  const needleR = $('#vu-needle-right');
  const syncLevel = Math.min(1, (smoothedL + smoothedR) * 0.5);
  const targetAngleL = -45 - syncLevel * 90;
  const targetAngleR = 45 + syncLevel * 90;
  const needleAlpha = 1 - Math.exp(-meterDt / 0.22);
  needleAngleL += (targetAngleL - needleAngleL) * needleAlpha;
  needleAngleR += (targetAngleR - needleAngleR) * needleAlpha;
  if (needleL) needleL.style.transform = `rotate(${needleAngleL.toFixed(2)}deg)`;
  if (needleR) needleR.style.transform = `rotate(${needleAngleR.toFixed(2)}deg)`;

  // 2. Animate VFD horizontal Watts bargraphs (0 to 12 segments)
  const spkL = $('#spk-left')?.classList.contains('active') ?? true;
  const spkR = $('#spk-right')?.classList.contains('active') ?? true;
  const isStereo = $('#spk-stereo')?.classList.contains('active') ?? true;
  const showPeak = $('#dsp-peak')?.classList.contains('active') ?? true;

  const valL = isStereo ? smoothedL : (smoothedL + smoothedR) / 2;
  const valR = isStereo ? smoothedR : (smoothedL + smoothedR) / 2;

  const litL = spkL ? Math.min(12, Math.round(valL * 12)) : 0;
  const litR = spkR ? Math.min(12, Math.round(valR * 12)) : 0;

  if (litL > peakHoldL) { peakHoldL = litL; } else { peakHoldL = Math.max(0, peakHoldL - 0.18); }
  if (litR > peakHoldR) { peakHoldR = litR; } else { peakHoldR = Math.max(0, peakHoldR - 0.18); }
  const peakIdxL = showPeak ? Math.round(peakHoldL) - 1 : -1;
  const peakIdxR = showPeak ? Math.round(peakHoldR) - 1 : -1;

  const segsL = $$('#watts-track-left .watts-seg');
  const segsR = $$('#watts-track-right .watts-seg');
  segsL.forEach((seg, idx) => {
    const active = idx < litL;
    seg.classList.toggle('active', active);
    seg.classList.toggle('peak', idx === peakIdxL && idx >= litL && peakHoldL > 1);
  });
  segsR.forEach((seg, idx) => {
    const active = idx < litR;
    seg.classList.toggle('active', active);
    seg.classList.toggle('peak', idx === peakIdxR && idx >= litR && peakHoldR > 1);
  });
}
function makeDraggable(dialog, handle) {
  let isDragging = false;
  let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

  const onStart = (clientX, clientY, target) => {
    if (target.closest('button, input, select, label')) return;
    isDragging = true;
    startX = clientX;
    startY = clientY;
    const rect = dialog.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    dialog.style.position = 'fixed';
    dialog.style.left = `${initialLeft}px`;
    dialog.style.top = `${initialTop}px`;
    dialog.style.transform = 'none';
    dialog.style.margin = '0';
  };

  const onMove = (clientX, clientY) => {
    if (!isDragging) return;
    const dx = clientX - startX;
    const dy = clientY - startY;
    const maxLeft = Math.max(0, window.innerWidth - dialog.offsetWidth);
    const maxTop = Math.max(0, window.innerHeight - dialog.offsetHeight);
    dialog.style.left = `${Math.max(0, Math.min(maxLeft, initialLeft + dx))}px`;
    dialog.style.top = `${Math.max(0, Math.min(maxTop, initialTop + dy))}px`;
  };

  const onEnd = () => { isDragging = false; };

  handle.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY, e.target));
  window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', onEnd);

  handle.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) onStart(e.touches[0].clientX, e.touches[0].clientY, e.target);
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener('touchend', onEnd);
}

function syncDspUi() {
  const setVal = (id, val) => {
    const el = $(`#${id}`);
    if (el) el.value = val;
  };
  setVal('aimp-slider-echo', state.dsp.echo);
  setVal('aimp-slider-reverb', state.dsp.reverb);
  setVal('aimp-slider-flanger', state.dsp.flanger);
  setVal('aimp-slider-chorus', state.dsp.chorus);
  setVal('aimp-slider-bass', state.dsp.bass);
  setVal('aimp-slider-stereo', state.dsp.stereo);
  setVal('aimp-slider-speed', state.dsp.speed);
  setVal('aimp-slider-tempo', state.dsp.tempo);
  setVal('aimp-slider-pitch', state.dsp.pitch);

  const checkVoice = $('#aimp-check-voice-remover');
  if (checkVoice) checkVoice.checked = Boolean(state.dsp.voiceRemover);
  const checkFadePause = $('#aimp-check-fade-pause');
  if (checkFadePause) checkFadePause.checked = Boolean(state.dsp.fadePause);
  const checkFadeNav = $('#aimp-check-fade-nav');
  if (checkFadeNav) checkFadeNav.checked = Boolean(state.dsp.fadeNav);

  // Equalizer
  const eqPreset = $('#aimp-eq-preset');
  if (eqPreset) eqPreset.value = state.preset || 'Flat';
  frequencies.forEach((_, i) => {
    setVal(`aimp-eq-band-${i}`, state.eq[i]);
    const out = $(`#aimp-eq-val-${i}`);
    if (out) out.textContent = state.eq[i] > 0 ? `+${state.eq[i]}` : String(state.eq[i]);
  });

  // Volume & Mixing
  setVal('aimp-slider-preamp', state.preamp);
  if ($('#aimp-preamp-val')) $('#aimp-preamp-val').textContent = `${state.preamp > 0 ? `+${state.preamp}` : state.preamp} dB`;
  setVal('aimp-slider-balance', state.balance);
  if ($('#aimp-balance-val')) $('#aimp-balance-val').textContent = state.balance === 0 ? '0 (Center)' : (state.balance < 0 ? `L ${Math.abs(Math.round(state.balance * 100))}%` : `R ${Math.round(state.balance * 100)}%`);
  const checkReplay = $('#aimp-check-replaygain');
  if (checkReplay) checkReplay.checked = Boolean(state.replayGain);
  setVal('aimp-slider-crossfade', state.crossfade);
  if ($('#aimp-crossfade-val')) $('#aimp-crossfade-val').textContent = `${state.crossfade} s`;
  const checkGapless = $('#aimp-check-gapless');
  if (checkGapless) checkGapless.checked = Boolean(state.gapless);
}

function openDspDialog(tab = 'general') {
  const dialog = $('#dsp-dialog');
  if (!dialog) return;

  const tabEl = $(`#aimp-tab-${tab}`);
  if (tabEl) tabEl.click();

  if (dialog.open) return;

  setupAudio();
  syncDspUi();

  try {
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  } catch (err) {
    console.warn('showModal error:', err);
    dialog.setAttribute('open', '');
  }
}

function setupDspDialog() {
  const dialog = $('#dsp-dialog');
  if (!dialog) return;

  const titlebar = $('#aimp-titlebar');
  if (titlebar) {
    makeDraggable(dialog, titlebar);
  }

  // Close helper
  const closeDsp = () => {
    if (!dialog.open) return;
    try {
      dialog.close();
    } catch {
      dialog.removeAttribute('open');
    }
  };

  // Close buttons
  const closeBtn = $('#aimp-close-btn');
  const closeX = $('#aimp-close-x');
  if (closeBtn) closeBtn.onclick = closeDsp;
  if (closeX) closeX.onclick = closeDsp;

  // Backdrop click closes dialog
  dialog.addEventListener('click', (e) => {
    if (!dialog.open) return;
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) closeDsp();
  });

  // Tab switching
  $$('#dsp-dialog .aimp-tab').forEach(tab => {
    tab.onclick = () => {
      $$('#dsp-dialog .aimp-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const tabName = tab.dataset.tab;
      $$('#dsp-dialog .aimp-panel').forEach(p => { p.hidden = true; });
      const targetPanel = $(`#aimp-panel-${tabName}`);
      if (targetPanel) targetPanel.hidden = false;
    };
  });

  // Sliders mapping in General tab
  const slidersConfig = [
    { id: 'aimp-slider-echo', key: 'echo', def: 0 },
    { id: 'aimp-slider-reverb', key: 'reverb', def: 0 },
    { id: 'aimp-slider-flanger', key: 'flanger', def: 0 },
    { id: 'aimp-slider-chorus', key: 'chorus', def: 0 },
    { id: 'aimp-slider-bass', key: 'bass', def: 0 },
    { id: 'aimp-slider-stereo', key: 'stereo', def: 0 },
    { id: 'aimp-slider-speed', key: 'speed', def: 100 },
    { id: 'aimp-slider-tempo', key: 'tempo', def: 100 },
    { id: 'aimp-slider-pitch', key: 'pitch', def: 0 }
  ];

  slidersConfig.forEach(({ id, key, def }) => {
    const slider = $(`#${id}`);
    if (!slider) return;
    slider.dataset.key = key;
    slider.dataset.default = String(def);

    slider.oninput = (e) => {
      const val = Number(e.target.value);
      state.dsp[key] = val;
      applyDspSettings();
      persist();
    };

    // Right click reset
    slider.oncontextmenu = (e) => {
      e.preventDefault();
      slider.value = String(def);
      state.dsp[key] = def;
      applyDspSettings();
      persist();
    };
  });

  // Checkboxes in General tab
  const checkVoice = $('#aimp-check-voice-remover');
  if (checkVoice) {
    checkVoice.onchange = (e) => {
      state.dsp.voiceRemover = e.target.checked;
      applyDspSettings();
      persist();
    };
  }

  const checkFadePause = $('#aimp-check-fade-pause');
  if (checkFadePause) {
    checkFadePause.onchange = (e) => {
      state.dsp.fadePause = e.target.checked;
      persist();
    };
  }

  const checkFadeNav = $('#aimp-check-fade-nav');
  if (checkFadeNav) {
    checkFadeNav.onchange = (e) => {
      state.dsp.fadeNav = e.target.checked;
      persist();
    };
  }

  // Reset to Defaults button
  const resetBtn = $('#aimp-reset-all');
  if (resetBtn) {
    resetBtn.onclick = () => {
      state.dsp = {
        echo: 0,
        reverb: 0,
        flanger: 0,
        chorus: 0,
        bass: 0,
        stereo: 0,
        speed: 100,
        tempo: 100,
        pitch: 0,
        voiceRemover: false,
        fadePause: true,
        fadeNav: true
      };
      syncDspUi();
      applyDspSettings();
      persist();
      toast('Sound Effects diatur ulang ke bawaan.');
    };
  }

  // Subpanel: Equalizer in DSP Manager
  const aimpEqGrid = $('#aimp-eq-grid');
  if (aimpEqGrid) {
    aimpEqGrid.innerHTML = frequencies.map((freq, i) => `
      <label class="aimp-eq-slider-band">
        <output id="aimp-eq-val-${i}">${state.eq[i] > 0 ? `+${state.eq[i]}` : state.eq[i]}</output>
        <input type="range" id="aimp-eq-band-${i}" min="-12" max="12" step="1" value="${state.eq[i]}" data-band="${i}" />
        <span>${freq >= 1000 ? `${freq / 1000}k` : freq}</span>
      </label>
    `).join('');
    aimpEqGrid.querySelectorAll('input').forEach(input => {
      input.oninput = (e) => {
        const idx = Number(e.target.dataset.band);
        const val = Number(e.target.value);
        state.eq[idx] = val;
        if (filters[idx]) filters[idx].gain.setTargetAtTime(val, context?.currentTime || 0, 0.03);
        const out = $(`#aimp-eq-val-${idx}`);
        if (out) out.textContent = val > 0 ? `+${val}` : String(val);
        const mainInput = $(`#eq-band-${idx}`);
        if (mainInput) mainInput.value = String(val);
        persist();
      };
      input.oncontextmenu = (e) => {
        e.preventDefault();
        input.value = '0';
        input.dispatchEvent(new Event('input'));
      };
    });
  }

  const aimpEqPreset = $('#aimp-eq-preset');
  if (aimpEqPreset) {
    aimpEqPreset.value = state.preset || 'Flat';
    aimpEqPreset.onchange = (e) => {
      const preset = e.target.value;
      const mainPreset = $('#eq-preset');
      if (mainPreset) {
        mainPreset.value = preset;
        mainPreset.dispatchEvent(new Event('change'));
      }
      syncDspUi();
    };
  }

  const aimpEqReset = $('#aimp-eq-reset-btn');
  if (aimpEqReset) {
    aimpEqReset.onclick = () => {
      $('#eq-reset')?.click();
      syncDspUi();
    };
  }

  // Subpanel: Volume in DSP Manager
  const aimpPreamp = $('#aimp-slider-preamp');
  if (aimpPreamp) {
    aimpPreamp.oninput = (e) => {
      state.preamp = Number(e.target.value);
      if ($('#aimp-preamp-val')) $('#aimp-preamp-val').textContent = `${state.preamp > 0 ? `+${state.preamp}` : state.preamp} dB`;
      applyAudioSettings();
      syncSettings();
      persist();
    };
  }
  const aimpBalance = $('#aimp-slider-balance');
  if (aimpBalance) {
    aimpBalance.oninput = (e) => {
      state.balance = Number(e.target.value);
      if ($('#aimp-balance-val')) $('#aimp-balance-val').textContent = state.balance === 0 ? '0 (Center)' : (state.balance < 0 ? `L ${Math.abs(Math.round(state.balance * 100))}%` : `R ${Math.round(state.balance * 100)}%`);
      applyAudioSettings();
      syncSettings();
      persist();
    };
  }
  const aimpReplay = $('#aimp-check-replaygain');
  if (aimpReplay) {
    aimpReplay.onchange = (e) => {
      state.replayGain = e.target.checked;
      applyAudioSettings();
      syncSettings();
      persist();
    };
  }

  // Subpanel: Mixing in DSP Manager
  const aimpCrossfade = $('#aimp-slider-crossfade');
  if (aimpCrossfade) {
    aimpCrossfade.oninput = (e) => {
      state.crossfade = Number(e.target.value);
      if ($('#aimp-crossfade-val')) $('#aimp-crossfade-val').textContent = `${state.crossfade} s`;
      syncSettings();
      persist();
    };
  }
  const aimpGapless = $('#aimp-check-gapless');
  if (aimpGapless) {
    aimpGapless.onchange = (e) => {
      state.gapless = e.target.checked;
      audio.preload = state.gapless ? 'auto' : 'metadata';
      syncSettings();
      persist();
    };
  }

  // Subpanel: Remove Silence in DSP Manager
  const aimpSkipSilence = $('#aimp-check-skip-silence');
  if (aimpSkipSilence) {
    aimpSkipSilence.onchange = (e) => {
      toast(e.target.checked ? 'Pendeteksi hening aktif.' : 'Pendeteksi hening dinonaktifkan.');
    };
  }
  const aimpSilence = $('#aimp-slider-silence');
  if (aimpSilence) {
    aimpSilence.oninput = (e) => {
      if ($('#aimp-silence-thresh-val')) $('#aimp-silence-thresh-val').textContent = `${e.target.value} dB`;
    };
  }
}

requestAnimationFrame(paintSpectrum);
window.addEventListener('pagehide', persist);
async function init() {
  addAdvancedUI(); applyTheme(); applyPanelOrder(); applyCompactState();
  setupRackControls();
  setupDspDialog();
  render();
  try { db = await openDB(); const stored = await dbAction('readonly', store => store.getAll()); state.tracks.push(...stored.filter(t => t?.id && t.file instanceof Blob)); const directory = await directoryAction('readonly', store => store.get('music-root')); if (directory?.handle && (await directory.handle.queryPermission({ mode: 'read' })) === 'granted') { const files = await filesFromDirectory(directory.handle); await importFiles(files); } }
  catch { toast('Penyimpanan lokal tidak tersedia. Musik impor hanya tersimpan untuk sesi ini.'); }
  state.playlists.forEach(playlist => { playlist.ids = playlist.ids.filter(findTrack); });
  if (!findTrack(state.currentId)) state.currentId = null;
  state.queue = state.queue.filter(findTrack); state.recent = state.recent.filter(findTrack);
  render();
  if ($('#eq-preset')) $('#eq-preset').value = state.preset;
  if ($('#preset-label')) $('#preset-label').textContent = presetLabels[state.preset] || state.preset;
  if (state.currentId) await selectTrack(state.currentId, false, state.positions[state.currentId] ?? saved.position ?? 0);
  await applyOutputDevice();
  if (!state.onboarded) welcomeDialog?.showModal();
}
initTauriFileDrop();
init();
