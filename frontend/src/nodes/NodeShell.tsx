import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { surface, border, sp, radius, text, ui } from './nodeTokens';
import NodeGenerateButton from './NodeGenerateButton';
import NodeDownloadButton from './NodeDownloadButton';
import EditableNodeTitle from './EditableNodeTitle';
import type { EditableTitleConfig } from './BaseNode.types';
import { Handle, Position } from '@xyflow/react';
import { getHandleColor } from '../utils/handleTypes';
import { isPanningRef, isDraggingNodeRef, isConnectingRef } from '../interactionRefs';

/**
 * Node wrapper shell with category-aware visual identity.
 */
interface NodeShellProps {
  label: string;
  editableTitle?: EditableTitleConfig;
  dotColor?: string;
  selected: boolean;
  children: ReactNode;
  onDisconnect?: () => void;
  onEdit?: () => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  downloadUrl?: string;
  downloadType?: 'image' | 'video' | 'audio' | 'svg' | string;
  hasError?: boolean;
  data?: {
    folded?: boolean;
    muted?: boolean;
    onUpdate?: (nodeId: string, patch: Record<string, any>) => void;
    nodeId?: string;
    publishedPoints?: string[];
    [key: string]: any;
  };
  folded?: boolean;
  onToggleFold?: () => void;
  capabilities?: string[];
}

