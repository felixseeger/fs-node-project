/**
 * Core node type definitions
 */

// Base node data shared across all node types
export interface BaseNodeData {
  label: string;
  isLoading?: boolean;
  error?: string | null;
  // Allow additional properties for flexible node data
  [key: string]: unknown;
}

// Input node types
export interface InputNodeData extends BaseNodeData {
  initialFields: string[];
  fieldValues: Record<string, string | string[]>;
  fieldLabels: Record<string, string>;
  imagesByField: Record<string, string[]>;
}

export interface TextNodeData extends BaseNodeData {
  text: string;
}

export interface ImageNodeData extends BaseNodeData {
  images: string[];
}

export interface AssetNodeData extends BaseNodeData {
  images: string[];
}

// LLM/Vision nodes
export interface ImageAnalyzerNodeData extends BaseNodeData {
  systemDirections: string;
  localPrompt: string;
  analysisResult: string;
  localImages: string[];
}

export interface ImageToPromptNodeData extends BaseNodeData {
  inputImagePreview: string | null;
  outputPrompt: string | null;
}

export interface ImprovePromptNodeData extends BaseNodeData {
  inputPrompt: string;
  outputPrompt: string | null;
  localType: 'image' | 'video';
  localLanguage: string;
}

export interface AIImageClassifierNodeData extends BaseNodeData {
  inputImagePreview: string | null;
  outputText: string | null;
  rawResult: unknown;
}

// Image generation nodes
export interface GeneratorNodeData extends BaseNodeData {
  generatorType?: 'default' | 'kora';
  inputImagePreview: string | null;
  inputPrompt: string;
  outputImage: string | null;
}

export interface FluxReimagineNodeData extends BaseNodeData {
  inputImagePreview: string | null;
  inputPrompt: string;
  outputImage: string | null;
  localImagination: 'vivid' | 'subtle';
  localAspect: string;
}

export interface TextToIconNodeData extends BaseNodeData {
  inputPrompt: string;
  outputImage: string | null;
  localStyle: string;
  localFormat: 'png' | 'svg';
  localNumInferenceSteps: number;
  localGuidanceScale: number;
}

// Image editing nodes
export interface CreativeUpscaleNodeData extends BaseNodeData {
  inputImagePreview: string | null;
  inputPrompt: string;
  outputImage: string | null;
  localScaleFactor: string;
  localOptimizedFor: string;
  localEngine: string;
  localCreativity: number;
  localHdr: number;
  localResemblance: number;
  localFractality: number;
}

export interface PrecisionUpscaleNodeData extends BaseNodeData {
  inputImagePreview: string | null;
  outputImage: string | null;
  localScaleFactor: string;
  localFlavor: string;
  localSharpen: number;
  localSmartGrain: number;
  localUltraDetail: number;
}

export interface RelightNodeData extends BaseNodeData {
  inputImagePreview: string | null;
  inputPrompt: string;
  outputImage: string | null;
  localLightMode: string;
  localStrength: number;
  localInterpolate: boolean;
  localChangeBg: boolean;
  localStyle: string;
  localPreserveDetails: boolean;
  localWhites: number;
  localBlacks: number;
  localBrightness: number;
  localContrast: number;
  localSaturation: number;
  localEngine: string;
  localTransferA: string;
  localTransferB: string;
  localFixedGen: boolean;
}

export interface RemoveBackgroundNodeData extends BaseNodeData {
  inputImagePreview: string | null;
  outputImage: string | null;
  outputHighRes: string | null;
  outputPreview: string | null;
  outputUrl: string | null;
  originalUrl: string | null;
}

export interface StyleTransferNodeData extends BaseNodeData {
  inputImagePreview: string | null;
  referenceImagePreview: string | null;
  inputPrompt: string;
  outputImage: string | null;
  localStyleStrength: number;
  localStructureStrength: number;
  localIsPortrait: boolean;
  localPortraitStyle: string;
  localPortraitBeautifier: string;
  localFlavor: string;
  localEngine: string;
  localFixedGen: boolean;
}

export interface ImageExpandNodeData extends BaseNodeData {
  inputImagePreview: string | null;
  inputPrompt: string;
  outputImage: string | null;
  localLeft: number;
  localRight: number;
  localTop: number;
  localBottom: number;
  localSeed?: string;
}

export interface SkinEnhancerNodeData extends BaseNodeData {
  inputImagePreview: string | null;
  outputImage: string | null;
  localMode: string;
  localSharpen: number;
  localSmartGrain: number;
  localSkinDetail: number;
  localOptimizedFor: string;
}

