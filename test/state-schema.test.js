import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePersistedState, parsePersistedState, STATE_SCHEMA_VERSION } from '../src/state-schema.js';

test('state schema migrates old values and clamps unsafe settings', () => {
  const state = normalizePersistedState({
    volume: 4,
    balance: -4,
    eq: [20, -20],
    favorites: ['a', 'a', 4],
    playlists: [{ name: ' Mix ', ids: ['a', 'a', 4] }]
  });
  assert.equal(state.schemaVersion, STATE_SCHEMA_VERSION);
  assert.equal(state.volume, 1);
  assert.equal(state.balance, -1);
  assert.equal(state.eq.length, 20);
  assert.deepEqual(state.favorites, ['a']);
  assert.deepEqual(state.playlists[0].ids, ['a']);
});

test('corrupt state falls back without throwing', () => {
  let captured;
  const state = parsePersistedState('{broken', (_, error) => { captured = error; });
  assert.equal(state.schemaVersion, STATE_SCHEMA_VERSION);
  assert.ok(captured instanceof Error);
});

test('lite mode defaults off and only accepts booleans', () => {
  assert.equal(normalizePersistedState({}).liteMode, false);
  assert.equal(normalizePersistedState({ liteMode: true }).liteMode, true);
  assert.equal(normalizePersistedState({ liteMode: 'yes' }).liteMode, false);
});
