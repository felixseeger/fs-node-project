import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  useNodeConnections,
  getHandleColor,
} from './shared';
import { imageClassifierGenerate } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';
import ImageUploadBox from './ImageUploadBox';

export default function AIImageClassifierNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);

  const imageConn = conn('image-in');

  const handleAnalyze = useCallback(async () => {
    let images = resolve.image('image-in', data.localImage);

    if (!images?.length) {
      if (data.onAnalyzeComplete) data.onAnalyzeComplete(id);
      return;
    }

    setIsLoading(true);
    update({ outputText: null, isLoading: true });

    try {
      const compressedImage = await compressImageBase64(images[0]);
      const params = {
        image: compressedImage,
      };

      const result = await imageClassifierGenerate(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        if (data.onAnalyzeComplete) data.onAnalyzeComplete(id);
        return;
      }

      if (result.data && Array.isArray(result.data)) {
        let outputText = 'Classification Results:\n';
        result.data.forEach(item => {
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
    } catch (err) {
      console.error('Image classifier error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
      if (data.onAnalyzeComplete) data.onAnalyzeComplete(id);
    }
  }, [id, data, update, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerAnalyze && data.triggerAnalyze !== lastTrigger.current) {
      lastTrigger.current = data.triggerAnalyze;
      handleAnalyze();
    }
  }, [data.triggerAnalyze, handleAnalyze]);

  const ACCENT = '#f59e0b'; // Amber for AI analysis/prompting

  return (
    <NodeShell data={data} label={data.label || 'AI Image Classifier'} dotColor={ACCENT} selected={selected} onDisconnect={disconnectNode} onGenerate={handleAnalyze} isGenerating={isLoading}>
      <OutputHandle id="text-out" label="text" type="text" color={getHandleColor('text-out')} />

      {/* ── 1. Image Input (Required) ── */}
      <SectionHeader 
        label="Input Image (Required)" 
        handleId="image-in" 
        handleType="target" 
        color={getHandleColor('image-in')}
        isConnected={imageConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'image-in')}
      />
      <ConnectedOrLocal connected={imageConn.connected} connInfo={imageConn.info}>
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
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
        ) : data.outputText ? (
          <div style={{ fontSize: 12, color: '#fff', whiteSpace: 'pre-wrap', wordBreak: 'break-word', width: '100%' }}>
            {data.outputText}
          </div>
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', textAlign: 'center', wordBreak: 'break-word' }}>{data.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', textAlign: 'center' }}>Classification result will appear here</span>
        )}
      </div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </NodeShell>
  );
}
