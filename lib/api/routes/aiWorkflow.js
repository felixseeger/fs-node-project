/**
 * AI Workflow Generation API
 * Processes natural language prompts and generates workflow node structures
 */

import { Router } from 'express';
import { generationLimiter } from '../middleware/rateLimiter.js';
import generateQueue from '../queue/index.js';
import { v4 as uuidv4 } from 'uuid';
import { anthropic, formatImagesForClaude } from '../services/anthropic.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FRONTEND_PUBLIC = join(__dirname, '../../../frontend/public');

const router = Router();

// Node type definitions with metadata for AI matching
const NODE_CATALOG = [
  // Input nodes
  { type: 'textNode', label: 'Text', category: 'input', keywords: ['text', 'prompt', 'input', 'description', 'write', 'content'] },
  { type: 'imageNode', label: 'Image', category: 'input', keywords: ['image', 'photo', 'picture', 'upload', 'visual'] },
  { type: 'assetNode', label: 'Asset', category: 'input', keywords: ['asset', 'collection', 'batch', 'multiple'] },
  
  // LLM nodes
  { type: 'imageAnalyzer', label: 'Claude Sonnet Vision', category: 'llm', keywords: ['analyze', 'vision', 'describe', 'claude', 'understand', 'interpret', 'ai analyze'] },
  { type: 'imageToPrompt', label: 'Image to Prompt', category: 'llm', keywords: ['reverse', 'prompt from image', 'describe image', 'caption'] },
  { type: 'improvePrompt', label: 'Improve Prompt', category: 'llm', keywords: ['enhance', 'improve', 'better prompt', 'refine', 'optimize'] },
  { type: 'aiImageClassifier', label: 'AI Image Classifier', category: 'llm', keywords: ['classify', 'categorize', 'label', 'tag', 'identify'] },
  
  // Image generation
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
  { type: 'musicGeneration', label: 'ElevenLabs Music', category: 'audio', keywords: ['music', 'song', 'audio', 'generate music', 'elevenlabs'] },
  { type: 'soundEffects', label: 'ElevenLabs Sound Effects', category: 'audio', keywords: ['sound', 'sfx', 'effect', 'audio effect'] },
  { type: 'audioIsolation', label: 'SAM Audio Isolation', category: 'audio', keywords: ['isolate', 'remove vocals', 'extract audio', 'stems'] },
  { type: 'voiceover', label: 'ElevenLabs Voiceover', category: 'audio', keywords: ['voice', 'narration', 'tts', 'text to speech', 'voiceover'] },
  
  // Utilities
  { type: 'layerEditor', label: 'Layer Editor', category: 'utility', keywords: ['layer', 'composite', 'combine', 'merge', 'blend'] },
  { type: 'routerNode', label: 'Router', category: 'utility', keywords: ['route', 'branch', 'split', 'distribute', 'fan out'] },
  { type: 'comment', label: 'Comment', category: 'utility', keywords: ['comment', 'note', 'annotation', 'label'] },
];

