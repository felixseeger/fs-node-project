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
    ],
  },
  {
    section: 'LLMs',
    items: [
      {
        type: 'imageAnalyzer',
        label: 'Claude Sonnet Vision',
        defaults: { label: 'Claude Sonnet Vision', systemDirections: '', localPrompt: '', analysisResult: '', localImages: [] },
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
        type: 'generator',
        label: 'Nano Banana 2 Edit',
        defaults: { label: 'Nano Banana 2 Edit', inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false },
      },
      {
        type: 'generator',
        label: 'Kora Reality',
        defaults: {
          label: 'Kora Reality', generatorType: 'kora',
          inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false,
        },
      },
      {
        type: 'fluxReimagine',
        label: 'Flux Reimagine',
        defaults: {
          label: 'Flux Reimagine',
          inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false,
          localImagination: 'vivid', localAspect: 'original',
        },
      },
      {
        type: 'textToIcon',
        label: 'AI Icon Generation',
        defaults: {
          label: 'AI Icon Generation',
          inputPrompt: '', outputImage: null, isLoading: false,
          localStyle: 'solid', localFormat: 'png', localNumInferenceSteps: 10, localGuidanceScale: 7,
        },
      },
    ],
  },
  {
    section: 'Image Editing',
    items: [
      {
        type: 'changeCamera',
        label: 'Change Camera',
        defaults: {
          label: 'Change Camera',
          inputImagePreview: null, outputImage: null, isLoading: false,
          localHorizontalAngle: 0, localVerticalAngle: 0, localZoom: 5, localSeed: '',
        },
      },
      {
        type: 'creativeUpscale',
        label: 'Creative Upscale',
        defaults: {
          label: 'Creative Upscale',
          inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false,
          localScaleFactor: '2x', localOptimizedFor: 'standard', localEngine: 'automatic',
          localCreativity: 0, localHdr: 0, localResemblance: 0, localFractality: 0,
        },
      },
      {
        type: 'fluxImageExpand',
        label: 'Flux Image Expand',
        defaults: {
          label: 'Flux Image Expand',
          inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false,
          localLeft: 0, localRight: 0, localTop: 0, localBottom: 0,
        },
      },
      {
        type: 'ideogramExpand',
        label: 'Ideogram Expand',
        defaults: {
          label: 'Ideogram Expand',
          inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false,
          localLeft: 0, localRight: 0, localTop: 0, localBottom: 0, localSeed: '',
        },
      },
      {
        type: 'ideogramInpaint',
        label: 'Ideogram Inpaint',
        defaults: {
          label: 'Ideogram Inpaint',
          inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false,
          localRenderingSpeed: 'DEFAULT', localMagicPrompt: '', localStyleType: '',
          localColorPalette: '', localSeed: '',
        },
      },
      {
        type: 'precisionUpscale',
        label: 'Precision Upscale',
        defaults: {
          label: 'Precision Upscale',
          inputImagePreview: null, outputImage: null, isLoading: false,
          localScaleFactor: '4', localFlavor: '', localSharpen: 7, localSmartGrain: 7, localUltraDetail: 30,
        },
      },
      {
        type: 'relight',
        label: 'Relight',
        defaults: {
          label: 'Relight',
          inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false,
          localLightMode: 'prompt', localStrength: 100, localInterpolate: false,
          localChangeBg: true, localStyle: 'standard', localPreserveDetails: true,
          localWhites: 50, localBlacks: 50, localBrightness: 50, localContrast: 50,
          localSaturation: 50, localEngine: 'automatic', localTransferA: 'automatic',
          localTransferB: 'automatic', localFixedGen: false,
        },
      },
      {
        type: 'removeBackground',
        label: 'Remove Background',
        defaults: {
          label: 'Remove Background',
          inputImagePreview: null, outputImage: null, isLoading: false,
          outputHighRes: null, outputPreview: null, outputUrl: null, originalUrl: null,
        },
      },
      {
        type: 'seedreamExpand',
        label: 'Seedream Expand',
        defaults: {
          label: 'Seedream Expand',
          inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false,
          localLeft: 0, localRight: 0, localTop: 0, localBottom: 0, localSeed: '',
        },
      },
      {
        type: 'skinEnhancer',
        label: 'Skin Enhancer',
        defaults: {
          label: 'Skin Enhancer',
          inputImagePreview: null, outputImage: null, isLoading: false,
          localMode: 'faithful', localSharpen: 0, localSmartGrain: 2,
          localSkinDetail: 80, localOptimizedFor: 'enhance_skin',
        },
      },
      {
        type: 'styleTransfer',
        label: 'Style Transfer',
        defaults: {
          label: 'Style Transfer',
          inputImagePreview: null, referenceImagePreview: null, inputPrompt: '',
          outputImage: null, isLoading: false,
          localStyleStrength: 100, localStructureStrength: 50,
          localIsPortrait: false, localPortraitStyle: 'standard', localPortraitBeautifier: '',
          localFlavor: 'faithful', localEngine: 'balanced', localFixedGen: false,
        },
      },
    ],
  },
  {
    section: 'Video Generation',
    items: [
      {
        type: 'kling3',
        label: 'Kling 3 Video',
        defaults: {
          label: 'Kling 3 Video',
          inputImagePreview: null, inputPrompt: '', inputNegativePrompt: '', outputVideo: null, isLoading: false,
          localModel: 'std', localDuration: 5, localAspectRatio: '16:9', localCfgScale: 0.5,
        },
      },
      {
        type: 'kling3Omni',
        label: 'Kling 3 Omni',
        defaults: {
          label: 'Kling 3 Omni',
          inputImagePreview: null, inputPrompt: '', inputNegativePrompt: '', outputVideo: null, isLoading: false,
          localModel: 'std', localDuration: 5, localAspectRatio: '16:9', localCfgScale: 0.5, localGenerateAudio: false,
        },
      },
      {
        type: 'kling3Motion',
        label: 'Kling 3 Motion Control',
        defaults: {
          label: 'Kling 3 Motion Control',
          inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false,
          localModel: 'std', localOrientation: 'video', localCfgScale: 0.5,
        },
      },
      {
        type: 'klingElementsPro',
        label: 'Kling Elements Pro',
        defaults: {
          label: 'Kling Elements Pro',
          inputImagePreview: null, inputPrompt: '', inputNegativePrompt: '', outputVideo: null, isLoading: false,
          localDuration: '5', localAspectRatio: 'widescreen_16_9',
        },
      },
      {
        type: 'klingO1',
        label: 'Kling O1',
        defaults: {
          label: 'Kling O1',
          inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false,
          localModel: 'std', localDuration: 5, localAspectRatio: '16:9',
        },
      },
      {
        type: 'minimaxLive',
        label: 'MiniMax Video 01 Live',
        defaults: {
          label: 'MiniMax Video 01 Live',
          inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false,
          localCameraMovement: '', localPromptOptimizer: true,
        },
      },
      {
        type: 'wan26',
        label: 'WAN 2.6 Video',
        defaults: {
          label: 'WAN 2.6 Video',
          inputImagePreview: null, inputPrompt: '', inputNegativePrompt: '', outputVideo: null, isLoading: false,
          localResolution: '720p', localDuration: '5', localRatio: '16:9', localShotType: 'single', localPromptExpansion: false, localSeed: -1,
        },
      },
      {
        type: 'seedance',
        label: 'Seedance 1.5 Pro',
        defaults: {
          label: 'Seedance 1.5 Pro',
          inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false,
          localResolution: '720p', localDuration: 5, localAspectRatio: 'widescreen_16_9', localGenerateAudio: true, localCameraFixed: false, localSeed: -1,
        },
      },
      {
        type: 'ltxVideo2Pro',
        label: 'LTX Video 2.0 Pro',
        defaults: {
          label: 'LTX Video 2.0 Pro',
          inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false,
          localResolution: '1080p', localDuration: 6, localFps: 25, localGenerateAudio: false, localSeed: 0,
        },
      },
      {
        type: 'runwayGen45',
        label: 'Runway Gen 4.5',
        defaults: {
          label: 'Runway Gen 4.5',
          inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false,
          localRatio: '1280:720', localDuration: 5, localSeed: 0,
        },
      },
      {
        type: 'runwayGen4Turbo',
        label: 'Runway Gen4 Turbo',
        defaults: {
          label: 'Runway Gen4 Turbo',
          inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false,
          localRatio: '1280:720', localDuration: 10, localSeed: 0,
        },
      },
      {
        type: 'runwayActTwo',
        label: 'Runway Act Two',
        defaults: {
          label: 'Runway Act Two',
          localCharacter: null, localReference: null, outputVideo: null, isLoading: false,
          localRatio: '1280:720', localBodyControl: true, localExpressionIntensity: 3, localSeed: 0,
        },
      },
      {
        type: 'pixVerseV5',
        label: 'PixVerse V5',
        defaults: {
          label: 'PixVerse V5',
          inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false,
          localResolution: '720p', localRatio: '16:9', localMotionIntensity: 5, localSeed: -1,
        },
      },
      {
        type: 'pixVerseV5Transition',
        label: 'PixVerse V5 Transition',
        defaults: {
          label: 'PixVerse V5 Transition',
          localStartImage: null, localEndImage: null, inputPrompt: '', outputVideo: null, isLoading: false,
          localResolution: '720p', localDuration: 5, localSeed: -1,
        },
      },
      {
        type: 'omniHuman',
        label: 'OmniHuman 1.5',
        defaults: {
          label: 'OmniHuman 1.5',
          inputImagePreview: null, inputAudioUrl: '', inputPrompt: '', outputVideo: null, isLoading: false,
          localResolution: '1080p', localTurboMode: false,
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
    section: 'Utilities',
    items: [
      {
        type: 'layerEditor',
        label: 'Layer Editor',
        defaults: { label: 'Layer Editor' },
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
export const DEFAULT_NODES = (() => {
  const allNodes: any[] = [];
  let currentX = 50;
  let currentY = 50;
  
  NODE_MENU.forEach((section) => {
    let col = 0;
    section.items.forEach((item) => {
      allNodes.push({
        id: `test_${item.type}_${Math.random().toString(36).substring(2, 11)}`,
        type: item.type,
        position: { x: currentX, y: currentY },
        data: item.defaults ? JSON.parse(JSON.stringify(item.defaults)) : { label: item.label }
      });
      currentX += 320;
      col++;
      if (col >= 4) {
        col = 0;
        currentX = 50;
        currentY += 250;
      }
    });
    currentX = 50;
    currentY += 400; // Extra gap between sections
  });
  return allNodes;
})();

export default NODE_MENU;
