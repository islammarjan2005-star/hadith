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

  const featuredSurahs = chapters.filter((c) =>
    [1, 2, 18, 36, 55, 56, 67, 78, 112, 114].includes(c.id)
  );

  const recentChapters = recentlyPlayed
    .slice(0, 6)
    .map((r) => chapters.find((c) => c.id === r.chapterId))
    .filter(Boolean) as Chapter[];

  // Quran progress
  const quranProgress = chapters.length > 0 ? Math.round((completedSurahs.length / 114) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeSlideIn">
      {/* Quran Reading Progress */}
      {completedSurahs.length > 0 && (
        <div className="flex items-center gap-4 bg-nr-panel/40 rounded-lg p-4 border border-nr-border">
          <div className="flex-1">
            <p className="text-sm font-medium text-nr-text">Your Quran Journey</p>
            <p className="text-xs text-nr-muted mt-0.5">{completedSurahs.length} of 114 surahs completed</p>
            <div className="mt-2 h-1.5 bg-nr-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-nr-gold to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${quranProgress}%` }}
              />
            </div>
          </div>
          <span className="text-2xl font-bold text-gold-gradient">{quranProgress}%</span>
        </div>
      )}

      {/* Daily Verse */}
      <DailyVerse />

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-nr-text">Featured Surahs</h2>
          <Link href="/browse" className="text-sm text-nr-muted hover:text-nr-text font-semibold">
            Show all
          </Link>
        </div>
        {loading ? (
          <GridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {featuredSurahs.slice(0, 6).map((chapter) => (
              <SurahCard key={chapter.id} chapter={chapter} allChapters={chapters} />
            ))}
          </div>
        )}
      </section>

      {recentChapters.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-nr-text mb-4">Recently Played</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recentChapters.map((chapter) => (
              <SurahCard key={chapter.id} chapter={chapter} allChapters={chapters} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-nr-text">Short Surahs</h2>
          <Link href="/browse" className="text-sm text-nr-muted hover:text-nr-text font-semibold">
            Show all
          </Link>
        </div>
        {loading ? (
          <GridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {chapters
              .filter((c) => c.verses_count <= 20)
              .slice(0, 6)
              .map((chapter) => (
                <SurahCard key={chapter.id} chapter={chapter} allChapters={chapters} />
              ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-nr-text mb-4">Meccan Surahs</h2>
        {loading ? (
          <GridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {chapters
              .filter((c) => c.revelation_place === 'makkah')
              .slice(0, 6)
              .map((chapter) => (
                <SurahCard key={chapter.id} chapter={chapter} allChapters={chapters} />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
