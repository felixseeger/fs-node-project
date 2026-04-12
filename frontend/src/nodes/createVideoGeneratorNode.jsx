/**
 * Factory for creating video generation nodes with common patterns.
 * Reduces duplication across Kling3, Runway, PixVerse, etc.
 */

import { useCallback, useEffect, useRef } from 'react';
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
} from './shared';

/**
 * Creates a video generator node with configurable API, settings, and UI.
 *
 * @param {Object} config - Configuration object
 * @param {string} config.displayName - Display name for the node
 * @param {Function} config.apiGeneratorFn - API function: (params) => Promise
 * @param {Function} config.apiPollerFn - Poll function: (taskId, maxAttempts, intervalMs, onProgress) => Promise
 * @param {Array<{id: string, label: string, paramName: string}>} config.imageInputs - Image inputs (e.g. start/end frames)
 * @param {Array<{id: string, label: string, paramName: string}>} config.videoInputs - Video inputs (e.g. reference video)
 * @param {Array<{id: string, label: string, paramName: string}>} config.audioInputs - Audio inputs (e.g. voiceover)
 * @param {boolean} config.supportsNegativePrompt - Whether to show negative prompt field
 * @param {Array<Object>} config.settingsControls - Array of setting control definitions
 * @param {boolean} config.promptOptional - Whether the text prompt is optional (default: false)
 * @param {boolean} config.hidePrompt - Whether to completely hide the prompt input (default: false)
 * @param {Object} config.secondaryOutput - Optional secondary output { id: string, label: string }
 * @returns {React.Component} Video generator node component
 */
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

    // Extract settings from data with defaults
    const getSettingValue = (key, defaultValue) => data[`local${key[0].toUpperCase()}${key.slice(1)}`] ?? defaultValue;

    // Connections
    const prompt = conn('prompt-in');

    const handleGenerate = useCallback(async () => {
      const promptText = hidePrompt ? null : resolve.text('prompt-in', data.inputPrompt);
      if (!hidePrompt && !promptText && !promptOptional) return;

      start('Submitting video generation request...');
      update({ outputVideo: null, outputError: null });

      try {
        const params = {};
        if (!hidePrompt && promptText) {
          params.prompt = promptText;
        }

        if (!hidePrompt && supportsNegativePrompt && data.inputNegativePrompt) {
          params.negative_prompt = data.inputNegativePrompt;
        }

        // Resolve and map image inputs
        for (const input of imageInputs) {
          const localKey = `local${input.id.replace(/-./g, x => x[1].toUpperCase())}`;
          const images = resolve.image(input.id, data[localKey]);
          if (images?.length && input.paramName) {
            if (input.isArray) {
              params[input.paramName] = images;
            } else {
              params[input.paramName] = images[0];
            }
          }
        }

        // Resolve and map video inputs
        for (const input of videoInputs) {
          const localKey = `local${input.id.replace(/-./g, x => x[1].toUpperCase())}`;
          const videos = resolve.video(input.id, data[localKey]);
          if (videos?.length && input.paramName) {
            params[input.paramName] = videos[0]; // Assuming resolve.video returns array of urls
          } else if (data[localKey]) {
            params[input.paramName] = data[localKey]; // Fallback to local text input
          }
        }

        // Resolve and map audio inputs
        for (const input of audioInputs) {
          const localKey = `local${input.id.replace(/-./g, x => x[1].toUpperCase())}`;
          const audios = resolve.audio(input.id, data[localKey]);
          if (audios?.length && input.paramName) {
            params[input.paramName] = audios[0];
          } else if (data[localKey]) {
            params[input.paramName] = data[localKey]; // Fallback to local text input
          }
        }

        // Collect settings
        settingsControls.forEach((control) => {
          const value = getSettingValue(control.key, control.defaultValue);
          if (control.paramName) {
            params[control.paramName] = value;
          }
        });

        // Call API
        const result = await apiGeneratorFn(params);

        if (result.error) {
          fail(new Error(result.error?.message || 'Generation failed'));
          update({ outputError: result.error?.message || JSON.stringify(result.error) });
          return;
        }

        const taskId = result.task_id || result.data?.task_id;

        if (taskId && apiPollerFn) {
          let lastProgress = 10;
          const status = await apiPollerFn(taskId, params, 120, 2000, (attempt, maxAttempts) => {
            lastProgress = 10 + Math.min(85, (attempt / maxAttempts) * 85);
            setProgress(lastProgress, `Generating video... (${attempt}/${maxAttempts})`);
          });

          const generated = status.data?.generated || [];
          complete('Video generation complete');
          update({
            outputVideo: generated[0] || null,
            outputVideos: generated,
            outputError: null,
          });
        } else if (result.data?.generated?.length) {
          complete('Done');
          update({
            outputVideo: result.data.generated[0],
            outputVideos: result.data.generated,
            outputError: null,
          });
        } else {
          complete('No videos generated');
        }
      } catch (err) {
        console.error(`${displayName} generation error:`, err);
        fail(err);
        update({ outputError: err.message });
      }
    }, [id, data, update, resolve, start, setProgress, complete, fail]);

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
        label={data.label || displayName}
        dotColor={ACCENT}
        selected={selected}
        onGenerate={handleGenerate}
        isGenerating={isActive}
        downloadUrl={data.outputVideo}
        downloadType="video" onDisconnect={disconnectNode}
      >
        <OutputHandle type="video" label="video" />

        {/* Dynamic Image Inputs */}
        {imageInputs.length > 0 && (
          <div style={imageInputs.length > 1 ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: sp[2] } : {}}>
            {imageInputs.map((input) => {
              const c = conn(input.id);
              const localKey = `local${input.id.replace(/-./g, x => x[1].toUpperCase())}`;
              return (
                <div key={input.id}>
                  <SectionHeader
                    label={input.label}
                    handleId={input.id}
                    handleType="target"
                    color={getHandleColor('image-in')}
                    extra={c.connected ? (
                      <LinkedBadges nodeId={id} handleId={input.id} onUnlink={data.onUnlink} />
                    ) : null}
                  />
                  <ConnectedOrLocal connected={c.connected} connInfo={c.info}>
                    <ImageUploadBox
                      image={data[localKey] || null}
                      onImageChange={(img) => update({ [localKey]: img })}
                      placeholder={`Upload ${input.label.toLowerCase()}`}
                      minHeight={60}
                    />
                  </ConnectedOrLocal>
                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic Video Inputs */}
        {videoInputs.map((input) => {
          const c = conn(input.id);
          const localKey = `local${input.id.replace(/-./g, x => x[1].toUpperCase())}`;
          return (
            <div key={input.id}>
              <SectionHeader
                label={input.label}
                handleId={input.id}
                handleType="target"
                color={getHandleColor('video-in')}
                extra={c.connected ? (
                  <LinkedBadges nodeId={id} handleId={input.id} onUnlink={data.onUnlink} />
                ) : null}
              />
              <ConnectedOrLocal connected={c.connected} connInfo={c.info}>
                <TextInput
                  value={data[localKey] || ''}
                  onChange={(v) => update({ [localKey]: v })}
                  placeholder={`Reference ${input.label.toLowerCase()} URL...`}
                />
              </ConnectedOrLocal>
            </div>
          );
        })}

        {/* Dynamic Audio Inputs */}
        {audioInputs.map((input) => {
          const c = conn(input.id);
          const localKey = `local${input.id.replace(/-./g, x => x[1].toUpperCase())}`;
          return (
            <div key={input.id}>
              <SectionHeader
                label={input.label}
                handleId={input.id}
                handleType="target"
                color={getHandleColor('audio-in')}
                extra={c.connected ? (
                  <LinkedBadges nodeId={id} handleId={input.id} onUnlink={data.onUnlink} />
                ) : null}
              />
              <ConnectedOrLocal connected={c.connected} connInfo={c.info}>
                <TextInput
                  value={data[localKey] || ''}
                  onChange={(v) => update({ [localKey]: v })}
                  placeholder={`Reference ${input.label.toLowerCase()} URL...`}
                />
              </ConnectedOrLocal>
            </div>
          );
        })}

        {/* Prompt Input */}
        {!hidePrompt && (
          <>
            <SectionHeader
              label="Prompt"
              handleId="prompt-in"
              handleType="target"
              color={getHandleColor('prompt-in')}
              extra={
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {imageInputs.length > 0 && (
                    <AutoPromptButton 
                      id={id} 
                      data={data} 
                      update={update} 
                      imageKey={imageInputs[0].id} 
                      localImageKey={`local${imageInputs[0].id.replace(/-./g, x => x[1].toUpperCase())}`} 
                    />
                  )}
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
          </>
        )}

        {/* Negative Prompt */}
        {!hidePrompt && supportsNegativePrompt && (
          <div style={{ marginTop: sp[3] }}>
            <div style={{ ...font.sublabel, marginBottom: sp[1] }}>Negative Prompt</div>
            <TextInput
              value={data.inputNegativePrompt}
              onChange={(v) => update({ inputNegativePrompt: v })}
              placeholder="What to avoid..."
            />
          </div>
        )}

        {/* Settings Panel */}
        {settingsControls.length > 0 && (
          <SettingsPanel title="Video Settings">
            {settingsControls.map((control) => {
              const value = getSettingValue(control.key, control.defaultValue);
              const onChange = (v) => update({ [`local${control.key[0].toUpperCase()}${control.key.slice(1)}`]: v });

              if (control.type === 'pills') {
                return (
                  <PillGroup
                    key={control.key}
                    label={control.label}
                    options={control.options}
                    value={value}
                    onChange={onChange}
                    accentColor={ACCENT}
                  />
                );
              }

              if (control.type === 'slider') {
                return (
                  <Slider
                    key={control.key}
                    label={control.label}
                    value={value}
                    onChange={onChange}
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    unit={control.unit}
                    accentColor={ACCENT}
                  />
                );
              }

              if (control.type === 'toggle') {
                return (
                  <Toggle
                    key={control.key}
                    label={control.label}
                    value={value}
                    onChange={onChange}
                    accentColor={ACCENT}
                  />
                );
              }

              if (control.type === 'number') {
                return (
                  <div key={control.key} style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>{control.label}</div>
                    <input 
                      type="number" 
                      className="nodrag nopan"
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
                      onMouseDown={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      placeholder={control.placeholder}
                      style={{
                        width: '100%', background: '#111', border: '1px solid #3a3a3a',
                        borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '4px 8px',
                        outline: 'none', boxSizing: 'border-box',
                      }} />
                  </div>
                );
              }

              if (control.type === 'select') {
                return (
                  <div key={control.key} style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>{control.label}</div>
                    <select 
                      className="nodrag nopan"
                      value={value} 
                      onChange={(e) => onChange(e.target.value)}
                      onMouseDown={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      style={{
                        width: '100%', background: '#111', border: '1px solid #3a3a3a',
                        borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '6px 8px',
                        outline: 'none', boxSizing: 'border-box',
                      }}>
                      {control.options.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                );
              }

              return null;
            })}
          </SettingsPanel>
        )}

        {/* Progress */}
        {isActive && (
          <NodeProgress progress={progress} status={status} message={message} />
        )}

        {/* Output Preview */}
        <OutputPreview
          isLoading={isActive}
          output={data.outputVideo}
          error={data.outputError}
          type="video"
          label="Generated Video"
          accentColor={ACCENT}
        />

        {/* Secondary Output Handle */}
        {secondaryOutput && (
          <SecondaryOutputHandle id={secondaryOutput.id} label={secondaryOutput.label} />
        )}
      </NodeShell>
    );
  };
}

export default createVideoGeneratorNode;