// Workflow patterns for common use cases
const WORKFLOW_PATTERNS = [
  {
    name: 'Image Generation Pipeline',
    match: (intent) => intent.categories.includes('image-gen') && !intent.categories.includes('video'),
    nodes: (intent) => [
      { type: 'inputNode', label: 'Request - Inputs', data: { initialFields: ['prompt', 'aspect_ratio'] } },
      { type: 'generator', label: intent.preferredNode?.label || 'Nano Banana 2 Edit' },
      { type: 'response', label: 'Response · Output' },
    ],
  },
  {
    name: 'Image to Video',
    match: (intent) => intent.categories.includes('image-gen') && intent.categories.includes('video-gen'),
    nodes: (intent) => [
      { type: 'inputNode', label: 'Request - Inputs', data: { initialFields: ['prompt', 'image_urls'] } },
      { type: intent.preferredNode?.type || 'kling3', label: intent.preferredNode?.label || 'Kling 3 Video' },
      { type: 'response', label: 'Response · Output' },
    ],
  },
  {
    name: 'Image Analysis Pipeline',
    match: (intent) => intent.categories.includes('llm') && intent.keywords.some(k => ['analyze', 'vision', 'describe'].includes(k)),
    nodes: (intent) => [
      { type: 'inputNode', label: 'Request - Inputs', data: { initialFields: ['image_urls'] } },
      { type: 'imageAnalyzer', label: 'Claude Sonnet Vision' },
      { type: 'response', label: 'Response · Output' },
    ],
  },
  {
    name: 'Video Generation Pipeline',
    match: (intent) => intent.categories.includes('video-gen') && !intent.categories.includes('image-edit'),
    nodes: (intent) => [
      { type: 'inputNode', label: 'Request - Inputs', data: { initialFields: ['prompt', 'image_urls'] } },
      { type: intent.preferredNode?.type || 'kling3', label: intent.preferredNode?.label || 'Kling 3 Video' },
      { type: 'response', label: 'Response · Output' },
    ],
  },
  {
    name: 'Image Enhancement Pipeline',
    match: (intent) => intent.categories.includes('image-edit') && intent.keywords.some(k => ['upscale', 'enhance', 'improve', 'quality'].includes(k)),
    nodes: (intent) => [
      { type: 'inputNode', label: 'Request - Inputs', data: { initialFields: ['image_urls'] } },
      { type: intent.preferredNode?.type || 'creativeUpscale', label: intent.preferredNode?.label || 'Creative Upscale' },
      { type: 'response', label: 'Response · Output' },
    ],
  },
  {
    name: 'Audio Generation Pipeline',
    match: (intent) => intent.categories.includes('audio') && !intent.categories.includes('video'),
    nodes: (intent) => [
      { type: 'inputNode', label: 'Request - Inputs', data: { initialFields: ['prompt'] } },
      { type: intent.preferredNode?.type || 'musicGeneration', label: intent.preferredNode?.label || 'ElevenLabs Music' },
      { type: 'response', label: 'Response · Output' },
    ],
  },
  {
    name: 'Prompt Enhancement Pipeline',
    match: (intent) => intent.keywords.some(k => ['improve', 'enhance', 'better', 'refine'].includes(k)) && intent.keywords.includes('prompt'),
    nodes: (intent) => [
      { type: 'inputNode', label: 'Request - Inputs', data: { initialFields: ['prompt'] } },
      { type: 'improvePrompt', label: 'Improve Prompt' },
      { type: 'generator', label: 'Nano Banana 2 Edit' },
      { type: 'response', label: 'Response · Output' },
    ],
  },
  {
    name: 'Multi-Stage Creative Pipeline',
    match: (intent) => intent.complexity > 3 || intent.keywords.length > 5,
    nodes: (intent) => {
      const nodes = [
        { type: 'inputNode', label: 'Request - Inputs', data: { initialFields: ['prompt', 'image_urls'] } },
      ];
      
      // Add prompt improvement if creative
      if (intent.keywords.some(k => ['creative', 'artistic', 'beautiful', 'stunning'].includes(k))) {
        nodes.push({ type: 'improvePrompt', label: 'Improve Prompt' });
      }
      
      // Add generation node
      if (intent.preferredNode) {
        nodes.push({ type: intent.preferredNode.type, label: intent.preferredNode.label });
      } else if (intent.categories.includes('image-gen')) {
        nodes.push({ type: 'generator', label: 'Nano Banana 2 Edit' });
      }
      
      // Add enhancement if requested
      if (intent.keywords.some(k => ['upscale', 'enhance', 'high quality'].includes(k))) {
        nodes.push({ type: 'creativeUpscale', label: 'Creative Upscale' });
      }
      
      nodes.push({ type: 'response', label: 'Response · Output' });
      return nodes;
    },
  },
];

/**
 * Extract intent from natural language prompt
 */
function extractIntent(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  const words = lowerPrompt.split(/\s+/);
  
  const matchedKeywords = [];
  const matchedCategories = new Set();
  let bestNode = null;
  let bestScore = 0;
  
  // Match against node catalog
  for (const node of NODE_CATALOG) {
    let score = 0;
    for (const keyword of node.keywords) {
      if (lowerPrompt.includes(keyword.toLowerCase())) {
        score += 1;
        if (!matchedKeywords.includes(keyword)) {
          matchedKeywords.push(keyword);
        }
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestNode = node;
    }
    
    if (score > 0) {
      matchedCategories.add(node.category);
    }
  }
  
  // Calculate complexity
  const complexity = words.length > 20 ? 3 : words.length > 10 ? 2 : 1;
  
  return {
    keywords: matchedKeywords,
    categories: Array.from(matchedCategories),
    preferredNode: bestNode,
    complexity,
    originalPrompt: prompt,
  };
}

/**
 * Generate workflow node list using Claude
 * Falls back to rule-based extractIntent + WORKFLOW_PATTERNS on any failure
 */
async function generateWorkflowWithClaude(prompt, mode, images = []) {
  const model = mode === 'pro' ? 'claude-sonnet-4-20250514' : 'claude-sonnet-4-20250514';

  const nodeList = NODE_CATALOG.map(n => `  - type: "${n.type}", label: "${n.label}", category: ${n.category}`).join('\n');

  const systemPrompt = `You are a workflow architect for an AI pipeline builder. Given a user description, you design a workflow by choosing the right nodes from the catalog below.

AVAILABLE NODES (processing nodes only — do NOT include inputNode or response):
${nodeList}

RULES:
1. Output ONLY a JSON object — no explanation, no markdown, no code fences.
2. The JSON must have exactly two keys:
   - "name": a short, descriptive workflow name (max 5 words)
   - "nodes": an array of 1–4 node objects, each with "type" and "label" matching the catalog exactly
3. Do NOT include inputNode or response in your nodes array — they are added automatically.
4. Pick nodes that logically address the user's request. Order them as a pipeline (left to right).
5. Use the exact "type" and "label" values from the catalog — do not invent new ones.

EXAMPLE OUTPUT:
{"name":"Virtual Try-On Pipeline","nodes":[{"type":"imageAnalyzer","label":"Claude Sonnet Vision"},{"type":"generator","label":"Nano Banana 2 Edit"}]}`;

  const response = await generateQueue.add(() =>
    anthropic().messages.create({
      model,
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: 'user', content: images && images.length > 0 ? [...formatImagesForClaude(images), { type: 'text', text: prompt }] : prompt }],
    })
  );
  const raw = response.content.filter(b => b.type === 'text').map(b => b.text).join('').trim();

  // Strip accidental markdown fences if present
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const parsed = JSON.parse(jsonStr);

  if (!parsed.name || !Array.isArray(parsed.nodes) || parsed.nodes.length === 0) {
    throw new Error('Invalid Claude response shape');
  }

  // Build full node definition list (inputNode first, response last)
  const nodeDefinitions = [
    { type: 'inputNode', label: 'Request - Inputs' },
    ...parsed.nodes,
    { type: 'response', label: 'Response · Output' },
  ];

  return { name: parsed.name, nodeDefinitions };
}

