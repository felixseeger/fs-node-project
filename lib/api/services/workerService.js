import vfxQueue from '../queue/vfxQueue.js';
import { createJob, updateJobStatus } from './jobTrackerService.js';

/**
 * Worker Service
 * 
 * Orchestrates the execution of heavy VFX tasks using a combination of:
 * 1. p-queue for local concurrency control.
 * 2. jobTrackerService (Firestore) for persistent job state and polling.
 * 
 * DESIGN PATTERN: Submit -> Poll -> Complete
 * 
 * This service can be easily adapted to use a distributed queue like 
 * Upstash Redis (BullMQ) or AWS SQS in the future.
 */

/**
 * Submits a new VFX job for background processing.
 * 
 * @param {string} jobType - Unique identifier for the type of task (e.g., 'corridorkey', 'vfx-render')
 * @param {object} payload - Input data for the task
 * @param {function} processorFn - Async function that performs the actual work. 
 *                                 Receives (payload, progressCallback).
 * @returns {Promise<string>} - Returns the unique jobId immediately.
 */
export async function submitJob(jobType, payload, processorFn) {
  // 1. Create a persistent job record in Firestore (or memory fallback)
  const job = await createJob(jobType, { 
    payload,
    status: 'pending',
    progress: 0
  });
  
  const jobId = job.id;
  console.log(`[Worker] Job ${jobId} submitted: ${jobType}`);

  // 2. Add the task to the concurrency-controlled queue
  // Note: We don't await this; we want to return the jobId to the client ASAP.
  vfxQueue.add(async () => {
    console.log(`[Worker] Starting job ${jobId}...`);
    
    try {
      // Update status to processing
      await updateJobStatus(jobId, { status: 'processing' });

      // Run the actual workload
      const result = await processorFn(payload, async (progress) => {
        // Optional: Throttle progress updates to avoid hitting Firestore rate limits
        await updateJobStatus(jobId, { progress: Math.min(99, Math.round(progress)) });
      });

      // Update status to completed with the final result
      await updateJobStatus(jobId, {
        status: 'completed',
        progress: 100,
        resultUrl: typeof result === 'string' ? result : (result.url || result.resultUrl || null),
        resultData: typeof result === 'object' ? result : null
      });
      
      console.log(`[Worker] Job ${jobId} completed.`);
    } catch (err) {
      console.error(`[Worker] Job ${jobId} failed:`, err);
      
      // Update status to failed
      await updateJobStatus(jobId, {
        status: 'failed',
        error: err.message || 'An unknown error occurred during processing'
      });
    }
  });

  return jobId;
}

/**
 * Helper to get job status (re-exports from jobTracker for convenience)
 */
export { getJob as getJobStatus } from './jobTrackerService.js';
