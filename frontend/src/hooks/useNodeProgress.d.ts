/**
 * Types for useNodeProgress.js (JS hook consumed from TSX).
 */

export type NodeProgressStatus = 'idle' | 'running' | 'pending' | 'completed' | 'failed' | 'cancelled';

export interface UseNodeProgressState {
  progress: number;
  status: NodeProgressStatus;
  message: string;
  error: Error | null;
}

export interface UseNodeProgressOptions {
  onProgress?: (state: UseNodeProgressState) => void;
}

export interface PollWithProgressResult {
  status?: string;
  progress?: number;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export interface UseNodeProgressReturn extends UseNodeProgressState {
  start: (message?: string) => void;
  setProgress: (progress: number, message?: string) => void;
  setMessage: (message: string) => void;
  complete: (message?: string) => void;
  fail: (error?: unknown) => void;
  reset: () => void;
  pollWithProgress: <T extends PollWithProgressResult>(
    pollFn: () => Promise<T>,
    options?: {
      maxAttempts?: number;
      intervalMs?: number;
      onStatusChange?: (result: T) => void;
    }
  ) => Promise<T>;
  isActive: boolean;
  isCompleted: boolean;
  isFailed: boolean;
}

declare function useNodeProgress(options?: UseNodeProgressOptions): UseNodeProgressReturn;

export { useNodeProgress };
export default useNodeProgress;
