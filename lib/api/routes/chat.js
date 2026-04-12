/**
 * Chat API
 * Handles natural language conversations with Claude
 */

import { Router } from 'express';
import { generationLimiter } from '../middleware/rateLimiter.js';
import { generateText } from '../services/anthropic.js';

const router = Router();

/**
 * POST /api/chat
 * Simple chat endpoint
 */
router.post('/chat', generationLimiter, async (req, res) => {
  try {
    const { message, history = [], system, images = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('[Chat] Received message:', message);

    const systemPrompt = system || `You are a helpful AI assistant for a node-based visual pipeline editor called FS Node. You help users build AI workflows for image, video, and audio processing.

If the user asks you to create, generate, or build a workflow/pipeline, you MUST output a JSON code block containing the nodes and edges for the canvas.

To do this, output exactly like this:
\`\`\`json
{
  "name": "My Workflow",
  "nodes": [
    {"id": "node-1", "type": "inputNode", "data": {"label": "Request - Inputs"}},
    {"id": "node-2", "type": "generator", "data": {"label": "Image Generator"}},
    {"id": "node-3", "type": "response", "data": {"label": "Response · Output"}}
  ],
  "edges": [
    {"id": "edge-1", "source": "node-1", "target": "node-2", "sourceHandle": "prompt-in", "targetHandle": "prompt-in"},
    {"id": "edge-2", "source": "node-2", "target": "node-3", "sourceHandle": "output", "targetHandle": "image-in"}
  ]
}
\`\`\`
Provide helpful explanations alongside the JSON.`;

    const response = await generateText({
      prompt: message, images,
      system: systemPrompt,
    });

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('[Chat] Error:', error);
    res.status(500).json({
      error: 'Failed to get chat response',
      message: error.message,
    });
  }
});

export default router;
