'use client';

import { create } from 'zustand';
import { QueueItem } from '@/types';

interface PlayerState {
  currentTrack: QueueItem | null;
  queue: QueueItem[];
  queueIndex: number;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
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
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  queueIndex: -1,
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  volume: 0.7,
  audioElement: null,

  setAudioElement: (el) => set({ audioElement: el }),

  playTrack: (track) => {
    const { audioElement } = get();
    set({ currentTrack: track, queue: [track], queueIndex: 0, isPlaying: true });
    if (audioElement) {
      audioElement.src = track.audioUrl;
      audioElement.play().catch(() => {});
    }
  },

  playQueue: (tracks, startIndex = 0) => {
    const { audioElement } = get();
    const track = tracks[startIndex];
    if (!track) return;
    set({ queue: tracks, queueIndex: startIndex, currentTrack: track, isPlaying: true });
    if (audioElement) {
      audioElement.src = track.audioUrl;
      audioElement.play().catch(() => {});
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

  next: () => {
    const { queue, queueIndex, audioElement } = get();
    const nextIndex = queueIndex + 1;
    if (nextIndex < queue.length) {
      const track = queue[nextIndex];
      set({ queueIndex: nextIndex, currentTrack: track, isPlaying: true });
      if (audioElement) {
        audioElement.src = track.audioUrl;
        audioElement.play().catch(() => {});
      }
    }
  },

  prev: () => {
    const { queue, queueIndex, audioElement, currentTime } = get();
    if (currentTime > 3) {
      if (audioElement) {
        audioElement.currentTime = 0;
      }
      return;
    }
    const prevIndex = queueIndex - 1;
    if (prevIndex >= 0) {
      const track = queue[prevIndex];
      set({ queueIndex: prevIndex, currentTrack: track, isPlaying: true });
      if (audioElement) {
        audioElement.src = track.audioUrl;
        audioElement.play().catch(() => {});
      }
    }
  },

  seek: (time) => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.currentTime = time;
      set({ currentTime: time });
    }
  },

  setVolume: (vol) => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.volume = vol;
    }
    set({ volume: vol });
  },

  setDuration: (d) => set({ duration: d }),
  setCurrentTime: (t) => set({ currentTime: t }),
}));
