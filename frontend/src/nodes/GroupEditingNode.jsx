import React, { useState, useEffect } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { groupEditGenerate } from '../utils/api';
import { sp, font, CATEGORY_COLORS } from './nodeTokens';

const MagicIcon = ({ style }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M18.8 3.3a3.5 3.5 0 0 0-5 0l-9 9a3.5 3.5 0 0 0 0 5l5 5a3.5 3.5 0 0 0 5 0l9-9a3.5 3.5 0 0 0 0-5z"></path>
    <path d="m2 22 5.5-1.5L9 22"></path>
    <path d="m15 2.5 3 3"></path>
  </svg>
);

export default function GroupEditingNode({ id, data, selected }) {
  const { resolve, disconnectNode, update } = useNodeConnections(id, data);
  const [isLoading, setIsLoading] = useState(false);

  const [localSubjectVal, setLocalSubjectVal] = useState(data.subjectPrompt || '');
  const [localEditVal, setLocalEditVal] = useState(data.editPrompt || '');
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [isEditingEdit, setIsEditingEdit] = useState(false);

  useEffect(() => {
    if (!isEditingSubject && data.subjectPrompt !== undefined && data.subjectPrompt !== localSubjectVal) {
      setLocalSubjectVal(data.subjectPrompt);
    }
  }, [data.subjectPrompt, isEditingSubject]);

  useEffect(() => {
    if (!isEditingEdit && data.editPrompt !== undefined && data.editPrompt !== localEditVal) {
      setLocalEditVal(data.editPrompt);
    }
  }, [data.editPrompt, isEditingEdit]);

  const useVGGT = data.useVGGT ?? true;
  const denoising = data.denoising ?? 0.85;

  const inputImages = resolve.image('images-in') || [];
  const promptIn = resolve.text('prompt-in');
  const outputImages = data.outputImages || [];

  useEffect(() => {
    if (data.triggerGenerate) {
      runGeneration();
    }
  }, [data.triggerGenerate]);

  const runGeneration = async () => {
    if (!inputImages || inputImages.length === 0) return;
    setIsLoading(true);
    try {
      const finalEdit = promptIn || localEditVal;
      const res = await groupEditGenerate({
        images: inputImages,
        subjectPrompt: localSubjectVal,
        editPrompt: finalEdit,
        useVGGT,
        denoising
      });
      if (res.images) {
        update({ outputImages: res.images });
      }
    } catch (e) {
      console.error('Group editing failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NodeShell data={data}
      label={data.label || 'Group Editor (Wan-VACE)'}
      dotColor="#0ea5e9"
      selected={selected}
      onDisconnect={disconnectNode}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: sp[4] }}>

        {/* Connection Handles */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <Handle type="target" position={Position.Left} id="images-in" style={{ width: 12, height: 12, background: getHandleColor('image'), border: '2px solid #1a1a1a', left: -26 }} />
              <span style={{ ...font.xs, color: '#aaa', marginLeft: 8 }}>Batch Images</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <Handle type="target" position={Position.Left} id="prompt-in" style={{ width: 12, height: 12, background: getHandleColor('text'), border: '2px solid #1a1a1a', left: -26 }} />
              <span style={{ ...font.xs, color: '#aaa', marginLeft: 8 }}>Edit Prompt</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', position: 'relative' }}>
            <Handle type="source" position={Position.Right} id="images-out" style={{ width: 12, height: 12, background: getHandleColor('image'), border: '2px solid #1a1a1a', right: -26 }} />
            <span style={{ ...font.xs, color: '#aaa', marginRight: 8 }}>Batch Output</span>
          </div>
        </div>

        {/* Input Batch Preview */}
        <div style={{ background: '#111', border: '1px solid #333', borderRadius: 8, padding: 8, display: 'flex', overflowX: 'auto', gap: 4, height: 50, alignItems: 'center' }}>
          {inputImages.length > 0 ? inputImages.map((src, i) => (
            <img key={i} src={src} style={{ height: 34, width: 34, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
          )) : (
            <div style={{ color: '#555', fontSize: 11, fontStyle: 'italic', width: '100%', textAlign: 'center' }}>0 images connected</div>
          )}
        </div>

        {/* Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <label style={{ ...font.xs, color: '#999', display: 'block', marginBottom: 4 }}>Subject to Mask (GroundingDINO)</label>
            <input
              type="text"
              placeholder="e.g. red car"
              value={localSubjectVal}
              onFocus={() => setIsEditingSubject(true)}
              onBlur={() => setIsEditingSubject(false)}
              onChange={e => {
                setLocalSubjectVal(e.target.value);
                update({ subjectPrompt: e.target.value });
              }}
              style={{ width: '100%', background: '#111', border: '1px solid #333', padding: '6px 10px', borderRadius: 6, color: '#e0e0e0', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
              className="nodrag nopan"
            />
          </div>

          <div>
            <label style={{ ...font.xs, color: '#999', display: 'block', marginBottom: 4 }}>Edit Instructions</label>
            <textarea
              placeholder="e.g. a futuristic hover-car"
              value={promptIn || localEditVal}
              onFocus={() => setIsEditingEdit(true)}
              onBlur={() => setIsEditingEdit(false)}
              onChange={e => {
                setLocalEditVal(e.target.value);
                update({ editPrompt: e.target.value });
              }}
              readOnly={!!promptIn}
              rows={2}
              style={{ width: '100%', background: promptIn ? '#1a1a1a' : '#111', border: '1px solid #333', padding: '6px 10px', borderRadius: 6, color: promptIn ? '#888' : '#e0e0e0', fontSize: 12, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
              className="nodrag nopan"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <span style={{ ...font.xs, color: '#999' }}>Geom Flow (VGGT)</span>
            <label style={{ display: 'inline-flex', cursor: 'pointer' }}>
              <input type="checkbox" checked={useVGGT} onChange={e => update({ useVGGT: e.target.checked })} style={{ display: 'none' }} />
              <div style={{ width: 28, height: 16, background: useVGGT ? '#0ea5e9' : '#333', borderRadius: 20, position: 'relative' }}>
                <div style={{ width: 12, height: 12, background: '#fff', borderRadius: '50%', position: 'absolute', top: 2, left: useVGGT ? 14 : 2, transition: '0.2s' }} />
              </div>
            </label>
          </div>
        </div>

        {/* Generate Button (Manual Fallback) */}
        <button
          onClick={runGeneration}
          disabled={isLoading || inputImages.length === 0}
          style={{
            background: '#0ea5e9', color: '#fff', border: 'none', padding: '8px', borderRadius: 6,
            fontWeight: 600, fontSize: 12, cursor: isLoading || inputImages.length === 0 ? 'not-allowed' : 'pointer',
            opacity: isLoading || inputImages.length === 0 ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            marginTop: 8
          }}
        >
          <MagicIcon /> {isLoading ? 'Processing Pipeline...' : 'Process Batch'}
        </button>

        {/* Output Preview */}
        {outputImages.length > 0 && (
          <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {outputImages.map((src, i) => (
              <img key={i} src={src} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 6, border: '1px solid #333' }} />
            ))}
          </div>
        )}

      </div>
    </NodeShell>
  );
}