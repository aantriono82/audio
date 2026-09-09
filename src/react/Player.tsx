import { type Track } from '../domain/track';
import { usePlayback } from './usePlayback';

function time(value: number) { return `${Math.floor(value / 60).toString().padStart(2, '0')}:${Math.floor(value % 60).toString().padStart(2, '0')}`; }

export function Player({ onLegacy }: { onLegacy: () => void }) {
  const playback = usePlayback();
  return <section className="react-player">
    <header className="react-player-header"><div><p className="eyebrow">ATIGA AMP / REACT PLAYER</p><h1>Your music<span>.</span></h1><p>Model track dan playback state sudah dipindahkan ke TypeScript.</p></div><button className="legacy-button" onClick={onLegacy}>Buka UI legacy</button></header>
    <div className="react-now"><div className={`react-art art-${playback.current.art}`}><span>AA</span></div><div><p className="eyebrow">NOW PLAYING</p><h2>{playback.current.title}</h2><p>{playback.current.artist} · {playback.current.album}</p><div className="react-controls"><button onClick={playback.previous} aria-label="Lagu sebelumnya">‹</button><button className="react-play" onClick={playback.toggle} aria-label={playback.playing ? 'Jeda' : 'Putar'}>{playback.playing ? 'Ⅱ' : '▶'}</button><button onClick={playback.next} aria-label="Lagu berikutnya">›</button></div><div className="react-seek"><span>{time(playback.elapsed)}</span><input type="range" min="0" max={playback.duration} step="0.1" value={playback.elapsed} onChange={(event) => playback.seek(Number(event.target.value))} aria-label="Posisi pemutaran" /><span>{time(playback.duration)}</span></div></div></div>
    <div className="react-library"><p className="eyebrow">LIBRARY / {playback.tracks.length} DEMO TRACKS</p>{playback.tracks.map((track: Track) => <button className={`react-track ${track.id === playback.current.id ? 'current' : ''}`} key={track.id} onClick={() => playback.select(track)}><span>{track.title}</span><small>{track.artist} · {track.album}</small><time>{time(track.duration)}</time></button>)}</div>
  </section>;
}
