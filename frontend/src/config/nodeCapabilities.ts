import { NodeCapability, NodeCapabilities } from '../nodes/nodeCapabilities';

export const NODE_TYPE_CAPABILITIES: Record<string, NodeCapability[]> = {
  // Input/Output
  input: [NodeCapabilities.INPUT_MEDIA],
  textNode: [NodeCapabilities.INPUT_MEDIA],
  imageNode: [NodeCapabilities.INPUT_MEDIA],
  assetNode: [NodeCapabilities.INPUT_MEDIA],
  sourceMediaNode: [NodeCapabilities.INPUT_MEDIA],
  imageOutput: [NodeCapabilities.OUTPUT_IMAGE],
  videoOutput: [NodeCapabilities.OUTPUT_VIDEO],
  soundOutput: [NodeCapabilities.OUTPUT_AUDIO],
  
  // Image Generation
  generator: [NodeCapabilities.IMAGE_GENERATE],
  universalGeneratorImage: [
    NodeCapabilities.IMAGE_GENERATE,
    NodeCapabilities.IMAGE_EDIT,
    NodeCapabilities.IMAGE_UPSCALE,
    NodeCapabilities.IMAGE_EXPAND,
    NodeCapabilities.IMAGE_VECTORIZE,
    NodeCapabilities.IMAGE_ANALYZE,
    NodeCapabilities.IMAGE_CLASSIFY
  ],
  textToIcon: [NodeCapabilities.IMAGE_GENERATE],
  tripo3d: [NodeCapabilities.IMAGE_GENERATE], // Generates 3D assets/images
  quiverImageToVector: [NodeCapabilities.IMAGE_VECTORIZE],
  
  // Image Editing
  creativeUpscale: [NodeCapabilities.IMAGE_UPSCALE],
  precisionUpscale: [NodeCapabilities.IMAGE_UPSCALE],
  relight: [NodeCapabilities.IMAGE_EDIT],
  styleTransfer: [NodeCapabilities.IMAGE_EDIT],
  removeBackground: [NodeCapabilities.IMAGE_EDIT],
  fluxImageExpand: [NodeCapabilities.IMAGE_EXPAND],
  seedreamExpand: [NodeCapabilities.IMAGE_EXPAND],
  ideogramExpand: [NodeCapabilities.IMAGE_EXPAND],
  skinEnhancer: [NodeCapabilities.IMAGE_EDIT],
  
  // Video
  universalGeneratorVideo: [
    NodeCapabilities.VIDEO_GENERATE,
    NodeCapabilities.VIDEO_EDIT,
    NodeCapabilities.VIDEO_UPSCALE
  ],
  kling3: [NodeCapabilities.VIDEO_GENERATE],
  kling3Omni: [NodeCapabilities.VIDEO_GENERATE],
  kling3Motion: [NodeCapabilities.VIDEO_MOTION_CONTROL],
  creativeVideoUpscale: [NodeCapabilities.VIDEO_UPSCALE],
  precisionVideoUpscale: [NodeCapabilities.VIDEO_UPSCALE],
  vfx: [NodeCapabilities.VIDEO_EDIT],
  pixVerseSoundEffect: [NodeCapabilities.VIDEO_EDIT, NodeCapabilities.AUDIO_GENERATE],
  
  // Audio
  musicGeneration: [NodeCapabilities.AUDIO_GENERATE],
  soundEffects: [NodeCapabilities.AUDIO_GENERATE],
  audioIsolation: [NodeCapabilities.AUDIO_ISOLATE],
  voiceover: [NodeCapabilities.AUDIO_VOICEOVER],
  
  // Utility
  improvePrompt: [NodeCapabilities.TEXT_IMPROVE],
  imageToPrompt: [NodeCapabilities.IMAGE_ANALYZE],
  aiImageClassifier: [NodeCapabilities.IMAGE_CLASSIFY],
  imageAnalyzer: [NodeCapabilities.IMAGE_ANALYZE],
  routerNode: [NodeCapabilities.UTILITY_ROUTER],
  comment: [NodeCapabilities.UTILITY_COMMENT],
  layerEditor: [NodeCapabilities.IMAGE_EDIT],
};

/**
 * Gets the capabilities for a given node type.
 * @param type - The React Flow node type.
 * @returns Array of capability strings.
 */
export function getCapabilitiesForType(type: string): NodeCapability[] {
  return NODE_TYPE_CAPABILITIES[type] || [];
}

/**
 * Gets all node types that have a specific capability.
 * @param capability - The capability to search for.
 * @returns Array of node type strings.
 */
export function getNodeTypesForCapability(capability: NodeCapability): string[] {
  return Object.entries(NODE_TYPE_CAPABILITIES)
    .filter(([_, capabilities]) => capabilities.includes(capability))
    .map(([type, _]) => type);
}
