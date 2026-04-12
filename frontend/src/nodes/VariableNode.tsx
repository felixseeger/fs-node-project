import React, { type FC } from 'react';
import { Position, Handle, type NodeProps } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';

const VariableNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { disconnectNode } = useNodeConnections(id, data);
  const varName = (data.varName as string) || 'my_var';
  const varValue = (data.varValue as string) || '';
  
  const handleUpdate = (patch: Record<string, any>) => {
    if (typeof data.onUpdate === 'function') {
      data.onUpdate(id, patch);
    }
  };

  return (
    <NodeShell
      label={data.label as string || 'Variable'}
      dotColor="#eab308"
      selected={selected}
      onDisconnect={() => disconnectNode()}
      isGenerating={data.isGenerating as boolean}
      hasError={data.hasError as boolean}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Configuration</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#ccc', width: 40 }}>Name</span>
              <input
                type="text"
                value={varName}
                onChange={(e) => handleUpdate({ varName: e.target.value })}
                placeholder="Variable Name"
                className="nodrag nopan"
                style={{ flex: 1, background: '#222', border: '1px solid #444', color: '#ccc', padding: 4, borderRadius: 4, fontSize: 12, outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#ccc', width: 40 }}>Value</span>
              <input
                type="text"
                value={varValue}
                onChange={(e) => handleUpdate({ varValue: e.target.value })}
                placeholder="Value"
                className="nodrag nopan"
                style={{ flex: 1, background: '#222', border: '1px solid #444', color: '#ccc', padding: 4, borderRadius: 4, fontSize: 12, outline: 'none' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
          <label style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>I/O</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ background: '#222', padding: 8, borderRadius: 4, position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#ccc', fontSize: 12 }}>Set Value</span>
              <span style={{ color: '#eab308', fontSize: 12 }}>Get Value</span>
              <Handle type="target" position={Position.Left} id="set" style={{ width: 12, height: 12, background: getHandleColor('any'), border: '2px solid #1e1e1e', left: -14 }} />
              <Handle type="source" position={Position.Right} id="get" style={{ width: 12, height: 12, background: getHandleColor('any'), border: '2px solid #1e1e1e', right: -14 }} />
            </div>
          </div>
        </div>
      </div>
    </NodeShell>
  );
};
export default VariableNode;
