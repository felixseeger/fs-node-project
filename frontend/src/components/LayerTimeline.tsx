import React, { useState, useEffect } from 'react';

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

  // Simple SVG generation for the waveform
  const svgPoints = peaks.map((p, i) => {
    const x = (i / peaks.length) * 100;
    const y = 50 + (p * 50);
    return `${x}%,${y}%`;
  }).join(' ');

  return (
    <div className="h-full w-full rounded opacity-80 flex items-center justify-center overflow-hidden" style={{ backgroundColor: `${color}40` }}>
      <svg width="100%" height="100%" preserveAspectRatio="none" className="opacity-60">
        <path 
          d={`M 0,50 L ${peaks.map((p, i) => `${(i / peaks.length) * 100},${50 + (p * 45)}`).join(' L ')}`} 
          fill="none" 
          stroke={color} 
          strokeWidth="2" 
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

interface LayerTimelineProps {
  layers: TimelineLayer[];
  durationInFrames: number;
  currentFrame: number;
  onSeek?: (frame: number) => void;
}

export const LayerTimeline: React.FC<LayerTimelineProps> = ({
  layers,
  durationInFrames,
  currentFrame,
  onSeek,
}) => {
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const frame = Math.round(percentage * durationInFrames);
    onSeek(frame);
  };

  return (
    <div className="flex flex-col w-full bg-[#1a1a1a] rounded-md border border-[#333] p-2 gap-2">
      {/* Scrubber Area */}
      <div 
        className="relative h-6 bg-[#222] rounded cursor-pointer overflow-hidden"
        onClick={handleTimelineClick}
      >
        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10"
          style={{ left: `${(currentFrame / durationInFrames) * 100}%` }}
        >
          <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full" />
        </div>
        
        {/* Frame markers (optional, simple representation) */}
        <div className="absolute bottom-0 w-full flex justify-between px-1 text-[8px] text-gray-500">
          <span>0</span>
          <span>{durationInFrames}</span>
        </div>
      </div>

      {/* Layers */}
      <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
        {layers.map((layer) => {
          const left = (layer.from / durationInFrames) * 100;
          const width = (layer.durationInFrames / durationInFrames) * 100;
          
          return (
            <div key={layer.id} className="relative h-6 bg-[#222] rounded flex items-center px-2">
              <span className="text-xs text-gray-400 w-20 truncate z-10">{layer.name}</span>
              <div className="absolute left-24 right-2 h-full py-1">
                <div 
                  style={{ 
                    marginLeft: `${left}%`, 
                    width: `${width}%`,
                    height: '100%',
                    position: 'relative'
                  }}
                >
                  {layer.type === 'audio' && layer.src ? (
                    <AudioWaveform src={layer.src} color={layer.color || '#a855f7'} />
                  ) : (
                    <div 
                      className="h-full rounded opacity-80"
                      style={{ backgroundColor: layer.color || '#3b82f6' }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {layers.length === 0 && (
          <div className="text-xs text-gray-500 text-center py-2">No layers</div>
        )}
      </div>
    </div>
  );
};
