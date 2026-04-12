import React, { FC } from 'react';
import { Position, Handle, NodeProps } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';

const IterationNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { disconnectNode } = useNodeConnections(id, data);
  const maxIterations = (data.maxIterations as number) || 10;
  
  const handleUpdate = (patch: Record<string, any>) => {
    if (typeof data.onUpdate === 'function') {
      data.onUpdate(id, patch);
    }
  };

  return (
    <NodeShell
      label={data.label as string || 'Iteration'}
      dotColor="#8b5cf6"
      selected={selected}
      onDisconnect={() => disconnectNode()}
      isGenerating={data.isGenerating as boolean}
      hasError={data.hasError as boolean}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Input Array</label>
          <div style={{ background: '#222', padding: 8, borderRadius: 4, position: 'relative' }}>
            <span style={{ color: '#ccc', fontSize: 12 }}>items</span>
            <Handle type="target" position={Position.Left} id="array_in" style={{ width: 12, height: 12, background: getHandleColor('any'), border: '2px solid #1e1e1e', left: -14 }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Config</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#ccc', flex: 1 }}>Max Iterations</span>
            <input
              type="number"
              value={maxIterations}
              onChange={(e) => handleUpdate({ maxIterations: parseInt(e.target.value, 10) || 10 })}
              className="nodrag nopan"
              style={{ background: '#222', border: '1px solid #444', color: '#ccc', padding: 4, borderRadius: 4, fontSize: 12, outline: 'none', width: 60 }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
          <label style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Outputs</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ background: '#3b82f622', padding: 8, borderRadius: 4, position: 'relative', border: '1px solid #3b82f655' }}>
              <span style={{ color: '#3b82f6', fontSize: 12 }}>Current Item</span>
              <Handle type="source" position={Position.Right} id="item_out" style={{ width: 12, height: 12, background: getHandleColor('any'), border: '2px solid #1e1e1e', right: -14 }} />
            </div>
            <div style={{ background: '#8b5cf622', padding: 8, borderRadius: 4, position: 'relative', border: '1px solid #8b5cf655' }}>
              <span style={{ color: '#8b5cf6', fontSize: 12 }}>Completed</span>
              <Handle type="source" position={Position.Right} id="completed_out" style={{ width: 12, height: 12, background: getHandleColor('any'), border: '2px solid #1e1e1e', right: -14 }} />
            </div>
          </div>
        </div>
      </div>
    </NodeShell>
  );
};
export default IterationNode;
