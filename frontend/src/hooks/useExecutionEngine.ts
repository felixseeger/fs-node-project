/**
 * useExecutionEngine Hook
 * React hook for using the dependency graph-based execution engine
 */

import { useCallback, useRef, useState, useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from '../types';
import { ExecutionEngine, createExecutionEngine } from '../engine/executionEngine';
import {
  type ExecutionOptions,
  type NodeExecutionState,
  type ProgressCallback,
  type EngineExecutionResult,
  ExecutionStatus,
} from '../engine/types';
import { getExecutionLevels } from '../helpers/nodeData';

/** Hook return type */
export interface UseExecutionEngineReturn {
  /** Whether execution is in progress */
  isExecuting: boolean;
  /** Current execution phase */
  currentPhase: string;
  /** Current batch index (for parallel execution) */
  currentBatch: number;
  /** Total number of batches */
  totalBatches: number;
  /** Progress percentage (0-100) */
  progress: number;
  /** Map of node execution states */
  nodeStates: Map<string, NodeExecutionState>;
  /** IDs of completed nodes */
  completedNodes: string[];
  /** IDs of failed nodes */
  failedNodes: string[];
  /** Current error message */
  error: string | null;
  /** Execute the workflow */
  execute: (nodes: Node<NodeData>[], edges: Edge[]) => Promise<EngineExecutionResult>;
  /** Cancel current execution */
  cancel: () => void;
  /** Reset execution state */
  reset: () => void;
  /** Check if a node is currently executing */
  isNodeExecuting: (nodeId: string) => boolean;
  /** Check if a node has completed */
  isNodeCompleted: (nodeId: string) => boolean;
  /** Check if a node has failed */
  isNodeFailed: (nodeId: string) => boolean;
  /** Get node execution state */
  getNodeState: (nodeId: string) => NodeExecutionState | undefined;
  /** Get execution levels (for visualization) */
  getExecutionLevels: (nodes: Node<NodeData>[], edges: Edge[]) => string[][];
}

/** Options for the hook */
export interface UseExecutionEngineOptions extends ExecutionOptions {
  /** Callback for node data updates */
  onUpdateNodeData?: (nodeId: string, updates: Partial<NodeData>) => void;
  /** Callback for progress updates */
  onProgress?: ProgressCallback;
  /** Callback when execution completes */
  onComplete?: (result: EngineExecutionResult) => void;
  /** Callback when execution fails */
  onError?: (error: string) => void;
}

/**
 * React hook for workflow execution
 */
export function useExecutionEngine(
  options: UseExecutionEngineOptions = {}
): UseExecutionEngineReturn {
  const {
    onUpdateNodeData,
    onProgress,
    onComplete,
    onError,
    ...engineOptions
  } = options;

  // Refs
  const engineRef = useRef<ExecutionEngine | null>(null);

  // State
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('idle');
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [progress, setProgress] = useState(0);
  const [nodeStates, setNodeStates] = useState<Map<string, NodeExecutionState>>(new Map());
  const [error, setError] = useState<string | null>(null);

  // Memoized derived state
  const completedNodes = useMemo(() => {
    return Array.from(nodeStates.entries())
      .filter(([, state]) => state.status === ExecutionStatus.COMPLETED)
      .map(([id]) => id);
  }, [nodeStates]);

  const failedNodes = useMemo(() => {
    return Array.from(nodeStates.entries())
      .filter(([, state]) => state.status === ExecutionStatus.FAILED)
      .map(([id]) => id);
  }, [nodeStates]);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  /** Execute the workflow */
  const execute = useCallback(
    async (nodes: Node<NodeData>[], edges: Edge[]): Promise<EngineExecutionResult> => {
      const {
        onUpdateNodeData,
        onProgress,
        onComplete,
        onError,
        ...engineOptions
      } = optionsRef.current;

      // Reset state
      setIsExecuting(true);
      setCurrentPhase('starting');
      setProgress(0);
      setError(null);
      setNodeStates(new Map());

      try {
        // Create engine instance
        const engine = createExecutionEngine(engineOptions);
        engineRef.current = engine;

        // Set up update callback
        if (onUpdateNodeData) {
          engine.setUpdateNodeData(onUpdateNodeData);
        }

        // Set up progress callback
        const progressCallback: ProgressCallback = (event, data) => {
          // Update internal state based on progress
          switch (event) {
            case 'start':
              setCurrentPhase('running');
              break;
            case 'batch-start':
              setCurrentBatch(data.batchIndex || 0);
              setTotalBatches(data.totalBatches || 0);
              break;
            case 'node-complete':
            case 'node-error':
              // Update node states from engine
              setNodeStates(new Map(engine.getAllNodeStates()));
              break;
            case 'complete':
              setCurrentPhase('completed');
              setProgress(100);
              break;
            case 'error':
              setCurrentPhase('error');
              setError(data.error || 'Unknown error');
              break;
          }

          // Calculate overall progress
          const states = engine.getAllNodeStates();
          const total = states.size;
          const completed = Array.from(states.values()).filter(
            (s) => s.status === ExecutionStatus.COMPLETED || s.status === ExecutionStatus.FAILED
          ).length;
          setProgress(total > 0 ? Math.round((completed / total) * 100) : 0);

          // Call user-provided callback
          onProgress?.(event, data);
        };

        engine.setProgressCallback(progressCallback);

        // Execute
        const result = await engine.execute(nodes, edges);

        // Final state update
        setNodeStates(new Map(engine.getAllNodeStates()));

        if (result.success) {
          onComplete?.(result);
        } else {
          setError(result.error || 'Execution failed');
          onError?.(result.error || 'Execution failed');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        setCurrentPhase('error');
        onError?.(errorMessage);

        return {
          success: false,
          error: errorMessage,
          stats: {
            startTime: Date.now(),
            endTime: Date.now(),
            totalNodes: nodes.length,
            completedNodes: 0,
            failedNodes: 0,
            skippedNodes: 0,
            parallelBatches: 0,
          },
          nodeStates: new Map(),
          outputs: new Map(),
        };
      } finally {
        setIsExecuting(false);
        engineRef.current = null;
      }
    },
    []
  );

  /** Cancel current execution */
  const cancel = useCallback(() => {
    engineRef.current?.cancel();
    setCurrentPhase('cancelled');
    setIsExecuting(false);
  }, []);

  /** Reset execution state */
  const reset = useCallback(() => {
    engineRef.current?.cancel();
    engineRef.current = null;
    setIsExecuting(false);
    setCurrentPhase('idle');
    setCurrentBatch(0);
    setTotalBatches(0);
    setProgress(0);
    setNodeStates(new Map());
    setError(null);
  }, []);

  /** Check if a node is currently executing */
  const isNodeExecuting = useCallback(
    (nodeId: string) => {
      return nodeStates.get(nodeId)?.status === ExecutionStatus.RUNNING;
    },
    [nodeStates]
  );

  /** Check if a node has completed */
  const isNodeCompleted = useCallback(
    (nodeId: string) => {
      return nodeStates.get(nodeId)?.status === ExecutionStatus.COMPLETED;
    },
    [nodeStates]
  );

  /** Check if a node has failed */
  const isNodeFailed = useCallback(
    (nodeId: string) => {
      return nodeStates.get(nodeId)?.status === ExecutionStatus.FAILED;
    },
    [nodeStates]
  );

  /** Get node execution state */
  const getNodeState = useCallback(
    (nodeId: string) => {
      return nodeStates.get(nodeId);
    },
    [nodeStates]
  );

  /** Get execution levels for visualization */
  const getExecutionLevelsCallback = useCallback(
    (nodes: Node<NodeData>[], edges: Edge[]) => {
      return getExecutionLevels(nodes, edges);
    },
    []
  );

  return {
    isExecuting,
    currentPhase,
    currentBatch,
    totalBatches,
    progress,
    nodeStates,
    completedNodes,
    failedNodes,
    error,
    execute,
    cancel,
    reset,
    isNodeExecuting,
    isNodeCompleted,
    isNodeFailed,
    getNodeState,
    getExecutionLevels: getExecutionLevelsCallback,
  };
}

export default useExecutionEngine;
