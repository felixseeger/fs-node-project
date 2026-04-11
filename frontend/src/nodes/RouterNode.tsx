import React, { useState, useEffect, FC, ChangeEvent } from 'react';
import { Position, Handle, NodeResizer, useUpdateNodeInternals, NodeProps } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';

interface Output {
  id: string;
  label: string;
}

/**
 * RouterNode - Passthrough node for organizing workflow logic
 */
const RouterNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { disconnectNode, disconnect } = useNodeConnections(id, data);
  const [dimensions, setDimensions] = useState({ width: 180, height: 160 });

  const updateNodeInternals = useUpdateNodeInternals();
  const outputs = (data.outputs as Output[]) || [{ id: 'out-1', label: 'Output 1' }];

  useEffect(() => {
    updateNodeInternals(id);
  }, [outputs.length, id, updateNodeInternals]);

  const addOutput = () => {
    const nextId = `out-${Date.now()}`;
    const newOutputs = [...outputs, { id: nextId, label: `Output ${outputs.length + 1}` }];
    if (typeof data.onUpdate === 'function') {
      data.onUpdate(id, { outputs: newOutputs });
    }
  };

  const removeOutput = (outId: string) => {
    if (outputs.length <= 1) return;
    const newOutputs = outputs.filter(o => o.id !== outId);
    if (typeof data.onUpdate === 'function') {
      data.onUpdate(id, { outputs: newOutputs });
    }
    disconnect(outId); // Disconnect anything attached to this output
  };

  const updateOutputLabel = (outId: string, newLabel: string) => {
    const newOutputs = outputs.map(o => o.id === outId ? { ...o, label: newLabel } : o);
    if (typeof data.onUpdate === 'function') {
      data.onUpdate(id, { outputs: newOutputs });
    }
  };

  return (
    <NodeShell data={data}
      label={(data.label as string) || 'Router'}
      dotColor="#64748b"
      selected={selected}
      onDisconnect={disconnectNode}
    >
      <NodeResizer 
        color="#64748b" 
        isVisible={selected} 
        minWidth={150} 
        minHeight={100}
        onResize={(e, params) => setDimensions({ width: params.width, height: params.height })}
      />
      <div style={{ display: 'flex', width: '100%', height: dimensions.height - 50, minHeight: 80, position: 'relative' }}>
        
        {/* Input Side */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          width: '24px', borderRight: '1px dashed #333', overflow: 'visible',
          position: 'relative'
        }}>
          <Handle
            type="target"
            position={Position.Left}
            id="in"
            style={{
              width: 12, height: 12, background: getHandleColor('any'),
              border: '2px solid #1a1a1a', left: -12
            }}
          />
        </div>

        {/* Outputs Side */}
        <div className="nowheel nodrag" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 16px 8px 8px', gap: 8, overflowY: 'visible' }}>
          {outputs.map((out) => (
            <div key={out.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e1e1e', borderRadius: 4, padding: '4px 8px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                <button 
                  onClick={() => removeOutput(out.id)}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="nodrag nopan"
                  disabled={outputs.length === 1}
                  style={{ 
                    background: 'transparent', border: 'none', color: outputs.length === 1 ? '#444' : '#ef4444', 
                    cursor: outputs.length === 1 ? 'not-allowed' : 'pointer', fontSize: 14, padding: 0, lineHeight: 1
                  }}
                  title="Remove Output"
                >&times;</button>
                <input 
                  type="text" 
                  className="nodrag nopan"
                  value={out.label}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateOutputLabel(out.id, e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  style={{
                    background: 'transparent', border: 'none', color: '#ccc', fontSize: 12, width: '100%', outline: 'none'
                  }}
                />
              </div>
              <Handle
                type="source"
                position={Position.Right}
                id={out.id}
                style={{
                  width: 12, height: 12, background: getHandleColor('any'),
                  border: '2px solid #1e1e1e', right: -14
                }}
              />
            </div>
          ))}
          
          <button 
            onClick={addOutput}
            style={{ 
              background: 'transparent', border: '1px dashed #444', color: '#888', 
              borderRadius: 4, padding: '6px', cursor: 'pointer', fontSize: 11, marginTop: 4,
              transition: 'background 0.15s, color 0.15s'
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#222'; (e.currentTarget as HTMLElement).style.color = '#ccc'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#888'; }}
          >
            + Add Output
          </button>
        </div>
      </div>
    </NodeShell>
  );
};

export default RouterNode;
