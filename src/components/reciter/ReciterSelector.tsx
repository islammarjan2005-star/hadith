'use client';

import { useState, useEffect, useRef } from 'react';
import { IoChevronDown, IoCheckmark, IoSearchSharp } from 'react-icons/io5';
import { useReciterStore } from '@/store/reciterStore';
import { getReciters } from '@/lib/api';
import { Reciter } from '@/types';

export default function ReciterSelector() {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { selectedReciterId, selectedReciterName, setReciter } = useReciterStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getReciters();
        setReciters(data);
      } catch {
        // fallback - keep empty
      }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const filtered = search
    ? reciters.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.translated_name?.name || '').toLowerCase().includes(search.toLowerCase())
      )
    : reciters;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setOpen(!open);
          setSearch('');
        }}
        className="flex items-center gap-2 text-sm text-sp-light-gray hover:text-sp-white transition-colors bg-sp-gray px-3 py-1.5 rounded-full"
      >
        <span className="truncate max-w-[200px]">{selectedReciterName}</span>
        <IoChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-sp-gray rounded-lg shadow-2xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-[#3a3a3a]">
            <div className="relative">
              <IoSearchSharp size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sp-light-gray" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reciters..."
                className="w-full bg-[#3a3a3a] text-sp-white text-sm pl-8 pr-3 py-2 rounded-md outline-none placeholder:text-sp-light-gray"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto py-1">
            {loading ? (
              <p className="text-sp-light-gray text-sm p-3 text-center">Loading reciters...</p>
            ) : filtered.length === 0 ? (
              <p className="text-sp-light-gray text-sm p-3 text-center">No reciters found</p>
            ) : (
              filtered.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setReciter(r.id, r.name);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-3 py-2.5 text-sm hover:bg-sp-hover flex items-center justify-between transition-colors ${
                    r.id === selectedReciterId ? 'text-sp-green' : 'text-sp-white'
                  }`}
                >
                  <span className="truncate mr-2">
                    {r.name}
                    {r.style && <span className="text-sp-light-gray ml-1">({r.style.name})</span>}
                  </span>
                  {r.id === selectedReciterId && <IoCheckmark size={16} className="shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
