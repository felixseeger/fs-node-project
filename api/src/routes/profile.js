/**
 * Profile Routes
 */
import { Router } from 'express';
import * as profileController from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';
import { validateProfileUpdate, validatePreferencesUpdate } from '../middleware/validation.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/profile
 * @desc    Get current user's full profile
 * @access  Private
 */
router.get('/', profileController.getMyProfile);

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/', validateProfileUpdate, profileController.updateProfile);

/**
 * @route   PUT /api/profile/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put('/preferences', validatePreferencesUpdate, profileController.updatePreferences);

/**
 * @route   GET /api/profile/:uid/public
 * @desc    Get public profile for a user
 * @access  Public (but route is under auth middleware for consistency)
 */
router.get('/:uid/public', profileController.getPublicProfile);

export default router;
