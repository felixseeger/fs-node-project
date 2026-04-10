export const HANDLE_COLORS = {
  image: '#ec4899',
  video: '#14b8a6',
  text: '#f97316',
  audio: '#a855f7', // Purple for audio
  aspect_ratio: '#f59e0b',
  resolution: '#22c55e',
  num_images: '#8b5cf6',
  any: '#8b5cf6',
  easeCurve: '#bef264', // lime-300 for ease curve
  '3d': '#0ea5e9', // sky-500 for 3D
};

/**
 * Get the data type of a handle based on its ID
 * Supports dynamic handle patterns and indexed handles
 */
export function getHandleDataType(handleId) {
  if (!handleId) return 'any';

  // Generic Router handles — return 'any' to allow any type connection
  if (handleId === 'generic-input' || handleId === 'generic-output') return 'any';

  // EaseCurve handles (must check before other types)
  if (handleId === 'easeCurve') return 'easeCurve';

  // 3D handles
  if (handleId === '3d' || handleId === 'model-out') return '3d';

  // Standard image handles
  const imageIds = ['output', 'image-in', 'images-in', 'image_urls', 'image', 'image-out'];
  if (imageIds.includes(handleId)) return 'image';

  // Standard video handles
  const videoIds = ['video-out', 'output-video'];
  if (videoIds.includes(handleId)) return 'video';

  // Standard audio handles
  const audioIds = ['output-audio', 'audio-in', 'audio'];
  if (audioIds.includes(handleId)) return 'audio';

  // Text handles - check various patterns
  if (
    handleId.includes('prompt') ||
    handleId.includes('analysis') ||
    handleId.includes('text') ||
    handleId.includes('system') ||
    handleId.includes('adapted')
  ) {
    return 'text';
  }

  // Aspect ratio handles
  if (handleId.includes('aspect')) return 'aspect_ratio';

  // Resolution handles
  if (handleId.includes('resolution')) return 'resolution';

  // Number of images handles
  if (handleId.includes('num_images') || handleId.includes('num-images')) return 'num_images';

  // Dynamic indexed handles (e.g., text-0, image-1, video-2)
  if (handleId.includes('-')) {
    const [baseType, index] = handleId.split('-');
    if (baseType === 'text') return 'text';
    if (baseType === 'image') return 'image';
    if (baseType === 'video') return 'video';
    if (baseType === 'audio') return 'audio';
  }

  return 'any';
}

export function getHandleColor(handleId) {
  const type = getHandleDataType(handleId);
  return HANDLE_COLORS[type] || HANDLE_COLORS.any;
}

/**
 * Define which handles each node type has
 * Used for connection validation and smart node insertion
 */
