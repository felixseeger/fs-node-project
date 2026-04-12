import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Replace this with your new config
const firebaseConfig = {
  apiKey: "AIzaSyDNRotQNelJBJAAMwmdmo8cWjYiAchobHU",
  authDomain: "fs-nodes-project.firebaseapp.com",
  projectId: "fs-nodes-project",
  storageBucket: "fs-nodes-project.firebasestorage.app",
  messagingSenderId: "52625049495",
  appId: "1:52625049495:web:17ea6e522bbf257faf26d2",
  measurementId: "G-TZWFY20XY2"
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

export function initializeFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    // Modern way to enable multi-tab offline persistence
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
    
    storage = getStorage(app);

    // Analytics should only run in the browser
    if (typeof window !== 'undefined') {
      getAnalytics(app);
    }
  } else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
  return app;
}

/**
 * @deprecated Persistence is now handled in initializeFirebase using the modern cache API
 */
export function enableOfflinePersistence() {
  // No-op, handled during initialization
}

// Getters with type assertions to avoid widespread 'undefined' errors
// callers should check isFirebaseConfigured() first.
export const getFirebaseAuth = () => auth as Auth;
export const getDb = () => db as Firestore;
export const getFirebaseStorage = () => storage as FirebaseStorage;

export const isFirebaseConfigured = () => {
  return !!firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0;
};

// Initialize immediately if configured
if (isFirebaseConfigured()) {
  try {
    initializeFirebase();
    enableOfflinePersistence();
  } catch (err) {
    console.error("Firebase initialization failed:", err);
  }
}
