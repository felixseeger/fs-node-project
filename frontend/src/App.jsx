import { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { generateAIWorkflow } from './utils/api';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirebaseAuth, initializeFirebase, enableOfflinePersistence } from './config/firebase';
import { useFirebaseWorkflows } from './hooks/useFirebaseWorkflows';

import InputNode from './nodes/InputNode';
import TextNode from './nodes/TextNode';
import ImageNode from './nodes/ImageNode';
import AssetNode from './nodes/AssetNode';
import SourceMediaNode from './nodes/SourceMediaNode';
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
import ImageUniversalGeneratorNode from './nodes/ImageUniversalGeneratorNode';
import VideoUniversalGeneratorNode from './nodes/VideoUniversalGeneratorNode';
import QuiverTextToVectorGenerationNode from './nodes/QuiverTextToVectorGenerationNode';
import QuiverImageToVectorGenerationNode from './nodes/QuiverImageToVectorGenerationNode';
import WorkflowsPage from './WorkflowsPage';
import WorkspacesPage from './WorkspacesPage';
import ProfileModal from './ProfileModal';
import WorkflowSettingsPage from './WorkflowSettingsPage';
import AuthPage from './AuthPage';
import GlobalProgressBar from './GlobalProgressBar';
import TopBar from './TopBar';
import EditorTopBar from './EditorTopBar';
import GooeyNodesMenu from './GooeyNodesMenu';
import Queue from './Queue';
import { isValidConnection, getHandleColor, getHandleDataType } from './utils/handleTypes';
import { NODE_MENU, DEFAULT_NODES, DEFAULT_EDGES } from './config/nodeMenu.js';
import { isHandleConnected, getConnectionInfo as getConnectionInfoBase } from './helpers/nodeData.js';

