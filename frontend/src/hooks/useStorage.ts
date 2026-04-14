import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export interface StorageUsage {
  count: number;
  totalBytes: number;
  limitCount: number;
  limitBytes: number;
}

export function useStorage() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<StorageUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limitOpen, setLimitOpen] = useState(false);

  const fetchStorage = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await user.getIdToken();
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/storage/usage`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch storage usage');
      const data = await res.json();
      setUsage(data.usage);
    } catch (err: any) {
      console.error('[useStorage] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorage();
    
    // Listen for storage limit event
    const handleStorageLimit = () => {
      setLimitOpen(true);
    };
    window.addEventListener('storage_limit_reached', handleStorageLimit);
    
    return () => {
      window.removeEventListener('storage_limit_reached', handleStorageLimit);
    };
  }, [user]);

  return { usage, loading, error, limitOpen, setLimitOpen, refreshStorage: fetchStorage };
}
