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
    const { message, history = [], system } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('[Chat] Received message:', message);

    const response = await generateText({
      prompt: message,
      system: system || 'You are a helpful AI assistant for a node-based visual pipeline editor called FS Node. You help users build AI workflows for image, video, and audio processing.',
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