let nodeIdCounter = 0;
const nextId = () => `node_${++nodeIdCounter}`;

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [workflows, setWorkflows] = useState([]);
  const [activeWorkflowId, setActiveWorkflowId] = useState(null);
  const [editorMode, setEditorMode] = useState('node-editor');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
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
          console.log('[Auth] User signed in:', user.uid);
        } else {
          setIsAuthenticated(false);
          setCurrentUserId(null);
          console.log('[Auth] User signed out');
        }
        setAuthLoading(false);
      });
      
      return () => unsubscribeAuth();
    } catch (err) {
      console.log('[Firebase] Initialization skipped or failed:', err.message);
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
      setCurrentPage('home');
    } catch (err) {
      console.error('[Auth] Logout error:', err);
    }
  }, []);
  
  useEffect(() => {
    if (firebaseWorkflows.length > 0) {
      setWorkflows(firebaseWorkflows);
    }
  }, [firebaseWorkflows]);

  const activeWorkflowName = workflows.find((w) => w.id === activeWorkflowId)?.name || 'Untitled';

  const [nodes, setNodes, onNodesChange] = useNodesState(DEFAULT_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const [history, setHistory] = useState({ past: [], future: [] });
  const isHistoryAction = useRef(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [menu, setMenu] = useState(null);

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
      for (const section of NODE_MENU) {
        const item = section.items.find(i => i.type === type);
        if (item && item.defaults) {
          defaults = item.defaults;
          break;
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
  
  const onPaneContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      
      if (!rfInstance) return;

      const selectedNodes = rfInstance.getNodes().filter(n => n.selected);

      const pane = reactFlowWrapper.current.getBoundingClientRect();
      setMenu({
        x: event.clientX - pane.left,
        y: event.clientY - pane.top,
        items: [
          { label: 'Create Element', action: 'create_element' },
          { label: 'Autoformat', action: 'autoformat' },
          { label: 'Grid Nodes', action: 'grid_nodes' },
          { label: 'Stack Nodes', action: 'stack_nodes' },
          { label: 'Align Left', action: 'align_left' },
          { label: 'Align Center', action: 'align_center' },
          { label: 'Align Right', action: 'align_right' },
          { type: 'divider' },
          { label: 'Copy', action: 'copy', shortcut: '⌘C' },
          { label: 'Paste', action: 'paste', shortcut: '⌘V' },
          { label: 'Duplicate', action: 'duplicate', shortcut: '⌘D' },
          { label: 'Download', action: 'download', shortcut: '⌘⇧D' },
          { label: 'Clear node contents', action: 'clear_contents', shortcut: '⌘⇧X' }
        ],
        selectedNodes: selectedNodes,
      });
    },
    [rfInstance, setMenu]
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
          setNodes(nds => [...nds.map(n => ({...n, selected: false})), ...newNodes]);
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
        if (selectedNodes && selectedNodes.length > 1) {
          let sumX = 0;
          selectedNodes.forEach(n => sumX += n.position.x + (n.width || 200)/2);
          const avgX = sumX / selectedNodes.length;
          setNodes(nds => nds.map(n => n.selected ? { ...n, position: { ...n.position, x: avgX - (n.width || 200)/2 } } : n));
        }
        break;
      case 'stack_nodes':
        if (selectedNodes && selectedNodes.length > 1) {
          // Sort by Y position
          const sorted = [...selectedNodes].sort((a,b) => a.position.y - b.position.y);
          let currentY = sorted[0].position.y;
          const x = sorted[0].position.x;
          setNodes(nds => {
            return nds.map(n => {
              if (!n.selected) return n;
              const idx = sorted.findIndex(s => s.id === n.id);
              if (idx === 0) return n;
              const prev = sorted[idx-1];
              currentY += (prev.height || 300) + 20;
              return { ...n, position: { x, y: currentY } };
            });
          });
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
      case 'paste':
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
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

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
          case 'u': typeToAdd = 'uploadNode'; break;
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


  const nodeTypes = useMemo(
    () => ({
      inputNode: InputNode,
      textNode: TextNode,
      imageNode: ImageNode,
      assetNode: AssetNode,
      sourceMediaNode: SourceMediaNode,
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
      quiverTextToVector: QuiverTextToVectorGenerationNode,
      quiverImageToVector: QuiverImageToVectorGenerationNode,
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

  const handleCreateWorkflow = useCallback(async (name, existingId, aiOptions = null) => {
    console.log('[App] handleCreateWorkflow called:', {name, existingId, aiOptions});
    
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

  // Auth guard — show login/signup if not authenticated
  if (authLoading) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTop: '2px solid #3b82f6', borderRadius: '50%', animation: 'authSpin 0.8s linear infinite' }} />
          <span>Loading account...</span>
        </div>
        <style>{`@keyframes authSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthPage />
    );
  }

  const handleDeleteWorkflows = async (ids) => {
    console.log('Optimistically deleting workflows:', ids);
    setWorkflows((prev) => prev.filter((w) => !ids.includes(w.id)));
    for (const id of ids) {
      deleteFirebaseWorkflow(id).catch(e => console.error('Firebase delete error:', e));
    }
  };

  if (currentPage === 'home') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
        <TopBar currentPage={currentPage} onNavigate={setCurrentPage} workflowName={null} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <WorkflowsPage
            onCreateWorkflow={handleCreateWorkflow}
            onDeleteWorkflows={handleDeleteWorkflows}
            workflows={workflows}
          />
        </div>
      </div>
    );
  }

  
  if (currentPage === 'workspaces') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
        <TopBar currentPage={currentPage} onNavigate={setCurrentPage} workflowName={null} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <WorkspacesPage
            onCreateWorkspace={(name) => {
              // Stub for creating workspace
              setCurrentPage('home');
            }}
            workspaces={[]}
          />
        </div>
      </div>
    );
  }

  

  if (currentPage === 'workflow-settings') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
        <TopBar currentPage={currentPage} onNavigate={setCurrentPage} workflowName={null} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} isAuthenticated={isAuthenticated} />
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
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#1c1c1c', padding: 24, borderRadius: 12, border: '1px solid #333', width: 320 }}>
            <h3 style={{ margin: '0 0 16px', color: '#fff', fontSize: 16 }}>Rename Workspace</h3>
            <input 
              autoFocus
              type="text" 
              value={newWorkflowName} 
              onChange={e => setNewWorkflowName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleRenameSubmit(); if (e.key === 'Escape') setIsRenameModalOpen(false); }}
              style={{ width: '100%', padding: '10px 12px', background: '#111', border: '1px solid #333', borderRadius: 8, color: '#e0e0e0', outline: 'none', marginBottom: 16, boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setIsRenameModalOpen(false)} style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', borderRadius: 6 }}>Cancel</button>
              <button onClick={handleRenameSubmit} style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: 6, fontWeight: 600 }}>Save</button>
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
          <GooeyNodesMenu nodeMenu={NODE_MENU} onAddNode={addNode} onOpenProfile={() => setIsProfileModalOpen(true)} />

          <div style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'flex-end',
            pointerEvents: 'none'
          }}>
            {/* Global Generate Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRunWorkflow();
              }}
              disabled={isRunning}
              style={{
                pointerEvents: 'auto',
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
            
            <div style={{ pointerEvents: 'auto' }}>
              <Queue nodes={nodes} />
            </div>
          </div>

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
            panOnDrag={isLocked ? false : [1, 2]}
            panOnScroll={false}
            selectionOnDrag={!isLocked}
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
            edgesUpdatable={!isLocked}
            edgesFocusable={true}
            elementsSelectable={!isLocked}
            autoPanOnConnect={true}
            autoPanOnNodeDrag={true}
            deleteKeyCode={['Backspace', 'Delete']}
            style={{ background: '#1a1a1a' }}
            onPaneContextMenu={onPaneContextMenu}
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
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>{item.shortcut}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            
            <Background variant="dots" gap={20} size={1} color="#333" />
            <MiniMap 
              nodeStrokeWidth={3}
              zoomable
              pannable
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                marginBottom: '100px',
                marginRight: '10px',
              }}
              maskColor="rgba(0, 0, 0, 0.7)"
              nodeColor={(node) => {
                if (node.type === 'inputNode') return '#22c55e';
                if (node.type === 'generator') return '#f97316';
                if (node.type === 'imageAnalyzer') return '#0ea5e9';
                if (node.type === 'response') return '#8b5cf6';
                return '#3b82f6';
              }}
            />
            <Controls 
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                marginBottom: '10px',
              }}
              showInteractive={false}
            />
          </ReactFlow>
        </div>
      </div>
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
}
