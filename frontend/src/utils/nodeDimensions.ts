/**
 * Node Dimension Utilities
 * 
 * Utilities for calculating and managing node dimensions, aspect ratios,
 * and responsive sizing. Inspired by NodeBanana's implementation but
 * adapted for FS Node Project's requirements.
 */

import { Node } from "@xyflow/react";

/**
 * Default node dimension constants
 */
export const DEFAULT_NODE_DIMENSION = 300;
export const MIN_NODE_WIDTH = 180;
export const MIN_NODE_HEIGHT = 100;

/**
 * Media dimension cache for performance optimization
 */
const mediaDimensionsCache = new Map<string, { width: number; height: number; aspectRatio: number }>();

/**
 * Options for getMediaDimensions
 */
export interface GetMediaDimensionsOptions {
  /** AbortController signal for cancellation */
  signal?: AbortSignal;
  /** Maximum size in MB for data URLs */
  maxSizeMB?: number;
}

/**
 * Get media dimensions from URL or base64 data
 * Supports images and videos with caching for performance
 * 
 * SECURITY: Supports AbortController for timeouts and maxSizeMB for data URL validation
 */
export async function getMediaDimensions(
  mediaUrl: string,
  options: GetMediaDimensionsOptions = {}
): Promise<{ width: number; height: number; aspectRatio: number }> {
  const { signal, maxSizeMB } = options;
  
  // Check cache first (respect abort signal)
  if (!signal?.aborted) {
    const cached = mediaDimensionsCache.get(mediaUrl);
    if (cached) return cached;
  }
  
  // SECURITY: Validate data URL size if maxSizeMB is specified
  if (maxSizeMB !== undefined && mediaUrl.startsWith('data:')) {
    // Estimate size: base64 is ~4/3 of binary size
    const base64Data = mediaUrl.split(',')[1];
    if (base64Data) {
      const estimatedBytes = (base64Data.length * 3) / 4;
      const estimatedMB = estimatedBytes / (1024 * 1024);
      if (estimatedMB > maxSizeMB) {
        console.warn(`Media size (${estimatedMB.toFixed(2)}MB) exceeds limit (${maxSizeMB}MB)`);
        return { width: 800, height: 600, aspectRatio: 4/3 };
      }
    }
  }
  
  return new Promise((resolve) => {
    // Check if already aborted
    if (signal?.aborted) {
      resolve({ width: 800, height: 600, aspectRatio: 4/3 });
      return;
    }
    
    try {
      // Create image element for dimension detection
      const img = new Image();
      
      // Handle abort signal
      const abortHandler = () => {
        img.src = ''; // Cancel loading
        resolve({ width: 800, height: 600, aspectRatio: 4/3 });
      };
      
      if (signal) {
        signal.addEventListener('abort', abortHandler, { once: true });
      }
      
      img.onload = () => {
        if (signal) {
          signal.removeEventListener('abort', abortHandler);
        }
        
        const dimensions = {
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          aspectRatio: img.naturalWidth / img.naturalHeight
        };
        
        // Cache the result
        mediaDimensionsCache.set(mediaUrl, dimensions);
        resolve(dimensions);
      };
      
      img.onerror = () => {
        if (signal) {
          signal.removeEventListener('abort', abortHandler);
        }
        
        // Fallback dimensions if loading fails
        const fallback = { width: 800, height: 600, aspectRatio: 4/3 };
        mediaDimensionsCache.set(mediaUrl, fallback);
        resolve(fallback);
      };
      
      // Handle base64 and URL sources
      if (mediaUrl.startsWith('data:')) {
        img.src = mediaUrl;
      } else {
        img.src = mediaUrl;
        // Add crossOrigin for CORS handling
        img.crossOrigin = 'anonymous';
      }
    } catch (error) {
      console.error('Error getting media dimensions:', error);
      // Return fallback dimensions
      const fallback = { width: 800, height: 600, aspectRatio: 4/3 };
      mediaDimensionsCache.set(mediaUrl, fallback);
      resolve(fallback);
    }
  });
}

/**
 * Calculate aspect-fit size for media within container
 * Maintains aspect ratio while fitting within constraints
 */
