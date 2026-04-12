export type PromptRecipe = {
  id: string;
  title: string;
  description: string;
  nodes: {
    type: string;
    position: { x: number; y: number };
    data: Record<string, any>;
  }[];
  edges: {
    sourceIndex: number;
    sourceHandle: string;
    targetIndex: number;
    targetHandle: string;
    color?: string;
  }[];
};

export const PROMPT_RECIPES: PromptRecipe[] = [
  {
    id: 'recipe-image-gen',
    title: 'Text to Image Pipeline',
    description: 'A basic prompt-to-image workflow using the Universal Image Generator. Perfect for generating quick concepts.',
    nodes: [
      { type: 'textNode', position: { x: 0, y: 0 }, data: { label: 'Prompt Input', text: 'A futuristic city at sunset, cyberpunk style, neon lights, 8k resolution' } },
      { type: 'universalGeneratorImage', position: { x: 350, y: 0 }, data: { label: 'Universal Image', models: ['Nano Banana 2'], aspectRatio: '16:9' } },
      { type: 'imageOutput', position: { x: 750, y: 0 }, data: { label: 'Image Output' } }
    ],
    edges: [
      { sourceIndex: 0, sourceHandle: 'prompt-out', targetIndex: 1, targetHandle: 'prompt-in', color: '#f97316' },
      { sourceIndex: 1, sourceHandle: 'output', targetIndex: 2, targetHandle: 'image-in', color: '#ec4899' }
    ]
  },
  {
    id: 'recipe-video-upscale',
    title: 'Precision Video Upscaling',
    description: 'Takes a source video and enhances it using Precision Video Upscaler, adding detail and resolution.',
    nodes: [
      { type: 'sourceMediaNode', position: { x: 0, y: 0 }, data: { label: 'Source Video', mediaFiles: [] } },
      { type: 'precisionVideoUpscale', position: { x: 350, y: 0 }, data: { label: 'Precision Upscaler', localResolution: '4k', localStrength: 80 } },
      { type: 'videoOutput', position: { x: 750, y: 0 }, data: { label: 'Enhanced Video' } }
    ],
    edges: [
      { sourceIndex: 0, sourceHandle: 'video-out', targetIndex: 1, targetHandle: 'video-in', color: '#14b8a6' },
      { sourceIndex: 1, sourceHandle: 'output', targetIndex: 2, targetHandle: 'video-in', color: '#14b8a6' }
    ]
  },
  {
    id: 'recipe-audio-narration',
    title: 'AI Voice Narration',
    description: 'Converts a text script into a high-quality voiceover using ElevenLabs, and routes the output to an audio player.',
    nodes: [
      { type: 'textNode', position: { x: 0, y: 0 }, data: { label: 'Voice Script', text: 'Welcome to the future of AI pipelines. Here, you can connect nodes to build anything you can imagine.' } },
      { type: 'voiceover', position: { x: 350, y: 0 }, data: { label: 'ElevenLabs Voiceover', localVoiceId: '21m00Tcm4TlvDq8ikWAM' } },
      { type: 'soundOutput', position: { x: 750, y: 0 }, data: { label: 'Sound Output' } }
    ],
    edges: [
      { sourceIndex: 0, sourceHandle: 'prompt-out', targetIndex: 1, targetHandle: 'prompt-in', color: '#f97316' },
      { sourceIndex: 1, sourceHandle: 'output-audio', targetIndex: 2, targetHandle: 'audio-in', color: '#a855f7' }
    ]
  },
  {
    id: 'recipe-image-analysis',
    title: 'Image Analysis & Auto-Prompting',
    description: 'Analyzes an uploaded image with Claude Vision to generate a detailed description, which is then fed into an image generator to create a variation.',
    nodes: [
      { type: 'sourceMediaNode', position: { x: 0, y: 0 }, data: { label: 'Source Image' } },
      { type: 'imageAnalyzer', position: { x: 350, y: 0 }, data: { label: 'Claude Sonnet Vision', systemDirections: 'Describe the main subject, style, and lighting of this image in a single paragraph, suitable for an image generation prompt.' } },
      { type: 'universalGeneratorImage', position: { x: 750, y: 0 }, data: { label: 'Variation Generator', models: ['Nano Banana 2'] } },
      { type: 'imageOutput', position: { x: 1150, y: 0 }, data: { label: 'Final Output' } }
    ],
    edges: [
      { sourceIndex: 0, sourceHandle: 'image-out', targetIndex: 1, targetHandle: 'image-in', color: '#ec4899' },
      { sourceIndex: 1, sourceHandle: 'analysis-out', targetIndex: 2, targetHandle: 'prompt-in', color: '#f97316' },
      { sourceIndex: 2, sourceHandle: 'output', targetIndex: 3, targetHandle: 'image-in', color: '#ec4899' }
    ]
  }
];
