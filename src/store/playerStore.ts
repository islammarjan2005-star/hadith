'use client';

import { create } from 'zustand';
import { QueueItem } from '@/types';
import { resolveAudioUrl } from '@/lib/audioHelper';

type RepeatMode = 'off' | 'one' | 'all';

interface PlayerState {
  currentTrack: QueueItem | null;
  queue: QueueItem[];
  queueIndex: number;
  isPlaying: boolean;
  isBuffering: boolean;
  hasError: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  repeatMode: RepeatMode;
  shuffle: boolean;
  playbackRate: number;
  audioElement: HTMLAudioElement | null;

  setAudioElement: (el: HTMLAudioElement) => void;
  playTrack: (track: QueueItem) => void;
  playQueue: (tracks: QueueItem[], startIndex?: number) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  setDuration: (d: number) => void;
  setCurrentTime: (t: number) => void;
  setBuffering: (b: boolean) => void;
  setError: (e: boolean) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  cyclePlaybackRate: () => void;
  handleEnded: () => void;
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  queueIndex: -1,
  isPlaying: false,
  isBuffering: false,
  hasError: false,
  duration: 0,
  currentTime: 0,
  volume: 0.7,
  repeatMode: 'off',
  shuffle: false,
  playbackRate: 1,
  audioElement: null,

  setAudioElement: (el) => set({ audioElement: el }),

  playTrack: (track) => {
    const { audioElement, playbackRate } = get();
    set({ currentTrack: track, queue: [track], queueIndex: 0, isPlaying: true, hasError: false });
    if (audioElement) {
      audioElement.src = track.audioUrl;
      audioElement.playbackRate = playbackRate;
      audioElement.play().catch(() => set({ isPlaying: false }));
    }
  },

  playQueue: (tracks, startIndex = 0) => {
    const { audioElement, playbackRate } = get();
    const track = tracks[startIndex];
    if (!track) return;
    set({ queue: tracks, queueIndex: startIndex, currentTrack: track, isPlaying: true, hasError: false });
    if (audioElement) {
      audioElement.src = track.audioUrl;
      audioElement.playbackRate = playbackRate;
      audioElement.play().catch(() => set({ isPlaying: false }));
    }
  },

  togglePlay: () => {
    const { audioElement, isPlaying } = get();
    if (!audioElement) return;
    if (isPlaying) {
      audioElement.pause();
      set({ isPlaying: false });
    } else {
      audioElement.play().catch(() => {});
      set({ isPlaying: true });
    }
  },

  pause: () => {
    const { audioElement } = get();
    audioElement?.pause();
    set({ isPlaying: false });
  },

  resume: () => {
    const { audioElement } = get();
    audioElement?.play().catch(() => {});
    set({ isPlaying: true });
  },

  next: async () => {
    const { queue, queueIndex, audioElement, repeatMode, shuffle, playbackRate } = get();
    let nextIndex: number;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = queueIndex + 1;
    }

    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        set({ isPlaying: false });
        return;
      }
    }

    const track = queue[nextIndex];
    if (!track) return;

    // Resolve audio URL if not yet set (lazy queue)
    let audioUrl = track.audioUrl;
    if (!audioUrl) {
      set({ isBuffering: true });
      audioUrl = await resolveAudioUrl(7, track.chapterId);
      queue[nextIndex] = { ...track, audioUrl };
    }

    set({ queueIndex: nextIndex, currentTrack: { ...track, audioUrl }, isPlaying: true, hasError: false, isBuffering: false });
    if (audioElement) {
      audioElement.src = audioUrl;
      audioElement.playbackRate = playbackRate;
      audioElement.play().catch(() => set({ isPlaying: false }));
    }
  },

  prev: async () => {
    const { queue, queueIndex, audioElement, currentTime, playbackRate } = get();
    if (currentTime > 3) {
      if (audioElement) {
        audioElement.currentTime = 0;
      }
      return;
    }
    const prevIndex = queueIndex - 1;
    if (prevIndex >= 0) {
      const track = queue[prevIndex];

      let audioUrl = track.audioUrl;
      if (!audioUrl) {
        set({ isBuffering: true });
        audioUrl = await resolveAudioUrl(7, track.chapterId);
        queue[prevIndex] = { ...track, audioUrl };
      }

      set({ queueIndex: prevIndex, currentTrack: { ...track, audioUrl }, isPlaying: true, hasError: false, isBuffering: false });
      if (audioElement) {
        audioElement.src = audioUrl;
        audioElement.playbackRate = playbackRate;
        audioElement.play().catch(() => set({ isPlaying: false }));
      }
    }
  },

  seek: (time) => {
    const { audioElement, duration } = get();
    const clampedTime = Math.max(0, Math.min(time, duration));
    if (audioElement) {
      audioElement.currentTime = clampedTime;
      set({ currentTime: clampedTime });
    }
  },

  setVolume: (vol) => {
    const { audioElement } = get();
    const clamped = Math.max(0, Math.min(1, vol));
    if (audioElement) {
      audioElement.volume = clamped;
    }
    set({ volume: clamped });
  },

  setDuration: (d) => set({ duration: d }),
  setCurrentTime: (t) => set({ currentTime: t }),
  setBuffering: (b) => set({ isBuffering: b }),
  setError: (e) => set({ hasError: e }),

  toggleRepeat: () => {
    const { repeatMode } = get();
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const nextIdx = (modes.indexOf(repeatMode) + 1) % modes.length;
    set({ repeatMode: modes[nextIdx] });
  },

  toggleShuffle: () => {
    set((state) => ({ shuffle: !state.shuffle }));
  },

  cyclePlaybackRate: () => {
    const { playbackRate, audioElement } = get();
    const currentIdx = PLAYBACK_RATES.indexOf(playbackRate);
    const nextIdx = (currentIdx + 1) % PLAYBACK_RATES.length;
    const newRate = PLAYBACK_RATES[nextIdx];
    if (audioElement) {
      audioElement.playbackRate = newRate;
    }
    set({ playbackRate: newRate });
  },

  handleEnded: () => {
    const { repeatMode, audioElement } = get();
    if (repeatMode === 'one' && audioElement) {
      audioElement.currentTime = 0;
      audioElement.play().catch(() => {});
    } else {
      get().next();
    }
  },
}));
