'use client';

import { IoClose, IoMusicalNotes } from 'react-icons/io5';
import { usePlayerStore } from '@/store/playerStore';

export default function QueueView() {
  const { queue, queueIndex, currentTrack, setShowQueue, jumpToTrack, removeFromQueue } = usePlayerStore();

  const upNext = queue.slice(queueIndex + 1);

  return (
    <div className="fixed inset-0 z-40" onClick={() => setShowQueue(false)}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-[360px] bg-nr-surface border-l border-nr-border flex flex-col animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-nr-border">
          <h3 className="text-lg font-bold text-nr-text">Queue</h3>
          <button
            onClick={() => setShowQueue(false)}
            className="text-nr-muted hover:text-nr-text transition-colors"
            aria-label="Close queue"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Now Playing */}
          {currentTrack && (
            <div className="px-4 pt-4 pb-2">
              <p className="text-xs uppercase tracking-wider text-nr-muted mb-2">Now Playing</p>
              <div className="flex items-center gap-3 p-3 rounded-md bg-nr-gold/10 border border-nr-gold/20">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-800/60 to-violet-900/40 rounded flex items-center justify-center shrink-0">
                  <IoMusicalNotes size={16} className="text-nr-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-nr-gold font-medium truncate">{currentTrack.chapterName}</p>
                  <p className="text-[11px] text-nr-muted truncate">{currentTrack.reciterName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Up Next */}
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs uppercase tracking-wider text-nr-muted mb-2">
              Next Up {upNext.length > 0 && `(${upNext.length})`}
            </p>
            {upNext.length === 0 ? (
              <p className="text-sm text-nr-muted py-4 text-center">Nothing queued</p>
            ) : (
              <div className="space-y-1">
                {upNext.map((track, idx) => {
                  const actualIndex = queueIndex + 1 + idx;
                  return (
                    <div
                      key={`${track.chapterId}-${actualIndex}`}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-nr-hover group transition-colors cursor-pointer"
                      onClick={() => jumpToTrack(actualIndex)}
                    >
                      <span className="text-xs text-nr-muted w-5 text-center">{idx + 1}</span>
                      <div className="w-8 h-8 bg-nr-panel rounded flex items-center justify-center shrink-0">
                        <span className="text-xs text-nr-text">{track.chapterId}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-nr-text truncate">{track.chapterName}</p>
                        <p className="text-[11px] text-nr-muted truncate">{track.reciterName}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(actualIndex);
                        }}
                        className="text-nr-muted opacity-0 group-hover:opacity-100 hover:text-nr-text transition-all"
                        aria-label="Remove from queue"
                      >
                        <IoClose size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
