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
    
    const { jobId, resultUrl, error, status } = req.body;
    
    if (!jobId) {
      return res.status(400).json({ error: 'Missing jobId' });
    }

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
