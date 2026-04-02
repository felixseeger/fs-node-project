/**
 * Dependency Graph
 * Builds and manages node dependency graphs for execution ordering
 */

import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from '../types';
import type { DependencyGraph, ExecutionBatch } from './types';

/**
 * Build a dependency graph from nodes and edges
 */
export function buildDependencyGraph(
  nodes: Node<NodeData>[],
  edges: Edge[]
): DependencyGraph {
  const dependencies = new Map<string, Set<string>>();
  const dependents = new Map<string, Set<string>>();
  const nodeIds = new Set<string>();

  // Initialize all nodes
  for (const node of nodes) {
    nodeIds.add(node.id);
    dependencies.set(node.id, new Set());
    dependents.set(node.id, new Set());
  }

  // Build dependency relationships from edges
  for (const edge of edges) {
    const sourceId = edge.source;
    const targetId = edge.target;

    // Target depends on source
    const deps = dependencies.get(targetId);
    if (deps) {
      deps.add(sourceId);
    }

    // Source has a dependent (target)
    const depsList = dependents.get(sourceId);
    if (depsList) {
      depsList.add(targetId);
    }
  }

  return { dependencies, dependents, nodeIds };
}

/**
 * Detect circular dependencies in the graph
 */
export function detectCircularDependency(graph: DependencyGraph): string[] | null {
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(nodeId: string, path: string[]): string[] | null {
    if (visiting.has(nodeId)) {
      // Found cycle - return the cycle path
      const cycleStart = path.indexOf(nodeId);
      return [...path.slice(cycleStart), nodeId];
    }

    if (visited.has(nodeId)) {
      return null;
    }

    visiting.add(nodeId);
    path.push(nodeId);

    const deps = graph.dependencies.get(nodeId) || new Set();
    for (const dep of deps) {
      const cycle = visit(dep, path);
      if (cycle) return cycle;
    }

    path.pop();
    visiting.delete(nodeId);
    visited.add(nodeId);
    return null;
  }

  for (const nodeId of graph.nodeIds) {
    if (!visited.has(nodeId)) {
      const cycle = visit(nodeId, []);
      if (cycle) return cycle;
    }
  }

  return null;
}

/**
 * Get nodes with no dependencies (root nodes)
 */
export function getRootNodes(graph: DependencyGraph): string[] {
  const roots: string[] = [];
  for (const [nodeId, deps] of graph.dependencies) {
    if (deps.size === 0) {
      roots.push(nodeId);
    }
  }
  return roots;
}

/**
 * Get nodes that have all their dependencies satisfied
 */
export function getReadyNodes(
  graph: DependencyGraph,
  completedNodes: Set<string>
): string[] {
  const ready: string[] = [];

  for (const [nodeId, deps] of graph.dependencies) {
    // Skip if already completed
    if (completedNodes.has(nodeId)) continue;

    // Check if all dependencies are completed
    const allDepsCompleted = Array.from(deps).every(dep => completedNodes.has(dep));
    if (allDepsCompleted) {
      ready.push(nodeId);
    }
  }

  return ready;
}

/**
 * Calculate execution depth of each node (longest path from root)
 */
export function calculateNodeDepths(graph: DependencyGraph): Map<string, number> {
  const depths = new Map<string, number>();
  const memo = new Map<string, number>();

  function getDepth(nodeId: string): number {
    if (memo.has(nodeId)) {
      return memo.get(nodeId)!;
    }

    const deps = graph.dependencies.get(nodeId) || new Set();
    if (deps.size === 0) {
      memo.set(nodeId, 0);
      return 0;
    }

    let maxDepDepth = 0;
    for (const dep of deps) {
      maxDepDepth = Math.max(maxDepDepth, getDepth(dep));
    }

    const depth = maxDepDepth + 1;
    memo.set(nodeId, depth);
    return depth;
  }

  for (const nodeId of graph.nodeIds) {
    depths.set(nodeId, getDepth(nodeId));
  }

  return depths;
}

/**
 * Group nodes into execution batches for parallel execution
 * Nodes in the same batch have no dependencies on each other
 */
