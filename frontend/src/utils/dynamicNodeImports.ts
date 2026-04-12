/**
 * Dynamic node imports using React.lazy() for code splitting
 * This file centralizes all dynamic imports to make maintenance easier
 * and enables better chunk naming and prefetching strategies
 * 
 * NOTE: This file contains NO JSX to prevent build issues
 * All JSX components are imported from separate files
 */

import { createElement, lazy, type ComponentType } from 'react';
import { type NodeProps } from '@xyflow/react';

// Common nodes are imported directly to prevent React Flow "Couldn't create edge" 
// race conditions and improve initial canvas rendering performance.
import InputNode from '../nodes/InputNode';
import TextNode from '../nodes/TextNode';
import ImageNode from '../nodes/ImageNode';
import ResponseNode from '../nodes/ResponseNode';
import GeneratorNode from '../nodes/GeneratorNode';

/**
 * Wrapper for dynamic node imports with loading and error states
 * @param {any} NodeComponent - The component (lazy or regular)
 * @returns {ComponentType<NodeProps>} - Wrapper component ready for React Flow registration
 */
export function createDynamicNodeWrapper(NodeComponent: any): ComponentType<NodeProps> {
  // Import the DynamicNodeLoader component that contains the JSX
  const DynamicNodeLoader = lazy(() => import('../components/DynamicNodeLoader'));

  return function DynamicNodeWrapper(props: NodeProps) {
    return createElement(DynamicNodeLoader, {
      // If it's a lazy component, pass it as LazyComponent. 
      // If it's a regular component, we still wrap it for consistency in props injection.
      LazyComponent: NodeComponent && NodeComponent.$$typeof === Symbol.for('react.lazy') 
        ? NodeComponent 
        : lazy(() => Promise.resolve({ default: NodeComponent })),
      componentProps: props
    });
  };
}

/**
 * Prefetch a node component for better performance
 * @param {Function} importFunction - The dynamic import function
 */
export function prefetchNode(importFunction: () => Promise<any>) {
  if (typeof importFunction === 'function') {
    importFunction().catch((error: any) => {
      console.warn('Prefetch failed:', error);
    });
  }
}

// Complete implementation: All 50+ nodes for full code splitting
// Organized by category for better maintainability

// Input/Output Nodes
const AssetNode = lazy(() => (import('../nodes/AssetNode') as any).catch((error: any) => {
  console.error('Failed to load AssetNode:', error);
  throw error;
}));

const SourceMediaNode = lazy(() => (import('../nodes/SourceMediaNode') as any).catch((error: any) => {
  console.error('Failed to load SourceMediaNode:', error);
  throw error;
}));

const WorkflowNode = lazy(() => (import('../nodes/WorkflowNode') as any).catch((error: any) => {
  console.error('Failed to load WorkflowNode:', error);
  throw error;
}));

const ImageOutputNode = lazy(() => (import('../nodes/ImageOutputNode') as any).catch((error: any) => {
  console.error('Failed to load ImageOutputNode:', error);
  throw error;
}));

const VideoOutputNode = lazy(() => (import('../nodes/VideoOutputNode') as any).catch((error: any) => {
  console.error('Failed to load VideoOutputNode:', error);
  throw error;
}));

const SoundOutputNode = lazy(() => (import('../nodes/SoundOutputNode') as any).catch((error: any) => {
  console.error('Failed to load SoundOutputNode:', error);
  throw error;
}));

// Image Generation Nodes
const TextToIconNode = lazy(() => (import('../nodes/TextToIconNode') as any).catch((error: any) => {
  console.error('Failed to load TextToIconNode:', error);
  throw error;
}));

const ImageToPromptNode = lazy(() => (import('../nodes/ImageToPromptNode') as any).catch((error: any) => {
  console.error('Failed to load ImageToPromptNode:', error);
  throw error;
}));

const ImprovePromptNode = lazy(() => (import('../nodes/ImprovePromptNode') as any).catch((error: any) => {
  console.error('Failed to load ImprovePromptNode:', error);
  throw error;
}));

