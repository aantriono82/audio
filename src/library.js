export const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const formatTime = seconds => `${Math.floor((seconds || 0) / 60).toString().padStart(2, '0')}:${Math.floor((seconds || 0) % 60).toString().padStart(2, '0')}`;

export const demoTracks = [
  ['Amber Skies', 'After Hours', 0, 130.81],
  ['Slow Sunday', 'Soft Focus', 1, 146.83],
  ['Midnight Transit', 'Night Signals', 2, 110],
  ['A Little Further', 'Daydreams', 3, 164.81],
  ['Tape Memories', 'Analog Diaries', 4, 123.47],
  ['Home Again', 'Quiet Places', 5, 174.61],
].map(([title, album, art, frequency], index) => ({
  id: `demo-${index}`, title, album, artist: 'Atiga Sessions', art, frequency,
  duration: 32, format: 'WAV', demo: true,
}));

// Original, generated instrumental previews. No remote audio or copyrighted recordings.
export function demoBlob(track) {
  const sampleRate = 22050, length = sampleRate * track.duration;
  const buffer = new ArrayBuffer(44 + length * 2), view = new DataView(buffer);
  const write = (offset, value) => [...value].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));
  write(0, 'RIFF'); view.setUint32(4, 36 + length * 2, true); write(8, 'WAVE'); write(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); write(36, 'data'); view.setUint32(40, length * 2, true);
  const notes = [1, 1.25, 1.5, 1.875, 2, 1.5, 1.25, 1.125];
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate, beat = t % .5, bar = Math.floor(t / 4) % 4;
    const root = track.frequency * [1, .75, .89, .84][bar];
    const chord = (Math.sin(t * root * 2 * Math.PI) + .5 * Math.sin(t * root * 2.5 * Math.PI) + .35 * Math.sin(t * root * 3 * Math.PI)) * .1;
    const note = root * notes[(Math.floor(t * 2) + track.art) % notes.length] * 2;
    const pluck = Math.sin(t * note * 2 * Math.PI) * Math.exp(-beat * 8) * .14;
    const kick = Math.sin(2 * Math.PI * (47 * beat + 3 * (1 - Math.exp(-beat * 25)))) * Math.exp(-beat * 25) * .12;
    const fade = Math.min(1, t / 1.2, (track.duration - t) / 1.8);
    view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, (chord + pluck + kick) * fade)) * 32767, true);
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

export function baseTracks(state) {
  const findTrack = id => state.tracks.find(t => t.id === id);
  if (state.view === 'smart:frequent') return state.tracks.filter(track => (state.playCounts?.[track.id] || 0) >= 3);
  if (state.view === 'smart:unplayed') return state.tracks.filter(track => !(state.playCounts?.[track.id] || 0));
  const grouped = state.view.match(/^(artist|album|genre):(.*)$/);
  if (grouped) return state.tracks.filter(track => String(track[grouped[1]] || 'Tidak diketahui') === grouped[2]);
  if (state.view === 'favorites') return state.tracks.filter(t => state.favorites.has(t.id));
  if (state.view === 'recent') return state.recent.map(findTrack).filter(Boolean);
  const playlist = state.playlists.find(p => p.id === state.view);
  return playlist ? playlist.ids.map(findTrack).filter(Boolean) : state.tracks;
}
export function visibleTracks(state) {
  const findTrack = id => state.tracks.find(t => t.id === id);
  let tracks = state.queueView ? state.queue.map(findTrack).filter(Boolean) : [...baseTracks(state)];
  if (state.search) tracks = tracks.filter(t => `${t.title} ${t.artist} ${t.album}`.toLowerCase().includes(state.search));
  if (state.sortAsc && !state.queueView) tracks.sort((a,b) => a.title.localeCompare(b.title));
  return tracks;
}
