import { useCallback, useRef, useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeShell from './NodeShell';
import { SectionHeader, ConnectedOrLocal } from './NodeSection';
import { PromptInput, Slider } from './NodeControls';
import { OutputHandle, OutputPreview } from './NodeOutput';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { CATEGORY_COLORS, sp, font, text, surface, border, radius } from './nodeTokens';
import { recraftImageToImage } from '../utils/api';

const MODELS = ['recraftv3', 'recraftv3_vector'];

export default function RecraftImageToImageNode({ id, data, selected }) {
  const { update } = useNodeConnections(id, data);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const localModel = data.model || 'recraftv3';
  const localStyle = data.style || '';

  const handleGenerate = useCallback(async () => {
    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt;
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];
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
  }, [id, data, update, localModel, localStyle]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <NodeShell
      label="Recraft Img2Img"
      dotColor={CATEGORY_COLORS.imageEditing}
      selected={selected}
    >
      <SectionHeader title="Input Image" />
      <div style={{ position: 'relative', marginBottom: sp[4] }}>
        <Handle
          type="target"
          position={Position.Left}
          id="image-in"
          style={{ background: getHandleColor('image-in') }}
        />
        <ConnectedOrLocal
          nodeId={id}
          handleId="image-in"
          data={data}
          localValue={data.localImage}
          onLocalChange={(v) => update({ localImage: v })}
          type="image"
        />
      </div>

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
          placeholder="Describe areas to change..."
        />
      </div>

      <SectionHeader title="Configuration" />
      <div style={{ marginBottom: sp[4], display: 'flex', flexDirection: 'column', gap: sp[2] }}>
        <Slider
          label="Strength (0=identical, 1=new)"
          value={data.strength !== undefined ? data.strength : 0.2}
          onChange={(v) => update({ strength: v })}
          min={0} max={1} step={0.05}
        />
        
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
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        style={{
          width: '100%', padding: '8px 16px', background: CATEGORY_COLORS.imageEditing,
          color: '#fff', border: 'none', borderRadius: radius.md, cursor: isGenerating ? 'not-allowed' : 'pointer',
          fontWeight: 600, ...font.sm, marginBottom: sp[4]
        }}
      >
        {isGenerating ? 'Processing...' : 'Variate Image'}
      </button>

      {error && <div style={{ ...font.xs, color: '#ef4444', marginBottom: sp[2] }}>{error}</div>}

      <OutputHandle label="Output" id="output" />
      <OutputPreview image={data.outputImage} label="Variated Output" />
    </NodeShell>
  );
}
