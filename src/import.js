function decodeText(bytes, encoding = 3) {
  try {
    return new TextDecoder(encoding === 1 ? 'utf-16' : encoding === 2 ? 'utf-16be' : 'utf-8')
      .decode(bytes).replace(/^\uFEFF/, '').replace(/\0+$/, '').trim();
  } catch {
    return new TextDecoder().decode(bytes).replace(/\0+$/, '').trim();
  }
}

function synchsafe(bytes) {
  return ((bytes[0] & 0x7f) << 21) | ((bytes[1] & 0x7f) << 14) | ((bytes[2] & 0x7f) << 7) | (bytes[3] & 0x7f);
}

export function isAudioFile(file) {
  return file.type.startsWith('audio/') || /\.(mp3|wav|ogg|flac|m4a|aac|opus|aiff|webm)$/i.test(file.name);
}

export function metadataFromFilename(file) {
  const name = file.name.replace(/\.[^.]+$/, '');
  const parts = name.split(' - ');
  const relativePath = file.webkitRelativePath || file.relativePath || '';
  return {
    title: parts.length > 1 ? parts.slice(1).join(' - ') : name,
    artist: parts.length > 1 ? parts[0] : 'Artis tidak diketahui',
    album: relativePath.split('/').slice(-2, -1)[0] || 'Koleksi lokal',
  };
}

export async function readEmbeddedMetadata(file) {
  const result = {};
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  if (bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) return result;
  const version = bytes[3];
  const flags = bytes[5];
  const tagSize = synchsafe(bytes.slice(6, 10));
  let offset = 10;
  const end = Math.min(bytes.length, offset + tagSize);
  if (flags & 0x40) {
    const ext = version >= 4 ? synchsafe(bytes.slice(offset, offset + 4)) : 4;
    offset += ext;
  }
  while (offset + 10 <= end) {
    const id = new TextDecoder().decode(bytes.slice(offset, offset + 4));
    if (!/^[A-Z0-9]{3,4}$/.test(id)) break;
    const size = version >= 4 ? synchsafe(bytes.slice(offset + 4, offset + 8)) : new DataView(buffer).getUint32(offset + 4);
    if (!size || offset + 10 + size > end) break;
    const body = bytes.slice(offset + 10, offset + 10 + size);
    const encoding = body[0];
    if (['TIT2', 'TT2'].includes(id)) result.title = decodeText(body.slice(1), encoding);
    if (['TPE1', 'TP1'].includes(id)) result.artist = decodeText(body.slice(1), encoding);
    if (['TALB', 'TAL'].includes(id)) result.album = decodeText(body.slice(1), encoding);
    if (['TCON', 'TCO'].includes(id)) result.genre = decodeText(body.slice(1), encoding).replace(/^\(\d+\)/, '');
    if (id === 'TXXX') {
      const text = decodeText(body.slice(1), encoding);
      const match = text.match(/replaygain_track_gain[\0\s]*([+-]?\d+(?:\.\d+)?)\s*dB/i);
      if (match) result.replayGain = Number(match[1]);
    }
    if (id === 'APIC' || id === 'PIC') {
      let cursor = id === 'PIC' ? 5 : 1;
      const mimeStart = cursor;
      while (cursor < body.length && body[cursor]) cursor++;
      const mime = id === 'PIC' ? `image/${new TextDecoder().decode(body.slice(mimeStart, mimeStart + 3)).toLowerCase()}` : new TextDecoder().decode(body.slice(mimeStart, cursor));
      cursor += 1; cursor += 1;
      while (cursor < body.length && body[cursor]) cursor++;
      cursor += encoding === 0 || encoding === 3 ? 1 : 2;
      if (cursor < body.length) result.cover = new Blob([body.slice(cursor)], { type: mime || 'image/jpeg' });
    }
    offset += 10 + size;
  }
  return result;
}
