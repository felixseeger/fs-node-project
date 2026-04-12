import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle, type NodeProps } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  useNodeConnections,
  getHandleColor,
  OutputHandle
} from './shared';
import { imageClassifierGenerate } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';
import ImageUploadBox from './ImageUploadBox';
import type { NodeData } from '../types';

export interface AIImageClassifierNodeData extends NodeData {
  localImage?: string;
  inputImagePreview?: string;
  outputText?: string | null;
  rawResult?: any;
  outputError?: string | null;
  isLoading?: boolean;
  onAnalyzeComplete?: (id: string) => void;
  triggerAnalyze?: number;
}

export default function AIImageClassifierNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as AIImageClassifierNodeData;
  const [isLoading, setIsLoading] = useState(false);
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, nodeData);

  const imageConn = conn('image-in');

  const handleAnalyze = useCallback(async () => {
    let images = resolve.image('image-in', nodeData.localImage);

    if (!images?.length) {
      if (nodeData.onAnalyzeComplete) nodeData.onAnalyzeComplete(id);
      return;
    }

    setIsLoading(true);
    update({ outputText: null, isLoading: true });

    try {
      const compressedImage = await compressImageBase64(images[0]);
      const params = {
        image: compressedImage,
      };

      const result: any = await imageClassifierGenerate(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        if (nodeData.onAnalyzeComplete) nodeData.onAnalyzeComplete(id);
        return;
      }

      if (result.data && Array.isArray(result.data)) {
        let outputText = 'Classification Results:\n';
        result.data.forEach((item: any) => {
           outputText += `- ${item.class_name}: ${(item.probability * 100).toFixed(2)}%\n`;
        });
        update({
          outputText,
          rawResult: result.data,
          isLoading: false,
          outputError: null,
        });
      } else {
        update({ isLoading: false, outputError: 'Invalid format received from API.' });
      }
    } catch (err: any) {
      console.error('Image classifier error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
      if (nodeData.onAnalyzeComplete) nodeData.onAnalyzeComplete(id);
    }
  }, [id, nodeData, update, resolve]);

  const lastTrigger = useRef<number | null>(null);
  useEffect(() => {
    if (nodeData.triggerAnalyze && nodeData.triggerAnalyze !== lastTrigger.current) {
      lastTrigger.current = nodeData.triggerAnalyze;
      handleAnalyze();
    }
  }, [nodeData.triggerAnalyze, handleAnalyze]);

  const ACCENT = '#f59e0b'; // Amber for AI analysis/prompting

  return (
    <NodeShell data={nodeData} label={nodeData.label || 'AI Image Classifier'} dotColor={ACCENT} selected={selected} onDisconnect={disconnectNode} onGenerate={handleAnalyze} isGenerating={isLoading}>
      <OutputHandle id="text-out" label="text" type="text" color={getHandleColor('text-out')} />

      {/* ── 1. Image Input (Required) ── */}
      <SectionHeader 
        label="Input Image (Required)" 
        handleId="image-in" 
        handleType="target" 
        color={getHandleColor('image-in')}
        isConnected={imageConn.connected}
        onUnlink={() => nodeData.onUnlink?.(id, 'image-in')}
      />
      <ConnectedOrLocal connected={imageConn.connected} connInfo={imageConn.info}>
        <ImageUploadBox
          image={nodeData.localImage || nodeData.inputImagePreview || null}
          onImageChange={(img: string) => update({ localImage: img })}
          placeholder="Upload image"
          minHeight={60}
        />
      </ConnectedOrLocal>

      {/* ── 2. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Classification Result</span>
        </div>
      </div>
      <div style={{
        background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
        minHeight: 120, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 12,
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, border: '3px solid #3a3a3a',
              borderTop: `3px solid ${ACCENT}`, borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <span style={{ fontSize: 10, color: '#999' }}>Classifying image...</span>
          </div>
        ) : nodeData.outputText ? (
          <div style={{ fontSize: 12, color: '#fff', whiteSpace: 'pre-wrap', wordBreak: 'break-word', width: '100%' }}>
            {nodeData.outputText}
          </div>
        ) : nodeData.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', textAlign: 'center', wordBreak: 'break-word' }}>{nodeData.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', textAlign: 'center' }}>Classification result will appear here</span>
        )}
      </div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </NodeShell>
  );
}
