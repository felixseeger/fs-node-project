import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a base64 PNG image to Firebase Storage
 * @param {string} base64Data - The base64 encoded image data (can include data:image/png;base64, prefix)
 * @param {string} templateId - The ID of the template this cover belongs to
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadTemplateCover(base64Data, templateId) {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin is not initialized. Cannot upload to storage.');
  }

  // Remove the data URL prefix if present
  const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Image, 'base64');

  const bucketName = process.env.FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET;
  const bucket = bucketName ? admin.storage().bucket(bucketName) : admin.storage().bucket();

  const safeTemplateId = String(templateId || 'unknown-template').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `template-covers/${safeTemplateId}-${uuidv4()}.png`;
  const file = bucket.file(filename);

  // Generate a download token (UUID) to mimic client SDK behavior
  const downloadToken = uuidv4();

  await file.save(buffer, {
    metadata: {
      contentType: 'image/png',
      metadata: {
        templateId: safeTemplateId,
        firebaseStorageDownloadTokens: downloadToken
      }
    }
  });

  // Construct the public Firebase Storage URL using the token
  const encodedPath = encodeURIComponent(filename);
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${downloadToken}`;

  return {
    url: publicUrl,
    path: filename
  };
}
