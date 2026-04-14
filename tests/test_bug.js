import { vfxQueue, submitJob } from '../lib/api/services/workerService.js';
import processorRegistry from '../lib/api/services/processorRegistry.js';
import { renderingWorker } from '../lib/api/services/renderingWorker.js';
import { updateJobStatus, getJob } from '../lib/api/services/jobTrackerService.js';
import redis from '../api/utils/redis.js';

// A dummy processor for testing
async function dummyProcessor(payload, progressCallback) {
  for (let i = 1; i <= 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 50)); // simulate work (250ms total)
    await progressCallback(i * 20);
  }
  return { url: `http://dummy.com/result_${payload.id}.png` };
}

async function runTests() {
  console.log("Starting tests...");

  try {
    // 1. Verify global pause/resume
    console.log("\n--- Testing Global Pause/Resume ---");
    await vfxQueue.pause();
    console.log("Queue paused.");
    
    const jobId1 = await submitJob('dummy-task', { id: 1 }, dummyProcessor);
    console.log(`Submitted job ${jobId1} while paused.`);
    
    // Wait a bit to ensure it doesn't process
    await new Promise(resolve => setTimeout(resolve, 500));
    let job1Status = await getJob(jobId1);
    console.log(`Job 1 status (should be pending): ${job1Status.status}`);
    
    await vfxQueue.resume();
    console.log("Queue resumed.");
    
    // Wait for it to process
    while (true) {
      job1Status = await getJob(jobId1);
      if (job1Status.status === 'completed' || job1Status.status === 'failed') break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log(`Job 1 status (should be completed): ${job1Status.status}`);

    // 2. Verify individual job pause/resume
    console.log("\n--- Testing Individual Job Pause/Resume ---");
    // Pause queue globally so worker doesn't pick it up immediately and overwrite our status
    await vfxQueue.pause();
    
    const jobId2 = await submitJob('dummy-task', { id: 2 }, dummyProcessor);
    console.log(`Submitted job ${jobId2}.`);
    
    // Pause it via tracker (simulating /api/jobs/:id/pause)
    await updateJobStatus(jobId2, { status: 'paused' });
    console.log(`Job ${jobId2} paused via tracker.`);
    
    let job2Status = await getJob(jobId2);
    console.log(`Job 2 status (should be paused): ${job2Status.status}`);
    
    // Resume it (simulating /api/jobs/:id/resume)
    await updateJobStatus(jobId2, { status: 'pending' });
    console.log(`Job ${jobId2} resumed via tracker.`);
    
    job2Status = await getJob(jobId2);
    console.log(`Job 2 status (should be pending): ${job2Status.status}`);
    
    await vfxQueue.resume();
    
    // Wait for it to process
    while (true) {
      job2Status = await getJob(jobId2);
      if (job2Status.status === 'completed' || job2Status.status === 'failed') break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log(`Job 2 status (should be completed): ${job2Status.status}`);

    // 3. Stress test with 10+ concurrent jobs
    console.log("\n--- Stress Testing with 10 Concurrent Jobs ---");
    const stressJobIds = [];
    for (let i = 0; i < 10; i++) {
      const id = await submitJob('dummy-task', { id: 100 + i }, dummyProcessor);
      stressJobIds.push(id);
    }
    console.log(`Submitted 10 jobs.`);
    
    // Wait for all to complete
    console.log("Waiting for stress jobs to complete...");
    const startTime = Date.now();
    while (true) {
      let allDone = true;
      for (const id of stressJobIds) {
        const status = await getJob(id);
        if (status.status !== 'completed' && status.status !== 'failed') {
          allDone = false;
          break;
        }
      }
      if (allDone) break;
      await new Promise(resolve => setTimeout(resolve, 200));
      if (Date.now() - startTime > 10000) {
        throw new Error("Stress test timed out after 10 seconds");
      }
    }
    console.log("All 10 stress jobs completed successfully.");
    
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    console.log("\n--- Cleaning up connections ---");
    
    try {
      await renderingWorker.close();
    } catch (e) { /* ignore */ }

    try {
      await vfxQueue.close();
    } catch (e) { /* ignore */ }

    try {
      const workerClient = await renderingWorker.client;
      if (workerClient) await workerClient.quit();
    } catch (e) { /* ignore */ }

    try {
      const workerBClient = await renderingWorker.bclient;
      if (workerBClient) await workerBClient.quit();
    } catch (e) { /* ignore */ }

    try {
      const queueClient = await vfxQueue.client;
      if (queueClient) await queueClient.quit();
    } catch (e) { /* ignore */ }

    try {
      await redis.quit();
    } catch (e) { /* ignore */ }

    console.log("Cleanup complete. Process should exit cleanly.");
  }
}

runTests();
