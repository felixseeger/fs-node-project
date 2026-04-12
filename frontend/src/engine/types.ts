/**
 * Execution Engine Types
 * Core types for the dependency graph-based execution engine
 */

import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from '../types';

/** Execution status for a node */
export enum ExecutionStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  SKIPPED = 'skipped',
}

/** Node execution state */
export interface NodeExecutionState {
  status: ExecutionStatus;
  startTime?: number;
  endTime?: number;
  error?: string;
  result?: unknown;
  progress?: number;
  message?: string;
}

/** Execution context passed to all executors */
export interface ExecutionContext {
  /** Abort controller for cancellation */
  abortController: AbortController;
  /** Current nodes state */
  nodes: Node<NodeData>[];
  /** Current edges state */
  edges: Edge[];
  /** Update a specific node's data */
  updateNodeData: (nodeId: string, updates: Partial<NodeData>) => void;
  /** Update a node's execution state */
  updateNodeState: (nodeId: string, state: Partial<NodeExecutionState>) => void;
  /** Get resolved inputs for a node */
  getInputs: (nodeId: string) => Record<string, unknown>;
  /** Get the output from a completed node */
  getOutput: (nodeId: string) => unknown;
  /** Check if execution was cancelled */
  isCancelled: () => boolean;
  /** Log execution progress */
  log: (level: 'debug' | 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>) => void;
}

/** Node executor function type */
export type NodeExecutor = (
  node: Node<NodeData>,
  context: ExecutionContext
) => Promise<unknown>;

/** Execution options */
export interface ExecutionOptions {
  /** User ID for billing */
  uid?: string;
  /** Maximum concurrent executions */
  maxConcurrency?: number;
  /** Enable parallel execution of independent nodes */
  parallel?: boolean;
  /** Continue on error */
  continueOnError?: boolean;
  /** Timeout per node in ms */
  nodeTimeout?: number;
  /** Global timeout in ms */
  globalTimeout?: number;
  /** Enable detailed logging */
  verbose?: boolean;
}

/** Execution statistics */
export interface ExecutionStats {
  startTime: number;
  endTime?: number;
  totalNodes: number;
  completedNodes: number;
  failedNodes: number;
  skippedNodes: number;
  parallelBatches: number;
}

/** Execution result */
export interface EngineExecutionResult {
  success: boolean;
  error?: string;
  stats: ExecutionStats;
  nodeStates: Map<string, NodeExecutionState>;
  outputs: Map<string, unknown>;
}

/** Dependency graph structure */
export interface DependencyGraph {
  /** Map of node ID to its dependencies */
  dependencies: Map<string, Set<string>>;
  /** Map of node ID to nodes that depend on it */
  dependents: Map<string, Set<string>>;
  /** All node IDs */
  nodeIds: Set<string>;
}

/** Execution batch (nodes that can run in parallel) */
export interface ExecutionBatch {
  /** Batch index */
  index: number;
  /** Node IDs in this batch */
  nodeIds: string[];
  /** Dependencies that must complete before this batch */
  dependencies: Set<string>;
}

/** Progress callback */
export type ProgressCallback = (
  event: 'start' | 'node-start' | 'node-complete' | 'node-error' | 'batch-start' | 'batch-complete' | 'complete' | 'error',
  data: {
    nodeId?: string;
    batchIndex?: number;
    totalBatches?: number;
    message?: string;
    progress?: number;
    error?: string;
  }
) => void;

/** Node type category for grouping */
export enum NodeCategory {
  INPUT = 'input',
  OUTPUT = 'output',
  IMAGE_GENERATION = 'image_generation',
  IMAGE_EDITING = 'image_editing',
  VIDEO_GENERATION = 'video_generation',
  VIDEO_EDITING = 'video_editing',
  AUDIO_GENERATION = 'audio_generation',
  VISION = 'vision',
  UTILITY = 'utility',
  UNKNOWN = 'unknown',
}

/** Node type metadata */
export interface NodeTypeMetadata {
  category: NodeCategory;
  displayName: string;
  description?: string;
  inputs: string[];
  outputs: string[];
  capabilities?: string[];
  isAsync: boolean;
  estimatedDuration?: number;
}
