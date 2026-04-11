/**
 * Type definitions for the AI Pipeline Editor
 */

export * from './global';
export * from './nodes';
export * from './workflow';
export * from './api';
export * from './app';
export * from './asset';
export * from './user';

// Re-export analytics types explicitly for clarity
export type {
  WorkflowStat,
  NodeTypeDistribution,
  PerformanceTrend,
  ProviderUsage,
  ComplexityAnalysis,
  AnalyticsData,
  ProviderStats,
  PerformanceMetrics,
  AnalyticsStoreState
} from './app';

// Re-export menu types
export interface NodeMenuSection {
  section: string;
  items: NodeMenuItem[];
}

export interface NodeMenuItem {
  type: string;
  label: string;
  defaults: Record<string, unknown>;
}
