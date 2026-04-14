/**
 * Authentication Service
 * Handles Firebase Auth operations, token verification, and session management
 */
import { auth, db } from '../config/firebase.js';
import { createOrUpdateUser, getUser } from '../models/user.js';
import { createOrUpdateProfile } from '../models/profile.js';

/**
 * Verify Firebase ID token
 * @param {string} token - Firebase ID token
 * @returns {Promise<Object>} Decoded token with user info
 */
export async function verifyIdToken(token) {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
}

/**
 * Get user by Firebase UID
 * @param {string} uid - Firebase UID
 * @returns {Promise<Object>} User record
 */
export async function getUserByUid(uid) {
  const user = await getUser(uid);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

/**
 * Create user from Firebase Auth (triggered on first sign-in)
 * @param {Object} userRecord - Firebase Auth user record
 * @returns {Promise<Object>} Created user
 */
export async function createUserFromAuth(userRecord) {
  const userData = {
    email: userRecord.email,
    displayName: userRecord.displayName || userRecord.email?.split('@')[0] || 'User',
    photoURL: userRecord.photoURL,
    emailVerified: userRecord.emailVerified,
  };

  // Create user document
  const user = await createOrUpdateUser(userRecord.uid, userData);

  // Create profile document
  await createOrUpdateProfile(userRecord.uid, {});

  return user;
}

/**
 * Ensure user exists in Firestore (create if needed)
 * This is called on every authenticated request to ensure sync
 * @param {Object} decodedToken - Decoded Firebase token
 * @returns {Promise<Object>} User document
 */
export async function ensureUserInFirestore(decodedToken) {
  let user = await getUser(decodedToken.uid);

  if (!user) {
    // First time user - create documents
    const authUser = await auth.getUser(decodedToken.uid);
    user = await createUserFromAuth(authUser);
  } else {
    // Update existing user with latest auth info
    await createOrUpdateUser(decodedToken.uid, {
      email: decodedToken.email,
      displayName: decodedToken.name,
      photoURL: decodedToken.picture,
      emailVerified: decodedToken.email_verified || false,
    });
  }

  return user;
}

/**
 * Get custom claims for a user
 * @param {string} uid - User UID
 * @returns {Promise<Object>} Custom claims
 */
export async function getUserClaims(uid) {
  try {
    const userRecord = await auth.getUser(uid);
    return userRecord.customClaims || {};
  } catch (error) {
    throw new Error(`Failed to get user claims: ${error.message}`);
  }
}

/**
 * Set custom claims for a user (admin only)
 * @param {string} uid - User UID
 * @param {Object} claims - Custom claims to set
 * @returns {Promise<void>}
 */
export async function setUserClaims(uid, claims) {
  try {
    await auth.setCustomUserClaims(uid, claims);
  } catch (error) {
    throw new Error(`Failed to set user claims: ${error.message}`);
  }
}

/**
 * Revoke all sessions for a user (logout everywhere)
 * @param {string} uid - User UID
 * @returns {Promise<void>}
 */
export async function revokeAllSessions(uid) {
  try {
    await auth.revokeRefreshTokens(uid);
  } catch (error) {
    throw new Error(`Failed to revoke sessions: ${error.message}`);
  }
}

/**
 * Delete user account (auth + firestore)
 * @param {string} uid - User UID
 * @returns {Promise<void>}
 */
export async function deleteUserAccount(uid) {
  try {
    // Delete Firebase auth user
    await auth.deleteUser(uid);

    // Note: Firestore documents should be deleted via Cloud Function triggers
    // to ensure proper cleanup of subcollections
  } catch (error) {
    throw new Error(`Failed to delete account: ${error.message}`);
  }
}

export default {
  verifyIdToken,
  getUserByUid,
  createUserFromAuth,
  ensureUserInFirestore,
  getUserClaims,
  setUserClaims,
  revokeAllSessions,
  deleteUserAccount,
};
