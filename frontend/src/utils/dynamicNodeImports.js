/**
 * Dynamic node imports using React.lazy() for code splitting
 * This file centralizes all dynamic imports to make maintenance easier
 * and enables better chunk naming and prefetching strategies
 * 
 * NOTE: This file contains NO JSX to prevent build issues
 * All JSX components are imported from separate files
 */

import { createElement, lazy } from 'react';

/**
 * Wrapper for dynamic node imports with loading and error states
 * @param {React.LazyExoticComponent} LazyComponent - The lazy-loaded component
 * @param {Object} props - Props to pass to the component
 * @returns {React.ComponentType} - Wrapper component ready for React Flow registration
 */
export function createDynamicNodeWrapper(LazyComponent) {
  // Import the DynamicNodeLoader component that contains the JSX
  const DynamicNodeLoader = lazy(() => import('../components/DynamicNodeLoader.jsx'));

  return function DynamicNodeWrapper(props) {
    return createElement(DynamicNodeLoader, {
      LazyComponent: LazyComponent,
      componentProps: props
    });
  };
}

/**
 * Prefetch a node component for better performance
 * @param {Function} importFunction - The dynamic import function
 */
export function prefetchNode(importFunction) {
  if (typeof importFunction === 'function') {
    importFunction().catch(error => {
      console.warn('Prefetch failed:', error);
    });
  }
}

// Complete implementation: All 50+ nodes for full code splitting
// Organized by category for better maintainability

// Input/Output Nodes
const InputNode = lazy(() => import('../nodes/InputNode').catch(error => {
  console.error('Failed to load InputNode:', error);
  throw error;
}));

const TextNode = lazy(() => import('../nodes/TextNode').catch(error => {
  console.error('Failed to load TextNode:', error);
  throw error;
}));

const ImageNode = lazy(() => import('../nodes/ImageNode').catch(error => {
  console.error('Failed to load ImageNode:', error);
  throw error;
}));

const AssetNode = lazy(() => import('../nodes/AssetNode').catch(error => {
  console.error('Failed to load AssetNode:', error);
  throw error;
}));

const SourceMediaNode = lazy(() => import('../nodes/SourceMediaNode').catch(error => {
  console.error('Failed to load SourceMediaNode:', error);
  throw error;
}));

const WorkflowNode = lazy(() => import('../nodes/WorkflowNode').catch(error => {
  console.error('Failed to load WorkflowNode:', error);
  throw error;
}));

const ImageOutputNode = lazy(() => import('../nodes/ImageOutputNode').catch(error => {
  console.error('Failed to load ImageOutputNode:', error);
  throw error;
}));

const VideoOutputNode = lazy(() => import('../nodes/VideoOutputNode').catch(error => {
  console.error('Failed to load VideoOutputNode:', error);
  throw error;
}));

const SoundOutputNode = lazy(() => import('../nodes/SoundOutputNode').catch(error => {
  console.error('Failed to load SoundOutputNode:', error);
  throw error;
}));

const ResponseNode = lazy(() => import('../nodes/ResponseNode').catch(error => {
  console.error('Failed to load ResponseNode:', error);
  throw error;
}));

// Image Generation Nodes
const GeneratorNode = lazy(() => import('../nodes/GeneratorNode').catch(error => {
  console.error('Failed to load GeneratorNode:', error);
  throw error;
}));

const TextToIconNode = lazy(() => import('../nodes/TextToIconNode').catch(error => {
  console.error('Failed to load TextToIconNode:', error);
  throw error;
}));

const ImageToPromptNode = lazy(() => import('../nodes/ImageToPromptNode').catch(error => {
  console.error('Failed to load ImageToPromptNode:', error);
  throw error;
}));

const ImprovePromptNode = lazy(() => import('../nodes/ImprovePromptNode').catch(error => {
  console.error('Failed to load ImprovePromptNode:', error);
  throw error;
}));

const AIImageClassifierNode = lazy(() => import('../nodes/AIImageClassifierNode').catch(error => {
  console.error('Failed to load AIImageClassifierNode:', error);
  throw error;
}));

