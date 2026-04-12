/**
 * useFirebaseAssets Hook - Hardened React hook for asset management
 * 
 * Features:
 * - Strict Asset type safety
 * - Proper error handling with typed errors
 * - Loading state management
 * - Subscription cleanup
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { type Unsubscribe } from 'firebase/firestore';
import {
  type Asset,
  type CreateAssetPayload,
  type UpdateAssetPayload,
  type AssetOperationResult,
  isAsset,
} from '../types/asset';
import {
  createAsset as createAssetService,
  deleteAsset as deleteAssetService,
  updateAsset as updateAssetService,
  subscribeToUserAssets,
  subscribeToPublicAssets,
  toggleAssetPublic as toggleAssetPublicService,
  AssetServiceError,
} from '../services/assetService';

/**
 * Hook state interface
 */
interface UseFirebaseAssetsState {
  assets: Asset[];
  publicAssets: Asset[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook actions interface
 */
interface UseFirebaseAssetsActions {
  /** Create a new asset */
  create: (payload: CreateAssetPayload) => Promise<AssetOperationResult<Asset>>;
  /** Update an existing asset */
  update: (assetId: string, updates: UpdateAssetPayload) => Promise<AssetOperationResult<void>>;
  /** Toggle asset public visibility */
  togglePublic: (assetId: string, isPublic: boolean) => Promise<AssetOperationResult<void>>;
  /** Delete (soft-delete) an asset */
  remove: (assetId: string) => Promise<AssetOperationResult<void>>;
  /** Clear any error state */
  clearError: () => void;
  /** Manually refresh assets */
  refresh: () => void;
}

/**
 * Hook return type
 */
type UseFirebaseAssetsReturn = UseFirebaseAssetsState & UseFirebaseAssetsActions;

/**
 * React hook for managing user assets with Firebase
 * 
 * @param userId - The current user's ID
 * @returns Asset state and actions
 */
export function useFirebaseAssets(userId: string | null | undefined): UseFirebaseAssetsReturn {
  // State
  const [state, setState] = useState<UseFirebaseAssetsState>({
    assets: [],
    publicAssets: [],
    isLoading: true,
    error: null,
  });

  // Track refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Refs for cleanup
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const publicUnsubscribeRef = useRef<Unsubscribe | null>(null);
  const isMountedRef = useRef(true);
  const userIdRef = useRef(userId);

  // Update userId ref
  userIdRef.current = userId;

  // Subscribe to all public assets
  useEffect(() => {
    if (publicUnsubscribeRef.current) {
      publicUnsubscribeRef.current();
    }

    publicUnsubscribeRef.current = subscribeToPublicAssets((assets) => {
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          publicAssets: assets.filter(isAsset),
        }));
      }
    });

    return () => {
      if (publicUnsubscribeRef.current) {
        publicUnsubscribeRef.current();
        publicUnsubscribeRef.current = null;
      }
    };
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Trigger manual refresh
   */
  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  /**
   * Create a new asset
   */
  const create = useCallback(async (
    payload: CreateAssetPayload
  ): Promise<AssetOperationResult<Asset>> => {
    if (!userIdRef.current) {
      return {
        success: false,
        error: 'User must be authenticated',
      };
    }

    // Set loading state
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await createAssetService(userIdRef.current, payload);
      
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, isLoading: false }));
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create asset';
      
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  /**
   * Update an existing asset
   */
  const update = useCallback(async (
    assetId: string,
    updates: UpdateAssetPayload
  ): Promise<AssetOperationResult<void>> => {
    if (!userIdRef.current) {
      return {
        success: false,
        error: 'User must be authenticated',
      };
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await updateAssetService(assetId, updates, userIdRef.current);
      
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, isLoading: false }));
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update asset';
      
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  /**
   * Toggle asset public visibility
   */
  const togglePublic = useCallback(async (
    assetId: string,
    isPublic: boolean
  ): Promise<AssetOperationResult<void>> => {
    if (!userIdRef.current) {
      return {
        success: false,
        error: 'User must be authenticated',
      };
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await toggleAssetPublicService(assetId, isPublic, userIdRef.current);
      
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, isLoading: false }));
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change asset visibility';
      
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  /**
   * Delete (soft-delete) an asset
   */
  const remove = useCallback(async (
    assetId: string
  ): Promise<AssetOperationResult<void>> => {
    if (!userIdRef.current) {
      return {
        success: false,
        error: 'User must be authenticated',
      };
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await deleteAssetService(assetId, userIdRef.current);
      
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, isLoading: false }));
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete asset';
      
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  // Subscribe to assets
  useEffect(() => {
    // Reset state when userId changes
    setState(prev => ({
      ...prev,
      assets: [],
      isLoading: true,
      error: null,
    }));

    if (!userId) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Clean up any existing subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    // Subscribe to user's assets
    unsubscribeRef.current = subscribeToUserAssets(
      userId,
      (assets) => {
        if (isMountedRef.current) {
          // Validate assets before setting state
          const validAssets = assets.filter(asset => {
            if (!isAsset(asset)) {
              console.warn('[useFirebaseAssets] Invalid asset received:', asset);
              return false;
            }
            return true;
          });
          
          setState(prev => ({
            ...prev,
            assets: validAssets,
            isLoading: false,
            error: null,
          }));
        }
      },
      (error) => {
        if (isMountedRef.current) {
          const errorMessage = error instanceof AssetServiceError 
            ? error.message 
            : 'Failed to load assets';
            
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
          }));
        }
      }
    );

    // Cleanup
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [userId, refreshKey]);

  // Track mounted state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    create,
    update,
    togglePublic,
    remove,
    clearError,
    refresh,
  };
}

export default useFirebaseAssets;
