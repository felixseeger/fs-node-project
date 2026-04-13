import * as logicExecutors from './logicExecutors';
/**
 * Node Executors
 * Type-specific execution logic for each node type
 */

import type { NodeExecutor, NodeTypeMetadata } from './types';
import { NodeCategory } from './types';
import * as api from '../utils/api';
import { NodeCapabilities } from '../nodes/nodeCapabilities';
import {
  collectImageUrls,
  extractPrimaryImageUrl,
  extractPromptFromUpstream,
  isProbablyImageUrl,
} from './executorInputs';
import { alignImageToMatch } from '../utils/imageUtils';

/** Registry of node type metadata */
/** Node type metadata registry */
export const NODE_TYPE_METADATA: Record<string, NodeTypeMetadata> = {
  // Input nodes
  inputNode: {
    category: NodeCategory.INPUT,
    displayName: 'Input',
    inputs: [],
    outputs: ['prompt-out', 'image-out', 'aspect_ratio', 'resolution', 'num_images'],
    isAsync: false,
  },
  textNode: {
    category: NodeCategory.INPUT,
    displayName: 'Prompt',
    inputs: [],
    outputs: ['text-out'],
    isAsync: false,
  },
  prompt: {
    category: NodeCategory.INPUT,
    displayName: 'Prompt',
    inputs: [],
    outputs: ['text-out'],
    isAsync: false,
  },
  text: {
    category: NodeCategory.INPUT,
    displayName: 'Text',
    inputs: [],
    outputs: ['text-out'],
    isAsync: false,
  },
  textLLM: {
    category: NodeCategory.INPUT,
    displayName: 'Claude Sonnet 4',
    inputs: ['prompt-in', 'system-in'],
    outputs: ['text-out'],
    isAsync: true,
    estimatedDuration: 10000,
  },
  adaptedPrompt: {
    category: NodeCategory.VISION,
    displayName: 'Adapted Prompt',
    inputs: ['prompt-in'],
    outputs: ['prompt-out'],
    isAsync: true,
    estimatedDuration: 5000,
  },
  imageNode: {
    category: NodeCategory.INPUT,
    displayName: 'Image',
    inputs: [],
    outputs: ['image-out'],
    isAsync: false,
  },
  assetNode: {
    category: NodeCategory.INPUT,
    displayName: 'Asset',
    inputs: [],
    outputs: ['image-out', 'images-out'],
    isAsync: false,
  },

  // Vision nodes
  imageAnalyzer: {
    category: NodeCategory.VISION,
    displayName: 'Image Analyzer',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['analysis-out'],
    capabilities: [NodeCapabilities.IMAGE_ANALYSIS],
    isAsync: true,
    estimatedDuration: 10000,
  },
  imageToPrompt: {
    category: NodeCategory.VISION,
    displayName: 'Image to Prompt',
    inputs: ['image-in'],
    outputs: ['prompt-out'],
    capabilities: [NodeCapabilities.IMAGE_TO_PROMPT],
    isAsync: true,
    estimatedDuration: 15000,
  },
  improvePrompt: {
    category: NodeCategory.VISION,
    displayName: 'Improve Prompt',
    inputs: ['prompt-in'],
    outputs: ['prompt-out'],
    capabilities: [NodeCapabilities.PROMPT_IMPROVEMENT],
    isAsync: true,
    estimatedDuration: 8000,
  },
  aiImageClassifier: {
    category: NodeCategory.VISION,
    displayName: 'AI Image Classifier',
    inputs: ['image-in'],
    outputs: ['analysis-out'],
    capabilities: [NodeCapabilities.IMAGE_CLASSIFICATION],
    isAsync: true,
    estimatedDuration: 10000,
  },

  // Image generation nodes
  generator: {
    category: NodeCategory.IMAGE_GENERATION,
    displayName: 'Image Generator',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['output'],
    capabilities: [NodeCapabilities.IMAGE_GENERATE],
    isAsync: true,
    estimatedDuration: 30000,
  },
  fluxReimagine: {
    category: NodeCategory.IMAGE_GENERATION,
    displayName: 'Flux Reimagine',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    capabilities: [NodeCapabilities.IMAGE_REIMAGINE],
    isAsync: true,
    estimatedDuration: 45000,
  },
  textToIcon: {
    category: NodeCategory.IMAGE_GENERATION,
    displayName: 'Text to Icon',
    inputs: ['prompt-in'],
    outputs: ['output'],
    capabilities: [NodeCapabilities.ICON_GENERATE],
    isAsync: true,
    estimatedDuration: 20000,
  },
  tripo3d: {
    category: NodeCategory.IMAGE_GENERATION,
    displayName: 'Tripo3D',
    inputs: ['prompt-in'],
    outputs: ['model-out'],
    capabilities: [NodeCapabilities.MODEL_3D_GENERATE],
    isAsync: true,
    estimatedDuration: 120000,
  },

  // Image editing nodes
  creativeUpscale: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Creative Upscale',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    capabilities: [NodeCapabilities.IMAGE_UPSCALE_CREATIVE],
    isAsync: true,
    estimatedDuration: 60000,
  },
  precisionUpscale: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Precision Upscale',
    inputs: ['image-in'],
    outputs: ['output'],
    capabilities: [NodeCapabilities.IMAGE_UPSCALE_PRECISION],
    isAsync: true,
    estimatedDuration: 45000,
  },
  relight: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Relight',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    capabilities: [NodeCapabilities.IMAGE_RELIGHT],
    isAsync: true,
    estimatedDuration: 40000,
  },
  removeBackground: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Remove Background',
    inputs: ['image-in'],
    outputs: ['output'],
    capabilities: [NodeCapabilities.IMAGE_REMOVE_BACKGROUND],
    isAsync: true,
    estimatedDuration: 15000,
  },
  styleTransfer: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Style Transfer',
    inputs: ['image-in', 'reference-in', 'prompt-in'],
    outputs: ['output'],
    capabilities: [NodeCapabilities.IMAGE_STYLE_TRANSFER],
    isAsync: true,
    estimatedDuration: 50000,
  },
  fluxImageExpand: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Flux Image Expand',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    capabilities: [NodeCapabilities.IMAGE_EXPAND],
    isAsync: true,
    estimatedDuration: 45000,
  },
  seedreamExpand: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Seedream Expand',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    capabilities: [NodeCapabilities.IMAGE_EXPAND],
    isAsync: true,
    estimatedDuration: 40000,
  },
  ideogramExpand: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Ideogram Expand',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    capabilities: [NodeCapabilities.IMAGE_EXPAND],
    isAsync: true,
    estimatedDuration: 40000,
  },
  ideogramInpaint: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Ideogram Inpaint',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    capabilities: [NodeCapabilities.IMAGE_INPAINT],
    isAsync: true,
    estimatedDuration: 40000,
  },
  skinEnhancer: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Skin Enhancer',
    inputs: ['image-in'],
    outputs: ['output'],
    capabilities: [NodeCapabilities.IMAGE_SKIN_ENHANCE],
    isAsync: true,
    estimatedDuration: 30000,
  },
  changeCamera: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Change Camera',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    capabilities: [NodeCapabilities.IMAGE_CHANGE_CAMERA],
    isAsync: true,
    estimatedDuration: 45000,
  },

  // Video generation nodes
  kling3: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Kling 3',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_GENERATE],
    isAsync: true,
    estimatedDuration: 180000,
  },
  kling3Omni: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Kling 3 Omni',
    inputs: ['prompt-in', 'image-in', 'video-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_GENERATE_OMNI],
    isAsync: true,
    estimatedDuration: 180000,
  },
  kling3Motion: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Kling 3 Motion',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_GENERATE_MOTION],
    isAsync: true,
    estimatedDuration: 180000,
  },
  klingElementsPro: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Kling Elements Pro',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_GENERATE_ELEMENTS],
    isAsync: true,
    estimatedDuration: 180000,
  },
  klingO1: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Kling O1',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_GENERATE_O1],
    isAsync: true,
    estimatedDuration: 180000,
  },
  minimaxLive: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'MiniMax Live',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_GENERATE_LIVE],
    isAsync: true,
    estimatedDuration: 120000,
  },
  wan26: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'WAN 2.6',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_GENERATE],
    isAsync: true,
    estimatedDuration: 150000,
  },
  seedance: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Seedance',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_GENERATE],
    isAsync: true,
    estimatedDuration: 180000,
  },
  ltxVideo2Pro: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'LTX Video 2 Pro',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_GENERATE],
    isAsync: true,
    estimatedDuration: 120000,
  },
  runwayGen45: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Runway Gen 4.5',
    inputs: ['prompt-in', 'image-in', 'video-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_GENERATE],
    isAsync: true,
    estimatedDuration: 200000,
  },
  runwayGen4Turbo: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Runway Gen 4 Turbo',
    inputs: ['prompt-in', 'image-in', 'video-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_GENERATE],
    isAsync: true,
    estimatedDuration: 150000,
  },
  runwayActTwo: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Runway Act Two',
    inputs: ['video-in', 'character-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_GENERATE],
    isAsync: true,
    estimatedDuration: 180000,
  },
  pixVerseV5Transition: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'PixVerse V5 Transition',
    inputs: ['prompt-in', 'image-in', 'video-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_GENERATE_TRANSITION],
    isAsync: true,
    estimatedDuration: 180000,
  },
  omniHuman: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'OmniHuman',
    inputs: ['prompt-in', 'image-in', 'audio-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_GENERATE_HUMAN],
    isAsync: true,
    estimatedDuration: 300000,
  },

  // Video editing nodes
  vfx: {
    category: NodeCategory.VIDEO_EDITING,
    displayName: 'VFX',
    inputs: ['video-in', 'prompt-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_VFX],
    isAsync: true,
    estimatedDuration: 120000,
  },
  creativeVideoUpscale: {
    category: NodeCategory.VIDEO_EDITING,
    displayName: 'Creative Video Upscale',
    inputs: ['video-in', 'prompt-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_UPSCALE_CREATIVE],
    isAsync: true,
    estimatedDuration: 180000,
  },
  precisionVideoUpscale: {
    category: NodeCategory.VIDEO_EDITING,
    displayName: 'Precision Video Upscale',
    inputs: ['video-in'],
    outputs: ['video-out'],
    capabilities: [NodeCapabilities.VIDEO_UPSCALE_PRECISION],
    isAsync: true,
    estimatedDuration: 150000,
  },

  // Audio generation nodes
  musicGeneration: {
    category: NodeCategory.AUDIO_GENERATION,
    displayName: 'Music Generation',
    inputs: ['prompt-in', 'audio-in'],
    outputs: ['audio-out'],
    capabilities: [NodeCapabilities.AUDIO_MUSIC_GENERATE],
    isAsync: true,
    estimatedDuration: 60000,
  },
  soundEffects: {
    category: NodeCategory.AUDIO_GENERATION,
    displayName: 'Sound Effects',
    inputs: ['prompt-in'],
    outputs: ['audio-out'],
    capabilities: [NodeCapabilities.AUDIO_SFX_GENERATE],
    isAsync: true,
    estimatedDuration: 30000,
  },
  audioIsolation: {
    category: NodeCategory.AUDIO_GENERATION,
    displayName: 'Audio Isolation',
    inputs: ['audio-in'],
    outputs: ['audio-out'],
    capabilities: [NodeCapabilities.AUDIO_ISOLATION],
    isAsync: true,
    estimatedDuration: 45000,
  },
  voiceover: {
    category: NodeCategory.AUDIO_GENERATION,
    displayName: 'Voiceover',
    inputs: ['text-in', 'audio-in'],
    outputs: ['audio-out'],
    capabilities: [NodeCapabilities.AUDIO_VOICEOVER],
    isAsync: true,
    estimatedDuration: 30000,
  },

  // Utility nodes
  responseNode: {
    category: NodeCategory.OUTPUT,
    displayName: 'Response',
    inputs: ['image-in', 'video-in', 'audio-in', 'text-in'],
    outputs: [],
    isAsync: false,
  },
  comment: {
    category: NodeCategory.UTILITY,
    displayName: 'Comment',
    inputs: [],
    outputs: [],
    isAsync: false,
  },
  router: {
    category: NodeCategory.UTILITY,
    displayName: 'Router',
    inputs: ['input'],
    outputs: ['output'],
    isAsync: false,
  },

  // Logic & Flow
  condition: {
    category: NodeCategory.UTILITY,
    displayName: 'Condition',
    inputs: ['input'],
    outputs: ['true_out', 'false_out'],
    isAsync: false,
  },
  iteration: {
    category: NodeCategory.UTILITY,
    displayName: 'Iteration',
    inputs: ['array_in'],
    outputs: ['item_out'],
    isAsync: false,
  },
  variable: {
    category: NodeCategory.UTILITY,
    displayName: 'Variable',
    inputs: ['val_in'],
    outputs: ['val_out'],
    isAsync: false,
  },
  socialPublisher: {
    category: NodeCategory.UTILITY,
    displayName: 'Social Publisher',
    inputs: ['media_in', 'caption_in'],
    outputs: ['result'],
    capabilities: [NodeCapabilities.SOCIAL_PUBLISH],
    isAsync: true,
  },
  cloudSync: {
    category: NodeCategory.UTILITY,
    displayName: 'Cloud Sync',
    inputs: ['media_in'],
    outputs: ['result'],
    capabilities: [NodeCapabilities.CLOUD_SYNC],
    isAsync: true,
  },

};

/** Get metadata for a node type */
export function getNodeMetadata(nodeType: string): NodeTypeMetadata {
  return (
    NODE_TYPE_METADATA[nodeType] || {
      category: NodeCategory.UNKNOWN,
      displayName: nodeType,
      inputs: [],
      outputs: [],
      isAsync: false,
    }
  );
}

/** Registry of node executors */
const executors = new Map<string, NodeExecutor>();

/** Register an executor for a node type */
export function registerExecutor(nodeType: string, executor: NodeExecutor): void {
  executors.set(nodeType, executor);
}

/** Get executor for a node type */
export function getExecutor(nodeType: string): NodeExecutor | undefined {
  return executors.get(nodeType);
}

/** Check if an executor exists for a node type */
export function hasExecutor(nodeType: string): boolean {
  return executors.has(nodeType);
}

/** Remove an executor */
export function unregisterExecutor(nodeType: string): void {
  executors.delete(nodeType);
}

// ============================================================================
// Built-in Executors
// ============================================================================

/** Input node executor - passes through field values */
const inputNodeExecutor: NodeExecutor = async (node) => {
  const data = node.data as Record<string, unknown>;
  return {
    fieldValues: data.fieldValues,
    fieldLabels: data.fieldLabels,
    imagesByField: data.imagesByField,
  };
};

/** Text node executor */
const textNodeExecutor: NodeExecutor = async (node) => {
  const data = node.data as Record<string, unknown>;
  return { text: data.text || data.prompt };
};

/** Text LLM node executor */
const textLLMExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.localPrompt as string) || '');
  const system = extractPromptFromUpstream(inputs['system-in'], (data.systemDirections as string) || '');

  if (!prompt) throw new Error('No prompt provided for LLM');

  context.updateNodeState(node.id, { message: 'Generating response...' });

  const result = await api.sendChat(prompt, [], system || null, []);
  
  if ((result as any).error) {
    throw new Error((result as any).error);
  }
  
  return { resultText: result.response || 'No response returned.' };
};

