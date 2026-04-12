/**
 * Zustand store for the AI Pipeline Editor
 * Provides state management for workflows, nodes, edges, and provider stats
 */

import { create } from 'zustand';
import type { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import type { Workflow, NodeData, ProviderStats } from '../types';

/**
 * Store state interface
 */
interface StoreState {
  // Workflow data
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  nodes: Node<NodeData>[];
  edges: Edge[];
  
  // Provider statistics
  providerStats: Record<string, ProviderStats>;
  
  // Actions
  setWorkflows: (workflows: Workflow[]) => void;
  setWorkflow: (workflow: Workflow | null) => void;
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNodes: (nodes: Node<NodeData>[]) => void;
  addEdges: (edges: Edge[]) => void;
  addWorkflow: (workflow: Workflow) => void;
  updateProviderStats: (providerId: string, stats: Partial<ProviderStats>) => void;
  
  // React Flow Handlers (optional integration)
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  onConnect?: OnConnect;
}

/**
 * Main application store
 */
export const useStore = create<StoreState>((set) => ({
  // Initial state
  workflows: [],
  currentWorkflow: null,
  nodes: [],
  edges: [],
  providerStats: {},
  
  // Actions
  setWorkflows: (workflows) => set({ workflows }),
  setWorkflow: (currentWorkflow) => set({ currentWorkflow }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  addNodes: (newNodes) => 
    set((state) => ({
      nodes: [...state.nodes, ...newNodes]
    })),
    
  addEdges: (newEdges) =>
    set((state) => ({
      edges: [...state.edges, ...newEdges]
    })),

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