export function getNodeHandles(nodeType) {
  switch (nodeType) {
    case 'imageInput':
      return { inputs: ['reference'], outputs: ['image'] };
    case 'audioInput':
      return { inputs: ['audio'], outputs: ['audio'] };
    case 'videoInput':
      return { inputs: ['video'], outputs: ['video'] };
    case 'annotation':
      return { inputs: ['image'], outputs: ['image'] };
    case 'prompt':
      return { inputs: ['text'], outputs: ['text'] };
    case 'array':
      return { inputs: ['text'], outputs: ['text'] };
    case 'promptConstructor':
      return { inputs: ['text'], outputs: ['text'] };
    case 'nanoBanana':
      return { inputs: ['image', 'text'], outputs: ['image'] };
    case 'generateVideo':
      return { inputs: ['image', 'text', 'audio'], outputs: ['video'] };
    case 'generate3d':
      return { inputs: ['image', 'text'], outputs: ['3d'] };
    case 'generateAudio':
      return { inputs: ['text'], outputs: ['audio'] };
    case 'llmGenerate':
      return { inputs: ['text', 'image'], outputs: ['text'] };
    case 'splitGrid':
      return { inputs: ['image'], outputs: ['reference'] };
    case 'output':
      return { inputs: ['image', 'video', 'audio'], outputs: [] };
    case 'outputGallery':
      return { inputs: ['image'], outputs: [] };
    case 'imageCompare':
      return { inputs: ['image'], outputs: [] };
    case 'videoStitch':
      return { inputs: ['video', 'audio'], outputs: ['video'] };
    case 'easeCurve':
      return { inputs: ['video', 'easeCurve'], outputs: ['video', 'easeCurve'] };
    case 'videoTrim':
      return { inputs: ['video'], outputs: ['video'] };
    case 'videoFrameGrab':
      return { inputs: ['video'], outputs: ['image'] };
    case 'router':
      return { 
        inputs: ['image', 'text', 'video', 'audio', '3d', 'easeCurve', 'generic-input'],
        outputs: ['image', 'text', 'video', 'audio', '3d', 'easeCurve', 'generic-output']
      };
    case 'switch':
      // Switch has one input handle (generic-input when disconnected, typed when connected)
      // Output handles are dynamic based on switches array, all matching inputType
      return { inputs: ['generic-input'], outputs: [] }; // Outputs handled dynamically
    case 'conditionalSwitch':
      // Conditional Switch has one text input and dynamic rule outputs + default
      return { inputs: ['text'], outputs: [] }; // Outputs handled dynamically
    case 'glbViewer':
      return { inputs: ['3d'], outputs: ['image'] };
    case 'adaptedPrompt':
      return { inputs: ['text'], outputs: ['text'] };
    case 'autoPrompt':
      return { inputs: ['text'], outputs: ['text'] };
    case 'creativeUpScale':
      return { inputs: ['image'], outputs: ['image'] };
    case 'precisionUpScale':
      return { inputs: ['image'], outputs: ['image'] };
    case 'fluxReimagine':
      return { inputs: ['image', 'text'], outputs: ['image'] };
    case 'fluxImageExpand':
      return { inputs: ['image', 'text'], outputs: ['image'] };
    case 'ideogramExpand':
      return { inputs: ['image', 'text'], outputs: ['image'] };
    case 'ideogramInpaint':
      return { inputs: ['image', 'text'], outputs: ['image'] };
    case 'changeCamera':
      return { inputs: ['image'], outputs: ['image'] };
    case 'facialEditing':
      return { inputs: ['image'], outputs: ['image'] };
    case 'audioIsolation':
      return { inputs: ['audio'], outputs: ['audio'] };
    case 'aIImageClassifier':
      return { inputs: ['image'], outputs: ['text'] };
    case 'groupEditing':
      return { inputs: ['image'], outputs: ['image'] };
    case 'asset':
      return { inputs: [], outputs: ['image'] };
    default:
      return { inputs: [], outputs: [] };
  }
}

/**
 * Enhanced connection validation with support for all node types
 * and special handling for Router, Switch, and ConditionalSwitch nodes
 */
export function isValidConnection(connection, nodes = []) {
  // Prevent self-connections
  if (connection.source === connection.target) return false;

  const sourceType = getHandleDataType(connection.sourceHandle);
  const targetType = getHandleDataType(connection.targetHandle);

  // Get source and target nodes for special validation
  const sourceNode = nodes.find((n) => n.id === connection.source);
  const targetNode = nodes.find((n) => n.id === connection.target);

  // Switch input: accept any type (generic-input handle)
  if (targetNode?.type === 'switch' && connection.targetHandle === 'generic-input') {
    return true;
  }

  // Switch output: the type is determined by inputType stored in node data
  if (sourceNode?.type === 'switch') {
    const switchData = sourceNode.data;
    if (switchData.inputType && targetType) {
      return switchData.inputType === targetType;
    }
    // If inputType not set yet, allow connection (will be resolved)
    return true;
  }

  // Conditional Switch: text input only, text outputs only
  if (targetNode?.type === 'conditionalSwitch') {
    return sourceType === 'text';
  }
  if (sourceNode?.type === 'conditionalSwitch') {
    return targetType === 'text';
  }

  // If we can't determine types, allow the connection
  if (!sourceType || !targetType) return true;

  // EaseCurve connections: only between easeCurve nodes (or router)
  if (sourceType === 'easeCurve' || targetType === 'easeCurve') {
    if (targetNode?.type === 'router' || sourceNode?.type === 'router') return true;
    if (sourceType !== 'easeCurve' || targetType !== 'easeCurve') return false;
    return targetNode?.type === 'easeCurve';
  }

  // Video connections have special rules
  if (sourceType === 'video') {
    // Video source can ONLY connect to specific node types
    const validVideoTargets = ['generateVideo', 'videoStitch', 'easeCurve', 'videoTrim', 'videoFrameGrab', 'videoInput', 'output', 'router'];
    if (!targetNode || !validVideoTargets.includes(targetNode.type)) return false;
    return true;
  }

  // 3D connections: 3d handles can only connect to matching 3d handles (or router)
  if (sourceType === '3d' || targetType === '3d') {
    // Allow 3d connections to router nodes
    if (sourceNode?.type === 'router' || targetNode?.type === 'router') return true;
    return sourceType === '3d' && targetType === '3d';
  }

  // Audio connections: audio handles connect to audio handles, plus output node (or router)
  if (sourceType === 'audio' || targetType === 'audio') {
    if (sourceType === 'audio') {
      if (targetNode?.type === 'output' || targetNode?.type === 'router') return true;
    }
    return sourceType === 'audio' && targetType === 'audio';
  }

  // Standard type matching for image and text
  // Image handles connect to image handles, text handles connect to text handles
  return sourceType === targetType;
}