const AIImageClassifierNode = lazy(() => (import('../nodes/AIImageClassifierNode') as any).catch((error: any) => {
  console.error('Failed to load AIImageClassifierNode:', error);
  throw error;
}));

// Image Editing Nodes
const CreativeUpScaleNode = lazy(() => (import('../nodes/CreativeUpScaleNode') as any).catch((error: any) => {
  console.error('Failed to load CreativeUpScaleNode:', error);
  throw error;
}));

const PrecisionUpScaleNode = lazy(() => (import('../nodes/PrecisionUpScaleNode') as any).catch((error: any) => {
  console.error('Failed to load PrecisionUpScaleNode:', error);
  throw error;
}));

const RelightNode = lazy(() => (import('../nodes/RelightNode') as any).catch((error: any) => {
  console.error('Failed to load RelightNode:', error);
  throw error;
}));

const StyleTransferNode = lazy(() => (import('../nodes/StyleTransferNode') as any).catch((error: any) => {
  console.error('Failed to load StyleTransferNode:', error);
  throw error;
}));

const RemoveBackgroundNode = lazy(() => (import('../nodes/RemoveBackgroundNode') as any).catch((error: any) => {
  console.error('Failed to load RemoveBackgroundNode:', error);
  throw error;
}));

const FluxReimagineNode = lazy(() => (import('../nodes/FluxReimagineNode') as any).catch((error: any) => {
  console.error('Failed to load FluxReimagineNode:', error);
  throw error;
}));

const FluxImageExpandNode = lazy(() => (import('../nodes/FluxImageExpandNode') as any).catch((error: any) => {
  console.error('Failed to load FluxImageExpandNode:', error);
  throw error;
}));

const SeedreamExpandNode = lazy(() => (import('../nodes/SeedreamExpandNode') as any).catch((error: any) => {
  console.error('Failed to load SeedreamExpandNode:', error);
  throw error;
}));

const IdeogramExpandNode = lazy(() => (import('../nodes/IdeogramExpandNode') as any).catch((error: any) => {
  console.error('Failed to load IdeogramExpandNode:', error);
  throw error;
}));

const SkinEnhancerNode = lazy(() => (import('../nodes/SkinEnhancerNode') as any).catch((error: any) => {
  console.error('Failed to load SkinEnhancerNode:', error);
  throw error;
}));

const IdeogramInpaintNode = lazy(() => (import('../nodes/IdeogramInpaintNode') as any).catch((error: any) => {
  console.error('Failed to load IdeogramInpaintNode:', error);
  throw error;
}));

const ChangeCameraNode = lazy(() => (import('../nodes/ChangeCameraNode') as any).catch((error: any) => {
  console.error('Failed to load ChangeCameraNode:', error);
  throw error;
}));

// Video Generation Nodes
const Kling3Node = lazy(() => (import('../nodes/Kling3Node') as any).catch((error: any) => {
  console.error('Failed to load Kling3Node:', error);
  throw error;
}));

const Kling3OmniNode = lazy(() => (import('../nodes/Kling3OmniNode') as any).catch((error: any) => {
  console.error('Failed to load Kling3OmniNode:', error);
  throw error;
}));

const Kling3MotionControlNode = lazy(() => (import('../nodes/Kling3MotionControlNode') as any).catch((error: any) => {
  console.error('Failed to load Kling3MotionControlNode:', error);
  throw error;
}));

const KlingElementsProNode = lazy(() => (import('../nodes/KlingElementsProNode') as any).catch((error: any) => {
  console.error('Failed to load KlingElementsProNode:', error);
  throw error;
}));

const KlingO1Node = lazy(() => (import('../nodes/KlingO1Node') as any).catch((error: any) => {
  console.error('Failed to load KlingO1Node:', error);
  throw error;
}));

const MiniMaxLiveNode = lazy(() => (import('../nodes/MiniMaxLiveNode') as any).catch((error: any) => {
  console.error('Failed to load MiniMaxLiveNode:', error);
  throw error;
}));

const Wan26VideoNode = lazy(() => (import('../nodes/Wan26VideoNode') as any).catch((error: any) => {
  console.error('Failed to load Wan26VideoNode:', error);
  throw error;
}));

