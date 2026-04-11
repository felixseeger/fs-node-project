import { useState, useEffect, useCallback, useRef } from 'react';
import { Unsubscribe } from 'firebase/firestore';
import { UserProfile, UpdateProfilePayload } from '../types/user';
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  updateUserAvatar,
  subscribeToUserProfile,
} from '../services/userService';

/**
 * Hook state interface
 */
interface UseUserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook actions interface
 */
interface UseUserActions {
  updateProfile: (updates: UpdateProfilePayload) => Promise<boolean>;
  updateAvatar: (uri: string) => Promise<string | null>;
  refresh: () => Promise<void>;
  initialize: (uid: string, email: string, displayName: string) => Promise<void>;
}

/**
 * Hook return type
 */
type UseUserReturn = UseUserState & UseUserActions;

/**
 * React hook for managing user profile with Firebase
 * 
 * @param uid - The current user's UID from Firebase Auth
 * @returns User profile state and actions
 */
export function useUser(uid: string | null | undefined): UseUserReturn {
  const [state, setState] = useState<UseUserState>({
    profile: null,
    isLoading: true,
    error: null,
  });

  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const isMountedRef = useRef(true);

  /**
   * Initialize profile if it doesn't exist
   */
  const initialize = useCallback(async (userId: string, email: string, displayName: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const profile = await createUserProfile(userId, email, displayName);
      if (isMountedRef.current) {
        setState({ profile, isLoading: false, error: null });
      }
    } catch (err) {
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: err instanceof Error ? err.message : 'Failed to initialize profile' 
        }));
      }
    }
  }, []);

  /**
   * Update profile data
   */
  const updateProfile = useCallback(async (updates: UpdateProfilePayload) => {
    if (!uid) return false;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await updateUserProfile(uid, updates);
      // State will be updated via subscription
      return true;
    } catch (err) {
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: err instanceof Error ? err.message : 'Failed to update profile' 
        }));
      }
      return false;
    }
  }, [uid]);

  /**
   * Update avatar image
   */
  const updateAvatar = useCallback(async (uri: string) => {
    if (!uid) return null;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const url = await updateUserAvatar(uid, uri);
      return url;
    } catch (err) {
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: err instanceof Error ? err.message : 'Failed to update avatar' 
        }));
      }
      return null;
    }
  }, [uid]);

  /**
   * Refresh profile data manually
   */
  const refresh = useCallback(async () => {
    if (!uid) return;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const profile = await getUserProfile(uid);
      if (isMountedRef.current) {
        setState({ profile, isLoading: false, error: null });
      }
    } catch (err) {
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: err instanceof Error ? err.message : 'Failed to refresh profile' 
        }));
      }
    }
  }, [uid]);

  // Subscribe to profile changes
  useEffect(() => {
    if (!uid) {
      setState({ profile: null, isLoading: false, error: null });
      return;
    }

    // Cleanup existing subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    setState(prev => ({ ...prev, isLoading: true }));

    unsubscribeRef.current = subscribeToUserProfile(uid, (profile) => {
      if (isMountedRef.current) {
        setState({ profile, isLoading: false, error: null });
      }
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [uid]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    updateProfile,
    updateAvatar,
    refresh,
    initialize,
  };
}

export default useUser;
