'use client';

import { useEffect, useState, useCallback } from 'react';
import { Chapter } from '@/types';
import { getChapters } from '@/lib/api';
import SurahRow from '@/components/surah/SurahRow';
import { RowSkeleton } from '@/components/ui/SkeletonLoader';
import ErrorRetry from '@/components/ui/ErrorRetry';

type Filter = 'all' | 'makkah' | 'madinah';
type BrowseMode = 'surah' | 'juz';

// Group chapters by Juz (approximation based on standard Quran division)
const JUZ_RANGES: { juz: number; start: number; end: number }[] = [
  { juz: 1, start: 1, end: 2 }, { juz: 2, start: 2, end: 2 }, { juz: 3, start: 2, end: 3 },
  { juz: 4, start: 3, end: 4 }, { juz: 5, start: 4, end: 4 }, { juz: 6, start: 4, end: 5 },
  { juz: 7, start: 5, end: 6 }, { juz: 8, start: 6, end: 7 }, { juz: 9, start: 7, end: 8 },
  { juz: 10, start: 8, end: 9 }, { juz: 11, start: 9, end: 11 }, { juz: 12, start: 11, end: 12 },
  { juz: 13, start: 12, end: 14 }, { juz: 14, start: 15, end: 16 }, { juz: 15, start: 17, end: 18 },
  { juz: 16, start: 18, end: 20 }, { juz: 17, start: 21, end: 22 }, { juz: 18, start: 23, end: 25 },
  { juz: 19, start: 25, end: 27 }, { juz: 20, start: 27, end: 29 }, { juz: 21, start: 29, end: 33 },
  { juz: 22, start: 33, end: 36 }, { juz: 23, start: 36, end: 38 }, { juz: 24, start: 39, end: 41 },
  { juz: 25, start: 41, end: 45 }, { juz: 26, start: 46, end: 51 }, { juz: 27, start: 51, end: 57 },
  { juz: 28, start: 58, end: 66 }, { juz: 29, start: 67, end: 77 }, { juz: 30, start: 78, end: 114 },
];

export default function BrowsePage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [browseMode, setBrowseMode] = useState<BrowseMode>('surah');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getChapters();
      setChapters(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (error && chapters.length === 0) {
    return <ErrorRetry message="Failed to load surahs." onRetry={loadData} />;
  }

  const filtered =
    filter === 'all'
      ? chapters
      : chapters.filter((c) => c.revelation_place === filter);

  return (
    <div className="animate-fadeSlideIn">
      <h1 className="text-3xl font-bold text-nr-text mb-6">Surahs</h1>

      {/* Browse mode toggle */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex bg-nr-panel rounded-full p-0.5">
          <button
            onClick={() => setBrowseMode('surah')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              browseMode === 'surah' ? 'bg-nr-gold text-nr-base' : 'text-nr-muted'
            }`}
          >
            By Surah
          </button>
          <button
            onClick={() => setBrowseMode('juz')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              browseMode === 'juz' ? 'bg-nr-gold text-nr-base' : 'text-nr-muted'
            }`}
          >
            By Juz
          </button>
        </div>
      </div>

      {browseMode === 'surah' && (
        <div className="flex gap-2 mb-6">
          {(['all', 'makkah', 'madinah'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-nr-gold text-nr-base'
                  : 'bg-nr-panel text-nr-text hover:bg-nr-hover'
              }`}
            >
              {f === 'all' ? 'All' : f === 'makkah' ? 'Meccan' : 'Medinan'}
            </button>
          ))}
        </div>
      )}

      {browseMode === 'surah' ? (
        <>
          {loading ? (
            <div className="space-y-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <RowSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div>
              {filtered.map((chapter, idx) => (
                <SurahRow key={chapter.id} chapter={chapter} index={idx} allChapters={filtered} />
              ))}
            </div>
          )}
        </>
      ) : (
        /* Juz Browser */
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <RowSkeleton key={i} />
              ))}
            </div>
          ) : (
            JUZ_RANGES.map((jr) => {
              const juzChapters = chapters.filter(
                (c) => c.id >= jr.start && c.id <= jr.end
              );
              if (juzChapters.length === 0) return null;
              return (
                <div key={jr.juz}>
                  <div className="flex items-center gap-3 mb-2 px-4">
                    <div className="w-8 h-8 rounded-full bg-nr-gold/10 border border-nr-gold/20 flex items-center justify-center">
                      <span className="text-xs text-nr-gold font-bold">{jr.juz}</span>
                    </div>
                    <h3 className="text-sm font-bold text-nr-text">
                      Juz {jr.juz}
                    </h3>
                    <span className="text-xs text-nr-muted">
                      Surahs {jr.start}–{jr.end}
                    </span>
                  </div>
                  <div>
                    {juzChapters.map((chapter, idx) => (
                      <SurahRow key={chapter.id} chapter={chapter} index={idx} allChapters={juzChapters} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
