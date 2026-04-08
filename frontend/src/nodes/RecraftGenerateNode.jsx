import { useCallback, useRef, useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeShell from './NodeShell';
import { SectionHeader, ConnectedOrLocal } from './NodeSection';
import { PromptInput, PillGroup } from './NodeControls';
import { OutputHandle, OutputPreview } from './NodeOutput';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { CATEGORY_COLORS, sp, font, text, surface, border, radius } from './nodeTokens';
import { generateRecraftImage } from '../utils/api';

const MODELS = [
  'recraftv4', 'recraftv4_vector', 'recraftv4_pro', 'recraftv4_pro_vector',
  'recraftv3', 'recraftv3_vector', 'recraftv2', 'recraftv2_vector'
];

export default function RecraftGenerateNode({ id, data, selected }) {
  const { update } = useNodeConnections(id, data);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const localModel = data.model || 'recraftv4';
  const localSize = data.size || '1:1';
  const localStyle = data.style || '';

  const handleGenerate = useCallback(async () => {
    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt;
    if (!prompt) return;

    setIsGenerating(true);
    setError(null);
    update({ outputImage: null, outputError: null });

    try {
      const params = {
        prompt,
        model: localModel,
        size: data.resolveInput?.(id, 'size-in') || localSize,
      };
      
      // V3 and V2 support style
      if (localStyle && !localModel.includes('v4')) {
        params.style = localStyle;
      }
      
      const numImages = data.resolveInput?.(id, 'num-images-in') || data.numImages || 1;
      if (numImages) params.n = numImages;

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
  }, [id, data, update, localModel, localSize, localStyle]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <NodeShell data={data}
      label="Recraft Gen"
      dotColor={CATEGORY_COLORS.imageGeneration}
      selected={selected}
    >
      <SectionHeader title="Prompt" />
      <div style={{ position: 'relative', marginBottom: sp[4] }}>
        <Handle
          type="target"
          position={Position.Left}
          id="prompt-in"
          style={{ background: getHandleColor('prompt-in') }}
        />
        <PromptInput
          value={data.inputPrompt || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder="Describe your image..."
        />
      </div>

      <SectionHeader title="Configuration" />
      <div style={{ marginBottom: sp[4], display: 'flex', flexDirection: 'column', gap: sp[2] }}>
        <div>
          <div style={{ ...font.xs, color: text.muted, marginBottom: 4 }}>Model</div>
          <select 
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
        
        <div style={{ position: 'relative' }}>
          <Handle
            type="target"
            position={Position.Left}
            id="size-in"
            style={{ background: getHandleColor('size-in') }}
          />
          <div style={{ ...font.xs, color: text.muted, marginBottom: 4 }}>Size (e.g. 1024x1024 or 16:9)</div>
          <input 
            type="text"
            value={localSize}
            onChange={(e) => update({ size: e.target.value })}
            style={{
              width: '100%', padding: '4px 8px', borderRadius: radius.md,
              background: surface.deep, border: `1px solid ${border.default}`,
              color: text.primary, ...font.sm, boxSizing: 'border-box'
            }}
          />
        </div>

        {!localModel.includes('v4') && (
          <div>
            <div style={{ ...font.xs, color: text.muted, marginBottom: 4 }}>Style (Optional)</div>
            <input 
              type="text"
              value={localStyle}
              onChange={(e) => update({ style: e.target.value })}
              placeholder="e.g. Photorealism, Vector art"
              style={{
                width: '100%', padding: '4px 8px', borderRadius: radius.md,
                background: surface.deep, border: `1px solid ${border.default}`,
                color: text.primary, ...font.sm, boxSizing: 'border-box'
              }}
            />
          </div>
        )}
        
        <div style={{ position: 'relative' }}>
          <Handle
            type="target"
            position={Position.Left}
            id="num-images-in"
            style={{ background: getHandleColor('num-images-in') }}
          />
          <div style={{ ...font.xs, color: text.muted, marginBottom: 4 }}>Images (1-6)</div>
          <input 
            type="number"
            min="1" max="6"
            value={data.numImages || 1}
            onChange={(e) => update({ numImages: parseInt(e.target.value) })}
            style={{
              width: '100%', padding: '4px 8px', borderRadius: radius.md,
              background: surface.deep, border: `1px solid ${border.default}`,
              color: text.primary, ...font.sm, boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        style={{
          width: '100%', padding: '8px 16px', background: CATEGORY_COLORS.imageGeneration,
          color: '#fff', border: 'none', borderRadius: radius.md, cursor: isGenerating ? 'not-allowed' : 'pointer',
          fontWeight: 600, ...font.sm, marginBottom: sp[4]
        }}
      >
        {isGenerating ? 'Generating...' : 'Generate Image'}
      </button>

      {error && <div style={{ ...font.xs, color: '#ef4444', marginBottom: sp[2] }}>{error}</div>}

      <OutputHandle label="Output" id="output" />
      <OutputPreview image={data.outputImage} label="Recraft Output" />
    </NodeShell>
  );
}
