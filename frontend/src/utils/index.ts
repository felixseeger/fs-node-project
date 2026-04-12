/**
 * Utility functions for the AI Pipeline Editor
 */

import type { PerformanceMetrics } from '../types';

/**
 * Get provider statistics from monitoring
 * @returns Record of provider statistics
 */
export function getProviderStats(): Record<string, { success: number; failures: number; avgResponseTime: number }> {
  // Return empty stats - this is a stub for future implementation
  return {};
}

/**
 * Performance utilities for analyzing workflow complexity
 */
export const PerformanceUtils = {
  /**
   * Determine if workflow needs optimization based on node/edge count
   * @param nodeCount - Number of nodes
   * @param edgeCount - Number of edges
   * @returns Optimization level recommendation
   */
  needsOptimization(
    nodeCount: number,
    edgeCount: number
  ): 'critical' | 'recommended' | 'optional' | 'none' {
    const complexity = nodeCount * 0.7 + edgeCount * 0.3;
    
    if (complexity > 100) return 'critical';
    if (complexity > 50) return 'recommended';
    if (complexity > 25) return 'optional';
    return 'none';
  },

  /**
   * Get optimization recommendations based on performance metrics
   * @param metrics - Current performance metrics
   * @returns Array of recommendation strings
   */
  getRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.fps < 30) {
      recommendations.push('Consider reducing node count or enabling performance mode');
    }
    if (metrics.memoryUsage > 100) {
      recommendations.push('High memory usage detected - optimize asset sizes');
    }
    if (metrics.renderTime > 30) {
      recommendations.push('Slow render times - consider simplifying connections');
    }
    if (metrics.nodeCount > 50) {
      recommendations.push('Large workflow detected - use grouping or virtualization');
    }
    if (metrics.edgeCount > metrics.nodeCount * 2) {
      recommendations.push('Complex connections - simplify routing with hub nodes');
    }

    return recommendations;
  },

  /**
   * Calculate performance score (0-100)
   * @param metrics - Performance metrics
   * @returns Score from 0-100
   */
  calculateScore(metrics: PerformanceMetrics): number {
    let score = 100;
    
    // Deduct for low FPS
    if (metrics.fps < 60) {
      score -= (60 - metrics.fps) * 2;
    }
    
    // Deduct for high memory usage
    if (metrics.memoryUsage > 50) {
      score -= (metrics.memoryUsage - 50) * 0.5;
    }
    
    // Deduct for slow render times
    if (metrics.renderTime > 16) {
      score -= (metrics.renderTime - 16) * 1.5;
    }
    
    // Deduct for complexity
    const complexity = metrics.nodeCount * 0.7 + metrics.edgeCount * 0.3;
    if (complexity > 30) {
      score -= (complexity - 30) * 0.3;
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }
};

/**
 * Format bytes to human-readable string
 * @param bytes - Bytes to format
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Debounce function execution
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Throttle function execution
 * @param fn - Function to throttle
 * @param limit - Limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
