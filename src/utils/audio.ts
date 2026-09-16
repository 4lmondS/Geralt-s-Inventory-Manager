// Authentic Gothic Instrumental Audio Engine
// Real acoustic instruments: Cathedral Pipe Organ, Gothic Symphony Orchestra & Violin, and Grand Piano.

export interface GothicTrack {
  id: string;
  title: string;
  composer: string;
  instrument: string;
  description: string;
  src: string;
  badge: string;
  era: string;
}

export const GOTHIC_TRACKS: GothicTrack[] = [
  {
    id: 'danse-macabre',
    title: 'Danse Macabre, Op. 40 (Tarian Maut)',
    composer: 'Camille Saint-Saëns',
    instrument: 'Orkestra Simfoni Gothic & Solo Biola Mistis',
    description:
      'Gesekan solo biola iblis tengah malam berpadu dengan orkestrasi simfoni penuh bernuansa tarian kerangka dan arwah di pekuburan tua.',
    src: '/audio/saint_saens_danse_macabre.mp3',
    badge: 'Orkestra & Solo Biola',
    era: 'Late Romantic Gothic (1874)',
  },
];

// Singleton audio player instance
let audioElement: HTMLAudioElement | null = null;
let currentTrackIndex = 0;
let isMusicPlaying = false;
let ambientVolume = 0.5; // Default 50%
let listeners: Array<(state: {
  isPlaying: boolean;
  track: GothicTrack;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
}) => void> = [];

// Initialize or retrieve HTMLAudioElement
function getAudioElement(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.preload = 'metadata';
    audioElement.loop = true;

    // Load saved track preference if exists
    const savedTrackId = localStorage.getItem('gothic_current_track_id');
    if (savedTrackId) {
      const foundIdx = GOTHIC_TRACKS.findIndex((t) => t.id === savedTrackId);
      if (foundIdx !== -1) {
        currentTrackIndex = foundIdx;
      }
    }

    // Load saved volume
    const savedVol = localStorage.getItem('gothic_ambient_volume');
    if (savedVol !== null) {
      const parsed = parseFloat(savedVol);
      if (!isNaN(parsed)) {
        ambientVolume = Math.max(0, Math.min(1, parsed));
      }
    }

    audioElement.src = GOTHIC_TRACKS[currentTrackIndex].src;
    audioElement.volume = isAudioMuted() ? 0 : ambientVolume;

    // Attach native event listeners
    audioElement.addEventListener('play', () => {
      isMusicPlaying = true;
      notifyListeners();
    });

    audioElement.addEventListener('pause', () => {
      isMusicPlaying = false;
      notifyListeners();
    });

    audioElement.addEventListener('ended', () => {
      // If loop doesn't fire for any reason, auto-replay or cycle
      if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(() => {});
      }
    });

    audioElement.addEventListener('timeupdate', () => {
      notifyListeners();
    });

    audioElement.addEventListener('error', (e) => {
      console.warn('Gothic audio stream error:', e);
      isMusicPlaying = false;
      notifyListeners();
    });
  }

  return audioElement;
}

function notifyListeners(): void {
  const audio = audioElement;
  const state = {
    isPlaying: isMusicPlaying,
    track: GOTHIC_TRACKS[currentTrackIndex],
    volume: ambientVolume,
    muted: isAudioMuted(),
    currentTime: audio ? audio.currentTime : 0,
    duration: audio && !isNaN(audio.duration) ? audio.duration : 0,
  };
  listeners.forEach((fn) => {
    try {
      fn(state);
    } catch (_) {}
  });
}

export function subscribeAudioState(
  listener: (state: {
    isPlaying: boolean;
    track: GothicTrack;
    volume: number;
    muted: boolean;
    currentTime: number;
    duration: number;
  }) => void
): () => void {
  listeners.push(listener);
  // Send immediate initial state
  listener({
    isPlaying: isMusicPlaying,
    track: GOTHIC_TRACKS[currentTrackIndex],
    volume: ambientVolume,
    muted: isAudioMuted(),
    currentTime: audioElement ? audioElement.currentTime : 0,
    duration: audioElement && !isNaN(audioElement.duration) ? audioElement.duration : 0,
  });
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function isAudioMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('gothic_sound_enabled') === 'false';
}

export function setAudioMuted(muted: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gothic_sound_enabled', muted ? 'false' : 'true');
  }
  const audio = getAudioElement();
  if (audio) {
    audio.volume = muted ? 0 : ambientVolume;
  }
  notifyListeners();
}

