/**
 * Workflow and execution types
 */
import type { Node } from '@xyflow/react';
import type { NodeData } from './nodes';

// Workflow definition
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: Node<NodeData>[];
  edges: WorkflowEdge[];
  createdAt?: string;
  updatedAt?: string;
  thumbnail?: string;
  isPublic?: boolean;
  authorName?: string;
  sharedWith?: string[];
  userId?: string;
}

// Extended edge type with our custom properties
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: string;
  animated?: boolean;
  style?: React.CSSProperties;
  selected?: boolean;
  markerEnd?: {
    type: string;
    width?: number;
    height?: number;
    color?: string;
  };
}

// Execution state
export interface ExecutionState {
  isExecuting: boolean;
  currentPhase: string;
  completedNodes: Set<string>;
  failedNodes: Map<string, string>;
  abortController: AbortController | null;
}

// Execution result
export interface ExecutionResult {
  success: boolean;
  error?: string;
  completedNodes: string[];
  failedNodes: Array<{ nodeId: string; error: string }>;
}

// Execution phase
export interface ExecutionPhase {
  name: string;
  types: string[];
  parallel: boolean;
}

// History state
export interface HistoryState {
  past: HistoryEntry[];
  future: HistoryEntry[];
}

export interface HistoryEntry {
  nodes: Node<NodeData>[];
  edges: WorkflowEdge[];
  timestamp: number;
}

// Connection info
export interface ConnectionInfo {
  nodeLabel: string;
  handle: string;
}
