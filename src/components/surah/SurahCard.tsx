'use client';

import Link from 'next/link';
import { Chapter } from '@/types';
import PlayButton from '@/components/ui/PlayButton';
import { usePlayerStore } from '@/store/playerStore';
import { useReciterStore } from '@/store/reciterStore';
import { useLibraryStore } from '@/store/libraryStore';
import { resolveAudioUrl } from '@/lib/audioHelper';
import { buildQueueFromChapters } from '@/lib/audioHelper';

interface SurahCardProps {
  chapter: Chapter;
  allChapters?: Chapter[];
}

export default function SurahCard({ chapter, allChapters }: SurahCardProps) {
  const { currentTrack, isPlaying, playTrack, playQueue, togglePlay } = usePlayerStore();
  const { selectedReciterId, selectedReciterName } = useReciterStore();
  const { addToRecent } = useLibraryStore();

  const isCurrentTrack = currentTrack?.chapterId === chapter.id;

  const handlePlay = async () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      const audioUrl = await resolveAudioUrl(selectedReciterId, chapter.id);
      addToRecent(chapter.id, chapter.name_simple);

      if (allChapters && allChapters.length > 1) {
        const queue = buildQueueFromChapters(allChapters, selectedReciterName);
        const startIdx = allChapters.findIndex((c) => c.id === chapter.id);
        queue[startIdx] = { ...queue[startIdx], audioUrl };
        playQueue(queue, startIdx);
      } else {
        playTrack({
          chapterId: chapter.id,
          chapterName: chapter.name_simple,
          chapterNameArabic: chapter.name_arabic,
          audioUrl,
          reciterName: selectedReciterName,
        });
      }
    }
  };

  return (
    <Link href={`/surah/${chapter.id}`}>
      <div className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group cursor-pointer hover:bg-nr-hover/60 ${
        isCurrentTrack ? 'bg-nr-panel/60 border border-nr-gold/20' : 'bg-nr-surface/50'
      }`}>
        {/* Surah number badge */}
        <div className="w-12 h-12 shrink-0 rounded-lg bg-gradient-to-br from-indigo-900/80 to-violet-900/60 border border-nr-gold/15 flex items-center justify-center">
          <span className="text-nr-gold font-bold text-lg">{chapter.id}</span>
        </div>

        {/* Surah info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <p className="text-sm font-semibold text-nr-text truncate">{chapter.name_simple}</p>
            <span className="text-nr-muted text-xs hidden sm:inline">·</span>
            <p className="arabic-text text-base text-nr-text/70 hidden sm:block leading-none" style={{ lineHeight: '1.4' }}>{chapter.name_arabic}</p>
          </div>
          <p className="text-xs text-nr-muted mt-0.5 truncate">
            {chapter.translated_name.name} · {chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'} · {chapter.verses_count} verses
          </p>
        </div>

        {/* Play button */}
        <div
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <PlayButton
            isPlaying={isCurrentTrack && isPlaying}
            onClick={handlePlay}
            size="sm"
          />
        </div>
      </div>
    </Link>
  );
}
