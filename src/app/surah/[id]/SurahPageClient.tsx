'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Chapter, Verse, AudioFile } from '@/types';
import { getChapter, getAllVerses, getChapterAudio, getAudioFiles } from '@/lib/api';
import AyahList from '@/components/surah/AyahList';
import PlayButton from '@/components/ui/PlayButton';
import ReciterSelector from '@/components/reciter/ReciterSelector';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { usePlayerStore } from '@/store/playerStore';
import { useReciterStore } from '@/store/reciterStore';
import { useLibraryStore } from '@/store/libraryStore';
import { IoHeart, IoHeartOutline, IoShareSocial, IoBookmark, IoText } from 'react-icons/io5';
import { RowSkeleton } from '@/components/ui/SkeletonLoader';
import { formatTime } from '@/lib/utils';

export default function SurahPageClient() {
  const params = useParams();
  const id = Number(params.id);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWordByWord, setShowWordByWord] = useState(false);
  const [verseAudioFiles, setVerseAudioFiles] = useState<AudioFile[]>([]);

  const { currentTrack, isPlaying, playTrack, playQueue, togglePlay, setPlayingVerseKey } = usePlayerStore();
  const { selectedReciterId, selectedReciterName } = useReciterStore();
  const { toggleFavorite, isFavorite, addToRecent, getBookmark, removeBookmark } = useLibraryStore();

  const isCurrentTrack = currentTrack?.chapterId === id;
  const liked = isFavorite(id);
  const bookmark = getBookmark(id);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [ch, v] = await Promise.all([getChapter(id), getAllVerses(id, showWordByWord)]);
      setChapter(ch);
      setVerses(v);
    } catch {
      setError('Failed to load surah. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [id, showWordByWord]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fetch verse-level audio files
  useEffect(() => {
    if (!id) return;
    getAudioFiles(selectedReciterId, id)
      .then(setVerseAudioFiles)
      .catch(() => setVerseAudioFiles([]));
  }, [id, selectedReciterId]);

  // Hot-swap reciter
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
      } catch { /* Keep current */ }
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

  const handleResumeBookmark = () => {
    if (!bookmark || !chapter) return;
    handlePlayAll().then(() => {
      setTimeout(() => {
        const { audioElement } = usePlayerStore.getState();
        if (audioElement) {
          audioElement.currentTime = bookmark.position;
        }
        removeBookmark(chapter.id);
      }, 500);
    });
  };

  const handlePlayAyah = (verseKey: string) => {
    if (!chapter || verseAudioFiles.length === 0) return;

    const queue = verseAudioFiles.map((af) => ({
      chapterId: chapter.id,
      chapterName: `${chapter.name_simple} - ${af.verse_key}`,
      chapterNameArabic: chapter.name_arabic,
      audioUrl: af.url,
      reciterName: selectedReciterName,
    }));

    const startIndex = verseAudioFiles.findIndex((af) => af.verse_key === verseKey);
    if (startIndex === -1) return;

    setPlayingVerseKey(verseKey);
    playQueue(queue, startIndex);
    addToRecent(chapter.id, chapter.name_simple);

    const unsubscribe = usePlayerStore.subscribe((state, prevState) => {
      if (state.currentTrack !== prevState.currentTrack && state.currentTrack) {
        const match = verseAudioFiles.find((af) => af.url === state.currentTrack?.audioUrl);
        if (match) {
          setPlayingVerseKey(match.verse_key);
        } else {
          setPlayingVerseKey(null);
          unsubscribe();
        }
      }
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = chapter ? `Listen to Surah ${chapter.name_simple} on Noor` : 'Listen to Quran on Noor';
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-fadeSlideIn">
        <div className="h-48 skeleton-shimmer rounded-lg" />
        {Array.from({ length: 10 }).map((_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-nr-muted mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-6 py-2 bg-nr-gold text-nr-base rounded-full font-semibold text-sm hover:bg-nr-gold-light transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!chapter) {
    return <p className="text-nr-muted">Surah not found.</p>;
  }

  return (
    <div className="animate-fadeSlideIn">
      {/* Header — unique gradient, not Spotify-style */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-8 bg-gradient-to-b from-indigo-950/60 to-transparent -mx-4 md:-mx-6 -mt-14 px-4 md:px-6 pt-20 pb-6">
        <div className="w-40 h-40 relative rounded-lg overflow-hidden shadow-2xl shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-nr-panel to-violet-900/60 geo-pattern" />
          <div className="absolute inset-3 border border-nr-gold/20 rounded" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="arabic-text text-4xl text-nr-text">{chapter.name_arabic}</p>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-nr-muted mb-1">Surah</p>
          <h1 className="text-4xl md:text-6xl font-bold text-nr-text mb-2">{chapter.name_simple}</h1>
          <p className="text-sm text-nr-muted">
            {chapter.translated_name.name} · {chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'} · {chapter.verses_count} verses
          </p>
        </div>
      </div>

      {/* Bookmark resume */}
      {bookmark && bookmark.position > 5 && (
        <button
          onClick={handleResumeBookmark}
          className="flex items-center gap-2 mb-4 px-4 py-2 bg-nr-panel/60 rounded-lg text-sm text-nr-text hover:bg-nr-hover transition-colors border border-nr-border"
        >
          <IoBookmark size={16} className="text-nr-gold" />
          Resume from {formatTime(bookmark.position)}
        </button>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <PlayButton
          isPlaying={isCurrentTrack && isPlaying}
          onClick={handlePlayAll}
          size="lg"
        />
        <button
          onClick={() => toggleFavorite(chapter.id)}
          className={`transition-colors ${liked ? 'text-nr-gold' : 'text-nr-muted hover:text-nr-text'}`}
          aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
        >
          {liked ? <IoHeart size={28} /> : <IoHeartOutline size={28} />}
        </button>
        <button
          onClick={handleShare}
          className="text-nr-muted hover:text-nr-text transition-colors"
          aria-label="Share this surah"
        >
          <IoShareSocial size={24} />
        </button>
        <button
          onClick={() => setShowWordByWord(!showWordByWord)}
          className={`transition-colors ${showWordByWord ? 'text-nr-gold' : 'text-nr-muted hover:text-nr-text'}`}
          aria-label={showWordByWord ? 'Hide word by word' : 'Show word by word'}
          title="Word by Word"
        >
          <IoText size={22} />
        </button>
        <div className="ml-auto">
          <ReciterSelector />
        </div>
      </div>

      {/* Verses with bismillah */}
      <AyahList
        verses={verses}
        showWordByWord={showWordByWord}
        showBismillah={chapter.bismillah_pre}
        onPlayAyah={verseAudioFiles.length > 0 ? handlePlayAyah : undefined}
      />

      <ScrollToTop />
    </div>
  );
}
