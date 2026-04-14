import React, { useState, useRef } from 'react';
import { RemotionLayer, Keyframe } from '../types/remotion';
import { useTimeline } from '../contexts/TimelineContext';

interface KeyframePointProps {
  keyframe: Keyframe;
  index: number;
  property: string;
  clip: RemotionLayer;
  trackId: string;
  onRemove: () => void;
}

const KeyframePoint: React.FC<KeyframePointProps> = ({
  keyframe,
  index,
  property,
  clip,
  trackId,
  onRemove,
}) => {
  const { updateClipInTrack } = useTimeline();
  const [isDragging, setIsDragging] = useState(false);
  const pointRef = useRef<HTMLDivElement>(null);
  const startDragPos = useRef(0);
  const startTime = useRef(0);
  const startValue = useRef(0);

  const left = (keyframe.time / clip.durationInFrames) * 100;
  // Normalize value for display (assuming 0-1 for opacity/scale for now, 0-100% height)
  let normalizedValue = keyframe.value;
  if (property === 'opacity') {
    normalizedValue = Math.max(0, Math.min(1, keyframe.value));
  } else if (property === 'scale') {
    normalizedValue = Math.max(0, Math.min(2, keyframe.value)) / 2; // Normalize 0-2 scale to 0-1
  } else if (property === 'x' || property === 'y') {
    normalizedValue = (keyframe.value + 512) / 1024; // Normalize -512 to 512 to 0-1
  }

  const bottom = normalizedValue * 100;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (e.button === 2 || e.shiftKey || e.metaKey) {
      // Right click or shift-click to remove
      onRemove();
      return;
    }

    startDragPos.current = e.clientX;
    startTime.current = keyframe.time;
    startValue.current = keyframe.value;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const getFramesFromDeltaX = (deltaX: number) => {
    const parentWidth = pointRef.current?.parentElement?.getBoundingClientRect().width || 1;
    const deltaPercentage = deltaX / parentWidth;
    return Math.round(deltaPercentage * clip.durationInFrames);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.stopPropagation();
    e.preventDefault();

    const deltaX = e.clientX - startDragPos.current;
    const deltaFrames = getFramesFromDeltaX(deltaX);

    let newTime = startTime.current + deltaFrames;
    if (newTime < 0) newTime = 0;
    if (newTime > clip.durationInFrames) newTime = clip.durationInFrames;

    // Simple Y drag (value change)
    // This is a simplification; a robust implementation needs Y-axis normalization
    const rect = pointRef.current?.parentElement?.getBoundingClientRect();
    if (rect) {
       const yPos = e.clientY - rect.top;
       let newValuePercent = 1 - (yPos / rect.height);
       newValuePercent = Math.max(0, Math.min(1, newValuePercent));
       
       let newValue = newValuePercent;
       if (property === 'scale') newValue = newValuePercent * 2;
       if (property === 'x' || property === 'y') newValue = (newValuePercent * 1024) - 512;

       // Update keyframe
       const currentKeyframes = clip.keyframes?.[property] ? [...clip.keyframes[property]] : [];
       currentKeyframes[index] = { ...currentKeyframes[index], time: newTime, value: newValue };
       
       // Sort by time to keep them in order
       currentKeyframes.sort((a, b) => a.time - b.time);

       updateClipInTrack(trackId, clip.id, { 
         keyframes: { ...(clip.keyframes || {}), [property]: currentKeyframes } 
       });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={pointRef}
      className={`absolute w-2.5 h-2.5 rounded-full -ml-[5px] -mb-[5px] transform cursor-pointer ${
        isDragging ? 'bg-white scale-125 z-50' : 'bg-blue-400 hover:bg-blue-300 z-40'
      }`}
      style={{ left: `${left}%`, bottom: `${bottom}%`, transition: isDragging ? 'none' : 'transform 0.1s' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={(e) => { e.preventDefault(); onRemove(); }}
      title={`Time: ${keyframe.time}, Value: ${Number(keyframe.value).toFixed(2)}`}
    />
  );
};

interface KeyframeLaneProps {
  clip: RemotionLayer;
  trackId: string;
  durationInFrames: number;
}

export const KeyframeLane: React.FC<KeyframeLaneProps> = ({ clip, trackId }) => {
  const { updateClipInTrack } = useTimeline();
  const [activeProperty, setActiveProperty] = useState<string>('opacity');

  const properties = ['opacity', 'scale', 'x', 'y'];
  const keyframes = clip.keyframes?.[activeProperty] || [];

  const handleAddKeyframe = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only add if clicking the background, not an existing point
    if (e.target !== e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const time = Math.round(percentage * clip.durationInFrames);

    const y = e.clientY - rect.top;
    let newValuePercent = 1 - (y / rect.height);
    newValuePercent = Math.max(0, Math.min(1, newValuePercent));
    
    let newValue = newValuePercent;
    if (activeProperty === 'scale') newValue = newValuePercent * 2;
    if (activeProperty === 'x' || activeProperty === 'y') newValue = (newValuePercent * 1024) - 512;

    const currentKeyframes = clip.keyframes?.[activeProperty] ? [...clip.keyframes[activeProperty]] : [];
    
    // Check if keyframe exists at this time, if so update it, otherwise add new
    const existingIndex = currentKeyframes.findIndex(kf => Math.abs(kf.time - time) < 2); // 2 frame tolerance
    
    if (existingIndex >= 0) {
      currentKeyframes[existingIndex] = { ...currentKeyframes[existingIndex], value: newValue };
    } else {
      currentKeyframes.push({ time, value: newValue, easing: 'easeInOut' });
      currentKeyframes.sort((a, b) => a.time - b.time);
    }

    updateClipInTrack(trackId, clip.id, { 
      keyframes: { ...(clip.keyframes || {}), [activeProperty]: currentKeyframes } 
    });
  };

  const handleRemoveKeyframe = (index: number) => {
    const currentKeyframes = clip.keyframes?.[activeProperty] ? [...clip.keyframes[activeProperty]] : [];
    currentKeyframes.splice(index, 1);
    updateClipInTrack(trackId, clip.id, { 
      keyframes: { ...(clip.keyframes || {}), [activeProperty]: currentKeyframes } 
    });
  };

  return (
    <div className="w-full flex flex-col gap-1 mt-1 bg-[#111] p-1 rounded border border-[#222]">
      <div className="flex gap-2 px-1">
        {properties.map(prop => (
          <button
            key={prop}
            onClick={(e) => { e.stopPropagation(); setActiveProperty(prop); }}
            className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${
              activeProperty === prop ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {prop}
          </button>
        ))}
      </div>
      <div 
        className="relative h-12 w-full bg-[#1a1a1a] rounded cursor-crosshair group overflow-hidden border border-[#333]/50"
        onDoubleClick={handleAddKeyframe}
        title="Double click to add keyframe"
      >
        {/* Draw lines between points */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
          <path
            d={keyframes.map((kf, i) => {
              const x = (kf.time / clip.durationInFrames) * 100;
              let norm = kf.value;
              if (activeProperty === 'opacity') norm = Math.max(0, Math.min(1, kf.value));
              else if (activeProperty === 'scale') norm = Math.max(0, Math.min(2, kf.value)) / 2;
              else if (activeProperty === 'x' || activeProperty === 'y') norm = (kf.value + 512) / 1024;
              
              const y = 100 - (norm * 100);
              return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
            }).join(' ')}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {keyframes.map((kf, i) => (
          <KeyframePoint
            key={`${kf.time}-${i}`}
            keyframe={kf}
            index={i}
            property={activeProperty}
            clip={clip}
            trackId={trackId}
            onRemove={() => handleRemoveKeyframe(i)}
          />
        ))}
        {keyframes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-600 pointer-events-none">
            Double-click to add keyframes
          </div>
        )}
      </div>
    </div>
  );
};
