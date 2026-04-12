import { useState, useRef, useEffect, useCallback, type ReactNode, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Handle, Position } from '@xyflow/react';
import { getHandleColor } from '../utils/handleTypes';
import {
  CATEGORY_COLORS,
  useNodeConnections, OutputHandle, OutputPreview,
  Slider,
  PillGroup,
  TextInput,
  SettingsPanel,
  NodeShell,
  NodeGenerateButton,
  NodeDownloadButton,
  ConnectedOrLocal,
  Pill
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
  quiverTextToSvg, quiverImageToSvg,
  improvePromptGenerate, pollImprovePromptStatus,
  imageToPromptGenerate, pollImageToPromptStatus,
} from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';
import { IMAGE_UNIVERSAL_MODEL_DEFS, type ImageUniversalModelId } from './imageUniversalGeneratorModels';
import {
  normalizeImageSizeTier,
  recraftPixelSizeForAspectAndTier,
} from './universalImageSizes';
import EditableNodeTitle from './EditableNodeTitle';
import AnnotationModal from '../components/AnnotationModal';

interface ImageUniversalGeneratorData {
  label?: string;
  autoSelect?: boolean;
  useMultiple?: boolean;
  pinnedModels?: string[];
  isVector?: boolean;
  locked?: boolean;
  numOutputs?: number;
  aspectRatio?: string;
  imageSizeTier?: string;
  models?: string[];
  editSettings?: {
    creativity?: number;
    scaleFactor?: string;
    precisionScale?: string;
    sharpen?: number;
    hAngle?: number;
    vAngle?: number;
    zoom?: number;
    expandTop?: number;
    expandBottom?: number;
    expandLeft?: number;
    expandRight?: number;
    skinMode?: string;
    [key: string]: any;
  };
  inputPrompt?: string;
  image1Url?: string | null;
  outputImage?: string | null;
  outputImages?: string[];
  outputSvg?: string | null;
  outputError?: string | null;
  triggerGenerate?: number;
  resolveInput?: (id: string, handleId: string) => any;
  onCreateNode?: (type: string, data: any, positionType: string, handleId: string) => void;
  [key: string]: any;
}

interface ImageUniversalGeneratorNodeProps {
  id: string;
  data: ImageUniversalGeneratorData;
  selected?: boolean;
}

async function urlToBase64(url: string | null, timeoutMs = 10000): Promise<string | null> {
  if (!url) return null;
  if (url.startsWith('data:image')) return url;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    if (!res.headers.get('content-type')?.startsWith('image/')) {
      throw new Error('URL does not return an image');
    }

    const blob = await res.blob();
    if (blob.size > 50 * 1024 * 1024) throw new Error('Image exceeds 50MB limit');

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err: any) {
    console.warn(`urlToBase64 failed for "${url}":`, err.message);
    return null;
  }
}

// ── Validation & Sanitization ────────────────────────────────────────────────

/** Sanitize SVG to prevent XSS. Removes dangerous attributes and event handlers. */
function sanitizeSvg(svgString: string | null | undefined): string {
  if (!svgString || typeof svgString !== 'string') return '';
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    if (doc.documentElement.tagName === 'parsererror') throw new Error('Invalid SVG');

    // Remove event handlers and dangerous attributes
    const walker = doc.createTreeWalker(doc.documentElement, NodeFilter.SHOW_ELEMENT);
    let node: Node | null;
    while ((node = walker.nextNode()) !== null) {
      const element = node as Element;
      // Remove on* attributes (onclick, onload, etc.)
      Array.from(element.attributes || []).forEach(attr => {
        if (attr.name.startsWith('on')) element.removeAttribute(attr.name);
      });
      // Remove script tags
      if (element.tagName.toLowerCase() === 'script') element.remove();
    }
    const sanitized = new XMLSerializer().serializeToString(doc.documentElement);
    // Reject oversized SVG outputs (serialization bomb protection)
    if (sanitized.length > 5 * 1024 * 1024) throw new Error('SVG too large (>5MB)');
    return sanitized;
  } catch (err: any) {
    console.warn('SVG sanitization failed:', err.message);
    return '';
  }
}

/** Validate image URL format and size. Returns null if invalid. */
function validateImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  if (!url.startsWith('data:image') && !url.startsWith('http')) return null;
  if (url.length > 1000000) return null; // 1MB URL size limit
  return url;
}

// ── Model lists ──────────────────────────────────────────────────────────────

const EDITING_MODELS = [
  'remove-bg', 'creative-upscale', 'precision-upscale',
  'relight', 'skin-enhancer', 'change-camera',
  'flux-expand', 'seedream-expand', 'ideogram-expand',
  'style-transfer', 'quiver-image-to-vector',
];
const isEditingModel = (m: string) => EDITING_MODELS.includes(m);

const SCALE_FACTORS_CREATIVE = ['2x', '4x', '8x', '16x'];
const SCALE_FACTORS_PRECISION = ['2', '4', '8', '16'];

