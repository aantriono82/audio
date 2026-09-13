import { invoke, convertFileSrc, isTauri } from '@tauri-apps/api/core';
import { createSettingsQueue } from './settings-queue.js';

export const desktop = isTauri();
export const nativeSettings = createSettingsQueue(settings => invoke('save_player_settings', { settings }));
export const loadNativeSettings = () => invoke('load_player_settings');
export const loadNativeLibrary = () => invoke('load_audio_library');
export const selectNativeAudio = folder => invoke('select_audio', { folder });
export const scanNativePaths = paths => invoke('scan_audio_paths', { paths });
export const rescanNativeFolder = () => invoke('rescan_audio_folder');
export const removeNativeTrack = id => invoke('remove_audio_track', { id });
export const nativeURL = path => convertFileSrc(path);

function audioType(name) {
  const extension = name.split('.').pop().toLowerCase();
  return { mp3: 'audio/mpeg', wav: 'audio/wav', flac: 'audio/flac', ogg: 'audio/ogg', opus: 'audio/ogg', m4a: 'audio/mp4', aac: 'audio/aac', aiff: 'audio/aiff', webm: 'audio/webm' }[extension] || 'application/octet-stream';
}

async function nativeBlob(path) {
  const response = await fetch(nativeURL(path), { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Audio tidak dapat dibaca (${response.status}).`);
  // The asset protocol may return application/octet-stream. Preserve the
  // codec hint from the filename so WebKitGTK/GStreamer selects the right
  // demuxer for the Blob URL used by the player.
  const blob = await response.blob();
  return new Blob([blob], { type: audioType(path) });
}

export async function readNativeAudio(entry) {
  // Fetch through Tauri's asset protocol instead of serializing the complete
  // file through IPC. Large files otherwise block WebKitGTK while the Vec<u8>
  // is copied into JavaScript.
  const file = new File([await nativeBlob(entry.path)], entry.name, { type: audioType(entry.name), lastModified: entry.lastModified });
  Object.defineProperty(file, 'webkitRelativePath', { value: entry.relativePath });
  return file;
}

// WebKitGTK can reject Tauri's asset://-style media URL even when the same
// URL works for fetch(). Keep the media element on a same-origin Blob URL.
export async function nativeAudioBlob(path) {
  return nativeBlob(path);
}

export async function saveNativeTrack(path, track) {
  const { cover } = track;
  const metadata = { ...track };
  delete metadata.file; delete metadata.cover;
  const bytes = cover ? Array.from(new Uint8Array(await cover.arrayBuffer())) : [];
  return invoke('save_audio_track', { path, track: metadata, cover: bytes });
}
