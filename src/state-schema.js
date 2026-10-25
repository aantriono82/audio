export const STATE_SCHEMA_VERSION = 2;

const clamp = (value, min, max, fallback) => Number.isFinite(value)
  ? Math.max(min, Math.min(max, value))
  : fallback;

const stringOr = (value, fallback) => typeof value === 'string' ? value : fallback;
const booleanOr = (value, fallback) => typeof value === 'boolean' ? value : fallback;

function normalizeIds(value) {
  return Array.isArray(value) ? [...new Set(value.filter(item => typeof item === 'string'))] : [];
}

function normalizePlaylists(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter(item => item && typeof item.name === 'string')
    .map(item => ({
      id: typeof item.id === 'string' && item.id ? item.id : crypto.randomUUID(),
      name: item.name.trim().slice(0, 100),
      ids: normalizeIds(item.ids)
    }))
    .filter(item => item.name);
}

function normalizeEq(value, bandCount = 20) {
  if (!Array.isArray(value) || ![10, bandCount].includes(value.length)) return Array(bandCount).fill(0);
  const values = value.map(item => clamp(item, -12, 12, 0));
  return values.length === 10 ? values.flatMap(item => [item, item]) : values;
}

export function normalizePersistedState(input, bandCount = 20) {
  const source = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  const rawDsp = source.dsp && typeof source.dsp === 'object' ? source.dsp : {};
  const schemaVersion = Number.isInteger(source.schemaVersion) && source.schemaVersion > 0
    ? source.schemaVersion
    : 1;

  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    favorites: normalizeIds(source.favorites),
    playlists: normalizePlaylists(source.playlists),
    recent: normalizeIds(source.recent).slice(0, 100),
    currentId: typeof source.currentId === 'string' ? source.currentId : null,
    queue: normalizeIds(source.queue),
    positions: source.positions && typeof source.positions === 'object' && !Array.isArray(source.positions)
      ? Object.fromEntries(Object.entries(source.positions)
        .filter(([id, value]) => typeof id === 'string' && Number.isFinite(value) && value >= 0)
        .map(([id, value]) => [id, value]))
      : {},
    shuffle: booleanOr(source.shuffle, false),
    repeat: [0, 1, 2].includes(source.repeat) ? source.repeat : 0,
    volume: clamp(source.volume, 0, 1, .7),
    muted: booleanOr(source.muted, false),
    eq: normalizeEq(source.eq, bandCount),
    preset: stringOr(source.preset, 'Flat').slice(0, 48),
    theme: ['ember', 'neon', 'ocean', 'violet', 'mono'].includes(source.theme) ? source.theme : 'ember',
    glow: booleanOr(source.glow, true),
    gapless: booleanOr(source.gapless, true),
    faceplate: ['champagne', 'black', 'silver'].includes(source.faceplate) ? source.faceplate : 'champagne',
    collectionLayout: ['table', 'grid'].includes(source.collectionLayout) ? source.collectionLayout : 'table',
    compact: typeof source.compact === 'boolean' ? source.compact : undefined,
    viewMode: source.viewMode === 'collection' || source.compact === true ? 'collection' : 'rack',
    resumePlayback: booleanOr(source.resumePlayback, false),
    onboarded: booleanOr(source.onboarded, false),
    crossfade: clamp(source.crossfade, 0, 12, 0),
    preamp: clamp(source.preamp, -12, 12, 0),
    balance: clamp(source.balance, -1, 1, 0),
    replayGain: booleanOr(source.replayGain, true),
    notifications: booleanOr(source.notifications, false),
    eqEnabled: booleanOr(source.eqEnabled, true),
    dspEnabled: booleanOr(source.dspEnabled, true),
    outputDevice: stringOr(source.outputDevice, 'default'),
    groupBy: stringOr(source.groupBy, ''),
    panelOrder: (() => {
      const order = Array.isArray(source.panelOrder) ? [...new Set(source.panelOrder)] : [];
      return order.length === 3 && order.every(item => ['sidebar', 'library', 'now'].includes(item))
        ? order
        : ['sidebar', 'library', 'now'];
    })(),
    playCounts: source.playCounts && typeof source.playCounts === 'object' && !Array.isArray(source.playCounts)
      ? Object.fromEntries(Object.entries(source.playCounts).filter(([id, value]) => typeof id === 'string' && Number.isFinite(value) && value >= 0))
      : {},
    ampHidden: booleanOr(source.ampHidden, false),
    dsp: {
      echo: clamp(rawDsp.echo, 0, 100, 0),
      reverb: clamp(rawDsp.reverb, 0, 100, 0),
      flanger: clamp(rawDsp.flanger, 0, 100, 0),
      chorus: clamp(rawDsp.chorus, 0, 100, 0),
      bass: clamp(rawDsp.bass, -12, 12, 0),
      stereo: clamp(rawDsp.stereo, 0, 100, 0),
      speed: clamp(rawDsp.speed, 50, 150, 100),
      tempo: clamp(rawDsp.tempo, 50, 150, 100),
      pitch: clamp(rawDsp.pitch, -12, 12, 0),
      voiceRemover: booleanOr(rawDsp.voiceRemover, false),
      fadePause: booleanOr(rawDsp.fadePause, true),
      fadeNav: booleanOr(rawDsp.fadeNav, true)
    },
    migratedFrom: schemaVersion < STATE_SCHEMA_VERSION ? schemaVersion : undefined
  };
}

export function parsePersistedState(raw, onCorrupt) {
  if (!raw) return normalizePersistedState({});
  try {
    return normalizePersistedState(JSON.parse(raw));
  } catch (error) {
    onCorrupt?.(raw, error);
    return normalizePersistedState({});
  }
}
