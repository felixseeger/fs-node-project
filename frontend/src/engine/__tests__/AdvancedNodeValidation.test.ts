import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createExecutionEngine } from '../executionEngine';
import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from '../types';

// Mock the API for full workflow validation
vi.mock('@/utils/api', () => ({
  generateImage: vi.fn().mockResolvedValue({ data: { id: 'img-1', output: 'https://test.com/img.png' } }),
  kling3Generate: vi.fn().mockResolvedValue({ data: { id: 'vid-1', output: 'https://test.com/vid.mp4' } }),
  analyzeImage: vi.fn().mockResolvedValue({ analysis: 'A futuristic landscape' }),
  pollStatus: vi.fn().mockResolvedValue({ data: { status: 'COMPLETED', output: 'https://test.com/final.png' } }),
  pollKling3Status: vi.fn().mockResolvedValue({ data: { status: 'COMPLETED', output: 'https://test.com/vid.mp4' } }),
  socialPublish: vi.fn().mockResolvedValue({ data: { success: true, url: 'https://social.com/p/1' } }),
}));

describe('Advanced Node Validation Procedure', () => {
  let engine: any;

  beforeEach(() => {
    engine = createExecutionEngine({ parallel: true, verbose: false });
    vi.clearAllMocks();
  });

  /**
   * Procedure: Multimodal Integration
   * Path: Generator -> Image Analyzer -> Kling3 Video -> Social Publisher
   * Asserts: Data flow across different multimodal domains
   */
  it('should validate cross-domain data flow (Image -> Analysis -> Video -> Social)', async () => {
    const nodes: Node<NodeData>[] = [
      { id: 'gen-1', type: 'generator', data: { inputPrompt: 'Cyberpunk Tokyo' }, position: { x: 0, y: 0 } },
      { id: 'ana-1', type: 'imageAnalyzer', data: { localPrompt: 'Analyze this' }, position: { x: 200, y: 0 } },
      { id: 'vid-1', type: 'kling3', data: { inputPrompt: 'Make it move', localDuration: '5s' }, position: { x: 400, y: 0 } },
      { id: 'pub-1', type: 'socialPublisher', data: { platform: 'twitter' }, position: { x: 600, y: 0 } }
    ];

    const edges: Edge[] = [
      { id: 'e1', source: 'gen-1', target: 'ana-1', targetHandle: 'image-in' },
      { id: 'e2', source: 'ana-1', target: 'vid-1', targetHandle: 'image-in' },
      { id: 'e3', source: 'vid-1', target: 'pub-1', targetHandle: 'media_in' }
    ];

    const result = await engine.execute(nodes, edges);
    expect(result.success).toBe(true);
    expect(result.stats.completedNodes).toBe(4);
  });

  /**
   * Procedure: Graph Integrity & Loop Detection
   * Validates: The engine rejects circular logic without crashing
   */
  it('should detect and reject circular dependencies', async () => {
    const nodes: Node<NodeData>[] = [
      { id: 'a', type: 'generator', data: { inputPrompt: 'a' }, position: { x: 0, y: 0 } },
      { id: 'b', type: 'imageAnalyzer', data: { localPrompt: 'b' }, position: { x: 200, y: 0 } }
    ];
    const edges: Edge[] = [
      { id: 'e1', source: 'a', target: 'b', targetHandle: 'image-in' },
      { id: 'e2', source: 'b', target: 'a', targetHandle: 'image-in' }
    ];

    const result = await engine.execute(nodes, edges);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Circular dependency detected');
  });

  /**
   * Procedure: Concurrent Stress Load
   * Validates: 10 parallel nodes executing without synchronization issues
   */
  it('should handle high concurrent node execution', async () => {
    const nodes: Node<NodeData>[] = [];
    const edges: Edge[] = [];

    for (let i = 0; i < 10; i++) {
      nodes.push({ id: `n-${i}`, type: 'generator', data: { inputPrompt: `P-${i}` }, position: { x: 0, y: i * 100 } });
      edges.push({ id: `e-${i}`, source: `n-${i}`, target: 'sink', targetHandle: 'image-in' });
    }
    nodes.push({ id: 'sink', type: 'imageAnalyzer', data: { localPrompt: 'sink' }, position: { x: 400, y: 500 } });

    const result = await engine.execute(nodes, edges);
    expect(result.success).toBe(true);
    expect(result.stats.completedNodes).toBe(11);
  });
});
