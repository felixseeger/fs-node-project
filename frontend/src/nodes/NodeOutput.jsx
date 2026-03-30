import { Position, Handle } from '@xyflow/react';
import { getHandleColor } from '../utils/handleTypes';
import { text, surface, border, radius, sp, font } from './nodeTokens';

/**
 * Output handle placed at the top of a node (aligned with image-in handles).
 * Replaces the duplicated "image output at top" pattern across all nodes.
 */
export function OutputHandle({ id = 'output', label = 'image', type = 'image' }) {
  const handleId = type === 'video' ? 'output-video' : id;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
      marginBottom: sp[1],
    }}>
      <span style={{ ...font.caption, marginRight: sp[1] }}>{label}</span>
      <Handle
        type="source"
        position={Position.Right}
        id={handleId}
        style={{
          width: 10, height: 10, borderRadius: '50%',
          background: getHandleColor(handleId), border: 'none',
          position: 'relative', right: -12, transform: 'none',
        }}
      />
    </div>
  );
}

/**
 * Secondary output handle (e.g., prompt-out) placed at bottom.
 */
export function SecondaryOutputHandle({ id = 'prompt-out' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: sp[2], gap: sp[1], alignItems: 'center' }}>
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

/**
 * Output preview box with loading, error, empty, and result states.
 * Replaces the duplicated output display pattern across all nodes.
 */
export function OutputPreview({
  isLoading,
  output,         // URL string (image or video)
  error,
  accentColor = '#f97316',
  type = 'image', // 'image' | 'video'
  label = type === 'video' ? 'Generated Video' : 'Output',
  emptyText,
  loadingText,
  minHeight = type === 'video' ? 120 : 80,
}) {
  const defaultEmpty = type === 'video'
    ? 'Generated video will appear here'
    : 'Output image will appear here';

  const defaultLoading = type === 'video'
    ? 'Generating video (may take 1-2 mins)...'
    : 'Processing...';

  return (
    <>
      {/* Section label with colored dot */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: sp[2], marginTop: sp[4],
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp[2] }}>
          <span style={{
            width: 10, height: 10, borderRadius: '50%',
            background: accentColor, flexShrink: 0,
          }} />
          <span style={font.label}>{label}</span>
        </div>
      </div>

      {/* Preview container */}
      <div style={{
        background: surface.sunken,
        borderRadius: radius.md,
        border: `1px solid ${border.subtle}`,
        minHeight,
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: sp[4] }}>
            <div
              className="node-spinner"
              style={{
                width: 28, height: 28,
                border: `3px solid ${border.subtle}`,
                borderTop: `3px solid ${accentColor}`,
                borderRadius: '50%',
                animation: 'node-spin 1s linear infinite',
              }}
            />
            <span style={{ ...font.caption }}>{loadingText || defaultLoading}</span>
          </div>
        ) : output ? (
          type === 'video' ? (
            <video
              src={output}
              autoPlay loop muted controls
              style={{ width: '100%', display: 'block', borderRadius: radius.md }}
            />
          ) : (
            <img
              src={output}
              alt={label}
              style={{ width: '100%', display: 'block', borderRadius: radius.md }}
            />
          )
        ) : error ? (
          <span style={{
            ...font.caption, color: text.error,
            padding: sp[5], textAlign: 'center', wordBreak: 'break-word',
          }}>
            {error}
          </span>
        ) : (
          <span style={{
            ...font.sm, color: text.muted,
            padding: sp[6], textAlign: 'center',
          }}>
            {emptyText || defaultEmpty}
          </span>
        )}
      </div>
    </>
  );
}
