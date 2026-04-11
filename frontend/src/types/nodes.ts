/**
 * Node Types for FS Node Project
 * 
 * Comprehensive type system for workflow nodes including all node data interfaces,
 * handle types, and workflow node definitions. Inspired by NodeBanana but adapted
 * for FS Node Project's architecture and 63+ node types.
 */

import { Node } from "@xyflow/react";

/**
 * Base interface for all node data
 * Common properties shared across all node types
 * Extends Record<string, unknown> for @xyflow/react Node<Data> generic constraint.
 */
export interface BaseNodeData extends Record<string, unknown> {
  id: string;
  label: string;
  status?: NodeStatus;
  error?: string | null;
  progress?: number; // 0-100
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
  _settingsPanelHeight?: number; // Internal: tracked height for settings panel
}

/**
 * Creative UpScale Node
 */
export interface CreativeUpScaleNodeData extends BaseNodeData {
  type: "creativeUpScale";
  image: string | null;
  scaleFactor?: number;
  algorithm?: "esrgan" | "waifu2x" | "realesrgan";
  output?: string | null;
  originalDimensions?: { width: number; height: number };
  upscaledDimensions?: { width: number; height: number };
}

/**
 * Flux Reimagine Node
 */
export interface FluxReimagineNodeData extends BaseNodeData {
  type: "fluxReimagine";
  image: string | null;
  prompt?: string;
  output?: string | null;
}

/**
 * Text to Icon Node
 */
export interface TextToIconNodeData extends BaseNodeData {
  type: "textToIcon";
  prompt: string;
  output?: string | null;
}

/**
 * Union type for all possible node data types
 */
export type NodeData =
  | ImageInputNodeData
  | VideoInputNodeData
  | AudioInputNodeData
  | TextNodeData
  | PromptNodeData
  | GeneratorNodeData
  | ImageAnalyzerNodeData
  | ImageToPromptNodeData
  | CreativeUpScaleNodeData
  | FluxReimagineNodeData
  | TextToIconNodeData
  | UpScaleNodeData
  | VideoGenerationNodeData
  | AudioGenerationNodeData
  | OutputNodeData
  | RouterNodeData
  | SwitchNodeData
  | ConditionalSwitchNodeData
  | ArrayNodeData
  | GroupNodeData
  | AnnotationNodeData
  | WorkflowNodeData;

/**
 * Node execution status
 * Represents the current state of a node during workflow execution
 */
export type NodeStatus = "idle" | "loading" | "complete" | "error" | "skipped" | "paused";

/**
 * All available node types in the FS Node Project workflow editor
 * Comprehensive list covering all 63+ node types
 */
export type NodeType =
  | "input" | "text" | "image" | "video" | "audio" | "asset"
  | "generator" | "fluxReimagine" | "textToIcon"
  | "creativeUpScale" | "precisionUpScale" | "relight" | "styleTransfer"
  | "removeBackground" | "fluxImageExpand" | "seedreamExpand" | "ideogramExpand"
  | "skinEnhancer" | "changeCamera" | "ideogramInpaint"
  | "kling3" | "kling3Omni" | "kling3MotionControl" | "klingElementsPro"
  | "klingO1" | "miniMaxLive" | "wan26Video" | "seedance"
  | "ltxVideo2Pro" | "runwayGen45" | "runwayGen4Turbo" | "runwayActTwo"
  | "pixVerseV5Transition" | "omniHuman"
  | "vfx" | "creativeVideoUpScale" | "precisionVideoUpScale"
  | "musicGeneration" | "soundEffects" | "audioIsolation" | "voiceover"
  | "imageAnalyzer" | "imageToPrompt" | "improvePrompt" | "aiImageClassifier"
  | "adaptedPrompt" | "promptConstructor" | "autoPrompt"
  | "response" | "output" | "soundOutput" | "videoOutput"
  | "layerEditor" | "router" | "comment" | "annotation"
  | "groupEditing" | "sourceMedia" | "updateAsset" | "quiverTextToVector"
  | "quiverImageToVector" | "tripo3D" | "glbViewer" | "easeCurve"
  | "splitGrid" | "switch" | "conditionalSwitch" | "array"
  | "workflow" | "workflowSettings" | "projectSettings";