const COST_MAP: Record<string, number> = {
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

const PROMPT_PLACEHOLDER: Record<string, string> = {
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

const PROMPT_DISABLED = new Set([
  'remove-bg',
  'precision-upscale',
  'skin-enhancer',
  'change-camera',
  'quiver-image-to-vector',
]);

// ── Component ─────────────────────────────────────────────────────────────────

export default function ImageUniversalGeneratorNode({ id, data, selected }: ImageUniversalGeneratorNodeProps) {
  const { update } = useNodeConnections(id, data);

  const { start, complete, fail } = useNodeProgress({
    onProgress: (state: any) => {
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
  const [isNodeHovered, setIsNodeHovered] = useState(false);
  const [showReferenceMenu, setShowReferenceMenu] = useState(false);
  const [annotationOpen, setAnnotationOpen] = useState(false);
  const [dragOverImageZone, setDragOverImageZone] = useState(false);
  const unifiedImageInputRef = useRef<HTMLInputElement>(null);
  const lastTrigger = useRef<number | null>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  // Settings from data with defaults
  const autoSelect = data.autoSelect ?? false;
  const useMultiple = data.useMultiple ?? false;
  const pinnedModels = data.pinnedModels || [];

  const locked = data.locked || false;
  const numOutputs = data.numOutputs || 1;
  const aspectRatio = data.aspectRatio || '1:1';
  const imageSizeTier = normalizeImageSizeTier(data.imageSizeTier);
  const models = data.models || ['Nano Banana 2'];
  const editSettings = data.editSettings || {};

  const promptValue = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
  const image1Input = data.resolveInput?.(id, 'image-1-in');
  const image1 = Array.isArray(image1Input) ? image1Input[0] : (image1Input || data.image1Url);
  const hasImage = !!image1;

  // ── Smart Auto Model Selection ──────────────────────────────────────────────

  const analyzePromptForModel = useCallback((prompt: string | null | undefined, hasImg: boolean = false) => {
    if (!prompt && !hasImg) return { type: 'general', confidence: 0, recommended: 'Nano Banana 2' };
    const lower = String(prompt || '').toLowerCase();

    // Image-to-Image / Editing Intents
    if (hasImg && /\b(vector|svg|vectorize|vector version|to vector|to svg)\b/.test(lower)) {
      return { type: 'vectorize', confidence: 0.95, recommended: 'quiver-image-to-vector' };
    }
    if (hasImg && /\b(remove bg|remove background|transparent background|cutout|isolate)\b/.test(lower)) {
      return { type: 'remove-bg', confidence: 0.95, recommended: 'remove-bg' };
    }
    if (hasImg && /\b(upscale|enhance|make larger|enlarge|high res|high-res|hd|4k)\b/.test(lower)) {
      return { type: 'upscale', confidence: 0.9, recommended: 'creative-upscale' };
    }
    if (hasImg && /\b(relight|lighting|studio light|neon light)\b/.test(lower)) {
      return { type: 'relight', confidence: 0.85, recommended: 'relight' };
    }
    if (hasImg && /\b(style|transfer style|make it look like)\b/.test(lower)) {
      return { type: 'style-transfer', confidence: 0.8, recommended: 'style-transfer' };
    }

    // Text-to-Image / Generation Intents
    if (/\b(vector|svg|logo|icon|flat design|illustration|clipart)\b/.test(lower)) {
      return { type: 'vector', confidence: 0.9, recommended: 'recraftv4' };
    }
    if (/\b(photo|photorealistic|realistic|cinematic|8k|hdr|portrait of|photo of)\b/.test(lower)) {
      return { type: 'photorealistic', confidence: 0.85, recommended: 'flux' };
    }
    if (/\b(painting|art|artistic|oil painting|watercolor|sketch|drawing|style of)\b/.test(lower)) {
      return { type: 'artistic', confidence: 0.8, recommended: 'kora' };
    }
    if (/\b(fast|quick|draft|low quality|cheap)\b/.test(lower)) {
      return { type: 'fast', confidence: 0.7, recommended: 'recraftv3' };
    }
    return { type: 'general', confidence: 0.5, recommended: 'Nano Banana 2' };
  }, []);

  const selectAutoImageModel = useCallback((prompt: string | null | undefined, hasImg: boolean = false) => {
    const analysis = analyzePromptForModel(prompt, hasImg);
    return analysis.recommended;
  }, [analyzePromptForModel]);

  const effectiveModels = models.map(m => {
    if (data.isVector) {
      return hasImage ? 'quiver-image-to-vector' : 'quiver-text-to-vector';
    }
    return m === 'Auto' ? selectAutoImageModel(promptValue, hasImage) : m;
  });
  const activeEditingModel = effectiveModels.find(m => isEditingModel(m)) || null;

  // ── API dispatch ────────────────────────────────────────────────────────────

  const runGenerationModel = useCallback(async (model: string, prompt: string | null | undefined, hasImg: boolean = false): Promise<string[]> => {
    let effectiveModel = model;
    
    if (model === 'Auto') {
      effectiveModel = selectAutoImageModel(prompt, hasImg);
    }
    
    const modelMap: Record<string, string> = {
      'Flux': 'freepik-mystic',
      'Nano Banana 2': 'freepik-mystic',
      'Nano Banana 2 Pro': 'freepik-mystic',
      'Kora Reality': 'freepik-kora',
      'Google Imagen 3': 'google-imagen-3'
    };
    
    const apiModel = modelMap[effectiveModel] || effectiveModel;

    if (effectiveModel === 'recraftv4' || effectiveModel === 'recraftv3') {
      const result = await generateRecraftImage({
        prompt: prompt || '', model: effectiveModel, n: numOutputs,
        size: recraftPixelSizeForAspectAndTier(aspectRatio, imageSizeTier),
      });
      if (result.error) throw new Error(result.error?.message || 'Recraft generation failed');
      return (result.data || []).map((d: any) => d.url);
    }

    if (effectiveModel === 'kora') {
      const result = await generateKora({
        prompt: prompt || '',
        n: numOutputs,
        aspect_ratio: aspectRatio,
      });
      if (result.error) throw new Error(result.error?.message || 'Kora generation failed');

      // Poll
      let status = await pollStatus(result.id);
      while (status.status === 'processing') {
        await new Promise(r => setTimeout(r, 2000));
        status = await pollStatus(result.id);
      }
      if (status.status === 'failed') throw new Error(status.error || 'Kora generation failed');
      return status.outputs.map((o: any) => o.url);
    }

    if (effectiveModel === 'quiver-text-to-vector') {
      const result = await quiverTextToSvg({ prompt: prompt || '' });
      if (result.error) throw new Error(result.error?.message || 'Vector generation failed');
      const sanitized = sanitizeSvg(result.svg);
      return [`data:image/svg+xml;utf8,${encodeURIComponent(sanitized)}`];
    }

    // Default: Nano Banana 2 (Mystic) or Imagen
    const result = await generateImage({
      prompt: prompt || '', model: apiModel, n: numOutputs,
      aspect_ratio: aspectRatio,
    });
    if (result.error) throw new Error(result.error?.message || 'Generation failed');
    
    // Handle Freepik polling
    if (result.data?.task_id) {
      let status = await pollStatus(result.data.task_id, apiModel);
      while (status.status === 'processing') {
        await new Promise(r => setTimeout(r, 2000));
        status = await pollStatus(result.data.task_id, apiModel);
      }
      if (status.status === 'failed') throw new Error(status.error || 'Generation failed');
      return (status.outputs || status.data?.generated || []).map((o: any) => o.url || o);
    }
    
    // Handle Google Imagen or direct generated output
    if (result.data?.generated) {
      return result.data.generated.map((url: string) => url);
    }
    
    // Fallback for array of objects (e.g. OpenAI format)
    return (Array.isArray(result.data) ? result.data : []).map((d: any) => d.url || d);
  }, [aspectRatio, numOutputs, imageSizeTier, selectAutoImageModel]);


  const runEditingModelFn = useCallback(async (model: string, prompt: string, imageUrl: string, refImageUrl: string | null): Promise<string[]> => {
    const toBase64 = (url: string | null) => url?.startsWith('data:') ? url.split(',')[1] : url;
    const imageBase64 = toBase64(imageUrl);
    const es = editSettings;

    const pollGenerated = async (result: any, pollFn: any, ...args: any[]) => {
      if (result.error) throw new Error(result.error?.message || `${model} failed`);
      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const pollResult = await pollFn(taskId, ...args);
        return pollResult.data?.generated || [];
      }
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
        const params: any = { image: imageBase64, scale_factor: es.scaleFactor || '2x' };
        if (prompt) params.prompt = prompt;
        if ((es.creativity ?? 0) !== 0) params.creativity = es.creativity;
        return pollGenerated(await upscaleCreative(params), pollUpscaleStatus);
      }
      case 'precision-upscale': {
        const params: any = { image: imageBase64, scale_factor: es.precisionScale || '4' };
        if ((es.sharpen ?? 7) !== 7) params.sharpen = es.sharpen;
        if ((es.smartGrain ?? 7) !== 7) params.smart_grain = es.smartGrain;
        if ((es.ultraDetail ?? 30) !== 30) params.ultra_detail = es.ultraDetail;
        return pollGenerated(await upscalePrecision(params), pollPrecisionStatus);
      }
      case 'relight': {
        const params: any = { image: imageBase64 };
        if (prompt) params.prompt = prompt;
        return pollGenerated(await relightImage(params), pollRelightStatus);
      }
      case 'skin-enhancer': {
        const mode = es.skinMode || 'faithful';
        const params: any = { image: imageBase64 };
        if (mode === 'faithful') params.skin_detail = es.skinDetail ?? 80;
        return pollGenerated(await skinEnhancer(mode, params), pollSkinEnhancerStatus);
      }
      case 'change-camera': {
        const params: any = {
          image: imageBase64,
          horizontal_angle: es.hAngle ?? 0,
          vertical_angle: es.vAngle ?? 0,
          zoom: es.zoom ?? 5,
        };
        return pollGenerated(await changeCamera(params), pollChangeCameraStatus);
      }
      case 'flux-expand': {
        const params: any = { image: imageBase64 };
        if (prompt) params.prompt = prompt;
        if ((es.expandLeft ?? 0) > 0) params.left = es.expandLeft;
        if ((es.expandRight ?? 0) > 0) params.right = es.expandRight;
        if ((es.expandTop ?? 0) > 0) params.top = es.expandTop;
        if ((es.expandBottom ?? 0) > 0) params.bottom = es.expandBottom;
        return pollGenerated(await imageExpandFluxPro(params), pollImageExpandStatus);
      }
      case 'seedream-expand': {
        const params: any = {
          image: imageBase64, prompt: prompt || undefined,
          left: es.expandLeft ?? 0, right: es.expandRight ?? 0,
          top: es.expandTop ?? 0, bottom: es.expandBottom ?? 0,
        };
        return pollGenerated(await seedreamExpand(params), pollSeedreamExpandStatus);
      }
      case 'ideogram-expand': {
        const params: any = {
          image: imageBase64, prompt: prompt || undefined,
          left: es.expandLeft ?? 0, right: es.expandRight ?? 0,
          top: es.expandTop ?? 0, bottom: es.expandBottom ?? 0,
        };
        return pollGenerated(await ideogramExpand(params), pollIdeogramExpandStatus);
      }
      case 'style-transfer': {
        if (!refImageUrl) throw new Error('Style transfer requires a reference image via the reference-in handle');
        const params: any = { image: imageBase64, reference_image: await urlToBase64(refImageUrl) };
        if (prompt) params.prompt = prompt;
        return pollGenerated(await styleTransferApi(params), pollStyleTransferStatus);
      }
      case 'quiver-image-to-vector': {
        const base64DataUri = await urlToBase64(imageUrl);
        if (!base64DataUri) throw new Error('Failed to load image for vectorization');
        const compressed = await compressImageBase64(base64DataUri);
        if (!compressed || typeof compressed !== 'string') {
          throw new Error('Image compression failed. Try a smaller or different image.');
        }
        if (compressed.length > 100 * 1024 * 1024) {
          throw new Error('Compressed image too large. Maximum 100MB allowed.');
        }
        const base64Only = compressed?.includes(',') ? compressed.split(',')[1] : compressed;
        if (!base64Only || base64Only.length === 0) throw new Error('Image compression failed');
        const result = await quiverImageToSvg({ model: 'arrow-preview', stream: false, image: { base64: base64Only } });
        if (result.error) throw new Error(result.error?.message || 'Quiver vectorization failed');
        const generatedData = result.data?.data?.[0];
        if (!generatedData?.svg) throw new Error('No SVG returned from Quiver');
        const sanitized = sanitizeSvg(generatedData.svg);
        if (!sanitized) throw new Error('SVG validation failed');
        return [`data:image/svg+xml;utf8,${encodeURIComponent(sanitized)}`];
      }
      default:
        throw new Error(`Unknown editing model: ${model}`);
    }
  }, [editSettings]);

  const handleGenerate = useCallback(async () => {
    if (isGenerating) return;

    // Use resolved values from render scope
    const prompt = promptValue;
    const inputImages = [image1].filter(Boolean);

    if (activeEditingModel) {
      if (!inputImages.length) {
        update({ outputError: 'Connect an image to the image input handle or upload an image to use editing models' });
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
      } catch (err: any) {
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
      const activeModels = Array.from(new Set(effectiveModels.filter(Boolean)));
      if (activeModels.length === 0) {
        update({ outputError: 'Select at least one model to generate' });
        return;
      }
      setIsGenerating(true);
      start('Submitting generation request...');
      update({ outputImage: null, outputImages: [], outputError: null });
      try {
        const settled = await Promise.allSettled(
          activeModels.map(m => runGenerationModel(m, prompt, hasImage))
        );
        const allImages = settled
          .filter((r): r is PromiseFulfilledResult<string[]> => r.status === 'fulfilled')
          .flatMap(r => r.value)
          .filter(Boolean);
        const failures = settled
          .map((r, i) => r.status === 'rejected'
            ? `${IMAGE_UNIVERSAL_MODEL_DEFS[activeModels[i] as ImageUniversalModelId]?.name || activeModels[i]}: ${(r as PromiseRejectedResult).reason?.message || 'failed'}`
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

          if (data.onCreateNode) {
            data.onCreateNode('imageOutput', { outputImage: allImages[0] }, 'output', 'image-in');
          }
        } else {
          // Truncate error message if too long (max 500 chars)
          const errorMsg = failures.join('; ') || 'All models failed to generate';
          const truncatedErr = errorMsg.length > 500 ? errorMsg.substring(0, 497) + '...' : errorMsg;
          update({ outputError: truncatedErr });
          fail(new Error(truncatedErr));
        }
      } catch (err: any) {
        console.error('Universal image generation error:', err);
        update({ outputError: err.message });
        fail(err);
      } finally {
        setIsGenerating(false);
      }
    }
  }, [id, data, update, models, effectiveModels, activeEditingModel, isGenerating, runGenerationModel, runEditingModelFn, start, complete, fail, promptValue, image1, hasImage]);

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
    const image1Input = data.resolveInput?.(id, 'image-1-in');
    const image1 = Array.isArray(image1Input) ? image1Input[0] : (image1Input || data.image1Url);
    const sourceImage = data.outputImage || image1 || null;
    if (!sourceImage) return;

    setIsImageToPrompting(true);
    try {
      const compressed = await compressImageBase64(sourceImage);
      if (!compressed) throw new Error('Compression failed');
      const result = await imageToPromptGenerate({ image: compressed });
      if (result.error) throw new Error(result.error?.message);
      if (result.data?.task_id) {
        const status = await pollImageToPromptStatus(result.data.task_id);
        const prompt = status.data?.generated?.[0];
        if (prompt) update({ inputPrompt: prompt });
      } else if (result.data?.generated?.[0]) {
        update({ inputPrompt: result.data.generated[0] });
      }
    } catch (err) {
      console.error('Image to prompt error:', err);
    } finally {
      setIsImageToPrompting(false);
    }
  }, [id, data, update, isImageToPrompting]);

  const handleDownload = useCallback(() => {
    const url = data.outputImage;
    if (!url) return;
    const isSvg = url.startsWith('data:image/svg+xml');
    const a = document.createElement('a');
    a.href = url;
    const label = (data.label || 'Generate Image').toLowerCase().replace(/\s+/g, '-');
    a.download = `${label}-${Date.now()}${isSvg ? '.svg' : '.jpg'}`;
    a.click();
  }, [data.outputImage, data.label]);

  const readFileAsDataURL = useCallback(
    (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }),
    []
  );

  const applyImageFilesToSlots = useCallback(
    async (fileList: FileList) => {
      try {
        const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
        const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

        const files = Array.from(fileList).filter((f) => {
          if (!ALLOWED_TYPES.has(f.type)) {
            console.warn(`Rejected file: unsupported MIME type ${f.type}`);
            return false;
          }
          if (f.size > MAX_FILE_SIZE) {
            console.warn(`Rejected file: exceeds 50MB limit (${(f.size / 1024 / 1024).toFixed(1)}MB)`);
            return false;
          }
          return true;
        });

        if (!files.length) {
          update({ outputError: 'Only JPEG, PNG, WebP, and GIF images (≤50MB) are supported' });
          return;
        }

        const url = await readFileAsDataURL(files[0]);
        update({ image1Url: url, outputError: null });
      } catch (err: any) {
        console.error('Image file upload error:', err);
        update({ outputError: `Failed to load image: ${err.message}` });
      }
    },
    [readFileAsDataURL, update]
  );

  const handleUnifiedImageDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverImageZone(false);
      void applyImageFilesToSlots(e.dataTransfer.files);
    },
    [applyImageFilesToSlots]
  );

  const handleUnifiedDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverImageZone(true);
  }, []);

  const handleUnifiedDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverImageZone(false);
  }, []);

  const clearImageSlot = useCallback(() => update({ image1Url: null }), [update]);

  const setEditSetting = useCallback((key: string, value: any) => {
    update({ editSettings: { ...editSettings, [key]: value } });
  }, [update, editSettings]);

  const safeUpdateNumOutputs = useCallback((newVal: number) => {
    const val = Math.max(1, Math.min(6, Math.floor(newVal || 1)));
    update({ numOutputs: val });
  }, [update]);

  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  useEffect(() => {
    if (promptRef.current) {
      promptRef.current.style.height = 'auto';
      promptRef.current.style.height = `${promptRef.current.scrollHeight}px`;
    }
  }, [data.inputPrompt]);

  const genCost = models.filter(m => !isEditingModel(m))
    .reduce((acc, m) => acc + (COST_MAP[m] || 0.04), 0) * numOutputs;
  const editCost = activeEditingModel ? (COST_MAP[activeEditingModel] || 0.03) : 0;
  const totalCost = activeEditingModel ? editCost : genCost;

  const promptDisabled = activeEditingModel && PROMPT_DISABLED.has(activeEditingModel);
  const promptPlaceholder = activeEditingModel
    ? (PROMPT_PLACEHOLDER[activeEditingModel] || 'Optional prompt...')
    : 'e.g. A cinematic shot of a neon cyberpunk city...';

  const settingRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 };
  const settingLabel = { fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' };
  const numInput: CSSProperties = {
    width: 52, padding: '2px 6px', background: '#0a0a0a', border: '1px solid #1e293b',
    borderRadius: 4, color: '#f8fafc', fontSize: 11, outline: 'none', textAlign: 'center',
  };

  const renderEditSettings = () => {
    if (!activeEditingModel) return null;
    const es = editSettings;
    const pillBtn = (active: boolean, onClick: () => void, label: string) => (
      <button
        onClick={onClick}
        className={`nodrag nopan px-2 py-0.5 rounded cursor-pointer text-[10px] border transition-colors ${
          active ? 'border-pink-500 bg-pink-500/10 text-pink-500' : 'border-slate-800 bg-transparent text-slate-500 hover:text-slate-300'
        }`}
      >{label}</button>
    );

    const expandInputs = (
      <div className="grid grid-cols-2 gap-1.5">
        {[['Top', 'expandTop'], ['Bottom', 'expandBottom'], ['Left', 'expandLeft'], ['Right', 'expandRight']].map(([lbl, key]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span style={settingLabel}>{lbl}</span>
            <input
              type="number" min="0" max="2000" step="64"
              className="nodrag nopan w-full"
              value={es[key] ?? 0}
              onChange={e => setEditSetting(key, Number(e.target.value))}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              style={numInput}
            />
          </div>
        ))}
      </div>
    );

    const panels: Record<string, ReactNode> = {
      'creative-upscale': (
        <div className="flex flex-col gap-2">
          <div style={settingRow}>
            <span style={settingLabel}>Scale</span>
            <div className="flex gap-1">
              {SCALE_FACTORS_CREATIVE.map(s => pillBtn((es.scaleFactor || '2x') === s, () => setEditSetting('scaleFactor', s), s))}
            </div>
          </div>
          <div style={settingRow}>
            <span style={settingLabel}>Creativity</span>
            <input 
              type="range" 
              className="nodrag nopan nowheel flex-1"
              min="0" max="1" step="0.05" 
              value={Math.max(0, Math.min(1, es.creativity ?? 0))}
              onChange={e => setEditSetting('creativity', parseFloat(e.target.value))}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            />
            <span className="text-[10px] text-slate-500 min-w-[24px]">{(Math.max(0, Math.min(1, es.creativity ?? 0))).toFixed(2)}</span>
          </div>
        </div>
      ),
      'precision-upscale': (
        <div className="flex flex-col gap-2">
          <div style={settingRow}>
            <span style={settingLabel}>Scale</span>
            <div className="flex gap-1">
              {SCALE_FACTORS_PRECISION.map(s => pillBtn((es.precisionScale || '4') === s, () => setEditSetting('precisionScale', s), `${s}x`))}
            </div>
          </div>
          <div style={settingRow}>
            <span style={settingLabel}>Sharpen</span>
            <input 
              type="range" 
              className="nodrag nopan nowheel flex-1"
              min="0" max="10" step="1" 
              value={Math.max(0, Math.min(10, es.sharpen ?? 7))}
              onChange={e => setEditSetting('sharpen', Number(e.target.value))}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            />
            <span className="text-[10px] text-slate-500 min-w-[16px]">{Math.max(0, Math.min(10, es.sharpen ?? 7))}</span>
          </div>
        </div>
      ),
      'change-camera': (
        <div className="flex flex-col gap-2">
          {[['H angle', 'hAngle', 0, 360, 1, 0], ['V angle', 'vAngle', -30, 90, 1, 0], ['Zoom', 'zoom', 0, 10, 0.1, 5]].map(([lbl, key, min, max, step, def]: any) => {
            const val = es[key] ?? def;
            return (
            <div key={key} style={settingRow}>
              <span style={settingLabel}>{lbl}</span>
              <input 
                type="range" min={min} max={max} step={step} 
                className="nodrag nopan nowheel flex-1"
                value={val}
                onChange={e => setEditSetting(key, Number(e.target.value))}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              />
              <input 
                type="number" min={min} max={max} step={step}
                className="nodrag nopan nowheel"
                value={val}
                onChange={e => setEditSetting(key, Number(e.target.value))}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                style={numInput} 
              />
            </div>
            );
          })}
        </div>
      ),
      'flux-expand': expandInputs,
      'seedream-expand': expandInputs,
      'ideogram-expand': expandInputs,
      'skin-enhancer': (
        <div style={settingRow}>
          <span style={settingLabel}>Mode</span>
          <div className="flex gap-1">
            {pillBtn((es.skinMode || 'faithful') === 'faithful', () => setEditSetting('skinMode', 'faithful'), 'Faithful')}
            {pillBtn(es.skinMode === 'flexible', () => setEditSetting('skinMode', 'flexible'), 'Flexible')}
          </div>
        </div>
      ),
      'style-transfer': (
        <div className="text-[10px] text-slate-500 py-1">
          Connect a reference image to the <span className="text-slate-300">reference-in</span> handle on the left.
        </div>
      ),
    };

    const panel = panels[activeEditingModel];
    if (!panel) {
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 mt-2">
          <div className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-wider">Generation Settings</div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={!!data.isVector} 
                onChange={e => update({ isVector: e.target.checked })}
                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 accent-pink-600 cursor-pointer"
              />
              <span className={`text-[11px] font-medium transition-colors ${data.isVector ? 'text-pink-400' : 'text-slate-400 group-hover:text-slate-300'}`}>Vector Output (SVG)</span>
            </label>
          </div>
          {data.isVector && (
            <div className="text-[9px] text-pink-400/60 mt-1 leading-relaxed">Uses Quiver Text-to-Vector model. Perfect for logos and icons.</div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 mt-2">
        <div className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-wider">Settings</div>
        {panel}
      </div>
    );
  };

  return (
    <div 
      className="relative pt-11"
      onMouseEnter={() => setIsNodeHovered(true)}
      onMouseLeave={() => setIsNodeHovered(false)}
    >
      <div className="absolute top-0 left-0 right-0 flex items-center justify-end bg-slate-950 border border-slate-800 rounded-lg p-1 px-2 gap-2 shadow-lg z-10">
        <div className="mr-auto flex-1 min-w-0 flex items-center nodrag nopan">
          <EditableNodeTitle
            value={String(data.label ?? '')}
            onCommit={(next) => update({ label: next })}
            placeholder="Generate Image"
            maxWidth={200}
            size="sm"
            style={{ color: '#94a3b8' }}
          />
        </div>
        {activeEditingModel && <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">editing</span>}
        <div className="flex gap-1 items-center">
          {(isNodeHovered || isGenerating) && (
            <NodeGenerateButton 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating} 
              size="sm"
            />
          )}
          <button onClick={() => update({ locked: !locked })} className={`bg-transparent border-none p-0.5 cursor-pointer transition-colors ${locked ? 'text-pink-500' : 'text-slate-500 hover:text-slate-300'}`} title={locked ? 'Unlock settings' : 'Lock settings'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {locked ? <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></> : <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></>}
            </svg>
          </button>
          <button onClick={handleDownload} disabled={!data.outputImage} className={`bg-transparent border-none p-0.5 transition-colors ${data.outputImage ? 'text-slate-300 cursor-pointer hover:text-white' : 'text-slate-600 cursor-not-allowed'}`} title="Download">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          </button>
        </div>
      </div>

      <div className={`bg-slate-900 border ${selected ? 'border-pink-500 shadow-lg shadow-pink-500/20' : 'border-slate-800 shadow-md'} rounded-xl w-80 font-sans transition-all duration-150`}>
        <Handle type="target" position={Position.Left} id="image-1-in" className="w-3 h-3 border-none" style={{ top: 60, background: getHandleColor('image-in') }} />
        <Handle type="target" position={Position.Left} id="prompt-in" className="w-3 h-3 border-none" style={{ top: 180, background: getHandleColor('prompt-in') }} />
        <Handle type="target" position={Position.Left} id="reference-in" className="w-3 h-3 border-none" style={{ top: 228, background: getHandleColor('image-in'), opacity: activeEditingModel === 'style-transfer' ? 1 : 0.3 }} />

        <div className="p-4 flex flex-col gap-4">
          <input ref={unifiedImageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.length) void applyImageFilesToSlots(e.target.files); e.target.value = ''; }} />
          
          <div onClick={() => unifiedImageInputRef.current?.click()} onDrop={handleUnifiedImageDrop} onDragOver={handleUnifiedDragOver} onDragLeave={handleUnifiedDragLeave} className={`nodrag nopan border-2 border-dashed rounded-lg aspect-square p-4 cursor-pointer transition-all duration-150 flex flex-col gap-2 ${dragOverImageZone ? 'border-pink-500 bg-pink-500/10' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'}`}>
            <div className="text-[10px] text-slate-400 flex items-center gap-2 uppercase tracking-wider">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={getHandleColor('image-in')} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              <span className="font-bold">Image input</span>
              <span className="opacity-50 font-normal">optional</span>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[80px] w-full">
              {data.image1Url ? (
                <div 
                  className="relative w-full aspect-square rounded-md overflow-hidden border border-slate-700 bg-slate-950 group cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setAnnotationOpen(true); }}
                  title="Click to annotate"
                >
                  <img src={data.image1Url} alt="Input image" className="w-full h-full object-cover block" />

                  {/* Hover annotation hint */}
                  <div className="absolute inset-0 bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <div className="bg-black/70 rounded-full px-3.5 py-1.5 text-xs text-white flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                      Annotate
                    </div>
                  </div>

                  <button type="button" onClick={(e) => { e.stopPropagation(); clearImageSlot(); }} className="absolute top-1 right-1 bg-black/70 hover:bg-red-500/80 text-white border-none rounded p-1 transition-colors" title="Remove"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
                </div>
              ) : (                <div className="text-[11px] text-slate-500 flex flex-col items-center gap-1 opacity-70">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <span>Click or drop image</span>
                </div>
              )}
            </div>
          </div>

          <div 
            className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col gap-3 nodrag nopan cursor-text"
            onClick={() => promptRef.current?.focus()}
          >
            <div className="flex flex-col gap-1">
              <textarea 
                ref={promptRef} 
                className="nodrag nopan nowheel bg-transparent border-none text-slate-100 text-sm resize-none outline-none w-full disabled:opacity-50 overflow-hidden min-h-[60px]"
                value={data.inputPrompt || ''} 
                onChange={e => update({ inputPrompt: e.target.value })} 
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                disabled={promptDisabled} 
                placeholder={promptPlaceholder} 
                rows={promptDisabled ? 2 : 4} 
                maxLength={5000} 
              />
              <div className="text-[9px] text-slate-500 text-right">{(data.inputPrompt || '').length}/5000</div>
            </div>

            <div className="flex justify-between items-center mt-1">
              <div className="relative">
                <button onClick={() => setShowReferenceMenu(!showReferenceMenu)} onMouseDown={e => e.stopPropagation()} className={`w-8 h-8 flex items-center justify-center rounded-md cursor-pointer transition-colors ${showReferenceMenu ? 'bg-slate-800 text-white border border-pink-500/50' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-700'}`} title="Reference (@)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
                </button>
                {showReferenceMenu && (
                  <div className="nodrag nopan absolute top-full left-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg p-1 z-10 flex flex-col gap-1 shadow-2xl w-24">
                    {['@img_1', '@img_2', '@img_3', '@img_4'].map(tag => (
                      <div key={tag} onClick={() => {
                        const input = promptRef.current;
                        if (!input) return;
                        const start = input.selectionStart || 0;
                        const end = input.selectionEnd || 0;
                        const val = input.value;
                        const newVal = val.substring(0, start) + tag + val.substring(end);
                        update({ inputPrompt: newVal });
                        setTimeout(() => { input.focus(); input.setSelectionRange(start + tag.length, start + tag.length); }, 0);
                        setShowReferenceMenu(false);
                      }} className="p-1.5 px-2 rounded-md cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white text-[10px] font-mono transition-colors">{tag}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 items-center">
                {(() => {
                  const image1Input = data.resolveInput?.(id, 'image-1-in');
                  const image1 = Array.isArray(image1Input) ? image1Input[0] : (image1Input || data.image1Url);
                  const hasImageForPrompt = !!(data.outputImage || image1);
                  return (
                    <button onClick={handleImageToPrompt} onMouseDown={e => e.stopPropagation()} disabled={isImageToPrompting || !hasImageForPrompt} className={`nodrag nopan bg-transparent border-none text-xs flex items-center gap-1.5 transition-colors ${isImageToPrompting || !hasImageForPrompt ? 'text-slate-600 cursor-not-allowed' : 'text-sky-400 hover:text-sky-300 cursor-pointer'}`} title="Describe image as prompt">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{isImageToPrompting ? <><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" /></> : <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>}</svg>
                      Describe
                    </button>
                  );
                })()}
                {!promptDisabled && (
                  <button onClick={handleImprovePrompt} onMouseDown={e => e.stopPropagation()} disabled={isImprovingPrompt || !data.inputPrompt} className={`nodrag nopan bg-transparent border-none text-xs flex items-center gap-1.5 transition-colors ${isImprovingPrompt || !data.inputPrompt ? 'text-slate-600 cursor-not-allowed' : 'text-sky-400 hover:text-sky-300 cursor-pointer'}`} title="Improve Prompt">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{isImprovingPrompt ? <><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" /></> : <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>}</svg>
                    Improve
                  </button>
                )}
                <div className="relative" onMouseEnter={() => setIsHoveringRun(true)} onMouseLeave={() => setIsHoveringRun(false)}>
                  <button onClick={handleGenerate} onMouseDown={e => e.stopPropagation()} disabled={isGenerating} className={`nodrag nopan text-white border-none rounded-lg w-8 h-8 flex items-center justify-center transition-colors shadow-lg ${isGenerating ? 'bg-slate-700 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-500 cursor-pointer shadow-pink-600/20'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{isGenerating ? <><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" /></> : <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>}</svg>
                  </button>
                  {isHoveringRun && (
                    <div className="absolute bottom-full right-0 mb-2 bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col gap-2 min-w-[140px] shadow-2xl z-20">
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider"><span>Cost:</span><span className="text-emerald-400">${totalCost.toFixed(3)}</span></div>
                      {!activeEditingModel && (
                        <div className="flex justify-between items-center gap-3">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Outputs:</span>
                          <div className="flex items-center gap-2 bg-slate-900 rounded-md p-0.5 border border-slate-800">
                            <button onClick={e => { e.stopPropagation(); safeUpdateNumOutputs(numOutputs - 1); }} onMouseDown={e => e.stopPropagation()} className="bg-transparent border-none text-slate-400 hover:text-white cursor-pointer px-1.5 py-0.5">-</button>
                            <span className="text-xs text-slate-200 min-w-[12px] text-center font-bold">{numOutputs}</span>
                            <button onClick={e => { e.stopPropagation(); safeUpdateNumOutputs(numOutputs + 1); }} onMouseDown={e => e.stopPropagation()} className="bg-transparent border-none text-slate-400 hover:text-white cursor-pointer px-1.5 py-0.5">+</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {renderEditSettings()}
        </div>
        <div className="px-4 pb-4">
          <OutputHandle label="Output" id="output" />
          <OutputPreview output={data.outputImage} isLoading={isGenerating} error={data.outputError} accentColor={CATEGORY_COLORS.imageGeneration} label={data.outputImage?.startsWith('data:image/svg') ? "SVG Vector Output" : "Generation Output"} />
        </div>
      </div>

      {/* Annotation modal — portalled outside React Flow to avoid clipping */}
      {annotationOpen && createPortal(
        <AnnotationModal
          imageUrl={data.image1Url || ''}
          onSave={(annotatedUrl) => { update({ image1Url: annotatedUrl }); setAnnotationOpen(false); }}
          onClose={() => setAnnotationOpen(false)}
        />,
        document.body
      )}
    </div>
  );
}
