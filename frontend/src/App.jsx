import { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  MiniMap,
  Background,
  BackgroundVariant,
  Panel,
  useViewport,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { generateAIWorkflow, suggestNodes, chatWithAI } from './utils/api';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirebaseAuth, initializeFirebase, enableOfflinePersistence } from './config/firebase';
import { useFirebaseWorkflows } from './hooks/useFirebaseWorkflows';
import { useFirebaseTemplates } from './hooks/useFirebaseTemplates';
import { saveTemplate as saveLocalTemplate } from './templates/templateStore';

import InputNode from './nodes/InputNode';
import TextNode from './nodes/TextNode';
import ImageNode from './nodes/ImageNode';
import AssetNode from './nodes/AssetNode';
import SourceMediaNode from './nodes/SourceMediaNode';
import WorkflowNode from './nodes/WorkflowNode';
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
import CommentNode from './nodes/CommentNode';
import RouterNode from './nodes/RouterNode';
import GroupEditingNode from './nodes/GroupEditingNode';
import FacialEditingNode from './nodes/FacialEditingNode';
import ImageUniversalGeneratorNode, { MODELS as IMAGE_MODELS } from './nodes/ImageUniversalGeneratorNode';
import VideoUniversalGeneratorNode, { MODELS as VIDEO_MODELS } from './nodes/VideoUniversalGeneratorNode';
import VideoImproveNode from './nodes/VideoImproveNode';
import QuiverTextToVectorGenerationNode from './nodes/QuiverTextToVectorGenerationNode';
import QuiverImageToVectorGenerationNode from './nodes/QuiverImageToVectorGenerationNode';
import TextElementNode from './nodes/TextElementNode';
import ImageOutputNode from './nodes/ImageOutputNode';
import VideoOutputNode from './nodes/VideoOutputNode';
import SoundOutputNode from './nodes/SoundOutputNode';
import LandingPage from './LandingPage';
import ProjectsDashboard from './ProjectsDashboard';
import WorkflowsPage from './WorkflowsPage';
import WorkspacesPage from './WorkspacesPage';
import ProfileModal from './ProfileModal';
import WorkflowSettingsPage from './WorkflowSettingsPage';
import AuthPage from './AuthPage';
import SystemLoadingProcess from './components/SystemLoadingProcess';
import GlobalProgressBar from './GlobalProgressBar';
import ReferenceSelection from './components/ReferenceSelection';
import ChatUI from './components/ChatUI';
import ChatButton from './components/ChatButton';
import MatrixDot from './components/MatrixDot';
import TopBar from './TopBar';
import EditorTopBar from './EditorTopBar';
import TemplateBuilderModal from './TemplateBuilderModal';
import BottomBar from './BottomBar';
import GooeyNodesMenu from './GooeyNodesMenu';
import Queue from './Queue';
import LayoutHelper, { alignmentFunctions } from './LayoutHelper';
import { isValidConnection, getHandleColor, getHandleDataType } from './utils/handleTypes';
import { NODE_MENU, DEFAULT_NODES, DEFAULT_EDGES } from './config/nodeMenu.js';
import { isHandleConnected, getConnectionInfo as getConnectionInfoBase } from './helpers/nodeData.js';
import NodePropertyEditor from './nodes/NodePropertyEditor';

const GridIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>);
const CollageIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 22H4a2 2 0 0 1-2-2V6"></path><path d="M22 18H8a2 2 0 0 0-2 2v-12a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z"></path><circle cx="13.5" cy="8.5" r="1.5"></circle><polyline points="22 13 18 10 11 15"></polyline></svg>);
const CopyLinksIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>);
const DisconnectIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-7.07-7.07l-4.57 4.57 1.41 1.41"></path><path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 7.07 7.07l4.57-4.57-1.41-1.41"></path><line x1="15.18" y1="8.82" x2="8.82" y2="15.18"></line></svg>);

function CanvasNavigation() {
  const { zoom } = useViewport();
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    background: 'transparent',
    border: 'none',
    color: '#e0e0e0',
    cursor: 'pointer',
    borderRadius: '4px',
  };

  return (
    <Panel
      position="top-right"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
        marginTop: '10px',
        marginRight: '10px',
      }}
    >
      {/* Inline Zoom Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: '#2a2a2a',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '4px',
      }}>
        {/* eslint-disable-next-line react-compiler/react-compiler */}
        <button onClick={() => zoomOut()} style={buttonStyle} title="Zoom Out">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        {/* Zoom Factor Text in % */}
        <div style={{
          minWidth: '48px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#e0e0e0',
          fontFamily: 'monospace',
          userSelect: 'none'
        }}>
          {Math.round(zoom * 100)}%
        </div>

        <button onClick={() => zoomIn()} style={buttonStyle} title="Zoom In">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        <div style={{ width: '1px', height: '16px', background: '#4a4a4a', margin: '0 4px' }} />

        <button onClick={() => fitView({ duration: 800 })} style={buttonStyle} title="Fit View">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3-3 3M2 12h20M12 2v20"></path>
          </svg>
        </button>
      </div>

      {/* MiniMap Below Controls */}
      <div style={{
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          style={{ position: 'relative', margin: 0, width: 200, height: 150, backgroundColor: '#1a1a1a' }}
          maskColor="rgba(0, 0, 0, 0.7)"
          nodeColor={(node) => {
            if (node.type === 'inputNode') return '#22c55e';
            if (node.type === 'generator') return '#f97316';
            if (node.type === 'imageAnalyzer') return '#0ea5e9';
            if (node.type === 'response') return '#8b5cf6';
            return '#3b82f6';
          }}
        />
      </div>
    </Panel>
  );
}

