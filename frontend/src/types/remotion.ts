import { CSSProperties } from 'react';

export interface Keyframe {
  time: number; // Time in frames relative to the clip start
  value: number;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bezier';
}

export interface RemotionLayer {
  id: string;
  src: string;
  type: 'video' | 'audio' | 'image' | 'text';
  from: number;
  durationInFrames: number;
  zIndex: number;
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
  style?: CSSProperties;
  status: 'idle' | 'loading' | 'completed' | 'failed';
  progress: number;
  jobId?: string;
  error?: string;
  jobType: 'none' | 'corridorkey' | 'ltx';
  keyframes?: Record<string, Keyframe[]>; // e.g., 'opacity': [{time: 0, value: 1}, {time: 30, value: 0}]
}

export interface RemotionCompositionState {
  layers: RemotionLayer[];
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
}
