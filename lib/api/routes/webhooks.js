import { Router } from 'express';
import { updateJobStatus, getJob } from '../services/jobTrackerService.js';
import { stripeWebhookHandler } from './billing.js';

const router = Router();

/**
 * POST /api/webhooks/stripe
 * Stripe Webhook handler for processing payments and granting credits.
 */
router.post('/webhooks/stripe', stripeWebhookHandler);

/**
 * POST /api/webhooks/vfx-complete
 * Public endpoint for async worker providers (RunPod/Fal.ai) to report job completion.
 * Expects a JSON body with { jobId, resultUrl, error, status }
 * 
 * Security: Validates webhook secret token to prevent unauthorized access.
 */
router.post('/webhooks/vfx-complete', async (req, res, next) => {
  try {
    // Verify webhook secret token to prevent unauthorized requests
    const webhookSecret = process.env.VFX_WEBHOOK_SECRET;
    if (webhookSecret) {
      const providedSecret = req.headers['x-webhook-secret'] || req.query.secret;
      if (providedSecret !== webhookSecret) {
        console.warn('[Webhook Security] Invalid or missing webhook secret');
        return res.status(401).json({ error: 'Unauthorized: Invalid webhook secret' });
      }
    } else {
      console.warn('[Webhook Security Warning] VFX_WEBHOOK_SECRET not set. Webhook is unprotected.');
    }

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
