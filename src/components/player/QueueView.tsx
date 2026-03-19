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
        className="absolute right-0 top-0 bottom-0 w-full max-w-[360px] bg-sp-dark border-l border-[#282828] flex flex-col animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#282828]">
          <h3 className="text-lg font-bold text-sp-white">Queue</h3>
          <button
            onClick={() => setShowQueue(false)}
            className="text-sp-light-gray hover:text-sp-white transition-colors"
            aria-label="Close queue"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Now Playing */}
          {currentTrack && (
            <div className="px-4 pt-4 pb-2">
              <p className="text-xs uppercase tracking-wider text-sp-light-gray mb-2">Now Playing</p>
              <div className="flex items-center gap-3 p-3 rounded-md bg-sp-green/10 border border-sp-green/20">
                <div className="w-10 h-10 bg-gradient-to-br from-sp-green/40 to-emerald-900 rounded flex items-center justify-center shrink-0">
                  <IoMusicalNotes size={16} className="text-sp-green" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-sp-green font-medium truncate">{currentTrack.chapterName}</p>
                  <p className="text-[11px] text-sp-light-gray truncate">{currentTrack.reciterName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Up Next */}
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs uppercase tracking-wider text-sp-light-gray mb-2">
              Next Up {upNext.length > 0 && `(${upNext.length})`}
            </p>
            {upNext.length === 0 ? (
              <p className="text-sm text-sp-light-gray py-4 text-center">Nothing queued</p>
            ) : (
              <div className="space-y-1">
                {upNext.map((track, idx) => {
                  const actualIndex = queueIndex + 1 + idx;
                  return (
                    <div
                      key={`${track.chapterId}-${actualIndex}`}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-sp-hover group transition-colors cursor-pointer"
                      onClick={() => jumpToTrack(actualIndex)}
                    >
                      <span className="text-xs text-sp-light-gray w-5 text-center">{idx + 1}</span>
                      <div className="w-8 h-8 bg-sp-gray rounded flex items-center justify-center shrink-0">
                        <span className="text-xs text-sp-white">{track.chapterId}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-sp-white truncate">{track.chapterName}</p>
                        <p className="text-[11px] text-sp-light-gray truncate">{track.reciterName}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(actualIndex);
                        }}
                        className="text-sp-light-gray opacity-0 group-hover:opacity-100 hover:text-sp-white transition-all"
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
