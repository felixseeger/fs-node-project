import { Router } from 'express';
import { generationLimiter } from '../middleware/rateLimiter.js';
import { createLumaClient } from '../services/luma.js';

const router = Router();

/**
 * Handle Luma Generation requests (Image or Video)
 */
router.post('/luma/generate', generationLimiter, async (req, res, next) => {
  try {
    const { prompt, model, aspect_ratio, resolution, duration, loop, keyframes, image_ref, style_ref, character_ref, modify_image_ref, mode, media, first_frame } = req.body;
    
    const apiKey = process.env.LUMA_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: { 
          message: 'LUMA_API_KEY not configured in .env',
          suggestion: 'Please add LUMA_API_KEY to your .env file to enable Luma generations.'
        } 
      });
    }

    const client = createLumaClient(apiKey);
    let result;

    // Determine if it's an image or video request based on the model name
    const isImageModel = model && (model.includes('photon') || model.startsWith('luma-photon'));
    const isModifyVideo = !!media?.url;

    if (isImageModel) {
      console.log(`[API] Luma Image generation: ${prompt} (${model})`);
      
      // Clean up parameters for Photon API
      const lumaModel = model.replace('luma-', ''); // e.g. luma-photon-1 -> photon-1
      
      result = await client.createImage({
        prompt,
        model: lumaModel,
        aspect_ratio,
        image_ref,
        style_ref,
        character_ref,
        modify_image_ref
      });
    } else if (isModifyVideo) {
      console.log(`[API] Luma Modify Video: ${prompt} (${model})`);
      
      const lumaModel = model.replace('luma-', '');
      
      result = await client.createVideo({
        prompt,
        model: lumaModel,
        media,
        first_frame,
        mode
      });
    } else {
      console.log(`[API] Luma Video generation: ${prompt} (${model})`);
      
      // Clean up parameters for Dream Machine API
      const lumaModel = model.replace('luma-', ''); // e.g. luma-ray-2 -> ray-2
      
      result = await client.createVideo({
        prompt,
        model: lumaModel,
        aspect_ratio,
        resolution,
        duration,
        loop,
        keyframes
      });
    }

    res.json({
      success: true,
      task_id: result.id,
      data: result
    });
  } catch (err) {
    console.error('[API] Luma generation failed:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data || { message: err.message }
    });
  }
});

/**
 * Poll status of a Luma generation
 */
router.get('/luma/status/:taskId', async (req, res, next) => {
  try {
    const apiKey = process.env.LUMA_API_KEY;
    if (!apiKey) throw new Error('LUMA_API_KEY not configured');

    const client = createLumaClient(apiKey);
    const result = await client.getStatus(req.params.taskId);

    // Map Luma states to our internal representation
    let internalStatus = 'PENDING';
    if (result.state === 'completed') internalStatus = 'COMPLETED';
    if (result.state === 'failed') internalStatus = 'FAILED';
    if (result.state === 'dreaming') internalStatus = 'PROCESSING';

    res.json({
      success: true,
      data: {
        task_id: result.id,
        status: internalStatus,
        generated: result.assets?.video ? [result.assets.video] : (result.assets?.image ? [result.assets.image] : []),
        error: result.failure_reason,
        raw: result
      }
    });
  } catch (err) {
    console.error('[API] Luma status check failed:', err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data || { message: err.message }
    });
  }
});

/**
 * List supported camera motions
 */
router.get('/luma/camera-motions', async (req, res, next) => {
  try {
    const apiKey = process.env.LUMA_API_KEY;
    if (!apiKey) throw new Error('LUMA_API_KEY not configured');

    const client = createLumaClient(apiKey);
    const motions = await client.getCameraMotions();
    res.json({ success: true, motions });
  } catch (err) {
    next(err);
  }
});

export default router;