export default function NodeShell({
  label,
  editableTitle,
  dotColor,
  selected,
  children,
  onDisconnect,
  onEdit,
  onGenerate,
  isGenerating,
  downloadUrl,
  downloadType = 'image',
  hasError = false,
  data,
  folded: foldedProp,
  onToggleFold,
  capabilities = []
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
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!folded || !hiddenRef.current) return;
    const el = hiddenRef.current;
    const scan = () => {
      const all = el.querySelectorAll('.react-flow__handle');
      const inputs: string[] = [];
      const outputs: string[] = [];
      const seenIds = new Set<string>();
      all.forEach(h => {
        const element = h as HTMLElement;
        const hid = element.dataset.handleid || element.getAttribute('id');
        if (!hid || seenIds.has(hid)) return;
        seenIds.add(hid);
        const isSource = element.classList.contains('react-flow__handle-right') ||
                         element.dataset.handlepos === 'right' ||
                         element.classList.contains('source');
        if (isSource) outputs.push(hid);
        else inputs.push(hid);
      });
      setDiscoveredHandles(prev => {
        if (prev.inputs.length === inputs.length && prev.outputs.length === outputs.length &&
            prev.inputs.every((v, i) => v === inputs[i]) && prev.outputs.every((v, i) => v === outputs[i])) return prev;
        return { inputs, outputs };
      });
    };
    const timer = setTimeout(scan, 50);
    return () => clearTimeout(timer);
  }, [folded, children]);

  const getRectPos = useCallback((index: number, total: number, side: 'left' | 'right') => {
    const padding = 12;
    const availableHeight = RECT_HEIGHT - padding * 2;
    
    if (side === 'left') {
      const spacing = total > 1 ? availableHeight / (total - 1) : 0;
      const topPos = padding + (index * spacing);
      return { left: -HANDLE_DOT / 2, top: topPos - HANDLE_DOT / 2 };
    } else {
      const spacing = total > 1 ? availableHeight / (total - 1) : 0;
      const topPos = padding + (index * spacing);
      return { left: RECT_WIDTH - HANDLE_DOT / 2, top: topPos - HANDLE_DOT / 2 };
    }
  }, []);

  if (folded) {
    return (
      <div style={{ position: 'relative', width: RECT_WIDTH, height: RECT_HEIGHT + 24 }}>
        <div
          onDoubleClick={toggleFold}
          style={{
            width: RECT_WIDTH, height: RECT_HEIGHT, borderRadius: `${CORNER_RADIUS}px`,
            background: `linear-gradient(135deg, ${dotColor || surface.base}, ${surface.base})`,
            border: `2px solid ${selected ? border.active : (dotColor || border.subtle)}`,
            boxShadow: selected
              ? `0 0 0 1px ${border.active}40, 0 0 16px ${border.active}30, 0 4px 12px rgba(0,0,0,0.4)`
              : `0 0 12px ${dotColor || 'rgba(0,0,0,0)'}40, 0 4px 12px rgba(0,0,0,0.3)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s ease', opacity: muted ? 0.35 : 1,
          }}
          title={`${label}${muted ? ' (muted)' : ''} – double-click to unfold`}
        >
          <span style={{
            fontSize: 32, fontWeight: 700, color: dotColor || 'var(--color-text)',
            textShadow: `0 0 8px ${dotColor || 'var(--color-text)'}60`, lineHeight: 1, userSelect: 'none',
          }}>
            {(label || '?').charAt(0).toUpperCase()}
          </span>
          {muted && (
            <span style={{ fontSize: 10, color: 'var(--color-danger)', fontWeight: 600, marginTop: 4, userSelect: 'none' }}>
              MUTED
            </span>
          )}
        </div>

        {discoveredHandles.inputs.map((hid, i) => {
          const pos = getRectPos(i, discoveredHandles.inputs.length, 'left');
          return (
            <Handle key={`vis-in-${hid}`} type="target" position={Position.Left} id={hid}
              style={{
                position: 'absolute', left: pos.left, top: pos.top, width: HANDLE_DOT, height: HANDLE_DOT,
                background: getHandleColor(hid), border: '2px solid var(--color-surface)', borderRadius: '50%',
                cursor: 'crosshair', zIndex: 10, transform: 'none',
              }}
            />
          );
        })}
        {discoveredHandles.outputs.map((hid, i) => {
          const pos = getRectPos(i, discoveredHandles.outputs.length, 'right');
          return (
            <Handle key={`vis-out-${hid}`} type="source" position={Position.Right} id={hid}
              style={{
                position: 'absolute', left: pos.left, top: pos.top, width: HANDLE_DOT, height: HANDLE_DOT,
                background: getHandleColor(hid), border: '2px solid var(--color-surface)', borderRadius: '50%',
                cursor: 'crosshair', zIndex: 10, transform: 'none',
              }}
            />
          );
        })}

        <div style={{
          position: 'absolute', top: RECT_HEIGHT + 4, left: '50%', transform: 'translateX(-50%)',
          fontSize: 11, color: 'var(--color-text-dim)', whiteSpace: 'nowrap', textAlign: 'center',
          pointerEvents: 'none', maxWidth: RECT_WIDTH, overflow: 'hidden', textOverflow: 'ellipsis',
        }} title={label || 'Untitled'}>
          {label || 'Untitled'}
        </div>

        <div ref={hiddenRef} style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-card"
      data-capabilities={capabilities.join(',')}
      style={{
        background: surface.base, backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: `1.5px solid ${muted ? '#ef444480' : (selected ? border.active : border.subtle)}`,
        boxShadow: selected 
          ? `0 0 0 1px ${border.active}40, 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px ${border.active}30` 
          : '0 8px 32px rgba(0, 0, 0, 0.2)',
        borderRadius: radius.lg, minWidth: 240, maxWidth: 400, fontFamily: 'var(--font-body)',
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)', zIndex: selected ? 10 : 1, overflow: 'visible', opacity: muted ? 0.4 : 1,
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        if (selected || isPanningRef.current || isDraggingNodeRef.current || isConnectingRef.current) return;
        e.currentTarget.style.borderColor = muted ? '#ef444480' : border.hover;
        e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        if (selected || isPanningRef.current || isDraggingNodeRef.current || isConnectingRef.current) return;
        e.currentTarget.style.borderColor = muted ? '#ef444480' : border.subtle;
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
      }}
    >
      <AnimatePresence>
        {onGenerate && (isHovered || isGenerating) && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: 12, zIndex: 100 }}
          >
            <div style={{
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', border: `1.5px solid ${border.active}80`, borderRadius: radius.md,
              padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 12px 32px rgba(0,0,0,0.6)', whiteSpace: 'nowrap'
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>RUN NODE</span>
              <NodeGenerateButton onGenerate={onGenerate} isGenerating={isGenerating} size="sm" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {muted && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)', padding: '3px 0', textAlign: 'center',
          fontSize: 9, fontWeight: 700, color: 'var(--color-danger)', letterSpacing: '0.1em',
          textTransform: 'uppercase', borderBottom: '1px solid rgba(239, 68, 68, 0.18)',
          borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit',
        }}>
          Muted – Bypassed
        </div>
      )}

      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `${sp[4]}px ${sp[6]}px`, borderBottom: `1px solid ${hasError ? ui.errorBorder : border.subtle}`,
          background: hasError
            ? `linear-gradient(135deg, ${ui.errorBg}, transparent), linear-gradient(135deg, ${accentAlpha}, transparent)`
            : `linear-gradient(135deg, ${accentAlpha}, transparent)`,
          borderTopLeftRadius: muted ? 0 : 'inherit', borderTopRightRadius: muted ? 0 : 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: sp[3] }}>
          <button onClick={toggleFold} aria-label={folded ? 'Unfold node' : 'Fold node'}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={folded ? 'Unfold node' : 'Fold node'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
          {dotColor && <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0, boxShadow: `0 0 12px ${dotColor}` }} />}
          {editableTitle ? (
            <EditableNodeTitle value={editableTitle.value} onCommit={editableTitle.onCommit} placeholder={editableTitle.placeholder ?? (label || 'Untitled')} disabled={editableTitle.disabled || muted} maxWidth={200} style={{ textDecoration: muted ? 'line-through' : 'none' }} />
          ) : (
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', color: 'var(--color-text)', textShadow: '0 2px 4px rgba(0,0,0,0.3)', textDecoration: muted ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }} title={label || 'Untitled'}>{label || 'Untitled'}</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {downloadUrl && <NodeDownloadButton url={downloadUrl} type={downloadType} size="sm" />}
          {onEdit && (
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} title="Edit Element" aria-label="Edit node"
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: 14, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, transition: 'all 0.1s' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
          )}
          {onDisconnect && (
            <button onClick={(e) => { e.stopPropagation(); onDisconnect(); }} title="Disconnect all connections" aria-label="Disconnect all connections"
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: 14, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, transition: 'all 0.1s' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.84 9.42l-1.42 1.42a4 4 0 1 1-5.66-5.66l1.42-1.42"></path><path d="M5.16 14.58l1.42-1.42a4 4 0 0 1 5.66 5.66l-1.42 1.42"></path><line x1="8" y1="16" x2="16" y2="8"></line></svg>
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: `${sp[5]}px ${sp[6]}px`, color: text.secondary, fontSize: 13, lineHeight: 1.6, position: 'relative' }}>
        {data?.publishedPoints?.map((key, idx) => {
          if (key.startsWith('output')) return null;
          return (
            <div key={`in-${key}`} style={{ position: 'absolute', left: 0, top: 40 + (idx * 24), display: 'flex', alignItems: 'center' }}>
              <Handle type="target" position={Position.Left} id={`published-${key}`} style={{ background: getHandleColor(key), width: 10, height: 10, border: 'none', left: -5 }} />
              <span style={{ fontSize: 9, color: 'var(--color-text-muted)', marginLeft: 8, whiteSpace: 'nowrap', opacity: 0.8 }}>{key}</span>
            </div>
          );
        })}
        {data?.publishedPoints?.map((key, idx) => {
          if (!key.startsWith('output')) return null;
          return (
            <div key={`out-${key}`} style={{ position: 'absolute', right: 0, top: 40 + (idx * 24), display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 9, color: 'var(--color-text-muted)', marginRight: 8, whiteSpace: 'nowrap', opacity: 0.8 }}>{key}</span>
              <Handle type="source" position={Position.Right} id={`published-${key}`} style={{ background: getHandleColor(key), width: 10, height: 10, border: 'none', right: -5 }} />
            </div>
          );
        })}
        {children}
      </div>
    </div>
  );
}
