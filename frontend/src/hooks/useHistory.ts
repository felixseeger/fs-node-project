/**
 * useHistory Hook
 * Manages undo/redo state for the workflow editor
 */
import { useState, useCallback, useRef } from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from '../types';

const MAX_HISTORY = 50;

export interface HistoryState {
  past: HistoryEntry[];
  future: HistoryEntry[];
}

export interface HistoryEntry {
  nodes: Node<NodeData>[];
  edges: Edge[];
  timestamp: number;
}

export interface UseHistoryReturn {
  history: HistoryState;
  addToHistory: (nodes: Node<NodeData>[], edges: Edge[]) => void;
  undo: (
    currentNodes: Node<NodeData>[],
    currentEdges: Edge[],
    setNodes: (nodes: Node<NodeData>[] | ((prev: Node<NodeData>[]) => Node<NodeData>[])) => void,
    setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void
  ) => boolean;
  redo: (
    currentNodes: Node<NodeData>[],
    currentEdges: Edge[],
    setNodes: (nodes: Node<NodeData>[] | ((prev: Node<NodeData>[]) => Node<NodeData>[])) => void,
    setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void
  ) => boolean;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
}

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryState>({ past: [], future: [] });
  const isUndoingRef = useRef(false);

  /**
   * Add a new state to history
   */
  const addToHistory = useCallback((nodes: Node<NodeData>[], edges: Edge[]) => {
    if (isUndoingRef.current) return;
    
    setHistory(prev => {
      // Remove any future history if we're in the middle
      const newPast = [...prev.past];
      
      // Add new state
      const state: HistoryEntry = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        timestamp: Date.now(),
      };
      
      const updated = [...newPast, state];
      
      // Limit history size
      if (updated.length > MAX_HISTORY) {
        return { past: updated.slice(updated.length - MAX_HISTORY), future: [] };
      }
      return { past: updated, future: [] };
    });
  }, []);

  /**
   * Restore to a previous state
   */
  const restoreFromHistory = useCallback((
    index: number,
    past: HistoryEntry[],
    currentNodes: Node<NodeData>[],
    currentEdges: Edge[],
    setNodes: (nodes: Node<NodeData>[] | ((prev: Node<NodeData>[]) => Node<NodeData>[])) => void,
    setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void
  ): boolean => {
    if (index < 0 || index >= past.length) return false;
    
    isUndoingRef.current = true;
    
    try {
      const state = past[index];
      const parsedNodes = JSON.parse(JSON.stringify(state.nodes)) as Node<NodeData>[];
      const parsedEdges = JSON.parse(JSON.stringify(state.edges)) as Edge[];
      
      // Preserve current selected state
      const selectedNodeIds = new Set(currentNodes.filter(n => n.selected).map(n => n.id));
      const selectedEdgeIds = new Set(currentEdges.filter(e => e.selected).map(e => e.id));
      
      setNodes(parsedNodes.map(n => ({
        ...n,
        selected: selectedNodeIds.has(n.id)
      })));
      
      setEdges(parsedEdges.map(e => ({
        ...e,
        selected: selectedEdgeIds.has(e.id)
      })));
      
      return true;
    } finally {
      // Reset flag after React processes the state update
      setTimeout(() => {
        isUndoingRef.current = false;
      }, 0);
    }
  }, []);

  /**
   * Undo last action
   */
  const undo = useCallback((
    currentNodes: Node<NodeData>[],
    currentEdges: Edge[],
    setNodes: (nodes: Node<NodeData>[] | ((prev: Node<NodeData>[]) => Node<NodeData>[])) => void,
    setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void
  ): boolean => {
    if (history.past.length === 0) return false;
    
    const newPast = [...history.past];
    newPast.pop();
    
    const success = restoreFromHistory(
      newPast.length - 1,
      newPast,
      currentNodes,
      currentEdges,
      setNodes,
      setEdges
    );
    
    if (success) {
      setHistory(prev => ({
        past: newPast,
        future: [{ nodes: currentNodes, edges: currentEdges, timestamp: Date.now() }, ...prev.future]
      }));
    }
    
    return success;
  }, [history.past, restoreFromHistory]);

  /**
   * Redo last undone action
   */
  const redo = useCallback((
    currentNodes: Node<NodeData>[],
    currentEdges: Edge[],
    setNodes: (nodes: Node<NodeData>[] | ((prev: Node<NodeData>[]) => Node<NodeData>[])) => void,
    setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void
  ): boolean => {
    if (history.future.length === 0) return false;
    
    const [next, ...newFuture] = history.future;
    
    isUndoingRef.current = true;
    try {
      const parsedNodes = JSON.parse(JSON.stringify(next.nodes)) as Node<NodeData>[];
      const parsedEdges = JSON.parse(JSON.stringify(next.edges)) as Edge[];
      
      setNodes(parsedNodes);
      setEdges(parsedEdges);
      
      setHistory(prev => ({
        past: [...prev.past, { nodes: currentNodes, edges: currentEdges, timestamp: Date.now() }],
        future: newFuture
      }));
      
      return true;
    } finally {
      setTimeout(() => {
        isUndoingRef.current = false;
      }, 0);
    }
  }, [history.future]);

  /**
   * Check if undo/redo are available
   */
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistory({ past: [], future: [] });
  }, []);

  return {
    history,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
  };
}

export default useHistory;
