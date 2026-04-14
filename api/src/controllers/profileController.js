/**
 * Profile Controller
 * Handles user profile endpoints
 */
import { asyncHandler } from '../middleware/errorHandler.js';
import { getFullProfile, updateUserProfile, updateUserPreferences } from '../services/profileService.js';

/**
 * GET /api/profile
 * Get current user's full profile
 */
export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await getFullProfile(req.user.uid);

  res.json({
    success: true,
    data: profile,
  });
});

/**
 * PUT /api/profile
 * Update current user's profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const updatedProfile = await updateUserProfile(req.user.uid, req.body);

  res.json({
    success: true,
    data: updatedProfile,
  });
});

/**
 * PUT /api/profile/preferences
 * Update current user's preferences
 */
export const updatePreferences = asyncHandler(async (req, res) => {
  const updatedUser = await updateUserPreferences(req.user.uid, req.body);

  res.json({
    success: true,
    data: updatedUser,
  });
});

/**
 * GET /api/profile/:uid/public
 * Get public profile for a user
 */
export const getPublicProfile = asyncHandler(async (req, res) => {
  const { getPublicProfile } = await import('../services/profileService.js');
  const profile = await getPublicProfile(req.params.uid);

  res.json({
    success: true,
    data: profile,
  });
});

export default {
  getMyProfile,
  updateProfile,
  updatePreferences,
  getPublicProfile,
};
