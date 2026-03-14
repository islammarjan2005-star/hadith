'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Chapter, Verse } from '@/types';
import { getChapter, getAllVerses, getChapterAudio } from '@/lib/api';
import AyahList from '@/components/surah/AyahList';
import PlayButton from '@/components/ui/PlayButton';
import ReciterSelector from '@/components/reciter/ReciterSelector';
import { usePlayerStore } from '@/store/playerStore';
import { useReciterStore } from '@/store/reciterStore';
import { useLibraryStore } from '@/store/libraryStore';
import { IoHeart, IoHeartOutline, IoShareSocial } from 'react-icons/io5';
import { RowSkeleton } from '@/components/ui/SkeletonLoader';

export default function SurahPageClient() {
  const params = useParams();
  const id = Number(params.id);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const { selectedReciterId, selectedReciterName } = useReciterStore();
  const { toggleFavorite, isFavorite, addToRecent } = useLibraryStore();

  const isCurrentTrack = currentTrack?.chapterId === id;
  const liked = isFavorite(id);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [ch, v] = await Promise.all([getChapter(id), getAllVerses(id)]);
      setChapter(ch);
      setVerses(v);
    } catch {
      setError('Failed to load surah. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Hot-swap reciter when changed mid-playback
  useEffect(() => {
    if (!isCurrentTrack || !chapter) return;
    const swapReciter = async () => {
      try {
        const audio = await getChapterAudio(selectedReciterId, chapter.id);
        const store = usePlayerStore.getState();
        if (store.audioElement && store.currentTrack?.chapterId === chapter.id) {
          const currentTime = store.audioElement.currentTime;
          const wasPlaying = store.isPlaying;
          store.audioElement.src = audio.audio_url;
          store.audioElement.currentTime = currentTime;
          usePlayerStore.setState({
            currentTrack: { ...store.currentTrack, audioUrl: audio.audio_url, reciterName: selectedReciterName },
          });
          if (wasPlaying) store.audioElement.play().catch(() => {});
        }
      } catch {
        // Keep current audio if swap fails
      }
    };
    swapReciter();
  }, [selectedReciterId, selectedReciterName, isCurrentTrack, chapter]);

  const handlePlayAll = async () => {
    if (isCurrentTrack) {
      togglePlay();
    } else if (chapter) {
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

  const handleShare = async () => {
    const url = window.location.href;
    const text = chapter ? `Listen to Surah ${chapter.name_simple}` : 'Listen to Quran';
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-48 bg-sp-gray rounded-lg animate-pulse" />
        {Array.from({ length: 10 }).map((_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sp-light-gray mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-6 py-2 bg-sp-green text-black rounded-full font-semibold text-sm hover:bg-sp-green-light transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!chapter) {
    return <p className="text-sp-light-gray">Surah not found.</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-8 bg-gradient-to-b from-emerald-900/40 to-transparent -mx-4 md:-mx-6 -mt-14 px-4 md:px-6 pt-20 pb-6">
        <div className="w-40 h-40 bg-gradient-to-br from-sp-green/40 to-emerald-900 rounded-lg flex items-center justify-center shadow-2xl shrink-0">
          <div className="text-center">
            <p className="arabic-text text-4xl text-sp-white">{chapter.name_arabic}</p>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-sp-light-gray mb-1">Surah</p>
          <h1 className="text-4xl md:text-6xl font-bold text-sp-white mb-2">{chapter.name_simple}</h1>
          <p className="text-sm text-sp-light-gray">
            {chapter.translated_name.name} · {chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'} · {chapter.verses_count} verses
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <PlayButton
          isPlaying={isCurrentTrack && isPlaying}
          onClick={handlePlayAll}
          size="lg"
        />
        <button
          onClick={() => toggleFavorite(chapter.id)}
          className={`transition-colors ${liked ? 'text-sp-green' : 'text-sp-light-gray hover:text-sp-white'}`}
          aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
        >
          {liked ? <IoHeart size={28} /> : <IoHeartOutline size={28} />}
        </button>
        <button
          onClick={handleShare}
          className="text-sp-light-gray hover:text-sp-white transition-colors"
          aria-label="Share this surah"
        >
          <IoShareSocial size={24} />
        </button>
        <div className="ml-auto">
          <ReciterSelector />
        </div>
      </div>

      {/* Verses */}
      <AyahList verses={verses} />
    </div>
  );
}
