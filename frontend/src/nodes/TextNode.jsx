import { useCallback } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';

export default function TextNode({ id, data, selected }) {
  const { disconnectNode } = useNodeConnections(id, data);
  const onChange = useCallback(
    (e) => {
      data.onUpdate?.(id, { text: e.target.value });
    },
    [id, data]
  );

  return (
    <NodeShell
      label={data.label || 'Text'}
      dotColor="#f97316"
      selected={selected}
      onDisconnect={disconnectNode}
    >
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Handle
            type="target"
            position={Position.Left}
            id="text-in"
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: getHandleColor('text-in'),
              border: 'none',
              position: 'relative',
              left: -12,
              transform: 'none',
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <textarea
            value={data.text || ''}
            onChange={onChange}
            placeholder="Enter text..."
            rows={3}
            style={{
              width: '100%',
              background: '#1a1a1a',
              border: '1px solid #3a3a3a',
              borderRadius: 4,
              color: '#e0e0e0',
              fontSize: 12,
              padding: 6,
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Handle
            type="source"
            position={Position.Right}
            id="text-out"
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: getHandleColor('text-out'),
              border: 'none',
              position: 'relative',
              right: -12,
              transform: 'none',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
        <button
          onClick={() => data.onAddToInput?.('prompt', id, 'text-in')}
          style={{
            flex: 1,
            padding: '3px 0',
            fontSize: 9,
            background: '#1a1a1a',
            border: '1px solid #3a3a3a',
            borderRadius: 4,
            color: '#999',
            cursor: 'pointer',
          }}
        >
          Add to Input
        </button>
        <button
          onClick={() => data.onUnlink?.(id, 'text-in')}
          style={{
            flex: 1,
            padding: '3px 0',
            fontSize: 9,
            background: '#1a1a1a',
            border: '1px solid #3a3a3a',
            borderRadius: 4,
            color: '#999',
            cursor: 'pointer',
          }}
        >
          Unlink
        </button>
      </div>
    </NodeShell>
  );
}
