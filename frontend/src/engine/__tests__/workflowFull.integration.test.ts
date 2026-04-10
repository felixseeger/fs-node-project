/**
 * Integration tests: full workflows through the execution engine with mocked API.
 * Asserts success, progress events, stats, and valid dependency order (not just isolated units).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createExecutionEngine, ExecutionEngine } from '../executionEngine';
import { buildDependencyGraph } from '../dependencyGraph';
import type { DependencyGraph } from '../types';
import {
  buildLinearWorkflow,
  buildBranchingWorkflow,
  buildComplexWorkflow,
} from '@/test/utils';
import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from '@/types';

vi.mock('@/utils/api', () => ({
  generateImage: vi.fn().mockResolvedValue({ data: { id: 'task-1' } }),
  pollStatus: vi.fn().mockResolvedValue({
    data: {
      status: 'COMPLETED',
      output: 'https://example.com/generated.png',
    },
  }),
  analyzeImage: vi.fn().mockResolvedValue({
    analysis: 'Test analysis result',
  }),
  upscaleCreative: vi.fn().mockResolvedValue({ data: { id: 'upscale-1' } }),
  pollUpscaleStatus: vi.fn().mockResolvedValue({
    data: {
      status: 'COMPLETED',
      output: 'https://example.com/upscaled.png',
    },
  }),
  removeBackground: vi.fn().mockResolvedValue({
    data: {
      output: 'https://example.com/no-bg.png',
    },
  }),
}));

/** Every executed node emits node-complete with nodeId; collect order for ordering assertions. */
function collectNodeCompletionOrder(
  engine: ExecutionEngine,
  nodes: Node<NodeData>[],
  edges: Edge[]
): Promise<{ order: string[]; result: Awaited<ReturnType<ExecutionEngine['execute']>> }> {
  const order: string[] = [];
  engine.setProgressCallback((event, data) => {
    if (event === 'node-complete' && data.nodeId) {
      order.push(data.nodeId);
    }
  });
  return engine.execute(nodes, edges).then((result) => ({ order, result }));
}

/** For any edge dep -> node in the graph, if both appear in completion order, dep must finish first. */
function assertTopologicalCompletionOrder(
  completedOrder: string[],
  graph: DependencyGraph
): void {
  const index = new Map<string, number>();
  completedOrder.forEach((id, i) => index.set(id, i));

  for (const nodeId of completedOrder) {
    const deps = graph.dependencies.get(nodeId);
    if (!deps) continue;
    for (const depId of deps) {
      if (!index.has(depId)) continue;
      expect(
        index.get(depId)!,
        `Dependency ${depId} must complete before ${nodeId}`
      ).toBeLessThan(index.get(nodeId)!);
    }
  }
}

describe('workflow full integration (engine + executors + mocked API)', () => {
  let engine: ExecutionEngine;

  beforeEach(() => {
    engine = createExecutionEngine({
      parallel: false,
      verbose: false,
    });
    vi.clearAllMocks();
  });

  it('linear workflow: success, progress, stats, and strict execution order', async () => {
    const { nodes, edges } = buildLinearWorkflow();
    const graph = buildDependencyGraph(nodes, edges);

    const progress: string[] = [];
    const order: string[] = [];
    engine.setProgressCallback((event, data) => {
      progress.push(event);
      if (event === 'node-complete' && data.nodeId) order.push(data.nodeId);
    });
    const result = await engine.execute(nodes, edges);

    expect(result.success).toBe(true);
    expect(result.stats.failedNodes).toBe(0);
    expect(result.stats.skippedNodes).toBe(0);
    expect(result.stats.completedNodes).toBe(nodes.length);
    expect(progress).toContain('start');
    expect(progress).toContain('complete');

    expect(order).toEqual(['input-1', 'processor-1', 'output-1']);
    assertTopologicalCompletionOrder(order, graph);
  });

  it('branching workflow: both branches before merge output; valid topo order', async () => {
    const { nodes, edges } = buildBranchingWorkflow();
    const graph = buildDependencyGraph(nodes, edges);

    const { order, result } = await collectNodeCompletionOrder(engine, nodes, edges);

    expect(result.success).toBe(true);
    expect(result.stats.completedNodes).toBe(nodes.length);
    expect(result.stats.failedNodes).toBe(0);

    // Sequential engine picks first ready node by graph map order: processor-1 before processor-2
    expect(order).toEqual(['input-1', 'processor-1', 'processor-2', 'output-1']);
    assertTopologicalCompletionOrder(order, graph);

    const outIdx = order.indexOf('output-1');
    expect(order.indexOf('processor-1')).toBeLessThan(outIdx);
    expect(order.indexOf('processor-2')).toBeLessThan(outIdx);
  });

  it('complex multi-level workflow: all nodes complete; topo order holds', async () => {
    const { nodes, edges } = buildComplexWorkflow();
    const graph = buildDependencyGraph(nodes, edges);

    const { order, result } = await collectNodeCompletionOrder(engine, nodes, edges);

    expect(result.success).toBe(true);
    expect(result.stats.completedNodes).toBe(nodes.length);
    expect(order).toHaveLength(nodes.length);

    assertTopologicalCompletionOrder(order, graph);

    // Documented sequential schedule for this fixture (map iteration order over nodes[])
    expect(order).toEqual([
      'input-1',
      'input-2',
      'analyzer-1',
      'analyzer-2',
      'generator-1',
      'generator-2',
      'output-1',
    ]);
  });
});
