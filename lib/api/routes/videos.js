/**
 * Video Generation Routes
 * Handles video generation via various providers (Kling, Runway, MiniMax, etc.)
 * All routes make real API calls to Freepik video generation services
 */

import { Router } from 'express';
import { generationLimiter } from '../middleware/rateLimiter.js';
import generateQueue from '../queue/index.js';
import * as freepik from '../services/freepik.js';
import * as pixverse from '../services/pixverse.js';

const router = Router();

// --- Kling Elements Pro ---
router.post('/kling-elements-pro', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Kling Elements Pro video generation');
    const result = await generateQueue.add(() => freepik.klingElementsPro(req.body));
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
router.post('/kling3/:mode', generationLimiter, async (req, res, next) => {
  try {
    const { mode } = req.params;
    if (mode !== 'pro' && mode !== 'std') {
      return res.status(400).json({ error: 'Invalid mode. Must be "pro" or "std"' });
    }
    console.log(`[API] Kling 3 ${mode} video generation`);
    const result = await generateQueue.add(() => freepik.kling3Video(mode, req.body));
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
router.post('/kling3-omni/:mode', generationLimiter, async (req, res, next) => {
  try {
    const { mode } = req.params;
    console.log(`[API] Kling 3 Omni ${mode} video generation`);
    // Use kling3Video as the underlying API endpoint is similar
    const result = await generateQueue.add(() => freepik.kling3Video(mode, req.body));
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
router.post('/kling3-motion/:mode', generationLimiter, async (req, res, next) => {
  try {
    const { mode } = req.params;
    console.log(`[API] Kling 3 Motion Control ${mode} video generation`);
    const result = await generateQueue.add(() => freepik.kling3Video(mode, req.body));
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
router.post('/kling-o1/:mode', generationLimiter, async (req, res, next) => {
  try {
    const { mode } = req.params;
    console.log(`[API] Kling O1 ${mode} video generation`);
    const result = await generateQueue.add(() => freepik.kling3Video(mode, req.body));
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
router.post('/minimax', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] MiniMax video generation');
    const result = await generateQueue.add(() => freepik.minimaxVideo(req.body));
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
router.post('/minimax-live', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] MiniMax Live video generation');
    const result = await generateQueue.add(() => freepik.minimaxVideo(req.body));
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
router.post('/wan-v2-6/:mode/:resolution', generationLimiter, async (req, res, next) => {
  try {
    const { mode, resolution } = req.params;
    console.log(`[API] WAN 2.6 ${mode} ${resolution} video generation`);
    const result = await generateQueue.add(() => freepik.wan26Video(req.body));
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
router.post('/seedance-1-5-pro/:resolution', generationLimiter, async (req, res, next) => {
  try {
    const { resolution } = req.params;
    console.log(`[API] Seedance 1.5 Pro ${resolution} video generation`);
    const result = await generateQueue.add(() => freepik.seedanceVideo(req.body));
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
router.post('/ltx-2-pro/:mode', generationLimiter, async (req, res, next) => {
  try {
    const { mode } = req.params;
    console.log(`[API] LTX Video 2.0 Pro ${mode} generation`);
    const result = await generateQueue.add(() => freepik.ltxVideo(req.body));
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
router.post('/runway-4-5/:mode', generationLimiter, async (req, res, next) => {
  try {
    const { mode } = req.params;
    console.log(`[API] Runway Gen 4.5 ${mode} generation`);
    const result = await generateQueue.add(() => freepik.runwayVideo(mode, req.body));
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
router.post('/runway-gen4-turbo', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Runway Gen4 Turbo generation');
    const result = await generateQueue.add(() => freepik.runwayVideo('gen4-turbo', req.body));
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
router.post('/runway-act-two', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Runway Act Two generation');
    const result = await generateQueue.add(() => freepik.runwayVideo('act-two', req.body));
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
router.post('/pixverse-v5', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] PixVerse V5 generation');
    const result = await generateQueue.add(() => freepik.pixverseVideo('generate', req.body));
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
router.post('/pixverse-v5-transition', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] PixVerse V5 Transition generation');
    const result = await generateQueue.add(() => freepik.pixverseVideo('transition', req.body));
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
router.post('/omni-human-1-5', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] OmniHuman 1.5 generation');
    const result = await generateQueue.add(() => freepik.omnihumanVideo(req.body));
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
router.post('/vfx', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] VFX processing');
    const result = await generateQueue.add(() => freepik.vfxVideo(req.body));
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
router.post('/video-upscale/creative', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Video upscale (creative)');
    const result = await generateQueue.add(() => freepik.videoUpscale('creative', req.body));
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
router.post('/video-upscaler-precision', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Video upscale (precision)');
    const result = await generateQueue.add(() => freepik.videoUpscale('precision', req.body));
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

// --- Video Improve (Creative Upscale) ---
// This route maps the frontend's /video-improve endpoint to the creative upscale service
router.post('/video-improve', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Video improve (creative upscale)');
    // Map the video-improve params to videoUpscale creative format
    const upscaleParams = {
      video_url: req.body.video_url,
      mode: req.body.mode || 'creative',
      resolution: req.body.resolution || 'fhd',
      flavor: req.body.flavor || 'natural',
      creativity: req.body.creativity,
      sharpen: req.body.sharpen,
      smart_grain: req.body.smart_grain,
      webhook_url: req.body.webhook_url,
    };
    const result = await generateQueue.add(() => freepik.videoUpscale('creative', upscaleParams));
    res.json(result);
  } catch (err) {
    console.error('[API] Video improve failed:', err.message);
    next(err);
  }
});

router.get('/video-improve/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getVideoUpscaleStatus('creative', req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- LTX Video Direct API ---
router.post('/ltx-direct/:mode', generationLimiter, async (req, res, next) => {
  try {
    const { mode } = req.params;
    if (mode !== 'text-to-video' && mode !== 'image-to-video') {
      return res.status(400).json({ error: 'Invalid mode. Must be "text-to-video" or "image-to-video"' });
    }

    const apiKey = process.env.LTXV_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'LTXV_API_KEY not configured' });
    }

    console.log(`[API] LTX Direct ${mode} generation`);

    const response = await fetch(`https://api.ltx.video/v1/${mode}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: `HTTP ${response.status}` } }));
      console.error('[API] LTX Direct failed:', errorData);
      return res.status(response.status).json(errorData);
    }

    // LTX returns video directly as binary
    const videoBuffer = await response.arrayBuffer();
    const base64Video = Buffer.from(videoBuffer).toString('base64');
    const videoUrl = `data:video/mp4;base64,${base64Video}`;

    res.json({
      data: {
        generated: [videoUrl],
        status: 'COMPLETED'
      }
    });
  } catch (err) {
    console.error('[API] LTX Direct failed:', err.message);
    next(err);
  }
});

// --- PixVerse Direct API (Native) ---
// Text-to-Video generation
router.post('/pixverse/text-to-video', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] PixVerse text-to-video generation');
    const result = await generateQueue.add(() => pixverse.textToVideo(req.body));

    // Normalize response format: PixVerse returns { Resp: { video_id } }, we return { task_id }
    if (result.error) {
      return res.status(400).json(result);
    }

    const videoId = result.Resp?.video_id;
    if (!videoId) {
      return res.status(400).json({ error: { message: 'No video_id in response' } });
    }

    res.json({ task_id: videoId });
  } catch (err) {
    console.error('[API] PixVerse text-to-video failed:', err.message);
    next(err);
  }
});

// Image-to-Video generation (auto-uploads image first)
router.post('/pixverse/image-to-video', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] PixVerse image-to-video generation');
    const result = await generateQueue.add(() => pixverse.imageToVideo(req.body));

    if (result.error) {
      return res.status(400).json(result);
    }

    const videoId = result.Resp?.video_id;
    if (!videoId) {
      return res.status(400).json({ error: { message: 'No video_id in response' } });
    }

    res.json({ task_id: videoId });
  } catch (err) {
    console.error('[API] PixVerse image-to-video failed:', err.message);
    next(err);
  }
});

// Sound effect generation
router.post('/pixverse/sound-effect', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] PixVerse sound effect generation');
    const result = await generateQueue.add(() => pixverse.soundEffectGenerate(req.body));

    if (result.error) {
      return res.status(400).json(result);
    }

    const videoId = result.Resp?.video_id || result.Resp?.task_id;
    if (!videoId) {
      return res.status(400).json({ error: { message: 'No video_id or task_id in response' } });
    }

    res.json({ task_id: videoId });
  } catch (err) {
    console.error('[API] PixVerse sound effect failed:', err.message);
    next(err);
  }
});

// Get video generation status
router.get('/pixverse/status/:videoId', async (req, res, next) => {
  try {
    const result = await pixverse.getVideoStatus(req.params.videoId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
