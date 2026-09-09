export type Track = {
  id: string;
  title: string;
  album: string;
  artist: string;
  art: number;
  frequency: number;
  duration: number;
  format: 'WAV';
  demo: true;
};

export const demoTracks: readonly Track[] = [
  ['Amber Skies', 'After Hours', 0, 130.81],
  ['Slow Sunday', 'Soft Focus', 1, 146.83],
  ['Midnight Transit', 'Night Signals', 2, 110],
  ['A Little Further', 'Daydreams', 3, 164.81],
  ['Tape Memories', 'Analog Diaries', 4, 123.47],
  ['Home Again', 'Quiet Places', 5, 174.61],
].map(([title, album, art, frequency], index) => ({
  id: `demo-${index}`, title, album, artist: 'Atiga Sessions', art, frequency,
  duration: 32, format: 'WAV', demo: true,
})) as Track[];

export function demoBlob(track: Track): Blob {
  const sampleRate = 22050;
  const length = sampleRate * track.duration;
  const buffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(buffer);
  const write = (offset: number, value: string) => [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
  write(0, 'RIFF'); view.setUint32(4, 36 + length * 2, true); write(8, 'WAVE'); write(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true); write(36, 'data'); view.setUint32(40, length * 2, true);
  for (let index = 0; index < length; index += 1) {
    const time = index / sampleRate;
    const signal = Math.sin(time * track.frequency * Math.PI * 2) * 0.18;
    const fade = Math.min(1, time / 1.2, (track.duration - time) / 1.8);
    view.setInt16(44 + index * 2, signal * fade * 32767, true);
  }
  return new Blob([buffer], { type: 'audio/wav' });
}
