import { useCallback, useRef, useMemo, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import InputNode from './nodes/InputNode';
import TextNode from './nodes/TextNode';
import ImageNode from './nodes/ImageNode';
import AssetNode from './nodes/AssetNode';
import ImageAnalyzerNode from './nodes/ImageAnalyzerNode';
import GeneratorNode from './nodes/GeneratorNode';
import CreativeUpScaleNode from './nodes/CreativeUpScaleNode';
import PrecisionUpScaleNode from './nodes/PrecisionUpScaleNode';
import RelightNode from './nodes/RelightNode';
import StyleTransferNode from './nodes/StyleTransferNode';
import RemoveBackgroundNode from './nodes/RemoveBackgroundNode';
import FluxReimagineNode from './nodes/FluxReimagineNode';
import FluxImageExpandNode from './nodes/FluxImageExpandNode';
import SeedreamExpandNode from './nodes/SeedreamExpandNode';
import IdeogramExpandNode from './nodes/IdeogramExpandNode';
import SkinEnhancerNode from './nodes/SkinEnhancerNode';
import IdeogramInpaintNode from './nodes/IdeogramInpaintNode';
import ChangeCameraNode from './nodes/ChangeCameraNode';
import Kling3Node from './nodes/Kling3Node';
import Kling3OmniNode from './nodes/Kling3OmniNode';
import Kling3MotionControlNode from './nodes/Kling3MotionControlNode';
import KlingElementsProNode from './nodes/KlingElementsProNode';
import KlingO1Node from './nodes/KlingO1Node';
import MiniMaxLiveNode from './nodes/MiniMaxLiveNode';
import Wan26VideoNode from './nodes/Wan26VideoNode';
import SeedanceNode from './nodes/SeedanceNode';
import LtxVideo2ProNode from './nodes/LtxVideo2ProNode';
import RunwayGen45Node from './nodes/RunwayGen45Node';
import RunwayGen4TurboNode from './nodes/RunwayGen4TurboNode';
import RunwayActTwoNode from './nodes/RunwayActTwoNode';
import PixVerseV5Node from './nodes/PixVerseV5Node';
import PixVerseV5TransitionNode from './nodes/PixVerseV5TransitionNode';
import OmniHumanNode from './nodes/OmniHumanNode';
import VfxNode from './nodes/VfxNode';
import CreativeVideoUpscaleNode from './nodes/CreativeVideoUpscaleNode';
import PrecisionVideoUpscaleNode from './nodes/PrecisionVideoUpscaleNode';
import TextToIconNode from './nodes/TextToIconNode';
import ImageToPromptNode from './nodes/ImageToPromptNode';
import ImprovePromptNode from './nodes/ImprovePromptNode';
import AIImageClassifierNode from './nodes/AIImageClassifierNode';
import MusicGenerationNode from './nodes/MusicGenerationNode';
import SoundEffectsNode from './nodes/SoundEffectsNode';
import AudioIsolationNode from './nodes/AudioIsolationNode';
import VoiceoverNode from './nodes/VoiceoverNode';
import ResponseNode from './nodes/ResponseNode';
import AdaptedPromptNode from './nodes/AdaptedPromptNode';
import LayerEditorNode from './nodes/LayerEditorNode';
import WorkflowsPage from './WorkflowsPage';
import ProfilePage from './ProfilePage';
import WorkflowSettingsPage from './WorkflowSettingsPage';
import AuthPage from './AuthPage';
import TopBar from './TopBar';
import EditorTopBar from './EditorTopBar';
import GooeyNodesMenu from './GooeyNodesMenu';
import { isValidConnection, getHandleColor, getHandleDataType } from './utils/handleTypes';

let nodeIdCounter = 0;
const nextId = () => `node_${++nodeIdCounter}`;

const NODE_MENU = [
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
    ],
  }
];

