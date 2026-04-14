import React, { lazy } from 'react';

/**
 * Dynamic Node Registry for Code Splitting (Phase 7.2.1)
 *
 * This registry uses React.lazy() to split the application bundle,
 * ensuring node components are only downloaded when they are actually
 * used on the canvas or required by the workflow.
 */

const nodeRegistry: Record<string, React.LazyExoticComponent<any>> = {
  // Common Utilities & Inputs
  SourceMediaNode: lazy(() => import('./SourceMediaNode')),
  AssetNode: lazy(() => import('./AssetNode')),
  InputNode: lazy(() => import('./InputNode')),
  OutputNode: lazy(() => import('./NodeOutput').then(m => ({ default: m.NodeOutput }))),
  ConditionNode: lazy(() => import('./ConditionNode')),
  IterationNode: lazy(() => import('./IterationNode')),
  RouterNode: lazy(() => import('./RouterNode')),
  VariableNode: lazy(() => import('./VariableNode')),
  ResponseNode: lazy(() => import('./ResponseNode')),
  WorkflowNode: lazy(() => import('./WorkflowNode')),

  // Image Generation & Editing
  GeneratorNode: lazy(() => import('./GeneratorNode')),
  ImageNode: lazy(() => import('./ImageNode')),
  ImageUniversalGeneratorNode: lazy(() => import('./ImageUniversalGeneratorNode')),
  ImageAnalyzerNode: lazy(() => import('./ImageAnalyzerNode')),
  ImageOutputNode: lazy(() => import('./ImageOutputNode')),
  ImageSegmentationNode: lazy(() => import('./ImageSegmentationNode')),
  ImageToPromptNode: lazy(() => import('./ImageToPromptNode')),
  FluxImageExpandNode: lazy(() => import('./FluxImageExpandNode')),
  FluxReimagineNode: lazy(() => import('./FluxReimagineNode')),
  IdeogramExpandNode: lazy(() => import('./IdeogramExpandNode')),
  IdeogramInpaintNode: lazy(() => import('./IdeogramInpaintNode')),
  RecraftGenerateNode: lazy(() => import('./RecraftGenerateNode')),
  RecraftImageToImageNode: lazy(() => import('./RecraftImageToImageNode')),
  RecraftRemoveBackgroundNode: lazy(() => import('./RecraftRemoveBackgroundNode')),
  RecraftUpscaleNode: lazy(() => import('./RecraftUpscaleNode')),
  RecraftVectorizeNode: lazy(() => import('./RecraftVectorizeNode')),
  RelightNode: lazy(() => import('./RelightNode')),
  RemoveBackgroundNode: lazy(() => import('./RemoveBackgroundNode')),
  StyleTransferNode: lazy(() => import('./StyleTransferNode')),
  CreativeUpScaleNode: lazy(() => import('./CreativeUpScaleNode')),
  PrecisionUpScaleNode: lazy(() => import('./PrecisionUpScaleNode')),
  SkinEnhancerNode: lazy(() => import('./SkinEnhancerNode')),
  GroupEditingNode: lazy(() => import('./GroupEditingNode')),
  FacialEditingNode: lazy(() => import('./FacialEditingNode')),
  SeedreamExpandNode: lazy(() => import('./SeedreamExpandNode')),

  // Video Generation & Processing
  VideoUniversalGeneratorNode: lazy(() => import('./VideoUniversalGeneratorNode')),
  VideoOutputNode: lazy(() => import('./VideoOutputNode')),
  VideoImproveNode: lazy(() => import('./VideoImproveNode')),
  Kling3Node: lazy(() => import('./Kling3Node')),
  Kling3MotionControlNode: lazy(() => import('./Kling3MotionControlNode')),
  Kling3OmniNode: lazy(() => import('./Kling3OmniNode')),
  KlingElementsProNode: lazy(() => import('./KlingElementsProNode')),
  KlingO1Node: lazy(() => import('./KlingO1Node')),
  LtxVideoNode: lazy(() => import('./LtxVideoNode')),
  LtxVideo2ProNode: lazy(() => import('./LtxVideo2ProNode')),
  Wan26VideoNode: lazy(() => import('./Wan26VideoNode')),
  RunwayActTwoNode: lazy(() => import('./RunwayActTwoNode')),
  RunwayGen45Node: lazy(() => import('./RunwayGen45Node')),
  RunwayGen4TurboNode: lazy(() => import('./RunwayGen4TurboNode')),
  MiniMaxLiveNode: lazy(() => import('./MiniMaxLiveNode')),
  CorridorKeyNode: lazy(() => import('./CorridorKeyNode')),
  LayerNode: lazy(() => import('./LayerNode')),
  LayerEditorNode: lazy(() => import('./LayerEditorNode')),

  // Audio Generation & Processing
  AudioUniversalGeneratorNode: lazy(() => import('./AudioUniversalGeneratorNode')),
  AudioIsolationNode: lazy(() => import('./AudioIsolationNode')),
  MusicGenerationNode: lazy(() => import('./MusicGenerationNode')),
  VoiceoverNode: lazy(() => import('./VoiceoverNode')),
  VoiceInputNode: lazy(() => import('./VoiceInputNode')),
  SoundEffectsNode: lazy(() => import('./SoundEffectsNode')),
  SoundOutputNode: lazy(() => import('./SoundOutputNode')),
  StrudelNode: lazy(() => import('./StrudelNode')),
  PixVerseSoundEffectNode: lazy(() => import('./PixVerseSoundEffectNode')),
  PixVerseV5TransitionNode: lazy(() => import('./PixVerseV5TransitionNode')),
  SeedanceNode: lazy(() => import('./SeedanceNode')),

  // Text & Logic
  TextLLMNode: lazy(() => import('./TextLLMNode')),
  TextNode: lazy(() => import('./TextNode')),
  TextElementNode: lazy(() => import('./TextElementNode')),
  ImageElementNode: lazy(() => import('./ImageElementNode')),
  AdaptedPromptNode: lazy(() => import('./AdaptedPromptNode')),

  // 3D & Vectors
  Tripo3DNode: lazy(() => import('./Tripo3DNode')),
  TextToIconNode: lazy(() => import('./TextToIconNode')),
  QuiverImageToVectorGenerationNode: lazy(() => import('./QuiverImageToVectorGenerationNode')),
  QuiverTextToVectorGenerationNode: lazy(() => import('./QuiverTextToVectorGenerationNode')),

  // Utilities
  SocialPublisherNode: lazy(() => import('./SocialPublisherNode')),
  CloudSyncNode: lazy(() => import('./CloudSyncNode')),
  CommentNode: lazy(() => import('./CommentNode')),
  AIImageClassifierNode: lazy(() => import('./AIImageClassifierNode')),
};

export const getNodeComponent = (nodeType: string): React.LazyExoticComponent<any> | null => {
  const Component = nodeRegistry[nodeType];
  if (!Component) {
    console.warn(`[NodeRegistry] Component for node type '${nodeType}' not found.`);
    return null;
  }
  return Component;
};

export const registeredNodeTypes = Object.keys(nodeRegistry);
