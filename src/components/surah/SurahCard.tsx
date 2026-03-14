'use client';

import Link from 'next/link';
import { Chapter } from '@/types';
import PlayButton from '@/components/ui/PlayButton';
import { usePlayerStore } from '@/store/playerStore';
import { useReciterStore } from '@/store/reciterStore';
import { useLibraryStore } from '@/store/libraryStore';

interface SurahCardProps {
  chapter: Chapter;
}

export default function SurahCard({ chapter }: SurahCardProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const { selectedReciterId, selectedReciterName } = useReciterStore();
  const { addToRecent } = useLibraryStore();

  const isCurrentTrack = currentTrack?.chapterId === chapter.id;

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
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
  };

  return (
    <Link href={`/surah/${chapter.id}`}>
      <div className="bg-sp-dark hover:bg-sp-hover rounded-lg p-4 transition-all duration-200 group cursor-pointer">
        <div className="relative w-full aspect-square bg-gradient-to-br from-sp-green/30 to-emerald-900 rounded-md mb-4 flex items-center justify-center overflow-hidden shadow-lg">
          <div className="text-center">
            <p className="text-4xl font-bold text-sp-white/90 arabic-text">{chapter.name_arabic}</p>
            <p className="text-sm text-sp-white/60 mt-1">{chapter.id}</p>
          </div>
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
            <PlayButton
              isPlaying={isCurrentTrack && isPlaying}
              onClick={handlePlay}
              size="md"
            />
          </div>
        </div>
        <p className="text-sm font-semibold text-sp-white truncate">{chapter.name_simple}</p>
        <p className="text-xs text-sp-light-gray mt-1 truncate">
          {chapter.translated_name.name} · {chapter.verses_count} verses
        </p>
      </div>
    </Link>
  );
}
