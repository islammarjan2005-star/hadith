'use client';

import { useEffect, useRef } from 'react';
import { Verse } from '@/types';
import { IoPlaySharp, IoPauseSharp } from 'react-icons/io5';
import { usePlayerStore } from '@/store/playerStore';

interface AyahListProps {
  verses: Verse[];
  showWordByWord?: boolean;
  showBismillah?: boolean;
  onPlayAyah?: (verseKey: string) => void;
}

export default function AyahList({ verses, showWordByWord = false, showBismillah = false, onPlayAyah }: AyahListProps) {
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
      {/* Bismillah */}
      {showBismillah && (
        <div className="bismillah py-6 text-center border-b border-nr-border mb-4">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>
      )}

      {verses.map((verse) => {
        const isActive = playingVerseKey === verse.verse_key;
        const hasSajdah = verse.sajdah_number !== null && verse.sajdah_number !== 0;

        return (
          <div
            key={verse.id}
            ref={isActive ? activeRef : undefined}
            className={`flex gap-4 p-4 rounded-lg hover:bg-nr-hover transition-colors group ${
              isActive ? 'verse-active' : ''
            }`}
          >
            <div className="flex items-start gap-2 shrink-0">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                isActive ? 'bg-nr-gold text-nr-base font-bold' : 'bg-nr-panel text-nr-muted'
              }`}>
                {verse.verse_number}
              </span>
              {onPlayAyah && (
                <button
                  onClick={() => onPlayAyah(verse.verse_key)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-opacity ${
                    isActive
                      ? 'bg-nr-gold opacity-100'
                      : 'bg-nr-panel opacity-0 group-hover:opacity-100 hover:bg-nr-gold'
                  }`}
                  aria-label={isActive && isPlaying ? `Pause verse ${verse.verse_number}` : `Play verse ${verse.verse_number}`}
                >
                  {isActive && isPlaying ? (
                    <IoPauseSharp size={12} className="text-nr-text" />
                  ) : (
                    <IoPlaySharp size={12} className="text-nr-text ml-0.5" />
                  )}
                </button>
              )}
            </div>
            <div className="flex-1 space-y-3">
              {showWordByWord && verse.words && verse.words.length > 0 ? (
                <div className="flex flex-row-reverse flex-wrap gap-4 justify-start">
                  {verse.words.map((word) => (
                    <div key={word.id} className="text-center min-w-[60px]">
                      <p className="arabic-text text-xl text-nr-text leading-normal mb-1">
                        {word.text_uthmani}
                      </p>
                      {word.transliteration && (
                        <p className="text-[10px] text-nr-gold italic">
                          {word.transliteration.text}
                        </p>
                      )}
                      {word.translation && (
                        <p className="text-[10px] text-nr-muted">
                          {word.translation.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="arabic-text text-2xl leading-loose text-nr-text text-right">
                  {verse.text_uthmani}
                </p>
              )}

              {/* Sajdah indicator */}
              {hasSajdah && (
                <div className="flex items-center gap-2 text-nr-gold text-xs">
                  <span className="text-lg">۩</span>
                  <span className="font-medium uppercase tracking-wider">Sajdah — Prostration required</span>
                </div>
              )}

              {verse.translations && verse.translations.length > 0 && (
                <p className="text-sm text-nr-muted leading-relaxed">
                  {verse.translations[0].text.replace(/<[^>]*>/g, '')}
                </p>
              )}

              {/* Juz / Hizb markers */}
              {(verse.juz_number && verse.verse_number === 1) || verse.hizb_number % 4 === 0 ? (
                <div className="flex items-center gap-2 text-[10px] text-nr-muted/60">
                  <span>Juz {verse.juz_number}</span>
                  <span>·</span>
                  <span>Hizb {verse.hizb_number}</span>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
