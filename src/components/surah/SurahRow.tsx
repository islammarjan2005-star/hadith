'use client';

import Link from 'next/link';
import { Chapter } from '@/types';
import PlayButton from '@/components/ui/PlayButton';
import { usePlayerStore } from '@/store/playerStore';
import { useReciterStore } from '@/store/reciterStore';
import { useLibraryStore } from '@/store/libraryStore';
import { getChapterAudio } from '@/lib/api';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';

interface SurahRowProps {
  chapter: Chapter;
  index: number;
}

export default function SurahRow({ chapter, index }: SurahRowProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const { selectedReciterId, selectedReciterName } = useReciterStore();
  const { toggleFavorite, isFavorite, addToRecent } = useLibraryStore();

  const isCurrentTrack = currentTrack?.chapterId === chapter.id;
  const liked = isFavorite(chapter.id);

  const handlePlay = async () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      try {
        const audio = await getChapterAudio(selectedReciterId, chapter.id);
        playTrack({
          chapterId: chapter.id,
          chapterName: chapter.name_simple,
          chapterNameArabic: chapter.name_arabic,
          audioUrl: audio.audio_url,
          reciterName: selectedReciterName,
        });
        addToRecent(chapter.id, chapter.name_simple);
      } catch {
        const paddedId = chapter.id.toString().padStart(3, '0');
        playTrack({
          chapterId: chapter.id,
          chapterName: chapter.name_simple,
          chapterNameArabic: chapter.name_arabic,
          audioUrl: `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${paddedId}.mp3`,
          reciterName: selectedReciterName,
        });
        addToRecent(chapter.id, chapter.name_simple);
      }
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-sp-hover group transition-colors">
      <div className="w-8 text-center">
        <span className="text-sp-light-gray text-sm group-hover:hidden">{index + 1}</span>
        <div className="hidden group-hover:block">
          <PlayButton
            isPlaying={isCurrentTrack && isPlaying}
            onClick={handlePlay}
            size="sm"
          />
        </div>
      </div>

      <Link href={`/surah/${chapter.id}`} className="flex-1 flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-gradient-to-br from-sp-green/30 to-emerald-900 rounded flex items-center justify-center shrink-0">
          <span className="arabic-text text-sm text-sp-white/90">{chapter.name_arabic}</span>
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${isCurrentTrack ? 'text-sp-green' : 'text-sp-white'}`}>
            {chapter.name_simple}
          </p>
          <p className="text-xs text-sp-light-gray truncate">{chapter.translated_name.name}</p>
        </div>
      </Link>

      <span className="text-xs text-sp-light-gray hidden sm:block">
        {chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'}
      </span>

      <span className="text-xs text-sp-light-gray hidden sm:block w-16 text-right">
        {chapter.verses_count} ayahs
      </span>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(chapter.id);
        }}
        className={`transition-colors ${liked ? 'text-sp-green' : 'text-sp-light-gray opacity-0 group-hover:opacity-100'}`}
      >
        {liked ? <IoHeart size={16} /> : <IoHeartOutline size={16} />}
      </button>
    </div>
  );
}
