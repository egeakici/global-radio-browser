import { RefreshCw } from 'lucide-react';
import { useStations } from '../hooks/useStations';
import { StationCard } from './StationCard';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { useStore } from '../../../core/store/useStore';

export function StationList() {
  const { stations, isLoading, error, refresh } = useStations();
  const { selectedCountryCode, searchQuery, activeTag, setQueue } = useStore();

  const handleCardPlay = () => {
    setQueue(stations);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <LoadingSpinner size={36} />
        <p className="text-muted text-sm">Loading stations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <p className="text-red-400 text-sm text-center">{error}</p>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-card text-sm text-muted hover:text-white transition-colors"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      </div>
    );
  }

  if (!stations.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted text-sm">No stations found for these filters.</p>
      </div>
    );
  }

  const title = searchQuery.trim()
    ? `Results for "${searchQuery}"`
    : selectedCountryCode && activeTag
    ? `${selectedCountryCode} · ${activeTag}`
    : selectedCountryCode
    ? `${selectedCountryCode} stations`
    : activeTag
    ? `${activeTag} stations`
    : 'Popular Stations Worldwide';

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">{title}</h2>
        <span className="text-xs text-muted">{stations.length} stations</span>
      </div>

      <div className="flex flex-col gap-1" onClick={handleCardPlay}>
        {stations.map(station => (
          <StationCard key={station.stationuuid} station={station} queue={stations} />
        ))}
      </div>
    </div>
  );
}
