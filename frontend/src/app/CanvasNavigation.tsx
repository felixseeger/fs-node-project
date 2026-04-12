import React, { type CSSProperties, type FC, useState, useRef, useEffect } from 'react';
import { MiniMap, Panel, useViewport, useReactFlow } from '@xyflow/react';

export interface CanvasNavigationProps {
  onCenterOnNode: () => void;
  onScreenshot?: () => void;
  onExportJSON?: () => void;
  onImportJSON?: () => void;
}

const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

export const CanvasNavigation: FC<CanvasNavigationProps> = ({ 
  onCenterOnNode,
  onScreenshot,
  onExportJSON,
  onImportJSON
}) => {
  const { zoom } = useViewport();
  const { zoomIn, zoomOut, fitView, zoomTo } = useReactFlow();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

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
    transition: 'background 0.2s',
  };

  return (
    <Panel
      position="bottom-right"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
        marginBottom: '40px',
        marginRight: '20px',
        zIndex: 10
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
        <button type="button" onClick={() => zoomOut()} style={buttonStyle} title="Zoom Out" onMouseEnter={e => e.currentTarget.style.background = '#333'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setDropdownOpen(o => !o)}
            style={{
              minWidth: '56px',
              textAlign: 'center',
              fontSize: '12px',
              color: '#e0e0e0',
              fontFamily: 'monospace',
              background: dropdownOpen ? '#333' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => !dropdownOpen && (e.currentTarget.style.background = '#333')}
            onMouseLeave={e => !dropdownOpen && (e.currentTarget.style.background = 'transparent')}
            title="Select Zoom Level"
          >
            <span>{Math.round(zoom * 100)}%</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '8px',
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '6px',
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                minWidth: '80px',
              }}
            >
              {ZOOM_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    zoomTo(preset, { duration: 400 });
                    setDropdownOpen(false);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#2a2a2a'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#e0e0e0',
                    padding: '6px 12px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{preset * 100}%</span>
                  {Math.abs(zoom - preset) < 0.05 && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
              <div style={{ height: '1px', background: '#333', margin: '2px 0' }} />
              <button
                type="button"
                onClick={() => {
                  fitView({ duration: 800 });
                  setDropdownOpen(false);
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#2a2a2a'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#e0e0e0',
                  padding: '6px 12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              >
                Fit View
              </button>
            </div>
          )}
        </div>

        <button type="button" onClick={() => zoomIn()} style={buttonStyle} title="Zoom In" onMouseEnter={e => e.currentTarget.style.background = '#333'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <div style={{ width: '1px', height: '16px', background: '#4a4a4a', margin: '0 4px' }} />

        <button type="button" onClick={() => fitView({ duration: 800 })} style={buttonStyle} title="Fit View" onMouseEnter={e => e.currentTarget.style.background = '#333'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3-3 3M2 12h20M12 2v20" />
          </svg>
        </button>

        <div style={{ width: '1px', height: '16px', background: '#4a4a4a', margin: '0 4px' }} />

        <button type="button" onClick={onCenterOnNode} style={buttonStyle} title="Center on Selected Node" onMouseEnter={e => e.currentTarget.style.background = '#333'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
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
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        <div style={{ position: 'relative', width: 200, height: 150 }}>
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, margin: 0, width: '100%', height: '100%', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}
            maskColor="rgba(0, 0, 0, 0.7)"
            nodeColor={(node) => {
              if (node.type === 'generator') return '#f97316';
              if (node.type === 'imageAnalyzer') return '#0ea5e9';
              if (node.type === 'response') return '#8b5cf6';
              return '#3b82f6';
            }}
          />
        </div>
        
        <div style={{ display: 'flex', padding: '4px', gap: '4px', justifyContent: 'flex-end', background: '#222' }}>
          {onScreenshot && (
            <button type="button" onClick={onScreenshot} style={buttonStyle} title="Take Screenshot (Cmd/Ctrl+Shift+S)" onMouseEnter={e => e.currentTarget.style.background = '#333'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M5 3V1.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M11 3V1.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          )}
          {onImportJSON && (
            <button type="button" onClick={onImportJSON} style={buttonStyle} title="Import JSON" onMouseEnter={e => e.currentTarget.style.background = '#333'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2V11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M4.5 7.5L8 11L11.5 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 14H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          )}
          {onExportJSON && (
            <button type="button" onClick={onExportJSON} style={buttonStyle} title="Export JSON" onMouseEnter={e => e.currentTarget.style.background = '#333'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 11V2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M4.5 5.5L8 2L11.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 14H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </Panel>
  );
};
