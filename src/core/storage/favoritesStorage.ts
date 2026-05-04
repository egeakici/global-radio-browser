import type { Station } from '../types';

const KEY = 'radio-browser-favorites';
const LEGACY_KEY = 'radio-drive-favorites';
const LEGACY_STORE_KEY = 'radio-drive-v1';

export const favoritesStorage = {
  load(): Station[] {
    try {
      const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
      if (raw !== null) {
        const parsed = JSON.parse(raw) as Station[];
        if (localStorage.getItem(KEY) === null && localStorage.getItem(LEGACY_KEY) !== null) {
          this.save(parsed);
        }
        return parsed;
      }
      // One-time migration: move favorites from old Zustand persist key
      const legacy = localStorage.getItem(LEGACY_STORE_KEY);
      if (legacy) {
        const parsed = JSON.parse(legacy) as { favorites?: Station[] };
        if (parsed.favorites?.length) {
          this.save(parsed.favorites);
          return parsed.favorites;
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  save(stations: Station[]): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(stations));
    } catch {
      // localStorage full or inaccessible
    }
  },
};
