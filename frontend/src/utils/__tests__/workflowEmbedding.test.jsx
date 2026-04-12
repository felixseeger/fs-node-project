/**
 * Workflow Embedding Tests
 * Comprehensive test suite for workflow embedding utilities
 */

import {
  embedWorkflowInOutput,
  extractWorkflowFromOutput,
  hasEmbeddedWorkflow,
  getEmbeddedProviders,
  validateEmbeddedWorkflow,
  createEmbeddedWorkflowBadge,
  reconstructWorkflow
} from '../workflowEmbedding';

describe('Workflow Embedding Utilities', () => {
  const mockWorkflow = {
    nodes: [
      { id: 'node1', type: 'input', data: { prompt: 'test' } },
      { id: 'node2', type: 'generator', data: { model: 'freepik-mystic' } }
    ],
    edges: [
      { id: 'edge1', source: 'node1', target: 'node2', sourceHandle: 'prompt-out', targetHandle: 'prompt-in' }
    ]
  };

  const mockProviders = ['freepik', 'anthropic'];
  const mockOutput = { imageUrl: 'https://example.com/image.jpg', size: '1024x1024' };

  describe('embedWorkflowInOutput', () => {
    test('embeds workflow metadata into output', () => {
      const result = embedWorkflowInOutput(mockOutput, mockWorkflow, mockProviders);

      expect(result).toBeDefined();
      expect(result.imageUrl).toBe(mockOutput.imageUrl);
      expect(result.nodeBananaWorkflow).toBeDefined();
      expect(result.nodeBananaWorkflow.nodes).toEqual(mockWorkflow.nodes);
      expect(result.nodeBananaWorkflow.edges).toEqual(mockWorkflow.edges);
      expect(result.nodeBananaWorkflow.providers).toEqual(mockProviders);
      expect(result.nodeBananaWorkflow.metadata.providerReferencesOnly).toBe(true);
    });

    test('handles empty output object', () => {
      const result = embedWorkflowInOutput({}, mockWorkflow, mockProviders);
      expect(result.nodeBananaWorkflow).toBeDefined();
      expect(result.nodeBananaWorkflow.providers).toEqual(mockProviders);
    });

    test('handles null output', () => {
      const result = embedWorkflowInOutput(null, mockWorkflow, mockProviders);
      expect(result.nodeBananaWorkflow).toBeDefined();
    });
  });

  describe('extractWorkflowFromOutput', () => {
    test('extracts workflow from embedded output', () => {
      const embedded = embedWorkflowInOutput(mockOutput, mockWorkflow, mockProviders);
      const extracted = extractWorkflowFromOutput(embedded);

      expect(extracted).not.toBeNull();
      expect(extracted.nodes).toEqual(mockWorkflow.nodes);
      expect(extracted.edges).toEqual(mockWorkflow.edges);
      expect(extracted.providers).toEqual(mockProviders);
      expect(extracted.metadata).toBeDefined();
    });

    test('returns null for output without embedded workflow', () => {
      const extracted = extractWorkflowFromOutput(mockOutput);
      expect(extracted).toBeNull();
    });

    test('returns null for invalid workflow structure', () => {
      const invalidEmbedded = {
        ...mockOutput,
        nodeBananaWorkflow: {
          nodes: 'not-an-array',
          edges: [],
          providers: []
        }
      };
      const extracted = extractWorkflowFromOutput(invalidEmbedded);
      expect(extracted).toBeNull();
    });
  });

  describe('hasEmbeddedWorkflow', () => {
    test('returns true for output with embedded workflow', () => {
      const embedded = embedWorkflowInOutput(mockOutput, mockWorkflow, mockProviders);
      expect(hasEmbeddedWorkflow(embedded)).toBe(true);
    });

    test('returns false for output without embedded workflow', () => {
      expect(hasEmbeddedWorkflow(mockOutput)).toBe(false);
      expect(hasEmbeddedWorkflow({})).toBe(false);
      expect(hasEmbeddedWorkflow(null)).toBe(false);
    });
  });

  describe('getEmbeddedProviders', () => {
    test('returns provider array from embedded workflow', () => {
      const embedded = embedWorkflowInOutput(mockOutput, mockWorkflow, mockProviders);
      const providers = getEmbeddedProviders(embedded);
      expect(providers).toEqual(mockProviders);
    });

    test('returns empty array for output without embedded workflow', () => {
      expect(getEmbeddedProviders(mockOutput)).toEqual([]);
      expect(getEmbeddedProviders({})).toEqual([]);
    });
  });

  describe('validateEmbeddedWorkflow', () => {
    test('returns true for valid embedded workflow', () => {
      const embedded = embedWorkflowInOutput(mockOutput, mockWorkflow, mockProviders);
      expect(validateEmbeddedWorkflow(embedded)).toBe(true);
    });

    test('returns false for output without embedded workflow', () => {
      expect(validateEmbeddedWorkflow(mockOutput)).toBe(false);
    });

    test('returns false for invalid workflow structure', () => {
      const invalidEmbedded = {
        ...mockOutput,
        nodeBananaWorkflow: {
          version: '1.0',
          nodes: 'not-an-array',
          edges: [],
          providers: []
        }
      };
      expect(validateEmbeddedWorkflow(invalidEmbedded)).toBe(false);
    });

    test('returns false when providerReferencesOnly is not true', () => {
      const invalidEmbedded = {
        ...mockOutput,
        nodeBananaWorkflow: {
          version: '1.0',
          nodes: [],
          edges: [],
          providers: [],
          metadata: {
            providerReferencesOnly: false
          }
        }
      };
      expect(validateEmbeddedWorkflow(invalidEmbedded)).toBe(false);
    });
  });

  describe('createEmbeddedWorkflowBadge', () => {
    test('creates badge for embedded workflow', () => {
      const embedded = embedWorkflowInOutput(mockOutput, mockWorkflow, mockProviders);
      const badge = createEmbeddedWorkflowBadge(embedded);

      expect(badge).not.toBeNull();
      expect(badge.type).toBe('embeddedWorkflowBadge');
      expect(badge.label).toBe('Embedded Workflow');
      expect(badge.providers).toBe('freepik, anthropic');
      expect(badge.ariaLabel).toContain('embedded workflow');
      expect(badge.ariaLabel).toContain('2 provider reference(s)');
    });

    test('returns null for output without embedded workflow', () => {
      expect(createEmbeddedWorkflowBadge(mockOutput)).toBeNull();
    });
  });

  describe('reconstructWorkflow', () => {
    test('reconstructs workflow from extracted data', () => {
      const embedded = embedWorkflowInOutput(mockOutput, mockWorkflow, mockProviders);
      const extracted = extractWorkflowFromOutput(embedded);
      const reconstructed = reconstructWorkflow(extracted);

      expect(reconstructed.name).toContain('Reconstructed Workflow');
      expect(reconstructed.nodes).toEqual(mockWorkflow.nodes);
      expect(reconstructed.edges).toEqual(mockWorkflow.edges);
      expect(reconstructed.providers).toEqual(mockProviders);
      expect(reconstructed.metadata.source).toBe('embedded');
      expect(reconstructed.metadata.providerReferencesOnly).toBe(true);
    });
  });

  describe('Edge Cases and Security', () => {
    test('handles empty provider array', () => {
      const result = embedWorkflowInOutput(mockOutput, mockWorkflow, []);
      expect(result.nodeBananaWorkflow.providers).toEqual([]);
      expect(validateEmbeddedWorkflow(result)).toBe(true);
    });

    test('handles empty nodes and edges arrays', () => {
      const emptyWorkflow = { nodes: [], edges: [] };
      const result = embedWorkflowInOutput(mockOutput, emptyWorkflow, mockProviders);
      expect(result.nodeBananaWorkflow.nodes).toEqual([]);
      expect(result.nodeBananaWorkflow.edges).toEqual([]);
      expect(validateEmbeddedWorkflow(result)).toBe(true);
    });

    test('preserves original output properties', () => {
      const complexOutput = {
        imageUrl: 'https://example.com/image.jpg',
        size: '1024x1024',
        format: 'jpg',
        metadata: { createdAt: '2023-01-01', author: 'test' }
      };
      const result = embedWorkflowInOutput(complexOutput, mockWorkflow, mockProviders);
      
      expect(result.imageUrl).toBe(complexOutput.imageUrl);
      expect(result.size).toBe(complexOutput.size);
      expect(result.format).toBe(complexOutput.format);
      expect(result.metadata).toEqual(complexOutput.metadata);
      expect(result.nodeBananaWorkflow).toBeDefined();
    });

    test('does not mutate original output object', () => {
      const originalOutput = { ...mockOutput };
      embedWorkflowInOutput(originalOutput, mockWorkflow, mockProviders);
      expect(originalOutput.nodeBananaWorkflow).toBeUndefined();
    });
  });
});