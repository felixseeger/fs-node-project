import { Router } from 'express';
import { getJob, createJob, updateJobStatus } from '../services/jobTrackerService.js';
import { generateLtxVideo } from '../services/ltxService.js';
import { extractMatte } from '../services/corridorKeyService.js';
import { processAndCompositeImages } from '../services/imageProcessingService.js';
import vfxQueue from '../queue/vfxQueue.js';

const router = Router();

// Helper to construct the webhook URL
function getWebhookUrl(req, jobId) {
  // If deployed on Vercel or similar, PUBLIC_URL should be set in environment variables
  // Otherwise, fallback to constructing it from the request object (mostly for local testing, though webhooks need public URLs)
  const baseUrl = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/api/webhooks/vfx-complete?jobId=${jobId}`;
}

/**
 * GET /api/vfx/job/:id/status
 * Poll endpoint for frontend nodes to check async job status.
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
 * Initiates an async LTX video generation job via Fal.ai
 */
router.post('/vfx/ltx/generate', async (req, res, next) => {
  try {
    const { prompt, width, height, frames, image_url } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    // 1. Create a tracking job in Firestore (or in-memory fallback)
    const job = await createJob('fal-ltx', { prompt });
    const webhookUrl = getWebhookUrl(req, job.id);

    // 2. Call the Fal.ai Serverless endpoint asynchronously
    // We don't await the final completion, just the queue submission
    try {
      await generateLtxVideo(prompt, webhookUrl, { width, height, frames, image_url });
    } catch (error) {
      await updateJobStatus(job.id, { status: 'failed', error: error.message });
      throw error;
    }

    // 3. Return the jobId to the client so it can poll
    res.json({
      success: true,
      jobId: job.id,
      status: 'pending',
      message: 'LTX generation job submitted'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/vfx/corridorkey/extract
 * Initiates an async AI matte extraction job via RunPod/Modal
 */
router.post('/vfx/corridorkey/extract', async (req, res, next) => {
  try {
    const { videoUrl, sensitivity, refinement } = req.body;
    
    if (!videoUrl) {
      return res.status(400).json({ error: 'Missing videoUrl' });
    }

    // 1. Create a tracking job
    const job = await createJob('runpod-corridorkey', { videoUrl });
    const webhookUrl = getWebhookUrl(req, job.id);

    // 2. Call the Serverless endpoint
    try {
      await extractMatte(videoUrl, webhookUrl, { sensitivity, refinement });
    } catch (error) {
      await updateJobStatus(job.id, { status: 'failed', error: error.message });
      throw error;
    }

    // 3. Return the jobId to the client
    res.json({
      success: true,
      jobId: job.id,
      status: 'pending',
      message: 'CorridorKey extraction job submitted'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/vfx/render
 * Server-side rendering fallback for high-res exports.
 * Accepts composition data (layers, effects, dimensions) and initiates a render job.
 */
router.post('/vfx/render', async (req, res, next) => {
  try {
    const { layers, dimensions, duration } = req.body;
    
    if (!layers || !dimensions) {
      return res.status(400).json({ error: 'Missing required composition data' });
    }

    // 1. Create a tracking job in Firestore (or in-memory fallback)
    const job = await createJob('internal-render', { 
      progress: 0 
    });

    // 2. Submit the heavy rendering task to the local queue
    vfxQueue.add(async () => {
      try {
        console.log(`[VFX Render] Starting job ${job.id}`);
        // Simulate a long-running render process
        for (let i = 1; i <= 5; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          // Update progress
          await getJob(job.id).then(async j => {
            if (j) {
              await updateJobStatus(job.id, { progress: i * 20 });
            }
          });
        }
        
        // Finalize the job with a mock result URL
        await updateJobStatus(job.id, {
          status: 'completed',
          progress: 100,
          resultUrl: `https://example.com/renders/${job.id}.webm`
        });
        console.log(`[VFX Render] Completed job ${job.id}`);
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
 * Composites multiple image layers together and applies optional filters.
 */
router.post('/vfx/image/composite', async (req, res, next) => {
  try {
    const { layers, filters } = req.body;
    
    if (!layers || !Array.isArray(layers) || layers.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid layers array' });
    }

    // Perform the compositing and filtering
    const resultBuffer = await processAndCompositeImages(layers, filters);

    // Return the composited image buffer directly
    res.type('image/png').send(resultBuffer);
  } catch (error) {
    next(error);
  }
});

export default router;
