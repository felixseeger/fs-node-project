import React, { useCallback, type FC } from 'react';
import { type NodeProps } from '@xyflow/react';
import {
  NodeShell,
  OutputHandle,
  useNodeConnections,
  getHandleColor,
} from './shared';
import { NodeCapabilities } from './nodeCapabilities';
import VoiceRecorder from '../components/VoiceRecorder';

const VoiceInputNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { update, disconnectNode } = useNodeConnections(id, data);

  const handleTranscription = useCallback((text: string) => {
    update({ outputText: text });
  }, [update]);

  const ACCENT = '#f97316'; // Orange for text output

  return (
    <NodeShell 
      data={data} 
      label={(data.label as string) || 'Voice Input'} 
      dotColor={ACCENT} 
      selected={selected} 
      onDisconnect={disconnectNode} 
      capabilities={[NodeCapabilities.VOICE_INPUT]}
    >
      <OutputHandle id="output" label="text" color={getHandleColor('text-out')} />

      <div style={{ padding: '8px 0' }}>
        <div style={{ fontSize: 11, color: '#999', marginBottom: 8 }}>
          Speak to generate text
        </div>
        
        <VoiceRecorder 
          onTranscription={handleTranscription}
          placeholder="Hold to talk..."
        />

        {data.outputText && (
          <div style={{ 
            marginTop: 12, 
            padding: 8, 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 12,
            color: '#e0e0e0',
            maxHeight: '100px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {data.outputText as string}
          </div>
        )}
      </div>
    </NodeShell>
  );
};

export default VoiceInputNode;
