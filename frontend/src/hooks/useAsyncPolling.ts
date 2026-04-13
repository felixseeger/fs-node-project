import { useState, useRef, useCallback, useEffect } from 'react';

export type PollingStatus = 'idle' | 'loading' | 'completed' | 'failed';

export interface UseAsyncPollingReturn {
  status: PollingStatus;
  progress: number;
  resultUrl: string | null;
  error: string | null;
  execute: (payload: Record<string, unknown>) => Promise<void>;
  reset: () => void;
}

export function useAsyncPolling(submitUrl: string, pollUrlTemplate: string): UseAsyncPollingReturn {
  const [status, setStatus] = useState<PollingStatus>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const intervalRef = useRef<number | null>(null);

  const clearPolling = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearPolling();
  }, [clearPolling]);

  const reset = useCallback(() => {
    clearPolling();
    setStatus('idle');
    setProgress(0);
    setResultUrl(null);
    setError(null);
  }, [clearPolling]);

  const execute = useCallback(async (payload: Record<string, unknown>) => {
    reset();
    setStatus('loading');
    setProgress(0);

    try {
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Submit failed: ${response.statusText}`);
      }

      const data = await response.json();
      const jobId = data.jobId || data.id;

      if (!jobId) {
        throw new Error('No jobId returned from submit endpoint');
      }

      const pollUrl = pollUrlTemplate.replace(':id', jobId);

      intervalRef.current = window.setInterval(async () => {
        try {
          const pollResponse = await fetch(pollUrl);
          if (!pollResponse.ok) {
            throw new Error(`Poll failed: ${pollResponse.statusText}`);
          }

          const pollData = await pollResponse.json();
          
          if (typeof pollData.progress === 'number') {
            setProgress(pollData.progress);
          }

          if (pollData.status === 'completed') {
            clearPolling();
            setResultUrl(pollData.resultUrl || pollData.url || pollData.output || null);
            setStatus('completed');
            setProgress(100);
          } else if (pollData.status === 'failed') {
            clearPolling();
            setError(pollData.error || 'Job failed');
            setStatus('failed');
          }
        } catch (err) {
          clearPolling();
          setError(err instanceof Error ? err.message : String(err));
          setStatus('failed');
        }
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('failed');
    }
  }, [submitUrl, pollUrlTemplate, reset, clearPolling]);

  return {
    status,
    progress,
    resultUrl,
    error,
    execute,
    reset
  };
}