export interface ChangeCameraNodeData extends BaseNodeData {
  inputImagePreview: string | null;
  outputImage: string | null;
  localHorizontalAngle: number;
  localVerticalAngle: number;
  localZoom: number;
  localSeed: string;
}

// Video generation nodes
export interface VideoNodeData extends BaseNodeData {
  inputImagePreview: string | null;
  inputPrompt: string;
  inputNegativePrompt?: string;
  outputVideo: string | null;
  localModel?: string;
  localDuration: number | string;
  localAspectRatio?: string;
  localCfgScale?: number;
  localGenerateAudio?: boolean;
  localResolution?: string;
  localSeed?: number;
  // Additional properties for specific video nodes
  localOrientation?: string;
  localCameraMovement?: string;
  localRatio?: string;
  localCameraFixed?: boolean;
}

export interface PixVerseV5TransitionNodeData extends BaseNodeData {
  localStartImage: string | null;
  localEndImage: string | null;
  inputPrompt: string;
  outputVideo: string | null;
  localResolution: string;
  localDuration: number;
  localSeed: number;
}

export interface OmniHumanNodeData extends BaseNodeData {
  inputImagePreview: string | null;
  inputAudioUrl: string;
  inputPrompt: string;
  outputVideo: string | null;
  localResolution: string;
  localTurboMode: boolean;
}

// Video editing nodes
export interface VfxNodeData extends BaseNodeData {
  outputVideo: string | null;
  localFilterType: number;
  localFps: number;
  localBloomContrast: number;
  localMotionKernelSize: number;
  localMotionDecayFactor: number;
}

export interface VideoUpscaleNodeData extends BaseNodeData {
  outputVideo: string | null;
  localMode?: string;
  localResolution: string;
  localFlavor?: string;
  localCreativity?: number;
  localSharpen: number;
  localSmartGrain: number;
  localFpsBoost: boolean;
  localStrength?: number;
}

// Audio generation nodes
export interface MusicGenerationNodeData extends BaseNodeData {
  inputPrompt: string;
  outputAudio: string | null;
  localDuration: number;
}

export interface SoundEffectsNodeData extends BaseNodeData {
  inputPrompt: string;
  outputAudio: string | null;
  localDuration: number;
  localLoop: boolean;
  localPromptInfluence: number;
}

export interface AudioIsolationNodeData extends BaseNodeData {
  inputPrompt: string;
  localAudio: string;
  localVideo: string;
  outputAudio: string | null;
  localInputType: 'audio' | 'video';
  localRerankingCandidates: number;
  localPredictSpans: boolean;
  localSampleFps: number;
  localX1: number;
  localY1: number;
  localX2: number;
  localY2: number;
}

export interface VoiceoverNodeData extends BaseNodeData {
  inputPrompt: string;
  outputAudio: string | null;
  localVoiceId: string;
  localStability: number;
  localSimilarityBoost: number;
  localSpeed: number;
  localUseSpeakerBoost: boolean;
}

// Utility nodes
export interface LayerEditorNodeData extends BaseNodeData {
  // Layer editor specific data
}

export interface RouterNodeData extends BaseNodeData {
  outputs: Array<{ id: string; label: string }>;
}

export interface CommentNodeData extends BaseNodeData {
  text: string;
  isDone: boolean;
}

export interface ResponseNodeData extends BaseNodeData {
  outputImage: string | null;
  responseFields: string[];
}

// Union type for all node data
export type NodeData =
  | InputNodeData
  | TextNodeData
  | ImageNodeData
  | AssetNodeData
  | ImageAnalyzerNodeData
  | ImageToPromptNodeData
  | ImprovePromptNodeData
  | AIImageClassifierNodeData
  | GeneratorNodeData
  | FluxReimagineNodeData
  | TextToIconNodeData
  | CreativeUpscaleNodeData
  | PrecisionUpscaleNodeData
  | RelightNodeData
  | RemoveBackgroundNodeData
  | StyleTransferNodeData
  | ImageExpandNodeData
  | SkinEnhancerNodeData
  | ChangeCameraNodeData
  | VideoNodeData
  | PixVerseV5TransitionNodeData
  | OmniHumanNodeData
  | VfxNodeData
  | VideoUpscaleNodeData
  | MusicGenerationNodeData
  | SoundEffectsNodeData
  | AudioIsolationNodeData
  | VoiceoverNodeData
  | LayerEditorNodeData
  | RouterNodeData
  | CommentNodeData
  | ResponseNodeData;

// Node menu item
export interface NodeMenuItem {
  type: string;
  label: string;
  defaults: Partial<NodeData>;
}

// Node menu section
export interface NodeMenuSection {
  section: string;
  items: NodeMenuItem[];
}
