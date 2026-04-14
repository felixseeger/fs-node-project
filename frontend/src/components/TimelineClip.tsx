import React, { useState, useRef, useEffect } from 'react';
import { RemotionLayer } from '../types/remotion';
import { useTimeline } from '../contexts/TimelineContext';

interface TimelineClipProps {
  clip: RemotionLayer;
  trackId: string;
  durationInFrames: number;
  color: string;
  children: React.ReactNode;
}

export const TimelineClip: React.FC<TimelineClipProps> = ({ clip, trackId, durationInFrames, color, children }) => {
  const { updateClipInTrack, removeClipFromTrack, splitClip, currentTime } = useTimeline();
  const [isDragging, setIsDragging] = useState(false);
  const [isTrimmingStart, setIsTrimmingStart] = useState(false);
  const [isTrimmingEnd, setIsTrimmingEnd] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  
  const clipRef = useRef<HTMLDivElement>(null);
  const startDragPos = useRef(0);
  const startClipFrom = useRef(0);
  const startClipDuration = useRef(0);

  const left = (clip.from / durationInFrames) * 100;
  const width = (clip.durationInFrames / durationInFrames) * 100;

  // We need a parent reference to calculate pixels -> frames correctly
  const getFramesFromDeltaX = (deltaX: number) => {
    const parentWidth = clipRef.current?.parentElement?.getBoundingClientRect().width || 1;
    const deltaPercentage = deltaX / parentWidth;
    return Math.round(deltaPercentage * durationInFrames);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, action: 'drag' | 'trim-start' | 'trim-end') => {
    if (e.button === 2) return; // Ignore right click
    setShowContextMenu(false);
    
    e.stopPropagation();
    e.preventDefault();
    startDragPos.current = e.clientX;
    startClipFrom.current = clip.from;
    startClipDuration.current = clip.durationInFrames;

    if (action === 'drag') setIsDragging(true);
    if (action === 'trim-start') setIsTrimmingStart(true);
    if (action === 'trim-end') setIsTrimmingEnd(true);
    
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging && !isTrimmingStart && !isTrimmingEnd) return;
    e.stopPropagation();
    e.preventDefault();

    const deltaX = e.clientX - startDragPos.current;
    const deltaFrames = getFramesFromDeltaX(deltaX);

    if (isDragging) {
      let newFrom = startClipFrom.current + deltaFrames;
      // Clamp
      if (newFrom < 0) newFrom = 0;
      if (newFrom + clip.durationInFrames > durationInFrames) newFrom = durationInFrames - clip.durationInFrames;
      
      updateClipInTrack(trackId, clip.id, { from: newFrom });
    } 
    else if (isTrimmingStart) {
      let newFrom = startClipFrom.current + deltaFrames;
      let newDuration = startClipDuration.current - deltaFrames;
      
      // Clamp
      if (newFrom < 0) {
        newDuration -= (0 - newFrom);
        newFrom = 0;
      }
      if (newDuration < 1) {
        newFrom = startClipFrom.current + startClipDuration.current - 1;
        newDuration = 1;
      }
      
      updateClipInTrack(trackId, clip.id, { from: newFrom, durationInFrames: newDuration });
    }
    else if (isTrimmingEnd) {
      let newDuration = startClipDuration.current + deltaFrames;
      
      // Clamp
      if (newDuration < 1) newDuration = 1;
      if (clip.from + newDuration > durationInFrames) newDuration = durationInFrames - clip.from;
      
      updateClipInTrack(trackId, clip.id, { durationInFrames: newDuration });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    setIsTrimmingStart(false);
    setIsTrimmingEnd(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <>
      <div 
        ref={clipRef}
        className="absolute h-full rounded shadow-sm overflow-visible flex group"
        style={{ 
          left: `${left}%`, 
          width: `${width}%`,
          zIndex: isDragging ? 50 : 10,
          boxShadow: isDragging ? '0 0 0 2px #fff' : undefined,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onPointerDown={(e) => handlePointerDown(e, 'drag')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onContextMenu={handleContextMenu}
      >
        {/* Start Trim Handle */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-2 z-20 cursor-col-resize opacity-0 group-hover:opacity-100 hover:bg-white/30 transition-opacity bg-white/10"
          onPointerDown={(e) => handlePointerDown(e, 'trim-start')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
        
        {/* Content */}
        <div className="flex-1 w-full h-full overflow-hidden pointer-events-none relative border border-white/10 rounded" style={{ backgroundColor: color }}>
          {children}
          
          {/* Name Label */}
          <div className="absolute top-0 left-1 text-[8px] text-white/80 font-semibold truncate max-w-[80%] pt-[2px] drop-shadow-md">
            {clip.type}
          </div>
        </div>

        {/* End Trim Handle */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-2 z-20 cursor-col-resize opacity-0 group-hover:opacity-100 hover:bg-white/30 transition-opacity bg-white/10"
          onPointerDown={(e) => handlePointerDown(e, 'trim-end')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>

      {showContextMenu && (
        <div 
          className="fixed bg-[#2a2a2a] border border-[#444] rounded shadow-lg py-1 z-[1000] min-w-[120px] text-sm text-gray-300"
          style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button 
            className="w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-300"
            disabled={currentTime <= clip.from || currentTime >= clip.from + clip.durationInFrames}
            onClick={() => {
              splitClip(trackId, clip.id, currentTime);
              setShowContextMenu(false);
            }}
          >
            Split at Playhead
          </button>
          <button 
            className="w-full text-left px-3 py-1 hover:bg-red-500 hover:text-white mt-1 border-t border-[#444]"
            onClick={() => {
              removeClipFromTrack(trackId, clip.id);
              setShowContextMenu(false);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
};
