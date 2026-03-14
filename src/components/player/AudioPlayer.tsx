'use client';

import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    currentTrack,
    setAudioElement,
    setDuration,
    setCurrentTime,
    setBuffering,
    setError,
    handleEnded,
    volume,
    playbackRate,
    cyclePlaybackRate,
  } = usePlayerStore();

  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);
      audioRef.current.volume = volume;
    }
  }, [setAudioElement, volume]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-sp-dark border-t border-[#282828] flex items-center px-4 z-30">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setBuffering(false);
        }}
        onEnded={handleEnded}
        onWaiting={() => setBuffering(true)}
        onCanPlay={() => setBuffering(false)}
        onError={() => {
          setError(true);
          setBuffering(false);
        }}
        preload="auto"
      />

      {/* Track info */}
      <div className="w-[200px] min-w-[120px] flex items-center gap-3">
        {currentTrack ? (
          <>
            <div className="w-10 h-10 bg-sp-gray rounded flex items-center justify-center shrink-0">
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
      </div>

      {/* Controls + Progress */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1 max-w-[700px] mx-auto">
        <PlayerControls />
        <ProgressBar />
      </div>

      {/* Volume + Speed */}
      <div className="w-[200px] min-w-[120px] flex justify-end items-center gap-3">
        <button
          onClick={cyclePlaybackRate}
          className="hidden sm:flex text-[11px] text-sp-light-gray hover:text-sp-white transition-colors border border-sp-light-gray/30 rounded px-1.5 py-0.5 min-w-[36px] justify-center"
          aria-label={`Playback speed ${playbackRate}x`}
        >
          {playbackRate}x
        </button>
        <VolumeControl />
      </div>
    </div>
  );
}
