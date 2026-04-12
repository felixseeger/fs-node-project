import React from 'react';
import { Position, Handle, type NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import type { NodeData } from '../types';

export interface AdaptedPromptNodeData extends NodeData {
  adaptedPrompt?: string;
}

export default function AdaptedPromptNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as AdaptedPromptNodeData;
  const { disconnectNode } = useNodeConnections(id, nodeData);

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
            {nodeData.adaptedPrompt || 'Waiting for input...'}
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
