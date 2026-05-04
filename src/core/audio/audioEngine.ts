import Hls from 'hls.js';

export type AudioEvent = 'playing' | 'paused' | 'loading' | 'error' | 'ended';
type Listener = (event: AudioEvent) => void;

class AudioEngine {
  private _audio: HTMLAudioElement;
  private _hls: Hls | null = null;
  private _listeners = new Set<Listener>();
  private _currentUrl = '';

  constructor() {
    this._audio = new Audio();
    this._audio.preload = 'none';

    this._audio.addEventListener('playing', () => this._emit('playing'));
    this._audio.addEventListener('pause', () => this._emit('paused'));
    this._audio.addEventListener('waiting', () => this._emit('loading'));
    this._audio.addEventListener('stalled', () => this._emit('loading'));
    this._audio.addEventListener('ended', () => this._emit('ended'));
    this._audio.addEventListener('error', () => this._emit('error'));
  }

  private _emit(event: AudioEvent) {
    this._listeners.forEach(fn => fn(event));
  }

  private _isHls(url: string): boolean {
    return url.includes('.m3u8') || url.includes('hls') || url.includes('/live/');
  }

  private _teardownHls() {
    if (this._hls) {
      this._hls.destroy();
      this._hls = null;
    }
  }

  subscribe(fn: Listener): () => void {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  async play(url: string): Promise<void> {
    if (url === this._currentUrl && !this._audio.paused) return;

    this._teardownHls();
    this._currentUrl = url;
    this._emit('loading');

    if (Hls.isSupported() && this._isHls(url)) {
      this._hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      this._hls.loadSource(url);
      this._hls.attachMedia(this._audio);

      await new Promise<void>((resolve, reject) => {
        this._hls!.once(Hls.Events.MANIFEST_PARSED, () => resolve());
        this._hls!.once(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) reject(new Error('HLS fatal error'));
        });
      });
    } else {
      this._audio.src = url;
    }

    await this._audio.play();
  }

  resume(): Promise<void> {
    return this._audio.play();
  }

  pause(): void {
    this._audio.pause();
  }

  stop(): void {
    this._audio.pause();
    this._teardownHls();
    this._audio.src = '';
    this._currentUrl = '';
  }

  setVolume(v: number): void {
    this._audio.volume = Math.max(0, Math.min(1, v));
  }

  get isPaused(): boolean {
    return this._audio.paused;
  }

  get volume(): number {
    return this._audio.volume;
  }
}

// Singleton — survives component unmounts, keeps audio playing across mode switches
export const audioEngine = new AudioEngine();
