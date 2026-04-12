import { HandleType } from '../types';

export const HANDLE_COLORS: Record<HandleType, string> = {
  image: '#ec4899',
  video: '#14b8a6',
  text: '#f97316',
  audio: '#a855f7', // Purple for audio
  aspect_ratio: '#f59e0b',
  resolution: '#22c55e',
  num_images: '#8b5cf6',
  any: '#8b5cf6',
};

export function getHandleDataType(handleId: string): HandleType {
  if (!handleId) return 'any';

  const imageIds = ['output', 'image-in', 'images-in', 'image_urls', 'image', 'image-out'];
  if (imageIds.includes(handleId) || handleId.startsWith('image-')) return 'image';

  const videoIds = ['video-out', 'output-video', 'video'];
  if (videoIds.includes(handleId) || handleId.startsWith('video-')) return 'video';

  const audioIds = ['output-audio', 'audio-in', 'audio'];
  if (audioIds.includes(handleId) || handleId.startsWith('audio-')) return 'audio';

  if (
    handleId.includes('prompt') ||
    handleId.includes('analysis') ||
    handleId.includes('text') ||
    handleId.includes('system') ||
    handleId.includes('adapted') ||
    handleId.startsWith('text-')
  ) {
    return 'text';
  }

  if (handleId.includes('aspect')) return 'aspect_ratio';
  if (handleId.includes('resolution')) return 'resolution';
  if (handleId.includes('num_images') || handleId.includes('num-images')) return 'num_images';

  if (handleId === 'easeCurve') return 'easeCurve' as HandleType;
  if (handleId === '3d') return '3d' as HandleType;

  return 'any';
}

export function getHandleColor(handleId: string): string {
  return HANDLE_COLORS[getHandleDataType(handleId)];
}

export function isValidConnection(connection: {
  source: string | null;
  target: string | null;
  sourceHandle: string | null;
  targetHandle: string | null;
}, nodes?: any[]): boolean {
  if (!connection.source || !connection.target || !connection.sourceHandle || !connection.targetHandle) return false;
  if (connection.source === connection.target) return false;

  const srcType = getHandleDataType(connection.sourceHandle);
  const tgtType = getHandleDataType(connection.targetHandle);

  if (srcType === 'any' || tgtType === 'any') return true;
  return srcType === tgtType;
}

export function getNodeHandles(nodeType: string): { inputs: string[], outputs: string[] } {
  // Simplified implementation for tests, typically this is handled by NODE_TYPE_CAPABILITIES
  if (nodeType === 'imageInput') return { inputs: ['reference'], outputs: ['image'] };
  if (nodeType === 'nanoBanana') return { inputs: ['image', 'text'], outputs: ['image'] };
  if (nodeType === 'videoInput') return { inputs: ['video'], outputs: ['video'] };
  if (nodeType === 'generateVideo') return { inputs: ['image', 'text', 'audio'], outputs: ['video'] };
  if (nodeType === 'router') return {
    inputs: ['image', 'text', 'video', 'audio', '3d', 'easeCurve', 'generic-input'],
    outputs: ['image', 'text', 'video', 'audio', '3d', 'easeCurve', 'generic-output']
  };
  if (nodeType === 'switch') return { inputs: ['generic-input'], outputs: [] };
  
  return { inputs: [], outputs: [] };
}

export function findCompatibleHandle(node: any, type: string, isTarget: boolean, usedHandles: Set<string> = new Set()): string | null {
  if (node.type === 'videoStitch') {
     for (let i = 0; i < 50; i++) {
        const handleId = `video-${i}`;
        if (!usedHandles.has(handleId)) return handleId;
     }
     return null;
  }
  return null;
}

export interface ConnectionInfo {
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  type: HandleType;
  color: string;
}

export function getConnectionInfo(connection: {
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}): ConnectionInfo {
  const type = getHandleDataType(connection.sourceHandle);
  return {
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle,
    targetHandle: connection.targetHandle,
    type,
    color: HANDLE_COLORS[type],
  };
}