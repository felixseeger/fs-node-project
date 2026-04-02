/**
 * useNodeProgress Hook
 * Manages progress tracking for async node operations with polling
 */

import { useState, useCallback, useRef } from 'react';

/**
 * Progress state for a node
 * @typedef {Object} ProgressState
 * @property {number} progress - Progress percentage (0-100)
 * @property {string} status - Current status
 * @property {string} message - Status message
 * @property {Error|null} error - Error if failed
 */

/**
 * Hook for tracking node execution progress
 * @param {Object} options
 * @param {Function} options.onProgress - Callback for progress updates
 * @returns {Object} Progress control methods
 */
export function useNodeProgress(options = {}) {
  const { onProgress } = options;
  const [state, setState] = useState({
    progress: 0,
    status: 'idle',
    message: '',
    error: null,
  });
  
  const abortRef = useRef(false);

  /**
   * Update progress state
   */
  const updateProgress = useCallback((updates) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      onProgress?.(newState);
      return newState;
    });
  }, [onProgress]);

  /**
   * Start progress tracking
   */
  const start = useCallback((message = 'Starting...') => {
    abortRef.current = false;
    updateProgress({
      progress: 0,
      status: 'running',
      message,
      error: null,
    });
  }, [updateProgress]);

  /**
   * Update progress percentage
   */
  const setProgress = useCallback((progress, message) => {
    if (abortRef.current) return;
    updateProgress({
      progress: Math.min(100, Math.max(0, progress)),
      message: message || state.message,
    });
  }, [updateProgress, state.message]);

  /**
   * Set status message
   */
  const setMessage = useCallback((message) => {
    if (abortRef.current) return;
    updateProgress({ message });
  }, [updateProgress]);

  /**
   * Mark as completed
   */
  const complete = useCallback((message = 'Completed') => {
    if (abortRef.current) return;
    updateProgress({
      progress: 100,
      status: 'completed',
      message,
    });
  }, [updateProgress]);

  /**
   * Mark as failed
   */
  const fail = useCallback((error) => {
    if (abortRef.current) return;
    updateProgress({
      status: 'failed',
      message: error.message || 'Failed',
      error,
    });
  }, [updateProgress]);

  /**
   * Reset progress
   */
  const reset = useCallback(() => {
    abortRef.current = true;
    setState({
      progress: 0,
      status: 'idle',
      message: '',
      error: null,
    });
  }, []);

  /**
   * Poll status with progress tracking
   * @param {Function} pollFn - Function that polls status, returns { status, progress?, message?, result? }
 * @param {Object} options - Polling options
   * @returns {Promise} Result of polling
   */
  const pollWithProgress = useCallback(async (pollFn, options = {}) => {
    const {
      maxAttempts = 90,
      intervalMs = 2000,
      onStatusChange,
    } = options;

    start('Initializing...');

    for (let i = 0; i < maxAttempts; i++) {
      if (abortRef.current) {
        throw new Error('Cancelled');
      }

      try {
        const result = await pollFn();
        
        // Calculate progress based on attempt number if not provided
        const progress = result.progress !== undefined 
          ? result.progress 
          : Math.min(95, (i / maxAttempts) * 100);
        
        const message = result.message || `Processing... (${i + 1}/${maxAttempts})`;
        
        setProgress(progress, message);
        onStatusChange?.(result);

        // Check completion
        if (result.status === 'COMPLETED' || result.status === 'completed') {
          complete(result.message || 'Done');
          return result;
        }

        // Check failure
        if (result.status === 'FAILED' || result.status === 'failed') {
          throw new Error(result.error || 'Processing failed');
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      } catch (error) {
        fail(error);
        throw error;
      }
    }

    throw new Error('Polling timeout');
  }, [start, setProgress, complete, fail]);

  return {
    ...state,
    start,
    setProgress,
    setMessage,
    complete,
    fail,
    reset,
    pollWithProgress,
    isActive: state.status === 'running' || state.status === 'pending',
    isCompleted: state.status === 'completed',
    isFailed: state.status === 'failed',
  };
}

export default useNodeProgress;
