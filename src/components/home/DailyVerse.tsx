'use client';

import { useEffect, useState } from 'react';
import { Verse } from '@/types';
import { getVerses } from '@/lib/api';
import { IoSparkles, IoShareSocial } from 'react-icons/io5';

// Deterministic "random" verse based on today's date
function getDailyVerseInfo(): { chapterId: number; verseNumber: number } {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  // Pick from notable surahs with meaningful verses
  const selections = [
    { ch: 2, v: 255 }, // Ayatul Kursi
    { ch: 3, v: 139 },
    { ch: 13, v: 28 },
    { ch: 94, v: 5 },
    { ch: 2, v: 286 },
    { ch: 3, v: 185 },
    { ch: 55, v: 13 },
    { ch: 67, v: 2 },
    { ch: 21, v: 87 },
    { ch: 40, v: 60 },
    { ch: 65, v: 3 },
    { ch: 2, v: 152 },
    { ch: 9, v: 51 },
    { ch: 93, v: 5 },
    { ch: 112, v: 1 },
    { ch: 16, v: 97 },
    { ch: 29, v: 69 },
    { ch: 39, v: 53 },
    { ch: 73, v: 8 },
    { ch: 49, v: 13 },
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
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-900/60 via-sp-dark to-sp-gray border border-emerald-800/30 p-6">
      <div className="absolute top-4 right-4 flex items-center gap-1 text-sp-green/60">
        <IoSparkles size={14} />
        <span className="text-[10px] uppercase tracking-widest font-medium">Verse of the Day</span>
      </div>

      <div className="mt-4 mb-4">
        <p className="arabic-text text-2xl md:text-3xl text-sp-white leading-loose text-right">
          {verse.text_uthmani}
        </p>
      </div>

      {verse.translations && verse.translations[0] && (
        <p className="text-sm text-sp-light-gray leading-relaxed mb-4 italic">
          &ldquo;{verse.translations[0].text.replace(/<[^>]*>/g, '')}&rdquo;
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-sp-light-gray bg-sp-gray/60 px-3 py-1 rounded-full">
          Surah {surahName} · Verse {verse.verse_number}
        </span>
        <button
          onClick={handleShare}
          className="text-sp-light-gray hover:text-sp-white transition-colors"
          aria-label="Share verse"
        >
          <IoShareSocial size={18} />
        </button>
      </div>
    </div>
  );
}
