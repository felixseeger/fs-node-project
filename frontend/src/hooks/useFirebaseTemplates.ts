import { useState, useEffect, useCallback, useRef } from 'react';
import type { Unsubscribe } from 'firebase/firestore';
import { isFirebaseConfigured } from '../config/firebase';
import {
  createTemplate,
  getTemplate,
  updateTemplate,
  deleteTemplate,
  subscribeToUserTemplates,
} from '../services/templateService';

export function useFirebaseTemplates(userId?: string) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const isAvailable = isFirebaseConfigured();
  
  useEffect(() => {
    if (!isAvailable || !userId) return;
    
    setIsLoading(true);
    const unsubscribe = subscribeToUserTemplates(userId, (updatedTemplates) => {
      setTemplates(updatedTemplates);
      setIsLoading(false);
    });
    
    unsubscribeRef.current = unsubscribe;
    return () => unsubscribe();
  }, [userId, isAvailable]);
  
  const create = useCallback(async (template: any): Promise<any | null> => {
    if (!isAvailable || !userId) {
      setError(new Error('Firebase not configured or user not authenticated'));
      return null;
    }
    
    setIsLoading(true);
    try {
      const newTemplate = await createTemplate(userId, template);
      return newTemplate;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create template'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, isAvailable]);
  
  const remove = useCallback(async (templateId: string): Promise<void> => {
    if (!isAvailable) return;
    try {
      await deleteTemplate(templateId, userId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete template'));
    }
  }, [userId, isAvailable]);

  return {
    templates,
    isLoading,
    error,
    create,
    remove,
  };
}
