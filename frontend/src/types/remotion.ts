import { CSSProperties } from 'react';

export interface RemotionLayer {
  id: string;
  src: string;
  type: 'video' | 'audio' | 'image' | 'text';
  from: number;
  durationInFrames: number;
  zIndex: number;
  style?: CSSProperties;
  status: 'idle' | 'loading' | 'completed' | 'failed';
  progress: number;
  jobId?: string;
  error?: string;
  jobType: 'none' | 'corridorkey' | 'ltx';
}

export interface RemotionCompositionState {
  layers: RemotionLayer[];
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
}
