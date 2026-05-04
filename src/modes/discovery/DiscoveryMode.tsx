import { useState } from 'react';
import { Search, X, Heart } from 'lucide-react';
import { useStore } from '../../core/store/useStore';
import { CountrySelector } from './components/CountrySelector';
import { FiltersBar } from './components/FiltersBar';
import { StationList } from './components/StationList';
import { StationCard } from './components/StationCard';

export function DiscoveryMode() {
  const { searchQuery, setSearchQuery, favorites } = useStore();
  const [showFavorites, setShowFavorites] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 bg-surface-card border border-surface-border rounded-xl px-3 py-2.5">
          <Search size={16} className="text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search stations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-muted outline-none flex-1"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-muted hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Filters row */}
      {!searchQuery && (
        <div className="px-4 pb-3 flex items-center gap-3">
          <CountrySelector />
          <button
            onClick={() => setShowFavorites(f => !f)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${
              showFavorites
                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                : 'bg-surface-card text-muted border-surface-border hover:text-white'
            }`}
          >
            <Heart size={13} fill={showFavorites ? 'currentColor' : 'none'} />
            Favorites {favorites.length > 0 && `(${favorites.length})`}
          </button>
        </div>
      )}

      {/* Tag filters */}
      {!searchQuery && !showFavorites && (
        <div className="px-4 pb-3">
          <FiltersBar />
        </div>
      )}

      {/* Station list */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        {showFavorites ? (
          <FavoritesList />
        ) : (
          <StationList />
        )}
      </div>
    </div>
  );
}

function FavoritesList() {
  const { favorites } = useStore();

  if (!favorites.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Heart size={32} className="text-muted" />
        <p className="text-muted text-sm">No favorites yet.</p>
        <p className="text-muted text-xs">Tap the heart icon on a station card to add it to favorites.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {favorites.map(station => (
        <StationCard key={station.stationuuid} station={station} queue={favorites} />
      ))}
    </div>
  );
}