export function getAmbientVolume(): number {
  return ambientVolume;
}

export function setAmbientVolume(vol: number): void {
  ambientVolume = Math.max(0, Math.min(1, vol));
  if (typeof window !== 'undefined') {
    localStorage.setItem('gothic_ambient_volume', ambientVolume.toString());
  }
  const audio = getAudioElement();
  if (audio && !isAudioMuted()) {
    audio.volume = ambientVolume;
  }
  notifyListeners();
}

export function isAmbientMusicActive(): boolean {
  return isMusicPlaying;
}

export function getCurrentTrack(): GothicTrack {
  return GOTHIC_TRACKS[currentTrackIndex];
}

export function selectTrack(trackId: string): void {
  const idx = GOTHIC_TRACKS.findIndex((t) => t.id === trackId);
  if (idx === -1 || idx === currentTrackIndex) return;

  const wasPlaying = isMusicPlaying;
  currentTrackIndex = idx;

  if (typeof window !== 'undefined') {
    localStorage.setItem('gothic_current_track_id', trackId);
  }

  const audio = getAudioElement();
  if (audio) {
    audio.pause();
    audio.src = GOTHIC_TRACKS[currentTrackIndex].src;
    audio.currentTime = 0;
    audio.volume = isAudioMuted() ? 0 : ambientVolume;
    if (wasPlaying) {
      audio.play().catch((err) => console.debug('Autoplay hindered:', err));
    }
  }
  notifyListeners();
}

export function nextTrack(): void {
  const nextIdx = (currentTrackIndex + 1) % GOTHIC_TRACKS.length;
  selectTrack(GOTHIC_TRACKS[nextIdx].id);
}

export function previousTrack(): void {
  const prevIdx = (currentTrackIndex - 1 + GOTHIC_TRACKS.length) % GOTHIC_TRACKS.length;
  selectTrack(GOTHIC_TRACKS[prevIdx].id);
}

export function seekTrack(timeInSeconds: number): void {
  const audio = getAudioElement();
  if (audio && !isNaN(audio.duration)) {
    audio.currentTime = Math.max(0, Math.min(audio.duration, timeInSeconds));
    notifyListeners();
  }
}

/**
 * Start playing authentic Gothic instrumental music
 */
export function startAmbientMusic(): void {
  const audio = getAudioElement();
  if (!audio) return;

  if (isAudioMuted()) {
    setAudioMuted(false);
  }

  audio.volume = ambientVolume;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isMusicPlaying = true;
        notifyListeners();
      })
      .catch((error) => {
        console.warn('Audio play hindered by browser policy:', error);
      });
  }
}

/**
 * Stop / Pause Gothic instrumental music
 */
export function stopAmbientMusic(): void {
  const audio = getAudioElement();
  if (audio) {
    audio.pause();
  }
  isMusicPlaying = false;
  notifyListeners();
}

export function toggleAmbientMusic(): boolean {
  if (isMusicPlaying) {
    stopAmbientMusic();
    return false;
  } else {
    startAmbientMusic();
    return true;
  }
}

// ---------------------------------------------------------------------------
// Atmospheric Organic Sound Effects (Web Audio API with Natural Acoustics)
// Deep reverberant church bell, rolling atmospheric thunder, parchment tock
// ---------------------------------------------------------------------------

let sfxAudioCtx: AudioContext | null = null;

function getSfxContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sfxAudioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      sfxAudioCtx = new AudioContextClass();
    }
  }
  if (sfxAudioCtx && sfxAudioCtx.state === 'suspended') {
    sfxAudioCtx.resume().catch(() => {});
  }
  return sfxAudioCtx;
}

/**
 * Deep cathedral bell with realistic metallic acoustic decay & overtones
 */
export function playGothicBell(): void {
  if (isAudioMuted()) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const masterSfxGain = ctx.createGain();
    masterSfxGain.gain.setValueAtTime(0.35, now);
    masterSfxGain.connect(ctx.destination);

    // Natural cathedral bell partial frequencies (strike tone, tierce, quint, octave)
    const fundamental = 130.81; // C3 low church bell
    const partials = [
      { freq: fundamental * 0.5, gain: 0.5, decay: 3.5 },  // Sub-octave hum
      { freq: fundamental * 1.0, gain: 0.8, decay: 2.8 },  // Prime strike tone
      { freq: fundamental * 1.2, gain: 0.6, decay: 2.4 },  // Minor third (tierce)
      { freq: fundamental * 1.5, gain: 0.4, decay: 2.0 },  // Fifth (quint)
      { freq: fundamental * 2.0, gain: 0.3, decay: 1.6 },  // Nominal octave
      { freq: fundamental * 2.76, gain: 0.15, decay: 1.2 }, // Superquint
    ];

    partials.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      pGain.gain.setValueAtTime(0.001, now);
      pGain.gain.linearRampToValueAtTime(gain, now + 0.015);
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(pGain);
      pGain.connect(masterSfxGain);

      osc.start(now);
      osc.stop(now + decay + 0.1);
    });
  } catch (err) {
    console.debug('Gothic bell SFX error:', err);
  }
}

