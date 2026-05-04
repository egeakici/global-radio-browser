import { useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, Heart, Wifi, WifiOff } from 'lucide-react';
import { useStore } from '../../core/store/useStore';
import { useSwipe } from '../../shared/hooks/useSwipe';
import { StationFavicon } from '../../shared/components/StationFavicon';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import { countryCodeToFlag } from '../../shared/utils/countryFlag';

export function DrivingMode() {
  const {
    player,
    pauseResume,
    playNext,
    playPrev,
    setMode,
    toggleFavorite,
    isFavorite,
    queue,
    queueIndex,
  } = useStore();

  const { currentStation, isPlaying, isLoading, error } = player;

  // Keep screen awake while in driving mode (where supported)
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    if ('wakeLock' in navigator) {
      (navigator as Navigator & { wakeLock: WakeLockManager }).wakeLock
        .request('screen')
        .then(lock => { wakeLock = lock; })
        .catch(() => null);
    }
    return () => { wakeLock?.release().catch(() => null); };
  }, []);

  const swipeHandlers = useSwipe({
    onLeft: () => { void playNext(); },
    onRight: () => { void playPrev(); },
    threshold: 50,
  });

  const favorite = currentStation ? isFavorite(currentStation.stationuuid) : false;

  return (
    <div
      className="fixed inset-0 flex flex-col select-none"
      style={{ background: 'radial-gradient(ellipse at 50% 15%, rgba(79, 70, 229, 0.18) 0%, #08080f 55%)' }}
      {...swipeHandlers}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-safe-top pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
          <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: isPlaying ? '#4ade80' : '#ffffff40' }}>
            {isPlaying ? 'Live' : 'Paused'}
          </span>
        </div>

        <button
          onClick={() => setMode('discovery')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:bg-white/10"
          style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <X size={12} />
          Exit
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        {/* Station artwork */}
        <div className="relative">
          <div
            className="absolute rounded-2xl transition-all duration-700"
            style={{
              inset: '-20px',
              background: isPlaying ? 'radial-gradient(ellipse, rgba(129,140,248,0.4) 0%, transparent 70%)' : 'transparent',
              filter: 'blur(24px)',
            }}
          />
          <StationFavicon
            src={currentStation?.favicon}
            name={currentStation?.name ?? ''}
            size={140}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{ background: 'rgba(0,0,0,0.6)' }}>
              <LoadingSpinner size={40} />
            </div>
          )}
        </div>

        {/* Station info */}
        {currentStation ? (
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white leading-tight">
              {currentStation.name}
            </h1>
            <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {countryCodeToFlag(currentStation.countrycode)}{' '}
              {currentStation.country}
            </p>
            {currentStation.tags && (
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {currentStation.tags.split(',').slice(0, 3).map(t => t.trim()).filter(Boolean).join(' · ')}
              </p>
            )}
            {currentStation.bitrate > 0 && (
              <div className="flex items-center justify-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                <Wifi size={11} />
                {currentStation.bitrate}kbps
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl" style={{ color: 'rgba(255,255,255,0.3)' }}>No station selected</p>
            <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.15)' }}>Go back to Discovery and select a station</p>
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm text-center px-4">{error}</p>
        )}
      </div>

      {/* Controls */}
      <div className="px-8 pb-safe-bottom pb-10">
        {/* Favorite + queue position */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => currentStation && toggleFavorite(currentStation)}
            disabled={!currentStation}
            className="p-3 rounded-full transition-all"
            style={favorite
              ? { color: '#f472b6', background: 'rgba(244,114,182,0.12)', filter: 'drop-shadow(0 0 8px rgba(244,114,182,0.4))' }
              : { color: 'rgba(255,255,255,0.2)' }
            }
          >
            <Heart size={22} fill={favorite ? 'currentColor' : 'none'} />
          </button>

          {queue.length > 0 && (
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {queueIndex + 1} / {queue.length}
            </span>
          )}

          <div className="w-12" />
        </div>

        {/* Play controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => { void playPrev(); }}
            disabled={queue.length < 2}
            className="w-16 h-16 flex items-center justify-center transition-all disabled:opacity-20"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(196,181,253,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            <SkipBack size={32} />
          </button>

          <button
            onClick={() => { void pauseResume(); }}
            disabled={!currentStation}
            className="w-24 h-24 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-30 hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #818cf8, #4f46e5)', boxShadow: isPlaying ? '0 0 50px rgba(129,140,248,0.5), 0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.6)' }}
          >
            {isLoading ? (
              <LoadingSpinner size={36} />
            ) : isPlaying ? (
              <Pause size={40} />
            ) : (
              <Play size={40} className="ml-1" />
            )}
          </button>

          <button
            onClick={() => { void playNext(); }}
            disabled={queue.length < 2}
            className="w-16 h-16 flex items-center justify-center transition-all disabled:opacity-20"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(196,181,253,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            <SkipForward size={32} />
          </button>
        </div>

        {/* Swipe hint */}
        <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.12)' }}>
          ← Swipe left: next · Swipe right: previous →
        </p>
      </div>
    </div>
  );
}
