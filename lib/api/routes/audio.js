/**
 * Audio Generation Routes
 * Handles music generation, sound effects, and audio isolation
 * All routes make real API calls to Freepik audio services
 */

import { Router } from 'express';
import { generationLimiter } from '../middleware/rateLimiter.js';
import generateQueue from '../queue/index.js';
import * as freepik from '../services/freepik.js';
import * as elevenlabs from '../services/elevenlabs.js';

const router = Router();

// --- Music Generation ---
router.post('/music-generation', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Music generation:', req.body.prompt?.substring(0, 50) + '...');
    const result = await generateQueue.add(() => freepik.generateMusic(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Music generation failed:', err.message);
    next(err);
  }
});

router.get('/music-generation/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getMusicStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Sound Effects ---
router.post('/sound-effects', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Sound effects generation:', req.body.prompt?.substring(0, 50) + '...');
    const result = await generateQueue.add(() => freepik.generateSoundEffects(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Sound effects generation failed:', err.message);
    next(err);
  }
});

router.get('/sound-effects/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getSoundEffectsStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Audio Isolation ---
router.post('/audio-isolation', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Audio isolation');
    const result = await generateQueue.add(() => freepik.audioIsolation(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Audio isolation failed:', err.message);
    next(err);
  }
});

router.get('/audio-isolation/:taskId', async (req, res, next) => {
  try {
    const result = await freepik.getAudioIsolationStatus(req.params.taskId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Voiceover (ElevenLabs) ---
router.post('/voiceover', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Voiceover generation:', req.body.text?.substring(0, 50) + '...');
    const result = await generateQueue.add(() => elevenlabs.generateVoiceover(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Voiceover failed:', err.message);
    next(err);
  }
});

router.get('/voiceover/voices', async (req, res, next) => {
  try {
    const result = await elevenlabs.getVoices();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/voiceover/:taskId', async (req, res, next) => {
  try {
    // For ElevenLabs, we currently return COMPLETED immediately with data URL
    // so this status endpoint is just for compatibility with the polling pattern
    res.json({
      data: {
        status: 'COMPLETED',
        // In a real app we'd retrieve the URL from the DB/Storage based on taskId
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
