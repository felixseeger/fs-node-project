import React from 'react';

export default function Queue({ nodes }) {
  // Find all nodes that are currently loading
  const loadingNodes = nodes.filter(n => n.data?.isLoading);

  if (loadingNodes.length === 0) return null;

  return (
    <div style={{
      width: 250,
      background: 'rgba(20, 20, 20, 0.85)',
      backdropFilter: 'blur(10px)',
      border: '1px solid #333',
      borderRadius: 12,
      padding: 12,
      zIndex: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none' // Don't block clicks to canvas
    }}>
      <div style={{
        fontSize: 12,
        fontWeight: 600,
        color: '#aaa',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4
      }}>
        <span>Active Tasks</span>
        <span style={{
          background: '#3b82f6',
          color: '#fff',
          padding: '2px 6px',
          borderRadius: 10,
          fontSize: 10
        }}>{loadingNodes.length}</span>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        maxHeight: 200,
        overflowY: 'auto'
      }}>
        {loadingNodes.map(node => (
          <div key={node.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.05)',
            padding: '6px 10px',
            borderRadius: 6,
          }}>
            <div style={{
              width: 12, height: 12,
              border: '2px solid rgba(255,255,255,0.1)',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              flexShrink: 0
            }} />
            <div style={{
              fontSize: 12,
              color: '#fff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {node.data?.label || node.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

