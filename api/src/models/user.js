/**
 * User Model
 * Handles user document creation and updates in Firestore
 */
import { db } from '../config/firebase.js';

const USERS_COLLECTION = 'users';

/**
 * Create or update user document in Firestore
 * @param {string} uid - Firebase Auth UID
 * @param {Object} userData - User data
 * @returns {Promise<Object>} User document
 */
export async function createOrUpdateUser(uid, userData) {
  const userRef = db.collection(USERS_COLLECTION).doc(uid);
  const now = new Date().toISOString();

  const userDoc = {
    uid,
    email: userData.email || null,
    displayName: userData.displayName || 'Anonymous User',
    photoURL: userData.photoURL || null,
    emailVerified: userData.emailVerified || false,
    preferences: {
      language: 'en',
      theme: 'light',
      emailNotifications: true,
      ...userData.preferences,
    },
    createdAt: userData.createdAt || now,
    updatedAt: now,
  };

  await userRef.set(userDoc, { merge: true });
  return userDoc;
}

/**
 * Get user by UID
 * @param {string} uid - Firebase Auth UID
 * @returns {Promise<Object|null>} User document or null
 */
export async function getUser(uid) {
  const userRef = db.collection(USERS_COLLECTION).doc(uid);
  const doc = await userRef.get();

  if (!doc.exists) {
    return null;
  }

  return { id: doc.id, ...doc.data() };
}

/**
 * Update user preferences
 * @param {string} uid - Firebase Auth UID
 * @param {Object} preferences - Updated preferences
 * @returns {Promise<Object>} Updated user document
 */
export async function updateUserPreferences(uid, preferences) {
  const userRef = db.collection(USERS_COLLECTION).doc(uid);
  const now = new Date().toISOString();

  await userRef.update({
    preferences,
    updatedAt: now,
  });

  return getUser(uid);
}

/**
 * Delete user document (for account deletion)
 * @param {string} uid - Firebase Auth UID
 * @returns {Promise<void>}
 */
export async function deleteUser(uid) {
  await db.collection(USERS_COLLECTION).doc(uid).delete();
}

/**
 * List users (admin function, with pagination)
 * @param {Object} options - Query options
 * @param {number} [options.limit=20] - Max results
 * @param {string} [options.cursor] - Pagination cursor
 * @returns {Promise<Object[]>} Array of users
 */
export async function listUsers({ limit = 20, cursor } = {}) {
  let query = db.collection(USERS_COLLECTION)
    .orderBy('createdAt', 'desc')
    .limit(limit);

  if (cursor) {
    const cursorDoc = await db.collection(USERS_COLLECTION).doc(cursor).get();
    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc);
    }
  }

  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default {
  createOrUpdateUser,
  getUser,
  updateUserPreferences,
  deleteUser,
  listUsers,
};
