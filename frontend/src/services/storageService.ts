import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorage, isFirebaseConfigured } from '../config/firebase';

const generateFilename = (mimeType: string = 'application/octet-stream'): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'application/pdf': 'pdf',
  };
  const extension = extMap[mimeType] || 'bin';
  return `${timestamp}_${randomStr}.${extension}`;
};

export const uploadAssetToStorage = async (uri: string, pathPrefix = 'assets'): Promise<string> => {
  if (!isFirebaseConfigured()) return uri;
  if (!uri.startsWith('blob:') && !uri.startsWith('data:')) return uri;

  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getFirebaseStorage();
    const filePath = `${pathPrefix.replace(/\/$/, '')}/${generateFilename(blob.type)}`;
    const storageRef = ref(storage, filePath);
    
    await uploadBytes(storageRef, blob, { contentType: blob.type });
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Failed to upload asset to Firebase Storage:', error);
    return uri;
  }
};

/**
 * Upload a user avatar to storage
 */
export const uploadUserAvatar = async (userId: string, uri: string): Promise<{ url: string; path: string }> => {
  if (!isFirebaseConfigured()) return { url: uri, path: '' };
  if (!uri.startsWith('blob:') && !uri.startsWith('data:')) return { url: uri, path: '' };

  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getFirebaseStorage();
    
    const extension = blob.type.split('/')[1] || 'jpg';
    const filePath = `avatars/${userId}/avatar.${extension}`;
    const storageRef = ref(storage, filePath);
    
    await uploadBytes(storageRef, blob, { contentType: blob.type });
    const url = await getDownloadURL(storageRef);
    
    return { url, path: filePath };
  } catch (error) {
    console.error('Failed to upload user avatar:', error);
    return { url: uri, path: '' };
  }
};

export const processAssetsInObject = async <T>(obj: T, pathPrefix = 'workflows'): Promise<T> => {
  if (!obj || typeof obj !== 'object') return obj;

  // We need to deep clone first so we don't mutate original objects in React state
  const result = JSON.parse(JSON.stringify(obj));
  const uploadPromises: Promise<void>[] = [];

  const traverse = (current: any, key: string | number, parent: any) => {
    if (typeof current === 'string') {
      if (current.startsWith('blob:') || current.startsWith('data:image/') || current.startsWith('data:video/') || current.startsWith('data:audio/')) {
        const promise = uploadAssetToStorage(current, pathPrefix).then((url) => {
          parent[key] = url;
        });
        uploadPromises.push(promise);
      }
    } else if (current && typeof current === 'object') {
      for (const k in current) {
        if (Object.prototype.hasOwnProperty.call(current, k)) {
          traverse(current[k], k, current);
        }
      }
    }
  };

  for (const k in result) {
    if (Object.prototype.hasOwnProperty.call(result, k)) {
      traverse((result as any)[k], k, result);
    }
  }

  await Promise.all(uploadPromises);
  return result as T;
};
