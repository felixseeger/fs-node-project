import React, { useCallback, useState, useEffect, useRef, type FC } from 'react';
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
import { generateImage, pollStatus } from '../utils/api';
import type { GeneratorNodeData } from '../types';

/**
 * SimplifiedGeneratorNode - Simplified image generation node using UniversalSimplifiedNodeChrome
 */
const SimplifiedGeneratorNode: FC<NodeProps<Node<GeneratorNodeData>>> = ({ id, data, selected }) => {
  const { update, resolve, disconnectNode } = useNodeConnections(id, data);
  
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

  const handleGenerate = useCallback(async () => {
    const prompt = resolve.text('prompt-in', data.inputPrompt);
    if (!prompt) return;

    start('Submitting generation request...');
    update({ outputImage: null, outputError: null });

    try {
      // Use Nano Banana 2 Pro by default
      const params: any = { 
        prompt,
        model: 'Nano Banana 2 Pro', 
        aspect_ratio: data.localAspectRatio || '1:1',
      };

      const result = await generateImage(params);

      if (result.error) {
        fail(new Error(result.error?.message || 'Generation failed'));
        update({ outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      if (result.data?.task_id) {
        const statusResult = await pollStatus(result.data.task_id, 'fluid', 90, 2000, (attempt: number, maxAttempts: number) => {
          const p = 10 + Math.min(85, (attempt / maxAttempts) * 85);
          setProgress(p, `Generating... (${attempt}/${maxAttempts})`);
        });
        
        const generated = statusResult.data?.generated || [];
        complete('Generation complete');
        update({
          outputImage: generated[0] || null,
          outputImages: generated,
          inputPrompt: prompt,
        });
      } else if (result.data?.generated?.length) {
        complete('Done');
        const generated = result.data.generated;
        update({
          outputImage: generated[0],
          outputImages: generated,
          inputPrompt: prompt,
        });
      } else {
        complete('No images generated');
      }
    } catch (err: any) {
      console.error('[SimplifiedGeneratorNode] Generation error:', err);
      fail(err);
      update({ outputError: err.message });
    }
  }, [id, data, update, start, setProgress, complete, fail, resolve]);

  const lastTrigger = useRef<any>(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <UniversalSimplifiedNodeChrome
      title={(data.label as string) || 'Nano Banana 2 Pro'}
      selected={selected}
      onRun={handleGenerate}
      isRunning={isActive}
      width={280}
      onDownload={data.outputImage ? () => {
        const a = document.createElement('a');
        a.href = data.outputImage as string;
        a.download = `generated-${Date.now()}.png`;
        a.click();
      } : undefined}
    >
      <div style={{ position: 'relative' }}>
        {/* Handles */}
        <Handle
          type="target"
          position={Position.Left}
          id="prompt-in"
          style={{
            width: 12, height: 12, borderRadius: '50%',
            background: getHandleColor('prompt-in'), border: '2px solid #000',
            position: 'absolute', left: -22, top: 20,
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          style={{
            width: 12, height: 12, borderRadius: '50%',
            background: getHandleColor('output'), border: '2px solid #000',
            position: 'absolute', right: -22, top: 20,
          }}
        />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 4,
            background: 'rgba(0,0,0,0.2)',
            padding: 8,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <span style={{ ...font.xs, color: text.secondary, fontWeight: 600 }}>PROMPT</span>
            <textarea
              className="nodrag nopan"
              value={(data.inputPrompt as string) || ''}
              onChange={(e) => update({ inputPrompt: e.target.value })}
              placeholder="What do you want to generate?"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: text.primary,
                ...font.sm,
                padding: 0,
                outline: 'none',
                resize: 'none',
                minHeight: 60,
              }}
            />
          </div>

          {/* Preview */}
          {data.outputImage ? (
            <div style={{
              borderRadius: 8,
              overflow: 'hidden',
              border: `1px solid ${border.subtle}`,
              position: 'relative',
              aspectRatio: '1',
              background: surface.sunken,
            }}>
              <img src={data.outputImage as string} alt="Generated" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              <span style={{ ...font.xs, color: text.muted }}>{progress}%</span>
            </div>
          ) : null}

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

export default SimplifiedGeneratorNode;
