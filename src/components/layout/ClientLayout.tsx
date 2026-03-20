'use client';

import { useEffect } from 'react';
import TopNav from './TopNav';
import MobileNav from './MobileNav';
import AudioPlayer from '@/components/player/AudioPlayer';
import { usePlayerStore } from '@/store/playerStore';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const { togglePlay, seek, currentTime, setVolume, volume, currentTrack } = usePlayerStore.getState();

      switch (e.code) {
        case 'Space':
          if (currentTrack) {
            e.preventDefault();
            togglePlay();
          }
          break;
        case 'ArrowRight':
          if (currentTrack) {
            e.preventDefault();
            seek(currentTime + 10);
          }
          break;
        case 'ArrowLeft':
          if (currentTrack) {
            e.preventDefault();
            seek(currentTime - 10);
          }
          break;
        case 'KeyM':
          e.preventDefault();
          setVolume(volume === 0 ? 0.7 : 0);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-nr-base">
      <TopNav />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pb-40 md:pb-32 pt-4">
          {children}
        </div>
      </main>
      <MobileNav />
      <AudioPlayer />
    </div>
  );
}
