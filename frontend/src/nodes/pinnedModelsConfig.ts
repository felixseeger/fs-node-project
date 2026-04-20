/**
 * Pinned Models Configuration
 * Default pinned models by node type, plus recommended models for auto-selection
 */

export const DEFAULT_PINNED_MODELS: Record<string, string[]> = {
  universalGeneratorImage: [
    'google-imagegen-4',
    'flux-1-1-pro',
    'flux-2-pro',
    'flux-kontext-pro',
    'ideogram-v3-turbo',
    'Nano Banana 2',
    'recraftv4',
    'topaz-upscale',
    'codeformer',
    'gfpgan',
  ],
  universalGeneratorVideo: [
    'minimax-video-01',
    'luma-reframe',
    'topaz-video-upscale',
    'luma-ray-2',
    'ltx-video',
    'kling3',
  ],
  universalGeneratorAudio: [
    'voiceover',
    'strudelNode',
  ],
};

export const RECOMMENDED_AUTO_SELECT_MODELS: Record<string, string> = {
  // Image generation (text-to-image)
  'google-imagegen-4': 'replicate',
  'flux-1-1-pro': 'replicate',
  'flux-2-pro': 'replicate',
  'flux-kontext-pro': 'replicate',
  'ideogram-v3-turbo': 'ideogram',

  // Image upscaling & restoration
  'topaz-upscale': 'topaz',
  'codeformer': 'replicate',
  'gfpgan': 'replicate',

  // Video generation
  'minimax-video-01': 'minimax',
  'luma-reframe': 'luma',
  'topaz-video-upscale': 'topaz',
  'luma-ray-2': 'luma',
  'ltx-video': 'ltx',
};

export function getDefaultPinnedModels(nodeType?: string): string[] {
  if (!nodeType) return [];
  return DEFAULT_PINNED_MODELS[nodeType] || [];
}

export function getPinnedModelsFromStorage(nodeId: string, nodeType?: string): string[] {
  if (!nodeType) return [];

  try {
    const stored = localStorage.getItem(`pinned-models-${nodeId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fall through to defaults
  }

  return getDefaultPinnedModels(nodeType);
}

export function savePinnedModelsToStorage(nodeId: string, pinned: string[]): void {
  try {
    localStorage.setItem(`pinned-models-${nodeId}`, JSON.stringify(pinned));
  } catch {
    // Silently fail if localStorage unavailable
  }
}

export function getGlobalPinnedModelsFromStorage(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem('global-pinned-models');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fall through to empty object
  }
  return {};
}

export function saveGlobalPinnedModelsToStorage(models: Record<string, string[]>): void {
  try {
    localStorage.setItem('global-pinned-models', JSON.stringify(models));
  } catch {
    // Silently fail if localStorage unavailable
  }
}
