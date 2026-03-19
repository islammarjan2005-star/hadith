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

      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-sp-dark border-t border-[#282828] flex items-center px-4 z-30">
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
              <div className="w-10 h-10 bg-gradient-to-br from-sp-green/30 to-emerald-900 rounded flex items-center justify-center shrink-0">
                <span className="text-sp-green text-lg font-bold">{currentTrack.chapterId}</span>
              </div>
              <div className="truncate">
                <p className="text-sm text-sp-white truncate">{currentTrack.chapterName}</p>
                <p className="text-[11px] text-sp-light-gray truncate">{currentTrack.reciterName}</p>
              </div>
            </>
          ) : (
            <div className="text-sp-light-gray text-sm">No track selected</div>
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
            className="hidden sm:flex text-[11px] text-sp-light-gray hover:text-sp-white transition-colors border border-sp-light-gray/30 rounded px-1.5 py-0.5 min-w-[36px] justify-center"
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
            className="hidden sm:flex text-sp-light-gray hover:text-sp-white transition-colors"
            aria-label="Save bookmark"
          >
            <IoBookmark size={16} />
          </button>
          <button
            onClick={() => setShowQueue(!showQueue)}
            className={`hidden sm:flex transition-colors ${showQueue ? 'text-sp-green' : 'text-sp-light-gray hover:text-sp-white'}`}
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
