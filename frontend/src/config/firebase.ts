/**
 * Firebase Configuration
 * Centralized Firebase app initialization and service exports
 */

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Firebase configuration
// Replace with your Firebase project config or use environment variables
const getFirebaseConfig = () => {
  // In Vite, import.meta.env is available
  const env = (import.meta as any).env || {};
  
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || 'your-api-key',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
    projectId: env.VITE_FIREBASE_PROJECT_ID || 'your-project-id',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    appId: env.VITE_FIREBASE_APP_ID || 'your-app-id',
  };
};

// Initialize Firebase app (singleton)
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

/**
 * Initialize Firebase services
 * Call this once at app startup
 */
export function initializeFirebase(): FirebaseApp {
  if (app) return app;
  
  try {
    const config = getFirebaseConfig();
    app = initializeApp(config);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    
    console.log('[Firebase] Initialized successfully');
    return app;
  } catch (error) {
    console.error('[Firebase] Initialization error:', error);
    throw error;
  }
}

/**
 * Get Firestore database instance
 */
export function getDb(): Firestore {
  if (!db) {
    initializeFirebase();
  }
  if (!db) {
    throw new Error('[Firebase] Firestore not initialized');
  }
  return db;
}

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    initializeFirebase();
  }
  if (!auth) {
    throw new Error('[Firebase] Auth not initialized');
  }
  return auth;
}

/**
 * Get Firebase Storage instance
 */
export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    initializeFirebase();
  }
  if (!storage) {
    throw new Error('[Firebase] Storage not initialized');
  }
  return storage;
}

/**
 * Check if Firebase is configured properly
 */
export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return !!config.apiKey && 
         config.apiKey !== 'your-api-key' &&
         !!config.projectId;
}

/**
 * Enable offline persistence for Firestore
 */
export async function enableOfflinePersistence(): Promise<void> {
  try {
    const { enableIndexedDbPersistence } = await import('firebase/firestore');
    const database = getDb();
    await enableIndexedDbPersistence(database);
    console.log('[Firebase] Offline persistence enabled');
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      console.warn('[Firebase] Multiple tabs open, persistence can only be enabled in one tab');
    } else if (error.code === 'unimplemented') {
      console.warn('[Firebase] Browser does not support persistence');
    } else {
      console.error('[Firebase] Persistence error:', error);
    }
  }
}

export { app, db, auth, storage };
export default getFirebaseConfig();
