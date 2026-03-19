'use client';

import Link from 'next/link';
import { Chapter } from '@/types';
import PlayButton from '@/components/ui/PlayButton';
import { usePlayerStore } from '@/store/playerStore';
import { useReciterStore } from '@/store/reciterStore';
import { useLibraryStore } from '@/store/libraryStore';
import { resolveAudioUrl, buildQueueFromChapters } from '@/lib/audioHelper';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';

interface SurahRowProps {
  chapter: Chapter;
  index: number;
  allChapters?: Chapter[];
}

export default function SurahRow({ chapter, index, allChapters }: SurahRowProps) {
  const { currentTrack, isPlaying, playTrack, playQueue, togglePlay } = usePlayerStore();
  const { selectedReciterId, selectedReciterName } = useReciterStore();
  const { toggleFavorite, isFavorite, addToRecent } = useLibraryStore();

  const isCurrentTrack = currentTrack?.chapterId === chapter.id;
  const liked = isFavorite(chapter.id);

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
    <div className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-nr-hover group transition-colors">
      <div className="w-8 text-center">
        <span className="text-nr-muted text-sm group-hover:hidden">{index + 1}</span>
        <div className="hidden group-hover:block">
          <PlayButton
            isPlaying={isCurrentTrack && isPlaying}
            onClick={handlePlay}
            size="sm"
          />
        </div>
      </div>

      <Link href={`/surah/${chapter.id}`} className="flex-1 flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-800/60 to-violet-900/40 rounded flex items-center justify-center shrink-0 border border-nr-gold/10">
          <span className="arabic-text text-sm text-nr-text/90">{chapter.name_arabic}</span>
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${isCurrentTrack ? 'text-nr-gold' : 'text-nr-text'}`}>
            {chapter.name_simple}
          </p>
          <p className="text-xs text-nr-muted truncate">{chapter.translated_name.name}</p>
        </div>
      </Link>

      <span className="text-xs text-nr-muted hidden sm:block">
        {chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'}
      </span>

      <span className="text-xs text-nr-muted hidden sm:block w-16 text-right">
        {chapter.verses_count} ayahs
      </span>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(chapter.id);
        }}
        className={`transition-colors ${liked ? 'text-nr-gold' : 'text-nr-muted opacity-0 group-hover:opacity-100'}`}
        aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
      >
        {liked ? <IoHeart size={16} /> : <IoHeartOutline size={16} />}
      </button>
    </div>
  );
}
