import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { getJob, createJob, updateJobStatus } from '../services/jobTrackerService.js';
import { submitJob } from '../services/workerService.js';
import { generateLtxVideo, pollLtxStatus } from '../services/ltxService.js';
import { extractMatte } from '../services/corridorKeyService.js';
import { processAndCompositeImages } from '../services/imageProcessingService.js';
import vfxQueue from '../queue/vfxQueue.js';

const router = Router();

// Helper to construct the webhook URL
function getWebhookUrl(req, jobId) {
  const baseUrl = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/api/webhooks/vfx-complete?jobId=${jobId}`;
}

/**
 * GET /api/vfx/job/:id/status
 */
router.get('/vfx/job/:id/status', async (req, res, next) => {
  try {
    const job = await getJob(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({
      id: job.id,
      status: job.status,
      progress: job.progress || 0,
      resultUrl: job.resultUrl || null,
      error: job.error || null
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/vfx/ltx/generate
 */
router.post('/vfx/ltx/generate', async (req, res, next) => {
  try {
    const { prompt, width, height, frames, image_url } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const jobId = await submitJob('fal-ltx', { prompt, width, height, frames, image_url }, async (payload, onProgress) => {
      if (process.env.FAL_KEY) {
        const result = await generateLtxVideo(payload.prompt, null, payload);
        if (result.request_id) {
          return await pollLtxStatus(result.request_id, onProgress);
        }
        return result;
      } else {
        for (let i = 0; i <= 100; i += 20) {
          await new Promise(r => setTimeout(r, 1000));
          await onProgress(i);
        }
        return 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      }
    });

    res.json({
      success: true,
      jobId,
      status: 'pending',
      message: 'LTX generation job submitted'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/vfx/corridorkey/extract
 */
router.post('/vfx/corridorkey/extract', async (req, res, next) => {
  try {
    const { videoUrl, sensitivity, refinement } = req.body;
    
    if (!videoUrl) {
      return res.status(400).json({ error: 'Missing videoUrl' });
    }

    const jobId = await submitJob('runpod-corridorkey', { videoUrl, sensitivity, refinement }, async (payload, onProgress) => {
      if (process.env.RUNPOD_API_KEY) {
        const result = await extractMatte(payload.videoUrl, null, payload);
        return result;
      } else {
        for (let i = 0; i <= 100; i += 25) {
          await new Promise(r => setTimeout(r, 1500));
          await onProgress(i);
        }
        return payload.videoUrl;
      }
    });

    res.json({
      success: true,
      jobId,
      status: 'pending',
      message: 'CorridorKey extraction job submitted'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/vfx/render
 */
router.post('/vfx/render', async (req, res, next) => {
  try {
    const { layers, dimensions, duration } = req.body;
    
    if (!layers || !dimensions) {
      return res.status(400).json({ error: 'Missing required composition data' });
    }

    const job = await createJob('internal-render', { progress: 0 });

    vfxQueue.add(async () => {
      try {
        console.log(`[VFX Render] Processing mock render job ${job.id}...`);
        
        await new Promise(r => setTimeout(r, 2000));
        
        await updateJobStatus(job.id, {
          status: 'completed',
          progress: 100,
          resultUrl: `https://mock-bucket.s3.amazonaws.com/renders/${job.id}/out.mp4`,
        });
        console.log(`[VFX Render] Mock render job ${job.id} completed.`);
      } catch (error) {
        console.error(`[VFX Render] Job ${job.id} failed:`, error);
        await updateJobStatus(job.id, {
          status: 'failed',
          error: error.message
        });
      }
    });

    res.json({
      success: true,
      jobId: job.id,
      status: 'pending',
      message: 'High-res render job submitted successfully to local queue'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/vfx/image/composite
 */
router.post('/vfx/image/composite', async (req, res, next) => {
  try {
    const { layers, filters } = req.body;
    
    if (!layers || !Array.isArray(layers) || layers.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid layers array' });
    }

    const resultBuffer = await processAndCompositeImages(layers, filters);
    res.type('image/png').send(resultBuffer);
  } catch (error) {
    next(error);
  }
});

export default router;
