import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import { getHandleColor } from '../utils/handleTypes';
import { textToIconGenerate, pollTextToIconStatus } from '../utils/api';
import useNodeProgress from '../hooks/useNodeProgress';

const STYLES = [
  { value: 'solid', label: 'Solid' },
  { value: 'outline', label: 'Outline' },
  { value: 'color', label: 'Color' },
  { value: 'flat', label: 'Flat' },
  { value: 'sticker', label: 'Sticker' },
];

const FORMATS = [
  { value: 'png', label: 'PNG' },
  { value: 'svg', label: 'SVG' },
];

export default function TextToIconNode({ id, data, selected }) {
  const { isActive, start, complete, fail } = useNodeProgress(id, data);

  const localStyle = data.localStyle || 'solid';
  const localFormat = data.localFormat || 'png';
  const localNumInferenceSteps = data.localNumInferenceSteps || 10;
  const localGuidanceScale = data.localGuidanceScale ?? 7;

  const update = useCallback(
    (patch) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback((handleId) => {
    return data.getConnectionInfo?.(id, handleId) || null;
  }, [id, data]);

  const promptConnection = getConnInfo('prompt-in');
  const hasPromptConnection = data.hasConnection?.(id, 'prompt-in');

  const handleGenerate = useCallback(async () => {
    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
    
    if (!prompt) return;

    start();
    update({ outputImage: null, isLoading: true });

    try {
      const params = {
        prompt,
        style: localStyle,
        format: localFormat,
        num_inference_steps: localNumInferenceSteps,
        guidance_scale: localGuidanceScale,
        isPreview: false,
      };

      const result = await textToIconGenerate(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail(result.error?.message || 'Generation failed');
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const status = await pollTextToIconStatus(taskId);
        const generated = status.data?.generated || [];
        update({
          outputImage: generated[0] || null,
          outputImages: generated,
          isLoading: false,
          outputError: null,
        });
        complete();
      } else if (result.data?.generated?.length) {
        update({
          outputImage: result.data.generated[0],
          outputImages: result.data.generated,
          isLoading: false,
          outputError: null,
        });
        complete();
      } else {
        update({ isLoading: false });
        complete();
      }
    } catch (err) {
      console.error('Icon generation error:', err);
      update({ isLoading: false, outputError: err.message });
      fail(err.message);
    }
  }, [id, data, update, localStyle, localFormat, localNumInferenceSteps, localGuidanceScale, start, complete, fail]);

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

  const pill = (label, isActive, onClick, activeColor) => (
    <button key={label} onClick={onClick} style={{
      flex: 1, padding: '4px 0', fontSize: 11, fontWeight: isActive ? 600 : 400,
      borderRadius: 6, cursor: 'pointer',
      background: isActive ? (activeColor || '#ec4899') : '#1a1a1a',
      color: isActive ? '#fff' : '#999',
      border: `1px solid ${isActive ? (activeColor || '#ec4899') : '#3a3a3a'}`,
    }}>{label}</button>
  );

  const ACCENT = '#ec4899'; // Pink for image generation

  // ── Render ──

  return (
    <NodeShell data={data} label={data.label || 'AI Icon Generation'} dotColor={ACCENT} selected={selected} onGenerate={handleGenerate} isGenerating={isActive}>

      {/* ── Image Output Handle (top) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        marginBottom: 4,
      }}>
        <span style={{ fontSize: 10, color: '#999', marginRight: 4 }}>image</span>
        <Handle type="source" position={Position.Right} id="output" style={{
          width: 10, height: 10, borderRadius: '50%',
          background: getHandleColor('output'), border: 'none',
          position: 'relative', right: -12, transform: 'none',
        }} />
      </div>

      {/* ── 1. Prompt (Required) ── */}
      {sectionHeader('Prompt (Required)', 'prompt-in', 'target', getHandleColor('prompt-in'),
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><ImprovePromptButton id={id} data={data} update={update} type="image" />{hasPromptConnection ? linkedBadges('prompt-in') : null}</div>
      )}
      {hasPromptConnection ? connectionInfoBox(promptConnection) : (
        <textarea value={data.inputPrompt || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder="e.g. A cute cat icon"
          rows={3}
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
          }} />
      )}

      {/* ── 2. Settings ── */}
      <div style={{
        background: '#1a1a1a', borderRadius: 8, border: '1px solid #3a3a3a',
        padding: 12, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          Icon Settings
        </div>

        {/* Style */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Style</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {STYLES.map((s) => pill(s.label, localStyle === s.value, () => update({ localStyle: s.value }), ACCENT))}
          </div>
        </div>

        {/* Format */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Format</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {FORMATS.map((f) => pill(f.label, localFormat === f.value, () => update({ localFormat: f.value }), ACCENT))}
          </div>
        </div>

        {/* Num Inference Steps */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#999' }}>Quality (Steps)</span>
            <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localNumInferenceSteps}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: '#555', minWidth: 14, textAlign: 'right' }}>10</span>
            <input type="range" min={10} max={50} step={1} value={localNumInferenceSteps}
              onChange={(e) => update({ localNumInferenceSteps: Number(e.target.value) })}
              style={{ flex: 1, accentColor: ACCENT }} />
            <span style={{ fontSize: 9, color: '#555', minWidth: 14 }}>50</span>
          </div>
        </div>

        {/* Guidance Scale */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#999' }}>Guidance Scale</span>
            <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localGuidanceScale}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: '#555', minWidth: 14, textAlign: 'right' }}>0</span>
            <input type="range" min={0} max={10} step={0.5} value={localGuidanceScale}
              onChange={(e) => update({ localGuidanceScale: Number(e.target.value) })}
              style={{ flex: 1, accentColor: ACCENT }} />
            <span style={{ fontSize: 9, color: '#555', minWidth: 14 }}>10</span>
          </div>
        </div>

      </div>

      {/* ── Progress ── */}
      <NodeProgress isActive={isActive} />

      {/* ── 3. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Generated Icon</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 10, color: '#999' }}>prompt</span>
          <Handle type="source" position={Position.Right} id="prompt-out" style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('prompt-out'), border: 'none',
            position: 'relative', right: -12, transform: 'none',
          }} />
        </div>
      </div>
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
            <span style={{ fontSize: 10, color: '#999' }}>Generating icon...</span>
          </div>
        ) : data.outputImage ? (
          <img src={data.outputImage} alt="Generated Icon" style={{ width: '100%', display: 'block', borderRadius: 6 }} />
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', padding: 12, textAlign: 'center', wordBreak: 'break-word' }}>{data.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', padding: 16, textAlign: 'center' }}>Generated icon will appear here</span>
        )}
      </div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </NodeShell>
  );
}