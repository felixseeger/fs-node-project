import React, { useRef, useEffect, useState, useCallback, FC, ReactNode, KeyboardEvent } from 'react';
import { ReactFlow, useReactFlow, ReactFlowProvider, Viewport } from '@xyflow/react';
// @ts-ignore
import { useStore } from '../store';

interface InfiniteCanvasProps {
  children?: ReactNode;
}

/**
 * InfiniteCanvas - Virtualized rendering component for large workflows
 * Handles 1000+ nodes with smooth performance using React Flow
 */
const InfiniteCanvas: FC<InfiniteCanvasProps> = ({ children }) => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { setViewport } = useReactFlow();
  const [viewport, setViewportState] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
  const [renderedNodes, setRenderedNodes] = useState<any[]>([]);
  const [renderedEdges, setRenderedEdges] = useState<any[]>([]);

  // Virtualized rendering - only render nodes in viewport
  const updateVisibleElements = useCallback(() => {
    if (!reactFlowWrapper.current) return;
    
    const rect = reactFlowWrapper.current.getBoundingClientRect();
    const visibleNodes = (nodes || []).filter((node: any) => {
      // Simple viewport culling - can be enhanced with more sophisticated logic
      return node.position.x > viewport.x - 500 &&
             node.position.x < viewport.x + rect.width + 500 &&
             node.position.y > viewport.y - 500 &&
             node.position.y < viewport.y + rect.height + 500;
    });
    
    const visibleEdges = (edges || []).filter((edge: any) => {
      const sourceNode = (nodes || []).find((n: any) => n.id === edge.source);
      const targetNode = (nodes || []).find((n: any) => n.id === edge.target);
      return sourceNode && targetNode && 
             visibleNodes.includes(sourceNode) && 
             visibleNodes.includes(targetNode);
    });
    
    setRenderedNodes(visibleNodes);
    setRenderedEdges(visibleEdges);
  }, [nodes, edges, viewport]);

  // Handle viewport changes
  const onViewportChange = useCallback((newViewport: Viewport) => {
    setViewportState(newViewport);
  }, []);

  // Initialize and update on changes
  useEffect(() => {
    updateVisibleElements();
  }, [nodes, edges, viewport, updateVisibleElements]);

  // Keyboard navigation for accessibility
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const step = 50;
    
    switch (e.key) {
      case 'ArrowUp':
        onViewportChange({ ...viewport, y: viewport.y - step });
        break;
      case 'ArrowDown':
        onViewportChange({ ...viewport, y: viewport.y + step });
        break;
      case 'ArrowLeft':
        onViewportChange({ ...viewport, x: viewport.x - step });
        break;
      case 'ArrowRight':
        onViewportChange({ ...viewport, x: viewport.x + step });
        break;
      case '+':
      case '=':
        onViewportChange({ ...viewport, zoom: Math.min(viewport.zoom + 0.1, 2) });
        break;
      case '-':
      case '_':
        onViewportChange({ ...viewport, zoom: Math.max(viewport.zoom - 0.1, 0.1) });
        break;
      default:
        break;
    }
  }, [viewport, onViewportChange]);

  return (
    <div
      ref={reactFlowWrapper}
      className="infinite-canvas"
      style={{ width: '100%', height: '100%' }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Infinite workflow canvas"
      role="application"
    >
      <ReactFlow
        nodes={renderedNodes}
        edges={renderedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onViewportChange={onViewportChange}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-left"
      >
        {children}
      </ReactFlow>
    </div>
  );
};

interface InfiniteCanvasWrapperProps {
  children?: ReactNode;
}

/**
 * InfiniteCanvasWrapper - Provides ReactFlowProvider context
 */
export const InfiniteCanvasWrapper: FC<InfiniteCanvasWrapperProps> = ({ children }) => {
  return (
    <ReactFlowProvider>
      <InfiniteCanvas>
        {children}
      </InfiniteCanvas>
    </ReactFlowProvider>
  );
};

/**
 * Hook to interact with the infinite canvas
 */
export const useInfiniteCanvas = () => {
  const { fitView } = useReactFlow();
  
  const centerCanvas = useCallback(() => {
    fitView({ duration: 800, padding: 0.1 });
  }, [fitView]);
  
  return { centerCanvas };
};

export default InfiniteCanvas;
