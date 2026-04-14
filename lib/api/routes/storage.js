import { Router } from 'express';
import admin from 'firebase-admin';

const router = Router();

/**
 * GET /api/storage/usage
 * Returns the current user's storage usage (count of assets)
 */
router.get('/storage/usage', async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const db = admin.firestore();
    const assetsSnapshot = await db.collection('assets').where('userId', '==', uid).where('isDeleted', '==', false).get();
    
    let totalBytes = 0;
    const count = assetsSnapshot.size;
    
    // Naive sum of sizes if they exist
    assetsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.mediaItems && Array.isArray(data.mediaItems)) {
        data.mediaItems.forEach(item => {
          if (item.size) totalBytes += item.size;
        });
      }
    });

    // Let's say the limit is 100 assets or 1GB.
    const limitCount = 100;
    
    res.json({ 
      usage: {
        count,
        totalBytes,
        limitCount,
        limitBytes: 1000000000 // 1GB
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