/** Image node executor */
const imageNodeExecutor: NodeExecutor = async (node) => {
  const data = node.data as Record<string, unknown>;
  return { images: data.images };
};

/** Asset node executor */
const assetNodeExecutor: NodeExecutor = async (node) => {
  const data = node.data as Record<string, unknown>;
  return { images: data.images };
};

/** Image analyzer executor */
const imageAnalyzerExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const fromHandle = collectImageUrls(inputs['image-in']);
  const local = Array.isArray(data.localImages)
    ? (data.localImages as unknown[]).filter((x): x is string => typeof x === 'string')
    : [];
  const images = [...fromHandle, ...local.filter(isProbablyImageUrl)];

  const prompt =
    extractPromptFromUpstream(inputs['prompt-in'], (data.localPrompt as string) || '') ||
    'Describe this image in detail';

  if (!images.length) {
    throw new Error('No image provided for analysis');
  }

  context.updateNodeState(node.id, { message: 'Analyzing image...' });

  const result = await api.analyzeImage({
    images,
    prompt,
    systemDirections: (data.systemDirections as string) || '',
  });

  if (result.error) {
    throw new Error(result.error.message || 'Analysis failed');
  }

  return { analysisResult: result.analysis };
};

/** Image to prompt executor */
const imageToPromptExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const image =
    extractPrimaryImageUrl(inputs['image-in']) ||
    (typeof data.inputImagePreview === 'string' ? data.inputImagePreview : undefined);

  if (!image) {
    throw new Error('No image provided');
  }

  context.updateNodeState(node.id, { message: 'Generating prompt...' });

  const result = await api.imageToPromptGenerate({ image });

  if (result.error) {
    throw new Error(result.error.message || 'Failed to generate prompt');
  }

  // Poll for completion
  const taskId = result.data?.id;
  if (!taskId) {
    throw new Error('No task ID returned');
  }

  const pollResult = await api.pollImageToPromptStatus(taskId);
  return { outputPrompt: pollResult.data?.prompt };
};

