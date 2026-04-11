import React, { useCallback, FC, ChangeEvent } from 'react';
import { Position, Handle, NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';

/**
 * TextNode - Simple text input/output node
 */
const TextNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { disconnectNode } = useNodeConnections(id, data);
  
  const onChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (typeof data.onUpdate === 'function') {
        data.onUpdate(id, { text: e.target.value });
      }
    },
    [id, data]
  );

  return (
    <BaseNode
      id={id}
      label={(data.label as string) || 'Text'}
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
            className="nodrag nopan"
            value={(data.text as string) || ''}
            onChange={onChange}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
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
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#f97316';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#3a3a3a';
              e.currentTarget.style.boxShadow = 'none';
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
          onClick={() => (data.onAddToInput as Function)?.('prompt', id, 'text-in')}
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
          onClick={() => (data.onUnlink as Function)?.(id, 'text-in')}
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
    </BaseNode>
  );
};

export default TextNode;
