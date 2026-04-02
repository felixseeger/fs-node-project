/**
 * Image Editing Routes
 * Handles image upscaling, relighting, style transfer, background removal, etc.
 * All routes make real API calls to Freepik image editing services
 */

import { Router } from 'express';
import * as freepik from '../services/freepik.js';

const router = Router();

// --- Creative Upscale ---
router.post('/upscale-creative', async (req, res, next) => {
  try {
    console.log('[API] Creative upscale');
    const result = await freepik.upscaleCreative(req.body);
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
router.post('/upscale-precision', async (req, res, next) => {
  try {
    console.log('[API] Precision upscale');
    const result = await freepik.upscalePrecision(req.body);
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
router.post('/relight', async (req, res, next) => {
  try {
    console.log('[API] Relight:', req.body.prompt?.substring(0, 50) + '...');
    const result = await freepik.relightImage(req.body);
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
router.post('/style-transfer', async (req, res, next) => {
  try {
    console.log('[API] Style transfer');
    const result = await freepik.styleTransfer(req.body);
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
router.post('/remove-background', async (req, res, next) => {
  try {
    const { image_url } = req.body;
    if (!image_url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }
    console.log('[API] Remove background');
    const result = await freepik.removeBackground(image_url);
    res.json(result);
  } catch (err) {
    console.error('[API] Remove background failed:', err.message);
    next(err);
  }
});

// --- Flux Reimagine ---
router.post('/reimagine-flux', async (req, res, next) => {
  try {
    console.log('[API] Flux reimagine:', req.body.prompt?.substring(0, 50) + '...');
    const result = await freepik.reimagineFlux(req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] Flux reimagine failed:', err.message);
    next(err);
  }
});

// --- Image Expand (Flux) ---
router.post('/image-expand', async (req, res, next) => {
  try {
    console.log('[API] Image expand (Flux)');
    const result = await freepik.expandImage('flux', req.body);
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
router.post('/seedream-expand', async (req, res, next) => {
  try {
    console.log('[API] Seedream expand');
    const result = await freepik.expandImage('seedream', req.body);
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
router.post('/ideogram-expand', async (req, res, next) => {
  try {
    console.log('[API] Ideogram expand');
    const result = await freepik.expandImage('ideogram', req.body);
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
router.post('/skin-enhancer/:mode', async (req, res, next) => {
  try {
    console.log(`[API] Skin enhancer (${req.params.mode})`);
    const result = await freepik.skinEnhancer(req.params.mode, req.body);
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
router.post('/ideogram-inpaint', async (req, res, next) => {
  try {
    console.log('[API] Ideogram inpaint:', req.body.prompt?.substring(0, 50) + '...');
    const result = await freepik.ideogramInpaint(req.body);
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
router.post('/change-camera', async (req, res, next) => {
  try {
    console.log('[API] Change camera angle');
    const result = await freepik.changeCamera(req.body);
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

export default router;
