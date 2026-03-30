import { useCallback, useState, useEffect, useRef } from 'react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { klingO1Generate, pollKlingO1Status } from '../utils/api';
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
  SettingsPanel,
  useNodeConnections,
  CATEGORY_COLORS,
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
];

const DURATIONS = [
  { value: 5, label: '5s' },
  { value: 10, label: '10s' },
];

export default function KlingO1Node({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localModel = data.localModel || 'std';
  const localDuration = data.localDuration || 5;
  const localAspectRatio = data.localAspectRatio || '16:9';

  const startImage = conn('start-image-in');
  const endImage = conn('end-image-in');
  const prompt = conn('prompt-in');

  const handleGenerate = useCallback(async () => {
    const promptText = resolve.text('prompt-in', data.inputPrompt);
    const startImages = resolve.image('start-image-in', data.localStartImage);
    const endImages = resolve.image('end-image-in', data.localEndImage);

    // Kling O1 requires at least a first or last frame.
    if (!startImages?.length && !endImages?.length) return;

    setIsLoading(true);
    update({ outputVideo: null, isLoading: true });

    try {
      const params = {
        aspect_ratio: localAspectRatio,
        duration: localDuration,
      };

      if (promptText) {
        params.prompt = promptText;
      }

      if (startImages?.length) {
        params.first_frame = startImages[0];
      }

      if (endImages?.length) {
        params.last_frame = endImages[0];
      }

      const result = await klingO1Generate(localModel, params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const status = await pollKlingO1Status(taskId);
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
      console.error('Kling O1 generation error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, resolve, localModel, localDuration, localAspectRatio]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <NodeShell label={data.label || 'Kling O1'} dotColor={ACCENT} selected={selected}>

      {/* Video Output Handle (top) */}
      <OutputHandle type="video" label="video" />

      {/* 1. First Frame (Optional) */}
      <SectionHeader
        label="First Frame (Optional)"
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
          placeholder="Upload first frame"
          minHeight={60}
        />
      </ConnectedOrLocal>

      {/* 2. Last Frame (Optional) */}
      <SectionHeader
        label="Last Frame (Optional)"
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
          placeholder="Upload last frame"
          minHeight={60}
        />
      </ConnectedOrLocal>

      {/* 3. Prompt */}
      <SectionHeader
        label="Prompt (Optional)"
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
          placeholder="Describe the motion/transition..."
          rows={3}
        />
      </ConnectedOrLocal>

      {/* 4. Settings */}
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
          min={5}
          max={10}
          step={5}
          unit="s"
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
