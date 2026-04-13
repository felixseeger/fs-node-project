import { Router } from 'express';
import crypto from 'crypto';

const router = Router();

/**
 * POST /api/audio/waveform
 * Generates an array of normalized peak values for a given audio URL.
 * Mock implementation generating peaks based on the URL hash for demonstration.
 */
router.post('/audio/waveform', async (req, res, next) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'Missing audio url' });
    }

    // Generate pseudo-random peaks based on the URL to ensure consistent waveforms for the same URL
    const hash = crypto.createHash('sha256').update(url).digest('hex');
    const peaks = [];
    let seed = parseInt(hash.substring(0, 8), 16);

    for (let i = 0; i < 200; i++) {
      // Linear congruential generator for pseudo-random values between -1 and 1
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const val = (seed / 0x7fffffff) * 2 - 1;
      peaks.push(parseFloat(val.toFixed(3)));
    }

    res.json({
      success: true,
      peaks
    });
  } catch (error) {
    next(error);
  }
});

export default router;