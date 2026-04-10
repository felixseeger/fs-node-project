/**
 * Dynamic Node Loader Component
 * Wraps lazy-loaded nodes with Suspense and ErrorBoundary
 * This keeps JSX out of the utility files to prevent build issues
 */

import React, { Suspense, FC, LazyExoticComponent, ReactNode } from 'react';
import NodeLoadingSkeleton, { NodeErrorBoundary } from './NodeLoadingSkeleton';

interface DynamicNodeLoaderProps {
  LazyComponent: LazyExoticComponent<any>;
  componentProps?: any;
}

/**
 * DynamicNodeLoader Component
 */
const DynamicNodeLoader: FC<DynamicNodeLoaderProps> = ({ LazyComponent, componentProps }) => {
  return (
    <NodeErrorBoundary>
      <Suspense fallback={<NodeLoadingSkeleton />}>
        <LazyComponent {...componentProps} />
      </Suspense>
    </NodeErrorBoundary>
  );
};

export default DynamicNodeLoader;