export function calculateAspectFitSize(
  mediaWidth: number,
  mediaHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const mediaRatio = mediaWidth / mediaHeight;
  const containerRatio = maxWidth / maxHeight;
  
  let width = maxWidth;
  let height = maxHeight;
  
  if (mediaRatio > containerRatio) {
    // Media is wider than container - fit to width
    height = width / mediaRatio;
  } else {
    // Media is taller than container - fit to height
    width = height * mediaRatio;
  }
  
  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Read a node's effective width or height
 * Respects React Flow's internal priority system
 */
export function getNodeDimension(node: Node, axis: "width" | "height"): number {
  return (
    (node[axis] as number) ??
    (node.style?.[axis] as number) ??
    (node.measured?.[axis] as number) ??
    DEFAULT_NODE_DIMENSION
  );
}

/**
 * Apply dimensions to a React Flow node
 * Writes to both node.width/height and node.style to prevent overrides
 */
export function applyNodeDimensions(
  node: Node,
  width: number,
  height: number
): Node {
  return {
    ...node,
    width,
    height,
    style: { ...node.style, width, height },
  };
}

/**
 * Calculate optimal node size based on content and media
 */
export function calculateOptimalNodeSize(
  _node: Node,
  contentWidth: number,
  contentHeight: number,
  mediaUrl?: string | null,
  minWidth: number = MIN_NODE_WIDTH,
  minHeight: number = MIN_NODE_HEIGHT
): Promise<{ width: number; height: number }> {
  return new Promise(async (resolve) => {
    let mediaWidth = 0;
    let mediaHeight = 0;
    
    // Get media dimensions if available
    if (mediaUrl) {
      try {
        const mediaDims = await getMediaDimensions(mediaUrl);
        mediaWidth = mediaDims.width;
        mediaHeight = mediaDims.height;
      } catch (error) {
        console.warn('Could not get media dimensions, using fallbacks');
      }
    }
    
    // Calculate required size
    const contentWidthWithPadding = contentWidth + 40; // 20px padding each side
    const contentHeightWithPadding = contentHeight + 60; // 30px padding top/bottom
    
    const requiredWidth = Math.max(
      minWidth,
      contentWidthWithPadding,
      mediaWidth > 0 ? mediaWidth + 40 : 0
    );
    
    const requiredHeight = Math.max(
      minHeight,
      contentHeightWithPadding,
      mediaHeight > 0 ? mediaHeight + 100 : 0 // Extra space for controls
    );
    
    resolve({ width: requiredWidth, height: requiredHeight });
  });
}

/**
 * Calculate grid layout for multiple items
 * Used for output nodes displaying multiple results
 */
export function calculateGridLayout(
  itemCount: number,
  itemAspectRatio: number = 1,
  maxWidth: number = 800,
  minItemWidth: number = 150
): { 
  columns: number; 
  rows: number; 
  itemWidth: number; 
  itemHeight: number; 
  totalWidth: number; 
  totalHeight: number
} {
  // Calculate optimal column count
  let columns = 1;
  let itemWidth = maxWidth;
  
  // Try to fit multiple columns
  while (columns < itemCount) {
    const trialWidth = maxWidth / (columns + 1);
    if (trialWidth < minItemWidth) break;
    
    const trialHeight = trialWidth / itemAspectRatio;
    const totalHeight = Math.ceil(itemCount / (columns + 1)) * trialHeight;
    
    // Check if this layout is reasonable
    if (totalHeight < maxWidth * 1.5) {
      columns++;
      itemWidth = trialWidth;
    } else {
      break;
    }
  }
  
  const rows = Math.ceil(itemCount / columns);
  const itemHeight = itemWidth / itemAspectRatio;
  
  return {
    columns,
    rows,
    itemWidth: Math.floor(itemWidth),
    itemHeight: Math.floor(itemHeight),
    totalWidth: Math.floor(maxWidth),
    totalHeight: Math.floor(rows * itemHeight)
  };
}

/**
 * Calculate automatic layout position for new nodes
 * Positions nodes in a grid-like pattern avoiding overlaps
 */
export function calculateAutoLayoutPosition(
  existingNodes: Node[],
  nodeWidth: number = DEFAULT_NODE_DIMENSION,
  nodeHeight: number = DEFAULT_NODE_DIMENSION,
  spacing: number = 50
): { x: number; y: number } {
  if (existingNodes.length === 0) {
    return { x: 0, y: 0 };
  }
  
  // Simple grid layout - find next available position
  const positions = existingNodes.map(node => ({
    x: node.position.x,
    y: node.position.y
  }));
  
  // Find maximum coordinates
  const maxX = Math.max(...positions.map(p => p.x));
  const maxY = Math.max(...positions.map(p => p.y));
  
  // Calculate next position
  let nextX = 0;
  let nextY = 0;
  
  // Try to place to the right of the rightmost node
  if (maxX + nodeWidth + spacing < 2000) {
    nextX = maxX + nodeWidth + spacing;
    nextY = 0;
    
    // Check for vertical space
    const nodesAtX = positions.filter(p => Math.abs(p.x - nextX) < nodeWidth);
    if (nodesAtX.length > 0) {
      const maxYAtX = Math.max(...nodesAtX.map(p => p.y));
      nextY = maxYAtX + nodeHeight + spacing;
    }
  } else {
    // Start new row
    nextX = 0;
    nextY = maxY + nodeHeight + spacing;
  }
  
  return { x: nextX, y: nextY };
}

/**
 * Calculate responsive node size based on viewport
 */
export function calculateResponsiveNodeSize(
  baseWidth: number,
  baseHeight: number,
  viewportWidth: number,
  viewportHeight: number
): { width: number; height: number } {
  // Scale based on viewport size
  const scaleFactor = Math.min(
    1,
    viewportWidth / 1400, // Scale down on smaller screens
    viewportHeight / 800
  );
  
  // Apply minimum constraints
  const scaledWidth = Math.max(MIN_NODE_WIDTH, baseWidth * scaleFactor);
  const scaledHeight = Math.max(MIN_NODE_HEIGHT, baseHeight * scaleFactor);
  
  return { 
    width: Math.round(scaledWidth),
    height: Math.round(scaledHeight)
  };
}

/**
 * Clear media dimensions cache
 * Useful when media sources change
 */
export function clearMediaDimensionsCache(): void {
  mediaDimensionsCache.clear();
}

/**
 * Pre-cache media dimensions for performance
 * Useful when loading workflows with known media
 */
export async function precacheMediaDimensions(
  mediaUrls: string[]
): Promise<void> {
  await Promise.all(
    mediaUrls.map(url => getMediaDimensions(url).catch(() => null))
  );
}

/**
 * Calculate connection path points for curved connections
 * Creates smooth bezier curves between nodes
 */
export function calculateConnectionPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  curvature: number = 0.3
): string {
  // Calculate control points for smooth curve
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  
  // Control points for bezier curve
  const control1X = midX - (targetY - sourceY) * curvature;
  const control1Y = midY - (targetX - sourceX) * curvature;
  const control2X = midX + (targetY - sourceY) * curvature;
  const control2Y = midY + (targetX - sourceX) * curvature;
  
  return `M ${sourceX},${sourceY} C ${control1X},${control1Y} ${control2X},${control2Y} ${targetX},${targetY}`;
}
