import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { NodeCapabilities } from './nodeCapabilities';
import NodeShell from './NodeShell';
import * as NodeControls from './NodeControls';

export default function LtxVideoNode({ id, data, selected }) {
  const { resolve, update } = useNodeConnections(id, data);
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleGenerate = async () => {
    if (!data.prompt) return;

    setIsExecuting(true);
    setHasError(false);

    try {
      // TODO: replace mock - Placeholder for LTX Video Generation API call
      console.log('[LTX] Generating video with prompt:', data.prompt);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const resultUrl = 'https://example.com/generated-video.mp4';
      update({ outputVideo: resultUrl });
      setIsExecuting(false);
    } catch (err) {
      console.error('[LTX] Failed:', err);
      setHasError(true);
      setIsExecuting(false);
    }
  };

  const capabilities = [NodeCapabilities.VIDEO_GENERATE, NodeCapabilities.OUTPUT_VIDEO];

  return (
    <NodeShell
      id={id}
      label="LTX Video AI"
      selected={selected}
      capabilities={capabilities}
      dotColor="#14b8a6"
      isExecuting={isExecuting}
      hasError={hasError}
      onGenerate={handleGenerate}
    >
      <div style={{ padding: '8px 0' }}>
        <textarea
          value={data.prompt || ''}
          placeholder="A futuristic city with flying cars..."
          onChange={(e) => update({ prompt: e.target.value })}
          rows={3}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#222', color: '#eee', border: '1px solid #333' }}
        />

        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          backgroundColor: '#111',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginTop: 12,
          border: '1px solid #222'
        }}>
          {data.outputVideo ? (
            <video src={data.outputVideo} autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 10, color: '#444' }}>No video generated</span>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="video-out" style={{ background: getHandleColor('video') }} />
    </NodeShell>
  );
}
