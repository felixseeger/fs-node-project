import { useCallback, useState, useEffect, useRef } from 'react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { klingElementsProGenerate, pollKlingElementsProStatus } from '../utils/api';
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
  PromptInput,
  TextInput,
  SettingsPanel,
  useNodeConnections,
  CATEGORY_COLORS,
  font,
  sp,
} from './shared';

const ACCENT = CATEGORY_COLORS.videoGeneration;

const DURATIONS = [
  { value: '5', label: '5s' },
  { value: '10', label: '10s' },
];

const ASPECT_RATIOS = [
  { value: 'widescreen_16_9', label: '16:9' },
  { value: 'social_story_9_16', label: '9:16' },
  { value: 'square_1_1', label: '1:1' },
];

export default function KlingElementsProNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localDuration = data.localDuration || '5';
  const localAspectRatio = data.localAspectRatio || 'widescreen_16_9';

  const images = conn('images-in');
  const prompt = conn('prompt-in');

  const handleGenerate = useCallback(async () => {
    const promptText = resolve.text('prompt-in', data.inputPrompt);
    const imageList = resolve.image('images-in', data.localImage);

    if (!imageList?.length) return;

    setIsLoading(true);
    update({ outputVideo: null, isLoading: true });

    try {
      const params = {
        images: imageList.slice(0, 4), // Kling Elements supports up to 4 images
        aspect_ratio: localAspectRatio,
        duration: localDuration,
      };

      if (promptText) {
        params.prompt = promptText;
      }

      if (data.inputNegativePrompt) {
        params.negative_prompt = data.inputNegativePrompt;
      }

      const result = await klingElementsProGenerate(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const status = await pollKlingElementsProStatus(taskId);
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
      console.error('Kling Elements Pro generation error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, resolve, localDuration, localAspectRatio]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <NodeShell label={data.label || 'Kling Elements Pro'} dotColor={ACCENT} selected={selected}>

      {/* Video Output Handle (top) */}
      <OutputHandle type="video" label="video" />

      {/* 1. Images (Required, Up to 4) */}
      <SectionHeader
        label="Images (1 to 4)"
        handleId="images-in"
        handleType="target"
        color={getHandleColor('image-in')}
        extra={images.connected ? (
          <LinkedBadges nodeId={id} handleId="images-in" onUnlink={data.onUnlink} />
        ) : null}
      />
      <ConnectedOrLocal connected={images.connected} connInfo={images.info}>
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Upload reference image"
          minHeight={60}
        />
      </ConnectedOrLocal>

      {/* 2. Prompt (Optional) */}
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
          placeholder="Describe the video..."
          rows={3}
        />
      </ConnectedOrLocal>

      {/* 3. Negative Prompt */}
      <div style={{ marginTop: sp[3] }}>
        <div style={{ ...font.sublabel, marginBottom: sp[1] }}>Negative Prompt</div>
        <TextInput
          value={data.inputNegativePrompt}
          onChange={(v) => update({ inputNegativePrompt: v })}
          placeholder="What to avoid..."
        />
      </div>

      {/* 4. Settings */}
      <SettingsPanel title="Video Settings">
        <PillGroup
          label="Aspect Ratio"
          options={ASPECT_RATIOS}
          value={localAspectRatio}
          onChange={(v) => update({ localAspectRatio: v })}
          accentColor={ACCENT}
        />

        <PillGroup
          label="Duration"
          options={DURATIONS}
          value={localDuration}
          onChange={(v) => update({ localDuration: v })}
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
