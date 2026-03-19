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
    <div className={`fixed inset-0 z-50 bg-gradient-to-b from-indigo-950 via-nr-base to-nr-base flex flex-col ${closing ? 'animate-slideDown' : 'animate-slideUp'}`}>
      {/* Islamic geometric pattern overlay */}
      <div className="absolute inset-0 geo-pattern opacity-30 pointer-events-none" />

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-6 pt-6 pb-4">
        <button onClick={handleClose} className="text-nr-text" aria-label="Close now playing">
          <IoChevronDown size={28} />
        </button>
        <p className="text-xs uppercase tracking-widest text-nr-muted">Now Playing</p>
        <button
          onClick={cyclePlaybackRate}
          className="text-xs text-nr-muted border border-nr-muted/30 rounded px-2 py-0.5"
        >
          {playbackRate}x
        </button>
      </div>

      {/* Artwork — unique Islamic design, NOT Spotify album art */}
      <div className="relative flex-1 flex items-center justify-center px-10">
        <div className="w-full max-w-[320px] aspect-square relative">
          {/* Outer ornamental border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-nr-gold/20 via-transparent to-nr-gold/10 p-[1px]">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-900/80 via-nr-panel to-violet-900/60 geo-pattern" />
          </div>
          {/* Inner content */}
          <div className="absolute inset-4 border border-nr-gold/20 rounded-xl" />
          <div className="absolute inset-0 flex items-center justify-center noor-glow rounded-2xl">
            <div className="text-center">
              <p className="arabic-text text-6xl text-nr-text mb-2">{currentTrack.chapterNameArabic}</p>
              <p className="text-nr-gold/60 text-sm font-medium">{currentTrack.chapterId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Track info */}
      <div className="relative px-8 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-nr-text">{currentTrack.chapterName}</h2>
            <p className="text-sm text-nr-muted">{currentTrack.reciterName}</p>
          </div>
          <button
            onClick={() => toggleFavorite(currentTrack.chapterId)}
            className={liked ? 'text-nr-gold' : 'text-nr-muted'}
            aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
          >
            {liked ? <IoHeart size={24} /> : <IoHeartOutline size={24} />}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="relative px-8 mb-2">
        <div className="relative w-full h-1 bg-nr-text/20 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-nr-gold rounded-full" style={{ width: `${progress}%` }} />
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
        <div className="flex justify-between text-[11px] text-nr-muted tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="relative flex items-center justify-center gap-8 px-8 pb-4">
        <button
          onClick={toggleShuffle}
          className={`transition-colors ${shuffle ? 'text-nr-gold' : 'text-nr-muted'}`}
          aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
        >
          <IoShuffle size={22} />
        </button>
        <button onClick={prev} className="text-nr-text" aria-label="Previous">
          <IoPlaySkipBack size={28} />
        </button>
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-nr-gold flex items-center justify-center hover:bg-nr-gold-light hover:scale-105 transition-all"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isBuffering ? (
            <div className="w-6 h-6 border-3 border-nr-base/30 border-t-nr-base rounded-full animate-spin" />
          ) : isPlaying ? (
            <IoPauseSharp size={28} className="text-nr-base" />
          ) : (
            <IoPlaySharp size={28} className="text-nr-base ml-1" />
          )}
        </button>
        <button onClick={next} className="text-nr-text" aria-label="Next">
          <IoPlaySkipForward size={28} />
        </button>
        <button
          onClick={toggleRepeat}
          className={`transition-colors ${repeatMode !== 'off' ? 'text-nr-gold' : 'text-nr-muted'}`}
          aria-label={`Repeat mode: ${repeatMode}`}
        >
          <RepeatIcon size={22} />
        </button>
      </div>

      <div className="safe-bottom" />
    </div>
  );
}
