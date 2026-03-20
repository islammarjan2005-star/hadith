'use client';

import { useState, useEffect, useCallback } from 'react';
import { IoChevronDown, IoHeart, IoHeartOutline } from 'react-icons/io5';
import { IoPlaySharp, IoPauseSharp, IoPlaySkipBack, IoPlaySkipForward } from 'react-icons/io5';
import { IoRepeat, IoShuffle, IoList, IoBookmark } from 'react-icons/io5';
import { TbRepeatOnce } from 'react-icons/tb';
import { usePlayerStore } from '@/store/playerStore';
import { useLibraryStore } from '@/store/libraryStore';
import { formatTime } from '@/lib/utils';
import { Verse } from '@/types';
import { getVerses } from '@/lib/api';
import AyahList from '@/components/surah/AyahList';

export default function NowPlayingView() {
  const {
    currentTrack, isPlaying, isBuffering, duration, currentTime,
    togglePlay, next, prev, seek, repeatMode, shuffle,
    toggleRepeat, toggleShuffle, setExpanded, playbackRate, cyclePlaybackRate,
    setShowQueue, showQueue, setPlayingVerseKey,
  } = usePlayerStore();
  const { toggleFavorite, isFavorite, saveBookmark } = useLibraryStore();
  const [closing, setClosing] = useState(false);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

  const liked = currentTrack ? isFavorite(currentTrack.chapterId) : false;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Load verses for current track
  useEffect(() => {
    if (currentTrack) {
      setLoadingVerses(true);
      getVerses(currentTrack.chapterId, 1)
        .then((data) => setVerses(data.verses))
        .catch(() => setVerses([]))
        .finally(() => setLoadingVerses(false));
    }
  }, [currentTrack?.chapterId]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setExpanded(false);
      setClosing(false);
    }, 280);
  }, [setExpanded]);

  const handlePlayAyah = useCallback((verseKey: string) => {
    setPlayingVerseKey(verseKey);
  }, [setPlayingVerseKey]);

  if (!currentTrack) return null;

  const RepeatIcon = repeatMode === 'one' ? TbRepeatOnce : IoRepeat;

  return (
    <div className={`fixed inset-0 z-50 bg-nr-base flex flex-col ${closing ? 'animate-slideDown' : 'animate-slideUp'}`}>
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 geo-pattern opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button onClick={handleClose} className="text-nr-muted hover:text-nr-text transition-colors" aria-label="Close">
          <IoChevronDown size={24} />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-nr-text">{currentTrack.chapterName}</p>
          <p className="text-[11px] text-nr-muted">{currentTrack.reciterName}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cyclePlaybackRate}
            className="text-[11px] text-nr-muted border border-nr-muted/30 rounded px-1.5 py-0.5"
          >
            {playbackRate}x
          </button>
          <button
            onClick={() => toggleFavorite(currentTrack.chapterId)}
            className={liked ? 'text-nr-gold' : 'text-nr-muted'}
            aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
          >
            {liked ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
          </button>
        </div>
      </div>

      {/* Verse list — the main content area */}
      <div className="relative flex-1 overflow-y-auto px-4">
        {loadingVerses ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-nr-gold/30 border-t-nr-gold rounded-full animate-spin" />
          </div>
        ) : verses.length > 0 ? (
          <AyahList
            verses={verses}
            showBismillah={currentTrack.chapterId !== 1 && currentTrack.chapterId !== 9}
            onPlayAyah={handlePlayAyah}
          />
        ) : (
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <p className="arabic-text text-4xl text-nr-text/80 mb-2">{currentTrack.chapterNameArabic}</p>
              <p className="text-nr-muted text-sm">{currentTrack.chapterName}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls — pinned */}
      <div className="relative shrink-0 bg-nr-surface/80 backdrop-blur-md border-t border-nr-border px-6 pt-3 pb-4">
        {/* Progress */}
        <div className="mb-3">
          <div className="relative w-full h-1 bg-nr-text/10 rounded-full overflow-hidden mb-1.5">
            <div className="h-full bg-nr-gold rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Seek"
            />
          </div>
          <div className="flex justify-between text-[10px] text-nr-muted tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Transport controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={toggleShuffle}
            className={`transition-colors ${shuffle ? 'text-nr-gold' : 'text-nr-muted'}`}
            aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
          >
            <IoShuffle size={18} />
          </button>

          <div className="flex items-center gap-6">
            <button onClick={prev} className="text-nr-text" aria-label="Previous">
              <IoPlaySkipBack size={22} />
            </button>
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-nr-gold flex items-center justify-center hover:bg-nr-gold-light hover:scale-105 transition-all"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isBuffering ? (
                <div className="w-5 h-5 border-2 border-nr-base/30 border-t-nr-base rounded-full animate-spin" />
              ) : isPlaying ? (
                <IoPauseSharp size={22} className="text-nr-base" />
              ) : (
                <IoPlaySharp size={22} className="text-nr-base ml-0.5" />
              )}
            </button>
            <button onClick={next} className="text-nr-text" aria-label="Next">
              <IoPlaySkipForward size={22} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleRepeat}
              className={`transition-colors ${repeatMode !== 'off' ? 'text-nr-gold' : 'text-nr-muted'}`}
              aria-label={`Repeat mode: ${repeatMode}`}
            >
              <RepeatIcon size={18} />
            </button>
            <button
              onClick={() => {
                const { currentTime } = usePlayerStore.getState();
                saveBookmark({
                  chapterId: currentTrack.chapterId,
                  chapterName: currentTrack.chapterName,
                  position: currentTime,
                  verseKey: `${currentTrack.chapterId}:1`,
                });
              }}
              className="text-nr-muted hover:text-nr-text transition-colors hidden sm:block"
              aria-label="Save bookmark"
            >
              <IoBookmark size={16} />
            </button>
            <button
              onClick={() => setShowQueue(!showQueue)}
              className={`transition-colors hidden sm:block ${showQueue ? 'text-nr-gold' : 'text-nr-muted hover:text-nr-text'}`}
              aria-label="Toggle queue"
            >
              <IoList size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="safe-bottom" />
    </div>
  );
}
