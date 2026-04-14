/**
 * User Profile Model
 * Handles extended user profiles in Firestore
 */
import { db } from '../config/firebase.js';

const PROFILES_COLLECTION = 'profiles';

/**
 * Create or update user profile
 * @param {string} uid - User UID
 * @param {Object} profileData - Profile data
 * @returns {Promise<Object>} Profile document
 */
export async function createOrUpdateProfile(uid, profileData) {
  const profileRef = db.collection(PROFILES_COLLECTION).doc(uid);
  const now = new Date().toISOString();

  const existingProfile = await getProfile(uid);
  const profileDoc = {
    uid,
    bio: profileData.bio || existingProfile?.bio || '',
    company: profileData.company || existingProfile?.company || null,
    website: profileData.website || existingProfile?.website || null,
    location: profileData.location || existingProfile?.location || null,
    social: {
      twitter: profileData.social?.twitter || existingProfile?.social?.twitter || null,
      github: profileData.social?.github || existingProfile?.social?.github || null,
      linkedin: profileData.social?.linkedin || existingProfile?.social?.linkedin || null,
      ...profileData.social,
    },
    workflowsCount: existingProfile?.workflowsCount || 0,
    totalGenerations: existingProfile?.totalGenerations || 0,
    lastActiveAt: now,
    createdAt: existingProfile?.createdAt || now,
    updatedAt: now,
  };

  await profileRef.set(profileDoc, { merge: true });
  return profileDoc;
}

/**
 * Get profile by UID
 * @param {string} uid - User UID
 * @returns {Promise<Object|null>} Profile document or null
 */
export async function getProfile(uid) {
  const profileRef = db.collection(PROFILES_COLLECTION).doc(uid);
  const doc = await profileRef.get();

  if (!doc.exists) {
    return null;
  }

  return { id: doc.id, ...doc.data() };
}

/**
 * Update profile fields
 * @param {string} uid - User UID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated profile
 */
export async function updateProfile(uid, updates) {
  const profileRef = db.collection(PROFILES_COLLECTION).doc(uid);
  const now = new Date().toISOString();

  // Remove protected fields
  const { uid: _, createdAt, ...safeUpdates } = updates;

  await profileRef.update({
    ...safeUpdates,
    updatedAt: now,
    lastActiveAt: now,
  });

  return getProfile(uid);
}

/**
 * Increment workflow count for a user
 * @param {string} uid - User UID
 * @param {number} [count=1] - Count to increment
 * @returns {Promise<void>}
 */
export async function incrementWorkflowCount(uid, count = 1) {
  const profileRef = db.collection(PROFILES_COLLECTION).doc(uid);
  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(profileRef);
    if (!doc.exists) {
      await createOrUpdateProfile(uid, {});
    }
    transaction.update(profileRef, {
      workflowsCount: admin.firestore.FieldValue.increment(count),
      updatedAt: new Date().toISOString(),
    });
  });
}

/**
 * Increment generation count for a user
 * @param {string} uid - User UID
 * @param {number} [count=1] - Count to increment
 * @returns {Promise<void>}
 */
export async function incrementGenerationCount(uid, count = 1) {
  const profileRef = db.collection(PROFILES_COLLECTION).doc(uid);
  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(profileRef);
    if (!doc.exists) {
      await createOrUpdateProfile(uid, {});
    }
    transaction.update(profileRef, {
      totalGenerations: admin.firestore.FieldValue.increment(count),
      updatedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    });
  });
}

// Import admin for FieldValue
import { admin } from '../config/firebase.js';

export default {
  createOrUpdateProfile,
  getProfile,
  updateProfile,
  incrementWorkflowCount,
  incrementGenerationCount,
};
