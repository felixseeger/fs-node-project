import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { NodeCapabilities } from './nodeCapabilities';
import NodeShell from './NodeShell';
import * as NodeControls from './NodeControls';
import { vfxLtxGenerate, pollVfxJobStatus } from '../utils/api';

export default function LtxVideoNode({ id, data, selected }) {
  const { resolve, update } = useNodeConnections(id, data);
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);

  const incomingImages = resolve.image('image-in') || [];
  const sourceImage = incomingImages[0];

  const handleGenerate = async () => {
    if (!data.prompt) return;

    setIsExecuting(true);
    setHasError(false);
    setProgress(0);

    try {
      console.log('[LTX] Submitting job with prompt:', data.prompt);
      
      const payload = {
        prompt: data.prompt,
        width: data.width || 768,
        height: data.height || 512,
        frames: data.frames || 121
      };

      if (sourceImage) {
        payload.image_url = sourceImage;
      }

      const res = await vfxLtxGenerate(payload);

      if (res.error) {
        throw new Error(res.error.message || res.error);
      }

      console.log('[LTX] Job submitted, polling status for jobId:', res.jobId);
      const finalStatus = await pollVfxJobStatus(res.jobId, 120, 3000, (p) => setProgress(p));

      if (finalStatus.status === 'failed') {
        throw new Error(finalStatus.error || 'Generation failed.');
      }

      update({ outputVideo: finalStatus.resultUrl });
      setIsExecuting(false);
      setProgress(100);
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
