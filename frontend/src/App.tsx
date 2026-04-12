import React, { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  useReactFlow,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  Connection,
  ReactFlowInstance,
  OnConnect,
  SelectionMode,
  type NodeTypes,
} from '@xyflow/react';

import { generateAIWorkflow, sendChat, uploadWorkflowThumbnail } from './utils/api';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirebaseAuth } from './config/firebase';
import { useFirebaseWorkflows } from './hooks/useFirebaseWorkflows';
import { useFirebaseTemplates } from './hooks/useFirebaseTemplates';
import { useFirebaseAssets } from './hooks/useFirebaseAssets';
import { useFirebaseChat } from './hooks/useFirebaseChat';
import { useUser } from './hooks/useUser';
import { saveTemplate as saveLocalTemplate } from './templates/templateStore';

import { dynamicNodes, createDynamicNodeWrapper } from './utils/dynamicNodeImports';
// @ts-ignore
import DynamicNodeLoader from './components/DynamicNodeLoader';
import { MODELS as IMAGE_MODELS } from './nodes/imageUniversalGeneratorModels';
import { MODELS as VIDEO_MODELS } from './nodes/videoUniversalGeneratorModels';
import LandingPage from './LandingPage';
import ProjectsDashboard from './ProjectsDashboard';
import WorkspacesPage from './WorkspacesPage';
import ProfileModal from './ProfileModal';
import WorkflowSettingsPage from './WorkflowSettingsPage';
import DrawflowLab from './DrawflowLab';
import NodeBananaLab from './NodeBananaLab';
import AuthPage from './AuthPage';
import { GlobalAssetVault } from './components/GlobalAssetVault';
// @ts-ignore
import SystemLoadingProcess from './components/SystemLoadingProcess';
import GlobalProgressBar from './GlobalProgressBar';
// @ts-ignore
import ReferenceSelection from './components/ReferenceSelection';
// @ts-ignore
import ChatUI from './components/ChatUI';
// @ts-ignore
import ChatButton from './components/ChatButton';
// @ts-ignore
import MatrixDot from './components/MatrixDot';
import TopBar from './TopBar';
import EditorTopBar from './EditorTopBar';
import TemplateBuilderModal from './TemplateBuilderModal';
import BottomBar from './BottomBar';
import GooeyNodesMenu from './GooeyNodesMenu';
import Queue from './Queue';
import WorkflowInterface from './WorkflowInterface';
import LayoutHelper from './components/LayoutHelper';
// @ts-ignore
import CanvasRunToolbar from './components/CanvasRunToolbar';
// @ts-ignore
import MegaMenuModelSearch from './components/MegaMenuModelSearch';
import { NODE_TYPE_CAPABILITIES } from './config/nodeCapabilities';
import { CanvasProvider } from './context/CanvasContext';
import { isValidConnection, getHandleColor, getHandleDataType } from './utils/handleTypes';
import { isPanningRef, isDraggingNodeRef, isConnectingRef, beginInteraction, endInteraction } from './interactionRefs';
import { NODE_MENU, DEFAULT_NODES, DEFAULT_EDGES } from './config/nodeMenu.js';
import { buildCanvasAllNodesSections, resolveCanvasNodeData } from './config/canvasAllNodesMenu';
import { isHandleConnected, getConnectionInfo as getConnectionInfoBase } from './helpers/nodeData.js';
import { captureCanvasViewportPngDataUrl, exportCanvasViewportToPng } from './utils/canvasUtils';
import InspectorPanel from './InspectorPanel';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import { CommandPalette } from './components/CommandPalette';
import { nextId } from './app/nextId';
import { GridIcon, CollageIcon, WorkflowIcon, DisconnectIcon } from './app/contextMenuIcons';
import { CanvasNavigation } from './app/CanvasNavigation';
import {
  findCompatibleHandle,
} from './app/connectionHandleMaps';
import { CanvasSearch } from './components/CanvasSearch';
import OnboardingTour from './components/OnboardingTour';
import { useCanvasHistory } from './hooks/useCanvasHistory';
import type { PageType, EditorMode } from './types';
import { isWorkflowImportData } from './types';
import PromptRecipeGallery from './components/PromptRecipeGallery';
import { WorkflowLineageTracker } from './components/WorkflowLineageTracker';
import { SmartConnectorUI } from './components/SmartConnectorUI';
import { WorkflowHealthMonitor } from './components/WorkflowHealthMonitor';
import { CollaboratorPresence, LiveActionFeed } from './components/CollaborationHub';

