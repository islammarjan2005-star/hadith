'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoHomeSharp, IoHomeOutline, IoSearchSharp, IoCloseCircle } from 'react-icons/io5';
import { MdOutlineExplore, MdExplore } from 'react-icons/md';
import { BiLibrary } from 'react-icons/bi';
import NoorLogo from '@/components/ui/NoorLogo';

const navItems = [
  { href: '/', label: 'Home', icon: IoHomeOutline, activeIcon: IoHomeSharp, exact: true },
  { href: '/browse', label: 'Surahs', icon: MdOutlineExplore, activeIcon: MdExplore, exact: false },
  { href: '/library', label: 'My Quran', icon: BiLibrary, activeIcon: BiLibrary, exact: true },
];

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-nr-base/90 backdrop-blur-md border-b border-nr-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <NoorLogo size={32} />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? 'bg-nr-panel text-nr-text'
                    : 'text-nr-muted hover:text-nr-text'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Search */}
        <div className="ml-auto flex items-center">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search surahs or verses..."
                autoFocus
                className="w-48 md:w-64 bg-nr-panel text-nr-text text-sm px-4 py-1.5 rounded-full outline-none border border-nr-border focus:border-nr-gold placeholder:text-nr-muted"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="text-nr-muted hover:text-nr-text"
              >
                <IoCloseCircle size={20} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-8 h-8 rounded-full bg-nr-panel/60 flex items-center justify-center text-nr-muted hover:text-nr-text transition-colors"
              aria-label="Search"
            >
              <IoSearchSharp size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
