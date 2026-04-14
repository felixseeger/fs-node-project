import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, getFirestore } from 'firebase/firestore';
import { isFirebaseConfigured } from '../config/firebase';

export interface RenderingJob {
  id: string;
  provider: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'paused';
  progress: number;
  resultUrl: string | null;
  error: string | null;
  createdAt: any;
  updatedAt: any;
}

export function useRenderingJobs() {
  const [jobs, setJobs] = useState<RenderingJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const db = getFirestore();
    const q = query(collection(db, 'vfx_jobs'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newJobs: RenderingJob[] = [];
        snapshot.forEach((doc) => {
          newJobs.push({ id: doc.id, ...doc.data() } as RenderingJob);
        });
        setJobs(newJobs);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching rendering jobs:', err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { jobs, isLoading, error };
}
