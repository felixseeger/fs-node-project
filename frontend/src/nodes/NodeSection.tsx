import { Position, Handle } from '@xyflow/react';
import { ui, sp, radius, font } from './nodeTokens';

/**
 * Section header with an attached ReactFlow handle.
 * Replaces the duplicated sectionHeader() helper across all nodes.
 */
interface SectionHeaderProps {
  label: string;
  handleId: string;
  handleType: 'target' | 'source';
  color: string;
  extra?: React.ReactNode;
}

export function SectionHeader({ label, handleId, handleType, color, extra }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: sp[2], marginTop: sp[4],
      }}
      role="group"
      aria-label={label}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: sp[2] }}>
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
        <span style={font.label}>{label}</span>
      </div>
      {extra && <div style={{ display: 'flex', alignItems: 'center', gap: sp[1] }}>{extra}</div>}
    </div>
  );
}

/**
 * "linked" + "unlink" badge pair shown when a handle is connected.
 */
interface LinkedBadgesProps {
  nodeId: string;
  handleId: string;
  onUnlink?: (nodeId: string, handleId: string) => void;
}

export function LinkedBadges({ nodeId, handleId, onUnlink }: LinkedBadgesProps) {
  return (
    <>
      <span
        style={{
          fontSize: 9, color: ui.link,
          padding: '2px 6px', background: ui.linkBg, borderRadius: radius.sm,
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
          fontSize: 9, color: ui.error,
          padding: '2px 6px', background: ui.errorBg,
          borderRadius: radius.sm, border: `1px solid ${ui.errorBorder}`,
          cursor: 'pointer',
        }}
      >
        unlink
      </button>
    </>
  );
}

/**
 * Blue info box showing which node is linked.
 */
interface ConnectionInfoProps {
  connInfo?: {
    nodeLabel: string;
    handle: string;
  };
}

export function ConnectionInfo({ connInfo }: ConnectionInfoProps) {
  return (
    <div
      style={{
        background: ui.linkBg,
        border: `1px solid ${ui.linkBorder}`,
        borderRadius: radius.md,
        padding: `${sp[2]}px ${sp[4]}px`,
        marginBottom: sp[1],
        display: 'flex', alignItems: 'center', gap: sp[2],
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: ui.link, flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: ui.linkText }}>
        {connInfo ? `Linked from ${connInfo.nodeLabel} → ${connInfo.handle}` : 'Linked from upstream node'}
      </span>
    </div>
  );
}

/**
 * Convenience wrapper: renders either ConnectionInfo (when connected)
 * or children (the local input fallback).
 */
interface ConnectedOrLocalProps {
  connected: boolean;
  connInfo?: {
    nodeLabel: string;
    handle: string;
  };
  children: React.ReactNode;
}

export function ConnectedOrLocal({ connected, connInfo, children }: ConnectedOrLocalProps) {
  return connected ? <ConnectionInfo connInfo={connInfo} /> : <>{children}</>;
}
