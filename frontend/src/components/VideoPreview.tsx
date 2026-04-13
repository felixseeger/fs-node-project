import React from 'react';
import type { PollingStatus } from '../hooks/useAsyncPolling';

export interface VideoPreviewProps {
  status: PollingStatus;
  progress: number;
  resultUrl: string | null;
  error: string | null;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  status,
  progress,
  resultUrl,
  error,
}) => {
  if (status === 'idle') {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-900/50 rounded-md border border-gray-700 min-h-[150px]">
        <span className="text-gray-400 text-sm">Ready</span>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-900/50 rounded-md border border-gray-700 p-4 min-h-[150px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2 max-w-[80%]">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-gray-300 text-xs mt-2">{progress}%</span>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex items-center justify-center w-full h-full bg-red-900/20 rounded-md border border-red-500 p-4 min-h-[150px]">
        <span className="text-red-400 text-sm text-center break-words">{error || 'An error occurred'}</span>
      </div>
    );
  }

  if (status === 'completed' && resultUrl) {
    return (
      <div className="w-full h-full rounded-md overflow-hidden border border-gray-700 bg-black min-h-[150px]">
        <video 
          src={resultUrl} 
          autoPlay 
          loop 
          muted 
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
        />
      </div>
    );
  }

  return null;
};
