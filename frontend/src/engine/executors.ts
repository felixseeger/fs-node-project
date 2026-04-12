/**
 * Node Executors
 * Type-specific execution logic for each node type
 */

import type { NodeExecutor, NodeTypeMetadata } from './types';
import { NodeCategory } from './types';
import * as api from '../utils/api';
import {
  collectImageUrls,
  extractPrimaryImageUrl,
  extractPromptFromUpstream,
  isProbablyImageUrl,
} from './executorInputs';

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
    displayName: 'Text',
    inputs: [],
    outputs: ['text-out'],
    isAsync: false,
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
    isAsync: true,
    estimatedDuration: 10000,
  },
  imageToPrompt: {
    category: NodeCategory.VISION,
    displayName: 'Image to Prompt',
    inputs: ['image-in'],
    outputs: ['prompt-out'],
    isAsync: true,
    estimatedDuration: 15000,
  },
  improvePrompt: {
    category: NodeCategory.VISION,
    displayName: 'Improve Prompt',
    inputs: ['prompt-in'],
    outputs: ['prompt-out'],
    isAsync: true,
    estimatedDuration: 8000,
  },
  aiImageClassifier: {
    category: NodeCategory.VISION,
    displayName: 'AI Image Classifier',
    inputs: ['image-in'],
    outputs: ['analysis-out'],
    isAsync: true,
    estimatedDuration: 10000,
  },

  // Image generation nodes
  generator: {
    category: NodeCategory.IMAGE_GENERATION,
    displayName: 'Image Generator',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['output'],
    isAsync: true,
    estimatedDuration: 30000,
  },
  fluxReimagine: {
    category: NodeCategory.IMAGE_GENERATION,
    displayName: 'Flux Reimagine',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    isAsync: true,
    estimatedDuration: 45000,
  },
  textToIcon: {
    category: NodeCategory.IMAGE_GENERATION,
    displayName: 'Text to Icon',
    inputs: ['prompt-in'],
    outputs: ['output'],
    isAsync: true,
    estimatedDuration: 20000,
  },
  tripo3d: {
    category: NodeCategory.IMAGE_GENERATION,
    displayName: 'Tripo3D',
    inputs: ['prompt-in'],
    outputs: ['model-out'],
    isAsync: true,
    estimatedDuration: 120000,
  },

  // Image editing nodes
  creativeUpscale: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Creative Upscale',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    isAsync: true,
    estimatedDuration: 60000,
  },
  precisionUpscale: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Precision Upscale',
    inputs: ['image-in'],
    outputs: ['output'],
    isAsync: true,
    estimatedDuration: 45000,
  },
  relight: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Relight',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    isAsync: true,
    estimatedDuration: 40000,
  },
  removeBackground: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Remove Background',
    inputs: ['image-in'],
    outputs: ['output'],
    isAsync: true,
    estimatedDuration: 15000,
  },
  styleTransfer: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Style Transfer',
    inputs: ['image-in', 'reference-in', 'prompt-in'],
    outputs: ['output'],
    isAsync: true,
    estimatedDuration: 50000,
  },
  fluxImageExpand: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Flux Image Expand',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    isAsync: true,
    estimatedDuration: 45000,
  },
  seedreamExpand: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Seedream Expand',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    isAsync: true,
    estimatedDuration: 40000,
  },
  ideogramExpand: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Ideogram Expand',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    isAsync: true,
    estimatedDuration: 40000,
  },
  ideogramInpaint: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Ideogram Inpaint',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    isAsync: true,
    estimatedDuration: 40000,
  },
  skinEnhancer: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Skin Enhancer',
    inputs: ['image-in'],
    outputs: ['output'],
    isAsync: true,
    estimatedDuration: 30000,
  },
  changeCamera: {
    category: NodeCategory.IMAGE_EDITING,
    displayName: 'Change Camera',
    inputs: ['image-in', 'prompt-in'],
    outputs: ['output'],
    isAsync: true,
    estimatedDuration: 45000,
  },

  // Video generation nodes
  kling3: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Kling 3',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 180000,
  },
  kling3Omni: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Kling 3 Omni',
    inputs: ['prompt-in', 'image-in', 'video-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 180000,
  },
  kling3Motion: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Kling 3 Motion',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 180000,
  },
  klingElementsPro: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Kling Elements Pro',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 180000,
  },
  klingO1: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Kling O1',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 180000,
  },
  minimaxLive: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'MiniMax Live',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 120000,
  },
  wan26: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'WAN 2.6',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 150000,
  },
  seedance: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Seedance',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 180000,
  },
  ltxVideo2Pro: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'LTX Video 2 Pro',
    inputs: ['prompt-in', 'image-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 120000,
  },
  runwayGen45: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Runway Gen 4.5',
    inputs: ['prompt-in', 'image-in', 'video-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 200000,
  },
  runwayGen4Turbo: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Runway Gen 4 Turbo',
    inputs: ['prompt-in', 'image-in', 'video-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 150000,
  },
  runwayActTwo: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'Runway Act Two',
    inputs: ['video-in', 'character-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 180000,
  },
  pixVerseV5Transition: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'PixVerse V5 Transition',
    inputs: ['prompt-in', 'image-in', 'video-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 180000,
  },
  omniHuman: {
    category: NodeCategory.VIDEO_GENERATION,
    displayName: 'OmniHuman',
    inputs: ['prompt-in', 'image-in', 'audio-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 300000,
  },

  // Video editing nodes
  vfx: {
    category: NodeCategory.VIDEO_EDITING,
    displayName: 'VFX',
    inputs: ['video-in', 'prompt-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 120000,
  },
  creativeVideoUpscale: {
    category: NodeCategory.VIDEO_EDITING,
    displayName: 'Creative Video Upscale',
    inputs: ['video-in', 'prompt-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 180000,
  },
  precisionVideoUpscale: {
    category: NodeCategory.VIDEO_EDITING,
    displayName: 'Precision Video Upscale',
    inputs: ['video-in'],
    outputs: ['video-out'],
    isAsync: true,
    estimatedDuration: 150000,
  },

  // Audio generation nodes
  musicGeneration: {
    category: NodeCategory.AUDIO_GENERATION,
    displayName: 'Music Generation',
    inputs: ['prompt-in', 'audio-in'],
    outputs: ['audio-out'],
    isAsync: true,
    estimatedDuration: 60000,
  },
  soundEffects: {
    category: NodeCategory.AUDIO_GENERATION,
    displayName: 'Sound Effects',
    inputs: ['prompt-in'],
    outputs: ['audio-out'],
    isAsync: true,
    estimatedDuration: 30000,
  },
  audioIsolation: {
    category: NodeCategory.AUDIO_GENERATION,
    displayName: 'Audio Isolation',
    inputs: ['audio-in'],
    outputs: ['audio-out'],
    isAsync: true,
    estimatedDuration: 45000,
  },
  voiceover: {
    category: NodeCategory.AUDIO_GENERATION,
    displayName: 'Voiceover',
    inputs: ['text-in', 'audio-in'],
    outputs: ['audio-out'],
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
  return { text: data.text };
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
// Register all built-in executors
// ============================================================================

export function registerBuiltinExecutors(): void {
  // Input nodes
  registerExecutor('inputNode', inputNodeExecutor);
  registerExecutor('textNode', textNodeExecutor);
  registerExecutor('imageNode', imageNodeExecutor);
  registerExecutor('assetNode', assetNodeExecutor);

  // Vision nodes
  registerExecutor('imageAnalyzer', imageAnalyzerExecutor);
  registerExecutor('imageToPrompt', imageToPromptExecutor);
  registerExecutor('improvePrompt', improvePromptExecutor);
  registerExecutor('aiImageClassifier', aiImageClassifierExecutor);

  // Image generation
  registerExecutor('generator', generatorExecutor);

  // Image editing
  registerExecutor('creativeUpscale', creativeUpscaleExecutor);
  registerExecutor('precisionUpscale', precisionUpscaleExecutor);
  registerExecutor('removeBackground', removeBackgroundExecutor);

  // Output nodes
  registerExecutor('responseNode', responseNodeExecutor);
  registerExecutor('comment', commentExecutor);
  registerExecutor('router', routerExecutor);
}

// Auto-register on module load
registerBuiltinExecutors();

import * as logicExecutors from "./logicExecutors";
  registerExecutor("condition", logicExecutors.conditionExecutor);
  registerExecutor("iteration", logicExecutors.iterationExecutor);
  registerExecutor("variable", logicExecutors.variableExecutor);
  registerExecutor("socialPublisher", logicExecutors.socialPublisherExecutor);
  registerExecutor("cloudSync", logicExecutors.cloudSyncExecutor);

export default {
  getNodeMetadata,
  registerExecutor,
  getExecutor,
  hasExecutor,
  unregisterExecutor,
  registerBuiltinExecutors,
};
