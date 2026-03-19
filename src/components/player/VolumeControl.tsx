'use client';

import { IoVolumeHigh, IoVolumeMedium, IoVolumeLow, IoVolumeMute } from 'react-icons/io5';
import { usePlayerStore } from '@/store/playerStore';

export default function VolumeControl() {
  const { volume, setVolume } = usePlayerStore();

  const VolumeIcon =
    volume === 0
      ? IoVolumeMute
      : volume < 0.33
        ? IoVolumeLow
        : volume < 0.66
          ? IoVolumeMedium
          : IoVolumeHigh;

  return (
    <div className="hidden sm:flex items-center gap-2">
      <button
        onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
        className="text-nr-muted hover:text-nr-text transition-colors"
      >
        <VolumeIcon size={20} />
      </button>
      <div className="relative w-24 group">
        <div className="h-1 bg-nr-border rounded-full overflow-hidden">
          <div
            className="h-full bg-nr-text group-hover:bg-nr-gold rounded-full transition-colors"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
