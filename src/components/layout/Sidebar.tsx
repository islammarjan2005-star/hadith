'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoHomeSharp, IoHomeOutline, IoSearchSharp, IoSearchOutline } from 'react-icons/io5';
import { BiLibrary } from 'react-icons/bi';
import { MdOutlineExplore, MdExplore } from 'react-icons/md';

const navItems = [
  { href: '/', label: 'Home', icon: IoHomeOutline, activeIcon: IoHomeSharp, exact: true },
  { href: '/search', label: 'Search', icon: IoSearchOutline, activeIcon: IoSearchSharp, exact: true },
  { href: '/browse', label: 'Browse', icon: MdOutlineExplore, activeIcon: MdExplore, exact: false },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className="hidden md:flex flex-col w-[280px] h-full gap-2">
      <div className="bg-nr-surface rounded-lg p-4">
        <Link href="/" className="flex items-center gap-3 mb-6 px-2">
          {/* Noor logo — crescent + star mark */}
          <div className="w-9 h-9 relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-nr-gold to-amber-600 opacity-20" />
            <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none">
              <path d="M18 4C10.3 4 4 10.3 4 18s6.3 14 14 14c-5.5 0-10-6.3-10-14S12.5 4 18 4z" fill="#d4a846" />
              <circle cx="26" cy="10" r="2.5" fill="#e2bc5e" />
            </svg>
          </div>
          <div>
            <span className="text-gold-gradient font-bold text-lg tracking-wide">Noor</span>
            <p className="text-nr-muted text-[10px] -mt-0.5 tracking-widest uppercase">Quran</p>
          </div>
        </Link>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = active ? item.activeIcon : item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-4 px-3 py-2 rounded-md transition-colors text-sm font-semibold ${
                  active
                    ? 'text-nr-text bg-nr-panel/70'
                    : 'text-nr-muted hover:text-nr-text'
                }`}
              >
                <Icon size={24} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="bg-nr-surface rounded-lg p-4 flex-1 overflow-y-auto">
        <Link
          href="/library"
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-semibold ${
            pathname === '/library'
              ? 'text-nr-text bg-nr-panel/70'
              : 'text-nr-muted hover:text-nr-text'
          }`}
        >
          <BiLibrary size={24} />
          Your Library
        </Link>
        <div className="mt-4 px-3">
          <p className="text-nr-muted text-xs">
            Save your favorite surahs to easily find them here.
          </p>
        </div>
      </div>
    </aside>
  );
}
