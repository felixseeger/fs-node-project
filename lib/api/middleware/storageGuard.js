import admin from 'firebase-admin';

/**
 * Middleware to check if the user has reached their storage limit before generating
 */
export const storageGuard = async (req, res, next) => {
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
    next(error);
  }
};
