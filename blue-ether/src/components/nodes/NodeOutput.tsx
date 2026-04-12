import { Position, Handle } from '@xyflow/react';
import { getHandleColor } from '../../utils/handleTypes';

export interface OutputHandleProps {
  id?: string;
  label?: string;
  type?: 'image' | 'video' | 'audio' | '3d';
  color?: string;
}

export function OutputHandle({ id = 'output', label, type = 'image', color }: OutputHandleProps) {
  const handleId =
    type === 'video' ? 'output-video' : type === 'audio' ? 'output-audio' : type === '3d' ? 'model-out' : id;
  const defaultLabel =
    type === 'video' ? 'Video' : type === 'audio' ? 'Audio' : type === '3d' ? '3D' : 'Image';
  const displayLabel = label ?? defaultLabel;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
      marginBottom: 'var(--be-space-xs)',
    }}>
      <span style={{ fontSize: 'var(--be-font-size-xs, 12px)', color: 'var(--be-text-secondary)', marginRight: 'var(--be-space-xs)' }}>{displayLabel}</span>
      <Handle
        type="source"
        position={Position.Right}
        id={handleId}
        style={{
          width: 10, height: 10, borderRadius: '50%',
          background: color || getHandleColor(handleId), border: 'none',
          position: 'relative', right: -12, transform: 'none',
        }}
      />
    </div>
  );
}

export interface SecondaryOutputHandleProps {
  id?: string;
}

export function SecondaryOutputHandle({ id = 'prompt-out' }: SecondaryOutputHandleProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--be-space-sm)', gap: 'var(--be-space-xs)', alignItems: 'center' }}>
      <Handle
        type="source"
        position={Position.Right}
        id={id}
        style={{
          width: 10, height: 10, borderRadius: '50%',
          background: getHandleColor(id), border: 'none',
          position: 'relative', right: -12, transform: 'none',
        }}
      />
    </div>
  );
}

export interface OutputPreviewProps {
  isLoading: boolean;
  output?: string;
  error?: string;
  accentColor?: string;
  type?: 'image' | 'video' | 'audio' | 'model';
  label?: string;
  emptyText?: string;
  loadingText?: string;
  minHeight?: number;
  hideLabel?: boolean;
}

export function OutputPreview({
  isLoading,
  output,
  error,
  accentColor = '#f97316',
  type = 'image',
  label = type === 'video' ? 'Generated Video' : 'Output',
  emptyText,
  loadingText,
  minHeight = type === 'video' ? 120 : 80,
  hideLabel = false,
}: OutputPreviewProps) {
  const defaultEmpty =
    type === 'video'
      ? 'Generated video will appear here'
      : type === 'audio'
        ? 'Generated audio will appear here'
        : type === 'model'
          ? '3D output will appear here'
          : 'Output image will appear here';

  const defaultLoading = type === 'video'
    ? 'Generating video (may take 1-2 mins)...'
    : type === 'audio'
      ? 'Generating audio...'
      : type === 'model'
        ? 'Generating 3D model...'
        : 'Processing...';

  const unifiedEmpty = emptyText ?? 'Run to generate';

  return (
    <>
      {!hideLabel && (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 'var(--be-space-sm)', marginTop: 'var(--be-space-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--be-space-sm)' }}>
          <span style={{
            width: 10, height: 10, borderRadius: '50%',
            background: accentColor, flexShrink: 0,
          }} />
          <span style={{ fontSize: 'var(--be-font-size-md)', fontWeight: 600, color: 'var(--be-text-primary)' }}>{label}</span>
        </div>
      </div>
      )}

      <div style={{
        background: 'var(--be-surface-sunken)',
        borderRadius: 'var(--be-radius-md)',
        border: `1px solid var(--be-border-subtle)`,
        minHeight,
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--be-space-md)' }}>
            <div
              className="node-spinner"
              style={{
                width: 28, height: 28,
                border: `3px solid var(--be-border-subtle)`,
                borderTop: `3px solid ${accentColor}`,
                borderRadius: '50%',
                animation: 'node-spin 1s linear infinite',
              }}
            />
            <span style={{ fontSize: 'var(--be-font-size-xs, 12px)', color: 'var(--be-text-secondary)' }}>{loadingText || defaultLoading}</span>
          </div>
        ) : output ? (
          type === 'video' ? (
            <video
              src={output}
              autoPlay loop muted controls
              style={{ width: '100%', display: 'block', borderRadius: 'var(--be-radius-md)' }}
            />
          ) : type === 'audio' ? (
            <audio
              src={output}
              controls
              style={{ width: '100%', maxHeight: 48 }}
            />
          ) : type === 'model' ? (
            <a
              href={output}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 'var(--be-font-size-xs, 12px)', color: accentColor, padding: 'var(--be-space-md)', textAlign: 'center' }}
            >
              Open 3D asset
            </a>
          ) : (
            <img
              src={output}
              alt={label}
              style={{ width: '100%', display: 'block', borderRadius: 'var(--be-radius-md)' }}
            />
          )
        ) : error ? (
          <span style={{
            fontSize: 'var(--be-font-size-xs, 12px)', color: 'var(--be-text-error)',
            padding: 'var(--be-space-xl)', textAlign: 'center', wordBreak: 'break-word',
          }}>
            {error}
          </span>
        ) : (
          <span style={{
            fontSize: 'var(--be-font-size-xs, 12px)', color: 'var(--be-text-muted)',
            padding: 'var(--be-space-xl)', textAlign: 'center',
          }}>
            {hideLabel ? unifiedEmpty : (emptyText ?? defaultEmpty)}
          </span>
        )}
      </div>
      
      <style>{`
        @keyframes node-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
