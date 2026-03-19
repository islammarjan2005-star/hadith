'use client';

import { useState } from 'react';
import { IoChevronDown, IoHeart, IoHeartOutline, IoRepeat, IoShuffle } from 'react-icons/io5';
import { TbRepeatOnce } from 'react-icons/tb';
import { IoPlaySharp, IoPauseSharp, IoPlaySkipBack, IoPlaySkipForward } from 'react-icons/io5';
import { usePlayerStore } from '@/store/playerStore';
import { useLibraryStore } from '@/store/libraryStore';
import { formatTime } from '@/lib/utils';

export default function NowPlayingView() {
  const {
    currentTrack, isPlaying, isBuffering, duration, currentTime,
    togglePlay, next, prev, seek, repeatMode, shuffle,
    toggleRepeat, toggleShuffle, setExpanded, playbackRate, cyclePlaybackRate,
  } = usePlayerStore();
  const { toggleFavorite, isFavorite } = useLibraryStore();
  const [closing, setClosing] = useState(false);

  const liked = currentTrack ? isFavorite(currentTrack.chapterId) : false;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setExpanded(false);
      setClosing(false);
    }, 280);
  };

  if (!currentTrack) return null;

  const RepeatIcon = repeatMode === 'one' ? TbRepeatOnce : IoRepeat;

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-b from-emerald-900/90 to-sp-black flex flex-col ${closing ? 'animate-slideDown' : 'animate-slideUp'}`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <button onClick={handleClose} className="text-sp-white" aria-label="Close now playing">
          <IoChevronDown size={28} />
        </button>
        <p className="text-xs uppercase tracking-widest text-sp-light-gray">Now Playing</p>
        <button
          onClick={cyclePlaybackRate}
          className="text-xs text-sp-light-gray border border-sp-light-gray/30 rounded px-2 py-0.5"
        >
          {playbackRate}x
        </button>
      </div>

      {/* Artwork */}
      <div className="flex-1 flex items-center justify-center px-10">
        <div className="w-full max-w-[320px] aspect-square bg-gradient-to-br from-sp-green/40 to-emerald-900 rounded-2xl flex items-center justify-center shadow-2xl">
          <div className="text-center">
            <p className="arabic-text text-6xl text-sp-white mb-2">{currentTrack.chapterNameArabic}</p>
            <p className="text-sp-white/60 text-sm">{currentTrack.chapterId}</p>
          </div>
        </div>
      </div>

      {/* Track info */}
      <div className="px-8 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-sp-white">{currentTrack.chapterName}</h2>
            <p className="text-sm text-sp-light-gray">{currentTrack.reciterName}</p>
          </div>
          <button
            onClick={() => toggleFavorite(currentTrack.chapterId)}
            className={liked ? 'text-sp-green' : 'text-sp-light-gray'}
            aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
          >
            {liked ? <IoHeart size={24} /> : <IoHeartOutline size={24} />}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="px-8 mb-2">
        <div className="relative w-full h-1 bg-sp-white/20 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-sp-white rounded-full" style={{ width: `${progress}%` }} />
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
        <div className="flex justify-between text-[11px] text-sp-light-gray tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8 px-8 pb-4">
        <button
          onClick={toggleShuffle}
          className={`transition-colors ${shuffle ? 'text-sp-green' : 'text-sp-light-gray'}`}
          aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
        >
          <IoShuffle size={22} />
        </button>
        <button onClick={prev} className="text-sp-white" aria-label="Previous">
          <IoPlaySkipBack size={28} />
        </button>
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-sp-white flex items-center justify-center hover:scale-105 transition-transform"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isBuffering ? (
            <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
          ) : isPlaying ? (
            <IoPauseSharp size={28} className="text-black" />
          ) : (
            <IoPlaySharp size={28} className="text-black ml-1" />
          )}
        </button>
        <button onClick={next} className="text-sp-white" aria-label="Next">
          <IoPlaySkipForward size={28} />
        </button>
        <button
          onClick={toggleRepeat}
          className={`transition-colors ${repeatMode !== 'off' ? 'text-sp-green' : 'text-sp-light-gray'}`}
          aria-label={`Repeat mode: ${repeatMode}`}
        >
          <RepeatIcon size={22} />
        </button>
      </div>

      {/* Safe area spacer */}
      <div className="safe-bottom" />
    </div>
  );
}
