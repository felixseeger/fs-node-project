export const SECTIONS_META = {
  'Inputs': {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12l7-7 7 7" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: '#6b7280',
    inputColor: '#6b7280',
    outputColor: '#6b7280',
  },
  'LLMs': {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" fill="#0ea5e9" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#0ea5e9" strokeWidth="1.5" fill="none" />
        <path d="M12 6v2M12 16v2M6 12H4M20 12h-2" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: '#0ea5e9',
    inputColor: '#ec4899',
    outputColor: '#f97316',
  },
  'Image Generation': {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#f97316" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="#f97316" />
        <path d="M21 15l-5-5L5 21" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: '#f97316',
    inputColor: '#f97316',
    outputColor: '#ec4899',
  },
  'Video Generation': {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="#14b8a6" strokeWidth="1.5" />
      </svg>
    ),
    color: '#14b8a6',
    inputColor: '#ec4899',
    outputColor: '#14b8a6',
  },
  'Video Editing': {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 013.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: '#14b8a6',
    inputColor: '#14b8a6',
    outputColor: '#14b8a6',
  },
  'Audio Generation': {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: '#a855f7',
    inputColor: '#f97316',
    outputColor: '#a855f7',
  },
  'Utilities': {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: '#8b5cf6',
    inputColor: '#8b5cf6',
    outputColor: '#8b5cf6',
  },
};

export const NODE_DATA = [
  {
    section: 'Inputs',
    items: [
      { label: 'Input', inputs: ['config'], outputs: ['variable'] },
      { label: 'Text', inputs: ['text'], outputs: ['text-out'] },
      { label: 'Image', inputs: ['image'], outputs: ['image-out'] },
      { label: 'Asset', inputs: ['image'], outputs: ['image-out'] },
      { label: 'Source Media Upload', inputs: ['video / audio'], outputs: ['video-out'] },
    ],
  },
  {
    section: 'LLMs',
    items: [
      { label: 'Gemini 3 Pro', inputs: ['image-in', 'prompt-in'], outputs: ['analysis-out'] },
      { label: 'Image to Prompt', inputs: ['image-in'], outputs: ['prompt-out'] },
      { label: 'Improve Prompt', inputs: ['prompt-in'], outputs: ['prompt-out'] },
      { label: 'AI Image Classifier', inputs: ['image-in'], outputs: ['text-out'] },
    ],
  },
  {
    section: 'Image Generation',
    items: [
      { label: 'Nano Banana 2 Edit', inputs: ['prompt-in', 'image-in'], outputs: ['image-out'] },
      { label: 'Flux Reimagine', inputs: ['image-in'], outputs: ['image-out'] },
      { label: 'Text to Icon', inputs: ['prompt-in'], outputs: ['image-out'] },
      { label: 'Universal Image', inputs: ['prompt-in', 'image-in'], outputs: ['image-out'] },
      { label: 'Quiver Text to Vector', inputs: ['prompt-in'], outputs: ['image-out'] },
      { label: 'Quiver Image to Vector', inputs: ['image-in'], outputs: ['image-out'] },
      { label: 'Creative Upscale', inputs: ['image-in'], outputs: ['image-out'] },
      { label: 'Precision Upscale', inputs: ['image-in'], outputs: ['image-out'] },
      { label: 'Relight', inputs: ['image-in'], outputs: ['image-out'] },
      { label: 'Style Transfer', inputs: ['image-in'], outputs: ['image-out'] },
      { label: 'Remove Background', inputs: ['image-in'], outputs: ['image-out'] },
      { label: 'Flux Image Expand', inputs: ['image-in'], outputs: ['image-out'] },
      { label: 'Seedream Expand', inputs: ['image-in'], outputs: ['image-out'] },
      { label: 'Ideogram Expand', inputs: ['image-in'], outputs: ['image-out'] },
      { label: 'Skin Enhancer', inputs: ['image-in'], outputs: ['image-out'] },
      { label: 'Ideogram Inpaint', inputs: ['image-in'], outputs: ['image-out'] },
      { label: 'Change Camera', inputs: ['image-in'], outputs: ['image-out'] },
      { label: 'Group Editing', inputs: ['images-in'], outputs: ['images-out'] },
      { label: 'Facial Editing', inputs: ['image-in'], outputs: ['image-out'] },
    ],
  },
  {
    section: 'Video Generation',
    items: [
      { label: 'Kling 3', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'Kling 3 Omni', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'Kling 3 Motion Control', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'Kling Elements Pro', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'Kling O1', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'MiniMax Live', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'Wan 2.6', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'Seedance 1.5 Pro', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'LTX Video 2.0 Pro', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'Runway Gen-4.5', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'Runway Gen-4 Turbo', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'Runway Act Two', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'PixVerse V5', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'PixVerse V5 Transition', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'OmniHuman', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'Universal Video', inputs: ['prompt-in', 'image-in'], outputs: ['video-out'] },
      { label: 'VFX', inputs: ['video-in'], outputs: ['video-out'] },
      { label: 'Creative Video Upscale', inputs: ['video-in'], outputs: ['video-out'] },
      { label: 'Precision Video Upscale', inputs: ['video-in'], outputs: ['video-out'] },
    ],
  },
  {
    section: 'Audio Generation',
    items: [
      { label: 'ElevenLabs Music', inputs: ['prompt-in'], outputs: ['audio-out'] },
      { label: 'ElevenLabs Sound Effects', inputs: ['prompt-in'], outputs: ['audio-out'] },
      { label: 'SAM Audio Isolation', inputs: ['audio-in', 'video-in'], outputs: ['audio-out'] },
      { label: 'ElevenLabs Voiceover', inputs: ['prompt-in'], outputs: ['audio-out'] },
    ],
  },
  {
    section: 'Utilities',
    items: [
      { label: 'Response', inputs: ['any-in'], outputs: [] },
      { label: 'Layer Editor', inputs: ['image-in'], outputs: ['image-out'] },
      { label: 'Router', inputs: ['any-in'], outputs: ['out-1', 'out-2'] },
      { label: 'Comment', inputs: [], outputs: [] },
      { label: 'Adapted Prompt', inputs: ['prompt-in'], outputs: ['prompt-out'] },
    ],
  },
];

export const HANDLE_DOT_COLORS = {
  'image-in': '#ec4899', 'image-out': '#ec4899', 'image': '#ec4899',
  'video-in': '#14b8a6', 'video-out': '#14b8a6', 'video / audio': '#14b8a6',
  'audio-in': '#a855f7', 'audio-out': '#a855f7', 'audio': '#a855f7',
  'prompt-in': '#f97316', 'prompt-out': '#f97316', 'text-out': '#f97316', 'text': '#f97316',
  'analysis-out': '#f97316',
  'any-in': '#8b5cf6', 'out-1': '#8b5cf6', 'out-2': '#8b5cf6',
};

export function getHandleDot(handle) {
  return HANDLE_DOT_COLORS[handle] || '#888';
}
