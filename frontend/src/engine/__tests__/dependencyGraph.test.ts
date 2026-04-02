import { describe, it, expect } from 'vitest';
import {
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
} from '../dependencyGraph';
import {
  createNode,
  createEdge,
  buildLinearWorkflow,
  buildBranchingWorkflow,
  buildCircularWorkflow,
  buildComplexWorkflow,
} from '@/test/utils';
import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from '@/types';

describe('DependencyGraph', () => {
  describe('buildDependencyGraph', () => {
    it('should build an empty graph for no nodes', () => {
      const graph = buildDependencyGraph([], []);
      expect(graph.nodeIds.size).toBe(0);
      expect(graph.dependencies.size).toBe(0);
      expect(graph.dependents.size).toBe(0);
    });

    it('should build a graph with isolated nodes', () => {
      const nodes = [createNode('inputNode'), createNode('generator')];
      const graph = buildDependencyGraph(nodes, []);
      
      expect(graph.nodeIds.size).toBe(2);
      expect(graph.dependencies.get(nodes[0].id)?.size).toBe(0);
      expect(graph.dependencies.get(nodes[1].id)?.size).toBe(0);
    });

    it('should build dependencies from edges', () => {
      const node1 = createNode('inputNode', { id: 'n1' });
      const node2 = createNode('generator', { id: 'n2' });
      const nodes = [node1, node2];
      const edges = [createEdge('n1', 'n2')];
      
      const graph = buildDependencyGraph(nodes, edges);
      
      expect(graph.dependencies.get('n2')?.has('n1')).toBe(true);
      expect(graph.dependents.get('n1')?.has('n2')).toBe(true);
    });

    it('should handle multiple dependencies', () => {
      const { nodes, edges } = buildComplexWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      // output-1 depends on both generators
      const outputDeps = graph.dependencies.get('output-1');
      expect(outputDeps?.has('generator-1')).toBe(true);
      expect(outputDeps?.has('generator-2')).toBe(true);
    });
  });

  describe('detectCircularDependency', () => {
    it('should return null for acyclic graph', () => {
      const { nodes, edges } = buildLinearWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      expect(detectCircularDependency(graph)).toBeNull();
    });

    it('should return null for branching graph', () => {
      const { nodes, edges } = buildBranchingWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      expect(detectCircularDependency(graph)).toBeNull();
    });

    it('should detect a simple cycle', () => {
      const { nodes, edges } = buildCircularWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      const cycle = detectCircularDependency(graph);
      expect(cycle).not.toBeNull();
      expect(cycle?.length).toBeGreaterThan(0);
    });

    it('should detect self-loop', () => {
      const node = createNode('generator', { id: 'n1' });
      const graph = buildDependencyGraph([node], [createEdge('n1', 'n1')]);
      
      const cycle = detectCircularDependency(graph);
      expect(cycle).not.toBeNull();
    });
  });

  describe('getRootNodes', () => {
    it('should return all nodes with no dependencies', () => {
      const { nodes, edges } = buildComplexWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      const roots = getRootNodes(graph);
      expect(roots).toContain('input-1');
      expect(roots).toContain('input-2');
      expect(roots).not.toContain('generator-1');
    });

    it('should return empty array for cyclic graph', () => {
      const { nodes, edges } = buildCircularWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      // In a pure cycle, every node has a dependency
      const roots = getRootNodes(graph);
      expect(roots.length).toBe(0);
    });
  });

  describe('getReadyNodes', () => {
    it('should return root nodes when nothing is completed', () => {
      const { nodes, edges } = buildLinearWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      const ready = getReadyNodes(graph, new Set());
      expect(ready).toContain('input-1');
      expect(ready).not.toContain('processor-1');
    });

    it('should return nodes with all deps completed', () => {
      const { nodes, edges } = buildLinearWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      const ready = getReadyNodes(graph, new Set(['input-1']));
      expect(ready).toContain('processor-1');
    });

    it('should return empty when all nodes are completed', () => {
      const { nodes, edges } = buildLinearWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      const completed = new Set(nodes.map(n => n.id));
      const ready = getReadyNodes(graph, completed);
      expect(ready.length).toBe(0);
    });
  });

  describe('calculateNodeDepths', () => {
    it('should assign depth 0 to root nodes', () => {
      const { nodes, edges } = buildLinearWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      const depths = calculateNodeDepths(graph);
      expect(depths.get('input-1')).toBe(0);
    });

    it('should calculate correct depths for linear chain', () => {
      const { nodes, edges } = buildLinearWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      const depths = calculateNodeDepths(graph);
      expect(depths.get('input-1')).toBe(0);
      expect(depths.get('processor-1')).toBe(1);
      expect(depths.get('output-1')).toBe(2);
    });

    it('should calculate same depth for parallel branches', () => {
      const { nodes, edges } = buildBranchingWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      const depths = calculateNodeDepths(graph);
      expect(depths.get('processor-1')).toBe(depths.get('processor-2'));
    });

    it('should handle complex workflow', () => {
      const { nodes, edges } = buildComplexWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      const depths = calculateNodeDepths(graph);
      
      // Inputs at level 0
      expect(depths.get('input-1')).toBe(0);
      expect(depths.get('input-2')).toBe(0);
      
      // Analyzers at level 1
      expect(depths.get('analyzer-1')).toBe(1);
      expect(depths.get('analyzer-2')).toBe(1);
      
      // Generators at level 2
      expect(depths.get('generator-1')).toBe(2);
      expect(depths.get('generator-2')).toBe(2);
      
      // Output at level 3
      expect(depths.get('output-1')).toBe(3);
    });
  });

  describe('createExecutionBatches', () => {
    it('should create single batch for isolated nodes', () => {
      const nodes = [createNode('inputNode'), createNode('inputNode')];
      const graph = buildDependencyGraph(nodes, []);
      
      const batches = createExecutionBatches(graph);
      expect(batches.length).toBe(1);
      expect(batches[0].nodeIds.length).toBe(2);
    });

    it('should create sequential batches for linear chain', () => {
      const { nodes, edges } = buildLinearWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      const batches = createExecutionBatches(graph);
      expect(batches.length).toBe(3);
      
      // Each batch should have one node
      expect(batches[0].nodeIds).toContain('input-1');
      expect(batches[1].nodeIds).toContain('processor-1');
      expect(batches[2].nodeIds).toContain('output-1');
    });

    it('should batch parallel nodes together', () => {
      const { nodes, edges } = buildBranchingWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      const batches = createExecutionBatches(graph);
      
      // Find batch with processors (should be same batch)
      const processorBatch = batches.find(
        b => b.nodeIds.includes('processor-1') && b.nodeIds.includes('processor-2')
      );
      expect(processorBatch).toBeDefined();
    });
  });

  describe('topologicalSort', () => {
    it('should sort nodes in dependency order', () => {
      const { nodes, edges } = buildLinearWorkflow();
      
      const sorted = topologicalSort(nodes, edges);
      
      expect(sorted.indexOf('input-1')).toBeLessThan(sorted.indexOf('processor-1'));
      expect(sorted.indexOf('processor-1')).toBeLessThan(sorted.indexOf('output-1'));
    });

    it('should include all nodes', () => {
      const { nodes, edges } = buildComplexWorkflow();
      
      const sorted = topologicalSort(nodes, edges);
      
      expect(sorted.length).toBe(nodes.length);
      for (const node of nodes) {
        expect(sorted).toContain(node.id);
      }
    });

    it('should throw on circular dependency', () => {
      const { nodes, edges } = buildCircularWorkflow();
      
      expect(() => topologicalSort(nodes, edges)).toThrow('Circular dependency detected');
    });
  });

  describe('getExecutionOrder', () => {
    it('should return full order by default', () => {
      const { nodes, edges } = buildLinearWorkflow();
      
      const order = getExecutionOrder(nodes, edges);
      expect(order.length).toBe(3);
    });

    it('should return partial order from specific node', () => {
      const { nodes, edges } = buildComplexWorkflow();
      
      const order = getExecutionOrder(nodes, edges, {
        fromNodeId: 'generator-1',
        includeDependencies: true,
      });
      
      // Should include generator-1 and its dependencies
      expect(order).toContain('generator-1');
      expect(order).toContain('analyzer-1');
      expect(order).toContain('input-1');
      
      // Should NOT include unrelated branches
      expect(order).not.toContain('analyzer-2');
      expect(order).not.toContain('generator-2');
    });
  });

  describe('findPaths', () => {
    it('should find direct path', () => {
      const { nodes, edges } = buildLinearWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      const paths = findPaths(graph, 'output-1', 'input-1');
      expect(paths.length).toBeGreaterThan(0);
      expect(paths[0]).toContain('input-1');
      expect(paths[0]).toContain('output-1');
    });

    it('should find multiple paths in branching workflow', () => {
      const { nodes, edges } = buildBranchingWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      const paths = findPaths(graph, 'output-1', 'input-1');
      expect(paths.length).toBe(2); // Two paths through different processors
    });

    it('should return empty for unreachable nodes', () => {
      const node1 = createNode('inputNode', { id: 'n1' });
      const node2 = createNode('inputNode', { id: 'n2' });
      const graph = buildDependencyGraph([node1, node2], []);
      
      const paths = findPaths(graph, 'n1', 'n2');
      expect(paths.length).toBe(0);
    });
  });

  describe('getCriticalPath', () => {
    it('should return longest path in linear workflow', () => {
      const { nodes, edges } = buildLinearWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      const path = getCriticalPath(graph);
      expect(path.length).toBe(3);
      expect(path[0]).toBe('input-1');
      expect(path[2]).toBe('output-1');
    });

    it('should identify critical path in complex workflow', () => {
      const { nodes, edges } = buildComplexWorkflow();
      const graph = buildDependencyGraph(nodes, edges);
      
      const path = getCriticalPath(graph);
      
      // Should start from an input
      expect(['input-1', 'input-2']).toContain(path[0]);
      
      // Should end at output
      expect(path[path.length - 1]).toBe('output-1');
      
      // All paths in this workflow have same length
      expect(path.length).toBe(4);
    });
  });
});
