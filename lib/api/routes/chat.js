/**
 * Chat API
 * Handles natural language conversations with Claude
 */

import { Router } from 'express';
import { generationLimiter } from '../middleware/rateLimiter.js';
import { generateText } from '../services/anthropic.js';
import * as google from '../services/google.js';
import { getNodeCatalogSummary } from '../utils/nodeCatalog.js';
import { generateEdges } from './aiWorkflow.js';

const router = Router();

const VIDEO_NODE_TYPES = new Set([
  'kling3',
  'kling3Omni',
  'kling3Motion',
  'klingElementsPro',
  'klingO1',
  'minimaxLive',
  'wan26',
  'seedance',
  'ltxVideo2Pro',
  'ltxVideo',
  'runwayGen45',
  'runwayGen4Turbo',
  'runwayActTwo',
  'pixVerseV5',
  'pixVerseV5Transition',
  'omniHuman',
  'layerEditor',
  'corridorKey',
  'vfx',
  'creativeVideoUpscale',
  'precisionVideoUpscale',
  'videoImprove',
]);

const AUDIO_NODE_TYPES = new Set([
  'universalGeneratorAudio',
  'strudelNode',
  'musicGeneration',
  'soundEffects',
  'audioIsolation',
  'pixVerseSoundEffect',
  'voiceover',
]);

function inferTerminalMediaType(nodes = []) {
  if (nodes.some((node) => VIDEO_NODE_TYPES.has(node.type))) return 'video';
  if (nodes.some((node) => AUDIO_NODE_TYPES.has(node.type))) return 'audio';
  return 'image';
}

function normalizeWorkflowNodes(nodes = []) {
  const terminalMedia = inferTerminalMediaType(nodes);
  const terminalTypeByMedia = {
    image: 'imageOutput',
    video: 'videoOutput',
    audio: 'soundOutput',
  };
  return nodes.map((node) => {
    if (node.type === 'input') {
      return { ...node, type: 'inputNode' };
    }
    if (node.type === 'output' || node.type === 'response') {
      return { ...node, type: terminalTypeByMedia[terminalMedia] || 'imageOutput' };
    }
    return node;
  });
}

function edgesLookValid(edges) {
  return Array.isArray(edges)
    && edges.length > 0
    && edges.every((edge) => edge && edge.source && edge.target && edge.sourceHandle && edge.targetHandle);
}


