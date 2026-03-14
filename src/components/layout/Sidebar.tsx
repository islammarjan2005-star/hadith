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
      <div className="bg-sp-dark rounded-lg p-4">
        <Link href="/" className="flex items-center gap-2 mb-6 px-2">
          <div className="w-8 h-8 bg-sp-green rounded-full flex items-center justify-center text-black font-bold text-sm">
            Q
          </div>
          <span className="text-sp-white font-bold text-lg">Quran Player</span>
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
                    ? 'text-sp-white bg-sp-gray/50'
                    : 'text-sp-light-gray hover:text-sp-white'
                }`}
              >
                <Icon size={24} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="bg-sp-dark rounded-lg p-4 flex-1 overflow-y-auto">
        <Link
          href="/library"
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-semibold ${
            pathname === '/library'
              ? 'text-sp-white bg-sp-gray/50'
              : 'text-sp-light-gray hover:text-sp-white'
          }`}
        >
          <BiLibrary size={24} />
          Your Library
        </Link>
        <div className="mt-4 px-3">
          <p className="text-sp-light-gray text-xs">
            Save your favorite surahs to easily find them here.
          </p>
        </div>
      </div>
    </aside>
  );
}