// ─── Handle maps (sourced from node component <Handle> elements) ─────────────

// Primary source handle per node type
const SOURCE_HANDLE = {
  inputNode: null,          // dynamic — set per-field below
  textNode: 'text-out',
  imageNode: 'image-out',
  assetNode: 'image-out',
  generator: 'output',
  fluxReimagine: 'output',
  textToIcon: 'output',
  imageAnalyzer: 'image-out',
  imageToPrompt: 'prompt-out',
  improvePrompt: 'prompt-out',
  aiImageClassifier: 'output',
  creativeUpscale: 'output',
  precisionUpscale: 'output',
  removeBackground: 'output',
  styleTransfer: 'output',
  relight: 'output',
  changeCamera: 'output',
  fluxImageExpand: 'output',
  ideogramExpand: 'output',
  seedreamExpand: 'output',
  ideogramInpaint: 'output',
  skinEnhancer: 'output',
  kling3: 'output',
  kling3Omni: 'output',
  kling3Motion: 'output',
  klingElementsPro: 'output',
  klingO1: 'output',
  minimaxLive: 'output',
  wan26: 'output',
  seedance: 'output',
  ltxVideo2Pro: 'output',
  runwayGen45: 'output',
  runwayGen4Turbo: 'output',
  runwayActTwo: 'output',
  pixVerseV5: 'output',
  pixVerseV5Transition: 'output',
  omniHuman: 'output',
  vfx: 'output',
  creativeVideoUpscale: 'output',
  precisionVideoUpscale: 'output',
  musicGeneration: 'output-audio',
  soundEffects: 'output-audio',
  audioIsolation: 'output-audio',
  voiceover: 'output-audio',
};

// Primary target handle per node type (what it accepts as main input)
const TARGET_HANDLE = {
  generator: 'prompt-in',
  fluxReimagine: 'image-in',
  textToIcon: 'prompt-in',
  imageAnalyzer: 'image-in',
  imageToPrompt: 'image-in',
  improvePrompt: 'prompt-in',
  aiImageClassifier: 'image-in',
  creativeUpscale: 'image-in',
  precisionUpscale: 'image-in',
  removeBackground: 'image-in',
  styleTransfer: 'image-in',
  relight: 'image-in',
  changeCamera: 'image-in',
  fluxImageExpand: 'image-in',
  ideogramExpand: 'image-in',
  seedreamExpand: 'image-in',
  ideogramInpaint: 'image-in',
  skinEnhancer: 'image-in',
  kling3: 'image-in',
  kling3Omni: 'image-in',
  kling3Motion: 'image-in',
  klingElementsPro: 'image-in',
  klingO1: 'image-in',
  minimaxLive: 'image-in',
  wan26: 'image-in',
  seedance: 'image-in',
  ltxVideo2Pro: 'image-in',
  runwayGen45: 'image-in',
  runwayGen4Turbo: 'image-in',
  runwayActTwo: 'image-in',
  pixVerseV5: 'image-in',
  pixVerseV5Transition: 'image-in',
  omniHuman: 'image-in',
  vfx: 'video-in',
  creativeVideoUpscale: 'video-in',
  precisionVideoUpscale: 'video-in',
  musicGeneration: 'prompt-in',
  soundEffects: 'prompt-in',
  audioIsolation: 'audio-in',
  voiceover: 'prompt-in',
  response: 'images-in',
};

