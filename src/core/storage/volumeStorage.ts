const KEY = 'radio-browser-volume';
const LEGACY_KEY = 'radio-drive-volume';
const DEFAULT_VOLUME = 0.8;

export const volumeStorage = {
  load(): number {
    try {
      const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
      if (raw === null) return DEFAULT_VOLUME;
      const v = parseFloat(raw);
      if (localStorage.getItem(KEY) === null && localStorage.getItem(LEGACY_KEY) !== null) {
        localStorage.setItem(KEY, raw);
      }
      return isNaN(v) ? DEFAULT_VOLUME : Math.max(0, Math.min(1, v));
    } catch {
      return DEFAULT_VOLUME;
    }
  },

  save(volume: number): void {
    try {
      localStorage.setItem(KEY, String(volume));
    } catch {
      // ignore
    }
  },
};
