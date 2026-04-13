import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import renderRouter from '../lib/api/routes/render.js';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Mock Remotion modules
vi.mock('@remotion/bundler', () => ({
  bundle: vi.fn().mockResolvedValue('mock-serve-url'),
}));

vi.mock('@remotion/renderer', () => ({
  selectComposition: vi.fn().mockResolvedValue({
    id: 'MainComposition',
    durationInFrames: 300,
    fps: 30,
    width: 1920,
    height: 1080,
  }),
  renderMedia: vi.fn().mockImplementation(async ({ outputLocation }) => {
    // Simulate creating the output file
    fs.writeFileSync(outputLocation, 'mock-video-content');
  }),
}));

describe('POST /api/render-video', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', renderRouter);
    vi.clearAllMocks();
  });

  it('should return 400 if layers are missing or invalid', async () => {
    const res = await request(app).post('/api/render-video').send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid or missing layers array' });

    const res2 = await request(app).post('/api/render-video').send({ layers: 'not-an-array' });
    expect(res2.status).toBe(400);
    expect(res2.body).toEqual({ error: 'Invalid or missing layers array' });
  });

  it('should render video and return it as an attachment', async () => {
    const mockLayers = [
      { id: 'layer1', type: 'image', src: 'image.png', from: 0, durationInFrames: 100, zIndex: 1 },
      { id: 'layer2', type: 'text', src: 'Hello', from: 50, durationInFrames: 50, zIndex: 2 },
    ];

    const res = await request(app)
      .post('/api/render-video')
      .send({ layers: mockLayers })
      .responseType('blob'); // Expect binary data

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('video/mp4');
    expect(res.headers['content-disposition']).toMatch(/attachment; filename="render-.*\.mp4"/);
    
    // The response body should be the mock video content
    expect(res.body.toString()).toBe('mock-video-content');

    // Verify mocks were called correctly
    const { bundle } = await import('@remotion/bundler');
    const { selectComposition, renderMedia } = await import('@remotion/renderer');

    expect(bundle).toHaveBeenCalledTimes(1);
    expect(selectComposition).toHaveBeenCalledTimes(1);
    expect(selectComposition).toHaveBeenCalledWith(expect.objectContaining({
      id: 'MainComposition',
      inputProps: { layers: mockLayers },
    }));
    expect(renderMedia).toHaveBeenCalledTimes(1);
    expect(renderMedia).toHaveBeenCalledWith(expect.objectContaining({
      codec: 'h264',
      inputProps: { layers: mockLayers },
    }));
  });
});
