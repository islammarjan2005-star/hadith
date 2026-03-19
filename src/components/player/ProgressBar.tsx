'use client';

import { usePlayerStore } from '@/store/playerStore';
import { formatTime } from '@/lib/utils';

export default function ProgressBar() {
  const { currentTime, duration, seek } = usePlayerStore();

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2 w-full max-w-[600px]">
      <span className="text-[11px] text-nr-muted w-10 text-right tabular-nums">
        {formatTime(currentTime)}
      </span>
      <div className="relative flex-1 group">
        <div className="h-1 bg-nr-border rounded-full overflow-hidden">
          <div
            className="h-full bg-nr-text group-hover:bg-nr-gold rounded-full transition-colors"
            style={{ width: `${progress}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <span className="text-[11px] text-nr-muted w-10 tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  );
}
