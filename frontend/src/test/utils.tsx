/**
 * Test Utilities
 * Helper functions for testing the AI Pipeline Editor
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from '../types';
import type { RenderResult } from '@testing-library/react';

// ============================================================================
// React Testing Library Custom Render
// ============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  providerProps?: Record<string, unknown>;
}

/**
 * Custom render with providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const { providerProps, ...renderOptions } = options;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { renderWithProviders as render };

// ============================================================================
// Node Factories
// ============================================================================

/**
 * Create a test node with default values
 */
export function createNode(
  type: string,
  overrides: Partial<Node<NodeData>> = {}
): Node<NodeData> {
  const id = overrides.id || `node-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseNode: Node<NodeData> = {
    id,
    type,
    position: { x: 0, y: 0 },
    data: {
      label: type,
      ...overrides.data,
    } as NodeData,
    ...overrides,
  };

  return baseNode;
}

/**
 * Create an input node
 */
export function createInputNode(overrides: Partial<Node<NodeData>> = {}): Node<NodeData> {
  return createNode('inputNode', {
    data: {
      label: 'Input',
      initialFields: ['prompt', 'image'],
      fieldValues: { prompt: 'test prompt', image: '' },
      fieldLabels: { prompt: 'Prompt', image: 'Image' },
      imagesByField: {},
      ...overrides.data,
    },
    ...overrides,
  });
}

/**
 * Create a generator node
 */
export function createGeneratorNode(overrides: Partial<Node<NodeData>> = {}): Node<NodeData> {
  return createNode('generator', {
    data: {
      label: 'Generator',
      inputPrompt: 'generate an image',
      inputImagePreview: null,
      outputImage: null,
      ...overrides.data,
    },
    ...overrides,
  });
}

/**
 * Create an image analyzer node
 */
export function createImageAnalyzerNode(overrides: Partial<Node<NodeData>> = {}): Node<NodeData> {
  return createNode('imageAnalyzer', {
    data: {
      label: 'Image Analyzer',
      systemDirections: 'Analyze this image',
      localPrompt: 'Describe what you see',
      analysisResult: '',
      localImages: [],
      ...overrides.data,
    },
    ...overrides,
  });
}

/**
 * Create a response/output node
 */
export function createResponseNode(overrides: Partial<Node<NodeData>> = {}): Node<NodeData> {
  return createNode('responseNode', {
    data: {
      label: 'Response',
      ...overrides.data,
    },
    ...overrides,
  });
}

// ============================================================================
// Edge Factories
// ============================================================================

/**
 * Create a test edge connecting two nodes
 */
export function createEdge(
  source: string,
  target: string,
  overrides: Partial<Edge> = {}
): Edge {
  return {
    id: `e-${source}-${target}`,
    source,
    target,
    sourceHandle: 'output',
    targetHandle: 'prompt-in',
    ...overrides,
  };
}

/**
 * Create a prompt connection edge
 */
export function createPromptEdge(source: string, target: string): Edge {
  return createEdge(source, target, {
    sourceHandle: 'prompt-out',
    targetHandle: 'prompt-in',
  });
}

/**
 * Create an image connection edge
 */
export function createImageEdge(source: string, target: string): Edge {
  return createEdge(source, target, {
    sourceHandle: 'image-out',
    targetHandle: 'image-in',
  });
}

// ============================================================================
// Workflow Builders
// ============================================================================

/**
 * Build a simple linear workflow: input -> processor -> output
 */
export function buildLinearWorkflow(): { nodes: Node<NodeData>[]; edges: Edge[] } {
  const input = createInputNode({ id: 'input-1' });
  const processor = createGeneratorNode({ id: 'processor-1' });
  const output = createResponseNode({ id: 'output-1' });

  const nodes = [input, processor, output];
  const edges = [
    createPromptEdge('input-1', 'processor-1'),
    createEdge('processor-1', 'output-1', { sourceHandle: 'output', targetHandle: 'image-in' }),
  ];

  return { nodes, edges };
}

/**
 * Build a branching workflow: one input -> two parallel processors -> output
 */
export function buildBranchingWorkflow(): { nodes: Node<NodeData>[]; edges: Edge[] } {
  const input = createInputNode({ id: 'input-1' });
  const processor1 = createGeneratorNode({ id: 'processor-1' });
  const processor2 = createGeneratorNode({ id: 'processor-2' });
  const output = createResponseNode({ id: 'output-1' });

  const nodes = [input, processor1, processor2, output];
  const edges = [
    createPromptEdge('input-1', 'processor-1'),
    createPromptEdge('input-1', 'processor-2'),
    createEdge('processor-1', 'output-1', { sourceHandle: 'output', targetHandle: 'image-in' }),
    createEdge('processor-2', 'output-1', { sourceHandle: 'output', targetHandle: 'video-in' }),
  ];

  return { nodes, edges };
}

/**
 * Build a workflow with circular dependency (for testing detection)
 */
export function buildCircularWorkflow(): { nodes: Node<NodeData>[]; edges: Edge[] } {
  const node1 = createGeneratorNode({ id: 'node-1' });
  const node2 = createGeneratorNode({ id: 'node-2' });
  const node3 = createGeneratorNode({ id: 'node-3' });

  const nodes = [node1, node2, node3];
  const edges = [
    createEdge('node-1', 'node-2'),
    createEdge('node-2', 'node-3'),
    createEdge('node-3', 'node-1'), // Circular!
  ];

  return { nodes, edges };
}

/**
 * Build a complex multi-level workflow
 */
export function buildComplexWorkflow(): { nodes: Node<NodeData>[]; edges: Edge[] } {
  // Level 0: Inputs
  const input1 = createInputNode({ id: 'input-1' });
  const input2 = createInputNode({ id: 'input-2' });

  // Level 1: Analyzers
  const analyzer1 = createImageAnalyzerNode({ id: 'analyzer-1' });
  const analyzer2 = createImageAnalyzerNode({ id: 'analyzer-2' });

  // Level 2: Generators
  const generator1 = createGeneratorNode({ id: 'generator-1' });
  const generator2 = createGeneratorNode({ id: 'generator-2' });

  // Level 3: Output
  const output = createResponseNode({ id: 'output-1' });

  const nodes = [input1, input2, analyzer1, analyzer2, generator1, generator2, output];
  const edges = [
    // Level 0 -> Level 1
    createPromptEdge('input-1', 'analyzer-1'),
    createPromptEdge('input-2', 'analyzer-2'),
    // Level 1 -> Level 2
    createPromptEdge('analyzer-1', 'generator-1'),
    createPromptEdge('analyzer-2', 'generator-2'),
    // Level 2 -> Level 3
    createEdge('generator-1', 'output-1', { sourceHandle: 'output', targetHandle: 'image-in' }),
    createEdge('generator-2', 'output-1', { sourceHandle: 'output', targetHandle: 'video-in' }),
  ];

  return { nodes, edges };
}

// ============================================================================
// Async Utilities
// ============================================================================

/**
 * Wait for a specified duration
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Flush all pending promises
 */
export function flushPromises(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Wait for an async assertion to pass (polling)
 */
export async function waitForAssertion(
  assertion: () => void | Promise<void>,
  timeout = 1000,
  interval = 50
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      await assertion();
      return;
    } catch {
      await wait(interval);
    }
  }
  
  // Final attempt - will throw if still failing
  await assertion();
}

// ============================================================================
// Mock Utilities
// ============================================================================

/**
 * Create a mock for the API module
 */
export function createApiMock() {
  return {
    generateImage: vi.fn().mockResolvedValue({ data: { id: 'task-1' } }),
    pollStatus: vi.fn().mockResolvedValue({ 
      data: { 
        status: 'COMPLETED', 
        output: 'https://example.com/image.png' 
      } 
    }),
    analyzeImage: vi.fn().mockResolvedValue({ 
      analysis: 'This is a test image description' 
    }),
    upscaleCreative: vi.fn().mockResolvedValue({ data: { id: 'task-upscale-1' } }),
    pollUpscaleStatus: vi.fn().mockResolvedValue({
      data: {
        status: 'COMPLETED',
        output: 'https://example.com/upscaled.png',
      },
    }),
    removeBackground: vi.fn().mockResolvedValue({
      data: {
        output: 'https://example.com/no-bg.png',
        highRes: 'https://example.com/no-bg-hd.png',
      },
    }),
  };
}

/**
 * Mock the API module - must be called at top level of test file
 * Example usage in test:
 * 
 * vi.mock('@/utils/api', () => ({
 *   generateImage: vi.fn().mockResolvedValue({ data: { id: 'task-1' } }),
 *   pollStatus: vi.fn().mockResolvedValue({ data: { status: 'COMPLETED', output: 'url' } }),
 * }));
 */
export function mockApi() {
  throw new Error(
    'mockApi() cannot be used - vi.mock is hoisted. ' +
    'Use vi.mock() at the top level of your test file instead.'
  );
}

// ============================================================================
// Matchers & Assertions
// ============================================================================

/**
 * Assert that a node has a specific execution status
 */
export function expectNodeState(
  states: Map<string, { status: string }>,
  nodeId: string,
  expectedStatus: string
) {
  const state = states.get(nodeId);
  expect(state).toBeDefined();
  expect(state?.status).toBe(expectedStatus);
}

/**
 * Assert that multiple nodes have specific statuses
 */
export function expectNodeStates(
  states: Map<string, { status: string }>,
  expectations: Record<string, string>
) {
  for (const [nodeId, expectedStatus] of Object.entries(expectations)) {
    expectNodeState(states, nodeId, expectedStatus);
  }
}
