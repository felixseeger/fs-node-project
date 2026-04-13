import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';
import {
  SectionHeader,
  LinkedBadges,
  ConnectedOrLocal,
  OutputHandle,
  OutputPreview,
  SecondaryOutputHandle,
  PillGroup,
  Slider,
  Toggle,
  PromptInput,
  TextInput,
  SettingsPanel,
  useNodeConnections,
  CATEGORY_COLORS,
  sp,
  font,
  border,
  radius,
  surface,
} from './shared';
import NodeGenerateButton from './NodeGenerateButton';

export function createVideoGeneratorNode(config) {
  const {
    displayName,
    apiGeneratorFn,
    apiPollerFn,
    imageInputs = [],
    videoInputs = [],
    audioInputs = [],
    supportsNegativePrompt = true,
    settingsControls = [],
    promptOptional = false,
    hidePrompt = false,
    secondaryOutput = null,
  } = config;

  const ACCENT = CATEGORY_COLORS.videoGeneration;

  return function VideoGeneratorNode({ id, data, selected }) {
    const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);
    const { progress, status, message, start, setProgress, complete, fail, isActive } = useNodeProgress();
    const [isHovered, setIsHovered] = useState(false);

    const getSettingValue = (key, defaultValue) => data[`local${key[0].toUpperCase()}${key.slice(1)}`] ?? defaultValue;

    const handleGenerate = useCallback(async () => {
      const promptText = hidePrompt ? null : resolve.text('prompt-in', data.inputPrompt);
      if (!hidePrompt && !promptText && !promptOptional) return;
      start('Generating...');
      update({ outputVideo: null, outputError: null });
      try {
        const params = { prompt: promptText };
        settingsControls.forEach(c => { params[c.paramName] = getSettingValue(c.key, c.defaultValue); });
        const result = await apiGeneratorFn(params);
        if (result.data?.generated?.length) {
          complete('Done');
          update({ outputVideo: result.data.generated[0] });
        }
      } catch (err) {
        fail(err);
        update({ outputError: err.message });
      }
    }, [id, data, update, resolve, start, complete, fail]);

    const lastTrigger = useRef(null);
    useEffect(() => {
      if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
        lastTrigger.current = data.triggerGenerate;
        handleGenerate();
      }
    }, [data.triggerGenerate, handleGenerate]);

    return (
      <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <NodeShell data={data} label={data.label || displayName} dotColor={ACCENT} selected={selected} onGenerate={handleGenerate} isGenerating={isActive} downloadUrl={data.outputVideo} downloadType="video" onDisconnect={disconnectNode}>
          <OutputHandle type="video" label="video" />

          {imageInputs.length > 0 && (
            <div style={imageInputs.length > 1 ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: sp[2] } : {}}>
              {imageInputs.map((input) => {
                const c = conn(input.id);
                const localKey = `local${input.id.replace(/-./g, x => x[1].toUpperCase())}`;
                return (
                  <div key={input.id}>
                    <SectionHeader label={input.label} handleId={input.id} handleType="target" color={getHandleColor('image-in')} extra={c.connected ? <LinkedBadges nodeId={id} handleId={input.id} onUnlink={data.onUnlink} /> : null} />
                    <ConnectedOrLocal connected={c.connected} connInfo={c.info}>
                      <ImageUploadBox image={data[localKey] || null} onImageChange={(img) => update({ [localKey]: img })} placeholder={`Upload ${input.label.toLowerCase()}`} minHeight={60} />
                    </ConnectedOrLocal>
                  </div>
                );
              })}
            </div>
          )}

          {!hidePrompt && (
            <>
              <SectionHeader label="Prompt" handleId="prompt-in" handleType="target" color={getHandleColor('prompt-in')}
                extra={<div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <ImprovePromptButton id={id} data={data} update={update} type="video" />
                </div>}
              />
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
                <ConnectedOrLocal connected={conn('prompt-in').connected} connInfo={conn('prompt-in').info}>
                  <PromptInput value={data.inputPrompt} onChange={(v) => update({ inputPrompt: v })} placeholder="Describe the video..." rows={3} />
                </ConnectedOrLocal>
              </div>
            </>
          )}

          <OutputPreview isLoading={isActive} output={data.outputVideo} error={data.outputError} type="video" label="Generated Video" accentColor={ACCENT} />
        </NodeShell>
      </div>
    );
  };
}

export default createVideoGeneratorNode;