const nodeTypes: NodeTypes = {
  inputNode: createDynamicNodeWrapper(dynamicNodes.InputNode),
  input: createDynamicNodeWrapper(dynamicNodes.InputNode),
  textNode: createDynamicNodeWrapper(dynamicNodes.TextNode),
  imageNode: createDynamicNodeWrapper(dynamicNodes.ImageNode),
  assetNode: createDynamicNodeWrapper(dynamicNodes.AssetNode),
  sourceMediaNode: createDynamicNodeWrapper(dynamicNodes.SourceMediaNode),
  workflowTemplate: createDynamicNodeWrapper(dynamicNodes.WorkflowNode),
  imageAnalyzer: createDynamicNodeWrapper(dynamicNodes.ImageAnalyzerNode),
  generator: createDynamicNodeWrapper(dynamicNodes.GeneratorNode),
  creativeUpscale: createDynamicNodeWrapper(dynamicNodes.CreativeUpScaleNode),
  precisionUpscale: createDynamicNodeWrapper(dynamicNodes.PrecisionUpScaleNode),
  relight: createDynamicNodeWrapper(dynamicNodes.RelightNode),
  styleTransfer: createDynamicNodeWrapper(dynamicNodes.StyleTransferNode),
  removeBackground: createDynamicNodeWrapper(dynamicNodes.RemoveBackgroundNode),
  fluxReimagine: createDynamicNodeWrapper(dynamicNodes.FluxReimagineNode),
  fluxImageExpand: createDynamicNodeWrapper(dynamicNodes.FluxImageExpandNode),
  seedreamExpand: createDynamicNodeWrapper(dynamicNodes.SeedreamExpandNode),
  ideogramExpand: createDynamicNodeWrapper(dynamicNodes.IdeogramExpandNode),
  skinEnhancer: createDynamicNodeWrapper(dynamicNodes.SkinEnhancerNode),
  ideogramInpaint: createDynamicNodeWrapper(dynamicNodes.IdeogramInpaintNode),
  changeCamera: createDynamicNodeWrapper(dynamicNodes.ChangeCameraNode),
  kling3: createDynamicNodeWrapper(dynamicNodes.Kling3Node),
  kling3Omni: createDynamicNodeWrapper(dynamicNodes.Kling3OmniNode),
  kling3Motion: createDynamicNodeWrapper(dynamicNodes.Kling3MotionControlNode),
  klingElementsPro: createDynamicNodeWrapper(dynamicNodes.KlingElementsProNode),
  klingO1: createDynamicNodeWrapper(dynamicNodes.KlingO1Node),
  minimaxLive: createDynamicNodeWrapper(dynamicNodes.MiniMaxLiveNode),
  wan26: createDynamicNodeWrapper(dynamicNodes.Wan26VideoNode),
  seedance: createDynamicNodeWrapper(dynamicNodes.SeedanceNode),
  ltxVideo2Pro: createDynamicNodeWrapper(dynamicNodes.LtxVideo2ProNode),
  runwayGen45: createDynamicNodeWrapper(dynamicNodes.RunwayGen45Node),
  runwayGen4Turbo: createDynamicNodeWrapper(dynamicNodes.RunwayGen4TurboNode),
  runwayActTwo: createDynamicNodeWrapper(dynamicNodes.RunwayActTwoNode),
  pixVerseV5Transition: createDynamicNodeWrapper(dynamicNodes.PixVerseV5TransitionNode),
  omniHuman: createDynamicNodeWrapper(dynamicNodes.OmniHumanNode),
  vfx: createDynamicNodeWrapper(dynamicNodes.VfxNode),
  creativeVideoUpscale: createDynamicNodeWrapper(dynamicNodes.CreativeVideoUpscaleNode),
  precisionVideoUpscale: createDynamicNodeWrapper(dynamicNodes.PrecisionVideoUpscaleNode),
  textToIcon: createDynamicNodeWrapper(dynamicNodes.TextToIconNode),
  imageToPrompt: createDynamicNodeWrapper(dynamicNodes.ImageToPromptNode),
  improvePrompt: createDynamicNodeWrapper(dynamicNodes.ImprovePromptNode),
  aiImageClassifier: createDynamicNodeWrapper(dynamicNodes.AIImageClassifierNode),
  musicGeneration: createDynamicNodeWrapper(dynamicNodes.MusicGenerationNode),
  soundEffects: createDynamicNodeWrapper(dynamicNodes.SoundEffectsNode),
  audioIsolation: createDynamicNodeWrapper(dynamicNodes.AudioIsolationNode),
  voiceover: createDynamicNodeWrapper(dynamicNodes.VoiceoverNode),
  response: createDynamicNodeWrapper(dynamicNodes.ResponseNode),
  adaptedPrompt: createDynamicNodeWrapper(dynamicNodes.AdaptedPromptNode),
  layerEditor: createDynamicNodeWrapper(dynamicNodes.LayerEditorNode),
  comment: createDynamicNodeWrapper(dynamicNodes.CommentNode),
  routerNode: createDynamicNodeWrapper(dynamicNodes.RouterNode),
  groupEditing: createDynamicNodeWrapper(dynamicNodes.GroupEditingNode),
  facialEditing: createDynamicNodeWrapper(dynamicNodes.FacialEditingNode),
  universalGeneratorImage: createDynamicNodeWrapper(dynamicNodes.ImageUniversalGeneratorNode),
  universalGeneratorVideo: createDynamicNodeWrapper(dynamicNodes.VideoUniversalGeneratorNode),
  videoImprove: createDynamicNodeWrapper(dynamicNodes.VideoImproveNode),
  quiverTextToVector: createDynamicNodeWrapper(dynamicNodes.QuiverTextToVectorGenerationNode),
  quiverImageToVector: createDynamicNodeWrapper(dynamicNodes.QuiverImageToVectorGenerationNode),
  tripo3d: createDynamicNodeWrapper(dynamicNodes.Tripo3DNode),
  textElement: createDynamicNodeWrapper(dynamicNodes.TextElementNode),
  imageOutput: createDynamicNodeWrapper(dynamicNodes.ImageOutputNode),
  videoOutput: createDynamicNodeWrapper(dynamicNodes.VideoOutputNode),
  soundOutput: createDynamicNodeWrapper(dynamicNodes.SoundOutputNode),
  condition: createDynamicNodeWrapper(dynamicNodes.ConditionNode),
  iteration: createDynamicNodeWrapper(dynamicNodes.IterationNode),
  variable: createDynamicNodeWrapper(dynamicNodes.VariableNode),
  socialPublisher: createDynamicNodeWrapper(dynamicNodes.SocialPublisherNode),
  cloudSync: createDynamicNodeWrapper(dynamicNodes.CloudSyncNode),
} as any;

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | undefined>(undefined);
  const [editorMode, setEditorMode] = useState<EditorMode>('node-editor');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const [showSystemLoading, setShowSystemLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('app_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success'; id: string } | undefined>(undefined);

  const firebaseTemplates = useFirebaseTemplates(currentUserId);
  const firebaseAssets = useFirebaseAssets(currentUserId);
  const {
    messages: chatMessages,
    sendMessage: persistChatMessage,
    startNewConversation,
  } = useFirebaseChat({ 
    userId: currentUserId,
    workflowId: activeWorkflowId
  });
  const { initialize: initializeProfile } = useUser(currentUserId);

  const handleNavigate = useCallback((page: any) => {
    setCurrentPage(page as PageType);
  }, []);

  const SLP_KEY = 'slp_shown';

  // Toast helper
  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    const id = Date.now().toString();
    setToast({ message, type, id });
    setTimeout(() => setToast(undefined), 4000);
  };

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
          setCurrentUserId(user.uid);
          setCurrentUserEmail(user.email || undefined);
          
          // Initialize/Sync Firestore profile
          initializeProfile(user.uid, user.email || '', user.displayName || user.email?.split('@')[0] || 'User');
          
          setCurrentPage((prev) => (prev === 'landing' || prev.startsWith('auth-') ? 'home' : prev));
          if (!sessionStorage.getItem(SLP_KEY)) {
            setShowSystemLoading(true);
          }
        } else {
          setIsAuthenticated(false);
          setCurrentUserId(undefined);
          setCurrentPage('landing');
          sessionStorage.removeItem(SLP_KEY);
        }
        setAuthLoading(false);
      }, (error) => {
        setAuthError(error.message);
        setAuthLoading(false);
      });

      return () => unsubscribeAuth();
    } catch (err: any) {
      setAuthError(err.message);
      setAuthLoading(false);
    }
  }, [initializeProfile]);

  useEffect(() => {
    if (!showSystemLoading) return undefined;
    const timeoutId = setTimeout(() => {
      sessionStorage.setItem(SLP_KEY, '1');
      setShowSystemLoading(false);
    }, 10000);
    return () => clearTimeout(timeoutId);
  }, [showSystemLoading]);

  const {
    workflows: firebaseWorkflows,
    communityWorkflows,
    sharedWorkflows,
    create: createFirebaseWorkflow,
    load: loadFirebaseWorkflow,
    save: saveFirebaseWorkflow,
    togglePublic: toggleWorkflowPublic,
    remove: deleteFirebaseWorkflow,
    share: shareFirebaseWorkflow,
    unshare: unshareFirebaseWorkflow,
    subscribe,
    unsubscribe,
  } = useFirebaseWorkflows({
    userId: currentUserId,
    userEmail: currentUserEmail,
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
        // More efficient comparison or just update if different
        if (prev === firebaseWorkflows) return prev;
        return firebaseWorkflows;
      });
    }
  }, [firebaseWorkflows]);

  useEffect(() => {
    if (!workflows || workflows.length === 0) return;

    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    
    // Check if we actually have anything to remove before updating state
    const hasExpired = workflows.some(w => w.deleted && w.deletedAt && (now - w.deletedAt > THIRTY_DAYS_MS));
    if (!hasExpired) return;

    const expiredIds = workflows
      .filter(w => w.deleted && w.deletedAt && (now - w.deletedAt > THIRTY_DAYS_MS))
      .map(w => w.id);

    if (expiredIds.length > 0) {
      setWorkflows((prev) => prev.filter((w) => !expiredIds.includes(w.id)));
      expiredIds.forEach(id => deleteFirebaseWorkflow(id).catch(console.error));
    }
  }, [workflows, deleteFirebaseWorkflow]);

  const activeWorkflowName = workflows.find((w) => w.id === activeWorkflowId)?.name || 'Untitled';

  const [nodes, setNodes, onNodesChange] = useNodesState(DEFAULT_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | undefined>(undefined);
  
  const { 
    saveHistory: originalSaveHistory, 
    undo: handleUndoInternal, 
    redo: handleRedoInternal, 
    isHistoryAction, 
  } = useCanvasHistory();

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [activeTool, setActiveTool] = useState<'select' | 'hand' | 'slice'>('select');
  const [sliceStart, setSliceStart] = useState<{ x: number, y: number } | null>(null);
  const [sliceCurrent, setSliceCurrent] = useState<{ x: number, y: number } | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'interface'>('editor');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatSuggestions, setChatSuggestions] = useState<string[]>([]);
  const [browseModelsOpen, setBrowseModelsOpen] = useState(false);
  const [lastGeneratedWorkflow, setLastGeneratedWorkflow] = useState<any>(undefined);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [menu, setMenu] = useState<any>(undefined);
  const [clipboardNodes, setClipboardNodes] = useState<any>(undefined);
  const clipboardRef = useRef<any>(undefined);
  const pastePositionRef = useRef<any>(undefined);
  const chatUIRef = useRef<any>(undefined);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [_connectionDrop, setConnectionDrop] = useState<any>(undefined);
  const [canvasSearch, setCanvasSearch] = useState<{ open: boolean; x: number; y: number }>({ open: false, x: 0, y: 0 });

  useEffect(() => {
    const handleSendToChat = (e: any) => {
      const { images } = e.detail;
      if (images && images.length > 0) {
        setReferenceImages(prev => [...new Set([...prev, ...images])]);
        setIsChatOpen(true);
      }
    };
    window.addEventListener('send-to-chat', handleSendToChat);
    return () => window.removeEventListener('send-to-chat', handleSendToChat);
  }, []);

  const [activeConnection, setActiveConnection] = useState<{ nodeId: string, handleId: string, handleType: string } | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleConnectStart = useCallback((_: any, { nodeId, handleId, handleType }: any) => {
    isConnectingRef.current = true;
    beginInteraction();
    
    if (nodeId && handleId) {
      const type = getHandleDataType(handleId);
      setActiveConnection({ nodeId, handleId, handleType });
      
      const container = reactFlowWrapper.current?.querySelector('.react-flow__container');
      if (container) {
        container.classList.add('connecting');
        
        const allHandles = document.querySelectorAll('.react-flow__handle');
        allHandles.forEach(h => {
          const el = h as HTMLElement;
          const hId = el.getAttribute('data-handleid') || el.getAttribute('id');
          const hNodeId = el.getAttribute('data-nodeid');
          const hType = el.classList.contains('source') || el.classList.contains('react-flow__handle-right') ? 'source' : 'target';
          
          if (hId && hNodeId !== nodeId && hType !== handleType) {
            const dataType = getHandleDataType(hId);
            if (dataType === 'any' || type === 'any' || dataType === type) {
              el.classList.add('connectable');
              el.closest('.react-flow__node')?.classList.add('has-connectable-handle');
            }
          }
        });
      }
    }
  }, []);
  const edgesRef = useRef(edges);
  edgesRef.current = edges;
  const analyzeResolvers = useRef<Record<string, () => void>>({});
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const autosaveTimerRef = useRef<any>(null);
  const autosaveInFlightRef = useRef(false);
  const lastSavedGraphSignatureRef = useRef('');
  const lastThumbnailUploadAtRef = useRef(0);
  const lastThumbnailGraphSignatureRef = useRef('');

  const buildGraphSignature = useCallback((workflowNodes: Node[], workflowEdges: Edge[]) => {
    const nodeSignature = (workflowNodes || [])
      .map((node) => `${node.id}:${Math.round(node.position?.x || 0)}:${Math.round(node.position?.y || 0)}`)
      .sort()
      .join('|');
    const edgeSignature = (workflowEdges || [])
      .map((edge) => `${edge.id}:${edge.source}:${edge.sourceHandle || ''}->${edge.target}:${edge.targetHandle || ''}`)
      .sort()
      .join('|');
    return `${nodeSignature}__${edgeSignature}`;
  }, []);

  const [zoomMode] = useState<'scroll' | 'altScroll' | 'ctrlScroll'>(() => {
    try {
      return (localStorage.getItem('canvas_zoom_mode') as 'scroll' | 'altScroll' | 'ctrlScroll') || 'ctrlScroll';
    } catch {
      return 'ctrlScroll';
    }
  });

  const isMacOS = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const { getViewport, setViewport, screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    const wrapper = reactFlowWrapper.current;
    if (!wrapper) return;

    const isMouseWheel = (event: WheelEvent) => {
      if (event.deltaMode === 1) return true;
      const threshold = 50;
      return Math.abs(event.deltaY) >= threshold && Math.abs(event.deltaY) % 40 === 0;
    };

    const findScrollableAncestor = (target: EventTarget | null, _dx: number, _dy: number) => {
      let el = target as HTMLElement | null;
      while (el && el !== wrapper && el !== document.body) {
        const isTextarea = el.tagName === 'TEXTAREA';
        const isNowheel = el.classList && el.classList.contains('nowheel');
        const hasScrollableOverflow = (() => {
          const style = window.getComputedStyle(el);
          const ov = style.overflow + style.overflowY + style.overflowX;
          return /auto|scroll/.test(ov);
        })();
        if ((isTextarea || isNowheel) || (hasScrollableOverflow && el.scrollHeight > el.clientHeight)) {
          return el;
        }
        el = el.parentElement;
      }
      return null;
    };

    const handleWheel = (event: WheelEvent) => {
      if (isLocked) return;
      const target = event.target;
      const scrollableAncestor = findScrollableAncestor(target, event.deltaX, event.deltaY);
      if (scrollableAncestor) return;

      const isPinch = event.ctrlKey || event.metaKey;
      let shouldZoom = false;
      if (isPinch) {
        shouldZoom = true;
      } else if (isMouseWheel(event)) {
        shouldZoom =
          zoomMode === 'scroll' ||
          (zoomMode === 'altScroll' && event.altKey) ||
          (zoomMode === 'ctrlScroll' && (event.ctrlKey || event.metaKey));
      }

      if (shouldZoom) {
        event.preventDefault();
        event.stopPropagation();
        const viewport = getViewport();
        const zoomSensitivity = 0.005;
        const delta = -event.deltaY * zoomSensitivity;
        const newZoom = Math.min(4, Math.max(0.1, viewport.zoom * (1 + delta)));
        const flowPos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        setViewport({
          x: event.clientX - flowPos.x * newZoom,
          y: event.clientY - flowPos.y * newZoom,
          zoom: newZoom,
        });
      } else if (isMacOS && !isMouseWheel(event) && !isPinch) {
        event.preventDefault();
        event.stopPropagation();
        const viewport = getViewport();
        setViewport({
          x: viewport.x - event.deltaX,
          y: viewport.y - event.deltaY,
          zoom: viewport.zoom,
        });
      }
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    return () => wrapper.removeEventListener('wheel', handleWheel);
  }, [isLocked, zoomMode, getViewport, setViewport, screenToFlowPosition, isMacOS]);

  useEffect(() => {
    try {
      localStorage.setItem('canvas_zoom_mode', zoomMode);
    } catch { /* ignore */ }
  }, [zoomMode]);

  const selectedCanvasNodeIds = useMemo(
    () => nodes.filter((n) => n.selected).map((n) => n.id),
    [nodes]
  );

  const isDirtyRef = useRef(false);

  const saveHistory = useCallback(() => {
    originalSaveHistory(nodesRef.current, edgesRef.current);
  }, [originalSaveHistory]);
  const updateNodeData = useCallback(
    (nodeId: string, patch: any) => {
      saveHistory();
      isDirtyRef.current = true;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n
        )
      );
    },
    [setNodes, saveHistory]
  );

  const onUnlink = useCallback((targetNodeId: string, targetHandle: string) => {
    setEdges((eds) => eds.filter((e) => !(e.target === targetNodeId && e.targetHandle === targetHandle)));
    isDirtyRef.current = true;
  }, [setEdges]);

  const onDisconnectNode = useCallback((id: string) => {
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    isDirtyRef.current = true;
  }, [setEdges]);

  const onCreateNode = useCallback((type: string, dataPatch: any, sourceHandle: string, targetHandle: string, sourceId: string) => {
    const newId = nextId();
    const sourceNode = nodesRef.current.find(nd => nd.id === sourceId);
    const position = sourceNode ? { x: sourceNode.position.x + 450, y: sourceNode.position.y } : { x: 400, y: 400 };
    const newNode: Node = { id: newId, type, position, data: { ...dataPatch } };
    setNodes((nds) => [...nds, newNode]);
    isDirtyRef.current = true;
    
    if (sourceHandle && targetHandle) {
      const edgeColor = getHandleColor(sourceHandle);
      const newEdge: Edge = {
        id: `e-${sourceId}-${sourceHandle}-${newId}-${targetHandle}`,
        source: sourceId,
        sourceHandle,
        target: newId,
        targetHandle,
        style: { stroke: edgeColor, strokeWidth: 2 },
      };
      setTimeout(() => setEdges((eds) => addEdge(newEdge, eds)), 50);
    }
    setTimeout(() => {
      const el = document.querySelector(`[data-id="${newId}"]`) as HTMLElement;
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }, [setNodes, setEdges]);

  const onAnalyzeComplete = useCallback((id: string) => {
    if (analyzeResolvers.current[id]) {
      analyzeResolvers.current[id]();
      delete analyzeResolvers.current[id];
    }
  }, []);

  const onConnect: OnConnect = useCallback(
    (params) => {
      const { source, sourceHandle, target, targetHandle } = params;
      if (!source || !sourceHandle || !target || !targetHandle) return;

      const edgeColor = getHandleColor(sourceHandle);
      const newEdge: Edge = {
        id: `e-${source}-${sourceHandle}-${target}-${targetHandle}`,
        source,
        sourceHandle,
        target,
        targetHandle,
        style: { stroke: edgeColor, strokeWidth: 2 },
        type: 'default',
      };
      setEdges((eds) => addEdge(newEdge, eds));
      isDirtyRef.current = true;

      if (target) {
        const targetNode = nodesRef.current.find((n) => n.id === target);
        if (targetNode?.type === 'response') {
          const sourceNode = nodesRef.current.find((n) => n.id === source);
          const existingFields = targetNode.data.responseFields || [];
          const newField = {
            id: `${source}-${sourceHandle}`,
            label: sourceHandle,
            source: {
              nodeLabel: sourceNode?.data.label || source,
              handle: sourceHandle,
            },
            color: edgeColor,
          };
          if (!existingFields.find((f: any) => f.id === newField.id)) {
            updateNodeData(target, {
              responseFields: [...existingFields, newField],
            });
          }
        }
      }
    },
    [setEdges, updateNodeData]
  );

  const handleConnectEnd = useCallback(
    (event: any, connectionState: any) => {
      isConnectingRef.current = false;
      endInteraction();
      setActiveConnection(null);
      
      const container = reactFlowWrapper.current?.querySelector('.react-flow__container');
      if (container) {
        container.classList.remove('connecting');
      }
      document.querySelectorAll('.connectable').forEach(el => el.classList.remove('connectable'));
      document.querySelectorAll('.has-connectable-handle').forEach(el => el.classList.remove('has-connectable-handle'));

      if (connectionState.isValid || !connectionState.fromNode) return;
      const { clientX, clientY } = event;
      const fromHandleId = connectionState.fromHandle?.id || null;
      const fromHandleType = getHandleDataType(fromHandleId);
      const isFromSource = connectionState.fromHandle?.type === 'source';
      if (!fromHandleType || fromHandleType === 'any') return;

      const elementsUnderCursor = document.elementsFromPoint(clientX, clientY);
      const nodeElement = elementsUnderCursor.find((el) => el.closest('.react-flow__node'));
      if (nodeElement) {
        const nodeWrapper = nodeElement.closest('.react-flow__node') as HTMLElement;
        const targetNodeId = nodeWrapper?.dataset?.id;
        if (targetNodeId && targetNodeId !== connectionState.fromNode.id) {
          const targetNode = nodesRef.current.find((n) => n.id === targetNodeId);
          if (targetNode) {
            const compatibleHandle = findCompatibleHandle(targetNode, fromHandleType, isFromSource);
            if (compatibleHandle) {
              const connection: Connection = isFromSource
                ? { source: connectionState.fromNode.id, sourceHandle: fromHandleId, target: targetNodeId, targetHandle: compatibleHandle }
                : { source: targetNodeId, sourceHandle: compatibleHandle, target: connectionState.fromNode.id, targetHandle: fromHandleId };
              if (isValidConnection(connection)) {
                saveHistory();
                onConnect(connection);
                return;
              }
            }
          }
        }
      }

      if (!rfInstance) return;
      const flowPos = rfInstance.screenToFlowPosition({ x: clientX, y: clientY });
      setConnectionDrop({
        position: { x: clientX, y: clientY },
        flowPosition: flowPos,
        handleType: fromHandleType,
        connectionType: isFromSource ? 'source' : 'target',
        sourceNodeId: connectionState.fromNode.id,
        sourceHandleId: fromHandleId,
      });
    },
    [saveHistory, onConnect, rfInstance]
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      for (const edge of deletedEdges) {
        const targetNode = nodesRef.current.find((n) => n.id === edge.target);
        if (targetNode?.type === 'response') {
          const fieldId = `${edge.source}-${edge.sourceHandle}`;
          const fields = targetNode.data.responseFields || [];
          updateNodeData(edge.target, {
            responseFields: fields.filter((f: any) => f.id !== fieldId),
          });
        }
      }
    },
    [updateNodeData]
  );

  const handleAutoLayout = useCallback(() => {
    saveHistory();
    const currentNodes = rfInstance?.getNodes() || [];
    if (currentNodes.length === 0) return;
    
    // If nodes are selected, only layout those. Otherwise layout all.
    const selectedNodes = currentNodes.filter(n => n.selected);
    const targetNodes = selectedNodes.length > 0 ? selectedNodes : currentNodes;
    
    const startX = selectedNodes.length > 0 ? selectedNodes[0].position.x : 100;
    const startY = selectedNodes.length > 0 ? selectedNodes[0].position.y : 100;
    const cols = Math.ceil(Math.sqrt(targetNodes.length));
    
    const nodeIds = new Set(targetNodes.map(n => n.id));
    
    let idx = 0;
    setNodes(nds => nds.map((n) => {
      if (!nodeIds.has(n.id)) return n;
      
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      idx++;
      return { ...n, position: { x: startX + c * 400, y: startY + r * 500 } };
    }));
    
    if (selectedNodes.length === 0) {
      setTimeout(() => rfInstance?.fitView({ padding: 0.1, duration: 800 }), 100);
    }
  }, [rfInstance, setNodes, saveHistory]);

  const addNode = useCallback(
    (type: string, defaults: any) => {
      const id = nextId();
      const newNode: Node = {
        id,
        type,
        position: { x: 350 + Math.random() * 200, y: 100 + Math.random() * 300 },
        data: { ...defaults },
      };
      setNodes((nds) => [...nds, newNode]);
      setTimeout(() => {
        const el = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    },
    [setNodes]
  );

  const addNodeAtViewportCenter = useCallback(
    (type: string, dataPatch?: any) => {
      saveHistory();
      let x = 350;
      let y = 200;
      if (rfInstance) {
        const center = rfInstance.screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
        x = center.x;
        y = center.y;
      }
      const defaults = resolveCanvasNodeData(type, dataPatch);
      const newNodeId = nextId();
      setNodes((nds) => [
        ...nds,
        {
          id: newNodeId,
          type,
          position: { x, y },
          data: { ...defaults },
        },
      ]);
      setTimeout(() => {
        const el = document.querySelector(`[data-id="${newNodeId}"]`) as HTMLElement;
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    },
    [rfInstance, saveHistory, setNodes]
  );

  const handleSelectAllNodes = useCallback(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: true })));
  }, [setNodes]);

  const handleDeselectAllCanvas = useCallback(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
    setEdges((eds) => eds.map((e) => ({ ...e, selected: false })));
  }, [setNodes, setEdges]);

  const handleCanvasFitView = useCallback(() => {
    rfInstance?.fitView();
  }, [rfInstance]);

  const handleApplyModelToAll = useCallback(
    (kind: string, modelName: string) => {
      saveHistory();
      setNodes((nds) =>
        nds.map((n) => {
          if (kind === 'image' && n.type === 'universalGeneratorImage') {
            return {
              ...n,
              data: {
                ...n.data,
                models: [modelName],
                autoSelect: false,
                useMultiple: false,
              },
            };
          }
          if (kind === 'video' && n.type === 'universalGeneratorVideo') {
            return {
              ...n,
              data: {
                ...n.data,
                models: [modelName],
                autoSelect: false,
                useMultiple: false,
              },
            };
          }
          return n;
        })
      );
    },
    [saveHistory, setNodes]
  );

  const handleUndo = useCallback(() => {
    handleUndoInternal(nodesRef.current, edgesRef.current, setNodes, setEdges);
  }, [handleUndoInternal, setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    handleRedoInternal(nodesRef.current, edgesRef.current, setNodes, setEdges);
  }, [handleRedoInternal, setNodes, setEdges]);

  const customOnNodesChange: OnNodesChange = useCallback((changes) => {
    const isSignificantChange = changes.some(c => (c.type === 'position' && !c.dragging) || c.type === 'remove' || c.type === 'add');
    if (isSignificantChange && !isHistoryAction.current) {
      saveHistory();
      isDirtyRef.current = true;
    }
    if (changes.every(c => c.type !== 'position' || !c.dragging)) {
      isHistoryAction.current = false;
    }
    onNodesChange(changes);
  }, [onNodesChange, saveHistory]);

  const customOnEdgesChange: OnEdgesChange = useCallback((changes) => {
    const isSignificantChange = changes.some(c => c.type === 'remove' || c.type === 'add');
    if (isSignificantChange && !isHistoryAction.current) {
      saveHistory();
      isDirtyRef.current = true;
    }
    isHistoryAction.current = false;
    onEdgesChange(changes);
  }, [onEdgesChange, saveHistory]);


  const canvasAllNodesSections = useMemo(
    () => buildCanvasAllNodesSections(Object.keys(nodeTypes)),
    [nodeTypes]
  );

  const resolveInput = useCallback((nodeId: string, handleId: string, originalHandleId = handleId) => {
    const currentEdges = edgesRef.current;
    const currentNodes = nodesRef.current;
    const incoming = currentEdges.filter((e) => e.target === nodeId && e.targetHandle === handleId);
    if (incoming.length === 0) return null;
    const results: any[] = [];
    for (const edge of incoming) {
      const sourceNode = currentNodes.find((n) => n.id === edge.source);
      if (!sourceNode) continue;
      if (sourceNode.data?.muted) {
        const sourceInputEdges = currentEdges.filter(e => e.target === sourceNode.id);
        for (const srcEdge of sourceInputEdges) {
          const bypassed = resolveInput(sourceNode.id, srcEdge.targetHandle!, originalHandleId);
          if (bypassed !== null && bypassed !== undefined) {
            if (Array.isArray(bypassed)) results.push(...bypassed);
            else results.push(bypassed);
          }
        }
        continue;
      }
      const sd = sourceNode.data as any;
      const sh = edge.sourceHandle;
      if (sourceNode.type === 'textNode' && sd.text) results.push(sd.text);
      else if (sourceNode.type === 'imageNode' && sd.images?.length) {
        results.push(...sd.images.map((img: any) => (typeof img === 'string' ? img : (img?.url || img?.src || img?.image || img?.outputImage || null))).filter(Boolean));
      } else if (sourceNode.type === 'routerNode') {
        const routedInput = resolveInput(sourceNode.id, 'in', originalHandleId);
        if (routedInput !== null && routedInput !== undefined) {
          if (Array.isArray(routedInput)) results.push(...routedInput);
          else results.push(routedInput);
        }
      } else if (sourceNode.type === 'layerEditor' && sh === 'image-out' && sd.outputImage) results.push(sd.outputImage);
      else if (sourceNode.type === 'facialEditing' && sh === 'image-out' && sd.outputImage) results.push(sd.outputImage);
      else if (sourceNode.type === 'groupEditing') {
        if (sh === 'images-out' && sd.outputImages) results.push(...sd.outputImages);
        if (sh === 'video-out' && sd.outputVideo) results.push(sd.outputVideo);
      } else if (sourceNode.type === 'videoImprove' && sh === 'video-out' && sd.outputVideo) results.push(sd.outputVideo);
      else if (sourceNode.type === 'imageAnalyzer') {
        if (sh === 'analysis-out' && sd.analysisResult) results.push(sd.analysisResult);
        if (sh === 'image-out' && sd.localImages?.length) results.push(...sd.localImages);
      } else if (sourceNode.type === 'generator') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'creativeUpscale') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'precisionUpscale' && sh === 'output' && sd.outputImage) results.push(sd.outputImage);
      else if (sourceNode.type === 'relight') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'styleTransfer') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'removeBackground' && sh === 'output' && sd.outputImage) results.push(sd.outputImage);
      else if (sourceNode.type === 'fluxReimagine') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'textToIcon') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'imageToPrompt' && sh === 'prompt-out' && sd.outputPrompt) results.push(sd.outputPrompt);
      else if (sourceNode.type === 'improvePrompt' && sh === 'prompt-out' && sd.outputPrompt) results.push(sd.outputPrompt);
      else if (sourceNode.type === 'aiImageClassifier' && sh === 'text-out' && sd.outputText) results.push(sd.outputText);
      else if (sourceNode.type === 'musicGeneration') {
        if (sh === 'output-audio' && sd.outputAudio) results.push(sd.outputAudio);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'soundEffects') {
        if (sh === 'output-audio' && sd.outputAudio) results.push(sd.outputAudio);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'audioIsolation') {
        if (sh === 'output-audio' && sd.outputAudio) results.push(sd.outputAudio);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'voiceover' && sh === 'output-audio' && sd.outputAudio) results.push(sd.outputAudio);
      else if (sourceNode.type === 'fluxImageExpand') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'seedreamExpand') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'ideogramExpand') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'skinEnhancer' && sh === 'output' && sd.outputImage) results.push(sd.outputImage);
      else if (sourceNode.type === 'ideogramInpaint') {
        if (sh === 'output' && sd.outputImage) results.push(sd.outputImage);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'changeCamera' && sh === 'output' && sd.outputImage) results.push(sd.outputImage);
      else if (sourceNode.type === 'kling3') {
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
      } else if (sourceNode.type === 'runwayActTwo' && sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
      else if (sourceNode.type === 'omniHuman') {
        if (sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
        if (sh === 'prompt-out' && sd.inputPrompt) results.push(sd.inputPrompt);
      } else if (sourceNode.type === 'vfx' && sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
      else if (sourceNode.type === 'creativeVideoUpscale' && sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
      else if (sourceNode.type === 'precisionVideoUpscale' && sh === 'output' && sd.outputVideo) results.push(sd.outputVideo);
      else if (sourceNode.type === 'quiverTextToVector' && sh === 'image-out' && sd.outputImage) results.push(sd.outputImage);
      else if (sourceNode.type === 'quiverImageToVector' && sh === 'image-out' && sd.outputImage) results.push(sd.outputImage);
      else if (sourceNode.type === 'tripo3d' && sh === 'model-out' && sd.outputModelUrl) results.push(sd.outputModelUrl);
      else if (sourceNode.type === 'adaptedPrompt' && sh === 'prompt-out' && sd.adaptedPrompt) results.push(sd.adaptedPrompt);
      else if (sourceNode.type === 'sourceMediaNode') {
        if (sh === 'image-out' && sd.mediaFiles?.length) results.push(...sd.mediaFiles.filter((m: any) => m.type === 'image').map((m: any) => m.url));
        if (sh === 'video-out' && sd.mediaFiles?.length) results.push(...sd.mediaFiles.filter((m: any) => m.type === 'video').map((m: any) => m.url));
        if (sh === 'audio-out' && sd.mediaFiles?.length) results.push(...sd.mediaFiles.filter((m: any) => m.type === 'audio').map((m: any) => m.url));
        if (sh === 'output' && sd.mediaFiles?.length) results.push(...sd.mediaFiles.map((m: any) => m.url));
      }
    }
    const dataType = getHandleDataType(originalHandleId);
    if (dataType === 'image') return results;
    if (results.length === 1) return results[0];
    return results.length > 0 ? results.join('\n') : null;
  }, []);

  const hasConnection = useCallback((nodeId: string, handleId: string) => {
    return isHandleConnected(nodeId, handleId, edgesRef.current);
  }, []);

  const getConnectionInfo = useCallback((nodeId: string, handleId: string) => {
    return getConnectionInfoBase(nodeId, handleId, edgesRef.current, nodesRef.current);
  }, []);

  const canvasContextValue = useMemo(() => ({
    updateNodeData,
    resolveInput,
    hasConnection,
    getConnectionInfo,
    onAnalyzeComplete,
    onUnlink,
    onDisconnectNode,
    onCreateNode,
  }), [updateNodeData, resolveInput, hasConnection, getConnectionInfo, onAnalyzeComplete, onUnlink, onDisconnectNode, onCreateNode]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !rfInstance) return;
      const position = rfInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      let defaults: any = { label: type };
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
      const newNode: Node = { id: nextId(), type, position, data: { ...defaults } };
      setNodes((nds) => nds.concat(newNode));
      saveHistory();
    },
    [rfInstance, saveHistory, setNodes]
  );

  const showContextMenu = useCallback(
    (event: any, selectedNodes: Node[]) => {
      event.preventDefault();
      const pane = reactFlowWrapper.current?.getBoundingClientRect();
      if (!pane) return;
      const hasClipboard = clipboardRef.current || (clipboardNodes && clipboardNodes.length > 0);
      let menuItems: any[] = [];
      if (selectedNodes && selectedNodes.length > 0) {
        menuItems.push({ label: 'Cut', action: 'cut', shortcut: '⌘X' });
        menuItems.push({ label: 'Copy', action: 'copy', shortcut: '⌘C' });
        menuItems.push({ label: 'Duplicate', action: 'duplicate', shortcut: '⌘D' });
        menuItems.push({ label: 'Clear node contents', action: 'clear_contents', shortcut: '⌘⇧X' });
        menuItems.push({ label: 'Disconnect Nodes', action: 'disconnect_nodes', shortcut: '⌘⇧D', icon: <DisconnectIcon /> });
        menuItems.push({ type: 'divider' });
        if (selectedNodes.length > 1) {
          menuItems.push({ label: 'Grid Nodes', action: 'grid_nodes', icon: <GridIcon /> });
          menuItems.push({ label: 'Stack Nodes', action: 'stack_nodes' });
          menuItems.push({ label: 'Align Left', action: 'align_left' });
          menuItems.push({ label: 'Align Center', action: 'align_center' });
          menuItems.push({ label: 'Align Right', action: 'align_right' });
          menuItems.push({ label: 'Compose collage', action: 'compose_collage', icon: <CollageIcon /> });
          menuItems.push({ label: 'Create Workflow', action: 'create_workflow', icon: <WorkflowIcon /> });
          menuItems.push({ label: 'Save as Template', action: 'save_as_template' });
          menuItems.push({ type: 'divider' });
        }
        menuItems.push({ label: 'Save as Asset', action: 'create_element' });
      }
      if (hasClipboard) {
        const pasteItem = { label: 'Paste', action: 'paste', shortcut: '⌘V' };
        const dupIndex = menuItems.findIndex(i => i.action === 'duplicate');
        if (dupIndex !== -1) menuItems.splice(dupIndex + 1, 0, pasteItem);
        else menuItems.unshift(pasteItem);
      }
      setMenu({
        x: event.clientX - pane.left,
        y: event.clientY - pane.top,
        items: [...menuItems, ...(menuItems.length > 0 ? [{ type: 'divider' }] : []), { label: 'Take Screenshot', action: 'screenshot', shortcut: '⌘⇧S' }],
        selectedNodes,
      });
    },
    [clipboardNodes, setMenu]
  );

  const onPaneContextMenu = useCallback(
    (event: any) => {
      const selNodes = nodes.filter(n => n.selected);
      showContextMenu(event, selNodes);
    },
    [nodes, showContextMenu]
  );

  const onNodeContextMenu = useCallback(
    (event: any, node: Node) => {
      const selNodes = nodes.filter(n => n.selected);
      const nodesToShow = selNodes.some(n => n.id === node.id) ? selNodes : [node];
      showContextMenu(event, nodesToShow);
    },
    [nodes, showContextMenu]
  );

  const onSelectionContextMenu = useCallback(
    (event: any, selection: Node[]) => {
      showContextMenu(event, selection);
    },
    [showContextMenu]
  );

  const handleExportScreenshot = useCallback(async () => {
    try {
      await exportCanvasViewportToPng({
        reactFlowWrapper: reactFlowWrapper,
        fileName: `\${activeWorkflowName || 'workflow'}-screenshot.png`,
      });
    } catch (error) {
      console.error('Failed to export canvas screenshot:', error);
    }
  }, [activeWorkflowName]);

  const handleMenuAction = (action: string, data: any) => {
    if (action !== 'screenshot') saveHistory();
    const { selectedNodes } = data;
    switch (action) {
      case 'create_element':
        if (selectedNodes?.length > 0) {
          const last = selectedNodes[selectedNodes.length - 1];
          const newAsset: Node = {
            id: nextId(),
            type: 'assetNode',
            position: { x: last.position.x + 300, y: last.position.y },
            data: {
              label: 'New Asset',
              images: selectedNodes.reduce((acc: any[], node: Node) => {
                if ((node.data as any).outputImage) return [...acc, (node.data as any).outputImage];
                if ((node.data as any).outputVideo) return [...acc, (node.data as any).outputVideo];
                return acc;
              }, []),
            },
          };
          setNodes((nds) => [...nds, newAsset]);
          if (firebaseAssets.create) {
            const assetPayload: import('./types/asset').CreateAssetPayload = {
              name: (newAsset.data.label as string) || 'New Asset',
              images: Array.isArray(newAsset.data.images) ? newAsset.data.images : [],
            };
            firebaseAssets.create(assetPayload).catch(console.error);
          }
        }
        break;
      case 'duplicate':
        if (selectedNodes?.length > 0) {
          const newNodes = selectedNodes.map((node: Node) => ({
            ...node,
            id: nextId(),
            selected: true,
            position: { x: node.position.x + 50, y: node.position.y + 50 }
          }));
          setNodes(nds => [...nds.map(n => ({ ...n, selected: false })), ...newNodes]);
        }
        break;
      case 'compose_collage':
        if (selectedNodes?.length > 0) {
          const last = selectedNodes[selectedNodes.length - 1];
          const newAsset: Node = {
            id: nextId(),
            type: 'assetNode',
            position: { x: last.position.x + 300, y: last.position.y },
            data: {
              label: 'Collage',
              images: selectedNodes.reduce((acc: any[], node: Node) => {
                if ((node.data as any).outputImage) return [...acc, (node.data as any).outputImage];
                if ((node.data as any).outputVideo) return [...acc, (node.data as any).outputVideo];
                return acc;
              }, []),
            },
          };
          setNodes((nds) => [...nds, newAsset]);
        }
        break;
      case 'clear_contents':
        if (selectedNodes?.length > 0) {
          setNodes(nds => nds.map(n => {
            if (!n.selected) return n;
            const newData = { ...n.data as any };
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
        if (selectedNodes?.length > 0) {
          const ids = new Set(selectedNodes.map((n: Node) => n.id));
          setEdges(eds => eds.filter(e => !ids.has(e.source) && !ids.has(e.target)));
        }
        break;
      case 'align_left':
        if (selectedNodes?.length > 1) {
          const minX = Math.min(...selectedNodes.map((n: Node) => n.position.x));
          setNodes(nds => nds.map(n => n.selected ? { ...n, position: { ...n.position, x: minX } } : n));
        }
        break;
      case 'align_right':
        if (selectedNodes?.length > 1) {
          const maxX = Math.max(...selectedNodes.map((n: Node) => n.position.x + (n.measured?.width || 200)));
          setNodes(nds => nds.map(n => n.selected ? { ...n, position: { ...n.position, x: maxX - (n.measured?.width || 200) } } : n));
        }
        break;
      case 'align_center':
      case 'align_center_h':
        if (selectedNodes?.length > 1) {
          const avgX = selectedNodes.reduce((sum: number, n: Node) => sum + n.position.x + (n.measured?.width || 200) / 2, 0) / selectedNodes.length;
          setNodes(nds => nds.map(n => n.selected ? { ...n, position: { ...n.position, x: avgX - (n.measured?.width || 200) / 2 } } : n));
        }
        break;
      case 'save_as_template':
        if (selectedNodes?.length > 0) setShowTemplateModal(true);
        break;
      case 'create_workflow':
        if (selectedNodes?.length > 0) {
          const name = `Workflow ${workflows.length + 1}`;
          const ids = new Set(selectedNodes.map((n: Node) => n.id));
          const newWf = {
            id: nextId(),
            name,
            nodes: selectedNodes.map((node: Node) => ({
              ...node,
              selected: false,
              position: { x: node.position.x - selectedNodes[0].position.x, y: node.position.y - selectedNodes[0].position.y }
            })),
            edges: edges.filter(e => ids.has(e.source) && ids.has(e.target)),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setWorkflows([...workflows, newWf]);
          setLastGeneratedWorkflow(newWf);
        }
        break;
      case 'grid_nodes':
        if (selectedNodes?.length > 1) {
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
        if (selectedNodes?.length > 0) {
          const nodesToCopy = selectedNodes.map((node: Node) => ({ ...node, selected: false }));
          setClipboardNodes(nodesToCopy);
          clipboardRef.current = nodesToCopy;
          try {
            navigator.clipboard.writeText(JSON.stringify({ type: 'nodespace-nodes', nodes: nodesToCopy, copiedAt: new Date().toISOString() }));
          } catch (e) { /* ignore */ }
          if (action === 'cut') setNodes(nds => nds.filter(n => !selectedNodes.find((sn: Node) => sn.id === n.id)));
        }
        break;
      case 'paste':
        const pasteFromClipboard = async () => {
          let nodesToPaste = clipboardRef.current || clipboardNodes;
          try {
            const text = await navigator.clipboard.readText();
            if (text) {
              const parsed = JSON.parse(text);
              if (parsed.type === 'nodespace-nodes' && parsed.nodes) nodesToPaste = parsed.nodes;
            }
          } catch (e) { /* ignore */ }
          if (nodesToPaste?.length > 0) {
            const count = (pastePositionRef.current?.count || 0) + 1;
            pastePositionRef.current = { count };
            const offsetX = 50 * (count % 10);
            const offsetY = 50 * (count % 10);
            let baseX, baseY;
            if (data.x !== undefined && rfInstance) {
              const flowPos = rfInstance.screenToFlowPosition({ x: data.x, y: data.y });
              baseX = flowPos.x; baseY = flowPos.y;
            } else if (rfInstance) {
              const center = rfInstance.screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
              baseX = center.x; baseY = center.y;
            } else {
              baseX = nodesToPaste[0].position.x + offsetX; baseY = nodesToPaste[0].position.y + offsetY;
            }
            const minX = Math.min(...nodesToPaste.map((n: Node) => n.position.x));
            const minY = Math.min(...nodesToPaste.map((n: Node) => n.position.y));
            const newNodes = nodesToPaste.map((node: Node) => ({
              ...node,
              id: nextId(),
              selected: true,
              position: { x: baseX + (node.position.x - minX), y: baseY + (node.position.y - minY) },
              data: { ...node.data }
            }));
            setNodes(nds => [...nds.map(n => ({ ...n, selected: false })), ...newNodes]);
            saveHistory();
          }
        };
        pasteFromClipboard();
        break;
      case 'screenshot':
        handleExportScreenshot();
        break;
    }
    setMenu(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName) || (e.target as HTMLElement).isContentEditable) return;
      const cmdOrCtrl = isMacOS ? e.metaKey : e.ctrlKey;
      if (cmdOrCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo(); else handleUndo();
      } else if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault(); handleExportScreenshot();
      } else if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault(); handleMenuAction('disconnect_nodes', { selectedNodes: rfInstance?.getNodes().filter(n => n.selected) });
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault(); handleMenuAction('duplicate', { selectedNodes: rfInstance?.getNodes().filter(n => n.selected) });
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'c') {
        e.preventDefault(); handleMenuAction('copy', { selectedNodes: rfInstance?.getNodes().filter(n => n.selected) });
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'x') {
        e.preventDefault(); handleMenuAction('cut', { selectedNodes: rfInstance?.getNodes().filter(n => n.selected) });
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'v') {
        e.preventDefault(); handleMenuAction('paste', { x: window.innerWidth / 2, y: window.innerHeight / 2 });
      } else if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'x') {
        e.preventDefault(); handleMenuAction('clear_contents', { selectedNodes: rfInstance?.getNodes().filter(n => n.selected) });
      } else if (cmdOrCtrl && e.key === '.') {
        e.preventDefault(); setShowKeyboardShortcuts(true);
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-command-palette'));
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault(); setNodes(nds => nds.map(n => ({ ...n, selected: true })));
      } else if (e.key === 'Escape') {
        setNodes(nds => nds.map(n => ({ ...n, selected: false })));
        setEdges(eds => eds.map(e => ({ ...e, selected: false })));
      } else if (cmdOrCtrl && e.key === '1') {
        e.preventDefault(); rfInstance?.fitView();
      } else if (cmdOrCtrl && e.key === '2') {
        const sel = rfInstance?.getNodes().filter(n => n.selected);
        if (sel?.length && rfInstance) {
          e.preventDefault();
          rfInstance.fitView({ padding: 0.2, duration: 800, nodes: [{ id: sel[0].id }] });
        }
      } else if (e.key === ' ') {
        if (!canvasSearch.open) {
          e.preventDefault();
          // Use current mouse position if available, or center
          const x = lastMousePos.current.x;
          const y = lastMousePos.current.y;
          setCanvasSearch({ open: true, x, y });
        }
      } else if (!cmdOrCtrl && !e.shiftKey && !e.altKey && e.key) {
        const key = e.key.toLowerCase();
        let typeToAdd = null;
        switch (key) {
          case 't': typeToAdd = 'textNode'; break;
          case 'c': typeToAdd = 'comment'; break;
          case 'l': typeToAdd = 'layerEditor'; break;
          case 'a': typeToAdd = 'assetNode'; break;
          case 'b': typeToAdd = 'groupEditing'; break;
          case 'r': typeToAdd = 'routerNode'; break;
          case 'f': {
            const sel = rfInstance?.getNodes().filter(n => n.selected);
            if (sel?.length) {
              e.preventDefault();
              setNodes(nds => nds.map(n => n.selected ? { ...n, data: { ...n.data as any, folded: !(n.data as any).folded } } : n));
            }
            return;
          }
          case 'v': setActiveTool('select'); return;
          case 's': setActiveTool('slice'); return;
          case 'm': {
            const sel = rfInstance?.getNodes().filter(n => n.selected);
            if (sel?.length) {
              e.preventDefault();
              setNodes(nds => nds.map(n => n.selected ? { ...n, data: { ...n.data as any, muted: !(n.data as any).muted } } : n));
            }
            return;
          }
          case 'i': setViewMode(prev => prev === 'editor' ? 'interface' : 'editor'); return;
          case 'u': typeToAdd = 'sourceMediaNode'; break;
          case 'h': window.dispatchEvent(new CustomEvent('open-search-history')); return;
        }
        if (typeToAdd) {
          e.preventDefault();
          saveHistory();
          let x = 300, y = 300;
          if (rfInstance) {
            const center = rfInstance.screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
            x = center.x; y = center.y;
          }
          let defaults: any = { label: typeToAdd };
          for (const section of NODE_MENU) {
            const item = section.items.find((i: any) => i.type === typeToAdd);
            if (item?.defaults) { defaults = item.defaults; break; }
          }
          const newNode: Node = { id: nextId(), type: typeToAdd, position: { x, y }, data: { ...defaults } };
          setNodes(nds => [...nds, newNode]);
          setTimeout(() => {
            const el = document.querySelector(`[data-id="${newNode.id}"]`) as HTMLElement;
            if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
          }, 100);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, rfInstance, setNodes, saveHistory, handleExportScreenshot, isMacOS]);

  useEffect(() => {
    const handleOpenCommandPalette = () => setIsCommandPaletteOpen(true);
    window.addEventListener('open-command-palette', handleOpenCommandPalette);
    return () => window.removeEventListener('open-command-palette', handleOpenCommandPalette);
  }, []);

  // Handle-level disconnect (Alt + Click on a handle)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (e.altKey) {
        const target = e.target as HTMLElement;
        const handleEl = target.closest('.react-flow__handle');
        if (handleEl) {
          e.preventDefault();
          e.stopPropagation();
          const nodeId = handleEl.getAttribute('data-nodeid');
          const handleId = handleEl.getAttribute('data-handleid');

          if (nodeId && handleId) {
            saveHistory();
            setEdges(eds => eds.filter(edge => {
              const isMatch = (edge.source === nodeId && edge.sourceHandle === handleId) ||
                              (edge.target === nodeId && edge.targetHandle === handleId);
              return !isMatch;
            }));
          }
        }
      }
    };
    
    // Use capture phase to intercept before React Flow handles the click
    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => window.removeEventListener('click', handleGlobalClick, { capture: true });
  }, [setEdges, saveHistory]);

  const handleSliceStart = useCallback((e: React.PointerEvent) => {
    if (activeTool === 'slice') {
      e.stopPropagation();
      setSliceStart({ x: e.clientX, y: e.clientY });
      setSliceCurrent({ x: e.clientX, y: e.clientY });
    }
  }, [activeTool]);

  const handleSliceMove = useCallback((e: React.PointerEvent) => {
    if (activeTool === 'slice' && sliceStart) {
      e.stopPropagation();
      setSliceCurrent({ x: e.clientX, y: e.clientY });
    }
  }, [activeTool, sliceStart]);

  const handleSliceEnd = useCallback((e: React.PointerEvent) => {
    if (activeTool === 'slice' && sliceStart && sliceCurrent) {
      e.stopPropagation();
      const end = { x: e.clientX, y: e.clientY };
      const dx = end.x - sliceStart.x;
      const dy = end.y - sliceStart.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(10, Math.floor(distance / 2));

      const edgeIdsToRemove = new Set<string>();

      for (let i = 0; i <= steps; i++) {
        const x = sliceStart.x + (dx * i) / steps;
        const y = sliceStart.y + (dy * i) / steps;
        const elements = document.elementsFromPoint(x, y);
        for (const el of elements) {
          if (el.classList.contains('react-flow__edge-path') || el.classList.contains('react-flow__edge-interaction')) {
            const edgeWrapper = el.closest('.react-flow__edge');
            if (edgeWrapper) {
              const id = edgeWrapper.getAttribute('data-id');
              if (id) edgeIdsToRemove.add(id);
            }
          }
        }
      }

      if (edgeIdsToRemove.size > 0) {
        saveHistory();
        setEdges((eds) => eds.filter(edge => !edgeIdsToRemove.has(edge.id)));
      }

      setSliceStart(null);
      setSliceCurrent(null);
    } else if (activeTool === 'slice') {
      setSliceStart(null);
      setSliceCurrent(null);
    }
  }, [activeTool, sliceStart, sliceCurrent, saveHistory, setEdges]);

  const handleRenameSubmit = () => {
    if (newWorkflowName.trim() && activeWorkflowId) {
      setWorkflows(prev => prev.map(wf => wf.id === activeWorkflowId ? { ...wf, name: newWorkflowName.trim() } : wf));
    }
    setIsRenameModalOpen(false);
  };

  const handleDuplicateWorkspace = useCallback(() => {
    if (activeWorkflowId) {
      const wf = workflows.find(w => w.id === activeWorkflowId);
      if (wf) {
        const newId = Date.now().toString();
        const newWf = { ...wf, id: newId, name: wf.name + ' (Copy)' };
        setWorkflows(prev => [...prev, newWf]);
        setActiveWorkflowId(newId);
        setNodes(wf.nodes || []);
        setEdges(wf.edges || []);
      }
    }
  }, [activeWorkflowId, workflows, setNodes, setEdges]);

  const workflowRunRef = useRef(false);
  const handleRunWorkflow = useCallback(async (nodeIdFilterSet?: Set<string>) => {
    if (workflowRunRef.current) return;
    const hasScope = nodeIdFilterSet instanceof Set && nodeIdFilterSet.size > 0;
    const inScope = (n: Node) => !hasScope || nodeIdFilterSet!.has(n.id);
    workflowRunRef.current = true;
    setIsRunning(true);
    if (!nodesRef.current?.length) { setIsRunning(false); workflowRunRef.current = false; return; }
    try {
      const analyzers = nodesRef.current.filter(n => inScope(n) && (n.type === 'imageAnalyzer' || n.type === 'aiImageClassifier'));
      if (analyzers.length > 0) {
        const promises = analyzers.map(a => new Promise<void>(resolve => {
          analyzeResolvers.current[a.id] = resolve;
          updateNodeData(a.id, { triggerAnalyze: Date.now() });
        }));
        await Promise.race([Promise.all(promises), new Promise(r => setTimeout(r, 60000))]);
      }
      const textNodes = nodesRef.current.filter(n => inScope(n) && (n.type === 'imageToPrompt' || n.type === 'improvePrompt'));
      for (const t of textNodes) updateNodeData(t.id, { triggerGenerate: Date.now() });
      if (textNodes.length > 0) await new Promise(r => setTimeout(r, 4000));
      const types = [
        'generator', 'creativeUpscale', 'precisionUpscale', 'relight', 'styleTransfer',
        'removeBackground', 'fluxReimagine', 'textToIcon', 'fluxImageExpand',
        'seedreamExpand', 'ideogramExpand', 'skinEnhancer', 'ideogramInpaint',
        'facialEditing', 'groupEditing', 'changeCamera', 'kling3', 'kling3Omni',
        'kling3Motion', 'klingElementsPro', 'klingO1', 'minimaxLive', 'wan26',
        'seedance', 'ltxVideo2Pro', 'runwayGen45', 'runwayGen4Turbo', 'runwayActTwo',
        'pixVerseV5Transition', 'omniHuman', 'vfx', 'creativeVideoUpscale',
        'precisionVideoUpscale', 'musicGeneration', 'soundEffects', 'audioIsolation',
        'voiceover', 'videoImprove',
        'universalGeneratorImage', 'universalGeneratorVideo', 'tripo3d',
        'quiverImageToVector', 'quiverTextToVector',
      ];
      for (const t of types) {
        nodesRef.current.filter(n => inScope(n) && n.type === t).forEach(n => updateNodeData(n.id, { triggerGenerate: Date.now() }));
      }
      setTimeout(() => { workflowRunRef.current = false; setIsRunning(false); }, 2000);
    } catch (e) { console.error(e); workflowRunRef.current = false; setIsRunning(false); }
  }, [updateNodeData]);

  const getNextBoardName = useCallback(() => {
    const boards = workflows.filter((w: any) => (w.name || w.title || '').startsWith('Board '));
    let maxNum = 0;
    boards.forEach((b: any) => {
      const nm = b.name || b.title || '';
      const match = nm.match(/Board (\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `Board ${(maxNum + 1).toString().padStart(2, '0')}`;
  }, [workflows]);

  const handleCreateWorkflow = useCallback(async (name: string, existingId?: string | null | undefined, aiOptions: any = undefined) => {
    const id = existingId || undefined;
    if (id && !['system-test', 'ai', 'scratch', 'import'].includes(aiOptions?.type)) {
      setActiveWorkflowId(id);
      const fbWf = await loadFirebaseWorkflow(id);
      if (fbWf) { setNodes(fbWf.nodes); setEdges((fbWf.edges || []) as Edge[]); subscribe(id); }
      else { const local = workflows.find(w => w.id === id); if (local) { setNodes(local.nodes); setEdges((local.edges || []) as Edge[]); } }
      setCurrentPage('editor');
    } else if (aiOptions?.type === 'system-test') {
      const all: any[] = []; let x = 50, y = 50;
      NODE_MENU.forEach((s: any) => {
        let col = 0; s.items.forEach((i: any) => {
          all.push({ id: `test_${i.type}_${Math.random().toString(36).substr(2, 9)}`, type: i.type, position: { x, y }, data: i.defaults ? JSON.parse(JSON.stringify(i.defaults)) : { label: i.label } });
          x += 320; col++; if (col >= 4) { col = 0; x = 50; y += 250; }
        });
        x = 50; y += 400;
      });
      const newWf = await createFirebaseWorkflow(name || 'System Test Workflow', all, []);
      if (newWf) { setActiveWorkflowId(newWf.id); setNodes(all); setEdges([]); subscribe(newWf.id); }
      setCurrentPage('editor');
    } else if (aiOptions?.type === 'ai' && aiOptions.aiPrompt) {
      try {
        const res: any = await generateAIWorkflow(aiOptions.aiPrompt, aiOptions.aiMode || 'standard');
        if (res.success && res.workflow) {
          const newWf = await createFirebaseWorkflow(res.workflow.name || name, res.workflow.nodes, res.workflow.edges);
          if (newWf) { setActiveWorkflowId(newWf.id); setNodes(res.workflow.nodes); setEdges(res.workflow.edges as Edge[]); subscribe(newWf.id); }
          else {
            const id = `wf_\${Date.now()}`;
            const local = { id, name: res.workflow.name || name, nodes: res.workflow.nodes, edges: res.workflow.edges };
            setWorkflows(p => [...p, local]); setActiveWorkflowId(id); setNodes(res.workflow.nodes); setEdges(res.workflow.edges as Edge[]);
          }
        }
      } catch (e) {
        const id = `wf_${Date.now()}`;
        const newWf = { id, name, nodes: DEFAULT_NODES, edges: [] };
        setWorkflows(p => [...p, newWf]); setActiveWorkflowId(id); setNodes(DEFAULT_NODES); setEdges([]);
      }
      setCurrentPage('editor');
    } else if (aiOptions?.type === 'import' && Array.isArray(aiOptions.importedNodes)) {
      const ns = aiOptions.importedNodes, es = aiOptions.importedEdges || [], wn = aiOptions.importName || name || getNextBoardName();
      const newWf = await createFirebaseWorkflow(wn, ns, es);
      if (newWf) { setActiveWorkflowId(newWf.id); setNodes(ns); setEdges(es); subscribe(newWf.id); }
      else { const id = `wf_${Date.now()}`; setWorkflows(p => [...p, { id, name: wn, nodes: ns, edges: es }]); setActiveWorkflowId(id); setNodes(ns); setEdges(es); }
      setCurrentPage('editor');
    } else if (aiOptions?.type === 'scratch') {
      const newWf = await createFirebaseWorkflow(name, [], []);
      if (newWf) { setActiveWorkflowId(newWf.id); setNodes([]); setEdges([]); subscribe(newWf.id); }
      setCurrentPage('editor');
    } else {
      const newWf = await createFirebaseWorkflow(name, DEFAULT_NODES, DEFAULT_EDGES);
      if (newWf) { setActiveWorkflowId(newWf.id); setNodes(DEFAULT_NODES); setEdges(DEFAULT_EDGES); subscribe(newWf.id); }
      setCurrentPage('editor');
    }
  }, [workflows, setNodes, setEdges, createFirebaseWorkflow, loadFirebaseWorkflow, subscribe, getNextBoardName]);

  const handleImportWorkflowFile = useCallback(async (file: File) => {
    try {
      const text = await file.text(); 
      const parsed: any = JSON.parse(text);
      let ns: any[] = [], es: any[] = [], wn = parsed.name || file.name.replace(/\.json$/i, '') || getNextBoardName();
      if (Array.isArray(parsed.nodes)) { ns = parsed.nodes; es = parsed.edges || []; }
      else if (parsed.workflow?.nodes) { ns = parsed.workflow.nodes; es = parsed.workflow.edges || []; wn = parsed.workflow.name || wn; }
      else return alert('Invalid JSON format');
      await handleCreateWorkflow(wn, undefined, { type: 'import', importedNodes: ns, importedEdges: es, importName: wn });
    } catch (e) { alert('Failed to read file'); }
  }, [handleCreateWorkflow, getNextBoardName]);

  const handleImportGeneratedWorkflow = useCallback(async (wf: { name?: string, nodes: any[], edges: any[] }) => {
    await handleCreateWorkflow(wf.name || getNextBoardName(), undefined, { 
      type: 'import', 
      importedNodes: wf.nodes, 
      importedEdges: wf.edges, 
      importName: wf.name || getNextBoardName() 
    });
  }, [handleCreateWorkflow, getNextBoardName]);

  const handlePromptWorkflow = useCallback(async (promptText: string) => {
    const t = promptText?.trim(); if (!t) return;
    await handleCreateWorkflow(getNextBoardName(), undefined, { type: 'ai', aiPrompt: t, aiMode: 'standard' });
  }, [handleCreateWorkflow, getNextBoardName]);

  const persistWorkflowState = useCallback(async ({ workflowId, workflowNodes, workflowEdges, includeThumbnail = false, forceThumbnail = false, extraUpdates = {} }: any) => {
    if (!workflowId) return;
    const updates = { nodes: workflowNodes, edges: workflowEdges, ...extraUpdates };
    if (includeThumbnail) {
      const sig = buildGraphSignature(workflowNodes, workflowEdges);
      const now = Date.now();
      if (forceThumbnail || (sig !== lastThumbnailGraphSignatureRef.current && (now - lastThumbnailUploadAtRef.current > 60000))) {
        try {
          const dataUrl = await captureCanvasViewportPngDataUrl({ reactFlowWrapper: reactFlowWrapper, maxWidth: 1600, maxHeight: 900 });
          const res = await uploadWorkflowThumbnail(dataUrl, workflowId);
          if (res?.url) { updates.thumbnail = res.url; lastThumbnailUploadAtRef.current = now; lastThumbnailGraphSignatureRef.current = sig; }
        } catch (e) { console.warn(e); }
      }
    }
    await saveFirebaseWorkflow(workflowId, updates);
    lastSavedGraphSignatureRef.current = buildGraphSignature(workflowNodes, workflowEdges);
  }, [buildGraphSignature, saveFirebaseWorkflow]);

  useEffect(() => {
    (window as any).runSystemTest = () => handleCreateWorkflow('System Test Workflow', undefined, { type: 'system-test' });
  }, [handleCreateWorkflow]);

  useEffect(() => {
    const handleDirty = () => { isDirtyRef.current = true; };
    window.addEventListener('canvas-dirty', handleDirty);
    
    if (currentPage !== 'editor' || !activeWorkflowId) {
      return () => window.removeEventListener('canvas-dirty', handleDirty);
    }
    
    if (!isDirtyRef.current) {
      return () => window.removeEventListener('canvas-dirty', handleDirty);
    }
    
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(async () => {
      if (autosaveInFlightRef.current) return;
      const sig = buildGraphSignature(nodes, edges);
      if (sig === lastSavedGraphSignatureRef.current) {
        isDirtyRef.current = false;
        return;
      }
      autosaveInFlightRef.current = true;
      try {
        await persistWorkflowState({
          workflowId: activeWorkflowId,
          workflowNodes: nodes,
          workflowEdges: edges,
          includeThumbnail: true
        });
        isDirtyRef.current = false;
      } finally {
        autosaveInFlightRef.current = false;
      }
    }, 5000);
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      window.removeEventListener('canvas-dirty', handleDirty);
    };
  }, [activeWorkflowId, buildGraphSignature, currentPage, edges, nodes, persistWorkflowState]);

  const handleBackToHome = useCallback(async () => {
    if (activeWorkflowId) {
      await persistWorkflowState({ workflowId: activeWorkflowId, workflowNodes: nodesRef.current, workflowEdges: edgesRef.current, includeThumbnail: true, forceThumbnail: true });
      unsubscribe();
    }
    setCurrentPage('home');
  }, [activeWorkflowId, persistWorkflowState, unsubscribe]);

  const connectionValidator = useCallback((conn: any) => isValidConnection(conn), []);
  const defaultEdgeOptions = useMemo(() => ({ type: 'default', style: { strokeWidth: 2 } }), []);

  const handleDeleteWorkflows = async (ids: string[]) => {
    setWorkflows(p => p.filter(w => !ids.includes(w.id)));
    for (const id of ids) deleteFirebaseWorkflow(id).catch(console.error);
  };

  const handleRenameBoard = useCallback(async (id: string, name: string) => {
    if (!name) return;
    setWorkflows(p => p.map(w => w.id === id ? { ...w, name } : w));
    await saveFirebaseWorkflow(id, { name });
  }, [saveFirebaseWorkflow]);

  const handleDeleteBoard = useCallback(async (id: string) => {
    if (id === activeWorkflowId) {
      const rem = workflows.filter(w => w.id !== id);
      if (rem.length) handleCreateWorkflow(rem[0].name, rem[0].id);
      else { setCurrentPage('home'); setActiveWorkflowId(undefined); }
    }
    handleDeleteWorkflows([id]);
  }, [activeWorkflowId, workflows, handleCreateWorkflow]);

  const handleExportJSON = useCallback(() => {
    const b = new Blob([JSON.stringify({ nodes: nodesRef.current, edges: edgesRef.current }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = `${activeWorkflowName || 'workflow'}.json`;
    a.click();
  }, [activeWorkflowName]);

  const handleApplyActions = useCallback((actions: any[]) => {
    if (!actions || !Array.isArray(actions)) return;

    saveHistory();
    const affectedNodeIds: string[] = [];

    setNodes((nds) => {
      let nextNodes = [...nds];
      for (const action of actions) {
        if (action.action === 'UPDATE_NODE' && action.id) {
          affectedNodeIds.push(action.id);
          nextNodes = nextNodes.map(n => n.id === action.id ? { ...n, data: { ...n.data, ...action.data, highlighted: true } } : n);
        } else if (action.action === 'ADD_NODE' && action.type) {
          const id = action.id || `node-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
          affectedNodeIds.push(id);
          nextNodes.push({
            id,
            type: action.type,
            position: action.position || { x: 400, y: 400 },
            data: { ...(action.data || {}), label: action.data?.label || action.type, highlighted: true }
          });
        } else if (action.action === 'DELETE_NODE' && action.id) {
          nextNodes = nextNodes.filter(n => n.id !== action.id);
        }
      }
      return nextNodes;
    });

    setEdges((eds) => {
      let nextEdges = [...eds];
      for (const action of actions) {
        if (action.action === 'ADD_EDGE' && action.source && action.target) {
          const edgeId = action.id || `e-${action.source}-${action.sourceHandle}-${action.target}-${action.targetHandle}`;
          const color = action.sourceHandle ? getHandleColor(action.sourceHandle) : '#fff';
          nextEdges.push({
            id: edgeId,
            source: action.source,
            target: action.target,
            sourceHandle: action.sourceHandle,
            targetHandle: action.targetHandle,
            style: { stroke: color, strokeWidth: 2 },
          });
        } else if (action.action === 'DELETE_EDGE' && action.id) {
          nextEdges = nextEdges.filter(e => e.id !== action.id);
        } else if (action.action === 'DELETE_NODE' && action.id) {
          nextEdges = nextEdges.filter(e => e.source !== action.id && e.target !== action.id);
        }
      }
      return nextEdges;
    });

    if (affectedNodeIds.length > 0) {
      showToast(`AI applied ${affectedNodeIds.length} changes to canvas`, 'success');
      setTimeout(() => {
        setNodes((nds) => nds.map(n => 
          affectedNodeIds.includes(n.id) ? { ...n, data: { ...n.data, highlighted: false } } : n
        ));
      }, 5000);
    }

    isDirtyRef.current = true;
  }, [setNodes, setEdges, saveHistory, showToast]);

  if (authLoading) {

    return (
      <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: 'spin 1s linear infinite' }}>⟳</div>
          <p style={{ color: '#888', fontSize: 14 }}>Initializing authentication...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (authError) {
    const isApiError = authError.includes('api-key') || authError.includes('API key');
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e0e0e0', padding: 24 }}>
        <div style={{ maxWidth: 600, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>&#9888;</div>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>{isApiError ? 'Firebase API Key Error' : 'Authentication Error'}</h2>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>{isApiError ? 'The Firebase API key is not valid for this domain.' : authError}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => window.location.reload()} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', fontSize: 14, borderRadius: 8, cursor: 'pointer' }}>Retry</button>
            <button onClick={() => setAuthError(undefined)} style={{ background: 'transparent', color: '#888', border: '1px solid #444', padding: '12px 24px', fontSize: 14, borderRadius: 8, cursor: 'pointer' }}>Dismiss</button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && currentPage !== 'landing' && !currentPage.startsWith('auth-')) setCurrentPage('landing');
  if (!isAuthenticated && currentPage.startsWith('auth-')) {
    const initial = currentPage.replace('auth-', '');
    return <AuthPage initialScreen={initial === 'login' || initial === 'signup' ? initial : 'login'} onNavigate={handleNavigate} />;
  }

  if (showSystemLoading) {
    const total = IMAGE_MODELS.length + VIDEO_MODELS.length;
    return <SystemLoadingProcess config={{ phases: [{ label: 'Phase 01', value: `Loading ${Object.keys(nodeTypes).length} nodes` }, { label: 'Signal Scan', value: `Loading ${total} models` }], code: `Felix Seeger | ${new Date().toISOString().split('T')[0]}` }} onComplete={() => { sessionStorage.setItem(SLP_KEY, '1'); setShowSystemLoading(false); }} />;
  }

  if (!isAuthenticated || currentPage === 'landing') {
    return (
      <div className="app-container">
        <TopBar currentPage={currentPage} onNavigate={handleNavigate} workflowName={undefined} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
        <div className="app-content">
          <LandingPage theme={theme} setTheme={setTheme} onCreateWorkflow={handleCreateWorkflow} onDeleteWorkflows={handleDeleteWorkflows} workflows={workflows} onNavigate={handleNavigate} />
        </div>
      </div>
    );
  }

  if (currentPage === 'home') {
    return (
      <>
        <ProjectsDashboard
          projects={workflows}
          communityWorkflows={communityWorkflows}
          sharedWorkflows={sharedWorkflows}
          onShareWorkflow={shareFirebaseWorkflow}
          onUnshareWorkflow={unshareFirebaseWorkflow}
          onCreateProject={(n) => handleCreateWorkflow(n || getNextBoardName())}
          onImportWorkflowFile={handleImportWorkflowFile}
          onPromptWorkflow={handlePromptWorkflow}
          onOpenProject={(p: any) => handleCreateWorkflow(p.name || p.title || '', p.id)}
          onUpdateProject={async (id, up: any) => { setWorkflows(prev => prev.map(w => w.id === id ? { ...w, ...up } : w)); if (saveFirebaseWorkflow) await saveFirebaseWorkflow(id, up); }}
          onTogglePublic={async (id, pub) => { const name = (getFirebaseAuth().currentUser?.displayName || getFirebaseAuth().currentUser?.email?.split('@')[0]) || 'User'; await toggleWorkflowPublic(id, pub, name); }}
          onDeleteProject={id => handleDeleteWorkflows([id])}
          onDuplicateProject={async (p: any) => { if (createFirebaseWorkflow) await createFirebaseWorkflow(`${p.name || p.title} (Copy)`, p.nodes || [], p.edges || []); }}
          onCloneProject={async (p: any) => { if (createFirebaseWorkflow) { const res = await createFirebaseWorkflow(`${p.name || p.title} (Cloned)`, p.nodes || [], p.edges || []); if (res) alert('Cloned successfully'); } }}
          onLogout={handleLogout}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          theme={theme}
          setTheme={setTheme}
        />
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </>
    );
  }

  if (currentPage === 'assets') {
    return (
      <div className="app-container">
        <TopBar currentPage={currentPage} onNavigate={handleNavigate} workflowName={undefined} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
        <div className="app-content" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}><GlobalAssetVault /></div>
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </div>
    );
  }

  if (currentPage === 'workspaces') {
    return (
      <div className="app-container">
        <TopBar currentPage={currentPage} onNavigate={handleNavigate} workflowName={undefined} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
        <div className="app-content"><WorkspacesPage onCreateWorkspace={() => setCurrentPage('home')} workspaces={[]} /></div>
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </div>
    );
  }

  if (currentPage === 'workflow-settings') {
    return (
      <div className="app-container">
        <TopBar currentPage={currentPage} onNavigate={handleNavigate} workflowName={undefined} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
        <div className="app-content"><WorkflowSettingsPage /></div>
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </div>
    );
  }

  if (currentPage === 'drawflow' || currentPage === 'node-banana') {
    return (
      <div className="app-container">
        <TopBar currentPage={currentPage} onNavigate={handleNavigate} workflowName={undefined} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
        <div className="app-content" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {currentPage === 'drawflow' ? <DrawflowLab /> : <NodeBananaLab />}
        </div>
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </div>
    );
  }

  return (
    <CanvasProvider value={canvasContextValue}>
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
        onLockView={() => setIsLocked(p => !p)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        isAuthenticated={isAuthenticated}
      />
      {isRenameModalOpen && (
        <div className="modal-overlay">
          <div className="modal-surface">
            <h3 className="modal-title">Rename Workspace</h3>
            <input autoFocus className="modal-input" type="text" value={newWorkflowName} onChange={e => setNewWorkflowName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleRenameSubmit(); if (e.key === 'Escape') setIsRenameModalOpen(false); }} />
            <div className="modal-actions">
              <button className="modal-btn modal-btn-secondary" onClick={() => setIsRenameModalOpen(false)}>Cancel</button>
              <button className="modal-btn modal-btn-primary" onClick={handleRenameSubmit}>Save</button>
            </div>
          </div>
        </div>
      )}
      <EditorTopBar
        nodes={nodes}
        edges={edges}
        workflowId={activeWorkflowId || undefined}
        isPublic={workflows.find(w => w.id === activeWorkflowId)?.isPublic || false}
        onTogglePublic={async (pub) => { if (activeWorkflowId) { const name = (getFirebaseAuth().currentUser?.displayName || getFirebaseAuth().currentUser?.email?.split('@')[0]) || 'User'; await toggleWorkflowPublic(activeWorkflowId, pub, name); setWorkflows(p => p.map(w => w.id === activeWorkflowId ? { ...w, isPublic: pub } : w)); } }}
        onOpenKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
        onSave={() => { if (activeWorkflowId) setWorkflows(p => p.map(w => w.id === activeWorkflowId ? { ...w, nodes: nodesRef.current, edges: edgesRef.current, nodeCount: nodesRef.current.length } : w)); }}
        onSaveWithEmbeddedWorkflow={async () => {
          if (!activeWorkflowId) return;
          try {
            const data = { nodes: nodesRef.current, edges: edgesRef.current };
            const providers: string[] = [];
            nodesRef.current.forEach((n: any) => { if (n.data?.provider) providers.push(n.data.provider); else if (n.type) { const map: any = { 'generator': 'freepik', 'image-analyzer': 'anthropic', 'kling3': 'freepik', 'runway': 'runway', 'music-generation': 'elevenlabs', 'voiceover': 'elevenlabs' }; if (map[n.type]) providers.push(map[n.type]); } });
            const outputNodes = nodesRef.current.filter(n => n.type?.includes('Output'));
            if (!outputNodes.length) return;
            const res = await fetch('/api/embed-workflow', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ output: outputNodes[0].data, workflow: data, providers }) });
            const result = await res.json();
            if (result.success) setWorkflows(p => p.map(w => w.id === activeWorkflowId ? { ...w, nodes: nodesRef.current, edges: edgesRef.current, nodeCount: nodesRef.current.length, embeddedOutput: result.embeddedOutput, hasEmbeddedWorkflow: true } : w));
          } catch (e) { console.error(e); }
        }}
        onExportJSON={() => { const b = new Blob([JSON.stringify({ nodes: nodesRef.current, edges: edgesRef.current }, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${activeWorkflowName}.json`; a.click(); }}
        onImportJSON={() => {
          const i = document.createElement('input');
          i.type = 'file';
          i.accept = '.json';
          i.onchange = (e: any) => {
            const f = e.target.files[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = (ev: any) => {
              try {
                const p = JSON.parse(ev.target.result);
                if (!isWorkflowImportData(p)) {
                  throw new Error('Invalid format: file must contain name, "nodes", and "edges" arrays');
                }
                if (p.nodes.length === 0 && p.edges.length === 0) {
                  throw new Error('Empty workflow: file contains no nodes or edges');
                }
                setNodes(p.nodes);
                setEdges(p.edges);
              } catch (err) {
                const msg = err instanceof Error ? err.message : 'Failed to import JSON';
                alert(`Import Error: ${msg}`);

                console.error(err);
              }
            };
            r.readAsText(f);
          };
          i.click();
        }}
        onScreenshot={handleExportScreenshot}
        projectName={activeWorkflowName}
        onRenameProject={(n) => { if (activeWorkflowId && n) return handleRenameBoard(activeWorkflowId, n); }}
      />
      <GlobalProgressBar nodes={nodes} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: '#1a1a1a' }}>
        <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }} onDrop={onDrop} onDragOver={onDragOver}
          onMouseMove={(e) => {
            lastMousePos.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerDownCapture={handleSliceStart}
          onPointerMoveCapture={handleSliceMove}
          onPointerUpCapture={handleSliceEnd}
          onPointerCancelCapture={handleSliceEnd}
        >
          {sliceStart && sliceCurrent && (
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
              <line 
                x1={sliceStart.x - (reactFlowWrapper.current?.getBoundingClientRect().left || 0)} 
                y1={sliceStart.y - (reactFlowWrapper.current?.getBoundingClientRect().top || 0)} 
                x2={sliceCurrent.x - (reactFlowWrapper.current?.getBoundingClientRect().left || 0)} 
                y2={sliceCurrent.y - (reactFlowWrapper.current?.getBoundingClientRect().top || 0)} 
                stroke="#ef4444" 
                strokeWidth="2" 
                strokeDasharray="4 4" 
              />
            </svg>
          )}
          {viewMode === 'interface' && <WorkflowInterface nodes={nodes} edges={edges} onUpdateNodeData={updateNodeData} onRunWorkflow={() => handleRunWorkflow()} onSwitchToEditor={() => setViewMode('editor')} isRunning={isRunning} />}
          <GooeyNodesMenu 
           nodeMenu={NODE_MENU} 
           templates={firebaseTemplates.templates} 
           assets={firebaseAssets.assets} 
           publicAssets={firebaseAssets.publicAssets}
           onCreateAsset={(d: any) => firebaseAssets.create?.({
             name: d.name,
             images: d.images,
             isPublic: d.isPublic ?? false
           })} 
           onAddNode={addNode} 
           onOpenProfile={() => setIsProfileModalOpen(true)} 
          />          <LayoutHelper selectedNodes={nodes.filter(n => n.selected)} isVisible={nodes.filter(n => n.selected).length >= 2} onAlign={(a, sn) => { saveHistory(); handleMenuAction(a, { selectedNodes: sn }); }} />
          <ReferenceSelection selectedImages={referenceImages} onImagesChange={(d: any) => setReferenceImages(d || [])} />
          {currentPage === 'editor' && (
            <InspectorPanel
              nodes={nodes}
              edges={edges}
              onUpdateNodeData={updateNodeData}
              onDeleteNode={(id) => {
                saveHistory();
                setNodes((nds) => nds.filter((n) => n.id !== id));
                setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
              }}
              onRunNode={(id) => handleRunWorkflow(new Set([id]))}
              isRunning={isRunning}
            />
          )}
          {viewMode === 'editor' && (
            <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 2000 }}>
              <CanvasRunToolbar
                onRun={handleRunWorkflow} isRunning={isRunning} edges={edges} selectedNodeIds={selectedCanvasNodeIds}
                onAutoLayout={handleAutoLayout}
                onAddImage={() => addNodeAtViewportCenter('universalGeneratorImage')}
                onAddVideo={() => addNodeAtViewportCenter('universalGeneratorVideo')}
                onAddThreeD={() => addNodeAtViewportCenter('tripo3d')}
                onAddSound={() => addNodeAtViewportCenter('musicGeneration')}
                onAddTextLlm={() => addNodeAtViewportCenter('generator')}
                onAddPrompt={() => addNodeAtViewportCenter('textNode')}
                onAddOutput={() => addNodeAtViewportCenter('response')}
                allNodesSections={canvasAllNodesSections}
                onAddNodeFromMenu={(t: string, d: any) => addNodeAtViewportCenter(t, d)}
                onSelectAll={handleSelectAllNodes} onDeselectAll={handleDeselectAllCanvas} onFitView={handleCanvasFitView}
                onOpenBrowseModels={() => setBrowseModelsOpen(true)}
              />
            </div>
          )}
          <CanvasNavigation onCenterOnNode={() => { const sel = nodes.filter(n => n.selected); if (sel.length && rfInstance) rfInstance.fitView({ padding: 0.2, duration: 800, nodes: [{ id: sel[0].id }] }); }} />
          <KeyboardShortcutsModal isOpen={showKeyboardShortcuts} onClose={() => setShowKeyboardShortcuts(false)} />
          <MegaMenuModelSearch open={browseModelsOpen} onClose={() => setBrowseModelsOpen(false)} onSelect={(k: string, m: string) => handleApplyModelToAll(k, m)} />
          <div style={{ position: 'absolute', bottom: 96, right: 24, zIndex: 10 }}><Queue nodes={nodes} /></div>
          <WorkflowLineageTracker />
          <WorkflowHealthMonitor />
          <SmartConnectorUI activeConnection={activeConnection} />
          <MatrixDot dotSize={2} dotColor={theme === 'light' ? '#cbd5e1' : '#3a3a3a'} spacing={28} opacity={theme === 'light' ? 0.45 : 0.6} />
          <ReactFlow
            nodes={nodes} edges={edges} onInit={setRfInstance}
            onNodesChange={customOnNodesChange} onEdgesChange={customOnEdgesChange}
            onConnect={(p) => { saveHistory(); onConnect(p); }} onConnectEnd={handleConnectEnd}
            onEdgesDelete={(d) => { saveHistory(); onEdgesDelete(d); }}
            onMoveStart={() => { isPanningRef.current = true; beginInteraction(); }}
            onMoveEnd={() => { isPanningRef.current = false; endInteraction(); }}
            onNodeDragStart={() => { isDraggingNodeRef.current = true; beginInteraction(); }}
            onNodeDragStop={() => { isDraggingNodeRef.current = false; endInteraction(); }}
            onConnectStart={handleConnectStart}
            isValidConnection={connectionValidator} nodeTypes={nodeTypes} defaultEdgeOptions={defaultEdgeOptions}
            fitView fitViewOptions={{ padding: 0.1, minZoom: 0.1, maxZoom: 2 }} minZoom={0.1} maxZoom={2}
            panOnDrag={isLocked ? false : (activeTool === 'hand' ? [0, 1, 2] : (activeTool === 'slice' ? [1, 2] : [1, 2]))} panOnScroll={false}
            selectionOnDrag={activeTool === 'select'} selectionMode={SelectionMode.Partial} selectionKeyCode={activeTool === 'select' ? null : 'Shift'}
            multiSelectionKeyCode="Meta" nodeDragThreshold={5} elevateNodesOnSelect elevateEdgesOnSelect
            zoomOnScroll={false} nodesDraggable={!isLocked} nodesConnectable={!isLocked} elementsSelectable={!isLocked}
            autoPanOnConnect autoPanOnNodeDrag connectionRadius={40} deleteKeyCode={['Backspace', 'Delete']}
            colorMode={theme === 'light' ? 'light' : 'dark'} style={{ background: 'var(--color-surface)' }}
            onPaneContextMenu={onPaneContextMenu} onNodeContextMenu={onNodeContextMenu} onSelectionContextMenu={onSelectionContextMenu}
            onPaneClick={(e) => { 
              setMenu(undefined); 
              setCanvasSearch({ ...canvasSearch, open: false }); 
              setNodes(nds => nds.map(n => n.selected ? { ...n, selected: false } : n)); 
              setEdges(eds => eds.map(e => e.selected ? { ...e, selected: false } : e)); 
              if (e.detail === 2) {
                setCanvasSearch({ open: true, x: (e as any).clientX, y: (e as any).clientY });
              }
            }}

            >
            {canvasSearch.open && (
              <CanvasSearch 
                isOpen={canvasSearch.open} 
                position={{ x: canvasSearch.x, y: canvasSearch.y }}
                onClose={() => setCanvasSearch({ ...canvasSearch, open: false })}
                onSelect={(type, defaults) => {
                  saveHistory();
                  const flowPos = rfInstance?.screenToFlowPosition({ x: canvasSearch.x, y: canvasSearch.y }) || { x: 300, y: 300 };
                  const newNode: Node = { 
                    id: nextId(), 
                    type, 
                    position: flowPos, 
                    data: { ...defaults } 
                  };
                  setNodes(nds => [...nds, newNode]);
                  setTimeout(() => {
                    const el = document.querySelector(`[data-id="${newNode.id}"]`) as HTMLElement;
                    if (el) { el.focus(); }
                  }, 100);
                }}
              />
            )}
            {menu && (

              <div style={{ position: 'absolute', top: menu.y, left: menu.x, backgroundColor: 'rgba(30, 30, 30, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', zIndex: 1000, minWidth: 220, padding: '6px 0' }}>
                {menu.items.map((item: any, idx: number) => item.type === 'divider' ? <div key={idx} style={{ height: 1, background: 'rgba(255, 255, 255, 0.15)', margin: '6px 0' }} /> : (
                  <div key={item.action} onClick={e => { e.stopPropagation(); handleMenuAction(item.action, menu); }} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 16px', margin: '0 6px', borderRadius: 6, color: '#fff', fontSize: 14, cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{item.icon}<span>{item.label}</span></div>{item.shortcut && <span style={{ opacity: 0.6, fontSize: 12 }}>{item.shortcut}</span>}
                  </div>
                ))}
              </div>
            )}
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color={theme === 'light' ? '#94a3b8' : '#333'} />
          </ReactFlow>
          <CollaboratorPresence />
          <LiveActionFeed />
          <ChatButton isOpen={isChatOpen} onClick={() => setIsChatOpen(!isChatOpen)} />
          <ChatUI
            ref={chatUIRef} 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)}
            externalMessages={chatMessages as any}
            onStartNewConversation={() => { startNewConversation(); setChatSuggestions([]); }}
            isChatting={true}
            suggestions={chatSuggestions}
            onSendMessage={async (_msg: any) => {
              setIsRunning(true);
              try {
                // Save user message to Firebase
                await persistChatMessage(_msg, 'user');
                
                // Get AI response from backend
                const history = chatMessages.map(m => ({
                  role: m.type === 'assistant' ? 'assistant' : 'user',
                  content: m.content
                }));
                
                // We add the current canvas state as system context invisibly, stripping out large data
                const strippedNodes = nodesRef.current.map(n => {
                  const dataCopy = { ...n.data } as any;
                  // Strip out heavy fields to save tokens
                  delete dataCopy.outputImage;
                  delete dataCopy.outputVideo;
                  delete dataCopy.localImages;
                  delete dataCopy.mediaFiles;
                  delete dataCopy.images;
                  delete dataCopy.executionProgress;
                  delete dataCopy.isGenerating;
                  return { id: n.id, type: n.type, position: n.position, data: dataCopy };
                });
                
                const canvasContext = {
                  nodes: strippedNodes,
                  edges: edgesRef.current.map(e => ({ 
                    id: e.id, 
                    source: e.source, 
                    target: e.target, 
                    sourceHandle: e.sourceHandle, 
                    targetHandle: e.targetHandle 
                  }))
                };

                const systemContext = `
[SYSTEM: CURRENT CANVAS STATE]
Nodes: ${JSON.stringify(canvasContext.nodes)}
Edges: ${JSON.stringify(canvasContext.edges)}

You are an expert AI workflow builder. You can modify the existing canvas by outputting a JSON code block with actions:
\`\`\`json
{
  "canvas_actions": [
    { "action": "UPDATE_NODE", "id": "node-id", "data": { "param": "value" } },
    { "action": "ADD_NODE", "id": "unique-id", "type": "nodeType", "position": {"x":x,"y":y}, "data": {} },
    { "action": "DELETE_NODE", "id": "node-id" },
    { "action": "ADD_EDGE", "source": "src-id", "target": "dst-id", "sourceHandle": "out", "targetHandle": "in" },
    { "action": "DELETE_EDGE", "id": "edge-id" }
  ],
  "suggestions": ["Follow-up question 1", "Action suggestion 2"]
}
\`\`\`
Return actions if modifications are requested. The 'data' for UPDATE_NODE merges with existing node data.
Always provide 2-4 "suggestions" for the user to continue the conversation or workflow.

If the user wants to generate a COMPLETELY NEW workflow from scratch (overwriting the canvas), output a full workflow JSON block:
\`\`\`json
{
  "nodes": [
    { "id": "n1", "type": "input", "position": {"x": 100, "y": 100}, "data": { "label": "Input" } },
    ...
  ],
  "edges": [
    { "id": "e1", "source": "n1", "target": "n2", "sourceHandle": "output", "targetHandle": "input" }
  ]
}
\`\`\`
Available node types: input, generator, imageAnalyzer, creativeUpscale, precisionUpscale, relight, styleTransfer, removeBackground, fluxReimagine, fluxImageExpand, seedreamExpand, ideogramExpand, skinEnhancer, ideogramInpaint, kling3, kling3Omni, kling3Motion, wan26, seedance, runwayGen45, runwayGen4Turbo, runwayActTwo, pixVerseV5Transition, omniHuman, vfx, creativeVideoUpscale, precisionVideoUpscale, textToIcon, imageToPrompt, improvePrompt, aiImageClassifier, musicGeneration, soundEffects, audioIsolation, voiceover, response, adaptedPrompt, layerEditor, comment, routerNode, groupEditing, facialEditing, universalGeneratorImage, universalGeneratorVideo, videoImprove, tripo3d, textElement, imageOutput, videoOutput, soundOutput.
`;
                const promptWithContext = `${_msg}\n\n${systemContext}`;
                const res: any = await sendChat(promptWithContext, history, undefined, referenceImages);

                if (res.success && res.response) {
                  // Save assistant response to Firebase
                  await persistChatMessage(res.response, 'assistant');

                  // Auto-apply actions and suggestions if present
                  let actions = res.commands;
                  let suggestions = res.suggestions || [];
                  
                  const jsonMatch = res.response.match(/\`\`\`json\n([\s\S]*?)\n\`\`\`/);
                  if (jsonMatch) {
                    try {
                      const parsed = JSON.parse(jsonMatch[1]);
                      if (parsed.canvas_actions) actions = parsed.canvas_actions;
                      if (parsed.suggestions) suggestions = parsed.suggestions;
                      
                      if (parsed.nodes && parsed.edges) {
                        setNodes(parsed.nodes);
                        setEdges(parsed.edges);
                        showToast('Generated new workflow', 'success');
                      }
                    } catch (e) { /* ignore parse errors */ }
                  }

                  if (actions && Array.isArray(actions)) {
                    handleApplyActions(actions);
                  }
                  
                  if (suggestions && Array.isArray(suggestions)) {
                    setChatSuggestions(suggestions);
                  }
                } else {
                  const errorMsg = 'Error: ' + (res.error?.message || res.message || 'Please try again.');
                  chatUIRef.current?.addMessage({ type: 'assistant', content: errorMsg });
                }
              } catch (e: any) { 
                chatUIRef.current?.addMessage({ type: 'assistant', content: 'Connection error' }); 
              } finally {
                setIsRunning(false);
              }
            }}
            onGenerate={async (_msg: string) => {
              if (!_msg?.trim()) return;
              setIsRunning(true);
              try {
                // Save prompt to chat history
                await persistChatMessage(_msg, 'user');
                
                const context = { capabilities: NODE_TYPE_CAPABILITIES };
                const res: any = await generateAIWorkflow(_msg.trim(), 'standard', context, referenceImages);
                if (res.success && res.workflow) {
                  setLastGeneratedWorkflow(res.workflow);
                  const newWf = await createFirebaseWorkflow(res.workflow.name || 'AI Generated Workflow', res.workflow.nodes, res.workflow.edges);
                  if (newWf) {
                    setActiveWorkflowId(newWf.id);
                    setNodes(res.workflow.nodes);
                    setEdges(res.workflow.edges as Edge[]);
                    subscribe(newWf.id);
                    
                    const successMsg = `Successfully generated workflow: ${newWf.name}`;
                    await persistChatMessage(successMsg, 'assistant', { workflowId: newWf.id });
                  } else {
                    setNodes(res.workflow.nodes);
                    setEdges(res.workflow.edges as Edge[]);
                  }
                } else {
                  const errorMsg = 'Failed to generate workflow. ' + (res.error?.message || '');
                  await persistChatMessage(errorMsg, 'assistant');
                }
              } catch (e) {
                console.error('[AI Workflow] Generation error:', e);
              } finally {
                setIsRunning(false);
              }
            }}
            isGenerating={isRunning} 
            disabled={isRunning} 
            referenceImages={referenceImages}
            setReferenceImages={setReferenceImages}
            assets={firebaseAssets.assets}
            onCreateAsset={firebaseAssets.create}
            selectedNodes={nodes.filter(n => n.selected)}
            lastGeneratedWorkflow={lastGeneratedWorkflow} 
            onSetNodes={setNodes} 
            onSetEdges={setEdges}
            onImportWorkflow={handleImportGeneratedWorkflow}
            onApplyActions={handleApplyActions}
          />
        </div>
      </div>
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <OnboardingTour />
      <TemplateBuilderModal isOpen={showTemplateModal} onClose={() => setShowTemplateModal(false)} selectedNodes={nodes.filter(n => n.selected)} nodes={nodes} edges={edges} onCreated={({ template }: any) => { setShowTemplateModal(false); saveLocalTemplate(template); if (firebaseTemplates.create) firebaseTemplates.create(template).catch(err => showToast(`Failed to save template: ${err.message}`)); }} />
      <BottomBar workflows={workflows} activeWorkflowId={activeWorkflowId} onSwitchWorkflow={handleCreateWorkflow} onRenameBoard={handleRenameBoard} onDeleteBoard={handleDeleteBoard} />
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onAddNode={addNodeAtViewportCenter}
        onRunWorkflow={() => handleRunWorkflow()}
        onClearCanvas={() => { setNodes([]); setEdges([]); }}
        onFitView={handleCanvasFitView}
        onExportJSON={handleExportJSON}
        onExportScreenshot={handleExportScreenshot}
        onProjectSettings={() => window.dispatchEvent(new CustomEvent('open-project-settings'))}
        onOpenHistory={() => window.dispatchEvent(new CustomEvent('open-search-history'))}
      />

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20,
          background: toast.type === 'error' ? '#dc2626' : '#16a34a',
          color: '#fff', padding: '12px 20px', borderRadius: 8,
          fontSize: 14, zIndex: 9999, maxWidth: 400,
          boxShadow: '0 10px 15px rgba(0,0,0,0.3)',
          wordWrap: 'break-word'
        }}>
          {toast.message}
        </div>
      )}
    </div>
    </CanvasProvider>
  );
}
