import React, { useCallback, useEffect, useRef } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
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
import type { ChangeCameraNodeData } from '../types';

export default function ChangeCameraNode({ id, data, selected }: NodeProps<Node<ChangeCameraNodeData>>) {
  const nodeData = data;
  const { isActive, start, complete, fail } = useNodeProgress();
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, nodeData);

  const localHorizontal = nodeData.localHorizontal ?? 0;
  const localVertical = nodeData.localVertical ?? 0;
  const localZoom = nodeData.localZoom ?? 5;
  const localSeed = nodeData.localSeed ?? '';

  const imageConn = conn('image-in');

  const handleGenerate = useCallback(async () => {
    let images = resolve.image('image-in', nodeData.localImage);
    if (!images?.length) return;

    start();
    update({ outputImage: null, isLoading: true });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) imageBase64 = imageBase64.split(',')[1];

      const params: any = {
        image: imageBase64,
        horizontal_angle: localHorizontal,
        vertical_angle: localVertical,
        zoom: localZoom,
      };
      if (localSeed !== '' && localSeed !== undefined && localSeed !== null) {
        params.seed = Number(localSeed);
      }

      const result: any = await changeCamera(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail();
        return;
      }

      if (result.data?.task_id) {
        const status: any = await pollChangeCameraStatus(result.data.task_id);
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
    } catch (err: any) {
      console.error('Change camera error:', err);
      update({ isLoading: false, outputError: err.message });
      fail();
    }
  }, [id, nodeData, update, localHorizontal, localVertical, localZoom, localSeed, start, complete, fail, resolve]);

  const lastTrigger = useRef<number | null>(null);
  useEffect(() => {
    if (nodeData.triggerGenerate && nodeData.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = nodeData.triggerGenerate;
      handleGenerate();
    }
  }, [nodeData.triggerGenerate, handleGenerate]);

  const ACCENT = '#f59e0b';

  return (
    <NodeShell data={nodeData} label={nodeData.label || 'Change Camera'} dotColor={ACCENT} selected={selected} onDisconnect={disconnectNode} onGenerate={handleGenerate} isGenerating={isActive}>
      <OutputHandle id="output" label="image" color={getHandleColor('output')} />

      {/* ── 1. Image ── */}
      <SectionHeader 
        label="Image" 
        handleId="image-in" 
        handleType="target" 
        color={getHandleColor('image-in')}
        isConnected={imageConn.connected}
        onUnlink={() => nodeData.onUnlink?.(id, 'image-in')}
      />
      <ConnectedOrLocal connected={imageConn.connected} connInfo={imageConn.info}>
        <ImageUploadBox
          image={nodeData.localImage || nodeData.inputImagePreview || null}
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

      <div style={{ marginTop: 10 }}></div>

      <OutputPreview
        isLoading={isActive}
        output={nodeData.outputImage}
        error={nodeData.outputError}
        accentColor={ACCENT}
        label="Camera Changed Output"
      />
    </NodeShell>
  );
}
