import test from 'node:test';
import assert from 'node:assert/strict';
import { isAudioFile, metadataFromFilename, readEmbeddedMetadata } from '../src/import.js';

function concat(...chunks) {
  const result = new Uint8Array(chunks.reduce((size, chunk) => size + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length; }
  return result;
}

function frame(id, text) {
  const body = concat(new Uint8Array([0]), new TextEncoder().encode(text));
  const header = new Uint8Array(10);
  header.set(new TextEncoder().encode(id));
  new DataView(header.buffer).setUint32(4, body.length);
  return concat(header, body);
}

function id3(...frames) {
  const body = concat(...frames);
  const size = new Uint8Array([(body.length >> 21) & 0x7f, (body.length >> 14) & 0x7f, (body.length >> 7) & 0x7f, body.length & 0x7f]);
  return new Blob([concat(new TextEncoder().encode('ID3'), new Uint8Array([3, 0, 0]), size, body)], { type: 'audio/mpeg' });
}

test('audio import accepts audio MIME types and supported extensions', () => {
  assert.equal(isAudioFile(new File(['x'], 'track.bin', { type: 'audio/mpeg' })), true);
  assert.equal(isAudioFile(new File(['x'], 'track.FLAC', { type: 'application/octet-stream' })), true);
  assert.equal(isAudioFile(new File(['x'], 'notes.txt', { type: 'text/plain' })), false);
});

test('filename metadata uses Artist - Title and folder album fallbacks', () => {
  const file = new File(['x'], 'Nujabes - Feather.mp3', { type: 'audio/mpeg' });
  Object.defineProperty(file, 'webkitRelativePath', { value: 'Music/Nujabes/ Nujabes - Feather.mp3' });
  assert.deepEqual(metadataFromFilename(file), { title: 'Feather', artist: 'Nujabes', album: 'Nujabes' });
  assert.deepEqual(metadataFromFilename({ name: 'Nujabes - Feather.mp3', relativePath: 'Music/Nujabes/Nujabes - Feather.mp3' }), { title: 'Feather', artist: 'Nujabes', album: 'Nujabes' });
});

test('ID3 metadata is preferred and replay gain is parsed', async () => {
  const file = new File([await id3(
    frame('TIT2', 'Feather'),
    frame('TPE1', 'Nujabes'),
    frame('TALB', 'Modal Soul'),
    frame('TCON', '(17)Hip-Hop'),
    frame('TXXX', 'replaygain_track_gain\0+3.50 dB'),
  )], 'fallback.mp3', { type: 'audio/mpeg' });
  const metadata = await readEmbeddedMetadata(file);
  assert.equal(metadata.title, 'Feather');
  assert.equal(metadata.artist, 'Nujabes');
  assert.equal(metadata.album, 'Modal Soul');
  assert.equal(metadata.genre, 'Hip-Hop');
  assert.equal(metadata.replayGain, 3.5);
});

test('files without ID3 metadata return an empty result', async () => {
  assert.deepEqual(await readEmbeddedMetadata(new Blob(['plain audio'])), {});
});
