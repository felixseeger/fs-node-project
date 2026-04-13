/**
 * Routes Index
 * Aggregates all route modules and exports them for use in server.js
 */

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import images from './images.js';
import imageEditing from './imageEditing.js';
import videos from './videos.js';
import audio from './audio.js';
import vision from './vision.js';
import aiWorkflow from './aiWorkflow.js';
import chat from './chat.js';
import recraft from './recraft.js';
import quiver from './quiver.js';
import tripo from './tripo.js';
import workflowThumbnails from './workflowThumbnails.js';
import workflowEmbedding from './workflowEmbedding.js';
import templateThumbnails from './templateThumbnails.js';
import vfx from './vfx.js';
import webhooks from './webhooks.js';

const router = Router();

// Mount public routes (no auth required)
router.use('/api', webhooks);

// Mount all routes under /api
router.use('/api', requireAuth, images);
router.use('/api', requireAuth, imageEditing);
router.use('/api', requireAuth, videos);
router.use('/api', requireAuth, audio);
router.use('/api', requireAuth, vision);
router.use('/api', requireAuth, aiWorkflow);
router.use('/api', requireAuth, chat);
router.use('/api', requireAuth, recraft);
router.use('/api', requireAuth, quiver);
router.use('/api', requireAuth, tripo);
router.use('/api', requireAuth, workflowThumbnails);
router.use('/api', requireAuth, workflowEmbedding);
router.use('/api', requireAuth, templateThumbnails);
router.use('/api', requireAuth, vfx);

export default router;
