/**
 * Social Media Routes
 * Handles content publishing to social platforms
 */

import { Router } from 'express';
import { generationLimiter } from '../middleware/rateLimiter.js';
import generateQueue from '../queue/index.js';
import * as socialService from '../services/socialService.js';

const router = Router();

// --- Social Publishing ---
router.post('/social/publish', generationLimiter, async (req, res, next) => {
  try {
    const { platform, media_url, caption } = req.body;
    
    if (!platform) {
      return res.status(400).json({ error: 'Platform is required' });
    }
    
    console.log(`[API] Social publish request for ${platform}`);
    const result = await generateQueue.add(() => socialService.publishToSocial(req.body));
    
    res.json({
      success: true,
      task_id: result.post_id,
      data: result
    });
  } catch (error) {
    console.error('[API] Social publish failed:', error.message);
    next(error);
  }
});

router.get('/social/status/:taskId', async (req, res, next) => {
  try {
    const result = await socialService.getPublishStatus(req.params.taskId);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;
