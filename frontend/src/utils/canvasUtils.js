/**
 * Canvas Utilities - Helper functions for infinite canvas operations
 * 
 * Features:
 * - Node positioning and layout algorithms
 * - Canvas navigation helpers
 * - Performance optimization utilities
 * - Virtualization helpers
 */
import domtoimage from 'dom-to-image-more';

/**
 * Calculate optimal node positions for new nodes
 * @param {Array} existingNodes - Existing nodes on canvas
 * @param {number} spacing - Minimum spacing between nodes
 * @returns {Object} - Optimal position {x, y}
 */
export function calculateOptimalPosition(existingNodes, spacing = 200) {
  if (existingNodes.length === 0) {
    return { x: 0, y: 0 };
  }

  // Find the bottom-right corner of existing nodes
  const bottomRight = existingNodes.reduce((acc, node) => {
    return {
      x: Math.max(acc.x, node.position.x + (node.width || 200)),
      y: Math.max(acc.y, node.position.y + (node.height || 100)),
    };
  }, { x: 0, y: 0 });

  return {
    x: bottomRight.x + spacing,
    y: bottomRight.y + spacing,
  };
}

/**
 * Snap position to grid
 * @param {number} value - Position value
 * @param {number} gridSize - Grid size
 * @returns {number} - Snapped position
 */
export function snapToGrid(value, gridSize = 20) {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Check if node is visible in current viewport
 * @param {Object} node - Node object
 * @param {Object} viewport - Current viewport {x, y, zoom}
 * @param {Object} containerSize - Container dimensions {width, height}
 * @returns {boolean} - Visibility status
 */
export function isNodeVisible(node, viewport, containerSize) {
  const nodeRight = node.position.x + (node.width || 200);
  const nodeBottom = node.position.y + (node.height || 100);

  const viewportLeft = viewport.x;
  const viewportRight = viewport.x + containerSize.width / viewport.zoom;
  const viewportTop = viewport.y;
  const viewportBottom = viewport.y + containerSize.height / viewport.zoom;

  return (
    nodeRight > viewportLeft &&
    node.position.x < viewportRight &&
    nodeBottom > viewportTop &&
    node.position.y < viewportBottom
  );
}

/**
 * Calculate visible nodes for virtualization
 * @param {Array} nodes - All nodes
 * @param {Object} viewport - Current viewport
 * @param {Object} containerSize - Container dimensions
 * @returns {Array} - Visible nodes
 */
export function calculateVisibleNodes(nodes, viewport, containerSize) {
  return nodes.filter(node => isNodeVisible(node, viewport, containerSize));
}

/**
 * Generate grid background pattern
 * @param {number} gridSize - Grid size in pixels
 * @param {string} color - Grid line color
 * @returns {string} - SVG pattern URL
 */
export function generateGridPattern(gridSize = 20, color = '#333333') {
  return `url("data:image/svg+xml,%3Csvg width='${gridSize}' height='${gridSize}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M ${gridSize} 0 L 0 0 0 ${gridSize}' fill='none' stroke='${color}' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E")`;
}

/**
 * Calculate canvas bounds
 * @param {Array} nodes - All nodes on canvas
 * @returns {Object} - Canvas bounds {minX, minY, maxX, maxY, width, height}
 */
export function calculateCanvasBounds(nodes) {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  const bounds = nodes.reduce((acc, node) => {
    return {
      minX: Math.min(acc.minX, node.position.x),
      minY: Math.min(acc.minY, node.position.y),
      maxX: Math.max(acc.maxX, node.position.x + (node.width || 200)),
      maxY: Math.max(acc.maxY, node.position.y + (node.height || 100)),
    };
  }, {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  });

  return {
    ...bounds,
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
  };
}

/**
 * Center viewport on specific position
 * @param {Object} currentViewport - Current viewport
 * @param {Object} targetPosition - Target position to center on
 * @param {Object} containerSize - Container dimensions
 * @returns {Object} - New viewport
 */
export function centerViewportOnPosition(currentViewport, targetPosition, containerSize) {
  return {
    x: targetPosition.x - containerSize.width / (2 * currentViewport.zoom),
    y: targetPosition.y - containerSize.height / (2 * currentViewport.zoom),
    zoom: currentViewport.zoom,
  };
}

/**
 * Calculate optimal zoom level to fit content
 * @param {Object} bounds - Canvas bounds
 * @param {Object} containerSize - Container dimensions
 * @returns {number} - Optimal zoom level
 */
export function calculateOptimalZoom(bounds, containerSize) {
  const widthRatio = containerSize.width / bounds.width;
  const heightRatio = containerSize.height / bounds.height;
  const optimalZoom = Math.min(widthRatio, heightRatio, 1); // Don't zoom in beyond 1:1
  return Math.max(optimalZoom, 0.1); // Minimum zoom level
}

/**
 * Canvas performance metrics
 * @param {Array} nodes - All nodes
 * @param {Array} edges - All edges
 * @returns {Object} - Performance metrics
 */
export function getCanvasPerformanceMetrics(nodes, edges) {
  return {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    memoryEstimate: nodes.length * 100 + edges.length * 50, // KB estimate
    complexityScore: (nodes.length + edges.length * 0.5) / 10,
  };
}

function sanitizeScreenshotFileName(fileName) {
  if (!fileName || typeof fileName !== 'string') return 'workflow-screenshot.png';
  const cleaned = fileName.replace(/[<>:"/\\|?*]/g, '-').trim();
  return cleaned.endsWith('.png') ? cleaned : `${cleaned || 'workflow-screenshot'}.png`;
}

function resolveCanvasViewportElement(reactFlowWrapper) {
  const wrapper = reactFlowWrapper?.current ?? reactFlowWrapper;
  if (!wrapper || typeof wrapper.querySelector !== 'function') return null;
  return wrapper.querySelector('.react-flow__viewport');
}

async function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to convert screenshot blob to data URL.'));
    reader.readAsDataURL(blob);
  });
}

