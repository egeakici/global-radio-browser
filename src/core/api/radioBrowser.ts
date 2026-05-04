import type { Station, Country } from '../types';

const MIRRORS = [
  'https://de1.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
  'https://at1.api.radio-browser.info',
];

const HEADERS = { 'User-Agent': 'Radio Browser/1.0 (https://github.com/akiciege/radio-browser)' };

let activeMirror = MIRRORS[0];

async function apiFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const query = new URLSearchParams({ ...params, hidebroken: 'true' }).toString();
  const url = `${activeMirror}/json${path}?${query}`;

  for (let i = 0; i < MIRRORS.length; i++) {
    const mirror = MIRRORS[(MIRRORS.indexOf(activeMirror) + i) % MIRRORS.length];
    try {
      const res = await fetch(`${mirror}/json${path}?${query}`, { headers: HEADERS });
      if (!res.ok) continue;
      activeMirror = mirror;
      return res.json() as Promise<T>;
    } catch {
      // try next mirror
    }
  }
  throw new Error(`Radio Browser API unreachable (tried all mirrors) — URL: ${url}`);
}

export async function getCountries(): Promise<Country[]> {
  return apiFetch<Country[]>('/countries', {
    order: 'stationcount',
    reverse: 'true',
  });
}

export async function getStationsByCountry(countryCode: string, limit = 150): Promise<Station[]> {
  return apiFetch<Station[]>(`/stations/bycountrycodeexact/${encodeURIComponent(countryCode)}`, {
    order: 'clickcount',
    reverse: 'true',
    limit: String(limit),
  });
}

export async function getTopStations(limit = 100): Promise<Station[]> {
  return apiFetch<Station[]>(`/stations/topclick/${limit}`);
}

export async function searchStations(query: string, limit = 60): Promise<Station[]> {
  return apiFetch<Station[]>('/stations/search', {
    name: query,
    order: 'clickcount',
    reverse: 'true',
    limit: String(limit),
  });
}

export async function getStationsByTag(tag: string, limit = 80): Promise<Station[]> {
  return apiFetch<Station[]>('/stations/search', {
    tag,
    tagExact: 'true',
    order: 'clickcount',
    reverse: 'true',
    limit: String(limit),
  });
}

export async function getStationsByCountryAndTag(
  countryCode: string,
  tag: string,
  limit = 80,
): Promise<Station[]> {
  return apiFetch<Station[]>('/stations/search', {
    countrycode: countryCode,
    tag,
    order: 'clickcount',
    reverse: 'true',
    limit: String(limit),
  });
}

// Fire-and-forget click registration for Radio Browser stats
export function registerClick(stationuuid: string): void {
  fetch(`${activeMirror}/json/url/${stationuuid}`, { headers: HEADERS }).catch(() => null);
}