// Image Editing Nodes
const CreativeUpScaleNode = lazy(() => import('../nodes/CreativeUpScaleNode').catch(error => {
  console.error('Failed to load CreativeUpScaleNode:', error);
  throw error;
}));

const PrecisionUpScaleNode = lazy(() => import('../nodes/PrecisionUpScaleNode').catch(error => {
  console.error('Failed to load PrecisionUpScaleNode:', error);
  throw error;
}));

const RelightNode = lazy(() => import('../nodes/RelightNode').catch(error => {
  console.error('Failed to load RelightNode:', error);
  throw error;
}));

const StyleTransferNode = lazy(() => import('../nodes/StyleTransferNode').catch(error => {
  console.error('Failed to load StyleTransferNode:', error);
  throw error;
}));

const RemoveBackgroundNode = lazy(() => import('../nodes/RemoveBackgroundNode').catch(error => {
  console.error('Failed to load RemoveBackgroundNode:', error);
  throw error;
}));

const FluxReimagineNode = lazy(() => import('../nodes/FluxReimagineNode').catch(error => {
  console.error('Failed to load FluxReimagineNode:', error);
  throw error;
}));

const FluxImageExpandNode = lazy(() => import('../nodes/FluxImageExpandNode').catch(error => {
  console.error('Failed to load FluxImageExpandNode:', error);
  throw error;
}));

const SeedreamExpandNode = lazy(() => import('../nodes/SeedreamExpandNode').catch(error => {
  console.error('Failed to load SeedreamExpandNode:', error);
  throw error;
}));

const IdeogramExpandNode = lazy(() => import('../nodes/IdeogramExpandNode').catch(error => {
  console.error('Failed to load IdeogramExpandNode:', error);
  throw error;
}));

const SkinEnhancerNode = lazy(() => import('../nodes/SkinEnhancerNode').catch(error => {
  console.error('Failed to load SkinEnhancerNode:', error);
  throw error;
}));

const IdeogramInpaintNode = lazy(() => import('../nodes/IdeogramInpaintNode').catch(error => {
  console.error('Failed to load IdeogramInpaintNode:', error);
  throw error;
}));

const ChangeCameraNode = lazy(() => import('../nodes/ChangeCameraNode').catch(error => {
  console.error('Failed to load ChangeCameraNode:', error);
  throw error;
}));

// Video Generation Nodes
const Kling3Node = lazy(() => import('../nodes/Kling3Node').catch(error => {
  console.error('Failed to load Kling3Node:', error);
  throw error;
}));

const Kling3OmniNode = lazy(() => import('../nodes/Kling3OmniNode').catch(error => {
  console.error('Failed to load Kling3OmniNode:', error);
  throw error;
}));

const Kling3MotionControlNode = lazy(() => import('../nodes/Kling3MotionControlNode').catch(error => {
  console.error('Failed to load Kling3MotionControlNode:', error);
  throw error;
}));

const KlingElementsProNode = lazy(() => import('../nodes/KlingElementsProNode').catch(error => {
  console.error('Failed to load KlingElementsProNode:', error);
  throw error;
}));

const KlingO1Node = lazy(() => import('../nodes/KlingO1Node').catch(error => {
  console.error('Failed to load KlingO1Node:', error);
  throw error;
}));

const MiniMaxLiveNode = lazy(() => import('../nodes/MiniMaxLiveNode').catch(error => {
  console.error('Failed to load MiniMaxLiveNode:', error);
  throw error;
}));

const Wan26VideoNode = lazy(() => import('../nodes/Wan26VideoNode').catch(error => {
  console.error('Failed to load Wan26VideoNode:', error);
  throw error;
}));

const SeedanceNode = lazy(() => import('../nodes/SeedanceNode').catch(error => {
  console.error('Failed to load SeedanceNode:', error);
  throw error;
}));

const LtxVideo2ProNode = lazy(() => import('../nodes/LtxVideo2ProNode').catch(error => {
  console.error('Failed to load LtxVideo2ProNode:', error);
  throw error;
}));

