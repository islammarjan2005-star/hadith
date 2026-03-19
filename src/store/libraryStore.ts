'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentItem {
  chapterId: number;
  chapterName: string;
  timestamp: number;
}

interface Bookmark {
  chapterId: number;
  chapterName: string;
  position: number;
  verseKey: string;
  timestamp: number;
}

interface LibraryState {
  favorites: number[];
  recentlyPlayed: RecentItem[];
  bookmarks: Bookmark[];
  totalListenTime: number;
  listenStreak: number;
  lastListenDate: string;
  completedSurahs: number[];

  toggleFavorite: (chapterId: number) => void;
  isFavorite: (chapterId: number) => boolean;
  addToRecent: (chapterId: number, chapterName: string) => void;
  saveBookmark: (bookmark: Omit<Bookmark, 'timestamp'>) => void;
  removeBookmark: (chapterId: number) => void;
  getBookmark: (chapterId: number) => Bookmark | undefined;
  addListenTime: (seconds: number) => void;
  markSurahComplete: (chapterId: number) => void;
}

function getDateKey(): string {
  return new Date().toISOString().split('T')[0];
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      favorites: [],
      recentlyPlayed: [],
      bookmarks: [],
      totalListenTime: 0,
      listenStreak: 0,
      lastListenDate: '',
      completedSurahs: [],

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

      saveBookmark: (bookmark) => {
        const { bookmarks } = get();
        const filtered = bookmarks.filter((b) => b.chapterId !== bookmark.chapterId);
        set({ bookmarks: [{ ...bookmark, timestamp: Date.now() }, ...filtered] });
      },

      removeBookmark: (chapterId) => {
        const { bookmarks } = get();
        set({ bookmarks: bookmarks.filter((b) => b.chapterId !== chapterId) });
      },

      getBookmark: (chapterId) => {
        return get().bookmarks.find((b) => b.chapterId === chapterId);
      },

      addListenTime: (seconds) => {
        const { lastListenDate, listenStreak } = get();
        const today = getDateKey();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        let newStreak = listenStreak;
        if (lastListenDate !== today) {
          if (lastListenDate === yesterday) {
            newStreak = listenStreak + 1;
          } else if (!lastListenDate) {
            newStreak = 1;
          } else {
            newStreak = 1;
          }
        }

        set((state) => ({
          totalListenTime: state.totalListenTime + seconds,
          lastListenDate: today,
          listenStreak: newStreak,
        }));
      },

      markSurahComplete: (chapterId) => {
        const { completedSurahs } = get();
        if (!completedSurahs.includes(chapterId)) {
          set({ completedSurahs: [...completedSurahs, chapterId] });
        }
      },
    }),
    { name: 'quran-library' }
  )
);
