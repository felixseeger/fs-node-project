/**
 * Cloud Sync Routes
 * Handles file synchronization to cloud storage providers
 */

import { Router } from 'express';
import { generationLimiter } from '../middleware/rateLimiter.js';
import generateQueue from '../queue/index.js';
import * as cloudService from '../services/cloudService.js';

const router = Router();

// --- Cloud Sync ---
router.post('/cloud/sync', generationLimiter, async (req, res, next) => {
  try {
    const { provider, media_url, folder_path } = req.body;
    
    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }
    
    console.log(`[API] Cloud sync request for ${provider}`);
    const result = await generateQueue.add(() => cloudService.syncToCloud(req.body));
    
    res.json({
      success: true,
      task_id: result.file_id,
      data: result
    });
  } catch (error) {
    console.error('[API] Cloud sync failed:', error.message);
    next(error);
  }
});

router.get('/cloud/status/:taskId', async (req, res, next) => {
  try {
    const result = await cloudService.getCloudSyncStatus(req.params.taskId);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;
