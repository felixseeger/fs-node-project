import React, { useCallback, useEffect } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import NodeProgress from './NodeProgress';
import useNodeConnections from './useNodeConnections';
import useNodeProgress from '../hooks/useNodeProgress';
import { getHandleColor } from '../utils/handleTypes';
import { facialEditGenerate } from '../utils/api';
import { sp, font, CATEGORY_COLORS } from './nodeTokens';

const FaceIcon = ({ style }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"></path>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
    <line x1="9" y1="9" x2="9.01" y2="9"></line>
    <line x1="15" y1="9" x2="15.01" y2="9"></line>
  </svg>
);

export default function FacialEditingNode({ id, data, selected }) {
  const { resolve, disconnectNode, update } = useNodeConnections(id, data);
  const { isActive, start, complete, fail } = useNodeProgress(id);

  const localEmotion = data.emotion || 'Happiness';
  const localIntensity = data.intensity ?? 0.8;
  const strictIdentity = data.strictIdentity ?? true;
  const maskFace = data.maskFace ?? false;

  const inputImage = resolve.image('image-in')?.[0];
  const inputIntensity = resolve.number('intensity-in');
  const outputImage = data.outputImage || null;

  const finalIntensity = inputIntensity !== undefined ? inputIntensity : localIntensity;

  const runGeneration = useCallback(async () => {
    if (!inputImage) return;
    start();
    try {
      const res = await facialEditGenerate({
        image: inputImage,
        emotion: localEmotion,
        intensity: finalIntensity,
        strictIdentity,
        maskFace
      });
      if (res.image) {
        update({ outputImage: res.image });
        complete(res.image);
      } else {
        complete();
      }
    } catch (e) {
      console.error('Facial editing failed:', e);
      fail(e.message || 'Facial editing failed');
    }
  }, [inputImage, localEmotion, finalIntensity, strictIdentity, maskFace, start, complete, fail, update]);

  useEffect(() => {
    if (data.triggerGenerate) {
      runGeneration();
    }
  }, [data.triggerGenerate, runGeneration]);

  const handleIntensityChange = (e) => {
    const val = parseFloat(e.target.value);
    update({ intensity: val });
  };

  return (
    <NodeShell data={data}
      label={data.label || 'Facial Editor (PixelSmile)'}
      dotColor="#ec4899"
      selected={selected}
      onDisconnect={disconnectNode}
      onGenerate={runGeneration}
      isGenerating={isActive}
      downloadUrl={outputImage || undefined}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: sp[4] }}>

        {/* Connection Handles */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <Handle type="target" position={Position.Left} id="image-in" style={{ width: 12, height: 12, background: getHandleColor('image'), border: '2px solid #1a1a1a', left: -26 }} />
              <span style={{ ...font.xs, color: '#aaa', marginLeft: 8 }}>Portrait In</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <Handle type="target" position={Position.Left} id="intensity-in" style={{ width: 12, height: 12, background: getHandleColor('number'), border: '2px solid #1a1a1a', left: -26 }} />
              <span style={{ ...font.xs, color: '#aaa', marginLeft: 8 }}>Intensity In</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', position: 'relative' }}>
            <Handle type="source" position={Position.Right} id="image-out" style={{ width: 12, height: 12, background: getHandleColor('image'), border: '2px solid #1a1a1a', right: -26 }} />
            <span style={{ ...font.xs, color: '#aaa', marginRight: 8 }}>Portrait Out</span>
          </div>
        </div>

        {/* Input Preview */}
        <div style={{ background: '#111', border: '1px solid #333', borderRadius: 8, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          {inputImage ? (
            <img src={inputImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Portrait Input" />
          ) : (
            <div style={{ color: '#555', fontSize: 12, fontStyle: 'italic', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <FaceIcon style={{ color: '#444' }} />
              No image connected
            </div>
          )}
        </div>

        {/* Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ ...font.xs, color: '#999', display: 'block', marginBottom: 4 }}>Emotion LoRA Vector</label>
            <select
              className="nodrag nopan"
              value={localEmotion}
              onChange={e => update({ emotion: e.target.value })}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              style={{ width: '100%', background: '#111', border: '1px solid #333', padding: '6px 10px', borderRadius: 6, color: '#e0e0e0', fontSize: 12, outline: 'none', appearance: 'none', cursor: 'pointer' }}
            >
              <option value="Happiness">Happiness (Smile)</option>
              <option value="Sadness">Sadness</option>
              <option value="Surprise">Surprise</option>
              <option value="Anger">Anger</option>
              <option value="Neutral">Neutral</option>
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ ...font.xs, color: '#999' }}>LoRA Intensity</label>
              <span style={{ ...font.xs, color: '#fff', fontWeight: 600 }}>{finalIntensity.toFixed(2)}</span>
            </div>
            {inputIntensity !== undefined ? (
              <div style={{ width: '100%', height: 6, background: '#333', borderRadius: 3, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#ec4899', borderRadius: 3, width: `${Math.max(0, Math.min(100, (finalIntensity + 1) / 2 * 100))}%` }} />
              </div>
            ) : (
              <input
                type="range"
                min="-1.0"
                max="1.0"
                step="0.05"
                value={localIntensity}
                onChange={handleIntensityChange}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                style={{ width: '100%', cursor: 'pointer', accentColor: '#ec4899' }}
                className="nodrag nopan"
              />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 10, color: '#666' }}>-1.0</span>
              <span style={{ fontSize: 10, color: '#666' }}>0.0</span>
              <span style={{ fontSize: 10, color: '#666' }}>1.0</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ ...font.xs, color: '#999' }}>Preserve Identity (Strict)</span>
            <label style={{ display: 'inline-flex', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                className="nodrag nopan"
                checked={strictIdentity} 
                onChange={e => update({ strictIdentity: e.target.checked })} 
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                style={{ display: 'none' }} 
              />
              <div style={{ width: 28, height: 16, background: strictIdentity ? '#ec4899' : '#333', borderRadius: 20, position: 'relative' }}>
                <div style={{ width: 12, height: 12, background: '#fff', borderRadius: '50%', position: 'absolute', top: 2, left: strictIdentity ? 14 : 2, transition: '0.2s' }} />
              </div>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ ...font.xs, color: '#999' }}>Mask Auto-Detection</span>
            <label style={{ display: 'inline-flex', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                className="nodrag nopan"
                checked={maskFace} 
                onChange={e => update({ maskFace: e.target.checked })} 
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                style={{ display: 'none' }} 
              />
              <div style={{ width: 28, height: 16, background: maskFace ? '#ec4899' : '#333', borderRadius: 20, position: 'relative' }}>
                <div style={{ width: 12, height: 12, background: '#fff', borderRadius: '50%', position: 'absolute', top: 2, left: maskFace ? 14 : 2, transition: '0.2s' }} />
              </div>
            </label>
          </div>
        </div>

        {/* Generate Button (Manual Fallback) */}
        <button
          onClick={runGeneration}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="nodrag nopan"
          disabled={isActive || !inputImage}
          style={{
            background: '#ec4899', color: '#fff', border: 'none', padding: '8px', borderRadius: 6,
            fontWeight: 600, fontSize: 12, cursor: isActive || !inputImage ? 'not-allowed' : 'pointer',
            opacity: isActive || !inputImage ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            marginTop: 8
          }}
        >
          <FaceIcon /> {isActive ? 'Editing Expression...' : 'Edit Expression'}
        </button>

        {/* Progress */}
        <NodeProgress nodeId={id} />

        {/* Output Preview */}
        {outputImage && (
          <div style={{ marginTop: 8, width: '100%', aspectRatio: '1/1', background: '#000', borderRadius: 6, border: '1px solid #333', overflow: 'hidden', position: 'relative' }}>
            <img src={outputImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Edited Portrait" />
            <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4, fontSize: 10, color: '#fff', backdropFilter: 'blur(4px)' }}>
              {localEmotion} ({finalIntensity.toFixed(2)})
            </div>
          </div>
        )}

      </div>
    </NodeShell>
  );
}