import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorage, isFirebaseConfigured } from '../config/firebase';

/**
 * Uploads a WebM blob (or other VFX output) directly to Firebase Storage.
 * @param {Blob} blob - The video/image blob to upload.
 * @param {string} format - The format/extension (e.g., 'webm', 'mp4').
 * @returns {Promise<string>} - The public download URL.
 */
export const uploadVfxOutput = async (blob, format = 'webm') => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase is not configured. Returning local object URL.');
    return URL.createObjectURL(blob);
  }

  try {
    const storage = getFirebaseStorage();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filename = `vfx_output_${timestamp}_${randomStr}.${format}`;
    const filePath = `vfx/${filename}`;
    
    const storageRef = ref(storage, filePath);
    
    await uploadBytes(storageRef, blob, { contentType: blob.type || `video/${format}` });
    const downloadUrl = await getDownloadURL(storageRef);
    
    return downloadUrl;
  } catch (error) {
    console.error('Failed to upload VFX output to Firebase Storage:', error);
    // Fallback to local URL if upload fails
    return URL.createObjectURL(blob);
  }
};