/** Improve prompt executor */
const improvePromptExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(
    inputs['prompt-in'],
    (data.inputPrompt as string) || ''
  );

  if (!prompt) {
    throw new Error('No prompt provided');
  }

  context.updateNodeState(node.id, { message: 'Improving prompt...' });

  const result = await api.improvePromptGenerate({
    prompt,
    type: data.localType as 'image' | 'video',
    language: data.localLanguage as string,
  });

  if (result.error) {
    throw new Error(result.error.message || 'Failed to improve prompt');
  }

  const taskId = result.data?.id;
  if (!taskId) {
    throw new Error('No task ID returned');
  }

  const pollResult = await api.pollImprovePromptStatus(taskId);
  return { outputPrompt: pollResult.data?.prompt };
};

/** AI Image classifier executor */
const aiImageClassifierExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const image =
    extractPrimaryImageUrl(inputs['image-in']) ||
    (typeof data.inputImagePreview === 'string' ? data.inputImagePreview : undefined);

  if (!image) {
    throw new Error('No image provided');
  }

  context.updateNodeState(node.id, { message: 'Classifying image...' });

  const result = await api.imageClassifierGenerate({ image });

  if (result.error) {
    throw new Error(result.error.message || 'Classification failed');
  }

  const taskId = result.data?.id;
  if (!taskId) {
    throw new Error('No task ID returned');
  }

  const pollResult = await api.pollImageToPromptStatus(taskId);
  return {
    outputText: pollResult.data?.classification,
    rawResult: pollResult.data,
  };
};

