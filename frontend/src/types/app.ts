import { Node, Edge } from '@xyflow/react';

export type PageType = 'landing' | 'home' | 'editor' | 'project-dashboard' | 'auth-signin' | 'auth-signup' | 'workspaces' | 'workflow-settings' | 'drawflow' | 'node-banana';

export type EditorMode = 'interface' | 'node-editor';

export interface WorkflowImportData {
  name: string;
  nodes: Node[];
  edges: Edge[];
}

export interface WorkflowEdgeData {
  markerEnd?: {
    type: string;
    width?: number;
    height?: number;
    color?: string;
  };
}

export interface APIResponse<T> {
  success: boolean;
  response: T;
  error?: string;
  message?: string;
}

export function isWorkflowImportData(data: any): data is WorkflowImportData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.name === 'string' &&
    Array.isArray(data.nodes) &&
    Array.isArray(data.edges)
  );
}

export interface WorkflowStat {
  id: string;
  name: string;
  count: number;
}

export interface NodeTypeDistribution {
  type: string;
  count: number;
}

export interface PerformanceTrend {
  date: string;
  value: number;
}

export interface ProviderUsage {
  provider: string;
  count: number;
}

export interface ComplexityAnalysis {
  low: number;
  medium: number;
  high: number;
}

export interface AnalyticsData {
  stats: WorkflowStat[];
  distribution: NodeTypeDistribution[];
  trends: PerformanceTrend[];
  usage: ProviderUsage[];
  complexity: ComplexityAnalysis;
}

export interface ProviderStats {
  [key: string]: number;
}

export interface PerformanceMetrics {
  avgResponseTime: number;
  successRate: number;
  fps: number;
  memoryUsage: number;
  renderTime: number;
  nodeCount: number;
  edgeCount: number;
}

export interface AnalyticsStoreState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
}
