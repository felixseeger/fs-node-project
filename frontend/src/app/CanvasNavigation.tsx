import React, { type CSSProperties, type FC } from 'react';
import { MiniMap, Panel, useViewport, useReactFlow } from '@xyflow/react';

export interface CanvasNavigationProps {
  onCenterOnNode: () => void;
}

export const CanvasNavigation: FC<CanvasNavigationProps> = ({ onCenterOnNode }) => {
  const { zoom } = useViewport();
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const buttonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    background: 'transparent',
    border: 'none',
    color: '#e0e0e0',
    cursor: 'pointer',
    borderRadius: '4px',
  };

  return (
    <Panel
      position="top-right"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
        marginTop: '10px',
        marginRight: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: '#2a2a2a',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '4px',
        }}
      >
        <button type="button" onClick={() => zoomOut()} style={buttonStyle} title="Zoom Out">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <div
          style={{
            minWidth: '48px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#e0e0e0',
            fontFamily: 'monospace',
            userSelect: 'none',
          }}
        >
          {Math.round(zoom * 100)}%
        </div>

        <button type="button" onClick={() => zoomIn()} style={buttonStyle} title="Zoom In">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <div style={{ width: '1px', height: '16px', background: '#4a4a4a', margin: '0 4px' }} />

        <button type="button" onClick={() => fitView({ duration: 800 })} style={buttonStyle} title="Fit View">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3-3 3M2 12h20M12 2v20" />
          </svg>
        </button>

        <div style={{ width: '1px', height: '16px', background: '#4a4a4a', margin: '0 4px' }} />

        <button type="button" onClick={onCenterOnNode} style={buttonStyle} title="Center on Selected Node">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M20 12h-4" />
            <path d="M4 12h4" />
          </svg>
        </button>
      </div>

      <div
        style={{
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          style={{ position: 'relative', margin: 0, width: 200, height: 150, backgroundColor: '#1a1a1a' }}
          maskColor="rgba(0, 0, 0, 0.7)"
          nodeColor={(node) => {
            if (node.type === 'generator') return '#f97316';
            if (node.type === 'imageAnalyzer') return '#0ea5e9';
            if (node.type === 'response') return '#8b5cf6';
            return '#3b82f6';
          }}
        />
      </div>
    </Panel>
  );
};
