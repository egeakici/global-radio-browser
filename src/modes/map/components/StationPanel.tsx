import { useState, useEffect, useCallback } from 'react';
import { X, ListMusic } from 'lucide-react';
import type { Country, Station } from '../../../core/types';
import { getStationsByCountry } from '../../../core/api/radioBrowser';
import { useStore } from '../../../core/store/useStore';
import { StationCard } from '../../discovery/components/StationCard';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { countryCodeToFlag } from '../../../shared/utils/countryFlag';

interface Props {
  country: Country;
  onClose: () => void;
}

const MIN_HEIGHT_VH = 20;
const MAX_HEIGHT_VH = 92;
const DEFAULT_HEIGHT_VH = 30;

export function StationPanel({ country, onClose }: Props) {
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heightVh, setHeightVh] = useState(DEFAULT_HEIGHT_VH);
  const { player, setQueue, playStation } = useStore();

  const startDrag = useCallback((startClientY: number) => {
    const startHeight = heightVh;

    const onMove = (e: MouseEvent | TouchEvent) => {
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaVh = ((startClientY - y) / window.innerHeight) * 100;
      setHeightVh(Math.max(MIN_HEIGHT_VH, Math.min(MAX_HEIGHT_VH, startHeight + deltaVh)));
    };

    const onEnd = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchend', onEnd);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
  }, [heightVh]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setStations([]);

    getStationsByCountry(country.iso_3166_1)
      .then(data => {
        if (!cancelled) {
          setStations(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to load stations.');
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [country.iso_3166_1]);

  const handlePlayAll = () => {
    if (!stations.length) return;
    setQueue(stations, 0);
    void playStation(stations[0], stations);
  };

  const hasNowPlaying = !!player.currentStation;

  return (
    // Slide-up from bottom, sits on top of map, below NowPlayingBar
    <div className="fixed bottom-0 left-0 right-0 flex flex-col bg-surface rounded-t-2xl border-t border-surface-border shadow-2xl" style={{ zIndex: 1000, height: `${heightVh}vh` }}>

      {/* Drag handle */}
      <div
        className="flex justify-center pt-2.5 pb-2 flex-shrink-0 cursor-ns-resize select-none"
        onMouseDown={e => startDrag(e.clientY)}
        onTouchStart={e => startDrag(e.touches[0].clientY)}
      >
        <div className="w-12 h-1.5 rounded-full bg-surface-border hover:bg-muted transition-colors" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-1 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{countryCodeToFlag(country.iso_3166_1)}</span>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">{country.name}</h2>
            <p className="text-xs text-muted">
              {isLoading ? 'Loading...' : `${stations.length} stations`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {stations.length > 0 && (
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/20 text-accent text-xs font-medium hover:bg-accent/30 transition-colors"
            >
              <ListMusic size={13} />
              Add all to queue
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable station list */}
      <div
        className="overflow-y-auto flex-1 px-2"
        style={{ paddingBottom: hasNowPlaying ? '80px' : '16px' }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner size={30} />
          </div>
        ) : error ? (
          <p className="text-center text-red-400 text-sm py-8">{error}</p>
        ) : stations.length === 0 ? (
          <p className="text-center text-muted text-sm py-8">No stations found in this country.</p>
        ) : (
          <div className="flex flex-col gap-0.5 pb-2">
            {stations.map(station => (
              <StationCard key={station.stationuuid} station={station} queue={stations} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
