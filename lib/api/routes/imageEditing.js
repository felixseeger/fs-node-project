/**
 * Image Editing Routes
 * Handles image upscaling, relighting, style transfer, background removal, etc.
 * All routes make real API calls to Freepik image editing services
 */

import { Router } from 'express';
import { generationLimiter } from '../middleware/rateLimiter.js';
import generateQueue from '../queue/index.js';
import * as freepik from '../services/freepik.js';
import * as gfpgan from '../services/gfpgan.js';
import * as codeformer from '../services/codeformer.js';

const router = Router();

// --- Creative Upscale ---
router.post('/upscale-creative', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Creative upscale');
    const result = await generateQueue.add(() => freepik.upscaleCreative(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Creative upscale failed:', err.message);
    next(err);
  }
});

router.get('/upscale-creative/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getUpscaleCreativeStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Precision Upscale ---
router.post('/upscale-precision', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Precision upscale');
    const result = await generateQueue.add(() => freepik.upscalePrecision(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Precision upscale failed:', err.message);
    next(err);
  }
});

router.get('/upscale-precision/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getUpscalePrecisionStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Relight ---
router.post('/relight', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Relight:', req.body.prompt?.substring(0, 50) + '...');
    const result = await generateQueue.add(() => freepik.relightImage(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Relight failed:', err.message);
    next(err);
  }
});

router.get('/relight/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getRelightStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Style Transfer ---
router.post('/style-transfer', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Style transfer');
    const result = await generateQueue.add(() => freepik.styleTransfer(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Style transfer failed:', err.message);
    next(err);
  }
});

router.get('/style-transfer/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getStyleTransferStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Remove Background ---
router.post('/remove-background', generationLimiter, async (req, res, next) => {
  try {
    const { image_url } = req.body;
    if (!image_url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }
    console.log('[API] Remove background');
    const result = await generateQueue.add(() => freepik.removeBackground(image_url));
    res.json(result);
  } catch (err) {
    console.error('[API] Remove background failed:', err.message);
    next(err);
  }
});

// --- Flux Reimagine ---
router.post('/reimagine-flux', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Flux reimagine:', req.body.prompt?.substring(0, 50) + '...');
    const result = await generateQueue.add(() => freepik.reimagineFlux(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Flux reimagine failed:', err.message);
    next(err);
  }
});

// --- Image Expand (Flux) ---
router.post('/image-expand', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Image expand (Flux)');
    const result = await generateQueue.add(() => freepik.expandImage('flux', req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Image expand failed:', err.message);
    next(err);
  }
});

router.get('/image-expand/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getExpandStatus('flux', req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Seedream Expand ---
router.post('/seedream-expand', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Seedream expand');
    const result = await generateQueue.add(() => freepik.expandImage('seedream', req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Seedream expand failed:', err.message);
    next(err);
  }
});

router.get('/seedream-expand/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getExpandStatus('seedream', req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Ideogram Expand ---
router.post('/ideogram-expand', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Ideogram expand');
    const result = await generateQueue.add(() => freepik.expandImage('ideogram', req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Ideogram expand failed:', err.message);
    next(err);
  }
});

router.get('/ideogram-expand/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getExpandStatus('ideogram', req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Skin Enhancer ---
router.post('/skin-enhancer/:mode', generationLimiter, async (req, res, next) => {
  try {
    console.log(`[API] Skin enhancer (${req.params.mode})`);
    const result = await generateQueue.add(() => freepik.skinEnhancer(req.params.mode, req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Skin enhancer failed:', err.message);
    next(err);
  }
});

router.get('/skin-enhancer/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getSkinEnhancerStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Ideogram Inpaint ---
router.post('/ideogram-inpaint', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Ideogram inpaint:', req.body.prompt?.substring(0, 50) + '...');
    const result = await generateQueue.add(() => freepik.ideogramInpaint(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Ideogram inpaint failed:', err.message);
    next(err);
  }
});

router.get('/ideogram-inpaint/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getIdeogramInpaintStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Change Camera ---
router.post('/change-camera', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Change camera angle');
    const result = await generateQueue.add(() => freepik.changeCamera(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Change camera failed:', err.message);
    next(err);
  }
});

router.get('/change-camera/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getChangeCameraStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- GFPGAN Face Restoration ---
router.post('/gfpgan', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] GFPGAN face restoration');
    const result = await generateQueue.add(() => gfpgan.restoreFace(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] GFPGAN failed:', err.message);
    next(err);
  }
});

// --- CodeFormer Face Restoration ---
router.post('/codeformer', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] CodeFormer face restoration');
    const result = await generateQueue.add(() => codeformer.restoreFace(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] CodeFormer failed:', err.message);
    next(err);
  }
});

export default router;
