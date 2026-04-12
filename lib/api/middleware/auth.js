import admin from 'firebase-admin';

// Check if Firebase Auth enforcement should be skipped (e.g., local dev without Firebase)
const SKIP_AUTH = process.env.REQUIRE_AUTH === 'false';
let authInitialized = false;

try {
  if (!admin.apps.length && !SKIP_AUTH) {
    // Determine the Project ID from environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
    
    if (projectId || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        projectId: projectId
      });
      authInitialized = true;
      console.log('🔒 Firebase Admin initialized. Backend authentication is ENABLED.');
    } else {
      console.warn('⚠️  WARNING: No FIREBASE_PROJECT_ID or GOOGLE_APPLICATION_CREDENTIALS found. Backend auth cannot be fully enforced.');
    }
  } else if (admin.apps.length) {
    authInitialized = true;
  }
} catch (error) {
  console.warn('⚠️  WARNING: Failed to initialize Firebase Admin. Auth middleware may not work correctly.', error.message);
}

/**
 * Middleware to verify Firebase ID token
 */
export const requireAuth = async (req, res, next) => {
  // Skip auth if configured to do so, or if not initialized and not strictly required
  if (SKIP_AUTH || !authInitialized) {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Missing or invalid authorization header',
        code: 'UNAUTHORIZED'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify the token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Attach the user to the request object
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('[Auth Error]', error.message);
    return res.status(403).json({
      error: 'Invalid or expired authorization token',
      code: 'FORBIDDEN',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
