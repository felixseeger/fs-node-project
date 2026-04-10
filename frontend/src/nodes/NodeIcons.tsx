import React, { FC, CSSProperties } from 'react';

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

export const LinkIcon: FC<IconProps> = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
  </svg>
);
