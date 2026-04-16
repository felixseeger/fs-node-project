import admin from 'firebase-admin';

/**
 * Middleware to check if the user has reached their storage limit before generating
 */
export const storageGuard = async (req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  // If Firebase Admin isn't initialized, allow bypass only in non-production environments.
  if (!admin.apps.length) {
    if (isProduction) {
      return res.status(503).json({
        error: 'Storage guard unavailable',
        code: 'STORAGE_GUARD_UNAVAILABLE',
      });
    }
    console.warn('⚠️ Skipping storageGuard because Firebase Admin is not initialized (non-production).');
    return next();
  }

  // If not running with full credentials, fail closed in production and bypass only in local dev.
  if (isProduction && !process.env.FIREBASE_SERVICE_ACCOUNT && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn('⚠️ Storage guard unavailable in production due to missing Firebase credentials.');
    return res.status(503).json({
      error: 'Storage guard unavailable',
      code: 'STORAGE_GUARD_UNAVAILABLE',
    });
  }

  if (!req.user || !req.user.uid) {
    return res.status(401).json({
      error: 'Unauthorized',
      code: 'UNAUTHORIZED'
    });
  }

  const uid = req.user.uid;

  try {
    const db = admin.firestore();
    const assetsRef = db.collection('assets');
    const snapshot = await assetsRef.where('userId', '==', uid).where('isDeleted', '==', false).get();
    
    const count = snapshot.size;
    const LIMIT = 100; // Hardcoded limit of 100 assets for now

    if (count >= LIMIT) {
      return res.status(403).json({
        error: 'Storage limit reached',
        code: 'STORAGE_LIMIT_EXCEEDED',
        current: count,
        limit: LIMIT
      });
    }

    next();
  } catch (error) {
    console.error('[Storage Guard Error]', error.message);
    // If it fails with permission denied, let it through only outside production.
    if (error.message && error.message.includes('Missing or insufficient permissions')) {
      if (isProduction) {
        return res.status(503).json({
          error: 'Storage guard unavailable',
          code: 'STORAGE_GUARD_UNAVAILABLE',
        });
      }
      console.warn('⚠️ Bypassing storage guard due to Firebase permission error (non-production).');
      return next();
    }
    next(error);
  }
};
