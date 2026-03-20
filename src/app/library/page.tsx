'use client';

import { useEffect, useState, useCallback } from 'react';
import { Chapter } from '@/types';
import { getChapters } from '@/lib/api';
import SurahCard from '@/components/surah/SurahCard';
import { useLibraryStore } from '@/store/libraryStore';
import { GridSkeleton } from '@/components/ui/SkeletonLoader';
import ErrorRetry from '@/components/ui/ErrorRetry';
import Link from 'next/link';
import { IoTime, IoFlame, IoCheckmarkCircle, IoBookmark, IoClose } from 'react-icons/io5';
import { formatTime } from '@/lib/utils';

export default function LibraryPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { favorites, recentlyPlayed, bookmarks, totalListenTime, listenStreak, completedSurahs, removeBookmark } = useLibraryStore();

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

  const hours = Math.floor(totalListenTime / 3600);
  const minutes = Math.floor((totalListenTime % 3600) / 60);

  return (
    <div className="space-y-8 animate-fadeSlideIn">
      <section>
        <h1 className="text-3xl font-bold text-nr-text mb-6">My Quran</h1>

        {/* Listening Stats */}
        {totalListenTime > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-nr-panel/50 rounded-xl p-4 text-center border border-nr-border">
              <IoTime size={20} className="text-nr-gold mx-auto mb-1" />
              <p className="text-lg font-bold text-nr-text">
                {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
              </p>
              <p className="text-[10px] text-nr-muted uppercase tracking-wider">Listened</p>
            </div>
            <div className="bg-nr-panel/50 rounded-xl p-4 text-center border border-nr-border">
              <IoFlame size={20} className="text-orange-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-nr-text">{listenStreak}</p>
              <p className="text-[10px] text-nr-muted uppercase tracking-wider">Day Streak</p>
            </div>
            <div className="bg-nr-panel/50 rounded-xl p-4 text-center border border-nr-border">
              <IoCheckmarkCircle size={20} className="text-nr-gold mx-auto mb-1" />
              <p className="text-lg font-bold text-nr-text">{completedSurahs.length}</p>
              <p className="text-[10px] text-nr-muted uppercase tracking-wider">Completed</p>
            </div>
          </div>
        )}

        {/* Bookmarks */}
        {bookmarks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-nr-text mb-4 flex items-center gap-2">
              <IoBookmark size={18} className="text-nr-gold" />
              Bookmarks
            </h2>
            <div className="space-y-1">
              {bookmarks.map((bm) => (
                <div key={bm.chapterId} className="flex items-center gap-3 p-3 rounded-lg hover:bg-nr-hover transition-colors group">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-800/60 to-violet-900/40 rounded flex items-center justify-center shrink-0 border border-nr-gold/10">
                    <span className="text-sm text-nr-text">{bm.chapterId}</span>
                  </div>
                  <Link href={`/surah/${bm.chapterId}`} className="flex-1 min-w-0">
                    <p className="text-sm text-nr-text font-medium truncate">{bm.chapterName}</p>
                    <p className="text-xs text-nr-muted">Paused at {formatTime(bm.position)}</p>
                  </Link>
                  <button
                    onClick={() => removeBookmark(bm.chapterId)}
                    className="text-nr-muted opacity-0 group-hover:opacity-100 hover:text-nr-text transition-all"
                    aria-label="Remove bookmark"
                  >
                    <IoClose size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold text-nr-text mb-4">
          Favorites {favoriteChapters.length > 0 && `(${favoriteChapters.length})`}
        </h2>
        {loading ? (
          <GridSkeleton count={6} />
        ) : favoriteChapters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {favoriteChapters.map((chapter) => (
              <SurahCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        ) : (
          <div className="bg-nr-panel rounded-lg p-8 text-center border border-nr-border">
            <p className="text-nr-muted text-sm">No favorites yet.</p>
            <p className="text-nr-muted text-xs mt-1">
              Click the heart icon on any surah to add it here.
            </p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-nr-text mb-4">Recently Played</h2>
        {loading ? (
          <GridSkeleton count={6} />
        ) : recentChapters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recentChapters.map((chapter) => (
              <SurahCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        ) : (
          <div className="bg-nr-panel rounded-lg p-8 text-center border border-nr-border">
            <p className="text-nr-muted text-sm">Nothing played yet.</p>
            <p className="text-nr-muted text-xs mt-1">
              Start listening to see your history here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