/**
 * Distant realistic thunder with low frequency sub-rumble
 */
export function playThunder(): void {
  if (isAudioMuted()) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  try {
    const duration = 2.5;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    // Generate brown/pink noise suitable for natural thunder rumble
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 4.0;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Warm resonant sub-bass filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (err) {
    console.debug('Thunder error:', err);
  }
}

/**
 * Natural stone/wood artifact selection click
 */
export function playTock(): void {
  if (isAudioMuted()) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.06);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch (err) {
    console.debug('Tock error:', err);
  }
}

/**
 * Mystical vault void banish whoosh
 */
export function playBanishSound(): void {
  if (isAudioMuted()) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.8);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.exponentialRampToValueAtTime(40, now + 0.8);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.8);
  } catch (err) {
    console.debug('Banish sound error:', err);
  }
}

/**
 * Antique Gothic Music Box melody for Pullip Doll Darina (Haunting, delicate chime ringtone in D Minor)
 */
export function playDarinaChime(): void {
  if (isAudioMuted()) return;

  const ctx = getSfxContext();
  if (!ctx) return;

  try {
    // Beautiful, eerie Gothic music box ringtone melody in D Minor
    // (D5 -> F5 -> A5 -> D6 -> C#6 -> Bb5 -> A5 -> G5 -> F5 -> E5 -> D5 -> D5 octave bell)
    const melody: { freq: number; delay: number; duration: number; volume: number }[] = [
      { freq: 587.33, delay: 0.0, duration: 0.8, volume: 0.14 },    // D5
      { freq: 698.46, delay: 0.18, duration: 0.7, volume: 0.15 },   // F5
      { freq: 880.0, delay: 0.36, duration: 0.8, volume: 0.16 },    // A5
      { freq: 1174.66, delay: 0.54, duration: 1.0, volume: 0.18 },  // D6
      { freq: 1108.73, delay: 0.84, duration: 0.9, volume: 0.17 },  // C#6 (Gothic dark mystery interval)
      { freq: 932.33, delay: 1.14, duration: 0.8, volume: 0.15 },   // Bb5
      { freq: 880.0, delay: 1.40, duration: 0.9, volume: 0.16 },    // A5
      { freq: 783.99, delay: 1.66, duration: 0.7, volume: 0.14 },   // G5
      { freq: 698.46, delay: 1.90, duration: 0.8, volume: 0.15 },   // F5
      { freq: 659.25, delay: 2.14, duration: 0.8, volume: 0.14 },   // E5
      { freq: 587.33, delay: 2.40, duration: 2.0, volume: 0.18 },   // D5 (Fundamental root note)
      { freq: 1174.66, delay: 2.44, duration: 2.2, volume: 0.12 },  // D6 (High octave music box sparkle)
    ];

    melody.forEach(({ freq, delay, duration, volume }) => {
      const now = ctx.currentTime + delay;

      // Primary music box metal tine (pure triangle waveform for mechanical resonance)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Delicate metallic overtone (sine wave tuned to 2.756x antique bell harmonic)
      const oscHarmonic = ctx.createOscillator();
      const gainHarmonic = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      oscHarmonic.type = 'sine';
      oscHarmonic.frequency.setValueAtTime(freq * 2.756, now);

      // Instant percussive strike attack with long, crystal-clear music box decay
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.007);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      gainHarmonic.gain.setValueAtTime(0.0001, now);
      gainHarmonic.gain.linearRampToValueAtTime(volume * 0.38, now + 0.005);
      gainHarmonic.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.55);

      osc.connect(gain);
      oscHarmonic.connect(gainHarmonic);

      gain.connect(ctx.destination);
      gainHarmonic.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);

      oscHarmonic.start(now);
      oscHarmonic.stop(now + duration + 0.05);
    });
  } catch (err) {
    console.debug('Darina gothic music box error:', err);
  }
}

