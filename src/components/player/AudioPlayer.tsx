'use client';

import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { useLibraryStore } from '@/store/libraryStore';
import NowPlayingView from './NowPlayingView';
import QueueView from './QueueView';
import { IoPlaySharp, IoPauseSharp } from 'react-icons/io5';
import { formatTime } from '@/lib/utils';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const listenTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bookmarkTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    isExpanded,
    showQueue,
    duration,
    currentTime,
    setAudioElement,
    setDuration,
    setCurrentTime,
    setBuffering,
    setError,
    handleEnded,
    volume,
    togglePlay,
    seek,
    setExpanded,
  } = usePlayerStore();

  const { addListenTime, saveBookmark, markSurahComplete } = useLibraryStore();

  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);
      audioRef.current.volume = volume;
    }
  }, [setAudioElement, volume]);

  // Track listening time every 10s
  useEffect(() => {
    if (isPlaying) {
      listenTimerRef.current = setInterval(() => {
        addListenTime(10);
      }, 10000);
    } else {
      if (listenTimerRef.current) clearInterval(listenTimerRef.current);
    }
    return () => {
      if (listenTimerRef.current) clearInterval(listenTimerRef.current);
    };
  }, [isPlaying, addListenTime]);

  // Auto-save bookmark every 30s
  useEffect(() => {
    if (isPlaying && currentTrack) {
      bookmarkTimerRef.current = setInterval(() => {
        const { currentTime } = usePlayerStore.getState();
        if (currentTrack && currentTime > 5) {
          saveBookmark({
            chapterId: currentTrack.chapterId,
            chapterName: currentTrack.chapterName,
            position: currentTime,
            verseKey: `${currentTrack.chapterId}:1`,
          });
        }
      }, 30000);
    } else {
      if (bookmarkTimerRef.current) clearInterval(bookmarkTimerRef.current);
    }
    return () => {
      if (bookmarkTimerRef.current) clearInterval(bookmarkTimerRef.current);
    };
  }, [isPlaying, currentTrack, saveBookmark]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {isExpanded && <NowPlayingView />}
      {showQueue && <QueueView />}

      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setBuffering(false);
        }}
        onEnded={() => {
          if (currentTrack) markSurahComplete(currentTrack.chapterId);
          handleEnded();
        }}
        onWaiting={() => setBuffering(true)}
        onCanPlay={() => setBuffering(false)}
        onError={() => {
          setError(true);
          setBuffering(false);
        }}
        preload="auto"
      />

      {/* Floating pill player */}
      {currentTrack && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-[520px]">
          <button
            onClick={() => setExpanded(true)}
            className="w-full bg-nr-surface/95 backdrop-blur-xl border border-nr-border rounded-full px-4 py-2.5 flex items-center gap-3 shadow-lg shadow-black/30 hover:bg-nr-panel/90 transition-colors group"
            aria-label="Open now playing"
          >
            {/* Surah name */}
            <span className="text-sm font-medium text-nr-text truncate min-w-0">
              {currentTrack.chapterName}
            </span>

            {/* Inline progress bar */}
            <div className="flex-1 h-1 bg-nr-border rounded-full overflow-hidden min-w-[60px]">
              <div
                className="h-full bg-nr-gold rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Play/Pause */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-8 h-8 rounded-full bg-nr-gold flex items-center justify-center shrink-0 hover:bg-nr-gold-light transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isBuffering ? (
                <div className="w-4 h-4 border-2 border-nr-base/30 border-t-nr-base rounded-full animate-spin" />
              ) : isPlaying ? (
                <IoPauseSharp size={14} className="text-nr-base" />
              ) : (
                <IoPlaySharp size={14} className="text-nr-base ml-0.5" />
              )}
            </button>

            {/* Time */}
            <span className="text-[11px] text-nr-muted tabular-nums shrink-0 hidden sm:block">
              {formatTime(currentTime)}/{formatTime(duration)}
            </span>
          </button>
        </div>
      )}
    </>
  );
}