/** Generator node executor (Nano Banana / Kora) */
const generatorExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(
    inputs['prompt-in'],
    (data.inputPrompt as string) || ''
  );
  const image = extractPrimaryImageUrl(inputs['image-in']);

  if (!prompt) {
    throw new Error('No prompt provided');
  }

  context.updateNodeState(node.id, { message: 'Generating image...' });

  const isKora = data.generatorType === 'kora';
  const generateFn = isKora ? api.generateKora : api.generateImage;

  const result = await generateFn({
    prompt,
    image: image || undefined,
  });

  if (result.error) {
    throw new Error(result.error.message || 'Generation failed');
  }

  const taskId = result.data?.id;
  if (!taskId) {
    throw new Error('No task ID returned');
  }

  const pollResult = await api.pollStatus(taskId, isKora ? 'realism' : 'fluid');
  return { outputImage: pollResult.data?.output };
};

/** Creative upscale executor */
const creativeUpscaleExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const image =
    extractPrimaryImageUrl(inputs['image-in']) ||
    (typeof data.inputImagePreview === 'string' ? data.inputImagePreview : undefined);
  const prompt = extractPromptFromUpstream(
    inputs['prompt-in'],
    (data.inputPrompt as string) || ''
  );

  if (!image) {
    throw new Error('No image provided');
  }

  context.updateNodeState(node.id, { message: 'Upscaling (creative)...' });

  const result = await api.upscaleCreative({
    image,
    prompt,
    scaleFactor: data.localScaleFactor as string,
    optimizedFor: data.localOptimizedFor as string,
    engine: data.localEngine as string,
    creativity: data.localCreativity as number,
    hdr: data.localHdr as number,
    resemblance: data.localResemblance as number,
    fractality: data.localFractality as number,
  });

  if (result.error) {
    throw new Error(result.error.message || 'Upscale failed');
  }

  const taskId = result.data?.id;
  if (!taskId) {
    throw new Error('No task ID returned');
  }

  const pollResult = await api.pollUpscaleStatus(taskId);
  return { outputImage: pollResult.data?.output };
};

/** Precision upscale executor */
const precisionUpscaleExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const image =
    extractPrimaryImageUrl(inputs['image-in']) ||
    (typeof data.inputImagePreview === 'string' ? data.inputImagePreview : undefined);

  if (!image) {
    throw new Error('No image provided');
  }

  context.updateNodeState(node.id, { message: 'Upscaling (precision)...' });

  const result = await api.upscalePrecision({
    image,
    scaleFactor: data.localScaleFactor as string,
    flavor: data.localFlavor as string,
    sharpen: data.localSharpen as number,
    smartGrain: data.localSmartGrain as number,
    ultraDetail: data.localUltraDetail as number,
  });

  if (result.error) {
    throw new Error(result.error.message || 'Upscale failed');
  }

  const taskId = result.data?.id;
  if (!taskId) {
    throw new Error('No task ID returned');
  }

  const pollResult = await api.pollPrecisionStatus(taskId);
  return { outputImage: pollResult.data?.output };
};

/** Remove background executor */
const removeBackgroundExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const image =
    extractPrimaryImageUrl(inputs['image-in']) ||
    (typeof data.inputImagePreview === 'string' ? data.inputImagePreview : undefined);

  if (!image) {
    throw new Error('No image provided');
  }

  context.updateNodeState(node.id, { message: 'Removing background...' });

  const result = await api.removeBackground({ image });

  if (result.error) {
    throw new Error(result.error.message || 'Background removal failed');
  }

  return {
    outputImage: result.data?.output,
    outputHighRes: result.data?.highRes,
    outputPreview: result.data?.preview,
    outputUrl: result.data?.url,
    originalUrl: result.data?.original,
  };
};

