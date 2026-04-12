import { useState, useCallback, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

export function useCanvasHistory() {
  const [_history, setHistory] = useState<{ past: HistoryState[]; future: HistoryState[] }>({
    past: [],
    future: [],
  });
  
  const isHistoryAction = useRef(false);

  const saveHistory = useCallback((nodes: Node[], edges: Edge[]) => {
    setHistory((prev) => {
      // Don't save if it's the same as the last state
      const last = prev.past[prev.past.length - 1];
      if (last && JSON.stringify(last.nodes) === JSON.stringify(nodes) && JSON.stringify(last.edges) === JSON.stringify(edges)) {
        return prev;
      }

      return {
        past: [...prev.past.slice(-50), { 
          nodes: JSON.parse(JSON.stringify(nodes)), 
          edges: JSON.parse(JSON.stringify(edges)) 
        }],
        future: [],
      };
    });
  }, []);

  const undo = useCallback((currentNodes: Node[], currentEdges: Edge[], setNodes: (nds: Node[]) => void, setEdges: (eds: Edge[]) => void) => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const newPast = [...prev.past];
      const previous = newPast.pop()!;
      
      isHistoryAction.current = true;
      setNodes(previous.nodes);
      setEdges(previous.edges);

      return {
        past: newPast,
        future: [{ 
          nodes: JSON.parse(JSON.stringify(currentNodes)), 
          edges: JSON.parse(JSON.stringify(currentEdges)) 
        }, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback((currentNodes: Node[], currentEdges: Edge[], setNodes: (nds: Node[]) => void, setEdges: (eds: Edge[]) => void) => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const newFuture = [...prev.future];
      const next = newFuture.shift()!;

      isHistoryAction.current = true;
      setNodes(next.nodes);
      setEdges(next.edges);

      return {
        past: [...prev.past, { 
          nodes: JSON.parse(JSON.stringify(currentNodes)), 
          edges: JSON.parse(JSON.stringify(currentEdges)) 
        }],
        future: newFuture,
      };
    });
  }, []);

  const resetIsHistoryAction = useCallback(() => {
    isHistoryAction.current = false;
  }, []);

  return {
    saveHistory,
    undo,
    redo,
    isHistoryAction,
    resetIsHistoryAction,
  };
}
