'use client';

interface NoorLogoProps {
  size?: number;
  showText?: boolean;
}

/**
 * Noor logo — Stylized Arabic letter Noon (ن) with radiating light.
 * The bowl of the noon represents an open vessel receiving light,
 * and the dot above radiates like a source of illumination.
 */
export default function NoorLogo({ size = 36, showText = true }: NoorLogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Noor logo"
      >
        <defs>
          <linearGradient id="noor-gold" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e2bc5e" />
            <stop offset="50%" stopColor="#d4a846" />
            <stop offset="100%" stopColor="#c9973a" />
          </linearGradient>
          <radialGradient id="noor-glow" cx="24" cy="12" r="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d4a846" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#d4a846" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="noor-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#221f52" />
            <stop offset="100%" stopColor="#1a1940" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle cx="24" cy="24" r="23" fill="url(#noor-bg)" stroke="#d4a846" strokeWidth="0.5" strokeOpacity="0.3" />

        {/* Subtle inner geometric accent */}
        <path d="M24 8L40 24L24 40L8 24Z" stroke="#d4a846" strokeWidth="0.3" strokeOpacity="0.08" />

        {/* Light glow behind the dot */}
        <circle cx="24" cy="12" r="14" fill="url(#noor-glow)" />

        {/* Light rays */}
        <g opacity="0.2" stroke="#d4a846" strokeWidth="0.8" strokeLinecap="round">
          <line x1="24" y1="8" x2="24" y2="4" />
          <line x1="20" y1="9" x2="18" y2="5.5" />
          <line x1="28" y1="9" x2="30" y2="5.5" />
          <line x1="17" y1="12" x2="14" y2="10" />
          <line x1="31" y1="12" x2="34" y2="10" />
        </g>

        {/* Noon (ن) bowl — the signature mark */}
        <path
          d="M12 32 Q12 22 18 18 Q21 16 24 16 Q27 16 30 18 Q36 22 36 32"
          stroke="url(#noor-gold)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* The dot (nuqta) — radiant */}
        <circle cx="24" cy="12" r="2.8" fill="url(#noor-gold)" />

        {/* Tiny decorative endpoints */}
        <circle cx="12" cy="32" r="1" fill="#d4a846" opacity="0.4" />
        <circle cx="36" cy="32" r="1" fill="#d4a846" opacity="0.4" />
      </svg>

      {showText && (
        <div className="leading-tight">
          <span className="text-gold-gradient font-bold text-lg tracking-wide block">Noor</span>
          <span className="text-nr-muted text-[9px] tracking-[0.2em] uppercase block -mt-0.5">Quran</span>
        </div>
      )}
    </div>
  );
}
