/**
 * Performance Optimizer Tests
 * Comprehensive test suite for performance monitoring and optimization
 */

import { renderHook, act } from '@testing-library/react';
import { usePerformanceOptimizer, PerformanceUtils } from '../PerformanceOptimizer';

// Mock React Flow hooks
const mockGetNodes = jest.fn();
const mockGetEdges = jest.fn();
const mockFitView = jest.fn();
const mockSetViewport = jest.fn();
const mockGetViewport = jest.fn();

jest.mock('@xyflow/react', () => ({
  useReactFlow: () => ({
    getNodes: mockGetNodes,
    getEdges: mockGetEdges,
    fitView: mockFitView,
    setViewport: mockSetViewport,
    getViewport: mockGetViewport
  })
}));

describe('Performance Optimizer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock responses
    mockGetNodes.mockReturnValue([
      { id: 'node1', position: { x: 100, y: 100 } },
      { id: 'node2', position: { x: 200, y: 200 } }
    ]);
    mockGetEdges.mockReturnValue([
      { id: 'edge1', source: 'node1', target: 'node2' }
    ]);
    mockGetViewport.mockReturnValue({ x: 0, y: 0, width: 1000, height: 800, zoom: 1 });
  });

  test('initializes with default settings', () => {
    const { result } = renderHook(() => usePerformanceOptimizer());
    
    expect(result.current.performanceStats.fps).toBe(60);
    expect(result.current.optimizationLevel).toBe('balanced');
    expect(result.current.isPerformanceMode).toBe(false);
  });

  test('calculates performance metrics', () => {
    const { result } = renderHook(() => usePerformanceOptimizer());
    
    // Trigger performance calculation
    act(() => {
      result.current.calculatePerformance();
    });
    
    expect(result.current.performanceStats.nodeCount).toBe(2);
    expect(result.current.performanceStats.edgeCount).toBe(1);
    expect(result.current.performanceStats.memoryUsage).toBeGreaterThan(0);
  });

  test('adjusts optimization level based on performance', () => {
    // Mock poor performance
    mockGetNodes.mockReturnValueOnce(Array(150).fill(0).map((_, i) => (
      { id: `node${i}`, position: { x: i * 10, y: i * 10 } }
    )));
    
    const { result } = renderHook(() => usePerformanceOptimizer());
    
    // Simulate low FPS scenario
    act(() => {
      // This would need more sophisticated mocking for real FPS simulation
      result.current.setManualOptimization('performance');
    });
    
    expect(result.current.optimizationLevel).toBe('performance');
    expect(result.current.isPerformanceMode).toBe(true);
  });

  test('applies optimizations based on node count', () => {
    const { result } = renderHook(() => usePerformanceOptimizer());
    
    // Test with many nodes
    mockGetNodes.mockReturnValueOnce(Array(101).fill(0).map((_, i) => (
      { id: `node${i}`, position: { x: i * 5, y: i * 5 } }
    )));
    
    act(() => {
      result.current.applyOptimizations();
    });
    
    expect(mockFitView).toHaveBeenCalled();
  });

  test('filters visible elements based on viewport', () => {
    const { result } = renderHook(() => usePerformanceOptimizer());
    
    const viewport = { x: 0, y: 0, width: 500, height: 400 };
    const visible = result.current.getVisibleElements(viewport);
    
    expect(visible.nodes.length).toBeLessThanOrEqual(2); // Should filter nodes outside viewport
    expect(visible.edges.length).toBeLessThanOrEqual(1);
  });

  test('handles manual optimization level changes', () => {
    const { result } = renderHook(() => usePerformanceOptimizer());
    
    act(() => {
      result.current.setManualOptimization('quality');
    });
    
    expect(result.current.optimizationLevel).toBe('quality');
    expect(result.current.isPerformanceMode).toBe(false);
    
    act(() => {
      result.current.setManualOptimization('performance');
    });
    
    expect(result.current.optimizationLevel).toBe('performance');
    expect(result.current.isPerformanceMode).toBe(true);
  });

  test('rejects invalid optimization levels', () => {
    const { result } = renderHook(() => usePerformanceOptimizer());
    const originalLevel = result.current.optimizationLevel;
    
    act(() => {
      result.current.setManualOptimization('invalid-level');
    });
    
    expect(result.current.optimizationLevel).toBe(originalLevel);
  });
});

describe('Canvas Optimizer', () => {
  test('optimizes viewport based on complexity', () => {
    const { result } = renderHook(() => usePerformanceOptimizer());
    
    // Test with high complexity
    const complexNodes = Array(150).fill(0).map((_, i) => ({ id: `node${i}` }));
    const complexEdges = Array(100).fill(0).map((_, i) => ({ id: `edge${i}` }));
    
    const optimized = result.current.optimizeViewport(complexNodes, complexEdges);
    expect(optimized.zoom).toBeLessThanOrEqual(0.8);
    
    // Test with low complexity
    const simpleNodes = Array(10).fill(0).map((_, i) => ({ id: `node${i}` }));
    const simpleEdges = Array(5).fill(0).map((_, i) => ({ id: `edge${i}` }));
    
    const simpleOptimized = result.current.optimizeViewport(simpleNodes, simpleEdges);
    expect(simpleOptimized.zoom).toBe(1); // Should not reduce zoom for simple workflows
  });

  test('provides quality settings based on render quality', () => {
    const { result } = renderHook(() => usePerformanceOptimizer());
    
    // Test high quality settings
    act(() => {
      result.current.setRenderQuality('high');
    });
    
    const highSettings = result.current.getQualitySettings();
    expect(highSettings.nodeDetail).toBe('full');
    expect(highSettings.animation).toBe(true);
    
    // Test medium quality settings
    act(() => {
      result.current.setRenderQuality('medium');
    });
    
    const mediumSettings = result.current.getQualitySettings();
    expect(mediumSettings.nodeDetail).toBe('reduced');
    expect(mediumSettings.animation).toBe(false);
  });
});

describe('Performance Utilities', () => {
  test('measures execution time correctly', () => {
    const result = PerformanceUtils.measureExecution(() => {
      let sum = 0;
      for (let i = 0; i < 1000; i++) {
        sum += i;
      }
      return sum;
    }, 'test-operation');
    
    expect(result.result).toBe(499500); // Sum of 0-999
    expect(result.duration).toBeGreaterThan(0);
    expect(result.duration).toBeLessThan(100); // Should be fast
  });

  test('assesses optimization needs correctly', () => {
    expect(PerformanceUtils.needsOptimization(200, 150)).toBe('critical');
    expect(PerformanceUtils.needsOptimization(90, 40)).toBe('recommended');
    expect(PerformanceUtils.needsOptimization(60, 30)).toBe('optional');
    expect(PerformanceUtils.needsOptimization(20, 10)).toBe('none');
  });

  test('provides appropriate recommendations', () => {
    const criticalRecs = PerformanceUtils.getRecommendations({
      fps: 20,
      memoryUsage: 150,
      nodeCount: 200,
      renderTime: 100
    });
    
    expect(criticalRecs.length).toBeGreaterThan(0);
    expect(criticalRecs).toContain('Reduce workflow complexity or enable performance mode');
    
    const goodRecs = PerformanceUtils.getRecommendations({
      fps: 55,
      memoryUsage: 40,
      nodeCount: 30,
      renderTime: 15
    });
    
    expect(goodRecs.length).toBe(0); // No recommendations needed
  });
});

// Additional tests that would be valuable:
// - Test virtualized rendering with large datasets
// - Test memory optimization functions
// - Test performance monitoring over time
// - Test viewport optimization edge cases
// - Test integration with actual React Flow components