/**
 * Image Input Node - Loads/uploads images into the workflow
 */
export interface ImageInputNodeData extends BaseNodeData {
  type: "image";
  image: string | null; // Base64 data URL or blob URL
  imageRef?: string; // External image reference for storage optimization
  filename: string | null;
  dimensions: { width: number; height: number } | null;
  aspectRatio?: string; // e.g., "16:9", "1:1"
  isOptional?: boolean;
  mimeType?: string;
}

/**
 * Video Input Node - Loads/uploads video files into the workflow
 */
export interface VideoInputNodeData extends BaseNodeData {
  type: "video";
  video: string | null; // Base64 data URL or blob URL
  videoRef?: string; // External video reference
  filename: string | null;
  duration: number | null; // Duration in seconds
  dimensions: { width: number; height: number } | null;
  format: string | null; // MIME type (video/mp4, video/webm, etc.)
  isOptional?: boolean;
  thumbnail?: string; // Base64 thumbnail
}

/**
 * Audio Input Node - Loads/uploads audio files into the workflow
 */
export interface AudioInputNodeData extends BaseNodeData {
  type: "audio";
  audioFile: string | null; // Base64 data URL of the audio file
  audioFileRef?: string; // External audio reference
  filename: string | null;
  duration: number | null; // Duration in seconds
  format: string | null; // MIME type (audio/mp3, audio/wav, etc.)
  isOptional?: boolean;
  waveform?: string; // Base64 waveform visualization
}

/**
 * Text Input Node - Text input for prompts and other text data
 */
export interface TextNodeData extends BaseNodeData {
  type: "text";
  text: string;
  variableName?: string; // Optional variable name for templating
  isOptional?: boolean;
  multiline?: boolean;
  maxLength?: number;
}

/**
 * Prompt Node - Specialized text input for AI generation prompts
 */
export interface PromptNodeData extends BaseNodeData {
  type: "prompt";
  prompt: string;
  variableName?: string; // For use in PromptConstructor templates
  isOptional?: boolean;
  template?: string; // Optional prompt template
  parameters?: Record<string, string>; // Template parameters
}

/**
 * Generator Node - Core image generation node
 */
export interface GeneratorNodeData extends BaseNodeData {
  type: "generator";
  prompt: string;
  negativePrompt?: string;
  model?: string; // e.g., "nano-banana-2", "kora-reality"
  aspectRatio?: string;
  resolution?: string;
  numImages?: number;
  seed?: number | null;
  guidanceScale?: number;
  steps?: number;
  output?: string[]; // Generated image URLs
  generationId?: string; // For tracking generations
}

/**
 * Image Analysis Node - AI-powered image analysis
 */
export interface ImageAnalyzerNodeData extends BaseNodeData {
  type: "imageAnalyzer";
  image: string | null; // Input image to analyze
  analysis?: string; // Analysis result
  model?: string; // Analysis model (e.g., "claude-sonnet-vision")
  analysisType?: "general" | "technical" | "aesthetic" | "content";
  confidence?: number; // Confidence score 0-1
}

/**
 * Image to Prompt Node - Reverse image to prompt generation
 */
export interface ImageToPromptNodeData extends BaseNodeData {
  type: "imageToPrompt";
  image: string | null; // Input image
  prompt?: string; // Generated prompt
  model?: string; // Model used for generation
  style?: string; // Target style (e.g., "photorealistic", "anime")
  confidence?: number; // Confidence score 0-1
}

/**
 * Upscale Nodes - Image upscaling with different algorithms
 */
export interface UpScaleNodeData extends BaseNodeData {
  type: "creativeUpScale" | "precisionUpScale";
  image: string | null; // Input image
  scaleFactor?: number; // 2x, 4x, etc.
  algorithm?: "esrgan" | "waifu2x" | "realesrgan";
  output?: string | null; // Upscaled image
  originalDimensions?: { width: number; height: number };
  upscaledDimensions?: { width: number; height: number };
}

/**
 * Video Generation Nodes - Various video generation models
 */
