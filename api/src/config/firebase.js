/**
 * Firebase Admin SDK Configuration
 * Initializes Firebase Admin for server-side operations
 */
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Check if we're running in production (Firebase hosting, Cloud Run, etc.)
const isProduction = process.env.NODE_ENV === 'production';
const isFirebaseEmulator = !!process.env.FIREBASE_AUTH_EMULATOR_HOST;

let app;

if (isFirebaseEmulator) {
  // Use Firebase Auth emulator
  console.log('🔧 Using Firebase Auth emulator');
  app = admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'demo-project',
  });
} else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Load service account from environment variable (JSON string)
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
} else if (!isProduction) {
  // Load from local file for development
  try {
    const serviceAccountPath = resolve(__dirname, '../../firebase-service-account.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
  } catch (error) {
    console.warn('⚠️  Firebase service account file not found. Auth features will be limited.');
    console.warn('   Set FIREBASE_SERVICE_ACCOUNT env var or add firebase-service-account.json');
  }
} else {
  // In production, use Application Default Credentials
  app = admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
export { admin };

export default app;