const SeedanceNode = lazy(() => (import('../nodes/SeedanceNode') as any).catch((error: any) => {
  console.error('Failed to load SeedanceNode:', error);
  throw error;
}));

const LtxVideo2ProNode = lazy(() => (import('../nodes/LtxVideo2ProNode') as any).catch((error: any) => {
  console.error('Failed to load LtxVideo2ProNode:', error);
  throw error;
}));

const RunwayGen45Node = lazy(() => (import('../nodes/RunwayGen45Node') as any).catch((error: any) => {
  console.error('Failed to load RunwayGen45Node:', error);
  throw error;
}));

const RunwayGen4TurboNode = lazy(() => (import('../nodes/RunwayGen4TurboNode') as any).catch((error: any) => {
  console.error('Failed to load RunwayGen4TurboNode:', error);
  throw error;
}));

const RunwayActTwoNode = lazy(() => (import('../nodes/RunwayActTwoNode') as any).catch((error: any) => {
  console.error('Failed to load RunwayActTwoNode:', error);
  throw error;
}));

const PixVerseV5TransitionNode = lazy(() => (import('../nodes/PixVerseV5TransitionNode') as any).catch((error: any) => {
  console.error('Failed to load PixVerseV5TransitionNode:', error);
  throw error;
}));

const PixVerseSoundEffectNode = lazy(() => (import('../nodes/PixVerseSoundEffectNode') as any).catch((error: any) => {
  console.error('Failed to load PixVerseSoundEffectNode:', error);
  throw error;
}));

const OmniHumanNode = lazy(() => (import('../nodes/OmniHumanNode') as any).catch((error: any) => {
  console.error('Failed to load OmniHumanNode:', error);
  throw error;
}));

const VfxNode = lazy(() => (import('../nodes/VfxNode') as any).catch((error: any) => {
  console.error('Failed to load VfxNode:', error);
  throw error;
}));

const CreativeVideoUpscaleNode = lazy(() => (import('../nodes/CreativeVideoUpscaleNode') as any).catch((error: any) => {
  console.error('Failed to load CreativeVideoUpscaleNode:', error);
  throw error;
}));

const PrecisionVideoUpscaleNode = lazy(() => (import('../nodes/PrecisionVideoUpscaleNode') as any).catch((error: any) => {
  console.error('Failed to load PrecisionVideoUpscaleNode:', error);
  throw error;
}));

const VideoImproveNode = lazy(() => (import('../nodes/VideoImproveNode') as any).catch((error: any) => {
  console.error('Failed to load VideoImproveNode:', error);
  throw error;
}));

// Audio Nodes
const MusicGenerationNode = lazy(() => (import('../nodes/MusicGenerationNode') as any).catch((error: any) => {
  console.error('Failed to load MusicGenerationNode:', error);
  throw error;
}));

const SoundEffectsNode = lazy(() => (import('../nodes/SoundEffectsNode') as any).catch((error: any) => {
  console.error('Failed to load SoundEffectsNode:', error);
  throw error;
}));

const AudioIsolationNode = lazy(() => (import('../nodes/AudioIsolationNode') as any).catch((error: any) => {
  console.error('Failed to load AudioIsolationNode:', error);
  throw error;
}));

const VoiceoverNode = lazy(() => (import('../nodes/VoiceoverNode') as any).catch((error: any) => {
  console.error('Failed to load VoiceoverNode:', error);
  throw error;
}));

// Utility Nodes
const AdaptedPromptNode = lazy(() => (import('../nodes/AdaptedPromptNode') as any).catch((error: any) => {
  console.error('Failed to load AdaptedPromptNode:', error);
  throw error;
}));

const LayerEditorNode = lazy(() => (import('../nodes/LayerEditorNode') as any).catch((error: any) => {
  console.error('Failed to load LayerEditorNode:', error);
  throw error;
}));

const CommentNode = lazy(() => (import('../nodes/CommentNode') as any).catch((error: any) => {
  console.error('Failed to load CommentNode:', error);
  throw error;
}));

const RouterNode = lazy(() => (import('../nodes/RouterNode') as any).catch((error: any) => {
  console.error('Failed to load RouterNode:', error);
  throw error;
}));

