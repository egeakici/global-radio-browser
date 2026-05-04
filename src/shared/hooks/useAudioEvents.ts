import { useEffect } from 'react';
import { audioEngine } from '../../core/audio/audioEngine';
import { useStore } from '../../core/store/useStore';

// Keeps the Zustand store in sync with real audio events from the engine.
// Mount this once at the app root level.
export function useAudioEvents() {
  useEffect(() => {
    return audioEngine.subscribe((event) => {
      const store = useStore.getState();
      const { player } = store;

      switch (event) {
        case 'playing':
          useStore.setState({ player: { ...player, isPlaying: true, isLoading: false, error: null } });
          break;
        case 'paused':
          useStore.setState({ player: { ...player, isPlaying: false } });
          break;
        case 'loading':
          useStore.setState({ player: { ...player, isLoading: true } });
          break;
        case 'error':
          useStore.setState({
            player: { ...player, isLoading: false, isPlaying: false, error: 'Stream connection lost.' },
          });
          break;
        case 'ended':
          useStore.setState({ player: { ...player, isPlaying: false } });
          break;
      }
    });
  }, []);
}
