import React, { type FC, type ReactNode, Component, type ErrorInfo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { surface, border, radius, ui } from '../nodes/nodeTokens';

interface NodeLoadingSkeletonProps {
  width?: number;
  height?: number;
}

/**
 * Loading skeleton for node components during async loading
 * Shows a placeholder with pulsing animation while node is loading
 * Includes common handles to prevent React Flow "Couldn't create edge" errors
 */
const NodeLoadingSkeleton: FC<NodeLoadingSkeletonProps> = ({ width = 240, height = 120 }) => {
  return (
    <div 
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: surface.sunken,
        border: `1px solid ${border.default}`,
        borderRadius: `${radius.md}px`,
        position: 'relative',
        overflow: 'hidden',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading node component"
    >
      {/* Target Handles (Left) - Multiple handles to match common IDs */}
      <Handle type="target" position={Position.Left} id="prompt-in" style={{ top: '20%', opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="image-in" style={{ top: '40%', opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="video-in" style={{ top: '60%', opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="text-in" style={{ top: '80%', opacity: 0 }} />
      
      {/* Source Handles (Right) - Multiple handles to match common IDs */}
      <Handle type="source" position={Position.Right} id="output" style={{ top: '20%', opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="prompt-out" style={{ top: '40%', opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="text-out" style={{ top: '60%', opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="output-video" style={{ top: '80%', opacity: 0 }} />

      {/* Visual handle indicators (non-functional) */}
      <div 
        style={{
          position: 'absolute',
          left: '-5px',
          top: '20px',
          width: '10px',
          height: '10px',
          background: '#444',
          borderRadius: '50%',
          border: '2px solid #2a2a2a',
        }}
      />
      
      <div 
        style={{
          position: 'absolute',
          right: '-5px',
          top: '20px',
          width: '10px',
          height: '10px',
          background: '#444',
          borderRadius: '50%',
          border: '2px solid #2a2a2a',
        }}
      />
      
      {/* Content placeholder */}
      <div 
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          height: '12px',
          background: '#333',
          borderRadius: '4px',
          marginBottom: '8px',
        }}
      />
      
      <div 
        style={{
          position: 'absolute',
          top: '30px',
          left: '10px',
          right: '10px',
          height: '8px',
          background: '#333',
          borderRadius: '4px',
          width: '80%',
        }}
      />
      
      <div 
        style={{
          position: 'absolute',
          top: '50px',
          left: '10px',
          right: '10px',
          height: '8px',
          background: '#333',
          borderRadius: '4px',
          width: '60%',
        }}
      />
      
      {/* Loading spinner */}
      <div 
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '16px',
          height: '16px',
          border: '2px solid #444',
          borderTopColor: '#666',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
    </div>
  );
};

interface NodeErrorBoundaryProps {
  children: ReactNode;
}

interface NodeErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for node components
 * Shows fallback UI when node fails to load
 */
export class NodeErrorBoundary extends Component<NodeErrorBoundaryProps, NodeErrorBoundaryState> {
  constructor(props: NodeErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): NodeErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Node loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          style={{
            width: '240px',
            height: '120px',
            background: surface.sunken,
            border: `1px solid ${ui.errorBorder || '#ff4444'}`,
            borderRadius: `${radius.md}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ff4444',
            fontSize: '12px',
            textAlign: 'center',
            padding: '8px',
            boxSizing: 'border-box',
          }}
          role="alert"
          aria-live="assertive"
        >
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Node Load Error</div>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>
            {this.state.error?.message || 'Failed to load node component'}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: '8px',
              padding: '4px 8px',
              background: surface.base,
              border: `1px solid ${border.default}`,
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default NodeLoadingSkeleton;
