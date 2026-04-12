import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '../config/firebase';
import { processAssetsInObject } from './storageService';
import { type Asset, type CreateAssetPayload, type UpdateAssetPayload, type AssetOperationResult } from '../types/asset';
import { CreateAssetPayloadSchema, UpdateAssetPayloadSchema } from '../schemas';

const ASSETS_COLLECTION = 'assets';

export class AssetServiceError extends Error {
  code: string;
  constructor(message: string, code: string = 'UNKNOWN') {
    super(message);
    this.code = code;
    this.name = 'AssetServiceError';
  }
}

function timestampToString(timestamp: Timestamp | any | null | undefined): string {
  if (!timestamp) return new Date().toISOString();
  if (typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  if (typeof timestamp === 'string') return timestamp;
  return new Date().toISOString();
}

function serializeAsset(payload: CreateAssetPayload | UpdateAssetPayload, isUpdate = false): any {
  const data: any = {
    updatedAt: serverTimestamp(),
  };

  if ('name' in payload && payload.name !== undefined) data.name = payload.name;
  if ('description' in payload && payload.description !== undefined) data.description = payload.description;
  if ('images' in payload && payload.images !== undefined) data.images = payload.images;
  if ('tags' in payload && payload.tags !== undefined) data.tags = payload.tags;
  if ('category' in payload && payload.category !== undefined) data.category = payload.category;
  if ('isPublic' in payload && payload.isPublic !== undefined) data.isPublic = payload.isPublic;
  if ('metadata' in payload && payload.metadata !== undefined) data.metadata = payload.metadata;
  
  if ('status' in payload && payload.status !== undefined) data.status = payload.status;
  else if (!isUpdate) data.status = 'ready'; // default status for new assets

  return data;
}

function deserializeAsset(id: string, data: any): Asset {
  return {
    ...data,
    id,
    name: data.name || 'Unnamed Asset',
    userId: data.userId || 'unknown',
    images: data.images || [],
    mediaItems: data.mediaItems || [],
    status: data.status || 'ready',
    isDeleted: data.isDeleted || false,
    isPublic: data.isPublic || false,
    createdAt: timestampToString(data.createdAt),
    updatedAt: timestampToString(data.updatedAt),
  } as Asset;
}

export async function createAsset(userId: string, payload: CreateAssetPayload): Promise<AssetOperationResult<Asset>> {
  if (!isFirebaseConfigured()) return { success: false, error: 'Firebase not configured' };
  
  try {
    // Validate payload
    const validation = CreateAssetPayloadSchema.safeParse(payload);
    if (!validation.success) {
      return { success: false, error: `Invalid asset data: ${validation.error.errors.map(e => e.message).join(', ')}` };
    }

    const db = getDb();
    const assetsRef = collection(db, ASSETS_COLLECTION);
    
    // Process base64 images and upload to Firebase Storage
    // Store under /assets/{userId}/
    const processedPayload = await processAssetsInObject(payload, `assets/${userId}`);

    const assetData = {
      ...serializeAsset(processedPayload, false),
      userId,
      createdAt: serverTimestamp(),
      isDeleted: false,
    };

    const docRef = await Promise.race([
      addDoc(assetsRef, assetData),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new AssetServiceError('Firestore write timed out', 'TIMEOUT')), 10000)
      ),
    ]);

    return { 
      success: true, 
      data: { ...processedPayload, id: docRef.id, userId, isDeleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'ready' } as Asset
    };
  } catch (err) {
    console.error('Error creating asset:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function getAsset(assetId: string): Promise<Asset | null> {
  if (!isFirebaseConfigured()) throw new AssetServiceError('Firebase not configured', 'NOT_CONFIGURED');
  const db = getDb();
  const docRef = doc(db, ASSETS_COLLECTION, assetId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists() || snapshot.data().isDeleted) return null;
  return deserializeAsset(snapshot.id, snapshot.data());
}

export async function updateAsset(assetId: string, updates: UpdateAssetPayload, userId?: string): Promise<AssetOperationResult<void>> {
  if (!isFirebaseConfigured()) return { success: false, error: 'Firebase not configured' };
  
  try {
    // Validate updates
    const validation = UpdateAssetPayloadSchema.safeParse(updates);
    if (!validation.success) {
      return { success: false, error: `Invalid update data: ${validation.error.errors.map(e => e.message).join(', ')}` };
    }

    const db = getDb();
    const docRef = doc(db, ASSETS_COLLECTION, assetId);

    if (userId) {
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists() || snapshot.data().userId !== userId) {
        throw new AssetServiceError('Permission denied', 'PERMISSION_DENIED');
      }
    }

    const processedUpdates = await processAssetsInObject(updates, `assets/${userId || 'unknown'}`);
    const updateData = serializeAsset(processedUpdates, true);
    
    await updateDoc(docRef, updateData);
    return { success: true };
  } catch (err) {
    console.error('Error updating asset:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function toggleAssetPublic(assetId: string, isPublic: boolean, userId: string): Promise<void> {
  if (!isFirebaseConfigured()) throw new AssetServiceError('Firebase not configured', 'NOT_CONFIGURED');
  const db = getDb();
  const docRef = doc(db, ASSETS_COLLECTION, assetId);

  const snapshot = await getDoc(docRef);
  if (!snapshot.exists() || snapshot.data().userId !== userId) {
    throw new AssetServiceError('Permission denied', 'PERMISSION_DENIED');
  }

  await updateDoc(docRef, { isPublic, updatedAt: serverTimestamp() });
}

export async function deleteAsset(assetId: string, userId?: string): Promise<AssetOperationResult<void>> {
  if (!isFirebaseConfigured()) return { success: false, error: 'Firebase not configured' };
  
  try {
    const db = getDb();
    const docRef = doc(db, ASSETS_COLLECTION, assetId);

    if (userId) {
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists() || snapshot.data().userId !== userId) {
        throw new AssetServiceError('Permission denied', 'PERMISSION_DENIED');
      }
    }

    await updateDoc(docRef, { isDeleted: true, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (err) {
    console.error('Error deleting asset:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export function subscribeToUserAssets(
  userId: string, 
  onData: (assets: Asset[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) {
    if (onError) onError(new AssetServiceError('Firebase not configured', 'NOT_CONFIGURED'));
    return () => {};
  }
  
  const db = getDb();
  const q = query(
    collection(db, ASSETS_COLLECTION),
    where('userId', '==', userId),
    where('isDeleted', '==', false),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const assets = snapshot.docs.map(doc => deserializeAsset(doc.id, doc.data()));
    onData(assets);
  }, (error) => {
    console.error('[AssetService] Subscription error:', error);
    if (onError) onError(error);
  });
}

/**
 * Subscribe to all public assets
 */
export function subscribeToPublicAssets(
  onData: (assets: Asset[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) {
    if (onError) onError(new AssetServiceError('Firebase not configured', 'NOT_CONFIGURED'));
    return () => {};
  }
  
  const db = getDb();
  const q = query(
    collection(db, ASSETS_COLLECTION),
    where('isPublic', '==', true),
    where('isDeleted', '==', false),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const assets = snapshot.docs.map(doc => deserializeAsset(doc.id, doc.data()));
    onData(assets);
  }, (error) => {
    console.error('[AssetService] Public assets subscription error:', error);
    if (onError) onError(error);
  });
}
