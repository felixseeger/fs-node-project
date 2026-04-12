import { describe, it, expect, vi } from 'vitest';
import * as logicExecutors from '../logicExecutors';
import { ExecutionContext } from '../types';
import { Node } from '@xyflow/react';

describe('Logic Executors', () => {
  const createMockContext = (inputs: Record<string, unknown> = {}): ExecutionContext => ({
    getInputs: vi.fn().mockReturnValue(inputs),
    getOutput: vi.fn().mockReturnValue(undefined),
    isCancelled: vi.fn().mockReturnValue(false),
    log: vi.fn(),
    updateNodeData: vi.fn(),
  });

  const createMockNode = (id: string, data: Record<string, unknown> = {}): Node => ({
    id,
    type: 'custom',
    data,
    position: { x: 0, y: 0 },
  });

  describe('conditionExecutor', () => {
    it('should route to true_out when condition matches', async () => {
      const node = createMockNode('1', { operator: 'contains', conditionValue: 'hello' });
      const context = createMockContext({ input: 'hello world' });
      
      const result = await logicExecutors.conditionExecutor(node, context);
      
      expect(result).toHaveProperty('true_out', 'hello world');
      expect(result).not.toHaveProperty('false_out');
      expect(context.updateNodeData).toHaveBeenCalledWith('1', expect.objectContaining({ conditionResult: true }));
    });

    it('should route to false_out when condition fails', async () => {
      const node = createMockNode('2', { operator: 'equals', conditionValue: 'hello' });
      const context = createMockContext({ input: 'hello world' });
      
      const result = await logicExecutors.conditionExecutor(node, context);
      
      expect(result).toHaveProperty('false_out', 'hello world');
      expect(result).not.toHaveProperty('true_out');
      expect(context.updateNodeData).toHaveBeenCalledWith('2', expect.objectContaining({ conditionResult: false }));
    });
  });

  describe('iterationExecutor', () => {
    it('should slice array up to maxIterations', async () => {
      const node = createMockNode('3', { maxIterations: 2 });
      const context = createMockContext({ array_in: [1, 2, 3, 4] });
      
      const result = await logicExecutors.iterationExecutor(node, context);
      
      expect(result).toHaveProperty('item_out');
      expect(result.item_out).toEqual([1, 2]);
      expect(context.updateNodeData).toHaveBeenCalledWith('3', expect.objectContaining({ itemsCount: 4, processedCount: 2 }));
    });

    it('should throw error if input is not an array', async () => {
      const node = createMockNode('4', { maxIterations: 2 });
      const context = createMockContext({ array_in: "not an array" });
      
      await expect(logicExecutors.iterationExecutor(node, context)).rejects.toThrow(/requires an array input/);
    });
  });

  describe('variableExecutor', () => {
    it('should output the input value if provided', async () => {
      const node = createMockNode('5', { varValue: 'fallback' });
      const context = createMockContext({ val_in: 'provided_value' });
      
      const result = await logicExecutors.variableExecutor(node, context);
      
      expect(result).toEqual({ val_out: 'provided_value' });
      expect(context.updateNodeData).toHaveBeenCalledWith('5', expect.objectContaining({ storedValue: 'provided_value' }));
    });

    it('should output the fallback value if input is undefined', async () => {
      const node = createMockNode('6', { varValue: 'fallback' });
      const context = createMockContext({}); // no val_in
      
      const result = await logicExecutors.variableExecutor(node, context);
      
      expect(result).toEqual({ val_out: 'fallback' });
      expect(context.updateNodeData).toHaveBeenCalledWith('6', expect.objectContaining({ storedValue: 'fallback' }));
    });
  });

  describe('socialPublisherExecutor', () => {
    it('should throw if no media provided', async () => {
      const node = createMockNode('7', { platform: 'x' });
      const context = createMockContext({});
      
      await expect(logicExecutors.socialPublisherExecutor(node, context)).rejects.toThrow(/requires media input/);
    });

    it('should simulate publishing successfully', async () => {
      const node = createMockNode('8', { platform: 'instagram', caption: 'Hello world' });
      const context = createMockContext({ media_in: 'http://example.com/img.jpg' });
      
      const result = await logicExecutors.socialPublisherExecutor(node, context);
      
      expect(result).toEqual({ result: 'Successfully posted to instagram' });
      expect(context.updateNodeData).toHaveBeenCalledWith('8', expect.objectContaining({ publishStatus: 'success' }));
    });
  });

  describe('cloudSyncExecutor', () => {
    it('should throw if no media provided', async () => {
      const node = createMockNode('9', { provider: 'gdrive' });
      const context = createMockContext({});
      
      await expect(logicExecutors.cloudSyncExecutor(node, context)).rejects.toThrow(/requires media input/);
    });

    it('should simulate syncing successfully', async () => {
      const node = createMockNode('10', { provider: 's3', folderPath: '/my-folder' });
      const context = createMockContext({ media_in: 'http://example.com/img.jpg' });
      
      const result = await logicExecutors.cloudSyncExecutor(node, context);
      
      expect(result).toEqual({ result: 'Successfully synced to s3' });
      expect(context.updateNodeData).toHaveBeenCalledWith('10', expect.objectContaining({ syncStatus: 'success' }));
    });
  });
});
