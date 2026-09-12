import test from 'node:test';
import assert from 'node:assert/strict';
import { esc, formatTime, baseTracks, visibleTracks, queueIndexAtVisibleIndex, demoBlob, demoTracks } from '../src/library.js';

function fixture(overrides = {}) {
  return {
    tracks: [
      { id: 'a', title: 'Zulu', artist: 'Atiga', album: 'Night' },
      { id: 'b', title: 'Amber', artist: 'Guest', album: 'Morning' },
      { id: 'c', title: 'Home', artist: 'Atiga', album: 'Quiet' }
    ],
    favorites: new Set(['b', 'missing']),
    recent: ['c', 'missing', 'a'],
    playlists: [{ id: 'mix', ids: ['b', 'missing', 'c'] }],
    queue: ['c', 'missing', 'b', 'c'],
    view: 'all', queueView: false, search: '', sortAsc: false,
    ...overrides
  };
}
const ids = tracks => tracks.map(track => track.id);

test('esc escapes HTML text and attribute delimiters from imported metadata', () => {
  assert.equal(esc(`<img src="x" onerror='bad'>&`), '&lt;img src=&quot;x&quot; onerror=&#39;bad&#39;&gt;&amp;');
  assert.equal(esc('Atiga Sessions'), 'Atiga Sessions');
  assert.equal(esc(42), '42');
});

for (const [input, expected] of [[undefined, '00:00'], [null, '00:00'], [0, '00:00'], [9.9, '00:09'], [60, '01:00'], [125.8, '02:05'], [3600, '60:00']]) {
  test(`formatTime formats ${input} as ${expected}`, () => assert.equal(formatTime(input), expected));
}

for (const [view, expected] of [
  ['all', ['a', 'b', 'c']], ['favorites', ['b']], ['recent', ['c', 'a']],
  ['mix', ['b', 'c']], ['unknown', ['a', 'b', 'c']]
]) {
  test(`baseTracks selects ${view} and skips unavailable tracks`, () => {
    assert.deepEqual(ids(baseTracks(fixture({ view }))), expected);
  });
}

test('visibleTracks sorts a copy without changing library or playlist order', () => {
  const state = fixture({ sortAsc: true });
  const before = structuredClone(state);
  assert.deepEqual(ids(visibleTracks(state)), ['b', 'c', 'a']);
  assert.deepEqual(state, before);
  state.view = 'mix';
  assert.deepEqual(ids(visibleTracks(state)), ['b', 'c']);
  assert.deepEqual(state.playlists, before.playlists);
});

for (const [search, expected] of [['zulu', ['a']], ['atiga', ['a', 'c']], ['morning', ['b']], ['absent', []]]) {
  test(`visibleTracks searches metadata for "${search}"`, () => {
    assert.deepEqual(ids(visibleTracks(fixture({ search }))), expected);
  });
}

test('search stays within the selected collection', () => {
  assert.deepEqual(visibleTracks(fixture({ view: 'favorites', search: 'atiga' })), []);
});

test('queue keeps explicit order and duplicates even when title sorting is enabled', () => {
  const state = fixture({ queueView: true, sortAsc: true, view: 'favorites' });
  const before = structuredClone(state);
  assert.deepEqual(ids(visibleTracks(state)), ['c', 'b', 'c']);
  assert.deepEqual(state, before);
  state.search = 'home';
  assert.deepEqual(ids(visibleTracks(state)), ['c', 'c']);
});

test('queue removal resolves the original index when search hides earlier items', () => {
  const state = fixture({ queueView: true, search: 'home' });
  assert.equal(queueIndexAtVisibleIndex(state, 0), 0);
  state.queue = ['a', 'c', 'b', 'c'];
  assert.equal(queueIndexAtVisibleIndex(state, 0), 1);
});

test('empty collections and queues return no tracks', () => {
  assert.deepEqual(baseTracks(fixture({ tracks: [] })), []);
  assert.deepEqual(visibleTracks(fixture({ queueView: true, queue: [] })), []);
  assert.deepEqual(baseTracks(fixture({ view: 'favorites', favorites: new Set() })), []);
});

test('demoBlob produces a valid mono PCM WAV with non-silent audio', async () => {
  const blob = demoBlob({ duration: 1, frequency: 130.81, art: 0 });
  assert.equal(blob.type, 'audio/wav');
  assert.equal(blob.size, 44 + 22050 * 2);
  const buffer = await blob.arrayBuffer();
  const view = new DataView(buffer);
  const tag = offset => new TextDecoder().decode(new Uint8Array(buffer, offset, 4));
  assert.equal(tag(0), 'RIFF');
  assert.equal(tag(8), 'WAVE');
  assert.equal(tag(12), 'fmt ');
  assert.equal(tag(36), 'data');
  assert.equal(view.getUint32(4, true), blob.size - 8);
  assert.equal(view.getUint32(16, true), 16);
  assert.equal(view.getUint16(20, true), 1);
  assert.equal(view.getUint16(22, true), 1);
  assert.equal(view.getUint32(24, true), 22050);
  assert.equal(view.getUint32(28, true), 44100);
  assert.equal(view.getUint16(32, true), 2);
  assert.equal(view.getUint16(34, true), 16);
  assert.equal(view.getUint32(40, true), blob.size - 44);
  assert.equal(view.getInt16(44, true), 0);
  let peak = 0;
  for (let offset = 44; offset < buffer.byteLength; offset += 2) {
    peak = Math.max(peak, Math.abs(view.getInt16(offset, true)));
  }
  assert.ok(peak > 100, 'Audio should contain an audible signal');
  assert.ok(peak < 32767, 'Audio should not clip');
});

test('demo catalog contains six playable local previews', () => {
  assert.equal(demoTracks.length, 6);
  assert.ok(demoTracks.every(track => track.demo && track.format === 'WAV' && track.duration > 0));
  assert.equal(new Set(demoTracks.map(track => track.id)).size, demoTracks.length);
});