// Which inputNode field to wire to a given node type, and what target handle to use
const INPUT_FIELD_FOR_NODE = {
  generator: { field: 'prompt', targetHandle: 'prompt-in' },
  fluxReimagine: { field: 'image_urls', targetHandle: 'image-in' },
  textToIcon: { field: 'prompt', targetHandle: 'prompt-in' },
  imageAnalyzer: { field: 'image_urls', targetHandle: 'image-in' },
  imageToPrompt: { field: 'image_urls', targetHandle: 'image-in' },
  improvePrompt: { field: 'prompt', targetHandle: 'prompt-in' },
  aiImageClassifier: { field: 'image_urls', targetHandle: 'image-in' },
  creativeUpscale: { field: 'image_urls', targetHandle: 'image-in' },
  precisionUpscale: { field: 'image_urls', targetHandle: 'image-in' },
  removeBackground: { field: 'image_urls', targetHandle: 'image-in' },
  styleTransfer: { field: 'image_urls', targetHandle: 'image-in' },
  relight: { field: 'image_urls', targetHandle: 'image-in' },
  changeCamera: { field: 'image_urls', targetHandle: 'image-in' },
  fluxImageExpand: { field: 'image_urls', targetHandle: 'image-in' },
  ideogramExpand: { field: 'image_urls', targetHandle: 'image-in' },
  seedreamExpand: { field: 'image_urls', targetHandle: 'image-in' },
  ideogramInpaint: { field: 'image_urls', targetHandle: 'image-in' },
  skinEnhancer: { field: 'image_urls', targetHandle: 'image-in' },
  kling3: { field: 'image_urls', targetHandle: 'image-in' },
  kling3Omni: { field: 'image_urls', targetHandle: 'image-in' },
  kling3Motion: { field: 'image_urls', targetHandle: 'image-in' },
  klingElementsPro: { field: 'image_urls', targetHandle: 'image-in' },
  klingO1: { field: 'image_urls', targetHandle: 'image-in' },
  minimaxLive: { field: 'image_urls', targetHandle: 'image-in' },
  wan26: { field: 'image_urls', targetHandle: 'image-in' },
  seedance: { field: 'image_urls', targetHandle: 'image-in' },
  ltxVideo2Pro: { field: 'image_urls', targetHandle: 'image-in' },
  runwayGen45: { field: 'image_urls', targetHandle: 'image-in' },
  runwayGen4Turbo: { field: 'image_urls', targetHandle: 'image-in' },
  runwayActTwo: { field: 'image_urls', targetHandle: 'image-in' },
  pixVerseV5: { field: 'image_urls', targetHandle: 'image-in' },
  pixVerseV5Transition: { field: 'image_urls', targetHandle: 'image-in' },
  omniHuman: { field: 'image_urls', targetHandle: 'image-in' },
  musicGeneration: { field: 'prompt', targetHandle: 'prompt-in' },
  soundEffects: { field: 'prompt', targetHandle: 'prompt-in' },
  voiceover: { field: 'prompt', targetHandle: 'prompt-in' },
};

// ─── Node data defaults (mirrors frontend/src/config/nodeMenu.ts) ─────────────

