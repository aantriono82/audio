const toHex = bytes => [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');

export function legacyFingerprint(entry) {
  return `${entry?.name || ''}:${entry?.size || 0}:${entry?.lastModified || 0}`;
}

export async function contentFingerprint(file, entry = file) {
  if (!file || typeof file.arrayBuffer !== 'function') return legacyFingerprint(entry);
  try {
    const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
    return `sha256:${toHex(digest)}`;
  } catch {
    return legacyFingerprint(entry);
  }
}
