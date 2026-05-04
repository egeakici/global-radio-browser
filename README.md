# Global Radio Browser

Global Radio Browser is an open-source project that you can clone, run locally, and use as a polished frontend for discovering and listening to live radio stations from around the world. It requires no sign-up, no subscription, and no hosted service.

## Project Goal

Global Radio Browser aims to make worldwide live radio feel immediate, accessible, and enjoyable. The project brings together thousands of stations from across the globe and presents them through a focused interface built for everyday listening, geographic exploration, and safe in-car control.

Rather than reducing radio discovery to a single search field, Global Radio Browser is designed around three complementary frontend layers:

- **Search Mode** for fast station discovery by name, country, genre, tag, or favorites.
- **Map Mode** for exploring radio stations geographically through an interactive world map.
- **Car Mode** for distraction-reduced listening with large controls, swipe navigation, persistent playback, and car media controls.

Together, these modes create a frontend architecture that balances usability, context, and functionality across desktop, mobile, and in-car scenarios.

## Key Features

### Worldwide Live Radio

- Browse live stations from the open Radio Browser catalogue.
- Load popular stations by default for quick discovery.
- Search by station name with fast, focused results.
- Filter stations by country and popular tags such as pop, rock, jazz, classical, electronic, news, talk, dance, metal, and more.
- Automatically hide broken stations through Radio Browser API filters.

### Three-Layer Frontend Architecture

The interface is organized into three user-facing layers:

1. **Discovery Layer**
   - Search stations by name.
   - Filter by country.
   - Browse by genre/tag.
   - Save and reopen favorite stations.
   - Start playback from any station card.

2. **Map Layer**
   - Explore countries on an interactive Leaflet map.
   - View station density using proportional country markers.
   - Open a country panel and browse available stations.
   - Add a country's station list to the playback queue.

3. **Driving Layer**
   - Full-screen listening interface optimized for cars.
   - Large play, pause, previous, and next controls.
   - Swipe left or right to change stations.
   - Screen Wake Lock support where available.
   - MediaSession integration for Bluetooth devices, steering wheel controls, and lock-screen media controls.

### Playback Experience

- Centralized audio engine that keeps playback alive while switching modes.
- Standard audio stream support through the browser audio element.
- HLS and `.m3u8` stream support through `hls.js`.
- Loading, paused, playing, error, and ended states synchronized with the global app store.
- Volume persistence through local storage.
- Queue navigation for station lists and driving mode.

### Favorites And Local Persistence

- Save favorite stations locally.
- Reopen favorite stations from the Discovery interface.
- Persist user-created station lists in the app store.
- Keep volume preferences between sessions.

### Reliability

- Uses multiple Radio Browser API mirrors:
  - `de1.api.radio-browser.info`
  - `nl1.api.radio-browser.info`
  - `at1.api.radio-browser.info`
- Automatically falls back to the next mirror when one endpoint is unavailable.
- Registers station clicks back to Radio Browser for community statistics.

### Progressive Web App

- Installable PWA configuration through `vite-plugin-pwa`.
- Auto-updating service worker.
- App manifest with standalone display mode.
- Static asset caching through Workbox.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **State management:** Zustand
- **Audio:** HTMLAudioElement, hls.js
- **Map:** Leaflet, React Leaflet
- **PWA:** Vite PWA Plugin, Workbox
- **Icons:** Lucide React

## Architecture Overview

```text
src/
  core/
    api/          Radio Browser API client and mirror fallback
    audio/        Shared audio engine
    storage/      Local storage helpers
    store/        Zustand app store
    types/        Shared TypeScript types

  modes/
    discovery/    Search, filters, favorites, and station lists
    map/          Geographic exploration and country station panel
    driving/      Full-screen car listening interface

  shared/
    components/   Reusable UI components
    hooks/        MediaSession, audio events, and swipe gestures
    utils/        Country flags and country coordinates
```

The app keeps audio and playback state in the shared core layer, while each frontend mode focuses on a specific user context. This makes it possible to switch between search, map exploration, and driving controls without losing the active stream.

## Getting Started

### Requirements

- Node.js 18 or newer
- npm

### Installation

```bash
git clone https://github.com/egeakici/global-radio-browser.git
cd global-radio-browser
npm install
```

### Development

```bash
npm run dev
```

The Vite dev server is configured to run at:

```text
http://127.0.0.1:5500
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Data Source

Station and country data comes from [Radio Browser](https://www.radio-browser.info/), a free, open, community-driven radio station directory.

This project does not require a private API key. Availability and stream quality depend on the public directory data and the individual radio station streams.

## Browser Support Notes

- Audio playback depends on browser autoplay policies. In most browsers, the user must start playback with an interaction.
- HLS support varies by browser; `hls.js` is used where native support is not enough.
- Wake Lock and MediaSession features are progressive enhancements and may not be available in every browser or operating system.
- Bluetooth and steering wheel controls depend on browser, device, and vehicle media integration support.

## Roadmap Ideas

- Station history and recently played stations.
- Import/export favorites.
- More advanced filters for language, codec, bitrate, and popularity.
- Better offline shell behavior for installed PWA usage.
- Optional station health indicators.
- Responsive refinements for tablets and dashboard-mounted screens.

## License

MIT
