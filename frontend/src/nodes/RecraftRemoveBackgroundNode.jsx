import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeShell from './NodeShell';
import { SectionHeader, ConnectedOrLocal } from './NodeSection';
import { OutputHandle, OutputPreview } from './NodeOutput';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { NodeCapabilities } from './nodeCapabilities';
import { CATEGORY_COLORS, sp, font, radius } from './nodeTokens';
import { recraftRemoveBackground } from '../utils/api';

export default function RecraftRemoveBackgroundNode({ id, data, selected }) {
  const { update, disconnectNode } = useNodeConnections(id, data);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleProcess = useCallback(async () => {
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];
    const image_url = images?.[0];
    
    if (!image_url) return;

    setIsProcessing(true);
    setError(null);
    update({ outputImage: null, outputError: null });

    try {
      const result = await recraftRemoveBackground({ image_url });
      if (result.image && result.image.url) {
        update({ outputImage: result.image.url });
      } else {
        throw new Error('No image returned');
      }
    } catch (err) {
      console.error('Remove BG error:', err);
      setError(err.message);
      update({ outputError: err.message });
    } finally {
      setIsProcessing(false);
    }
  }, [id, data, update]);

  return (
    <NodeShell data={data}
      label="Recraft Remove BG"
      dotColor={CATEGORY_COLORS.imageEditing}
      selected={selected}
      downloadUrl={data.outputImage || undefined} onDisconnect={disconnectNode}
      capabilities={[NodeCapabilities.IMAGE_REMOVE_BACKGROUND, NodeCapabilities.OUTPUT_IMAGE]}
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

      <button
        onClick={handleProcess}
        disabled={isProcessing}
        style={{
          width: '100%', padding: '8px 16px', background: CATEGORY_COLORS.imageEditing,
          color: '#fff', border: 'none', borderRadius: radius.md, cursor: isProcessing ? 'not-allowed' : 'pointer',
          fontWeight: 600, ...font.sm, marginBottom: sp[4]
        }}
      >
        {isProcessing ? 'Processing...' : 'Remove Background'}
      </button>

      {error && <div style={{ ...font.xs, color: '#ef4444', marginBottom: sp[2] }}>{error}</div>}

      <OutputHandle label="Output" id="output" />
      <OutputPreview output={data.outputImage} label="No BG Output" isLoading={isProcessing} />
    </NodeShell>
  );
}
