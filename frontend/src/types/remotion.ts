import { CSSProperties } from 'react';

export interface RemotionLayer {
  id: string;
  src: string;
  type: 'video' | 'audio' | 'image' | 'text';
  from: number;
  durationInFrames: number;
  zIndex: number;
  style?: CSSProperties;
}

export interface RemotionCompositionState {
  layers: RemotionLayer[];
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
}
