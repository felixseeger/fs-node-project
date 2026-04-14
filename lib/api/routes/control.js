import { Router } from 'express';
import { vfxQueue } from '../services/workerService.js';
import { updateJobStatus } from '../services/jobTrackerService.js';

const router = Router();

/**
 * @route POST /api/queue/pause
 * @desc Pause the vfx-rendering queue
 */
router.post('/queue/pause', async (req, res, next) => {
  try {
    await vfxQueue.pause();
    res.json({ message: 'Queue paused successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/queue/resume
 * @desc Resume the vfx-rendering queue
 */
router.post('/queue/resume', async (req, res, next) => {
  try {
    await vfxQueue.resume();
    res.json({ message: 'Queue resumed successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/jobs/:id/pause
 * @desc Pause an individual job
 */
router.post('/jobs/:id/pause', async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await vfxQueue.getJob(id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found in queue' });
    }

    // BullMQ does not natively support pausing individual jobs.
    // We implement custom logic by updating the tracker status.
    await updateJobStatus(id, { status: 'paused' });
    
    res.json({ message: `Job ${id} paused successfully` });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/jobs/:id/resume
 * @desc Resume an individual job
 */
router.post('/jobs/:id/resume', async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await vfxQueue.getJob(id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found in queue' });
    }

    // Custom logic to resume the job in the tracker
    await updateJobStatus(id, { status: 'pending' });
    
    res.json({ message: `Job ${id} resumed successfully` });
  } catch (error) {
    next(error);
  }
});

export default router;
