'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import AudioPlayer from '@/components/player/AudioPlayer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden gap-2 p-2">
        <Sidebar />
        <main className="flex-1 bg-sp-dark rounded-lg overflow-y-auto">
          <TopBar />
          <div className="px-4 md:px-6 pb-32">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
      <AudioPlayer />
    </div>
  );
}
