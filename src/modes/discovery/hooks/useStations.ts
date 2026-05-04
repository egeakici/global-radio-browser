import { useState, useEffect, useCallback } from 'react';
import type { Station } from '../../../core/types';
import {
  getStationsByCountry,
  getTopStations,
  searchStations,
  getStationsByTag,
  getStationsByCountryAndTag,
} from '../../../core/api/radioBrowser';
import { useStore } from '../../../core/store/useStore';

interface UseStationsResult {
  stations: Station[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useStations(): UseStationsResult {
  const { selectedCountryCode, searchQuery, activeTag } = useStore();
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion(v => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const load = async () => {
      try {
        let results: Station[];

        if (searchQuery.trim().length >= 2) {
          results = await searchStations(searchQuery.trim());
        } else if (selectedCountryCode && activeTag) {
          results = await getStationsByCountryAndTag(selectedCountryCode, activeTag);
        } else if (selectedCountryCode) {
          results = await getStationsByCountry(selectedCountryCode);
        } else if (activeTag) {
          results = await getStationsByTag(activeTag);
        } else {
          results = await getTopStations(100);
        }

        if (!cancelled) {
          setStations(results);
          setIsLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Failed to load stations. Please try again.');
          setIsLoading(false);
        }
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [selectedCountryCode, searchQuery, activeTag, version]);

  return { stations, isLoading, error, refresh };
}