const GroupEditingNode = lazy(() => (import('../nodes/GroupEditingNode') as any).catch((error: any) => {
  console.error('Failed to load GroupEditingNode:', error);
  throw error;
}));

const FacialEditingNode = lazy(() => (import('../nodes/FacialEditingNode') as any).catch((error: any) => {
  console.error('Failed to load FacialEditingNode:', error);
  throw error;
}));

// Advanced Nodes
const ImageUniversalGeneratorNode = lazy(() => (import('../nodes/ImageUniversalGeneratorNode') as any).catch((error: any) => {
  console.error('Failed to load ImageUniversalGeneratorNode:', error);
  throw error;
}));

const VideoUniversalGeneratorNode = lazy(() => (import('../nodes/VideoUniversalGeneratorNode') as any).catch((error: any) => {
  console.error('Failed to load VideoUniversalGeneratorNode:', error);
  throw error;
}));

const QuiverTextToVectorGenerationNode = lazy(() => (import('../nodes/QuiverTextToVectorGenerationNode') as any).catch((error: any) => {
  console.error('Failed to load QuiverTextToVectorGenerationNode:', error);
  throw error;
}));

const QuiverImageToVectorGenerationNode = lazy(() => (import('../nodes/QuiverImageToVectorGenerationNode') as any).catch((error: any) => {
  console.error('Failed to load QuiverImageToVectorGenerationNode:', error);
  throw error;
}));

const Tripo3DNode = lazy(() => (import('../nodes/Tripo3DNode') as any).catch((error: any) => {
  console.error('Failed to load Tripo3DNode:', error);
  throw error;
}));

const TextElementNode = lazy(() => (import('../nodes/TextElementNode') as any).catch((error: any) => {
  console.error('Failed to load TextElementNode:', error);
  throw error;
}));

const ImageAnalyzerNode = lazy(() => (import('../nodes/ImageAnalyzerNode') as any).catch((error: any) => {
  console.error('Failed to load ImageAnalyzerNode:', error);
  throw error;
}));

// Export the lazy-loaded components for use in node registration

// Expanded Node Library
const ConditionNode = lazy(() => (import('../nodes/ConditionNode') as any).catch((error: any) => {
  console.error('Failed to load ConditionNode:', error);
  throw error;
}));

const IterationNode = lazy(() => (import('../nodes/IterationNode') as any).catch((error: any) => {
  console.error('Failed to load IterationNode:', error);
  throw error;
}));

const VariableNode = lazy(() => (import('../nodes/VariableNode') as any).catch((error: any) => {
  console.error('Failed to load VariableNode:', error);
  throw error;
}));

const SocialPublisherNode = lazy(() => (import('../nodes/SocialPublisherNode') as any).catch((error: any) => {
  console.error('Failed to load SocialPublisherNode:', error);
  throw error;
}));

const CloudSyncNode = lazy(() => (import('../nodes/CloudSyncNode') as any).catch((error: any) => {
  console.error('Failed to load CloudSyncNode:', error);
  throw error;
}));

