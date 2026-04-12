import { type NodePricing } from '../types/billing';

export const DEFAULT_STARTING_CREDITS = 100;

export const PRICING_CATALOG: Record<string, NodePricing> = {
  // Image Models
  'flux-schnell': { 
    id: 'flux-schnell', 
    name: 'Flux Schnell (Draft)', 
    baseCost: 2, 
    category: 'image',
    description: 'Fast, lower-quality image generation' 
  },
  'flux-dev': { 
    id: 'flux-dev', 
    name: 'Flux Dev (Pro)', 
    baseCost: 5, 
    category: 'image',
    description: 'High-quality professional image generation'
  },
  'dalle-3': { 
    id: 'dalle-3', 
    name: 'DALL-E 3', 
    baseCost: 8, 
    category: 'image',
    description: 'Highly detailed OpenAI image generation'
  },

  // Video Models
  'kling-v1': { 
    id: 'kling-v1', 
    name: 'Kling Video', 
    baseCost: 25, 
    category: 'video',
    description: 'High-fidelity video generation'
  },
  'runway-gen3': { 
    id: 'runway-gen3', 
    name: 'Runway Gen-3', 
    baseCost: 30, 
    category: 'video',
    description: 'Cinematic AI video generation'
  },
  'veo-3.1': {
    id: 'veo-3.1',
    name: 'Veo 3.1 Frames',
    baseCost: 40,
    category: 'video',
    description: 'Google Veo video generation'
  },

  // Text/LLM Models
  'claude-3-5-sonnet': { 
    id: 'claude-3-5-sonnet', 
    name: 'Claude 3.5 Sonnet', 
    baseCost: 1, 
    category: 'text',
    description: 'Anthropic reasoning and text processing'
  },
  'gpt-4o': { 
    id: 'gpt-4o', 
    name: 'GPT-4o', 
    baseCost: 1, 
    category: 'text',
    description: 'OpenAI multi-modal text processing'
  },

  // Audio Models
  'elevenlabs-tts': { 
    id: 'elevenlabs-tts', 
    name: 'ElevenLabs TTS', 
    baseCost: 3, 
    category: 'audio',
    description: 'Ultra-realistic voice synthesis'
  },
  
  // Utilities
  'background-removal': {
    id: 'background-removal',
    name: 'Background Removal',
    baseCost: 2,
    category: 'utility',
    description: 'Remove background from image'
  },
  'upscale': {
    id: 'upscale',
    name: 'Image Upscale',
    baseCost: 4,
    category: 'utility',
    description: 'AI-powered image enhancement'
  }
};

/**
 * Helper to get the cost for a given model or node type.
 * Falls back to a default cost if not explicitly configured.
 */
export const getCostForOperation = (modelId: string): number => {
  const model = PRICING_CATALOG[modelId];
  return model ? model.baseCost : 1; // Default fallback cost
};
