/**
 * Image Generation Routes
 * Handles image generation via Freepik APIs (Mystic/Nano Banana, Kora)
 */

import { Router } from 'express';
import multer from 'multer';
import * as freepik from '../services/freepik.js';
import * as google from '../services/google.js';
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
 * Real API call to Freepik Mystic endpoint OR Google Gemini Imagen 3
 */
router.post('/generate-image', generationLimiter, async (req, res, next) => {
  try {
    const { model, prompt, image_urls } = req.body;
    console.log(`[API] Generating image with model: ${model || 'default'}, prompt: ${prompt?.substring(0, 50)}...`);
    
    // Gemini is only used for pure text-to-image. Requests with structure
    // references must stay on Freepik until the Google path supports them.
    const hasStructureReference = Array.isArray(image_urls) && image_urls.length > 0;
    const useGoogle = process.env.GOOGLE_GEMINI_API_KEY && 
                      !hasStructureReference &&
                      (model === 'freepik-mystic' || model === 'Nano Banana 2' || !model);

    let result;
    if (useGoogle) {
      console.log('[API] Using Google Gemini (Imagen 3) for generation');
      try {
        result = await generateQueue.add(() => google.generateImage(req.body));
      } catch (googleErr) {
        console.error('[API] Google Gemini generation failed:', googleErr.message);
        console.error('[API] Google error details:', googleErr);
        return res.status(500).json({
          error: {
            message: `Google Imagen 3: ${googleErr.message}`,
            details: googleErr.data || null
          }
        });
      }
    } else {
      try {
        result = await generateQueue.add(() => freepik.generateImage(req.body));
      } catch (freepikErr) {
        console.error('[API] Freepik generation failed:', freepikErr.message);
        console.error('[API] Freepik error details:', freepikErr);
        return res.status(500).json({
          error: {
            message: `Freepik: ${freepikErr.message}`,
            details: freepikErr.data || null
          }
        });
      }
    }
    
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
    const result = await freepik.getTaskStatus(req.params.taskId, req.query.model);
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
