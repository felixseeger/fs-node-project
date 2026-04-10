/**
 * useWorkflow Hook
 * Manages workflow execution logic
 */
import { useState, useCallback, useRef } from 'react';
import { useReactFlow, type Node } from '@xyflow/react';
import type { NodeData } from '../types';
import type { ExecutionResult } from '../types/workflow';

// Execution phases - ordered by dependency
const EXECUTION_PHASES = [
  // Phase 1: Input nodes (no dependencies)
  { types: ['inputNode'], name: 'inputs' },
  
  // Phase 2: Text/Image/Asset nodes
  { types: ['textNode', 'imageNode', 'assetNode'], name: 'data_sources' },
  
  // Phase 3: Vision and LLM analysis
  { types: ['imageAnalyzer', 'imageToPrompt', 'improvePrompt', 'aiImageClassifier'], name: 'analysis' },
  
  // Phase 4: Image generation
  { types: ['generator', 'fluxReimagine', 'textToIcon'], name: 'generation' },
  
  // Phase 5: Image editing
  { types: ['changeCamera', 'creativeUpscale', 'precisionUpscale', 'relight', 'styleTransfer',
           'removeBackground', 'fluxImageExpand', 'seedreamExpand', 'ideogramExpand',
           'ideogramInpaint', 'skinEnhancer'], name: 'image_editing' },
  
  // Phase 6: Video generation
  { types: ['kling3', 'kling3Omni', 'kling3Motion', 'klingElementsPro', 'klingO1',
           'minimaxLive', 'wan26', 'seedance', 'ltxVideo2Pro', 'runwayGen45',
           'runwayGen4Turbo', 'runwayActTwo', 'pixVerseV5', 'pixVerseV5Transition',
           'omniHuman'], name: 'video_generation' },
  
  // Phase 7: Video editing
  { types: ['vfx', 'creativeVideoUpscale', 'precisionVideoUpscale'], name: 'video_editing' },
  
  // Phase 8: Audio generation
  { types: ['musicGeneration', 'soundEffects', 'audioIsolation', 'voiceover'], name: 'audio' },
  
  // Phase 9: Utilities
  { types: ['layerEditor'], name: 'utilities' },
  
  // Phase 10: Output
  { types: ['response'], name: 'output' },
];

export interface UseWorkflowProps {
  onExecutionComplete?: (result: ExecutionResult) => void;
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeData>[]>>;
  updateNodeData: (nodeId: string, patch: Partial<NodeData>) => void;
}

export interface UseWorkflowReturn {
  isExecuting: boolean;
  currentPhase: string;
  runWorkflow: () => Promise<void>;
  cancelWorkflow: () => void;
  resetExecution: () => void;
}

export function useWorkflow({ 
  onExecutionComplete, 
  setNodes 
}: UseWorkflowProps): UseWorkflowReturn {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const executedNodeIds = useRef<Set<string>>(new Set());
  const { getNodes, getEdges } = useReactFlow<Node<NodeData>>();

  /**
   * Reset execution state
   */
  const resetExecution = useCallback(() => {
    executedNodeIds.current.clear();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsExecuting(false);
    setCurrentPhase('');
  }, []);

  /**
   * Execute a single node
   */
  const executeNode = useCallback(async (node: Node<NodeData>): Promise<boolean> => {
    const nodeId = node.id;
    
    // Skip if already executed
    if (executedNodeIds.current.has(nodeId)) {
      return true;
    }

    // Set loading state
    setNodes(prev => prev.map(n =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, isLoading: true } as NodeData }
        : n
    ));

    try {
      // Check for abort
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('Execution cancelled');
      }

      // Execute based on node type
      // This is a simplified version - full implementation would
      // call the appropriate API based on node.type
      const result = await executeNodeByType(node, abortControllerRef.current?.signal);
      
      // Update node with result
      setNodes(prev => prev.map(n =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, isLoading: false, ...result } as NodeData }
          : n
      ));
      
      executedNodeIds.current.add(nodeId);
      return true;
    } catch (error) {
      console.error(`Error executing node ${nodeId}:`, error);
      
      setNodes(prev => prev.map(n =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Unknown error',
              } as NodeData,
            }
          : n
      ));
      
      return false;
    }
  }, [setNodes]);

  /**
   * Run the complete workflow
   */
  const runWorkflow = useCallback(async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    abortControllerRef.current = new AbortController();
    executedNodeIds.current.clear();

    try {
      const nodes = getNodes();
      
      // Build execution order based on phases
      const executionOrder: Array<{ phase: string; nodes: Node<NodeData>[] }> = [];
      
      for (const phase of EXECUTION_PHASES) {
        const phaseNodes = nodes.filter(n => phase.types.includes(n.type || ''));
        if (phaseNodes.length > 0) {
          executionOrder.push({ phase: phase.name, nodes: phaseNodes });
        }
      }
      
      const completedNodes: string[] = [];
      const failedNodes: Array<{ nodeId: string; error: string }> = [];
      
      // Execute each phase sequentially
      for (const { phase, nodes } of executionOrder) {
        setCurrentPhase(phase);
        console.log(`Executing phase: ${phase}`);
        
        // Execute all nodes in phase (can be parallel within a phase)
        const results = await Promise.allSettled(
          nodes.map(node => executeNode(node))
        );
        
        // Track results
        results.forEach((result, idx) => {
          const nodeId = nodes[idx].id;
          if (result.status === 'fulfilled' && result.value) {
            completedNodes.push(nodeId);
          } else {
            failedNodes.push({ 
              nodeId, 
              error: result.status === 'rejected' 
                ? String(result.reason) 
                : 'Execution failed' 
            });
          }
        });
      }
      
      onExecutionComplete?.({ 
        success: failedNodes.length === 0,
        completedNodes,
        failedNodes
      });
    } catch (error) {
      console.error('Workflow execution failed:', error);
      onExecutionComplete?.({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        completedNodes: [],
        failedNodes: []
      });
    } finally {
      setIsExecuting(false);
      setCurrentPhase('');
      abortControllerRef.current = null;
    }
  }, [isExecuting, getNodes, getEdges, executeNode, onExecutionComplete]);

  /**
   * Cancel workflow execution
   */
  const cancelWorkflow = useCallback(() => {
    abortControllerRef.current?.abort();
    resetExecution();
  }, [resetExecution]);

  return {
    isExecuting,
    currentPhase,
    runWorkflow,
    cancelWorkflow,
    resetExecution,
  };
}

/**
 * Execute a node based on its type
 * This is a placeholder - real implementation would dispatch to API calls
 */
async function executeNodeByType(
  _node: Node<NodeData>, 
  signal?: AbortSignal
): Promise<Partial<NodeData>> {
  // Placeholder - actual implementation would call APIs based on node type
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve({ executed: true, timestamp: Date.now() } as Partial<NodeData>);
    }, 100);
    
    signal?.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new Error('Execution cancelled'));
    });
  });
}

export default useWorkflow;
