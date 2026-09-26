import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { audioEngine } from '../audio/audioEngine';
import { registerClick } from '../api/radioBrowser';
import { favoritesStorage } from '../storage/favoritesStorage';
import { volumeStorage } from '../storage/volumeStorage';
import type { Station, AppMode, StationList } from '../types';

interface PlayerSlice {
  currentStation: Station | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}

interface Store {
  // Mode
  mode: AppMode;
  setMode: (mode: AppMode) => void;

  // Map panel state (controls island bar visibility)
  mapPanelOpen: boolean;
  setMapPanelOpen: (open: boolean) => void;

  // Player
  player: PlayerSlice;
  playStation: (station: Station, newQueue?: Station[]) => Promise<void>;
  pauseResume: () => Promise<void>;

  // Queue (driving mode navigation)
  queue: Station[];
  queueIndex: number;
  setQueue: (stations: Station[], index?: number) => void;
  playNext: () => Promise<void>;
  playPrev: () => Promise<void>;

  // Volume
  volume: number;
  setVolume: (v: number) => void;

  // Favorites (dedicated localStorage module)
  favorites: Station[];
  toggleFavorite: (station: Station) => void;
  isFavorite: (stationuuid: string) => boolean;

  // Custom lists (persisted)
  lists: StationList[];
  createList: (name: string) => string;
  deleteList: (id: string) => void;
  toggleInList: (listId: string, station: Station) => void;

  // Discovery UI state (not persisted)
  selectedCountryCode: string | null;
  setSelectedCountryCode: (code: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;
}

const _initialVolume = volumeStorage.load();
audioEngine.setVolume(_initialVolume);

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      mode: 'discovery',
      setMode: (mode) => set({ mode }),

      mapPanelOpen: false,
      setMapPanelOpen: (open) => set({ mapPanelOpen: open }),

      volume: _initialVolume,
      setVolume: (v) => {
        const clamped = Math.max(0, Math.min(1, v));
        audioEngine.setVolume(clamped);
        volumeStorage.save(clamped);
        set({ volume: clamped });
      },

      player: {
        currentStation: null,
        isPlaying: false,
        isLoading: false,
        error: null,
      },

      playStation: async (station, newQueue) => {
        set(s => ({
          player: { ...s.player, currentStation: station, isLoading: true, error: null },
          ...(newQueue != null ? { queue: newQueue } : {}),
          ...(newQueue != null ? { queueIndex: newQueue.findIndex(st => st.stationuuid === station.stationuuid) } : {}),
        }));

        try {
          const url = station.url_resolved || station.url;
          await audioEngine.play(url);
          set(s => ({ player: { ...s.player, isPlaying: true, isLoading: false } }));
          registerClick(station.stationuuid);
        } catch {
          set(s => ({
            player: { ...s.player, isPlaying: false, isLoading: false, error: 'Stream failed to load. Try another station.' },
          }));
        }
      },

      pauseResume: async () => {
        const { player } = get();
        if (!player.currentStation) return;

        if (player.isPlaying) {
          audioEngine.pause();
          set(s => ({ player: { ...s.player, isPlaying: false } }));
        } else {
          try {
            set(s => ({ player: { ...s.player, isLoading: true } }));
            await audioEngine.resume();
            set(s => ({ player: { ...s.player, isPlaying: true, isLoading: false } }));
          } catch {
            // If resume fails (e.g. stream disconnected), replay from URL
            const { playStation } = get();
            await playStation(player.currentStation);
          }
        }
      },

      queue: [],
      queueIndex: 0,
      setQueue: (stations, index = 0) => set({ queue: stations, queueIndex: index }),

      playNext: async () => {
        const { queue, queueIndex, playStation } = get();
        if (!queue.length) return;
        const nextIndex = (queueIndex + 1) % queue.length;
        set({ queueIndex: nextIndex });
        await playStation(queue[nextIndex]);
      },

      playPrev: async () => {
        const { queue, queueIndex, playStation } = get();
        if (!queue.length) return;
        const prevIndex = (queueIndex - 1 + queue.length) % queue.length;
        set({ queueIndex: prevIndex });
        await playStation(queue[prevIndex]);
      },

      favorites: favoritesStorage.load(),
      toggleFavorite: (station) => {
        const { favorites } = get();
        const exists = favorites.some(f => f.stationuuid === station.stationuuid);
        const next = exists
          ? favorites.filter(f => f.stationuuid !== station.stationuuid)
          : [...favorites, station];
        favoritesStorage.save(next);
        set({ favorites: next });
      },
      isFavorite: (stationuuid) => get().favorites.some(f => f.stationuuid === stationuuid),

      lists: [],
      createList: (name) => {
        const id = `list-${Date.now()}`;
        set(s => ({ lists: [...s.lists, { id, name, stations: [] }] }));
        return id;
      },
      deleteList: (id) => set(s => ({ lists: s.lists.filter(l => l.id !== id) })),
      toggleInList: (listId, station) => {
        set(s => ({
          lists: s.lists.map(l => {
            if (l.id !== listId) return l;
            const exists = l.stations.some(st => st.stationuuid === station.stationuuid);
            return {
              ...l,
              stations: exists
                ? l.stations.filter(st => st.stationuuid !== station.stationuuid)
                : [...l.stations, station],
            };
          }),
        }));
      },

      selectedCountryCode: null,
      setSelectedCountryCode: (code) => set({ selectedCountryCode: code }),
      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),
      activeTag: null,
      setActiveTag: (tag) => set({ activeTag: tag }),
    }),
    {
      name: 'radio-browser-v1',
      storage: createJSONStorage(() => ({
        getItem: (name) => localStorage.getItem(name) ?? localStorage.getItem('radio-drive-v1'),
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: (name) => localStorage.removeItem(name),
      })),
      version: 1,
      partialize: (s) => ({
        lists: s.lists,
      }),
      // v0 lists stored only station ids; full stations are needed to render a list
      migrate: (persisted) => {
        const state = persisted as { lists?: Array<{ id: string; name: string; stations?: Station[] }> } | null;
        return {
          lists: (state?.lists ?? []).map(l => ({ id: l.id, name: l.name, stations: l.stations ?? [] })),
        };
      },
    },
  ),
);
