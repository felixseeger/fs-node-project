/**
 * Dynamic Node Loader Component
 * Wraps lazy-loaded nodes with Suspense and ErrorBoundary
 * This keeps JSX out of the utility files to prevent build issues
 */

import React, { Suspense, FC, LazyExoticComponent, useMemo } from 'react';
import NodeLoadingSkeleton, { NodeErrorBoundary } from './NodeLoadingSkeleton';
import { useCanvas } from '../context/CanvasContext';

interface DynamicNodeLoaderProps {
  LazyComponent: LazyExoticComponent<any>;
  componentProps?: any;
}

/**
 * DynamicNodeLoader Component
 */
const DynamicNodeLoader: FC<DynamicNodeLoaderProps> = ({ LazyComponent, componentProps }) => {
  let canvasContext: any;
  try {
    canvasContext = useCanvas();
  } catch (e) {
    canvasContext = null;
  }

  const enrichedProps = useMemo(() => {
    if (!canvasContext || !componentProps) return componentProps;
    
    return {
      ...componentProps,
      data: {
        ...componentProps.data,
        onUpdate: canvasContext.updateNodeData,
        resolveInput: canvasContext.resolveInput,
        hasConnection: canvasContext.hasConnection,
        getConnectionInfo: canvasContext.getConnectionInfo,
        onAnalyzeComplete: canvasContext.onAnalyzeComplete,
        onUnlink: canvasContext.onUnlink,
        onDisconnectNode: canvasContext.onDisconnectNode,
        onCreateNode: (type: string, dataPatch: any, sh: string, th: string) => 
          canvasContext.onCreateNode(type, dataPatch, sh, th, componentProps.id),
        nodeId: componentProps.id,
      }
    };
  }, [componentProps, canvasContext]);

  return (
    <NodeErrorBoundary>
      <Suspense fallback={<NodeLoadingSkeleton />}>
        <LazyComponent {...enrichedProps} />
      </Suspense>
    </NodeErrorBoundary>
  );
};

export default DynamicNodeLoader;
