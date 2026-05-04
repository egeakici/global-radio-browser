import { useStore } from './core/store/useStore';
import { DiscoveryMode } from './modes/discovery/DiscoveryMode';
import { MapMode } from './modes/map/MapMode';
import { DrivingMode } from './modes/driving/DrivingMode';
import { NowPlayingBar } from './shared/components/NowPlayingBar';
import { useMediaSession } from './shared/hooks/useMediaSession';
import { useAudioEvents } from './shared/hooks/useAudioEvents';
import { Radio, Car, Compass, Map } from 'lucide-react';
import type { AppMode } from './core/types';

const NAV_TABS: { id: AppMode; label: string; icon: typeof Compass }[] = [
  { id: 'discovery', label: 'Discover', icon: Compass },
  { id: 'map', label: 'Map', icon: Map },
  { id: 'driving', label: 'Drive', icon: Car },
];

export default function App() {
  const { mode, setMode } = useStore();

  // Global hooks — mount once, always active regardless of mode
  useAudioEvents();
  useMediaSession();

  // Driving mode takes full screen
  if (mode === 'driving') {
    return <DrivingMode />;
  }

  return (
    <div className="h-dvh flex flex-col bg-base text-white overflow-hidden">
      <header className="relative z-[1200] flex h-[72px] flex-shrink-0 items-center bg-surface px-6 sm:px-8">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />

        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 rounded-2xl bg-accent/20 blur-[8px] opacity-70" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/30 bg-gradient-to-b from-accent/20 to-accent/5">
                <Radio size={19} className="text-accent-glow" strokeWidth={1.9} />
              </div>
            </div>
            <span className="text-[17px] font-bold tracking-[0.015em] leading-none">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Radio</span>
              <span className="bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">Browser</span>
            </span>
          </div>

          {/* Navigation */}
          <nav
            role="tablist"
            className="flex items-center gap-1 rounded-full border border-white/[0.10] bg-white/[0.04] p-1.5"
          >
            {NAV_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = mode === tab.id;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  onClick={() => setMode(tab.id)}
                  aria-selected={isActive}
                  className={`flex h-9 items-center justify-center gap-2 rounded-full px-5 text-[13.5px] font-medium tracking-[0.015em] transition-all duration-200 sm:min-w-[96px] ${
                    isActive
                      ? 'bg-accent text-white shadow-[0_2px_16px_rgba(129,140,248,0.5)]'
                      : 'text-white/45 hover:text-white/70 hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon size={15} strokeWidth={isActive ? 2.4 : 2} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mode content */}
      <main className="flex-1 overflow-hidden relative">
        {mode === 'discovery' && <DiscoveryMode />}
        {mode === 'map' && <MapMode />}
      </main>

      {/* Now playing bar — only shown when not in map mode with panel open */}
      <NowPlayingBar />
    </div>
  );
}
