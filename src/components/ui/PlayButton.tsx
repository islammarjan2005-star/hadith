'use client';

import { IoPlaySharp, IoPauseSharp } from 'react-icons/io5';

interface PlayButtonProps {
  isPlaying?: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizes = { sm: 14, md: 18, lg: 22 };

export default function PlayButton({ isPlaying, onClick, size = 'md' }: PlayButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`${sizes[size]} rounded-full bg-nr-gold hover:bg-nr-gold-light hover:scale-105 flex items-center justify-center transition-all shadow-lg`}
    >
      {isPlaying ? (
        <IoPauseSharp size={iconSizes[size]} className="text-nr-base" />
      ) : (
        <IoPlaySharp size={iconSizes[size]} className="text-nr-base ml-0.5" />
      )}
    </button>
  );
}
