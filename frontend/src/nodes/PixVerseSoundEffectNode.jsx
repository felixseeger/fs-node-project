import { useCallback, useRef, useEffect, useState } from 'react';
import { Position, Handle } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import NodeShell from './NodeShell';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';
import { getHandleColor } from '../utils/handleTypes';
import {
  SectionHeader, LinkedBadges, ConnectedOrLocal, OutputHandle, OutputPreview, Toggle, TextInput, useNodeConnections, CATEGORY_COLORS, sp, border, radius,
} from './shared';
import { pixVerseSoundEffect, pollPixVerseVideoStatus } from '../utils/api';
import NodeGenerateButton from './NodeGenerateButton';

const ACCENT = CATEGORY_COLORS.audioGeneration;

export default function PixVerseSoundEffectNode({ id, data, selected }) {
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);
  const { progress, status, message, start, setProgress, complete, fail, isActive } = useNodeProgress();
  const [isHovered, setIsHovered] = useState(false);

  const videoConnection = conn('video-in');

  const handleGenerate = useCallback(async () => {
    let videoInput = videoConnection.connected ? resolve.video('video-in', data.localVideoIn)?.[0] : data.localVideoUrl;
    if (!videoInput) return;
    start('Generating sound...');
    update({ outputVideo: null, outputError: null });
    try {
      const result = await pixVerseSoundEffect({ video_url: videoInput });
      if (result.data?.generated?.length) {
        complete('Done');
        update({ outputVideo: result.data.generated[0] });
      }
    } catch (err) {
      fail(err);
      update({ outputError: err.message });
    }
  }, [id, data, update, resolve, start, complete, fail, videoConnection]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <NodeShell data={data} label={data.label || 'PixVerse Sound'} dotColor={ACCENT} selected={selected} onGenerate={handleGenerate} isGenerating={isActive} downloadUrl={data.outputVideo || undefined} downloadType="video" onDisconnect={disconnectNode}>
        <SectionHeader label="Source Video" handleId="video-in" handleType="target" color={getHandleColor('video-in')} extra={videoConnection.connected ? <LinkedBadges nodeId={id} handleId="video-in" onUnlink={data.onUnlink} /> : null} />
        
        <div style={{ position: 'relative' }}>
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
          <ConnectedOrLocal connected={videoConnection.connected} connInfo={videoConnection.info}>
            <TextInput value={data.localVideoUrl || ''} onChange={(v) => update({ localVideoUrl: v })} placeholder="Video URL..." />
          </ConnectedOrLocal>
        </div>

        <OutputPreview isLoading={isActive} output={data.outputVideo} error={data.outputError} type="video" label="Video with Sound" accentColor={ACCENT} />
        <OutputHandle type="video" label="video" />
      </NodeShell>
    </div>
  );
}
