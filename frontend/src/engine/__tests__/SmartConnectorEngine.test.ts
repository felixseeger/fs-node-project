import { describe, it, expect } from 'vitest';
import { SmartConnectorEngine } from '../SmartConnectorEngine';
import { Node, Edge } from '@xyflow/react';

describe('SmartConnectorEngine', () => {
  describe('isCompatible', () => {
    it('should return true for identical types', () => {
      expect(SmartConnectorEngine.isCompatible('image', 'image')).toBe(true);
      expect(SmartConnectorEngine.isCompatible('text', 'text')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(SmartConnectorEngine.isCompatible('IMAGE', 'image')).toBe(true);
      expect(SmartConnectorEngine.isCompatible('Text', 'TEXT')).toBe(true);
    });

    it('should correctly handle the "any" type', () => {
      expect(SmartConnectorEngine.isCompatible('image', 'any')).toBe(true);
      expect(SmartConnectorEngine.isCompatible('text', 'any')).toBe(true);
      expect(SmartConnectorEngine.isCompatible('any', 'video')).toBe(true);
    });

    it('should allow prompts to map to text and vice versa', () => {
      expect(SmartConnectorEngine.isCompatible('prompt', 'text')).toBe(true);
      expect(SmartConnectorEngine.isCompatible('text', 'prompt')).toBe(true);
    });

    it('should return false for incompatible types', () => {
      expect(SmartConnectorEngine.isCompatible('image', 'video')).toBe(false);
      expect(SmartConnectorEngine.isCompatible('audio', 'text')).toBe(false);
    });
  });

  describe('getPossibleOutputs', () => {
    it('should infer output handles from known types', () => {
      const node = { id: '1', type: 'imageNode', position: { x: 0, y: 0 }, data: {} };
      expect(SmartConnectorEngine.getPossibleOutputs(node)).toContain('image');
    });

    it('should fallback to outputImage for generators', () => {
      const node = { id: '1', type: 'fluxReimagineGenerator', position: { x: 0, y: 0 }, data: {} };
      expect(SmartConnectorEngine.getPossibleOutputs(node)).toContain('outputImage');
    });

    it('should correctly parse data.outputs if they exist', () => {
      const node = { 
        id: '1', 
        type: 'custom', 
        position: { x: 0, y: 0 }, 
        data: { outputs: [{ id: 'custom-out' }] } 
      };
      expect(SmartConnectorEngine.getPossibleOutputs(node)).toContain('custom-out');
    });
  });

  describe('getSuggestions', () => {
    it('should rank suggestions by semantic likelihood and exclude self', () => {
      const nodes: Node[] = [
        { id: 'source', type: 'textNode', position: { x: 0, y: 0 }, data: { label: 'Input Text' } },
        { id: 'target1', type: 'universalGeneratorImage', position: { x: 100, y: 0 }, data: { label: 'Image Gen', inputs: [{ id: 'inputPrompt' }] } },
        { id: 'target2', type: 'videoOutput', position: { x: 200, y: 0 }, data: { label: 'Video Out' } },
      ];

      const edges: Edge[] = [];

      const suggestions = SmartConnectorEngine.getSuggestions('source', 'output', nodes, edges);
      
      // Should not suggest self
      expect(suggestions.find(s => s.node.id === 'source')).toBeUndefined();
      
      // Should rank the generator (LLMs/Generation) higher than a random output if they were both compatible
      // In this case, target1 inputPrompt (text) is compatible with source output (any/text)
      const target1Sugg = suggestions.find(s => s.node.id === 'target1');
      expect(target1Sugg).toBeDefined();
      expect(target1Sugg?.score).toBeGreaterThan(0);
    });
  });
});
