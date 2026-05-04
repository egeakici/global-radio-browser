import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Car, Volume1, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../../core/store/useStore';
import { StationFavicon } from './StationFavicon';
import { LoadingSpinner } from './LoadingSpinner';

export function NowPlayingBar() {
  const { player, pauseResume, playNext, playPrev, setMode, mode, mapPanelOpen, volume, setVolume } = useStore();
  const [prevVol, setPrevVol] = useState(volume > 0 ? volume : 0.8);

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVol(volume);
      setVolume(0);
    } else {
      setVolume(prevVol);
    }
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const { currentStation, isPlaying, isLoading } = player;

  if (!currentStation) return null;
  if (mode === 'map' && mapPanelOpen) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-2xl px-5 py-4 flex items-center gap-4"
      style={{ zIndex: 1100, background: 'rgba(8, 8, 18, 0.92)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(129,140,248,0.2)', boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(129,140,248,0.05)', width: '520px', maxWidth: 'calc(100vw - 2rem)' }}
    >
      <div className="relative flex-shrink-0">
        <StationFavicon src={currentStation.favicon} name={currentStation.name} size={48} />
        {isPlaying && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#08080f] animate-pulse" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{currentStation.name}</p>
        <p className="text-xs text-muted truncate">
          {currentStation.country}{currentStation.bitrate ? ` · ${currentStation.bitrate}kbps` : ''}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div
          className="volume-control"
          onMouseLeave={e => {
            const active = document.activeElement;
            if (active instanceof HTMLElement && e.currentTarget.contains(active)) {
              active.blur();
            }
          }}
        >
          <button onClick={toggleMute} className="volume-button" aria-label="Toggle mute">
            <VolumeIcon size={18} />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="vol-slider"
            style={{
              background: `linear-gradient(to right, #818cf8 ${volume * 100}%, rgba(255,255,255,0.12) ${volume * 100}%)`,
            }}
            aria-label="Volume"
          />
        </div>

        <div className="w-px h-5 bg-white/10 mx-0.5 flex-shrink-0" />

        <button onClick={() => { void playPrev(); }} className="p-2 text-muted hover:text-white transition-colors" aria-label="Previous station">
          <SkipBack size={18} />
        </button>
        <button
          onClick={() => { void pauseResume(); }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #818cf8, #4f46e5)' }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? <LoadingSpinner size={18} /> : isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button onClick={() => { void playNext(); }} className="p-2 text-muted hover:text-white transition-colors" aria-label="Next station">
          <SkipForward size={18} />
        </button>
        <button onClick={() => setMode('driving')} className="p-2 text-muted hover:text-accent transition-colors" aria-label="Switch to driving mode">
          <Car size={18} />
        </button>
      </div>

      {player.error && (
        <p className="text-xs text-red-400 absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">{player.error}</p>
      )}
    </div>
  );
}
