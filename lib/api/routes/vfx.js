import { Router } from 'express';
import { bundle } from '@remotion/bundler';
import { selectComposition, renderMedia } from '@remotion/renderer';
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

    const jobId = await submitJob('fal-ltx', { prompt, width, height, frames, image_url }, async (payload, onProgress) => {
      // If we have a key, call real API
      if (process.env.FAL_KEY) {
        const result = await generateLtxVideo(payload.prompt, null, payload);
        if (result.request_id) {
          // Poll until complete
          return await pollLtxStatus(result.request_id, onProgress);
        }
        return result;
      } else {
        // Mock for local dev
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
 * Initiates an async AI matte extraction job via RunPod/Modal
 */
router.post('/vfx/corridorkey/extract', async (req, res, next) => {
  try {
    const { videoUrl, sensitivity, refinement } = req.body;
    
    if (!videoUrl) {
      return res.status(400).json({ error: 'Missing videoUrl' });
    }

    const jobId = await submitJob('runpod-corridorkey', { videoUrl, sensitivity, refinement }, async (payload, onProgress) => {
      // If we have RunPod key, call real API
      if (process.env.RUNPOD_API_KEY) {
        const result = await extractMatte(payload.videoUrl, null, payload);
        return result;
      } else {
        // Mock
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
        
        // Path to the Remotion entry point in the frontend
        const entryPoint = path.resolve(process.cwd(), '../frontend/src/remotion/index.ts');
        
        console.log(`[VFX Render] Bundling Remotion project at ${entryPoint}...`);
        
        // Bundle the project
        const serveUrl = await bundle({
          entryPoint,
          webpackOverride: (config) => config,
        });

        console.log(`[VFX Render] Selecting composition...`);
        
        // Select the composition
        const composition = await selectComposition({
          serveUrl,
          id: 'MainComposition',
          inputProps: {
            layers,
          },
        });

        const outputLocation = path.resolve(process.cwd(), `../public/renders/${job.id}.mp4`);
        
        // Ensure directory exists
        const outputDir = path.dirname(outputLocation);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        console.log(`[VFX Render] Rendering media to ${outputLocation}...`);

        // Render the media
        await renderMedia({
          composition,
          serveUrl,
          codec: 'h264',
          outputLocation,
          inputProps: {
            layers,
          },
          onProgress: ({ progress }) => {
            updateJobStatus(job.id, { progress: Math.round(progress * 100) });
          },
        });
        
        // Finalize the job with the real result URL
        await updateJobStatus(job.id, {
          status: 'completed',
          progress: 100,
          resultUrl: `/renders/${job.id}.mp4`
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
