import React, { type FC, type CSSProperties } from 'react';
import { Icon } from 'blue-ether';

interface IconProps {
  style?: CSSProperties;
}

export const InfoIcon: FC<IconProps> = ({ style }) => (
  <Icon name="info" size={14} style={style} />
);

interface ChevronDownIconProps extends IconProps {
  expanded?: boolean;
}

export const ChevronDownIcon: FC<ChevronDownIconProps> = ({ expanded, style }) => (
  <Icon 
    name="chevron-down" 
    size={14} 
    style={{ ...style, transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} 
  />
);

interface PublishIconProps extends IconProps {
  active?: boolean;
}

export const PublishIcon: FC<PublishIconProps> = ({ active, style }) => (
  <Icon name="upload" size={14} style={style} />
);

export const MagicIcon: FC<IconProps> = ({ style }) => (
  <Icon name="magic" size={14} style={style} />
);

export const PlayIcon: FC<IconProps> = ({ style }) => (
  <Icon name="play" size={16} style={style} fill="currentColor" stroke="none" />
);

export const PauseIcon: FC<IconProps> = ({ style }) => (
  <Icon name="pause" size={16} style={style} fill="currentColor" stroke="none" />
);

export const StopIcon: FC<IconProps> = ({ style }) => (
  <Icon name="stop" size={16} style={style} fill="currentColor" stroke="none" />
);

export const EyeIcon: FC<IconProps> = ({ style }) => (
  <Icon name="eye" size={16} style={style} />
);

export const LockIcon: FC<IconProps> = ({ style }) => (
  <Icon name="lock" size={16} style={style} />
);

/** Frame / aspect — used for aspect-ratio only controls */
export const AspectRatioIcon: FC<IconProps> = ({ style }) => (
  <Icon name="aspect-ratio" size={16} style={style} />
);

/** Mini frame preview for aspect strings like "16:9" (inspector menus) */
export const AspectFrameMini: FC<{ aspect: string; size?: number; style?: CSSProperties }> = ({ aspect, size = 20, style }) => {
  const [aw, ah] = aspect.split(':').map(Number);
  if (!Number.isFinite(aw) || !Number.isFinite(ah) || aw <= 0 || ah <= 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" style={style} aria-hidden>
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
    <svg width={size} height={size} viewBox="0 0 20 20" style={style} aria-hidden>
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
  <Icon name="resolution" size={16} style={style} />
);

export const LinkIcon: FC<IconProps> = ({ style }) => (
  <Icon name="link" size={16} style={style} />
);

export const ClockIcon: FC<IconProps> = ({ style }) => (
  <Icon name="clock" size={16} style={style} />
);

