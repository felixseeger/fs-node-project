/**
 * Node Data Helpers
 * Utilities for resolving node inputs from connections
 */
import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from '../types';
import type { ConnectionInfo } from '../types/workflow';

/**
 * Get all incoming connections for a node
 */
export function getIncomingConnections(nodeId: string, edges: Edge[]): Edge[] {
  return edges.filter(e => e.target === nodeId);
}

/**
 * Get all outgoing connections for a node
 */
export function getOutgoingConnections(nodeId: string, edges: Edge[]): Edge[] {
  return edges.filter(e => e.source === nodeId);
}

/**
 * Get the source node for a specific handle connection
 */
export function getSourceForHandle(
  nodeId: string, 
  handleId: string, 
  edges: Edge[], 
  nodes: Node<NodeData>[]
): Node<NodeData> | null {
  const edge = edges.find(e => e.target === nodeId && e.targetHandle === handleId);
  if (!edge) return null;
  
  return nodes.find(n => n.id === edge.source) || null;
}

/**
 * Get the value from a connected source handle
 */
export function resolveInput(
  nodeId: string, 
  handleId: string, 
  edges: Edge[], 
  nodes: Node<NodeData>[]
): unknown {
  const sourceNode = getSourceForHandle(nodeId, handleId, edges, nodes);
  if (!sourceNode) return null;
  
  const edge = edges.find(e => e.target === nodeId && e.targetHandle === handleId);
  const sourceHandle = edge?.sourceHandle || 'output';
  
  // Get value from source node data based on handle type
  const data = sourceNode.data || {};
  
  switch (sourceHandle) {
    case 'output':
      return (data as Record<string, unknown>).outputImage || 
             (data as Record<string, unknown>).outputVideo || 
             (data as Record<string, unknown>).outputAudio || 
             (data as Record<string, unknown>).outputText || 
             (data as Record<string, unknown>).output;
    case 'prompt-out':
      return (data as Record<string, unknown>).outputPrompt || 
             (data as Record<string, unknown>).prompt || 
             (data as Record<string, unknown>).localPrompt;
    case 'analysis-out':
      return (data as Record<string, unknown>).analysisResult;
    case 'image-out':
    case 'images-out':
      return (data as Record<string, unknown>).outputImage || 
             (data as Record<string, unknown>).images || 
             (data as Record<string, unknown>).localImages;
    case 'video-out':
    case 'output-video':
      return (data as Record<string, unknown>).outputVideo || 
             (data as Record<string, unknown>).localVideo;
    case 'audio-out':
    case 'output-audio':
      return (data as Record<string, unknown>).outputAudio || 
             (data as Record<string, unknown>).localAudio;
    case 'aspect_ratio':
      return (data as Record<string, unknown>).aspectRatio || 
             (data as Record<string, unknown>).localAspect;
    case 'resolution':
      return (data as Record<string, unknown>).resolution || 
             (data as Record<string, unknown>).localResolution;
    case 'num_images':
      return (data as Record<string, unknown>).numImages || 
             (data as Record<string, unknown>).localNumImages;
    default:
      return (data as Record<string, unknown>)[sourceHandle] || null;
  }
}

/**
 * Get all resolved inputs for a node
 */
export function resolveAllInputs(
  nodeId: string, 
  edges: Edge[], 
  nodes: Node<NodeData>[]
): Record<string, unknown> {
  const incoming = getIncomingConnections(nodeId, edges);
  const inputs: Record<string, unknown> = {};
  
  for (const edge of incoming) {
    const targetHandle = edge.targetHandle || 'input';
    inputs[targetHandle] = resolveInput(nodeId, targetHandle, edges, nodes);
  }
  
  return inputs;
}

/**
 * Check if a node has any incoming connections
 */
export function hasConnections(nodeId: string, edges: Edge[]): boolean {
  return edges.some(e => e.target === nodeId);
}

/**
 * Check if a specific handle is connected
 */
export function isHandleConnected(nodeId: string, handleId: string, edges: Edge[]): boolean {
  return edges.some(e => e.target === nodeId && e.targetHandle === handleId);
}

/**
 * Get connection info for display purposes
 */
export function getConnectionInfo(
  nodeId: string, 
  handleId: string, 
  edges: Edge[], 
  nodes: Node<NodeData>[]
): ConnectionInfo | null {
  const edge = edges.find(e => e.target === nodeId && e.targetHandle === handleId);
  if (!edge) return null;
  
  const sourceNode = nodes.find(n => n.id === edge.source);
  if (!sourceNode) return null;
  
  return {
    nodeLabel: sourceNode.data?.label || edge.source,
    handle: edge.sourceHandle || 'output',
  };
}

/**
 * Find nodes that depend on a given node's output
 */
export function getDependentNodes(nodeId: string, edges: Edge[]): string[] {
  return edges
    .filter(e => e.source === nodeId)
    .map(e => e.target);
}

/**
 * Build a dependency graph for execution ordering
 */
export function buildDependencyGraph(
  nodes: Node<NodeData>[], 
  edges: Edge[]
): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();
  
  // Initialize all nodes with empty dependency sets
  for (const node of nodes) {
    graph.set(node.id, new Set());
  }
  
  // Add dependencies based on edges
  for (const edge of edges) {
    const deps = graph.get(edge.target);
    if (deps) {
      deps.add(edge.source);
    }
  }
  
  return graph;
}

/**
 * Topological sort for execution ordering
 */
export function topologicalSort(nodes: Node<NodeData>[], edges: Edge[]): string[] {
  const graph = buildDependencyGraph(nodes, edges);
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const result: string[] = [];
  
  function visit(nodeId: string) {
    if (visiting.has(nodeId)) {
      throw new Error(`Circular dependency detected involving node ${nodeId}`);
    }
    if (visited.has(nodeId)) {
      return;
    }
    
    visiting.add(nodeId);
    
    const deps = graph.get(nodeId) || new Set();
    for (const dep of deps) {
      visit(dep);
    }
    
    visiting.delete(nodeId);
    visited.add(nodeId);
    result.push(nodeId);
  }
  
  for (const node of nodes) {
    visit(node.id);
  }
  
  return result;
}

/**
 * Find nodes at a specific depth level
 */
export function getExecutionLevels(nodes: Node<NodeData>[], edges: Edge[]): string[][] {
  const graph = buildDependencyGraph(nodes, edges);
  const levels: string[][] = [];
  const processed = new Set<string>();
  
  let currentLevel = nodes
    .filter(n => (graph.get(n.id)?.size || 0) === 0)
    .map(n => n.id);
  
  while (currentLevel.length > 0) {
    levels.push([...currentLevel]);
    currentLevel.forEach(id => processed.add(id));
    
    // Find next level: nodes whose dependencies are all processed
    const nextLevel: string[] = [];
    for (const [nodeId, deps] of graph) {
      if (processed.has(nodeId)) continue;
      
      const allDepsProcessed = Array.from(deps).every(dep => processed.has(dep));
      if (allDepsProcessed) {
        nextLevel.push(nodeId);
      }
    }
    
    currentLevel = nextLevel;
  }
  
  return levels;
}

export default {
  getIncomingConnections,
  getOutgoingConnections,
  getSourceForHandle,
  resolveInput,
  resolveAllInputs,
  hasConnections,
  isHandleConnected,
  getConnectionInfo,
  getDependentNodes,
  buildDependencyGraph,
  topologicalSort,
  getExecutionLevels,
};
