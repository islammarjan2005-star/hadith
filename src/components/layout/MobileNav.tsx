'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoHomeSharp, IoHomeOutline, IoSearchSharp, IoSearchOutline } from 'react-icons/io5';
import { BiLibrary } from 'react-icons/bi';
import { MdOutlineExplore, MdExplore } from 'react-icons/md';

const navItems = [
  { href: '/', label: 'Home', icon: IoHomeOutline, activeIcon: IoHomeSharp },
  { href: '/search', label: 'Search', icon: IoSearchOutline, activeIcon: IoSearchSharp },
  { href: '/browse', label: 'Browse', icon: MdOutlineExplore, activeIcon: MdExplore },
  { href: '/library', label: 'Library', icon: BiLibrary, activeIcon: BiLibrary },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-[72px] left-0 right-0 bg-gradient-to-t from-sp-black via-sp-black/95 to-transparent px-4 pt-6 pb-2 z-20">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.activeIcon : item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
                isActive ? 'text-sp-white' : 'text-sp-light-gray'
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