const NODE_DATA_DEFAULTS = {
  textNode: { label: 'Text', text: '' },
  imageNode: { label: 'Image', images: [] },
  assetNode: { label: 'Asset', images: [] },
  imageAnalyzer: { label: 'Claude Sonnet Vision', systemDirections: '', localPrompt: '', analysisResult: '', localImages: [] },
  imageToPrompt: { label: 'Image to Prompt', inputImagePreview: null, outputPrompt: null, isLoading: false },
  improvePrompt: { label: 'Improve Prompt', inputPrompt: '', outputPrompt: null, isLoading: false, localType: 'image', localLanguage: 'en' },
  aiImageClassifier: { label: 'AI Image Classifier', inputImagePreview: null, outputText: null, rawResult: null, isLoading: false },
  generator: { label: 'Nano Banana 2 Edit', inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false },
  fluxReimagine: { label: 'Flux Reimagine', inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false, localImagination: 'vivid', localAspect: 'original' },
  textToIcon: { label: 'AI Icon Generation', inputPrompt: '', outputImage: null, isLoading: false, localStyle: 'solid', localFormat: 'png', localNumInferenceSteps: 10, localGuidanceScale: 7 },
  changeCamera: { label: 'Change Camera', inputImagePreview: null, outputImage: null, isLoading: false, localHorizontalAngle: 0, localVerticalAngle: 0, localZoom: 5, localSeed: '' },
  creativeUpscale: { label: 'Creative Upscale', inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false, localScaleFactor: '2x', localOptimizedFor: 'standard', localEngine: 'automatic', localCreativity: 0, localHdr: 0, localResemblance: 0, localFractality: 0 },
  precisionUpscale: { label: 'Precision Upscale', inputImagePreview: null, outputImage: null, isLoading: false, localScaleFactor: '4', localFlavor: '', localSharpen: 7, localSmartGrain: 7, localUltraDetail: 30 },
  fluxImageExpand: { label: 'Flux Image Expand', inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false, localLeft: 0, localRight: 0, localTop: 0, localBottom: 0 },
  ideogramExpand: { label: 'Ideogram Expand', inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false, localLeft: 0, localRight: 0, localTop: 0, localBottom: 0, localSeed: '' },
  seedreamExpand: { label: 'Seedream Expand', inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false, localLeft: 0, localRight: 0, localTop: 0, localBottom: 0, localSeed: '' },
  ideogramInpaint: { label: 'Ideogram Inpaint', inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false, localRenderingSpeed: 'DEFAULT', localMagicPrompt: '', localStyleType: '', localColorPalette: '', localSeed: '' },
  relight: { label: 'Relight', inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false, localLightMode: 'prompt', localStrength: 100 },
  removeBackground: { label: 'Remove Background', inputImagePreview: null, outputImage: null, isLoading: false },
  skinEnhancer: { label: 'Skin Enhancer', inputImagePreview: null, outputImage: null, isLoading: false, localMode: 'faithful', localSharpen: 0, localSmartGrain: 2, localSkinDetail: 80, localOptimizedFor: 'enhance_skin' },
  styleTransfer: { label: 'Style Transfer', inputImagePreview: null, referenceImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false, localStyleStrength: 100, localStructureStrength: 50, localIsPortrait: false, localFlavor: 'faithful', localEngine: 'balanced', localFixedGen: false },
  kling3: { label: 'Kling 3 Video', inputImagePreview: null, inputPrompt: '', inputNegativePrompt: '', outputVideo: null, isLoading: false, localModel: 'std', localDuration: 5, localAspectRatio: '16:9', localCfgScale: 0.5 },
  kling3Omni: { label: 'Kling 3 Omni', inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false, localModel: 'std', localDuration: 5, localAspectRatio: '16:9', localCfgScale: 0.5, localGenerateAudio: false },
  kling3Motion: { label: 'Kling 3 Motion Control', inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false, localModel: 'std', localCfgScale: 0.5 },
  klingElementsPro: { label: 'Kling Elements Pro', inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false, localDuration: '5', localAspectRatio: 'widescreen_16_9' },
  klingO1: { label: 'Kling O1', inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false, localModel: 'std', localDuration: 5, localAspectRatio: '16:9' },
  minimaxLive: { label: 'MiniMax Video 01 Live', inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false, localCameraMovement: '', localPromptOptimizer: true },
  wan26: { label: 'WAN 2.6 Video', inputImagePreview: null, inputPrompt: '', inputNegativePrompt: '', outputVideo: null, isLoading: false, localResolution: '720p', localDuration: '5', localRatio: '16:9' },
  seedance: { label: 'Seedance 1.5 Pro', inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false, localResolution: '720p', localDuration: 5, localAspectRatio: 'widescreen_16_9', localGenerateAudio: true },
  ltxVideo2Pro: { label: 'LTX Video 2.0 Pro', inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false, localResolution: '1080p', localDuration: 6, localFps: 25, localGenerateAudio: false, localSeed: 0 },
  runwayGen45: { label: 'Runway Gen 4.5', inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false, localRatio: '1280:720', localDuration: 5, localSeed: 0 },
  runwayGen4Turbo: { label: 'Runway Gen4 Turbo', inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false, localRatio: '1280:720', localDuration: 10, localSeed: 0 },
  runwayActTwo: { label: 'Runway Act Two', localCharacter: null, localReference: null, outputVideo: null, isLoading: false, localRatio: '1280:720', localBodyControl: true, localExpressionIntensity: 3, localSeed: 0 },
  pixVerseV5: { label: 'PixVerse V5', inputImagePreview: null, inputPrompt: '', outputVideo: null, isLoading: false, localResolution: '720p', localRatio: '16:9', localMotionIntensity: 5, localSeed: -1 },
  pixVerseV5Transition: { label: 'PixVerse V5 Transition', localStartImage: null, localEndImage: null, inputPrompt: '', outputVideo: null, isLoading: false, localResolution: '720p', localDuration: 5, localSeed: -1 },
  omniHuman: { label: 'OmniHuman 1.5', inputImagePreview: null, inputAudioUrl: '', inputPrompt: '', outputVideo: null, isLoading: false, localResolution: '1080p', localTurboMode: false },
  vfx: { label: 'Video FX', outputVideo: null, isLoading: false, localFilterType: 1, localFps: 24 },
  creativeVideoUpscale: { label: 'Creative Video Upscale', outputVideo: null, isLoading: false, localMode: 'standard', localResolution: '2k', localFlavor: 'vivid', localCreativity: 0 },
  precisionVideoUpscale: { label: 'Precision Video Upscale', outputVideo: null, isLoading: false, localResolution: '2k', localStrength: 60 },
  musicGeneration: { label: 'ElevenLabs Music', inputPrompt: '', outputAudio: null, isLoading: false, localDuration: 30 },
  soundEffects: { label: 'ElevenLabs Sound Effects', inputPrompt: '', outputAudio: null, isLoading: false, localDuration: 5, localLoop: false, localPromptInfluence: 0.3 },
  audioIsolation: { label: 'SAM Audio Isolation', inputPrompt: '', localAudio: '', localVideo: '', outputAudio: null, isLoading: false, localInputType: 'audio' },
  voiceover: { label: 'ElevenLabs Voiceover', inputPrompt: '', outputAudio: null, isLoading: false, localVoiceId: '21m00Tcm4TlvDq8ikWAM', localStability: 0.5, localSimilarityBoost: 0.2, localSpeed: 1.0 },
  response: { label: 'Response · Output' },
};