const RunwayGen45Node = lazy(() => import('../nodes/RunwayGen45Node').catch(error => {
  console.error('Failed to load RunwayGen45Node:', error);
  throw error;
}));

const RunwayGen4TurboNode = lazy(() => import('../nodes/RunwayGen4TurboNode').catch(error => {
  console.error('Failed to load RunwayGen4TurboNode:', error);
  throw error;
}));

const RunwayActTwoNode = lazy(() => import('../nodes/RunwayActTwoNode').catch(error => {
  console.error('Failed to load RunwayActTwoNode:', error);
  throw error;
}));

const PixVerseV5Node = lazy(() => import('../nodes/PixVerseV5Node').catch(error => {
  console.error('Failed to load PixVerseV5Node:', error);
  throw error;
}));

const PixVerseV5TransitionNode = lazy(() => import('../nodes/PixVerseV5TransitionNode').catch(error => {
  console.error('Failed to load PixVerseV5TransitionNode:', error);
  throw error;
}));

const PixVerseTextToVideoNode = lazy(() => import('../nodes/PixVerseTextToVideoNode').catch(error => {
  console.error('Failed to load PixVerseTextToVideoNode:', error);
  throw error;
}));

const PixVerseImageToVideoNode = lazy(() => import('../nodes/PixVerseImageToVideoNode').catch(error => {
  console.error('Failed to load PixVerseImageToVideoNode:', error);
  throw error;
}));

const PixVerseSoundEffectNode = lazy(() => import('../nodes/PixVerseSoundEffectNode').catch(error => {
  console.error('Failed to load PixVerseSoundEffectNode:', error);
  throw error;
}));

const OmniHumanNode = lazy(() => import('../nodes/OmniHumanNode').catch(error => {
  console.error('Failed to load OmniHumanNode:', error);
  throw error;
}));

const VfxNode = lazy(() => import('../nodes/VfxNode').catch(error => {
  console.error('Failed to load VfxNode:', error);
  throw error;
}));

const CreativeVideoUpscaleNode = lazy(() => import('../nodes/CreativeVideoUpscaleNode').catch(error => {
  console.error('Failed to load CreativeVideoUpscaleNode:', error);
  throw error;
}));

const PrecisionVideoUpscaleNode = lazy(() => import('../nodes/PrecisionVideoUpscaleNode').catch(error => {
  console.error('Failed to load PrecisionVideoUpscaleNode:', error);
  throw error;
}));

const VideoImproveNode = lazy(() => import('../nodes/VideoImproveNode').catch(error => {
  console.error('Failed to load VideoImproveNode:', error);
  throw error;
}));

// Audio Nodes
const MusicGenerationNode = lazy(() => import('../nodes/MusicGenerationNode').catch(error => {
  console.error('Failed to load MusicGenerationNode:', error);
  throw error;
}));

const SoundEffectsNode = lazy(() => import('../nodes/SoundEffectsNode').catch(error => {
  console.error('Failed to load SoundEffectsNode:', error);
  throw error;
}));

const AudioIsolationNode = lazy(() => import('../nodes/AudioIsolationNode').catch(error => {
  console.error('Failed to load AudioIsolationNode:', error);
  throw error;
}));

const VoiceoverNode = lazy(() => import('../nodes/VoiceoverNode').catch(error => {
  console.error('Failed to load VoiceoverNode:', error);
  throw error;
}));

// Utility Nodes
const AdaptedPromptNode = lazy(() => import('../nodes/AdaptedPromptNode').catch(error => {
  console.error('Failed to load AdaptedPromptNode:', error);
  throw error;
}));

const LayerEditorNode = lazy(() => import('../nodes/LayerEditorNode').catch(error => {
  console.error('Failed to load LayerEditorNode:', error);
  throw error;
}));

const CommentNode = lazy(() => import('../nodes/CommentNode').catch(error => {
  console.error('Failed to load CommentNode:', error);
  throw error;
}));

