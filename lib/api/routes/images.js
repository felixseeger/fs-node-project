/**
 * Image Generation Routes
 * Handles image generation via Freepik APIs (Mystic/Nano Banana, Kora)
 */

import { Router } from 'express';
import multer from 'multer';
import * as freepik from '../services/freepik.js';
import { generationLimiter } from '../middleware/rateLimiter.js';
import generateQueue from '../queue/index.js';

const router = Router();

// Configure multer for image uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

/**
 * POST /api/generate-image
 * Nano Banana 2 Edit - Image generation with optional structure reference
 * Real API call to Freepik Mystic endpoint
 */
router.post('/generate-image', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Generating image with prompt:', req.body.prompt?.substring(0, 50) + '...');
    const result = await generateQueue.add(() => freepik.generateImage(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Image generation failed:', err.message);
    next(err);
  }
});

/**
 * POST /api/generate-kora
 * Kora Reality - Realism-focused image generation
 * Real API call to Freepik with realism model
 */
router.post('/generate-kora', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Generating Kora image with prompt:', req.body.prompt?.substring(0, 50) + '...');
    const result = await generateQueue.add(() => freepik.generateImage({ ...req.body, model: 'realism' }));
    res.json(result);
  } catch (err) {
    console.error('[API] Kora generation failed:', err.message);
    next(err);
  }
});

/**
 * GET /api/status/:taskId
 * Generic task status polling for image generation
 * Real API call to check generation status
 */
router.get('/status/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getTaskStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    console.error('[API] Status check failed:', err.message);
    next(err);
  }
});

/**
 * POST /api/upload-image
 * Upload images and return base64 data URLs
 */
router.post('/upload-image', generationLimiter, upload.array('images', 5), async (req, res, next) => {
  try {
    console.log(`[API] Uploading ${req.files?.length || 0} images`);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }
    
    const urls = req.files.map(file => {
      const base64 = file.buffer.toString('base64');
      return `data:${file.mimetype};base64,${base64}`;
    });
    
    res.json({ 
      success: true, 
      urls,
      count: urls.length 
    });
  } catch (err) {
    console.error('[API] Image upload failed:', err.message);
    next(err);
  }
});

export default router;
