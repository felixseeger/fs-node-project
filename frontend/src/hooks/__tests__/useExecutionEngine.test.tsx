import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useExecutionEngine } from '../useExecutionEngine';
import { buildLinearWorkflow, buildBranchingWorkflow } from '@/test/utils';
import type { NodeData } from '@/types';
import type { Node, Edge } from '@xyflow/react';

// Mock the API module
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
}));

describe('useExecutionEngine', () => {
  const mockUpdateNodeData = vi.fn();
  const mockOnProgress = vi.fn();
  const mockOnComplete = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useExecutionEngine());

      expect(result.current.isExecuting).toBe(false);
      expect(result.current.currentPhase).toBe('idle');
      expect(result.current.progress).toBe(0);
      expect(result.current.error).toBeNull();
      expect(result.current.completedNodes).toEqual([]);
      expect(result.current.failedNodes).toEqual([]);
    });

    it('should accept options', () => {
      const { result } = renderHook(() =>
        useExecutionEngine({
          parallel: true,
          maxConcurrency: 8,
          continueOnError: true,
        })
      );

      // Hook should be created successfully with options
      expect(result.current).toBeDefined();
    });
  });

  describe('Execution', () => {
    it('should execute a workflow', async () => {
      const { nodes, edges } = buildLinearWorkflow();
      const { result } = renderHook(() =>
        useExecutionEngine({
          onUpdateNodeData: mockUpdateNodeData,
        })
      );

      await act(async () => {
        await result.current.execute(nodes, edges);
      });

      expect(result.current.isExecuting).toBe(false);
    });

    it('should update isExecuting during execution', async () => {
      const { nodes, edges } = buildLinearWorkflow();
      const { result } = renderHook(() => useExecutionEngine());

      // Start execution but don't await yet
      let executePromise: Promise<unknown>;
      act(() => {
        executePromise = result.current.execute(nodes, edges);
      });

      // Should be executing immediately
      expect(result.current.isExecuting).toBe(true);

      // Wait for completion
      await act(async () => {
        await executePromise;
      });

      expect(result.current.isExecuting).toBe(false);
    });

    it('should update progress', async () => {
      const { nodes, edges } = buildLinearWorkflow();
      const { result } = renderHook(() => useExecutionEngine());

      await act(async () => {
        await result.current.execute(nodes, edges);
      });

      // Progress should be at 100 after completion
      expect(result.current.progress).toBe(100);
    });

    it('should track completed nodes', async () => {
      const { nodes, edges } = buildLinearWorkflow();
      const { result } = renderHook(() => useExecutionEngine());

      await act(async () => {
        await result.current.execute(nodes, edges);
      });

      // Response node should be completed
      expect(result.current.isNodeCompleted('output-1')).toBe(true);
    });
  });

  describe('Callbacks', () => {
    it('should accept onUpdateNodeData callback', async () => {
      const { nodes, edges } = buildLinearWorkflow();
      const { result } = renderHook(() =>
        useExecutionEngine({
          onUpdateNodeData: mockUpdateNodeData,
        })
      );

      await act(async () => {
        await result.current.execute(nodes, edges);
      });

      // Callback should be defined and execution should complete
      expect(result.current).toBeDefined();
      // Note: onUpdateNodeData is only called when node data changes (e.g., errors)
    });

    it('should call onProgress', async () => {
      const { nodes, edges } = buildLinearWorkflow();
      const { result } = renderHook(() =>
        useExecutionEngine({
          onProgress: mockOnProgress,
        })
      );

      await act(async () => {
        await result.current.execute(nodes, edges);
      });

      expect(mockOnProgress).toHaveBeenCalled();
      // Should have received start and complete events
      const events = mockOnProgress.mock.calls.map((call) => call[0]);
      expect(events).toContain('start');
      expect(events).toContain('complete');
    });

    it('should call onComplete on success', async () => {
      const { nodes, edges } = buildLinearWorkflow();
      const { result } = renderHook(() =>
        useExecutionEngine({
          onComplete: mockOnComplete,
        })
      );

      await act(async () => {
        await result.current.execute(nodes, edges);
      });

      expect(mockOnComplete).toHaveBeenCalled();
      const [resultArg] = mockOnComplete.mock.calls[0];
      expect(resultArg.success).toBe(true);
      expect(resultArg.stats).toBeDefined();
    });

    it('should call onError on failure', async () => {
      // Create a workflow that will fail (circular dependency)
      const { buildCircularWorkflow } = await import('@/test/utils');
      const { nodes, edges } = buildCircularWorkflow();
      
      const { result } = renderHook(() =>
        useExecutionEngine({
          onError: mockOnError,
        })
      );

      await act(async () => {
        await result.current.execute(nodes, edges);
      });

      expect(mockOnError).toHaveBeenCalled();
      expect(result.current.error).toContain('Circular dependency');
    });
  });

  describe('Cancellation', () => {
    it('should cancel execution', async () => {
      const { nodes, edges } = buildBranchingWorkflow();
      const { result } = renderHook(() => useExecutionEngine());

      // Start execution
      act(() => {
        result.current.execute(nodes, edges);
      });

      // Cancel
      act(() => {
        result.current.cancel();
      });

      expect(result.current.currentPhase).toBe('cancelled');
      expect(result.current.isExecuting).toBe(false);
    });
  });

  describe('Reset', () => {
    it('should reset state', async () => {
      const { nodes, edges } = buildLinearWorkflow();
      const { result } = renderHook(() => useExecutionEngine());

      // Execute first
      await act(async () => {
        await result.current.execute(nodes, edges);
      });

      // Then reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.isExecuting).toBe(false);
      expect(result.current.progress).toBe(0);
      expect(result.current.error).toBeNull();
      expect(result.current.currentPhase).toBe('idle');
    });
  });

  describe('Node State Queries', () => {
    it('should query node execution state', async () => {
      const { nodes, edges } = buildLinearWorkflow();
      const { result } = renderHook(() => useExecutionEngine());

      await act(async () => {
        await result.current.execute(nodes, edges);
      });

      // Query various states
      expect(typeof result.current.isNodeExecuting('input-1')).toBe('boolean');
      expect(typeof result.current.isNodeCompleted('input-1')).toBe('boolean');
      expect(typeof result.current.isNodeFailed('input-1')).toBe('boolean');

      // Get state
      const state = result.current.getNodeState('input-1');
      expect(state).toBeDefined();
    });

    it('should return undefined for unknown node', () => {
      const { result } = renderHook(() => useExecutionEngine());

      const state = result.current.getNodeState('nonexistent');
      expect(state).toBeUndefined();
    });
  });

  describe('Execution Levels', () => {
    it('should calculate execution levels', () => {
      const { nodes, edges } = buildLinearWorkflow();
      const { result } = renderHook(() => useExecutionEngine());

      const levels = result.current.getExecutionLevels(nodes, edges);

      expect(Array.isArray(levels)).toBe(true);
      expect(levels.length).toBeGreaterThan(0);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle rapid successive executions', async () => {
      const { nodes, edges } = buildLinearWorkflow();
      const { result } = renderHook(() => useExecutionEngine());

      // Execute multiple times
      await act(async () => {
        await result.current.execute(nodes, edges);
      });

      await act(async () => {
        await result.current.execute(nodes, edges);
      });

      await act(async () => {
        await result.current.execute(nodes, edges);
      });

      expect(result.current.progress).toBe(100);
    });

    it('should handle empty workflow', async () => {
      const { result } = renderHook(() => useExecutionEngine());

      const executionResult = await act(async () => {
        return await result.current.execute([], []);
      });

      expect(executionResult.success).toBe(true);
    });

    it('should maintain node states map', async () => {
      const { nodes, edges } = buildLinearWorkflow();
      const { result } = renderHook(() => useExecutionEngine());

      await act(async () => {
        await result.current.execute(nodes, edges);
      });

      expect(result.current.nodeStates instanceof Map).toBe(true);
      expect(result.current.nodeStates.size).toBe(3);
    });
  });

  describe('Batch Tracking', () => {
    it('should track batch information in parallel mode', async () => {
      const { nodes, edges } = buildBranchingWorkflow();
      const { result } = renderHook(() =>
        useExecutionEngine({
          parallel: true,
        })
      );

      await act(async () => {
        await result.current.execute(nodes, edges);
      });

      // Should have batch information
      expect(result.current.totalBatches).toBeGreaterThan(0);
    });
  });
});