router.post('/chat', generationLimiter, async (req, res, next) => {
  try {
    let { message, history = [], system, images = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (typeof message !== 'string' || message.length > 4000) {
      return res.status(400).json({ error: 'Message too long (max 4000 characters)' });
    }

    // Sanitize and limit history
    let rawHistory = (Array.isArray(history) ? history : [])
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string');
    
    // Ensure strict alternation required by Anthropic
    const strictHistory = [];
    
    for (const msg of rawHistory) {
      if (strictHistory.length === 0) {
        if (msg.role === 'assistant') {
          // Anthropic requires history to start with a user message
          strictHistory.push({ role: 'user', content: '_' });
        }
        strictHistory.push({ ...msg });
      } else {
        const lastMsg = strictHistory[strictHistory.length - 1];
        if (lastMsg.role === msg.role) {
          lastMsg.content += '\n\n' + msg.content;
        } else {
          strictHistory.push({ ...msg });
        }
      }
    }
    
    // History must end with an assistant message since the new prompt is a user message.
    // If the last message in history is a user message, merge it with the new message
    // so we don't lose the context.
    if (strictHistory.length > 0 && strictHistory[strictHistory.length - 1].role === 'user') {
      const poppedUserMsg = strictHistory.pop();
      message = poppedUserMsg.content + '\n\n' + message;
    }
    
    const sanitizedHistory = strictHistory.slice(-10);

    console.log(`[Chat] Received message (${message.length} chars), history: ${sanitizedHistory.length} msgs`);

    const systemPrompt = system || `You are an expert AI Pipeline Architect for FS Node, a visual node-based editor for building generative AI workflows.

AVAILABLE NODE TYPES:
${getNodeCatalogSummary()}

CORE CAPABILITIES:
1. EXPLAIN: Describe how nodes work and how to connect them.
2. CREATE WORKFLOWS: Generate a full workflow from scratch.
3. MODIFY CANVAS: Update, add, or delete nodes and edges on the existing canvas.

OUTPUT FORMATS:
- For general conversation: Use concise, helpful text.
- For workflow generation (NEW): Output a JSON block with "nodes" and "edges".
- For canvas modifications (EXISTING): Output a JSON block with "canvas_actions".

CANVAS ACTIONS SCHEMA:
\`\`\`json
{
  "canvas_actions": [
    { "action": "UPDATE_NODE", "id": "node-id", "data": { "param": "value" } },
    { "action": "UPDATE_NODE", "id": "layer-editor-id", "data": { "tracks": [ { "id": "track-1", "type": "image", "name": "Image Track", "clips": [ { "id": "clip-1", "type": "image", "src": "...", "opacity": 0.5, "scale": 1.2, "x": 50, "y": -20, "from": 0, "durationInFrames": 120, "status": "completed", "progress": 100, "jobType": "none", "zIndex": 0 } ] } ] } },
    { "action": "ADD_NODE", "id": "unique-id", "type": "nodeType", "position": {"x":x,"y":y}, "data": { "label": "Custom Label" } },
    { "action": "DELETE_NODE", "id": "node-id" },
    { "action": "ADD_EDGE", "source": "src-id", "target": "dst-id", "sourceHandle": "out", "targetHandle": "in" },
    { "action": "DELETE_EDGE", "id": "edge-id" }
  ],
  "suggestions": ["Next step...", "Add another node?"]
}
\`\`\`

GUIDELINES:
- Always provide 2-4 "suggestions" for follow-up actions.
- Use exact node types from the catalog.
- If a request is ambiguous, ask for clarification before generating a complex workflow.
- Ensure all edges connect valid handles (e.g., image-out to image-in).
- Before responding, briefly think about the most efficient node configuration to achieve the user's goal.
- Be precise and avoid "AI slop" or unnecessary filler text.`;

    let response;
    try {
      // Primary: Google Gemini
      response = await google.generateText({
        prompt: message,
        images,
        history: sanitizedHistory,
        system: systemPrompt,
      });
    } catch (err) {
      console.warn('[Chat] Gemini failed:', err?.message, err?.stack);
      try {
        response = await generateText({
          prompt: message,
          images,
          history: sanitizedHistory,
          system: systemPrompt,
        });
        console.log('[Chat] Anthropic fallback successful');
      } catch (fallbackErr) {
        console.error('[Chat] Both providers failed. Gemini:', err?.message, 'Anthropic:', fallbackErr?.message);
        return res.status(502).json({
          success: false,
          error: 'AI providers unavailable',
          gemini: err?.message || String(err),
          anthropic: fallbackErr?.message || String(fallbackErr),
        });
      }
    }

    // Preserve valid workflow JSON edges. Only repair if the model omitted or broke them.
    try {
      response = response.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, (full, body) => {
        try {
          const parsed = JSON.parse(body);
          if (Array.isArray(parsed.nodes) && parsed.nodes.length > 0) {
            parsed.nodes = normalizeWorkflowNodes(parsed.nodes);

            if (!edgesLookValid(parsed.edges)) {
              const wired = generateEdges(parsed.nodes);
              if (wired.length > 0) {
                const inputNode = parsed.nodes.find(n => n.type === 'inputNode');
                if (inputNode) {
                  const usedFields = wired
                    .filter(e => e.source === inputNode.id)
                    .map(e => e.sourceHandle)
                    .filter(Boolean);
                  if (usedFields.length > 0) {
                    inputNode.data = inputNode.data || {};
                    const existing = Array.isArray(inputNode.data.initialFields) ? inputNode.data.initialFields : [];
                    const merged = Array.from(new Set([...existing, ...usedFields]));
                    inputNode.data.initialFields = merged;
                  }
                }
                parsed.edges = wired;
              }
            }

            return '```json\n' + JSON.stringify(parsed, null, 2) + '\n```';
          }
        } catch { /* leave block untouched */ }
        return full;
      });
    } catch (wireErr) {
      console.warn('[Chat] Auto-wire failed:', wireErr.message);
    }

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