function getNodeData(node) {
  const defaults = NODE_DATA_DEFAULTS[node.type] || {};
  // Caller-supplied label wins; use catalog label or type as fallback
  const label = node.label || defaults.label || node.type;
  // For generator nodes, propagate the variant label so the right model is used
  const extra = node.type === 'generator' && node.label !== defaults.label
    ? { generatorType: node.label === 'Kora Reality' ? 'kora' : undefined }
    : {};
  return { ...defaults, ...extra, label };
}

/**
 * Build the hardcoded Virtual Try-On demo workflow with pre-loaded images
 */
function buildVirtualTryOnWorkflow() {
  // Read images and encode as base64 data URIs
  let clothingData = null;
  let modelData = null;
  try {
    const clothingBuf = readFileSync(join(FRONTEND_PUBLIC, 'clothing.jpg'));
    clothingData = `data:image/jpeg;base64,${clothingBuf.toString('base64')}`;
    const modelBuf = readFileSync(join(FRONTEND_PUBLIC, 'tryon-model.jpg'));
    modelData = `data:image/jpeg;base64,${modelBuf.toString('base64')}`;
  } catch (e) {
    console.warn('[VirtualTryOn] Could not read reference images:', e.message);
  }

  const nodeWidth = 250;
  const hGap = 100;

  const clothingId = uuidv4();
  const modelId = uuidv4();
  const visionId = uuidv4();
  const haikuId = uuidv4();
  const generatorId = uuidv4();
  const responseId = uuidv4();

  const nodes = [
    {
      id: clothingId,
      type: 'imageNode',
      position: { x: 50, y: 60 },
      data: {
        label: 'Clothing Input',
        images: clothingData ? [clothingData] : [],
      },
    },
    {
      id: modelId,
      type: 'imageNode',
      position: { x: 50, y: 280 },
      data: {
        label: 'Model Input',
        images: modelData ? [modelData] : [],
      },
    },
    {
      id: visionId,
      type: 'imageAnalyzer',
      position: { x: 50 + nodeWidth + hGap, y: 60 },
      data: {
        ...NODE_DATA_DEFAULTS.imageAnalyzer,
        label: 'Claude Vision',
        systemDirections: 'Analyze the clothing item in detail. Describe the style, color, fabric texture, cut, and key design elements.',
        localPrompt: 'Describe this clothing item for virtual try-on.',
      },
    },
    {
      id: haikuId,
      type: 'imageAnalyzer',
      position: { x: 50 + nodeWidth + hGap, y: 280 },
      data: {
        ...NODE_DATA_DEFAULTS.imageAnalyzer,
        label: 'Claude Haiku 4.5',
        systemDirections: 'Combine clothing and model descriptions into a detailed image generation prompt for a virtual try-on image.',
        localPrompt: 'Describe the model\'s body type and pose for virtual try-on.',
      },
    },
    {
      id: generatorId,
      type: 'generator',
      position: { x: 50 + (nodeWidth + hGap) * 2, y: 170 },
      data: {
        ...NODE_DATA_DEFAULTS.generator,
        label: 'Nano Banana 2',
        localAspectRatio: '1:1',
      },
    },
    {
      id: responseId,
      type: 'response',
      position: { x: 50 + (nodeWidth + hGap) * 3, y: 170 },
      data: { label: 'Response · Output' },
    },
  ];

  const edges = [
    // Clothing → Claude Vision
    { id: `e-${clothingId}-${visionId}`, source: clothingId, target: visionId, sourceHandle: 'image-out', targetHandle: 'image-in', animated: true },
    // Model → Claude Haiku
    { id: `e-${modelId}-${haikuId}`, source: modelId, target: haikuId, sourceHandle: 'image-out', targetHandle: 'image-in', animated: true },
    // Claude Vision → Generator (analysis text → prompt)
    { id: `e-${visionId}-${generatorId}`, source: visionId, target: generatorId, sourceHandle: 'analysis-out', targetHandle: 'prompt-in', animated: true },
    // Claude Haiku → Generator (analysis text → prompt)
    { id: `e-${haikuId}-${generatorId}`, source: haikuId, target: generatorId, sourceHandle: 'analysis-out', targetHandle: 'prompt-in', animated: true },
    // Generator → Response
    { id: `e-${generatorId}-${responseId}`, source: generatorId, target: responseId, sourceHandle: 'output', targetHandle: 'images-in', animated: true },
  ];

  return { name: 'Virtual Try-On Pipeline', nodes, edges };
}

/**
 * Returns true if the prompt is asking for a virtual try-on workflow
 */
function isVirtualTryOnPrompt(prompt) {
  const lower = prompt.toLowerCase();
  return (
    lower.includes('try-on') ||
    lower.includes('try on') ||
    lower.includes('tryon') ||
    (lower.includes('clothing') && lower.includes('model')) ||
    (lower.includes('outfit') && lower.includes('wear')) ||
    (lower.includes('fashion') && lower.includes('model'))
  );
}

