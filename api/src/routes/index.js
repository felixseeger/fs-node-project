/**
 * Main Routes Index
 * Mounts all user flow routes
 */
import { Router } from 'express';
import authRoutes from './auth.js';
import profileRoutes from './profile.js';
import workflowRoutes from './workflows.js';
import billingRoutes from './billing.js';
import webhookRoutes from './webhooks.js';

const router = Router();

// Mount user flow routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/workflows', workflowRoutes);
router.use('/billing', billingRoutes);
router.use('/webhooks', webhookRoutes);

export default router;
