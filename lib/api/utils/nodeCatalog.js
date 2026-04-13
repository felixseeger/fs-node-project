/**
 * Node Catalog
 * Centralized definition of all available nodes in the AI Pipeline Editor.
 * This catalog is used for:
 * - UI node menu
 * - AI workflow generation (matching intent to nodes)
 * - Chat assistant context
 */

export const NODE_CATALOG = [
  // Input nodes
  { type: 'textNode', label: 'Text', category: 'input', keywords: ['text', 'prompt', 'input', 'description', 'write', 'content'] },
  { type: 'imageNode', label: 'Image', category: 'input', keywords: ['image', 'photo', 'picture', 'upload', 'visual'] },
  { type: 'assetNode', label: 'Asset', category: 'input', keywords: ['asset', 'collection', 'batch', 'multiple'] },
  
  // LLM nodes
  { type: 'imageAnalyzer', label: 'Claude Sonnet Vision', category: 'llm', keywords: ['analyze', 'vision', 'describe', 'claude', 'understand', 'interpret', 'ai analyze'] },
  { type: 'textLLM', label: 'Claude Sonnet 4', category: 'llm', keywords: ['chat', 'text', 'ai', 'claude', 'sonnet', 'llm', 'generate text'] },
  { type: 'imageToPrompt', label: 'Image to Prompt', category: 'llm', keywords: ['reverse', 'prompt from image', 'describe image', 'caption'] },
  { type: 'improvePrompt', label: 'Improve Prompt', category: 'llm', keywords: ['enhance', 'improve', 'better prompt', 'refine', 'optimize'] },
  { type: 'aiImageClassifier', label: 'AI Image Classifier', category: 'llm', keywords: ['classify', 'categorize', 'label', 'tag', 'identify'] },
  
  // Image generation
  { type: 'simplifiedGenerator', label: 'Nano Banana 2 Pro', category: 'image-gen', keywords: ['generate', 'create image', 'make image', 'draw', 'nano banana', 'banana', 'image generation', 'simplified', 'pro'] },
  { type: 'generator', label: 'Nano Banana 2 Edit', category: 'image-gen', keywords: ['generate', 'create image', 'make image', 'draw', 'nano banana', 'banana', 'image generation'] },
  { type: 'generator', label: 'Kora Reality', category: 'image-gen', keywords: ['kora', 'realistic', 'photo real', 'hyperrealistic', 'reality'], generatorType: 'kora' },
  { type: 'fluxReimagine', label: 'Flux Reimagine', category: 'image-gen', keywords: ['flux', 'reimagine', 'variation', 'alternative', 'remix'] },
  { type: 'textToIcon', label: 'AI Icon Generation', category: 'image-gen', keywords: ['icon', 'logo', 'symbol', 'svg', 'app icon'] },
  
  // Image editing
  { type: 'changeCamera', label: 'Change Camera', category: 'image-edit', keywords: ['camera', 'angle', 'perspective', 'rotate', 'viewpoint', 'zoom'] },
  { type: 'creativeUpscale', label: 'Creative Upscale', category: 'image-edit', keywords: ['upscale', 'enhance', 'increase resolution', 'high res', 'sharpen', 'creative upscale'] },
  { type: 'precisionUpscale', label: 'Precision Upscale', category: 'image-edit', keywords: ['upscale', 'resolution', 'precision', 'quality', 'detailed'] },
  { type: 'fluxImageExpand', label: 'Flux Image Expand', category: 'image-edit', keywords: ['expand', 'outpaint', 'extend', 'widen', 'uncrop', 'flux'] },
  { type: 'ideogramExpand', label: 'Ideogram Expand', category: 'image-edit', keywords: ['expand', 'outpaint', 'extend', 'ideogram'] },
  { type: 'seedreamExpand', label: 'Seedream Expand', category: 'image-edit', keywords: ['expand', 'outpaint', 'extend', 'seedream'] },
  { type: 'ideogramInpaint', label: 'Ideogram Inpaint', category: 'image-edit', keywords: ['inpaint', 'fill', 'remove object', 'add object', 'mask', 'edit'] },
  { type: 'relight', label: 'Relight', category: 'image-edit', keywords: ['light', 'lighting', 'brightness', 'shadow', 'exposure', 'relight'] },
  { type: 'removeBackground', label: 'Remove Background', category: 'image-edit', keywords: ['remove bg', 'transparent', 'cutout', 'background removal', 'isolate'] },
  { type: 'skinEnhancer', label: 'Skin Enhancer', category: 'image-edit', keywords: ['skin', 'portrait', 'face', 'beauty', 'smooth skin', 'enhance face'] },
  { type: 'styleTransfer', label: 'Style Transfer', category: 'image-edit', keywords: ['style', 'art style', 'painting style', 'transfer', 'artistic'] },
  
  // Video generation
  { type: 'kling3', label: 'Kling 3 Video', category: 'video-gen', keywords: ['video', 'animate', 'motion', 'kling', 'kling 3', 'video generation'] },
  { type: 'kling3Omni', label: 'Kling 3 Omni', category: 'video-gen', keywords: ['video', 'omni', 'kling', 'audio', 'sound'] },
  { type: 'kling3Motion', label: 'Kling 3 Motion Control', category: 'video-gen', keywords: ['motion control', 'camera movement', 'tracking', 'kling'] },
  { type: 'klingElementsPro', label: 'Kling Elements Pro', category: 'video-gen', keywords: ['video', 'elements', 'kling pro'] },
  { type: 'klingO1', label: 'Kling O1', category: 'video-gen', keywords: ['video', 'kling o1', 'kling one'] },
  { type: 'minimaxLive', label: 'MiniMax Video 01 Live', category: 'video-gen', keywords: ['video', 'minimax', 'live', 'streaming'] },
  { type: 'wan26', label: 'WAN 2.6 Video', category: 'video-gen', keywords: ['video', 'wan', 'wan 2.6'] },
  { type: 'seedance', label: 'Seedance 1.5 Pro', category: 'video-gen', keywords: ['video', 'seedance', 'dance', 'motion'] },
  { type: 'ltxVideo2Pro', label: 'LTX Video 2.0 Pro', category: 'video-gen', keywords: ['video', 'ltx', 'ltx 2'] },
  { type: 'runwayGen45', label: 'Runway Gen 4.5', category: 'video-gen', keywords: ['video', 'runway', 'runway gen 4'] },
  { type: 'runwayGen4Turbo', label: 'Runway Gen4 Turbo', category: 'video-gen', keywords: ['video', 'runway turbo', 'fast video'] },
  { type: 'runwayActTwo', label: 'Runway Act Two', category: 'video-gen', keywords: ['video', 'act two', 'character', 'performance'] },
  { type: 'pixVerseV5', label: 'PixVerse V5', category: 'video-gen', keywords: ['video', 'pixverse', 'pix verse'] },
  { type: 'pixVerseV5Transition', label: 'PixVerse V5 Transition', category: 'video-gen', keywords: ['video', 'transition', 'morph', 'between images'] },
  { type: 'omniHuman', label: 'OmniHuman 1.5', category: 'video-gen', keywords: ['video', 'omnihuman', 'avatar', 'talking head', 'lip sync'] },
  
  // Video editing
  { type: 'vfx', label: 'Video FX', category: 'video-edit', keywords: ['vfx', 'effect', 'filter', 'video effect', 'bloom', 'motion'] },
  { type: 'creativeVideoUpscale', label: 'Creative Video Upscale', category: 'video-edit', keywords: ['video upscale', 'enhance video', 'video quality'] },
  { type: 'precisionVideoUpscale', label: 'Precision Video Upscale', category: 'video-edit', keywords: ['video upscale', 'precision', 'video enhancement'] },
  
  // Audio
  { type: 'strudelNode', label: 'Strudel Sound Generation', category: 'audio', keywords: ['strudel', 'tidal cycles', 'live coding', 'music', 'sound', 'pattern'] },
  { type: 'musicGeneration', label: 'ElevenLabs Music', category: 'audio', keywords: ['music', 'song', 'audio', 'generate music', 'elevenlabs'] },
  { type: 'soundEffects', label: 'ElevenLabs Sound Effects', category: 'audio', keywords: ['sound', 'sfx', 'effect', 'audio effect'] },
  { type: 'audioIsolation', label: 'SAM Audio Isolation', category: 'audio', keywords: ['isolate', 'remove vocals', 'extract audio', 'stems'] },
  { type: 'voiceover', label: 'ElevenLabs Voiceover', category: 'audio', keywords: ['voice', 'narration', 'tts', 'text to speech', 'voiceover'] },
  
  // Utilities
  { type: 'layerEditor', label: 'Layer Editor', category: 'utility', keywords: ['layer', 'composite', 'combine', 'merge', 'blend'] },
  { type: 'routerNode', label: 'Router', category: 'utility', keywords: ['route', 'branch', 'split', 'distribute', 'fan out'] },
  { type: 'comment', label: 'Comment', category: 'utility', keywords: ['comment', 'note', 'annotation', 'label'] },
];

/**
 * Returns a concise summary of the node catalog for inclusion in AI system prompts.
 */
export function getNodeCatalogSummary() {
  return NODE_CATALOG.map(n => `- ${n.type}: ${n.label} (${n.category}) - Keywords: ${n.keywords.join(', ')}`).join('\n');
}