/** Response node executor - collects outputs */
const responseNodeExecutor: NodeExecutor = async (node, context) => {
  const inputs = context.getInputs(node.id);
  return {
    image: inputs['image-in'],
    video: inputs['video-in'],
    audio: inputs['audio-in'],
    text: inputs['text-in'],
  };
};

/** Comment node executor - no-op */
const commentExecutor: NodeExecutor = async () => {
  return {};
};

/** Router node executor - passes through input */
const routerExecutor: NodeExecutor = async (node, context) => {
  const inputs = context.getInputs(node.id);
  return { output: inputs['input'] };
};

// ============================================================================
// Video Generation Executors
// ============================================================================

/** Kling 3 executor */
const kling3Executor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');
  const startImage = extractPrimaryImageUrl(inputs['start-image-in']) || extractPrimaryImageUrl(inputs['image-in']);
  let endImage = extractPrimaryImageUrl(inputs['end-image-in']);
  const mode = (data.localMode as string) || 'std';

  if (!prompt && !startImage) throw new Error('No prompt or start image provided');

  context.updateNodeState(node.id, { message: 'Generating video (Kling 3)...' });

  // Backend Alignment for in-out frames
  if (startImage && endImage) {
    endImage = await alignImageToMatch(startImage, endImage);
  }

  const result = await api.kling3Generate(mode, {
    prompt,
    start_image_url: startImage || undefined,
    end_image_url: endImage || undefined,
    duration: data.localDuration as string,
    aspect_ratio: data.localAspectRatio as string,
  });

  if (result.error) throw new Error(result.error.message || 'Kling 3 generation failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollKling3Status(taskId);
  return { videoOut: pollResult.data?.output };
};

/** Kling 3 Omni executor */
const kling3OmniExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');
  const startImage = extractPrimaryImageUrl(inputs['start-image-in']) || extractPrimaryImageUrl(inputs['image-in']);
  let endImage = extractPrimaryImageUrl(inputs['end-image-in']);
  const videoUrl = extractPrimaryImageUrl(inputs['video-in']);
  const mode = (data.localMode as string) || 'std';

  if (!prompt && !startImage && !videoUrl) throw new Error('No inputs provided');

  context.updateNodeState(node.id, { message: 'Generating video (Kling 3 Omni)...' });

  if (startImage && endImage) {
    endImage = await alignImageToMatch(startImage, endImage);
  }

  const result = await api.kling3OmniGenerate(mode, {
    prompt,
    video_url: videoUrl || undefined,
    start_image_url: startImage || undefined,
    end_image_url: endImage || undefined,
    duration: data.localDuration as string,
    aspect_ratio: data.localAspectRatio as string,
  });

  if (result.error) throw new Error(result.error.message || 'Kling 3 Omni generation failed');
  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');
  const pollResult = await api.pollKling3OmniStatus(taskId, !!videoUrl);
  return { videoOut: pollResult.data?.output };
};

/** Kling O1 executor */
const klingO1Executor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');
  const startImage = extractPrimaryImageUrl(inputs['start-image-in']) || extractPrimaryImageUrl(inputs['image-in']);
  let endImage = extractPrimaryImageUrl(inputs['end-image-in']);
  const mode = (data.localMode as string) || 'std';

  if (!startImage && !endImage) throw new Error('Kling O1 requires at least a first or last frame');

  context.updateNodeState(node.id, { message: 'Generating video (Kling O1)...' });

  if (startImage && endImage) {
    endImage = await alignImageToMatch(startImage, endImage);
  }

  const result = await api.klingO1Generate(mode, {
    prompt,
    first_frame: startImage || undefined,
    last_frame: endImage || undefined,
    duration: data.localDuration as string,
    aspect_ratio: data.localAspectRatio as string,
  });

  if (result.error) throw new Error(result.error.message || 'Kling O1 generation failed');
  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');
  const pollResult = await api.pollKlingO1Status(taskId);
  return { videoOut: pollResult.data?.output };
};

/** MiniMax Live executor */
const minimaxLiveExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');
  const image = extractPrimaryImageUrl(inputs['image-in']);

  if (!prompt) throw new Error('No prompt provided');

  context.updateNodeState(node.id, { message: 'Generating video (MiniMax Live)...' });

  const result = await api.minimaxLiveGenerate({
    prompt,
    image: image || undefined,
  });

  if (result.error) throw new Error(result.error.message || 'MiniMax Live generation failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollMiniMaxLiveStatus(taskId);
  return { videoOut: pollResult.data?.output };
};

/** WAN 2.6 executor */
const wan26Executor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');
  const image = extractPrimaryImageUrl(inputs['image-in']);
  const mode = (data.localMode as string) || 't2v';
  const resolution = (data.localResolution as string) || '720p';

  if (!prompt) throw new Error('No prompt provided');

  context.updateNodeState(node.id, { message: `Generating video (WAN 2.6 ${mode})...` });

  const result = await api.wan26Generate(mode, resolution, {
    prompt,
    image: image || undefined,
  });

  if (result.error) throw new Error(result.error.message || 'WAN 2.6 generation failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollWan26Status(mode, resolution, taskId);
  return { videoOut: pollResult.data?.output };
};

/** Seedance executor */
const seedanceExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');
  const image = extractPrimaryImageUrl(inputs['image-in']);
  const resolution = (data.localResolution as string) || '1080p';

  if (!prompt) throw new Error('No prompt provided');

  context.updateNodeState(node.id, { message: 'Generating video (Seedance)...' });

  const result = await api.seedanceGenerate(resolution, {
    prompt,
    image: image || undefined,
  });

  if (result.error) throw new Error(result.error.message || 'Seedance generation failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollSeedanceStatus(resolution, taskId);
  return { videoOut: pollResult.data?.output };
};

