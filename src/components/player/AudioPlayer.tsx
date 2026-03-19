'use client';

import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { useLibraryStore } from '@/store/libraryStore';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import NowPlayingView from './NowPlayingView';
import QueueView from './QueueView';
import { IoList, IoBookmark } from 'react-icons/io5';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const listenTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bookmarkTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const {
    currentTrack,
    isPlaying,
    isExpanded,
    showQueue,
    setAudioElement,
    setDuration,
    setCurrentTime,
    setBuffering,
    setError,
    handleEnded,
    volume,
    playbackRate,
    cyclePlaybackRate,
    setExpanded,
    setShowQueue,
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

  return (
    <>
      {isExpanded && <NowPlayingView />}
      {showQueue && <QueueView />}

      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-nr-surface border-t border-nr-border flex items-center px-4 z-30">
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

        {/* Track info — click to expand */}
        <button
          className="w-[200px] min-w-[120px] flex items-center gap-3 text-left"
          onClick={() => currentTrack && setExpanded(true)}
          aria-label="Open now playing"
        >
          {currentTrack ? (
            <>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-800/60 to-violet-900/40 rounded flex items-center justify-center shrink-0 border border-nr-gold/20">
                <span className="text-nr-gold text-lg font-bold">{currentTrack.chapterId}</span>
              </div>
              <div className="truncate">
                <p className="text-sm text-nr-text truncate">{currentTrack.chapterName}</p>
                <p className="text-[11px] text-nr-muted truncate">{currentTrack.reciterName}</p>
              </div>
            </>
          ) : (
            <div className="text-nr-muted text-sm">No track selected</div>
          )}
        </button>

        {/* Controls + Progress */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1 max-w-[700px] mx-auto">
          <PlayerControls />
          <ProgressBar />
        </div>

        {/* Volume + Speed + Queue */}
        <div className="w-[200px] min-w-[120px] flex justify-end items-center gap-2">
          <button
            onClick={cyclePlaybackRate}
            className="hidden sm:flex text-[11px] text-nr-muted hover:text-nr-text transition-colors border border-nr-muted/30 rounded px-1.5 py-0.5 min-w-[36px] justify-center"
            aria-label={`Playback speed ${playbackRate}x`}
          >
            {playbackRate}x
          </button>
          <button
            onClick={() => {
              if (currentTrack) {
                const { currentTime } = usePlayerStore.getState();
                saveBookmark({
                  chapterId: currentTrack.chapterId,
                  chapterName: currentTrack.chapterName,
                  position: currentTime,
                  verseKey: `${currentTrack.chapterId}:1`,
                });
              }
            }}
            className="hidden sm:flex text-nr-muted hover:text-nr-text transition-colors"
            aria-label="Save bookmark"
          >
            <IoBookmark size={16} />
          </button>
          <button
            onClick={() => setShowQueue(!showQueue)}
            className={`hidden sm:flex transition-colors ${showQueue ? 'text-nr-gold' : 'text-nr-muted hover:text-nr-text'}`}
            aria-label="Toggle queue"
          >
            <IoList size={20} />
          </button>
          <VolumeControl />
        </div>
      </div>
    </>
  );
}
