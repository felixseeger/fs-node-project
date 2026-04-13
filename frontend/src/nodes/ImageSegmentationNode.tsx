import React, { useCallback, useState, useEffect, type FC } from 'react';
import { getFirebaseAuth } from '../config/firebase';
import { Position, Handle, type Node, type NodeProps } from '@xyflow/react';
import {
  UniversalSimplifiedNodeChrome,
  useNodeConnections,
  getHandleColor,
  text,
  surface,
  border,
  radius,
  sp,
  font,
} from './shared';
// @ts-ignore
import useNodeProgress from '../hooks/useNodeProgress';
// @ts-ignore
import { segmentImage } from '../utils/api';

interface SegmentNodeData extends Record<string, unknown> {
  label?: string;
  inputPrompt?: string;
  inputMode?: 'text' | 'point' | 'box' | 'everything';
  outputImages?: string[];
  outputError?: string;
  triggerGenerate?: number;
}

/**
 * ImageSegmentationNode - Isolates parts of an image based on SAM 3 (Segment Anything Model 3) docs.
 * Connects to Layer Editor node.
 */
const ImageSegmentationNode: FC<NodeProps<Node<SegmentNodeData>>> = ({ id, data, selected }) => {
  const { update, resolve, conn } = useNodeConnections(id, data);
  const promptConn = conn('prompt-in');
  const imageConn = conn('image-in');
  
  // Progress tracking
  const {
    progress,
    status,
    message,
    start,
    setProgress,
    complete,
    fail,
    isActive,
  } = useNodeProgress({
    onProgress: (state: any) => {
      update({
        executionProgress: state.progress,
        executionStatus: state.status,
        executionMessage: state.message,
      });
    },
  });

  const handleSegment = useCallback(async () => {
    const prompt = resolve.text('prompt-in', data.inputPrompt);
    const imageUrl = resolve.image('image-in');
    
    if (!imageUrl) {
      fail(new Error('Input image is required'));
      update({ outputError: 'Input image is required' });
      return;
    }

    start('Initializing SAM 3 Processor...');
    update({ outputImages: null, outputError: null });

    try {
      // Step 1: Initialize Model & Set Image (simulated progress)
      await new Promise(r => setTimeout(r, 800));
      setProgress(30, 'Setting image in SAM 3 (processor.set_image)...');
      
      await new Promise(r => setTimeout(r, 800));
      const mode = data.inputMode || 'text';
      setProgress(60, `Generating instance masks via ${mode} prompt...`);

      // Backend call to simulated or actual SAM 3 segmentation endpoint
      const result = await segmentImage({ 
        image: imageUrl, 
        prompt: prompt,
        mode: mode 
      });

      if (result.error) {
        fail(new Error(result.error?.message || 'Segmentation failed'));
        update({ outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      complete('Isolation complete');
      const segmentedImages = result.data?.segments || [];
      update({
        outputImages: segmentedImages,
        outputImage: segmentedImages[0] || null, // Primary output for generic nodes
        inputPrompt: prompt,
      });
    } catch (err: any) {
      console.error('[ImageSegmentationNode] Segmentation error:', err);
      fail(err);
      update({ outputError: err.message });
    }
  }, [id, data, update, start, setProgress, complete, fail, resolve]);

  useEffect(() => {
    if (data.triggerGenerate) {
      handleSegment();
    }
  }, [data.triggerGenerate]);

  const inputImage = resolve.image('image-in');
  const outputImages = data.outputImages || (data.outputImage ? [data.outputImage] : []);

  return (
    <UniversalSimplifiedNodeChrome
      title={(data.label as string) || 'SAM 3 Segmentation'}
      selected={selected}
      onRun={handleSegment}
      isRunning={isActive}
      runDisabled={!inputImage}
      width={280}
      onDownload={outputImages.length > 0 ? () => {
        let username = 'anonymous';
        try {
          const auth = getFirebaseAuth();
          username = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'anonymous';
        } catch (err) {}
        
        const safeUser = username.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const safeModel = 'sam-v3'.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const label = (data.label || 'Segment Image').toLowerCase().replace(/[^a-z0-9]/g, '-');

        outputImages.forEach((img: string, i: number) => {
          const a = document.createElement('a');
          a.href = img;
          a.download = `${safeUser}-${safeModel}-${label}-${i}-${Date.now()}.png`;
          a.click();
        });
      } : undefined}
    >
      <div style={{ position: 'relative' }}>
        {/* Handles */}
        <Handle
          type="target"
          position={Position.Left}
          id="image-in"
          style={{
            width: 12, height: 12, borderRadius: '50%',
            background: getHandleColor('image-in'), border: '2px solid #000',
            position: 'absolute', left: -22, top: 20,
          }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="prompt-in"
          style={{
            width: 12, height: 12, borderRadius: '50%',
            background: getHandleColor('prompt-in'), border: '2px solid #000',
            position: 'absolute', left: -22, top: 50,
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="image-out"
          style={{
            width: 12, height: 12, borderRadius: '50%',
            background: getHandleColor('image-out'), border: '2px solid #000',
            position: 'absolute', right: -22, top: 20,
          }}
        />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          
          {/* Mode Selector */}
          <div style={{ display: 'flex', gap: 4 }}>
            {['text', 'point', 'box', 'everything'].map(mode => (
              <button
                key={mode}
                className="nodrag nopan"
                onClick={() => update({ inputMode: mode })}
                style={{
                  flex: 1,
                  background: data.inputMode === mode ? '#3b82f6' : surface.sunken,
                  border: `1px solid ${data.inputMode === mode ? '#2563eb' : border.subtle}`,
                  color: data.inputMode === mode ? '#fff' : text.secondary,
                  ...font.xs,
                  padding: '4px 0',
                  borderRadius: radius.sm,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 4,
            background: 'rgba(0,0,0,0.2)',
            padding: 8,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <span style={{ ...font.xs, color: text.secondary, fontWeight: 600 }}>PROMPT (Target Object)</span>
            <textarea
              className="nodrag nopan"
              value={(data.inputPrompt as string) || ''}
              onChange={(e) => update({ inputPrompt: e.target.value })}
              placeholder="e.g. 'the red car'"
              disabled={data.inputMode === 'everything' || promptConn.connected}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: promptConn.connected ? text.muted : text.primary,
                ...font.sm,
                padding: 0,
                outline: 'none',
                resize: 'none',
                minHeight: 40,
              }}
            />
          </div>

          {/* Preview */}
          {outputImages.length > 0 ? (
            <div style={{
              borderRadius: 8,
              overflow: 'hidden',
              border: `1px solid ${border.subtle}`,
              position: 'relative',
              aspectRatio: '1',
              background: surface.sunken,
            }}>
              {/* Stack the output images like layers to show the isolated parts */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(45deg, #222 25%, transparent 25%), linear-gradient(-45deg, #222 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #222 75%), linear-gradient(-45deg, transparent 75%, #222 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }} />
              {outputImages.map((img: string, idx: number) => (
                <img key={idx} src={img} alt={`Segment ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', inset: 0, zIndex: idx }} />
              ))}
              <div style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4, ...font.xs, color: '#fff', zIndex: 100 }}>
                {outputImages.length} Layers
              </div>
            </div>
          ) : isActive ? (
            <div style={{
              borderRadius: 8,
              aspectRatio: '1',
              background: surface.sunken,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              border: `1px dashed ${border.subtle}`,
            }}>
              <div className="node-spinner" style={{
                width: 24, height: 24, border: '2px solid #333', borderTop: '2px solid #3b82f6', borderRadius: '50%', animation: 'node-spin 1s linear infinite'
              }} />
              <span style={{ ...font.xs, color: text.muted }}>{message || 'Segmenting...'}</span>
            </div>
          ) : inputImage ? (
            <div style={{
              borderRadius: 8,
              overflow: 'hidden',
              border: `1px solid ${border.subtle}`,
              position: 'relative',
              aspectRatio: '1',
              background: surface.sunken,
            }}>
               <img src={inputImage as string} alt="Input" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.5 }} />
               <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                 <span style={{ ...font.sm, color: '#fff', textShadow: '0 1px 2px #000' }}>Ready to Segment</span>
               </div>
            </div>
          ) : (
            <div style={{
              borderRadius: 8,
              aspectRatio: '1',
              background: surface.sunken,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px dashed ${border.subtle}`,
            }}>
               <span style={{ ...font.xs, color: text.muted }}>Connect an input image</span>
            </div>
          )}

          {data.outputError && (
            <div style={{
              padding: 8,
              borderRadius: 6,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              ...font.xs,
            }}>
              {data.outputError as string}
            </div>
          )}
        </div>
      </div>
    </UniversalSimplifiedNodeChrome>
  );
};

export default ImageSegmentationNode;