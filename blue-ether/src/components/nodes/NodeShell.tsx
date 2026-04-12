import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Handle, Position } from '@xyflow/react';
import { getHandleColor } from '../../utils/handleTypes';
import { EditableNodeTitle } from './EditableNodeTitle';
import type { EditableTitleConfig } from './BaseNode.types';
import { NodeProgressBadge } from './NodeProgress';

export interface NodeShellProps {
  label: string;
  editableTitle?: EditableTitleConfig;
  dotColor?: string;
  selected: boolean;
  children: ReactNode;
  onDisconnect?: () => void;
  onEdit?: () => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  hasError?: boolean;
  data?: {
    folded?: boolean;
    muted?: boolean;
    onUpdate?: (nodeId: string, patch: Record<string, any>) => void;
    nodeId?: string;
    publishedPoints?: string[];
  };
  folded?: boolean;
  onToggleFold?: () => void;
}

export function NodeShell({
  label,
  editableTitle,
  dotColor,
  selected,
  children,
  onDisconnect,
  onEdit,
  onGenerate,
  isGenerating,
  hasError = false,
  data,
  folded: foldedProp,
  onToggleFold
}: NodeShellProps) {
  const folded = foldedProp ?? data?.folded ?? false;
  const muted = data?.muted ?? false;
  const accentAlpha = dotColor ? `${dotColor}14` : 'transparent';

  const toggleFold = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFold) {
      onToggleFold();
    } else if (data?.onUpdate && data?.nodeId) {
      data.onUpdate(data.nodeId, { folded: !folded });
    }
  };

  const RECT_WIDTH = 160;
  const RECT_HEIGHT = 120;
  const HANDLE_DOT = 10;
  const CORNER_RADIUS = 16;
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [discoveredHandles, setDiscoveredHandles] = useState({ inputs: [] as string[], outputs: [] as string[] });

  useEffect(() => {
    if (!folded || !hiddenRef.current) return;
    const el = hiddenRef.current;
    
    // Defer handle discovery to let React Flow render them first
    const timer = setTimeout(() => {
      const all = el.querySelectorAll('.react-flow__handle');
      const inputs: string[] = [];
      const outputs: string[] = [];
      const seenIds = new Set<string>();
      
      all.forEach(h => {
        const element = h as HTMLElement;
        const id = element.dataset.handleid || element.getAttribute('data-handleid');
        if (!id || seenIds.has(id)) return;
        seenIds.add(id);
        
        if (element.classList.contains('target')) {
          inputs.push(id);
        } else if (element.classList.contains('source')) {
          outputs.push(id);
        }
      });
      
      setDiscoveredHandles({ inputs, outputs });
    }, 50);
    
    return () => clearTimeout(timer);
  }, [folded, children]);

  if (folded) {
    const totalInputs = discoveredHandles.inputs.length;
    const totalOutputs = discoveredHandles.outputs.length;
    
    return (
      <div 
        className="node-shell-folded"
        style={{
          width: RECT_WIDTH,
          height: RECT_HEIGHT,
          background: 'var(--be-surface-canvas)',
          border: `1px solid ${selected ? (dotColor || 'var(--be-border-active)') : 'var(--be-border-default)'}`,
          borderRadius: CORNER_RADIUS,
          boxShadow: selected ? `0 0 0 1px ${dotColor || 'var(--be-border-active)'}` : '0 12px 40px rgba(0,0,0,0.4)',
          position: 'relative',
          opacity: muted ? 0.4 : 1,
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onDoubleClick={toggleFold}
      >
        <div style={{ display: 'none' }} ref={hiddenRef}>
          {children}
        </div>

        {/* Inputs distributed along left edge */}
        {discoveredHandles.inputs.map((id, i) => {
          const color = getHandleColor(id);
          const y = totalInputs === 1 ? RECT_HEIGHT / 2 : 20 + (i * (RECT_HEIGHT - 40) / Math.max(1, totalInputs - 1));
          return (
            <Handle
              key={`in-${id}`}
              type="target"
              position={Position.Left}
              id={id}
              style={{
                background: color,
                width: HANDLE_DOT, height: HANDLE_DOT, border: 'none',
                position: 'absolute', left: -HANDLE_DOT/2, top: y, transform: 'translateY(-50%)'
              }}
            />
          );
        })}

        {/* Outputs distributed along right edge */}
        {discoveredHandles.outputs.map((id, i) => {
          const color = getHandleColor(id);
          const y = totalOutputs === 1 ? RECT_HEIGHT / 2 : 20 + (i * (RECT_HEIGHT - 40) / Math.max(1, totalOutputs - 1));
          return (
            <Handle
              key={`out-${id}`}
              type="source"
              position={Position.Right}
              id={id}
              style={{
                background: color,
                width: HANDLE_DOT, height: HANDLE_DOT, border: 'none',
                position: 'absolute', right: -HANDLE_DOT/2, top: y, transform: 'translateY(-50%)'
              }}
            />
          );
        })}

        {/* Folded Center Content */}
        <div style={{
          width: 48, height: 48, borderRadius: 24,
          background: accentAlpha, border: `1px solid ${dotColor}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 12
        }}>
          {isGenerating ? (
            <div style={{
              width: 24, height: 24,
              border: `2px solid ${dotColor}40`, borderTopColor: dotColor,
              borderRadius: '50%', animation: 'spin 1s linear infinite'
            }} />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={dotColor || "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          )}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--be-text-primary)', textAlign: 'center', padding: '0 12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
          {editableTitle ? editableTitle.value || 'Untitled' : label}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--be-surface-base)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 16,
        padding: '16px 20px',
        border: `1px solid ${hasError ? 'var(--be-ui-error)' : selected ? (dotColor || 'var(--be-border-active)') : 'var(--be-border-default)'}`,
        boxShadow: hasError ? '0 0 0 1px var(--be-ui-error), 0 12px 40px rgba(0,0,0,0.4)' : selected ? `0 0 0 1px ${dotColor || 'var(--be-border-active)'}, 0 12px 40px rgba(0,0,0,0.4)` : '0 12px 40px rgba(0,0,0,0.4)',
        borderLeft: dotColor ? `4px solid ${dotColor}` : undefined,
        position: 'relative',
        opacity: muted ? 0.4 : 1,
        transition: 'opacity 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      className="node-shell"
    >
      {/* Header */}
      <div
        className="custom-drag-handle"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16, cursor: 'grab', paddingBottom: 12,
          borderBottom: `1px solid var(--be-border-subtle)`,
        }}
        onDoubleClick={toggleFold}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {dotColor && (
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: dotColor,
              boxShadow: `0 0 8px ${dotColor}`, flexShrink: 0
            }} />
          )}
          {editableTitle ? (
            <EditableNodeTitle {...editableTitle} />
          ) : (
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--be-text-primary)', letterSpacing: '0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              {label}
            </span>
          )}
          {hasError && <span style={{ fontSize: 10, color: 'var(--be-ui-error)', marginLeft: 8, fontWeight: 600 }}>ERROR</span>}
          {isGenerating && <NodeProgressBadge status="running" />}
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          {onGenerate && (
            <button 
              className="nodrag nopan" 
              onClick={(e) => { e.stopPropagation(); onGenerate(); }}
              disabled={isGenerating}
              style={{
                background: 'transparent', border: 'none', cursor: isGenerating ? 'not-allowed' : 'pointer',
                color: isGenerating ? 'var(--be-text-muted)' : 'var(--be-color-accent)', padding: 4, display: 'flex', alignItems: 'center', opacity: isGenerating ? 0.5 : 1
              }}
              title="Generate"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
          )}
          <button 
            className="nodrag nopan" 
            onClick={toggleFold}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--be-text-muted)', padding: 4, display: 'flex', alignItems: 'center'
            }}
            title="Fold Node"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 14 12 6 20 14"></polyline>
            </svg>
          </button>
          {onEdit && (
            <button 
              className="nodrag nopan" 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--be-text-muted)', padding: 4, display: 'flex', alignItems: 'center'
              }}
              title="Edit Properties"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          )}
          {onDisconnect && (
            <button 
              className="nodrag nopan" 
              onClick={(e) => { e.stopPropagation(); onDisconnect(); }}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--be-text-muted)', padding: 4, display: 'flex', alignItems: 'center'
              }}
              title="Disconnect All Handles"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