/** LTX Video 2 Pro executor */
const ltxVideo2ProExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');
  const image = extractPrimaryImageUrl(inputs['image-in']);
  const mode = (data.localMode as string) || 't2v';

  if (!prompt) throw new Error('No prompt provided');

  context.updateNodeState(node.id, { message: 'Generating video (LTX 2.0 Pro)...' });

  const result = await api.ltxVideo2ProGenerate(mode, {
    prompt,
    image: image || undefined,
  });

  if (result.error) throw new Error(result.error.message || 'LTX 2.0 Pro generation failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollLtxVideo2ProStatus(mode, taskId);
  return { videoOut: pollResult.data?.output };
};

/** Runway Gen 4.5 executor */
const runwayGen45Executor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');
  const image = extractPrimaryImageUrl(inputs['image-in']);
  const mode = (data.localMode as string) || 't2v';

  if (!prompt) throw new Error('No prompt provided');

  context.updateNodeState(node.id, { message: 'Generating video (Runway Gen 4.5)...' });

  const result = await api.runwayGen45Generate(mode, {
    prompt,
    image: image || undefined,
  });

  if (result.error) throw new Error(result.error.message || 'Runway Gen 4.5 generation failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollRunwayGen45Status(mode, taskId);
  return { videoOut: pollResult.data?.output };
};

/** PixVerse V5 Transition executor */
const pixVerseV5TransitionExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');
  const firstImage = extractPrimaryImageUrl(inputs['start-image-in']) || extractPrimaryImageUrl(inputs['image-in']);
  let lastImage = extractPrimaryImageUrl(inputs['end-image-in']);

  if (!firstImage || !lastImage) throw new Error('Both start and end frames are required for PixVerse transition');

  context.updateNodeState(node.id, { message: 'Generating video transition (PixVerse V5)...' });

  // Backend Alignment of in-out frames
  lastImage = await alignImageToMatch(firstImage, lastImage);

  const result = await api.pixVerseV5TransitionGenerate({
    prompt,
    first_image_url: firstImage,
    last_image_url: lastImage,
    resolution: data.localResolution as string,
    duration: data.localDuration as number,
  });

  if (result.error) throw new Error(result.error.message || 'PixVerse V5 transition failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollPixVerseV5TransitionStatus(taskId);
  return { videoOut: pollResult.data?.output };
};

/** OmniHuman executor */
const omniHumanExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');
  const image = extractPrimaryImageUrl(inputs['image-in']);

  if (!prompt) throw new Error('No prompt provided');

  context.updateNodeState(node.id, { message: 'Generating video (OmniHuman)...' });

  const result = await api.omniHumanGenerate({
    prompt,
    image: image || undefined,
  });

  if (result.error) throw new Error(result.error.message || 'OmniHuman generation failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollOmniHumanStatus(taskId);
  return { videoOut: pollResult.data?.output };
};

// ============================================================================
// Audio Generation Executors
// ============================================================================

/** Music Generation executor */
const musicGenerationExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');

  if (!prompt) throw new Error('No prompt provided');

  context.updateNodeState(node.id, { message: 'Generating music...' });

  const result = await api.musicGenerate({
    prompt,
    duration: data.localDuration as number,
  });

  if (result.error) throw new Error(result.error.message || 'Music generation failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollMusicStatus(taskId);
  return { audioOut: pollResult.data?.output };
};

/** Sound Effects executor */
const soundEffectsExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');

  if (!prompt) throw new Error('No prompt provided');

  context.updateNodeState(node.id, { message: 'Generating sound effects...' });

  const result = await api.soundEffectsGenerate({
    prompt,
  });

  if (result.error) throw new Error(result.error.message || 'Sound effects generation failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollSoundEffectsStatus(taskId);
  return { audioOut: pollResult.data?.output };
};

/** Audio Isolation executor */
const audioIsolationExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const audio = inputs['audio-in'] as string || (data.localAudioUrl as string);

  if (!audio) throw new Error('No audio provided');

  context.updateNodeState(node.id, { message: 'Isolating audio...' });

  const result = await api.audioIsolationGenerate({
    audio,
  });

  if (result.error) throw new Error(result.error.message || 'Audio isolation failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollAudioIsolationStatus(taskId);
  return { audioOut: pollResult.data?.output };
};

/** Voiceover executor */
const voiceoverExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const text = (inputs['text-in'] || data.localText) as string;

  if (!text) throw new Error('No text provided');

  context.updateNodeState(node.id, { message: 'Generating voiceover...' });

  const result = await api.voiceoverGenerate({
    text,
    voice_id: data.localVoiceId as string,
  });

  if (result.error) throw new Error(result.error.message || 'Voiceover failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollVoiceoverStatus(taskId);
  return { audioOut: pollResult.data?.output };
};

// ============================================================================
// Image Editing & Generation Additions
// ============================================================================

/** Relight executor */
const relightExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const image = extractPrimaryImageUrl(inputs['image-in']) || (data.inputImagePreview as string);
  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');

  if (!image) throw new Error('No image provided');

  context.updateNodeState(node.id, { message: 'Relighting image...' });

  const result = await api.relightImage({
    image,
    prompt,
  });

  if (result.error) throw new Error(result.error.message || 'Relight failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollRelightStatus(taskId);
  return { output: pollResult.data?.output };
};

