import React, { useState } from 'react';
import { Position, Handle, NodeResizer } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';

export default function HistoryNode({ id, data, selected }) {
  const { resolve, disconnectNode } = useNodeConnections(id, data);
  const [dimensions, setDimensions] = useState({ width: 280, height: 200 });

  // Resolve input directly to capture whatever is connected
  const inputVal = resolve.raw('in');
  const items = data.items || [];

  const handleCapture = () => {
    if (!inputVal) return;
    
    let type = 'text';
    if (Array.isArray(inputVal)) {
      type = 'images';
    } else if (typeof inputVal === 'string' && (inputVal.startsWith('http') || inputVal.startsWith('data:image'))) {
      type = 'image';
    }

    const newItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      data: inputVal
    };
    
    data.onUpdate?.(id, { items: [newItem, ...items] });
  };

  const clearHistory = () => data.onUpdate?.(id, { items: [] });
  const removeItem = (itemId) => {
    data.onUpdate?.(id, { items: items.filter(i => i.id !== itemId) });
  };

  return (
    <NodeShell
      label={data.label || 'History Logger'}
      dotColor="#64748b"
      selected={selected}
      onDisconnect={disconnectNode}
    >
      <NodeResizer 
        color="#64748b" 
        isVisible={selected} 
        minWidth={220} 
        minHeight={150}
        onResize={(e, params) => setDimensions({ width: params.width, height: params.height })}
      />
      <div style={{ display: 'flex', flexDirection: 'column', height: dimensions.height - 50 }}>
        {/* Connection Handle & Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Handle
            type="target"
            position={Position.Left}
            id="in"
            style={{ width: 10, height: 10, background: getHandleColor('any'), border: 'none', left: -12 }}
          />
          <div style={{ display: 'flex', gap: 6, flex: 1, paddingLeft: 8 }}>
            <button onClick={handleCapture} style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>Capture Snapshot</button>
            <button onClick={clearHistory} style={{ background: '#1e1e1e', color: '#ccc', border: '1px solid #333', padding: '6px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>Clear</button>
          </div>
        </div>

        {/* History List */}
        <div className="nowheel nodrag" style={{ flex: 1, overflowY: 'auto', background: '#111', borderRadius: 6, padding: 8, border: '1px solid #222' }}>
          {items.length === 0 ? (
            <div style={{ color: '#555', fontSize: 11, textAlign: 'center', marginTop: 30, padding: 10 }}>Connect a node and click Capture to save its output state.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((item) => (
                <div key={item.id} style={{ background: '#1a1a1a', padding: 8, borderRadius: 6, border: '1px solid #2a2a2a', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: '#888', fontWeight: 500 }}>{item.timestamp}</span>
                    <button onClick={() => removeItem(item.id)} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}>&times;</button>
                  </div>
                  
                  {item.type === 'text' && (
                    <div style={{ fontSize: 12, color: '#e0e0e0', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 80, overflowY: 'auto' }}>
                      {typeof item.data === 'string' ? item.data : JSON.stringify(item.data)}
                    </div>
                  )}

                  {item.type === 'image' && (
                    <img src={item.data} style={{ width: '100%', height: 'auto', maxHeight: 120, objectFit: 'contain', borderRadius: 4, background: '#000' }} />
                  )}

                  {item.type === 'images' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {item.data.map((img, j) => (
                        <img key={j} src={img} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #333' }} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </NodeShell>
  );
}