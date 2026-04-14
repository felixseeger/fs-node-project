/**
 * Standard capability strings for the node system.
 * These are used by the AI to understand what each node can do.
 */

export const NodeCapabilities = {
  // Input/Output
  INPUT_MEDIA: 'input:media',
  OUTPUT_IMAGE: 'output:image',
  OUTPUT_VIDEO: 'output:video',
  OUTPUT_AUDIO: 'output:audio',

  // Vision
  IMAGE_ANALYSIS: 'image:analysis',
  IMAGE_ANALYZE: 'image:analysis', // Alias
  IMAGE_TO_PROMPT: 'image:to_prompt',
  PROMPT_IMPROVEMENT: 'prompt:improvement',
  TEXT_IMPROVE: 'prompt:improvement', // Alias
  IMAGE_CLASSIFICATION: 'image:classification',
  IMAGE_CLASSIFY: 'image:classification', // Alias

  // Image Generation
  IMAGE_GENERATE: 'image:generate',
  IMAGE_REIMAGINE: 'image:reimagine',
  ICON_GENERATE: 'image:icon',
  MODEL_3D_GENERATE: 'model3d:generate',

  // Image Editing
  IMAGE_EDIT: 'image:edit',
  IMAGE_UPSCALE: 'image:upscale',
  IMAGE_UPSCALE_CREATIVE: 'image:upscale:creative',
  IMAGE_UPSCALE_PRECISION: 'image:upscale:precision',
  IMAGE_RELIGHT: 'image:relight',
  IMAGE_REMOVE_BACKGROUND: 'image:remove_background',
  IMAGE_STYLE_TRANSFER: 'image:style_transfer',
  IMAGE_EXPAND: 'image:expand',
  IMAGE_INPAINT: 'image:inpaint',
  IMAGE_SKIN_ENHANCE: 'image:skin_enhance',
  IMAGE_CHANGE_CAMERA: 'image:change_camera',
  IMAGE_VECTORIZE: 'image:vectorize',

  // Video Generation
  VIDEO_GENERATE: 'video:generate',
  VIDEO_GENERATE_OMNI: 'video:generate:omni',
  VIDEO_GENERATE_MOTION: 'video:generate:motion',
  VIDEO_GENERATE_ELEMENTS: 'video:generate:elements',
  VIDEO_GENERATE_O1: 'video:generate:o1',
  VIDEO_GENERATE_LIVE: 'video:generate:live',
  VIDEO_GENERATE_TRANSITION: 'video:generate:transition',
  VIDEO_GENERATE_HUMAN: 'video:generate:human',

  // Video Editing
  VIDEO_EDIT: 'video:edit',
  VIDEO_VFX: 'video:vfx',
  VIDEO_UPSCALE: 'video:upscale',
  VIDEO_UPSCALE_CREATIVE: 'video:upscale:creative',
  VIDEO_UPSCALE_PRECISION: 'video:upscale:precision',
  VIDEO_MOTION_CONTROL: 'video:motion_control',

  // Audio Generation
  AUDIO_GENERATE: 'audio:generate',
  AUDIO_MUSIC_GENERATE: 'audio:music_generate',
  AUDIO_SFX_GENERATE: 'audio:sfx_generate',
  AUDIO_ISOLATION: 'audio:isolation',
  AUDIO_ISOLATE: 'audio:isolation', // Alias
  AUDIO_VOICEOVER: 'audio:voiceover',
  VOICE_INPUT: 'audio:voice_input',

  // Utility
  SOCIAL_PUBLISH: 'utility:social_publish',
  CLOUD_SYNC: 'utility:cloud_sync',
  UTILITY_ROUTER: 'utility:router',
  UTILITY_COMMENT: 'utility:comment',
} as const;

export type NodeCapability = typeof NodeCapabilities[keyof typeof NodeCapabilities];
