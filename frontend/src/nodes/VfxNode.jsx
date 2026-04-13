import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNodeConnections, border, radius, surface, text, font, sp, CATEGORY_COLORS, OutputHandle, OutputPreview } from './shared';
import NodeShell from './NodeShell';
import useNodeProgress from '../hooks/useNodeProgress';
import { getHandleColor } from '../utils/handleTypes';
import { vfxGenerate } from '../utils/api';
import NodeGenerateButton from './NodeGenerateButton';

const FILTERS = [
  { value: 1, label: 'Film Grain' }, { value: 2, label: 'Motion Blur' },
  { value: 3, label: 'Fish Eye' }, { value: 4, label: 'VHS' },
  { value: 5, label: 'Shake' }, { value: 6, label: 'VGA' },
  { value: 7, label: 'Bloom' }, { value: 8, label: 'Anamorphic Lens' },
];

export default function VfxNode({ id, data, selected }) {
  const { update, disconnectNode } = useNodeConnections(id, data);
  const { progress, status, message, start, setProgress, complete, fail, isActive } = useNodeProgress({
    onProgress: (state) => {
      update({ executionProgress: state.progress, executionStatus: state.status, executionMessage: state.message });
    },
  });

  const [isHovered, setIsHovered] = useState(false);
  const localFilterType = data.localFilterType || 1;

  const handleGenerate = useCallback(async () => {
    let videos = data.resolveInput?.(id, 'video-in') || (data.localVideo ? [data.localVideo] : []);
    if (!videos.length) return;
    start('Processing VFX...');
    update({ outputVideo: null, outputError: null });
    try {
      const result = await vfxGenerate({ video: videos[0], filter_type: localFilterType, fps: 24 });
      const url = result.data?.generated?.[0] || result.data?.[0]?.url;
      if (url) {
        complete('Done');
        update({ outputVideo: url });
      } else {
        throw new Error('No video generated');
      }
    } catch (err) {
      fail(err);
      update({ outputError: err.message });
    }
  }, [id, data, update, localFilterType, start, complete, fail]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <NodeShell data={data} label={data.label || 'Video FX'} dotColor="#14b8a6" selected={selected} onGenerate={handleGenerate} isGenerating={isActive} downloadUrl={data.outputVideo || undefined} downloadType="video" onDisconnect={disconnectNode}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Handles Area */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Handle type="target" position={Position.Left} id="video-in" style={{ position: 'relative', left: -22, top: 0, background: getHandleColor('video-in') }} />
              <span style={{ fontSize: 10, color: text.muted, marginLeft: -12 }}>video-in</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: text.muted, marginRight: -12 }}>output</span>
              <OutputHandle label="" id="output-video" color={getHandleColor('output-video')} style={{ position: 'relative', right: -22, top: 0 }} />
            </div>
          </div>

          <div style={{ background: surface.deep, border: `1px solid ${border.default}`, borderRadius: radius.md, padding: 12, position: 'relative' }}>
            <AnimatePresence>
              {(isHovered || isActive) && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }} transition={{ duration: 0.15 }}
                  style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: 10, zIndex: 100 }}
                >
                  <div style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', border: `1.5px solid ${border.active}80`, borderRadius: radius.md, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 12px 32px rgba(0,0,0,0.6)', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>RUN NODE</span>
                    <NodeGenerateButton onGenerate={handleGenerate} isGenerating={isActive} size="sm" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <input type="text" className="nodrag nopan" value={data.localVideo || ''} onChange={(e) => update({ localVideo: e.target.value })} placeholder="Video URL..." style={{ width: '100%', background: 'transparent', border: 'none', color: text.primary, fontSize: 11, outline: 'none' }} />
          </div>

          <div style={{ background: surface.deep, borderRadius: 8, border: `1px solid ${border.default}`, padding: 12 }}>
            <div style={{ fontSize: 11, color: text.muted, marginBottom: 6 }}>Filter</div>
            <select className="nodrag nopan" value={localFilterType} onChange={(e) => update({ localFilterType: Number(e.target.value) })} style={{ width: '100%', background: surface.sunken, border: `1px solid ${border.subtle}`, borderRadius: 6, color: text.primary, fontSize: 11, padding: '6px 8px' }}>
              {FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>

          <OutputPreview output={data.outputVideo} isLoading={isActive} type="video" accentColor="#14b8a6" label="Output Preview" />
        </div>
      </NodeShell>
    </div>
  );
}
