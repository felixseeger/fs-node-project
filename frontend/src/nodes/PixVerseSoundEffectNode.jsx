import { useCallback, useRef, useEffect } from 'react';
import NodeShell from './NodeShell';
import useNodeProgress from '../hooks/useNodeProgress';
import { getHandleColor } from '../utils/handleTypes';
import {
  SectionHeader, LinkedBadges, ConnectedOrLocal, OutputHandle, OutputPreview, TextInput, useNodeConnections, CATEGORY_COLORS,
} from './shared';
import { pixVerseSoundEffect } from '../utils/api';

const ACCENT = CATEGORY_COLORS.audioGeneration;

export default function PixVerseSoundEffectNode({ id, data, selected }) {
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);
  const { start, complete, fail, isActive } = useNodeProgress();

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
    <div>
      <NodeShell data={data} label={data.label || 'PixVerse Sound'} dotColor={ACCENT} selected={selected} onGenerate={handleGenerate} isGenerating={isActive} downloadUrl={data.outputVideo || undefined} downloadType="video" onDisconnect={disconnectNode}>
        <SectionHeader label="Source Video" handleId="video-in" handleType="target" color={getHandleColor('video-in')} extra={videoConnection.connected ? <LinkedBadges nodeId={id} handleId="video-in" onUnlink={data.onUnlink} /> : null} />
        
        <div style={{ position: 'relative' }}>
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