export function createExecutionBatches(graph: DependencyGraph): ExecutionBatch[] {
  const depths = calculateNodeDepths(graph);
  const batches = new Map<number, string[]>();

  // Group nodes by depth
  for (const [nodeId, depth] of depths) {
    if (!batches.has(depth)) {
      batches.set(depth, []);
    }
    batches.get(depth)!.push(nodeId);
  }

  // Sort depths and create batch objects
  const sortedDepths = Array.from(batches.keys()).sort((a, b) => a - b);
  const executionBatches: ExecutionBatch[] = [];

  for (let i = 0; i < sortedDepths.length; i++) {
    const depth = sortedDepths[i];
    const nodeIds = batches.get(depth)!;
    const dependencies = new Set<string>();

    // Collect all dependencies for this batch
    for (const nodeId of nodeIds) {
      const deps = graph.dependencies.get(nodeId) || new Set();
      for (const dep of deps) {
        dependencies.add(dep);
      }
    }

    executionBatches.push({
      index: i,
      nodeIds,
      dependencies,
    });
  }

  return executionBatches;
}

/**
 * Topological sort - returns nodes in dependency order
 */
export function topologicalSort(
  nodes: Node<NodeData>[],
  edges: Edge[]
): string[] {
  const graph = buildDependencyGraph(nodes, edges);
  const sorted: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(nodeId: string) {
    if (visiting.has(nodeId)) {
      const cycle = detectCircularDependency(graph);
      throw new Error(
        `Circular dependency detected: ${cycle?.join(' -> ')}`
      );
    }

    if (visited.has(nodeId)) {
      return;
    }

    visiting.add(nodeId);

    const deps = graph.dependencies.get(nodeId) || new Set();
    for (const dep of deps) {
      visit(dep);
    }

    visiting.delete(nodeId);
    visited.add(nodeId);
    sorted.push(nodeId);
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      visit(node.id);
    }
  }

  return sorted;
}

/**
 * Get execution order with optional node filtering
 */
export function getExecutionOrder(
  nodes: Node<NodeData>[],
  edges: Edge[],
  options?: {
    fromNodeId?: string;
    includeDependencies?: boolean;
  }
): string[] {
  const graph = buildDependencyGraph(nodes, edges);

  // If starting from a specific node, get its dependencies
  if (options?.fromNodeId && options.includeDependencies) {
    const relevantNodes = new Set<string>();
    const toProcess = [options.fromNodeId];

    while (toProcess.length > 0) {
      const nodeId = toProcess.pop()!;
      if (relevantNodes.has(nodeId)) continue;

      relevantNodes.add(nodeId);
      const deps = graph.dependencies.get(nodeId) || new Set();
      for (const dep of deps) {
        toProcess.push(dep);
      }
    }

    // Filter nodes and edges
    const filteredNodes = nodes.filter(n => relevantNodes.has(n.id));
    const filteredEdges = edges.filter(
      e => relevantNodes.has(e.source) && relevantNodes.has(e.target)
    );

    return topologicalSort(filteredNodes, filteredEdges);
  }

  return topologicalSort(nodes, edges);
}

/**
 * Find all paths between two nodes
 */
export function findPaths(
  graph: DependencyGraph,
  fromNodeId: string,
  toNodeId: string
): string[][] {
  const paths: string[][] = [];

  function dfs(current: string, path: string[]) {
    if (current === toNodeId) {
      paths.push([...path, current]);
      return;
    }

    const deps = graph.dependencies.get(current) || new Set();
    for (const dep of deps) {
      if (!path.includes(dep)) {
        dfs(dep, [...path, current]);
      }
    }
  }

  dfs(fromNodeId, []);
  return paths;
}

/**
 * Get the critical path (longest dependency chain)
 */
export function getCriticalPath(
  graph: DependencyGraph
): string[] {
  const depths = calculateNodeDepths(graph);
  let maxDepth = 0;
  let deepestNode = '';

  for (const [nodeId, depth] of depths) {
    if (depth > maxDepth) {
      maxDepth = depth;
      deepestNode = nodeId;
    }
  }

  if (!deepestNode) return [];

  // Reconstruct path by following dependencies
  const path: string[] = [deepestNode];
  let current = deepestNode;

  while (true) {
    const deps = graph.dependencies.get(current) || new Set();
    if (deps.size === 0) break;

    // Find the dependency with the highest depth
    let nextNode = '';
    let nextDepth = -1;
    for (const dep of deps) {
      const depDepth = depths.get(dep) || 0;
      if (depDepth > nextDepth) {
        nextDepth = depDepth;
        nextNode = dep;
      }
    }

    if (!nextNode) break;
    path.unshift(nextNode);
    current = nextNode;
  }

  return path;
}

export default {
  buildDependencyGraph,
  detectCircularDependency,
  getRootNodes,
  getReadyNodes,
  calculateNodeDepths,
  createExecutionBatches,
  topologicalSort,
  getExecutionOrder,
  findPaths,
  getCriticalPath,
};
