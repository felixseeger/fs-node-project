/**
 * Video Generation Routes
 * Handles video generation via various providers (Kling, Runway, MiniMax, etc.)
 * All routes make real API calls to Freepik video generation services
 */

import { Router } from 'express';
import * as freepik from '../services/freepik.js';

const router = Router();

// --- Kling Elements Pro ---
router.post('/kling-elements-pro', async (req, res, next) => {
  try {
    console.log('[API] Kling Elements Pro video generation');
    const result = await freepik.klingElementsPro(req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] Kling Elements Pro failed:', err.message);
    next(err);
  }
});

router.get('/kling-elements-pro/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getKlingElementsProStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Kling 3 ---
router.post('/kling3/:mode', async (req, res, next) => {
  try {
    const { mode } = req.params;
    if (mode !== 'pro' && mode !== 'std') {
      return res.status(400).json({ error: 'Invalid mode. Must be "pro" or "std"' });
    }
    console.log(`[API] Kling 3 ${mode} video generation`);
    const result = await freepik.kling3Video(mode, req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] Kling 3 failed:', err.message);
    next(err);
  }
});

router.get('/kling3/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getKling3Status(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Kling 3 Omni ---
router.post('/kling3-omni/:mode', async (req, res, next) => {
  try {
    const { mode } = req.params;
    console.log(`[API] Kling 3 Omni ${mode} video generation`);
    // Use kling3Video as the underlying API endpoint is similar
    const result = await freepik.kling3Video(mode, req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] Kling 3 Omni failed:', err.message);
    next(err);
  }
});

router.get('/kling3-omni/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getKling3Status(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Kling 3 Motion Control ---
router.post('/kling3-motion/:mode', async (req, res, next) => {
  try {
    const { mode } = req.params;
    console.log(`[API] Kling 3 Motion Control ${mode} video generation`);
    const result = await freepik.kling3Video(mode, req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] Kling 3 Motion failed:', err.message);
    next(err);
  }
});

router.get('/kling3-motion/:mode/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getKling3Status(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Kling O1 ---
router.post('/kling-o1/:mode', async (req, res, next) => {
  try {
    const { mode } = req.params;
    console.log(`[API] Kling O1 ${mode} video generation`);
    const result = await freepik.kling3Video(mode, req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] Kling O1 failed:', err.message);
    next(err);
  }
});

router.get('/kling-o1/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getKling3Status(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- MiniMax ---
router.post('/minimax', async (req, res, next) => {
  try {
    console.log('[API] MiniMax video generation');
    const result = await freepik.minimaxVideo(req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] MiniMax failed:', err.message);
    next(err);
  }
});

router.get('/minimax/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getMinimaxStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- MiniMax Live ---
router.post('/minimax-live', async (req, res, next) => {
  try {
    console.log('[API] MiniMax Live video generation');
    const result = await freepik.minimaxVideo(req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] MiniMax Live failed:', err.message);
    next(err);
  }
});

router.get('/minimax-live/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getMinimaxStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- WAN 2.6 ---
router.post('/wan-v2-6/:mode/:resolution', async (req, res, next) => {
  try {
    const { mode, resolution } = req.params;
    console.log(`[API] WAN 2.6 ${mode} ${resolution} video generation`);
    const result = await freepik.wan26Video(req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] WAN 2.6 failed:', err.message);
    next(err);
  }
});

router.get('/wan-v2-6/:mode/:resolution/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getWan26Status(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Seedance ---
router.post('/seedance-1-5-pro/:resolution', async (req, res, next) => {
  try {
    const { resolution } = req.params;
    console.log(`[API] Seedance 1.5 Pro ${resolution} video generation`);
    const result = await freepik.seedanceVideo(req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] Seedance failed:', err.message);
    next(err);
  }
});

router.get('/seedance-1-5-pro/:resolution/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getSeedanceStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- LTX Video ---
router.post('/ltx-2-pro/:mode', async (req, res, next) => {
  try {
    const { mode } = req.params;
    console.log(`[API] LTX Video 2.0 Pro ${mode} generation`);
    const result = await freepik.ltxVideo(req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] LTX Video failed:', err.message);
    next(err);
  }
});

router.get('/ltx-2-pro/:mode/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getLtxStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Runway Gen 4.5 ---
router.post('/runway-4-5/:mode', async (req, res, next) => {
  try {
    const { mode } = req.params;
    console.log(`[API] Runway Gen 4.5 ${mode} generation`);
    const result = await freepik.runwayVideo(mode, req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] Runway Gen 4.5 failed:', err.message);
    next(err);
  }
});

router.get('/runway-4-5/:mode/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getRunwayStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Runway Gen4 Turbo ---
router.post('/runway-gen4-turbo', async (req, res, next) => {
  try {
    console.log('[API] Runway Gen4 Turbo generation');
    const result = await freepik.runwayVideo('gen4-turbo', req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] Runway Gen4 Turbo failed:', err.message);
    next(err);
  }
});

router.get('/runway-gen4-turbo/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getRunwayStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Runway Act Two ---
router.post('/runway-act-two', async (req, res, next) => {
  try {
    console.log('[API] Runway Act Two generation');
    const result = await freepik.runwayVideo('act-two', req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] Runway Act Two failed:', err.message);
    next(err);
  }
});

router.get('/runway-act-two/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getRunwayStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- PixVerse V5 ---
router.post('/pixverse-v5', async (req, res, next) => {
  try {
    console.log('[API] PixVerse V5 generation');
    const result = await freepik.pixverseVideo('generate', req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] PixVerse V5 failed:', err.message);
    next(err);
  }
});

router.get('/pixverse-v5/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getPixverseStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- PixVerse V5 Transition ---
router.post('/pixverse-v5-transition', async (req, res, next) => {
  try {
    console.log('[API] PixVerse V5 Transition generation');
    const result = await freepik.pixverseVideo('transition', req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] PixVerse V5 Transition failed:', err.message);
    next(err);
  }
});

router.get('/pixverse-v5-transition/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getPixverseStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- OmniHuman ---
router.post('/omni-human-1-5', async (req, res, next) => {
  try {
    console.log('[API] OmniHuman 1.5 generation');
    const result = await freepik.omnihumanVideo(req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] OmniHuman failed:', err.message);
    next(err);
  }
});

router.get('/omni-human-1-5/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getOmnihumanStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- VFX ---
router.post('/vfx', async (req, res, next) => {
  try {
    console.log('[API] VFX processing');
    const result = await freepik.vfxVideo(req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] VFX failed:', err.message);
    next(err);
  }
});

router.get('/vfx/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getVfxStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Video Upscale Creative ---
router.post('/video-upscale/creative', async (req, res, next) => {
  try {
    console.log('[API] Video upscale (creative)');
    const result = await freepik.videoUpscale('creative', req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] Video upscale failed:', err.message);
    next(err);
  }
});

router.get('/video-upscale/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getVideoUpscaleStatus('creative', req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Video Upscale Precision ---
router.post('/video-upscaler-precision', async (req, res, next) => {
  try {
    console.log('[API] Video upscale (precision)');
    const result = await freepik.videoUpscale('precision', req.body);
    res.json(result);
  } catch (err) {
    console.error('[API] Video upscale precision failed:', err.message);
    next(err);
  }
});

router.get('/video-upscaler-precision/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getVideoUpscaleStatus('precision', req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
