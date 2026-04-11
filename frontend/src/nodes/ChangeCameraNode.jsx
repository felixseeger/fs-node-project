import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  TextInput,
  Slider,
  OutputHandle,
  OutputPreview,
  useNodeConnections,
  getHandleColor,
} from './shared';
import { changeCamera, pollChangeCameraStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import useNodeProgress from '../hooks/useNodeProgress';

export default function ChangeCameraNode({ id, data, selected }) {
  const { isActive, start, complete, fail } = useNodeProgress();
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localHorizontal = data.localHorizontal ?? 0;
  const localVertical = data.localVertical ?? 0;
  const localZoom = data.localZoom ?? 5;
  const localSeed = data.localSeed ?? '';

  const imageConn = conn('image-in');

  const handleGenerate = useCallback(async () => {
    let images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    start();
    update({ outputImage: null, isLoading: true });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) imageBase64 = imageBase64.split(',')[1];

      const params = {
        image: imageBase64,
        horizontal_angle: localHorizontal,
        vertical_angle: localVertical,
        zoom: localZoom,
      };
      if (localSeed !== '' && localSeed !== undefined && localSeed !== null) {
        params.seed = Number(localSeed);
      }

      const result = await changeCamera(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail();
        return;
      }

      if (result.data?.task_id) {
        const status = await pollChangeCameraStatus(result.data.task_id);
        const generated = status.data?.generated || [];
        update({
          outputImage: generated[0] || null,
          outputImages: generated,
          isLoading: false,
          outputError: null,
        });
      } else if (result.data?.generated?.length) {
        update({
          outputImage: result.data.generated[0],
          outputImages: result.data.generated,
          isLoading: false,
          outputError: null,
        });
      } else {
        update({ isLoading: false });
      }
      complete();
    } catch (err) {
      console.error('Change camera error:', err);
      update({ isLoading: false, outputError: err.message });
      fail();
    }
  }, [id, data, update, localHorizontal, localVertical, localZoom, localSeed, start, complete, fail, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  const ACCENT = '#f59e0b';

  return (
    <NodeShell data={data} label={data.label || 'Change Camera'} dotColor={ACCENT} selected={selected} onGenerate={handleGenerate} isGenerating={isActive}>
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
          placeholder="Click or drag to upload image"
        />
      </ConnectedOrLocal>

      {/* ── 2. Settings ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
        padding: 12, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          Camera Settings
        </div>

        <Slider label="Horizontal" value={localHorizontal} onChange={(v) => update({ localHorizontal: v })} min={0} max={360} accentColor={ACCENT} />
        <Slider label="Vertical" value={localVertical} onChange={(v) => update({ localVertical: v })} min={-30} max={90} accentColor={ACCENT} />
        <Slider label="Zoom" value={localZoom} onChange={(v) => update({ localZoom: v })} min={0} max={10} step={0.1} accentColor={ACCENT} />

        <div style={{ marginTop: 10, marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Seed (optional)</span>
          </div>
          <TextInput
            type="number"
            value={String(localSeed)}
            onChange={(v) => update({ localSeed: v })}
            placeholder="Random if empty"
          />
        </div>
      </div>

      <NodeProgress isActive={isActive} />

      <OutputPreview
        isLoading={isActive}
        output={data.outputImage}
        error={data.outputError}
        accentColor={ACCENT}
        label="Camera Changed Output"
      />
    </NodeShell>
  );
}
