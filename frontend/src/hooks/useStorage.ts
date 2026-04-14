import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '../config/firebase';

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
      
      if (isFirebaseConfigured()) {
        const db = getDb();
        const assetsQuery = query(
          collection(db, 'assets'),
          where('userId', '==', user.uid),
          where('isDeleted', '==', false)
        );
        
        const snapshot = await getDocs(assetsQuery);
        
        let totalBytes = 0;
        const count = snapshot.size;
        
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.mediaItems && Array.isArray(data.mediaItems)) {
            data.mediaItems.forEach((item: any) => {
              if (item.size) totalBytes += item.size;
            });
          }
        });
        
        setUsage({
          count,
          totalBytes,
          limitCount: 100,
          limitBytes: 1000000000 // 1GB
        });
      } else {
        // Fallback for local testing without Firebase
        setUsage({
          count: 0,
          totalBytes: 0,
          limitCount: 100,
          limitBytes: 1000000000
        });
      }
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
