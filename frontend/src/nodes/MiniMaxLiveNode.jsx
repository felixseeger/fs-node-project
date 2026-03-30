import { useCallback, useState, useEffect, useRef } from 'react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { minimaxLiveGenerate, pollMiniMaxLiveStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import {
  SectionHeader,
  LinkedBadges,
  ConnectedOrLocal,
  OutputHandle,
  OutputPreview,
  Toggle,
  PromptInput,
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

const CAMERA_MOVEMENTS = [
  { value: '', label: 'None' },
  { value: '[Static shot]', label: 'Static' },
  { value: '[Truck left]', label: 'Truck Left' },
  { value: '[Truck right]', label: 'Truck Right' },
  { value: '[Pan left]', label: 'Pan Left' },
  { value: '[Pan right]', label: 'Pan Right' },
  { value: '[Push in]', label: 'Push In' },
  { value: '[Pull out]', label: 'Pull Out' },
  { value: '[Pedestal up]', label: 'Pedestal Up' },
  { value: '[Pedestal down]', label: 'Pedestal Down' },
  { value: '[Tilt up]', label: 'Tilt Up' },
  { value: '[Tilt down]', label: 'Tilt Down' },
  { value: '[Zoom in]', label: 'Zoom In' },
  { value: '[Zoom out]', label: 'Zoom Out' },
  { value: '[Shake]', label: 'Shake' },
  { value: '[Tracking shot]', label: 'Tracking' },
];

export default function MiniMaxLiveNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localPromptOptimizer = data.localPromptOptimizer ?? true;
  const localCameraMovement = data.localCameraMovement || '';

  const image = conn('image-in');
  const prompt = conn('prompt-in');

  const handleGenerate = useCallback(async () => {
    const promptText = resolve.text('prompt-in', data.inputPrompt);
    if (!promptText) return;

    const images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    setIsLoading(true);
    update({ outputVideo: null, isLoading: true });

    try {
      // Append camera movement to the prompt if one is selected and not already in the prompt
      let finalPrompt = promptText;
      if (localCameraMovement && !finalPrompt.includes(localCameraMovement)) {
        finalPrompt = `${finalPrompt} ${localCameraMovement}`;
      }

      const params = {
        image_url: images[0],
        prompt: finalPrompt,
        prompt_optimizer: localPromptOptimizer,
      };

      const result = await minimaxLiveGenerate(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const status = await pollMiniMaxLiveStatus(taskId);
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
      console.error('MiniMax Live generation error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, resolve, localPromptOptimizer, localCameraMovement]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <NodeShell label={data.label || 'MiniMax Video 01 Live'} dotColor={ACCENT} selected={selected}>

      {/* Video Output Handle (top) */}
      <OutputHandle type="video" label="video" />

      {/* 1. Image (Required) */}
      <SectionHeader
        label="Image (Required)"
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
          placeholder="Upload source image"
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
          placeholder="Describe the video motion..."
          rows={3}
        />
      </ConnectedOrLocal>

      {/* 3. Settings */}
      <SettingsPanel title="Video Settings">
        {/* Camera Movement */}
        <div style={{ marginBottom: sp[3] }}>
          <div style={{ ...font.sublabel, marginBottom: sp[2] }}>Camera Movement</div>
          <select
            value={localCameraMovement}
            onChange={(e) => update({ localCameraMovement: e.target.value })}
            style={{
              ...inputStyle,
              fontSize: 11,
            }}
          >
            {CAMERA_MOVEMENTS.map((c) => <option key={c.label} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <Toggle
          label="Prompt Optimizer"
          value={localPromptOptimizer}
          onChange={(v) => update({ localPromptOptimizer: v })}
          accentColor={ACCENT}
        />
      </SettingsPanel>

      {/* 4. Output */}
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
