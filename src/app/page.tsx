'use client';

import { useEffect, useState, useCallback } from 'react';
import { Chapter } from '@/types';
import { getChapters } from '@/lib/api';
import SurahCard from '@/components/surah/SurahCard';
import { useLibraryStore } from '@/store/libraryStore';
import { GridSkeleton } from '@/components/ui/SkeletonLoader';
import ErrorRetry from '@/components/ui/ErrorRetry';
import DailyVerse from '@/components/home/DailyVerse';
import Link from 'next/link';

// 30 Juz ranges for the progress circles
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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 7) return 'Fajr Mubarak';
  if (hour >= 7 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 16) return 'Good Afternoon';
  if (hour >= 16 && hour < 19) return 'Good Evening';
  return 'As-salamu alaykum';
}

function isJuzCompleted(juz: { start: number; end: number }, completedSurahs: number[]): boolean {
  for (let i = juz.start; i <= juz.end; i++) {
    if (!completedSurahs.includes(i)) return false;
  }
  return true;
}

function isJuzPartial(juz: { start: number; end: number }, completedSurahs: number[]): boolean {
  for (let i = juz.start; i <= juz.end; i++) {
    if (completedSurahs.includes(i)) return true;
  }
  return false;
}

export default function HomePage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { recentlyPlayed, completedSurahs } = useLibraryStore();

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

  const recentChapters = recentlyPlayed
    .slice(0, 6)
    .map((r) => chapters.find((c) => c.id === r.chapterId))
    .filter(Boolean) as Chapter[];

  // Recommended: surahs not yet played, pick a curated mix
  const playedIds = new Set(recentlyPlayed.map((r) => r.chapterId));
  const completedSet = new Set(completedSurahs);
  const recommended = chapters
    .filter((c) => !playedIds.has(c.id) && !completedSet.has(c.id))
    .filter((c) => [1, 2, 3, 12, 18, 19, 36, 55, 56, 67, 78, 112].includes(c.id) || c.verses_count <= 15)
    .slice(0, 6);

  const completedJuzCount = JUZ_RANGES.filter((j) => isJuzCompleted(j, completedSurahs)).length;

  return (
    <div className="space-y-8 animate-fadeSlideIn">
      {/* Greeting */}
      <div className="pt-2">
        <h1 className="text-2xl md:text-3xl font-bold text-nr-text">{getGreeting()}</h1>
      </div>

      {/* Daily Verse */}
      <DailyVerse />

      {/* Continue Listening */}
      {recentChapters.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-nr-text mb-3">Continue Listening</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recentChapters.map((chapter) => (
              <SurahCard key={chapter.id} chapter={chapter} allChapters={chapters} />
            ))}
          </div>
        </section>
      )}

      {/* Your Journey — 30 Juz circles */}
      <section className="bg-nr-surface/50 rounded-xl p-5 border border-nr-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-nr-text">Your Journey</h2>
            <p className="text-xs text-nr-muted mt-0.5">
              {completedJuzCount} of 30 Juz · {completedSurahs.length} of 114 Surahs
            </p>
          </div>
          <Link href="/library" className="text-xs text-nr-gold hover:text-nr-gold-light font-medium">
            View stats
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {JUZ_RANGES.map((j) => {
            const completed = isJuzCompleted(j, completedSurahs);
            const partial = isJuzPartial(j, completedSurahs);
            return (
              <div
                key={j.juz}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  completed
                    ? 'bg-nr-gold text-nr-base'
                    : partial
                      ? 'bg-nr-gold/20 text-nr-gold border border-nr-gold/30'
                      : 'bg-nr-panel/60 text-nr-muted border border-nr-border'
                }`}
                title={`Juz ${j.juz}`}
              >
                {j.juz}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recommended */}
      {recommended.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-nr-text">Recommended For You</h2>
            <Link href="/browse" className="text-xs text-nr-muted hover:text-nr-text font-medium">
              Browse all
            </Link>
          </div>
          {loading ? (
            <GridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recommended.map((chapter) => (
                <SurahCard key={chapter.id} chapter={chapter} allChapters={chapters} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
