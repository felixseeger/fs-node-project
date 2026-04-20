import { Router } from 'express';
import * as google from '../services/google.js';
import * as replicate from '../services/replicate.js';
import * as ideogram from '../services/ideogram.js';
import * as fal from '../services/fal.js';
import * as heygen from '../services/heygen.js';

const router = Router();

router.get('/debug/providers', async (req, res) => {
  const results = {
    timestamp: new Date().toISOString(),
    providers: {},
    env: {}
  };

  // Check credentials
  results.env = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY ? '✓' : '✗ MISSING',
    REPLICATE_API_KEY: process.env.REPLICATE_API_KEY ? '✓' : '✗ MISSING',
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN ? '✓' : '✗ MISSING',
    IDEOGRAM_API_KEY: process.env.IDEOGRAM_API_KEY ? '✓' : '✗ MISSING',
    FAL_API_KEY: process.env.FAL_API_KEY ? '✓' : '✗ MISSING',
  };

  // Test Google
  try {
    const googleResult = await google.generateImage({
      prompt: 'red square',
      model: 'Nano Banana 2',
      aspect_ratio: '1:1'
    });
    results.providers.google = {
      status: 'OK',
      response: googleResult.data?.[0]?.url ? '✓ URL returned' : '✗ No URL'
    };
  } catch (err) {
    results.providers.google = {
      status: 'FAILED',
      error: err.message,
      code: err.status
    };
  }

  // Test Replicate
  try {
    const replicateResult = await replicate.generateImage({
      prompt: 'red square',
      model: 'flux-1-1-pro',
      aspect_ratio: '1:1'
    });
    results.providers.replicate = {
      status: 'OK',
      response: replicateResult.data?.[0]?.url ? '✓ URL returned' : '✗ No URL'
    };
  } catch (err) {
    results.providers.replicate = {
      status: 'FAILED',
      error: err.message,
      code: err.status
    };
  }

  // Test Ideogram
  try {
    const ideogramResult = await ideogram.generateImage({
      prompt: 'red square',
      model: 'ideogram-v3-turbo',
      aspect_ratio: '1:1'
    });
    results.providers.ideogram = {
      status: 'OK',
      response: ideogramResult.data?.[0]?.url ? '✓ URL returned' : '✗ No URL'
    };
  } catch (err) {
    results.providers.ideogram = {
      status: 'FAILED',
      error: err.message,
      code: err.status
    };
  }

  // Test KLING 3 (image-to-video)
  try {
    const klingResult = await fal.generateKlingVideo({
      prompt: 'a spinning red cube',
      start_image_url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=512&h=512&fit=crop',
      duration: '5',
      generate_audio: false
    });
    results.providers.kling3 = {
      status: 'OK',
      response: klingResult.task_id ? '✓ Task submitted' : '✗ No task_id'
    };
  } catch (err) {
    results.providers.kling3 = {
      status: 'FAILED',
      error: err.message,
      code: err.status
    };
  }

  // Test HeyGen (text-to-video)
  try {
    const heygenResult = await heygen.generateHeyGenVideo({
      prompt: 'Hello, this is a test message',
      avatar: 'auto',
      voice: 'auto'
    });
    results.providers.heygen = {
      status: 'OK',
      response: heygenResult.task_id ? '✓ Task submitted' : '✗ No task_id'
    };
  } catch (err) {
    results.providers.heygen = {
      status: 'FAILED',
      error: err.message,
      code: err.status
    };
  }

  res.json(results);
});

export default router;
