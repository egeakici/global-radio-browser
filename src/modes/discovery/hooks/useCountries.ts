import { useState, useEffect } from 'react';
import type { Country } from '../../../core/types';
import { getCountries } from '../../../core/api/radioBrowser';

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCountries()
      .then(data => {
        setCountries(data.filter(c => c.stationcount > 0 && c.name));
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to load countries.');
        setIsLoading(false);
      });
  }, []);

  return { countries, isLoading, error };
}
