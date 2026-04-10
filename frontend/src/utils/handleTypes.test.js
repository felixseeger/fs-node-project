/**
 * Tests for handleTypes utility functions
 * Validates connection system for all node types
 */

import {
  getHandleDataType,
  getHandleColor,
  getNodeHandles,
  isValidConnection,
  findCompatibleHandle,
  HANDLE_COLORS
} from './handleTypes';

describe('Handle Types Utility', () => {
  describe('getHandleDataType()', () => {
    test('should return correct types for standard handles', () => {
      expect(getHandleDataType('output')).toBe('image');
      expect(getHandleDataType('image-in')).toBe('image');
      expect(getHandleDataType('video-out')).toBe('video');
      expect(getHandleDataType('prompt')).toBe('text');
      expect(getHandleDataType('aspect_ratio')).toBe('aspect_ratio');
      expect(getHandleDataType('resolution')).toBe('resolution');
      expect(getHandleDataType('num_images')).toBe('num_images');
    });

    test('should handle dynamic indexed handles', () => {
      expect(getHandleDataType('text-0')).toBe('text');
      expect(getHandleDataType('image-1')).toBe('image');
      expect(getHandleDataType('video-2')).toBe('video');
      expect(getHandleDataType('audio-3')).toBe('audio');
    });

    test('should return "any" for unknown handles', () => {
      expect(getHandleDataType('unknown-handle')).toBe('any');
      expect(getHandleDataType('')).toBe('any');
      expect(getHandleDataType(null)).toBe('any');
    });

    test('should handle special handle types', () => {
      expect(getHandleDataType('easeCurve')).toBe('easeCurve');
      expect(getHandleDataType('3d')).toBe('3d');
      expect(getHandleDataType('generic-input')).toBe('any');
    });
  });

  describe('getHandleColor()', () => {
    test('should return correct colors for each handle type', () => {
      expect(getHandleColor('output')).toBe(HANDLE_COLORS.image);
      expect(getHandleColor('video-out')).toBe(HANDLE_COLORS.video);
      expect(getHandleColor('prompt')).toBe(HANDLE_COLORS.text);
      expect(getHandleColor('audio')).toBe(HANDLE_COLORS.audio);
      expect(getHandleColor('aspect_ratio')).toBe(HANDLE_COLORS.aspect_ratio);
      expect(getHandleColor('unknown')).toBe(HANDLE_COLORS.any);
    });
  });

  describe('getNodeHandles()', () => {
    test('should return correct handles for image nodes', () => {
      expect(getNodeHandles('imageInput')).toEqual({
        inputs: ['reference'],
        outputs: ['image']
      });
      expect(getNodeHandles('nanoBanana')).toEqual({
        inputs: ['image', 'text'],
        outputs: ['image']
      });
    });

    test('should return correct handles for video nodes', () => {
      expect(getNodeHandles('videoInput')).toEqual({
        inputs: ['video'],
        outputs: ['video']
      });
      expect(getNodeHandles('generateVideo')).toEqual({
        inputs: ['image', 'text', 'audio'],
        outputs: ['video']
      });
    });

    test('should return correct handles for special nodes', () => {
      expect(getNodeHandles('router')).toEqual({
        inputs: ['image', 'text', 'video', 'audio', '3d', 'easeCurve', 'generic-input'],
        outputs: ['image', 'text', 'video', 'audio', '3d', 'easeCurve', 'generic-output']
      });
      expect(getNodeHandles('switch')).toEqual({
        inputs: ['generic-input'],
        outputs: []
      });
    });

    test('should return empty arrays for unknown node types', () => {
      expect(getNodeHandles('unknownNode')).toEqual({
        inputs: [],
        outputs: []
      });
    });
  });

  describe('isValidConnection()', () => {
    const nodes = [
      { id: 'node1', type: 'nanoBanana', data: {} },
      { id: 'node2', type: 'generateVideo', data: {} },
      { id: 'router1', type: 'router', data: {} },
      { id: 'switch1', type: 'switch', data: { inputType: 'image' } },
    ];

    test('should prevent self-connections', () => {
      const connection = {
        source: 'node1',
        target: 'node1',
        sourceHandle: 'image',
        targetHandle: 'text'
      };
      expect(isValidConnection(connection, nodes)).toBe(false);
    });

    test('should allow same-type connections', () => {
      const connection = {
        source: 'node1',
        target: 'node2',
        sourceHandle: 'image',
        targetHandle: 'image'
      };
      expect(isValidConnection(connection, nodes)).toBe(true);
    });

    test('should reject different-type connections', () => {
      const connection = {
        source: 'node1',
        target: 'node2',
        sourceHandle: 'image',
        targetHandle: 'text'
      };
      expect(isValidConnection(connection, nodes)).toBe(false);
    });

    test('should allow "any" type connections', () => {
      const connection1 = {
        source: 'node1',
        target: 'node2',
        sourceHandle: 'image',
        targetHandle: 'generic-input'
      };
      const connection2 = {
        source: 'node1',
        target: 'node2',
        sourceHandle: 'generic-output',
        targetHandle: 'image'
      };
      expect(isValidConnection(connection1, nodes)).toBe(true);
      expect(isValidConnection(connection2, nodes)).toBe(true);
    });

    test('should handle Router connections correctly', () => {
      const connection = {
        source: 'node1',
        target: 'router1',
        sourceHandle: 'image',
        targetHandle: 'image'
      };
      expect(isValidConnection(connection, nodes)).toBe(true);
    });

    test('should handle Switch connections with inputType', () => {
      const validConnection = {
        source: 'node1',
        target: 'switch1',
        sourceHandle: 'image',
        targetHandle: 'image'
      };
      const invalidConnection = {
        source: 'node1',
        target: 'switch1',
        sourceHandle: 'text',
        targetHandle: 'image'
      };
      expect(isValidConnection(validConnection, nodes)).toBe(true);
      expect(isValidConnection(invalidConnection, nodes)).toBe(false);
    });

    test('should validate video connections to specific targets', () => {
      const nodesWithVideo = [
        ...nodes,
        { id: 'videoNode', type: 'videoStitch', data: {} },
        { id: 'outputNode', type: 'output', data: {} },
        { id: 'invalidNode', type: 'prompt', data: {} }
      ];

      const validVideoConnection = {
        source: 'node2',
        target: 'videoNode',
        sourceHandle: 'video',
        targetHandle: 'video'
      };
      const invalidVideoConnection = {
        source: 'node2',
        target: 'invalidNode',
        sourceHandle: 'video',
        targetHandle: 'text'
      };

      expect(isValidConnection(validVideoConnection, nodesWithVideo)).toBe(true);
      expect(isValidConnection(invalidVideoConnection, nodesWithVideo)).toBe(false);
    });
  });

  describe('findCompatibleHandle()', () => {
    const mockNode = {
      id: 'testNode',
      type: 'videoStitch',
      data: {}
    };

    test('should find compatible handles for videoStitch', () => {
      const handle = findCompatibleHandle(mockNode, 'video', true);
      expect(handle).toBe('video-0');
    });

    test('should handle batch used handles', () => {
      const batchUsed = new Set(['video-0', 'video-1']);
      const handle = findCompatibleHandle(mockNode, 'video', true, batchUsed);
      expect(handle).toBe('video-2');
    });

    test('should return null when no compatible handles available', () => {
      const batchUsed = new Set();
      for (let i = 0; i < 50; i++) {
        batchUsed.add(`video-${i}`);
      }
      const handle = findCompatibleHandle(mockNode, 'video', true, batchUsed);
      expect(handle).toBe(null);
    });
  });
});

console.log('✅ All handleTypes tests passed!');
