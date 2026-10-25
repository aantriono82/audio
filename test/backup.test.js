import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveBackupCollections, restoreCollections } from '../src/backup.js';

const tracks = [
  { id: 'one', fingerprint: 'sha256:one' },
  { id: 'two', fingerprint: 'sha256:two' }
];

test('backup restore resolves ids by content fingerprint and merges collections', () => {
  const resolver = resolveBackupCollections(tracks, [{ id: 'old-one', fingerprint: 'sha256:one' }]);
  const restored = restoreCollections({
    favorites: new Set(['two']),
    playlists: [{ id: 'mix', name: 'Mix', ids: ['two'] }],
    recent: ['two'],
    queue: [],
    positions: {}
  }, {
    favorites: ['old-one'],
    playlists: [{ id: 'mix', name: 'Mix', ids: ['old-one'] }],
    recent: ['old-one'],
    queue: ['old-one'],
    positions: { 'old-one': 12 }
  }, 'merge', resolver);
  assert.deepEqual([...restored.favorites].sort(), ['one', 'two']);
  assert.deepEqual(restored.playlists[0].ids.sort(), ['one', 'two']);
  assert.deepEqual(restored.queue, ['one']);
  assert.equal(restored.positions.one, 12);
});

test('replace restore discards current collection references explicitly', () => {
  const resolver = resolveBackupCollections(tracks, [{ id: 'old-one', fingerprint: 'sha256:one' }]);
  const restored = restoreCollections({ favorites: new Set(['two']), playlists: [], recent: ['two'], queue: [], positions: {} }, {
    favorites: ['old-one'], playlists: [], recent: [], queue: [], positions: {}
  }, 'replace', resolver);
  assert.deepEqual([...restored.favorites], ['one']);
  assert.deepEqual(restored.recent, []);
});
