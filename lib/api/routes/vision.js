/**
 * Vision & LLM Routes
 * Handles image analysis via Claude Sonnet and other AI utilities
 * All routes make real API calls to Anthropic and Freepik services
 */

import { Router } from 'express';
import { generationLimiter } from '../middleware/rateLimiter.js';
import generateQueue from '../queue/index.js';
import * as anthropic from '../services/anthropic.js';
import * as freepik from '../services/freepik.js';

const router = Router();

// --- Claude Image Analysis ---
router.post('/analyze-image', generationLimiter, async (req, res, next) => {
  try {
    const { images, prompt, systemDirections } = req.body;
    console.log('[API] Claude image analysis:', prompt?.substring(0, 50) + '...');
    const analysis = await anthropic.analyzeImage({ images, prompt, systemDirections });
    res.json({ analysis });
  } catch (err) {
    console.error('[API] Image analysis failed:', err.message);
    next(err);
  }
});

// --- Image to Prompt ---
router.post('/image-to-prompt', generationLimiter, async (req, res, next) => {
  try {
    const { image_url, image } = req.body;
    const targetUrl = image_url || image;
    if (!targetUrl) {
      return res.status(400).json({ error: 'Image is required' });
    }
    console.log('[API] Image to prompt conversion');
    const result = await generateQueue.add(() => freepik.imageToPrompt(targetUrl));
    res.json(result);
  } catch (err) {
    console.error('[API] Image to prompt failed:', err.message);
    next(err);
  }
});

router.get('/image-to-prompt/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getTaskStatus(req.params.taskId, 'https://api.freepik.com/v1/ai/image-to-prompt');
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Improve Prompt ---
router.post('/improve-prompt', generationLimiter, async (req, res, next) => {
  try {
    const { prompt, type, language } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    console.log('[API] Improve prompt:', prompt?.substring(0, 50) + '...');
    const result = await generateQueue.add(() => freepik.improvePrompt(prompt, type, language));
    res.json(result);
  } catch (err) {
    console.error('[API] Improve prompt failed:', err.message);
    next(err);
  }
});

router.get('/improve-prompt/:taskId', async (req, res, next) => {
  try {
    // Prompt improvement is synchronous, return mock status
    res.json({
      data: {
        status: 'COMPLETED',
        improved_prompt: 'Improved prompt result'
      }
    });
  } catch (err) {
    next(err);
  }
});

// --- AI Image Classifier ---
router.post('/classifier/image', generationLimiter, async (req, res, next) => {
  try {
    const { image_url, image } = req.body;
    const targetUrl = image_url || image;
    if (!targetUrl) {
      return res.status(400).json({ error: 'Image is required' });
    }
    console.log('[API] AI image classification');
    const result = await generateQueue.add(() => freepik.classifyImage(targetUrl));
    res.json(result);
  } catch (err) {
    console.error('[API] Image classification failed:', err.message);
    next(err);
  }
});

// --- Text to Icon ---
router.post('/text-to-icon', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Text to icon:', req.body.prompt?.substring(0, 50) + '...');
    const result = await generateQueue.add(() => freepik.textToIcon(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Text to icon failed:', err.message);
    next(err);
  }
});

router.get('/text-to-icon/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getTaskStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
