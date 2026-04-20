import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mock all dependencies of images.js before importing it
vi.mock('file-type', () => ({
  fileTypeFromBuffer: vi.fn().mockResolvedValue({ ext: 'png', mime: 'image/png' })
}));

vi.mock('../services/freepik.js', () => ({
  generateImage: vi.fn(),
  getTaskStatus: vi.fn()
}));

vi.mock('../services/google.js', () => ({
  generateImage: vi.fn()
}));

vi.mock('../queue/index.js', () => ({
  default: {
    add: vi.fn(cb => cb())
  }
}));

vi.mock('../middleware/rateLimiter.js', () => ({
  generationLimiter: (req, res, next) => next()
}));

// Now import the router
import imagesRouter from '../images.js';

const app = express();
app.use(express.json());
app.use('/api', imagesRouter);

describe('images.js upload route simplified', () => {
  it('returns 200 for valid image upload', async () => {
    const res = await request(app)
      .post('/api/upload-image')
      .attach('images', Buffer.from('fake-image'), 'test.png');
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });
});
