import React from 'react';
import { useStore, useReactFlow } from '@xyflow/react';
import { surface, border, text, font, radius } from './nodes/nodeTokens';

export default function NodePropertyPanel() {
  const selectedNodes = useStore((s) => s.nodes.filter((n) => n.selected));
  const { setNodes } = useReactFlow();

  if (selectedNodes.length === 0) {
    return null;
  }

  const node = selectedNodes[0];

  const updateNodeData = (key, value) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return { ...n, data: { ...n.data, [key]: value } };
        }
        return n;
      })
    );
  };

  return (
    <div style={{
      position: 'absolute',
      top: 80,
      right: 20,
      width: 320,
      background: surface.deep,
      border: `1px solid ${border.default}`,
      borderRadius: radius.md,
      padding: 16,
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      zIndex: 100,
      color: text.primary,
      fontFamily: 'Inter, system-ui, sans-serif',
      ...font.sm,
      maxHeight: 'calc(100vh - 100px)',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: `1px solid ${border.subtle}`, paddingBottom: 8 }}>
        <h3 style={{ margin: 0, ...font.md, color: text.primary }}>
          {node.data?.label || node.type}
        </h3>
        <span style={{ background: surface.base, border: `1px solid ${border.subtle}`, padding: '2px 6px', borderRadius: radius.sm, ...font.xs, color: text.muted }}>
          Selected
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Label Field */}
        <div>
          <label style={{ display: 'block', color: text.muted, ...font.xs, marginBottom: 4 }}>Label</label>
          <input
            type="text"
            value={node.data?.label || ''}
            onChange={(e) => updateNodeData('label', e.target.value)}
            style={{
              width: '100%', padding: '6px 8px', borderRadius: radius.sm,
              background: surface.base, border: `1px solid ${border.default}`,
              color: text.primary, ...font.sm, boxSizing: 'border-box', outline: 'none'
            }}
          />
        </div>

        {/* Readonly Info */}
        <div style={{ background: surface.base, padding: 8, borderRadius: radius.sm, border: `1px solid ${border.subtle}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: text.muted, ...font.xs }}>Type:</span>
            <span style={{ color: text.primary, ...font.xs }}>{node.type}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: text.muted, ...font.xs }}>ID:</span>
            <span style={{ color: text.primary, ...font.xs, fontFamily: 'monospace' }}>{node.id}</span>
          </div>
        </div>

        {/* Raw Data Dump */}
        <div>
          <label style={{ display: 'block', color: text.muted, ...font.xs, marginBottom: 4 }}>Raw Node Data</label>
          <pre style={{
            margin: 0,
            background: surface.base,
            border: `1px solid ${border.subtle}`,
            padding: 8,
            borderRadius: radius.sm,
            overflowX: 'auto',
            color: text.primary,
            fontSize: 11
          }}>
            {JSON.stringify(node.data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
