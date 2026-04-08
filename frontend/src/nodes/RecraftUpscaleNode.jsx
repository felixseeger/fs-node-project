import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeShell from './NodeShell';
import { SectionHeader, ConnectedOrLocal } from './NodeSection';
import { OutputHandle, OutputPreview } from './NodeOutput';
import { PillGroup } from './NodeControls';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { CATEGORY_COLORS, sp, font, radius } from './nodeTokens';
import { recraftUpscale } from '../utils/api';

export default function RecraftUpscaleNode({ id, data, selected }) {
  const { update } = useNodeConnections(id, data);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const localType = data.type || 'crisp';

  const handleProcess = useCallback(async () => {
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];
    const image_url = images?.[0];
    
    if (!image_url) return;

    setIsProcessing(true);
    setError(null);
    update({ outputImage: null, outputError: null });

    try {
      const result = await recraftUpscale({ image_url, type: localType });
      if (result.image && result.image.url) {
        update({ outputImage: result.image.url });
      } else {
        throw new Error('No image returned');
      }
    } catch (err) {
      console.error('Upscale error:', err);
      setError(err.message);
      update({ outputError: err.message });
    } finally {
      setIsProcessing(false);
    }
  }, [id, data, update, localType]);

  return (
    <NodeShell data={data}
      label="Recraft Upscale"
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

      <SectionHeader title="Upscale Type" />
      <PillGroup
        options={[
          { label: 'Crisp', value: 'crisp' },
          { label: 'Creative', value: 'creative' }
        ]}
        value={localType}
        onChange={(v) => update({ type: v })}
      />

      <button
        onClick={handleProcess}
        disabled={isProcessing}
        style={{
          width: '100%', padding: '8px 16px', background: CATEGORY_COLORS.imageEditing,
          color: '#fff', border: 'none', borderRadius: radius.md, cursor: isProcessing ? 'not-allowed' : 'pointer',
          fontWeight: 600, ...font.sm, marginBottom: sp[4], marginTop: sp[2]
        }}
      >
        {isProcessing ? 'Processing...' : 'Upscale'}
      </button>

      {error && <div style={{ ...font.xs, color: '#ef4444', marginBottom: sp[2] }}>{error}</div>}

      <OutputHandle label="Output" id="output" />
      <OutputPreview image={data.outputImage} label="Upscaled Output" />
    </NodeShell>
  );
}
