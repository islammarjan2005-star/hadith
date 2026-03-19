'use client';

import { IoPlaySharp, IoPauseSharp, IoPlaySkipBack, IoPlaySkipForward, IoRepeat, IoShuffle } from 'react-icons/io5';
import { TbRepeatOnce } from 'react-icons/tb';
import { usePlayerStore } from '@/store/playerStore';

export default function PlayerControls() {
  const { isPlaying, isBuffering, currentTrack, togglePlay, next, prev, repeatMode, shuffle, toggleRepeat, toggleShuffle } = usePlayerStore();

  const RepeatIcon = repeatMode === 'one' ? TbRepeatOnce : IoRepeat;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleShuffle}
        disabled={!currentTrack}
        className={`hidden sm:block transition-colors disabled:opacity-30 ${
          shuffle ? 'text-nr-gold' : 'text-nr-muted hover:text-nr-text'
        }`}
        aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
      >
        <IoShuffle size={18} />
      </button>
      <button
        onClick={prev}
        disabled={!currentTrack}
        className="text-nr-muted hover:text-nr-text transition-colors disabled:opacity-30"
        aria-label="Previous"
      >
        <IoPlaySkipBack size={20} />
      </button>
      <button
        onClick={togglePlay}
        disabled={!currentTrack}
        className="w-8 h-8 rounded-full bg-nr-gold flex items-center justify-center hover:bg-nr-gold-light hover:scale-105 transition-all disabled:opacity-30 relative"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isBuffering ? (
          <div className="w-4 h-4 border-2 border-nr-base/30 border-t-nr-base rounded-full animate-spin" />
        ) : isPlaying ? (
          <IoPauseSharp size={18} className="text-nr-base" />
        ) : (
          <IoPlaySharp size={18} className="text-nr-base ml-0.5" />
        )}
      </button>
      <button
        onClick={next}
        disabled={!currentTrack}
        className="text-nr-muted hover:text-nr-text transition-colors disabled:opacity-30"
        aria-label="Next"
      >
        <IoPlaySkipForward size={20} />
      </button>
      <button
        onClick={toggleRepeat}
        disabled={!currentTrack}
        className={`hidden sm:block transition-colors disabled:opacity-30 ${
          repeatMode !== 'off' ? 'text-nr-gold' : 'text-nr-muted hover:text-nr-text'
        }`}
        aria-label={`Repeat mode: ${repeatMode}`}
      >
        <RepeatIcon size={18} />
      </button>
    </div>
  );
}
