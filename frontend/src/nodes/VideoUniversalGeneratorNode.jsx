/* eslint-disable react-refresh/only-export-components */
import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { Handle, Position } from '@xyflow/react';
import { getHandleColor } from '../utils/handleTypes';
import {
  CATEGORY_COLORS, sp, font, text, surface, border, radius,
  useNodeConnections, OutputPreview, OutputHandle,
} from './shared';
import BaseNode from './BaseNode';
import NodeGenerateButton from './NodeGenerateButton';
import NodeDownloadButton from './NodeDownloadButton';
import {
  kling3Generate, pollKling3Status,
  runwayGen4TurboGenerate, pollRunwayGen4TurboStatus,
  minimaxLiveGenerate, pollMiniMaxLiveStatus,
  pixVerseV5Generate, pollPixVerseV5Status,
  seedanceGenerate, pollSeedanceStatus,
  wan26Generate, pollWan26Status,
  ltxVideoDirectGenerate,
  improvePromptGenerate, pollImprovePromptStatus,
} from '../utils/api';
import { VIDEO_UNIVERSAL_MODEL_DEFS } from './videoUniversalGeneratorModels';

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'];

const MODEL_DEFS = VIDEO_UNIVERSAL_MODEL_DEFS;

const COST_MAP = {
  'Auto': 0.20, 'kling3': 0.20, 'runway': 0.15, 'minimax': 0.10,
  'pixverse': 0.12, 'seedance': 0.08, 'wan2.6': 0.18, 'ltx-video': 0.14,
};

