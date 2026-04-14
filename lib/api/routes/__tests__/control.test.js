import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as controlRouter from '../control.js';
import { vfxQueue } from '../../services/workerService.js';
import { updateJobStatus } from '../../services/jobTrackerService.js';
import express from 'express';
import request from 'supertest';

vi.mock('../../services/workerService.js', () => ({
  vfxQueue: {
    pause: vi.fn(),
    resume: vi.fn(),
    getJob: vi.fn()
  }
}));

vi.mock('../../services/jobTrackerService.js', () => ({
  updateJobStatus: vi.fn()
}));

const app = express();
app.use(express.json());
app.use('/api', controlRouter.default);
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

describe('control.js routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/queue/pause', () => {
    it('pauses the queue', async () => {
      vfxQueue.pause.mockResolvedValueOnce();
      const res = await request(app).post('/api/queue/pause');
      expect(res.status).toBe(200);
      expect(vfxQueue.pause).toHaveBeenCalled();
    });

    it('handles errors', async () => {
      vfxQueue.pause.mockRejectedValueOnce(new Error('Failed to pause'));
      const res = await request(app).post('/api/queue/pause');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to pause' });
    });
  });

  describe('POST /api/queue/resume', () => {
    it('resumes the queue', async () => {
      vfxQueue.resume.mockResolvedValueOnce();
      const res = await request(app).post('/api/queue/resume');
      expect(res.status).toBe(200);
      expect(vfxQueue.resume).toHaveBeenCalled();
    });

    it('handles errors', async () => {
      vfxQueue.resume.mockRejectedValueOnce(new Error('Failed to resume'));
      const res = await request(app).post('/api/queue/resume');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to resume' });
    });
  });

  describe('POST /api/jobs/:id/pause', () => {
    it('returns 404 if job not found', async () => {
      vfxQueue.getJob.mockResolvedValueOnce(null);
      const res = await request(app).post('/api/jobs/123/pause');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Job not found in queue' });
    });

    it('updates job status to paused', async () => {
      vfxQueue.getJob.mockResolvedValueOnce({ id: '123' });
      updateJobStatus.mockResolvedValueOnce();
      const res = await request(app).post('/api/jobs/123/pause');
      expect(res.status).toBe(200);
      expect(updateJobStatus).toHaveBeenCalledWith('123', { status: 'paused' });
    });

    it('handles errors', async () => {
      vfxQueue.getJob.mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app).post('/api/jobs/123/pause');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'DB error' });
    });
  });

  describe('POST /api/jobs/:id/resume', () => {
    it('returns 404 if job not found', async () => {
      vfxQueue.getJob.mockResolvedValueOnce(null);
      const res = await request(app).post('/api/jobs/123/resume');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Job not found in queue' });
    });

    it('updates job status to pending', async () => {
      vfxQueue.getJob.mockResolvedValueOnce({ id: '123' });
      updateJobStatus.mockResolvedValueOnce();
      const res = await request(app).post('/api/jobs/123/resume');
      expect(res.status).toBe(200);
      expect(updateJobStatus).toHaveBeenCalledWith('123', { status: 'pending' });
    });

    it('handles errors', async () => {
      vfxQueue.getJob.mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app).post('/api/jobs/123/resume');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'DB error' });
    });
  });
});