const RouterNode = lazy(() => import('../nodes/RouterNode').catch(error => {
  console.error('Failed to load RouterNode:', error);
  throw error;
}));

const GroupEditingNode = lazy(() => import('../nodes/GroupEditingNode').catch(error => {
  console.error('Failed to load GroupEditingNode:', error);
  throw error;
}));

const FacialEditingNode = lazy(() => import('../nodes/FacialEditingNode').catch(error => {
  console.error('Failed to load FacialEditingNode:', error);
  throw error;
}));

// Advanced Nodes
const ImageUniversalGeneratorNode = lazy(() => import('../nodes/ImageUniversalGeneratorNode').catch(error => {
  console.error('Failed to load ImageUniversalGeneratorNode:', error);
  throw error;
}));

const VideoUniversalGeneratorNode = lazy(() => import('../nodes/VideoUniversalGeneratorNode').catch(error => {
  console.error('Failed to load VideoUniversalGeneratorNode:', error);
  throw error;
}));

const QuiverTextToVectorGenerationNode = lazy(() => import('../nodes/QuiverTextToVectorGenerationNode').catch(error => {
  console.error('Failed to load QuiverTextToVectorGenerationNode:', error);
  throw error;
}));

const QuiverImageToVectorGenerationNode = lazy(() => import('../nodes/QuiverImageToVectorGenerationNode').catch(error => {
  console.error('Failed to load QuiverImageToVectorGenerationNode:', error);
  throw error;
}));

const Tripo3DNode = lazy(() => import('../nodes/Tripo3DNode').catch(error => {
  console.error('Failed to load Tripo3DNode:', error);
  throw error;
}));

const TextElementNode = lazy(() => import('../nodes/TextElementNode').catch(error => {
  console.error('Failed to load TextElementNode:', error);
  throw error;
}));

const ImageAnalyzerNode = lazy(() => import('../nodes/ImageAnalyzerNode').catch(error => {
  console.error('Failed to load ImageAnalyzerNode:', error);
  throw error;
}));

// Export the lazy-loaded components for use in node registration
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
  PixVerseV5Node,
  PixVerseV5TransitionNode,
  PixVerseTextToVideoNode,
  PixVerseImageToVideoNode,
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
};

// Export prefetch functions for performance optimization
export const prefetchFunctions = {
  // Input/Output Nodes
  prefetchInputNode: () => prefetchNode(() => import('../nodes/InputNode')),
  prefetchTextNode: () => prefetchNode(() => import('../nodes/TextNode')),
  prefetchImageNode: () => prefetchNode(() => import('../nodes/ImageNode')),
  prefetchAssetNode: () => prefetchNode(() => import('../nodes/AssetNode')),
  prefetchSourceMediaNode: () => prefetchNode(() => import('../nodes/SourceMediaNode')),
  prefetchWorkflowNode: () => prefetchNode(() => import('../nodes/WorkflowNode')),
  prefetchImageOutputNode: () => prefetchNode(() => import('../nodes/ImageOutputNode')),
  prefetchVideoOutputNode: () => prefetchNode(() => import('../nodes/VideoOutputNode')),
  prefetchSoundOutputNode: () => prefetchNode(() => import('../nodes/SoundOutputNode')),
  prefetchResponseNode: () => prefetchNode(() => import('../nodes/ResponseNode')),
  
  // Image Generation Nodes
  prefetchGeneratorNode: () => prefetchNode(() => import('../nodes/GeneratorNode')),
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
  prefetchPixVerseV5Node: () => prefetchNode(() => import('../nodes/PixVerseV5Node')),
  prefetchPixVerseV5TransitionNode: () => prefetchNode(() => import('../nodes/PixVerseV5TransitionNode')),
  prefetchPixVerseTextToVideoNode: () => prefetchNode(() => import('../nodes/PixVerseTextToVideoNode')),
  prefetchPixVerseImageToVideoNode: () => prefetchNode(() => import('../nodes/PixVerseImageToVideoNode')),
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

