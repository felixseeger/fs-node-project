import { useCallback, useState, useEffect, useRef } from 'react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { kling3MotionGenerate, pollKling3MotionStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import {
  SectionHeader,
  LinkedBadges,
  ConnectedOrLocal,
  OutputHandle,
  OutputPreview,
  PillGroup,
  Slider,
  PromptInput,
  TextInput,
  SettingsPanel,
  useNodeConnections,
  CATEGORY_COLORS,
  font,
  sp,
} from './shared';

const ACCENT = CATEGORY_COLORS.videoGeneration;

const MODELS = [
  { value: 'std', label: 'Standard' },
  { value: 'pro', label: 'Pro' },
];

const ORIENTATIONS = [
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Image' },
];

export default function Kling3MotionControlNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localModel = data.localModel || 'std';
  const localOrientation = data.localOrientation || 'video';
  const localCfgScale = data.localCfgScale ?? 0.5;

  const image = conn('image-in');
  const prompt = conn('prompt-in');
  const video = conn('video-in');

  const handleGenerate = useCallback(async () => {
    const promptText = resolve.text('prompt-in', data.inputPrompt);
    const images = resolve.image('image-in', data.localImage);

    let referenceVideos = data.resolveInput?.(id, 'video-in');
    if (!referenceVideos?.length && data.localVideo) referenceVideos = [data.localVideo];

    if (!images?.length || !referenceVideos?.length) return;

    setIsLoading(true);
    update({ outputVideo: null, isLoading: true });

    try {
      const params = {
        image_url: images[0],
        video_url: referenceVideos[0],
        character_orientation: localOrientation,
        cfg_scale: localCfgScale,
      };

      if (promptText) {
        params.prompt = promptText;
      }

      const result = await kling3MotionGenerate(localModel, params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const status = await pollKling3MotionStatus(localModel, taskId);
        const generated = status.data?.generated || [];
        update({
          outputVideo: generated[0] || null,
          outputVideos: generated,
          isLoading: false,
          outputError: null,
        });
      } else if (result.data?.generated?.length) {
        update({
          outputVideo: result.data.generated[0],
          outputVideos: result.data.generated,
          isLoading: false,
          outputError: null,
        });
      } else {
        update({ isLoading: false });
      }
    } catch (err) {
      console.error('Kling 3 Motion Control generation error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, resolve, localModel, localOrientation, localCfgScale]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <NodeShell label={data.label || 'Kling 3 Motion Control'} dotColor={ACCENT} selected={selected}>

      {/* Video Output Handle (top) */}
      <OutputHandle type="video" label="video" />

      {/* 1. Character Image Input (Required) */}
      <SectionHeader
        label="Character Image (Required)"
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
          placeholder="Upload character image"
          minHeight={60}
        />
      </ConnectedOrLocal>

      {/* 2. Reference Video Input (Required) */}
      <SectionHeader
        label="Reference Video (Required)"
        handleId="video-in"
        handleType="target"
        color={getHandleColor('video-in')}
        extra={video.connected ? (
          <LinkedBadges nodeId={id} handleId="video-in" onUnlink={data.onUnlink} />
        ) : null}
      />
      <ConnectedOrLocal connected={video.connected} connInfo={video.info}>
        <TextInput
          value={data.localVideo}
          onChange={(v) => update({ localVideo: v })}
          placeholder="Reference Video URL..."
        />
      </ConnectedOrLocal>

      {/* 3. Prompt (Optional) */}
      <SectionHeader
        label="Prompt (Optional)"
        handleId="prompt-in"
        handleType="target"
        color={getHandleColor('prompt-in')}
        extra={
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <AutoPromptButton id={id} data={data} update={update} imageKey="image-in" localImageKey="localImage" />
            <ImprovePromptButton id={id} data={data} update={update} type="video" />
            {prompt.connected ? <LinkedBadges nodeId={id} handleId="prompt-in" onUnlink={data.onUnlink} /> : null}
          </div>
        }
      />
      <ConnectedOrLocal connected={prompt.connected} connInfo={prompt.info}>
        <PromptInput
          value={data.inputPrompt}
          onChange={(v) => update({ inputPrompt: v })}
          placeholder="Guide the motion transfer..."
          rows={2}
        />
      </ConnectedOrLocal>

      {/* 4. Settings */}
      <SettingsPanel title="Motion Settings">
        <PillGroup
          label="Model Tier"
          options={MODELS}
          value={localModel}
          onChange={(v) => update({ localModel: v })}
          accentColor={ACCENT}
        />

        <PillGroup
          label="Orientation"
          options={ORIENTATIONS}
          value={localOrientation}
          onChange={(v) => update({ localOrientation: v })}
          accentColor={ACCENT}
        />

        <Slider
          label="CFG Scale"
          value={localCfgScale}
          onChange={(v) => update({ localCfgScale: v })}
          min={0}
          max={1}
          step={0.05}
          accentColor={ACCENT}
        />
      </SettingsPanel>

      {/* 5. Output */}
      <OutputPreview
        isLoading={isLoading}
        output={data.outputVideo}
        error={data.outputError}
        type="video"
        label="Generated Video"
        accentColor={ACCENT}
      />

    </NodeShell>
  );
}
