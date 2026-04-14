import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import { useNodeConnections } from './shared';
import { NodeCapabilities } from './nodeCapabilities';
import NodeShell from './NodeShell';
import NodeProgress from './NodeProgress';
import { getHandleColor } from '../utils/handleTypes';
import { imageToPromptGenerate, pollImageToPromptStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';
import ImageUploadBox from './ImageUploadBox';
import useNodeProgress from '../hooks/useNodeProgress';

export default function ImageToPromptNode({ id, data, selected }) {
  const { onDisconnectNode } = useNodeConnections();
  const progress = useNodeProgress();
  
  const update = useCallback(
    (patch) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback((handleId) => {
    return data.getConnectionInfo?.(id, handleId) || null;
  }, [id, data]);

  const imageConnection = getConnInfo('image-in');
  const hasImageConnection = data.hasConnection?.(id, 'image-in');

  const handleGenerate = useCallback(async () => {
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];

    if (!images?.length) return;

    progress.start();
    update({ outputPrompt: null, isLoading: true });

    try {
      const compressedImage = await compressImageBase64(images[0]);
      const params = {
        image: compressedImage,
      };

      const result = await imageToPromptGenerate(params);

      if (result.error) {
        progress.fail();
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const status = await pollImageToPromptStatus(taskId);
        const generated = status.data?.generated || [];
        const prompt = status.data?.prompt || status.prompt || generated[0] || null;
        progress.complete();
        update({
          outputPrompt: prompt,
          isLoading: false,
          outputError: null,
        });
      } else if (result.data?.generated?.length || result.data?.prompt || result.prompt) {
        progress.complete();
        update({
          outputPrompt: result.data?.prompt || result.prompt || result.data?.generated?.[0] || null,
          isLoading: false,
          outputError: null,
        });
      } else {
        progress.complete();
        update({ isLoading: false });
      }
    } catch (err) {
      console.error('Image to prompt error:', err);
      progress.fail();
      update({ isLoading: false, outputError: err.message });
    }
  }, [id, data, update, progress]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  // ── Helpers ──

  const sectionHeader = (label, handleId, handleType, color, extra) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 6, marginTop: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Handle type={handleType} position={handleType === 'target' ? Position.Left : Position.Right}
          id={handleId} style={{
            width: 10, height: 10, borderRadius: '50%', background: color, border: 'none',
            position: 'relative', left: handleType === 'target' ? -12 : 'auto',
            right: handleType === 'source' ? -12 : 'auto', transform: 'none',
          }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>{label}</span>
      </div>
      {extra && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{extra}</div>}
    </div>
  );

  const linkedBadges = (onUnlinkHandle) => (
    <>
      <span style={{ fontSize: 9, color: '#3b82f6', padding: '2px 6px', background: 'rgba(59,130,246,0.1)', borderRadius: 4 }}>linked</span>
      <button onClick={() => data.onUnlink?.(id, onUnlinkHandle)} style={{
        fontSize: 9, color: '#ef4444', padding: '2px 6px', background: 'rgba(239,68,68,0.15)', borderRadius: 4,
        border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
      }}>unlink</button>
    </>
  );

  const connectionInfoBox = (connInfo) => (
    <div style={{
      background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
      borderRadius: 6, padding: '6px 10px', marginBottom: 4,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: '#93b4f5' }}>
        {connInfo ? `Linked from ${connInfo.nodeLabel} → ${connInfo.handle}` : 'Linked from upstream node'}
      </span>
    </div>
  );

  const ACCENT = '#f59e0b'; // Amber for AI analysis/prompting

  // ── Render ──

  return (
    <NodeShell data={data}
      label={data.label || 'Image to Prompt'}
      dotColor={ACCENT}
      selected={selected}
      onGenerate={handleGenerate}
      isGenerating={progress.isActive} onDisconnect={onDisconnectNode}
      capabilities={[NodeCapabilities.IMAGE_TO_PROMPT]}
    >

      {/* ── Prompt Output Handle (top) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        marginBottom: 4,
      }}>
        <span style={{ fontSize: 10, color: '#999', marginRight: 4 }}>prompt text</span>
        <Handle type="source" position={Position.Right} id="prompt-out" style={{
          width: 10, height: 10, borderRadius: '50%',
          background: getHandleColor('prompt-out'), border: 'none',
          position: 'relative', right: -12, transform: 'none',
        }} />
      </div>

      {/* ── 1. Image Input (Required) ── */}
      {sectionHeader('Input Image (Required)', 'image-in', 'target', getHandleColor('image-in'),
        hasImageConnection ? linkedBadges('image-in') : null
      )}
      {hasImageConnection ? connectionInfoBox(imageConnection) : (
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Upload image"
          minHeight={60}
        />
      )}

      {/* ── 2. Progress ── */}
      <NodeProgress progress={progress} label="Analyzing image..." />

      {/* ── 3. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Generated Prompt</span>
        </div>
      </div>
      <div style={{
        background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
        minHeight: 120, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 12,
      }}>
        {progress.isActive ? (
          <span style={{ fontSize: 11, color: '#555', textAlign: 'center' }}>Analyzing...</span>
        ) : data.outputPrompt ? (
          <div style={{ fontSize: 12, color: '#fff', whiteSpace: 'pre-wrap', wordBreak: 'break-word', width: '100%' }}>
            {data.outputPrompt}
          </div>
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', textAlign: 'center', wordBreak: 'break-word' }}>{data.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', textAlign: 'center' }}>Generated prompt will appear here</span>
        )}
      </div>

    </NodeShell>
  );
}