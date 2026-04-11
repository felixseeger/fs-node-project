import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  Pill,
  Slider,
  OutputHandle,
  OutputPreview,
  useNodeConnections,
  getHandleColor,
} from './shared';
import { skinEnhancer, pollSkinEnhancerStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import useNodeProgress from '../hooks/useNodeProgress';

const MODES = [
  { value: 'creative', label: 'Creative', desc: 'Artistic stylized' },
  { value: 'faithful', label: 'Faithful', desc: 'Natural preservation' },
  { value: 'flexible', label: 'Flexible', desc: 'Targeted optimization' },
];

const OPTIMIZED_FOR = [
  { value: 'enhance_skin', label: 'Enhance Skin' },
  { value: 'improve_lighting', label: 'Improve Lighting' },
  { value: 'enhance_everything', label: 'Enhance Everything' },
  { value: 'transform_to_real', label: 'Transform to Real' },
  { value: 'no_make_up', label: 'No Makeup' },
];

export default function SkinEnhancerNode({ id, data, selected }) {
  const { start, complete, fail } = useNodeProgress('skin-enhancer');
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localMode = data.localMode || 'faithful';
  const localSharpen = data.localSharpen ?? 0;
  const localSmartGrain = data.localSmartGrain ?? 2;
  const localSkinDetail = data.localSkinDetail ?? 80;
  const localOptimizedFor = data.localOptimizedFor || 'enhance_skin';

  const imageConn = conn('image-in');

  const handleEnhance = useCallback(async () => {
    let images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    start();
    update({ outputImage: null, isLoading: true });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) imageBase64 = imageBase64.split(',')[1];

      const params = { image: imageBase64 };
      if (localSharpen !== 0) params.sharpen = localSharpen;
      if (localSmartGrain !== 2) params.smart_grain = localSmartGrain;
      if (localMode === 'faithful' && localSkinDetail !== 80) params.skin_detail = localSkinDetail;
      if (localMode === 'flexible' && localOptimizedFor !== 'enhance_skin') params.optimized_for = localOptimizedFor;

      const result = await skinEnhancer(localMode, params);

      if (result.error) {
        fail(result.error?.message || JSON.stringify(result.error));
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      if (result.data?.task_id) {
        const status = await pollSkinEnhancerStatus(result.data.task_id);
        const generated = status.data?.generated || [];
        complete();
        update({
          outputImage: generated[0] || null,
          outputImages: generated,
          isLoading: false,
          outputError: null,
        });
      } else if (result.data?.generated?.length) {
        complete();
        update({
          outputImage: result.data.generated[0],
          outputImages: result.data.generated,
          isLoading: false,
          outputError: null,
        });
      } else {
        complete();
        update({ isLoading: false });
      }
    } catch (err) {
      console.error('Skin enhancer error:', err);
      fail(err.message);
      update({ isLoading: false, outputError: err.message });
    }
  }, [id, data, update, localMode, localSharpen, localSmartGrain, localSkinDetail, localOptimizedFor, start, complete, fail, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleEnhance();
    }
  }, [data.triggerGenerate, handleEnhance]);

  const ACCENT = '#e879f9';

  return (
    <NodeShell data={data} label={data.label || 'Skin Enhancer'} dotColor={ACCENT} selected={selected} onGenerate={handleEnhance} isGenerating={data.isLoading}>
      <OutputHandle id="output" label="image" color={getHandleColor('output')} />

      {/* ── 1. Image ── */}
      <SectionHeader 
        label="Image" 
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
          placeholder="Click or drag to upload portrait image"
        />
      </ConnectedOrLocal>

      {/* ── 2. Mode Selector ── */}
      <div style={{ marginTop: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Enhancement Mode</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        {MODES.map((m) => (
          <button 
            key={m.value} 
            className="nodrag nopan"
            onClick={() => update({ localMode: m.value })} 
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              flex: 1, padding: '8px 6px', fontSize: 11, textAlign: 'center',
              borderRadius: 8, border: 'none', cursor: 'pointer',
              background: localMode === m.value ? 'rgba(232,121,249,0.15)' : '#1a1a1a',
              borderLeft: localMode === m.value ? `3px solid ${ACCENT}` : '3px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontWeight: localMode === m.value ? 600 : 400, color: localMode === m.value ? '#e0e0e0' : '#999', marginBottom: 2 }}>
              {m.label}
            </div>
            <div style={{ fontSize: 9, color: '#666' }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* ── 3. Common Controls ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)',
        padding: 10, marginTop: 8,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 8 }}>
          Enhancement Controls
        </div>
        <Slider label="Sharpen" value={localSharpen} onChange={(v) => update({ localSharpen: v })} min={0} max={100} accentColor={ACCENT} />
        <Slider label="Smart Grain" value={localSmartGrain} onChange={(v) => update({ localSmartGrain: v })} min={0} max={100} accentColor={ACCENT} />

        {/* Faithful-only: Skin Detail */}
        {localMode === 'faithful' && (
          <Slider label="Skin Detail" value={localSkinDetail} onChange={(v) => update({ localSkinDetail: v })} min={0} max={100} accentColor={ACCENT} />
        )}

        {/* Flexible-only: Optimized For */}
        {localMode === 'flexible' && (
          <>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#999', marginTop: 8, marginBottom: 6 }}>
              Optimized For
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {OPTIMIZED_FOR.map((o) => (
                <Pill key={o.value} label={o.label} isActive={localOptimizedFor === o.value} onClick={() => update({ localOptimizedFor: o.value })} accentColor={ACCENT} />
              ))}
            </div>
          </>
        )}
      </div>

      <OutputPreview
        isLoading={data.isLoading}
        output={data.outputImage}
        error={data.outputError}
        accentColor={ACCENT}
        label="Enhanced Output"
      />
    </NodeShell>
  );
}
