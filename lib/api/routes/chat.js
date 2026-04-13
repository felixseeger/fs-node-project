/**
 * Chat API
 * Handles natural language conversations with Claude
 */

import { Router } from 'express';
import { generationLimiter } from '../middleware/rateLimiter.js';
import { generateText } from '../services/anthropic.js';
import * as google from '../services/google.js';
import { getNodeCatalogSummary } from '../utils/nodeCatalog.js';

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

    if (typeof message !== 'string' || message.length > 4000) {
      return res.status(400).json({ error: 'Message too long (max 4000 characters)' });
    }

    // Sanitize and limit history
    const sanitizedHistory = (Array.isArray(history) ? history : [])
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-10); // Last 10 messages only

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
      response = await generateText({
        prompt: message,
        images,
        history: sanitizedHistory,
        system: systemPrompt,
      });
    } catch (err) {
      console.warn('[Chat] Anthropic failed, trying Google fallback:', err.message);
      try {
        // Fallback to Google Gemini
        response = await google.generateText({
          prompt: message,
          images,
          history: sanitizedHistory,
          system: systemPrompt,
        });
        console.log('[Chat] Google fallback successful');
      } catch (fallbackErr) {
        console.error('[Chat] Both providers failed');
        throw new Error(`AI providers unavailable: ${fallbackErr.message}`);
      }
    }

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
