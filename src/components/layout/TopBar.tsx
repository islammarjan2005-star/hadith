'use client';

import { useRouter, usePathname } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10 bg-gradient-to-b from-nr-base/80 to-transparent backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {!isHome && (
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-nr-base/70 flex items-center justify-center hover:bg-nr-panel transition-colors"
            aria-label="Go back"
          >
            <IoChevronBack size={18} className="text-nr-text" />
          </button>
        )}
      </div>
    </div>
  );
}
