'use client';

import { Verse } from '@/types';
import { IoPlaySharp } from 'react-icons/io5';

interface AyahListProps {
  verses: Verse[];
  onPlayAyah?: (verseNumber: number) => void;
}

export default function AyahList({ verses, onPlayAyah }: AyahListProps) {
  return (
    <div className="space-y-1">
      {verses.map((verse) => (
        <div
          key={verse.id}
          className="flex gap-4 p-4 rounded-lg hover:bg-sp-hover transition-colors group"
        >
          <div className="flex items-start gap-2 shrink-0">
            <span className="w-8 h-8 rounded-full bg-sp-gray flex items-center justify-center text-xs text-sp-light-gray">
              {verse.verse_number}
            </span>
            {onPlayAyah && (
              <button
                onClick={() => onPlayAyah(verse.verse_number)}
                className="w-8 h-8 rounded-full bg-sp-gray flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sp-green"
              >
                <IoPlaySharp size={12} className="text-sp-white ml-0.5" />
              </button>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <p className="arabic-text text-2xl leading-loose text-sp-white text-right">
              {verse.text_uthmani}
            </p>
            {verse.translations && verse.translations.length > 0 && (
              <p className="text-sm text-sp-light-gray leading-relaxed">
                {verse.translations[0].text.replace(/<[^>]*>/g, '')}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
