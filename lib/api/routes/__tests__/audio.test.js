import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as audioRouter from '../audio.js';
import * as google from '../../services/google.js';
import express from 'express';
import request from 'supertest';

vi.mock('../../services/google.js', () => ({
  transcribeAudio: vi.fn()
}));

vi.mock('../../services/freepik.js', () => ({
  generateMusic: vi.fn(),
  getMusicStatus: vi.fn()
}));

vi.mock('../../services/elevenlabs.js', () => ({
  generateVoiceover: vi.fn(),
  getVoices: vi.fn()
}));

vi.mock('../../queue/index.js', () => ({
  default: {
    add: vi.fn(cb => cb())
  }
}));

const app = express();
app.use(express.json());
// Add a mock error handler to catch next(err)
app.use('/api', audioRouter.default);
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large' });
  }
  res.status(500).json({ error: err.message });
});

describe('audio.js voice routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/transcribe-audio', () => {
    it('returns 200 and text from google.transcribeAudio', async () => {
      google.transcribeAudio.mockResolvedValue('Hello world');
      
      const res = await request(app)
        .post('/api/transcribe-audio')
        .send({ audioData: 'base64...' });
        
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, text: 'Hello world' });
      expect(google.transcribeAudio).toHaveBeenCalledWith({ audioData: 'base64...' });
    });

    it('passes errors to next()', async () => {
      google.transcribeAudio.mockRejectedValue(new Error('Transcription failed'));
      
      const res = await request(app)
        .post('/api/transcribe-audio')
        .send({});
        
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Transcription failed' });
    });
  });

  describe('POST /api/process-voice', () => {
    it('processes multipart upload and calls transcribeAudio', async () => {
      google.transcribeAudio.mockResolvedValue('Multipart test');
      
      const res = await request(app)
        .post('/api/process-voice')
        .attach('audio', Buffer.from('fake audio data'), {
          filename: 'test.webm',
          contentType: 'audio/webm'
        });
        
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, text: 'Multipart test' });
      expect(google.transcribeAudio).toHaveBeenCalledWith(expect.objectContaining({
        audio: expect.any(Buffer),
        mimeType: 'audio/webm',
        prompt: 'Transcribe this audio accurately. Output ONLY the transcription text.'
      }));
    });

    it('returns 400 if no audio file is uploaded', async () => {
      const res = await request(app)
        .post('/api/process-voice')
        .send({ prompt: 'test' });
        
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'No audio file uploaded' });
    });
    
    it('rejects files larger than 10MB', async () => {
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024, 'a'); // 11 MB
      
      const res = await request(app)
        .post('/api/process-voice')
        .attach('audio', largeBuffer, 'large.wav');
        
      expect(res.status).toBe(413);
      expect(res.body).toEqual({ error: 'File too large' });
    });
  });
});
