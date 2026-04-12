/**
 * Standard capability strings for the node system.
 * Use these to define what a node can do in its `capabilities` array.
 */

export const NodeCapabilities = {
  // Image
  IMAGE_GENERATE: 'image:generate',
  IMAGE_EDIT: 'image:edit',
  IMAGE_UPSCALE: 'image:upscale',
  IMAGE_CLASSIFY: 'image:classify',
  IMAGE_ANALYZE: 'image:analyze',
  IMAGE_EXPAND: 'image:expand',
  IMAGE_INPAINT: 'image:inpaint',
  IMAGE_VECTORIZE: 'image:vectorize',
  
  // Video
  VIDEO_GENERATE: 'video:generate',
  VIDEO_EDIT: 'video:edit',
  VIDEO_UPSCALE: 'video:upscale',
  VIDEO_MOTION_CONTROL: 'video:motion-control',
  
  // Audio
  AUDIO_ISOLATE: 'audio:isolate',
  AUDIO_GENERATE: 'audio:generate',
  AUDIO_VOICEOVER: 'audio:voiceover',
  
  // Text
  TEXT_GENERATE: 'text:generate',
  TEXT_IMPROVE: 'text:improve',
  TEXT_TRANSLATE: 'text:translate',
  
  // Vision
  VISION_ANALYSIS: 'vision:analysis',
  
  // Utility
  UTILITY_ROUTER: 'utility:router',
  UTILITY_COMMENT: 'utility:comment',
  
  // Input/Output
  INPUT_MEDIA: 'input:media',
  OUTPUT_IMAGE: 'output:image',
  OUTPUT_VIDEO: 'output:video',
  OUTPUT_AUDIO: 'output:audio',
} as const;

export type NodeCapability = typeof NodeCapabilities[keyof typeof NodeCapabilities];
