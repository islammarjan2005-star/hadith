'use client';

import { useState, useEffect, useCallback } from 'react';
import SearchInput from '@/components/ui/SearchInput';
import { searchVerses, getChapters } from '@/lib/api';
import { SearchVerse, Chapter } from '@/types';
import Link from 'next/link';
import { RowSkeleton } from '@/components/ui/SkeletonLoader';
import SurahCard from '@/components/surah/SurahCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchVerse[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    getChapters().then(setChapters).catch(() => {});
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchVerses(q);
      setResults(data.search.results);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 400);
    return () => clearTimeout(timer);
  }, [query, search]);

  // Filter chapters by name for quick matches
  const matchingChapters = query.length >= 2
    ? chapters.filter(
        (c) =>
          c.name_simple.toLowerCase().includes(query.toLowerCase()) ||
          c.translated_name.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div>
      <div className="mb-8">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="What do you want to listen to?"
          autoFocus
        />
      </div>

      {!searched && !query && (
        <div>
          <h2 className="text-2xl font-bold text-sp-white mb-4">Browse All</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {chapters.slice(0, 12).map((ch) => (
              <SurahCard key={ch.id} chapter={ch} />
            ))}
          </div>
        </div>
      )}

      {matchingChapters.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold text-sp-white mb-3">Surahs</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {matchingChapters.slice(0, 4).map((ch) => (
              <SurahCard key={ch.id} chapter={ch} />
            ))}
          </div>
        </section>
      )}

      {loading ? (
        <div className="space-y-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <section>
          <h3 className="text-lg font-bold text-sp-white mb-3">Verses</h3>
          <div className="space-y-1">
            {results.map((result) => {
              const [surahId] = result.verse_key.split(':');
              return (
                <Link
                  key={result.verse_id}
                  href={`/surah/${surahId}`}
                  className="flex items-start gap-3 p-3 rounded-md hover:bg-sp-hover transition-colors"
                >
                  <span className="text-xs text-sp-light-gray bg-sp-gray px-2 py-1 rounded shrink-0">
                    {result.verse_key}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-sp-white arabic-text text-right mb-1">
                      {result.text}
                    </p>
                    {result.translations[0] && (
                      <p className="text-xs text-sp-light-gray line-clamp-2">
                        {result.translations[0].text.replace(/<[^>]*>/g, '')}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : searched && !loading ? (
        <p className="text-sp-light-gray text-sm">No results found for &quot;{query}&quot;</p>
      ) : null}
    </div>
  );
}
