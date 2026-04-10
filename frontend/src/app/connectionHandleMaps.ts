import type { Node } from '@xyflow/react';
import { getHandleDataType } from '../utils/handleTypes';

export const INPUT_HANDLES_BY_TYPE: Record<string, string[]> = {
  imageAnalyzer: ['image-in'],
  imageToPrompt: ['image-in'],
  universalGeneratorImage: ['prompt-in', 'image-in', 'image-1-in', 'image-2-in', 'image-3-in'],
  universalGeneratorVideo: ['prompt-in', 'image-in', 'video-in'],
  improvePrompt: ['prompt-in', 'image-in'],
  aiImageClassifier: ['image-in'],
  layerEditor: ['image-in'],
  response: ['image-in', 'video-in', 'audio-in', 'text-in', 'prompt-in'],
  quiverImageToVector: ['image-in'],
  tripO3d: ['image-in'],
  vfx: ['video-in'],
  creativeVideoUpscale: ['video-in'],
  precisionVideoUpscale: ['video-in'],
  audioIsolation: ['audio-in'],
  musicGeneration: ['prompt-in'],
  soundEffects: ['prompt-in', 'audio-in'],
  voiceover: ['prompt-in'],
  comment: ['text-in'],
};

export const OUTPUT_HANDLES_BY_TYPE: Record<string, string[]> = {
  imageNode: ['output'],
  assetNode: ['output'],
  sourceMediaNode: ['output'],
  universalGeneratorImage: ['output'],
  universalGeneratorVideo: ['output-video'],
  imageToPrompt: ['prompt-out'],
  improvePrompt: ['prompt-out'],
  aiImageClassifier: ['text-out'],
  layerEditor: ['output'],
  tripO3d: ['output'],
  vfx: ['output-video'],
  creativeVideoUpscale: ['output-video'],
  precisionVideoUpscale: ['output-video'],
  audioIsolation: ['output-audio'],
  musicGeneration: ['output-audio'],
  soundEffects: ['output-audio'],
  voiceover: ['output-audio'],
  routerNode: ['out-1', 'out-2'],
  response: ['output'],
};

export function findCompatibleHandle(
  targetNode: Node,
  fromHandleType: string,
  isFromSource: boolean
): string | null {
  if (!targetNode?.data) return null;
  const nodeType = targetNode.type || '';
  if (isFromSource) {
    const inputHandles = INPUT_HANDLES_BY_TYPE[nodeType] || [];
    for (const h of inputHandles) {
      if (getHandleDataType(h) === fromHandleType) return h;
    }
    if (inputHandles.some((h) => h.includes('in') || h.includes('prompt'))) {
      return inputHandles.find((h) => getHandleDataType(h) === fromHandleType) || inputHandles[0];
    }
  } else {
    const outputHandles = OUTPUT_HANDLES_BY_TYPE[nodeType] || [];
    for (const h of outputHandles) {
      if (getHandleDataType(h) === fromHandleType) return h;
    }
  }
  return null;
}
