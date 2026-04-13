import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { NodeCapabilities } from './nodeCapabilities';
import NodeShell from './NodeShell';
import * as NodeControls from './NodeControls';
import { vfxCorridorKeyExtract, pollVfxJobStatus } from '../utils/api';

export default function CorridorKeyNode({ id, data, selected }) {
  const { resolve, update } = useNodeConnections(id, data);
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);

  const incomingImages = resolve.image('image-in') || [];
  const sourceImage = incomingImages[0];

  const handleGenerate = async () => {
    if (!sourceImage) return;

    setIsExecuting(true);
    setHasError(false);
    setProgress(0);

    try {
      console.log('[CorridorKey] Extracting matte from:', sourceImage);
      
      const payload = {
        videoUrl: sourceImage, // Although it's 'image-in' the capability might be video or image sequence
        sensitivity: data.sensitivity || 50,
        refinement: data.refinement || false
      };

      const res = await vfxCorridorKeyExtract(payload);
      
      if (res.error) {
        throw new Error(res.error.message || res.error);
      }

      console.log('[CorridorKey] Job submitted, polling status for jobId:', res.jobId);
      const finalStatus = await pollVfxJobStatus(res.jobId, 120, 3000, (p) => setProgress(p));

      if (finalStatus.status === 'failed') {
        throw new Error(finalStatus.error || 'Extraction failed.');
      }

      update({ outputImage: finalStatus.resultUrl });
      setIsExecuting(false);
    } catch (err) {
      console.error('[CorridorKey] Failed:', err);
      setHasError(true);
      setIsExecuting(false);
    }
  };

  const capabilities = [NodeCapabilities.IMAGE_REMOVE_BACKGROUND, NodeCapabilities.IMAGE_EDIT];

  return (
    <NodeShell
      id={id}
      label="CorridorKey AI"
      selected={selected}
      capabilities={capabilities}
      dotColor="#10b981"
      isExecuting={isExecuting}
      hasError={hasError}
      onGenerate={handleGenerate}
    >
      <div style={{ padding: '8px 0' }}>
        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          backgroundColor: '#111',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginBottom: 12,
          border: '1px solid #222'
        }}>
          {sourceImage ? (
            <img src={sourceImage} alt="Input" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 10, color: '#444' }}>Waiting for input image...</span>
          )}
        </div>

        <NodeControls.Slider 
          label="Sensitivity"
          value={data.sensitivity || 50}
          min={0}
          max={100}
          onChange={(val) => update({ sensitivity: val })}
        />
        
        <NodeControls.Toggle 
          label="Edge Refinement"
          active={data.refinement}
          onClick={() => update({ refinement: !data.refinement })}
        />
      </div>

      <Handle type="target" position={Position.Left} id="image-in" style={{ background: getHandleColor('image') }} />
      <Handle type="source" position={Position.Right} id="image-out" style={{ background: getHandleColor('image') }} />
    </NodeShell>
  );
}
