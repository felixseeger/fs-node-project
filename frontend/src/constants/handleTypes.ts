/**
 * Handle Types and Colors
 * Defines typed connections between nodes
 */
import type { HandleDataType } from '../types/api';

// Handle color palette
export const HANDLE_COLORS: Record<HandleDataType, string> = {
  image: '#ec4899',      // Pink
  video: '#14b8a6',      // Teal
  audio: '#a855f7',      // Purple
  text: '#f97316',       // Orange
  aspect_ratio: '#f59e0b', // Amber
  resolution: '#22c55e', // Green
  num_images: '#8b5cf6', // Purple
  any: '#8b5cf6',        // Purple (fallback)
};

// Map handle IDs to their data types
export function getHandleDataType(handleId: string | null | undefined): HandleDataType {
  if (!handleId) return 'any';
  
  const id = handleId.toLowerCase();
  
  // Image types
  if (id.includes('image') || (id === 'output' && !id.includes('video') && !id.includes('audio'))) {
    return 'image';
  }
  
  // Video types
  if (id.includes('video')) return 'video';
  
  // Audio types
  if (id.includes('audio')) return 'audio';
  
  // Text types (prompt, analysis, text)
  if (id.includes('prompt') || id.includes('analysis') || id.includes('text')) {
    return 'text';
  }
  
  // Aspect ratio
  if (id.includes('aspect')) return 'aspect_ratio';
  
  // Resolution
  if (id.includes('resolution')) return 'resolution';
  
  // Number of images
  if (id.includes('num_images')) return 'num_images';
  
  return 'any';
}

// Get color for a handle type
export function getHandleColor(handleId: string | null | undefined): string {
  const type = getHandleDataType(handleId);
  return HANDLE_COLORS[type] || HANDLE_COLORS.any;
}

// Check if two handle types are compatible
export function areHandlesCompatible(
  sourceHandle: string | null | undefined, 
  targetHandle: string | null | undefined
): boolean {
  const sourceType = getHandleDataType(sourceHandle);
  const targetType = getHandleDataType(targetHandle);
  
  // Same type always connects
  if (sourceType === targetType) return true;
  
  // 'any' type connects to everything
  if (sourceType === 'any' || targetType === 'any') return true;
  
  // Image output can connect to images-in (for multiple images)
  if (sourceType === 'image' && targetHandle?.includes('images')) return true;
  
  return false;
}

// Handle type descriptions for UI
export const HANDLE_TYPE_DESCRIPTIONS: Record<HandleDataType, string> = {
  image: 'Image data (URL or base64)',
  video: 'Video data (URL)',
  audio: 'Audio data (URL)',
  text: 'Text data (prompts, analysis results)',
  aspect_ratio: 'Aspect ratio (e.g., 16:9, 4:3)',
  resolution: 'Resolution (e.g., 720p, 1080p)',
  num_images: 'Number of images to generate',
  any: 'Any data type',
};

export default {
  HANDLE_COLORS,
  getHandleDataType,
  getHandleColor,
  areHandlesCompatible,
  HANDLE_TYPE_DESCRIPTIONS,
};
