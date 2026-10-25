import test from 'node:test';
import assert from 'node:assert/strict';
import { contentFingerprint, legacyFingerprint } from '../src/import-helpers.js';

test('content fingerprint is stable across renamed files', async () => {
  const first = new File(['same audio'], 'first.mp3', { type: 'audio/mpeg' });
  const second = new File(['same audio'], 'renamed.mp3', { type: 'audio/mpeg' });
  assert.equal(await contentFingerprint(first), await contentFingerprint(second));
  assert.equal(legacyFingerprint({ name: 'first.mp3', size: 10, lastModified: 1 }), 'first.mp3:10:1');
});
