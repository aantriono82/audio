import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { demoBlob, demoTracks, type Track } from '../domain/track';

export type PlaybackState = {
  tracks: readonly Track[];
  current: Track;
  playing: boolean;
  elapsed: number;
  duration: number;
};

export function usePlayback(): PlaybackState & { select: (track: Track) => void; toggle: () => void; next: () => void; previous: () => void; seek: (seconds: number) => void } {
  const audio = useRef(new Audio());
  const [current, setCurrent] = useState(demoTracks[0]);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(current.duration);
  const urls = useRef(new Map<string, string>());
  const index = useMemo(() => demoTracks.findIndex((track) => track.id === current.id), [current]);

  useEffect(() => {
    const element = audio.current;
    const onTime = () => setElapsed(element.currentTime);
    const onLoaded = () => setDuration(Number.isFinite(element.duration) ? element.duration : 32);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    element.addEventListener('timeupdate', onTime); element.addEventListener('loadedmetadata', onLoaded);
    element.addEventListener('play', onPlay); element.addEventListener('pause', onPause); element.addEventListener('ended', onEnded);
    return () => { element.pause(); element.removeEventListener('timeupdate', onTime); element.removeEventListener('loadedmetadata', onLoaded); element.removeEventListener('play', onPlay); element.removeEventListener('pause', onPause); element.removeEventListener('ended', onEnded); urls.current.forEach((url) => URL.revokeObjectURL(url)); };
  }, []);

  const select = useCallback((track: Track) => {
    const element = audio.current;
    let url = urls.current.get(track.id);
    if (!url) { url = URL.createObjectURL(demoBlob(track)); urls.current.set(track.id, url); }
    element.src = url; element.currentTime = 0; setCurrent(track); setElapsed(0); setDuration(track.duration);
    void element.play().catch(() => setPlaying(false));
  }, []);
  const toggle = useCallback(() => { if (audio.current.paused) void audio.current.play().catch(() => setPlaying(false)); else audio.current.pause(); }, []);
  const next = useCallback(() => select(demoTracks[(index + 1) % demoTracks.length]), [index, select]);
  const previous = useCallback(() => select(demoTracks[(index - 1 + demoTracks.length) % demoTracks.length]), [index, select]);
  const seek = useCallback((seconds: number) => { audio.current.currentTime = seconds; setElapsed(seconds); }, []);
  return { tracks: demoTracks, current, playing, elapsed, duration, select, toggle, next, previous, seek };
}
