/* eslint-disable react-refresh/only-export-components */
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Handle, Position } from '@xyflow/react';
import { getHandleColor } from '../utils/handleTypes';
import {
  CATEGORY_COLORS, sp, font, text, surface, border, radius,
  useNodeConnections, OutputPreview, OutputHandle
} from './shared';
import useNodeProgress from '../hooks/useNodeProgress';
import {
  // Generation
  generateImage, generateKora, pollStatus,
  generateRecraftImage,
  // Editing
  removeBackground,
  upscaleCreative, pollUpscaleStatus,
  upscalePrecision, pollPrecisionStatus,
  relightImage, pollRelightStatus,
  skinEnhancer, pollSkinEnhancerStatus,
  changeCamera, pollChangeCameraStatus,
  imageExpandFluxPro, pollImageExpandStatus,
  seedreamExpand, pollSeedreamExpandStatus,
  ideogramExpand, pollIdeogramExpandStatus,
  styleTransfer as styleTransferApi, pollStyleTransferStatus,
  // Utilities
  improvePromptGenerate, pollImprovePromptStatus,
  imageToPromptGenerate, pollImageToPromptStatus,
  quiverTextToSvg, quiverImageToSvg,
  uploadImages,
} from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

async function urlToBase64(url) {
  if (!url) return null;
  if (url.startsWith('data:image')) return url;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

import qwenLogo from '../assets/icons/qwen.png';
import bflLogo from '../assets/icons/black-forest-labs.svg';
import bytedanceLogo from '../assets/icons/bytedance-logo.svg';
import googleLogo from '../assets/icons/google.svg';
import recraftLogo from '../assets/icons/recraft_logo.png';
import koraLogo from '../assets/icons/kora.png';

const getModelLogo = (m) => {
  const lower = m.toLowerCase();
  if (lower.includes('flux')) return bflLogo;
  if (lower.includes('recraft')) return recraftLogo;
  if (lower.includes('seedance')) return bytedanceLogo;
  if (lower.includes('veo') || lower.includes('gemini') || lower.includes('google') || lower.includes('nano banana')) return googleLogo;
  if (lower.includes('qwen')) return qwenLogo;
  if (lower.includes('kora')) return koraLogo;
  if (lower.includes('quiver')) return null; // no logo asset yet
  return null;
};

// ── Model lists ──────────────────────────────────────────────────────────────

const GENERATION_MODELS = ['Auto', 'Nano Banana 2', 'recraftv4', 'recraftv3', 'kora', 'flux', 'quiver-text-to-vector'];
const EDITING_MODELS = [
  'remove-bg', 'creative-upscale', 'precision-upscale',
  'relight', 'skin-enhancer', 'change-camera',
  'flux-expand', 'seedream-expand', 'ideogram-expand',
  'style-transfer', 'quiver-image-to-vector',
];
const isEditingModel = (m) => EDITING_MODELS.includes(m);

// Model definitions with metadata
const MODEL_DEFS = {
  // Generation
  'Auto': { name: 'Auto', provider: 'System', featured: false, tags: [], description: 'Automatically select the best model', type: 'generation' },
  'Nano Banana 2': { name: 'Nano Banana 2', provider: 'Freepik', featured: true, tags: ['New', '80s', '15s'], description: 'State-of-the-art image generation model', type: 'generation' },
  'recraftv4': { name: 'Recraft V4', provider: 'Recraft', featured: true, tags: ['Vector', 'Fast'], description: 'Professional vector and raster generation', type: 'generation' },
  'recraftv3': { name: 'Recraft V3', provider: 'Recraft', featured: false, tags: ['Classic'], description: 'Reliable image generation', type: 'generation' },
  'kora': { name: 'Kora', provider: 'Kora', featured: false, tags: ['Artistic'], description: 'Artistic style generation', type: 'generation' },
  'flux': { name: 'Flux', provider: 'Black Forest Labs', featured: true, tags: ['Pro', '4K'], description: 'High-fidelity image generation', type: 'generation' },
  // Editing
  'remove-bg': { name: 'Remove Background', provider: 'Editing', featured: false, tags: ['Instant'], description: 'Remove image background automatically', type: 'editing' },
  'creative-upscale': { name: 'Creative Upscale', provider: 'Editing', featured: false, tags: ['2-16x'], description: 'Upscale with creative enhancement', type: 'editing' },
  'precision-upscale': { name: 'Precision Upscale', provider: 'Editing', featured: false, tags: ['Sharp'], description: 'Precise upscaling with detail preservation', type: 'editing' },
  'relight': { name: 'Relight', provider: 'Editing', featured: true, tags: ['Studio'], description: 'Change lighting and atmosphere', type: 'editing' },
  'skin-enhancer': { name: 'Skin Enhancer', provider: 'Editing', featured: false, tags: ['Portrait'], description: 'Professional skin retouching', type: 'editing' },
  'change-camera': { name: 'Change Camera', provider: 'Editing', featured: false, tags: ['3D'], description: 'Adjust camera angle and perspective', type: 'editing' },
  'flux-expand': { name: 'Flux Expand', provider: 'Editing', featured: false, tags: ['Outpaint'], description: 'Expand image with Flux', type: 'editing' },
  'seedream-expand': { name: 'Seedream Expand', provider: 'Editing', featured: false, tags: ['Outpaint'], description: 'Expand image with Seedream', type: 'editing' },
  'ideogram-expand': { name: 'Ideogram Expand', provider: 'Editing', featured: false, tags: ['Outpaint'], description: 'Expand image with Ideogram', type: 'editing' },
  'style-transfer': { name: 'Style Transfer', provider: 'Editing', featured: true, tags: ['Artistic'], description: 'Transfer style from reference image', type: 'editing' },
  // Quiver
  'quiver-text-to-vector': { name: 'Text to Vector', provider: 'Quiver', featured: false, tags: ['SVG', 'Vector'], description: 'Generate SVG vectors from text prompts', type: 'generation' },
  'quiver-image-to-vector': { name: 'Image to Vector', provider: 'Quiver', featured: false, tags: ['SVG', 'Vectorize'], description: 'Vectorize raster images to SVG', type: 'editing' },
};

// Providers for grouping
const PROVIDERS = {
  'Freepik': ['Nano Banana 2'],
  'Recraft': ['recraftv4', 'recraftv3'],
  'Kora': ['kora'],
  'Black Forest Labs': ['flux'],
  'Editing Tools': ['remove-bg', 'creative-upscale', 'precision-upscale', 'relight', 'skin-enhancer', 'change-camera', 'flux-expand', 'seedream-expand', 'ideogram-expand', 'style-transfer'],
  'Quiver': ['quiver-text-to-vector'],
};

// Featured models (displayed at top)
export const MODELS = Object.keys(MODEL_DEFS);

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'];
const SCALE_FACTORS_CREATIVE = ['2x', '4x', '8x', '16x'];
const SCALE_FACTORS_PRECISION = ['2', '4', '8', '16'];

const RECRAFT_SIZES = {
  '1:1': '1024x1024', '16:9': '1820x1024', '9:16': '1024x1820',
  '4:3': '1365x1024', '3:4': '1024x1365', '3:2': '1536x1024', '2:3': '1024x1536',
};

const COST_MAP = {
  // Generation
  'Auto': 0.04, 'Nano Banana 2': 0.04, 'recraftv4': 0.04, 'recraftv3': 0.02,
  'kora': 0.06, 'flux': 0.08,
  // Editing
  'remove-bg': 0.01, 'creative-upscale': 0.05, 'precision-upscale': 0.03,
  'relight': 0.04, 'skin-enhancer': 0.03, 'change-camera': 0.04,
  'flux-expand': 0.03, 'seedream-expand': 0.03, 'ideogram-expand': 0.03,
  'style-transfer': 0.05,
  'quiver-text-to-vector': 0.02, 'quiver-image-to-vector': 0.02,
};

const PROMPT_PLACEHOLDER = {
  'remove-bg': 'No prompt needed for background removal',
  'precision-upscale': 'No prompt needed for precision upscale',
  'skin-enhancer': 'No prompt needed for skin enhancement',
  'change-camera': 'No prompt needed for camera change',
  'creative-upscale': 'Optional: guide the enhancement style...',
  'relight': 'Describe the lighting (e.g. golden hour, studio light)...',
  'flux-expand': 'Optional: describe the expanded area content...',
  'seedream-expand': 'Optional: describe the expanded area content...',
  'ideogram-expand': 'Optional: describe the expanded area content...',
  'style-transfer': 'Optional: guide the style transfer direction...',
  'quiver-text-to-vector': 'Describe the vector/SVG to generate...',
  'quiver-image-to-vector': 'No prompt needed for vectorization',
};

const PROMPT_DISABLED = new Set(['remove-bg', 'precision-upscale', 'skin-enhancer', 'change-camera', 'quiver-image-to-vector']);

// ── Component ─────────────────────────────────────────────────────────────────

export default function ImageUniversalGeneratorNode({ id, data, selected }) {
  const { update } = useNodeConnections(id, data);

  const {
    progress,
    status: executionStatus,
    message: executionMessage,
    start,
    setProgress,
    complete,
    fail,
    isActive,
  } = useNodeProgress({
    onProgress: (state) => {
      update({
        executionProgress: state.progress,
        executionStatus: state.status,
        executionMessage: state.message,
      });
    },
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const [isImageToPrompting, setIsImageToPrompting] = useState(false);
  const [isHoveringRun, setIsHoveringRun] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [showReferenceMenu, setShowReferenceMenu] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  const [annotationOpen, setAnnotationOpen] = useState(false);
  const [isUploadingNB, setIsUploadingNB] = useState(false);
  const [expandedProviders, setExpandedProviders] = useState({});
  const [dragOverImage, setDragOverImage] = useState(null); // '1', '2', '3', or null
  const nbFileRef = useRef();
  const modelMenuRef = useRef(null);
  const lastTrigger = useRef(null);
  const promptRef = useRef(null);

  // Settings from data with defaults
  const autoSelect = data.autoSelect ?? false;
  const useMultiple = data.useMultiple ?? false;
  const pinnedModels = data.pinnedModels || [];

  const locked = data.locked || false;
  const numOutputs = data.numOutputs || 1;
  const aspectRatio = data.aspectRatio || '1:1';
  const models = data.models || ['Nano Banana 2'];
  const editSettings = data.editSettings || {};

  const activeEditingModel = models.find(m => isEditingModel(m)) || null;
  const isNanoBanana = !activeEditingModel && models.length === 1 && models[0] === 'Nano Banana 2';

  useEffect(() => {
    function handleClickOutside(event) {
      if (modelMenuRef.current && !modelMenuRef.current.contains(event.target)) {
        setIsModelMenuOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (locked) setIsModelMenuOpen(false);
  }, [locked]);

  // ── Smart Auto Model Selection ──────────────────────────────────────────────

  // Analyze prompt to determine best model
  const analyzePromptForModel = useCallback((prompt) => {
    if (!prompt) return { type: 'general', confidence: 0, recommended: 'Nano Banana 2' };
    const lower = String(prompt).toLowerCase();

    // Vector/Logo/Design indicators
    if (/\b(vector|svg|logo|icon|flat design|illustration|clipart)\b/.test(lower)) {
      return { type: 'vector', confidence: 0.9, recommended: 'recraftv4' };
    }

    // Photorealistic indicators
    if (/\b(photo|photorealistic|realistic|cinematic|8k|hdr|portrait of|photo of)\b/.test(lower)) {
      return { type: 'photorealistic', confidence: 0.85, recommended: 'flux' };
    }

    // Artistic/Style indicators
    if (/\b(painting|art|artistic|oil painting|watercolor|sketch|drawing|style of)\b/.test(lower)) {
      return { type: 'artistic', confidence: 0.8, recommended: 'kora' };
    }

    // Fast/cheap priority
    if (/\b(fast|quick|draft|low quality|cheap)\b/.test(lower)) {
      return { type: 'fast', confidence: 0.7, recommended: 'recraftv3' };
    }

    return { type: 'general', confidence: 0.5, recommended: 'Nano Banana 2' };
  }, []);

  // Select model based on analysis and preferences
  const selectAutoImageModel = useCallback((prompt) => {
    const analysis = analyzePromptForModel(prompt);
    return analysis.recommended;
  }, [analyzePromptForModel]);

  // ── API dispatch ────────────────────────────────────────────────────────────

  const runGenerationModel = useCallback(async (model, prompt, structureImageUrl) => {
    // Use smart Auto selection or map legacy model names
    let effectiveModel = model;
    if (model === 'Auto') {
      effectiveModel = selectAutoImageModel(prompt);
    }
    
    const modelMap = {
      'Flux': 'freepik-mystic', // Map Flux to Mystic as they are compatible in this context
      'Nano Banana 2': 'freepik-mystic',
      'Kora Reality': 'freepik-kora',
      'Google Imagen 3': 'google-imagen-3'
    };
    
    const apiModel = modelMap[effectiveModel] || effectiveModel;

    if (effectiveModel === 'recraftv4' || effectiveModel === 'recraftv3') {
      const result = await generateRecraftImage({
        prompt, model: effectiveModel, n: numOutputs,
        size: RECRAFT_SIZES[aspectRatio] || '1024x1024',
      });
      if (result.error) throw new Error(result.error?.message || 'Recraft generation failed');
      return (result.data || []).map(d => d.url);
    }
    if (effectiveModel === 'kora') {
      const result = await generateKora({ prompt, num_images: numOutputs, aspect_ratio: aspectRatio });
      if (result.error) throw new Error(result.error?.message || 'Kora generation failed');
      if (result.data?.task_id) return (await pollStatus(result.data.task_id, 'realism')).data?.generated || [];
      return result.data?.generated || [];
    }
    if (effectiveModel === 'quiver-text-to-vector') {
      const result = await quiverTextToSvg({ model: 'arrow-preview', stream: false, prompt });
      if (result.error) throw new Error(result.error?.message || 'Quiver generation failed');
      const generatedData = result.data?.data?.[0];
      if (!generatedData?.svg) throw new Error('No SVG returned from Quiver');
      return [`data:image/svg+xml;utf8,${encodeURIComponent(generatedData.svg)}`];
    }
    // freepik-mystic (Nano Banana 2), flux, Auto
    const params = { prompt, num_images: numOutputs, aspect_ratio: aspectRatio, model: apiModel };
    if (structureImageUrl) params.image_urls = [structureImageUrl];
    const result = await generateImage(params);
    if (result.error) throw new Error(result.error?.message || 'Generation failed');
    if (result.data?.task_id) return (await pollStatus(result.data.task_id, apiModel)).data?.generated || [];
    return result.data?.generated || [];
  }, [numOutputs, aspectRatio, selectAutoImageModel]);

  const runEditingModelFn = useCallback(async (model, prompt, imageUrl, refImageUrl) => {
    const toBase64 = (url) => url?.startsWith('data:') ? url.split(',')[1] : url;
    const imageBase64 = toBase64(imageUrl);
    const es = editSettings;

    const pollGenerated = async (result, pollFn, ...args) => {
      if (result.error) throw new Error(result.error?.message || `${model} failed`);
      const taskId = result.task_id || result.data?.task_id;
      if (taskId) return (await pollFn(taskId, ...args)).data?.generated || [];
      return result.data?.generated || [];
    };

    switch (model) {
      case 'remove-bg': {
        const result = await removeBackground({ image_url: imageUrl });
        if (result.error) throw new Error(result.error?.message || 'Remove background failed');
        const url = result.high_resolution || result.preview || result.url || null;
        return url ? [url] : [];
      }
      case 'creative-upscale': {
        const params = { image: imageBase64, scale_factor: es.scaleFactor || '2x' };
        if (prompt) params.prompt = prompt;
        if ((es.creativity ?? 0) !== 0) params.creativity = es.creativity;
        return pollGenerated(await upscaleCreative(params), pollUpscaleStatus);
      }
      case 'precision-upscale': {
        const params = { image: imageBase64, scale_factor: es.precisionScale || '4' };
        if ((es.sharpen ?? 7) !== 7) params.sharpen = es.sharpen;
        if ((es.smartGrain ?? 7) !== 7) params.smart_grain = es.smartGrain;
        if ((es.ultraDetail ?? 30) !== 30) params.ultra_detail = es.ultraDetail;
        return pollGenerated(await upscalePrecision(params), pollPrecisionStatus);
      }
      case 'relight': {
        const params = { image: imageBase64 };
        if (prompt) params.prompt = prompt;
        return pollGenerated(await relightImage(params), pollRelightStatus);
      }
      case 'skin-enhancer': {
        const mode = es.skinMode || 'faithful';
        const params = { image: imageBase64 };
        if (mode === 'faithful') params.skin_detail = es.skinDetail ?? 80;
        return pollGenerated(await skinEnhancer(mode, params), pollSkinEnhancerStatus);
      }
      case 'change-camera': {
        const params = {
          image: imageBase64,
          horizontal_angle: es.hAngle ?? 0,
          vertical_angle: es.vAngle ?? 0,
          zoom: es.zoom ?? 5,
        };
        return pollGenerated(await changeCamera(params), pollChangeCameraStatus);
      }
      case 'flux-expand': {
        const params = { image: imageBase64 };
        if (prompt) params.prompt = prompt;
        if ((es.expandLeft ?? 0) > 0) params.left = es.expandLeft;
        if ((es.expandRight ?? 0) > 0) params.right = es.expandRight;
        if ((es.expandTop ?? 0) > 0) params.top = es.expandTop;
        if ((es.expandBottom ?? 0) > 0) params.bottom = es.expandBottom;
        return pollGenerated(await imageExpandFluxPro(params), pollImageExpandStatus);
      }
      case 'seedream-expand': {
        const params = {
          image: imageBase64, prompt: prompt || undefined,
          left: es.expandLeft ?? 0, right: es.expandRight ?? 0,
          top: es.expandTop ?? 0, bottom: es.expandBottom ?? 0,
        };
        return pollGenerated(await seedreamExpand(params), pollSeedreamExpandStatus);
      }
      case 'ideogram-expand': {
        const params = {
          image: imageBase64, prompt: prompt || undefined,
          left: es.expandLeft ?? 0, right: es.expandRight ?? 0,
          top: es.expandTop ?? 0, bottom: es.expandBottom ?? 0,
        };
        return pollGenerated(await ideogramExpand(params), pollIdeogramExpandStatus);
      }
      case 'style-transfer': {
        if (!refImageUrl) throw new Error('Style transfer requires a reference image via the reference-in handle');
        const params = { image: imageBase64, reference_image: toBase64(refImageUrl) };
        if (prompt) params.prompt = prompt;
        return pollGenerated(await styleTransferApi(params), pollStyleTransferStatus);
      }
      case 'quiver-image-to-vector': {
        const base64DataUri = await urlToBase64(imageUrl);
        if (!base64DataUri) throw new Error('Failed to load image for vectorization');
        const compressed = await compressImageBase64(base64DataUri);
        const base64Only = compressed.includes(',') ? compressed.split(',')[1] : compressed;
        const result = await quiverImageToSvg({ model: 'arrow-preview', stream: false, image: { base64: base64Only } });
        if (result.error) throw new Error(result.error?.message || 'Quiver vectorization failed');
        const generatedData = result.data?.data?.[0];
        if (!generatedData?.svg) throw new Error('No SVG returned from Quiver');
        return [`data:image/svg+xml;utf8,${encodeURIComponent(generatedData.svg)}`];
      }
      default:
        throw new Error(`Unknown editing model: ${model}`);
    }
  }, [editSettings]);

  const handleGenerate = useCallback(async () => {
    if (isGenerating) return;

    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';

    // Resolve 3 image inputs from handles or local data
    const image1Input = data.resolveInput?.(id, 'image-1-in');
    const image2Input = data.resolveInput?.(id, 'image-2-in');
    const image3Input = data.resolveInput?.(id, 'image-3-in');
    
    const image1 = Array.isArray(image1Input) ? image1Input[0] : (image1Input || data.image1Url);
    const image2 = Array.isArray(image2Input) ? image2Input[0] : (image2Input || data.image2Url);
    const image3 = Array.isArray(image3Input) ? image3Input[0] : (image3Input || data.image3Url);
    
    // Collect all available images
    const inputImages = [image1, image2, image3].filter(Boolean);

    if (activeEditingModel) {
      // For editing models, use the first available image
      if (!inputImages.length) {
        update({ outputError: 'Connect an image to an image input handle or upload an image to use editing models' });
        return;
      }
      const refImages = data.resolveInput?.(id, 'reference-in') || [];

      setIsGenerating(true);
      start('Submitting editing request...');
      update({ outputImage: null, outputImages: [], outputError: null });
      try {
        const results = await runEditingModelFn(activeEditingModel, prompt, inputImages[0], refImages[0] || null);
        update({ outputImage: results[0] || null, outputImages: results });
        complete('Editing complete');
      } catch (err) {
        console.error('Universal image editing error:', err);
        update({ outputError: err.message });
        fail(err);
      } finally {
        setIsGenerating(false);
      }
    } else {
      if (!prompt) {
        update({ outputError: 'A prompt is required to generate images' });
        return;
      }
      const activeModels = models.filter(Boolean);
      if (activeModels.length === 0) {
        update({ outputError: 'Select at least one model to generate' });
        return;
      }
      setIsGenerating(true);
      start('Submitting generation request...');
      update({ outputImage: null, outputImages: [], outputError: null });
      try {
        const nbImage = data.nanoBananaImage || image1 || null;
        const settled = await Promise.allSettled(
          activeModels.map(m => runGenerationModel(m, prompt, m === 'Nano Banana 2' ? nbImage : null))
        );
        const allImages = settled
          .filter(r => r.status === 'fulfilled')
          .flatMap(r => r.value)
          .filter(Boolean);
        const failures = settled
          .map((r, i) => r.status === 'rejected'
            ? `${MODEL_DEFS[activeModels[i]]?.name || activeModels[i]}: ${r.reason?.message || 'failed'}`
            : null)
          .filter(Boolean);

        if (allImages.length > 0) {
          update({
            outputImage: allImages[0],
            outputImages: allImages,
            isLoading: false,
            outputError: null,
          });
          complete('Generation complete');

          // Spawn and connect ImageOutputNode
          if (data.onCreateNode) {
            data.onCreateNode(
              'imageOutput',
              { outputImage: allImages[0] },
              'output',
              'image-in'
            );
          }
        } else {
          update({ outputError: failures.join('; ') || 'All models failed to generate' });
          fail(new Error(failures.join('; ')));
        }
      } catch (err) {
        console.error('Universal image generation error:', err);
        update({ outputError: err.message });
        fail(err);
      } finally {
        setIsGenerating(false);
      }
    }
  }, [id, data, update, models, activeEditingModel, isGenerating, runGenerationModel, runEditingModelFn, start, complete, fail]);

  const handleImprovePrompt = useCallback(async () => {
    const prompt = data.inputPrompt || '';
    if (!prompt || isImprovingPrompt) return;
    setIsImprovingPrompt(true);
    try {
      const result = await improvePromptGenerate({ prompt, type: 'image' });
      if (result.error) throw new Error(result.error?.message);
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

  const handleImageToPrompt = useCallback(async () => {
    if (isImageToPrompting) return;

    // Prefer the generated output image; fall back to connected/uploaded input images
    const image1Input = data.resolveInput?.(id, 'image-1-in');
    const image1 = Array.isArray(image1Input) ? image1Input[0] : (image1Input || data.image1Url);
    const sourceImage = data.outputImage || image1 || null;
    if (!sourceImage) return;

    setIsImageToPrompting(true);
    try {
      const compressed = await compressImageBase64(sourceImage);
      const result = await imageToPromptGenerate({ image: compressed });
      if (result.error) throw new Error(result.error?.message || JSON.stringify(result.error));

      const taskId = result.task_id || result.data?.task_id;
      let prompt = null;
      if (taskId) {
        const status = await pollImageToPromptStatus(taskId);
        const generated = status.data?.generated || [];
        prompt = status.data?.prompt || status.prompt || generated[0] || null;
      } else {
        prompt = result.data?.prompt || result.prompt || result.data?.generated?.[0] || null;
      }
      if (prompt) update({ inputPrompt: prompt });
    } catch (err) {
      console.error('Image to prompt error:', err);
    } finally {
      setIsImageToPrompting(false);
    }
  }, [id, data, update, isImageToPrompting]);

  const handleDownload = useCallback(() => {
    const url = data.outputImage;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-image.jpg';
    a.click();
  }, [data.outputImage]);

  const handleNBUpload = useCallback(async (files) => {
    if (!files?.length) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;
    setIsUploadingNB(true);
    try {
      const result = await uploadImages([file]);
      if (result.images?.length > 0) update({ nanoBananaImage: result.images[0] });
    } catch (err) {
      console.error('NB upload failed:', err);
    } finally {
      setIsUploadingNB(false);
    }
  }, [update]);

  // Handle image file drop
  const handleImageDrop = useCallback((e, imageNum) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverImage(null);
    
    const files = e.dataTransfer.files;
    if (!files?.length) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      update({ [`image${imageNum}Url`]: ev.target.result });
    };
    reader.readAsDataURL(file);
  }, [update]);

  const handleDragOver = useCallback((e, imageNum) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverImage(imageNum);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverImage(null);
  }, []);

  const setEditSetting = useCallback((key, value) => {
    update({ editSettings: { ...editSettings, [key]: value } });
  }, [update, editSettings]);

  // External trigger
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

  // ── Model selection ─────────────────────────────────────────────────────────

  const setAutoSelect = (val) => update({ autoSelect: val, useMultiple: false, models: val ? ['Auto'] : [models.find(m => m !== 'Auto') || 'Nano Banana 2'] });
  const setUseMultiple = (val) => update({ useMultiple: val, autoSelect: false, models: val ? models.filter(m => m !== 'Auto') : [models.find(m => m !== 'Auto') || 'Nano Banana 2'] });
  const togglePinModel = (m) => {
    const newPinned = pinnedModels.includes(m)
      ? pinnedModels.filter(x => x !== m)
      : [...pinnedModels, m];
    update({ pinnedModels: newPinned });
  };
  const toggleProvider = (p) => setExpandedProviders(prev => ({ ...prev, [p]: !prev[p] }));

  const toggleModel = (m) => {
    if (m === 'Auto') {
      setAutoSelect(true);
      if (!useMultiple) setIsModelMenuOpen(false);
      return;
    }
    const prev = models.filter(x => x !== 'Auto');
    if (useMultiple) {
      const already = prev.includes(m);
      update({
        models: already ? prev.filter(x => x !== m) : [...prev, m],
        autoSelect: false
      });
    } else {
      update({ models: [m], autoSelect: false });
      setIsModelMenuOpen(false);
    }
  };

  // Get effective model (resolving Auto)
  const getEffectiveModel = useCallback(() => {
    if (autoSelect || models[0] === 'Auto') {
      const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
      return selectAutoImageModel(prompt);
    }
    return models[0];
  }, [autoSelect, models, data, id, selectAutoImageModel]);

  const getDropdownLabel = () => {
    if (autoSelect || models.length === 0) {
      const effective = getEffectiveModel();
      const def = MODEL_DEFS[effective];
      const displayName = def?.name || MODEL_DEFS['Nano Banana 2']?.name || 'Auto';
      const logo = getModelLogo(effective);
      return (
        <div key={`auto-${effective}`} style={{ display: 'flex', alignItems: 'center', gap: 6, animation: 'swapFade 0.15s ease-out' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={CATEGORY_COLORS.imageGeneration} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          <span style={{ color: text.muted }}>→</span>
          {logo && <img src={logo} alt="" style={{ width: 14, height: 14, objectFit: 'contain', borderRadius: 2 }} />}
          <span>{effective ? displayName : 'Auto'}</span>
        </div>
      );
    }
    if (models.length === 0) return <div key="none" style={{ animation: 'swapFade 0.15s ease-out' }}>Select Model</div>;
    if (models.length === 1) {
      const m = models[0];
      const logo = getModelLogo(m);
      const displayName = MODEL_DEFS[m]?.name || m;
      return (
        <div key={`single-${m}`} style={{ display: 'flex', alignItems: 'center', gap: 6, animation: 'swapFade 0.15s ease-out' }}>
          {logo && <img src={logo} alt="" style={{ width: 14, height: 14, objectFit: 'contain', borderRadius: 2 }} />}
          <span>{displayName}</span>
        </div>
      );
    }
    return (
      <div key={`multi-${models.length}`} style={{ display: 'flex', alignItems: 'center', gap: 6, animation: 'swapFade 0.15s ease-out' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={CATEGORY_COLORS.imageGeneration} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
        <span>{models.length} Models</span>
      </div>
    );
  };

  const genCost = models.filter(m => !isEditingModel(m))
    .reduce((acc, m) => acc + (COST_MAP[m] || 0.04), 0) * numOutputs;
  const editCost = activeEditingModel ? (COST_MAP[activeEditingModel] || 0.03) : 0;
  const totalCost = activeEditingModel ? editCost : genCost;

  const genFiltered = GENERATION_MODELS.filter(m => m.toLowerCase().includes(modelSearch.toLowerCase()));
  const editFiltered = EDITING_MODELS.filter(m => m.toLowerCase().includes(modelSearch.toLowerCase()));

  const promptDisabled = activeEditingModel && PROMPT_DISABLED.has(activeEditingModel);
  const promptPlaceholder = activeEditingModel
    ? (PROMPT_PLACEHOLDER[activeEditingModel] || 'Optional prompt...')
    : 'e.g. A cinematic shot of a neon cyberpunk city...';

  // ── Shared styles ───────────────────────────────────────────────────────────

  const settingRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 };
  const settingLabel = { ...font.xs, color: text.muted, whiteSpace: 'nowrap' };
  const numInput = {
    width: 52, padding: '2px 6px', background: surface.base, border: `1px solid ${border.default}`,
    borderRadius: radius.sm, color: text.primary, ...font.xs, outline: 'none', textAlign: 'center',
  };

  // ── Editing settings panel ──────────────────────────────────────────────────

  const renderEditSettings = () => {
    if (!activeEditingModel) return null;

    const es = editSettings;

    const pillBtn = (active, onClick, label) => (
      <button
        onClick={onClick}
        className="nodrag nopan"
        style={{
          padding: '2px 8px', borderRadius: radius.sm, cursor: 'pointer', ...font.xs,
          border: `1px solid ${active ? CATEGORY_COLORS.imageGeneration : border.default}`,
          background: active ? `${CATEGORY_COLORS.imageGeneration}22` : 'transparent',
          color: active ? CATEGORY_COLORS.imageGeneration : text.muted,
        }}
      >{label}</button>
    );

    const expandInputs = (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {[['Top', 'expandTop'], ['Bottom', 'expandBottom'], ['Left', 'expandLeft'], ['Right', 'expandRight']].map(([lbl, key]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={settingLabel}>{lbl}</span>
            <input
              type="number" min="0" max="2000" step="64"
              value={es[key] ?? 0}
              onChange={e => setEditSetting(key, Number(e.target.value))}
              className="nodrag nopan"
              style={{ ...numInput, width: '100%' }}
            />
          </div>
        ))}
      </div>
    );

    const panels = {
      'creative-upscale': (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={settingRow}>
            <span style={settingLabel}>Scale</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {SCALE_FACTORS_CREATIVE.map(s => pillBtn(
                (es.scaleFactor || '2x') === s,
                () => setEditSetting('scaleFactor', s), s
              ))}
            </div>
          </div>
          <div style={settingRow}>
            <span style={settingLabel}>Creativity</span>
            <input
              type="range" min="0" max="1" step="0.05"
              value={es.creativity ?? 0}
              onChange={e => setEditSetting('creativity', parseFloat(e.target.value))}
              className="nodrag nopan"
              style={{ flex: 1 }}
            />
            <span style={{ ...font.xs, color: text.muted, minWidth: 24 }}>
              {(es.creativity ?? 0).toFixed(2)}
            </span>
          </div>
        </div>
      ),
      'precision-upscale': (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={settingRow}>
            <span style={settingLabel}>Scale</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {SCALE_FACTORS_PRECISION.map(s => pillBtn(
                (es.precisionScale || '4') === s,
                () => setEditSetting('precisionScale', s), `${s}x`
              ))}
            </div>
          </div>
          <div style={settingRow}>
            <span style={settingLabel}>Sharpen</span>
            <input type="range" min="0" max="10" step="1" value={es.sharpen ?? 7}
              onChange={e => setEditSetting('sharpen', Number(e.target.value))}
              className="nodrag nopan" style={{ flex: 1 }} />
            <span style={{ ...font.xs, color: text.muted, minWidth: 16 }}>{es.sharpen ?? 7}</span>
          </div>
          <div style={settingRow}>
            <span style={settingLabel}>Grain</span>
            <input type="range" min="0" max="10" step="1" value={es.smartGrain ?? 7}
              onChange={e => setEditSetting('smartGrain', Number(e.target.value))}
              className="nodrag nopan" style={{ flex: 1 }} />
            <span style={{ ...font.xs, color: text.muted, minWidth: 16 }}>{es.smartGrain ?? 7}</span>
          </div>
        </div>
      ),
      'change-camera': (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={settingRow}>
            <span style={settingLabel}>H angle</span>
            <input type="range" min="-360" max="360" step="10" value={es.hAngle ?? 0}
              onChange={e => setEditSetting('hAngle', Number(e.target.value))}
              className="nodrag nopan" style={{ flex: 1 }} />
            <input type="number" min="-360" max="360" value={es.hAngle ?? 0}
              onChange={e => setEditSetting('hAngle', Number(e.target.value))}
              className="nodrag nopan" style={numInput} />
          </div>
          <div style={settingRow}>
            <span style={settingLabel}>V angle</span>
            <input type="range" min="-90" max="90" step="5" value={es.vAngle ?? 0}
              onChange={e => setEditSetting('vAngle', Number(e.target.value))}
              className="nodrag nopan" style={{ flex: 1 }} />
            <input type="number" min="-90" max="90" value={es.vAngle ?? 0}
              onChange={e => setEditSetting('vAngle', Number(e.target.value))}
              className="nodrag nopan" style={numInput} />
          </div>
          <div style={settingRow}>
            <span style={settingLabel}>Zoom</span>
            <input type="range" min="0" max="10" step="0.5" value={es.zoom ?? 5}
              onChange={e => setEditSetting('zoom', Number(e.target.value))}
              className="nodrag nopan" style={{ flex: 1 }} />
            <input type="number" min="0" max="10" step="0.5" value={es.zoom ?? 5}
              onChange={e => setEditSetting('zoom', Number(e.target.value))}
              className="nodrag nopan" style={numInput} />
          </div>
        </div>
      ),
      'flux-expand': expandInputs,
      'seedream-expand': expandInputs,
      'ideogram-expand': expandInputs,
      'skin-enhancer': (
        <div style={settingRow}>
          <span style={settingLabel}>Mode</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {pillBtn((es.skinMode || 'faithful') === 'faithful', () => setEditSetting('skinMode', 'faithful'), 'Faithful')}
            {pillBtn(es.skinMode === 'flexible', () => setEditSetting('skinMode', 'flexible'), 'Flexible')}
          </div>
        </div>
      ),
      'style-transfer': (
        <div style={{ ...font.xs, color: text.muted, padding: '4px 0' }}>
          Connect a reference image to the <span style={{ color: text.primary }}>reference-in</span> handle on the left.
        </div>
      ),
    };

    const panel = panels[activeEditingModel];
    if (!panel) return null;

    return (
      <div style={{
        background: surface.base, border: `1px solid ${border.default}`,
        borderRadius: radius.md, padding: sp[2], marginTop: sp[2],
      }}>
        <div style={{ ...font.xs, color: text.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Settings
        </div>
        {panel}
      </div>
    );
  };

  // ── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <div style={{ position: 'relative', paddingTop: 44 }}>
      <style>{`
        @keyframes swapFade {
          0% { opacity: 0; transform: translateY(-2px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* Model Settings Bar — inside node bounding rect via paddingTop */}
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
            onMouseDown={e => e.stopPropagation()}
            disabled={locked}
            className="nodrag nopan"
            style={{
              background: 'transparent', color: text.primary, border: 'none',
              ...font.sm, outline: 'none', cursor: locked ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            {getDropdownLabel()}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {isModelMenuOpen && (
            <div
              onMouseDown={e => e.stopPropagation()}
              style={{
                position: 'absolute', top: '100%', left: 0, marginTop: 4,
                background: surface.deep, border: `1px solid ${border.default}`,
                borderRadius: radius.md, minWidth: 210,
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 20,
                overflow: 'hidden', display: 'flex', flexDirection: 'column',
              }}>
              <div style={{ padding: 8, borderBottom: `1px solid ${border.subtle}` }}>
                <input
                  type="text" placeholder="Search models..."
                  value={modelSearch}
                  onChange={e => setModelSearch(e.target.value)}
                  onClick={e => e.stopPropagation()}
                  onMouseDown={e => e.stopPropagation()}
                  className="nodrag nopan"
                  style={{
                    width: '100%', padding: '4px 8px', borderRadius: radius.sm,
                    background: surface.base, border: `1px solid ${border.subtle}`,
                    color: text.primary, ...font.xs, outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div className="nowheel nodrag" style={{ maxHeight: 320, overflowY: 'auto' }}>
                {/* Toggles */}
                <div style={{ padding: '8px 12px', borderBottom: `1px solid ${border.subtle}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ ...font.xs, color: text.primary }}>Auto select model</span>
                    <Toggle checked={autoSelect} onChange={setAutoSelect} plain />
                  </div>
                  {autoSelect && (
                    <div style={{ 
                      ...font.xs, 
                      color: text.muted, 
                      marginBottom: 8, 
                      padding: '6px 8px', 
                      background: `${CATEGORY_COLORS.imageGeneration}11`,
                      borderRadius: radius.sm,
                      border: `1px solid ${CATEGORY_COLORS.imageGeneration}33`,
                    }}>
                      {(() => {
                        const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
                        const analysis = analyzePromptForModel(prompt);
                        const modelName = MODEL_DEFS[analysis.recommended]?.name || analysis.recommended;
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={CATEGORY_COLORS.imageGeneration} strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M12 16v-4"/>
                              <path d="M12 8h.01"/>
                            </svg>
                            <span>
                              Will use <strong style={{ color: CATEGORY_COLORS.imageGeneration }}>{modelName}</strong>
                              {analysis.type !== 'general' && (
                                <span> for {analysis.type}</span>
                              )}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ ...font.xs, color: text.primary }}>Use multiple models</span>
                    <Toggle checked={useMultiple} onChange={setUseMultiple} plain />
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
                  <div key="empty" style={{ ...font.xs, color: text.muted, fontStyle: 'italic', animation: 'swapFade 0.15s ease-out' }}>Models you favorite will appear here</div>
                  ) : (
                  <div key={`list-${pinnedModels.length}`} style={{ display: 'flex', flexDirection: 'column', gap: 4, animation: 'swapFade 0.15s ease-out' }}>
                      {pinnedModels.filter(m => MODEL_DEFS[m]).map(m => (
                        <ModelCard key={m} modelKey={m} isSelected={models.includes(m)} onToggle={() => toggleModel(m)} onPin={(e) => togglePinModel(m)} isPinned={true} />
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
                  <div key={modelSearch} style={{ display: 'flex', flexDirection: 'column', gap: 6, animation: 'swapFade 0.15s ease-out' }}>
                    {MODELS.filter(m => MODEL_DEFS[m]?.featured).filter(m => {
                      const def = MODEL_DEFS[m];
                      return def && (def.name?.toLowerCase().includes(modelSearch.toLowerCase()) || m.toLowerCase().includes(modelSearch.toLowerCase()));
                    }).map(m => (
                      <ModelCard key={m} modelKey={m} isSelected={models.includes(m)} onToggle={() => toggleModel(m)} onPin={(e) => togglePinModel(m)} isPinned={pinnedModels.includes(m)} showDescription={false} />
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
                    {Object.entries(PROVIDERS).filter(([provider]) => provider !== 'Editing Tools').map(([provider, providerModels]) => {
                      const filtered = providerModels.filter(m => MODEL_DEFS[m] && (MODEL_DEFS[m].name?.toLowerCase().includes(modelSearch.toLowerCase()) || m.toLowerCase().includes(modelSearch.toLowerCase())));
                      if (filtered.length === 0) return null;
                      return (
                        <div key={`${provider}-${modelSearch}`} style={{ animation: 'swapFade 0.15s ease-out' }}>
                          <div style={{ padding: '4px 0', ...font.xs, color: text.muted }}>{provider}</div>
                          {filtered.map(m => {
                            const logo = getModelLogo(m);
                            return (
                              <button
                                key={m}
                                onClick={() => toggleModel(m)}
                                onMouseDown={e => e.stopPropagation()}
                                className="nodrag nopan"
                                style={{
                                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                                  padding: '8px 10px', background: models.includes(m) ? 'rgba(249,115,22,0.08)' : surface.base,
                                  border: `1px solid ${models.includes(m) ? CATEGORY_COLORS.imageGeneration : border.subtle}`,
                                  borderRadius: radius.sm, cursor: 'pointer', textAlign: 'left', marginBottom: 4,
                                }}
                              >
                                {logo && (
                                  <img src={logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain', borderRadius: radius.sm, flexShrink: 0 }} />
                                )}
                                <span style={{ flex: 1, ...font.sm, color: models.includes(m) ? CATEGORY_COLORS.imageGeneration : text.primary }}>{MODEL_DEFS[m]?.name || m}</span>
                                {/* Pin button */}
                                <button
                                  onClick={(e) => { e.stopPropagation(); togglePinModel(m); }}
                                  onMouseDown={e => e.stopPropagation()}
                                  className="nodrag nopan"
                                  style={{
                                    width: 20, height: 20, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                    background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}
                                  title={pinnedModels.includes(m) ? 'Unpin model' : 'Pin model'}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill={pinnedModels.includes(m) ? CATEGORY_COLORS.imageGeneration : 'none'} stroke={pinnedModels.includes(m) ? CATEGORY_COLORS.imageGeneration : text.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CATEGORY_COLORS.imageGeneration} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Editing Tools */}
                {EDITING_MODELS.filter(m => (MODEL_DEFS[m]?.name || m).toLowerCase().includes(modelSearch.toLowerCase())).length > 0 && (
                  <div style={{ padding: '12px 16px', borderTop: `1px solid ${border.subtle}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <span style={{ ...font.xs, color: text.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Editing Tools</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={text.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </div>
                    <div key={modelSearch} style={{ display: 'flex', flexDirection: 'column', gap: 4, animation: 'swapFade 0.15s ease-out' }}>
                      {EDITING_MODELS.filter(m => (MODEL_DEFS[m]?.name || m).toLowerCase().includes(modelSearch.toLowerCase())).map(m => (
                        <ModelCard key={m} modelKey={m} isSelected={models.includes(m)} onToggle={() => toggleModel(m)} onPin={(e) => togglePinModel(m)} isPinned={pinnedModels.includes(m)} />
                      ))}
                    </div>
                  </div>
                )}

                {Object.values(PROVIDERS).flat().filter(m => (MODEL_DEFS[m]?.name || m).toLowerCase().includes(modelSearch.toLowerCase())).length === 0 && (
                  <div key={`empty-${modelSearch}`} style={{ padding: '12px 16px', ...font.xs, color: text.muted, animation: 'swapFade 0.15s ease-out' }}>No models found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title="Auto Model Selection">
            <span style={{ display: 'flex', alignItems: 'center', color: autoSelect ? CATEGORY_COLORS.imageGeneration : text.muted }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </span>
            <Toggle checked={autoSelect} onChange={setAutoSelect} size="sm" plain />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title="Use Multiple Models">
            <span style={{ display: 'flex', alignItems: 'center', color: useMultiple ? CATEGORY_COLORS.imageGeneration : text.muted }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </span>
            <Toggle checked={useMultiple} onChange={setUseMultiple} size="sm" plain />
          </div>
        </div>

        {/* Aspect ratio — hide for editing models (they use input image dimensions) */}
        {!activeEditingModel && (
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
        )}
        {activeEditingModel && (
          <span style={{ ...font.xs, color: text.muted }}>editing</span>
        )}

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
            disabled={!data.outputImage}
            style={{
              background: 'transparent', border: 'none',
              color: data.outputImage ? text.primary : text.muted,
              cursor: data.outputImage ? 'pointer' : 'not-allowed', padding: 2,
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

      {/* Main Node */}
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
        {/* 3 Image Input Handles */}
        <Handle type="target" position={Position.Left} id="image-1-in"
          style={{ top: 25, background: getHandleColor('image-in') }} />
        <Handle type="target" position={Position.Left} id="image-2-in"
          style={{ top: 45, background: getHandleColor('image-in') }} />
        <Handle type="target" position={Position.Left} id="image-3-in"
          style={{ top: 65, background: getHandleColor('image-in') }} />
        <Handle type="target" position={Position.Left} id="prompt-in"
          style={{ top: 90, background: getHandleColor('prompt-in') }} />
        <Handle type="target" position={Position.Left} id="reference-in"
          style={{ top: 115, background: getHandleColor('image-in'), opacity: activeEditingModel === 'style-transfer' ? 1 : 0.3 }} />

        {/* Prompt + Edit Settings */}
        <div style={{ padding: sp[3] }}>
          <div style={{
            background: surface.deep, border: `1px solid ${border.default}`,
            borderRadius: radius.md, padding: sp[2],
            display: 'flex', flexDirection: 'column', gap: sp[2],
          }}>
            <textarea
              ref={promptRef}
              value={data.inputPrompt || ''}
              onChange={e => update({ inputPrompt: e.target.value })}
              disabled={promptDisabled}
              placeholder={promptPlaceholder}
              rows={promptDisabled ? 2 : 4}
              className="nodrag nopan nowheel"
              style={{
                background: 'transparent', border: 'none', color: promptDisabled ? text.muted : text.primary,
                ...font.sm, resize: 'none', outline: 'none', width: '100%',
                opacity: promptDisabled ? 0.5 : 1,
                overflow: 'hidden'
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
                {(() => {
                  const image1Input = data.resolveInput?.(id, 'image-1-in');
                  const image1 = Array.isArray(image1Input) ? image1Input[0] : (image1Input || data.image1Url);
                  const hasImageForPrompt = !!(data.outputImage || image1);
                  return (
                    <button
                      onClick={handleImageToPrompt}
                      onMouseDown={e => e.stopPropagation()}
                      disabled={isImageToPrompting || !hasImageForPrompt}
                      className="nodrag nopan"
                      title="Describe image as prompt"
                      style={{
                        background: 'transparent', border: 'none',
                        color: isImageToPrompting || !hasImageForPrompt ? text.muted : CATEGORY_COLORS.utility,
                        cursor: isImageToPrompting || !hasImageForPrompt ? 'not-allowed' : 'pointer',
                        ...font.sm, display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2 }}>
                        {isImageToPrompting ? (
                          <><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" /></>
                        ) : (
                          <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>
                        )}
                      </svg>
                      Describe
                    </button>
                  );
                })()}
                {!promptDisabled && (
                  <button
                    onClick={handleImprovePrompt}
                    onMouseDown={e => e.stopPropagation()}
                    disabled={isImprovingPrompt || !data.inputPrompt}
                    className="nodrag nopan"
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
                )}

                <div
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setIsHoveringRun(true)}
                  onMouseLeave={() => setIsHoveringRun(false)}
                >
                  <button
                    onClick={handleGenerate}
                    onMouseDown={e => e.stopPropagation()}
                    disabled={isGenerating}
                    className="nodrag nopan"
                    style={{
                      background: CATEGORY_COLORS.imageGeneration,
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
                      {!activeEditingModel && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ ...font.xs, color: text.primary }}>Outputs:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: surface.base, borderRadius: radius.sm, padding: 2 }}>
                            <button
                              onClick={e => { e.stopPropagation(); update({ numOutputs: Math.max(1, numOutputs - 1) }); }}
                              onMouseDown={e => e.stopPropagation()}
                              className="nodrag nopan"
                              style={{ background: 'transparent', border: 'none', color: text.primary, cursor: 'pointer', width: 20 }}
                            >-</button>
                            <span style={{ ...font.sm, color: text.primary, minWidth: 16, textAlign: 'center' }}>{numOutputs}</span>
                            <button
                              onClick={e => { e.stopPropagation(); update({ numOutputs: Math.min(6, numOutputs + 1) }); }}
                              onMouseDown={e => e.stopPropagation()}
                              className="nodrag nopan"
                              style={{ background: 'transparent', border: 'none', color: text.primary, cursor: 'pointer', width: 20 }}
                            >+</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3 Image Input Uploads - Always visible */}
          <div style={{ marginTop: sp[2] }}>
            <div style={{ ...font.xs, color: text.muted, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={getHandleColor('image-in')} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Image Inputs</span>
              <span style={{ opacity: 0.5 }}>(optional)</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {/* Image 1 */}
              {data.image1Url ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={data.image1Url}
                    alt="Input 1"
                    style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: radius.sm }}
                  />
                  <button
                    onClick={() => update({ image1Url: null })}
                    style={{
                      position: 'absolute', top: 2, right: 2,
                      background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: radius.sm,
                      width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', padding: 0,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
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
                        reader.onload = (ev) => update({ image1Url: ev.target.result });
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}
                  onDragOver={(e) => handleDragOver(e, '1')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleImageDrop(e, '1')}
                  style={{
                    border: `2px dashed ${dragOverImage === '1' ? CATEGORY_COLORS.imageGeneration : border.subtle}`,
                    borderRadius: radius.sm, height: 70,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', background: dragOverImage === '1' ? `${CATEGORY_COLORS.imageGeneration}11` : surface.deep,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={dragOverImage === '1' ? CATEGORY_COLORS.imageGeneration : text.muted} strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
              
              {/* Image 2 */}
              {data.image2Url ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={data.image2Url}
                    alt="Input 2"
                    style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: radius.sm }}
                  />
                  <button
                    onClick={() => update({ image2Url: null })}
                    style={{
                      position: 'absolute', top: 2, right: 2,
                      background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: radius.sm,
                      width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', padding: 0,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
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
                        reader.onload = (ev) => update({ image2Url: ev.target.result });
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}
                  onDragOver={(e) => handleDragOver(e, '2')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleImageDrop(e, '2')}
                  style={{
                    border: `2px dashed ${dragOverImage === '2' ? CATEGORY_COLORS.imageGeneration : border.subtle}`,
                    borderRadius: radius.sm, height: 70,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', background: dragOverImage === '2' ? `${CATEGORY_COLORS.imageGeneration}11` : surface.deep,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={dragOverImage === '2' ? CATEGORY_COLORS.imageGeneration : text.muted} strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
              
              {/* Image 3 */}
              {data.image3Url ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={data.image3Url}
                    alt="Input 3"
                    style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: radius.sm }}
                  />
                  <button
                    onClick={() => update({ image3Url: null })}
                    style={{
                      position: 'absolute', top: 2, right: 2,
                      background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: radius.sm,
                      width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', padding: 0,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
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
                        reader.onload = (ev) => update({ image3Url: ev.target.result });
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}
                  onDragOver={(e) => handleDragOver(e, '3')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleImageDrop(e, '3')}
                  style={{
                    border: `2px dashed ${dragOverImage === '3' ? CATEGORY_COLORS.imageGeneration : border.subtle}`,
                    borderRadius: radius.sm, height: 70,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', background: dragOverImage === '3' ? `${CATEGORY_COLORS.imageGeneration}11` : surface.deep,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={dragOverImage === '3' ? CATEGORY_COLORS.imageGeneration : text.muted} strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Model-specific settings panel */}
          {renderEditSettings()}

          {/* Nano Banana 2 — structure reference image upload */}
          {isNanoBanana && (
            <div style={{ marginTop: sp[2] }}>
              <div style={{ ...font.xs, color: text.muted, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Structure Reference</span>
                <span style={{ opacity: 0.5 }}>optional</span>
              </div>

              {data.nanoBananaImage ? (
                <div
                  style={{ position: 'relative', borderRadius: radius.md, overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => setAnnotationOpen(true)}
                  title="Click to annotate"
                >
                  <img
                    src={data.nanoBananaImage}
                    alt="structure reference"
                    style={{ width: '100%', display: 'block', borderRadius: radius.md }}
                  />
                  {/* Hover annotation hint */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.55)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.15s',
                    borderRadius: radius.md,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = 1; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = 0; }}
                  >
                    <div style={{
                      background: 'rgba(0,0,0,0.7)', borderRadius: 20,
                      padding: '6px 14px', ...font.xs, color: '#fff',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                      Annotate
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); update({ nanoBananaImage: null }); }}
                    onMouseDown={e => e.stopPropagation()}
                    className="nodrag nopan"
                    style={{
                      position: 'absolute', top: 4, right: 4,
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(239,68,68,0.9)', border: 'none',
                      color: '#fff', fontSize: 11, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >×</button>
                </div>
              ) : (
                <>
                  <div
                    onClick={() => nbFileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={e => { e.preventDefault(); e.stopPropagation(); handleNBUpload(e.dataTransfer.files); }}
                    className="nodrag nopan"
                    style={{
                      background: surface.deep, border: `1px dashed ${border.default}`,
                      borderRadius: radius.md, minHeight: 56,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 6, cursor: 'pointer', padding: 8,
                    }}
                  >
                    {isUploadingNB ? (
                      <span style={{ ...font.xs, color: text.muted }}>Uploading...</span>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                          <path d="M10 4V16M4 10H16" stroke={text.muted} strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span style={{ ...font.xs, color: text.muted }}>Upload structure reference</span>
                      </>
                    )}
                  </div>
                  <input
                    ref={nbFileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => { handleNBUpload(e.target.files); e.target.value = ''; }}
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* Output */}
        <div style={{ padding: `0 ${sp[3]}px ${sp[3]}px` }}>
          <OutputHandle label="Output" id="output" />
          <OutputPreview
            output={data.outputImage}
            isLoading={isGenerating}
            error={data.outputError}
            accentColor={CATEGORY_COLORS.imageGeneration}
            label="Generation Output"
          />
        </div>
      </div>

      {/* Annotation modal — portalled outside React Flow to avoid clipping */}
      {annotationOpen && createPortal(
        <AnnotationModal
          imageUrl={data.nanoBananaImage}
          onSave={(annotatedUrl) => { update({ nanoBananaImage: annotatedUrl }); setAnnotationOpen(false); }}
          onClose={() => setAnnotationOpen(false)}
        />,
        document.body
      )}
    </div>
  );
}

// ── Toggle component for model settings ───────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
      onMouseDown={e => e.stopPropagation()}
      style={{
        width: 32, height: 18, borderRadius: 9,
        background: checked ? CATEGORY_COLORS.imageGeneration : border.subtle,
        border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: checked ? 16 : 2,
        width: 14, height: 14, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </button>
  );
}

// ── ModelCard component for featured/pinned models ────────────────────────────

function ModelCard({ modelKey, isSelected, onToggle, onPin, isPinned, showDescription = true }) {
  const def = MODEL_DEFS[modelKey] || {};
  const logo = getModelLogo(modelKey);
  const accent = def.type === 'editing' ? (CATEGORY_COLORS.imageEditing || '#a78bfa') : CATEGORY_COLORS.imageGeneration;

  return (
    <div
      onClick={onToggle}
      onMouseDown={e => e.stopPropagation()}
      onMouseEnter={e => { e.currentTarget.style.background = isSelected ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.03)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = isSelected ? 'rgba(249,115,22,0.08)' : surface.base; }}
      className="nodrag nopan"
      style={{
        width: '100%', display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '10px 12px', background: isSelected ? 'rgba(249,115,22,0.08)' : surface.base,
        border: `1px solid ${isSelected ? accent : border.subtle}`,
        borderRadius: radius.md, cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.2s ease',
      }}
    >
      {logo && (
        <img src={logo} alt="" style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: radius.sm, flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ ...font.sm, color: text.primary, fontWeight: 600 }}>{def.name || modelKey}</span>
        </div>
        {showDescription && def?.description && (
          <div style={{ ...font.xs, color: text.muted, lineHeight: 1.4 }}>{def.description}</div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* Pin button */}
        <button
          onClick={(e) => { e.stopPropagation(); onPin(e); }}
          onMouseDown={e => e.stopPropagation()}
          className="nodrag nopan"
          style={{
            width: 24, height: 24, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          title={isPinned ? 'Unpin model' : 'Pin model'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isPinned ? accent : 'none'} stroke={isPinned ? accent : text.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </div>
  );
}
