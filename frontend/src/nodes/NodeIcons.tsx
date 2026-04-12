import React, { type FC, type CSSProperties } from 'react';

interface IconProps {
  style?: CSSProperties;
}

export const InfoIcon: FC<IconProps> = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

interface ChevronDownIconProps extends IconProps {
  expanded?: boolean;
}

export const ChevronDownIcon: FC<ChevronDownIconProps> = ({ expanded, style }) => (
  <svg 
    width="14" height="14" viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ ...style, transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

interface PublishIconProps extends IconProps {
  active?: boolean;
}

export const PublishIcon: FC<PublishIconProps> = ({ active, style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

export const MagicIcon: FC<IconProps> = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M18.8 3.3a3.5 3.5 0 0 0-5 0l-9 9a3.5 3.5 0 0 0 0 5l5 5a3.5 3.5 0 0 0 5 0l9-9a3.5 3.5 0 0 0 0-5z"></path>
    <path d="m2 22 5.5-1.5L9 22"></path>
    <path d="m15 2.5 3 3"></path>
  </svg>
);

export const PlayIcon: FC<IconProps> = ({ style }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={style}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

/** Frame / aspect — used for aspect-ratio only controls */
export const AspectRatioIcon: FC<IconProps> = ({ style }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M8 9v6M16 9v6" opacity="0.35" />
  </svg>
);

/** Mini frame preview for aspect strings like "16:9" (inspector menus) */
export const AspectFrameMini: FC<{ aspect: string; style?: CSSProperties }> = ({ aspect, style }) => {
  const [aw, ah] = aspect.split(':').map(Number);
  if (!Number.isFinite(aw) || !Number.isFinite(ah) || aw <= 0 || ah <= 0) {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" style={style} aria-hidden>
        <rect x="3" y="3" width="14" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  const box = 14;
  let rw: number;
  let rh: number;
  if (aw >= ah) {
    rw = box;
    rh = (box * ah) / aw;
  } else {
    rh = box;
    rw = (box * aw) / ah;
  }
  const ox = (20 - rw) / 2;
  const oy = (20 - rh) / 2;
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" style={style} aria-hidden>
      <rect
        x={ox}
        y={oy}
        width={rw}
        height={rh}
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
};

/** Pixel dimensions — used for output size controls */
export const ResolutionIcon: FC<IconProps> = ({ style }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 9h6v6H9z" />
  </svg>
);

export const LinkIcon: FC<IconProps> = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
  </svg>
);