async function resizeBlobToMaxDimensions(blob, maxWidth, maxHeight) {
  if (!maxWidth || !maxHeight) return blob;

  const sourceUrl = URL.createObjectURL(blob);
  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to decode screenshot image.'));
      img.src = sourceUrl;
    });

    const width = image.width || 0;
    const height = image.height || 0;
    if (!width || !height) return blob;

    const ratio = Math.min(1, maxWidth / width, maxHeight / height);
    if (ratio >= 1) return blob;

    const targetWidth = Math.max(1, Math.round(width * ratio));
    const targetHeight = Math.max(1, Math.round(height * ratio));
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext('2d');
    if (!context) return blob;

    context.drawImage(image, 0, 0, targetWidth, targetHeight);
    const resizedBlob = await new Promise((resolve) => {
      canvas.toBlob((output) => resolve(output || blob), 'image/png');
    });
    return resizedBlob || blob;
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

export function downloadBlobAsFile(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = sanitizeScreenshotFileName(fileName);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function exportCanvasViewportToPng({
  reactFlowWrapper,
  fileName = 'workflow-screenshot.png',
  backgroundColor = '#1a1a1a',
  pixelRatio = Math.max(window.devicePixelRatio || 1, 2),
} = {}) {
  const viewportElement = resolveCanvasViewportElement(reactFlowWrapper);
  if (!viewportElement) {
    throw new Error('Canvas viewport not found for screenshot export.');
  }

  const blob = await domtoimage.toBlob(viewportElement, {
    bgcolor: backgroundColor,
    cacheBust: true,
    pixelRatio,
  });

  downloadBlobAsFile(blob, fileName);
}

export async function captureCanvasViewportPngDataUrl({
  reactFlowWrapper,
  backgroundColor = '#1a1a1a',
  pixelRatio = Math.max(window.devicePixelRatio || 1, 2),
  maxWidth = 1600,
  maxHeight = 900,
} = {}) {
  const viewportElement = resolveCanvasViewportElement(reactFlowWrapper);
  if (!viewportElement) {
    throw new Error('Canvas viewport not found for screenshot capture.');
  }

  const sourceBlob = await domtoimage.toBlob(viewportElement, {
    bgcolor: backgroundColor,
    cacheBust: true,
    pixelRatio,
  });

  const resizedBlob = await resizeBlobToMaxDimensions(sourceBlob, maxWidth, maxHeight);
  return blobToDataUrl(resizedBlob);
}
