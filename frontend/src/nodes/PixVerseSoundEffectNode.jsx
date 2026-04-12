import { useCallback, useRef, useEffect } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';
import { getHandleColor } from '../utils/handleTypes';
import {
  SectionHeader,
  LinkedBadges,
  ConnectedOrLocal,
  OutputHandle,
  OutputPreview,
  Toggle,
  TextInput,
  useNodeConnections,
  CATEGORY_COLORS,
  sp,
} from './shared';
import { pixVerseSoundEffect, pollPixVerseVideoStatus } from '../utils/api';

const ACCENT = CATEGORY_COLORS.audioGeneration;

export default function PixVerseSoundEffectNode({ id, data, selected }) {
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);
  const { progress, status, message, start, setProgress, complete, fail, isActive } = useNodeProgress();

  const videoConnection = conn('video-in');

  const handleGenerate = useCallback(async () => {
    // Get video from connection or local input
    let videoInput = null;

    if (videoConnection.connected) {
      const videos = resolve.video('video-in', data.localVideoIn);
      videoInput = videos?.[0];
    } else {
      videoInput = data.localVideoUrl;
    }

    if (!videoInput) {
      return;
    }

    start('Submitting sound effect request...');
    update({ outputVideo: null, outputError: null });

    try {
      const params = {};

      // Determine if it's a video ID (integer) or URL
      if (!isNaN(videoInput) && videoInput.trim() !== '') {
        params.source_video_id = parseInt(videoInput, 10);
      } else if (videoInput.startsWith('http')) {
        params.video_url = videoInput;
      } else {
        // Try parsing as integer anyway
        const parsed = parseInt(videoInput, 10);
        if (!isNaN(parsed)) {
          params.source_video_id = parsed;
        } else {
          params.video_url = videoInput;
        }
      }

      // Add optional sound effect parameters
      if (data.localOriginalSoundSwitch !== undefined) {
        params.original_sound_switch = data.localOriginalSoundSwitch;
      }
      if (data.localSoundContent) {
        params.sound_effect_content = data.localSoundContent;
      }

      const result = await pixVerseSoundEffect(params);

      if (result.error) {
        fail(new Error(result.error?.message || 'Sound effect generation failed'));
        update({ outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      const videoId = result.task_id;
      if (!videoId) {
        fail(new Error('No video ID returned from API'));
        update({ outputError: 'No video ID in response' });
        return;
      }

      // Poll for status
      let lastProgress = 10;
      const status = await pollPixVerseVideoStatus(videoId, 120, 3000, (attempt, maxAttempts) => {
        lastProgress = 10 + Math.min(85, (attempt / maxAttempts) * 85);
        setProgress(lastProgress, `Adding sound effects... (${attempt}/${maxAttempts})`);
      });

      const generated = status.data?.generated || [];
      complete('Sound effects added');
      update({
        outputVideo: generated[0] || null,
        outputVideos: generated,
        outputError: null,
      });
    } catch (err) {
      console.error('PixVerse sound effect error:', err);
      fail(err);
      update({ outputError: err.message });
    }
  }, [id, data, update, resolve, start, setProgress, complete, fail, videoConnection]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <NodeShell
      data={data}
      label={data.label || 'PixVerse Sound'}
      dotColor={ACCENT}
      selected={selected}
      onGenerate={handleGenerate}
      isGenerating={data.isLoading}
      downloadUrl={data.outputVideo || undefined}
      downloadType="video" onDisconnect={disconnectNode}
    >
      {/* Video Input */}
      <SectionHeader
        label="Source Video"
        handleId="video-in"
        handleType="target"
        color={getHandleColor('video-in')}
        extra={videoConnection.connected ? (
          <LinkedBadges nodeId={id} handleId="video-in" onUnlink={data.onUnlink} />
        ) : null}
      />
      <ConnectedOrLocal connected={videoConnection.connected} connInfo={videoConnection.info}>
        <TextInput
          value={data.localVideoUrl || ''}
          onChange={(v) => update({ localVideoUrl: v })}
          placeholder="Video URL or PixVerse video ID..."
        />
      </ConnectedOrLocal>

      {/* Original Sound Switch */}
      <div style={{ marginTop: sp[3] }}>
        <Toggle
          label="Keep Original Sound"
          value={data.localOriginalSoundSwitch || false}
          onChange={(v) => update({ localOriginalSoundSwitch: v })}
          accentColor={ACCENT}
        />
      </div>

      {/* Sound Effect Content */}
      <div style={{ marginTop: sp[3] }}>
        <div style={{ fontSize: 11, color: '#999', marginBottom: sp[1] }}>Sound Effect Description (Optional)</div>
        <TextInput
          value={data.localSoundContent || ''}
          onChange={(v) => update({ localSoundContent: v })}
          placeholder="Describe the sound effects you want to add..."
        />
      </div>

      {/* Progress */}
      {isActive && (
        <NodeProgress progress={progress} status={status} message={message} />
      )}

      {/* Output */}
      <OutputPreview
        isLoading={isActive}
        output={data.outputVideo}
        error={data.outputError}
        type="video"
        label="Video with Sound"
        accentColor={ACCENT}
      />

      {/* Output Handle */}
      <OutputHandle type="video" label="video" />
    </NodeShell>
  );
}