/** Style Transfer executor */
const styleTransferExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const image = extractPrimaryImageUrl(inputs['image-in']) || (data.inputImagePreview as string);
  const reference = extractPrimaryImageUrl(inputs['reference-in']);

  if (!image || !reference) throw new Error('Image and reference required');

  context.updateNodeState(node.id, { message: 'Applying style transfer...' });

  const result = await api.styleTransfer({
    image,
    reference,
  });

  if (result.error) throw new Error(result.error.message || 'Style transfer failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollStyleTransferStatus(taskId);
  return { output: pollResult.data?.output };
};

/** Flux Reimagine executor */
const fluxReimagineExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const image = extractPrimaryImageUrl(inputs['image-in']) || (data.inputImagePreview as string);
  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');

  if (!image) throw new Error('No image provided');

  context.updateNodeState(node.id, { message: 'Reimagining image (Flux)...' });

  const result = await api.reimagineFlux({ image, prompt });

  if (result.error) throw new Error(result.error.message || 'Flux reimagine failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollStatus(taskId, 'fluid');
  return { output: pollResult.data?.output };
};

/** Text to Icon executor */
const textToIconExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');

  if (!prompt) throw new Error('No prompt provided');

  context.updateNodeState(node.id, { message: 'Generating icon...' });

  const result = await api.textToIconGenerate({ prompt });

  if (result.error) throw new Error(result.error.message || 'Icon generation failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollTextToIconStatus(taskId);
  return { output: pollResult.data?.output };
};

/** Tripo3D executor */
const tripo3dExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');

  if (!prompt) throw new Error('No prompt provided');

  context.updateNodeState(node.id, { message: 'Creating 3D model...' });

  const result = await api.tripoCreateTask({
    type: 'text_to_model',
    prompt,
  });

  if (result.error) throw new Error(result.error.message || 'Tripo3D task creation failed');

  const taskId = result.data?.task_id;
  if (!taskId) throw new Error('No task ID returned');

  // Basic polling for Tripo
  let pollResult = await api.tripoGetTask(taskId);
  while (pollResult.data?.status === 'running' || pollResult.data?.status === 'pending') {
    await new Promise(r => setTimeout(r, 5000));
    pollResult = await api.tripoGetTask(taskId);
  }

  return { modelOut: pollResult.data?.output };
};

/** Flux Image Expand executor */
const fluxImageExpandExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const image = extractPrimaryImageUrl(inputs['image-in']) || (data.inputImagePreview as string);
  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');

  if (!image) throw new Error('No image provided');

  context.updateNodeState(node.id, { message: 'Expanding image (Flux)...' });

  const result = await api.imageExpandFluxPro({
    image,
    prompt,
    aspect_ratio: data.localAspectRatio as string,
  });

  if (result.error) throw new Error(result.error.message || 'Image expansion failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollImageExpandStatus(taskId);
  return { output: pollResult.data?.output };
};

/** Seedream Expand executor */
const seedreamExpandExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const image = extractPrimaryImageUrl(inputs['image-in']) || (data.inputImagePreview as string);
  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');

  if (!image) throw new Error('No image provided');

  context.updateNodeState(node.id, { message: 'Expanding image (Seedream)...' });

  const result = await api.seedreamExpand({ image, prompt });

  if (result.error) throw new Error(result.error.message || 'Seedream expansion failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollSeedreamExpandStatus(taskId);
  return { output: pollResult.data?.output };
};

/** Ideogram Expand executor */
const ideogramExpandExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const image = extractPrimaryImageUrl(inputs['image-in']) || (data.inputImagePreview as string);
  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');

  if (!image) throw new Error('No image provided');

  context.updateNodeState(node.id, { message: 'Expanding image (Ideogram)...' });

  const result = await api.ideogramExpand({ image, prompt });

  if (result.error) throw new Error(result.error.message || 'Ideogram expansion failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollIdeogramExpandStatus(taskId);
  return { output: pollResult.data?.output };
};

/** Ideogram Inpaint executor */
const ideogramInpaintExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const image = extractPrimaryImageUrl(inputs['image-in']) || (data.inputImagePreview as string);
  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');

  if (!image) throw new Error('No image provided');

  context.updateNodeState(node.id, { message: 'Inpainting image (Ideogram)...' });

  const result = await api.ideogramInpaint({ image, prompt });

  if (result.error) throw new Error(result.error.message || 'Ideogram inpaint failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollIdeogramInpaintStatus(taskId);
  return { output: pollResult.data?.output };
};

/** Skin Enhancer executor */
const skinEnhancerExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const image = extractPrimaryImageUrl(inputs['image-in']) || (data.inputImagePreview as string);
  const mode = (data.localMode as string) || 'natural';

  if (!image) throw new Error('No image provided');

  context.updateNodeState(node.id, { message: 'Enhancing skin...' });

  const result = await api.skinEnhancer(mode, { image });

  if (result.error) throw new Error(result.error.message || 'Skin enhancer failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollSkinEnhancerStatus(taskId);
  return { output: pollResult.data?.output };
};

/** Change Camera executor */
const changeCameraExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const image = extractPrimaryImageUrl(inputs['image-in']) || (data.inputImagePreview as string);
  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');

  if (!image) throw new Error('No image provided');

  context.updateNodeState(node.id, { message: 'Changing camera perspective...' });

  const result = await api.changeCamera({ image, prompt });

  if (result.error) throw new Error(result.error.message || 'Change camera failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollChangeCameraStatus(taskId);
  return { output: pollResult.data?.output };
};

/** Creative Video Upscale executor */
const creativeVideoUpscaleExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const video = inputs['video-in'] as string || (data.localVideoUrl as string);
  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');

  if (!video) throw new Error('No video provided');

  context.updateNodeState(node.id, { message: 'Upscaling video (creative)...' });

  const result = await api.videoUpscaleGenerate('creative', {
    video,
    prompt,
  });

  if (result.error) throw new Error(result.error.message || 'Video upscale failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollVideoUpscaleStatus(taskId);
  return { videoOut: pollResult.data?.output };
};

