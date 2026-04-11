/**
 * Performance Optimization Suite
 * Provides canvas rendering optimization, memory management, and performance monitoring
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';

/**
 * Performance Monitor Hook
 * Tracks and optimizes canvas performance
 */
export function usePerformanceOptimizer() {
  const { fitView, setViewport, getNodes, getEdges } = useReactFlow();
  const [performanceStats, setPerformanceStats] = useState({
    fps: 60,
    nodeCount: 0,
    edgeCount: 0,
    memoryUsage: 0,
    renderTime: 0
  });
  
  const [optimizationLevel, setOptimizationLevel] = useState('balanced');
  const [isPerformanceMode, setIsPerformanceMode] = useState(false);
  const frameRef = useRef(0);
  const lastRenderTime = useRef(0);

  /**
   * Calculate performance metrics
   */
  const calculatePerformance = useCallback(() => {
    const startTime = performance.now();
    
    const nodes = getNodes();
    const edges = getEdges();
    const currentTime = Date.now();
    
    // Calculate FPS
    const fps = frameRef.current > 0 
      ? Math.round(1000 / (currentTime - lastRenderTime.current))
      : 60;
    
    // Estimate memory usage (simplified)
    const memoryEstimate = nodes.length * 0.5 + edges.length * 0.1;
    
    const renderTime = performance.now() - startTime;
    
    setPerformanceStats({
      fps,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      memoryUsage: parseFloat(memoryEstimate.toFixed(2)),
      renderTime: parseFloat(renderTime.toFixed(2))
    });
    
    frameRef.current++;
    lastRenderTime.current = currentTime;
    
    // Auto-adjust optimization based on performance
    if (fps < 30 && nodes.length > 50) {
      setOptimizationLevel('performance');
      setIsPerformanceMode(true);
    } else if (fps > 50 && nodes.length < 30) {
      setOptimizationLevel('quality');
      setIsPerformanceMode(false);
    }
  }, [getNodes, getEdges]);

  /**
   * Apply performance optimizations
   */
  const applyOptimizations = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();
    
    switch (optimizationLevel) {
      case 'performance':
        // Reduce complexity for large workflows
        if (nodes.length > 100) {
          fitView({ padding: 0.2, duration: 200 });
        }
        break;
      
      case 'quality':
        // Enable high-quality rendering for smaller workflows
        if (nodes.length < 50) {
          fitView({ padding: 0.5, duration: 200 });
        }
        break;
      
      case 'balanced':
      default:
        fitView({ padding: 0.3, duration: 200 });
        break;
    }
  }, [optimizationLevel, fitView, getNodes]);

  /**
   * Virtualized rendering optimization
   * Only render nodes in viewport
   */
  const getVisibleElements = useCallback((viewport) => {
    const nodes = getNodes();
    const edges = getEdges();
    
    if (!viewport) {
      return { nodes, edges };
    }
    
    // Calculate visible area with buffer
    const buffer = 500;
    const visibleNodes = nodes.filter(node => {
      return node.position.x > viewport.x - buffer &&
             node.position.x < viewport.x + viewport.width + buffer &&
             node.position.y > viewport.y - buffer &&
             node.position.y < viewport.y + viewport.height + buffer;
    });
    
    // Only include edges between visible nodes
    const visibleEdges = edges.filter(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      return sourceNode && targetNode && 
             visibleNodes.includes(sourceNode) && 
             visibleNodes.includes(targetNode);
    });
    
    return { nodes: visibleNodes, edges: visibleEdges };
  }, [getNodes, getEdges]);

  /**
   * Memory management - clean up unused resources
   */
  const optimizeMemory = useCallback(() => {
    // In a real implementation, this would:
    // 1. Clean up cached images
    // 2. Release unused WebGL textures
    // 3. Garbage collect unused node data
    // For now, we'll simulate the effect
    
    const nodes = getNodes();
    if (nodes.length > 200) {
      console.warn('High memory usage detected. Consider simplifying workflow.');
    }
  }, [getNodes]);

  /**
   * Set manual optimization level
   */
  const setManualOptimization = useCallback((level) => {
    const validLevels = ['quality', 'balanced', 'performance'];
    if (validLevels.includes(level)) {
      setOptimizationLevel(level);
      setIsPerformanceMode(level === 'performance');
      applyOptimizations();
    }
  }, [applyOptimizations]);

  /**
   * Performance monitoring effect
   */
  useEffect(() => {
    let animationFrameId;
    let monitorInterval;
    
    const monitorPerformance = () => {
      calculatePerformance();
      animationFrameId = requestAnimationFrame(monitorPerformance);
    };
    
    // Start performance monitoring
    monitorInterval = setInterval(() => {
      monitorPerformance();
    }, 1000);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(monitorInterval);
    };
  }, [calculatePerformance]);

  /**
   * Apply optimizations when nodes change
   */
  useEffect(() => {
    applyOptimizations();
    optimizeMemory();
  }, [applyOptimizations, optimizeMemory, getNodes, getEdges]);

  return {
    performanceStats,
    optimizationLevel,
    isPerformanceMode,
    getVisibleElements,
    setManualOptimization,
    optimizeMemory,
    applyOptimizations
  };
}

