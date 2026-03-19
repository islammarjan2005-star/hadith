'use client';

import { useEffect, useState } from 'react';
import { Verse } from '@/types';
import { getVerses } from '@/lib/api';
import { IoShareSocial } from 'react-icons/io5';

function getDailyVerseInfo(): { chapterId: number; verseNumber: number } {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const selections = [
    { ch: 2, v: 255 }, { ch: 3, v: 139 }, { ch: 13, v: 28 }, { ch: 94, v: 5 },
    { ch: 2, v: 286 }, { ch: 3, v: 185 }, { ch: 55, v: 13 }, { ch: 67, v: 2 },
    { ch: 21, v: 87 }, { ch: 40, v: 60 }, { ch: 65, v: 3 }, { ch: 2, v: 152 },
    { ch: 9, v: 51 }, { ch: 93, v: 5 }, { ch: 112, v: 1 }, { ch: 16, v: 97 },
    { ch: 29, v: 69 }, { ch: 39, v: 53 }, { ch: 73, v: 8 }, { ch: 49, v: 13 },
  ];
  const pick = selections[dayOfYear % selections.length];
  return { chapterId: pick.ch, verseNumber: pick.v };
}

export default function DailyVerse() {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [surahName, setSurahName] = useState('');

  useEffect(() => {
    const { chapterId, verseNumber } = getDailyVerseInfo();
    getVerses(chapterId, Math.ceil(verseNumber / 50))
      .then((data) => {
        const found = data.verses.find((v) => v.verse_number === verseNumber);
        if (found) {
          setVerse(found);
          setSurahName(found.verse_key.split(':')[0]);
        }
      })
      .catch(() => {});
  }, []);

  if (!verse) return null;

  const handleShare = async () => {
    const text = verse.translations?.[0]?.text.replace(/<[^>]*>/g, '') || '';
    const shareText = `"${text}" — Quran ${verse.verse_key}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-nr-gold/15 p-6">
      {/* Islamic geometric background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-nr-surface to-violet-950/40 geo-pattern" />
      {/* Gold corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-nr-gold/20 rounded-tl-xl" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-nr-gold/20 rounded-br-xl" />

      <div className="relative">
        <div className="flex items-center gap-1 text-nr-gold/60 mb-4">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span className="text-[10px] uppercase tracking-widest font-medium">Verse of the Day</span>
        </div>

        <div className="mb-4">
          <p className="arabic-text text-2xl md:text-3xl text-nr-text leading-loose text-right">
            {verse.text_uthmani}
          </p>
        </div>

        {verse.translations && verse.translations[0] && (
          <p className="text-sm text-nr-muted leading-relaxed mb-4 italic">
            &ldquo;{verse.translations[0].text.replace(/<[^>]*>/g, '')}&rdquo;
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-nr-muted bg-nr-panel/60 px-3 py-1 rounded-full border border-nr-border">
            Surah {surahName} · Verse {verse.verse_number}
          </span>
          <button
            onClick={handleShare}
            className="text-nr-muted hover:text-nr-text transition-colors"
            aria-label="Share verse"
          >
            <IoShareSocial size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
