# Global Radio Browser

**Discover and listen to live radio stations from around the world — directly in your browser.**

**Live application:** [global-radio-browser.pages.dev](https://global-radio-browser.pages.dev/)

Global Radio Browser is an open-source web application for exploring thousands of live radio stations worldwide. Search by station or country, discover broadcasts on an interactive map, and switch to a distraction-reduced listening interface. No account or subscription is required.

## Project Goal

Global Radio Browser aims to make worldwide live radio immediate, accessible, and enjoyable. It brings together stations from across the globe in a focused interface designed for everyday listening, geographic exploration, and convenient controls on desktop and mobile devices.

The experience is organized around three complementary modes:

- **Search Mode** — Discover stations by name, country, genre, tag, or favorites.
- **Map Mode** — Explore stations geographically through an interactive world map.
- **Car Mode** — Use large playback controls, swipe navigation, and supported device media controls.

These modes share a centralized playback engine so users can switch between views without interrupting the active stream.

## Key Features

### Worldwide Live Radio

- Browse stations from the open [Radio Browser](https://www.radio-browser.info/) directory.
- Discover popular stations immediately.
- Search by station name and filter by country or genre.
- Browse tags such as pop, rock, jazz, classical, electronic, news, talk, dance, and more.
- Filter out stations marked as broken by the Radio Browser API.

### Search Mode

- Search stations by name, country, and genre/tag.
- Save and revisit favorite stations.
- Build and manage station lists.
- Start playback directly from a station card.

### Map Mode

- Explore countries on an interactive Leaflet map.
- View station density through proportional country markers.
- Open a country panel to browse available stations.
- Add stations from a country to the playback queue.

### Car Mode

- Full-screen, distraction-reduced listening interface.
- Large play, pause, previous, and next controls.
- Swipe left or right to change stations.
- Screen Wake Lock support where available.
- Media Session integration for supported Bluetooth, lock-screen, and vehicle media controls.

### Playback Experience

- Centralized audio engine that preserves playback between modes.
- Standard browser audio streams and HLS (`.m3u8`) playback through `hls.js`.
- Playback status synchronization across the interface.
- Persistent volume settings and queue navigation.

### Favorites and Preferences

- Save favorite stations and custom lists in browser storage.
- Preserve preferences between sessions on the same browser and device.
- Use the application without creating an account.

### Reliability

- Multiple Radio Browser API mirrors:
  - `de1.api.radio-browser.info`
  - `nl1.api.radio-browser.info`
  - `at1.api.radio-browser.info`
- Automatic fallback when an API mirror is unavailable.
- Station click registration for Radio Browser community statistics.

### Progressive Web App

- PWA configuration via `vite-plugin-pwa`.
- Standalone display mode for supported installations.
- Service worker updates and static asset caching through Workbox.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **State management:** Zustand
- **Audio:** HTMLAudioElement, hls.js
- **Map:** Leaflet, React Leaflet
- **PWA:** Vite PWA Plugin, Workbox
- **Icons:** Lucide React
- **Deployment:** Cloudflare Pages

## Architecture Overview

```text
src/
  core/
    api/          Radio Browser API client and mirror fallback
    audio/        Shared audio engine
    storage/      Browser storage helpers
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

The application uses a shared core for audio playback, API access, state, and browser persistence. The three interface modes remain separate while using the same playback state and queue.

## Live Deployment

**Production URL:** https://global-radio-browser.pages.dev/

The application is hosted on **Cloudflare Pages**, with production builds deployed automatically from the GitHub repository's `main` branch. The browser fetches station metadata from Radio Browser and connects to the individual radio streams. No application-specific backend or user account is required for the current release.

## Data Source

Station and country data comes from [Radio Browser](https://www.radio-browser.info/), a free, open, community-driven radio station directory.

The project does not require a private API key. Station availability and stream quality depend on public directory data and the individual broadcasters. Radio streams and station branding remain the responsibility of their respective providers.

## Browser Support Notes

- Audio playback follows browser autoplay policies; users may need to interact with the page to start listening.
- HLS support differs between browsers; `hls.js` is used where appropriate.
- Wake Lock and Media Session features depend on browser and operating-system support.
- Bluetooth, lock-screen, and steering-wheel controls depend on the device and its media integration.
- Some third-party radio streams may be unavailable or incompatible with secure browser playback.

## Roadmap

- Listening history and recently played stations.
- Import and export of favorites.
- More filters for language, codec, bitrate, and popularity.
- Better offline app-shell behavior for PWA installations.
- Optional station health indicators.
- Responsive improvements for tablets and dashboard-mounted screens.

## License

This project is licensed under the [MIT License](LICENSE).