export const dynamicNodes = {
  // Input/Output Nodes
  InputNode,
  TextNode,
  ImageNode,
  AssetNode,
  SourceMediaNode,
  WorkflowNode,
  ImageOutputNode,
  VideoOutputNode,
  SoundOutputNode,
  ResponseNode,
  
  // Image Generation Nodes
  GeneratorNode,
  TextToIconNode,
  ImageToPromptNode,
  ImprovePromptNode,
  AIImageClassifierNode,
  
  // Image Editing Nodes
  CreativeUpScaleNode,
  PrecisionUpScaleNode,
  RelightNode,
  StyleTransferNode,
  RemoveBackgroundNode,
  FluxReimagineNode,
  FluxImageExpandNode,
  SeedreamExpandNode,
  IdeogramExpandNode,
  SkinEnhancerNode,
  IdeogramInpaintNode,
  ChangeCameraNode,
  
  // Video Generation Nodes
  Kling3Node,
  Kling3OmniNode,
  Kling3MotionControlNode,
  KlingElementsProNode,
  KlingO1Node,
  MiniMaxLiveNode,
  Wan26VideoNode,
  SeedanceNode,
  LtxVideo2ProNode,
  RunwayGen45Node,
  RunwayGen4TurboNode,
  RunwayActTwoNode,
  PixVerseV5TransitionNode,
  PixVerseSoundEffectNode,
  OmniHumanNode,
  VfxNode,
  CreativeVideoUpscaleNode,
  PrecisionVideoUpscaleNode,
  VideoImproveNode,
  
  // Audio Nodes
  MusicGenerationNode,
  SoundEffectsNode,
  AudioIsolationNode,
  VoiceoverNode,
  
  // Utility Nodes
  AdaptedPromptNode,
  LayerEditorNode,
  CommentNode,
  RouterNode,
  GroupEditingNode,
  FacialEditingNode,
  
  // Advanced Nodes
  ImageUniversalGeneratorNode,
  VideoUniversalGeneratorNode,
  QuiverTextToVectorGenerationNode,
  QuiverImageToVectorGenerationNode,
  Tripo3DNode,
  TextElementNode,
  ImageAnalyzerNode,

  // Expanded Node Library
  ConditionNode,
  IterationNode,
  VariableNode,
  SocialPublisherNode,
  CloudSyncNode,
};

