const fs = require('fs');

const contextPath = 'frontend/src/contexts/TimelineContext.tsx';
// We already wrote TimelineContext.tsx, but let's make sure it has what we need.

const timelineComponent = `import React, { useState, useEffect, useRef } from 'react';
import { Track } from '../contexts/TimelineContext';

export interface TimelineLayer {
  id: string;
  name: string;
  from: number;
  durationInFrames: number;
  color?: string;
  type?: string;
  src?: string;
}

const AudioWaveform = ({ src, color }: { src: string, color: string }) => {
  const [peaks, setPeaks] = useState<number[]>([]);
  
  useEffect(() => {
    if (!src) return;
    fetch('/api/audio/waveform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: src })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.peaks) {
        setPeaks(data.peaks);
      }
    })
    .catch(err => console.error('Failed to fetch waveform:', err));
  }, [src]);

  if (!peaks.length) {
    return <div className="h-full w-full rounded opacity-80" style={{ backgroundColor: color }} />;
  }

  return (
    <div className="h-full w-full rounded opacity-80 flex items-center justify-center overflow-hidden" style={{ backgroundColor: \`\${color}40\` }}>
      <svg width="100%" height="100%" preserveAspectRatio="none" className="opacity-60">
        <path 
          d={\`M 0,50 L \${peaks.map((p, i) => \`\${(i / peaks.length) * 100},\${50 + (p * 45)}\`).join(' L ')}\`} 
          fill="none" 
          stroke={color} 
          strokeWidth="2" 
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

const TimecodeDisplay = ({ frame, fps }: { frame: number, fps: number }) => {
  const totalSeconds = Math.floor(frame / fps);
  const frames = String(frame % fps).padStart(2, '0');
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');

  return (
    <div className="font-mono text-xs bg-black text-green-400 px-2 py-1 rounded border border-[#333]">
      {hours}:{minutes}:{seconds}:{frames}
    </div>
  );
};

interface LayerTimelineProps {
  tracks: Track[];
  durationInFrames: number;
  currentFrame: number;
  onSeek?: (frame: number) => void;
  fps?: number;
}

export const LayerTimeline: React.FC<LayerTimelineProps> = ({
  tracks,
  durationInFrames,
  currentFrame,
  onSeek,
  fps = 30
}) => {
  const scrubberRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSeek = (clientX: number) => {
    if (!onSeek || !scrubberRef.current) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const frame = Math.round(percentage * durationInFrames);
    onSeek(frame);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeek(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleSeek(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="flex flex-col w-full bg-[#1a1a1a] rounded-md border border-[#333] p-2 gap-2 select-none">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Tracks</span>
        <TimecodeDisplay frame={currentFrame} fps={fps} />
      </div>

      {/* Scrubber Area */}
      <div 
        ref={scrubberRef}
        className="relative h-6 bg-[#222] rounded cursor-pointer overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-20 pointer-events-none"
          style={{ left: \`\${(currentFrame / durationInFrames) * 100}%\` }}
        >
          <div className="absolute -top-1 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_4px_rgba(59,130,246,0.8)]" />
        </div>
        
        {/* Frame markers */}
        <div className="absolute bottom-0 w-full flex justify-between px-1 text-[8px] text-gray-500 pointer-events-none">
          <span>0</span>
          <span>{durationInFrames}</span>
        </div>
      </div>

      {/* Tracks */}
      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
        {tracks.map((track) => (
          <div key={track.id} className="relative h-10 bg-[#222] rounded flex items-center border-l-2 border-[#444]">
            <div className="w-24 px-2 shrink-0 border-r border-[#333] h-full flex flex-col justify-center">
              <span className="text-xs font-medium text-gray-300 truncate w-full block">{track.name}</span>
              <span className="text-[9px] text-gray-500 uppercase">{track.type}</span>
            </div>
            
            <div className="relative flex-1 h-full py-1 pr-2">
              {track.clips.map(clip => {
                const left = (clip.from / durationInFrames) * 100;
                const width = (clip.durationInFrames / durationInFrames) * 100;
                
                let color = '#3b82f6';
                if (clip.type === 'video') color = '#14b8a6';
                else if (clip.type === 'image') color = '#ec4899';
                else if (clip.type === 'audio') color = '#a855f7';
                else if (clip.type === 'text') color = '#f97316';

                return (
                  <div 
                    key={clip.id}
                    className="absolute h-full rounded shadow-sm overflow-hidden"
                    style={{ 
                      left: \`\${left}%\`, 
                      width: \`\${width}%\`,
                    }}
                  >
                    {clip.type === 'audio' && clip.src ? (
                      <AudioWaveform src={clip.src} color={color} />
                    ) : (
                      <div 
                        className="h-full w-full opacity-80 border border-white/10"
                        style={{ backgroundColor: color }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {tracks.length === 0 && (
          <div className="text-xs text-gray-500 text-center py-4 italic">No tracks added</div>
        )}
      </div>
    </div>
  );
};
`;

fs.writeFileSync('frontend/src/components/LayerTimeline.tsx', timelineComponent);
console.log('Updated LayerTimeline.tsx');
