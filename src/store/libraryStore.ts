'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentItem {
  chapterId: number;
  chapterName: string;
  timestamp: number;
}

interface LibraryState {
  favorites: number[];
  recentlyPlayed: RecentItem[];
  toggleFavorite: (chapterId: number) => void;
  isFavorite: (chapterId: number) => boolean;
  addToRecent: (chapterId: number, chapterName: string) => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      favorites: [],
      recentlyPlayed: [],

      toggleFavorite: (chapterId) => {
        const { favorites } = get();
        if (favorites.includes(chapterId)) {
          set({ favorites: favorites.filter((id) => id !== chapterId) });
        } else {
          set({ favorites: [...favorites, chapterId] });
        }
      },

      isFavorite: (chapterId) => get().favorites.includes(chapterId),

      addToRecent: (chapterId, chapterName) => {
        const { recentlyPlayed } = get();
        const filtered = recentlyPlayed.filter((r) => r.chapterId !== chapterId);
        const updated = [{ chapterId, chapterName, timestamp: Date.now() }, ...filtered].slice(0, 20);
        set({ recentlyPlayed: updated });
      },
    }),
    { name: 'quran-library' }
  )
);
