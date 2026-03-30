import { useCallback, useState, useEffect, useRef } from 'react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { kling3OmniGenerate, pollKling3OmniStatus } from '../utils/api';
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
  Toggle,
  Slider,
  PromptInput,
  TextInput,
  SettingsPanel,
  useNodeConnections,
  CATEGORY_COLORS,
  surface,
  text,
  font,
  sp,
} from './shared';

const ACCENT = CATEGORY_COLORS.videoGeneration;

const MODELS = [
  { value: 'std', label: 'Standard' },
  { value: 'pro', label: 'Pro' },
];

const ASPECT_RATIOS = [
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '1:1', label: '1:1' },
  { value: 'auto', label: 'Auto' },
];

const DURATIONS = [
  { value: 5, label: '5s' },
  { value: 10, label: '10s' },
];

export default function Kling3OmniNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localModel = data.localModel || 'std';
  const localDuration = data.localDuration || 5;
  const localAspectRatio = data.localAspectRatio || '16:9';
  const localCfgScale = data.localCfgScale ?? 0.5;
  const localGenerateAudio = data.localGenerateAudio ?? false;

  const startImage = conn('start-image-in');
  const endImage = conn('end-image-in');
  const prompt = conn('prompt-in');
  const video = conn('video-in');

  const handleGenerate = useCallback(async () => {
    const promptText = resolve.text('prompt-in', data.inputPrompt);

    const startImages = resolve.image('start-image-in', data.localStartImage);
    const endImages = resolve.image('end-image-in', data.localEndImage);

    let referenceVideos = data.resolveInput?.(id, 'video-in');
    if (!referenceVideos?.length && data.localVideo) referenceVideos = [data.localVideo];

    if (!promptText && !referenceVideos?.length) return;

    setIsLoading(true);
    update({ outputVideo: null, isLoading: true });

    try {
      const params = {
        aspect_ratio: localAspectRatio,
        duration: localDuration.toString(),
        cfg_scale: localCfgScale,
        generate_audio: localGenerateAudio,
      };

      if (promptText) {
        params.prompt = promptText;
      }

      if (data.inputNegativePrompt) {
        params.negative_prompt = data.inputNegativePrompt;
      }

      if (startImages?.length) {
        params.start_image_url = startImages[0];
      }

      if (endImages?.length) {
        params.end_image_url = endImages[0];
      }

      if (referenceVideos?.length) {
        params.video_url = referenceVideos[0];
      }

      const result = await kling3OmniGenerate(localModel, params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const status = await pollKling3OmniStatus(taskId, !!referenceVideos?.length);
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
      console.error('Kling 3 Omni generation error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, resolve, localModel, localDuration, localAspectRatio, localCfgScale, localGenerateAudio]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <NodeShell label={data.label || 'Kling 3 Omni'} dotColor={ACCENT} selected={selected}>

      {/* Video Output Handle (top) */}
      <OutputHandle type="video" label="video" />

      {/* 0. Video Input (Optional, for Reference) */}
      <SectionHeader
        label="Reference Video (Optional)"
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

      {/* 1. Start Image (Optional) */}
      <SectionHeader
        label="Start Frame (Optional)"
        handleId="start-image-in"
        handleType="target"
        color={getHandleColor('image-in')}
        extra={startImage.connected ? (
          <LinkedBadges nodeId={id} handleId="start-image-in" onUnlink={data.onUnlink} />
        ) : null}
      />
      <ConnectedOrLocal connected={startImage.connected} connInfo={startImage.info}>
        <ImageUploadBox
          image={data.localStartImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localStartImage: img })}
          placeholder="Click or drag to upload start frame"
          minHeight={60}
        />
      </ConnectedOrLocal>

      {/* 2. End Image (Optional) */}
      <SectionHeader
        label="End Frame (Optional)"
        handleId="end-image-in"
        handleType="target"
        color={getHandleColor('image-in')}
        extra={endImage.connected ? (
          <LinkedBadges nodeId={id} handleId="end-image-in" onUnlink={data.onUnlink} />
        ) : null}
      />
      <ConnectedOrLocal connected={endImage.connected} connInfo={endImage.info}>
        <ImageUploadBox
          image={data.localEndImage || null}
          onImageChange={(img) => update({ localEndImage: img })}
          placeholder="Click or drag to upload end frame"
          minHeight={60}
        />
      </ConnectedOrLocal>

      {/* 3. Prompt */}
      <SectionHeader
        label="Prompt"
        handleId="prompt-in"
        handleType="target"
        color={getHandleColor('prompt-in')}
        extra={
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <AutoPromptButton id={id} data={data} update={update} imageKey="start-image-in" localImageKey="localStartImage" />
            <ImprovePromptButton id={id} data={data} update={update} type="video" />
            {prompt.connected ? <LinkedBadges nodeId={id} handleId="prompt-in" onUnlink={data.onUnlink} /> : null}
          </div>
        }
      />
      <ConnectedOrLocal connected={prompt.connected} connInfo={prompt.info}>
        <PromptInput
          value={data.inputPrompt}
          onChange={(v) => update({ inputPrompt: v })}
          placeholder="Describe the video... (Req. if no ref video)"
          rows={3}
        />
      </ConnectedOrLocal>

      {/* 4. Negative Prompt */}
      <div style={{ marginTop: sp[3] }}>
        <div style={{ ...font.sublabel, marginBottom: sp[1] }}>Negative Prompt</div>
        <TextInput
          value={data.inputNegativePrompt}
          onChange={(v) => update({ inputNegativePrompt: v })}
          placeholder="What to avoid..."
        />
      </div>

      {/* 5. Settings */}
      <SettingsPanel title="Video Settings">
        <PillGroup
          label="Model Tier"
          options={MODELS}
          value={localModel}
          onChange={(v) => update({ localModel: v })}
          accentColor={ACCENT}
        />

        <PillGroup
          label="Aspect Ratio"
          options={ASPECT_RATIOS}
          value={localAspectRatio}
          onChange={(v) => update({ localAspectRatio: v })}
          accentColor={ACCENT}
        />

        <Slider
          label="Duration (seconds)"
          value={localDuration}
          onChange={(v) => update({ localDuration: v })}
          min={3}
          max={15}
          step={1}
          unit="s"
          accentColor={ACCENT}
        />

        <Slider
          label="CFG Scale (Prompt Adherence)"
          value={localCfgScale}
          onChange={(v) => update({ localCfgScale: v })}
          min={0}
          max={1}
          step={0.05}
          accentColor={ACCENT}
        />

        <Toggle
          label="Generate Audio"
          value={localGenerateAudio}
          onChange={(v) => update({ localGenerateAudio: v })}
          accentColor={ACCENT}
        />
      </SettingsPanel>

      {/* 6. Output */}
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