/**
 * Auto-layout algorithm for positioning nodes
 * Uses a simple left-to-right linear layout
 */
function autoLayoutNodes(nodes, options = {}) {
  const {
    startX = 50,
    startY = 100,
    nodeWidth = 250,
    horizontalGap = 100,
  } = options;

  const positionedNodes = [];
  const inputNodes = nodes.filter(n => n.type === 'inputNode');
  const outputNodes = nodes.filter(n => n.type === 'response');
  const processingNodes = nodes.filter(n => n.type !== 'inputNode' && n.type !== 'response');

  // Determine inputNode fields based on first processing node
  const firstProcessing = processingNodes[0];
  const inputFieldInfo = firstProcessing ? (INPUT_FIELD_FOR_NODE[firstProcessing.type] || { field: 'prompt' }) : { field: 'prompt' };
  const initialFields = inputFieldInfo.field === 'image_urls'
    ? ['image_urls']
    : ['prompt', 'aspect_ratio'];

  let x = startX;

  for (const node of inputNodes) {
    positionedNodes.push({
      ...node,
      id: node.id || uuidv4(),
      position: { x, y: startY },
      data: { label: node.label || 'Request - Inputs', initialFields },
    });
    x += nodeWidth + horizontalGap * 2;
  }

  for (const node of processingNodes) {
    positionedNodes.push({
      ...node,
      id: node.id || uuidv4(),
      position: { x, y: startY },
      data: getNodeData(node),
    });
    x += nodeWidth + horizontalGap;
  }

  for (const node of outputNodes) {
    positionedNodes.push({
      ...node,
      id: node.id || uuidv4(),
      position: { x, y: startY },
      data: { label: node.label || 'Response · Output' },
    });
  }

  return positionedNodes;
}

/**
 * Generate edges connecting nodes in sequence with correct handle names
 */
function generateEdges(nodes) {
  const edges = [];
  const processingNodes = nodes.filter(n => n.type !== 'inputNode' && n.type !== 'response');
  const inputNode = nodes.find(n => n.type === 'inputNode');
  const outputNode = nodes.find(n => n.type === 'response');

  // inputNode → first processing node
  if (inputNode && processingNodes.length > 0) {
    const first = processingNodes[0];
    const fieldInfo = INPUT_FIELD_FOR_NODE[first.type] || { field: 'prompt', targetHandle: 'prompt-in' };
    edges.push({
      id: `e-${inputNode.id}-${first.id}`,
      source: inputNode.id,
      target: first.id,
      sourceHandle: fieldInfo.field,
      targetHandle: fieldInfo.targetHandle || TARGET_HANDLE[first.type] || 'image-in',
      animated: true,
    });
  }

  // processing node → next processing node
  for (let i = 0; i < processingNodes.length - 1; i++) {
    const src = processingNodes[i];
    const tgt = processingNodes[i + 1];
    edges.push({
      id: `e-${src.id}-${tgt.id}`,
      source: src.id,
      target: tgt.id,
      sourceHandle: SOURCE_HANDLE[src.type] || 'output',
      targetHandle: TARGET_HANDLE[tgt.type] || 'image-in',
      animated: true,
    });
  }

  // last processing node → response
  if (outputNode && processingNodes.length > 0) {
    const last = processingNodes[processingNodes.length - 1];
    edges.push({
      id: `e-${last.id}-${outputNode.id}`,
      source: last.id,
      target: outputNode.id,
      sourceHandle: SOURCE_HANDLE[last.type] || 'output',
      targetHandle: 'images-in',
      animated: true,
    });
  }

  return edges;
}

/**
 * POST /api/ai-workflow/generate
 * Generate a workflow from natural language prompt
 */
router.post('/ai-workflow/generate', generationLimiter, async (req, res) => {
  try {
    const { prompt, mode = 'standard', images = [] } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid prompt',
        message: 'Please provide a valid natural language prompt',
      });
    }
    
    console.log('[AI Workflow] Generating workflow for:', prompt);

    // Step 1: Check for virtual try-on shortcut
    let nodes, edges, workflowName;

    if (isVirtualTryOnPrompt(prompt)) {
      console.log('[AI Workflow] Detected virtual try-on prompt — using demo workflow');
      const tryOn = buildVirtualTryOnWorkflow();
      nodes = tryOn.nodes;
      edges = tryOn.edges;
      workflowName = tryOn.name;
    } else {
      // Try Claude-powered generation, fall back to rule-based on failure
      let nodeDefinitions;
      try {
        const result = await generateWorkflowWithClaude(prompt, mode, images);
        workflowName = result.name;
        nodeDefinitions = result.nodeDefinitions;
        console.log('[AI Workflow] Claude generated:', workflowName, '—', nodeDefinitions.length, 'nodes');
      } catch (claudeErr) {
        console.warn('[AI Workflow] Claude failed, using rule-based fallback:', claudeErr.message);
        const intent = extractIntent(prompt);
        const matchedPattern = WORKFLOW_PATTERNS.find(p => p.match(intent)) || WORKFLOW_PATTERNS[0];
        workflowName = matchedPattern.name;
        nodeDefinitions = matchedPattern.nodes(intent);
      }
      nodes = autoLayoutNodes(nodeDefinitions, { startX: 50, startY: 100 });
      edges = generateEdges(nodes);
    }

    // Step 4: Build response
    const workflow = {
      id: `ai-wf-${Date.now()}`,
      name: workflowName,
      description: `AI-generated workflow: "${prompt}"`,
      nodes,
      edges,
      metadata: {
        generatedAt: new Date().toISOString(),
        prompt,
        mode,
      },
    };
    
    console.log('[AI Workflow] Generated workflow with', nodes.length, 'nodes and', edges.length, 'edges');
    
    res.json({
      success: true,
      workflow,
    });
    
  } catch (error) {
    console.error('[AI Workflow] Error generating workflow:', error);
    res.status(500).json({
      error: 'Failed to generate workflow',
      message: error.message,
    });
  }
});