export interface VideoGenerationNodeData extends BaseNodeData {
  type: "kling3" | "kling3Omni" | "kling3MotionControl" | "klingElementsPro" |
        "klingO1" | "miniMaxLive" | "wan26Video" | "seedance" |
        "ltxVideo2Pro" | "runwayGen45" | "runwayGen4Turbo" | "runwayActTwo" |
        "pixVerseV5Transition" | "omniHuman";
  
  prompt: string;
  negativePrompt?: string;
  model?: string; // Specific model variant
  aspectRatio?: string;
  duration?: number; // Video duration in seconds
  motionIntensity?: number; // 0-1 for motion control
  cameraMovement?: string; // For motion control
  output?: string | null; // Generated video URL
  thumbnail?: string; // Base64 thumbnail
}

/**
 * Callbacks injected by the canvas for node runtime behavior
 */
export interface NodeCanvasCallbacks {
  onUpdate?: (nodeId: string, patch: Record<string, unknown>) => void;
  resolveInput?: (nodeId: string, handleId: string) => unknown;
  hasConnection?: (nodeId: string, handleId: string) => boolean;
  getConnectionInfo?: (
    nodeId: string,
    handleId: string
  ) => { nodeLabel?: string; handle?: string } | null | undefined;
  onUnlink?: (nodeId: string, handleId: string) => void;
  onDisconnectNode?: (nodeId: string) => void;
  onCreateNode?: (
    nodeType: string,
    dataPatch: Record<string, unknown>,
    sourceHandle?: string,
    targetHandle?: string
  ) => void;
}

/**
 * Audio Generation Nodes
 */
export interface AudioGenerationNodeData extends BaseNodeData {
  type: "musicGeneration" | "soundEffects" | "voiceover";
  
  prompt: string;
  duration?: number; // Duration in seconds
  style?: string; // Musical style or sound effect category
  mood?: string; // Mood/emotion for music
  voice?: string; // Voice type for voiceover
  language?: string; // Language code
  output?: string | null; // Generated audio URL
  waveform?: string; // Base64 waveform
  /** Runtime: completed audio URL (music / effects nodes) */
  outputAudio?: string | null;
  /** Runtime: last error message */
  outputError?: string | null;
  /** Local prompt when not fully wired from InputNode */
  inputPrompt?: string;
  /** Local duration override (e.g. music slider) */
  localDuration?: number;
  /** Change to trigger generate from parent/workflow */
  triggerGenerate?: string | number | null;
}

/**
 * Output Nodes - Display and output nodes
 */
export interface OutputNodeData extends BaseNodeData {
  type: "response" | "output" | "soundOutput" | "videoOutput";
  
  inputs?: any[]; // Array of input values
  displayMode?: "grid" | "list" | "single";
  showLabels?: boolean;
  autoScroll?: boolean;
  maxItems?: number;
  /** Audio URL for sound output node */
  outputAudio?: string | null;
  /** Runtime error */
  outputError?: string | null;
  /** Loading state */
  isLoading?: boolean;
  /** Embedded workflow metadata (Node Banana) */
  nodeBananaWorkflow?: {
    version?: string;
    nodes?: unknown[];
    edges?: unknown[];
    providers?: string[];
    timestamp?: string;
    metadata?: Record<string, unknown>;
  };
}

/**
 * Router Node - Conditional routing
 */
export interface RouterNodeData extends BaseNodeData {
  type: "router";
  
  condition?: string; // Condition expression
  routes: Array<{
    id: string;
    condition: string;
    label: string;
    active: boolean;
  }>;
  defaultRoute?: string;
}

/**
 * Switch Node - Multi-way branching
 */
export interface SwitchNodeData extends BaseNodeData {
  type: "switch";
  
  inputValue?: any;
  cases: Array<{
    id: string;
    value: any;
    label: string;
    active: boolean;
  }>;
  defaultCase?: string;
}

/**
 * Conditional Switch Node - Advanced conditional logic
 */
export interface ConditionalSwitchNodeData extends BaseNodeData {
  type: "conditionalSwitch";
  
  conditions: Array<{
    id: string;
    expression: string;
    label: string;
    active: boolean;
  }>;
  defaultCondition?: string;
  evaluationMode?: "first-match" | "best-match";
}

