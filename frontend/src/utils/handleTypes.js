export const HANDLE_COLORS = {
  image: '#ec4899',
  video: '#14b8a6',
  text: '#f97316',
  audio: '#a855f7', // Purple for audio
  aspect_ratio: '#f59e0b',
  resolution: '#22c55e',
  num_images: '#8b5cf6',
  any: '#8b5cf6',
};

export function getHandleDataType(handleId) {
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

export function getHandleColor(handleId) {
  return HANDLE_COLORS[getHandleDataType(handleId)];
}

export function isValidConnection(connection) {
  if (connection.source === connection.target) return false;

  const srcType = getHandleDataType(connection.sourceHandle);
  const tgtType = getHandleDataType(connection.targetHandle);

  if (srcType === 'any' || tgtType === 'any') return true;
  return srcType === tgtType;
}
