import { useState } from 'react';
import { useStore } from '../../core/store/useStore';
import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useCountries } from '../discovery/hooks/useCountries';
import { COUNTRY_COORDS } from '../../shared/utils/countryCoords';
import { StationPanel } from './components/StationPanel';
import type { Country } from '../../core/types';

// CARTO basemaps now require an API key; Esri's dark canvas works without one
const TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
const TILE_ATTRIBUTION = 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, HERE, Garmin, OpenStreetMap contributors';

function markerRadius(stationCount: number): number {
  return Math.max(6, Math.log10(stationCount + 1) * 8);
}

export function MapMode() {
  const { countries } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const setMapPanelOpen = useStore(s => s.setMapPanelOpen);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setMapPanelOpen(true);
  };

  const handleClosePanel = () => {
    setSelectedCountry(null);
    setMapPanelOpen(false);
  };

  return (
    <div className="relative h-full">
      <MapContainer
        center={[30, 15]}
        zoom={3}
        minZoom={2}
        maxZoom={12}
        style={{ height: '100%', width: '100%', background: '#0a0a0f' }}
        zoomControl={false}
      >
        <TileLayer
          url={TILE_URL}
          attribution={TILE_ATTRIBUTION}
          maxNativeZoom={16}
        />

        <ZoomControl position="bottomright" />

        {countries.map(country => {
          const coords = COUNTRY_COORDS[country.iso_3166_1];
          if (!coords) return null;

          const isSelected = selectedCountry?.iso_3166_1 === country.iso_3166_1;
          const radius = markerRadius(country.stationcount);

          return (
            <CircleMarker
              key={country.iso_3166_1}
              center={coords}
              radius={isSelected ? radius + 5 : radius}
              pathOptions={{
                color: isSelected ? '#e0d7ff' : '#a594f9',
                fillColor: isSelected ? '#818cf8' : '#6366f1',
                fillOpacity: isSelected ? 1 : 0.8,
                weight: isSelected ? 2.5 : 1.5,
              }}
              eventHandlers={{
                click: () => handleSelectCountry(country),
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={0.95}>
                <span className="text-xs font-medium">
                  {country.name} · {country.stationcount}
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {!selectedCountry && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
          <div className="bg-black/70 backdrop-blur-sm text-xs text-gray-300 px-3 py-1.5 rounded-full border border-white/10">
            Tap a country → see radio stations
          </div>
        </div>
      )}

      {selectedCountry && (
        <StationPanel
          country={selectedCountry}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
}
