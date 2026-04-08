import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { CATEGORY_COLORS, sp, radius, surface, text } from './nodeTokens';

export default function ImageOutputNode({ id, data, selected }) {
  const { disconnectNode } = useNodeConnections(id, data);
  const imageUrl = data.resolveInput?.(id, 'image-in') || data.outputImage;

  return (
    <NodeShell
      label={data.label || 'Image Output'}
      dotColor={CATEGORY_COLORS.imageGeneration}
      selected={selected}
      onDisconnect={disconnectNode}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: sp[3] }}>
        <Handle
          type="target"
          position={Position.Left}
          id="image-in"
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('image-in'), border: 'none',
            position: 'relative', left: -12, transform: 'none',
          }}
        />
        <span style={{ fontSize: 10, color: text.muted, marginLeft: sp[1] }}>image input</span>
      </div>

      <div style={{
        minHeight: 100,
        background: surface.sunken,
        borderRadius: radius.md,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${surface.deep}`
      }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Generated"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        ) : (
          <div style={{ fontSize: 10, color: text.muted, textAlign: 'center', padding: sp[5] }}>
            {data.isLoading ? 'Generating...' : 'No image connected'}
          </div>
        )}
      </div>

      {imageUrl && (
        <div style={{ marginTop: sp[3], display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => {
              const a = document.createElement('a');
              a.href = imageUrl;
              a.download = 'generated-image.jpg';
              a.click();
            }}
            style={{
              background: surface.raised,
              border: 'none',
              borderRadius: radius.sm,
              color: text.primary,
              fontSize: 10,
              padding: '4px 8px',
              cursor: 'pointer'
            }}
          >
            Download
          </button>
        </div>
      )}
    </NodeShell>
  );
}
