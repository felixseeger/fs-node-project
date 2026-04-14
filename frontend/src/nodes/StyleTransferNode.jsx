import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import { useNodeConnections, CATEGORY_COLORS } from './shared';
import { getHandleColor } from '../utils/handleTypes';
import { NodeCapabilities } from './nodeCapabilities';
import { styleTransfer, pollStyleTransferStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import useNodeProgress from '../hooks/useNodeProgress';


export default function StyleTransferNode({ id, data, selected }) {
  const { onDisconnectNode } = useNodeConnections();
  const { isActive, start, complete, fail } = useNodeProgress();
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localStrength = data.localStrength ?? 50;

  const imageConn = conn('image-in');
  const refConn = conn('reference-in');
  const promptConn = conn('prompt-in');

  const handleTransfer = useCallback(async () => {
    let images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    let refImages = resolve.image('reference-in', data.localRefImage);
    if (!refImages?.length) return;

    start();
    update({ outputImage: null, isLoading: true });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) imageBase64 = imageBase64.split(',')[1];

      let refBase64 = refImages[0];
      if (refBase64.startsWith('data:')) refBase64 = refBase64.split(',')[1];

      const prompt = resolve.text('prompt-in', data.inputPrompt);

      const params = {
        image: imageBase64,
        reference_image: refBase64,
        strength: localStrength,
      };
      if (prompt) params.prompt = prompt;

      const result = await styleTransfer(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail();
        return;
      }

      if (result.data?.task_id) {
        const status = await pollStyleTransferStatus(result.data.task_id);
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
      console.error('Style transfer error:', err);
      update({ isLoading: false, outputError: err.message });
      fail();
    }
  }, [id, data, update, localStrength, start, complete, fail, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleTransfer();
    }
  }, [data.triggerGenerate, handleTransfer]);

  const ACCENT = CATEGORY_COLORS.imageEditing;

  return (
    <NodeShell data={data} label={data.label || 'Style Transfer'} dotColor={ACCENT} selected={selected} onGenerate={handleTransfer} isGenerating={isActive} downloadUrl={data.outputImage || undefined} onDisconnect={onDisconnectNode} capabilities={[NodeCapabilities.IMAGE_STYLE_TRANSFER, NodeCapabilities.OUTPUT_IMAGE]}>
      <OutputHandle id="output" label="image" color={getHandleColor('output')} />

      {/* ── 1. Image ── */}
      <SectionHeader 
        label="Target Image" 
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
          placeholder="Source to transform"
        />
      </ConnectedOrLocal>

      {/* ── 2. Reference ── */}
      <SectionHeader 
        label="Style Reference" 
        handleId="reference-in" 
        handleType="target" 
        color={getHandleColor('image-in')}
        isConnected={refConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'reference-in')}
      />
      <ConnectedOrLocal connected={refConn.connected} connInfo={refConn.info}>
        <ImageUploadBox
          image={data.localRefImage || null}
          onImageChange={(img) => update({ localRefImage: img })}
          placeholder="Style to copy"
          minHeight={50}
        />
      </ConnectedOrLocal>

      {/* ── 3. Prompt ── */}
      <SectionHeader 
        label="Prompt (optional)" 
        handleId="prompt-in" 
        handleType="target" 
        color={getHandleColor('prompt-in')}
        isConnected={promptConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'prompt-in')}
        extra={<ImprovePromptButton id={id} data={data} update={update} type="image" />}
      />
      <ConnectedOrLocal connected={promptConn.connected} connInfo={promptConn.info}>
        <PromptInput
          value={data.inputPrompt || ''}
          onChange={(v) => update({ inputPrompt: v })}
          placeholder="Guide the style transfer..."
          rows={2}
        />
      </ConnectedOrLocal>

      {/* ── 4. Settings ── */}
      <div style={{ marginTop: 10 }}>
        <Slider label="Strength" value={localStrength} onChange={(v) => update({ localStrength: v })} min={0} max={100} accentColor={ACCENT} />
      </div>

      <NodeProgress isActive={isActive} />

      <OutputPreview
        isLoading={isActive}
        output={data.outputImage}
        error={data.outputError}
        accentColor={ACCENT}
        label="Transferred Output"
      />
    </NodeShell>
  );
}

import NodeProgress from './NodeProgress';
