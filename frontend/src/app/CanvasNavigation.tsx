import React, { type CSSProperties, type FC, useState, useRef, useEffect } from 'react';
import { MiniMap, Panel, useViewport, useReactFlow } from '@xyflow/react';
import { Icon } from 'blue-ether';

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
      position="top-right"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
        marginTop: '60px',
        marginRight: '20px',
        zIndex: 10
      }}
    >
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
        <div style={{ display: 'flex', padding: '4px', gap: '4px', justifyContent: 'center', background: '#222', borderBottom: '1px solid #333' }}>
          <button type="button" onClick={() => zoomOut()} style={buttonStyle} title="Zoom Out" onMouseEnter={e => e.currentTarget.style.background = '#333'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Icon name="minus" size={16} crt />
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
              <Icon name="chevron-down" size={10} crt style={{ opacity: 0.7 }} />
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
                      <Icon name="check" size={12} crt style={{ color: '#3b82f6' }} />
                    )}
                    </button>                ))}
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
            <Icon name="plus" size={16} crt />
          </button>        </div>

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
      </div>
    </Panel>
  );
};