const defaultNodes = [
  {
    id: 'input-1',
    type: 'inputNode',
    position: { x: 50, y: 100 },
    data: {
      label: 'Request - Inputs',
      initialFields: ['prompt', 'image_urls', 'aspect_ratio', 'resolution', 'num_images'],
      fieldValues: {},
      fieldLabels: {},
      imagesByField: {},
    },
  },
  {
    id: 'response-1',
    type: 'response',
    position: { x: 900, y: 100 },
    data: { label: 'Response · Output', outputImage: null, isLoading: false, responseFields: [] },
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [workflows, setWorkflows] = useState([]);
  const [activeWorkflowId, setActiveWorkflowId] = useState(null);
  const [editorMode, setEditorMode] = useState('node-editor');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const activeWorkflowName = workflows.find((w) => w.id === activeWorkflowId)?.name || 'Untitled';

  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef(null);
  const edgesRef = useRef(edges);
  edgesRef.current = edges;
  const analyzeResolvers = useRef({});
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  const nodeTypes = useMemo(
    () => ({
      inputNode: InputNode,
      textNode: TextNode,
      imageNode: ImageNode,
      assetNode: AssetNode,
      imageAnalyzer: ImageAnalyzerNode,
      generator: GeneratorNode,
      creativeUpscale: CreativeUpScaleNode,
      precisionUpscale: PrecisionUpScaleNode,
      relight: RelightNode,
      styleTransfer: StyleTransferNode,
      removeBackground: RemoveBackgroundNode,
      fluxReimagine: FluxReimagineNode,
      fluxImageExpand: FluxImageExpandNode,
      seedreamExpand: SeedreamExpandNode,
      ideogramExpand: IdeogramExpandNode,
      skinEnhancer: SkinEnhancerNode,
      ideogramInpaint: IdeogramInpaintNode,
      changeCamera: ChangeCameraNode,
      kling3: Kling3Node,
      kling3Omni: Kling3OmniNode,
      kling3Motion: Kling3MotionControlNode,
      klingElementsPro: KlingElementsProNode,
      klingO1: KlingO1Node,
      minimaxLive: MiniMaxLiveNode,
      wan26: Wan26VideoNode,
      seedance: SeedanceNode,
      ltxVideo2Pro: LtxVideo2ProNode,
      runwayGen45: RunwayGen45Node,
      runwayGen4Turbo: RunwayGen4TurboNode,
      runwayActTwo: RunwayActTwoNode,
      pixVerseV5: PixVerseV5Node,
      pixVerseV5Transition: PixVerseV5TransitionNode,
      omniHuman: OmniHumanNode,
      vfx: VfxNode,
      creativeVideoUpscale: CreativeVideoUpscaleNode,
      precisionVideoUpscale: PrecisionVideoUpscaleNode,
      textToIcon: TextToIconNode,
      imageToPrompt: ImageToPromptNode,
      improvePrompt: ImprovePromptNode,
      aiImageClassifier: AIImageClassifierNode,
      musicGeneration: MusicGenerationNode,
      soundEffects: SoundEffectsNode,
      audioIsolation: AudioIsolationNode,
      voiceover: VoiceoverNode,
      response: ResponseNode,
      adaptedPrompt: AdaptedPromptNode,
      layerEditor: LayerEditorNode,
    }),
    []
  );

  // Resolve input data from connected edges
  const resolveInput = useCallback((nodeId, handleId) => {
    const currentEdges = edgesRef.current;
    const currentNodes = nodesRef.current;

    const incoming = currentEdges.filter(
      (e) => e.target === nodeId && e.targetHandle === handleId
    );
    if (incoming.length === 0) return null;

    const results = [];
    for (const edge of incoming) {
      const sourceNode = currentNodes.find((n) => n.id === edge.source);
      if (!sourceNode) continue;

      const sd = sourceNode.data;
      const sh = edge.sourceHandle;

      if (sourceNode.type === 'inputNode') {
        const val = sd.fieldValues?.[sh];
        if (val !== undefined) {
          if (Array.isArray(val)) results.push(...val);
          else results.push(val);
        }
      } else if (sourceNode.type === 'textNode') {
        if (sd.text) results.push(sd.text);
      } else if (sourceNode.type === 'imageNode') {
        if (sd.images?.length) results.push(...sd.images);
      } else if (sourceNode.type === 'imageAnalyzer') {
        if (sh === 'analysis-out' && sd.analysisResult) results.push(sd.analysisResult);
        if (sh === 'image-out' && sd.localImages?.length) results.push(...sd.localImages);
      } else if (sourceNode.type === 'generator') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'creativeUpscale') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'precisionUpscale') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
      } else if (sourceNode.type === 'relight') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'styleTransfer') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'removeBackground') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
      } else if (sourceNode.type === 'fluxReimagine') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'textToIcon') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'imageToPrompt') {
        if (sh === 'prompt-out' && sd.outputPrompt) results.push(sd.outputPrompt);
      } else if (sourceNode.type === 'improvePrompt') {
        if (sh === 'prompt-out' && sd.outputPrompt) results.push(sd.outputPrompt);
      } else if (sourceNode.type === 'aiImageClassifier') {
        if (sh === 'text-out' && sd.outputText) results.push(sd.outputText);
      } else if (sourceNode.type === 'musicGeneration') {
        if (sh === 'output-audio' && sd.outputAudio) results.push(sd.outputAudio);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'soundEffects') {
        if (sh === 'output-audio' && sd.outputAudio) results.push(sd.outputAudio);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'audioIsolation') {
        if (sh === 'output-audio' && sd.outputAudio) results.push(sd.outputAudio);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'voiceover') {
        if (sh === 'output-audio' && sd.outputAudio) results.push(sd.outputAudio);
      } else if (sourceNode.type === 'fluxImageExpand') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'seedreamExpand') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'ideogramExpand') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'skinEnhancer') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
      } else if (sourceNode.type === 'ideogramInpaint') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'changeCamera') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
      } else if (sourceNode.type === 'kling3') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'kling3Omni') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'kling3Motion') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'klingElementsPro') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'klingO1') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'minimaxLive') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'wan26') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'seedance') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'ltxVideo2Pro') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'runwayGen45') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'runwayGen4Turbo') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'runwayActTwo') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
      } else if (sourceNode.type === 'pixVerseV5') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'pixVerseV5Transition') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'omniHuman') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'vfx') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
      } else if (sourceNode.type === 'creativeVideoUpscale') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
      } else if (sourceNode.type === 'precisionVideoUpscale') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
      } else if (sourceNode.type === 'adaptedPrompt' && sh === 'prompt-out') {
        if (sd.adaptedPrompt) results.push(sd.adaptedPrompt);
      }
    }

    const dataType = getHandleDataType(handleId);
    if (dataType === 'image') return results;
    if (results.length === 1) return results[0];
    return results.length > 0 ? results.join('\n') : null;
  }, []);

  const hasConnection = useCallback((nodeId, handleId) => {
    return edgesRef.current.some(
      (e) => e.target === nodeId && e.targetHandle === handleId
    );
  }, []);

  const getConnectionInfo = useCallback((nodeId, handleId) => {
    const edge = edgesRef.current.find(
      (e) => e.target === nodeId && e.targetHandle === handleId
    );
    if (!edge) return null;
    const sourceNode = nodesRef.current.find((n) => n.id === edge.source);
    return {
      nodeLabel: sourceNode?.data?.label || edge.source,
      handle: edge.sourceHandle,
    };
  }, []);

  const updateNodeData = useCallback(
    (nodeId, patch) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n
        )
      );
    },
    [setNodes]
  );

  const nodesWithCallbacks = useMemo(() => {
    return nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        onUpdate: updateNodeData,
        resolveInput,
        hasConnection,
        getConnectionInfo,
        onAnalyzeComplete: (nodeId) => {
          if (analyzeResolvers.current[nodeId]) {
            analyzeResolvers.current[nodeId]();
            delete analyzeResolvers.current[nodeId];
          }
        },
        onAddToInput: (fieldType, targetNodeId, targetHandle) => {
          const inputNode = nodesRef.current.find((nd) => nd.type === 'inputNode');
          if (!inputNode) return;
          const fields = inputNode.data.initialFields || [];
          if (!fields.includes(fieldType)) {
            updateNodeData(inputNode.id, {
              initialFields: [...fields, fieldType],
            });
          }
          const newEdge = {
            id: `e-${inputNode.id}-${fieldType}-${targetNodeId}-${targetHandle}`,
            source: inputNode.id,
            sourceHandle: fieldType,
            target: targetNodeId,
            targetHandle: targetHandle,
            style: { stroke: getHandleColor(fieldType), strokeWidth: 2 },
          };
          setEdges((eds) => addEdge(newEdge, eds));
        },
        onUnlink: (targetNodeId, targetHandle) => {
          setEdges((eds) =>
            eds.filter(
              (e) => !(e.target === targetNodeId && e.targetHandle === targetHandle)
            )
          );
        },
        onDisconnectNode: (nodeId) => {
          setEdges((eds) =>
            eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
          );
        },
      },
    }));
  }, [nodes, edges, updateNodeData, resolveInput, hasConnection, getConnectionInfo, setEdges]);

  const onConnect = useCallback(
    (connection) => {
      const edgeColor = getHandleColor(connection.sourceHandle);
      const newEdge = {
        ...connection,
        id: `e-${connection.source}-${connection.sourceHandle}-${connection.target}-${connection.targetHandle}`,
        style: { stroke: edgeColor, strokeWidth: 2 },
        type: 'default',
      };
      setEdges((eds) => addEdge(newEdge, eds));

      if (connection.target) {
        const targetNode = nodesRef.current.find((n) => n.id === connection.target);
        if (targetNode?.type === 'response') {
          const sourceNode = nodesRef.current.find((n) => n.id === connection.source);
          const existingFields = targetNode.data.responseFields || [];
          const newField = {
            id: `${connection.source}-${connection.sourceHandle}`,
            label: connection.sourceHandle,
            source: {
              nodeLabel: sourceNode?.data.label || connection.source,
              handle: connection.sourceHandle,
            },
            color: edgeColor,
          };
          if (!existingFields.find((f) => f.id === newField.id)) {
            updateNodeData(connection.target, {
              responseFields: [...existingFields, newField],
            });
          }
        }
      }
    },
    [setEdges, updateNodeData]
  );

  const onEdgesDelete = useCallback(
    (deletedEdges) => {
      for (const edge of deletedEdges) {
        const targetNode = nodesRef.current.find((n) => n.id === edge.target);
        if (targetNode?.type === 'response') {
          const fieldId = `${edge.source}-${edge.sourceHandle}`;
          const fields = targetNode.data.responseFields || [];
          updateNodeData(edge.target, {
            responseFields: fields.filter((f) => f.id !== fieldId),
          });
        }
      }
    },
    [updateNodeData]
  );

  const addNode = useCallback(
    (type, defaults) => {
      const id = nextId();
      const newNode = {
        id,
        type,
        position: { x: 350 + Math.random() * 200, y: 100 + Math.random() * 300 },
        data: { ...defaults },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  // Global generate: run analyzers first, then generators
  const [isRunning, setIsRunning] = useState(false);
  const handleRunWorkflow = useCallback(async () => {
    setIsRunning(true);

    // Step 1: Trigger all imageAnalyzer nodes and wait for them to complete
    const analyzers = nodesRef.current.filter((n) => n.type === 'imageAnalyzer' || n.type === 'aiImageClassifier');
    if (analyzers.length > 0) {
      const analyzePromises = analyzers.map((analyzer) => {
        return new Promise((resolve) => {
          // Store resolver — will be called by onAnalyzeComplete
          analyzeResolvers.current[analyzer.id] = resolve;
          // Trigger the analysis
          updateNodeData(analyzer.id, { triggerAnalyze: Date.now() });
        });
      });

      // Add a safety timeout (60s) so we don't hang forever
      const timeout = new Promise((resolve) => setTimeout(resolve, 60000));
      await Promise.race([Promise.all(analyzePromises), timeout]);
    }

    // Step 1.5: Trigger all imageToPrompt nodes and wait for them to complete since they output text
    const imageToPrompts = nodesRef.current.filter((n) => n.type === 'imageToPrompt');
    if (imageToPrompts.length > 0) {
      for (const ipt of imageToPrompts) {
        updateNodeData(ipt.id, { triggerGenerate: Date.now() });
      }
      await new Promise((r) => setTimeout(r, 4000));
    }

    // Step 1.6: Trigger all improvePrompt nodes
    const improvePrompts = nodesRef.current.filter((n) => n.type === 'improvePrompt');
    if (improvePrompts.length > 0) {
      for (const ip of improvePrompts) {
        updateNodeData(ip.id, { triggerGenerate: Date.now() });
      }
      await new Promise((r) => setTimeout(r, 4000));
    }

    // Step 2: Trigger all generator nodes after analysis is done
    const generators = nodesRef.current.filter((n) => n.type === 'generator');
    for (const gen of generators) {
      updateNodeData(gen.id, { triggerGenerate: Date.now() });
    }

    // Step 3: Trigger all creativeUpscale nodes
    const upscalers = nodesRef.current.filter((n) => n.type === 'creativeUpscale');
    for (const us of upscalers) {
      updateNodeData(us.id, { triggerGenerate: Date.now() });
    }

    // Step 4: Trigger all precisionUpscale nodes
    const precisionNodes = nodesRef.current.filter((n) => n.type === 'precisionUpscale');
    for (const pn of precisionNodes) {
      updateNodeData(pn.id, { triggerGenerate: Date.now() });
    }

    // Step 5: Trigger all relight nodes
    const relightNodes = nodesRef.current.filter((n) => n.type === 'relight');
    for (const rn of relightNodes) {
      updateNodeData(rn.id, { triggerGenerate: Date.now() });
    }

    // Step 6: Trigger all styleTransfer nodes
    const styleTransferNodes = nodesRef.current.filter((n) => n.type === 'styleTransfer');
    for (const st of styleTransferNodes) {
      updateNodeData(st.id, { triggerGenerate: Date.now() });
    }

    // Step 7: Trigger all removeBackground nodes
    const removeBgNodes = nodesRef.current.filter((n) => n.type === 'removeBackground');
    for (const rb of removeBgNodes) {
      updateNodeData(rb.id, { triggerGenerate: Date.now() });
    }

    // Step 8: Trigger all fluxReimagine nodes
    const reimagineNodes = nodesRef.current.filter((n) => n.type === 'fluxReimagine');
    for (const fr of reimagineNodes) {
      updateNodeData(fr.id, { triggerGenerate: Date.now() });
    }

    // Step 8.5: Trigger all textToIcon nodes
    const textToIconNodes = nodesRef.current.filter((n) => n.type === 'textToIcon');
    for (const tti of textToIconNodes) {
      updateNodeData(tti.id, { triggerGenerate: Date.now() });
    }

    // Step 9: Trigger all fluxImageExpand nodes
    const expandNodes = nodesRef.current.filter((n) => n.type === 'fluxImageExpand');
    for (const en of expandNodes) {
      updateNodeData(en.id, { triggerGenerate: Date.now() });
    }

    // Step 10: Trigger all seedreamExpand nodes
    const seedreamNodes = nodesRef.current.filter((n) => n.type === 'seedreamExpand');
    for (const sn of seedreamNodes) {
      updateNodeData(sn.id, { triggerGenerate: Date.now() });
    }

    // Step 11: Trigger all ideogramExpand nodes
    const ideogramNodes = nodesRef.current.filter((n) => n.type === 'ideogramExpand');
    for (const in2 of ideogramNodes) {
      updateNodeData(in2.id, { triggerGenerate: Date.now() });
    }

    // Step 12: Trigger all skinEnhancer nodes
    const skinNodes = nodesRef.current.filter((n) => n.type === 'skinEnhancer');
    for (const sk of skinNodes) {
      updateNodeData(sk.id, { triggerGenerate: Date.now() });
    }

    // Step 13: Trigger all ideogramInpaint nodes
    const inpaintNodes = nodesRef.current.filter((n) => n.type === 'ideogramInpaint');
    for (const ip of inpaintNodes) {
      updateNodeData(ip.id, { triggerGenerate: Date.now() });
    }

    // Step 14: Trigger all changeCamera nodes
    const changeCameraNodes = nodesRef.current.filter((n) => n.type === 'changeCamera');
    for (const cc of changeCameraNodes) {
      updateNodeData(cc.id, { triggerGenerate: Date.now() });
    }

    // Step 15: Trigger all kling3 nodes
    const kling3Nodes = nodesRef.current.filter((n) => n.type === 'kling3');
    for (const k3 of kling3Nodes) {
      updateNodeData(k3.id, { triggerGenerate: Date.now() });
    }

    // Step 16: Trigger all kling3Omni nodes
    const kling3OmniNodes = nodesRef.current.filter((n) => n.type === 'kling3Omni');
    for (const k3o of kling3OmniNodes) {
      updateNodeData(k3o.id, { triggerGenerate: Date.now() });
    }

    // Step 17: Trigger all kling3Motion nodes
    const kling3MotionNodes = nodesRef.current.filter((n) => n.type === 'kling3Motion');
    for (const km of kling3MotionNodes) {
      updateNodeData(km.id, { triggerGenerate: Date.now() });
    }

    // Step 18: Trigger all klingElementsPro nodes
    const klingElementsProNodes = nodesRef.current.filter((n) => n.type === 'klingElementsPro');
    for (const kep of klingElementsProNodes) {
      updateNodeData(kep.id, { triggerGenerate: Date.now() });
    }

    // Step 19: Trigger all klingO1 nodes
    const klingO1Nodes = nodesRef.current.filter((n) => n.type === 'klingO1');
    for (const ko1 of klingO1Nodes) {
      updateNodeData(ko1.id, { triggerGenerate: Date.now() });
    }

    // Step 20: Trigger all minimaxLive nodes
    const minimaxLiveNodes = nodesRef.current.filter((n) => n.type === 'minimaxLive');
    for (const ml of minimaxLiveNodes) {
      updateNodeData(ml.id, { triggerGenerate: Date.now() });
    }

    // Step 21: Trigger all wan26 nodes
    const wan26Nodes = nodesRef.current.filter((n) => n.type === 'wan26');
    for (const wan of wan26Nodes) {
      updateNodeData(wan.id, { triggerGenerate: Date.now() });
    }

    // Step 22: Trigger all seedance nodes
    const seedanceNodes = nodesRef.current.filter((n) => n.type === 'seedance');
    for (const s of seedanceNodes) {
      updateNodeData(s.id, { triggerGenerate: Date.now() });
    }

    // Step 23: Trigger all ltxVideo2Pro nodes
    const ltxNodes = nodesRef.current.filter((n) => n.type === 'ltxVideo2Pro');
    for (const ltx of ltxNodes) {
      updateNodeData(ltx.id, { triggerGenerate: Date.now() });
    }

    // Step 24: Trigger all runwayGen45 nodes
    const runway45Nodes = nodesRef.current.filter((n) => n.type === 'runwayGen45');
    for (const rw of runway45Nodes) {
      updateNodeData(rw.id, { triggerGenerate: Date.now() });
    }

    // Step 25: Trigger all runwayGen4Turbo nodes
    const runwayTurboNodes = nodesRef.current.filter((n) => n.type === 'runwayGen4Turbo');
    for (const rw of runwayTurboNodes) {
      updateNodeData(rw.id, { triggerGenerate: Date.now() });
    }

    // Step 26: Trigger all runwayActTwo nodes
    const runwayActTwoNodes = nodesRef.current.filter((n) => n.type === 'runwayActTwo');
    for (const rw of runwayActTwoNodes) {
      updateNodeData(rw.id, { triggerGenerate: Date.now() });
    }

    // Step 27: Trigger all pixVerseV5 nodes
    const pixVerseNodes = nodesRef.current.filter((n) => n.type === 'pixVerseV5');
    for (const pv of pixVerseNodes) {
      updateNodeData(pv.id, { triggerGenerate: Date.now() });
    }

    // Step 28: Trigger all pixVerseV5Transition nodes
    const pixVerseTransitionNodes = nodesRef.current.filter((n) => n.type === 'pixVerseV5Transition');
    for (const pvt of pixVerseTransitionNodes) {
      updateNodeData(pvt.id, { triggerGenerate: Date.now() });
    }

    // Step 29: Trigger all omniHuman nodes
    const omniHumanNodes = nodesRef.current.filter((n) => n.type === 'omniHuman');
    for (const oh of omniHumanNodes) {
      updateNodeData(oh.id, { triggerGenerate: Date.now() });
    }

    // Step 30: Trigger all vfx nodes
    const vfxNodes = nodesRef.current.filter((n) => n.type === 'vfx');
    for (const vfx of vfxNodes) {
      updateNodeData(vfx.id, { triggerGenerate: Date.now() });
    }

    // Step 31: Trigger all creativeVideoUpscale nodes
    const upscalerNodes = nodesRef.current.filter((n) => n.type === 'creativeVideoUpscale');
    for (const us of upscalerNodes) {
      updateNodeData(us.id, { triggerGenerate: Date.now() });
    }

    // Step 32: Trigger all precisionVideoUpscale nodes
    const precisionUpscaleNodes = nodesRef.current.filter((n) => n.type === 'precisionVideoUpscale');
    for (const pus of precisionUpscaleNodes) {
      updateNodeData(pus.id, { triggerGenerate: Date.now() });
    }

    // Step 33: Trigger all musicGeneration nodes
    const musicNodes = nodesRef.current.filter((n) => n.type === 'musicGeneration');
    for (const mn of musicNodes) {
      updateNodeData(mn.id, { triggerGenerate: Date.now() });
    }

    // Step 34: Trigger all soundEffects nodes
    const sfxNodes = nodesRef.current.filter((n) => n.type === 'soundEffects');
    for (const sfx of sfxNodes) {
      updateNodeData(sfx.id, { triggerGenerate: Date.now() });
    }

    // Step 35: Trigger all audioIsolation nodes
    const isolationNodes = nodesRef.current.filter((n) => n.type === 'audioIsolation');
    for (const an of isolationNodes) {
      updateNodeData(an.id, { triggerGenerate: Date.now() });
    }

    // Step 36: Trigger all voiceover nodes
    const voiceoverNodes = nodesRef.current.filter((n) => n.type === 'voiceover');
    for (const vo of voiceoverNodes) {
      updateNodeData(vo.id, { triggerGenerate: Date.now() });
    }

    // The actual loading state is managed by each GeneratorNode
    // Wait a moment then check if any are still loading
    setTimeout(() => setIsRunning(false), 2000);
  }, [updateNodeData]);

  const handleCreateWorkflow = useCallback((name, existingId) => {
    if (existingId) {
      // Open existing workflow
      setActiveWorkflowId(existingId);
      const wf = workflows.find((w) => w.id === existingId);
      if (wf?.nodes) {
        setNodes(wf.nodes);
        setEdges(wf.edges || []);
      }
    } else {
      // Create new workflow
      const id = `wf_${Date.now()}`;
      const newWf = { id, name, nodeCount: 2, nodes: defaultNodes, edges: [] };
      setWorkflows((prev) => [...prev, newWf]);
      setActiveWorkflowId(id);
      setNodes(defaultNodes);
      setEdges([]);
    }
    setCurrentPage('editor');
  }, [workflows, setNodes, setEdges]);

  const handleBackToHome = useCallback(() => {
    // Save current workflow state
    if (activeWorkflowId) {
      setWorkflows((prev) =>
        prev.map((wf) =>
          wf.id === activeWorkflowId
            ? { ...wf, nodes: nodesRef.current, edges: edgesRef.current, nodeCount: nodesRef.current.length }
            : wf
        )
      );
    }
    setCurrentPage('home');
  }, [activeWorkflowId]);

  const connectionValidator = useCallback((connection) => isValidConnection(connection), []);

  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'default',
      style: { strokeWidth: 2 },
    }),
    []
  );

  // Auth guard — show login/signup if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthPage onLogin={() => setIsAuthenticated(true)} />
    );
  }

  if (currentPage === 'home') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
        <TopBar currentPage={currentPage} onNavigate={setCurrentPage} workflowName={null} onLogout={() => setIsAuthenticated(false)} />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <WorkflowsPage
            onCreateWorkflow={handleCreateWorkflow}
            workflows={workflows}
          />
        </div>
      </div>
    );
  }

  if (currentPage === 'profile') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
        <TopBar currentPage={currentPage} onNavigate={setCurrentPage} workflowName={null} onLogout={() => setIsAuthenticated(false)} />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <ProfilePage />
        </div>
      </div>
    );
  }

  if (currentPage === 'workflow-settings') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
        <TopBar currentPage={currentPage} onNavigate={setCurrentPage} workflowName={null} onLogout={() => setIsAuthenticated(false)} />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <WorkflowSettingsPage />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
      <TopBar
        currentPage={currentPage}
        onNavigate={() => handleBackToHome()}
        workflowName={activeWorkflowName}
        editorMode={editorMode}
        onEditorModeChange={setEditorMode}
        onLogout={() => setIsAuthenticated(false)}
      />
      <EditorTopBar
        onSave={() => {
          if (activeWorkflowId) {
            setWorkflows((prev) =>
              prev.map((wf) =>
                wf.id === activeWorkflowId
                  ? { ...wf, nodes: nodesRef.current, edges: edgesRef.current, nodeCount: nodesRef.current.length }
                  : wf
              )
            );
          }
        }}
        onExportJSON={() => {
          const data = JSON.stringify({ nodes: nodesRef.current, edges: edgesRef.current }, null, 2);
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${activeWorkflowName || 'workflow'}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }}
        onImportJSON={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.json';
          input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
              try {
                const parsed = JSON.parse(ev.target.result);
                if (parsed.nodes) setNodes(parsed.nodes);
                if (parsed.edges) setEdges(parsed.edges);
              } catch (err) {
                console.error('Invalid JSON:', err);
              }
            };
            reader.readAsText(file);
          };
          input.click();
        }}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: '#1a1a1a' }}>
        {/* Canvas */}
        <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
          <GooeyNodesMenu nodeMenu={NODE_MENU} onAddNode={addNode} />

          {/* Global Generate Button — bottom right */}
          <button
            onClick={handleRunWorkflow}
            disabled={isRunning}
            style={{
              position: 'absolute', bottom: 24, right: 24, zIndex: 10,
              padding: '12px 32px', fontSize: 14, fontWeight: 700,
              background: isRunning ? '#333' : '#3b82f6',
              border: 'none', borderRadius: 10, color: '#fff',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            {isRunning ? (
              <>
                <span style={{
                  width: 14, height: 14, border: '2px solid #666',
                  borderTop: '2px solid #fff', borderRadius: '50%',
                  animation: 'spin 1s linear infinite', display: 'inline-block',
                }} />
                Running...
              </>
            ) : (
              <>
                <span style={{ fontSize: 16 }}>&#9654;</span>
                Generate
              </>
            )}
          </button>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <ReactFlow
            nodes={nodesWithCallbacks}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgesDelete={onEdgesDelete}
            isValidConnection={connectionValidator}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            deleteKeyCode={['Backspace', 'Delete']}
            style={{ background: '#1a1a1a' }}
          >
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#333" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
