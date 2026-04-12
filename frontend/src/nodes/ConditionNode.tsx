import React, { FC } from 'react';
import { Position, Handle, NodeProps } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';

const ConditionNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { disconnectNode } = useNodeConnections(id, data);
  const operator = (data.operator as string) || 'contains';
  const conditionValue = (data.conditionValue as string) || '';

  const handleUpdate = (patch: Record<string, any>) => {
    if (typeof data.onUpdate === 'function') {
      data.onUpdate(id, patch);
    }
  };

  return (
    <NodeShell
      label={data.label as string || 'Condition'}
      dotColor="#f97316"
      selected={selected}
      onDisconnect={() => disconnectNode()}
      isGenerating={data.isGenerating as boolean}
      hasError={data.hasError as boolean}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Input</label>
          <div style={{ background: '#222', padding: 8, borderRadius: 4, position: 'relative' }}>
            <span style={{ color: '#ccc', fontSize: 12 }}>value</span>
            <Handle type="target" position={Position.Left} id="input" style={{ width: 12, height: 12, background: getHandleColor('text'), border: '2px solid #1e1e1e', left: -14 }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Condition</label>
          <select 
            value={operator} 
            onChange={(e) => handleUpdate({ operator: e.target.value })}
            className="nodrag"
            style={{ background: '#222', border: '1px solid #444', color: '#ccc', padding: 6, borderRadius: 4, fontSize: 12, outline: 'none' }}
          >
            <option value="contains">Contains</option>
            <option value="equals">Equals</option>
            <option value="starts_with">Starts With</option>
            <option value="ends_with">Ends With</option>
            <option value="regex">Regex</option>
          </select>
          <input
            value={conditionValue}
            onChange={(e) => handleUpdate({ conditionValue: e.target.value })}
            placeholder="Condition Value"
            className="nodrag nopan"
            style={{ background: '#222', border: '1px solid #444', color: '#ccc', padding: 6, borderRadius: 4, fontSize: 12, outline: 'none', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
          <label style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Outputs</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ background: '#10b98122', padding: 8, borderRadius: 4, position: 'relative', border: '1px solid #10b98155' }}>
              <span style={{ color: '#10b981', fontSize: 12 }}>True</span>
              <Handle type="source" position={Position.Right} id="true_out" style={{ width: 12, height: 12, background: getHandleColor('any'), border: '2px solid #1e1e1e', right: -14 }} />
            </div>
            <div style={{ background: '#ef444422', padding: 8, borderRadius: 4, position: 'relative', border: '1px solid #ef444455' }}>
              <span style={{ color: '#ef4444', fontSize: 12 }}>False</span>
              <Handle type="source" position={Position.Right} id="false_out" style={{ width: 12, height: 12, background: getHandleColor('any'), border: '2px solid #1e1e1e', right: -14 }} />
            </div>
          </div>
        </div>
      </div>
    </NodeShell>
  );
};
export default ConditionNode;
