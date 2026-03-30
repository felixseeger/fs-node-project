import { useCallback, useState, useEffect, useRef } from 'react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { removeBackground } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import {
  SectionHeader,
  LinkedBadges,
  ConnectedOrLocal,
  OutputHandle,
  OutputPreview,
  useNodeConnections,
  surface,
  border,
  text,
  font,
  sp,
  radius,
} from './shared';

const ACCENT = '#06b6d4';

export default function RemoveBackgroundNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);
  const { update, conn, resolve } = useNodeConnections(id, data);

  const image = conn('image-in');

  const handleRemove = useCallback(async () => {
    const images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    setIsLoading(true);
    update({ outputImage: null, isLoading: true });

    try {
      let imageUrl = images[0];

      // If base64 data URL, use it directly; otherwise it's already a URL
      if (imageUrl.startsWith('data:')) {
        // Data URLs can be passed directly for local backend proxy
        // The backend will forward to Freepik API
      }

      const result = await removeBackground({ image_url: imageUrl });

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      // Synchronous response — results come back immediately
      const outputUrl = result.high_resolution || result.preview || result.url || null;
      update({
        outputImage: outputUrl,
        outputHighRes: result.high_resolution || null,
        outputPreview: result.preview || null,
        outputUrl: result.url || null,
        originalUrl: result.original || null,
        isLoading: false,
        outputError: null,
      });
    } catch (err) {
      console.error('Remove background error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleRemove();
    }
  }, [data.triggerGenerate, handleRemove]);

  // Checkerboard background to show transparency
  const checkerboardStyle = {
    backgroundImage: `
      linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
      linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
      linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)
    `,
    backgroundSize: '12px 12px',
    backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
    backgroundColor: '#111',
  };

  return (
    <NodeShell label={data.label || 'Remove Background'} dotColor={ACCENT} selected={selected}>

      {/* Image Output Handle (top) */}
      <OutputHandle />

      {/* 1. Image */}
      <SectionHeader
        label="Image"
        handleId="image-in"
        handleType="target"
        color={getHandleColor('image-in')}
        extra={image.connected ? (
          <LinkedBadges nodeId={id} handleId="image-in" onUnlink={data.onUnlink} />
        ) : null}
      />
      <ConnectedOrLocal connected={image.connected} connInfo={image.info}>
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Click or drag to upload image"
        />
      </ConnectedOrLocal>

      {/* 2. Info badge */}
      <div style={{
        background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)',
        borderRadius: radius.lg, padding: `${sp[3]}px ${sp[5]}px`, marginTop: sp[4],
        display: 'flex', alignItems: 'center', gap: sp[3],
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={ACCENT} strokeWidth="1.5" fill="none" />
          <path d="M12 8v4M12 16h.01" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ ...font.caption, color: '#67e8f9', lineHeight: 1.4 }}>
          Synchronous — results return instantly, no polling needed
        </span>
      </div>

      {/* 3. Output */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: sp[2], marginTop: sp[4],
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp[2] }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ec4899', flexShrink: 0 }} />
          <span style={font.label}>Cutout Output</span>
        </div>
      </div>
      <div style={{
        borderRadius: radius.md, border: `1px solid ${border.subtle}`,
        minHeight: 80, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        ...checkerboardStyle,
      }}>
        {isLoading ? (
          <div style={{
            width: 28, height: 28, border: `3px solid ${border.subtle}`,
            borderTop: `3px solid ${ACCENT}`, borderRadius: '50%',
            animation: 'node-spin 1s linear infinite',
            background: '#111',
          }} />
        ) : data.outputImage ? (
          <img src={data.outputImage} alt="cutout" style={{ width: '100%', display: 'block', borderRadius: radius.md }} />
        ) : data.outputError ? (
          <span style={{ ...font.caption, color: text.error, padding: sp[5], textAlign: 'center', background: '#111' }}>
            {data.outputError}
          </span>
        ) : (
          <span style={{ ...font.sm, color: text.muted, padding: sp[6], textAlign: 'center', background: '#111' }}>
            Transparent PNG cutout will appear here
          </span>
        )}
      </div>

      {/* Download links (if available) */}
      {data.outputHighRes && !isLoading && (
        <div style={{ display: 'flex', gap: sp[2], marginTop: sp[2] }}>
          {data.outputHighRes && (
            <a href={data.outputHighRes} target="_blank" rel="noopener noreferrer" style={{
              ...font.micro, color: ACCENT, textDecoration: 'none',
              padding: `${sp[1]}px ${sp[3]}px`, background: 'rgba(6,182,212,0.1)',
              border: '1px solid rgba(6,182,212,0.25)', borderRadius: radius.sm,
            }}>High Res ↓</a>
          )}
          {data.outputPreview && (
            <a href={data.outputPreview} target="_blank" rel="noopener noreferrer" style={{
              ...font.micro, color: ACCENT, textDecoration: 'none',
              padding: `${sp[1]}px ${sp[3]}px`, background: 'rgba(6,182,212,0.1)',
              border: '1px solid rgba(6,182,212,0.25)', borderRadius: radius.sm,
            }}>Preview ↓</a>
          )}
        </div>
      )}

    </NodeShell>
  );
}
