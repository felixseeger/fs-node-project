/**
 * Node Menu Configuration
 * Defines all available node types organized by category
 */
import type { NodeMenuSection } from '../types';

export const NODE_MENU: NodeMenuSection[] = [
  {
    section: 'Inputs',
    items: [
      { type: 'textNode', label: 'Text', defaults: { label: 'Text', text: '' } },
      { type: 'imageNode', label: 'Image', defaults: { label: 'Image', images: [] } },
      { type: 'assetNode', label: 'Asset', defaults: { label: 'Asset', images: [] } },
      { type: 'sourceMediaNode', label: 'Source Media Upload', defaults: { label: 'Source Media', mediaFiles: [] } },
    ],
  },
  {
    section: 'LLMs',
    items: [
      {
        type: 'imageAnalyzer',
        label: 'Gemini 3 Pro',
        defaults: { label: 'Gemini 3 Pro', systemDirections: '', localPrompt: '', analysisResult: '', localImages: [] },
      },
      {
        type: 'imageToPrompt',
        label: 'Image to Prompt',
        defaults: {
          label: 'Image to Prompt',
          inputImagePreview: null, outputPrompt: null, isLoading: false,
        },
      },
      {
        type: 'improvePrompt',
        label: 'Improve Prompt',
        defaults: {
          label: 'Improve Prompt',
          inputPrompt: '', outputPrompt: null, isLoading: false,
          localType: 'image', localLanguage: 'en',
        },
      },
      {
        type: 'aiImageClassifier',
        label: 'AI Image Classifier',
        defaults: {
          label: 'AI Image Classifier',
          inputImagePreview: null, outputText: null, rawResult: null, isLoading: false,
        },
      },
    ],
  },
  {
    section: 'Image Generation',
    items: [
      {
        type: 'universalGeneratorImage',
        label: 'Universal Image',
        defaults: {
          label: 'Universal Image',
          inputPrompt: '', outputImage: null, isLoading: false,
          models: ['Nano Banana 2'], aspectRatio: '1:1', imageSizeTier: '1K', numOutputs: 1,
          editSettings: {},
          autoSelect: false,
          useMultiple: false,
        },
      },
      {
        type: 'tripo3d',
        label: 'Tripo3D',
        defaults: {
          label: 'Tripo3D',
          localPrompt: '',
          localNegativePrompt: '',
          outputModelUrl: null,
          outputPreviewImage: null,
          isLoading: false,
        },
      },
      {
        type: 'quiverImageToVector',
        label: 'Quiver Image to Vector',
        defaults: {
          label: 'Quiver Image to Vector',
          outputImage: null, isLoading: false,
        },
      },
    ],
  },
  {
    section: 'Video Generation',
    items: [
      {
        type: 'universalGeneratorVideo',
        label: 'Universal Video',
        defaults: {
          label: 'Universal Video',
          inputPrompt: '', outputVideo: null, isLoading: false,
          models: ['kling3'], aspectRatio: '16:9', numOutputs: 1,
          autoSelect: false,
          useMultiple: false,
        },
      },
    ],
  },
  {
    section: 'Video Editing',
    items: [
      {
        type: 'vfx',
        label: 'Video FX',
        defaults: {
          label: 'Video FX',
          outputVideo: null, isLoading: false,
          localFilterType: 1, localFps: 24, localBloomContrast: 50, localMotionKernelSize: 5, localMotionDecayFactor: 0.5,
        },
      },
      {
        type: 'creativeVideoUpscale',
        label: 'Creative Video Upscale',
        defaults: {
          label: 'Creative Video Upscale',
          outputVideo: null, isLoading: false,
          localMode: 'standard', localResolution: '2k', localFlavor: 'vivid', localCreativity: 0,
          localSharpen: 0, localSmartGrain: 0, localFpsBoost: false,
        },
      },
      {
        type: 'precisionVideoUpscale',
        label: 'Precision Video Upscale',
        defaults: {
          label: 'Precision Video Upscale',
          outputVideo: null, isLoading: false,
          localResolution: '2k', localStrength: 60,
          localSharpen: 0, localSmartGrain: 0, localFpsBoost: false,
        },
      },
      {
        type: 'pixVerseSoundEffect',
        label: 'PixVerse Sound Effect',
        defaults: {
          label: 'PixVerse Sound Effect',
          outputVideo: null, isLoading: false,
          localVideoUrl: '', localOriginalSoundSwitch: false, localSoundContent: '',
        },
      },
    ],
  },
  {
    section: 'Audio Generation',
    items: [
      {
        type: 'musicGeneration',
        label: 'ElevenLabs Music',
        defaults: {
          label: 'ElevenLabs Music',
          inputPrompt: '', outputAudio: null, isLoading: false,
          localDuration: 30,
        },
      },
      {
        type: 'soundEffects',
        label: 'ElevenLabs Sound Effects',
        defaults: {
          label: 'ElevenLabs Sound Effects',
          inputPrompt: '', outputAudio: null, isLoading: false,
          localDuration: 5, localLoop: false, localPromptInfluence: 0.3,
        },
      },
      {
        type: 'audioIsolation',
        label: 'SAM Audio Isolation',
        defaults: {
          label: 'SAM Audio Isolation',
          inputPrompt: '', localAudio: '', localVideo: '', outputAudio: null, isLoading: false,
          localInputType: 'audio', localRerankingCandidates: 1, localPredictSpans: false,
          localSampleFps: 2, localX1: 0, localY1: 0, localX2: 0, localY2: 0,
        },
      },
      {
        type: 'voiceover',
        label: 'ElevenLabs Voiceover',
        defaults: {
          label: 'ElevenLabs Voiceover',
          inputPrompt: '', outputAudio: null, isLoading: false,
          localVoiceId: '21m00Tcm4TlvDq8ikWAM', localStability: 0.5, localSimilarityBoost: 0.2,
          localSpeed: 1.0, localUseSpeakerBoost: true,
        },
      },
    ],
  },
  {
    section: 'Logic & Flow',
    items: [
      {
        type: 'condition',
        label: 'Condition',
        defaults: { label: 'Condition', operator: 'contains', conditionValue: '' },
      },
      {
        type: 'iteration',
        label: 'Iteration',
        defaults: { label: 'Iteration', maxIterations: 10 },
      },
      {
        type: 'variable',
        label: 'Variable',
        defaults: { label: 'Variable', varName: 'my_var', varValue: '' },
      },
    ],
  },
  {
    section: 'Social & Integrations',
    items: [
      {
        type: 'socialPublisher',
        label: 'Social Publisher',
        defaults: { label: 'Social Publisher', platform: 'x', caption: '' },
      },
      {
        type: 'cloudSync',
        label: 'Cloud Sync',
        defaults: { label: 'Cloud Sync', provider: 'gdrive', folderPath: '/outputs' },
      },
    ],
  },
  {
    section: 'Utilities',
    items: [
      {
        type: 'layerEditor',
        label: 'Layer Editor',
        defaults: { label: 'Layer Editor', outputImage: null },
      },
      {
        type: 'routerNode',
        label: 'Router',
        defaults: { label: 'Router', outputs: [{ id: 'out-1', label: 'Output 1' }, { id: 'out-2', label: 'Output 2' }] },
      },
      {
        type: 'comment',
        label: 'Comment',
        defaults: { label: 'Comment', text: '', isDone: false },
      },
    ],
  },
];

/**
 * Get default data for a node type
 */
export function getNodeDefaults(type: string): Record<string, unknown> | null {
  for (const section of NODE_MENU) {
    const item = section.items.find(i => i.type === type);
    if (item) return item.defaults as Record<string, unknown>;
  }
  return null;
}

/**
 * Default nodes for a new workflow
 */
export const DEFAULT_NODES: any[] = [];

export default NODE_MENU;
export const DEFAULT_EDGES = [];
