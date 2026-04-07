import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

// ... (your existing initialization code here)

export const getFirebaseAuth = () => auth;
export const getDb = () => db;
export const getFirebaseStorage = () => storage;

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

let app, auth, db, storage;

export function initializeFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
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

export function enableOfflinePersistence() {
  if (db) {
    enableMultiTabIndexedDbPersistence(db).catch((err) => {
      console.error("Firestore persistence error:", err);
    });
  }
}

export const getFirebaseAuth = () => auth;
export const getFirebaseDb = () => db;
export const getFirebaseStorage = () => storage;

export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0;
};
