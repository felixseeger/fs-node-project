import { useCallback, useEffect, useRef, useState } from 'react';
import NodeShell from './NodeShell';
import { SectionHeader, ConnectedOrLocal, PromptInput, TextInput, OutputHandle, OutputPreview } from './shared';
import { NodeCapabilities } from './nodeCapabilities';
import useNodeConnections from './useNodeConnections';
import { CATEGORY_COLORS } from './nodeTokens';
import { tripoCreateTask, tripoGetTask } from '../utils/api';

function resolveTripoOutput(data) {
  const output = data?.output || data?.result || data?.data?.output;
  if (!output) return { modelUrl: null, previewUrl: null };
  const modelUrl =
    output.model_url ||
    output.model ||
    output.glb_url ||
    output.glb ||
    output.obj_url ||
    output.usdz_url ||
    null;
  const previewUrl =
    output.rendered_image ||
    output.preview_image ||
    output.thumbnail ||
    output.cover_image ||
    null;
  return { modelUrl, previewUrl };
}

export default function Tripo3DNode({ id, data, selected }) {
  const { hasConnection, getConnInfo } = useNodeConnections(id, data);
  const [localPrompt, setLocalPrompt] = useState(data.localPrompt || '');
  const [localNegativePrompt, setLocalNegativePrompt] = useState(data.localNegativePrompt || '');
  const lastTrigger = useRef(null);

  const update = useCallback((patch) => {
    data.onUpdate?.(id, patch);
  }, [data, id]);

  const handleGenerate = useCallback(async () => {
    let prompt = data.resolveInput?.(id, 'prompt-in');
    if (!prompt) prompt = localPrompt;
    if (!prompt) return;

    const negativePrompt = localNegativePrompt?.trim() || undefined;
    update({
      isLoading: true,
      outputError: null,
      outputModelUrl: null,
      outputPreviewImage: null,
      taskStatus: 'queued',
    });

    try {
      const createResponse = await tripoCreateTask({
        type: 'text_to_model',
        prompt,
        ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
      });

      const taskId = createResponse?.data?.task_id;
      if (!taskId) {
        throw new Error(createResponse?.error || 'Tripo3D task id missing in response');
      }

      update({ taskId, taskStatus: 'running' });

      let statusPayload = null;
      for (let attempt = 0; attempt < 90; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        statusPayload = await tripoGetTask(taskId);
        const status = statusPayload?.data?.status;
        if (status) update({ taskStatus: status });
        if (status === 'success' || status === 'failed') break;
      }

      const finalStatus = statusPayload?.data?.status;
      if (finalStatus !== 'success') {
        throw new Error(statusPayload?.data?.message || statusPayload?.error || 'Tripo3D generation failed');
      }

      const { modelUrl, previewUrl } = resolveTripoOutput(statusPayload?.data);
      update({
        isLoading: false,
        outputError: null,
        taskStatus: finalStatus,
        outputModelUrl: modelUrl,
        outputPreviewImage: previewUrl,
      });
    } catch (error) {
      update({
        isLoading: false,
        taskStatus: 'failed',
        outputError: error?.message || 'Tripo3D generation failed',
      });
    }
  }, [data, id, localNegativePrompt, localPrompt, update]);

  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <NodeShell
      data={data}
      label={data.label || 'Tripo3D'}
      editableTitle={{
        value: String(data.label ?? ''),
        onCommit: (next) => update({ label: next }),
        placeholder: 'Generate 3D',
      }}
      dotColor={CATEGORY_COLORS.utility}
      selected={selected}
      onGenerate={handleGenerate}
      isGenerating={data.isLoading}
      onDisconnect={(h) => data.onUnlink?.(id, h)}
      downloadUrl={data.outputPreviewImage || undefined}
      capabilities={[NodeCapabilities.MODEL_3D_GENERATE]}
    >
      <OutputHandle id="model-out" label="3d out" color={CATEGORY_COLORS.utility} />

      <SectionHeader
        label="Prompt (Required)"
        handleId="prompt-in"
        handleType="target"
        color={CATEGORY_COLORS.vision}
        isConnected={hasConnection('prompt-in')}
        onUnlink={() => data.onUnlink?.(id, 'prompt-in')}
      />
      <ConnectedOrLocal
        isConnected={hasConnection('prompt-in')}
        connLabel={getConnInfo('prompt-in') ? `Linked from ${getConnInfo('prompt-in').nodeLabel}` : ''}
      >
        <PromptInput
          value={localPrompt}
          onChange={(value) => {
            setLocalPrompt(value);
            update({ localPrompt: value });
          }}
          placeholder="Describe the 3D model..."
        />
      </ConnectedOrLocal>

      <SectionHeader
        label="Negative Prompt (Optional)"
        color={CATEGORY_COLORS.utility}
      />
      <TextInput
        value={localNegativePrompt}
        onChange={(value) => {
          setLocalNegativePrompt(value);
          update({ localNegativePrompt: value });
        }}
        placeholder="What to avoid in the generated model..."
      />

      {data.outputModelUrl ? (
        <div style={{ marginTop: 8 }}>
          <a
            href={data.outputModelUrl}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#93c5fd', fontSize: 12, textDecoration: 'none' }}
          >
            Open generated 3D model
          </a>
        </div>
      ) : null}

      <OutputPreview
        isLoading={data.isLoading}
        output={data.outputPreviewImage}
        error={data.outputError}
        accentColor={CATEGORY_COLORS.utility}
        label="3D Preview"
      />
    </NodeShell>
  );
}