/**
 * Canvas Rendering Optimizer
 * Optimizes React Flow rendering performance
 */
export function useCanvasOptimizer() {
  const { setViewport, getViewport } = useReactFlow();
  const [optimizedViewport, setOptimizedViewport] = useState(null);
  const [renderQuality, setRenderQuality] = useState('high');

  /**
   * Optimize viewport for performance
   */
  const optimizeViewport = useCallback((nodes, edges) => {
    const viewport = getViewport();
    if (!viewport) return viewport;
    
    // Adjust zoom based on complexity
    const complexity = nodes.length * 0.7 + edges.length * 0.3;
    
    let optimizedZoom = viewport.zoom;
    
    if (complexity > 100) {
      // For complex workflows, zoom out slightly
      optimizedZoom = Math.min(viewport.zoom, 0.8);
      setRenderQuality('medium');
    } else if (complexity > 50) {
      // Medium complexity
      optimizedZoom = Math.min(viewport.zoom, 1.0);
      setRenderQuality('high');
    } else {
      // Simple workflows can use full zoom
      optimizedZoom = viewport.zoom;
      setRenderQuality('high');
    }
    
    if (optimizedZoom !== viewport.zoom) {
      setViewport({
        x: viewport.x,
        y: viewport.y,
        zoom: optimizedZoom
      }, { duration: 200 });
    }
    
    return {
      ...viewport,
      zoom: optimizedZoom
    };
  }, [getViewport, setViewport]);

  /**
   * Get rendering quality settings
   */
  const getQualitySettings = useCallback(() => {
    switch (renderQuality) {
      case 'high':
        return {
          nodeDetail: 'full',
          edgeDetail: 'full',
          animation: true,
          shadowQuality: 'high'
        };
      case 'medium':
        return {
          nodeDetail: 'reduced',
          edgeDetail: 'simplified',
          animation: false,
          shadowQuality: 'medium'
        };
      case 'low':
        return {
          nodeDetail: 'minimal',
          edgeDetail: 'basic',
          animation: false,
          shadowQuality: 'none'
        };
      default:
        return {
          nodeDetail: 'full',
          edgeDetail: 'full',
          animation: true,
          shadowQuality: 'high'
        };
    }
  }, [renderQuality]);

  return {
    optimizedViewport,
    renderQuality,
    optimizeViewport,
    getQualitySettings,
    setRenderQuality
  };
}

/**
 * Performance Monitoring Utilities
 */
export const PerformanceUtils = {
  
  /**
   * Measure function execution time
   */
  measureExecution: (fn, name = 'operation') => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.debug(`[PERF] ${name} took ${(end - start).toFixed(2)}ms`);
    
    return {
      result,
      duration: end - start
    };
  },
  
  /**
   * Check if performance optimization is needed
   */
  needsOptimization: (nodeCount, edgeCount) => {
    const complexityScore = nodeCount * 0.7 + edgeCount * 0.3;
    
    if (complexityScore > 150) {
      return 'critical';
    } else if (complexityScore > 80) {
      return 'recommended';
    } else if (complexityScore > 50) {
      return 'optional';
    }
    
    return 'none';
  },
  
  /**
   * Get optimization recommendations
   */
  getRecommendations: (stats) => {
    const recommendations = [];
    
    if (stats.fps < 30) {
      recommendations.push('Reduce workflow complexity or enable performance mode');
    }
    
    if (stats.memoryUsage > 100) {
      recommendations.push('Clear cache or simplify workflow to reduce memory usage');
    }
    
    if (stats.nodeCount > 100) {
      recommendations.push('Consider breaking workflow into smaller sub-workflows');
    }
    
    if (stats.renderTime > 50) {
      recommendations.push('Enable virtualized rendering for better performance');
    }
    
    return recommendations;
  }
};