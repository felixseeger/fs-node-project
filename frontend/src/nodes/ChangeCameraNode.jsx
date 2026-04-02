import { useCallback, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { changeCamera, pollChangeCameraStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

const HORIZONTAL_PRESETS = [
  { label: 'Front', value: 0 },
  { label: 'Right', value: 90 },
  { label: 'Back', value: 180 },
  { label: 'Left', value: 270 },
];

const VERTICAL_PRESETS = [
  { label: 'Look Up', value: -30 },
  { label: 'Eye Level', value: 0 },
  { label: '45°', value: 45 },
  { label: "Bird's Eye", value: 90 },
];

export default function ChangeCameraNode({ id, data, selected }) {
  const { isActive, start, complete, fail } = useNodeProgress();

  const localHorizontal = data.localHorizontalAngle ?? 0;
  const localVertical = data.localVerticalAngle ?? 0;
  const localZoom = data.localZoom ?? 5;
  const localSeed = data.localSeed ?? '';

  const update = useCallback(
    (patch) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback((handleId) => {
    return data.getConnectionInfo?.(id, handleId) || null;
  }, [id, data]);

  const imageConnection = getConnInfo('image-in');
  const hasImageConnection = data.hasConnection?.(id, 'image-in');

  const handleTransform = useCallback(async () => {
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];
    if (!images?.length) return;

    start();
    update({ outputImage: null, isLoading: true });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) imageBase64 = imageBase64.split(',')[1];

      const params = {
        image: imageBase64,
        horizontal_angle: localHorizontal,
        vertical_angle: localVertical,
        zoom: localZoom,
      };
      if (localSeed !== '' && localSeed !== undefined && localSeed !== null) {
        params.seed = Number(localSeed);
      }

      const result = await changeCamera(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail();
        return;
      }

      if (result.data?.task_id) {
        const status = await pollChangeCameraStatus(result.data.task_id);
        const generated = status.data?.generated || [];
        update({
          outputImage: generated[0] || null,
          outputImages: generated,
          isLoading: false,
          outputError: null,
        });
        complete();
      } else if (result.data?.generated?.length) {
        update({
          outputImage: result.data.generated[0],
          outputImages: result.data.generated,
          isLoading: false,
          outputError: null,
        });
        complete();
      } else {
        update({ isLoading: false });
        fail();
      }
    } catch (err) {
      console.error('Change camera error:', err);
      update({ isLoading: false, outputError: err.message });
      fail();
    }
  }, [id, data, update, localHorizontal, localVertical, localZoom, localSeed, start, complete, fail]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleTransform();
    }
  }, [data.triggerGenerate, handleTransform]);

  // ── Helpers ──

  const sectionHeader = (label, handleId, handleType, color, extra) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 6, marginTop: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Handle type={handleType} position={handleType === 'target' ? Position.Left : Position.Right}
          id={handleId} style={{
            width: 10, height: 10, borderRadius: '50%', background: color, border: 'none',
            position: 'relative', left: handleType === 'target' ? -12 : 'auto',
            right: handleType === 'source' ? -12 : 'auto', transform: 'none',
          }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>{label}</span>
      </div>
      {extra && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{extra}</div>}
    </div>
  );

  const linkedBadges = (onUnlinkHandle) => (
    <>
      <span style={{ fontSize: 9, color: '#3b82f6', padding: '2px 6px', background: 'rgba(59,130,246,0.1)', borderRadius: 4 }}>linked</span>
      <button onClick={() => data.onUnlink?.(id, onUnlinkHandle)} style={{
        fontSize: 9, color: '#ef4444', padding: '2px 6px', background: 'rgba(239,68,68,0.15)', borderRadius: 4,
        border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
      }}>unlink</button>
    </>
  );

  const connectionInfoBox = (connInfo) => (
    <div style={{
      background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
      borderRadius: 6, padding: '6px 10px', marginBottom: 4,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: '#93b4f5' }}>
        {connInfo ? `Linked from ${connInfo.nodeLabel} → ${connInfo.handle}` : 'Linked from upstream node'}
      </span>
    </div>
  );

  const ACCENT = '#f59e0b'; // amber for camera

  // Compass-like visual for horizontal angle
  const compassAngle = localHorizontal;
  const compassLabels = [
    { deg: 0, label: 'F' },
    { deg: 90, label: 'R' },
    { deg: 180, label: 'B' },
    { deg: 270, label: 'L' },
  ];

  // ── Render ──

  return (
    <NodeShell 
      label={data.label || 'Change Camera'} 
      dotColor={ACCENT} 
      selected={selected}
      onGenerate={handleTransform}
      isGenerating={isActive}
    >

      {/* ── Image Output Handle (top) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        marginBottom: 4,
      }}>
        <span style={{ fontSize: 10, color: '#999', marginRight: 4 }}>image</span>
        <Handle type="source" position={Position.Right} id="output" style={{
          width: 10, height: 10, borderRadius: '50%',
          background: getHandleColor('output'), border: 'none',
          position: 'relative', right: -12, transform: 'none',
        }} />
      </div>

      {/* ── 1. Image ── */}
      {sectionHeader('Image', 'image-in', 'target', getHandleColor('image-in'),
        hasImageConnection ? linkedBadges('image-in') : null
      )}
      {hasImageConnection ? connectionInfoBox(imageConnection) : (
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Click or drag to upload image"
        />
      )}

      {/* ── 2. Camera Controls ── */}
      <div style={{
        background: '#1a1a1a', borderRadius: 8, border: '1px solid #3a3a3a',
        padding: 12, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          Camera Controls
        </div>

        {/* Compass visual */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 12,
        }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            border: '2px solid #3a3a3a', position: 'relative',
            background: '#111',
          }}>
            {/* Compass labels */}
            {compassLabels.map((cl) => {
              const rad = (cl.deg - 90) * (Math.PI / 180);
              const cx = 50 + 38 * Math.cos(rad);
              const cy = 50 + 38 * Math.sin(rad);
              return (
                <span key={cl.label} style={{
                  position: 'absolute',
                  left: cx - 6, top: cy - 6,
                  width: 12, height: 12,
                  fontSize: 8, fontWeight: 600,
                  color: Math.abs(compassAngle - cl.deg) < 23 || Math.abs(compassAngle - cl.deg) > 337 ? ACCENT : '#666',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{cl.label}</span>
              );
            })}
            {/* Direction indicator */}
            {(() => {
              const rad = (compassAngle - 90) * (Math.PI / 180);
              const ix = 50 + 26 * Math.cos(rad);
              const iy = 50 + 26 * Math.sin(rad);
              return (
                <div style={{
                  position: 'absolute',
                  left: ix - 5, top: iy - 5,
                  width: 10, height: 10,
                  borderRadius: '50%',
                  background: ACCENT,
                  boxShadow: `0 0 6px ${ACCENT}`,
                }} />
              );
            })()}
            {/* Center dot */}
            <div style={{
              position: 'absolute', left: 46, top: 46,
              width: 8, height: 8, borderRadius: '50%',
              background: '#555',
            }} />
            {/* Angle label */}
            <div style={{
              position: 'absolute', bottom: -18, left: 0, right: 0,
              textAlign: 'center', fontSize: 10, color: ACCENT, fontWeight: 600,
            }}>{localHorizontal}°</div>
          </div>
        </div>

        {/* Horizontal Angle */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#999' }}>Horizontal Rotation</span>
            <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localHorizontal}°</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: '#555', minWidth: 14, textAlign: 'right' }}>0</span>
            <input type="range" min={0} max={360} value={localHorizontal}
              onChange={(e) => update({ localHorizontalAngle: Number(e.target.value) })}
              style={{ flex: 1, accentColor: ACCENT }} />
            <span style={{ fontSize: 9, color: '#555', minWidth: 18 }}>360</span>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            {HORIZONTAL_PRESETS.map((p) => (
              <button key={p.label} onClick={() => update({ localHorizontalAngle: p.value })} style={{
                flex: 1, padding: '3px 0', fontSize: 9, fontWeight: localHorizontal === p.value ? 600 : 400,
                borderRadius: 10, border: 'none', cursor: 'pointer',
                background: localHorizontal === p.value ? `rgba(245,158,11,0.15)` : '#0e0e0e',
                color: localHorizontal === p.value ? ACCENT : '#666',
              }}>{p.label}</button>
            ))}
          </div>
        </div>

        {/* Vertical Angle */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#999' }}>Vertical Tilt</span>
            <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localVertical}°</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: '#555', minWidth: 18, textAlign: 'right' }}>-30</span>
            <input type="range" min={-30} max={90} value={localVertical}
              onChange={(e) => update({ localVerticalAngle: Number(e.target.value) })}
              style={{ flex: 1, accentColor: ACCENT }} />
            <span style={{ fontSize: 9, color: '#555', minWidth: 14 }}>90</span>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            {VERTICAL_PRESETS.map((p) => (
              <button key={p.label} onClick={() => update({ localVerticalAngle: p.value })} style={{
                flex: 1, padding: '3px 0', fontSize: 9, fontWeight: localVertical === p.value ? 600 : 400,
                borderRadius: 10, border: 'none', cursor: 'pointer',
                background: localVertical === p.value ? `rgba(245,158,11,0.15)` : '#0e0e0e',
                color: localVertical === p.value ? ACCENT : '#666',
              }}>{p.label}</button>
            ))}
          </div>
        </div>

        {/* Zoom */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#999' }}>Zoom</span>
            <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localZoom}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: '#555', minWidth: 14, textAlign: 'right' }}>0</span>
            <input type="range" min={0} max={10} value={localZoom}
              onChange={(e) => update({ localZoom: Number(e.target.value) })}
              style={{ flex: 1, accentColor: ACCENT }} />
            <span style={{ fontSize: 9, color: '#555', minWidth: 14 }}>10</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, padding: '0 22px' }}>
            <span style={{ fontSize: 8, color: '#555' }}>Wide</span>
            <span style={{ fontSize: 8, color: '#555' }}>Medium</span>
            <span style={{ fontSize: 8, color: '#555' }}>Close-up</span>
          </div>
        </div>

        {/* Camera summary */}
        <div style={{
          display: 'flex', gap: 6, marginTop: 10,
        }}>
          <div style={{
            flex: 1, padding: '6px 8px', background: '#111', borderRadius: 6, textAlign: 'center',
          }}>
            <div style={{ fontSize: 8, color: '#666', marginBottom: 2 }}>H-Angle</div>
            <div style={{ fontSize: 11, color: ACCENT, fontWeight: 600 }}>{localHorizontal}°</div>
          </div>
          <div style={{
            flex: 1, padding: '6px 8px', background: '#111', borderRadius: 6, textAlign: 'center',
          }}>
            <div style={{ fontSize: 8, color: '#666', marginBottom: 2 }}>V-Tilt</div>
            <div style={{ fontSize: 11, color: ACCENT, fontWeight: 600 }}>{localVertical}°</div>
          </div>
          <div style={{
            flex: 1, padding: '6px 8px', background: '#111', borderRadius: 6, textAlign: 'center',
          }}>
            <div style={{ fontSize: 8, color: '#666', marginBottom: 2 }}>Zoom</div>
            <div style={{ fontSize: 11, color: ACCENT, fontWeight: 600 }}>{localZoom}</div>
          </div>
        </div>
      </div>

      {/* ── 3. Seed ── */}
      <div style={{ marginTop: 10, marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Seed (optional)</span>
          {localSeed !== '' && (
            <button onClick={() => update({ localSeed: '' })} style={{
              fontSize: 9, color: '#999', background: 'transparent', border: 'none', cursor: 'pointer',
            }}>clear</button>
          )}
        </div>
        <input
          type="number"
          min={1}
          max={2147483647}
          value={localSeed}
          onChange={(e) => update({ localSeed: e.target.value })}
          placeholder="Random if empty (1–2147483647)"
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: '8px 10px',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* ── Progress Section ── */}
      <NodeProgress isActive={isActive} />

      {/* ── 4. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ec4899', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Transformed Output</span>
        </div>
      </div>
      <div style={{
        background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
        minHeight: 80, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        {isActive ? (
          <div style={{
            width: 28, height: 28, border: '3px solid #3a3a3a',
            borderTop: `3px solid ${ACCENT}`, borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        ) : data.outputImage ? (
          <img src={data.outputImage} alt="transformed" style={{ width: '100%', display: 'block', borderRadius: 6 }} />
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', padding: 12, textAlign: 'center' }}>{data.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', padding: 16, textAlign: 'center' }}>Transformed image will appear here</span>
        )}
      </div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </NodeShell>
  );
}
