import { useCallback, useState, useEffect, useRef } from 'react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { wan26Generate, pollWan26Status } from '../utils/api';
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
  PromptInput,
  TextInput,
  SettingsPanel,
  useNodeConnections,
  CATEGORY_COLORS,
  surface,
  border,
  text,
  font,
  sp,
  radius,
  inputStyle,
} from './shared';

const ACCENT = CATEGORY_COLORS.videoGeneration;

const RESOLUTIONS = [
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
];

const DURATIONS = [
  { value: '5', label: '5s' },
  { value: '10', label: '10s' },
  { value: '15', label: '15s' },
];

const RATIOS = [
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '1:1', label: '1:1' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
];

const SHOT_TYPES = [
  { value: 'single', label: 'Single' },
  { value: 'multi', label: 'Multi' },
];

const SIZE_MAP = {
  '720p': {
    '16:9': '1280*720',
    '9:16': '720*1280',
    '1:1': '960*960',
    '4:3': '1088*832',
    '3:4': '832*1088',
  },
  '1080p': {
    '16:9': '1920*1080',
    '9:16': '1080*1920',
    '1:1': '1440*1440',
    '4:3': '1632*1248',
    '3:4': '1248*1632',
  }
};

export default function Wan26VideoNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localResolution = data.localResolution || '720p';
  const localDuration = data.localDuration || '5';
  const localRatio = data.localRatio || '16:9';
  const localShotType = data.localShotType || 'single';
  const localPromptExpansion = data.localPromptExpansion || false;
  const localSeed = data.localSeed || -1;

  const image = conn('image-in');
  const prompt = conn('prompt-in');

  const handleGenerate = useCallback(async () => {
    const promptText = resolve.text('prompt-in', data.inputPrompt);
    if (!promptText) return;

    const images = resolve.image('image-in', data.localImage);

    setIsLoading(true);
    update({ outputVideo: null, isLoading: true });

    try {
      const mode = images?.length ? 'image-to-video' : 'text-to-video';
      const size = SIZE_MAP[localResolution][localRatio];

      const params = {
        prompt: promptText,
        size,
        duration: localDuration,
        shot_type: localShotType,
        enable_prompt_expansion: localPromptExpansion,
        seed: localSeed,
      };

      if (data.inputNegativePrompt) {
        params.negative_prompt = data.inputNegativePrompt;
      }

      if (images?.length) {
        params.image = images[0];
      }

      const result = await wan26Generate(mode, localResolution, params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const status = await pollWan26Status(mode, localResolution, taskId);
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
      console.error('WAN 2.6 generation error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, resolve, localResolution, localDuration, localRatio, localShotType, localPromptExpansion, localSeed]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <NodeShell label={data.label || 'WAN 2.6 Video'} dotColor={ACCENT} selected={selected}>

      {/* Video Output Handle (top) */}
      <OutputHandle type="video" label="video" />

      {/* 1. Image (Optional, triggers I2V) */}
      <SectionHeader
        label="Image (Optional)"
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
          placeholder="Upload keyframe (optional)"
          minHeight={60}
        />
      </ConnectedOrLocal>

      {/* 2. Prompt (Required) */}
      <SectionHeader
        label="Prompt (Required)"
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
          placeholder="Scene description, camera moves..."
          rows={3}
        />
      </ConnectedOrLocal>

      {/* 3. Negative Prompt */}
      <div style={{ marginTop: sp[3] }}>
        <div style={{ ...font.sublabel, marginBottom: sp[1] }}>Negative Prompt</div>
        <TextInput
          value={data.inputNegativePrompt}
          onChange={(v) => update({ inputNegativePrompt: v })}
          placeholder="blurry, low quality, watermark..."
        />
      </div>

      {/* 4. Settings */}
      <SettingsPanel title="Video Settings">
        <PillGroup
          label="Resolution"
          options={RESOLUTIONS}
          value={localResolution}
          onChange={(v) => update({ localResolution: v })}
          accentColor={ACCENT}
        />

        <PillGroup
          label="Duration"
          options={DURATIONS}
          value={localDuration}
          onChange={(v) => update({ localDuration: v })}
          accentColor={ACCENT}
        />

        <PillGroup
          label="Aspect Ratio"
          options={RATIOS}
          value={localRatio}
          onChange={(v) => update({ localRatio: v })}
          accentColor={ACCENT}
        />

        <PillGroup
          label="Shot Type"
          options={SHOT_TYPES}
          value={localShotType}
          onChange={(v) => update({ localShotType: v })}
          accentColor={ACCENT}
        />

        <Toggle
          label="Prompt Expansion"
          value={localPromptExpansion}
          onChange={(v) => update({ localPromptExpansion: v })}
          accentColor={ACCENT}
        />

        {/* Seed */}
        <div style={{ marginBottom: sp[2] }}>
          <div style={{ ...font.sublabel, marginBottom: sp[1] }}>Seed</div>
          <TextInput
            value={localSeed}
            onChange={(v) => update({ localSeed: Number(v) })}
            placeholder="-1 for random"
            type="number"
          />
        </div>
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
