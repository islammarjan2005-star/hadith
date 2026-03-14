'use client';

import { useRouter } from 'next/navigation';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

export default function TopBar() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10 bg-gradient-to-b from-sp-black/80 to-transparent backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90 transition-colors"
        >
          <IoChevronBack size={18} className="text-sp-white" />
        </button>
        <button
          onClick={() => router.forward()}
          className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90 transition-colors"
        >
          <IoChevronForward size={18} className="text-sp-white" />
        </button>
      </div>
    </div>
  );
}
