/**
 * AI Workflow Generation API
 * Processes natural language prompts and generates workflow node structures
 */

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

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
 * Auto-layout algorithm for positioning nodes
 * Uses a simple grid-based layout with proper spacing
 */
function autoLayoutNodes(nodes, options = {}) {
  const {
    startX = 50,
    startY = 100,
    nodeWidth = 250,
    nodeHeight = 150,
    horizontalGap = 100,
    verticalGap = 50,
    maxNodesPerRow = 3,
  } = options;
  
  const positionedNodes = [];
  let currentX = startX;
  let currentY = startY;
  let nodesInCurrentRow = 0;
  
  // Separate input/output nodes from processing nodes
  const inputNodes = nodes.filter(n => n.type === 'inputNode');
  const outputNodes = nodes.filter(n => n.type === 'response');
  const processingNodes = nodes.filter(n => n.type !== 'inputNode' && n.type !== 'response');
  
  // Position input node on the left
  for (const node of inputNodes) {
    positionedNodes.push({
      ...node,
      id: node.id || uuidv4(),
      position: { x: currentX, y: currentY },
      data: node.data || { label: node.label },
    });
  }
  
  currentX += nodeWidth + horizontalGap * 2;
  nodesInCurrentRow = 0;
  
  // Position processing nodes in a grid
  for (const node of processingNodes) {
    positionedNodes.push({
      ...node,
      id: node.id || uuidv4(),
      position: { x: currentX, y: currentY },
      data: node.data || { label: node.label },
    });
    
    nodesInCurrentRow++;
    
    if (nodesInCurrentRow >= maxNodesPerRow) {
      // Move to next row
      currentX = startX + nodeWidth + horizontalGap * 2;
      currentY += nodeHeight + verticalGap;
      nodesInCurrentRow = 0;
    } else {
      currentX += nodeWidth + horizontalGap;
    }
  }
  
  // Position output node on the right
  if (outputNodes.length > 0) {
    // Find rightmost position
    const rightmostX = Math.max(...positionedNodes.map(n => n.position.x));
    currentX = rightmostX + nodeWidth + horizontalGap * 2;
    currentY = startY;
    
    for (const node of outputNodes) {
      positionedNodes.push({
        ...node,
        id: node.id || uuidv4(),
        position: { x: currentX, y: currentY },
        data: node.data || { label: node.label },
      });
    }
  }
  
  return positionedNodes;
}

/**
 * Generate edges connecting nodes in sequence
 */
function generateEdges(nodes) {
  const edges = [];
  const processingNodes = nodes.filter(n => n.type !== 'inputNode' && n.type !== 'response');
  const inputNode = nodes.find(n => n.type === 'inputNode');
  const outputNode = nodes.find(n => n.type === 'response');
  
  // Connect input to first processing node
  if (inputNode && processingNodes.length > 0) {
    edges.push({
      id: `e-${inputNode.id}-${processingNodes[0].id}`,
      source: inputNode.id,
      target: processingNodes[0].id,
      sourceHandle: 'output',
      targetHandle: 'image-in',
      animated: true,
    });
  }
  
  // Connect processing nodes in sequence
  for (let i = 0; i < processingNodes.length - 1; i++) {
    edges.push({
      id: `e-${processingNodes[i].id}-${processingNodes[i + 1].id}`,
      source: processingNodes[i].id,
      target: processingNodes[i + 1].id,
      sourceHandle: 'output',
      targetHandle: 'image-in',
      animated: true,
    });
  }
  
  // Connect last processing node to output
  if (outputNode && processingNodes.length > 0) {
    const lastNode = processingNodes[processingNodes.length - 1];
    edges.push({
      id: `e-${lastNode.id}-${outputNode.id}`,
      source: lastNode.id,
      target: outputNode.id,
      sourceHandle: 'output',
      targetHandle: 'input',
      animated: true,
    });
  }
  
  return edges;
}

/**
 * POST /api/ai-workflow/generate
 * Generate a workflow from natural language prompt
 */
router.post('/ai-workflow/generate', async (req, res) => {
  try {
    const { prompt, mode = 'standard' } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid prompt',
        message: 'Please provide a valid natural language prompt',
      });
    }
    
    console.log('[AI Workflow] Generating workflow for:', prompt);
    
    // Step 1: Extract intent from prompt
    const intent = extractIntent(prompt);
    console.log('[AI Workflow] Extracted intent:', {
      keywords: intent.keywords,
      categories: intent.categories,
      preferredNode: intent.preferredNode?.label,
      complexity: intent.complexity,
    });
    
    // Step 2: Match against workflow patterns
    let matchedPattern = WORKFLOW_PATTERNS.find(p => p.match(intent));
    
    // Default to simple generation if no pattern matches
    if (!matchedPattern) {
      matchedPattern = WORKFLOW_PATTERNS[0]; // Image Generation Pipeline
    }
    
    console.log('[AI Workflow] Matched pattern:', matchedPattern.name);
    
    // Step 3: Generate node definitions
    const nodeDefinitions = matchedPattern.nodes(intent);
    
    // Step 4: Apply auto-layout
    const nodes = autoLayoutNodes(nodeDefinitions, {
      startX: 50,
      startY: 100,
      maxNodesPerRow: mode === 'compact' ? 2 : 3,
    });
    
    // Step 5: Generate edges
    const edges = generateEdges(nodes);
    
    // Step 6: Build response
    const workflow = {
      id: `ai-wf-${Date.now()}`,
      name: matchedPattern.name,
      description: `AI-generated workflow: "${prompt}"`,
      nodes,
      edges,
      metadata: {
        generatedAt: new Date().toISOString(),
        prompt,
        mode,
        intent: {
          keywords: intent.keywords,
          categories: intent.categories,
          complexity: intent.complexity,
        },
        pattern: matchedPattern.name,
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
router.post('/ai-workflow/suggest', async (req, res) => {
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

export default router;
