import { useCallback, useRef, useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  PromptInput,
  TextInput,
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
import { generateRecraftImage } from '../utils/api';

const MODELS = [
  'recraftv4', 'recraftv4_vector', 'recraftv4_pro', 'recraftv4_pro_vector',
  'recraftv3', 'recraftv3_vector', 'recraftv2', 'recraftv2_vector'
];

export default function RecraftGenerateNode({ id, data, selected }) {
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const localModel = data.model || 'recraftv4';
  const localSize = data.size || '1:1';
  const localStyle = data.style || '';

  const promptConn = conn('prompt-in');
  const sizeConn = conn('size-in');
  const numImagesConn = conn('num-images-in');

  const handleGenerate = useCallback(async () => {
    const prompt = resolve.text('prompt-in', data.inputPrompt);
    if (!prompt) return;

    setIsGenerating(true);
    setError(null);
    update({ outputImage: null, outputError: null });

    try {
      const params = {
        prompt,
        model: localModel,
        size: resolve.text('size-in', localSize),
      };
      
      // V3 and V2 support style
      if (localStyle && !localModel.includes('v4')) {
        params.style = localStyle;
      }
      
      const numImages = resolve.text('num-images-in', data.numImages || 1);
      if (numImages) params.n = Number(numImages);

      const result = await generateRecraftImage(params);
      
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
  }, [id, data, update, localModel, localSize, localStyle, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  const ACCENT = CATEGORY_COLORS.imageGeneration;

  return (
    <NodeShell data={data}
      label="Recraft Gen"
      dotColor={ACCENT}
      selected={selected}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      downloadUrl={data.outputImage || undefined} onDisconnect={disconnectNode}
    >
      <OutputHandle label="image" id="output" color={getHandleColor('output')} />

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
          placeholder="Describe your image..."
        />
      </ConnectedOrLocal>

      <SectionHeader label="Configuration" />
      <div style={{ marginBottom: sp[4], display: 'flex', flexDirection: 'column', gap: sp[2] }}>
        <div>
          <div style={{ ...font.xs, color: text.muted, marginBottom: 4 }}>Model</div>
          <select 
            className="nodrag nopan"
            value={localModel}
            onChange={(e) => update({ model: e.target.value })}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              width: '100%', padding: '4px 8px', borderRadius: radius.md,
              background: surface.deep, border: `1px solid ${border.default}`,
              color: text.primary, ...font.sm
            }}
          >
            {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        
        <SectionHeader 
          label="Size (e.g. 1024x1024 or 16:9)" 
          handleId="size-in" 
          handleType="target" 
          color={getHandleColor('size-in')}
          isConnected={sizeConn.connected}
          onUnlink={() => data.onUnlink?.(id, 'size-in')}
          mini
        />
        <ConnectedOrLocal connected={sizeConn.connected} connInfo={sizeConn.info}>
          <TextInput 
            value={localSize}
            onChange={(v) => update({ size: v })}
          />
        </ConnectedOrLocal>

        {!localModel.includes('v4') && (
          <div>
            <div style={{ ...font.xs, color: text.muted, marginBottom: 4 }}>Style (Optional)</div>
            <TextInput 
              value={localStyle}
              onChange={(v) => update({ style: v })}
              placeholder="e.g. Photorealism, Vector art"
            />
          </div>
        )}
        
        <SectionHeader 
          label="Images (1-6)" 
          handleId="num-images-in" 
          handleType="target" 
          color={getHandleColor('num-images-in')}
          isConnected={numImagesConn.connected}
          onUnlink={() => data.onUnlink?.(id, 'num-images-in')}
          mini
        />
        <ConnectedOrLocal connected={numImagesConn.connected} connInfo={numImagesConn.info}>
          <TextInput 
            type="number"
            value={String(data.numImages || 1)}
            onChange={(v) => update({ numImages: parseInt(v) })}
          />
        </ConnectedOrLocal>
      </div>

      {error && <div style={{ ...font.xs, color: '#ef4444', marginBottom: sp[2] }}>{error}</div>}

      <OutputPreview output={data.outputImage} label="Recraft Output" accentColor={ACCENT} isLoading={isGenerating} />
    </NodeShell>
  );
}
