'use client';

import { useEffect, useState } from 'react';
import { Chapter } from '@/types';
import { getChapters } from '@/lib/api';
import SurahRow from '@/components/surah/SurahRow';
import { RowSkeleton } from '@/components/ui/SkeletonLoader';

type Filter = 'all' | 'makkah' | 'madinah';

export default function BrowsePage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    getChapters()
      .then(setChapters)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === 'all'
      ? chapters
      : chapters.filter((c) => c.revelation_place === filter);

  return (
    <div>
      <h1 className="text-3xl font-bold text-sp-white mb-6">Browse Surahs</h1>

      <div className="flex gap-2 mb-6">
        {(['all', 'makkah', 'madinah'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-sp-white text-black'
                : 'bg-sp-gray text-sp-white hover:bg-sp-hover'
            }`}
          >
            {f === 'all' ? 'All' : f === 'makkah' ? 'Meccan' : 'Medinan'}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 px-4 py-2 border-b border-sp-gray text-xs text-sp-light-gray uppercase tracking-wider mb-2">
        <span className="w-8 text-center">#</span>
        <span className="flex-1">Title</span>
        <span className="hidden sm:block">Type</span>
        <span className="hidden sm:block w-16 text-right">Verses</span>
        <span className="w-8"></span>
      </div>

      {loading ? (
        <div className="space-y-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div>
          {filtered.map((chapter, idx) => (
            <SurahRow key={chapter.id} chapter={chapter} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