const nextId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [workflows, setWorkflows] = useState([]);
  const [activeWorkflowId, setActiveWorkflowId] = useState(null);
  const [editorMode, setEditorMode] = useState('node-editor');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [showSystemLoading, setShowSystemLoading] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const firebaseTemplates = useFirebaseTemplates(currentUserId);

  // sessionStorage key: set after loading completes, cleared on logout.
  // This handles both popup (no reload) and redirect (page reload) Google auth,
  // as well as StrictMode's double effect invocation.
  const SLP_KEY = 'slp_shown';

  // Initialize Firebase and Auth listener on mount
  useEffect(() => {
    try {
      initializeFirebase();
      enableOfflinePersistence();

      const auth = getFirebaseAuth();
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
          setCurrentUserId(user.uid);
          // Redirect to home (Projects Dashboard) when authenticated
          setCurrentPage('home');
          // Show loading screen once per session (cleared on logout or first completion)
          if (!sessionStorage.getItem(SLP_KEY)) {
            setShowSystemLoading(true);
          }
          console.log('[Auth] User signed in:', user.uid);
        } else {
          setIsAuthenticated(false);
          setCurrentUserId(null);
          setCurrentPage('landing');
          // Clear flag so the loading screen shows again on next login
          sessionStorage.removeItem(SLP_KEY);
          console.log('[Auth] User signed out');
        }
        setAuthLoading(false);
      }, (error) => {
        console.error('[Auth] State change error:', error);
        setAuthError(error.message);
        setAuthLoading(false);
      });

      return () => unsubscribeAuth();
    } catch (err) {
      console.error('[Firebase] Initialization failed:', err.message);
      setAuthError(err.message);
      setAuthLoading(false);
    }
  }, []);

  // Firebase workflow integration
  const {
    workflows: firebaseWorkflows,
    currentWorkflow,
    isLoading: isFirebaseLoading,
    error: firebaseError,
    create: createFirebaseWorkflow,
    load: loadFirebaseWorkflow,
    save: saveFirebaseWorkflow,
    remove: deleteFirebaseWorkflow,
    subscribe,
    unsubscribe,
  } = useFirebaseWorkflows({
    userId: currentUserId,
    enableRealtime: true,
  });

  const handleLogout = useCallback(async () => {
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
      setCurrentPage('landing');
    } catch (err) {
      console.error('[Auth] Logout error:', err);
    }
  }, []);

  useEffect(() => {
    if (firebaseWorkflows.length > 0) {
      setWorkflows((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(firebaseWorkflows)) {
          return prev;
        }
        return firebaseWorkflows;
      });
    }
  }, [firebaseWorkflows]);

  // Auto-empty trash items older than 30 days
  useEffect(() => {
    if (!workflows || workflows.length === 0) return;

    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const expiredIds = workflows
      .filter(w => w.deleted && w.deletedAt && (now - w.deletedAt > THIRTY_DAYS_MS))
      .map(w => w.id);

    if (expiredIds.length > 0) {
      console.log('[Trash] Auto-deleting expired items:', expiredIds);
      setWorkflows((prev) => prev.filter((w) => !expiredIds.includes(w.id)));
      expiredIds.forEach(id => deleteFirebaseWorkflow(id).catch(e => console.error('Firebase auto-delete error:', e)));
    }
  }, [workflows, deleteFirebaseWorkflow]);

  const activeWorkflowName = workflows.find((w) => w.id === activeWorkflowId)?.name || 'Untitled';

  const [nodes, setNodes, onNodesChange] = useNodesState(DEFAULT_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const [history, setHistory] = useState({ past: [], future: [] });
  const isHistoryAction = useRef(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true); // Chat UI open by default
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [menu, setMenu] = useState(null);
  const [clipboardNodes, setClipboardNodes] = useState(null);
  const clipboardRef = useRef(null);
  const pastePositionRef = useRef(null);
  const chatUIRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you build your workflow today?' }
  ]);
  const [isChatting, setIsChatting] = useState(false);

  const reactFlowWrapper = useRef(null);
  const edgesRef = useRef(edges);
  edgesRef.current = edges;
  const analyzeResolvers = useRef({});
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  const saveHistory = useCallback(() => {
    setHistory((prev) => {
      const last = prev.past[prev.past.length - 1];
      // Only save if different (basic check to avoid saving same state)
      if (last && JSON.stringify(last.nodes) === JSON.stringify(nodesRef.current) && JSON.stringify(last.edges) === JSON.stringify(edgesRef.current)) {
        return prev;
      }
      return {
        past: [...prev.past.slice(-50), { nodes: JSON.parse(JSON.stringify(nodesRef.current)), edges: JSON.parse(JSON.stringify(edgesRef.current)) }],
        future: []
      };
    });
  }, []);

  const updateNodeData = useCallback(
    (nodeId, patch) => {
      saveHistory();
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n
        )
      );
    },
    [setNodes]
  );

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

  const handleUndo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const newPast = [...prev.past];
      const previous = newPast.pop();
      isHistoryAction.current = true;
      setNodes(previous.nodes);
      setEdges(previous.edges);
      return {
        past: newPast,
        future: [{ nodes: JSON.parse(JSON.stringify(nodesRef.current)), edges: JSON.parse(JSON.stringify(edgesRef.current)) }, ...prev.future]
      };
    });
  }, [setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const newFuture = [...prev.future];
      const next = newFuture.shift();
      isHistoryAction.current = true;
      setNodes(next.nodes);
      setEdges(next.edges);
      return {
        past: [...prev.past, { nodes: JSON.parse(JSON.stringify(nodesRef.current)), edges: JSON.parse(JSON.stringify(edgesRef.current)) }],
        future: newFuture
      };
    });
  }, [setNodes, setEdges]);

  // Hook into nodes change to save history before drag or delete
  const customOnNodesChange = useCallback((changes) => {
    const isSignificantChange = changes.some(c => c.type === 'position' && !c.dragging || c.type === 'remove' || c.type === 'add');
    if (isSignificantChange && !isHistoryAction.current) {
      saveHistory();
    }
    if (changes.every(c => c.type !== 'position' || !c.dragging)) {
      isHistoryAction.current = false;
    }
    onNodesChange(changes);
  }, [onNodesChange, saveHistory]);

  const customOnEdgesChange = useCallback((changes) => {
    const isSignificantChange = changes.some(c => c.type === 'remove' || c.type === 'add');
    if (isSignificantChange && !isHistoryAction.current) {
      saveHistory();
    }
    isHistoryAction.current = false;
    onEdgesChange(changes);
  }, [onEdgesChange, saveHistory]);

  const nodeTypes = useMemo(
    () => ({
      inputNode: InputNode,
      textNode: TextNode,
      imageNode: ImageNode,
      assetNode: AssetNode,
      sourceMediaNode: SourceMediaNode,
      workflowTemplate: WorkflowNode,
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
      comment: CommentNode,
      routerNode: RouterNode,
      groupEditing: GroupEditingNode,
      facialEditing: FacialEditingNode,
      universalGeneratorImage: ImageUniversalGeneratorNode,
      universalGeneratorVideo: VideoUniversalGeneratorNode,
      videoImprove: VideoImproveNode,
      quiverTextToVector: QuiverTextToVectorGenerationNode,
      quiverImageToVector: QuiverImageToVectorGenerationNode,
      textElement: TextElementNode,
      imageOutput: ImageOutputNode,
      videoOutput: VideoOutputNode,
      soundOutput: SoundOutputNode,
    }),
    []
  );

  // Resolve input data from connected edges
  const resolveInput = useCallback((nodeId, handleId, originalHandleId = handleId) => {
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
      } else if (sourceNode.type === 'routerNode') {
        const routedInput = resolveInput(sourceNode.id, 'in', originalHandleId);
        if (routedInput !== null && routedInput !== undefined) {
          if (Array.isArray(routedInput)) results.push(...routedInput);
          else results.push(routedInput);
        }
      } else if (sourceNode.type === 'layerEditor') {
        if (sh === 'image-out' && sd.outputImage) results.push(sd.outputImage);
      } else if (sourceNode.type === 'facialEditing') {
        if (sh === 'image-out' && sd.outputImage) results.push(sd.outputImage);
      } else if (sourceNode.type === 'groupEditing') {
        if (sh === 'images-out' && sd.outputImages) results.push(...sd.outputImages);
        if (sh === 'video-out' && sd.outputVideo) results.push(sd.outputVideo);
      } else if (sourceNode.type === 'videoImprove') {
        if (sh === 'video-out' && sd.outputVideo) results.push(sd.outputVideo);
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
      } else if (sourceNode.type === 'quiverTextToVector') {
        if (sh === 'image-out' && sd.outputImage) results.push(sd.outputImage);
      } else if (sourceNode.type === 'quiverImageToVector') {
        if (sh === 'image-out' && sd.outputImage) results.push(sd.outputImage);
      } else if (sourceNode.type === 'adaptedPrompt' && sh === 'prompt-out') {
        if (sd.adaptedPrompt) results.push(sd.adaptedPrompt);
      } else if (sourceNode.type === 'sourceMediaNode') {
        if (sh === 'image-out' && sd.mediaFiles?.length) {
          const images = sd.mediaFiles.filter(m => m.type === 'image').map(m => m.url);
          results.push(...images);
        }
        if (sh === 'video-out' && sd.mediaFiles?.length) {
          const videos = sd.mediaFiles.filter(m => m.type === 'video').map(m => m.url);
          results.push(...videos);
        }
        if (sh === 'audio-out' && sd.mediaFiles?.length) {
          const audio = sd.mediaFiles.filter(m => m.type === 'audio').map(m => m.url);
          results.push(...audio);
        }
        if (sh === 'output' && sd.mediaFiles?.length) {
          results.push(...sd.mediaFiles.map(m => m.url));
        }
      }
    }

    const dataType = getHandleDataType(originalHandleId);
    if (dataType === 'image') return results;
    if (results.length === 1) return results[0];
    return results.length > 0 ? results.join('\n') : null;
  }, []);

  // Use base helpers with ref-based edge/node access
  const hasConnection = useCallback((nodeId, handleId) => {
    return isHandleConnected(nodeId, handleId, edgesRef.current);
  }, []);

  const getConnectionInfo = useCallback((nodeId, handleId) => {
    return getConnectionInfoBase(nodeId, handleId, edgesRef.current, nodesRef.current);
  }, []);


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
        onCreateNode: (type, dataPatch, sourceHandle, targetHandle) => {
          const newId = nextId();
          const sourceNode = nodesRef.current.find(nd => nd.id === n.id);
          const position = sourceNode 
            ? { x: sourceNode.position.x + 450, y: sourceNode.position.y }
            : { x: 400, y: 400 };

          const newNode = {
            id: newId,
            type,
            position,
            data: { ...dataPatch },
          };

          setNodes((nds) => [...nds, newNode]);

          if (sourceHandle && targetHandle) {
            const edgeColor = getHandleColor(sourceHandle);
            const newEdge = {
              id: `e-${n.id}-${sourceHandle}-${newId}-${targetHandle}`,
              source: n.id,
              sourceHandle,
              target: newId,
              targetHandle,
              style: { stroke: edgeColor, strokeWidth: 2 },
            };
            setTimeout(() => {
              setEdges((eds) => addEdge(newEdge, eds));
            }, 50); // Small delay to ensure node is in state
          }
        },
      },
    }));
  }, [nodes, edges, updateNodeData, resolveInput, hasConnection, getConnectionInfo, setEdges]);


  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const position = rfInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let defaults = { label: type };
      
      const draggedDefaults = event.dataTransfer.getData('application/reactflow-defaults');
      if (draggedDefaults) {
        try {
          defaults = JSON.parse(draggedDefaults);
        } catch (e) {
          console.error("Failed to parse dragged defaults", e);
        }
      } else {
        for (const section of NODE_MENU) {
          const item = section.items.find(i => i.type === type);
          if (item && item.defaults) {
            defaults = item.defaults;
            break;
          }
        }
      }

      const newNode = {
        id: nextId(),
        type,
        position,
        data: { ...defaults },
      };

      setNodes((nds) => nds.concat(newNode));
      saveHistory();
    },
    [rfInstance, saveHistory, setNodes]
  );

  const showContextMenu = useCallback(
    (event, nodes) => {
      event.preventDefault();
      
      const pane = reactFlowWrapper.current.getBoundingClientRect();
      const hasClipboard = clipboardRef.current || (clipboardNodes && clipboardNodes.length > 0);

      // Build menu items dynamically based on context
      let menuItems = [];

      if (nodes && nodes.length > 0) {
        menuItems.push({ label: 'Cut', action: 'cut', shortcut: '⌘X' });
        menuItems.push({ label: 'Copy', action: 'copy', shortcut: '⌘C' });
        menuItems.push({ label: 'Duplicate', action: 'duplicate', shortcut: '⌘D' });
        menuItems.push({ label: 'Clear node contents', action: 'clear_contents', shortcut: '⌘⇧X' });
        menuItems.push({ label: 'Disconnect Nodes', action: 'disconnect_nodes', icon: <DisconnectIcon /> });
        menuItems.push({ type: 'divider' });

        // Multi-node specific options
        if (nodes.length > 1) {
          menuItems.push({ label: 'Grid Nodes', action: 'grid_nodes', icon: <GridIcon /> });
          menuItems.push({ label: 'Stack Nodes', action: 'stack_nodes' });
          menuItems.push({ label: 'Align Left', action: 'align_left' });
          menuItems.push({ label: 'Align Center', action: 'align_center' });
          menuItems.push({ label: 'Align Right', action: 'align_right' });
          menuItems.push({ label: 'Compose collage', action: 'compose_collage', icon: <CollageIcon /> });
          menuItems.push({ label: 'Save as Template', action: 'save_as_template' });
          menuItems.push({ type: 'divider' });
        }

        menuItems.push({ label: 'Create Element', action: 'create_element' });
      }

      // Always allow paste if clipboard has something
      if (hasClipboard) {
        // If we already have items (node selection), add paste near top or after divider
        const pasteItem = { label: 'Paste', action: 'paste', shortcut: '⌘V' };
        if (menuItems.length > 0) {
          // Add paste after Duplicate
          const dupIndex = menuItems.findIndex(i => i.action === 'duplicate');
          if (dupIndex !== -1) {
            menuItems.splice(dupIndex + 1, 0, pasteItem);
          } else {
            menuItems.unshift(pasteItem);
          }
        } else {
          menuItems.push(pasteItem);
        }
      }

      setMenu({
        x: event.clientX - pane.left,
        y: event.clientY - pane.top,
        items: menuItems,
        selectedNodes: nodes,
      });
    },
    [clipboardNodes, setMenu]
  );

  const onPaneContextMenu = useCallback(
    (event) => {
      const selectedNodes = nodes.filter(n => n.selected);
      showContextMenu(event, selectedNodes);
    },
    [rfInstance, showContextMenu]
  );

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // If the node we clicked on isn't selected, select it (exclusive click)
      // or if it IS part of a selection, keep the current selection.
      let nodesToShow = [node];
      const selectedNodes = nodes.filter(n => n.selected);
      
      if (selectedNodes.some(n => n.id === node.id)) {
        nodesToShow = selectedNodes;
      }
      
      showContextMenu(event, nodesToShow);
    },
    [rfInstance, showContextMenu]
  );

  const onSelectionContextMenu = useCallback(
    (event, nodes) => {
      showContextMenu(event, nodes);
    },
    [showContextMenu]
  );

  const handleMenuAction = (action, data) => {
    saveHistory();
    const { selectedNodes } = data;

    switch (action) {
      case 'create_element':
        if (selectedNodes && selectedNodes.length > 0) {
          const newAssetNode = {
            id: nextId(),
            type: 'assetNode',
            position: {
              x: selectedNodes[selectedNodes.length - 1].position.x + 300,
              y: selectedNodes[selectedNodes.length - 1].position.y,
            },
            data: {
              label: 'New Asset',
              images: selectedNodes.reduce((acc, node) => {
                if (node.data.outputImage) return [...acc, node.data.outputImage];
                if (node.data.outputVideo) return [...acc, node.data.outputVideo];
                return acc;
              }, []),
            },
          };
          setNodes((nds) => [...nds, newAssetNode]);
        }
        break;
      case 'duplicate':
        if (selectedNodes && selectedNodes.length > 0) {
          const newNodes = selectedNodes.map(node => ({
            ...node,
            id: nextId(),
            selected: true,
            position: { x: node.position.x + 50, y: node.position.y + 50 }
          }));
          setNodes(nds => [...nds.map(n => ({ ...n, selected: false })), ...newNodes]);
        }
        break;
      case 'compose_collage':
        if (selectedNodes && selectedNodes.length > 0) {
          const newAssetNode = {
            id: nextId(),
            type: 'assetNode',
            position: {
              x: selectedNodes[selectedNodes.length - 1].position.x + 300,
              y: selectedNodes[selectedNodes.length - 1].position.y,
            },
            data: {
              label: 'Collage',
              images: selectedNodes.reduce((acc, node) => {
                if (node.data.outputImage) return [...acc, node.data.outputImage];
                if (node.data.outputVideo) return [...acc, node.data.outputVideo];
                return acc;
              }, []),
            },
          };
          setNodes((nds) => [...nds, newAssetNode]);
        }
        break;
      case 'copy_links':
        if (selectedNodes && selectedNodes.length > 0) {
          const links = selectedNodes.reduce((acc, node) => {
            if (node.data.outputImage && typeof node.data.outputImage === 'string') return [...acc, node.data.outputImage];
            if (node.data.outputVideo && typeof node.data.outputVideo === 'string') return [...acc, node.data.outputVideo];
            return acc;
          }, []);
          if (links.length > 0) {
            navigator.clipboard.writeText(links.join('\n'));
          }
        }
        break;
      case 'clear_contents':
        if (selectedNodes && selectedNodes.length > 0) {
          setNodes(nds => nds.map(n => {
            if (!n.selected) return n;
            const newData = { ...n.data };
            // Clear common content fields based on node type
            if (newData.text !== undefined) newData.text = '';
            if (newData.images) newData.images = [];
            if (newData.inputPrompt) newData.inputPrompt = '';
            if (newData.outputImage) newData.outputImage = null;
            if (newData.outputVideo) newData.outputVideo = null;
            return { ...n, data: newData };
          }));
        }
        break;
      case 'disconnect_nodes':
        if (selectedNodes && selectedNodes.length > 0) {
          const selectedNodeIds = new Set(selectedNodes.map(n => n.id));
          setEdges(eds => eds.filter(e => !selectedNodeIds.has(e.source) && !selectedNodeIds.has(e.target)));
        }
        break;
      case 'align_left':
        if (selectedNodes && selectedNodes.length > 1) {
          const minX = Math.min(...selectedNodes.map(n => n.position.x));
          setNodes(nds => nds.map(n => n.selected ? { ...n, position: { ...n.position, x: minX } } : n));
        }
        break;
      case 'align_right':
        if (selectedNodes && selectedNodes.length > 1) {
          const maxX = Math.max(...selectedNodes.map(n => n.position.x + (n.width || 200)));
          setNodes(nds => nds.map(n => n.selected ? { ...n, position: { ...n.position, x: maxX - (n.width || 200) } } : n));
        }
        break;
      case 'align_center':
      case 'align_center_h':
        if (selectedNodes && selectedNodes.length > 1) {
          let sumX = 0;
          selectedNodes.forEach(n => sumX += n.position.x + (n.width || 200) / 2);
          const avgX = sumX / selectedNodes.length;
          setNodes(nds => nds.map(n => n.selected ? { ...n, position: { ...n.position, x: avgX - (n.width || 200) / 2 } } : n));
        }
        break;
      case 'align_top':
        if (selectedNodes && selectedNodes.length > 1) {
          const minY = Math.min(...selectedNodes.map(n => n.position.y));
          setNodes(nds => nds.map(n => n.selected ? { ...n, position: { ...n.position, y: minY } } : n));
        }
        break;
      case 'align_center_v':
        if (selectedNodes && selectedNodes.length > 1) {
          let sumY = 0;
          selectedNodes.forEach(n => sumY += n.position.y + (n.height || 100) / 2);
          const avgY = sumY / selectedNodes.length;
          setNodes(nds => nds.map(n => n.selected ? { ...n, position: { ...n.position, y: avgY - (n.height || 100) / 2 } } : n));
        }
        break;
      case 'align_bottom':
        if (selectedNodes && selectedNodes.length > 1) {
          const maxY = Math.max(...selectedNodes.map(n => n.position.y + (n.height || 100)));
          setNodes(nds => nds.map(n => n.selected ? { ...n, position: { ...n.position, y: maxY - (n.height || 100) } } : n));
        }
        break;
      case 'distribute_h':
        if (selectedNodes && selectedNodes.length > 2) {
          const sorted = [...selectedNodes].sort((a, b) => a.position.x - b.position.x);
          const minX = sorted[0].position.x;
          const maxX = sorted[sorted.length - 1].position.x;
          const spacing = (maxX - minX) / (sorted.length - 1);
          setNodes(nds => nds.map(n => {
            if (!n.selected) return n;
            const idx = sorted.findIndex(s => s.id === n.id);
            return { ...n, position: { ...n.position, x: minX + spacing * idx } };
          }));
        }
        break;
      case 'distribute_v':
        if (selectedNodes && selectedNodes.length > 2) {
          const sorted = [...selectedNodes].sort((a, b) => a.position.y - b.position.y);
          const minY = sorted[0].position.y;
          const maxY = sorted[sorted.length - 1].position.y;
          const spacing = (maxY - minY) / (sorted.length - 1);
          setNodes(nds => nds.map(n => {
            if (!n.selected) return n;
            const idx = sorted.findIndex(s => s.id === n.id);
            return { ...n, position: { ...n.position, y: minY + spacing * idx } };
          }));
        }
        break;
      case 'stack_nodes':
        if (selectedNodes && selectedNodes.length > 1) {
          // Sort by Y position
          const sorted = [...selectedNodes].sort((a, b) => a.position.y - b.position.y);
          let currentY = sorted[0].position.y;
          const x = sorted[0].position.x;
          setNodes(nds => {
            return nds.map(n => {
              if (!n.selected) return n;
              const idx = sorted.findIndex(s => s.id === n.id);
              if (idx === 0) return n;
              const prev = sorted[idx - 1];
              currentY += (prev.height || 300) + 20;
              return { ...n, position: { x, y: currentY } };
            });
          });
        }
        break;
      case 'save_as_template':
        if (selectedNodes && selectedNodes.length > 0) {
          setShowTemplateModal(true);
        }
        break;
      case 'grid_nodes':
        if (selectedNodes && selectedNodes.length > 1) {
          const startX = selectedNodes[0].position.x;
          const startY = selectedNodes[0].position.y;
          const cols = Math.ceil(Math.sqrt(selectedNodes.length));
          let idx = 0;
          setNodes(nds => nds.map(n => {
            if (!n.selected) return n;
            const r = Math.floor(idx / cols);
            const c = idx % cols;
            idx++;
            return { ...n, position: { x: startX + c * 350, y: startY + r * 400 } };
          }));
        }
        break;
      case 'copy':
      case 'cut':
        if (selectedNodes && selectedNodes.length > 0) {
          // Store nodes in both state and ref for reliability
          const nodesToCopy = selectedNodes.map(node => ({
            ...node,
            selected: false // Deselect when copying
          }));
          setClipboardNodes(nodesToCopy);
          clipboardRef.current = nodesToCopy;

          // Also copy to system clipboard as JSON for cross-workflow copying
          try {
            const clipboardData = {
              type: 'nodespace-nodes',
              nodes: nodesToCopy,
              copiedAt: new Date().toISOString()
            };
            navigator.clipboard.writeText(JSON.stringify(clipboardData));
          } catch (e) {
            console.log('Could not write to system clipboard:', e);
          }

          // If cutting, delete the selected nodes
          if (action === 'cut') {
            setNodes(nds => nds.filter(n => !selectedNodes.find(sn => sn.id === n.id)));
          }
        }
        break;

      case 'paste': {
        // Try to paste from system clipboard first (for cross-workflow copying)
        const pasteFromClipboard = async () => {
          let nodesToPaste = clipboardRef.current || clipboardNodes;

          // Try to read from system clipboard
          try {
            const clipboardText = await navigator.clipboard.readText();
            if (clipboardText) {
              const parsed = JSON.parse(clipboardText);
              if (parsed.type === 'nodespace-nodes' && parsed.nodes) {
                nodesToPaste = parsed.nodes;
              }
            }
          } catch (e) {
            // Fall back to internal clipboard
          }

          if (nodesToPaste && nodesToPaste.length > 0) {
            // Calculate offset based on paste count to avoid stacking
            const pasteCount = (pastePositionRef.current?.count || 0) + 1;
            pastePositionRef.current = { count: pasteCount };

            const offsetX = 50 * (pasteCount % 10); // Cycle offset every 10 pastes
            const offsetY = 50 * (pasteCount % 10);

            // Use menu position if available, otherwise use center of view
            let baseX, baseY;
            if (data.x !== undefined && rfInstance) {
              const flowPos = rfInstance.screenToFlowPosition({ x: data.x, y: data.y });
              baseX = flowPos.x;
              baseY = flowPos.y;
            } else if (rfInstance) {
              const center = rfInstance.screenToFlowPosition({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
              });
              baseX = center.x;
              baseY = center.y;
            } else {
              baseX = nodesToPaste[0].position.x + offsetX;
              baseY = nodesToPaste[0].position.y + offsetY;
            }

            // Calculate bounding box of copied nodes
            const minX = Math.min(...nodesToPaste.map(n => n.position.x));
            const minY = Math.min(...nodesToPaste.map(n => n.position.y));

            const newNodes = nodesToPaste.map((node, index) => {
              const relativeX = node.position.x - minX;
              const relativeY = node.position.y - minY;

              return {
                ...node,
                id: nextId(),
                selected: true,
                position: {
                  x: baseX + relativeX,
                  y: baseY + relativeY
                },
                data: { ...node.data } // Deep clone data
              };
            });

            // Deselect existing nodes and add new ones
            setNodes(nds => [...nds.map(n => ({ ...n, selected: false })), ...newNodes]);
            saveHistory();
          }
        };

        pasteFromClipboard();
        break;
      }

      case 'autoformat':
      case 'download':
        console.log(`Action ${action} not fully implemented yet.`);
        break;
    }
    setMenu(null);
  };


  // Handle keyboard shortcuts for Undo/Redo and other actions
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
        return;
      }

      if (cmdOrCtrl && e.key === 'd') {
        e.preventDefault();
        handleMenuAction('duplicate', { selectedNodes: rfInstance?.getNodes().filter(n => n.selected) });
        return;
      }

      if (cmdOrCtrl && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleMenuAction('copy', { selectedNodes: rfInstance?.getNodes().filter(n => n.selected) });
        return;
      }

      if (cmdOrCtrl && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        handleMenuAction('cut', { selectedNodes: rfInstance?.getNodes().filter(n => n.selected) });
        return;
      }

      if (cmdOrCtrl && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        // Get mouse position or use center of view
        handleMenuAction('paste', { x: window.innerWidth / 2, y: window.innerHeight / 2 });
        return;
      }

      if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        handleMenuAction('clear_contents', { selectedNodes: rfInstance?.getNodes().filter(n => n.selected) });
        return;
      }


      if (cmdOrCtrl && e.key === '.') {
        e.preventDefault();
        window.dispatchEvent(new Event('open-keyboard-shortcuts'));
        return;
      }
      if (cmdOrCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setNodes(nds => nds.map(n => ({ ...n, selected: true })));
        return;
      }

      if (e.key === 'Escape') {
        setNodes(nds => nds.map(n => ({ ...n, selected: false })));
        setEdges(eds => eds.map(e => ({ ...e, selected: false })));
        return;
      }

      if (cmdOrCtrl && e.key === '1') {
        e.preventDefault();
        rfInstance?.fitView();
        return;
      }

      // Single key shortcuts for node creation
      if (!cmdOrCtrl && !e.shiftKey && !e.altKey && e.key) {
        const key = e.key.toLowerCase();
        let typeToAdd = null;
        switch (key) {
          case 't': typeToAdd = 'textNode'; break;
          case 'c': typeToAdd = 'comment'; break;
          case 'l': typeToAdd = 'layerEditor'; break;
          case 'a': typeToAdd = 'assetNode'; break;
          case 'b': typeToAdd = 'groupEditing'; break;
          case 'r': typeToAdd = 'routerNode'; break;
          case 'f': typeToAdd = 'facialEditing'; break;
          case 'v': typeToAdd = 'videoImprove'; break;
          case 'u': typeToAdd = 'sourceMediaNode'; break;
          case 'h':
            window.dispatchEvent(new CustomEvent('open-search-history'));
            return;
        }

        if (typeToAdd) {
          e.preventDefault();
          saveHistory();

          let x = 300;
          let y = 300;

          if (rfInstance) {
            // Find center of current view
            const center = rfInstance.screenToFlowPosition({
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            });
            x = center.x;
            y = center.y;
          }

          // Get default data from NODE_MENU
          let defaults = { label: typeToAdd };
          for (const section of NODE_MENU) {
            const item = section.items.find(i => i.type === typeToAdd);
            if (item && item.defaults) {
              defaults = item.defaults;
              break;
            }
          }

          const newNode = {
            id: nextId(),
            type: typeToAdd,
            position: { x, y },
            data: { ...defaults },
          };
          setNodes(nds => [...nds, newNode]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, rfInstance, setNodes, saveHistory]);

  const handleRenameSubmit = () => {
    if (newWorkflowName.trim() && activeWorkflowId) {
      setWorkflows(prev => prev.map(wf => wf.id === activeWorkflowId ? { ...wf, name: newWorkflowName.trim() } : wf));
    }
    setIsRenameModalOpen(false);
  };

  const handleDuplicateWorkspace = useCallback(() => {
    if (activeWorkflowId) {
      const wfToDuplicate = workflows.find(w => w.id === activeWorkflowId);
      if (wfToDuplicate) {
        const newId = Date.now().toString();
        const newWf = {
          ...wfToDuplicate,
          id: newId,
          name: wfToDuplicate.name + ' (Copy)'
        };
        setWorkflows(prev => [...prev, newWf]);
        setActiveWorkflowId(newId);
        setNodes(wfToDuplicate.nodes || []);
        setEdges(wfToDuplicate.edges || []);
      }
    }
  }, [activeWorkflowId, workflows, setNodes, setEdges]);



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

    // Step 13.5: Trigger all facialEditing nodes
    const facialNodes = nodesRef.current.filter((n) => n.type === 'facialEditing');
    for (const fn of facialNodes) {
      updateNodeData(fn.id, { triggerGenerate: Date.now() });
    }

    // Step 13.6: Trigger all groupEditing nodes
    const groupNodes = nodesRef.current.filter((n) => n.type === 'groupEditing');
    for (const gn of groupNodes) {
      updateNodeData(gn.id, { triggerGenerate: Date.now() });
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

    // Step 37: Trigger all videoImprove nodes
    const videoImproveNodes = nodesRef.current.filter((n) => n.type === 'videoImprove');
    for (const vi of videoImproveNodes) {
      updateNodeData(vi.id, { triggerGenerate: Date.now() });
    }

    // The actual loading state is managed by each GeneratorNode
    // Wait a moment then check if any are still loading
    setTimeout(() => setIsRunning(false), 2000);
  }, [updateNodeData]);

  const getNextBoardName = useCallback(() => {
    const boards = workflows.filter(w => (w.name || w.title || '').startsWith('Board '));
    let maxNum = 0;
    boards.forEach(b => {
      const match = (b.name || b.title).match(/Board (\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxNum) maxNum = num;
      }
    });
    return `Board ${(maxNum + 1).toString().padStart(2, '0')}`;
  }, [workflows]);

  const handleCreateWorkflow = useCallback(async (name, existingId, aiOptions = null) => {
    console.log('[App] handleCreateWorkflow called:', { name, existingId, aiOptions });

    if (existingId && aiOptions?.type !== 'system-test' && aiOptions?.type !== 'ai' && aiOptions?.type !== 'scratch') {
      // Open existing workflow - try Firebase first, then local
      setActiveWorkflowId(existingId);

      // Try to load from Firebase
      const firebaseWf = await loadFirebaseWorkflow(existingId);
      if (firebaseWf) {
        setNodes(firebaseWf.nodes);
        setEdges(firebaseWf.edges || []);
        subscribe(existingId); // Subscribe to real-time updates
      } else {
        // Fallback to local
        const wf = workflows.find((w) => w.id === existingId);
        if (wf?.nodes) {
          setNodes(wf.nodes);
          setEdges(wf.edges || []);
        }
      }
      setCurrentPage('editor');
    } else if (aiOptions?.type === 'system-test') {
      const allNodes = [];
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

      try {
        const newWf = await createFirebaseWorkflow(name || 'System Test Workflow', allNodes, []);
        if (newWf) {
          setActiveWorkflowId(newWf.id);
          setNodes(allNodes);
          setEdges([]);
          subscribe(newWf.id);
          console.log('[System Test] Created workflow:', newWf.id);
        } else {
          console.error('[System Test] createFirebaseWorkflow returned null!');
        }
      } catch (err) {
        console.error('Failed to create system test workflow:', err);
      }
      setCurrentPage('editor');
    } else if (aiOptions?.type === 'ai' && aiOptions.aiPrompt) {
      // AI workflow generation
      console.log('[AI Workflow] Generating workflow from prompt:', aiOptions.aiPrompt);
      try {
        const result = await generateAIWorkflow(aiOptions.aiPrompt, aiOptions.aiMode || 'standard');
        if (result.success && result.workflow) {
          // Save to Firebase
          const newWf = await createFirebaseWorkflow(
            result.workflow.name || name,
            result.workflow.nodes,
            result.workflow.edges
          );

          if (newWf) {
            setActiveWorkflowId(newWf.id);
            setNodes(result.workflow.nodes);
            setEdges(result.workflow.edges);
            subscribe(newWf.id);
            console.log('[AI Workflow] Generated and saved workflow:', newWf.id);
          } else {
            // Fallback to local
            const id = `wf_${Date.now()}`;
            const localWf = {
              id,
              name: result.workflow.name || name,
              nodeCount: result.workflow.nodes.length,
              nodes: result.workflow.nodes,
              edges: result.workflow.edges,
              aiGenerated: true,
              aiPrompt: aiOptions.aiPrompt,
            };
            setWorkflows((prev) => [...prev, localWf]);
            setActiveWorkflowId(id);
            setNodes(result.workflow.nodes);
            setEdges(result.workflow.edges);
          }
        } else {
          throw new Error(result.error || 'Failed to generate workflow');
        }
      } catch (error) {
        console.error('[AI Workflow] Error:', error);
        // Fallback to default workflow
        const id = `wf_${Date.now()}`;
        const newWf = { id, name, nodeCount: 2, nodes: DEFAULT_NODES, edges: [] };
        setWorkflows((prev) => [...prev, newWf]);
        setActiveWorkflowId(id);
        setNodes(DEFAULT_NODES);
        setEdges([]);
      }
      setCurrentPage('editor');
    } else if (aiOptions?.type === 'scratch') {
      try {
        const newWf = await createFirebaseWorkflow(name, [], []);
        if (newWf) {
          setActiveWorkflowId(newWf.id);
          setNodes([]);
          setEdges([]);
          subscribe(newWf.id);
          console.log('[Firebase] Created scratch workflow:', newWf.id);
        } else {
          throw new Error('Firebase returned null');
        }
      } catch (err) {
        console.warn('[App] Firebase scratch creation failed, using local fallback:', err.message);
        const id = `wf_${Date.now()}`;
        const localWf = { id, name, nodeCount: 0, nodes: [], edges: [] };
        setWorkflows((prev) => [...prev, localWf]);
        setActiveWorkflowId(id);
        setNodes([]);
        setEdges([]);
      }
      setCurrentPage('editor');
    } else {
      // Create default workflow in Firebase
      try {
        const newWf = await createFirebaseWorkflow(name, DEFAULT_NODES, DEFAULT_EDGES);
        if (newWf) {
          setActiveWorkflowId(newWf.id);
          setNodes(DEFAULT_NODES);
          setEdges(DEFAULT_EDGES);
          subscribe(newWf.id);
          console.log('[Firebase] Created default workflow:', newWf.id);
        } else {
          throw new Error('Firebase returned null');
        }
      } catch (err) {
        console.warn('[App] Firebase default creation failed, using local fallback:', err.message);
        const id = `wf_${Date.now()}`;
        const localWf = { id, name, nodeCount: DEFAULT_NODES.length, nodes: DEFAULT_NODES, edges: DEFAULT_EDGES };
        setWorkflows((prev) => [...prev, localWf]);
        setActiveWorkflowId(id);
        setNodes(DEFAULT_NODES);
        setEdges(DEFAULT_EDGES);
      }
      setCurrentPage('editor');
    }
  }, [workflows, setNodes, setEdges, createFirebaseWorkflow, loadFirebaseWorkflow, subscribe]);

  useEffect(() => {
    window.runSystemTest = () => handleCreateWorkflow('System Test Workflow', null, { type: 'system-test' });
  }, [handleCreateWorkflow]);

  const handleBackToHome = useCallback(async () => {
    // Save current workflow state to Firebase
    if (activeWorkflowId) {
      const updates = {
        nodes: nodesRef.current,
        edges: edgesRef.current,
      };
      await saveFirebaseWorkflow(activeWorkflowId, updates);
      unsubscribe(); // Unsubscribe from real-time updates
    }
    setCurrentPage('home');
  }, [activeWorkflowId, saveFirebaseWorkflow, unsubscribe]);

  const connectionValidator = useCallback((connection) => isValidConnection(connection), []);

  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'default',
      style: { strokeWidth: 2 },
    }),
    []
  );

  const handleDeleteWorkflows = async (ids) => {
    console.log('Optimistically deleting workflows:', ids);
    setWorkflows((prev) => prev.filter((w) => !ids.includes(w.id)));
    for (const id of ids) {
      deleteFirebaseWorkflow(id).catch(e => console.error('Firebase delete error:', e));
    }
  };

  const handleRenameBoard = useCallback(async (id, newName) => {
    if (!newName) return;
    setWorkflows(prev => prev.map(wf => wf.id === id ? { ...wf, name: newName } : wf));
    await saveFirebaseWorkflow(id, { name: newName });
  }, [saveFirebaseWorkflow]);

  const handleDeleteBoard = useCallback(async (id) => {
    if (id === activeWorkflowId) {
      const remaining = workflows.filter(w => w.id !== id);
      if (remaining.length > 0) {
        handleCreateWorkflow(remaining[0].name, remaining[0].id, null);
      } else {
        setCurrentPage('home');
        setActiveWorkflowId(null);
      }
    }
    handleDeleteWorkflows([id]);
  }, [activeWorkflowId, workflows, handleCreateWorkflow]);

  // Show Firebase auth errors with helpful instructions
  if (authError) {
    const isApiKeyError = authError.includes('api-key') || authError.includes('API key');
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e0e0e0', fontFamily: 'Inter, system-ui, sans-serif', padding: 24 }}>
        <div style={{ maxWidth: 600, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>&#9888;</div>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#fff' }}>
            {isApiKeyError ? 'Firebase API Key Error' : 'Authentication Error'}
          </h2>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 24, lineHeight: 1.6 }}>
            {isApiKeyError ? (
              <>
                The Firebase API key is not valid for this domain. <br />
                This usually happens when the domain isn&apos;t authorized in Google Cloud Console.
              </>
            ) : (
              authError
            )}
          </p>
          {isApiKeyError && (
            <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 12, padding: 24, textAlign: 'left', marginBottom: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>To fix this:</h3>
              <ol style={{ fontSize: 13, color: '#888', lineHeight: 1.8, margin: 0, paddingLeft: 20 }}>
                <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>Google Cloud Console → APIs &amp; Services → Credentials</a></li>
                <li>Find your API key: <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: 4, color: '#e0e0e0' }}>AIzaSyDNRotQNelJBJAAMwmdmo8cWjYiAchobHU</code></li>
                <li>Click &quot;Edit API key&quot; → &quot;Application restrictions&quot;</li>
                <li>Add this domain to HTTP referrers: <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: 4, color: '#22c55e' }}>nodes.felixseeger.de</code></li>
                <li>Save and wait 2-3 minutes for changes to propagate</li>
              </ol>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Auth guard — show login/signup if not authenticated
  // No auth guard here - we want LandingPage to be visible while loading
  // if not authenticated yet.


  // Handle unauthenticated navigation
  if (!isAuthenticated && currentPage !== 'landing' && !currentPage.startsWith('auth-')) {
    // If not landing and not an auth page, redirect to landing
    setCurrentPage('landing');
  }

  if (!isAuthenticated && currentPage.startsWith('auth-')) {
    const initialScreen = currentPage.replace('auth-', '');
    return (
      <AuthPage
        initialScreen={initialScreen === 'login' || initialScreen === 'signup' ? initialScreen : 'login'}
        onNavigate={setCurrentPage}
      />
    );
  }

  if (showSystemLoading) {
    const totalModels = IMAGE_MODELS.length + VIDEO_MODELS.length;
    const totalNodes = Object.keys(nodeTypes).length;

    return (
      <SystemLoadingProcess
        config={{
          phases: [
            { label: 'Phase 01', value: `Loading ${totalNodes} nodes` },
            { label: 'Signal Scan', value: `Loading ${totalModels} models` },
          ],
          code: `Felix Seeger | Last update ${new Date().toISOString().split('T')[0]}`
        }}
        onComplete={() => {
          sessionStorage.setItem('slp_shown', '1');
          setShowSystemLoading(false);
        }} />
    );
  }

  // Landing page for non-authenticated users OR when explicitly navigated to landing
  if (!isAuthenticated || currentPage === 'landing') {
    return (
      <div className="app-container">
        <TopBar 
          currentPage={currentPage}
          onNavigate={setCurrentPage} 
          workflowName={null} 
          onLogout={handleLogout} 
          onOpenProfile={() => setIsProfileModalOpen(true)} 
          isAuthenticated={isAuthenticated} 
        />
        <div className="app-content">
          <LandingPage
            onCreateWorkflow={handleCreateWorkflow}
            onDeleteWorkflows={handleDeleteWorkflows}
            workflows={workflows}
            onNavigate={setCurrentPage}
          />
        </div>
      </div>
    );
  }

  // Projects Dashboard for authenticated users (default home)
  if (currentPage === 'home') {
    return (
      <>
        <ProjectsDashboard
          projects={workflows}
          onCreateProject={(name) => handleCreateWorkflow(name || getNextBoardName())}
          onOpenProject={(project) => {
            // Open existing project in editor
            handleCreateWorkflow(project.name || project.title, project.id);
          }}
          onUpdateProject={async (id, updates) => {
            setWorkflows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
            if (saveFirebaseWorkflow) {
              await saveFirebaseWorkflow(id, updates);
            }
          }}
          onDeleteProject={(id) => {
            handleDeleteWorkflows([id]);
          }}
          onDuplicateProject={async (project) => {
            const newName = `${project.name || project.title || 'Untitled'} (Copy)`;
            if (createFirebaseWorkflow) {
              await createFirebaseWorkflow(newName, project.nodes || [], project.edges || []);
            }
          }}
          onLogout={handleLogout}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </>
    );
  }


  if (currentPage === 'workspaces') {
    return (
      <div className="app-container">
        <TopBar currentPage={currentPage} onNavigate={setCurrentPage} workflowName={null} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
        <div className="app-content">
          <WorkspacesPage
            onCreateWorkspace={(name) => {
              // Stub for creating workspace
              setCurrentPage('home');
            }}
            workspaces={[]}
          />
        </div>
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </div>
    );
  }



  if (currentPage === 'workflow-settings') {
    return (
      <div className="app-container">
        <TopBar currentPage={currentPage} onNavigate={setCurrentPage} workflowName={null} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
        <div className="app-content">
          <WorkflowSettingsPage />
        </div>
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <TopBar
        currentPage={currentPage}
        onNavigate={() => handleBackToHome()}
        workflowName={activeWorkflowName}
        editorMode={editorMode}
        onEditorModeChange={setEditorMode}
        onLogout={handleLogout}
        onZoomIn={() => rfInstance?.zoomIn()}
        onZoomOut={() => rfInstance?.zoomOut()}
        onZoomFit={() => rfInstance?.fitView()}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onRename={() => { setNewWorkflowName(activeWorkflowName); setIsRenameModalOpen(true); }}
        onDuplicate={handleDuplicateWorkspace}
        isLocked={isLocked}
        onLockView={() => setIsLocked(prev => !prev)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        isAuthenticated={isAuthenticated}
      />
      {isRenameModalOpen && (
        <div className="modal-overlay">
          <div className="modal-surface">
            <h3 className="modal-title">Rename Workspace</h3>
            <input
              autoFocus
              className="modal-input"
              type="text"
              value={newWorkflowName}
              onChange={e => setNewWorkflowName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleRenameSubmit(); if (e.key === 'Escape') setIsRenameModalOpen(false); }}
            />
            <div className="modal-actions">
              <button 
                className="modal-btn modal-btn-secondary" 
                onClick={() => setIsRenameModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-btn modal-btn-primary" 
                onClick={handleRenameSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
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
      <GlobalProgressBar nodes={nodes} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: '#1a1a1a' }}>
        {/* Canvas */}
        <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }} onDrop={onDrop} onDragOver={onDragOver}>
          <GooeyNodesMenu nodeMenu={NODE_MENU} templates={firebaseTemplates.templates} onAddNode={addNode} onOpenProfile={() => setIsProfileModalOpen(true)} />

          {/* Layout Helper Toolbar */}
          <LayoutHelper
            selectedNodes={nodes.filter(n => n.selected)}
            isVisible={nodes.filter(n => n.selected).length >= 2}
            onAlign={(action, selectedNodes) => {
              saveHistory();
              handleMenuAction(action, { selectedNodes });
            }}
          />

          {/* Reference Selection - Bottom Left */}
          <ReferenceSelection
            onImageSelect={(imageData) => {
              // Store selected reference image in app state or pass to workflow
              console.log('[ReferenceSelection] Image selected:', imageData ? 'yes' : 'no');
            }}
          />

          {/* Node Property Editor - Right Side */}
          {currentPage === 'editor' && nodes.filter(n => n.selected).length === 1 && (
            <NodePropertyEditor
              node={nodes.find(n => n.selected)}
              isChatOpen={isChatOpen}
              onUpdate={updateNodeData}
              onDelete={(id) => {
                saveHistory();
                setNodes(nds => nds.filter(n => n.id !== id));
                setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
              }}
            />
          )}

          {/* Chat Button - Bottom Left */}
          <ChatButton
            isOpen={isChatOpen}
            onClick={() => setIsChatOpen(!isChatOpen)}
          />

          {/* Action Buttons (Generate) - Bottom Center */}
          <div style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}>
            <style>{`
              @keyframes action-spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
            <button
              onClick={handleRunWorkflow}
              disabled={isRunning}
              style={{
                background: 'linear-gradient(145deg, #3a3a3a 0%, #111 100%)',
                border: '1px solid #444',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 8px 16px rgba(0,0,0,0.4)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '24px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isRunning ? 'not-allowed' : 'pointer',
                opacity: isRunning ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease'
              }}
            >
              {isRunning ? (
                <>
                  <span style={{ width: 14, height: 14, border: '2px solid #666', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'action-spin 1s linear infinite' }} />
                  Generating...
                </>
              ) : (
                <>Generate</>
              )}
            </button>
          </div>

          {/* Chat UI - Right Side */}
          <ChatUI
            ref={chatUIRef}
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            onSendMessage={async (message) => {
              const newUserMsg = { role: 'user', content: message };
              const updatedMessages = [...chatMessages, newUserMsg];
              setChatMessages(updatedMessages);
              setIsChatting(true);

              try {
                const response = await chatWithAI(updatedMessages);
                if (response.success && response.content) {
                  setChatMessages([...updatedMessages, { role: 'assistant', content: response.content }]);
                } else {
                  const errorMsg = response.error || response.message || 'Sorry, I encountered an error. Please try again.';
                  setChatMessages([...updatedMessages, { role: 'assistant', content: errorMsg }]);
                }
              } catch (err) {
                console.error('[ChatUI] Error sending message:', err);
                const errorMsg = err.response?.data?.error || err.message || 'Connection error. Please check your network and try again.';
                setChatMessages([...updatedMessages, { role: 'assistant', content: `Error: ${errorMsg}` }]);
              } finally {
                setIsChatting(false);
              }
            }}
            messages={chatMessages}
            isChatting={isChatting}
            onGenerate={async (message) => {
              if (!message || message.trim() === '') {
                console.log('[ChatUI] No message to generate workflow from');
                return;
              }

              setIsRunning(true);
              try {
                console.log('[ChatUI] Generating workflow from:', message);
                const result = await generateAIWorkflow(message.trim(), 'standard');

                if (result.success && result.workflow) {
                  // Save the generated workflow
                  const newWf = await createFirebaseWorkflow(
                    result.workflow.name || 'AI Generated Workflow',
                    result.workflow.nodes,
                    result.workflow.edges
                  );

                  if (newWf) {
                    setActiveWorkflowId(newWf.id);
                    setNodes(result.workflow.nodes);
                    setEdges(result.workflow.edges);
                    subscribe(newWf.id);
                    console.log('[ChatUI] Workflow generated and saved:', newWf.id);
                  } else {
                    // Fallback: just update current workflow
                    setNodes(result.workflow.nodes);
                    setEdges(result.workflow.edges);
                  }
                } else {
                  console.error('[ChatUI] Failed to generate workflow:', result.error);
                }
              } catch (error) {
                console.error('[ChatUI] Error generating workflow:', error);
              } finally {
                setIsRunning(false);
              }
            }}
            isGenerating={isRunning}
            disabled={isRunning}
          />

          {/* Queue - Bottom Right, below Chat UI */}
          <div style={{
            position: 'absolute',
            bottom: 96,
            right: 24,
            zIndex: 10,
          }}>
            <Queue nodes={nodes} />
          </div>

          {/* Matrix Dot Background */}
          <MatrixDot
            dotSize={2}
            dotColor="#3a3a3a"
            spacing={28}
            opacity={0.6}
          />

          <ReactFlow
            nodes={nodesWithCallbacks}
            edges={edges}
            onInit={setRfInstance}
            onNodesChange={customOnNodesChange}
            onEdgesChange={customOnEdgesChange}
            onConnect={(params) => { saveHistory(); onConnect(params); }}
            onEdgesDelete={(deleted) => { saveHistory(); onEdgesDelete(deleted); }}
            isValidConnection={connectionValidator}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            fitViewOptions={{ padding: 0.1, minZoom: 0.1, maxZoom: 2 }}
            minZoom={0.1}
            maxZoom={2}
            panOnDrag={isLocked ? false : [0, 1, 2]}
            panOnScroll={false}
            selectionOnDrag={false}
            selectionMode="partial"
            selectionKeyCode="Shift"
            multiSelectionKeyCode="Meta"
            nodeDragThreshold={5}
            elevateNodesOnSelect={true}
            elevateEdgesOnSelect={true}
            zoomOnScroll={!isLocked}
            zoomActivationKeyCode="Meta"
            nodesDraggable={!isLocked}
            nodesConnectable={!isLocked}
            nodesFocusable={true}
            edgesFocusable={true}
            elementsSelectable={!isLocked}
            autoPanOnConnect={true}
            autoPanOnNodeDrag={true}
            connectionRadius={40}
            deleteKeyCode={['Backspace', 'Delete']}
            style={{ background: '#1a1a1a' }}
            onPaneContextMenu={onPaneContextMenu}
            onNodeContextMenu={onNodeContextMenu}
            onSelectionContextMenu={onSelectionContextMenu}
            onPaneClick={() => setMenu(null)}
          >
            {menu && (
              <div
                style={{
                  position: 'absolute',
                  top: menu.y,
                  left: menu.x,
                  backgroundColor: 'rgba(30, 30, 30, 0.75)',
                  backdropFilter: 'blur(16px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  zIndex: 1000,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  minWidth: 220,
                  padding: '6px 0',
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                }}
              >
                {menu.items.map((item, index) => {
                  if (item.type === 'divider') {
                    return <div key={'divider-' + index} style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.15)', margin: '6px 0' }} />;
                  }

                  return (
                    <div
                      key={item.action}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuAction(item.action, menu);
                        setMenu(null);
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 16px',
                        margin: '0 6px',
                        cursor: 'default',
                        borderRadius: '6px',
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '14px',
                        fontWeight: 400,
                        transition: 'background-color 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.icon && <span style={{ display: 'flex', alignItems: 'center', opacity: 0.8 }}>{item.icon}</span>}
                        <span>{item.label}</span>
                      </div>
                      {item.shortcut && (
                        <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>{item.shortcut}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <Background variant="dots" gap={20} size={1} color="#333" />
            <CanvasNavigation />
          </ReactFlow>
        </div>
      </div>
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <TemplateBuilderModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        selectedNodes={nodes.filter(n => n.selected)}
        nodes={nodes}
        edges={edges}
        onCreated={({ template }) => {
          setShowTemplateModal(false);
          // Save locally as fallback
          saveLocalTemplate(template);
          // Save to Firebase if available
          if (firebaseTemplates.create) {
            firebaseTemplates.create(template).catch(console.error);
          }
        }}
      />
      <BottomBar
        workflows={workflows}
        activeWorkflowId={activeWorkflowId}
        onSwitchWorkflow={handleCreateWorkflow}
        onRenameBoard={handleRenameBoard}
        onDeleteBoard={handleDeleteBoard}
      />
    </div>
  );
}
