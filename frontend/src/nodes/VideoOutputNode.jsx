import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { CATEGORY_COLORS, sp, radius, surface, text } from './nodeTokens';

export default function VideoOutputNode({ id, data, selected }) {
  const { disconnectNode } = useNodeConnections(id, data);
  const videoUrl = data.resolveInput?.(id, 'video-in') || data.outputVideo;

  return (
    <NodeShell
      label={data.label || 'Video Output'}
      dotColor={CATEGORY_COLORS.videoGeneration}
      selected={selected}
      onDisconnect={disconnectNode}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: sp[3] }}>
        <Handle
          type="target"
          position={Position.Left}
          id="video-in"
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('video-in'), border: 'none',
            position: 'relative', left: -12, transform: 'none',
          }}
        />
        <span style={{ fontSize: 10, color: text.muted, marginLeft: sp[1] }}>video input</span>
      </div>

      <div style={{
        minHeight: 180,
        background: surface.sunken,
        borderRadius: radius.md,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${surface.deep}`
      }}>
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            muted
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        ) : (
          <div style={{ fontSize: 10, color: text.muted, textAlign: 'center', padding: sp[5] }}>
            {data.isLoading ? 'Generating...' : 'No video connected'}
          </div>
        )}
      </div>

      {videoUrl && (
        <div style={{ marginTop: sp[3], display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => {
              const a = document.createElement('a');
              a.href = videoUrl;
              a.download = 'generated-video.mp4';
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
