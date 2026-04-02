/**
 * Routes Index
 * Aggregates all route modules and exports them for use in server.js
 */

import { Router } from 'express';
import images from './images.js';
import imageEditing from './imageEditing.js';
import videos from './videos.js';
import audio from './audio.js';
import vision from './vision.js';
import aiWorkflow from './aiWorkflow.js';

const router = Router();

// Mount all routes under /api
router.use('/api', images);
router.use('/api', imageEditing);
router.use('/api', videos);
router.use('/api', audio);
router.use('/api', vision);
router.use('/api', aiWorkflow);

export default router;
