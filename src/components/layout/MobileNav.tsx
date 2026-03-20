'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoHomeSharp, IoHomeOutline } from 'react-icons/io5';
import { BiLibrary } from 'react-icons/bi';
import { MdOutlineExplore, MdExplore } from 'react-icons/md';

const navItems = [
  { href: '/', label: 'Home', icon: IoHomeOutline, activeIcon: IoHomeSharp, exact: true },
  { href: '/browse', label: 'Surahs', icon: MdOutlineExplore, activeIcon: MdExplore, exact: false },
  { href: '/library', label: 'My Quran', icon: BiLibrary, activeIcon: BiLibrary, exact: true },
];

export default function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-nr-base/95 backdrop-blur-md border-t border-nr-border px-4 py-2 z-20" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex justify-around">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = active ? item.activeIcon : item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium py-1 px-3 ${
                active ? 'text-nr-gold' : 'text-nr-muted'
              }`}
            >
              <Icon size={22} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
