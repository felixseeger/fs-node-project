import { Router } from 'express';
import { updateJobStatus, getJob } from '../services/jobTrackerService.js';

const router = Router();

/**
 * POST /api/webhooks/vfx-complete
 * Public endpoint for async worker providers (RunPod/Fal.ai) to report job completion.
 * Expects a JSON body with { jobId, resultUrl, error, status }
 */
router.post('/webhooks/vfx-complete', async (req, res, next) => {
  try {
    // In production, you would want to verify a secret token or signature here
    // to ensure the request is genuinely from your worker provider.
    
    // Allow jobId from query string (appended to webhook URL) or body
    const jobId = req.query.jobId || req.body.jobId;
    
    if (!jobId) {
      return res.status(400).json({ error: 'Missing jobId' });
    }

    // Extract result URL flexibly depending on the provider's payload structure
    // Fal.ai typical structure: req.body.payload.video.url
    // RunPod typical structure: req.body.output.resultUrl or req.body.output.result
    // Fallback: req.body.resultUrl
    let resultUrl = req.body.resultUrl;
    if (!resultUrl && req.body.payload?.video?.url) {
      resultUrl = req.body.payload.video.url;
    }
    if (!resultUrl && req.body.output?.resultUrl) {
      resultUrl = req.body.output.resultUrl;
    }
    if (!resultUrl && req.body.output?.result) {
      resultUrl = req.body.output.result;
    }

    // Extract status and error flexibly
    let status = req.body.status || 'completed';
    // Normalize status (e.g., Fal.ai uses 'OK', RunPod uses 'COMPLETED')
    if (status === 'OK' || status === 'COMPLETED') status = 'completed';
    if (status === 'FAILED') status = 'failed';

    let error = req.body.error || req.body.payload?.error || null;

    const job = await getJob(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (resultUrl) updates.resultUrl = resultUrl;
    if (error) updates.error = error;
    
    // Default to completed if resultUrl is provided but no status
    if (!status && resultUrl) {
      updates.status = 'completed';
    }

    await updateJobStatus(jobId, updates);
    
    res.json({ success: true, message: 'Job status updated' });
  } catch (error) {
    console.error('[Webhook Error]', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

export default router;