// Export prefetch functions for performance optimization
export const prefetchFunctions = {
  // Input/Output Nodes
  prefetchAssetNode: () => prefetchNode(() => import('../nodes/AssetNode')),
  prefetchSourceMediaNode: () => prefetchNode(() => import('../nodes/SourceMediaNode')),
  prefetchWorkflowNode: () => prefetchNode(() => import('../nodes/WorkflowNode')),
  prefetchImageOutputNode: () => prefetchNode(() => import('../nodes/ImageOutputNode')),
  prefetchVideoOutputNode: () => prefetchNode(() => import('../nodes/VideoOutputNode')),
  prefetchSoundOutputNode: () => prefetchNode(() => import('../nodes/SoundOutputNode')),
  
  // Image Generation Nodes
  prefetchTextToIconNode: () => prefetchNode(() => import('../nodes/TextToIconNode')),
  prefetchImageToPromptNode: () => prefetchNode(() => import('../nodes/ImageToPromptNode')),
  prefetchImprovePromptNode: () => prefetchNode(() => import('../nodes/ImprovePromptNode')),
  prefetchAIImageClassifierNode: () => prefetchNode(() => import('../nodes/AIImageClassifierNode')),
  
  // Image Editing Nodes
  prefetchCreativeUpScaleNode: () => prefetchNode(() => import('../nodes/CreativeUpScaleNode')),
  prefetchPrecisionUpScaleNode: () => prefetchNode(() => import('../nodes/PrecisionUpScaleNode')),
  prefetchRelightNode: () => prefetchNode(() => import('../nodes/RelightNode')),
  prefetchStyleTransferNode: () => prefetchNode(() => import('../nodes/StyleTransferNode')),
  prefetchRemoveBackgroundNode: () => prefetchNode(() => import('../nodes/RemoveBackgroundNode')),
  prefetchFluxReimagineNode: () => prefetchNode(() => import('../nodes/FluxReimagineNode')),
  prefetchFluxImageExpandNode: () => prefetchNode(() => import('../nodes/FluxImageExpandNode')),
  prefetchSeedreamExpandNode: () => prefetchNode(() => import('../nodes/SeedreamExpandNode')),
  prefetchIdeogramExpandNode: () => prefetchNode(() => import('../nodes/IdeogramExpandNode')),
  prefetchSkinEnhancerNode: () => prefetchNode(() => import('../nodes/SkinEnhancerNode')),
  prefetchIdeogramInpaintNode: () => prefetchNode(() => import('../nodes/IdeogramInpaintNode')),
  prefetchChangeCameraNode: () => prefetchNode(() => import('../nodes/ChangeCameraNode')),
  
  // Video Generation Nodes
  prefetchKling3Node: () => prefetchNode(() => import('../nodes/Kling3Node')),
  prefetchKling3OmniNode: () => prefetchNode(() => import('../nodes/Kling3OmniNode')),
  prefetchKling3MotionControlNode: () => prefetchNode(() => import('../nodes/Kling3MotionControlNode')),
  prefetchKlingElementsProNode: () => prefetchNode(() => import('../nodes/KlingElementsProNode')),
  prefetchKlingO1Node: () => prefetchNode(() => import('../nodes/KlingO1Node')),
  prefetchMiniMaxLiveNode: () => prefetchNode(() => import('../nodes/MiniMaxLiveNode')),
  prefetchWan26VideoNode: () => prefetchNode(() => import('../nodes/Wan26VideoNode')),
  prefetchSeedanceNode: () => prefetchNode(() => import('../nodes/SeedanceNode')),
  prefetchLtxVideo2ProNode: () => prefetchNode(() => import('../nodes/LtxVideo2ProNode')),
  prefetchRunwayGen45Node: () => prefetchNode(() => import('../nodes/RunwayGen45Node')),
  prefetchRunwayGen4TurboNode: () => prefetchNode(() => import('../nodes/RunwayGen4TurboNode')),
  prefetchRunwayActTwoNode: () => prefetchNode(() => import('../nodes/RunwayActTwoNode')),
  prefetchPixVerseV5TransitionNode: () => prefetchNode(() => import('../nodes/PixVerseV5TransitionNode')),
  prefetchPixVerseSoundEffectNode: () => prefetchNode(() => import('../nodes/PixVerseSoundEffectNode')),
  prefetchOmniHumanNode: () => prefetchNode(() => import('../nodes/OmniHumanNode')),
  prefetchVfxNode: () => prefetchNode(() => import('../nodes/VfxNode')),
  prefetchCreativeVideoUpscaleNode: () => prefetchNode(() => import('../nodes/CreativeVideoUpscaleNode')),
  prefetchPrecisionVideoUpscaleNode: () => prefetchNode(() => import('../nodes/PrecisionVideoUpscaleNode')),
  prefetchVideoImproveNode: () => prefetchNode(() => import('../nodes/VideoImproveNode')),
  
  // Audio Nodes
  prefetchMusicGenerationNode: () => prefetchNode(() => import('../nodes/MusicGenerationNode')),
  prefetchSoundEffectsNode: () => prefetchNode(() => import('../nodes/SoundEffectsNode')),
  prefetchAudioIsolationNode: () => prefetchNode(() => import('../nodes/AudioIsolationNode')),
  prefetchVoiceoverNode: () => prefetchNode(() => import('../nodes/VoiceoverNode')),
  
  // Utility Nodes
  prefetchAdaptedPromptNode: () => prefetchNode(() => import('../nodes/AdaptedPromptNode')),
  prefetchLayerEditorNode: () => prefetchNode(() => import('../nodes/LayerEditorNode')),
  prefetchCommentNode: () => prefetchNode(() => import('../nodes/CommentNode')),
  prefetchRouterNode: () => prefetchNode(() => import('../nodes/RouterNode')),
  prefetchGroupEditingNode: () => prefetchNode(() => import('../nodes/GroupEditingNode')),
  prefetchFacialEditingNode: () => prefetchNode(() => import('../nodes/FacialEditingNode')),
  
  // Advanced Nodes
  prefetchImageUniversalGeneratorNode: () => prefetchNode(() => import('../nodes/ImageUniversalGeneratorNode')),
  prefetchVideoUniversalGeneratorNode: () => prefetchNode(() => import('../nodes/VideoUniversalGeneratorNode')),
  prefetchQuiverTextToVectorGenerationNode: () => prefetchNode(() => import('../nodes/QuiverTextToVectorGenerationNode')),
  prefetchQuiverImageToVectorGenerationNode: () => prefetchNode(() => import('../nodes/QuiverImageToVectorGenerationNode')),
  prefetchTripo3DNode: () => prefetchNode(() => import('../nodes/Tripo3DNode')),
  prefetchTextElementNode: () => prefetchNode(() => import('../nodes/TextElementNode')),
  prefetchImageAnalyzerNode: () => prefetchNode(() => import('../nodes/ImageAnalyzerNode')),
};
