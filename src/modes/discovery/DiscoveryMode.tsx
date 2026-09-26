import { useEffect, useRef, useState } from 'react';
import { Search, X, Heart, ListMusic, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../../core/store/useStore';
import type { StationList as CustomList } from '../../core/types';
import { CountrySelector } from './components/CountrySelector';
import { FiltersBar } from './components/FiltersBar';
import { StationList } from './components/StationList';
import { StationCard } from './components/StationCard';

// null = browse, 'favorites', or a custom list id
type View = null | 'favorites' | string;

export function DiscoveryMode() {
  const { searchQuery, setSearchQuery, favorites, lists } = useStore();
  const [view, setView] = useState<View>(null);

  const activeList = lists.find(l => l.id === view);
  const showFavorites = view === 'favorites';

  // Fall back to browsing if the selected list gets deleted
  useEffect(() => {
    if (view && view !== 'favorites' && !activeList) setView(null);
  }, [view, activeList]);

  const toggleView = (next: View) => setView(v => (v === next ? null : next));

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
          {/* Separate scroller so the country dropdown isn't clipped */}
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => toggleView('favorites')}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${
                showFavorites
                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                  : 'bg-surface-card text-muted border-surface-border hover:text-white'
              }`}
            >
              <Heart size={13} fill={showFavorites ? 'currentColor' : 'none'} />
              Favorites {favorites.length > 0 && `(${favorites.length})`}
            </button>

            <div className="flex-shrink-0 w-px h-5 bg-surface-border" aria-hidden />

            <NewListButton onCreated={setView} />

            {lists.map(list => (
              <ListChip
                key={list.id}
                list={list}
                active={view === list.id}
                onClick={() => toggleView(list.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tag filters */}
      {!searchQuery && !view && (
        <div className="px-4 pb-3">
          <FiltersBar />
        </div>
      )}

      {/* Station list */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        {showFavorites ? (
          <FavoritesList />
        ) : activeList ? (
          <CustomListView list={activeList} />
        ) : (
          <StationList />
        )}
      </div>
    </div>
  );
}

function ListChip({ list, active, onClick }: { list: CustomList; active: boolean; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [active]);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${
        active
          ? 'bg-accent/20 text-accent-glow border-accent/30'
          : 'bg-surface-card text-muted border-surface-border hover:text-white'
      }`}
    >
      <ListMusic size={13} />
      <span className="max-w-[140px] truncate">{list.name}</span>
      {list.stations.length > 0 && `(${list.stations.length})`}
    </button>
  );
}

function NewListButton({ onCreated }: { onCreated: (id: string) => void }) {
  const { createList } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const cancelled = useRef(false);

  // Enter and Escape both blur, so creation only ever runs here
  const finish = () => {
    const trimmed = name.trim();
    if (trimmed && !cancelled.current) onCreated(createList(trimmed));
    cancelled.current = false;
    setName('');
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        type="text"
        placeholder="List name..."
        value={name}
        onChange={e => setName(e.target.value)}
        onBlur={finish}
        onKeyDown={e => {
          if (e.key === 'Escape') cancelled.current = true;
          if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur();
        }}
        className="flex-shrink-0 w-36 px-3 py-2 rounded-xl text-xs bg-surface-card text-white placeholder-muted border border-accent outline-none"
        maxLength={40}
        autoFocus
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors border border-dashed border-surface-border text-muted hover:text-white hover:border-accent"
    >
      <Plus size={13} />
      New list
    </button>
  );
}

function CustomListView({ list }: { list: CustomList }) {
  const { deleteList } = useStore();

  const handleDelete = () => {
    if (window.confirm(`Delete the list "${list.name}"?`)) deleteList(list.id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3 gap-3">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide truncate">{list.name}</h2>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-muted">{list.stations.length} stations</span>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-xs text-muted hover:text-red-400 transition-colors"
            aria-label={`Delete list ${list.name}`}
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>

      {list.stations.length ? (
        <div className="flex flex-col gap-1">
          {list.stations.map(station => (
            <StationCard key={station.stationuuid} station={station} queue={list.stations} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <ListMusic size={32} className="text-muted" />
          <p className="text-muted text-sm">This list is empty.</p>
          <p className="text-muted text-xs">Use the list icon on a station card to add it here.</p>
        </div>
      )}
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