/**
 * Array Node - Collection and iteration
 */
export interface ArrayNodeData extends BaseNodeData {
  type: "array";
  
  items: any[];
  itemType?: string;
  maxItems?: number;
  allowDuplicates?: boolean;
  currentIndex?: number;
  iterationMode?: "sequential" | "parallel" | "random";
}

/**
 * Group Node - Node grouping
 */
export interface GroupNodeData extends BaseNodeData {
  type: "group";
  
  label: string;
  collapsed?: boolean;
  color?: string;
  nodeIds: string[]; // IDs of nodes in this group
  position?: { x: number; y: number };
  dimensions?: { width: number; height: number };
}

/**
 * Annotation/Comment Node - Documentation
 */
export interface AnnotationNodeData extends BaseNodeData {
  type: "annotation" | "comment";
  
  content: string;
  color?: string;
  size?: "small" | "medium" | "large";
  position?: "top" | "bottom" | "left" | "right";
}

/**
 * Workflow Node - Top-level workflow container
 */
export interface WorkflowNodeData extends BaseNodeData {
  type: "workflow";
  
  name: string;
  description?: string;
  version: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
  connectionCount: number;
  thumbnail?: string;
  tags?: string[];
  isPublic?: boolean;
}

/**
 * Extended Node type that includes React Flow node properties
 */
export interface WorkflowNode<T extends BaseNodeData = BaseNodeData> extends Node<T> {
  type: NodeType;
  data: T;
  style?: React.CSSProperties;
  className?: string;
  selected?: boolean;
  draggable?: boolean;
  connectable?: boolean;
  deletable?: boolean;
}

/**
 * Type guard for checking node types
 */
export function isNodeType<T extends NodeType>(node: Node, type: T): node is WorkflowNode<BaseNodeData> & { type: T } {
  return node.type === type;
}

/**
 * Get node status with proper type inference
 */
export function getNodeStatus(node: Node): NodeStatus {
  return (node.data as BaseNodeData)?.status ?? "idle";
}

/**
 * Set node status with proper typing
 */
export function setNodeStatus(node: Node, status: NodeStatus): Node {
  return {
    ...node,
    data: {
      ...node.data,
      status
    }
  };
}

/**
 * Node execution context
 */
export interface NodeExecutionContext {
  nodeId: string;
  workflowId: string;
  executionId: string;
  timestamp: number;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  status: NodeStatus;
  error?: Error;
  progress: number; // 0-100
  metadata?: Record<string, unknown>;
}

/**
 * Node execution result
 */
export interface NodeExecutionResult {
  success: boolean;
  outputs?: Record<string, any>;
  error?: Error;
  durationMs: number;
  timestamp: string;
  nodeId: string;
  executionId: string;
}

/**
 * Workflow template interface
 */
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  nodes: WorkflowNode[];
  edges: any[];
  thumbnail?: string;
  tags: string[];
  category: string;
  isPublic: boolean;
  downloadCount: number;
  likeCount: number;
}

/**
 * Node dimension utilities
 */
export interface NodeDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * Calculate aspect ratio from dimensions
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * Format aspect ratio as string (e.g., "16:9")
 */
export function formatAspectRatio(width: number, height: number): string {
  const ratio = calculateAspectRatio(width, height);
  // Simplify to common ratios
  if (Math.abs(ratio - 1) < 0.01) return "1:1";
  if (Math.abs(ratio - 1.777) < 0.05) return "16:9";
  if (Math.abs(ratio - 1.333) < 0.05) return "4:3";
  if (Math.abs(ratio - 2.333) < 0.1) return "7:3";
  if (Math.abs(ratio - 0.5625) < 0.05) return "9:16";
  
  // Calculate simplified ratio
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const simplified = gcd(Math.round(width), Math.round(height));
  return `${Math.round(width / simplified)}:${Math.round(height / simplified)}`;
}

/**
 * Parse aspect ratio string to number
 */
export function parseAspectRatio(ratioString: string): number {
  if (!ratioString.includes(':')) return 1;
  const [width, height] = ratioString.split(':').map(Number);
  return width / height;
}
