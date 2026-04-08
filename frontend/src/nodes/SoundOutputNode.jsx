import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { CATEGORY_COLORS, sp, radius, surface, text } from './nodeTokens';

export default function SoundOutputNode({ id, data, selected }) {
  const { disconnectNode } = useNodeConnections(id, data);
  const audioUrl = data.resolveInput?.(id, 'audio-in') || data.outputAudio;

  return (
    <NodeShell
      label={data.label || 'Sound Output'}
      dotColor={CATEGORY_COLORS.vision} // Using violet/vision for audio
      selected={selected}
      onDisconnect={disconnectNode}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: sp[3] }}>
        <Handle
          type="target"
          position={Position.Left}
          id="audio-in"
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('audio-in'), border: 'none',
            position: 'relative', left: -12, transform: 'none',
          }}
        />
        <span style={{ fontSize: 10, color: text.muted, marginLeft: sp[1] }}>audio input</span>
      </div>

      <div style={{
        background: surface.sunken,
        borderRadius: radius.md,
        padding: sp[4],
        border: `1px solid ${surface.deep}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: sp[3]
      }}>
        <div style={{ padding: sp[2] }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        </div>
        
        {audioUrl ? (
          <audio
            src={audioUrl}
            controls
            style={{ width: '100%', height: '32px' }}
          />
        ) : (
          <div style={{ fontSize: 10, color: text.muted }}>
             {data.isLoading ? 'Generating...' : 'No sound connected'}
          </div>
        )}
      </div>

      {audioUrl && (
        <div style={{ marginTop: sp[3], display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => {
              const a = document.createElement('a');
              a.href = audioUrl;
              a.download = 'generated-audio.mp3';
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