export default function VideoUniversalGeneratorNode({ id, data, selected }) {
  const { update, disconnectNode } = useNodeConnections(id, data);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const [isHoveringRun, setIsHoveringRun] = useState(false);
  const [showReferenceMenu, setShowReferenceMenu] = useState(false);
  const [dragOverFrame, setDragOverFrame] = useState(null); // 'start', 'end', or null
  const lastTrigger = useRef(null);
  const promptRef = useRef(null);

  // Settings from data with defaults
  const locked = data.locked || false;
  const numOutputs = data.numOutputs || 1;
  const aspectRatio = data.aspectRatio || '16:9';
  const models = data.models || ['kling3'];

  // Check if any selected model supports image input (start frame)
  const selectedModelsSupportImage = models.some(m => {
    if (m === 'Auto') return true;
    return MODEL_DEFS[m]?.supportsImageInput ?? false;
  });

  // Check if any selected model supports end frame
  const selectedModelsSupportEndFrame = models.some(m => {
    if (m === 'Auto') return true;
    return MODEL_DEFS[m]?.supportsEndFrame ?? false;
  });

  // Calculate handle positions based on what's visible
  const hasImageSection = selectedModelsSupportImage || selectedModelsSupportEndFrame;

  // Smart Auto model selection based on inputs and preferences
  const selectAutoModel = useCallback((hasStartFrame, hasEndFrame) => {
    // If no start frame provided, must use text-to-video model
    if (!hasStartFrame) {
      // LTX and Seedance support text-to-video
      // LTX has better quality, Seedance is faster/cheaper
      return 'ltx-video';
    }
    
    // If end frame provided, need model that supports both
    if (hasEndFrame) {
      // Pixverse and Wan2.6 support both start and end frames
      // Pixverse is more reliable
      return 'pixverse';
    }
    
    // Single image input - use best quality image-to-video
    // Kling3 has best quality but requires public URL
    // Check if image is a data URL - if so, use alternative
    if (hasStartFrame && hasStartFrame.startsWith('data:image')) {
      // Use models that work with data URLs or don't require images
      return 'pixverse'; // More flexible with inputs
    }
    
    return 'kling3'; // Best quality for image-to-video
  }, []);

  const generateForModel = useCallback(async (model, prompt, startFrameUrl, endFrameUrl) => {
    const effectiveModel = model === 'Auto' 
      ? selectAutoModel(Boolean(startFrameUrl), Boolean(endFrameUrl), startFrameUrl)
      : model;
    const params = { prompt, aspect_ratio: aspectRatio };

    const dispatch = {
      kling3: async () => {
        // Kling3 requires an image input
        if (!startFrameUrl) throw new Error('Kling3 requires an input image. Please connect an image to the start-frame-in handle.');
        params.image = startFrameUrl;
        // Add end frame if provided and model supports it
        if (endFrameUrl && MODEL_DEFS['kling3']?.supportsEndFrame) {
          params.end_image = endFrameUrl;
        }
        const result = await kling3Generate('pro', params);
        if (result.error) throw new Error(result.error?.message || 'Kling3 generation failed');
        const taskId = result.task_id || result.data?.task_id;
        if (taskId) return (await pollKling3Status(taskId)).data?.generated || [];
        return result.data?.generated || [];
      },
      runway: async () => {
        const result = await runwayGen4TurboGenerate({ prompt });
        if (result.error) throw new Error(result.error?.message || 'Runway generation failed');
        const taskId = result.task_id || result.data?.task_id;
        if (taskId) return (await pollRunwayGen4TurboStatus(taskId)).data?.generated || [];
        return result.data?.generated || [];
      },
      minimax: async () => {
        const result = await minimaxLiveGenerate(params);
        if (result.error) throw new Error(result.error?.message || 'MiniMax generation failed');
        const taskId = result.task_id || result.data?.task_id;
        if (taskId) return (await pollMiniMaxLiveStatus(taskId)).data?.generated || [];
        return result.data?.generated || [];
      },
      pixverse: async () => {
        // Pixverse supports start and end frames
        if (startFrameUrl) params.image = startFrameUrl;
        if (endFrameUrl && MODEL_DEFS['pixverse']?.supportsEndFrame) {
          params.end_image = endFrameUrl;
        }
        const result = await pixVerseV5Generate(params);
        if (result.error) throw new Error(result.error?.message || 'PixVerse generation failed');
        const taskId = result.task_id || result.data?.task_id;
        if (taskId) return (await pollPixVerseV5Status(taskId)).data?.generated || [];
        return result.data?.generated || [];
      },
      seedance: async () => {
        const result = await seedanceGenerate('720p', params);
        if (result.error) throw new Error(result.error?.message || 'Seedance generation failed');
        const taskId = result.task_id || result.data?.task_id;
        if (taskId) return (await pollSeedanceStatus('720p', taskId)).data?.generated || [];
        return result.data?.generated || [];
      },
      'wan2.6': async () => {
        // WAN 2.6 supports start and end frames
        if (startFrameUrl) params.image = startFrameUrl;
        if (endFrameUrl && MODEL_DEFS['wan2.6']?.supportsEndFrame) {
          params.end_image = endFrameUrl;
        }
        const result = await wan26Generate('t2v', '720p', params);
        if (result.error) throw new Error(result.error?.message || 'WAN generation failed');
        const taskId = result.task_id || result.data?.task_id;
        if (taskId) return (await pollWan26Status('t2v', '720p', taskId)).data?.generated || [];
        return result.data?.generated || [];
      },
      'ltx-video': async () => {
        // LTX API uses resolution format like "1920x1080" instead of aspect ratio
        const resolutionMap = {
          '1:1': '1080x1080',
          '16:9': '1920x1080',
          '9:16': '1080x1920',
          '4:3': '1440x1080',
          '3:4': '1080x1440',
          '3:2': '1620x1080',
          '2:3': '1080x1620',
        };
        
        const ltxParams = {
          prompt,
          model: 'ltx-2-3-pro',
          duration: 8,
          resolution: resolutionMap[aspectRatio] || '1920x1080',
          generate_audio: true,
        };
        
        // If start frame is provided, use image-to-video
        const mode = startFrameUrl ? 'image-to-video' : 'text-to-video';
        if (startFrameUrl) {
          ltxParams.image_uri = startFrameUrl;
        }
        
        const result = await ltxVideoDirectGenerate(mode, ltxParams);
        if (result.error) throw new Error(result.error?.message || 'LTX Video generation failed');
        return result.data?.generated || [];
      },
    };

    const fn = dispatch[effectiveModel];
    if (!fn) throw new Error(`Unknown video model: ${effectiveModel}`);
    return fn();
  }, [aspectRatio]);

  const handleGenerate = useCallback(async () => {
    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
    
    // Resolve start frame from handle input or local data
    const startFrameInput = data.resolveInput?.(id, 'start-frame-in');
    let startFrameUrl = Array.isArray(startFrameInput) ? startFrameInput[0] : startFrameInput;
    if (!startFrameUrl && data.startFrameUrl) startFrameUrl = data.startFrameUrl;
    
    // Resolve end frame from handle input or local data
    const endFrameInput = data.resolveInput?.(id, 'end-frame-in');
    let endFrameUrl = Array.isArray(endFrameInput) ? endFrameInput[0] : endFrameInput;
    if (!endFrameUrl && data.endFrameUrl) endFrameUrl = data.endFrameUrl;
    
    if (!prompt || isGenerating) return;

    // Check if image is a base64 data URL (from local upload)
    // Kling3 requires a publicly accessible URL, not a base64 data URL
    if (startFrameUrl && startFrameUrl.startsWith('data:image')) {
      update({ 
        outputError: 'Kling3 requires a publicly accessible image URL. Please use an image from a URL (e.g., from ImageNode with a web URL) instead of an uploaded file. Cloud storage integration coming soon.' 
      });
      return;
    }

    setIsGenerating(true);
    update({ outputVideo: null, outputVideos: [], outputError: null });

    try {
      const results = await Promise.all(models.map(m => generateForModel(m, prompt, startFrameUrl, endFrameUrl)));
      const allVideos = results.flat().filter(Boolean);
      update({
        outputVideo: allVideos[0] || null,
        outputVideos: allVideos,
      });
    } catch (err) {
      console.error('Universal video generation error:', err);
      update({ outputError: err.message });
    } finally {
      setIsGenerating(false);
    }
  }, [id, data, update, models, isGenerating, generateForModel]);

  const handleImprovePrompt = useCallback(async () => {
    const prompt = data.inputPrompt || '';
    if (!prompt || isImprovingPrompt) return;

    setIsImprovingPrompt(true);
    try {
      const result = await improvePromptGenerate({ prompt, type: 'video' });
      if (result.error) throw new Error(result.error?.message || 'Improve prompt failed');
      if (result.data?.task_id) {
        const status = await pollImprovePromptStatus(result.data.task_id);
        const improved = status.data?.generated?.[0];
        if (improved) update({ inputPrompt: improved });
      } else if (result.data?.generated?.[0]) {
        update({ inputPrompt: result.data.generated[0] });
      }
    } catch (err) {
      console.error('Improve prompt error:', err);
    } finally {
      setIsImprovingPrompt(false);
    }
  }, [data.inputPrompt, update, isImprovingPrompt]);

  const handleDownload = useCallback(() => {
    const url = data.outputVideo;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-video.mp4';
    a.click();
  }, [data.outputVideo]);

  // External trigger from global Generate button
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  // Auto-resize prompt textarea
  useEffect(() => {
    if (promptRef.current) {
      promptRef.current.style.height = 'auto';
      promptRef.current.style.height = `${promptRef.current.scrollHeight}px`;
    }
  }, [data.inputPrompt]);

  // Handle frame image file drop
  const handleFrameDrop = useCallback((e, frameType) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFrame(null);
    
    const files = e.dataTransfer.files;
    if (!files?.length) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      update({ [`${frameType}FrameUrl`]: ev.target.result });
    };
    reader.readAsDataURL(file);
  }, [update]);

  const handleFrameDragOver = useCallback((e, frameType) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFrame(frameType);
  }, []);

  const handleFrameDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFrame(null);
  }, []);

  const totalCost = models.reduce((acc, m) => acc + (COST_MAP[m] || 0.15), 0) * numOutputs;

  return (
    <BaseNode
      id={id}
      label="Video Universal Generator"
      editableTitle={{
        value: String(data.label ?? ''),
        onCommit: (next) => update({ label: next }),
        placeholder: 'Generate Video',
      }}
      selected={selected}
      isExecuting={isGenerating}
      hasError={!!data.outputError}
      dotColor={CATEGORY_COLORS.videoGeneration}
      onDisconnect={disconnectNode}
      onGenerate={handleGenerate}
      downloadUrl={data.outputVideo}
      downloadType="video"
      settingsExpanded={true} // Keep settings available as they are essential
      settingsPanel={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ ...font.xs, color: text.muted }}>Aspect Ratio</span>
            <select
              value={aspectRatio}
              onChange={e => update({ aspectRatio: e.target.value })}
              disabled={locked}
              className="nodrag nopan"
              style={{
                background: 'transparent', color: text.muted, border: 'none',
                ...font.xs, outline: 'none', cursor: locked ? 'not-allowed' : 'pointer',
              }}
            >
              {ASPECT_RATIOS.map(ar => <option key={ar} value={ar}>{ar}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ ...font.xs, color: text.muted }}>Locked</span>
            <button
              onClick={() => update({ locked: !locked })}
              style={{ background: 'transparent', border: 'none', color: locked ? text.primary : text.muted, cursor: 'pointer', padding: 2 }}
              title={locked ? 'Unlock settings' : 'Lock settings'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {locked ? (
                  <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>
                ) : (
                  <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></>
                )}
              </svg>
            </button>
          </div>
        </div>
      }
    >
      {/* Input Handles */}
      {hasImageSection && (
        <>
          <Handle type="target" position={Position.Left} id="start-frame-in" style={{ top: 30, background: getHandleColor('image-in') }} />
          {selectedModelsSupportEndFrame && (
            <Handle type="target" position={Position.Left} id="end-frame-in" style={{ top: 55, background: getHandleColor('image-in') }} />
          )}
        </>
      )}
      <Handle type="target" position={Position.Left} id="prompt-in" style={{ top: hasImageSection ? (selectedModelsSupportEndFrame ? 85 : 60) : 30, background: getHandleColor('prompt-in') }} />

      {/* Prompt Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: sp[3] }}>
        <div style={{
          background: surface.deep, border: `1px solid ${border.default}`,
          borderRadius: radius.md, padding: sp[2],
          display: 'flex', flexDirection: 'column', gap: sp[2],
        }}>
          <textarea
            ref={promptRef}
            value={data.inputPrompt || ''}
            onChange={e => update({ inputPrompt: e.target.value })}
            placeholder="e.g. A cinematic shot of a neon cyberpunk city..."
            rows={4}
            className="nodrag nopan nowheel"
            style={{
              background: 'transparent', border: 'none', color: text.primary,
              ...font.sm, resize: 'none', outline: 'none', width: '100%', overflow: 'hidden',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <div style={{ position: 'relative' }}>
              <button
                title="Reference (@)"
                className="nodrag nopan"
                onClick={() => setShowReferenceMenu(!showReferenceMenu)}
                onMouseDown={e => e.stopPropagation()}
                style={{
                  background: showReferenceMenu ? surface.deep : surface.base,
                  border: `1px solid ${showReferenceMenu ? border.active : border.default}`,
                  color: showReferenceMenu ? text.primary : text.muted,
                  borderRadius: radius.sm, width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
                </svg>
              </button>
              {showReferenceMenu && (
                <div className="nodrag nopan" style={{
                  position: 'absolute', top: '100%', left: 0, marginTop: 4,
                  background: surface.deep, border: `1px solid ${border.default}`,
                  borderRadius: radius.md, padding: 4, zIndex: 10,
                  display: 'flex', flexDirection: 'column', gap: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)', width: 80
                }}>
                  {['@img_1', '@img_2', '@img_3', '@img_4'].map(tag => (
                    <div
                      key={tag}
                      onClick={() => {
                        const input = promptRef.current;
                        if (!input) return;
                        const start = input.selectionStart || 0;
                        const end = input.selectionEnd || 0;
                        const val = input.value;
                        const newVal = val.substring(0, start) + tag + val.substring(end);
                        update({ inputPrompt: newVal });
                        setTimeout(() => {
                          input.focus();
                          input.setSelectionRange(start + tag.length, start + tag.length);
                        }, 0);
                        setShowReferenceMenu(false);
                      }}
                      style={{
                        padding: '4px 8px', borderRadius: radius.sm, cursor: 'pointer',
                        color: text.primary, ...font.xs, fontFamily: 'monospace'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = surface.hover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={handleImprovePrompt}
                disabled={isImprovingPrompt || !data.inputPrompt}
                title="Improve Prompt"
                style={{
                  background: 'transparent', border: 'none',
                  color: isImprovingPrompt || !data.inputPrompt ? text.muted : CATEGORY_COLORS.utility,
                  cursor: isImprovingPrompt || !data.inputPrompt ? 'not-allowed' : 'pointer',
                  ...font.sm, display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                  {isImprovingPrompt ? (
                    <><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" /></>
                  ) : (
                    <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>
                  )}
                </svg>
                Improve
              </button>
            </div>
          </div>
        </div>

        {/* Frame Inputs (Moved below Prompt Area) */}
        {hasImageSection && (
          <div style={{
            background: surface.deep, border: `1px solid ${border.default}`,
            borderRadius: radius.md, padding: sp[3],
            display: 'flex', flexDirection: 'column', gap: sp[2]
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={getHandleColor('image-in')} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span style={{ ...font.sm, color: text.primary, fontWeight: 500 }}>Frame Inputs</span>
              <span style={{ ...font.xs, color: text.muted }}>
                {selectedModelsSupportEndFrame ? '(Start & End frames)' : '(Start frame only)'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedModelsSupportEndFrame ? '1fr 1fr' : '1fr', gap: sp[2] }}>
              {selectedModelsSupportImage && (
                <div>
                  <div style={{ ...font.xs, color: text.muted, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={text.muted} strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Start Frame
                  </div>
                  {data.startFrameUrl ? (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={data.startFrameUrl}
                        alt="Start Frame"
                        style={{ width: '100%', maxHeight: 100, objectFit: 'cover', borderRadius: radius.sm }}
                      />
                      <button
                        onClick={() => update({ startFrameUrl: null })}
                        style={{
                          position: 'absolute', top: 4, right: 4,
                          background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: radius.sm,
                          width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => update({ startFrameUrl: ev.target.result });
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      onDragOver={(e) => handleFrameDragOver(e, 'start')}
                      onDragLeave={handleFrameDragLeave}
                      onDrop={(e) => handleFrameDrop(e, 'start')}
                      style={{
                        height: 60, border: `1px dashed ${dragOverFrame === 'start' ? CATEGORY_COLORS.videoGeneration : border.divider}`,
                        borderRadius: radius.sm, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: text.muted, ...font.xs, background: dragOverFrame === 'start' ? `${CATEGORY_COLORS.videoGeneration}15` : surface.base,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      Drop image
                    </div>
                  )}
                </div>
              )}

              {selectedModelsSupportEndFrame && (
                <div>
                  <div style={{ ...font.xs, color: text.muted, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={text.muted} strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                    </svg>
                    End Frame
                  </div>
                  {data.endFrameUrl ? (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={data.endFrameUrl}
                        alt="End Frame"
                        style={{ width: '100%', maxHeight: 100, objectFit: 'cover', borderRadius: radius.sm }}
                      />
                      <button
                        onClick={() => update({ endFrameUrl: null })}
                        style={{
                          position: 'absolute', top: 4, right: 4,
                          background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: radius.sm,
                          width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => update({ endFrameUrl: ev.target.result });
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      onDragOver={(e) => handleFrameDragOver(e, 'end')}
                      onDragLeave={handleFrameDragLeave}
                      onDrop={(e) => handleFrameDrop(e, 'end')}
                      style={{
                        height: 60, border: `1px dashed ${dragOverFrame === 'end' ? CATEGORY_COLORS.videoGeneration : border.divider}`,
                        borderRadius: radius.sm, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: text.muted, ...font.xs, background: dragOverFrame === 'end' ? `${CATEGORY_COLORS.videoGeneration}15` : surface.base,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      Drop image
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: sp[3] }}>
          <OutputHandle label="Output" id="output" type="video" />
          <OutputPreview
            output={data.outputVideo}
            isLoading={isGenerating}
            error={data.outputError}
            type="video"
            accentColor={CATEGORY_COLORS.videoGeneration}
            label="Generation Output"
          />
        </div>
      </div>
    </BaseNode>
  );
}
