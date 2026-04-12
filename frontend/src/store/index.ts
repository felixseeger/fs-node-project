/**
 * Zustand store for the AI Pipeline Editor
 * Provides state management for workflows, nodes, edges, and provider stats
 */

import { create } from 'zustand';
import type { Node, Edge } from '@xyflow/react';
import type { Workflow, NodeData, ProviderStats } from '../types';

/**
 * Store state interface
 */
interface StoreState {
  // Workflow data
  workflows: Workflow[];
  nodes: Node<NodeData>[];
  edges: Edge[];
  
  // Provider statistics
  providerStats: Record<string, ProviderStats>;
  
  // Actions
  setWorkflows: (workflows: Workflow[]) => void;
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  addWorkflow: (workflow: Workflow) => void;
  updateProviderStats: (providerId: string, stats: Partial<ProviderStats>) => void;
}

/**
 * Main application store
 */
export const useStore = create<StoreState>((set) => ({
  // Initial state
  workflows: [],
  nodes: [],
  edges: [],
  providerStats: {},
  
  // Actions
  setWorkflows: (workflows) => set({ workflows }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  addWorkflow: (workflow) => 
    set((state) => ({
      workflows: [...state.workflows, workflow]
    })),
  
  updateProviderStats: (providerId, stats) =>
    set((state) => ({
      providerStats: {
        ...state.providerStats,
        [providerId]: {
          success: 0,
          failures: 0,
          avgResponseTime: 0,
          ...state.providerStats[providerId],
          ...stats
        }
      }
    }))
}));

/**
 * Hook for accessing analytics-related store state
 * @returns Analytics store state
 */
export function useAnalyticsStore() {
  return useStore((state) => ({
    workflows: state.workflows,
    nodes: state.nodes,
    edges: state.edges,
    providerStats: state.providerStats
  }));
}
