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

const ASSETS_COLLECTION = 'assets';

function timestampToString(timestamp: Timestamp | null | undefined): string | undefined {
  if (!timestamp) return undefined;
  return timestamp.toDate().toISOString();
}

function serializeAsset(asset: any): any {
  return {
    name: asset.name || asset.label || 'New Asset',
    images: JSON.parse(JSON.stringify(asset.images || [])),
    updatedAt: serverTimestamp(),
  };
}

function deserializeAsset(id: string, data: any): any {
  return {
    ...data,
    id,
    createdAt: timestampToString(data.createdAt),
    updatedAt: timestampToString(data.updatedAt),
  };
}

export async function createAsset(userId: string, asset: any): Promise<any> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const assetsRef = collection(db, ASSETS_COLLECTION);
  
  const assetData = {
    ...serializeAsset(asset),
    userId,
    createdAt: serverTimestamp(),
    isDeleted: false,
  };

  const docRef = await Promise.race([
    addDoc(assetsRef, assetData),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore write timed out')), 10000)
    ),
  ]);

  return { ...asset, id: docRef.id };
}

export async function getAsset(assetId: string): Promise<any | null> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const docRef = doc(db, ASSETS_COLLECTION, assetId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists() || snapshot.data().isDeleted) return null;
  return deserializeAsset(snapshot.id, snapshot.data());
}

export async function updateAsset(assetId: string, updates: any, userId?: string): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const docRef = doc(db, ASSETS_COLLECTION, assetId);

  if (userId) {
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists() || snapshot.data().userId !== userId) {
      throw new Error('Permission denied');
    }
  }

  const updateData = { ...updates, updatedAt: serverTimestamp() };
  await updateDoc(docRef, updateData);
}

export async function deleteAsset(assetId: string, userId?: string): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const docRef = doc(db, ASSETS_COLLECTION, assetId);

  if (userId) {
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists() || snapshot.data().userId !== userId) {
      throw new Error('Permission denied');
    }
  }

  await updateDoc(docRef, { isDeleted: true, updatedAt: serverTimestamp() });
}

export function subscribeToUserAssets(userId: string, callback: (assets: any[]) => void): Unsubscribe {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const q = query(
    collection(db, ASSETS_COLLECTION),
    where('userId', '==', userId),
    where('isDeleted', '==', false),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const assets = snapshot.docs.map(doc => deserializeAsset(doc.id, doc.data()));
    callback(assets);
  }, (error) => {
    console.error('[AssetService] Subscription error:', error);
    callback([]);
  });
}
