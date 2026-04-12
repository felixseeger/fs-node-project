export type HandleType = 'image' | 'video' | 'audio' | 'text' | 'aspect_ratio' | 'resolution' | 'num_images' | 'any';

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
  if (imageIds.includes(handleId)) return 'image';

  const videoIds = ['video-out', 'output-video'];
  if (videoIds.includes(handleId)) return 'video';

  const audioIds = ['output-audio', 'audio-in', 'audio'];
  if (audioIds.includes(handleId)) return 'audio';

  if (
    handleId.includes('prompt') ||
    handleId.includes('analysis') ||
    handleId.includes('text') ||
    handleId.includes('system') ||
    handleId.includes('adapted')
  ) {
    return 'text';
  }

  if (handleId.includes('aspect')) return 'aspect_ratio';
  if (handleId.includes('resolution')) return 'resolution';
  if (handleId.includes('num_images') || handleId.includes('num-images')) return 'num_images';

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
}): boolean {
  if (!connection.source || !connection.target || !connection.sourceHandle || !connection.targetHandle) return false;
  if (connection.source === connection.target) return false;

  const srcType = getHandleDataType(connection.sourceHandle);
  const tgtType = getHandleDataType(connection.targetHandle);

  if (srcType === 'any' || tgtType === 'any') return true;
  return srcType === tgtType;
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
