import { Worker } from 'bullmq';
import { createRedisConnection } from '../../../api/utils/redis.js';
import { updateJobStatus, getJob } from './jobTrackerService.js';
import processorRegistry from './processorRegistry.js';

/**
 * Rendering Worker
 * 
 * Processes heavy VFX tasks from the BullMQ queue.
 */

const connection = createRedisConnection();

let renderingWorker = null;

// Only start the worker in non-production environments or if explicitly enabled
// Serverless environments like Vercel will crash if we try to start a persistent worker
if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_WORKER === 'true') {
  renderingWorker = new Worker('vfx-jobs', async (job) => {
    const { jobId, jobType, payload } = job.data;
    
    console.log(`[Worker] Starting job ${jobId} (type: ${jobType})...`);

    const processorFn = processorRegistry.get(jobType);
    if (!processorFn) {
      throw new Error(`No processor registered for jobType: ${jobType}`);
    }

    try {
      // Update status to processing
      await updateJobStatus(jobId, { status: 'processing' });

      // Run the actual workload
      const result = await processorFn(payload, async (progress) => {
        // Check for pause signal in tracker
        const currentJob = await getJob(jobId);
        if (currentJob?.status === 'paused') {
          // Simple implementation: wait until resumed
          while ((await getJob(jobId))?.status === 'paused') {
            await new Promise(r => setTimeout(r, 2000));
          }
        }

        // Optional: Throttle progress updates to avoid hitting Firestore rate limits
        await updateJobStatus(jobId, { progress: Math.min(99, Math.round(progress)) });
      });

      // Update status to completed with the final result
      await updateJobStatus(jobId, {
        status: 'completed',
        progress: 100,
        resultUrl: typeof result === 'string' ? result : (result?.url || result?.resultUrl || null),
        resultData: typeof result === 'object' ? result : null
      });
      
      console.log(`[Worker] Job ${jobId} completed.`);
      return result;
    } catch (err) {
      console.error(`[Worker] Job ${jobId} failed:`, err);
      
      // Update status to failed
      await updateJobStatus(jobId, {
        status: 'failed',
        error: err.message || 'An unknown error occurred during processing'
      });
      throw err;
    }
  }, { connection });

  renderingWorker.on('error', err => {
    console.error('[Worker] Error:', err);
  });

  console.log('🚀 Rendering Worker started successfully');
} else {
  console.log('ℹ️ Rendering Worker skipped (Production/Serverless environment)');
}

export { renderingWorker };
