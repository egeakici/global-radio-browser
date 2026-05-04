import { useEffect } from 'react';
import { useStore } from '../../core/store/useStore';

// Sync the MediaSession API with player state so car controls can drive playback.
export function useMediaSession() {
  const { player, pauseResume, playNext, playPrev } = useStore();
  const { currentStation, isPlaying } = player;

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = currentStation
      ? new MediaMetadata({
          title: currentStation.name,
          artist: currentStation.country || '',
          album: 'Radio Browser - Live Radio',
          artwork: currentStation.favicon
            ? [{ src: currentStation.favicon, sizes: '512x512', type: 'image/png' }]
            : [],
        })
      : null;
  }, [currentStation]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [isPlaying]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.setActionHandler('play', () => { void pauseResume(); });
    navigator.mediaSession.setActionHandler('pause', () => { void pauseResume(); });
    navigator.mediaSession.setActionHandler('previoustrack', () => { void playPrev(); });
    navigator.mediaSession.setActionHandler('nexttrack', () => { void playNext(); });
    navigator.mediaSession.setActionHandler('stop', () => {
      useStore.getState().pauseResume();
    });

    return () => {
      (['play', 'pause', 'previoustrack', 'nexttrack', 'stop'] as MediaSessionAction[]).forEach(
        action => navigator.mediaSession.setActionHandler(action, null),
      );
    };
  }, [pauseResume, playNext, playPrev]);
}
