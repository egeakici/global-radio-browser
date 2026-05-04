import { useState, useMemo } from 'react';
import { Search, X, Globe } from 'lucide-react';
import { useStore } from '../../../core/store/useStore';
import { useCountries } from '../hooks/useCountries';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { countryCodeToFlag } from '../../../shared/utils/countryFlag';

export function CountrySelector() {
  const { selectedCountryCode, setSelectedCountryCode, setActiveTag } = useStore();
  const { countries, isLoading } = useCountries();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return countries.slice(0, 30);
    const q = searchQuery.toLowerCase();
    return countries.filter(c => c.name.toLowerCase().includes(q)).slice(0, 30);
  }, [countries, searchQuery]);

  const selectedCountry = countries.find(c => c.iso_3166_1 === selectedCountryCode);

  const handleSelect = (code: string | null) => {
    setSelectedCountryCode(code);
    setActiveTag(null);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`flex items-center gap-2 py-2.5 rounded-xl bg-surface-card border border-surface-border hover:border-accent transition-colors text-sm font-medium w-full sm:w-auto ${selectedCountry ? 'pl-4 pr-8' : 'px-4'}`}
      >
        {selectedCountry ? (
          <>
            <span className="text-lg flex-shrink-0">{countryCodeToFlag(selectedCountry.iso_3166_1)}</span>
            <span className="text-white truncate max-w-[120px]">{selectedCountry.name}</span>
            <span className="text-muted text-xs flex-shrink-0">({selectedCountry.stationcount})</span>
          </>
        ) : (
          <>
            <Globe size={16} className="text-muted" />
            <span className="text-muted">Select country</span>
          </>
        )}
      </button>

      {selectedCountryCode && (
        <button
          onClick={() => handleSelect(null)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-white"
          aria-label="Clear country filter"
        >
          <X size={14} />
        </button>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-surface-card border border-surface-border rounded-xl shadow-2xl z-40 overflow-hidden">
          <div className="p-3 border-b border-surface-border">
            <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2">
              <Search size={14} className="text-muted flex-shrink-0" />
              <input
                type="text"
                placeholder="Search country..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-muted outline-none w-full"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto">
            <button
              onClick={() => handleSelect(null)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors text-left"
            >
              <Globe size={16} className="text-muted" />
              <span className="text-sm text-white">Worldwide</span>
            </button>

            {isLoading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner size={20} />
              </div>
            ) : (
              filtered.map(country => (
                <button
                  key={country.iso_3166_1}
                  onClick={() => handleSelect(country.iso_3166_1)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors text-left ${
                    selectedCountryCode === country.iso_3166_1 ? 'bg-surface' : ''
                  }`}
                >
                  <span className="text-lg w-7 text-center">{countryCodeToFlag(country.iso_3166_1)}</span>
                  <span className="text-sm text-white flex-1">{country.name}</span>
                  <span className="text-xs text-muted">{country.stationcount}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
