import { Position, Handle } from '@xyflow/react';
import BaseNode from './BaseNode';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';

export default function AdaptedPromptNode({ id, data, selected }) {
  const { disconnectNode } = useNodeConnections(id, data);
  return (
    <BaseNode
      id={id}
      label="Adapted Prompt"
      dotColor="#f97316"
      selected={selected}
      onDisconnect={disconnectNode}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Handle
          type="target"
          position={Position.Left}
          id="adapted-in"
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('adapted-in'), border: 'none',
            position: 'relative', left: -12, transform: 'none',
          }}
        />
        <div style={{ flex: 1, margin: '0 8px' }}>
          <div
            style={{
              background: '#1a1a1a',
              borderRadius: 4,
              padding: 6,
              fontSize: 10,
              color: '#e0e0e0',
              minHeight: 40,
              whiteSpace: 'pre-wrap',
              lineHeight: 1.4,
            }}
          >
            {data.adaptedPrompt || 'Waiting for input...'}
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          id="prompt-out"
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('prompt-out'), border: 'none',
            position: 'relative', right: -12, transform: 'none',
          }}
        />
      </div>
    </BaseNode>
  );
}
