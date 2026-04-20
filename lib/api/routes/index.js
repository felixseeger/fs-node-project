/**
 * Routes Index
 * Aggregates all route modules and exports them for use in server.js
 */

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { auditMiddleware } from '../middleware/auditMiddleware.js';
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
import render from './render.js';
import storage from './storage.js';
import control from './control.js';
import moderate from './moderate.js';
import social from './social.js';
import cloud from './cloud.js';
import debug from './debug.js';

const router = Router();


// Mount public routes (no auth required)
router.use('/api', auditMiddleware('WEBHOOK'), webhooks);
router.use('/api', debug);

// Mount all routes under /api
router.use('/api', requireAuth, auditMiddleware(), moderate);
router.use('/api', requireAuth, auditMiddleware(), images);
router.use('/api', requireAuth, auditMiddleware(), imageEditing);
router.use('/api', requireAuth, auditMiddleware(), videos);
router.use('/api', requireAuth, auditMiddleware(), audio);
router.use('/api', requireAuth, auditMiddleware(), vision);
router.use('/api', requireAuth, auditMiddleware(), aiWorkflow);
router.use('/api', requireAuth, auditMiddleware(), chat);
router.use('/api', requireAuth, auditMiddleware(), recraft);
router.use('/api', requireAuth, auditMiddleware(), quiver);
router.use('/api', requireAuth, auditMiddleware(), tripo);
router.use('/api', requireAuth, auditMiddleware(), workflowThumbnails);
router.use('/api', requireAuth, auditMiddleware(), workflowEmbedding);
router.use('/api', requireAuth, auditMiddleware(), templateThumbnails);
router.use('/api', requireAuth, auditMiddleware(), vfx);
router.use('/api', requireAuth, auditMiddleware(), render);
router.use('/api', requireAuth, auditMiddleware(), storage);
router.use('/api', requireAuth, auditMiddleware(), control);
router.use('/api', requireAuth, auditMiddleware(), social);
router.use('/api', requireAuth, auditMiddleware(), cloud);

export default router;
