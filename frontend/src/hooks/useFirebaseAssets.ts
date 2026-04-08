import { useState, useEffect, useCallback, useRef } from 'react';
import type { Unsubscribe } from 'firebase/firestore';
import { isFirebaseConfigured } from '../config/firebase';
import {
  createAsset,
  deleteAsset,
  subscribeToUserAssets,
} from '../services/assetService';

export function useFirebaseAssets(userId?: string) {
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const isAvailable = isFirebaseConfigured();
  
  useEffect(() => {
    if (!isAvailable || !userId) return;
    
    setIsLoading(true);
    const unsubscribe = subscribeToUserAssets(userId, (updatedAssets) => {
      setAssets(updatedAssets);
      setIsLoading(false);
    });
    
    unsubscribeRef.current = unsubscribe;
    return () => unsubscribe();
  }, [userId, isAvailable]);
  
  const create = useCallback(async (asset: any): Promise<any | null> => {
    if (!isAvailable || !userId) {
      setError(new Error('Firebase not configured or user not authenticated'));
      return null;
    }
    
    setIsLoading(true);
    try {
      const newAsset = await createAsset(userId, asset);
      return newAsset;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create asset'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, isAvailable]);
  
  const remove = useCallback(async (assetId: string): Promise<void> => {
    if (!isAvailable) return;
    try {
      await deleteAsset(assetId, userId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete asset'));
    }
  }, [userId, isAvailable]);

  return {
    assets,
    isLoading,
    error,
    create,
    remove,
  };
}
