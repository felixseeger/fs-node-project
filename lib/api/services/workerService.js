import { Queue } from 'bullmq';
import { createRedisConnection } from '../../../api/utils/redis.js';
import { createJob } from './jobTrackerService.js';
import processorRegistry from './processorRegistry.js';

/**
 * Worker Service
 * 
 * Orchestrates the execution of heavy VFX tasks using BullMQ.
 * 
 * DESIGN PATTERN: Submit -> Poll -> Complete
 */

const connection = createRedisConnection();
export const vfxQueue = new Queue('vfx-jobs', { connection });

/**
 * Submits a new VFX job for background processing.
 * 
 * @param {string} jobType - Unique identifier for the type of task (e.g., 'corridorkey', 'vfx-render')
 * @param {object} payload - Input data for the task
 * @param {function} processorFn - (Deprecated) Processor is now retrieved from processorRegistry.
 * @returns {Promise<string>} - Returns the unique jobId immediately.
 */
export async function submitJob(jobType, payload, processorFn) {
  // Register the processor function if provided
  if (processorFn && !processorRegistry.has(jobType)) {
    processorRegistry.set(jobType, processorFn);
  }

  // 1. Create a persistent job record in Firestore (or memory fallback)
  const job = await createJob(jobType, { 
    payload,
    status: 'pending',
    progress: 0
  });
  
  const jobId = job.id;
  console.log(`[Worker] Job ${jobId} submitted: ${jobType}`);

  // 2. Add the task to the BullMQ queue
  await vfxQueue.add(jobType, { jobId, jobType, payload }, { jobId });

  return jobId;
}

/**
 * Helper to get job status (re-exports from jobTracker for convenience)
 */
export { getJob as getJobStatus } from './jobTrackerService.js';
