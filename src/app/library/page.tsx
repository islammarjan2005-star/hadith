'use client';

import { useEffect, useState, useCallback } from 'react';
import { Chapter } from '@/types';
import { getChapters } from '@/lib/api';
import SurahCard from '@/components/surah/SurahCard';
import { useLibraryStore } from '@/store/libraryStore';
import { GridSkeleton } from '@/components/ui/SkeletonLoader';
import ErrorRetry from '@/components/ui/ErrorRetry';

export default function LibraryPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { favorites, recentlyPlayed } = useLibraryStore();

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
    return <ErrorRetry message="Failed to load your library." onRetry={loadData} />;
  }

  const favoriteChapters = chapters.filter((c) => favorites.includes(c.id));
  const recentChapters = recentlyPlayed
    .map((r) => chapters.find((c) => c.id === r.chapterId))
    .filter(Boolean) as Chapter[];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-sp-white mb-6">Your Library</h1>

        <h2 className="text-xl font-bold text-sp-white mb-4">
          Favorites {favoriteChapters.length > 0 && `(${favoriteChapters.length})`}
        </h2>
        {loading ? (
          <GridSkeleton count={6} />
        ) : favoriteChapters.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favoriteChapters.map((chapter) => (
              <SurahCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        ) : (
          <div className="bg-sp-gray rounded-lg p-8 text-center">
            <p className="text-sp-light-gray text-sm">No favorites yet.</p>
            <p className="text-sp-light-gray text-xs mt-1">
              Click the heart icon on any surah to add it here.
            </p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-sp-white mb-4">Recently Played</h2>
        {loading ? (
          <GridSkeleton count={6} />
        ) : recentChapters.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recentChapters.map((chapter) => (
              <SurahCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        ) : (
          <div className="bg-sp-gray rounded-lg p-8 text-center">
            <p className="text-sp-light-gray text-sm">Nothing played yet.</p>
            <p className="text-sp-light-gray text-xs mt-1">
              Start listening to see your history here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
