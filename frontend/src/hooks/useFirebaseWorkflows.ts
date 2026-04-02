/**
 * React Hook for Firebase Workflow Integration
 * Provides real-time sync, persistence, and offline support
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Unsubscribe } from 'firebase/firestore';
import type { Workflow } from '../types/workflow';
import { isFirebaseConfigured } from '../config/firebase';
import {
  createWorkflow,
  getWorkflow,
  updateWorkflow,
  deleteWorkflow,
  listWorkflows,
  subscribeToWorkflow,
  subscribeToUserWorkflows,
  duplicateWorkflow,
  exportWorkflowToJSON,
  importWorkflowFromJSON,
  type WorkflowStats,
  getWorkflowStats,
} from '../services/workflowService';

interface UseFirebaseWorkflowsOptions {
  userId?: string;
  enableRealtime?: boolean;
}

interface UseFirebaseWorkflowsReturn {
  // State
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  isLoading: boolean;
  error: Error | null;
  stats: WorkflowStats | null;
  
  // CRUD Operations
  create: (name: string, nodes: any[], edges: any[]) => Promise<Workflow | null>;
  load: (workflowId: string) => Promise<Workflow | null>;
  save: (workflowId: string, updates: Partial<Workflow>) => Promise<void>;
  remove: (workflowId: string) => Promise<void>;
  duplicate: (workflowId: string) => Promise<string | null>;
  
  // Real-time
  subscribe: (workflowId: string) => void;
  unsubscribe: () => void;
  
  // Import/Export
  exportJSON: (workflow: Workflow) => string;
  importJSON: (json: string) => Promise<Workflow | null>;
  
  // Stats
  refreshStats: () => Promise<void>;
  
  // Pagination
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useFirebaseWorkflows(
  options: UseFirebaseWorkflowsOptions = {}
): UseFirebaseWorkflowsReturn {
  const { userId, enableRealtime = true } = options;
  
  // State
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<WorkflowStats | null>(null);
  const [hasMore, setHasMore] = useState(false);
  
  // Refs for pagination and subscriptions
  const lastDocRef = useRef<any>(null);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const unsubscribeCurrentRef = useRef<Unsubscribe | null>(null);
  
  // Check if Firebase is available
  const isAvailable = isFirebaseConfigured();
  
  // =============================================================================
  // Initial Load - Subscribe to user's workflows
  // =============================================================================
  
  useEffect(() => {
    if (!isAvailable || !userId || !enableRealtime) {
      return;
    }
    
    setIsLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToUserWorkflows(userId, (updatedWorkflows) => {
      setWorkflows(updatedWorkflows);
      setIsLoading(false);
    });
    
    unsubscribeRef.current = unsubscribe;
    
    // Load stats
    refreshStats();
    
    return () => {
      unsubscribe();
      unsubscribeRef.current = null;
    };
  }, [userId, enableRealtime, isAvailable]);
  
  // =============================================================================
  // Cleanup subscriptions on unmount
  // =============================================================================
  
  useEffect(() => {
    return () => {
      if (unsubscribeCurrentRef.current) {
        unsubscribeCurrentRef.current();
      }
    };
  }, []);
  
  // =============================================================================
  // CRUD Operations
  // =============================================================================
  
  const create = useCallback(async (
    name: string,
    nodes: any[],
    edges: any[]
  ): Promise<Workflow | null> => {
    if (!isAvailable || !userId) {
      setError(new Error('Firebase not configured or user not authenticated'));
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const workflow = await createWorkflow(userId, {
        name,
        nodes,
        edges,
      });
      
      setCurrentWorkflow(workflow);
      return workflow;
    } catch (err) {
      console.error('[useFirebaseWorkflows] Failed to create workflow:', err);
      setError(err instanceof Error ? err : new Error('Failed to create workflow'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, isAvailable]);
  
  const load = useCallback(async (workflowId: string): Promise<Workflow | null> => {
    if (!isAvailable) {
      setError(new Error('Firebase not configured'));
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const workflow = await getWorkflow(workflowId);
      setCurrentWorkflow(workflow);
      return workflow;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load workflow'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable]);
  
  const save = useCallback(async (
    workflowId: string,
    updates: Partial<Workflow>
  ): Promise<void> => {
    if (!isAvailable) {
      setError(new Error('Firebase not configured'));
      return;
    }
    
    setError(null);
    
    try {
      await updateWorkflow(workflowId, updates, userId);
      
      // Update local state if it's the current workflow
      if (currentWorkflow?.id === workflowId) {
        setCurrentWorkflow(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save workflow'));
    }
  }, [userId, currentWorkflow, isAvailable]);
  
  const remove = useCallback(async (workflowId: string): Promise<void> => {
    if (!isAvailable) {
      setError(new Error('Firebase not configured'));
      return;
    }
    
    setError(null);
    
    try {
      await deleteWorkflow(workflowId, userId);
      
      if (currentWorkflow?.id === workflowId) {
        setCurrentWorkflow(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete workflow'));
    }
  }, [userId, currentWorkflow, isAvailable]);
  
  const duplicate = useCallback(async (workflowId: string): Promise<string | null> => {
    if (!isAvailable || !userId) {
      setError(new Error('Firebase not configured or user not authenticated'));
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newId = await duplicateWorkflow(workflowId, userId);
      return newId;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to duplicate workflow'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, isAvailable]);
  
  // =============================================================================
  // Real-time Subscription
  // =============================================================================
  
  const subscribe = useCallback((workflowId: string): void => {
    if (!isAvailable) return;
    
    // Unsubscribe from previous
    if (unsubscribeCurrentRef.current) {
      unsubscribeCurrentRef.current();
    }
    
    // Subscribe to new workflow
    const unsubscribe = subscribeToWorkflow(workflowId, (workflow) => {
      setCurrentWorkflow(workflow);
    });
    
    unsubscribeCurrentRef.current = unsubscribe;
  }, [isAvailable]);
  
  const unsubscribe = useCallback((): void => {
    if (unsubscribeCurrentRef.current) {
      unsubscribeCurrentRef.current();
      unsubscribeCurrentRef.current = null;
    }
  }, []);
  
  // =============================================================================
  // Import/Export
  // =============================================================================
  
  const exportJSON = useCallback((workflow: Workflow): string => {
    return exportWorkflowToJSON(workflow);
  }, []);
  
  const importJSON = useCallback(async (json: string): Promise<Workflow | null> => {
    if (!isAvailable || !userId) {
      setError(new Error('Firebase not configured or user not authenticated'));
      return null;
    }
    
    const imported = importWorkflowFromJSON(json);
    if (!imported) {
      setError(new Error('Invalid workflow JSON'));
      return null;
    }
    
    return create(imported.name, imported.nodes, imported.edges);
  }, [userId, create, isAvailable]);
  
  // =============================================================================
  // Stats
  // =============================================================================
  
  const refreshStats = useCallback(async (): Promise<void> => {
    if (!isAvailable || !userId) return;
    
    try {
      const newStats = await getWorkflowStats(userId);
      setStats(newStats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, [userId, isAvailable]);
  
  // =============================================================================
  // Pagination
  // =============================================================================
  
  const loadMore = useCallback(async (): Promise<void> => {
    if (!isAvailable || !userId || !hasMore) return;
    
    setIsLoading(true);
    
    try {
      const result = await listWorkflows({
        userId,
        startAfterDoc: lastDocRef.current,
        limit: 20,
      });
      
      setWorkflows(prev => [...prev, ...result.workflows]);
      lastDocRef.current = result.lastDoc;
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more workflows'));
    } finally {
      setIsLoading(false);
    }
  }, [userId, hasMore, isAvailable]);
  
  return {
    workflows,
    currentWorkflow,
    isLoading,
    error,
    stats,
    create,
    load,
    save,
    remove,
    duplicate,
    subscribe,
    unsubscribe,
    exportJSON,
    importJSON,
    refreshStats,
    loadMore,
    hasMore,
  };
}
