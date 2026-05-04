import { Play, Pause, Heart, Wifi } from 'lucide-react';
import { useStore } from '../../../core/store/useStore';
import { StationFavicon } from '../../../shared/components/StationFavicon';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import type { Station } from '../../../core/types';

interface Props {
  station: Station;
  queue: Station[];
}

export function StationCard({ station, queue }: Props) {
  const { player, playStation, pauseResume, toggleFavorite, isFavorite } = useStore();

  const isThisStation = player.currentStation?.stationuuid === station.stationuuid;
  const isPlaying = isThisStation && player.isPlaying;
  const isLoading = isThisStation && player.isLoading;
  const favorite = isFavorite(station.stationuuid);

  const handlePlay = () => {
    if (isThisStation) {
      void pauseResume();
    } else {
      void playStation(station, queue);
    }
  };

  const tags = station.tags
    ? station.tags.split(',').slice(0, 2).map(t => t.trim()).filter(Boolean)
    : [];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer group relative overflow-hidden ${
        isThisStation
          ? 'border border-accent/25'
          : 'border border-transparent hover:bg-surface-hover'
      }`}
      style={isThisStation ? { background: 'rgba(129, 140, 248, 0.06)' } : {}}
      onClick={handlePlay}
    >
      {/* Active left-edge indicator */}
      {isThisStation && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-r-full bg-accent" />
      )}

      <StationFavicon src={station.favicon} name={station.name} size={46} />

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isThisStation ? 'text-accent-glow' : 'text-white'}`}>
          {station.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {tags.map(tag => (
            <span key={tag} className="text-xs text-muted">
              {tag}
            </span>
          ))}
          {station.bitrate > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted">
              <Wifi size={10} />
              {station.bitrate}k
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={e => {
            e.stopPropagation();
            toggleFavorite(station);
          }}
          className={`p-1.5 rounded-full transition-all ${
            favorite
              ? 'text-pink-400'
              : 'text-muted hover:text-pink-400'
          }`}
          style={favorite ? { filter: 'drop-shadow(0 0 6px rgba(244,114,182,0.5))' } : {}}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <button
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 text-white`}
        style={isThisStation
          ? { background: 'linear-gradient(135deg, #818cf8, #4f46e5)', boxShadow: '0 0 16px rgba(129,140,248,0.35)' }
          : { background: 'rgba(45, 45, 82, 0.6)' }
        }
        aria-label={isPlaying ? 'Pause' : 'Play'}
        onClick={e => { e.stopPropagation(); handlePlay(); }}
      >
        {isLoading ? (
          <LoadingSpinner size={16} />
        ) : isPlaying ? (
          <Pause size={16} />
        ) : (
          <Play size={16} className="ml-0.5" />
        )}
      </button>
    </div>
  );
}
