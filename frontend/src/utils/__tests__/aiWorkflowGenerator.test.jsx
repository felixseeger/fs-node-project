import { vi } from "vitest";
/**
 * AI Workflow Generator Tests
 * Comprehensive test suite for prompt analysis and workflow generation
 */

import { generateWorkflowFromPrompt } from '../aiWorkflowGenerator';

describe('AI Workflow Generator', () => {

  describe('generateWorkflowFromPrompt', () => {
    test('generates image workflow for image-related prompts', async () => {
      const result = await generateWorkflowFromPrompt({
        prompt: 'Create a surreal landscape with vibrant colors',
        providerPreferences: ['freepik'],
        constraints: { maxNodes: 6 }
      });

      expect(result.nodes).toBeDefined();
      expect(result.edges).toBeDefined();
      expect(result.nodes.length).toBeGreaterThan(0);
      
      // Should contain typical image workflow nodes
      const nodeTypes = result.nodes.map(node => node.type);
      expect(nodeTypes).toContain('input');
      expect(nodeTypes).toContain('generator');
    });

    test('generates video workflow for video-related prompts', async () => {
      const result = await generateWorkflowFromPrompt({
        prompt: 'Create an animation of a cyberpunk city at night',
        providerPreferences: ['freepik']
      });

      expect(result.nodes).toBeDefined();
      expect(result.nodes.length).toBeGreaterThan(0);
      
      // Should contain video-specific nodes
      const nodeTypes = result.nodes.map(node => node.type);
      expect(nodeTypes).toContain('kling3');
    });

    test('generates audio workflow for audio-related prompts', async () => {
      const result = await generateWorkflowFromPrompt({
        prompt: 'Generate futuristic music for a sci-fi scene',
        providerPreferences: ['anthropic']
      });

      expect(result.nodes).toBeDefined();
      expect(result.nodes.length).toBeGreaterThan(0);
      
      // Should contain audio-specific nodes
      const nodeTypes = result.nodes.map(node => node.type);
      expect(nodeTypes).toContain('musicGeneration');
    });

    test('generates complex workflow for composition prompts', async () => {
      const result = await generateWorkflowFromPrompt({
        prompt: 'Create a multiple image composition with different styles',
        providerPreferences: ['freepik']
      });

      expect(result.nodes).toBeDefined();
      expect(result.nodes.length).toBeGreaterThan(0);
      
      // Should contain routing/merging nodes for complex workflows
      const nodeTypes = result.nodes.map(node => node.type);
      expect(nodeTypes).toContain('router');
    });

    test('respects maxNodes constraint', async () => {
      const result = await generateWorkflowFromPrompt({
        prompt: 'Create a simple landscape',
        constraints: { maxNodes: 3 }
      });

      expect(result.nodes.length).toBeLessThanOrEqual(3);
    });

    test('uses preferred providers', async () => {
      const result = await generateWorkflowFromPrompt({
        prompt: 'Create a surreal portrait',
        providerPreferences: ['custom-provider', 'freepik']
      });

      // Check that nodes use the preferred providers
      const generatorNode = result.nodes.find(node => node.type === 'generator');
      if (generatorNode) {
        expect(generatorNode.data.provider).toBe('custom-provider');
      }
    });

    test('handles empty prompt gracefully', async () => {
      const result = await generateWorkflowFromPrompt({
        prompt: '',
        providerPreferences: ['freepik']
      });

      // Should still generate a default workflow
      expect(result.nodes).toBeDefined();
      expect(result.nodes.length).toBeGreaterThan(0);
    });

    test('generates unique node IDs', async () => {
      const result1 = await generateWorkflowFromPrompt({
        prompt: 'Test prompt 1'
      });

      const result2 = await generateWorkflowFromPrompt({
        prompt: 'Test prompt 2'
      });

      // Node IDs should be different between calls
      const ids1 = result1.nodes.map(node => node.id);
      const ids2 = result2.nodes.map(node => node.id);
      
      expect(ids1).not.toEqual(ids2);
    });

    test('includes edges connecting nodes', async () => {
      const result = await generateWorkflowFromPrompt({
        prompt: 'Create a simple image'
      });

      expect(result.edges).toBeDefined();
      
      if (result.edges.length > 0) {
        expect(result.edges[0]).toHaveProperty('source');
        expect(result.edges[0]).toHaveProperty('target');
        expect(result.edges[0]).toHaveProperty('id');
      }
    });
  });

  describe('prompt analysis', () => {
    test('identifies image generation prompts', async () => {
      const result = await generateWorkflowFromPrompt({
        prompt: 'Generate a beautiful landscape image'
      });

      // Should generate an image workflow
      const hasGenerator = result.nodes.some(node => node.type === 'generator');
      expect(hasGenerator).toBe(true);
    });

    test('identifies video generation prompts', async () => {
      const result = await generateWorkflowFromPrompt({
        prompt: 'Create a motion video of clouds'
      });

      // Should generate a video workflow
      const hasVideoNode = result.nodes.some(node => node.type === 'kling3');
      expect(hasVideoNode).toBe(true);
    });

    test('identifies audio generation prompts', async () => {
      const result = await generateWorkflowFromPrompt({
        prompt: 'Make some background music'
      });

      // Should generate an audio workflow
      const hasAudioNode = result.nodes.some(node => node.type === 'musicGeneration');
      expect(hasAudioNode).toBe(true);
    });

    test('extracts style information from prompts', async () => {
      const vibrantResult = await generateWorkflowFromPrompt({
        prompt: 'Create a vibrant colorful landscape'
      });

      const darkResult = await generateWorkflowFromPrompt({
        prompt: 'Generate a dark night scene'
      });

      // Check that parameters are extracted
      const vibrantInput = vibrantResult.nodes.find(node => node.type === 'input');
      const darkInput = darkResult.nodes.find(node => node.type === 'input');

      if (vibrantInput) {
        expect(vibrantInput.data.prompt).toContain('vibrant');
      }
      if (darkInput) {
        expect(darkInput.data.prompt).toContain('dark');
      }
    });
  });
});

// Note: These tests use the mock implementation.
// In a real application, you would want to:
// 1. Test the actual AI integration
// 2. Add more edge case testing
// 3. Test performance with complex prompts
// 4. Validate generated workflow structures
// 5. Test error handling and edge cases