import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createExecutionEngine } from '../../engine/executionEngine';
import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from '@/types';

// Mock the API for comprehensive coverage
vi.mock('@/utils/api', () => ({
  generateImage: vi.fn().mockResolvedValue({ data: { id: 'img-1', url: 'https://test.com/img.png' } }),
  kling3Generate: vi.fn().mockResolvedValue({ data: { id: 'vid-1', url: 'https://test.com/vid.mp4' } }),
  analyzeImage: vi.fn().mockResolvedValue({ analysis: 'A red sports car' }),
  upscaleCreative: vi.fn().mockResolvedValue({ data: { id: 'up-1' } }),
  pollStatus: vi.fn().mockResolvedValue({ data: { status: 'COMPLETED', output: 'https://test.com/final.png' } }),
  pollKling3Status: vi.fn().mockResolvedValue({ data: { status: 'COMPLETED', output: 'https://test.com/vid.mp4' } }),
  pollUpscaleStatus: vi.fn().mockResolvedValue({ data: { status: 'COMPLETED', output: 'https://test.com/highres.png' } }),
  removeBackground: vi.fn().mockResolvedValue({ data: { output: 'https://test.com/nobg.png' } }),
  socialPublish: vi.fn().mockResolvedValue({ data: { success: true, url: 'https://social.com/p/1' } }),
}));

describe('Advanced Node Validation Procedure', () => {
  let engine: any;

  beforeEach(() => {
    engine = createExecutionEngine({ parallel: true, verbose: false });
    vi.clearAllMocks();
  });

  /**
   * Procedure: Cross-Domain Multimodal Workflow
   * Validates: Image Gen -> Image Analysis -> Text Manipulation -> Video Gen -> Social Publish
   */
  it('should validate full multimodal pipeline (Image -> Analysis -> Video -> Social)', async () => {
    const nodes: Node<NodeData>[] = [
      { id: 'gen-1', type: 'generator', data: { inputPrompt: 'A futuristic city' }, position: { x: 0, y: 0 } },
      { id: 'ana-1', type: 'imageAnalyzer', data: { localPrompt: 'Describe this' }, position: { x: 200, y: 0 } },
      { id: 'vid-1', type: 'kling3', data: { inputPrompt: 'Animate this', localDuration: '5s' }, position: { x: 400, y: 0 } },
      { id: 'pub-1', type: 'socialPublisher', data: { platform: 'twitter' }, position: { x: 600, y: 0 } }
    ];

    const edges: Edge[] = [
      { id: 'e1', source: 'gen-1', target: 'ana-1', targetHandle: 'image-in' },
      { id: 'e2', source: 'ana-1', target: 'vid-1', targetHandle: 'image-in' },
      { id: 'e3', source: 'vid-1', target: 'pub-1', targetHandle: 'media_in' }
    ];

    const result = await engine.execute(nodes, edges);

    if (!result.success) {
      console.error('Workflow failed:', result.error);
      result.nodeStates.forEach((state: any, id: any) => {
        if (state.status === 'failed') console.error(`Node ${id} failed:`, state.error);
      });
    }

    expect(result.success).toBe(true);
    expect(result.stats.completedNodes).toBe(4);
  });

  /**
   * Procedure: High-Concurrency Stress Test
   * Validates: 10 parallel image generators feeding into a single aggregator
   */
  it('should validate high-concurrency parallel execution', async () => {
    const nodes: Node<NodeData>[] = [];
    const edges: Edge[] = [];

    for (let i = 0; i < 10; i++) {
      nodes.push({ id: `p-${i}`, type: 'generator', data: { inputPrompt: `Prompt ${i}` }, position: { x: 0, y: i * 100 } });
      edges.push({ id: `e-${i}`, source: `p-${i}`, target: 'merge-1', targetHandle: 'image-in' });
    }

    nodes.push({ id: 'merge-1', type: 'imageAnalyzer', data: { localPrompt: 'Analyze all' }, position: { x: 300, y: 500 } });

    const result = await engine.execute(nodes, edges);

    expect(result.success).toBe(true);
    expect(result.stats.completedNodes).toBe(11);
  });

  /**
   * Procedure: Circular Reference & Error Handling
   * Validates: The engine correctly handles/rejects invalid graphs
   */
  it('should fail gracefully on circular dependencies', async () => {
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
});