/**
 * Find a compatible handle on a node by type
 * Used for smart connection drop menu
 */
export function findCompatibleHandle(node, handleType, needInput, batchUsed = new Set()) {
  // Check for dynamic inputSchema first
  const nodeData = node.data;
  if (nodeData.inputSchema && nodeData.inputSchema.length > 0) {
    if (needInput) {
      // Find input handles matching the type
      const matchingInputs = nodeData.inputSchema.filter(i => i.type === handleType);
      const numHandles = matchingInputs.length;
      if (numHandles > 0) {
        // Find the first unoccupied indexed handle
        for (let i = 0; i < numHandles; i++) {
          const candidateHandle = `${handleType}-${i}`;
          const isOccupied = batchUsed.has(candidateHandle);
          if (!isOccupied) {
            return candidateHandle;
          }
        }
      }
    }
    // Output handle - check for video, 3d, or image type
    if (handleType === 'video') return 'video';
    if (handleType === '3d') return '3d';
    return handleType === 'image' ? 'image' : null;
  }

  // VideoStitch has dynamic indexed video input handles (video-0, video-1, ...)
  if (node.type === 'videoStitch' && needInput && handleType === 'video') {
    for (let i = 0; i < 50; i++) {
      const candidateHandle = `video-${i}`;
      const isOccupied = batchUsed.has(candidateHandle);
      if (!isOccupied) return candidateHandle;
    }
    return null;
  }

  // Router accepts any type — use typed handle if exists, otherwise generic
  if (node.type === 'router' && needInput) {
    return handleType;
  }
  if (node.type === 'router' && !needInput) {
    return handleType;
  }

  // Switch accepts any type on input, outputs match inputType
  if (node.type === 'switch' && needInput) {
    return 'generic-input';
  }
  if (node.type === 'switch' && !needInput) {
    const switchData = node.data;
    // Return first enabled switch output handle ID
    if (switchData.switches && switchData.switches.length > 0) {
      const firstEnabled = switchData.switches.find(s => s.enabled);
      if (firstEnabled) return firstEnabled.id;
    }
    return null;
  }

  // Conditional Switch: text input, dynamic rule outputs
  if (node.type === 'conditionalSwitch' && handleType === 'text') {
    if (needInput) {
      return 'text';
    } else {
      // Return first rule ID from node data
      const condData = node.data;
      if (condData.rules && condData.rules.length > 0) {
        return condData.rules[0].id;
      }
      return 'default';
    }
  }

  // Fall back to static handles
  const staticHandles = getNodeHandles(node.type || '');
  const handleList = needInput ? staticHandles.inputs : staticHandles.outputs;

  // First try exact match
  if (handleList.includes(handleType)) return handleType;

  // For video output connecting to output node, allow "image" input
  if (handleType === 'video' && needInput && node.type === 'output') {
    return 'image';
  }

  // For audio output connecting to output node, use the "audio" input handle
  if (handleType === 'audio' && needInput && node.type === 'output') {
    return 'audio';
  }

  // Then check each handle's type
  for (const h of handleList) {
    if (getHandleDataType(h) === handleType) return h;
  }

  return null;
}
