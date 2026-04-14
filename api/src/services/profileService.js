/**
 * Profile Service
 * Business logic for user profile management
 */
import { getProfile, updateProfile, createOrUpdateProfile } from '../models/profile.js';
import { getUser } from '../models/user.js';

/**
 * Get full profile (user + profile docs)
 * @param {string} uid - User UID
 * @returns {Promise<Object>} Combined profile
 */
export async function getFullProfile(uid) {
  const [user, profile] = await Promise.all([
    getUser(uid),
    getProfile(uid),
  ]);

  if (!user) {
    throw new Error('User not found');
  }

  // Create profile if it doesn't exist
  const finalProfile = profile || await createOrUpdateProfile(uid, {});

  return {
    ...user,
    profile: finalProfile,
  };
}

/**
 * Update user profile
 * @param {string} uid - User UID
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Updated profile
 */
export async function updateUserProfile(uid, updates) {
  // Validate updates
  const allowedFields = ['bio', 'company', 'website', 'location', 'social'];
  const invalidFields = Object.keys(updates).filter(key => !allowedFields.includes(key));

  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
  }

  // Validate social links
  if (updates.social) {
    const allowedSocial = ['twitter', 'github', 'linkedin', 'website'];
    const invalidSocial = Object.keys(updates.social).filter(key => !allowedSocial.includes(key));
    if (invalidSocial.length > 0) {
      throw new Error(`Invalid social fields: ${invalidSocial.join(', ')}`);
    }
  }

  return updateProfile(uid, updates);
}

/**
 * Get public profile (limited fields for other users)
 * @param {string} uid - User UID
 * @returns {Promise<Object>} Public profile
 */
export async function getPublicProfile(uid) {
  const profile = await getProfile(uid);

  if (!profile) {
    throw new Error('Profile not found');
  }

  return {
    uid: profile.uid,
    displayName: profile.displayName || 'Anonymous',
    bio: profile.bio,
    company: profile.company,
    location: profile.location,
    social: profile.social,
    workflowsCount: profile.workflowsCount,
    createdAt: profile.createdAt,
  };
}

/**
 * Update user preferences
 * @param {string} uid - User UID
 * @param {Object} preferences - Preference updates
 * @returns {Promise<Object>} Updated user
 */
export async function updateUserPreferences(uid, preferences) {
  const user = await getUser(uid);
  if (!user) {
    throw new Error('User not found');
  }

  const allowedPrefs = ['language', 'theme', 'emailNotifications', 'settings'];
  const invalidPrefs = Object.keys(preferences).filter(key => !allowedPrefs.includes(key));

  if (invalidPrefs.length > 0) {
    throw new Error(`Invalid preferences: ${invalidPrefs.join(', ')}`);
  }

  const updatedPreferences = {
    ...user.preferences,
    ...preferences,
  };

  const { updateUserPreferences: updatePrefs } = await import('../models/user.js');
  return updatePrefs(uid, updatedPreferences);
}

export default {
  getFullProfile,
  updateUserProfile,
  getPublicProfile,
  updateUserPreferences,
};
