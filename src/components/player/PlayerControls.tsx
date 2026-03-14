'use client';

import { IoPlaySharp, IoPauseSharp, IoPlaySkipBack, IoPlaySkipForward } from 'react-icons/io5';
import { usePlayerStore } from '@/store/playerStore';

export default function PlayerControls() {
  const { isPlaying, togglePlay, next, prev, currentTrack } = usePlayerStore();

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={prev}
        disabled={!currentTrack}
        className="text-sp-light-gray hover:text-sp-white transition-colors disabled:opacity-30"
      >
        <IoPlaySkipBack size={20} />
      </button>
      <button
        onClick={togglePlay}
        disabled={!currentTrack}
        className="w-8 h-8 rounded-full bg-sp-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-30"
      >
        {isPlaying ? (
          <IoPauseSharp size={18} className="text-black" />
        ) : (
          <IoPlaySharp size={18} className="text-black ml-0.5" />
        )}
      </button>
      <button
        onClick={next}
        disabled={!currentTrack}
        className="text-sp-light-gray hover:text-sp-white transition-colors disabled:opacity-30"
      >
        <IoPlaySkipForward size={20} />
      </button>
    </div>
  );
}
