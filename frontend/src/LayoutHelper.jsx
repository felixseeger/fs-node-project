import React from 'react';

/* eslint-disable react-refresh/only-export-components */

// Alignment Icons
const AlignLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="15" y2="12"></line>
    <line x1="3" y1="18" x2="18" y2="18"></line>
    <line x1="3" y1="3" x2="3" y2="21" strokeWidth="1.5"></line>
  </svg>
);

const AlignCenterHIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="6" y1="12" x2="18" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
    <line x1="12" y1="3" x2="12" y2="21" strokeWidth="1.5"></line>
  </svg>
);

const AlignRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="9" y1="12" x2="21" y2="12"></line>
    <line x1="6" y1="18" x2="21" y2="18"></line>
    <line x1="21" y1="3" x2="21" y2="21" strokeWidth="1.5"></line>
  </svg>
);

const AlignTopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="21"></line>
    <line x1="12" y1="3" x2="12" y2="15"></line>
    <line x1="18" y1="3" x2="18" y2="18"></line>
    <line x1="3" y1="3" x2="21" y2="3" strokeWidth="1.5"></line>
  </svg>
);

const AlignCenterVIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="21"></line>
    <line x1="12" y1="6" x2="12" y2="18"></line>
    <line x1="18" y1="3" x2="18" y2="21"></line>
    <line x1="3" y1="12" x2="21" y2="12" strokeWidth="1.5"></line>
  </svg>
);

const AlignBottomIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="21"></line>
    <line x1="12" y1="9" x2="12" y2="21"></line>
    <line x1="18" y1="6" x2="18" y2="21"></line>
    <line x1="3" y1="21" x2="21" y2="21" strokeWidth="1.5"></line>
  </svg>
);

const DistributeHIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="3" x2="3" y2="21" strokeWidth="1.5"></line>
    <line x1="21" y1="3" x2="21" y2="21" strokeWidth="1.5"></line>
    <rect x="7" y="6" width="4" height="12" rx="1"></rect>
    <rect x="13" y="6" width="4" height="12" rx="1"></rect>
  </svg>
);

const DistributeVIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="3" x2="21" y2="3" strokeWidth="1.5"></line>
    <line x1="3" y1="21" x2="21" y2="21" strokeWidth="1.5"></line>
    <rect x="6" y="7" width="12" height="4" rx="1"></rect>
    <rect x="6" y="13" width="12" height="4" rx="1"></rect>
  </svg>
);

const ALIGNMENT_ACTIONS = [
  { id: 'align_left', icon: AlignLeftIcon, label: 'Align Left', divider: false },
  { id: 'align_center_h', icon: AlignCenterHIcon, label: 'Align Center H', divider: false },
  { id: 'align_right', icon: AlignRightIcon, label: 'Align Right', divider: true },
  { id: 'align_top', icon: AlignTopIcon, label: 'Align Top', divider: false },
  { id: 'align_center_v', icon: AlignCenterVIcon, label: 'Align Center V', divider: false },
  { id: 'align_bottom', icon: AlignBottomIcon, label: 'Align Bottom', divider: true },
  { id: 'distribute_h', icon: DistributeHIcon, label: 'Distribute Horizontally', divider: false },
  { id: 'distribute_v', icon: DistributeVIcon, label: 'Distribute Vertically', divider: false },
];

export default function LayoutHelper({ selectedNodes, onAlign, isVisible }) {
  if (!isVisible || !selectedNodes || selectedNodes.length < 2) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1e1e1e',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: '6px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        zIndex: 100,
      }}
      onContextMenu={(e) => e.stopPropagation()}
    >
      {ALIGNMENT_ACTIONS.map((action, index) => (
        <React.Fragment key={action.id}>
          <button
            onClick={() => onAlign(action.id, selectedNodes)}
            title={action.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              background: 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: '#a0a0a0',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#a0a0a0';
            }}
          >
            <action.icon />
          </button>
          {action.divider && index < ALIGNMENT_ACTIONS.length - 1 && (
            <div
              style={{
                width: '1px',
                height: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                margin: '0 4px',
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Alignment helper functions
export const alignmentFunctions = {
  align_left: (nodes) => {
    const minX = Math.min(...nodes.map(n => n.position.x));
    return nodes.map(n => ({ ...n, position: { ...n.position, x: minX } }));
  },

  align_center_h: (nodes) => {
    const sumX = nodes.reduce((acc, n) => acc + n.position.x + (n.width || 200) / 2, 0);
    const avgX = sumX / nodes.length;
    return nodes.map(n => ({
      ...n,
      position: { ...n.position, x: avgX - (n.width || 200) / 2 }
    }));
  },

  align_right: (nodes) => {
    const maxX = Math.max(...nodes.map(n => n.position.x + (n.width || 200)));
    return nodes.map(n => ({
      ...n,
      position: { ...n.position, x: maxX - (n.width || 200) }
    }));
  },

  align_top: (nodes) => {
    const minY = Math.min(...nodes.map(n => n.position.y));
    return nodes.map(n => ({ ...n, position: { ...n.position, y: minY } }));
  },

  align_center_v: (nodes) => {
    const sumY = nodes.reduce((acc, n) => acc + n.position.y + (n.height || 100) / 2, 0);
    const avgY = sumY / nodes.length;
    return nodes.map(n => ({
      ...n,
      position: { ...n.position, y: avgY - (n.height || 100) / 2 }
    }));
  },

  align_bottom: (nodes) => {
    const maxY = Math.max(...nodes.map(n => n.position.y + (n.height || 100)));
    return nodes.map(n => ({
      ...n,
      position: { ...n.position, y: maxY - (n.height || 100) }
    }));
  },

  distribute_h: (nodes) => {
    const sorted = [...nodes].sort((a, b) => a.position.x - b.position.x);
    const minX = sorted[0].position.x;
    const maxX = sorted[sorted.length - 1].position.x + (sorted[sorted.length - 1].width || 200);
    const totalWidth = maxX - minX;
    const spacing = totalWidth / (sorted.length - 1);

    return sorted.map((n, i) => ({
      ...n,
      position: { ...n.position, x: minX + spacing * i - (n.width || 200) / 2 }
    }));
  },

  distribute_v: (nodes) => {
    const sorted = [...nodes].sort((a, b) => a.position.y - b.position.y);
    const minY = sorted[0].position.y;
    const maxY = sorted[sorted.length - 1].position.y + (sorted[sorted.length - 1].height || 100);
    const totalHeight = maxY - minY;
    const spacing = totalHeight / (sorted.length - 1);

    return sorted.map((n, i) => ({
      ...n,
      position: { ...n.position, y: minY + spacing * i - (n.height || 100) / 2 }
    }));
  },
};
