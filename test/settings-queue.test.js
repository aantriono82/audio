import test from 'node:test';
import assert from 'node:assert/strict';
import { createSettingsQueue } from '../src/settings-queue.js';

test('settings writes remain ordered, snapshot mutable state and flush on close', async () => {
  const writes = [];
  let finishFirst;
  const first = new Promise(resolve => { finishFirst = resolve; });
  const queue = createSettingsQueue(async value => {
    if (!writes.length) await first;
    writes.push(value);
  });
  const state = { volume: 0.2, playlists: ['one'] };
  queue.save(state);
  state.volume = 0.8;
  state.playlists.push('two');
  queue.save(state);
  assert.deepEqual(writes, []);
  finishFirst();
  await queue.flush();
  assert.deepEqual(writes, [{ volume: 0.2, playlists: ['one'] }, { volume: 0.8, playlists: ['one', 'two'] }]);
});

test('a failed settings write is reported and a later save can recover', async () => {
  let attempts = 0;
  const queue = createSettingsQueue(async () => { if (++attempts === 1) throw new Error('Disk full'); });
  await assert.rejects(queue.save({ volume: 0.2 }), /Disk full/);
  await assert.rejects(queue.flush(), /Disk full/);
  await queue.save({ volume: 0.8 });
  await queue.flush();
  assert.equal(attempts, 2);
});
