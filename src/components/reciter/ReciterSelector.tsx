'use client';

import { useState, useEffect, useRef } from 'react';
import { IoChevronDown, IoCheckmark } from 'react-icons/io5';
import { useReciterStore } from '@/store/reciterStore';
import { getReciters } from '@/lib/api';
import { Reciter } from '@/types';

export default function ReciterSelector() {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { selectedReciterId, selectedReciterName, setReciter } = useReciterStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-sp-light-gray hover:text-sp-white transition-colors bg-sp-gray px-3 py-1.5 rounded-full"
      >
        <span className="truncate max-w-[200px]">{selectedReciterName}</span>
        <IoChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-72 max-h-80 overflow-y-auto bg-sp-gray rounded-lg shadow-2xl z-50 py-1">
          {loading ? (
            <p className="text-sp-light-gray text-sm p-3">Loading reciters...</p>
          ) : (
            reciters.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setReciter(r.id, r.reciter_name);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-sp-hover flex items-center justify-between ${
                  r.id === selectedReciterId ? 'text-sp-green' : 'text-sp-white'
                }`}
              >
                <span>
                  {r.reciter_name}
                  {r.style && <span className="text-sp-light-gray ml-1">({r.style})</span>}
                </span>
                {r.id === selectedReciterId && <IoCheckmark size={16} />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
