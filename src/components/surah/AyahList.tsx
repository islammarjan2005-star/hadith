'use client';

import { useEffect, useRef } from 'react';
import { Verse } from '@/types';
import { IoPlaySharp, IoPauseSharp } from 'react-icons/io5';
import { usePlayerStore } from '@/store/playerStore';

interface AyahListProps {
  verses: Verse[];
  showWordByWord?: boolean;
  onPlayAyah?: (verseKey: string) => void;
}

export default function AyahList({ verses, showWordByWord = false, onPlayAyah }: AyahListProps) {
  const playingVerseKey = usePlayerStore((s) => s.playingVerseKey);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const activeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to playing verse
  useEffect(() => {
    if (playingVerseKey && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [playingVerseKey]);

  return (
    <div className="space-y-1">
      {verses.map((verse) => {
        const isActive = playingVerseKey === verse.verse_key;
        return (
          <div
            key={verse.id}
            ref={isActive ? activeRef : undefined}
            className={`flex gap-4 p-4 rounded-lg hover:bg-sp-hover transition-colors group ${
              isActive ? 'verse-active' : ''
            }`}
          >
            <div className="flex items-start gap-2 shrink-0">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                isActive ? 'bg-sp-green text-black font-bold' : 'bg-sp-gray text-sp-light-gray'
              }`}>
                {verse.verse_number}
              </span>
              {onPlayAyah && (
                <button
                  onClick={() => onPlayAyah(verse.verse_key)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-opacity ${
                    isActive
                      ? 'bg-sp-green opacity-100'
                      : 'bg-sp-gray opacity-0 group-hover:opacity-100 hover:bg-sp-green'
                  }`}
                  aria-label={isActive && isPlaying ? `Pause verse ${verse.verse_number}` : `Play verse ${verse.verse_number}`}
                >
                  {isActive && isPlaying ? (
                    <IoPauseSharp size={12} className="text-sp-white" />
                  ) : (
                    <IoPlaySharp size={12} className="text-sp-white ml-0.5" />
                  )}
                </button>
              )}
            </div>
            <div className="flex-1 space-y-3">
              {showWordByWord && verse.words && verse.words.length > 0 ? (
                <div className="flex flex-row-reverse flex-wrap gap-4 justify-start">
                  {verse.words.map((word) => (
                    <div key={word.id} className="text-center min-w-[60px]">
                      <p className="arabic-text text-xl text-sp-white leading-normal mb-1">
                        {word.text_uthmani}
                      </p>
                      {word.transliteration && (
                        <p className="text-[10px] text-sp-green italic">
                          {word.transliteration.text}
                        </p>
                      )}
                      {word.translation && (
                        <p className="text-[10px] text-sp-light-gray">
                          {word.translation.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="arabic-text text-2xl leading-loose text-sp-white text-right">
                  {verse.text_uthmani}
                </p>
              )}
              {verse.translations && verse.translations.length > 0 && (
                <p className="text-sm text-sp-light-gray leading-relaxed">
                  {verse.translations[0].text.replace(/<[^>]*>/g, '')}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
