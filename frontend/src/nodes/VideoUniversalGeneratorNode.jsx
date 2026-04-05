import { useState, useRef, useEffect, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { getHandleColor } from '../utils/handleTypes';
import {
  CATEGORY_COLORS, sp, font, text, surface, border, radius,
  useNodeConnections, OutputPreview, OutputHandle
} from './shared';
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

import qwenLogo from '../assets/icons/qwen.png';
import bflLogo from '../assets/icons/black-forest-labs.svg';
import bytedanceLogo from '../assets/icons/bytedance-logo.svg';
import googleLogo from '../assets/icons/google.svg';
import recraftLogo from '../assets/icons/recraft_logo.png';
import koraLogo from '../assets/icons/kora.png';
import klingLogo from '../assets/icons/kling.svg';
import pixverseLogo from '../assets/icons/pixverse.svg';
import runwayLogo from '../assets/icons/runway.svg';
import minimaxLogo from '../assets/icons/minimax.svg';
import wan26Logo from '../assets/icons/wan2-6.png';
import ltxLogo from '../assets/icons/ltx-logo-light.svg';

const getModelLogo = (m) => {
  const lower = m.toLowerCase();
  if (lower.includes('flux')) return bflLogo;
  if (lower.includes('recraft')) return recraftLogo;
  if (lower.includes('seedance')) return bytedanceLogo;
  if (lower.includes('veo') || lower.includes('gemini') || lower.includes('google') || lower.includes('nano banana')) return googleLogo;
  if (lower.includes('qwen')) return qwenLogo;
  if (lower.includes('kora')) return koraLogo;
  if (lower.includes('kling')) return klingLogo;
  if (lower.includes('pixverse')) return pixverseLogo;
  if (lower.includes('runway')) return runwayLogo;
  if (lower.includes('minimax')) return minimaxLogo;
  if (lower.includes('wan2.6') || lower.includes('wan26')) return wan26Logo;
  if (lower.includes('ltx')) return ltxLogo;
  return null;
};

// Model Card Component for Featured/Pinned models
function ModelCard({ modelKey, isSelected, onToggle, onPin, isPinned, showDescription = true }) {
  const def = MODEL_DEFS[modelKey];
  const logo = getModelLogo(modelKey);
  
  return (
    <button
      onClick={onToggle}
      style={{
        width: '100%', display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '10px 12px', background: isSelected ? 'rgba(20,184,166,0.08)' : surface.base,
        border: `1px solid ${isSelected ? CATEGORY_COLORS.videoGeneration : border.subtle}`,
        borderRadius: radius.md, cursor: 'pointer', textAlign: 'left',
      }}
    >
      {logo && (
        <img src={logo} alt="" style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: radius.sm, flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ ...font.sm, color: text.primary, fontWeight: 600 }}>{def?.name || modelKey}</span>
        </div>
        {showDescription && def?.description && (
          <div style={{ ...font.xs, color: text.muted, lineHeight: 1.4 }}>{def.description}</div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* Pin button */}
        <button
          onClick={onPin}
          style={{
            width: 24, height: 24, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          title={isPinned ? 'Unpin model' : 'Pin model'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isPinned ? CATEGORY_COLORS.videoGeneration : 'none'} stroke={isPinned ? CATEGORY_COLORS.videoGeneration : text.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v8" />
            <path d="m4.93 10.93 1.41 1.41" />
            <path d="M2 18h2" />
            <path d="M20 18h2" />
            <path d="m19.07 10.93-1.41 1.41" />
            <path d="M22 22H2" />
            <path d="m16 6-4 4-4-4" />
            <path d="M16 18a4 4 0 0 0-8 0" />
          </svg>
        </button>
        {/* Checkmark for selected */}
        {isSelected && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={CATEGORY_COLORS.videoGeneration} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </button>
  );
}

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'];

// Model definitions with metadata
// supportsImageInput: model supports image-to-video (start frame)
// supportsEndFrame: model supports specifying an end frame
const MODEL_DEFS = {
  'Auto': { name: 'Auto', provider: 'System', featured: false, tags: [], supportsImageInput: true, supportsEndFrame: true },
  'kling3': { name: 'Kling 3', provider: 'Kling', featured: true, tags: ['High Quality', '10s'], description: 'Advanced video generation with motion control', supportsImageInput: true, supportsEndFrame: true },
  'runway': { name: 'Runway Gen-4', provider: 'Runway', featured: true, tags: ['Turbo', '10s'], description: 'Fast generation with cinematic quality', supportsImageInput: true, supportsEndFrame: false },
  'minimax': { name: 'MiniMax', provider: 'MiniMax', featured: false, tags: ['Live', '6s'], description: 'Real-time video generation', supportsImageInput: true, supportsEndFrame: false },
  'pixverse': { name: 'PixVerse V5', provider: 'PixVerse', featured: false, tags: ['Motion', '10s'], description: 'Smooth motion and transitions', supportsImageInput: true, supportsEndFrame: true },
  'seedance': { name: 'Seedance', provider: 'ByteDance', featured: true, tags: ['Pro', '10s'], description: 'Professional dance and movement videos', supportsImageInput: true, supportsEndFrame: false },
  'wan2.6': { name: 'Wan 2.6', provider: 'Wan', featured: false, tags: ['720p', '10s'], description: 'High-resolution video generation', supportsImageInput: true, supportsEndFrame: true },
  'ltx-video': { name: 'LTX Video', provider: 'LTX', featured: true, tags: ['4K', '8s'], description: 'Up to 4K resolution with synchronized audio', supportsImageInput: true, supportsEndFrame: false },
};

export const MODELS = Object.keys(MODEL_DEFS);

const COST_MAP = {
  'Auto': 0.20, 'kling3': 0.20, 'runway': 0.15, 'minimax': 0.10,
  'pixverse': 0.12, 'seedance': 0.08, 'wan2.6': 0.18, 'ltx-video': 0.14,
};

// Providers for grouping
const PROVIDERS = {
  'Kling': ['kling3'],
  'Runway': ['runway'],
  'MiniMax': ['minimax'],
  'PixVerse': ['pixverse'],
  'ByteDance': ['seedance'],
  'Wan': ['wan2.6'],
  'LTX': ['ltx-video'],
};

export default function VideoUniversalGeneratorNode({ id, data, selected }) {
  const { update } = useNodeConnections(id, data);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const [isHoveringRun, setIsHoveringRun] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  const [expandedProviders, setExpandedProviders] = useState({});
  const [dragOverFrame, setDragOverFrame] = useState(null); // 'start', 'end', or null
  const modelMenuRef = useRef(null);
  const lastTrigger = useRef(null);

  // Settings from data with defaults
  const autoSelect = data.autoSelect ?? false;
  const useMultiple = data.useMultiple ?? false;
  const pinnedModels = data.pinnedModels || [];

  const locked = data.locked || false;
  const numOutputs = data.numOutputs || 1;
  const aspectRatio = data.aspectRatio || '16:9';
  const models = data.models || ['Auto'];

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (modelMenuRef.current && !modelMenuRef.current.contains(event.target)) {
        setIsModelMenuOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close dropdown when locked
  useEffect(() => {
    if (locked) setIsModelMenuOpen(false);
  }, [locked]);

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

  const toggleModel = (m) => {
    if (autoSelect) return; // Don't allow manual selection in auto mode
    
    if (!useMultiple) {
      // Single select mode - replace selection
      update({ models: [m] });
      return;
    }
    
    // Multi-select mode
    if (m === 'Auto') {
      update({ models: ['Auto'] });
    } else {
      const prev = data.models || ['Auto'];
      const newModels = prev.filter(x => x !== 'Auto');
      if (newModels.includes(m)) {
        const removed = newModels.filter(x => x !== m);
        update({ models: removed.length === 0 ? ['Auto'] : removed });
      } else {
        update({ models: [...newModels, m] });
      }
    }
  };

  const togglePin = (m, e) => {
    e.stopPropagation();
    const newPinned = pinnedModels.includes(m)
      ? pinnedModels.filter(x => x !== m)
      : [...pinnedModels, m];
    update({ pinnedModels: newPinned });
  };

  const toggleProvider = (provider) => {
    setExpandedProviders(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const setAutoSelect = (value) => {
    if (value) {
      update({ autoSelect: true, useMultiple: false, models: ['Auto'] });
    } else {
      update({ autoSelect: false, models: ['Auto'] });
    }
  };

  const setUseMultiple = (value) => {
    if (value) {
      update({ useMultiple: true, autoSelect: false, models: models.length > 1 ? models.filter(m => m !== 'Auto') : ['kling3'] });
    } else {
      update({ useMultiple: false, models: [models[0] || 'kling3'] });
    }
  };

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

  // Get the actually selected model (resolving Auto)
  const getEffectiveModel = useCallback(() => {
    if (models[0] === 'Auto') {
      const startFrameInput = data.resolveInput?.(id, 'start-frame-in');
      let startFrameUrl = Array.isArray(startFrameInput) ? startFrameInput[0] : startFrameInput;
      if (!startFrameUrl && data.startFrameUrl) startFrameUrl = data.startFrameUrl;
      
      const endFrameInput = data.resolveInput?.(id, 'end-frame-in');
      let endFrameUrl = Array.isArray(endFrameInput) ? endFrameInput[0] : endFrameInput;
      if (!endFrameUrl && data.endFrameUrl) endFrameUrl = data.endFrameUrl;
      
      return selectAutoModel(Boolean(startFrameUrl), Boolean(endFrameUrl), startFrameUrl);
    }
    return models[0];
  }, [models, data, id, selectAutoModel]);

  const getDropdownLabel = () => {
    if (models.length === 0) return 'Select Model';
    if (models.length === 1) {
      if (models[0] === 'Auto') {
        const effective = getEffectiveModel();
        return `Auto → ${MODEL_DEFS[effective]?.name || effective}`;
      }
      return models[0];
    }
    return `${models.length} Models`;
  };

  const filteredModels = MODELS.filter(m => m.toLowerCase().includes(modelSearch.toLowerCase()));

  return (
    <div style={{ position: 'relative', paddingTop: 44 }}>
      {/* Model Settings Bar — sits in the paddingTop area, inside the node's bounding rect */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: surface.deep, border: `1px solid ${border.subtle}`,
        borderRadius: radius.md, padding: '4px 8px', gap: 8,
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)', zIndex: 10,
      }}>
        {/* Model Dropdown */}
        <div style={{ position: 'relative' }} ref={modelMenuRef}>
          <button
            onClick={() => !locked && setIsModelMenuOpen(!isModelMenuOpen)}
            disabled={locked}
            style={{
              background: 'transparent', color: text.primary, border: 'none',
              ...font.sm, outline: 'none', cursor: locked ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            {getDropdownLabel()}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {isModelMenuOpen && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, marginTop: 4,
              background: surface.deep, border: `1px solid ${border.default}`,
              borderRadius: radius.md, minWidth: 280, maxWidth: 320,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 20,
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              {/* Search */}
              <div style={{ padding: 12, borderBottom: `1px solid ${border.subtle}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: surface.base, borderRadius: radius.sm, padding: '6px 10px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={text.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search compatible models"
                    value={modelSearch}
                    onChange={e => setModelSearch(e.target.value)}
                    onClick={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                    className="nodrag nopan"
                    style={{
                      flex: 1, background: 'transparent', border: 'none',
                      color: text.primary, ...font.sm, outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div className="nowheel nodrag" style={{ maxHeight: 400, overflowY: 'auto' }}>
                {/* Toggle Settings */}
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${border.subtle}` }}>
                  {/* Auto select */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ ...font.sm, color: text.primary }}>Auto select model</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={text.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </div>
                    <button
                      onClick={() => setAutoSelect(!autoSelect)}
                      style={{
                        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: autoSelect ? '#22c55e' : '#3a3a3a', position: 'relative', transition: 'background 0.15s',
                      }}
                    >
                      <span style={{
                        width: 20, height: 20, borderRadius: '50%', background: '#fff',
                        position: 'absolute', top: 2, left: autoSelect ? 22 : 2, transition: 'left 0.15s',
                      }} />
                    </button>
                  </div>
                  {autoSelect && (
                    <div style={{ 
                      ...font.xs, 
                      color: text.muted, 
                      marginTop: 8, 
                      padding: '6px 8px', 
                      background: `${CATEGORY_COLORS.videoGeneration}11`,
                      borderRadius: radius.sm,
                      border: `1px solid ${CATEGORY_COLORS.videoGeneration}33`,
                    }}>
                      {(() => {
                        const startFrameInput = data.resolveInput?.(id, 'start-frame-in');
                        let startFrameUrl = Array.isArray(startFrameInput) ? startFrameInput[0] : startFrameInput;
                        if (!startFrameUrl && data.startFrameUrl) startFrameUrl = data.startFrameUrl;
                        
                        const endFrameInput = data.resolveInput?.(id, 'end-frame-in');
                        let endFrameUrl = Array.isArray(endFrameInput) ? endFrameInput[0] : endFrameInput;
                        if (!endFrameUrl && data.endFrameUrl) endFrameUrl = data.endFrameUrl;
                        
                        const effective = selectAutoModel(Boolean(startFrameUrl), Boolean(endFrameUrl), startFrameUrl);
                        const def = MODEL_DEFS[effective];
                        const hasStart = Boolean(startFrameUrl);
                        const hasEnd = Boolean(endFrameUrl);
                        
                        let reason = 'text-to-video';
                        if (hasStart && hasEnd) reason = 'start + end frames';
                        else if (hasStart) reason = 'image-to-video';
                        
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={CATEGORY_COLORS.videoGeneration} strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M12 16v-4"/>
                              <path d="M12 8h.01"/>
                            </svg>
                            <span>
                              Will use <strong style={{ color: CATEGORY_COLORS.videoGeneration }}>{def?.name || effective}</strong>
                              <span> for {reason}</span>
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  {/* Use multiple */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ ...font.sm, color: text.primary }}>Use multiple models</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={text.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </div>
                    <button
                      onClick={() => setUseMultiple(!useMultiple)}
                      style={{
                        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: useMultiple ? '#22c55e' : '#3a3a3a', position: 'relative', transition: 'background 0.15s',
                      }}
                    >
                      <span style={{
                        width: 20, height: 20, borderRadius: '50%', background: '#fff',
                        position: 'absolute', top: 2, left: useMultiple ? 22 : 2, transition: 'left 0.15s',
                      }} />
                    </button>
                  </div>
                </div>

                {/* Pinned Models */}
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${border.subtle}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span style={{ ...font.xs, color: text.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pinned models</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={text.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                  {pinnedModels.length === 0 ? (
                    <div style={{ ...font.xs, color: text.muted, fontStyle: 'italic' }}>Models you favorite will appear here</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {pinnedModels.filter(m => MODEL_DEFS[m]).map(m => (
                        <ModelCard key={m} modelKey={m} isSelected={models.includes(m)} onToggle={() => toggleModel(m)} onPin={(e) => togglePin(m, e)} isPinned={true} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Featured Models */}
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${border.subtle}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span style={{ ...font.xs, color: text.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Featured models</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={text.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {MODELS.filter(m => MODEL_DEFS[m]?.featured).map(m => (
                      <ModelCard key={m} modelKey={m} isSelected={models.includes(m)} onToggle={() => toggleModel(m)} onPin={(e) => togglePin(m, e)} isPinned={pinnedModels.includes(m)} showDescription={false} />
                    ))}
                  </div>
                </div>

                {/* Providers - Flat List */}
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span style={{ ...font.xs, color: text.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Providers</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={text.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {Object.entries(PROVIDERS).map(([provider, providerModels]) => (
                      <div key={provider}>
                        <div style={{ padding: '4px 0', ...font.xs, color: text.muted }}>{provider}</div>
                        {providerModels.map(m => {
                          const logo = getModelLogo(m);
                          return (
                            <button
                              key={m}
                              onClick={() => toggleModel(m)}
                              onMouseDown={e => e.stopPropagation()}
                              className="nodrag nopan"
                              style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                                padding: '8px 10px', background: models.includes(m) ? 'rgba(20,184,166,0.08)' : surface.base,
                                border: `1px solid ${models.includes(m) ? CATEGORY_COLORS.videoGeneration : border.subtle}`,
                                borderRadius: radius.sm, cursor: 'pointer', textAlign: 'left', marginBottom: 4,
                              }}
                            >
                              {logo && (
                                <img src={logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain', borderRadius: radius.sm, flexShrink: 0 }} />
                              )}
                              <span style={{ flex: 1, ...font.sm, color: models.includes(m) ? CATEGORY_COLORS.videoGeneration : text.primary }}>{MODEL_DEFS[m]?.name || m}</span>
                              {/* Pin button */}
                              <button
                                onClick={(e) => { e.stopPropagation(); togglePin(m, e); }}
                                onMouseDown={e => e.stopPropagation()}
                                className="nodrag nopan"
                                style={{
                                  width: 20, height: 20, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                  background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                                title={pinnedModels.includes(m) ? 'Unpin model' : 'Pin model'}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill={pinnedModels.includes(m) ? CATEGORY_COLORS.videoGeneration : 'none'} stroke={pinnedModels.includes(m) ? CATEGORY_COLORS.videoGeneration : text.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 2v8" />
                                  <path d="m4.93 10.93 1.41 1.41" />
                                  <path d="M2 18h2" />
                                  <path d="M20 18h2" />
                                  <path d="m19.07 10.93-1.41 1.41" />
                                  <path d="M22 22H2" />
                                  <path d="m16 6-4 4-4-4" />
                                  <path d="M16 18a4 4 0 0 0-8 0" />
                                </svg>
                              </button>
                              {/* Checkmark for selected */}
                              {models.includes(m) && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CATEGORY_COLORS.videoGeneration} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

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

        <div style={{ display: 'flex', gap: 4 }}>
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
          <button
            onClick={handleDownload}
            disabled={!data.outputVideo}
            style={{
              background: 'transparent', border: 'none',
              color: data.outputVideo ? text.primary : text.muted,
              cursor: data.outputVideo ? 'pointer' : 'not-allowed', padding: 2,
            }}
            title="Download"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Node Shell */}
      <div style={{
        background: surface.base,
        border: `1px solid ${selected ? border.active : border.subtle}`,
        borderRadius: radius.lg, width: 320,
        fontFamily: 'Inter, system-ui, sans-serif',
        transition: 'all 0.15s ease',
        boxShadow: selected
          ? `0 0 0 1px ${border.active}, 0 8px 24px rgba(0,0,0,0.5)`
          : '0 4px 12px rgba(0,0,0,0.25)',
      }}>
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
        <div style={{ padding: sp[3] }}>
          <div style={{
            background: surface.deep, border: `1px solid ${border.default}`,
            borderRadius: radius.md, padding: sp[2],
            display: 'flex', flexDirection: 'column', gap: sp[2],
          }}>
            <textarea
              value={data.inputPrompt || ''}
              onChange={e => update({ inputPrompt: e.target.value })}
              placeholder="e.g. A cinematic shot of a neon cyberpunk city..."
              rows={4}
              className="nodrag nopan nowheel"
              style={{
                background: 'transparent', border: 'none', color: text.primary,
                ...font.sm, resize: 'none', outline: 'none', width: '100%',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <button
                title="Reference (@)"
                style={{
                  background: surface.base, border: `1px solid ${border.default}`,
                  color: text.muted, borderRadius: radius.sm, width: 24, height: 24,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', ...font.xs,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M16 8v8a4 4 0 0 1-8 0" />
                </svg>
              </button>

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

                <div
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setIsHoveringRun(true)}
                  onMouseLeave={() => setIsHoveringRun(false)}
                >
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    style={{
                      background: CATEGORY_COLORS.videoGeneration,
                      color: '#fff', border: 'none', borderRadius: radius.md,
                      width: 28, height: 28, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: isGenerating ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {isGenerating ? (
                        <><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" /></>
                      ) : (
                        <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>
                      )}
                    </svg>
                  </button>

                  {isHoveringRun && (
                    <div style={{
                      position: 'absolute', bottom: '100%', right: 0, marginBottom: 8,
                      background: surface.deep, border: `1px solid ${border.subtle}`,
                      borderRadius: radius.md, padding: '8px 12px',
                      display: 'flex', flexDirection: 'column', gap: 8,
                      minWidth: 140, boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 20,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', ...font.xs, color: text.muted }}>
                        <span>Cost:</span>
                        <span>${totalCost.toFixed(3)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ ...font.xs, color: text.primary }}>Outputs:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: surface.base, borderRadius: radius.sm, padding: 2 }}>
                          <button
                            onClick={e => { e.stopPropagation(); update({ numOutputs: Math.max(1, numOutputs - 1) }); }}
                            style={{ background: 'transparent', border: 'none', color: text.primary, cursor: 'pointer', width: 20 }}
                          >-</button>
                          <span style={{ ...font.sm, color: text.primary, minWidth: 16, textAlign: 'center' }}>{numOutputs}</span>
                          <button
                            onClick={e => { e.stopPropagation(); update({ numOutputs: Math.min(6, numOutputs + 1) }); }}
                            style={{ background: 'transparent', border: 'none', color: text.primary, cursor: 'pointer', width: 20 }}
                          >+</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frame Input Section - shown when selected models support image/frame input */}
        {hasImageSection && (
          <div style={{ padding: `0 ${sp[3]}px ${sp[3]}px` }}>
            <div style={{
              background: surface.deep, border: `1px solid ${border.default}`,
              borderRadius: radius.md, padding: sp[2],
            }}>
              {/* Section Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
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

              {/* Start Frame */}
              {selectedModelsSupportImage && (
                <div style={{ marginBottom: selectedModelsSupportEndFrame ? 12 : 0 }}>
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
                        border: `2px dashed ${dragOverFrame === 'start' ? CATEGORY_COLORS.videoGeneration : border.subtle}`,
                        borderRadius: radius.sm, padding: '12px', textAlign: 'center', cursor: 'pointer',
                        background: dragOverFrame === 'start' ? `${CATEGORY_COLORS.videoGeneration}11` : surface.base,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ 
                        ...font.xs, 
                        color: dragOverFrame === 'start' ? CATEGORY_COLORS.videoGeneration : text.muted,
                        transition: 'color 0.15s ease',
                      }}>
                        {dragOverFrame === 'start' ? 'Drop image here' : 'Upload start frame or connect to handle'}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* End Frame */}
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
                        border: `2px dashed ${dragOverFrame === 'end' ? CATEGORY_COLORS.videoGeneration : border.subtle}`,
                        borderRadius: radius.sm, padding: '12px', textAlign: 'center', cursor: 'pointer',
                        background: dragOverFrame === 'end' ? `${CATEGORY_COLORS.videoGeneration}11` : surface.base,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ 
                        ...font.xs, 
                        color: dragOverFrame === 'end' ? CATEGORY_COLORS.videoGeneration : text.muted,
                        transition: 'color 0.15s ease',
                      }}>
                        {dragOverFrame === 'end' ? 'Drop image here' : 'Upload end frame or connect to handle'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Output */}
        <div style={{ padding: `0 ${sp[3]}px ${sp[3]}px` }}>
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
    </div>
  );
}
