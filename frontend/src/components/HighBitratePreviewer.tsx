import React, { useState, useRef, useEffect } from 'react';

export interface HighBitratePreviewerProps {
  url: string;
  onClose: () => void;
}

export function HighBitratePreviewer({ url, onClose }: HighBitratePreviewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Defaulting to 30fps for stepping
  const fps = 30;
  const frameTime = 1 / fps;

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const stepFrame = (forward: boolean) => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      const newTime = videoRef.current.currentTime + (forward ? frameTime : -frameTime);
      videoRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const updateTime = () => setCurrentTime(vid.currentTime);
    const updateDuration = () => setDuration(vid.duration);
    
    vid.addEventListener('timeupdate', updateTime);
    vid.addEventListener('loadedmetadata', updateDuration);
    
    return () => {
      vid.removeEventListener('timeupdate', updateTime);
      vid.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="absolute top-4 right-4 z-10 flex gap-4">
         <button onClick={onClose} className="p-2.5 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors shadow-lg">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
         </button>
      </div>
      <div className="w-full h-full max-w-[90vw] max-h-[90vh] flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
         {/* Video Area */}
         <div className="relative flex-1 bg-black flex items-center justify-center min-h-0">
            <video 
               ref={videoRef} 
               src={url} 
               className="max-w-full max-h-full object-contain" 
               playsInline 
            />
         </div>
         {/* Controls */}
         <div className="p-5 bg-gray-900 border-t border-gray-800 flex flex-col gap-5 shrink-0">
            <div className="flex items-center gap-4 w-full">
               <span className="text-xs text-gray-400 font-mono w-12 text-right">{currentTime.toFixed(2)}s</span>
               <input 
                 type="range" 
                 min={0} max={duration || 100} 
                 step={frameTime} 
                 value={currentTime} 
                 onChange={handleSeek}
                 className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
               />
               <span className="text-xs text-gray-400 font-mono w-12 text-left">{duration.toFixed(2)}s</span>
            </div>
            
            <div className="flex items-center justify-center gap-8">
               <button 
                  onClick={() => stepFrame(false)} 
                  className="p-2 text-gray-300 hover:text-white transition-colors" 
                  title="Previous Frame"
               >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
               </button>
               <button 
                  onClick={handlePlayPause} 
                  className="w-14 h-14 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded-full text-white shadow-lg transition-transform active:scale-95"
               >
                  {isPlaying ? (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" /></svg>
                  ) : (
                    <svg className="w-7 h-7 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                  )}
               </button>
               <button 
                  onClick={() => stepFrame(true)} 
                  className="p-2 text-gray-300 hover:text-white transition-colors" 
                  title="Next Frame"
               >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