/** Precision Video Upscale executor */
const precisionVideoUpscaleExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const video = inputs['video-in'] as string || (data.localVideoUrl as string);

  if (!video) throw new Error('No video provided');

  context.updateNodeState(node.id, { message: 'Upscaling video (precision)...' });

  const result = await api.precisionVideoUpscaleGenerate({ video });

  if (result.error) throw new Error(result.error.message || 'Video upscale failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollPrecisionVideoUpscaleStatus(taskId);
  return { videoOut: pollResult.data?.output };
};

/** VFX executor */
const vfxExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);

  const video = inputs['video-in'] as string || (data.localVideoUrl as string);
  const prompt = extractPromptFromUpstream(inputs['prompt-in'], (data.inputPrompt as string) || '');

  if (!video) throw new Error('No video provided');

  context.updateNodeState(node.id, { message: 'Applying VFX...' });

  const result = await api.vfxGenerate({
    video,
    prompt,
  });

  if (result.error) throw new Error(result.error.message || 'VFX failed');

  const taskId = result.data?.id;
  if (!taskId) throw new Error('No task ID returned');

  const pollResult = await api.pollVfxStatus(taskId);
  return { videoOut: pollResult.data?.output };
};

// ============================================================================
// Register all built-in executors
// ============================================================================

export function registerBuiltinExecutors(): void {
  // Input nodes
  registerExecutor('inputNode', inputNodeExecutor);
  registerExecutor('textNode', textNodeExecutor);
  registerExecutor('prompt', textNodeExecutor);
  registerExecutor('text', textNodeExecutor);
  registerExecutor('textLLM', textLLMExecutor);
  registerExecutor('adaptedPrompt', commentExecutor); // Or a specific executor if needed
  registerExecutor('imageNode', imageNodeExecutor);
  registerExecutor('assetNode', assetNodeExecutor);

  // Vision nodes
  registerExecutor('imageAnalyzer', imageAnalyzerExecutor);
  registerExecutor('imageToPrompt', imageToPromptExecutor);
  registerExecutor('improvePrompt', improvePromptExecutor);
  registerExecutor('aiImageClassifier', aiImageClassifierExecutor);

  // Image generation
  registerExecutor('generator', generatorExecutor);
  registerExecutor('fluxReimagine', fluxReimagineExecutor);
  registerExecutor('textToIcon', textToIconExecutor);
  registerExecutor('tripo3d', tripo3dExecutor);

  // Image editing
  registerExecutor('creativeUpscale', creativeUpscaleExecutor);
  registerExecutor('precisionUpscale', precisionUpscaleExecutor);
  registerExecutor('relight', relightExecutor);
  registerExecutor('removeBackground', removeBackgroundExecutor);
  registerExecutor('styleTransfer', styleTransferExecutor);
  registerExecutor('fluxImageExpand', fluxImageExpandExecutor);
  registerExecutor('seedreamExpand', seedreamExpandExecutor);
  registerExecutor('ideogramExpand', ideogramExpandExecutor);
  registerExecutor('ideogramInpaint', ideogramInpaintExecutor);
  registerExecutor('skinEnhancer', skinEnhancerExecutor);
  registerExecutor('changeCamera', changeCameraExecutor);

  // Video generation
  registerExecutor('kling3', kling3Executor);
  registerExecutor('kling3Omni', kling3OmniExecutor);
  registerExecutor('kling3Motion', kling3Executor); // Motion could also need fixing if it uses different API, but I didn't create a custom executor for it
  registerExecutor('klingElementsPro', kling3Executor);
  registerExecutor('klingO1', klingO1Executor);
  registerExecutor('minimaxLive', minimaxLiveExecutor);
  registerExecutor('wan26', wan26Executor);
  registerExecutor('seedance', seedanceExecutor);
  registerExecutor('ltxVideo2Pro', ltxVideo2ProExecutor);
  registerExecutor('runwayGen45', runwayGen45Executor);
  registerExecutor('runwayGen4Turbo', runwayGen45Executor);
  registerExecutor('runwayActTwo', runwayGen45Executor);
  registerExecutor('pixVerseV5Transition', pixVerseV5TransitionExecutor);
  registerExecutor('omniHuman', omniHumanExecutor);

  // Video editing
  registerExecutor('vfx', vfxExecutor);
  registerExecutor('creativeVideoUpscale', creativeVideoUpscaleExecutor);
  registerExecutor('precisionVideoUpscale', precisionVideoUpscaleExecutor);

  // Audio generation
  registerExecutor('musicGeneration', musicGenerationExecutor);
  registerExecutor('soundEffects', soundEffectsExecutor);
  registerExecutor('audioIsolation', audioIsolationExecutor);
  registerExecutor('voiceover', voiceoverExecutor);

  // Output nodes
  registerExecutor('responseNode', responseNodeExecutor);
  registerExecutor('comment', commentExecutor);
  registerExecutor('router', routerExecutor);

  // Logic & Flow
  registerExecutor('condition', logicExecutors.conditionExecutor);
  registerExecutor('iteration', logicExecutors.iterationExecutor);
  registerExecutor('variable', logicExecutors.variableExecutor);
  registerExecutor('socialPublisher', logicExecutors.socialPublisherExecutor);
  registerExecutor('cloudSync', logicExecutors.cloudSyncExecutor);
}


// Auto-register on module load
registerBuiltinExecutors();


export default {
  getNodeMetadata,
  registerExecutor,
  getExecutor,
  hasExecutor,
  unregisterExecutor,
  registerBuiltinExecutors,
};
