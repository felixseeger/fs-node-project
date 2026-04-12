import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type Unsubscribe,
  onSnapshot,
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '../config/firebase';
import { type UserProfile, type FirestoreUserDocument, type UpdateProfilePayload } from '../types/user';
import { uploadUserAvatar } from './storageService';

const USERS_COLLECTION = 'users';

/**
 * Deserialize Firestore user document to UserProfile
 */
function deserializeUser(id: string, data: any): UserProfile {
  return {
    ...data,
    uid: id,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    lastLogin: data.lastLogin?.toDate?.()?.toISOString(),
  };
}

/**
 * Get user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const docRef = doc(db, USERS_COLLECTION, uid);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists() || snapshot.data().isDeleted) return null;
  return deserializeUser(snapshot.id, snapshot.data());
}

/**
 * Create or initialize user profile
 */
export async function createUserProfile(uid: string, email: string, displayName: string): Promise<UserProfile> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const docRef = doc(db, USERS_COLLECTION, uid);
  
  const userData: FirestoreUserDocument = {
    uid,
    email,
    displayName,
    role: 'user',
    preferences: {
      theme: 'system',
      notifications: true,
      language: 'en',
      performanceMode: false,
      snapToGrid: true,
      promptImprover: true,
      showLegacyAssets: false,
      showCreditBalance: true,
      dashboardOpenBehavior: 'new-tab',
      variationBehavior: 'history',
      multiModelBehavior: 'canvas',
      defaultModels: {
        textToText: 'Gemini 3 Pro',
        imageToText: 'Gemini 3 Pro',
        videoToText: 'Gemini 3 Pro',
        textToImage: 'Flux 2',
        imageToImage: 'Flux 2',
        imagesToImage: 'Flux 2',
        textToVideo: 'Seedance 1.5 Pro',
        imageToVideo: 'Seedance 1.5 Pro',
        firstFrameLastFrame: 'Seedance 1.5 Pro',
        imagesToVideo: 'Seedance 1.5 Pro',
        videoToVideo: 'Seedance 1.5 Pro',
        mixedToVideo: 'Seedance 1.5 Pro',
      }
    },
    isDeleted: false,
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
  };

  await setDoc(docRef, userData, { merge: true });
  
  const snapshot = await getDoc(docRef);
  return deserializeUser(snapshot.id, snapshot.data());
}

/**
 * Update user profile
 */
export async function updateUserProfile(uid: string, updates: UpdateProfilePayload): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const docRef = doc(db, USERS_COLLECTION, uid);

  const updateData = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(docRef, updateData as any);
}

/**
 * Update user avatar
 */
export async function updateUserAvatar(uid: string, avatarUri: string): Promise<string> {
  const { url, path } = await uploadUserAvatar(uid, avatarUri);
  
  await updateUserProfile(uid, {
    photoURL: url,
    avatarPath: path,
  });

  return url;
}

/**
 * Subscribe to user profile changes
 */
export function subscribeToUserProfile(uid: string, callback: (profile: UserProfile | null) => void): Unsubscribe {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const docRef = doc(db, USERS_COLLECTION, uid);

  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists() && !snapshot.data().isDeleted) {
      callback(deserializeUser(snapshot.id, snapshot.data()));
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('[UserService] Subscription error:', error);
    callback(null);
  });
}
