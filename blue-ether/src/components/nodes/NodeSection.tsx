import { Position, Handle } from '@xyflow/react';

export interface SectionHeaderProps {
  label: string;
  handleId: string;
  handleType: 'target' | 'source';
  color: string;
  extra?: React.ReactNode;
  isConnected?: boolean;
  onUnlink?: () => void;
  onAdd?: () => void;
}

export function SectionHeader({ label, handleId, handleType, color, extra, isConnected, onUnlink, onAdd }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 'var(--be-space-sm)', marginTop: 'var(--be-space-md)',
      }}
      role="group"
      aria-label={label}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--be-space-sm)' }}>
        <Handle
          type={handleType}
          position={handleType === 'target' ? Position.Left : Position.Right}
          id={handleId}
          style={{
            width: 10, height: 10, borderRadius: '50%', background: color, border: 'none',
            position: 'relative',
            left: handleType === 'target' ? -12 : 'auto',
            right: handleType === 'source' ? -12 : 'auto',
            transform: 'none',
          }}
        />
        <span style={{ fontSize: 'var(--be-font-size-sm)', fontWeight: 600, color: 'var(--be-text-primary)' }}>{label}</span>
        {isConnected && onUnlink && (
          <button 
            onClick={(e) => { e.stopPropagation(); onUnlink(); }}
            className="nodrag nopan"
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              fontSize: 10, color: 'var(--be-ui-error)', marginLeft: 4, display: 'flex', alignItems: 'center'
            }}
            title="Unlink"
          >
            ✕
          </button>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--be-space-xs)' }}>
        {onAdd && (
          <button 
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            className="nodrag nopan"
            style={{
              background: 'var(--be-ui-linkBg)', border: `1px solid var(--be-ui-linkBorder)`, 
              borderRadius: 'var(--be-radius-sm)', color: 'var(--be-ui-linkText)', fontSize: 9, 
              padding: '1px 4px', cursor: 'pointer'
            }}
          >
            + Add
          </button>
        )}
        {extra}
      </div>
    </div>
  );
}

export interface LinkedBadgesProps {
  nodeId: string;
  handleId: string;
  onUnlink?: (nodeId: string, handleId: string) => void;
}

export function LinkedBadges({ nodeId, handleId, onUnlink }: LinkedBadgesProps) {
  return (
    <>
      <span
        style={{
          fontSize: 9, color: 'var(--be-ui-link)',
          padding: '2px 6px', background: 'var(--be-ui-linkBg)', borderRadius: 'var(--be-radius-sm)',
        }}
      >
        linked
      </span>
      <button
        onClick={() => onUnlink?.(nodeId, handleId)}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={`Unlink ${handleId}`}
        className="nodrag nopan"
        style={{
          fontSize: 9, color: 'var(--be-ui-error)',
          padding: '2px 6px', background: 'var(--be-ui-errorBg)',
          borderRadius: 'var(--be-radius-sm)', border: `1px solid var(--be-ui-errorBorder)`,
          cursor: 'pointer',
        }}
      >
        unlink
      </button>
    </>
  );
}

export interface ConnectionBadgeProps {
  connInfo?: {
    nodeLabel: string;
    handle: string;
  };
}

export function ConnectionBadge({ connInfo }: ConnectionBadgeProps) {
  return (
    <div
      style={{
        background: 'var(--be-ui-linkBg)',
        border: `1px solid var(--be-ui-linkBorder)`,
        borderRadius: 'var(--be-radius-md)',
        padding: `var(--be-space-sm) var(--be-space-md)`,
        marginBottom: 'var(--be-space-xs)',
        display: 'flex', alignItems: 'center', gap: 'var(--be-space-sm)',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--be-ui-link)', flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: 'var(--be-ui-linkText)' }}>
        {connInfo ? `Linked from ${connInfo.nodeLabel} → ${connInfo.handle}` : 'Linked from upstream node'}
      </span>
    </div>
  );
}

export interface ConnectedOrLocalProps {
  connected: boolean;
  connInfo?: {
    nodeLabel: string;
    handle: string;
  };
  children: React.ReactNode;
}

export function ConnectedOrLocal({ connected, connInfo, children }: ConnectedOrLocalProps) {
  return connected ? <ConnectionBadge connInfo={connInfo} /> : <>{children}</>;
}
