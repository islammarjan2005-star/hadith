'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReciterState {
  selectedReciterId: number;
  selectedReciterName: string;
  setReciter: (id: number, name: string) => void;
}

export const useReciterStore = create<ReciterState>()(
  persist(
    (set) => ({
      selectedReciterId: 7,
      selectedReciterName: 'Mishari Rashid al-`Afasy',
      setReciter: (id, name) => set({ selectedReciterId: id, selectedReciterName: name }),
    }),
    { name: 'quran-reciter' }
  )
);
