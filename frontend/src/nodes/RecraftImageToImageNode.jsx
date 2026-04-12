import { useCallback, useRef, useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  PromptInput,
  TextInput,
  Slider,
  OutputHandle,
  OutputPreview,
  useNodeConnections,
  CATEGORY_COLORS,
  getHandleColor,
  sp,
  font,
  text,
  surface,
  border,
  radius,
} from './shared';
import { recraftImageToImage } from '../utils/api';

const MODELS = ['recraftv3', 'recraftv3_vector'];

export default function RecraftImageToImageNode({ id, data, selected }) {
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const localModel = data.model || 'recraftv3';
  const localStyle = data.style || '';

  const imageConn = conn('image-in');
  const promptConn = conn('prompt-in');

  const handleGenerate = useCallback(async () => {
    const prompt = resolve.text('prompt-in', data.inputPrompt);
    let images = resolve.image('image-in', data.localImage);
    const image_url = images?.[0];

    if (!prompt || !image_url) return;

    setIsGenerating(true);
    setError(null);
    update({ outputImage: null, outputError: null });

    try {
      const params = {
        prompt,
        image_url,
        model: localModel,
        strength: data.strength !== undefined ? data.strength : 0.2,
      };
      
      if (localStyle) {
        params.style = localStyle;
      }
      
      const numImages = data.resolveInput?.(id, 'num-images-in') || data.numImages || 1;
      if (numImages) params.n = numImages;

      const result = await recraftImageToImage(params);
      
      if (result.data && result.data.length > 0) {
        update({
          outputImage: result.data[0].url,
          outputImages: result.data.map(d => d.url),
          inputPrompt: prompt,
        });
      } else {
        throw new Error('No images generated');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message);
      update({ outputError: err.message });
    } finally {
      setIsGenerating(false);
    }
  }, [id, data, update, localModel, localStyle, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  const ACCENT = CATEGORY_COLORS.imageEditing;

  return (
    <NodeShell data={data}
      label="Recraft Img2Img"
      dotColor={ACCENT}
      selected={selected}
      onGenerate={handleGenerate}
      isGenerating={isGenerating} onDisconnect={disconnectNode}
    >
      <OutputHandle label="image" id="output" color={getHandleColor('output')} />

      <SectionHeader 
        label="Input Image" 
        handleId="image-in" 
        handleType="target" 
        color={getHandleColor('image-in')}
        isConnected={imageConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'image-in')}
      />
      <ConnectedOrLocal connected={imageConn.connected} connInfo={imageConn.info}>
        <ImageUploadBox
          image={data.localImage || null}
          onImageChange={(v) => update({ localImage: v })}
          placeholder="Upload source image"
        />
      </ConnectedOrLocal>

      <SectionHeader 
        label="Prompt" 
        handleId="prompt-in" 
        handleType="target" 
        color={getHandleColor('prompt-in')}
        isConnected={promptConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'prompt-in')}
      />
      <ConnectedOrLocal connected={promptConn.connected} connInfo={promptConn.info}>
        <PromptInput
          value={data.inputPrompt || ''}
          onChange={(v) => update({ inputPrompt: v })}
          placeholder="Describe areas to change..."
        />
      </ConnectedOrLocal>

      <SectionHeader label="Configuration" />
      <div style={{ marginBottom: sp[4], display: 'flex', flexDirection: 'column', gap: sp[2] }}>
        <Slider
          label="Strength"
          value={data.strength !== undefined ? data.strength : 0.2}
          onChange={(v) => update({ strength: v })}
          min={0} max={1} step={0.05}
          accentColor={ACCENT}
        />
        
        <div>
          <div style={{ ...font.xs, color: text.muted, marginBottom: 4 }}>Model</div>
          <select 
            className="nodrag nopan"
            value={localModel}
            onChange={(e) => update({ model: e.target.value })}
            style={{
              width: '100%', padding: '4px 8px', borderRadius: radius.md,
              background: surface.deep, border: `1px solid ${border.default}`,
              color: text.primary, ...font.sm
            }}
          >
            {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        
        <div>
          <div style={{ ...font.xs, color: text.muted, marginBottom: 4 }}>Style (Optional)</div>
          <TextInput 
            value={localStyle}
            onChange={(v) => update({ style: v })}
            placeholder="e.g. Photorealism, Vector art"
          />
        </div>
      </div>

      {error && <div style={{ ...font.xs, color: '#ef4444', marginBottom: sp[2] }}>{error}</div>}

      <OutputPreview image={data.outputImage} label="Variated Output" accentColor={ACCENT} />
    </NodeShell>
  );
}

import ImageUploadBox from './ImageUploadBox';
