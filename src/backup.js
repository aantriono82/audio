function unique(values) {
  return [...new Set((Array.isArray(values) ? values : []).filter(value => typeof value === 'string'))];
}

export function resolveBackupCollections(currentTracks, backupTracks) {
  const byId = new Map(currentTracks.map(track => [track.id, track]));
  const byFingerprint = new Map(currentTracks.filter(track => track.fingerprint).map(track => [track.fingerprint, track]));
  const backupById = new Map(backupTracks.map(track => [track.id, track]));
  const resolveId = id => byId.get(id)?.id
    || (backupById.get(id)?.fingerprint && byFingerprint.get(backupById.get(id).fingerprint)?.id)
    || null;
  const resolveIds = ids => unique(ids).map(resolveId).filter(Boolean);
  return { byId, byFingerprint, resolveId, resolveIds };
}

export function restoreCollections(current, backup, mode, resolver) {
  const resolvePlaylist = playlist => ({
    id: typeof playlist.id === 'string' && playlist.id ? playlist.id : crypto.randomUUID(),
    name: playlist.name.trim().slice(0, 100),
    ids: resolver.resolveIds(playlist.ids)
  });
  const incomingPlaylists = (Array.isArray(backup.playlists) ? backup.playlists : [])
    .filter(playlist => playlist && typeof playlist.name === 'string' && playlist.name.trim())
    .map(resolvePlaylist);
  const currentPlaylists = Array.isArray(current.playlists) ? current.playlists : [];
  const playlists = mode === 'replace'
    ? incomingPlaylists
    : [...currentPlaylists.map(playlist => ({ ...playlist, ids: unique(playlist.ids) })), ...incomingPlaylists]
      .reduce((result, playlist) => {
        const existing = result.find(item => item.id === playlist.id || item.name === playlist.name);
        if (!existing) result.push(playlist);
        else existing.ids = unique([...existing.ids, ...playlist.ids]);
        return result;
      }, []);
  const incomingRecent = resolver.resolveIds(backup.recent);
  const incomingQueue = resolver.resolveIds(backup.queue);
  const incomingPositions = Object.fromEntries(Object.entries(backup.positions || {})
    .map(([id, value]) => { const resolved = resolver.resolveId(id); return resolved && Number.isFinite(value) ? [resolved, Math.max(0, value)] : null; })
    .filter(Boolean));
  return {
    favorites: mode === 'replace' ? new Set(resolver.resolveIds(backup.favorites)) : new Set([...current.favorites, ...resolver.resolveIds(backup.favorites)]),
    playlists,
    recent: mode === 'replace' ? incomingRecent : unique([...incomingRecent, ...current.recent]).slice(0, 100),
    queue: mode === 'replace' ? incomingQueue : unique([...incomingQueue, ...current.queue]),
    positions: mode === 'replace' ? incomingPositions : { ...current.positions, ...incomingPositions }
  };
}