/**
 * POST /api/ai-workflow/suggest
 * Get node suggestions for a partial prompt
 */
router.post('/ai-workflow/suggest', generationLimiter, async (req, res) => {
  try {
    const { prompt, currentNodes = [] } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid prompt',
      });
    }
    
    const intent = extractIntent(prompt);
    
    // Get top matching nodes
    const suggestions = NODE_CATALOG
      .map(node => {
        let score = 0;
        for (const keyword of node.keywords) {
          if (prompt.toLowerCase().includes(keyword.toLowerCase())) {
            score += 1;
          }
        }
        return { ...node, score };
      })
      .filter(n => n.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    res.json({
      success: true,
      suggestions,
      intent: {
        keywords: intent.keywords,
        categories: intent.categories,
      },
    });
    
  } catch (error) {
    console.error('[AI Workflow] Error getting suggestions:', error);
    res.status(500).json({
      error: 'Failed to get suggestions',
      message: error.message,
    });
  }
});

/**
 * GET /api/ai-workflow/patterns
 * Get available workflow patterns
 */
router.get('/ai-workflow/patterns', (req, res) => {
  const patterns = WORKFLOW_PATTERNS.map(p => ({
    name: p.name,
    description: p.name.replace(/([A-Z])/g, ' $1').trim(),
  }));
  
  res.json({
    success: true,
    patterns,
  });
});

/**
 * GET /api/ai-workflow/nodes
 * Get all available node types
 */
router.get('/ai-workflow/nodes', (req, res) => {
  const categories = {};
  
  for (const node of NODE_CATALOG) {
    if (!categories[node.category]) {
      categories[node.category] = [];
    }
    categories[node.category].push({
      type: node.type,
      label: node.label,
    });
  }
  
  res.json({
    success: true,
    categories,
  });
});

/**
 * POST /api/ai-chat
 * General AI chat response
 */
router.post('/ai-chat', generationLimiter, async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing or invalid messages' });
    }

    const systemPrompt = "You are the AI Assistant for Nodespace, a visual node-based AI pipeline builder.\n" +
      "You help users build complex generative AI workflows for images, video, and audio.\n" +
      "Keep your responses helpful, concise, and focused on the user's creative task.\n" +
      "When asked to create or generate something, DO NOT simply explain what to do. You MUST output a valid JSON code block that defines the nodes to build the workflow for them.\n\n" +
      "To do this, ALWAYS output your answer exactly like this when asked to generate a workflow:\n" +
      "```json\n" +
      "{\n" +
      '  "name": "Generated Workflow",\n' +
      '  "nodes": [\n' +
      '    {"id": "node-1", "type": "inputNode", "data": {"label": "Request - Inputs"}},\n' +
      '    {"id": "node-2", "type": "generator", "data": {"label": "Image Generator"}},\n' +
      '    {"id": "node-3", "type": "response", "data": {"label": "Response Output"}}\n' +
      "  ],\n" +
      '  "edges": [\n' +
      '    {"id": "edge-1", "source": "node-1", "target": "node-2", "sourceHandle": "prompt-in", "targetHandle": "prompt-in"},\n' +
      '    {"id": "edge-2", "source": "node-2", "target": "node-3", "sourceHandle": "output", "targetHandle": "image-in"}\n' +
      "  ]\n" +
      "}\n" +
      "```\n" +
      "Provide helpful explanations alongside the JSON.";

    const response = await anthropic().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages
        .filter((m, i) => !(i === 0 && (m.role === 'assistant' || m.type === 'assistant'))) // Filter out initial assistant greeting
        .map(m => ({
          role: (m.role === 'user' || m.type === 'user') ? 'user' : 'assistant',
          content: m.content
        })),
    });

    const reply = response.content.filter(b => b.type === 'text').map(b => b.text).join('').trim();
    
    res.json({
      success: true,
      content: reply
    });

  } catch (error) {
    console.error('[AI Chat] Error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }});

export default router;
