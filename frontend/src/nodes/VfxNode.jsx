import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';
import { getHandleColor } from '../utils/handleTypes';
import { vfxGenerate, pollVfxStatus } from '../utils/api';

const FILTERS = [
  { value: 1, label: 'Film Grain' },
  { value: 2, label: 'Motion Blur' },
  { value: 3, label: 'Fish Eye' },
  { value: 4, label: 'VHS' },
  { value: 5, label: 'Shake' },
  { value: 6, label: 'VGA' },
  { value: 7, label: 'Bloom' },
  { value: 8, label: 'Anamorphic Lens' },
];

export default function VfxNode({ id, data, selected }) {
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
    onProgress: (state) => {
      data.onUpdate?.(id, {
        executionProgress: state.progress,
        executionStatus: state.status,
        executionMessage: state.message,
      });
    },
  });

  const localFilterType = data.localFilterType || 1;
  const localFps = data.localFps || 24;
  const localBloomContrast = data.localBloomContrast || 50;
  const localMotionKernelSize = data.localMotionKernelSize || 5;
  const localMotionDecayFactor = data.localMotionDecayFactor || 0.5;

  const update = useCallback(
    (patch) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback((handleId) => {
    return data.getConnectionInfo?.(id, handleId) || null;
  }, [id, data]);

  const videoConnection = getConnInfo('video-in');
  const hasVideoConnection = data.hasConnection?.(id, 'video-in');

  const handleGenerate = useCallback(async () => {
    let videos = data.resolveInput?.(id, 'video-in');
    if (!videos?.length && data.localVideo) videos = [data.localVideo];

    if (!videos?.length) return;

    start('Submitting VFX request...');
    update({ outputVideo: null, outputError: null });

    try {
      const params = {
        video: videos[0],
        filter_type: localFilterType,
        fps: localFps,
      };

      if (localFilterType === 7) {
        params.bloom_filter_contrast = localBloomContrast;
      } else if (localFilterType === 2) {
        params.motion_filter_kernel_size = localMotionKernelSize;
        params.motion_filter_decay_factor = localMotionDecayFactor;
      }

      const result = await vfxGenerate(params);

      if (result.error) {
        fail(new Error(result.error?.message || 'VFX processing failed'));
        update({ outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        // Poll with progress tracking
        let lastProgress = 10;
        const maxAttempts = 120;
        const intervalMs = 3000;
        
        for (let i = 0; i < maxAttempts; i++) {
          const statusResult = await pollVfxStatus(taskId, 1, intervalMs);
          
          // Calculate progress based on polling attempt
          lastProgress = 10 + Math.min(85, (i / maxAttempts) * 85);
          setProgress(lastProgress, `Processing... (${i + 1}/${maxAttempts})`);
          
          if (statusResult.data?.status === 'COMPLETED') {
            const generated = statusResult.data?.generated || [];
            complete('VFX processing complete');
            update({
              outputVideo: generated[0] || null,
              outputVideos: generated,
              outputError: null,
            });
            return;
          }
          
          if (statusResult.data?.status === 'FAILED') {
            throw new Error('VFX processing failed');
          }
        }
        
        throw new Error('VFX polling timeout');
      } else if (result.data?.generated?.length) {
        complete('Done');
        update({
          outputVideo: result.data.generated[0],
          outputVideos: result.data.generated,
          outputError: null,
        });
      } else {
        complete('No video generated');
      }
    } catch (err) {
      console.error('VFX generation error:', err);
      fail(err);
      update({ outputError: err.message });
    }
  }, [id, data, update, localFilterType, localFps, localBloomContrast, localMotionKernelSize, localMotionDecayFactor, start, setProgress, complete, fail]);

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

  const ACCENT = '#14b8a6'; // Teal for video

  // ── Render ──

  return (
    <NodeShell data={data}
      label={data.label || 'Video FX'}
      dotColor={ACCENT}
      selected={selected}
      onGenerate={handleGenerate}
      isGenerating={isActive}
      downloadUrl={data.outputVideo || undefined}
      downloadType="video"
    >

      {/* ── Video Output Handle (top) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        marginBottom: 4,
      }}>
        <span style={{ fontSize: 10, color: '#999', marginRight: 4 }}>video</span>
        <Handle type="source" position={Position.Right} id="output-video" style={{
          width: 10, height: 10, borderRadius: '50%',
          background: getHandleColor('output-video'), border: 'none',
          position: 'relative', right: -12, transform: 'none',
        }} />
      </div>

      {/* ── 1. Video Input ── */}
      {sectionHeader('Input Video', 'video-in', 'target', getHandleColor('video-in'),
        hasVideoConnection ? linkedBadges('video-in') : null
      )}
      {hasVideoConnection ? connectionInfoBox(videoConnection) : (
        <input type="text" 
          className="nodrag nopan"
          value={data.localVideo || ''}
          onChange={(e) => update({ localVideo: e.target.value })}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          placeholder="Video URL..."
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '6px 8px',
            outline: 'none', boxSizing: 'border-box',
          }} />
      )}

      {/* ── 2. Settings ── */}
      <div style={{
        background: '#1a1a1a', borderRadius: 8, border: '1px solid #3a3a3a',
        padding: 12, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          VFX Settings
        </div>

        {/* Filter Type */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Filter Type</div>
          <select 
            className="nodrag nopan"
            value={localFilterType} 
            onChange={(e) => update({ localFilterType: Number(e.target.value) })}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              width: '100%', background: '#111', border: '1px solid #3a3a3a',
              borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '6px 8px',
              outline: 'none', boxSizing: 'border-box',
            }}>
            {FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>

        {/* Output FPS */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#999' }}>Output FPS</span>
            <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localFps}</span>
          </div>
          <div className="nodrag nopan" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onMouseDown={e => e.stopPropagation()}>
            <span style={{ fontSize: 9, color: '#555', minWidth: 14, textAlign: 'right' }}>1</span>
            <input type="range" min={1} max={60} step={1} value={localFps}
              onChange={(e) => update({ localFps: Number(e.target.value) })}
              onMouseDown={e => e.stopPropagation()}
              style={{ flex: 1, accentColor: ACCENT }} />
            <span style={{ fontSize: 9, color: '#555', minWidth: 14 }}>60</span>
          </div>
        </div>

        {/* Conditional Controls */}
        {localFilterType === 7 && (
          <div style={{ marginBottom: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#999' }}>Bloom Contrast</span>
              <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localBloomContrast}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 9, color: '#555', minWidth: 14, textAlign: 'right' }}>0</span>
              <input type="range" min={0} max={100} step={1} value={localBloomContrast}
                onChange={(e) => update({ localBloomContrast: Number(e.target.value) })}
                style={{ flex: 1, accentColor: ACCENT }} />
              <span style={{ fontSize: 9, color: '#555', minWidth: 14 }}>100</span>
            </div>
          </div>
        )}

        {localFilterType === 2 && (
          <>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#999' }}>Motion Kernel Size</span>
                <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localMotionKernelSize}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 9, color: '#555', minWidth: 14, textAlign: 'right' }}>1</span>
                <input type="range" min={1} max={100} step={1} value={localMotionKernelSize}
                  onChange={(e) => update({ localMotionKernelSize: Number(e.target.value) })}
                  style={{ flex: 1, accentColor: ACCENT }} />
                <span style={{ fontSize: 9, color: '#555', minWidth: 14 }}>100</span>
              </div>
            </div>
            <div style={{ marginBottom: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#999' }}>Motion Decay Factor</span>
                <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localMotionDecayFactor}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 9, color: '#555', minWidth: 14, textAlign: 'right' }}>0</span>
                <input type="range" min={0} max={1} step={0.05} value={localMotionDecayFactor}
                  onChange={(e) => update({ localMotionDecayFactor: Number(e.target.value) })}
                  style={{ flex: 1, accentColor: ACCENT }} />
                <span style={{ fontSize: 9, color: '#555', minWidth: 14 }}>1</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── 3. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Processed Video</span>
        </div>
      </div>

      {/* Progress indicator */}
      {isActive && (
        <NodeProgress
          progress={progress}
          status={status}
          message={message}
        />
      )}

      <div style={{
        background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
        minHeight: 120, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        {isActive ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, border: '3px solid #3a3a3a',
              borderTop: `3px solid ${ACCENT}`, borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <span style={{ fontSize: 10, color: '#999' }}>Processing video...</span>
          </div>
        ) : data.outputVideo ? (
          <video src={data.outputVideo} autoPlay loop muted controls style={{ width: '100%', display: 'block', borderRadius: 6 }} />
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', padding: 12, textAlign: 'center', wordBreak: 'break-word' }}>{data.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', padding: 16, textAlign: 'center' }}>Processed video will appear here</span>
        )}
      </div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </NodeShell>
  );
}
