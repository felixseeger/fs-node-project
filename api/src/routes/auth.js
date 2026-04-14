/**
 * Auth Routes
 */
import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * @route   POST /api/auth/verify
 * @desc    Verify Firebase token
 * @access  Public
 */
router.post('/verify', authController.verifyToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout from all devices
 * @access  Private
 */
router.post('/logout', authenticate, authController.logoutAll);

/**
 * @route   DELETE /api/auth/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', authenticate, authController.deleteAccount);

/**
 * @route   GET /api/auth/user/:uid
 * @desc    Get user by UID (admin only)
 * @access  Admin
 */
router.get('/user/:uid', authenticate, requireAdmin, authController.getUser);

export default router;
