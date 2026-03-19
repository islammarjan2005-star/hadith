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
      <div className="bg-nr-surface hover:bg-nr-hover rounded-lg p-4 transition-all duration-200 group cursor-pointer">
        <div className="relative w-full aspect-square rounded-md mb-4 flex items-center justify-center overflow-hidden shadow-lg">
          {/* Islamic geometric background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-nr-panel to-violet-900/60 geo-pattern" />
          {/* Gold ornamental frame */}
          <div className="absolute inset-2 border border-nr-gold/20 rounded" />
          <div className="relative text-center z-10">
            <p className="text-4xl font-bold text-nr-text/90 arabic-text">{chapter.name_arabic}</p>
            <p className="text-xs text-nr-gold/80 mt-1 font-medium">{chapter.id}</p>
          </div>
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
            <PlayButton
              isPlaying={isCurrentTrack && isPlaying}
              onClick={handlePlay}
              size="md"
            />
          </div>
        </div>
        <p className="text-sm font-semibold text-nr-text truncate">{chapter.name_simple}</p>
        <p className="text-xs text-nr-muted mt-1 truncate">
          {chapter.translated_name.name} · {chapter.verses_count} verses
        </p>
      </div>
    </Link>
  );
}
